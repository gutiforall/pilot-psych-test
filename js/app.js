import { QUESTIONS, TRAIT_LABELS } from "./data.js";
import { computeScores, suggestRoles, isQuestionComplete, allQuestionsComplete } from "./scoring.js";
import { saveResult } from "./repository.js";
import { renderResultBody, renderAiAnalysisCard, drawRadarChart, escapeHtml } from "./resultView.js";
import { drawMonster, downloadMonsterImage } from "./monster.js";

const STORAGE_KEY = "sc-perfil-tactico:draft-v2";
const COMMENT_MAX = 200;

const app = document.getElementById("app");

// El estado inicial siempre arranca en la pantalla de bienvenida, incluso si
// hay un borrador guardado — así el piloto elige entre continuar o empezar
// de nuevo en vez de que la app lo devuelva a la pregunta a la fuerza.
let state = { nombre: "", answers: {}, currentIndex: 0 };
let chartInstance = null;
let stopMonster = null;

render();

function loadDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed.nombre || !parsed.answers) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveDraft() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function clearDraft() {
  localStorage.removeItem(STORAGE_KEY);
}

function render() {
  if (!state.nombre) {
    renderStart();
  } else if (state.currentIndex < QUESTIONS.length) {
    renderQuestion();
  } else {
    renderResult();
  }
}

function renderStart() {
  const draft = loadDraft();
  const hasDraft = draft && draft.currentIndex > 0 && draft.currentIndex < QUESTIONS.length;

  app.innerHTML = `
    <div class="screen screen-start">
      <p class="eyebrow">APEX SYNDICATE</p>
      <h1>Test de Perfil Táctico</h1>
      <p class="lede">20 preguntas sobre cómo actúas en combate y en el squad. En cada una, marca la opción que MÁS se parece a ti y la que MENOS — las otras dos se quedan sin marcar. Tarda unos 8-10 minutos.</p>
      <form id="start-form">
        <label class="field">
          <span>Nombre de piloto</span>
          <input type="text" id="nombre" name="nombre" required autocomplete="off" placeholder="Tu callsign" value="${escapeHtml(state.nombre || "")}" />
        </label>
        <button type="submit" class="btn btn-primary">Comenzar</button>
      </form>
      ${hasDraft ? `<button class="btn btn-ghost" id="resume-btn">Continuar como ${escapeHtml(draft.nombre)} — pregunta ${draft.currentIndex + 1} de ${QUESTIONS.length}</button>` : ""}
      <a class="nav-link" href="pilotos.html">Ver pilotos de la organización →</a>
    </div>
  `;

  document.getElementById("start-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value.trim();
    if (!nombre) return;
    state = { nombre, answers: {}, currentIndex: 0 };
    saveDraft();
    render();
  });

  const resumeBtn = document.getElementById("resume-btn");
  if (resumeBtn) {
    resumeBtn.addEventListener("click", () => {
      state = loadDraft();
      render();
    });
  }
}

function renderQuestion() {
  const question = QUESTIONS[state.currentIndex];
  const total = QUESTIONS.length;
  const progressPct = Math.round((state.currentIndex / total) * 100);
  state.answers[question.id] = state.answers[question.id] || { mas: null, menos: null, comentario: "" };
  const given = state.answers[question.id];

  app.innerHTML = `
    <div class="screen screen-question">
      <div class="progress-track">
        <div class="progress-fill" style="width:${progressPct}%"></div>
      </div>
      <p class="progress-label">Pregunta ${state.currentIndex + 1} de ${total}</p>
      <h2 class="q-title">${escapeHtml(question.title)}</h2>
      <p class="q-hint">Marca cuál es MÁS parecida a ti y cuál es MENOS. Las otras dos, sin marcar.</p>
      <div class="options" id="options"></div>
      <label class="comment-field">
        <span>Comentario opcional</span>
        <textarea id="comentario" maxlength="${COMMENT_MAX}" placeholder="Matiza tu elección si depende de la situación (opcional)">${escapeHtml(given.comentario || "")}</textarea>
        <span class="comment-count" id="comment-count">${(given.comentario || "").length}/${COMMENT_MAX}</span>
      </label>
      <div class="nav-buttons">
        <button class="btn btn-ghost" id="back-btn" ${state.currentIndex === 0 ? "disabled" : ""}>Atrás</button>
        <button class="btn btn-primary" id="next-btn" disabled>${state.currentIndex === total - 1 ? "Ver resultado" : "Siguiente"}</button>
      </div>
    </div>
  `;

  renderOptions(question, given);

  const commentEl = document.getElementById("comentario");
  commentEl.addEventListener("input", () => {
    given.comentario = commentEl.value;
    document.getElementById("comment-count").textContent = `${commentEl.value.length}/${COMMENT_MAX}`;
    saveDraft();
  });

  document.getElementById("back-btn").addEventListener("click", () => {
    state.currentIndex -= 1;
    saveDraft();
    render();
  });

  document.getElementById("next-btn").addEventListener("click", () => {
    if (!isQuestionComplete(question, state.answers)) return;
    state.currentIndex += 1;
    saveDraft();
    render();
  });
}

