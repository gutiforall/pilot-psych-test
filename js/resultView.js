import { ELEMENTS, ELEMENT_LABELS, ELEMENT_ICONS } from "./data.js";

export const ELEMENT_COLORS = { aire: "#3d7a8c", agua: "#2f5fa8", tierra: "#8a6024", fuego: "#b8431f" };

export function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// HTML compartido entre la pantalla de resultado del test (app.js) y la
// ficha individual del panel de pilotos (pilotoDetail.js): título del
// elemento dominante, barras de porcentaje y tarjetas de análisis.
export function renderResultBody({ scores, analysis, validity, canvasId = "radar-chart" }) {
  const sortedPct = ELEMENTS.map((el) => ({ el, pct: scores.percentages[el] })).sort((a, b) => b.pct - a.pct);

  return `
    <h1 class="result-title">
      ${ELEMENT_ICONS[scores.dominant]} ${ELEMENT_LABELS[scores.dominant]}${
        scores.isTied ? ` / ${ELEMENT_ICONS[scores.secondary]} ${ELEMENT_LABELS[scores.secondary]}` : ""
      }
    </h1>
    <p class="result-subtitle">${scores.isTied ? "Perfil equilibrado entre dos elementos" : scores.isMarked ? "Perfil muy marcado" : "Perfil equilibrado"}</p>

    <div class="chart-wrap"><canvas id="${canvasId}"></canvas></div>

    <div class="pct-bars">
      ${sortedPct
        .map(
          ({ el, pct }) => `
        <div class="pct-row">
          <span class="pct-label" style="color:${ELEMENT_COLORS[el]}">${ELEMENT_ICONS[el]} ${ELEMENT_LABELS[el]}</span>
          <div class="pct-track"><div class="pct-fill" style="width:${pct}%;background:${ELEMENT_COLORS[el]}"></div></div>
          <span class="pct-value">${pct.toFixed(1)}%</span>
        </div>`
        )
        .join("")}
    </div>

    ${validity?.respuestaDudosa ? `<p class="notice">Este resultado se ha marcado internamente para revisión (respuestas de control inconsistentes).</p>` : ""}

    ${renderAnalysisCard(analysis.primary, ELEMENT_LABELS[scores.dominant], ELEMENT_LABELS[scores.secondary])}
    ${analysis.hybrid ? renderAnalysisCard(analysis.secondary, ELEMENT_LABELS[scores.secondary], ELEMENT_LABELS[scores.dominant]) : ""}
  `;
}

export function renderAiAnalysisCard(text) {
  if (!text) return "";
  return `
    <div class="analysis-card analysis-card-ai">
      <p class="analysis-combo">✨ Análisis personalizado</p>
      <p>${escapeHtml(text)}</p>
    </div>
  `;
}

function renderAnalysisCard(text, dominantLabel, secondaryLabel) {
  if (!text) return "";
  return `
    <div class="analysis-card">
      <p class="analysis-combo">${dominantLabel} → ${secondaryLabel}</p>
      <p>${escapeHtml(text.descripcion)}</p>
      <dl>
        <dt>Fortaleza</dt><dd>${escapeHtml(text.fortaleza)}</dd>
        <dt>Debilidad</dt><dd>${escapeHtml(text.debilidad)}</dd>
        <dt>Rol natural</dt><dd>${escapeHtml(text.rolNatural)}</dd>
      </dl>
    </div>
  `;
}

export function drawRadarChart(canvasId, scores) {
  const ctx = document.getElementById(canvasId);
  const values = ELEMENTS.map((el) => scores.percentages[el]);
  // Los 4 % suman 100, así que el máximo real ronda 60-65 (caso extremo) y
  // lo típico son 25-45. Una escala fija 0-100 aplasta el diamante en el
  // centro; se ajusta al valor más alto de este resultado en su lugar.
  const axisMax = Math.max(40, Math.ceil((Math.max(...values) + 10) / 10) * 10);

  return new Chart(ctx, {
    type: "radar",
    data: {
      labels: ELEMENTS.map((el) => `${ELEMENT_ICONS[el]} ${ELEMENT_LABELS[el]}`),
      datasets: [
        {
          data: values,
          backgroundColor: "rgba(184, 67, 31, 0.15)",
          borderColor: "#b8431f",
          pointBackgroundColor: ELEMENTS.map((el) => ELEMENT_COLORS[el]),
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        r: {
          min: 0,
          max: axisMax,
          ticks: { display: false },
          grid: { color: "rgba(255,255,255,0.12)" },
          angleLines: { color: "rgba(255,255,255,0.12)" },
          pointLabels: { color: "#ece5d6", font: { size: 13 } },
        },
      },
    },
  });
}
