import "dotenv/config";
import cors from "cors";
import express from "express";
import { db } from "./db.js";

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
    const resultado = await db.resultado.create({
      data: {
        pilotoId: piloto.id,
        puntuacionAire,
        puntuacionAgua,
        puntuacionTierra,
        puntuacionFuego,
        respuestaDudosa: Boolean(respuestaDudosa),
        respuestasCrudas: JSON.stringify(respuestasCrudas ?? {}),
      },
    });
    res.status(201).json({ piloto, resultado });
  } catch (err) {
    console.error("Error al guardar resultado:", err);
    res.status(500).json({ error: "no se pudo guardar el resultado" });
  }
});

app.listen(PORT, () => {
  console.log(`pilot-psych-api escuchando en :${PORT}`);
});
