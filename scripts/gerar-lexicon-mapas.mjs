/**
 * Gera matrizes planetSign e planetHouse (PT/EN/ES/IT/DE/FR) para o lexicon Sidus.
 * Executar: node scripts/gerar-lexicon-mapas.mjs
 */
import { writeFileSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '../src/lib/lexicon/dados')

const SIGNOS_PT = [
  'Carneiro', 'Touro', 'Gémeos', 'Caranguejo', 'Leão', 'Virgem',
  'Balança', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes',
]
const SIGNOS_EN = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
]
const SIGNOS_ES = [
  'Aries', 'Tauro', 'Géminos', 'Cáncer', 'Leo', 'Virgo',
  'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis',
]
const SIGNOS_IT = [
  'Ariete', 'Toro', 'Gemelli', 'Cancro', 'Leone', 'Vergine',
  'Bilancia', 'Scorpione', 'Sagittario', 'Capricorno', 'Acquario', 'Pesci',
]
const SIGNOS_DE = [
  'Widder', 'Stier', 'Zwillinge', 'Krebs', 'Löwe', 'Jungfrau',
  'Waage', 'Skorpion', 'Schütze', 'Steinbock', 'Wassermann', 'Fische',
]
const SIGNOS_FR = [
  'Bélier', 'Taureau', 'Gémeaux', 'Cancer', 'Lion', 'Vierge',
  'Balance', 'Scorpion', 'Sagittaire', 'Capricorne', 'Verseau', 'Poissons',
]

const SIGNOS_BY_LANG = { pt: SIGNOS_PT, en: SIGNOS_EN, es: SIGNOS_ES, it: SIGNOS_IT, de: SIGNOS_DE, fr: SIGNOS_FR }

