// Datos del test de perfil táctico v2 — APEX SYNDICATE
// Fuente: test-pilotos-apex-syndicate.md (formato MÁS/MENOS, 6 rasgos)

export const TRAITS = ["rie", "cau", "coo", "dis", "ini", "lid"];

export const TRAIT_LABELS = {
  rie: "Riesgo",
  cau: "Cautela",
  coo: "Cooperación",
  dis: "Disciplina",
  ini: "Iniciativa",
  lid: "Liderazgo",
};

// Mismos iconos que usa el monstruo elemental — consistencia visual
// entre el radar y la representación animada.
export const TRAIT_ICONS = {
  rie: "🔥",
  cau: "💧",
  coo: "🌿",
  dis: "🪨",
  ini: "⚡",
  lid: "🌬️",
};

export const QUESTIONS = [
  {
    id: 1,
    title: "Vas en solitario. Ves una nave enemiga con el escudo al 20%, sin refuerzos suyos a menos de 5km, huyendo hacia zona segura.",
    options: [
      { letter: "A", text: "Acelero y la persigo hasta rematarla", trait: "rie" },
      { letter: "B", text: "Marco su posición en el chat de la org y sigo mi ruta", trait: "dis" },
      { letter: "C", text: "La dejo ir, no era mi objetivo", trait: "cau" },
      { letter: "D", text: "Le corto la ruta de escape calculando su trayectoria", trait: "ini" },
    ],
  },
  {
    id: 2,
    title: "Tu escudo está al 15%, sin munición de contramedidas, y un aliado con el 60% de vida te pide cobertura mientras él se repliega.",
    options: [
      { letter: "A", text: "Me quedo a cubrirlo aunque pierda la nave", trait: "coo" },
      { letter: "B", text: "Cubro mientras me repliego yo también, sin plantarme", trait: "cau" },
      { letter: "C", text: "Escapo, ya evaluaré después cómo ayudar", trait: "rie" },
      { letter: "D", text: "Pido instrucciones al líder de squad antes de decidir", trait: "dis" },
    ],
  },
  {
    id: 3,
    title: "En las últimas 5 misiones de squad, ¿qué ha pasado más veces cuando el plan se ha roto a mitad de combate?",
    options: [
      { letter: "A", text: "He tomado el mando y dado nuevas órdenes sin que nadie me lo pidiera", trait: "lid" },
      { letter: "B", text: "He seguido intentando cumplir el plan original", trait: "dis" },
      { letter: "C", text: "He improvisado por mi cuenta sin avisar al resto", trait: "ini" },
      { letter: "D", text: "He esperado instrucciones de quien lidera", trait: "coo" },
    ],
  },
  {
    id: 4,
    title: "Detectas a un enemigo aislado, pero tu munición está al 25% y el objetivo real de la misión es otro, a 8km de ahí.",
    options: [
      { letter: "A", text: "Voy a por él, una kill segura no se desprecia", trait: "rie" },
      { letter: "B", text: "Sigo hacia el objetivo real, no me desvío", trait: "dis" },
      { letter: "C", text: "Aviso al squad por si alguien más cercano quiere ir", trait: "coo" },
      { letter: "D", text: "Evalúo si puedo cazarlo rápido y volver a la ruta", trait: "ini" },
    ],
  },
  {
    id: 5,
    title: "Con qué frecuencia, en los últimos combates de squad, has sido tú quien ha dado la orden de retirada (reagroup).",
    options: [
      { letter: "A", text: "Casi siempre, suelo decidirlo yo", trait: "lid" },
      { letter: "B", text: "A veces, si veo que nadie más lo hace", trait: "ini" },
      { letter: "C", text: "Rara vez, espero a que otro lo decida", trait: "coo" },
      { letter: "D", text: "Nunca, sigo hasta que se acaba el combate o me destruyen", trait: "rie" },
    ],
  },
  {
    id: 6,
    title: "Tu nave nodriza (Carrack, Caterpillar, etc.) está siendo escoltada por ti. Un enemigo la ataca mientras otro te distrae a ti en paralelo.",
    options: [
      { letter: "A", text: "Ignoro al que me distrae y me centro en proteger la nodriza", trait: "coo" },
      { letter: "B", text: "Neutralizo primero al que me ataca, luego voy a la nodriza", trait: "rie" },
      { letter: "C", text: "Reporto la situación y pido apoyo antes de decidir", trait: "dis" },
      { letter: "D", text: "Maniobro para enfrentar a los dos a la vez, aunque sea más arriesgado", trait: "ini" },
    ],
  },
  {
    id: 7,
    title: "Se acaba de perder una nave del squad por una decisión de otro piloto. ¿Qué sueles hacer justo después?",
    options: [
      { letter: "A", text: "Se lo digo directamente, aunque sea incómodo", trait: "lid" },
      { letter: "B", text: "Sigo la misión, ya se hablará en el debrief", trait: "dis" },
      { letter: "C", text: "Reviso si yo pude haber cubierto mejor esa posición", trait: "cau" },
      { letter: "D", text: "No digo nada, no es asunto mío", trait: "coo", inverse: true },
    ],
  },
  {
    id: 8,
    title: "Recibes una orden del líder que no tiene sentido para ti en ese momento del combate.",
    options: [
      { letter: "A", text: "La obedezco igual, no es mi decisión cuestionarla en pleno combate", trait: "dis" },
      { letter: "B", text: "La cuestiono en el chat antes de actuar", trait: "lid" },
      { letter: "C", text: "Hago lo que creo mejor y lo explico después", trait: "ini" },
      { letter: "D", text: "La sigo pero avisando de mi duda por si acaso", trait: "coo" },
    ],
  },
  {
    id: 9,
    title: "Estás minando/recolectando en zona neutral y aparece una nave desconocida acercándose despacio.",
    options: [
      { letter: "A", text: "Sigo trabajando, probablemente no es hostil", trait: "cau", inverse: true },
      { letter: "B", text: "Preparo la huida por si acaso, sin dejar de vigilar", trait: "cau" },
      { letter: "C", text: "Me pongo en posición de combate por si ataca", trait: "rie" },
      { letter: "D", text: "Aviso al squad de la posición antes de que pase nada", trait: "coo" },
    ],
  },
  {
    id: 10,
    title: "En las últimas semanas, ¿con qué frecuencia has cambiado de plan a mitad de una operación de squad por iniciativa propia?",
    options: [
      { letter: "A", text: "Muy a menudo, confío en mi lectura del combate", trait: "ini" },
      { letter: "B", text: "Alguna vez, si la situación lo pedía claramente", trait: "lid" },
      { letter: "C", text: "Casi nunca, prefiero mantener el plan acordado", trait: "dis" },
      { letter: "D", text: "Nunca, sigo lo que decida el resto", trait: "coo" },
    ],
  },
  {
    id: 11,
    title: "Un piloto nuevo en la org comete un error táctico que casi cuesta una nave del squad.",
    options: [
      { letter: "A", text: "Le corrijo ahí mismo, en directo", trait: "lid" },
      { letter: "B", text: "Se lo explico después, en privado", trait: "coo" },
      { letter: "C", text: "No digo nada, aprenderá solo", trait: "cau" },
      { letter: "D", text: "Lo reporto al líder de la org para que lo gestione", trait: "dis" },
    ],
  },
  {
    id: 12,
    title: "Vuelas solo, lejos de donde está el grupo, y detectas una oportunidad de loot/objetivo valioso pero fuera del plan de la misión.",
    options: [
      { letter: "A", text: "Voy a por ello, ya me las apañaré", trait: "rie" },
      { letter: "B", text: "Sigo el plan, no me desvío sin autorización", trait: "dis" },
      { letter: "C", text: "Evalúo riesgo/beneficio rápido y decido solo", trait: "ini" },
      { letter: "D", text: "Pregunto al squad antes de moverme", trait: "coo" },
    ],
  },
  {
    id: 13,
    title: "Durante un combate largo, tu nave empieza a fallar sistemas críticos (motor, escudo).",
    options: [
      { letter: "A", text: "Sigo combatiendo hasta el límite", trait: "rie" },
      { letter: "B", text: "Me repliego en cuanto detecto el primer fallo", trait: "cau" },
      { letter: "C", text: "Informo al squad de mi estado por si necesitan reorganizarse", trait: "coo" },
      { letter: "D", text: "Decido en el momento si sigo o me retiro, sin consultar", trait: "ini" },
    ],
  },
  {
    id: 14,
    title: "El líder de la operación no está disponible (desconectado/AFK) y el squad queda sin dirección clara en pleno combate.",
    options: [
      { letter: "A", text: "Tomo el mando yo mismo", trait: "lid" },
      { letter: "B", text: "Sigo mi propio criterio sin coordinar con nadie", trait: "ini" },
      { letter: "C", text: "Espero a que alguien más tome la iniciativa", trait: "coo" },
      { letter: "D", text: "Sigo el último plan acordado al pie de la letra", trait: "dis" },
    ],
  },
  {
    id: 15,
    title: "Se te asigna una misión de escolta de una nave de carga lenta y sin acción directa esperada.",
    options: [
      { letter: "A", text: "La acepto sin problema, es tan importante como el combate", trait: "coo" },
      { letter: "B", text: "La acepto pero preferiría estar en primera línea", trait: "rie" },
      { letter: "C", text: "La sigo al pie de la letra, protocolo es protocolo", trait: "dis" },
      { letter: "D", text: "Aprovecho los tiempos muertos para explorar alrededores", trait: "ini" },
    ],
  },
  {
    id: 16,
    title: "Últimamente, cuando un plan de squad falla, ¿qué sueles pensar primero?",
    options: [
      { letter: "A", text: "\"¿Qué podría haber hecho distinto yo?\"", trait: "cau" },
      { letter: "B", text: "\"Hay que reorganizar ahora mismo\"", trait: "lid" },
      { letter: "C", text: "\"Voy a resolver esto por mi cuenta\"", trait: "ini" },
      { letter: "D", text: "\"Esperemos instrucciones y no complicarlo más\"", trait: "dis" },
    ],
  },
  {
    id: 17,
    title: "Tienes 2 segundos: puedes rematar a un enemigo con el escudo caído o cubrir a un aliado que está siendo perseguido. No hay tiempo para ambas.",
    options: [
      { letter: "A", text: "Remato al enemigo, la baja es prioridad", trait: "rie" },
      { letter: "B", text: "Cubro al aliado, no dejo a nadie atrás", trait: "coo" },
      { letter: "C", text: "Decido según quién está más cerca de mí en ese instante", trait: "ini" },
      { letter: "D", text: "Sigo el protocolo de la org sobre prioridades de combate", trait: "dis" },
    ],
  },
  {
    id: 18,
    title: "En los últimos meses en la org, ¿qué rol has asumido más veces sin que nadie te lo pidiera?",
    options: [
      { letter: "A", text: "Organizar al grupo antes de una operación", trait: "lid" },
      { letter: "B", text: "Cubrir la retaguardia o proteger a los más débiles", trait: "coo" },
      { letter: "C", text: "Ir por tu cuenta a explorar o buscar objetivos", trait: "ini" },
      { letter: "D", text: "Seguir instrucciones y ejecutar tu parte sin más", trait: "dis" },
    ],
  },
  {
    id: 19,
    title: "Estás solo, lejos de donde está el grupo, con daños moderados y sin apoyo cercano. Aparece una nave enemiga más fuerte que la tuya.",
    options: [
      { letter: "A", text: "La enfrento, prefiero intentarlo", trait: "rie" },
      { letter: "B", text: "Huyo inmediatamente, no hay motivo para arriesgar", trait: "cau" },
      { letter: "C", text: "Intento perderla con maniobras antes que huir en línea recta", trait: "ini" },
      { letter: "D", text: "Pido apoyo por radio mientras maniobro", trait: "coo" },
    ],
  },
  {
    id: 20,
    title: "Terminada una operación de squad, ¿qué sueles hacer?",
    options: [
      { letter: "A", text: "Reviso qué falló y lo comento con el líder", trait: "lid" },
      { letter: "B", text: "Sigo con lo mío, ya se hablará si hace falta", trait: "cau" },
      { letter: "C", text: "Reviso mi propio desempeño en privado", trait: "dis" },
      { letter: "D", text: "Comento con el resto cómo les fue a ellos", trait: "coo" },
    ],
  },
];

