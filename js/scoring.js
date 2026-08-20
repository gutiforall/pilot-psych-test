import { QUESTIONS, TRAITS, ROLE_DEFINITIONS } from "./data.js";

/**
 * answers: { [questionId]: { mas: "A"|"B"|"C"|"D", menos: "A"|"B"|"C"|"D", comentario?: string } }
 * Cada pregunta aporta +1 al rasgo de la opción MÁS y -1 al rasgo de la
 * opción MENOS — invertido si esa opción está marcada como `inverse`
 * en data.js (P7-D, P9-A).
 */
export function computeScores(answers) {
  const sums = Object.fromEntries(TRAITS.map((t) => [t, 0]));

  for (const question of QUESTIONS) {
    const given = answers[question.id];
    const masOption = question.options.find((o) => o.letter === given.mas);
    const menosOption = question.options.find((o) => o.letter === given.menos);

    sums[masOption.trait] += masOption.inverse ? -1 : 1;
    sums[menosOption.trait] += menosOption.inverse ? 1 : -1;
  }

  return { sums, ...rankTraits(sums) };
}

// Reutilizable tanto para un resultado recién calculado (computeScores)
// como para puntuaciones ya guardadas que vuelven de la API (panel de
// pilotos): ranking, dominante/secundario y nivel (alto/medio/bajo) de
// cada rasgo por posición relativa entre los 6, no por umbral absoluto
// — los 6 rasgos aparecen un número distinto de veces en las 20
// preguntas, así que sus rangos de puntuación bruta no son comparables
// entre sí en términos absolutos.
export function rankTraits(sums) {
  const ranking = [...TRAITS].sort((a, b) => sums[b] - sums[a]);
  const [dominant, secondary] = ranking;
  const gap = sums[dominant] - sums[secondary];

  const tiers = {};
  ranking.forEach((trait, i) => {
    tiers[trait] = i < 2 ? "alto" : i < 4 ? "medio" : "bajo";
  });

  return { ranking, dominant, secondary, gap, tiers };
}

// Devuelve los roles cuya condición encaja con el perfil. Puede ser
// ninguno (cobertura de las 6 reglas no es exhaustiva) o varios
// (perfil híbrido) — la vista decide cómo mostrarlo.
export function suggestRoles(tiers) {
  return ROLE_DEFINITIONS.filter((role) => role.condicion(tiers));
}

export function isQuestionComplete(question, answers) {
  const given = answers[question.id];
  if (!given || !given.mas || !given.menos) return false;
  return given.mas !== given.menos;
}

export function allQuestionsComplete(answers) {
  return QUESTIONS.every((q) => isQuestionComplete(q, answers));
}
