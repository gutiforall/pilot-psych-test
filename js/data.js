// Datos del test de perfil táctico — APEX SYNDICATE
// Fuente: cuestionario-v2-puntuacion.md (Fase 0)

export const ELEMENTS = ["aire", "agua", "tierra", "fuego"];

export const ELEMENT_LABELS = {
  aire: "Aire",
  agua: "Agua",
  tierra: "Tierra",
  fuego: "Fuego",
};

export const ELEMENT_ICONS = {
  aire: "🌪️",
  agua: "💧",
  tierra: "🪨",
  fuego: "🔥",
};

// block: "combate" | "psico" | "control"
export const QUESTIONS = [
  {
    id: 1,
    block: "combate",
    title: "Primer contacto",
    options: [
      { letter: "A", text: "Entro agresivamente sobre el objetivo más vulnerable y trato de obligarlo a defenderse inmediatamente.", element: "fuego" },
      { letter: "B", text: "Mantengo una trayectoria que me permita permanecer cerca del combate, esperando que alguno cometa un error.", element: "tierra" },
      { letter: "C", text: "Me posiciono de manera que alguno tenga que reaccionar a mi presencia y aprovecho ese movimiento para alterar su formación.", element: "aire" },
      { letter: "D", text: "Busco al objetivo que ya está mal posicionado y adapto mi entrada a él.", element: "agua" },
    ],
  },
  {
    id: 2,
    block: "combate",
    title: "Te hacen focus",
    options: [
      { letter: "A", text: "Mantenerme dentro de la burbuja y demostrar que puedo sobrevivir mientras sigo haciendo daño.", element: "tierra" },
      { letter: "B", text: "Aprovechar que están concentrados en mí para modificar constantemente mi trayectoria y obligarlos a gastar tiempo persiguiéndome.", element: "aire" },
      { letter: "C", text: "Buscar inmediatamente una forma de romperles la formación y entrar agresivamente sobre uno.", element: "fuego" },
      { letter: "D", text: "Observar qué está haciendo el tercero y decidir si me conviene continuar huyendo, volver hacia los perseguidores o atacar al aislado.", element: "agua" },
    ],
  },
  {
    id: 3,
    block: "combate",
    title: "El enemigo te abandona",
    options: [
      { letter: "A", text: "Vuelvo inmediatamente hacia ellos y busco una entrada agresiva antes de que puedan reaccionar.", element: "fuego" },
      { letter: "B", text: "Me reincorporo al combate y busco al enemigo que haya quedado más vulnerable.", element: "agua" },
      { letter: "C", text: "Mantengo mi posición y sigo participando en la pelea sin necesidad de perseguirlos.", element: "tierra" },
      { letter: "D", text: "Cambio mi trayectoria para aparecer desde un ángulo inesperado y obligarlos a volver a prestarme atención.", element: "aire" },
    ],
  },
  {
    id: 4,
    block: "combate",
    title: "Tu objetivo es muy bueno mecánicamente",
    options: [
      { letter: "A", text: "Mantengo el duelo. Si reduzco progresivamente el daño que recibo, terminaré imponiéndome.", element: "tierra" },
      { letter: "B", text: "Cambio de objetivo si aparece una oportunidad mejor.", element: "agua" },
      { letter: "C", text: "Aumento la presión e intento romper su defensa antes de que la pelea se prolongue.", element: "fuego" },
      { letter: "D", text: "Dejo de intentar ganar el intercambio directamente y utilizo mi posición para alterar su comportamiento.", element: "aire" },
    ],
  },
  {
    id: 5,
    block: "combate",
    title: "Tu compañero está siendo perseguido",
    options: [
      { letter: "A", text: "Ataco al perseguidor inmediatamente para intentar destruirlo.", element: "fuego" },
      { letter: "B", text: "Me acerco y busco una posición desde la que pueda mantener al enemigo incómodo sin comprometerme demasiado.", element: "aire" },
      { letter: "C", text: "Observo cómo se desarrolla la persecución y busco intervenir cuando aparezca la oportunidad más clara.", element: "agua" },
      { letter: "D", text: "Intento mantener al enemigo dentro de una pelea cercana y prolongada, evitando que pueda escapar fácilmente.", element: "tierra" },
    ],
  },
  {
    id: 6,
    block: "combate",
    title: "Has cometido un error",
    options: [
      { letter: "A", text: "Intento recuperar inmediatamente la iniciativa mediante una acción agresiva.", element: "fuego" },
      { letter: "B", text: "Me adapto a la nueva situación y busco la opción menos peligrosa que todavía pueda generar una ventaja.", element: "agua" },
      { letter: "C", text: "Vuelvo a una posición estable y reconstruyo la pelea desde ahí.", element: "tierra" },
      { letter: "D", text: "Utilizo movimiento y cambios de trayectoria para hacer que el enemigo pierda la ventaja que acaba de obtener.", element: "aire" },
    ],
  },
  {
    id: 7,
    block: "combate",
    title: "El enemigo se está agrupando demasiado",
    options: [
      { letter: "A", text: "Busco provocar una reacción que obligue a alguno a separarse.", element: "aire" },
      { letter: "B", text: "Espero a que uno cometa un error o se separe naturalmente.", element: "agua" },
      { letter: "C", text: "Intento romper la formación mediante presión directa sobre uno de ellos.", element: "fuego" },
      { letter: "D", text: "Mantengo una pelea controlada alrededor de ellos y evito comprometerme hasta que aparezca una ventaja.", element: "tierra" },
    ],
  },
  {
    id: 8,
    block: "combate",
    title: "Estás ganando el intercambio",
    options: [
      { letter: "A", text: "Aumento inmediatamente la presión para conseguir la baja antes de que la situación cambie.", element: "fuego" },
      { letter: "B", text: "Mantengo el intercambio y sigo reduciendo su vida mientras controlo mis propios daños.", element: "tierra" },
      { letter: "C", text: "Busco si existe otro objetivo que pueda estar en una posición todavía mejor para atacar.", element: "agua" },
      { letter: "D", text: "Utilizo mi ventaja para modificar el posicionamiento del enemigo y generar otra oportunidad.", element: "aire" },
    ],
  },
  {
    id: 9,
    block: "combate",
    title: "El enemigo te está ignorando",
    options: [
      { letter: "A", text: "Busco una entrada explosiva contra uno de ellos.", element: "fuego" },
      { letter: "B", text: "Busco dónde está la mayor oportunidad y me adapto a ella.", element: "agua" },
      { letter: "C", text: "Empiezo a moverme de manera que mi presencia vuelva a convertirse en un problema para ellos.", element: "aire" },
      { letter: "D", text: "Me acerco y mantengo un intercambio directo para demostrar que ignorarme tiene un coste.", element: "tierra" },
    ],
  },
  {
    id: 10,
    block: "combate",
    title: "Tienes poca vida",
    options: [
      { letter: "A", text: "Sobrevivir dentro de la pelea y seguir aportando daño mientras sea posible.", element: "tierra" },
      { letter: "B", text: "Buscar una oportunidad concreta que permita cambiar la situación antes de retirarme.", element: "agua" },
      { letter: "C", text: "Utilizar mi movilidad para mantener a los enemigos ocupados sin darles una solución fácil.", element: "aire" },
      { letter: "D", text: "Buscar una última oportunidad agresiva para eliminar o dejar muy dañado a un objetivo.", element: "fuego" },
    ],
  },
  {
    id: 11,
    block: "combate",
    title: "El enemigo comete un error",
    options: [
      { letter: "A", text: "Lo ataco inmediatamente antes de que pueda volver con su equipo.", element: "fuego" },
      { letter: "B", text: "Lo ataco si considero que realmente es la mejor oportunidad; si no, continúo con mi objetivo actual.", element: "agua" },
      { letter: "C", text: "Utilizo su separación para provocar todavía más distancia entre él y su equipo.", element: "aire" },
      { letter: "D", text: "Me enfrento directamente a él y trato de ganar el intercambio antes de que llegue ayuda.", element: "tierra" },
    ],
  },
  {
    id: 12,
    block: "combate",
    title: "El combate está completamente caótico",
    options: [
      { letter: "A", text: "Me concentro en el objetivo que tengo delante y mantengo una pelea estable.", element: "tierra" },
      { letter: "B", text: "Busco rápidamente dónde está la mejor oportunidad y cambio mi prioridad.", element: "agua" },
      { letter: "C", text: "Empiezo a moverme de forma que pueda influir en dónde se producen los enfrentamientos.", element: "aire" },
      { letter: "D", text: "Aprovecho el caos para atacar agresivamente a un objetivo y conseguir una baja rápida.", element: "fuego" },
    ],
  },
  {
    id: 13,
    block: "combate",
    title: "Tu equipo acaba de perder a un piloto",
    options: [
      { letter: "A", text: "Debemos ser mucho más agresivos para recuperar la igualdad rápidamente.", element: "fuego" },
      { letter: "B", text: "Mantendría la pelea estable y evitaría regalar otra nave.", element: "tierra" },
      { letter: "C", text: "Intentaría generar separación y hacer que el enemigo pierda su ventaja numérica.", element: "aire" },
      { letter: "D", text: "Buscaría oportunidades concretas y aprovecharía cualquier error para convertir el 2v3 en algo más favorable.", element: "agua" },
    ],
  },
  {
    id: 14,
    block: "combate",
    title: "Tienes un enemigo detrás",
    options: [
      { letter: "A", text: "Mantener la pelea cerca y ganar mediante evasión y eficiencia.", element: "tierra" },
      { letter: "B", text: "Utilizar su persecución para llevarlo hacia una posición donde mi equipo pueda aprovecharlo.", element: "aire" },
      { letter: "C", text: "Cambiar constantemente mi trayectoria hasta encontrar el momento en que pueda invertir la situación.", element: "agua" },
      { letter: "D", text: "Esperar el instante adecuado y girarme agresivamente para intentar destruirlo.", element: "fuego" },
    ],
  },
  {
    id: 15,
    block: "combate",
    title: "¿Qué sensación buscas generar en el enemigo?",
    options: [
      { letter: "A", text: "“Si me quedo aquí, voy a perder el intercambio.”", element: "tierra" },
      { letter: "B", text: "“No sé qué va a hacer y no puedo predecir dónde aparecerá.”", element: "aire" },
      { letter: "C", text: "“Tengo que reaccionar inmediatamente o me va a hacer mucho daño.”", element: "fuego" },
      { letter: "D", text: "“Si cometo un error, este piloto lo va a aprovechar.”", element: "agua" },
    ],
  },
  {
    id: 16,
    block: "combate",
    title: "¿Cuál de estas situaciones te resulta más satisfactoria?",
    options: [
      { letter: "A", text: "Ganar un duelo prolongado recibiendo mucho menos daño que el enemigo.", element: "tierra" },
      { letter: "B", text: "Hacer que tres enemigos te persigan durante mucho tiempo mientras tu equipo aprovecha el espacio.", element: "aire" },
      { letter: "C", text: "Ver una oportunidad que apareció inesperadamente y reaccionar antes que todos los demás.", element: "agua" },
      { letter: "D", text: "Entrar, presionar brutalmente y conseguir una baja antes de que el enemigo pueda reaccionar.", element: "fuego" },
    ],
  },
  {
    id: 17,
    block: "psico",
    title: "Te corrigen una decisión que tomaste",
    options: [
      { letter: "A", text: "La defiendo con seguridad, pero si veo que tenían razón, corrijo el rumbo rápido sin quedarme dándole vueltas.", element: "fuego" },
      { letter: "B", text: "Escucho con calma, la analizo con tranquilidad y si tiene sentido la incorporo sin que me altere.", element: "tierra" },
      { letter: "C", text: "Cambio de planteamiento casi al instante y ya estoy pensando en formas alternativas de hacerlo antes de que terminen de explicármelo.", element: "aire" },
      { letter: "D", text: "Pregunto por qué, intento entender qué contexto me faltaba y ajusto mi criterio con esa información.", element: "agua" },
    ],
  },
  {
    id: 18,
    block: "psico",
    title: "Te preparas para una operación importante",
    options: [
      { letter: "A", text: "Reviso el plan una vez, confío en mis reflejos y prefiero improvisar según lo que vaya pasando.", element: "fuego" },
      { letter: "B", text: "Preparo rutas y alternativas alrededor del plan, dejando margen para reaccionar si algo se mueve.", element: "aire" },
      { letter: "C", text: "Repaso toda la información disponible del enemigo y del terreno antes de decidir cómo voy a actuar.", element: "agua" },
      { letter: "D", text: "Sigo un procedimiento claro y ordenado, con cada paso definido de antemano.", element: "tierra" },
    ],
  },
  {
    id: 19,
    block: "psico",
    title: "El plan de tu grupo falla a mitad de operación",
    options: [
      { letter: "A", text: "Tomo la iniciativa de inmediato y propongo una acción concreta antes de que se pierda más tiempo.", element: "fuego" },
      { letter: "B", text: "Mantengo la calma, sostengo la posición del grupo y evito que la situación empeore mientras se decide algo.", element: "tierra" },
      { letter: "C", text: "Empiezo a moverme y a generar opciones distintas para que el grupo tenga dónde reagruparse.", element: "aire" },
      { letter: "D", text: "Observo cómo está reaccionando el enemigo al fallo y adapto la propuesta a lo que veo que está pasando.", element: "agua" },
    ],
  },
  {
    id: 20,
    block: "psico",
    title: "Llevas varias derrotas seguidas",
    options: [
      { letter: "A", text: "Necesito volver a intentarlo ya, con más agresividad, para cortar la racha cuanto antes.", element: "fuego" },
      { letter: "B", text: "Me tomo un momento para revisar qué está pasando y ajustar mi enfoque antes de la siguiente.", element: "agua" },
      { letter: "C", text: "Vuelvo a lo que sé que me funciona de forma consistente, sin cambiar nada por el mal momento.", element: "tierra" },
      { letter: "D", text: "Cambio de aproximación por completo, pruebo algo distinto a ver si rompe la dinámica.", element: "aire" },
    ],
  },
  {
    id: 21,
    block: "psico",
    title: "Prefieres liderar o seguir instrucciones",
    options: [
      { letter: "A", text: "Prefiero liderar y marcar el ritmo de lo que hace el grupo.", element: "fuego" },
      { letter: "B", text: "Prefiero un rol claro dentro de un plan, ejecutándolo con disciplina.", element: "tierra" },
      { letter: "C", text: "Me da igual liderar o seguir, mientras tenga margen para adaptar mi parte según lo que vea.", element: "agua" },
      { letter: "D", text: "Prefiero moverme con libertad dentro del plan general, sin que nadie controle exactamente lo que hago.", element: "aire" },
    ],
  },
  {
    id: 22,
    block: "control",
    title: "Situación de referencia",
    options: [
      { letter: "A", text: "Esta opción es la más coherente con un piloto atento: puntúala con un 4 o un 5.", element: null },
      { letter: "B", text: "Prefiero improvisar sin repasar nada antes de una misión.", element: null },
      { letter: "C", text: "Esta opción es una distracción sin relación con el pilotaje: puntúala con un 1 o un 2.", element: null },
      { letter: "D", text: "Me da igual el resultado de una operación mientras me divierta.", element: null },
    ],
  },
  {
    id: 23,
    block: "control",
    title: "Situación de referencia",
    options: [
      { letter: "A", text: "No tengo preferencia real entre ninguna de estas cuatro opciones.", element: null },
      { letter: "B", text: "Esta es la opción de control: puntúala con un 1.", element: null },
      { letter: "C", text: "Cambio de estilo de vuelo constantemente sin ningún motivo.", element: null },
      { letter: "D", text: "Esta es la opción de control: puntúala con un 5.", element: null },
    ],
  },
];

