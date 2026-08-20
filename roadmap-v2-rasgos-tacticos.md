# Roadmap — Test de Perfil Táctico v2 (6 Rasgos Tácticos) para APEX SYNDICATE

Rediseño completo del sistema anterior (`roadmap-test-elemental-pilotos.md`,
ahora superseded). Motivo: el formato normativo (puntuar 1-5 cada opción)
producía perfiles demasiado parejos entre pilotos, sin diferenciación
clara. Este sistema usa formato **ipsativo** (MÁS/MENOS por pregunta,
fuerza a elegir) y cambia el modelo psicológico de 4 elementos a 6
rasgos: Riesgo / Cautela / Cooperación / Disciplina / Iniciativa /
Liderazgo. Fuente del diseño: `test-pilotos-apex-syndicate.md` y
`contexto-para-claude-code.md`.

Decisión explícita del usuario: se borraron los 5 resultados del
sistema anterior (no convertibles al nuevo modelo) — se empezó con la
base de datos limpia.

## Stack

Mismo que el sistema anterior, sin cambios de infraestructura:

- **Frontend:** estático (HTML/CSS/JS sin build), servido por nginx en
  contenedor `pilot-psych-web` en la Raspberry Pi.
- **Backend:** Express + Prisma + SQLite en contenedor `pilot-psych-api`
  en la misma Pi, vía Cloudflare Tunnel.
- **Análisis:** GPT-4.1-mini (OpenAI) — párrafo personalizado citando
  patrones concretos de las respuestas y comentarios libres.
- **Gráficos:** Chart.js (radar de 6 ejes) + un "monstruo elemental"
  nuevo, animado en `<canvas>` sin dependencias, cuyo color y
  partículas reflejan el peso de cada rasgo.

## Fase 0 — Modelo de datos y lógica de puntuación ✅ completada

- [x] `js/data.js` reescrito: 6 rasgos, 20 preguntas (4 opciones A-D
      cada una, cada opción etiquetada con un rasgo), 2 opciones
      inversas (P7-D, P9-A), 6 `ROLE_DEFINITIONS` con condición por
      rango de rasgos (alto/medio/bajo) y blurb propio por rol.
- [x] `js/scoring.js` reescrito: suma con signo (+1 MÁS / −1 MENOS,
      invertido en las opciones `inverse: true`), clasificación por
      rango (alto = top-2 de 6, medio = 2 del medio, bajo = bottom-2)
      en vez de umbrales absolutos, ya que los 6 rasgos no aparecen el
      mismo número de veces en las 20 preguntas.
- [x] Verificado con script de Node aparte: aritmética de las 2
      preguntas inversas correcta, frecuencia de rasgos suma 80,
      matching de rol confirmado contra varios perfiles sintéticos.

## Fase 1 — Frontend: cuestionario, resultado y monstruo elemental ✅ completada

- [x] `js/app.js` — pantalla de pregunta con toggles MÁS/MENOS por
      opción (mutuamente excluyentes entre sí y entre opciones),
      textarea de comentario opcional (200 caracteres, contador),
      autoguardado de borrador en `localStorage`
      (`sc-perfil-tactico:draft-v2`).
- [x] `js/resultView.js` — radar de 6 ejes (escala ±simétrica),
      barras de puntuación bidireccionales (positivo/negativo desde
      el centro), tarjeta(s) de rol sugerido (o tarjeta de perfil
      equilibrado si ninguna regla encaja, o varias tarjetas si el
      perfil es híbrido).
- [x] `js/monster.js` (nuevo) — "monstruo elemental": blob animado en
      `<canvas>`, color mezclado según el peso relativo de los 6
      rasgos (fuego=Riesgo, agua=Cautela, planta=Cooperación,
      tierra=Disciplina, rayo=Iniciativa, aire=Liderazgo), con
      partículas ambientales por elemento cuya densidad depende de la
      puntuación. Sin librerías externas, respeta
      `prefers-reduced-motion`. Botón "Descargar imagen"
      (`canvas.toDataURL`, 100% cliente).
