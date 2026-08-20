# Contexto del proyecto: Test de Perfil Táctico — APEX SYNDICATE

## Qué es
Web gratuita (GitHub Pages + Supabase) para que los pilotos de mi organización de Star Citizen (APEX SYNDICATE) rellenen un test de personalidad/rol táctico desde el móvil o PC, con registro central por piloto.

## Stack decidido
- Frontend: GitHub Pages (HTML/CSS/JS, sin framework pesado)
- Base de datos: Supabase (gratuito)
- Análisis: por reglas/plantillas en JavaScript, sin LLM

## El cuestionario
20 preguntas, formato ipsativo: de 4 opciones (A/B/C/D) el piloto marca cuál es la que MÁS se parece a él y cuál es la que MENOS, dejando las otras 2 sin marcar. Puntuación: MÁS = +1, MENOS = −1, sin marcar = 0, sumado por rasgo.

Mide 6 rasgos: Riesgo, Cautela, Cooperación, Disciplina, Iniciativa, Liderazgo. De la combinación dominante+secundaria se sugiere un rol táctico: Interceptor/Combate solitario, Escolta, Líder de escuadrón, Minero/Economía, Logística/Transporte, Exploración/Recon.

Las 20 preguntas completas, ya revisadas y ajustadas al realismo del juego, están en el archivo adjunto `test-pilotos-apex-syndicate.md` (pégalo también en el proyecto o dile a Claude Code que lo lea).

## Reglas de realismo del juego (importante para cualquier copy/texto nuevo)
- NO usar % de escudo (se regenera en segundos) → usar estado de hull por color: azul (sin daños) → amarillo (leve) → naranja → rojo (crítico)
- NO usar referencias de tiempo (minutos) → usar distancia en km, en crudo sin etiquetar (ej. "a 3km"), dejando que el piloto interprete si es cerca o lejos
- Comunicación en el juego es por voz/radio (Discord), no por chat de texto
- Combates de grupo se llaman "batallas", no "misiones de squad"
- Vuelan mayoritariamente con armas láser (no usar "munición baja" como dato)
- El objetivo marcado por el grupo se llama "call" o "focus"
- La orden de replegarse se llama "reagroup", no "retirada"
- No hacen contenido PVE (ni minería): actividades no-combate son cosas como lootear restos de batalla
- No existe "base propia" en el juego: usar "lejos de donde está el grupo/apoyo"

## Elemento visual pendiente de construir: "monstruo elemental"
Además del radar chart de 6 rasgos y el análisis de rol sugerido, quiero un resultado visual vistoso: un "monstruo" generado según la combinación de rasgos del piloto, con animación — algo memorable que la gente quiera compartir, no solo un gráfico plano.

Decidido: cada uno de los 6 rasgos tácticos tiene su propio elemento visual 1:1 (nada de agrupar en los 4 elementos clásicos, para no perder precisión). Propuesta de mapeo (a definir estética concreta):
- Riesgo → Fuego
- Cautela → Agua
- Cooperación → Naturaleza/Planta
- Disciplina → Tierra/Metal
- Iniciativa → Rayo
- Liderazgo → Aire/Viento

El piloto obtiene un % de cada elemento según su puntuación en el rasgo correspondiente, y el monstruo se genera/anima combinando visualmente los elementos dominantes.

## Comentarios de texto libre + análisis con LLM
En cada pregunta, además de las 2 respuestas obligatorias (MÁS/MENOS), añadir un campo de texto libre OPCIONAL (límite ~200 caracteres) para que el piloto pueda argumentar o matizar su elección si depende de la situación.

Importante: los % de rasgos, elementos y rol táctico sugerido se siguen calculando 100% por plantillas JavaScript (sin LLM, gratis, instantáneo) — esto no cambia. El LLM se usa SOLO al final, en una única llamada opcional, para redactar un párrafo de análisis cualitativo del piloto a partir de: (a) los números ya calculados, y (b) los comentarios de texto libre que haya escrito. Esto puede ser fase 2 (la web debe funcionar completa sin esta parte primero).

## Qué necesito ahora mismo
Ayuda para estructurar el proyecto (repo, archivos, esquema de Supabase) y empezar a construir la web: formulario del test, guardado en Supabase, cálculo de puntuaciones, radar chart, y el sistema de "monstruo elemental" animado.