function renderOptions(question, given) {
  const optionsEl = document.getElementById("options");
  optionsEl.innerHTML = "";

  for (const option of question.options) {
    const row = document.createElement("div");
    row.className = "option-row";

    const text = document.createElement("p");
    text.className = "option-text";
    text.innerHTML = `<span class="option-letter">${option.letter}</span> ${escapeHtml(option.text)}`;
    row.appendChild(text);

    const toggles = document.createElement("div");
    toggles.className = "mas-menos";

    const masBtn = buildToggle("MÁS", given.mas === option.letter, () => {
      given.mas = given.mas === option.letter ? null : option.letter;
      if (given.menos === option.letter) given.menos = null;
      saveDraft();
      renderOptions(question, given);
      updateNextState(question);
    });
    const menosBtn = buildToggle("MENOS", given.menos === option.letter, () => {
      given.menos = given.menos === option.letter ? null : option.letter;
      if (given.mas === option.letter) given.mas = null;
      saveDraft();
      renderOptions(question, given);
      updateNextState(question);
    });

    toggles.appendChild(masBtn);
    toggles.appendChild(menosBtn);
    row.appendChild(toggles);
    optionsEl.appendChild(row);
  }

  updateNextState(question);
}

function buildToggle(label, selected, onClick) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = `toggle-btn toggle-${label === "MÁS" ? "mas" : "menos"}${selected ? " selected" : ""}`;
  btn.textContent = label;
  btn.setAttribute("aria-pressed", String(selected));
  btn.addEventListener("click", onClick);
  return btn;
}

function updateNextState(question) {
  const nextBtn = document.getElementById("next-btn");
  if (!nextBtn) return;
  nextBtn.disabled = !isQuestionComplete(question, state.answers);
}

function renderResult() {
  if (!allQuestionsComplete(state.answers)) {
    state.currentIndex = QUESTIONS.findIndex((q) => !isQuestionComplete(q, state.answers));
    render();
    return;
  }

  const scores = computeScores(state.answers);
  const roles = suggestRoles(scores.tiers);

  app.innerHTML = `
    <div class="screen screen-result">
      <p class="eyebrow">Resultado de ${escapeHtml(state.nombre)}</p>
      <p class="save-status save-pending" id="save-status">Guardando resultado…</p>

      <div class="monster-wrap">
        <canvas id="monster-canvas"></canvas>
        <button class="btn btn-ghost btn-small" id="download-monster">Descargar imagen</button>
      </div>

      ${renderResultBody({ scores, roles })}
      <div id="ai-analysis-slot"></div>
      <button class="btn btn-ghost" id="restart-btn">Repetir test</button>
      <a class="nav-link" href="pilotos.html">Ver pilotos de la organización →</a>
    </div>
  `;

  if (chartInstance) chartInstance.destroy();
  chartInstance = drawRadarChart("radar-chart", scores);

  if (stopMonster) stopMonster();
  stopMonster = drawMonster("monster-canvas", scores);

  document.getElementById("download-monster").addEventListener("click", () => {
    downloadMonsterImage("monster-canvas", `perfil-tactico-${state.nombre.replace(/\s+/g, "-").toLowerCase()}.png`);
  });

  persistResult(scores, roles);

  document.getElementById("restart-btn").addEventListener("click", () => {
    clearDraft();
    state = { nombre: "", answers: {}, currentIndex: 0 };
    render();
  });
}

// Texto legible de cada pregunta (con qué se marcó MÁS/MENOS y el
// comentario si lo hay), para que el análisis con IA pueda citar
// patrones concretos en vez de repetir el rol genérico.
function buildRespuestasLegibles(answers) {
  return QUESTIONS.map((q) => {
    const given = answers[q.id];
    return {
      pregunta: q.title,
      opciones: q.options.map((o) => ({
        letra: o.letter,
        texto: o.text,
        rasgo: TRAIT_LABELS[o.trait],
        marcado: given.mas === o.letter ? "MÁS" : given.menos === o.letter ? "MENOS" : null,
      })),
      comentario: given.comentario?.trim() || null,
    };
  });
}

function buildComentarios(answers) {
  const comentarios = {};
  for (const q of QUESTIONS) {
    const texto = answers[q.id]?.comentario?.trim();
    if (texto) comentarios[q.id] = texto;
  }
  return Object.keys(comentarios).length > 0 ? comentarios : null;
}

async function persistResult(scores, roles) {
  const statusEl = document.getElementById("save-status");
  try {
    const saved = await saveResult({
      nombre: state.nombre,
      scores,
      roles,
      answers: state.answers,
      respuestasLegibles: buildRespuestasLegibles(state.answers),
      comentarios: buildComentarios(state.answers),
    });
    clearDraft();
    if (statusEl) {
      statusEl.textContent = "Guardado en el registro de la organización ✓";
      statusEl.className = "save-status save-ok";
    }
    const aiSlot = document.getElementById("ai-analysis-slot");
    if (aiSlot && saved?.resultado?.analisisPersonalizado) {
      aiSlot.innerHTML = renderAiAnalysisCard(saved.resultado.analisisPersonalizado);
    }
  } catch (err) {
    console.error("No se pudo guardar el resultado:", err);
    if (statusEl) {
      statusEl.textContent = "No se pudo guardar (sin conexión con el servidor) — tu resultado sigue visible aquí.";
      statusEl.className = "save-status save-error";
    }
  }
}