- [x] `css/styles.css` actualizado: toggles MÁS/MENOS, campo de
      comentario, barras bidireccionales, contenedor del monstruo.
- [x] `js/pilotoDetail.js` / `js/pilotosList.js` reescritos a los
      nuevos nombres de campo y al rol sugerido en vez del
      dominante/secundario elemental.

## Fase 2 — Backend: schema, endpoint y análisis IA v2 ✅ completada

- [x] `server/prisma/schema.prisma` — `Resultado` con las 6
      puntuaciones (`puntuacionRiesgo`...`puntuacionLiderazgo`, Int),
      `comentarios` (JSON opcional), sin `respuestaDudosa` (no hay
      preguntas de control en v2). Migración
      `20260820153228_v2_rasgos_tacticos` generada con
      `prisma migrate dev`.
- [x] `server/src/index.ts` — `POST /api/resultados` actualizado a
      los 6 rasgos + comentarios + rol sugerido; `GET /api/pilotos` y
      `GET /api/pilotos/:id` sin cambios de contrato.
- [x] `server/src/llm.ts` reescrito — prompt con las 6 definiciones de
      rasgo, reglas de realismo del juego, rol(es) sugerido(s), y
      ahora también las respuestas completas legibles + comentarios
      libres no vacíos, para que el párrafo cite patrones concretos
      del piloto en vez de repetir el rol genérico. Mismo modelo
      `gpt-4.1-mini`, degradación limpia (`null`) si la IA falla o no
      hay API key.

## Fase 3 — Pruebas locales ✅ completada

- [x] `POST /api/resultados` probado por curl contra el servidor local
      con el nuevo payload — acepta y guarda correctamente.
- [x] Flujo completo de 20 preguntas probado con Playwright contra
      frontend + API locales: toggles MÁS/MENOS, comentario, guardado,
      radar de 6 ejes, monstruo, sin errores de consola.
- [x] Perfil sintético dirigido (Riesgo/Iniciativa altos) probado por
      separado para confirmar el matching de rol real (no solo el
      fallback de perfil equilibrado) — resultado híbrido "Interceptor
      / Combate solitario" + "Exploración / Recon" correcto.
- [x] Listado de pilotos y ficha individual probados con los datos
      nuevos — sin errores de consola.
- [x] **Bug encontrado y corregido:** `.pilot-dominant` en el listado
      usaba `white-space: nowrap`, lo que hacía que nombres de rol
      largos (roles híbridos) se salieran de la pantalla en vez de
      hacer wrap. Corregido en `css/styles.css` (`.pilot-name` con
      `flex-shrink: 0`, `.pilot-dominant` sin `nowrap`, alineado a la
      derecha).

## Fase 4 — Despliegue a producción — pendiente

- [ ] Vaciar `Piloto`/`Resultado` en la base de datos de producción
      (decisión ya confirmada por el usuario — los 5 registros del
      sistema anterior no son convertibles al nuevo modelo) **antes**
      de aplicar la migración, porque la migración generada por
      Prisma no rellena las columnas nuevas obligatorias para filas
      existentes y fallaría si se aplica con datos presentes.
- [ ] Desplegar `server/` (build + `prisma migrate deploy` vía
      Docker) y `web/` (frontend estático) a la Pi — mismo
      procedimiento que en fases anteriores (tarball → scp → ssh →
      `docker compose up -d --build`).
- [ ] Prueba end-to-end en producción real con Playwright: test
      completo de 20 preguntas, guardado, panel, ficha individual,
      radar, rol, monstruo sin errores de consola, análisis IA
      generado citando un comentario de prueba. Limpiar el piloto de
      prueba de la base de datos real al terminar.
- [ ] Compartir enlace con la organización.
