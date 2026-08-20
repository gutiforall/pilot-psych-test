> **⚠️ SUPERSEDED (20/08/2026):** este sistema (4 elementos, puntuación
> 1-5 normativa) fue sustituido por completo por el rediseño de 6
> rasgos tácticos en formato ipsativo MÁS/MENOS. Ver
> `roadmap-v2-rasgos-tacticos.md` para el sistema actual en
> producción. Este archivo se conserva como historial real de las
> Fases 0-4 originales, no se borra ni se actualiza.

# Roadmap — Test de Perfil Táctico (4 Elementos) para APEX SYNDICATE

Web gratuita para que los pilotos rellenen el cuestionario desde móvil/PC, con análisis psicológico automático y registro histórico por piloto.

## Stack

- **Frontend:** GitHub Pages (HTML/CSS/JS estático, gratis) — repo público `pilot-psych-test`
- **Base de datos / API:** backend propio (Express + Prisma + SQLite) en la Raspberry Pi del usuario, vía Cloudflare Tunnel — pivote desde el plan original de Supabase (bloqueado el 17/08/2026 por un incidente de GitHub que impedía el login OAuth; ver `brief-proyecto.md`)
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

## Fase 2 — Base de datos / API (pivote: backend propio en la Raspberry Pi) ✅ completada

Supabase quedó bloqueado por un incidente de GitHub (login OAuth caído)
justo al crear el proyecto. En vez de esperar, se optó por reutilizar
la infraestructura ya probada en la Pi (mismo patrón que el server de
APEX QRF): Express + Prisma + SQLite + Docker + Cloudflare Tunnel.

- [x] Backend `server/` (Express + Prisma + SQLite) — modelos `Piloto` y `Resultado`, migración inicial generada, compilado y probado localmente (curl + Playwright end-to-end, incluyendo deduplicación de piloto por nombre case-insensitive).
- [x] Endpoint `POST /api/resultados` — hace *get-or-create* del piloto y siempre inserta un `Resultado` nuevo (nunca `update`), conservando histórico.
- [x] Conectar el frontend a la API — `js/apiClient.js` + `js/repository.js` (sustituyen a `js/supabaseClient.js`, eliminado junto con `supabase/schema.sql`).
- [x] Desplegado el contenedor `pilot-psych-api` en la Pi (`~/pilot-psych-test/server`, puerto 8788, nombre de proyecto Docker Compose explícito para no colisionar con `apex-qrf-server`).
- [x] Public Hostname añadida en el tunnel `starcrew-rpi` (Cloudflare Zero Trust): `pilotpsych-api.star-crew.es` → `http://localhost:8788`.
- [x] URL pública real en `js/apiClient.js`, probado end-to-end contra producción con Playwright (sin errores de consola, "Guardado en el registro de la organización ✓"). Datos de prueba limpiados de la base de datos real tras verificar.

## Fase 3 — Panel de pilotos (vista de lista + análisis) ✅ completada

Nuevos endpoints `GET /api/pilotos` y `GET /api/pilotos/:id` en el
backend. `js/resultView.js` extrae el renderizado de resultado
(barras, radar, tarjetas de análisis) para reutilizarlo entre la
pantalla de resultado del test y la ficha de piloto.

- [x] Listado (`pilotos.html`) — todos los pilotos con su elemento dominante (y secundario si hay empate), según su último resultado.
- [x] Ficha individual (`piloto.html?id=...`) — porcentajes actuales, radar chart, texto de análisis, historial completo si repitió el test más de una vez.
- [ ] (Opcional, no hecho) Comparativa entre dos pilotos, tipo la que se hizo manualmente entre Malgamis/Tiamat.

**Bug encontrado y corregido durante el despliegue:** Cloudflare cacheaba el JS/HTML del sitio 4h (`Cache-Control: max-age=14400` inyectado por Cloudflare, no por nginx), así que tras cada redeploy los visitantes seguían viendo la versión anterior hasta que expiraba la caché. Solucionado añadiendo `nginx.conf` con `Cache-Control: no-cache, must-revalidate` explícito en el origen — evita que vuelva a pasar en futuros despliegues. Requirió una purga manual de caché en el dashboard de Cloudflare para aplicar el fix a los archivos ya cacheados.

## Fase 4 — Despliegue y pulido

- [x] Publicar la web — servida desde la Raspberry Pi (contenedor `pilot-psych-web`, nginx estático) en vez de GitHub Pages, mismo motivo que la Fase 2: Pages también está afectado por el incidente de GitHub del 17/08/2026 (intento de activarlo dio 503). GitHub Pages quedó activado igualmente como espejo de respaldo (`https://gutiforall.github.io/pilot-psych-test/`) y terminará de compilar solo cuando el incidente se resuelva, pero **el link real a repartir es el de la Pi**.
- [x] **Link para los pilotos: `https://pilotpsych.star-crew.es/`** — probado de extremo a extremo en producción real (Playwright: rellenar test público → guardar en API pública → confirmación "Guardado en el registro de la organización ✓"), sin login, solo nombre de piloto.
- [ ] Revisar responsive (uso previsto principalmente desde móvil) — pendiente de prueba manual en dispositivo real.
- [ ] Compartir enlace con la organización.

---

## Notas de contexto (para retomar el hilo en Claude Code)

- El cuestionario original (16 preguntas, elección única) y su clave de corrección reconstruida por contenido ya están validados con datos reales de 3 pilotos (Malgamis, Tiamat, Guty).
- Resultados de referencia con la clave actual (formato antiguo, para contraste una vez esté el nuevo sistema):
  - Malgamis: Aire 56,25% · Fuego 25% · Agua 18,75% · Tierra 0%
  - Tiamat: Agua 37,5% · Aire 31,25% · Tierra 25% · Fuego 6,25%
  - Guty: Aire 31,25% · Agua 31,25% · Tierra 25% · Fuego 12,5%
