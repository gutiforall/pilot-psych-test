import OpenAI from "openai";

const MODEL = "gpt-4.1-mini";
const TIMEOUT_MS = 15_000;

const client = process.env.OPENAI_API_KEY ? new OpenAI({ timeout: TIMEOUT_MS }) : null;

const TRAIT_DEFINITIONS = `
- Riesgo — Agresividad ofensiva: buscar el enfrentamiento y rematar oportunidades.
- Cautela — Autopreservación: evitar exposición innecesaria, replegarse a tiempo.
- Cooperación — Trabajo en equipo: priorizar al squad sobre la acción individual.
- Disciplina — Protocolo: seguir el plan y las órdenes tal como se dan.
- Iniciativa — Independencia: decidir y actuar por cuenta propia sin esperar confirmación.
- Liderazgo — Decisión bajo presión: tomar el mando cuando hace falta.
`.trim();

const REALISMO = `
Reglas de realismo del juego (Star Citizen) para cualquier texto:
- No usar % de escudo (se regenera en segundos) — usar estado de hull por color si hace falta.
- No usar referencias de tiempo (minutos) — usar distancia en km si hace falta.
- La orden de replegarse se llama "reagroup", nunca "retirada".
- No existe "base propia" — se dice "lejos de donde está el grupo/apoyo".
`.trim();

interface RoleInput {
  nombre: string;
  blurb: string;
}

interface RespuestaLegible {
  pregunta: string;
  opciones: { letra: string; texto: string; rasgo: string; marcado: "MÁS" | "MENOS" | null }[];
  comentario: string | null;
}

interface PersonalizedAnalysisInput {
  nombre: string;
  sums: {
    riesgo: number;
    cautela: number;
    cooperacion: number;
    disciplina: number;
    iniciativa: number;
    liderazgo: number;
  };
  dominant: string;
  secondary: string;
  roles: RoleInput[];
  respuestasLegibles: RespuestaLegible[];
}

export async function generatePersonalizedAnalysis(input: PersonalizedAnalysisInput): Promise<string | null> {
  if (!client) return null;

  const prompt = buildPrompt(input);

  try {
    const response = await client.chat.completions.create({
      model: MODEL,
      max_tokens: 450,
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
  const { nombre, sums, dominant, secondary, roles, respuestasLegibles } = input;

  const respuestasTexto = respuestasLegibles
    .map((q) => {
      const opciones = q.opciones
        .map((o) => `  ${o.letra} (${o.rasgo}${o.marcado ? `, ${o.marcado}` : ""}): ${o.texto}`)
        .join("\n");
      const comentario = q.comentario ? `\n  Comentario del piloto: "${q.comentario}"` : "";
      return `${q.pregunta}\n${opciones}${comentario}`;
    })
    .join("\n\n");

  const rolTexto =
    roles.length > 0
      ? roles.map((r) => `"${r.nombre}": ${r.blurb}`).join(" / ")
      : "Ninguno de los roles predefinidos encaja claramente — perfil equilibrado.";

  return `Eres quien redacta el análisis de perfil táctico de un test de personalidad para pilotos de una organización de Star Citizen (APEX SYNDICATE). El test mide 6 rasgos:

${TRAIT_DEFINITIONS}

${REALISMO}

Piloto: ${nombre}
Puntuaciones (suma de +1 MÁS / -1 MENOS por pregunta, sin normalizar): Riesgo ${sums.riesgo} · Cautela ${sums.cautela} · Cooperación ${sums.cooperacion} · Disciplina ${sums.disciplina} · Iniciativa ${sums.iniciativa} · Liderazgo ${sums.liderazgo}
Dominante: ${dominant} · Secundario: ${secondary}
Rol(es) sugerido(s): ${rolTexto}

Respuestas completas del piloto (pregunta, opción, rasgo, si se marcó MÁS/MENOS, y su comentario libre si lo escribió):

${respuestasTexto}

Escribe un párrafo de análisis personalizado (100-150 palabras, en español, tratamiento de "tú", tono táctico y conciso) que vaya más allá del rol genérico: cita 1-2 patrones concretos de sus respuestas (contradicciones entre preguntas, algo que dijo en un comentario libre si lo hay, una elección que llame la atención) para que el análisis se sienta hecho a medida de este piloto y no una plantilla. Si escribió algún comentario, intégralo de forma natural en el análisis. No repitas el blurb del rol palabra por palabra. Responde solo con el párrafo, sin preámbulo ni markdown.`;
}
