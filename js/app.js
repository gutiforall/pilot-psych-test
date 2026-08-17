import { QUESTIONS, ELEMENTS, ELEMENT_LABELS, ELEMENT_ICONS } from "./data.js";
import { computeScores, checkValidity, getAnalysis, isQuestionComplete, allQuestionsComplete } from "./scoring.js";

const STORAGE_KEY = "sc-perfil-tactico:draft";
const SCALE_LABELS = { 1: "No lo haría", 2: "Poco probable", 3: "Podría hacerlo", 4: "Bastante mi estilo", 5: "Así soy" };
const ELEMENT_COLORS = { aire: "#3d7a8c", agua: "#2f5fa8", tierra: "#8a6024", fuego: "#b8431f" };

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
  const sortedPct = ELEMENTS.map((el) => ({ el, pct: scores.percentages[el] })).sort((a, b) => b.pct - a.pct);

  app.innerHTML = `
    <div class="screen screen-result">
      <p class="eyebrow">Resultado de ${escapeHtml(state.nombre)}</p>
      <h1 class="result-title">
        ${ELEMENT_ICONS[scores.dominant]} ${ELEMENT_LABELS[scores.dominant]}${
          scores.isTied ? ` / ${ELEMENT_ICONS[scores.secondary]} ${ELEMENT_LABELS[scores.secondary]}` : ""
        }
      </h1>
      <p class="result-subtitle">${scores.isTied ? "Perfil equilibrado entre dos elementos" : scores.isMarked ? "Perfil muy marcado" : "Perfil equilibrado"}</p>

      <div class="chart-wrap"><canvas id="radar-chart"></canvas></div>

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

      ${validity.respuestaDudosa ? `<p class="notice">Este resultado se ha marcado internamente para revisión (respuestas de control inconsistentes).</p>` : ""}

      ${renderAnalysisCard(analysis.primary, ELEMENT_LABELS[scores.dominant], ELEMENT_LABELS[scores.secondary])}
      ${analysis.hybrid ? renderAnalysisCard(analysis.secondary, ELEMENT_LABELS[scores.secondary], ELEMENT_LABELS[scores.dominant]) : ""}

      <button class="btn btn-ghost" id="restart-btn">Repetir test</button>
    </div>
  `;

  drawRadarChart(scores);

  document.getElementById("restart-btn").addEventListener("click", () => {
    clearDraft();
    state = { nombre: "", answers: {}, currentIndex: 0 };
    render();
  });
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

function drawRadarChart(scores) {
  const ctx = document.getElementById("radar-chart");
  const values = ELEMENTS.map((el) => scores.percentages[el]);
  // Los 4 % suman 100, así que el máximo real ronda 60-65 (caso extremo) y
  // lo típico son 25-45. Una escala fija 0-100 aplasta el diamante en el
  // centro; se ajusta al valor más alto de este resultado en su lugar.
  const axisMax = Math.max(40, Math.ceil((Math.max(...values) + 10) / 10) * 10);

  if (chartInstance) chartInstance.destroy();
  chartInstance = new Chart(ctx, {
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

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
