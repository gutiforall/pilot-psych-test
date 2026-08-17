import { QUESTIONS } from "./data.js";
import { computeScores, checkValidity, getAnalysis, isQuestionComplete, allQuestionsComplete } from "./scoring.js";
import { saveResult } from "./repository.js";
import { renderResultBody, renderAiAnalysisCard, drawRadarChart, escapeHtml } from "./resultView.js";

const STORAGE_KEY = "sc-perfil-tactico:draft";
const SCALE_LABELS = { 1: "No lo haría", 2: "Poco probable", 3: "Podría hacerlo", 4: "Bastante mi estilo", 5: "Así soy" };

const app = document.getElementById("app");

// El estado inicial siempre arranca en la pantalla de bienvenida, incluso si
// hay un borrador guardado — así el piloto elige entre continuar o empezar
// de nuevo en vez de que la app lo devuelva a la pregunta a la fuerza.
let state = { nombre: "", answers: {}, currentIndex: 0 };
let chartInstance = null;

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
      <p class="lede">23 preguntas sobre cómo actúas en combate y fuera de él. Puntúa cada opción de 1 a 5 según cuánto se parece a lo que harías. Tarda unos 8-10 minutos.</p>
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
  const answers = state.answers[question.id] || {};
  const total = QUESTIONS.length;
  const progressPct = Math.round((state.currentIndex / total) * 100);

  app.innerHTML = `
    <div class="screen screen-question">
      <div class="progress-track">
        <div class="progress-fill" style="width:${progressPct}%"></div>
      </div>
      <p class="progress-label">Pregunta ${state.currentIndex + 1} de ${total}</p>
      <h2 class="q-title">${escapeHtml(question.title)}</h2>
      <p class="q-hint">Puntúa cada opción de 1 a 5 según cuánto se parece a lo que harías.</p>
      <div class="options" id="options"></div>
      <div class="nav-buttons">
        <button class="btn btn-ghost" id="back-btn" ${state.currentIndex === 0 ? "disabled" : ""}>Atrás</button>
        <button class="btn btn-primary" id="next-btn" disabled>${state.currentIndex === total - 1 ? "Ver resultado" : "Siguiente"}</button>
      </div>
    </div>
  `;

  const optionsEl = document.getElementById("options");
  for (const option of question.options) {
    optionsEl.appendChild(buildOptionRow(question, option, answers[option.letter]));
  }

  updateNextState(question);

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

function buildOptionRow(question, option, currentValue) {
  const row = document.createElement("div");
  row.className = "option-row";

  const text = document.createElement("p");
  text.className = "option-text";
  text.innerHTML = `<span class="option-letter">${option.letter}</span> ${escapeHtml(option.text)}`;
  row.appendChild(text);

  const scale = document.createElement("div");
  scale.className = "scale";
  for (let value = 1; value <= 5; value += 1) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "scale-btn";
    btn.textContent = String(value);
    btn.title = SCALE_LABELS[value];
    btn.setAttribute("aria-pressed", String(currentValue === value));
    if (currentValue === value) btn.classList.add("selected");
    btn.addEventListener("click", () => {
      state.answers[question.id] = state.answers[question.id] || {};
      state.answers[question.id][option.letter] = value;
      saveDraft();
      scale.querySelectorAll(".scale-btn").forEach((b) => {
        b.classList.remove("selected");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("selected");
      btn.setAttribute("aria-pressed", "true");
      updateNextState(question);
    });
    scale.appendChild(btn);
  }
  row.appendChild(scale);
  return row;
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
  const validity = checkValidity(state.answers);
  const analysis = getAnalysis(scores);

  app.innerHTML = `
    <div class="screen screen-result">
      <p class="eyebrow">Resultado de ${escapeHtml(state.nombre)}</p>
      <p class="save-status save-pending" id="save-status">Guardando resultado…</p>
      ${renderResultBody({ scores, analysis, validity })}
      <div id="ai-analysis-slot"></div>
      <button class="btn btn-ghost" id="restart-btn">Repetir test</button>
      <a class="nav-link" href="pilotos.html">Ver pilotos de la organización →</a>
    </div>
  `;

  if (chartInstance) chartInstance.destroy();
  chartInstance = drawRadarChart("radar-chart", scores);
  persistResult(scores, validity, analysis);

  document.getElementById("restart-btn").addEventListener("click", () => {
    clearDraft();
    state = { nombre: "", answers: {}, currentIndex: 0 };
    render();
  });
}

// Texto de cada opción + puntuación 1-5, para que el análisis con IA pueda
// citar patrones concretos de las respuestas del piloto (no solo el % final).
function buildRespuestasLegibles(answers) {
  return QUESTIONS.filter((q) => q.block !== "control").map((q) => ({
    pregunta: q.title,
    opciones: q.options.map((o) => ({
      letra: o.letter,
      texto: o.text,
      elemento: o.element,
      puntuacion: answers[q.id]?.[o.letter] ?? null,
    })),
  }));
}

async function persistResult(scores, validity, analysis) {
  const statusEl = document.getElementById("save-status");
  try {
    const saved = await saveResult({
      nombre: state.nombre,
      scores,
      validity,
      analysis,
      answers: state.answers,
      respuestasLegibles: buildRespuestasLegibles(state.answers),
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