const PLANETAS = ['Sol', 'Lua', 'Mercúrio', 'Vénus', 'Marte', 'Júpiter', 'Saturno', 'Urano', 'Neptuno', 'Plutão']
const PLANETAS_BY_LANG = {
  pt: ['Sol', 'Lua', 'Mercúrio', 'Vénus', 'Marte', 'Júpiter', 'Saturno', 'Urano', 'Neptuno', 'Plutão'],
  en: ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'],
  es: ['Sol', 'Luna', 'Mercurio', 'Venus', 'Marte', 'Júpiter', 'Saturno', 'Urano', 'Neptuno', 'Plutón'],
  it: ['Sole', 'Luna', 'Mercurio', 'Venere', 'Marte', 'Giove', 'Saturno', 'Urano', 'Nettuno', 'Plutone'],
  de: ['Sonne', 'Mond', 'Merkur', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptun', 'Pluto'],
  fr: ['Soleil', 'Lune', 'Mercure', 'Vénus', 'Mars', 'Jupiter', 'Saturne', 'Uranus', 'Neptune', 'Pluton'],
}

const ELEMENTO = {
  Carneiro: 'Fogo', Touro: 'Terra', Gémeos: 'Ar', Caranguejo: 'Água',
  Leão: 'Fogo', Virgem: 'Terra', Balança: 'Ar', Escorpião: 'Água',
  Sagitário: 'Fogo', Capricórnio: 'Terra', Aquário: 'Ar', Peixes: 'Água',
}
const MODAL = {
  Carneiro: 'cardinal', Touro: 'fixo', Gémeos: 'mutável', Caranguejo: 'cardinal',
  Leão: 'fixo', Virgem: 'mutável', Balança: 'cardinal', Escorpião: 'fixo',
  Sagitário: 'mutável', Capricórnio: 'cardinal', Aquário: 'fixo', Peixes: 'mutável',
}

const DOMINIO = {
  pt: {
    Sol: 'identidade consciente e vitalidade', Lua: 'mundo emocional e memória afectiva',
    Mercúrio: 'mente, linguagem e aprendizagem', Vénus: 'amor, prazer e valores pessoais',
    Marte: 'desejo, coragem e forma de agir', Júpiter: 'fé, expansão e sentido',
    Saturno: 'limites, maturidade e compromisso', Urano: 'liberdade, ruptura e originalidade',
    Neptuno: 'imaginação, compaixão e transcendência', Plutão: 'transformação, poder e regeneração',
  },
  en: {
    Sol: 'conscious identity and vitality', Lua: 'emotional world and affective memory',
    Mercúrio: 'mind, language and learning', Vénus: 'love, pleasure and personal values',
    Marte: 'desire, courage and way of acting', Júpiter: 'faith, expansion and meaning',
    Saturno: 'limits, maturity and commitment', Urano: 'freedom, rupture and originality',
    Neptuno: 'imagination, compassion and transcendence', Plutão: 'transformation, power and regeneration',
  },
  es: {
    Sol: 'identidad consciente y vitalidad', Lua: 'mundo emocional y memoria afectiva',
    Mercúrio: 'mente, lenguaje y aprendizaje', Vénus: 'amor, placer y valores personales',
    Marte: 'deseo, coraje y forma de actuar', Júpiter: 'fe, expansión y sentido',
    Saturno: 'límites, madurez y compromiso', Urano: 'libertad, ruptura y originalidad',
    Neptuno: 'imaginación, compasión y trascendencia', Plutão: 'transformación, poder y regeneración',
  },
  it: {
    Sol: 'identità conscia e vitalità', Lua: 'mondo emotivo e memoria affettiva',
    Mercúrio: 'mente, linguaggio e apprendimento', Vénus: 'amore, piacere e valori personali',
    Marte: 'desiderio, coraggio e modo di agire', Júpiter: 'fede, espansione e senso',
    Saturno: 'limiti, maturità e impegno', Urano: 'libertà, rottura e originalità',
    Neptuno: 'immaginazione, compassione e trascendenza', Plutão: 'trasformazione, potere e rigenerazione',
  },
  de: {
    Sol: 'bewusste Identität und Vitalität', Lua: 'Gefühlswelt und affektives Gedächtnis',
    Mercúrio: 'Geist, Sprache und Lernen', Vénus: 'Liebe, Genuss und persönliche Werte',
    Marte: 'Verlangen, Mut und Handlungsweise', Júpiter: 'Glaube, Expansion und Sinn',
    Saturno: 'Grenzen, Reife und Verpflichtung', Urano: 'Freiheit, Bruch und Originalität',
    Neptuno: 'Vorstellungskraft, Mitgefühl und Transzendenz', Plutão: 'Transformation, Macht und Regeneration',
  },
  fr: {
    Sol: 'identité consciente et vitalité', Lua: 'monde émotionnel et mémoire affective',
    Mercúrio: 'esprit, langage et apprentissage', Vénus: 'amour, plaisir et valeurs personnelles',
    Marte: 'désir, courage et manière d\'agir', Júpiter: 'foi, expansion et sens',
    Saturno: 'limites, maturité et engagement', Urano: 'liberté, rupture et originalité',
    Neptuno: 'imagination, compassion et transcendance', Plutão: 'transformation, pouvoir et régénération',
  },
}

const ESSENCIA = {
  pt: {
    Carneiro: 'impulso pioneiro que não espera permissão', Touro: 'persistência sensorial e construção paciente',
    Gémeos: 'curiosidade viva e inteligência relacional', Caranguejo: 'profundidade emocional e instinto protetor',
    Leão: 'criatividade radiante e coração generoso', Virgem: 'discernimento prático e serviço consciente',
    Balança: 'diplomacia estética e busca de equilíbrio', Escorpião: 'intensidade transformadora e coragem psíquica',
    Sagitário: 'visão ampla e honestidade filosófica', Capricórnio: 'disciplina estratégica e senso de legado',
    Aquário: 'originalidade humanitária e mente livre', Peixes: 'compaixão fluida e imaginação sem fronteiras',
  },
  en: {
    Carneiro: 'pioneer impulse that waits for no permission', Touro: 'sensory persistence and patient building',
    Gémeos: 'living curiosity and relational intelligence', Caranguejo: 'emotional depth and protective instinct',
    Leão: 'radiant creativity and generous heart', Virgem: 'practical discernment and conscious service',
    Balança: 'aesthetic diplomacy and search for balance', Escorpião: 'transformative intensity and psychic courage',
    Sagitário: 'broad vision and philosophical honesty', Capricórnio: 'strategic discipline and sense of legacy',
    Aquário: 'humanitarian originality and free mind', Peixes: 'fluid compassion and borderless imagination',
  },
  es: {
    Carneiro: 'impulso pionero que no espera permiso', Touro: 'persistencia sensorial y construcción paciente',
    Gémeos: 'curiosidad viva e inteligencia relacional', Caranguejo: 'profundidad emocional e instinto protector',
    Leão: 'creatividad radiante y corazón generoso', Virgem: 'discernimiento práctico y servicio consciente',
    Balança: 'diplomacia estética y búsqueda de equilibrio', Escorpião: 'intensidad transformadora y coraje psíquico',
    Sagitário: 'visión amplia y honestidad filosófica', Capricórnio: 'disciplina estratégica y sentido de legado',
    Aquário: 'originalidad humanitaria y mente libre', Peixes: 'compasión fluida e imaginación sin fronteras',
  },
  it: {
    Carneiro: 'impulso pionieristico che non aspetta permesso', Touro: 'persistenza sensoriale e costruzione paziente',
    Gémeos: 'curiosità viva e intelligenza relazionale', Caranguejo: 'profondità emotiva e istinto protettivo',
    Leão: 'creatività radiosa e cuore generoso', Virgem: 'discernimento pratico e servizio consapevole',
    Balança: 'diplomazia estetica e ricerca di equilibrio', Escorpião: 'intensità trasformatrice e coraggio psichico',
    Sagitário: 'visione ampia e onestà filosofica', Capricórnio: 'disciplina strategica e senso di eredità',
    Aquário: 'originalità umanitaria e mente libera', Peixes: 'compassione fluida e immaginazione senza confini',
  },
  de: {
    Carneiro: 'pionierhafter Impuls, der nicht auf Erlaubnis wartet', Touro: 'sinnliche Ausdauer und geduldiger Aufbau',
    Gémeos: 'lebendige Neugier und relationale Intelligenz', Caranguejo: 'emotionale Tiefe und Schutzinstinkt',
    Leão: 'strahlende Kreativität und großzügiges Herz', Virgem: 'praktisches Urteilsvermögen und bewusster Dienst',
    Balança: 'ästhetische Diplomatie und Suche nach Balance', Escorpião: 'transformative Intensität und psychischer Mut',
    Sagitário: 'weite Vision und philosophische Ehrlichkeit', Capricórnio: 'strategische Disziplin und Vermächtnisgefühl',
    Aquário: 'humanitäre Originalität und freier Geist', Peixes: 'fließendes Mitgefühl und grenzenlose Fantasie',
  },
  fr: {
    Carneiro: 'élan pionnier qui n\'attend pas la permission', Touro: 'persistance sensorielle et construction patiente',
    Gémeos: 'curiosité vive et intelligence relationnelle', Caranguejo: 'profondeur émotionnelle et instinct protecteur',
    Leão: 'créativité rayonnante et cœur généreux', Virgem: 'discernement pratique et service conscient',
    Balança: 'diplomatie esthétique et quête d\'équilibre', Escorpião: 'intensité transformatrice et courage psychique',
    Sagitário: 'vision large et honnêteté philosophique', Capricórnio: 'discipline stratégique et sens de l\'héritage',
    Aquário: 'originalité humanitaire et esprit libre', Peixes: 'compassion fluide et imagination sans frontières',
  },
}

const ELEM_NOME = {
  pt: { Fogo: 'fogo', Terra: 'terra', Ar: 'ar', Água: 'água' },
  en: { Fogo: 'fire', Terra: 'earth', Ar: 'air', Água: 'water' },
  es: { Fogo: 'fuego', Terra: 'tierra', Ar: 'aire', Água: 'agua' },
  it: { Fogo: 'fuoco', Terra: 'terra', Ar: 'aria', Água: 'acqua' },
  de: { Fogo: 'Feuer', Terra: 'Erde', Ar: 'Luft', Água: 'Wasser' },
  fr: { Fogo: 'feu', Terra: 'terre', Ar: 'air', Água: 'eau' },
}

const SOMBRA = {
  pt: {
    Fogo: 'impaciência, orgulho ferido e reacção explosiva quando a vontade é contrariada',
    Terra: 'apego, resistência à mudança e medo silencioso de perder segurança',
    Ar: 'dispersão mental, ironia defensiva e distância quando a profundidade assusta',
    Água: 'fusão excessiva, nostalgia paralisante e medo de abandono que controla escolhas',
  },
  en: {
    Fogo: 'impatience, wounded pride and explosive reaction when will is thwarted',
    Terra: 'attachment, resistance to change and silent fear of losing security',
    Ar: 'mental dispersion, defensive irony and distance when depth frightens',
    Água: 'excessive fusion, paralysing nostalgia and fear of abandonment controlling choices',
  },
  es: {
    Fogo: 'impaciencia, orgullo herido y reacción explosiva cuando la voluntad se ve contrariada',
    Terra: 'apego, resistencia al cambio y miedo silencioso a perder seguridad',
    Ar: 'dispersión mental, ironía defensiva y distancia cuando la profundidad asusta',
    Água: 'fusión excesiva, nostalgia paralizante y miedo al abandono que controla decisiones',
  },
  it: {
    Fogo: 'impazienza, orgoglio ferito e reazione esplosiva quando la volontà è contrastata',
    Terra: 'attaccamento, resistenza al cambiamento e paura silenziosa di perdere sicurezza',
    Ar: 'dispersione mentale, ironia difensiva e distanza quando la profondità spaventa',
    Água: 'fusione eccessiva, nostalgia paralizzante e paura dell\'abbandono che controlla le scelte',
  },
  de: {
    Fogo: 'Ungeduld, verletzter Stolz und explosive Reaktion, wenn der Wille gebremst wird',
    Terra: 'Anhaftung, Widerstand gegen Veränderung und stille Angst, Sicherheit zu verlieren',
    Ar: 'geistige Zerstreuung, defensive Ironie und Distanz, wenn Tiefe erschreckt',
    Água: 'übermäßige Verschmelzung, lähmende Nostalgie und Angst vor Verlassenwerden, die Entscheidungen steuert',
  },
  fr: {
    Fogo: 'impatience, orgueil blessé et réaction explosive quand la volonté est contrariée',
    Terra: 'attachement, résistance au changement et peur silencieuse de perdre la sécurité',
    Ar: 'dispersion mentale, ironie défensive et distance quand la profondeur effraie',
    Água: 'fusion excessive, nostalgie paralysante et peur de l\'abandon qui contrôle les choix',
  },
}

const LUZ = {
  pt: {
    Fogo: 'coragem autêntica, presença inspiradora e capacidade de recomeçar',
    Terra: 'estabilidade que acalma, talento para materializar sonhos e paciência fértil',
    Ar: 'adaptabilidade brilhante, humor curador e visão que liga mundos',
    Água: 'empatia profunda, intuição fina e capacidade de curar através do sentir',
  },
  en: {
    Fogo: 'authentic courage, inspiring presence and ability to begin again',
    Terra: 'calming stability, talent to materialise dreams and fertile patience',
    Ar: 'brilliant adaptability, healing humour and vision that connects worlds',
    Água: 'deep empathy, fine intuition and ability to heal through feeling',
  },
  es: {
    Fogo: 'coraje auténtico, presencia inspiradora y capacidad de empezar de nuevo',
    Terra: 'estabilidad que calma, talento para materializar sueños y paciencia fértil',
    Ar: 'adaptabilidad brillante, humor sanador y visión que conecta mundos',
    Água: 'empatía profunda, intuición fina y capacidad de sanar a través del sentir',
  },
  it: {
    Fogo: 'coraggio autentico, presenza ispiratrice e capacità di ricominciare',
    Terra: 'stabilità che calma, talento per materializzare sogni e pazienza fertile',
    Ar: 'adattabilità brillante, umorismo curativo e visione che collega mondi',
    Água: 'empatia profonda, intuizione fine e capacità di guarire attraverso il sentire',
  },
  de: {
    Fogo: 'authentischer Mut, inspirierende Präsenz und Fähigkeit, neu zu beginnen',
    Terra: 'beruhigende Stabilität, Talent, Träume zu materialisieren, und fruchtbare Geduld',
    Ar: 'brillante Anpassungsfähigkeit, heilender Humor und Vision, die Welten verbindet',
    Água: 'tiefe Empathie, feine Intuition und Fähigkeit, durch Fühlen zu heilen',
  },
  fr: {
    Fogo: 'courage authentique, présence inspirante et capacité de recommencer',
    Terra: 'stabilité apaisante, talent pour matérialiser les rêves et patience fertile',
    Ar: 'adaptabilité brillante, humour curatif et vision qui relie les mondes',
    Água: 'empathie profonde, intuition fine et capacité de guérir par le ressenti',
  },
}

const MODAL_TEXTO = {
  pt: {
    cardinal: 'inicias ciclos com força; o desafio é sustentar o que começaste sem abandonar no primeiro obstáculo',
    fixo: 'manténs o rumo com tenacidade; o desafio é flexibilizar sem sentir que traíste a tua verdade',
    mutável: 'adaptas-te com graça às mudanças; o desafio é ancorar-te para não te dissolveres no ambiente',
  },
  en: {
    cardinal: 'you initiate cycles with force; the challenge is sustaining what you began without abandoning at the first obstacle',
    fixo: 'you hold course with tenacity; the challenge is flexing without feeling you betrayed your truth',
    mutável: 'you adapt gracefully to change; the challenge is anchoring so you do not dissolve into the environment',
  },
  es: {
    cardinal: 'inicias ciclos con fuerza; el desafío es sostener lo que empezaste sin abandonar al primer obstáculo',
    fixo: 'mantienes el rumbo con tenacidad; el desafío es flexibilizar sin sentir que traicionaste tu verdad',
    mutável: 'te adaptas con gracia a los cambios; el desafío es anclarte para no disolverte en el entorno',
  },
  it: {
    cardinal: 'inizi cicli con forza; la sfida è sostenere ciò che hai iniziato senza abbandonare al primo ostacolo',
    fixo: 'mantieni la rotta con tenacia; la sfida è flessibilizzarti senza sentire di aver tradito la tua verità',
    mutável: 'ti adatti con grazia ai cambiamenti; la sfida è ancorarti per non dissolverti nell\'ambiente',
  },
  de: {
    cardinal: 'du beginnst Zyklen mit Kraft; die Herausforderung ist, das Begonnene zu tragen, ohne beim ersten Hindernis aufzugeben',
    fixo: 'du hältst den Kurs mit Hartnäckigkeit; die Herausforderung ist Flexibilität ohne Verrat an der eigenen Wahrheit',
    mutável: 'du passt dich dem Wandel anmutig an; die Herausforderung ist Verankerung, damit du dich nicht auflöst',
  },
  fr: {
    cardinal: 'tu inities des cycles avec force ; le défi est de soutenir ce que tu as commencé sans abandonner au premier obstacle',
    fixo: 'tu tiens le cap avec ténacité ; le défi est de t\'assouplir sans sentir que tu trahis ta vérité',
    mutável: 'tu t\'adaptes avec grâce aux changements ; le défi est de t\'ancrer pour ne pas te dissoudre dans l\'environnement',
  },
}

const MODAL_NOME = {
  pt: { cardinal: 'cardinal', fixo: 'fixo', mutável: 'mutável' },
  en: { cardinal: 'cardinal', fixo: 'fixed', mutável: 'mutable' },
  es: { cardinal: 'cardinal', fixo: 'fijo', mutável: 'mutable' },
  it: { cardinal: 'cardinale', fixo: 'fisso', mutável: 'mutevole' },
  de: { cardinal: 'kardinal', fixo: 'fix', mutável: 'veränderlich' },
  fr: { cardinal: 'cardinal', fixo: 'fixe', mutável: 'mutable' },
}

const CASA_TEMA = {
  pt: {
    1: 'identidade visível e maneira de entrar no mundo', 2: 'recursos, autoestima material e o que cultivas como valor',
    3: 'comunicação quotidiana, aprendizagem e laços próximos', 4: 'raízes emocionais, lar interior e memória familiar',
    5: 'criatividade, romance, prazer e expressão autêntica', 6: 'rotina, corpo, trabalho diário e serviço útil',
    7: 'parcerias, contratos e o espelho relacional', 8: 'intimidade profunda, crises regeneradoras e partilha de poder',
    9: 'filosofia, viagens de sentido e horizontes amplos', 10: 'vocação pública, reputação e legado profissional',
    11: 'amizades, causas colectivas e futuro desejado', 12: 'inconsciente, retiro espiritual e compaixão silenciosa',
  },
  en: {
    1: 'visible identity and way of entering the world', 2: 'resources, material self-worth and what you cultivate as value',
    3: 'daily communication, learning and close bonds', 4: 'emotional roots, inner home and family memory',
    5: 'creativity, romance, pleasure and authentic expression', 6: 'routine, body, daily work and useful service',
    7: 'partnerships, contracts and relational mirror', 8: 'deep intimacy, regenerative crises and shared power',
    9: 'philosophy, journeys of meaning and broad horizons', 10: 'public vocation, reputation and professional legacy',
    11: 'friendships, collective causes and desired future', 12: 'unconscious, spiritual retreat and silent compassion',
  },
  es: {
    1: 'identidad visible y manera de entrar en el mundo', 2: 'recursos, autoestima material y lo que cultivas como valor',
    3: 'comunicación cotidiana, aprendizaje y lazos cercanos', 4: 'raíces emocionales, hogar interior y memoria familiar',
    5: 'creatividad, romance, placer y expresión auténtica', 6: 'rutina, cuerpo, trabajo diario y servicio útil',
    7: 'asociaciones, contratos y el espejo relacional', 8: 'intimidad profunda, crisis regeneradoras y reparto de poder',
    9: 'filosofía, viajes de sentido y horizontes amplios', 10: 'vocación pública, reputación y legado profesional',
    11: 'amistades, causas colectivas y futuro deseado', 12: 'inconsciente, retiro espiritual y compasión silenciosa',
  },
  it: {
    1: 'identità visibile e modo di entrare nel mondo', 2: 'risorse, autostima materiale e ciò che coltivi come valore',
    3: 'comunicazione quotidiana, apprendimento e legami stretti', 4: 'radici emotive, casa interiore e memoria familiare',
    5: 'creatività, romanticismo, piacere ed espressione autentica', 6: 'routine, corpo, lavoro quotidiano e servizio utile',
    7: 'partnership, contratti e specchio relazionale', 8: 'intimità profonda, crisi rigeneratrici e condivisione del potere',
    9: 'filosofia, viaggi di senso e orizzonti ampi', 10: 'vocazione pubblica, reputazione e lascito professionale',
    11: 'amicizie, cause collettive e futuro desiderato', 12: 'inconscio, ritiro spirituale e compassione silenziosa',
  },
  de: {
    1: 'sichtbare Identität und Art, in die Welt einzutreten', 2: 'Ressourcen, materielles Selbstwertgefühl und was du als Wert kultivierst',
    3: 'tägliche Kommunikation, Lernen und enge Bindungen', 4: 'emotionale Wurzeln, inneres Zuhause und Familienerinnerung',
    5: 'Kreativität, Romantik, Genuss und authentischer Ausdruck', 6: 'Routine, Körper, tägliche Arbeit und nützlicher Dienst',
    7: 'Partnerschaften, Verträge und relationeller Spiegel', 8: 'tiefe Intimität, regenerative Krisen und geteilte Macht',
    9: 'Philosophie, Sinnreisen und weite Horizonte', 10: 'öffentliche Berufung, Ruf und berufliches Erbe',
    11: 'Freundschaften, kollektive Anliegen und gewünschte Zukunft', 12: 'Unbewusstes, spiritueller Rückzug und stille Mitgefühl',
  },
  fr: {
    1: 'identité visible et manière d\'entrer dans le monde', 2: 'ressources, estime matérielle et ce que tu cultives comme valeur',
    3: 'communication quotidienne, apprentissage et liens proches', 4: 'racines émotionnelles, foyer intérieur et mémoire familiale',
    5: 'créativité, romance, plaisir et expression authentique', 6: 'routine, corps, travail quotidien et service utile',
    7: 'partenariats, contrats et miroir relationnel', 8: 'intimité profonde, crises régénératrices et partage du pouvoir',
    9: 'philosophie, voyages de sens et horizons larges', 10: 'vocation publique, réputation et héritage professionnel',
    11: 'amitiés, causes collectives et futur désiré', 12: 'inconscient, retraite spirituelle et compassion silencieuse',
  },
}

const INTRO_SIGN = {
  pt: (p, s, dom, ess, elem, mod) =>
    `Com ${p} em ${s}, a tua ${dom} ganha o colorido de ${ess}. Não é um rótulo genérico: é a forma particular como vives esta função psíquica quando o elemento ${elem} e a modalidade ${mod} se encontram no teu mapa. Aqui, a vida pede-te presença concreta — não teorias sobre quem deverias ser, mas a experiência vivida desta combinação única.`,
  en: (p, s, dom, ess, elem, mod) =>
    `With ${p} in ${s}, your ${dom} takes the colour of ${ess}. This is not a generic label: it is how you live this psychic function when ${elem} and ${mod} modality meet in your chart. Life asks for concrete presence — not theories about who you should be, but lived experience of this unique combination.`,
  es: (p, s, dom, ess, elem, mod) =>
    `Con ${p} en ${s}, tu ${dom} adquiere el matiz de ${ess}. No es una etiqueta genérica: es la forma particular en que vives esta función psíquica cuando el elemento ${elem} y la modalidad ${mod} se encuentran en tu carta. La vida te pide presencia concreta — no teorías sobre quién deberías ser, sino la experiencia vivida de esta combinación única.`,
  it: (p, s, dom, ess, elem, mod) =>
    `Con ${p} in ${s}, la tua ${dom} assume la sfumatura di ${ess}. Non è un'etichetta generica: è il modo particolare in cui vivi questa funzione psichica quando l'elemento ${elem} e la modalità ${mod} si incontrano nella tua carta. La vita chiede presenza concreta — non teorie su chi dovresti essere, ma l'esperienza vissuta di questa combinazione unica.`,
  de: (p, s, dom, ess, elem, mod) =>
    `Mit ${p} in ${s} erhält deine ${dom} die Färbung von ${ess}. Das ist kein generisches Etikett: Es ist, wie du diese psychische Funktion lebst, wenn ${elem} und ${mod} Modalität in deinem Horoskop zusammentreffen. Das Leben verlangt konkrete Präsenz — keine Theorien darüber, wer du sein solltest, sondern gelebte Erfahrung dieser einzigartigen Kombination.`,
  fr: (p, s, dom, ess, elem, mod) =>
    `Avec ${p} en ${s}, ta ${dom} prend la couleur de ${ess}. Ce n'est pas une étiquette générique : c'est la façon particulière dont tu vis cette fonction psychique quand l'élément ${elem} et la modalité ${mod} se rencontrent dans ta carte. La vie demande une présence concrète — pas des théories sur qui tu devrais être, mais l'expérience vécue de cette combinaison unique.`,
}

const SHADOW_BLOCK = {
  pt: (s, l) => `A sombra deste posicionamento manifesta-se como ${s}. Reconhecer estes padrões sem te julgares é o primeiro passo para deixar de repetir dramas inconscientes. A luz, por outro lado, revela ${l} — qualidades que outros frequentemente vêem em ti antes de tu próprio/a as assumires plenamente.`,
  en: (s, l) => `The shadow of this placement shows as ${s}. Recognising these patterns without self-judgment is the first step to stop repeating unconscious dramas. The light reveals ${l} — qualities others often see in you before you fully claim them.`,
  es: (s, l) => `La sombra de este posicionamiento se manifiesta como ${s}. Reconocer estos patrones sin juzgarte es el primer paso para dejar de repetir dramas inconscientes. La luz, por otro lado, revela ${l} — cualidades que otros suelen ver en ti antes de que tú mismo/a las asumas plenamente.`,
  it: (s, l) => `L'ombra di questo posizionamento si manifesta come ${s}. Riconoscere questi schemi senza giudicarti è il primo passo per smettere di ripetere drammi inconsci. La luce, d'altra parte, rivela ${l} — qualità che gli altri spesso vedono in te prima che tu le assuma pienamente.`,
  de: (s, l) => `Der Schatten dieser Position zeigt sich als ${s}. Diese Muster ohne Selbstverurteilung zu erkennen ist der erste Schritt, unbewusste Dramen nicht zu wiederholen. Das Licht offenbart ${l} — Qualitäten, die andere oft in dir sehen, bevor du sie voll annimmst.`,
  fr: (s, l) => `L'ombre de cette position se manifeste comme ${s}. Reconnaître ces schémas sans te juger est la première étape pour ne plus répéter des drames inconscients. La lumière révèle ${l} — des qualités que les autres voient souvent en toi avant que tu ne les assumes pleinement.`,
}

const EVOL_BLOCK = {
  pt: (modal, p, s) => `No plano evolutivo, ${modal}. Conselho prático: observa onde ${p} em ${s} se activa nos próximos sete dias — nas conversas, nas decisões rápidas, nas reacções emocionais — e escolhe uma acção pequena que honre a luz deste signo sem alimentar a sombra.`,
  en: (modal, p, s) => `Evolutionarily, ${modal}. Practical counsel: notice where ${p} in ${s} activates in the next seven days — in conversations, quick decisions, emotional reactions — and choose one small action that honours this sign's light without feeding its shadow.`,
  es: (modal, p, s) => `En el plano evolutivo, ${modal}. Consejo práctico: observa dónde ${p} en ${s} se activa en los próximos siete días — en conversaciones, decisiones rápidas, reacciones emocionales — y elige una acción pequeña que honre la luz de este signo sin alimentar la sombra.`,
  it: (modal, p, s) => `Sul piano evolutivo, ${modal}. Consiglio pratico: osserva dove ${p} in ${s} si attiva nei prossimi sette giorni — nelle conversazioni, decisioni rapide, reazioni emotive — e scegli una piccola azione che onori la luce di questo segno senza nutrire l'ombra.`,
  de: (modal, p, s) => `Evolutionär gilt: ${modal}. Praktischer Rat: Beobachte, wo ${p} in ${s} in den nächsten sieben Tagen aktiv wird — in Gesprächen, schnellen Entscheidungen, emotionalen Reaktionen — und wähle eine kleine Handlung, die das Licht dieses Zeichens ehrt, ohne seinen Schatten zu nähren.`,
  fr: (modal, p, s) => `Sur le plan évolutif, ${modal}. Conseil pratique : observe où ${p} en ${s} s'active dans les sept prochains jours — dans les conversations, décisions rapides, réactions émotionnelles — et choisis une petite action qui honore la lumière de ce signe sans nourrir l'ombre.`,
}

const HOUSE_INTRO = {
  pt: (p, c, dom, tema) => [
    `Quando ${p} ocupa a ${c}ª Casa, a tua ${dom} desenha-se no palco da ${tema}. Esta casa não é cenário decorativo: é o território da vida onde esta energia se torna visível, testada e, com o tempo, dominada ou integrada.`,
    `Aqui aprendes que o mapa não separa carácter de circunstância — a forma como vives ${dom} molda experiências nesta área, e estas experiências devolvem-te um espelho sobre quem estás a tornar-te. Repetições frustrantes nesta casa são convites à maturidade, não maldições.`,
    `Para trabalhar conscientemente este posicionamento, ritualiza uma prática semanal ligada à ${c}ª Casa: um gesto simples, consistente, que alinhe ${p} com intenção e não apenas com hábito automático.`,
  ],
  en: (p, c, dom, tema) => [
    `When ${p} occupies House ${c}, your ${dom} unfolds on the stage of ${tema}. This house is not decorative scenery: it is life's territory where this energy becomes visible, tested and, over time, mastered or integrated.`,
    `Here you learn the chart does not separate character from circumstance — how you live ${dom} shapes experiences in this area, and those experiences mirror who you are becoming. Frustrating repetitions in this house are invitations to maturity, not curses.`,
    `To work this placement consciously, ritualise a weekly practice linked to House ${c}: one simple, consistent gesture aligning ${p} with intention, not mere automatic habit.`,
  ],
  es: (p, c, dom, tema) => [
    `Cuando ${p} ocupa la Casa ${c}, tu ${dom} se dibuja en el escenario de ${tema}. Esta casa no es decorado: es el territorio de la vida donde esta energía se vuelve visible, se prueba y, con el tiempo, se domina o integra.`,
    `Aquí aprendes que la carta no separa carácter de circunstancia — la forma en que vives ${dom} moldea experiencias en esta área, y estas experiencias te devuelven un espejo de quién te estás convirtiendo. Las repeticiones frustrantes en esta casa son invitaciones a la madurez, no maldiciones.`,
    `Para trabajar conscientemente este posicionamiento, ritualiza una práctica semanal ligada a la Casa ${c}: un gesto simple y constante que alinee ${p} con intención y no solo con hábito automático.`,
  ],
  it: (p, c, dom, tema) => [
    `Quando ${p} occupa la Casa ${c}, la tua ${dom} si disegna sul palco di ${tema}. Questa casa non è scenografia decorativa: è il territorio della vita dove questa energia diventa visibile, viene messa alla prova e, col tempo, dominata o integrata.`,
    `Qui impari che la carta non separa carattere da circostanza — il modo in cui vivi ${dom} modella esperienze in quest'area, e queste esperienze ti restituiscono uno specchio di chi stai diventando. Le ripetizioni frustranti in questa casa sono inviti alla maturità, non maledizioni.`,
    `Per lavorare consapevolmente questo posizionamento, ritualizza una pratica settimanale legata alla Casa ${c}: un gesto semplice e costante che allinei ${p} con intenzione e non solo con abitudine automatica.`,
  ],
  de: (p, c, dom, tema) => [
    `Wenn ${p} das Haus ${c} besetzt, entfaltet sich deine ${dom} auf der Bühne von ${tema}. Dieses Haus ist keine Dekoration: Es ist Lebensgebiet, wo diese Energie sichtbar wird, geprüft und mit der Zeit gemeistert oder integriert wird.`,
    `Hier lernst du, dass die Karte Charakter und Umstand nicht trennt — wie du ${dom} lebst, formt Erfahrungen in diesem Bereich, und diese Erfahrungen spiegeln, wer du wirst. Frustrierende Wiederholungen in diesem Haus sind Einladungen zur Reife, keine Flüche.`,
    `Um diese Position bewusst zu arbeiten, ritualisiere eine wöchentliche Praxis zum Haus ${c}: eine einfache, beständige Geste, die ${p} mit Absicht ausrichtet, nicht nur mit automatischer Gewohnheit.`,
  ],
  fr: (p, c, dom, tema) => [
    `Quand ${p} occupe la Maison ${c}, ta ${dom} se dessine sur la scène de ${tema}. Cette maison n'est pas un décor : c'est le territoire de la vie où cette énergie devient visible, est éprouvée et, avec le temps, maîtrisée ou intégrée.`,
    `Ici tu apprends que la carte ne sépare pas caractère et circonstance — la façon dont tu vis ${dom} façonne les expériences dans ce domaine, et ces expériences te renvoient un miroir de qui tu deviens. Les répétitions frustrantes dans cette maison sont des invitations à la maturité, pas des malédictions.`,
    `Pour travailler consciemment cette position, ritualise une pratique hebdomadaire liée à la Maison ${c} : un geste simple et constant qui aligne ${p} avec intention et pas seulement avec habitude automatique.`,
  ],
}

function gerarPlanetSign(planeta, signoPt, lang) {
  const idx = SIGNOS_PT.indexOf(signoPt)
  const signoLang = SIGNOS_BY_LANG[lang][idx]
  const planetaLang = PLANETAS_BY_LANG[lang][PLANETAS.indexOf(planeta)]
  const elem = ELEMENTO[signoPt]
  const mod = MODAL[signoPt]
  const dom = DOMINIO[lang][planeta]
  const ess = ESSENCIA[lang][signoPt]
  const elemNome = ELEM_NOME[lang][elem]
  const modNome = MODAL_NOME[lang][mod]
  const sombra = SOMBRA[lang][elem]
  const luz = LUZ[lang][elem]
  const modalTxt = MODAL_TEXTO[lang][mod]
  return [
    INTRO_SIGN[lang](planetaLang, signoLang, dom, ess, elemNome, modNome),
    SHADOW_BLOCK[lang](sombra, luz),
    EVOL_BLOCK[lang](modalTxt, planetaLang, signoLang),
  ].join('\n\n')
}

function gerarPlanetHouse(planeta, casa, lang) {
  const planetaLang = PLANETAS_BY_LANG[lang][PLANETAS.indexOf(planeta)]
  const dom = DOMINIO[lang][planeta]
  const tema = CASA_TEMA[lang][casa]
  return HOUSE_INTRO[lang](planetaLang, casa, dom, tema).join('\n\n')
}

const LANGS = ['pt', 'en', 'es', 'it', 'de', 'fr']
const planetSign = Object.fromEntries(LANGS.map((l) => [l, {}]))
const planetHouse = Object.fromEntries(LANGS.map((l) => [l, {}]))

for (const lang of LANGS) {
  for (const p of PLANETAS) {
    const pLang = PLANETAS_BY_LANG[lang][PLANETAS.indexOf(p)]
    planetSign[lang][pLang] = {}
    planetHouse[lang][pLang] = {}
    for (const s of SIGNOS_PT) {
      const sLang = SIGNOS_BY_LANG[lang][SIGNOS_PT.indexOf(s)]
      planetSign[lang][pLang][sLang] = gerarPlanetSign(p, s, lang)
    }
    for (let c = 1; c <= 12; c++) {
      planetHouse[lang][pLang][c] = gerarPlanetHouse(p, c, lang)
    }
  }
}

mkdirSync(OUT, { recursive: true })

function writeModule(name, varName, data) {
  const content = `/** Gerado por scripts/gerar-lexicon-mapas.mjs — não editar à mão */\nexport const ${varName} = ${JSON.stringify(data, null, 2)}\n`
  writeFileSync(join(OUT, name), content, 'utf8')
}

for (const lang of LANGS) {
  writeModule(`planetSign.${lang}.js`, `PLANET_SIGN_${lang.toUpperCase()}`, planetSign[lang])
  writeModule(`planetHouse.${lang}.js`, `PLANET_HOUSE_${lang.toUpperCase()}`, planetHouse[lang])
}

console.log('Lexicon gerado para', LANGS.join(', '), '→', OUT)
