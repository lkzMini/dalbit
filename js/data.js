(function(root,factory){if(typeof module==="object"&&module.exports)module.exports=factory();else (root.Hangul=root.Hangul||{}).Data=factory();})(globalThis,function(){
"use strict";
const UI={es:{learn:"Aprender",practice:"Practicar",road:"Tu recorrido",blk:"Cómo se arma una sílaba",blkT:"Cada bloque Hangul = consonante + vocal (+ consonante final).",vow:"Vocales",con:"Consonantes",keyH:"⌨ = tecla a presionar en un teclado QWERTY normal.",tipsT:"Consejos",next:"Siguiente ▸",listen:"🔊 Escuchar",kb:"Teclado en pantalla",romL:"Romanización",hint:"Escribe con tu teclado físico o toca las teclas. Cada letra (jamo) va en orden; la web arma las sílabas.",err:"Errores",acc:"Precisión",cmp:"Completados",good:"🎉 ¡Excelente!",
road_:["Nivel 1 · Letras: cada vocal y consonante.","Nivel 2 · Palabras: letras unidas en sílabas.","Nivel 3 · Frases: saludos y expresiones diarias.","Nivel 4 · Oraciones: gramática básica en acción.","Nivel 5 · Textos largos: lectura y escritura sostenida."],
tips:["No necesitas teclado coreano instalado: funciona con tu teclado normal.","Usa Shift para ㄲ ㄸ ㅃ ㅆ ㅉ ㅒ ㅖ.","Las vocales compuestas se escriben en dos pasos (ㅘ = ㅗ + ㅏ).","10 minutos diarios valen más que una maratón semanal."]},
en:{learn:"Learn",practice:"Practice",road:"Your learning path",blk:"How a syllable is built",blkT:"Each Hangul block = consonant + vowel (+ final consonant).",vow:"Vowels",con:"Consonants",keyH:"⌨ = key to press on a regular QWERTY keyboard.",tipsT:"Tips",next:"Next ▸",listen:"🔊 Listen",kb:"On-screen keyboard",romL:"Romanization",hint:"Type with your physical keyboard or tap the keys. Type each letter (jamo) in order; the site builds the syllables.",err:"Errors",acc:"Accuracy",cmp:"Completed",good:"🎉 Great job!",
road_:["Level 1 · Letters: every vowel and consonant.","Level 2 · Words: letters joined into syllables.","Level 3 · Phrases: greetings and daily expressions.","Level 4 · Sentences: basic grammar in action.","Level 5 · Long texts: sustained reading and typing."],
tips:["You don't need a Korean keyboard installed: it works with your normal one.","Use Shift for ㄲ ㄸ ㅃ ㅆ ㅉ ㅒ ㅖ.","Compound vowels take two steps (ㅘ = ㅗ + ㅏ).","10 minutes a day beats one weekly marathon."]}};
Object.assign(UI.es,{hT:"Coreano a tu ritmo",hP:"Leé introducciones y ejemplos a tu ritmo; después practicá Hangul con un caminante y un teclado que te guía.",cta:"Empezar a aprender ▸",tap:"Toca el bloque para verlo armarse",alpha:"Alfabeto base",rd:["Vocales y consonantes, una por una.","Letras unidas en sílabas y palabras.","Saludos y expresiones del día a día.","Gramática básica en acción.","Lectura y escritura sostenida."]});
Object.assign(UI.en,{hT:"Korean at your pace",hP:"Read introductions and examples at your own pace; then practice Hangul with a walker and a guided keyboard.",cta:"Start learning ▸",tap:"Tap the block to watch it assemble",alpha:"Starter alphabet",rd:["Vowels and consonants, one by one.","Letters joined into syllables and words.","Greetings and everyday expressions.","Basic grammar in action.","Sustained reading and typing."]});

const DATA=[
  {
    "id": "letters",
    "es": "Letras",
    "en": "Letters",
    "items": [
      {
        "id": "letters-vowels",
        "ko": "ㅏ ㅑ ㅓ ㅕ ㅗ ㅛ ㅜ ㅠ ㅡ ㅣ",
        "roman": "a ya eo yeo o yo u yu eu i",
        "es": "Las 10 vocales básicas",
        "en": "The 10 basic vowels"
      },
      {
        "id": "letters-basic-consonants",
        "ko": "ㄱ ㄴ ㄷ ㄹ ㅁ ㅂ ㅅ ㅇ ㅈ ㅎ",
        "roman": "g n d r m b s ng j h",
        "es": "Consonantes básicas",
        "en": "Basic consonants"
      },
      {
        "id": "letters-aspirated-tense",
        "ko": "ㅋ ㅌ ㅍ ㅊ ㄲ ㄸ ㅃ ㅆ ㅉ",
        "roman": "k t p ch kk tt pp ss jj",
        "es": "Consonantes aspiradas y tensas",
        "en": "Aspirated and tense consonants"
      },
      {
        "id": "letters-syllables",
        "ko": "가 나 다 라 마 바 사 아 자 하",
        "roman": "ga na da ra ma ba sa a ja ha",
        "es": "Primeras sílabas",
        "en": "First syllables"
      },
      {
        "id": "letters-compound-vowels",
        "ko": "ㅐ ㅔ ㅘ ㅝ ㅢ",
        "roman": "ae e wa wo ui",
        "es": "Vocales compuestas",
        "en": "Compound vowels"
      }
    ]
  },
  {
    "id": "words",
    "es": "Palabras",
    "en": "Words",
    "items": [
      {
        "id": "word-tree",
        "ko": "나무",
        "roman": "namu",
        "es": "árbol",
        "en": "tree"
      },
      {
        "id": "word-sea",
        "ko": "바다",
        "roman": "bada",
        "es": "mar",
        "en": "sea"
      },
      {
        "id": "word-apple",
        "ko": "사과",
        "roman": "sagwa",
        "es": "manzana",
        "en": "apple"
      },
      {
        "id": "word-water",
        "ko": "물",
        "roman": "mul",
        "es": "agua",
        "en": "water"
      },
      {
        "id": "word-cat",
        "ko": "고양이",
        "roman": "goyangi",
        "es": "gato",
        "en": "cat"
      },
      {
        "id": "word-school",
        "ko": "학교",
        "roman": "hakgyo",
        "es": "escuela",
        "en": "school"
      },
      {
        "id": "word-korea",
        "ko": "한국",
        "roman": "hanguk",
        "es": "Corea",
        "en": "Korea"
      },
      {
        "id": "word-coffee",
        "ko": "커피",
        "roman": "keopi",
        "es": "café",
        "en": "coffee"
      },
      {
        "id": "word-love",
        "ko": "사랑",
        "roman": "sarang",
        "es": "amor",
        "en": "love"
      },
      {
        "id": "word-friend",
        "ko": "친구",
        "roman": "chingu",
        "es": "amigo/a",
        "en": "friend"
      }
    ]
  },
  {
    "id": "phrases",
    "es": "Frases",
    "en": "Phrases",
    "items": [
      {
        "id": "phrase-hello",
        "ko": "안녕하세요",
        "roman": "annyeonghaseyo",
        "es": "Hola",
        "en": "Hello"
      },
      {
        "id": "phrase-thanks",
        "ko": "감사합니다",
        "roman": "gamsahamnida",
        "es": "Gracias",
        "en": "Thank you"
      },
      {
        "id": "phrase-sorry",
        "ko": "죄송합니다",
        "roman": "joesonghamnida",
        "es": "Lo siento",
        "en": "I'm sorry"
      },
      {
        "id": "phrase-nice-to-meet",
        "ko": "만나서 반갑습니다",
        "roman": "mannaseo bangapseumnida",
        "es": "Mucho gusto",
        "en": "Nice to meet you"
      },
      {
        "id": "phrase-how-are-you",
        "ko": "잘 지내요?",
        "roman": "jal jinaeyo?",
        "es": "¿Cómo estás?",
        "en": "How are you?"
      },
      {
        "id": "phrase-delicious",
        "ko": "맛있어요",
        "roman": "masisseoyo",
        "es": "Está delicioso",
        "en": "It's delicious"
      },
      {
        "id": "phrase-bathroom",
        "ko": "화장실이 어디예요?",
        "roman": "hwajangsiri eodiyeyo?",
        "es": "¿Dónde está el baño?",
        "en": "Where is the bathroom?"
      }
    ]
  },
  {
    "id": "sentences",
    "es": "Oraciones",
    "en": "Sentences",
    "items": [
      {
        "id": "sentence-student",
        "ko": "저는 학생이에요.",
        "roman": "jeoneun haksaengieyo.",
        "es": "Soy estudiante.",
        "en": "I am a student."
      },
      {
        "id": "sentence-study",
        "ko": "저는 한국어를 공부해요.",
        "roman": "jeoneun hangugeoreul gongbuhaeyo.",
        "es": "Estudio coreano.",
        "en": "I study Korean."
      },
      {
        "id": "sentence-weather",
        "ko": "오늘 날씨가 좋아요.",
        "roman": "oneul nalssiga joayo.",
        "es": "Hoy hace buen tiempo.",
        "en": "The weather is nice today."
      },
      {
        "id": "sentence-coffee",
        "ko": "커피 한 잔 주세요.",
        "roman": "keopi han jan juseyo.",
        "es": "Un café, por favor.",
        "en": "One coffee, please."
      },
      {
        "id": "sentence-friend",
        "ko": "내일 친구를 만나요.",
        "roman": "naeil chingureul mannayo.",
        "es": "Mañana veo a un amigo.",
        "en": "I meet a friend tomorrow."
      },
      {
        "id": "sentence-kimchi",
        "ko": "저는 김치를 좋아해요.",
        "roman": "jeoneun gimchireul joahaeyo.",
        "es": "Me gusta el kimchi.",
        "en": "I like kimchi."
      }
    ]
  },
  {
    "id": "texts",
    "es": "Textos largos",
    "en": "Long texts",
    "items": [
      {
        "id": "text-introduction",
        "ko": "안녕하세요? 제 이름은 민수예요. 저는 서울에 살아요. 저는 학생이고 한국어를 공부해요. 만나서 반갑습니다!",
        "roman": "annyeonghaseyo? je ireumeun minsuyeyo. jeoneun seoure sarayo. jeoneun haksaengigo hangugeoreul gongbuhaeyo. mannaseo bangapseumnida!",
        "es": "¿Hola? Me llamo Minsu. Vivo en Seúl. Soy estudiante y estudio coreano. ¡Mucho gusto!",
        "en": "Hello? My name is Minsu. I live in Seoul. I'm a student and I study Korean. Nice to meet you!"
      },
      {
        "id": "text-weekend",
        "ko": "오늘은 주말이에요. 아침에 커피를 마셔요. 오후에 친구를 만나요. 우리는 같이 영화를 봐요. 정말 재미있어요!",
        "roman": "oneureun jumarieyo. achime keopireul masyeoyo. ohue chingureul mannayo. urineun gachi yeonghwareul bwayo. jeongmal jaemiisseoyo!",
        "es": "Hoy es fin de semana. Por la mañana tomo café. Por la tarde veo a un amigo. Vemos una película juntos. ¡Es muy divertido!",
        "en": "Today is the weekend. In the morning I drink coffee. In the afternoon I meet a friend. We watch a movie together. It's really fun!"
      }
    ]
  }
];
const ORIGINAL_IDS=[["letters-vowels", "letters-basic-consonants", "letters-aspirated-tense", "letters-syllables", "letters-compound-vowels"], ["word-tree", "word-sea", "word-apple", "word-water", "word-cat", "word-school", "word-korea", "word-coffee", "word-love", "word-friend"], ["phrase-hello", "phrase-thanks", "phrase-sorry", "phrase-nice-to-meet", "phrase-how-are-you", "phrase-delicious", "phrase-bathroom"], ["sentence-student", "sentence-study", "sentence-weather", "sentence-coffee", "sentence-friend", "sentence-kimchi"], ["text-introduction", "text-weekend"]];
const LESSONS=[
  {
    "es": {
      "title": "Letras y bloques: primero entendé la forma",
      "paragraphs": [
        "Hangul agrupa consonantes y vocales en bloques silábicos. Un bloque tiene una posición inicial, una vocal central y, a veces, una consonante final (batchim). En 한 podés reconocer ㅎ + ㅏ + ㄴ.",
        "En 가, ㄱ ocupa la posición inicial y ㅏ la central; no hay consonante final. Compará con 물: ㅁ + ㅜ + ㄹ. Mirá los componentes antes de memorizar teclas.",
        "El alfabeto de inicio muestra una selección de vocales y consonantes. La romanización es una ayuda visual, no una guía completa de pronunciación. Practicar después entrena teclas: no demuestra que ya domines los sonidos."
      ]
    },
    "en": {
      "title": "Letters and blocks: understand the shape first",
      "paragraphs": [
        "Hangul groups consonants and vowels into syllable blocks. A block has an initial position, a central vowel and sometimes a final consonant (batchim). In 한, identify ㅎ + ㅏ + ㄴ.",
        "In 가, ㄱ fills the initial position and ㅏ the central position; there is no final consonant. Compare 물: ㅁ + ㅜ + ㄹ. Look for components before memorizing keys.",
        "The starting alphabet shows a selection of vowels and consonants. Romanization is a visual aid, not a complete pronunciation guide. Typing practice trains keys, not mastery of sounds."
      ]
    },
    "examples": [
      "letters-syllables",
      "word-water"
    ]
  },
  {
    "es": {
      "title": "Palabras: leé bloque por bloque",
      "paragraphs": [
        "Una palabra puede reunir varios bloques. 나무 tiene dos: 나 y 무. Separalos visualmente: ㄴ + ㅏ, luego ㅁ + ㅜ. La traducción del ejemplo es «árbol».",
        "Compará 나무 con 물 («agua»), que tiene un solo bloque con consonante final. En 사과 («manzana»), el segundo bloque contiene la vocal ㅘ; el ejercicio de teclado la divide en ㅗ + ㅏ.",
        "Primero observá el texto y su traducción. Después escuchá si hay una voz coreana disponible y recién entonces probá escribir. La cantidad de teclas no mide cuánto entendiste."
      ]
    },
    "en": {
      "title": "Words: read one block at a time",
      "paragraphs": [
        "A word can contain several blocks. 나무 has two: 나 and 무. Inspect ㄴ + ㅏ, then ㅁ + ㅜ. The example means “tree”.",
        "Compare 나무 with 물 (“water”), a single block with a final consonant. In 사과 (“apple”), the second block contains ㅘ; the typing exercise splits it into ㅗ + ㅏ.",
        "Look at the text and meaning first. Listen if a Korean voice is available, then try typing. The number of correct keys does not measure understanding."
      ]
    },
    "examples": [
      "word-tree",
      "word-water",
      "word-apple"
    ]
  },
  {
    "es": {
      "title": "Frases: relacioná expresión y situación",
      "paragraphs": [
        "Acá aparecen expresiones completas con traducción. 안녕하세요 corresponde a un saludo; 감사합니다 expresa agradecimiento. No son letras sueltas: tratá de relacionar cada ejemplo con una situación.",
        "Leé 만나서 반갑습니다 y su traducción «Mucho gusto». Comparalo con 죄송합니다 («Lo siento»). Antes de practicar, preguntate en qué situación usarías cada uno.",
        "Esta introducción no explica todas las diferencias de registro ni reemplaza una clase de conversación. El audio del sistema y la romanización son apoyos; el juego solo comprueba la secuencia escrita."
      ]
    },
    "en": {
      "title": "Phrases: connect an expression to a situation",
      "paragraphs": [
        "These are complete expressions with translations. 안녕하세요 is a greeting; 감사합니다 expresses thanks. Connect each example to a situation rather than treating it as unrelated letters.",
        "Read 만나서 반갑습니다 and its meaning “Nice to meet you”. Compare 죄송합니다 (“I am sorry”). Before typing, consider when you would use each expression.",
        "This introduction does not explain every register distinction or replace conversation lessons. System audio and romanization are aids; the game only checks the written key sequence."
      ]
    },
    "examples": [
      "phrase-hello",
      "phrase-thanks",
      "phrase-nice-to-meet"
    ]
  },
  {
    "es": {
      "title": "Oraciones: buscá el sentido completo",
      "paragraphs": [
        "Una oración te permite leer una idea completa. Compará 저는 학생이에요. («Soy estudiante.») y 저는 한국어를 공부해요. («Estudio coreano.»). Observá qué parte del texto se repite y cuál cambia; no hace falta inventar una regla a partir de dos ejemplos.",
        "Leé 커피 한 잔 주세요. con su traducción «Un café, por favor.». Los espacios y el punto también forman parte del texto, aunque el juego los salta automáticamente.",
        "Esta página inicia una lectura comparativa: no es una explicación completa de partículas o conjugaciones. Si completás el teclado, completaste un ejercicio de escritura guiada, no una evaluación de gramática."
      ]
    },
    "en": {
      "title": "Sentences: look for the complete meaning",
      "paragraphs": [
        "A sentence conveys a complete idea. Compare 저는 학생이에요. (“I am a student.”) with 저는 한국어를 공부해요. (“I study Korean.”). Notice what repeats and what changes; two examples are not enough to invent a grammar rule.",
        "Read 커피 한 잔 주세요. with “One coffee, please.” Spaces and punctuation are part of the text, although the game skips them automatically.",
        "This page introduces comparison and reading, not a complete explanation of particles or conjugation. Completing the keyboard exercise is guided typing, not a grammar assessment."
      ]
    },
    "examples": [
      "sentence-student",
      "sentence-study",
      "sentence-coffee"
    ]
  },
  {
    "es": {
      "title": "Textos: leé sin apurarte a escribir",
      "paragraphs": [
        "Un texto reúne varias ideas. En la presentación de Minsu, buscá las partes que la traducción identifica como nombre, lugar donde vive y estudio. Leé una oración por vez y volvé al conjunto.",
        "En el texto del fin de semana, seguí la traducción para reconocer café, encuentro con un amigo y película. Compará las palabras que ya viste en niveles anteriores.",
        "Podés quedarte en esta página todo el tiempo que necesites: no hay cronómetro ni avance automático. La práctica posterior mantiene su caminante; completarla no certifica comprensión del texto."
      ]
    },
    "en": {
      "title": "Texts: read before rushing to type",
      "paragraphs": [
        "A text connects several ideas. In Minsu’s introduction, use the translation to locate the name, where he lives and his studies. Read one sentence at a time, then return to the whole passage.",
        "In the weekend text, use the translation to identify coffee, meeting a friend and a film. Compare words you saw in earlier levels.",
        "Stay on this page as long as you need: there is no timer or automatic advance. The following practice keeps the walker; finishing it does not certify text comprehension."
      ]
    },
    "examples": [
      "text-introduction",
      "text-weekend"
    ]
  }
];
UI.es.rd=["Bloques, vocales y consonantes.","Leer palabras bloque por bloque.","Expresiones y situaciones cotidianas.","Comparar oraciones y traducciones.","Leer textos sin apuro."]; UI.en.rd=["Blocks, vowels and consonants.","Read words block by block.","Expressions and everyday situations.","Compare sentences and translations.","Read texts at your own pace."];

return {UI,DATA,ORIGINAL_IDS,LESSONS};
});
