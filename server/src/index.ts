import "dotenv/config";
import cors from "cors";
import express from "express";
import { db } from "./db.js";
import { generatePersonalizedAnalysis } from "./llm.js";

const PORT = Number(process.env.PORT ?? 8788);
const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

async function getOrCreatePiloto(nombre: string) {
  // SQLite + Prisma no soporta comparación case-insensitive nativa
  // ("Guty" vs "guty" no deben crear dos pilotos distintos), así que
  // se compara en JS. La organización es pequeña, así que traer todos
  // los pilotos es barato.
  const candidates = await db.piloto.findMany();
  const match = candidates.find((p) => p.nombre.toLowerCase() === nombre.toLowerCase());
  if (match) return match;

  return db.piloto.create({ data: { nombre } });
}

app.post("/api/resultados", async (req, res) => {
  const {
    nombre,
    puntuacionAire,
    puntuacionAgua,
    puntuacionTierra,
    puntuacionFuego,
    respuestaDudosa,
    respuestasCrudas,
    dominant,
    secondary,
    analisisBase,
    respuestasLegibles,
  } = req.body ?? {};

  if (
    typeof nombre !== "string" ||
    !nombre.trim() ||
    [puntuacionAire, puntuacionAgua, puntuacionTierra, puntuacionFuego].some((v) => typeof v !== "number")
  ) {
    return res.status(400).json({ error: "datos incompletos" });
  }

  try {
    const piloto = await getOrCreatePiloto(nombre.trim());

    // Se genera antes de guardar (no bloquea el guardado si falla) para
    // devolver todo en una sola respuesta y que el frontend no tenga que
    // volver a pedir el resultado para ver el análisis personalizado.
    let analisisPersonalizado: string | null = null;
    if (dominant && secondary && Array.isArray(respuestasLegibles)) {
      analisisPersonalizado = await generatePersonalizedAnalysis({
        nombre: nombre.trim(),
        percentages: { aire: puntuacionAire, agua: puntuacionAgua, tierra: puntuacionTierra, fuego: puntuacionFuego },
        dominant,
        secondary,
        analisisBase: analisisBase ?? null,
        respuestasLegibles,
      });
    }

    const resultado = await db.resultado.create({
      data: {
        pilotoId: piloto.id,
        puntuacionAire,
        puntuacionAgua,
        puntuacionTierra,
        puntuacionFuego,
        respuestaDudosa: Boolean(respuestaDudosa),
        respuestasCrudas: JSON.stringify(respuestasCrudas ?? {}),
        analisisPersonalizado,
      },
    });
    res.status(201).json({ piloto, resultado });
  } catch (err) {
    console.error("Error al guardar resultado:", err);
    res.status(500).json({ error: "no se pudo guardar el resultado" });
  }
});

app.get("/api/pilotos", async (_req, res) => {
  const pilotos = await db.piloto.findMany({
    orderBy: { nombre: "asc" },
    include: { resultados: { orderBy: { fecha: "desc" }, take: 1 } },
  });

  res.json(
    pilotos.map((p) => ({
      id: p.id,
      nombre: p.nombre,
      org: p.org,
      fechaAlta: p.fechaAlta,
      ultimoResultado: p.resultados[0] ?? null,
    }))
  );
});

app.get("/api/pilotos/:id", async (req, res) => {
  const piloto = await db.piloto.findUnique({
    where: { id: req.params.id },
    include: { resultados: { orderBy: { fecha: "desc" } } },
  });

  if (!piloto) return res.status(404).json({ error: "piloto no encontrado" });
  res.json(piloto);
});

app.listen(PORT, () => {
  console.log(`pilot-psych-api escuchando en :${PORT}`);
});
