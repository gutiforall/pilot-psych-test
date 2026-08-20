import { API_BASE_URL, isApiConfigured } from "./apiClient.js";

export async function saveResult({ nombre, scores, roles, answers, respuestasLegibles, comentarios }) {
  if (!isApiConfigured) {
    throw new Error("La API todavía no está configurada (ver js/apiClient.js).");
  }

  const response = await fetch(`${API_BASE_URL}/api/resultados`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nombre,
      puntuacionRiesgo: scores.sums.rie,
      puntuacionCautela: scores.sums.cau,
      puntuacionCooperacion: scores.sums.coo,
      puntuacionDisciplina: scores.sums.dis,
      puntuacionIniciativa: scores.sums.ini,
      puntuacionLiderazgo: scores.sums.lid,
      respuestasCrudas: answers,
      comentarios,
      dominant: scores.dominant,
      secondary: scores.secondary,
      roles: roles.map((r) => ({ nombre: r.nombre, blurb: r.blurb })),
      respuestasLegibles,
    }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Error del servidor (${response.status})`);
  }

  return response.json();
}
