import { API_BASE_URL, isApiConfigured } from "./apiClient.js";

export async function saveResult({ nombre, scores, validity, analysis, answers, respuestasLegibles }) {
  if (!isApiConfigured) {
    throw new Error("La API todavía no está configurada (ver js/apiClient.js).");
  }

  const response = await fetch(`${API_BASE_URL}/api/resultados`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nombre,
      puntuacionAire: scores.percentages.aire,
      puntuacionAgua: scores.percentages.agua,
      puntuacionTierra: scores.percentages.tierra,
      puntuacionFuego: scores.percentages.fuego,
      respuestaDudosa: validity.respuestaDudosa,
      respuestasCrudas: answers,
      dominant: scores.dominant,
      secondary: scores.secondary,
      analisisBase: analysis.primary ?? null,
      respuestasLegibles,
    }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Error del servidor (${response.status})`);
  }

  return response.json();
}
