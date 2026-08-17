import { ELEMENT_LABELS, ELEMENT_ICONS } from "./data.js";
import { rankPercentages, getAnalysis } from "./scoring.js";
import { renderResultBody, renderAiAnalysisCard, drawRadarChart, escapeHtml, ELEMENT_COLORS } from "./resultView.js";
import { API_BASE_URL, isApiConfigured } from "./apiClient.js";

const content = document.getElementById("piloto-content");
const id = new URLSearchParams(location.search).get("id");

load();

async function load() {
  if (!isApiConfigured) {
    content.innerHTML = `<p class="notice">La API todavía no está configurada.</p>`;
    return;
  }
  if (!id) {
    content.innerHTML = `<p class="notice">Falta el identificador del piloto en la URL.</p>`;
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/pilotos/${encodeURIComponent(id)}`);
    if (response.status === 404) {
      content.innerHTML = `<p class="notice">No se encontró ese piloto.</p>`;
      return;
    }
    if (!response.ok) throw new Error(`Error del servidor (${response.status})`);
    const piloto = await response.json();
    render(piloto);
  } catch (err) {
    console.error("No se pudo cargar la ficha del piloto:", err);
    content.innerHTML = `<p class="notice">No se pudo cargar la ficha (sin conexión con el servidor).</p>`;
  }
}

function toScores(r) {
  const percentages = {
    aire: r.puntuacionAire,
    agua: r.puntuacionAgua,
    tierra: r.puntuacionTierra,
    fuego: r.puntuacionFuego,
  };
  return { percentages, ...rankPercentages(percentages) };
}

function render(piloto) {
  document.title = `${piloto.nombre} — APEX SYNDICATE`;

  if (piloto.resultados.length === 0) {
    content.innerHTML = `
      <p class="eyebrow">Ficha de piloto</p>
      <h1 class="result-title">${escapeHtml(piloto.nombre)}</h1>
      <p class="notice">Este piloto todavía no ha completado el test.</p>
    `;
    return;
  }

  const [latest, ...previous] = piloto.resultados;
  const scores = toScores(latest);
  const analysis = getAnalysis(scores);
  const validity = { respuestaDudosa: latest.respuestaDudosa };

  content.innerHTML = `
    <p class="eyebrow">Ficha de piloto</p>
    <h1 class="pilot-detail-name">${escapeHtml(piloto.nombre)}</h1>
    <p class="lede">Resultado actual — ${formatFecha(latest.fecha)}</p>
    ${renderResultBody({ scores, analysis, validity })}
    ${renderAiAnalysisCard(latest.analisisPersonalizado)}
    ${previous.length > 0 ? renderHistory(previous, piloto.resultados.length) : ""}
  `;

  drawRadarChart("radar-chart", scores);
}

function renderHistory(previous, total) {
  return `
    <h2 class="history-title">Historial (${total} test${total === 1 ? "" : "s"} en total)</h2>
    <div class="history-list">
      ${previous
        .map((r) => {
          const s = toScores(r);
          return `
          <div class="history-row">
            <span class="history-date">${formatFecha(r.fecha)}</span>
            <span class="history-dominant" style="color:${ELEMENT_COLORS[s.dominant]}">
              ${ELEMENT_ICONS[s.dominant]} ${ELEMENT_LABELS[s.dominant]}${s.isTied ? ` / ${ELEMENT_ICONS[s.secondary]} ${ELEMENT_LABELS[s.secondary]}` : ""}
            </span>
            ${r.respuestaDudosa ? `<span class="history-flag" title="Respuestas de control inconsistentes">⚑</span>` : ""}
          </div>`;
        })
        .join("")}
    </div>
  `;
}

function formatFecha(iso) {
  return new Date(iso).toLocaleString("es-ES", { dateStyle: "medium", timeStyle: "short" });
}
