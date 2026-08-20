import { TRAIT_LABELS, TRAIT_ICONS } from "./data.js";
import { rankTraits, suggestRoles } from "./scoring.js";
import { renderResultBody, renderAiAnalysisCard, drawRadarChart, escapeHtml, TRAIT_COLORS } from "./resultView.js";
import { drawMonster } from "./monster.js";
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
  const sums = {
    rie: r.puntuacionRiesgo,
    cau: r.puntuacionCautela,
    coo: r.puntuacionCooperacion,
    dis: r.puntuacionDisciplina,
    ini: r.puntuacionIniciativa,
    lid: r.puntuacionLiderazgo,
  };
  return { sums, ...rankTraits(sums) };
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
  const roles = suggestRoles(scores.tiers);

  content.innerHTML = `
    <p class="eyebrow">Ficha de piloto</p>
    <h1 class="pilot-detail-name">${escapeHtml(piloto.nombre)}</h1>
    <p class="lede">Resultado actual — ${formatFecha(latest.fecha)}</p>
    <div class="monster-wrap"><canvas id="monster-canvas"></canvas></div>
    ${renderResultBody({ scores, roles })}
    ${renderAiAnalysisCard(latest.analisisPersonalizado)}
    ${previous.length > 0 ? renderHistory(previous, piloto.resultados.length) : ""}
  `;

  drawRadarChart("radar-chart", scores);
  drawMonster("monster-canvas", scores);
}

function renderHistory(previous, total) {
  return `
    <h2 class="history-title">Historial (${total} test${total === 1 ? "" : "s"} en total)</h2>
    <div class="history-list">
      ${previous
        .map((r) => {
          const s = toScores(r);
          const roles = suggestRoles(s.tiers);
          const label =
            roles.length > 0
              ? roles.map((role) => role.nombre).join(" / ")
              : `${TRAIT_ICONS[s.dominant]} ${TRAIT_LABELS[s.dominant]} / ${TRAIT_ICONS[s.secondary]} ${TRAIT_LABELS[s.secondary]}`;
          return `
          <div class="history-row">
            <span class="history-date">${formatFecha(r.fecha)}</span>
            <span class="history-dominant" style="color:${TRAIT_COLORS[s.dominant]}">${label}</span>
          </div>`;
        })
        .join("")}
    </div>
  `;
}

function formatFecha(iso) {
  return new Date(iso).toLocaleString("es-ES", { dateStyle: "medium", timeStyle: "short" });
}