// Reglas de rol sugerido — condición sobre rango del rasgo entre los 6
// (alto = top 2, medio = rango 3-4, bajo = bottom 2). El documento
// original solo da la etiqueta y la condición; los blurbs son
// redacción propia siguiendo las reglas de realismo del juego.
export const ROLE_DEFINITIONS = [
  {
    key: "interceptor",
    nombre: "Interceptor / Combate solitario",
    condicion: (tier) => tier.rie === "alto" && tier.ini === "alto",
    blurb: "Vuelas mejor solo que en formación: entras rápido, decides rápido, y no esperas confirmación para comprometerte. Encajas en misiones de caza e interceptación donde la iniciativa vale más que el respaldo.",
  },
  {
    key: "escolta",
    nombre: "Escolta",
    condicion: (tier) => tier.coo === "alto" && (tier.rie === "alto" || tier.rie === "medio"),
    blurb: "Priorizas proteger sobre rematar. Si te toca escoltar una nodriza o cubrir a un aliado en apuros, ahí es donde rindes mejor — te quedas cuando otros se replegarían.",
  },
  {
    key: "lider-escuadron",
    nombre: "Líder de escuadrón",
    condicion: (tier) => tier.lid === "alto" && tier.dis === "alto",
    blurb: "Tomas el mando cuando hace falta y lo haces con orden, no a la brava. El squad tiende a mirarte cuando el plan se rompe en pleno combate.",
  },
  {
    key: "minero-economia",
    nombre: "Minero / Economía",
    condicion: (tier) => tier.cau === "alto" && tier.dis === "alto" && tier.rie === "bajo",
    blurb: "No buscas el enfrentamiento — prefieres el trabajo constante y calculado, sin exponerte por una kill que no necesitas. Rindes mejor en operaciones de recursos que en primera línea.",
  },
  {
    key: "logistica-transporte",
    nombre: "Logística / Transporte",
    condicion: (tier) => tier.cau === "alto" && tier.coo === "alto",
    blurb: "Fiable y precavido a partes iguales: te preocupas por que la carga (o el squad) llegue entera, más que por la acción. El transporte y el apoyo logístico encajan con cómo tomas decisiones.",
  },
  {
    key: "exploracion-recon",
    nombre: "Exploración / Recon",
    condicion: (tier) => tier.ini === "alto" && tier.cau === "medio",
    blurb: "Te mueves bien lejos del grupo, tomando tus propias decisiones sin necesitar que nadie te las confirme, pero sin ser temerario. El reconocimiento y la exploración en solitario son tu terreno natural.",
  },
];
