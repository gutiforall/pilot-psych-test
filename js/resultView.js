import { TRAITS, TRAIT_LABELS, TRAIT_ICONS } from "./data.js";

// Mismos colores que usará el monstruo elemental (js/monster.js) —
// fuego=riesgo, agua=cautela, planta=cooperación, tierra=disciplina,
// rayo=iniciativa, aire=liderazgo.
export const TRAIT_COLORS = {
  rie: "#b8431f",
  cau: "#2f5fa8",
  coo: "#4a8f3c",
  dis: "#8a6024",
  ini: "#c9a227",
  lid: "#3d7a8c",
};

export function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function roleHeading(roles, dominant, secondary) {
  if (roles.length === 1) return roles[0].nombre;
  if (roles.length > 1) return roles.map((r) => r.nombre).join(" / ");
  return `${TRAIT_ICONS[dominant]} ${TRAIT_LABELS[dominant]} / ${TRAIT_ICONS[secondary]} ${TRAIT_LABELS[secondary]}`;
}

// HTML compartido entre la pantalla de resultado del test (app.js) y la
// ficha individual del panel de pilotos (pilotoDetail.js): título del
// rol sugerido, barras de puntuación por rasgo y tarjetas de rol.
export function renderResultBody({ scores, roles, canvasId = "radar-chart" }) {
  const sortedTraits = [...TRAITS].sort((a, b) => scores.sums[b] - scores.sums[a]);
  const maxAbs = Math.max(1, ...TRAITS.map((t) => Math.abs(scores.sums[t])));

  return `
    <h1 class="result-title">${roleHeading(roles, scores.dominant, scores.secondary)}</h1>
    <p class="result-subtitle">${
      roles.length === 0
        ? "Perfil equilibrado, sin rol dominante marcado"
        : roles.length > 1
          ? "Perfil híbrido entre dos roles"
          : `${TRAIT_ICONS[scores.dominant]} ${TRAIT_LABELS[scores.dominant]} / ${TRAIT_ICONS[scores.secondary]} ${TRAIT_LABELS[scores.secondary]}`
    }</p>

    <div class="chart-wrap"><canvas id="${canvasId}"></canvas></div>

    <div class="score-bars">
      ${sortedTraits
        .map((t) => {
          const val = scores.sums[t];
          const pct = (Math.abs(val) / maxAbs) * 50; // 50% = mitad de la barra, desde el centro
          const side = val >= 0 ? "pos" : "neg";
          return `
        <div class="score-row">
          <span class="score-label" style="color:${TRAIT_COLORS[t]}">${TRAIT_ICONS[t]} ${TRAIT_LABELS[t]}</span>
          <div class="score-track">
            <div class="score-fill score-fill-${side}" style="width:${pct}%;background:${TRAIT_COLORS[t]}"></div>
          </div>
          <span class="score-value">${val > 0 ? "+" : ""}${val}</span>
        </div>`;
        })
        .join("")}
    </div>

    ${roles.length > 0 ? roles.map(renderRoleCard).join("") : renderFallbackRoleCard(scores)}
  `;
}

function renderRoleCard(role) {
  return `
    <div class="analysis-card">
      <p class="analysis-combo">${role.nombre}</p>
      <p>${escapeHtml(role.blurb)}</p>
    </div>
  `;
}

function renderFallbackRoleCard(scores) {
  return `
    <div class="analysis-card">
      <p class="analysis-combo">${TRAIT_LABELS[scores.dominant]} / ${TRAIT_LABELS[scores.secondary]}</p>
      <p>Tu combinación de rasgos no encaja de forma clara en ninguno de los roles predefinidos — no es un problema, significa que tu estilo no se deja encasillar fácilmente. Tus dos rasgos más marcados son <strong>${TRAIT_LABELS[scores.dominant]}</strong> y <strong>${TRAIT_LABELS[scores.secondary]}</strong>.</p>
    </div>
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

export function drawRadarChart(canvasId, scores) {
  const ctx = document.getElementById(canvasId);
  const values = TRAITS.map((t) => scores.sums[t]);
  const maxAbs = Math.max(4, Math.ceil(Math.max(...values.map(Math.abs)) / 2) * 2);

  return new Chart(ctx, {
    type: "radar",
    data: {
      labels: TRAITS.map((t) => `${TRAIT_ICONS[t]} ${TRAIT_LABELS[t]}`),
      datasets: [
        {
          data: values,
          backgroundColor: "rgba(184, 67, 31, 0.15)",
          borderColor: "#b8431f",
          pointBackgroundColor: TRAITS.map((t) => TRAIT_COLORS[t]),
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        r: {
          min: -maxAbs,
          max: maxAbs,
          ticks: { display: false },
          grid: { color: "rgba(255,255,255,0.12)" },
          angleLines: { color: "rgba(255,255,255,0.12)" },
          pointLabels: { color: "#ece5d6", font: { size: 13 } },
        },
      },
    },
  });
}
