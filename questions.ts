/**
 * Pasapalabra — Fútbol
 * 27 preguntas en español y armenio con respuestas
 */

export interface QuestionItem {
  id: number;
  letter: string;
  rule: string; // "Empieza por la A" or "Contiene la Ñ"
  ruleArmenian: string; // "Սկսվում է Ա տառով" or "Պարունակում է Ñ"
  spanishQuestion: string;
  armenianQuestion: string;
  answerSpanish: string;
  answerArmenian: string;
  acceptedAnswers: string[];
  explanationEs?: string;
  explanationHy?: string;
}

export const PASAPALABRA_QUESTIONS: QuestionItem[] = [
  {
    id: 1,
    letter: 'A',
    rule: 'Empieza por la A',
    ruleArmenian: 'Սկսվում է A տառով',
    spanishQuestion: '¿Cómo se llama la persona que controla el partido y decide si hay una falta?',
    armenianQuestion: 'Ինչպե՞ս է կոչվում այն մարդը, որը վերահսկում է խաղը և որոշում խախտումները։',
    answerSpanish: 'Árbitro',
    answerArmenian: 'Մրցավար',
    acceptedAnswers: ['arbitro', 'árbitro', 'el arbitro', 'el árbitro', 'referee'],
    explanationEs: 'La máxima autoridad en el terreno de juego, responsable de aplicar las Reglas del Juego.',
    explanationHy: 'Խաղադաշտի գլխավոր պատասխանատուն, ով հետևում է կանոնների պահպանմանը։',
  },
  {
    id: 2,
    letter: 'B',
    rule: 'Empieza por la B',
    ruleArmenian: 'Սկսվում է B տառով',
    spanishQuestion: '¿Qué objeto redondo utilizan los jugadores para marcar goles?',
    armenianQuestion: 'Ի՞նչ կլոր առարկայով են ֆուտբոլիստները գոլ խփում։',
    answerSpanish: 'Balón',
    answerArmenian: 'Գնդակ',
    acceptedAnswers: ['balon', 'balón', 'pelota', 'el balon', 'el balón', 'la pelota'],
    explanationEs: 'El esférico reglamentario con el que se disputa el juego.',
    explanationHy: 'Ֆուտբոլային խաղի հիմնական կլոր առարկան։',
  },
  {
    id: 3,
    letter: 'C',
    rule: 'Empieza por la C',
    ruleArmenian: 'Սկսվում է C տառով',
    spanishQuestion: '¿Cómo se llama el saque que se hace desde la esquina del campo?',
    armenianQuestion: 'Ինչպե՞ս է կոչվում դաշտի անկյունից կատարվող հարվածը։',
    answerSpanish: 'Córner',
    answerArmenian: 'Անկյունային հարված',
    acceptedAnswers: ['corner', 'córner', 'saque de esquina', 'tiro de esquina', 'el corner', 'el córner'],
    explanationEs: 'Reanudación del juego cuando el balón traspasa la línea de fondo impulsado por el equipo defensor.',
    explanationHy: 'Խաղի վերսկսում դաշտի անկյունից, երբ գնդակը հատում է դարպասային գիծը պաշտպանվողից։',
  },
  {
    id: 4,
    letter: 'D',
    rule: 'Empieza por la D',
    ruleArmenian: 'Սկսվում է D տառով',
    spanishQuestion: '¿Cómo se llama el jugador que intenta impedir que el rival marque un gol?',
    armenianQuestion: 'Ինչպե՞ս է կոչվում այն խաղացողը, որը փորձում է թույլ չտալ մրցակցին գոլ խփել։',
    answerSpanish: 'Defensa',
    answerArmenian: 'Պաշտպան',
    acceptedAnswers: ['defensa', 'defensor', 'el defensa', 'el defensor', 'zaguero'],
    explanationEs: 'Línea de contención y protección situada por delante del guardameta.',
    explanationHy: 'Դարպասապահից առաջ տեղակայված ֆուտբոլիստ, որը կանխում է մրցակցի գրոհները։',
  },
  {
    id: 5,
    letter: 'E',
    rule: 'Empieza por la E',
    ruleArmenian: 'Սկսվում է E տառով',
    spanishQuestion: '¿Quién prepara al equipo, organiza los entrenamientos y decide la táctica?',
    armenianQuestion: 'Ո՞վ է պատրաստում թիմին, կազմակերպում մարզումները և որոշում մարտավարությունը։',
    answerSpanish: 'Entrenador',
    answerArmenian: 'Մարզիչ',
    acceptedAnswers: ['entrenador', 'el entrenador', 'tecnico', 'técnico', 'mister', 'director tecnico', 'director técnico'],
    explanationEs: 'El estratega responsable del planteamiento deportivo del conjunto.',
    explanationHy: 'Թիմի մարտավարության և մարզումների գլխավոր ղեկավարը։',
  },
  {
    id: 6,
    letter: 'F',
    rule: 'Empieza por la F',
    ruleArmenian: 'Սկսվում է F տառով',
    spanishQuestion: '¿Cómo se llama una infracción de las reglas durante un partido?',
    armenianQuestion: 'Ինչպե՞ս է կոչվում խաղի կանոնների խախտումը։',
    answerSpanish: 'Falta',
    answerArmenian: 'Խախտում',
    acceptedAnswers: ['falta', 'infraccion', 'infracción', 'una falta'],
    explanationEs: 'Acción antirreglamentaria sancionada por el árbitro.',
    explanationHy: 'Կանոնադրության խախտում խաղադաշտում, որը պատժվում է մրցավարի սուլիչով։',
  },
  {
    id: 7,
    letter: 'G',
    rule: 'Empieza por la G',
    ruleArmenian: 'Սկսվում է G տառով',
    spanishQuestion: '¿Qué marca un equipo cuando el balón entra completamente en la portería rival?',
    armenianQuestion: 'Ի՞նչ է գրանցվում, երբ գնդակն ամբողջությամբ մտնում է մրցակցի դարպասը։',
    answerSpanish: 'Gol',
    answerArmenian: 'Գոլ',
    acceptedAnswers: ['gol', 'el gol', 'un gol', 'tanto', 'goles'],
    explanationEs: 'El objetivo primordial del fútbol que suma un punto en el marcador.',
    explanationHy: 'Ֆուտբոլի գլխավոր նպատակը, երբ գնդակը հատում է դարպասի գիծը։',
  },
  {
    id: 8,
    letter: 'H',
    rule: 'Empieza por la H',
    ruleArmenian: 'Սկսվում է H տառով',
    spanishQuestion: '¿Cómo se llama una persona que anima y apoya a su equipo favorito?',
    armenianQuestion: 'Ինչպե՞ս է կոչվում այն մարդը, որը երկրպագում և աջակցում է իր սիրելի թիմին։',
    answerSpanish: 'Hincha',
    answerArmenian: 'Երկրպագու',
    acceptedAnswers: ['hincha', 'el hincha', 'aficionado', 'hinchada', 'aficion', 'afición'],
    explanationEs: 'Seguidor apasionado que alienta desde las gradas o desde casa.',
    explanationHy: 'Ակտիվ համակիր, որն աջակցում է իր սիրելի ֆուտբոլային ակումբին։',
  },
  {
    id: 9,
    letter: 'I',
    rule: 'Empieza por la I',
    ruleArmenian: 'Սկսվում է I տառով',
    spanishQuestion: '¿Cómo se llama la acción de cortar un pase del equipo contrario?',
    armenianQuestion: 'Ինչպե՞ս է կոչվում մրցակցի փոխանցումը ընդհատելու գործողությունը։',
    answerSpanish: 'Intercepción',
    answerArmenian: 'Փոխանցման ընդհատում',
    acceptedAnswers: ['intercepcion', 'intercepción', 'interceptar', 'el corte', 'corte', 'la intercepcion', 'la intercepción'],
    explanationEs: 'Recuperar la posesión anticipándose a la trayectoria del balón.',
    explanationHy: 'Գնդակի խլումը նրա շարժման հետագիծը ժամանակին կտրելով։',
  },
  {
    id: 10,
    letter: 'J',
    rule: 'Empieza por la J',
    ruleArmenian: 'Սկսվում է J տառով',
    spanishQuestion: '¿Cómo se llama una persona que participa en un partido de fútbol?',
    armenianQuestion: 'Ինչպե՞ս է կոչվում ֆուտբոլային հանդիպմանը մասնակցող մարդը։',
    answerSpanish: 'Jugador',
    answerArmenian: 'Խաղացող',
    acceptedAnswers: ['jugador', 'el jugador', 'futbolista', 'el futbolista'],
    explanationEs: 'Deportista integrado en el terreno de juego con su equipo.',
    explanationHy: 'Խաղադաշտում հանդես եկող մարզիկը։',
  },
  {
    id: 11,
    letter: 'K',
    rule: 'Empieza por la K',
    ruleArmenian: 'Սկսվում է K տառով',
    spanishQuestion: '¿Cuál es el nombre del famoso futbolista francés cuyo apellido es Mbappé?',
    armenianQuestion: 'Ինչպե՞ս է ֆրանսիացի հայտնի ֆուտբոլիստ Մբապեի անունը։',
    answerSpanish: 'Kylian',
    answerArmenian: 'Կիլիան',
    acceptedAnswers: ['kylian', 'kilian', 'kylian mbappe', 'kilian mbappe', 'mbappe'],
    explanationEs: 'Kylian Mbappé, campeón del mundo con Francia y estrella internacional.',
    explanationHy: 'Կիլիան Մբապե՝ Ֆրանսիայի հավաքականի աշխարհի չեմպիոն և աստղային հարձակվող։',
  },
  {
    id: 12,
    letter: 'L',
    rule: 'Empieza por la L',
    ruleArmenian: 'Սկսվում է L տառով',
    spanishQuestion: '¿Cómo se llama la barra horizontal de la portería?',
    armenianQuestion: 'Ինչպե՞ս է կոչվում դարպասի վերին հորիզոնական ձողը։',
    answerSpanish: 'Larguero',
    answerArmenian: 'Դարպասի հորիզոնական ձող',
    acceptedAnswers: ['larguero', 'el larguero', 'travesano', 'travesaño', 'el travesaño', 'palo'],
    explanationEs: 'Madero o barra superior que une los dos postes verticales de la meta.',
    explanationHy: 'Դարպասի վերին ձողը, որը միացնում է երկու ուղղահայաց սյուները։',
  },
  {
    id: 13,
    letter: 'M',
    rule: 'Empieza por la M',
    ruleArmenian: 'Սկսվում է M տառով',
    spanishQuestion: '¿Cómo se llama el jugador que actúa principalmente en el centro del campo?',
    armenianQuestion: 'Ինչպե՞ս է կոչվում հիմնականում դաշտի կենտրոնում խաղացող ֆուտբոլիստը։',
    answerSpanish: 'Mediocampista',
    answerArmenian: 'Կիսապաշտպան',
    acceptedAnswers: ['mediocampista', 'centrocampista', 'el mediocampista', 'el centrocampista', 'medio'],
    explanationEs: 'Eslabón que conecta la defensa con el ataque y distribuye el juego.',
    explanationHy: 'Դաշտի կենտրոնական հատվածի խաղացողը, ով կապում է պաշտպանությունն ու հարձակումը։',
  },
  {
    id: 14,
    letter: 'N',
    rule: 'Empieza por la N',
    ruleArmenian: 'Սկսվում է N տառով',
    spanishQuestion: '¿Qué número se asocia tradicionalmente con el delantero centro?',
    armenianQuestion: 'Ո՞ր համարն է ավանդաբար կապված կենտրոնական հարձակվողի հետ։',
    answerSpanish: 'Nueve',
    answerArmenian: 'Ինը',
    acceptedAnswers: ['nueve', 'el nueve', '9', 'el 9'],
    explanationEs: 'El dorsal clásico del goleador nato de área.',
    explanationHy: 'Գլխավոր հարձակվողի դասական խաղային համարը։',
  },
  {
    id: 15,
    letter: 'Ñ',
    rule: 'Contiene la Ñ',
    ruleArmenian: 'Պարունակում է Ñ տառը',
    spanishQuestion: '¿Cómo se llama la jugada en la que un futbolista pasa el balón entre las piernas de un rival?',
    armenianQuestion: 'Ինչպե՞ս է կոչվում այն հնարքը, երբ ֆուտբոլիստը գնդակն անցկացնում է մրցակցի ոտքերի արանքով։',
    answerSpanish: 'Caño',
    answerArmenian: 'Գնդակը ոտքերի արանքով անցկացնելու հնարք',
    acceptedAnswers: ['cano', 'caño', 'el cano', 'el caño', 'tunel', 'túnel', 'sotana'],
    explanationEs: 'Regate vistoso y humillante también conocido como túnel.',
    explanationHy: 'Տեխնիկական հնարք, երբ գնդակն անցկացվում է մրցակցի ոտքերի միջով։',
  },
  {
    id: 16,
    letter: 'O',
    rule: 'Empieza por la O',
    ruleArmenian: 'Սկսվում է O տառով',
    spanishQuestion: '¿Cuántos jugadores tiene normalmente cada equipo en el campo al empezar un partido?',
    armenianQuestion: 'Քանի՞ ֆուտբոլիստ է սովորաբար յուրաքանչյուր թիմ ունենում դաշտում խաղի սկզբում։',
    answerSpanish: 'Once',
    answerArmenian: 'Տասնմեկ',
    acceptedAnswers: ['once', '11', 'el once', 'los once'],
    explanationEs: 'La alineación titular estándar de cada conjunto (10 jugadores + 1 portero).',
    explanationHy: 'Յուրաքանչյուր թիմի մեկնարկային կազմի ֆուտբոլիստների քանակը (10 դաշտային + 1 դարպասապահ)։',
  },
  {
    id: 17,
    letter: 'P',
    rule: 'Empieza por la P',
    ruleArmenian: 'Սկսվում է P տառով',
    spanishQuestion: '¿Cómo se llama el lanzamiento que se realiza desde los once metros como castigo por ciertas faltas?',
    armenianQuestion: 'Ինչպե՞ս է կոչվում որոշ խախտումների համար նշանակվող 11 մետրանոց հարվածը։',
    answerSpanish: 'Penalti',
    answerArmenian: '11 մետրանոց հարված',
    acceptedAnswers: ['penalti', 'penalty', 'penal', 'el penalti', 'el penal', 'tiro penal'],
    explanationEs: 'Tiro de castigo directo ejecutado desde el punto fatídico situado a 11 metros.',
    explanationHy: 'Տուգանային հրապարակում խախտման համար նշանակվող 11 մետրանոց հարվածը։',
  },
  {
    id: 18,
    letter: 'Q',
    rule: 'Empieza por la Q',
    ruleArmenian: 'Սկսվում է Q տառով',
    spanishQuestion: '¿Qué verbo significa recuperar el balón arrebatándoselo a un rival?',
    armenianQuestion: 'Ո՞ր բայն է նշանակում մրցակցից գնդակը խլել։',
    answerSpanish: 'Quitar',
    answerArmenian: 'Խլել',
    acceptedAnswers: ['quitar', 'quitar el balon', 'quitarlo', 'robar', 'recuperar'],
    explanationEs: 'Acción defensiva para despojar del balón al adversario de forma limpia.',
    explanationHy: 'Պաշտպանական գործողություն՝ մրցակցից գնդակը խլելու համար։',
  },
  {
    id: 19,
    letter: 'R',
    rule: 'Empieza por la R',
    ruleArmenian: 'Սկսվում է R տառով',
    spanishQuestion: '¿Cómo se llama un golpeo del balón dirigido hacia la portería para intentar marcar?',
    armenianQuestion: 'Ինչպե՞ս է կոչվում գոլ խփելու նպատակով դարպասի ուղղությամբ կատարված հարվածը։',
    answerSpanish: 'Remate',
    answerArmenian: 'Հարված դարպասին',
    acceptedAnswers: ['remate', 'el remate', 'tiro', 'disparo', 'chut', 'rematar'],
    explanationEs: 'Envío intencionado del esférico hacia los tres palos buscando el gol.',
    explanationHy: 'Գնդակի ուղղորդված հարված դարպասի ուղղությամբ։',
  },
  {
    id: 20,
    letter: 'S',
    rule: 'Empieza por la S',
    ruleArmenian: 'Սկսվում է S տառով',
    spanishQuestion: '¿Cómo se llama la acción de poner el balón en juego después de una interrupción?',
    armenianQuestion: 'Ինչպե՞ս է կոչվում ընդհատումից հետո գնդակը խաղի մեջ մտցնելու գործողությունը։',
    answerSpanish: 'Saque',
    answerArmenian: 'Գնդակը խաղի մեջ մտցնելը',
    acceptedAnswers: ['saque', 'el saque', 'saque de banda', 'saque de centro', 'poner en juego'],
    explanationEs: 'Puesta en marcha reglamentaria de la pelota tras detenerse el juego.',
    explanationHy: 'Դադարից հետո գնդակը կանոնակարգով նորից խաղի մեջ ներգրավելը։',
  },
  {
    id: 21,
    letter: 'T',
    rule: 'Empieza por la T',
    ruleArmenian: 'Սկսվում է T տառով',
    spanishQuestion: '¿Qué muestra el árbitro para amonestar o expulsar a un jugador?',
    armenianQuestion: 'Ի՞նչ է ցույց տալիս մրցավարը խաղացողին զգուշացնելու կամ հեռացնելու համար։',
    answerSpanish: 'Tarjeta',
    answerArmenian: 'Քարտ',
    acceptedAnswers: ['tarjeta', 'la tarjeta', 'tarjeta amarilla', 'tarjeta roja', 'cartulina'],
    explanationEs: 'Cartulina de color (amarilla o roja) que sanciona disciplinariamente una conducta.',
    explanationHy: 'Դեղին կամ կարմիր գունավոր քարտ՝ խաղացողին նախազգուշացնելու կամ դաշտից հեռացնելու համար։',
  },
  {
    id: 22,
    letter: 'U',
    rule: 'Empieza por la U',
    ruleArmenian: 'Սկսվում է U տառով',
    spanishQuestion: '¿Cómo se llama la ropa que llevan los jugadores de un mismo equipo?',
    armenianQuestion: 'Ինչպե՞ս է կոչվում նույն թիմի ֆուտբոլիստների հագուստը։',
    answerSpanish: 'Uniforme',
    answerArmenian: 'Մարզահագուստ',
    acceptedAnswers: ['uniforme', 'el uniforme', 'equipacion', 'equipación', 'camiseta', 'la equipacion', 'la equipación'],
    explanationEs: 'Indumentaria oficial distintiva compuesta por camiseta, pantalón y medias.',
    explanationHy: 'Թիմի միասնական մարզական հագուստը (մարզաշապիկ, վարտիք, գետրեր)։',
  },
  {
    id: 23,
    letter: 'V',
    rule: 'Empieza por la V',
    ruleArmenian: 'Սկսվում է V տառով',
    spanishQuestion: '¿Cómo se llama el resultado cuando un equipo gana un partido?',
    armenianQuestion: 'Ինչպե՞ս է կոչվում արդյունքը, երբ թիմը հաղթում է խաղում։',
    answerSpanish: 'Victoria',
    answerArmenian: 'Հաղթանակ',
    acceptedAnswers: ['victoria', 'la victoria', 'triunfo', 'el triunfo', 'ganar'],
    explanationEs: 'Éxito deportivo que concede habitualmente los tres puntos.',
    explanationHy: 'Խաղի դրական ելքը, երբ թիմը գերազանցում է մրցակցին և շահում միավորներ։',
  },
  {
    id: 24,
    letter: 'W',
    rule: 'Empieza por la W',
    ruleArmenian: 'Սկսվում է W տառով',
    spanishQuestion: '¿Cómo se llama el famoso estadio de Londres donde se juegan grandes finales?',
    armenianQuestion: 'Ինչպե՞ս է կոչվում Լոնդոնի հայտնի մարզադաշտը, որտեղ անցկացվում են կարևոր եզրափակիչներ։',
    answerSpanish: 'Wembley',
    answerArmenian: 'Ուեմբլի',
    acceptedAnswers: ['wembley', 'estadio wembley', 'estadio de wembley', 'wembley stadium'],
    explanationEs: 'Catedral del fútbol inglés y sede histórica de finales europeas y mundiales.',
    explanationHy: 'Լոնդոնի լեգենդար մարզադաշտը, որտեղ տեղի են ունենում եզրափակիչ մեծ հանդիպումները։',
  },
  {
    id: 25,
    letter: 'X',
    rule: 'Contiene la X',
    ruleArmenian: 'Պարունակում է X տառը',
    spanishQuestion: '¿Cómo se llama el futbolista o persona nacida en el país azteca que representa a México?',
    armenianQuestion: 'Ինչպե՞ս է կոչվում Մեքսիկան ներկայացնող ֆուտբոլիստը կամ անձը։',
    answerSpanish: 'Mexicano',
    answerArmenian: 'Մեքսիկացի',
    acceptedAnswers: ['mexicano', 'el mexicano', 'despeje', 'el despeje', 'mexicana'],
    explanationEs: 'Nativo de México o jugador que compite por la selección tricolor.',
    explanationHy: 'Մեքսիկայի քաղաքացի կամ Մեքսիկայի հավաքականը ներկայացնող խաղացող։',
  },
  {
    id: 26,
    letter: 'Y',
    rule: 'Empieza por la Y',
    ruleArmenian: 'Սկսվում է Y տառով',
    spanishQuestion: '¿Cómo se apellidaba el mítico portero apodado \'La Araña Negra\', único guardameta en ganar el Balón de Oro?',
    armenianQuestion: 'Ի՞նչ ազգանուն ուներ «Սև սարդ» մականունով լեգենդար դարպասապահը, որը «Ոսկե գնդակ» նվաճած միակ դարպասապահն է։',
    answerSpanish: 'Yashin',
    answerArmenian: 'Յաշին',
    acceptedAnswers: ['yashin', 'lev yashin', 'yasin', 'jaschin', 'iaxin', 'aficion', 'afición', 'leyenda'],
    explanationEs: 'Lev Yashin, leyenda absoluta de la portería galardonado con el Balón de Oro en 1963.',
    explanationHy: 'Լև Յաշին՝ «Ոսկե գնդակին» (1963) արժանացած պատմության միակ դարպասապահը։',
  },
  {
    id: 27,
    letter: 'Z',
    rule: 'Empieza por la Z',
    ruleArmenian: 'Սկսվում է Z տառով',
    spanishQuestion: '¿Cómo se llama la línea de jugadores que defienden la portería de su equipo?',
    armenianQuestion: 'Ինչպե՞ս է կոչվում թիմի դարպասը պաշտպանող ֆուտբոլիստների գիծը։',
    answerSpanish: 'Zaga',
    answerArmenian: 'Պաշտպանական գիծ',
    acceptedAnswers: ['zaga', 'la zaga', 'defensa', 'la defensa', 'zagueros'],
    explanationEs: 'Parte posterior o retaguardia de la formación de un equipo.',
    explanationHy: 'Թիմի պաշտպանական հետնագիծը, որը պաշտպանում է դարպասը։',
  },
];

/**
 * Normalizes input string by removing diacritics, extra spaces, and converting to lowercase
 */
export function normalizeAnswer(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents like á, é, í, ó, ú
    .replace(/[¿?¡!.,;:"'()\-]/g, '') // remove punctuation
    .replace(/\s+/g, ' '); // collapse whitespace
}

/**
 * Checks if the user provided answer matches the correct answer or aliases
 */
export function checkAnswer(userInput: string, question: QuestionItem): boolean {
  const normalizedUser = normalizeAnswer(userInput);
  if (!normalizedUser) return false;

  // Direct check against normalized target answer
  if (normalizedUser === normalizeAnswer(question.answerSpanish)) {
    return true;
  }

  // Check aliases
  for (const alias of question.acceptedAnswers) {
    if (normalizedUser === normalizeAnswer(alias)) {
      return true;
    }
  }

  // Special handling for "caño" / "cano"
  if (question.letter === 'Ñ' && (normalizedUser === 'cano' || normalizedUser === 'cano.' || normalizedUser === 'el cano')) {
    return true;
  }

  return false;
}
