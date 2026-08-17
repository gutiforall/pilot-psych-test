import { ELEMENT_LABELS, ELEMENT_ICONS } from "./data.js";
import { rankPercentages } from "./scoring.js";
import { escapeHtml, ELEMENT_COLORS } from "./resultView.js";
import { API_BASE_URL, isApiConfigured } from "./apiClient.js";

const listEl = document.getElementById("pilotos-list");

load();

async function load() {
  if (!isApiConfigured) {
    listEl.innerHTML = `<p class="notice">La API todavía no está configurada.</p>`;
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/pilotos`);
    if (!response.ok) throw new Error(`Error del servidor (${response.status})`);
    const pilotos = await response.json();
    render(pilotos);
  } catch (err) {
    console.error("No se pudo cargar el listado de pilotos:", err);
    listEl.innerHTML = `<p class="notice">No se pudo cargar el listado (sin conexión con el servidor).</p>`;
  }
}

function render(pilotos) {
  if (pilotos.length === 0) {
    listEl.innerHTML = `<p class="notice">Todavía no hay pilotos registrados. En cuanto alguien complete el test, aparecerá aquí.</p>`;
    return;
  }

  listEl.innerHTML = pilotos
    .map((piloto) => {
      const r = piloto.ultimoResultado;
      if (!r) {
        return `
          <a class="pilot-row" href="piloto.html?id=${encodeURIComponent(piloto.id)}">
            <span class="pilot-name">${escapeHtml(piloto.nombre)}</span>
            <span class="pilot-empty">Sin resultados todavía</span>
          </a>`;
      }

      const percentages = {
        aire: r.puntuacionAire,
        agua: r.puntuacionAgua,
        tierra: r.puntuacionTierra,
        fuego: r.puntuacionFuego,
      };
      const ranked = rankPercentages(percentages);

      return `
        <a class="pilot-row" href="piloto.html?id=${encodeURIComponent(piloto.id)}">
          <span class="pilot-name">${escapeHtml(piloto.nombre)}</span>
          <span class="pilot-dominant" style="color:${ELEMENT_COLORS[ranked.dominant]}">
            ${ELEMENT_ICONS[ranked.dominant]} ${ELEMENT_LABELS[ranked.dominant]}${ranked.isTied ? ` / ${ELEMENT_ICONS[ranked.secondary]} ${ELEMENT_LABELS[ranked.secondary]}` : ""}
          </span>
        </a>`;
    })
    .join("");
}
