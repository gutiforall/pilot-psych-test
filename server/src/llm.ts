import OpenAI from "openai";

const MODEL = "gpt-4.1-mini";
const TIMEOUT_MS = 15_000;

const client = process.env.OPENAI_API_KEY ? new OpenAI({ timeout: TIMEOUT_MS }) : null;

const ELEMENT_DEFINITIONS = `
- Aire — Control del ritmo: movimiento, imprevisibilidad, manipulación de la atención y desorganización.
- Agua — Adaptación: lectura de oportunidades y respuesta al estado cambiante de la pelea.
- Tierra — Dominio del intercambio: estabilidad, control de la burbuja, evasión eficiente y carrera de daño.
- Fuego — Iniciativa y presión: agresividad, explosividad y creación de oportunidades mediante presión.
`.trim();

interface AnalisisBase {
  descripcion: string;
  fortaleza: string;
  debilidad: string;
  rolNatural: string;
}

interface RespuestaLegible {
  pregunta: string;
  opciones: { letra: string; texto: string; elemento: string | null; puntuacion: number }[];
}

interface PersonalizedAnalysisInput {
  nombre: string;
  percentages: { aire: number; agua: number; tierra: number; fuego: number };
  dominant: string;
  secondary: string;
  analisisBase: AnalisisBase | null;
  respuestasLegibles: RespuestaLegible[];
}

export async function generatePersonalizedAnalysis(input: PersonalizedAnalysisInput): Promise<string | null> {
  if (!client) return null;

  const prompt = buildPrompt(input);

  try {
    const response = await client.chat.completions.create({
      model: MODEL,
      max_tokens: 400,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.choices[0]?.message?.content;
    return text ? text.trim() : null;
  } catch (err) {
    console.error("Error generando análisis personalizado con GPT:", err);
    return null;
  }
}

function buildPrompt(input: PersonalizedAnalysisInput): string {
  const { nombre, percentages, dominant, secondary, analisisBase, respuestasLegibles } = input;

  const respuestasTexto = respuestasLegibles
    .map((q) => {
      const opciones = q.opciones
        .map((o) => `  ${o.letra} (${o.elemento ?? "control"}, puntuada ${o.puntuacion}/5): ${o.texto}`)
        .join("\n");
      return `${q.pregunta}\n${opciones}`;
    })
    .join("\n\n");

  return `Eres quien redacta el análisis de perfil táctico de un test de personalidad para pilotos de una organización de Star Citizen (APEX SYNDICATE). El test mide 4 elementos:

${ELEMENT_DEFINITIONS}

Piloto: ${nombre}
Porcentajes: Aire ${percentages.aire.toFixed(1)}% · Agua ${percentages.agua.toFixed(1)}% · Tierra ${percentages.tierra.toFixed(1)}% · Fuego ${percentages.fuego.toFixed(1)}%
Dominante: ${dominant} · Secundario: ${secondary}

${analisisBase ? `Texto base genérico para esta combinación (dominante→secundario):\n"${analisisBase.descripcion}" Fortaleza: "${analisisBase.fortaleza}" Debilidad: "${analisisBase.debilidad}"` : "No hay texto base para esta combinación (perfil empatado)."}

Respuestas completas del piloto (pregunta, opción, elemento y puntuación 1-5 que le dio):

${respuestasTexto}

Escribe un párrafo de análisis personalizado (100-150 palabras, en español, tratamiento de "tú", tono táctico y conciso, igual registro que el texto base) que vaya más allá de la combinación genérica: cita 1-2 patrones concretos de sus respuestas (contradicciones, puntuaciones muy altas o muy bajas repetidas, algo específico que llame la atención) para que el análisis se sienta hecho a medida de este piloto y no una plantilla. No repitas el texto base palabra por palabra. Responde solo con el párrafo, sin preámbulo ni markdown.`;
}
