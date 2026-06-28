/**
 * Gera matrizes planetSign e planetHouse (PT/EN) para o lexicon Sidus.
 * Estilo Cafe Astrology: prosa longa, humana, sem graus/orbes.
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

const PLANETAS = ['Sol', 'Lua', 'Mercúrio', 'Vénus', 'Marte', 'Júpiter', 'Saturno', 'Urano', 'Neptuno', 'Plutão']
const PLANETAS_EN = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']

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

const DOMINIO_PT = {
  Sol: 'identidade consciente e vitalidade',
  Lua: 'mundo emocional e memória afectiva',
  Mercúrio: 'mente, linguagem e aprendizagem',
  Vénus: 'amor, prazer e valores pessoais',
  Marte: 'desejo, coragem e forma de agir',
  Júpiter: 'fé, expansão e sentido',
  Saturno: 'limites, maturidade e compromisso',
  Urano: 'liberdade, ruptura e originalidade',
  Neptuno: 'imaginação, compaixão e transcendência',
  Plutão: 'transformação, poder e regeneração',
}

const DOMINIO_EN = {
  Sun: 'conscious identity and vitality',
  Moon: 'emotional world and affective memory',
  Mercury: 'mind, language and learning',
  Venus: 'love, pleasure and personal values',
  Mars: 'desire, courage and way of acting',
  Jupiter: 'faith, expansion and meaning',
  Saturn: 'limits, maturity and commitment',
  Uranus: 'freedom, rupture and originality',
  Neptune: 'imagination, compassion and transcendence',
  Pluto: 'transformation, power and regeneration',
}

const ESSENCIA_SIGNO_PT = {
  Carneiro: 'impulso pioneiro que não espera permissão',
  Touro: 'persistência sensorial e construção paciente',
  Gémeos: 'curiosidade viva e inteligência relacional',
  Caranguejo: 'profundidade emocional e instinto protetor',
  Leão: 'criatividade radiante e coração generoso',
  Virgem: 'discernimento prático e serviço consciente',
  Balança: 'diplomacia estética e busca de equilíbrio',
  Escorpião: 'intensidade transformadora e coragem psíquica',
  Sagitário: 'visão ampla e honestidade filosófica',
  Capricórnio: 'disciplina estratégica e senso de legado',
  Aquário: 'originalidade humanitária e mente livre',
  Peixes: 'compaixão fluida e imaginação sem fronteiras',
}

const ESSENCIA_SIGNO_EN = {
  Aries: 'pioneer impulse that waits for no permission',
  Taurus: 'sensory persistence and patient building',
  Gemini: 'living curiosity and relational intelligence',
  Cancer: 'emotional depth and protective instinct',
  Leo: 'radiant creativity and generous heart',
  Virgo: 'practical discernment and conscious service',
  Libra: 'aesthetic diplomacy and search for balance',
  Scorpio: 'transformative intensity and psychic courage',
  Sagittarius: 'broad vision and philosophical honesty',
  Capricorn: 'strategic discipline and sense of legacy',
  Aquarius: 'humanitarian originality and free mind',
  Pisces: 'fluid compassion and borderless imagination',
}

const SOMBRA_PT = {
  Fogo: 'impaciência, orgulho ferido e reacção explosiva quando a vontade é contrariada',
  Terra: 'apego, resistência à mudança e medo silencioso de perder segurança',
  Ar: 'dispersão mental, ironia defensiva e distância quando a profundidade assusta',
  Água: 'fusão excessiva, nostalgia paralisante e medo de abandono que controla escolhas',
}

const LUZ_PT = {
  Fogo: 'coragem autêntica, presença inspiradora e capacidade de recomeçar',
  Terra: 'estabilidade que acalma, talento para materializar sonhos e paciência fértil',
  Ar: 'adaptabilidade brilhante, humor curador e visão que liga mundos',
  Água: 'empatia profunda, intuição fina e capacidade de curar através do sentir',
}

const MODAL_TEXTO_PT = {
  cardinal: 'inicias ciclos com força; o desafio é sustentar o que começaste sem abandonar no primeiro obstáculo',
  fixo: 'manténs o rumo com tenacidade; o desafio é flexibilizar sem sentir que traíste a tua verdade',
  mutável: 'adaptas-te com graça às mudanças; o desafio é ancorar-te para não te dissolveres no ambiente',
}

const CASA_TEMA_PT = {
  1: 'identidade visível e maneira de entrar no mundo',
  2: 'recursos, autoestima material e o que cultivas como valor',
  3: 'comunicação quotidiana, aprendizagem e laços próximos',
  4: 'raízes emocionais, lar interior e memória familiar',
  5: 'criatividade, romance, prazer e expressão autêntica',
  6: 'rotina, corpo, trabalho diário e serviço útil',
  7: 'parcerias, contratos e o espelho relacional',
  8: 'intimidade profunda, crises regeneradoras e partilha de poder',
  9: 'filosofia, viagens de sentido e horizontes amplos',
  10: 'vocação pública, reputação e legado profissional',
  11: 'amizades, causas colectivas e futuro desejado',
  12: 'inconsciente, retiro espiritual e compaixão silenciosa',
}

const CASA_TEMA_EN = {
  1: 'visible identity and way of entering the world',
  2: 'resources, material self-worth and what you cultivate as value',
  3: 'daily communication, learning and close bonds',
  4: 'emotional roots, inner home and family memory',
  5: 'creativity, romance, pleasure and authentic expression',
  6: 'routine, body, daily work and useful service',
  7: 'partnerships, contracts and relational mirror',
  8: 'deep intimacy, regenerative crises and shared power',
  9: 'philosophy, journeys of meaning and broad horizons',
  10: 'public vocation, reputation and professional legacy',
  11: 'friendships, collective causes and desired future',
  12: 'unconscious, spiritual retreat and silent compassion',
}

function gerarPlanetSign(planeta, signo, lang) {
  const elem = ELEMENTO[signo]
  const mod = MODAL[signo]
  if (lang === 'pt') {
    const dominio = DOMINIO_PT[planeta]
    const ess = ESSENCIA_SIGNO_PT[signo]
    const sombra = SOMBRA_PT[elem]
    const luz = LUZ_PT[elem]
    const modalTxt = MODAL_TEXTO_PT[mod]
    return [
      `Com ${planeta} em ${signo}, a tua ${dominio} ganha o colorido de ${ess}. Não é um rótulo genérico: é a forma particular como vives esta função psíquica quando o elemento ${elem.toLowerCase()} e a modalidade ${mod} se encontram no teu mapa. Aqui, a vida pede-te presença concreta — não teorias sobre quem deverias ser, mas a experiência vivida desta combinação única.`,
      `A sombra deste posicionamento manifesta-se como ${sombra}. Reconhecer estes padrões sem te julgares é o primeiro passo para deixar de repetir dramas inconscientes. A luz, por outro lado, revela ${luz} — qualidades que outros frequentemente vêem em ti antes de tu próprio/a as assumires plenamente.`,
      `No plano evolutivo, ${modalTxt}. Conselho prático: observa onde ${planeta} em ${signo} se activa nos próximos sete dias — nas conversas, nas decisões rápidas, nas reacções emocionais — e escolhe uma acção pequena que honre a luz deste signo sem alimentar a sombra.`,
    ].join('\n\n')
  }
  const signoEn = SIGNOS_EN[SIGNOS_PT.indexOf(signo)]
  const planetaEn = PLANETAS_EN[PLANETAS.indexOf(planeta)]
  const elemEn = { Fogo: 'Fire', Terra: 'Earth', Ar: 'Air', Água: 'Water' }[elem]
  const modEn = { cardinal: 'cardinal', fixo: 'fixed', mutável: 'mutable' }[mod]
  const dominio = DOMINIO_EN[planetaEn]
  const ess = ESSENCIA_SIGNO_EN[signoEn]
  const shadowEn = {
    Fire: 'impatience, wounded pride and explosive reaction when will is thwarted',
    Earth: 'attachment, resistance to change and silent fear of losing security',
    Air: 'mental dispersion, defensive irony and distance when depth frightens',
    Water: 'excessive fusion, paralysing nostalgia and fear of abandonment controlling choices',
  }[elemEn]
  const lightEn = {
    Fire: 'authentic courage, inspiring presence and ability to begin again',
    Earth: 'calming stability, talent to materialise dreams and fertile patience',
    Air: 'brilliant adaptability, healing humour and vision that connects worlds',
    Water: 'deep empathy, fine intuition and ability to heal through feeling',
  }[elemEn]
  const modalEn = {
    cardinal: 'you initiate cycles with force; the challenge is sustaining what you began without abandoning at the first obstacle',
    fixed: 'you hold course with tenacity; the challenge is flexing without feeling you betrayed your truth',
    mutable: 'you adapt gracefully to change; the challenge is anchoring so you do not dissolve into the environment',
  }[modEn]
  return [
    `With ${planetaEn} in ${signoEn}, your ${dominio} takes the colour of ${ess}. This is not a generic label: it is how you live this psychic function when ${elemEn} and ${modEn} modality meet in your chart. Life asks for concrete presence — not theories about who you should be, but lived experience of this unique combination.`,
    `The shadow of this placement shows as ${shadowEn}. Recognising these patterns without self-judgment is the first step to stop repeating unconscious dramas. The light reveals ${lightEn} — qualities others often see in you before you fully claim them.`,
    `Evolutionarily, ${modalEn}. Practical counsel: notice where ${planetaEn} in ${signoEn} activates in the next seven days — in conversations, quick decisions, emotional reactions — and choose one small action that honours this sign's light without feeding its shadow.`,
  ].join('\n\n')
}

function gerarPlanetHouse(planeta, casa, lang) {
  if (lang === 'pt') {
    const dominio = DOMINIO_PT[planeta]
    const tema = CASA_TEMA_PT[casa]
    return [
      `Quando ${planeta} ocupa a ${casa}ª Casa, a tua ${dominio} desenha-se no palco da ${tema}. Esta casa não é cenário decorativo: é o território da vida onde esta energia se torna visível, testada e, com o tempo, dominada ou integrada.`,
      `Aqui aprendes que o mapa não separa carácter de circunstância — a forma como vives ${dominio} molda experiências nesta área, e estas experiências devolvem-te um espelho sobre quem estás a tornar-te. Repetições frustrantes nesta casa são convites à maturidade, não maldições.`,
      `Para trabalhar conscientemente este posicionamento, ritualiza uma prática semanal ligada à ${casa}ª Casa: um gesto simples, consistente, que alinhe ${planeta} com intenção e não apenas com hábito automático.`,
    ].join('\n\n')
  }
  const planetaEn = PLANETAS_EN[PLANETAS.indexOf(planeta)]
  const tema = CASA_TEMA_EN[casa]
  const dominio = DOMINIO_EN[planetaEn]
  return [
    `When ${planetaEn} occupies House ${casa}, your ${dominio} unfolds on the stage of ${tema}. This house is not decorative scenery: it is life's territory where this energy becomes visible, tested and, over time, mastered or integrated.`,
    `Here you learn the chart does not separate character from circumstance — how you live ${dominio} shapes experiences in this area, and those experiences mirror who you are becoming. Frustrating repetitions in this house are invitations to maturity, not curses.`,
    `To work this placement consciously, ritualise a weekly practice linked to House ${casa}: one simple, consistent gesture aligning ${planetaEn} with intention, not mere automatic habit.`,
  ].join('\n\n')
}

const planetSignPt = {}
const planetSignEn = {}
const planetHousePt = {}
const planetHouseEn = {}

for (const p of PLANETAS) {
  planetSignPt[p] = {}
  planetHousePt[p] = {}
  const pEn = PLANETAS_EN[PLANETAS.indexOf(p)]
  planetSignEn[pEn] = {}
  planetHouseEn[pEn] = {}
  for (const s of SIGNOS_PT) {
    planetSignPt[p][s] = gerarPlanetSign(p, s, 'pt')
    planetSignEn[pEn][SIGNOS_EN[SIGNOS_PT.indexOf(s)]] = gerarPlanetSign(p, s, 'en')
  }
  for (let c = 1; c <= 12; c++) {
    planetHousePt[p][c] = gerarPlanetHouse(p, c, 'pt')
    planetHouseEn[pEn][c] = gerarPlanetHouse(p, c, 'en')
  }
}

mkdirSync(OUT, { recursive: true })

function writeModule(name, varName, data) {
  const content = `/** Gerado por scripts/gerar-lexicon-mapas.mjs — não editar à mão */\nexport const ${varName} = ${JSON.stringify(data, null, 2)}\n`
  writeFileSync(join(OUT, name), content, 'utf8')
}

writeModule('planetSign.pt.js', 'PLANET_SIGN_PT', planetSignPt)
writeModule('planetSign.en.js', 'PLANET_SIGN_EN', planetSignEn)
writeModule('planetHouse.pt.js', 'PLANET_HOUSE_PT', planetHousePt)
writeModule('planetHouse.en.js', 'PLANET_HOUSE_EN', planetHouseEn)

console.log('Lexicon gerado:', OUT)
