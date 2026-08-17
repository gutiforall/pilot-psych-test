# Roadmap — Test de Perfil Táctico (4 Elementos) para APEX SYNDICATE

Web gratuita para que los pilotos rellenen el cuestionario desde móvil/PC, con análisis psicológico automático y registro histórico por piloto.

## Stack

- **Frontend:** GitHub Pages (HTML/CSS/JS estático, gratis)
- **Base de datos:** Supabase (capa gratuita — Postgres + API JS directa desde el frontend)
- **Análisis:** generado por reglas/plantillas en JavaScript (sin LLM, sin coste, resultado instantáneo)
- **Gráficos:** Chart.js (radar chart por piloto, gratis)

No se usa ningún LLM en producción. El análisis se basa en combinaciones de elemento dominante + secundario, redactadas de antemano.

---

## Fase 0 — Rediseño del cuestionario (antes de programar) ✅ completada

Ver `cuestionario-v2-puntuacion.md` para el documento final de esta fase.

- [x] Reescribir las 16 preguntas actuales para puntuar **cada una de las 4 opciones de 1 a 5** ("cuánto se parece esto a lo que harías"), en vez de elegir una sola opción por pregunta.
  - Motivo: el formato actual es ipsativo (relativo, reparte 16 puntos entre 4 cajas) y no permite comparar pilotos entre sí con rigor. Puntuar cada opción por separado da resultados normativos y comparables.
- [x] Usar la clave de corrección ya confirmada (elemento por cada opción de cada pregunta) como base, adaptándola al nuevo formato de puntuación.
- [x] Añadir preguntas de control (22 y 23, "trampa" con instrucción explícita de puntuación) para detectar respuestas hechas sin pensar.
- [x] Añadir preguntas psicológicas fuera de combate (17-21):
  - Reacción a que le corrijan una decisión
  - Preparación antes de una operación
  - Cómo actúa si el plan de grupo falla
  - Cómo lleva perder varias veces seguidas
  - Preferencia por liderar vs. seguir instrucciones
- [x] Banco de textos de análisis ya redactado en `textos-analisis.md` (4 dominantes × 3 secundarios = 12 combinaciones) — sigue siendo válido sin cambios con el nuevo sistema de puntuación.

## Fase 1 — Cuestionario web ✅ completada

Implementado en `index.html` / `css/styles.css` / `js/*.js` (estático, sin dependencias de build; Chart.js vía CDN).

- [x] Maquetar el formulario — una pregunta a la vez, con barra de progreso (decisión: mejor para móvil, evita saltarse preguntas).
- [x] Guardar respuestas en estado local mientras el piloto rellena — autoguardado en `localStorage`, con pantalla de inicio que ofrece "Continuar test guardado" si hay un borrador a medias.
- [x] Calcular puntuación de los 4 elementos al enviar (`js/scoring.js`, fórmula de `cuestionario-v2-puntuacion.md`).
- [x] Pantalla de resultado: porcentajes + texto de análisis (con caso de empate/perfil híbrido) + radar chart.
- [x] Probado end-to-end con Playwright (flujo completo, navegación atrás/adelante, reanudar borrador, perfil muy marcado, perfil empatado, detección de respuesta dudosa) — sin errores de consola.

## Fase 2 — Base de datos (Supabase)

- [ ] Crear proyecto Supabase gratuito
- [ ] Tabla `pilotos` (nombre, org, fecha de alta)
- [ ] Tabla `resultados_test` (piloto_id, fecha, puntuaciones por elemento, respuestas crudas)
- [ ] Conectar el frontend a Supabase (guardar resultado al enviar el test)
- [ ] Permitir repetir el test y conservar histórico (no sobrescribir resultados anteriores)

## Fase 3 — Panel de pilotos (vista de lista + análisis)

- [ ] Listado de todos los pilotos con su elemento dominante
- [ ] Ficha individual por piloto: porcentajes actuales, radar chart, texto de análisis, evolución si hay más de un test guardado
- [ ] (Opcional) Comparativa entre dos pilotos, tipo la que se hizo manualmente entre Malgamis/Tiamat

## Fase 4 — Despliegue y pulido

- [ ] Publicar en GitHub Pages
- [ ] Revisar responsive (uso previsto principalmente desde móvil)
- [ ] Compartir enlace con la organización

---

## Notas de contexto (para retomar el hilo en Claude Code)

- El cuestionario original (16 preguntas, elección única) y su clave de corrección reconstruida por contenido ya están validados con datos reales de 3 pilotos (Malgamis, Tiamat, Guty).
- Resultados de referencia con la clave actual (formato antiguo, para contraste una vez esté el nuevo sistema):
  - Malgamis: Aire 56,25% · Fuego 25% · Agua 18,75% · Tierra 0%
  - Tiamat: Agua 37,5% · Aire 31,25% · Tierra 25% · Fuego 6,25%
  - Guty: Aire 31,25% · Agua 31,25% · Tierra 25% · Fuego 12,5%
