import { QUESTIONS, CONTROL_RULES, ELEMENTS, ANALYSIS_TEXTS } from "./data.js";

const TIE_THRESHOLD = 5; // puntos porcentuales
const MARKED_THRESHOLD = 20; // puntos porcentuales

/**
 * answers: { [questionId]: { [letter]: number(1-5) } }
 */
export function computeScores(answers) {
  const sums = { aire: 0, agua: 0, tierra: 0, fuego: 0 };

  for (const question of QUESTIONS) {
    if (question.block === "control") continue;
    const given = answers[question.id];
    for (const option of question.options) {
      sums[option.element] += given[option.letter];
    }
  }

  const total = ELEMENTS.reduce((acc, el) => acc + sums[el], 0);
  const percentages = {};
  for (const el of ELEMENTS) {
    percentages[el] = total > 0 ? (sums[el] / total) * 100 : 0;
  }

  return { sums, percentages, ...rankPercentages(percentages) };
}

// Reutilizable tanto para un resultado recién calculado (computeScores)
// como para porcentajes ya guardados que vuelven de la API (panel de pilotos).
export function rankPercentages(percentages) {
  const ranking = [...ELEMENTS].sort((a, b) => percentages[b] - percentages[a]);
  const [dominant, secondary] = ranking;
  const gap = percentages[dominant] - percentages[secondary];

  return {
    ranking,
    dominant,
    secondary,
    gap,
    isTied: gap < TIE_THRESHOLD,
    isMarked: gap > MARKED_THRESHOLD,
  };
}

export function checkValidity(answers) {
  for (const rule of CONTROL_RULES) {
    const value = answers[rule.qId]?.[rule.letter];
    if (value === undefined) continue;
    if (rule.op === "<=" && value <= rule.value) return { respuestaDudosa: true };
    if (rule.op === ">=" && value >= rule.value) return { respuestaDudosa: true };
  }
  return { respuestaDudosa: false };
}

export function getAnalysis(scores) {
  const key = `${scores.dominant}-${scores.secondary}`;
  const primary = ANALYSIS_TEXTS[key];

  if (!scores.isTied) {
    return { hybrid: false, primary };
  }

  const altKey = `${scores.secondary}-${scores.dominant}`;
  return { hybrid: true, primary, secondary: ANALYSIS_TEXTS[altKey] };
}

export function isQuestionComplete(question, answers) {
  const given = answers[question.id];
  if (!given) return false;
  return question.options.every((opt) => typeof given[opt.letter] === "number");
}

export function allQuestionsComplete(answers) {
  return QUESTIONS.every((q) => isQuestionComplete(q, answers));
}
