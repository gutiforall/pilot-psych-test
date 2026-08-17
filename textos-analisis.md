# Banco de textos de análisis — 12 combinaciones (dominante + secundario)

Plantillas base para generar el análisis psicológico automáticamente, según el elemento con mayor % (dominante) y el segundo con mayor % (secundario). El texto final se puede matizar con la distancia entre porcentajes (ej. "muy marcado" si dominante-secundario > 20 puntos, "equilibrado" si es menor).

Estructura de cada combinación: **Descripción** · **Fortaleza** · **Debilidad** · **Rol natural**

---

## 🌪️ Aire dominante

### Aire–Fuego
**Descripción:** Manipula la situación y, en cuanto surge la ventana, entra con fuerza.
**Fortaleza:** Crea y explota oportunidades con rapidez; difícil de leer porque no espera mucho entre provocar y golpear.
**Debilidad:** Poca paciencia para sostener intercambios largos; riesgo de sobreextensión tras manipular.
**Rol natural:** Iniciador ofensivo.

### Aire–Agua
**Descripción:** Provoca reacciones en el enemigo mientras interpreta constantemente lo que le está ofreciendo antes de comprometerse.
**Fortaleza:** Muy flexible, adapta el plan sobre la marcha combinando movimiento y lectura.
**Debilidad:** Puede dudar entre seguir manipulando o aprovechar ya la oportunidad que tiene delante.
**Rol natural:** Desorganizador táctico con capacidad de lectura.

### Aire–Tierra
**Descripción:** Desorganiza al enemigo, pero cuando hace falta también puede plantarse y sostener un intercambio.
**Fortaleza:** Versátil entre mover la pelea y aguantarla.
**Debilidad:** Al repartirse entre dos estilos tan distintos, puede no llegar a dominar del todo ninguno de los dos.
**Rol natural:** Manipulador con capacidad de aguante.

---

## 💧 Agua dominante

### Agua–Fuego
**Descripción:** Lee la situación y convierte rápido esa lectura en presión y ejecución.
**Fortaleza:** Convierte información en acción con eficacia; no ataca sin razón pero tampoco se queda parado.
**Debilidad:** Tensión interna entre esperar más información y lanzarse ya; riesgo de sobreextensión si el impulso agresivo gana la disputa.
**Rol natural:** Adaptador-ejecutor.

### Agua–Aire
**Descripción:** Interpreta la pelea apoyándose en el movimiento y el reposicionamiento constante.
**Fortaleza:** Difícil de fijar; siempre se reacomoda buscando la mejor lectura posible.
**Debilidad:** Puede pasar demasiado tiempo reposicionando en vez de comprometerse, perdiendo ventanas de oportunidad.
**Rol natural:** Intérprete móvil.

### Agua–Tierra
**Descripción:** Observa la pelea y, cuando decide comprometerse, tiene base suficiente para sostener el intercambio.
**Fortaleza:** Combina paciencia y resistencia; difícil de sacar de una pelea que ha elegido bien.
**Debilidad:** Puede tardar demasiado en decidirse a entrar, dejando pasar oportunidades.
**Rol natural:** Intérprete-ancla.

---

## 🪨 Tierra dominante

### Tierra–Fuego
**Descripción:** Acepta el intercambio directo y, cuando consigue ventaja, presiona para cerrarlo.
**Fortaleza:** Solidez en el enfrentamiento cara a cara, con capacidad real de rematar.
**Debilidad:** Poco margen de maniobra si el combate se vuelve muy dinámico o el enemigo evita el intercambio directo.
**Rol natural:** Combatiente cerrador.

### Tierra–Agua
**Descripción:** Sostiene el intercambio, pero elige con cuidado cuándo y con quién comprometerse.
**Fortaleza:** Pocas malas decisiones, alta eficiencia en los intercambios que elige.
**Debilidad:** Poca capacidad de forzar la situación si el enemigo evita el enfrentamiento directo.
**Rol natural:** Combatiente selectivo.

### Tierra–Aire
**Descripción:** Acepta el intercambio, pero también usa el movimiento para no quedar fijado en una mala posición.
**Fortaleza:** Resistente y con salida; difícil de aislar.
**Debilidad:** Puede resultar indeciso entre plantarse a pelear o reposicionar.
**Rol natural:** Combatiente flexible.

---

## 🔥 Fuego dominante

### Fuego–Aire
**Descripción:** Ataca con fuerza, pero antes se mueve para desestabilizar al enemigo y abrir la entrada.
**Fortaleza:** Entradas muy difíciles de anticipar; alta capacidad de generar caos y bajas rápidas.
**Debilidad:** Poca paciencia para leer la situación; puede entrar sin información suficiente.
**Rol natural:** Iniciador explosivo.

### Fuego–Agua
**Descripción:** Ataca con fuerza, pero solo tras una lectura mínima de la situación.
**Fortaleza:** Agresividad con criterio; comete menos errores que un perfil de fuego puro.
**Debilidad:** La tensión entre "ahora" y "espera un poco más" puede generar dudas en el momento clave.
**Rol natural:** Ejecutor con lectura.

### Fuego–Tierra
**Descripción:** Ataca con fuerza y, si no cierra la baja de inmediato, tiene base para sostener el intercambio que él mismo abrió.
**Fortaleza:** Combina la entrada más letal del grupo con capacidad real de aguantar lo que venga después.
**Debilidad:** Poca manipulación o lectura previa; puede ser predecible para un enemigo bien organizado.
**Rol natural:** Rematador resistente.

---

## Nota de implementación

- El texto se elige por (dominante, secundario). Si hay empate entre dos elementos como "dominante" (diferencia < 3-5 puntos, a definir), se puede mostrar un texto híbrido combinando ambas descripciones, o usar el orden de aparición en el test como desempate.
- La "debilidad" mencionada en cada combinación suele estar asociada al elemento con el porcentaje más bajo del piloto — se puede reforzar dinámicamente citando ese elemento y su %.
- El "rol natural" es el texto más corto y es el que tiene más sentido mostrar en la vista de lista/resumen de todos los pilotos.
