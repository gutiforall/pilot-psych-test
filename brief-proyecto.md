# Brief del proyecto — Test de Perfil Táctico (4 Elementos) — APEX SYNDICATE

## Objetivo

Web gratuita donde cada piloto de la organización de Star Citizen rellena un test de personalidad táctica (4 elementos: Aire/Agua/Tierra/Fuego) desde su móvil o PC. El resultado se guarda en una base de datos central con análisis psicológico automático, y se puede consultar como lista de todos los pilotos o ficha individual.

## Usuarios

Todos los pilotos de la organización, rellenando desde su propio dispositivo. No requiere login complejo — con nombre de piloto es suficiente (a decidir si se añade algo de identificación simple para evitar duplicados/impostores).

## Stack

- **Frontend:** GitHub Pages (HTML/CSS/JS estático) — repo público [`pilot-psych-test`](https://github.com/gutiforall/pilot-psych-test)
- **Base de datos / API:** backend propio (Express + Prisma + SQLite) auto-alojado en la Raspberry Pi del usuario, expuesto vía Cloudflare Tunnel — mismo patrón que el server de APEX QRF (`SC PLAN/server`). *Pivote respecto al plan original (Supabase): el 17/08/2026 un incidente de GitHub bloqueaba el login OAuth necesario para crear el proyecto Supabase, y la Pi ya tenía infraestructura de despliegue probada (Docker + Cloudflare Tunnel), así que se optó por reutilizarla en vez de esperar.*
- **Análisis:** por reglas/plantillas de texto en JavaScript — NO se usa ningún LLM en producción (evita coste y exposición de API keys en un sitio estático)
- **Gráficos:** Chart.js (radar chart de 4 ejes por piloto)

## Documentos de este mismo paquete

1. **`roadmap-test-elemental-pilotos.md`** — fases del proyecto, de rediseño del cuestionario a despliegue final.
2. **`cuestionario-y-clave.md`** — las 16 preguntas originales, sus 4 opciones cada una, y la clave de corrección (letra → elemento) confirmada con el usuario. Incluye los 3 resultados de referencia (Malgamis, Tiamat, Guty) para usar como test de regresión al reprogramar.
3. **`textos-analisis.md`** — las 12 combinaciones de elemento dominante + secundario, cada una con descripción, fortaleza, debilidad y rol natural, listas para usarse como plantillas de análisis automático.

## Decisiones ya tomadas (no reabrir sin motivo)

- El cuestionario pasa de "elegir 1 opción por pregunta" a "puntuar las 4 opciones de 1 a 5" (formato normativo, comparable entre pilotos) — ver Fase 0 del roadmap.
- Se añaden preguntas de control (anti-respuestas-random) y preguntas psicológicas fuera de combate (reacción a corrección, a perder, liderazgo vs. seguir instrucciones, etc.).
- Se guarda histórico: cada piloto puede repetir el test y se conservan los resultados anteriores, no se sobrescriben.
- El análisis es 100% por reglas locales (JS), no por IA en producción.

## Modelo de datos (Prisma/SQLite, `server/prisma/schema.prisma`)

- **`Piloto`**: id, nombre, org (fijo: APEX SYNDICATE), fechaAlta
- **`Resultado`**: id, pilotoId (FK), fecha, puntuacionAire, puntuacionAgua, puntuacionTierra, puntuacionFuego, respuestaDudosa, respuestasCrudas (JSON serializado como texto)

## Cómo usar este paquete en Claude Code

Al abrir el proyecto, pedir a Claude Code que lea los 4 documentos de este paquete antes de generar código, y seguir el orden de fases marcado en el roadmap (empezando por la Fase 0: cerrar el diseño final del cuestionario con puntuación 1-5 antes de programar el formulario).