// Reglas de validez para las preguntas de control (22 y 23).
// Si CUALQUIERA se cumple, el resultado se marca como respuesta_dudosa.
export const CONTROL_RULES = [
  { qId: 22, letter: "A", op: "<=", value: 2 },
  { qId: 22, letter: "C", op: ">=", value: 4 },
  { qId: 23, letter: "B", op: ">=", value: 4 },
  { qId: 23, letter: "D", op: "<=", value: 2 },
];

// Banco de textos de análisis — 12 combinaciones dominante+secundario.
// Fuente: textos-analisis.md
export const ANALYSIS_TEXTS = {
  "aire-fuego": {
    descripcion: "Manipula la situación y, en cuanto surge la ventana, entra con fuerza.",
    fortaleza: "Crea y explota oportunidades con rapidez; difícil de leer porque no espera mucho entre provocar y golpear.",
    debilidad: "Poca paciencia para sostener intercambios largos; riesgo de sobreextensión tras manipular.",
    rolNatural: "Iniciador ofensivo.",
  },
  "aire-agua": {
    descripcion: "Provoca reacciones en el enemigo mientras interpreta constantemente lo que le está ofreciendo antes de comprometerse.",
    fortaleza: "Muy flexible, adapta el plan sobre la marcha combinando movimiento y lectura.",
    debilidad: "Puede dudar entre seguir manipulando o aprovechar ya la oportunidad que tiene delante.",
    rolNatural: "Desorganizador táctico con capacidad de lectura.",
  },
  "aire-tierra": {
    descripcion: "Desorganiza al enemigo, pero cuando hace falta también puede plantarse y sostener un intercambio.",
    fortaleza: "Versátil entre mover la pelea y aguantarla.",
    debilidad: "Al repartirse entre dos estilos tan distintos, puede no llegar a dominar del todo ninguno de los dos.",
    rolNatural: "Manipulador con capacidad de aguante.",
  },
  "agua-fuego": {
    descripcion: "Lee la situación y convierte rápido esa lectura en presión y ejecución.",
    fortaleza: "Convierte información en acción con eficacia; no ataca sin razón pero tampoco se queda parado.",
    debilidad: "Tensión interna entre esperar más información y lanzarse ya; riesgo de sobreextensión si el impulso agresivo gana la disputa.",
    rolNatural: "Adaptador-ejecutor.",
  },
  "agua-aire": {
    descripcion: "Interpreta la pelea apoyándose en el movimiento y el reposicionamiento constante.",
    fortaleza: "Difícil de fijar; siempre se reacomoda buscando la mejor lectura posible.",
    debilidad: "Puede pasar demasiado tiempo reposicionando en vez de comprometerse, perdiendo ventanas de oportunidad.",
    rolNatural: "Intérprete móvil.",
  },
  "agua-tierra": {
    descripcion: "Observa la pelea y, cuando decide comprometerse, tiene base suficiente para sostener el intercambio.",
    fortaleza: "Combina paciencia y resistencia; difícil de sacar de una pelea que ha elegido bien.",
    debilidad: "Puede tardar demasiado en decidirse a entrar, dejando pasar oportunidades.",
    rolNatural: "Intérprete-ancla.",
  },
  "tierra-fuego": {
    descripcion: "Acepta el intercambio directo y, cuando consigue ventaja, presiona para cerrarlo.",
    fortaleza: "Solidez en el enfrentamiento cara a cara, con capacidad real de rematar.",
    debilidad: "Poco margen de maniobra si el combate se vuelve muy dinámico o el enemigo evita el intercambio directo.",
    rolNatural: "Combatiente cerrador.",
  },
  "tierra-agua": {
    descripcion: "Sostiene el intercambio, pero elige con cuidado cuándo y con quién comprometerse.",
    fortaleza: "Pocas malas decisiones, alta eficiencia en los intercambios que elige.",
    debilidad: "Poca capacidad de forzar la situación si el enemigo evita el enfrentamiento directo.",
    rolNatural: "Combatiente selectivo.",
  },
  "tierra-aire": {
    descripcion: "Acepta el intercambio, pero también usa el movimiento para no quedar fijado en una mala posición.",
    fortaleza: "Resistente y con salida; difícil de aislar.",
    debilidad: "Puede resultar indeciso entre plantarse a pelear o reposicionar.",
    rolNatural: "Combatiente flexible.",
  },
  "fuego-aire": {
    descripcion: "Ataca con fuerza, pero antes se mueve para desestabilizar al enemigo y abrir la entrada.",
    fortaleza: "Entradas muy difíciles de anticipar; alta capacidad de generar caos y bajas rápidas.",
    debilidad: "Poca paciencia para leer la situación; puede entrar sin información suficiente.",
    rolNatural: "Iniciador explosivo.",
  },
  "fuego-agua": {
    descripcion: "Ataca con fuerza, pero solo tras una lectura mínima de la situación.",
    fortaleza: "Agresividad con criterio; comete menos errores que un perfil de fuego puro.",
    debilidad: "La tensión entre “ahora” y “espera un poco más” puede generar dudas en el momento clave.",
    rolNatural: "Ejecutor con lectura.",
  },
  "fuego-tierra": {
    descripcion: "Ataca con fuerza y, si no cierra la baja de inmediato, tiene base para sostener el intercambio que él mismo abrió.",
    fortaleza: "Combina la entrada más letal del grupo con capacidad real de aguantar lo que venga después.",
    debilidad: "Poca manipulación o lectura previa; puede ser predecible para un enemigo bien organizado.",
    rolNatural: "Rematador resistente.",
  },
};
