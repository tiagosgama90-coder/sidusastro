/**
 * Horóscopo diário por signo — trânsitos reais (efemérides) + fase lunar.
 */
import { SIGNOS_PT } from './i18n/astro.js'

const REGENTE_PT = ['Marte', 'Vénus', 'Mercúrio', 'Lua', 'Sol', 'Mercúrio', 'Vénus', 'Marte', 'Júpiter', 'Saturno', 'Saturno', 'Júpiter']

const ASPECTOS = [
  { key: 'conjuncao', angulo: 0, orbe: 8 },
  { key: 'sextil', angulo: 60, orbe: 5 },
  { key: 'quadratura', angulo: 90, orbe: 6 },
  { key: 'trino', angulo: 120, orbe: 6 },
  { key: 'oposicao', angulo: 180, orbe: 7 },
]

function diferencaAngular(a, b) {
  const diff = Math.abs(a - b) % 360
  return diff > 180 ? 360 - diff : diff
}

function aspectoEntre(lon1, lon2) {
  const angle = diferencaAngular(lon1, lon2)
  let best = null
  for (const asp of ASPECTOS) {
    const orbe = Math.abs(angle - asp.angulo)
    if (orbe <= asp.orbe && (!best || orbe < best.orbe)) {
      best = { ...asp, orbe }
    }
  }
  return best
}

function signoIndexPt(nome) {
  if (!nome) return -1
  const n = nome === 'Áries' ? 'Carneiro' : nome
  return SIGNOS_PT.indexOf(n)
}

function relacaoSignos(idxA, idxB) {
  const diff = ((idxB - idxA) + 12) % 12
  if (diff === 0) return 'conjuncao'
  if (diff === 4 || diff === 8) return 'trino'
  if (diff === 3 || diff === 9) return 'quadratura'
  if (diff === 2 || diff === 10) return 'sextil'
  if (diff === 6) return 'oposicao'
  return 'neutro'
}

export function formatarTextoHoroscopo(text) {
  return String(text || '')
    .replace(/\s*\(orbe[^)]*\)/gi, '')
    .replace(/\s*\(orb[^)]*\)/gi, '')
    .replace(/\s*\(Orbis[^)]*\)/gi, '')
    .replace(/—/g, '-')
    .replace(/–/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
}

const PLANETA = {
  pt: { Sol: 'Sol', Lua: 'Lua', Mercúrio: 'Mercúrio', Vénus: 'Vénus', Marte: 'Marte', Júpiter: 'Júpiter', Saturno: 'Saturno' },
  en: { Sol: 'Sun', Lua: 'Moon', Mercúrio: 'Mercury', Vénus: 'Venus', Marte: 'Mars', Júpiter: 'Jupiter', Saturno: 'Saturn' },
  es: { Sol: 'Sol', Lua: 'Luna', Mercúrio: 'Mercurio', Vénus: 'Venus', Marte: 'Marte', Júpiter: 'Júpiter', Saturno: 'Saturno' },
  it: { Sol: 'Sole', Lua: 'Luna', Mercúrio: 'Mercurio', Vénus: 'Venere', Marte: 'Marte', Júpiter: 'Giove', Saturno: 'Saturno' },
  de: { Sol: 'Sonne', Lua: 'Mond', Mercúrio: 'Merkur', Vénus: 'Venus', Marte: 'Mars', Júpiter: 'Jupiter', Saturno: 'Saturn' },
  fr: { Sol: 'Soleil', Lua: 'Lune', Mercúrio: 'Mercure', Vénus: 'Vénus', Marte: 'Mars', Júpiter: 'Jupiter', Saturno: 'Saturne' },
}

const ASP = {
  pt: { conjuncao: 'em conjunção', sextil: 'em sextil', quadratura: 'em quadratura', trino: 'em trino', oposicao: 'em oposição' },
  en: { conjuncao: 'conjunct', sextil: 'sextile', quadratura: 'square', trino: 'trine', oposicao: 'opposite' },
  es: { conjuncao: 'en conjunción', sextil: 'en sextil', quadratura: 'en cuadratura', trino: 'en trino', oposicao: 'en oposición' },
  it: { conjuncao: 'in congiunzione', sextil: 'in sestile', quadratura: 'in quadratura', trino: 'in trigono', oposicao: 'in opposizione' },
  de: { conjuncao: 'in Konjunktion', sextil: 'im Sextil', quadratura: 'im Quadrat', trino: 'im Trigon', oposicao: 'in Opposition' },
  fr: { conjuncao: 'en conjonction', sextil: 'en sextile', quadratura: 'en carré', trino: 'en trigone', oposicao: 'en opposition' },
}

const LUA_REL = {
  pt: {
    conjuncao: (signo, fase) => `${fase}: a Lua transita ${signo}, amplificando emoções e intução neste signo - dia de presença interior.`,
    trino: (signo, fase) => `${fase}: a Lua em trino a ${signo} facilita fluxo emocional e decisões alinhadas.`,
    quadratura: (signo, fase) => `${fase}: a Lua em quadratura a ${signo} pede ajustes - evita reacções impulsivas.`,
    sextil: (signo, fase) => `${fase}: a Lua em sextil a ${signo} abre oportunidades subtis de conexão e criatividade.`,
    oposicao: (signo, fase) => `${fase}: a Lua oposta a ${signo} realça polaridades - equilibra necessidades pessoais e relações.`,
    neutro: (signo, fase) => `${fase}: a Lua move-se pelo céu; ${signo} sente o clima lunar com moderação.`,
  },
  en: {
    conjuncao: (signo, fase) => `${fase}: the Moon transits ${signo}, amplifying emotions and intuition - a day for inner presence.`,
    trino: (signo, fase) => `${fase}: the Moon trines ${signo}, easing emotional flow and aligned decisions.`,
    quadratura: (signo, fase) => `${fase}: the Moon squares ${signo} - avoid impulsive reactions; adjust gently.`,
    sextil: (signo, fase) => `${fase}: the Moon sextiles ${signo}, opening subtle opportunities for connection and creativity.`,
    oposicao: (signo, fase) => `${fase}: the Moon opposes ${signo}, highlighting polarities - balance self and relationships.`,
    neutro: (signo, fase) => `${fase}: the Moon moves through the sky; ${signo} feels lunar climate in moderation.`,
  },
  es: {
    conjuncao: (signo, fase) => `${fase}: la Luna transita ${signo}, amplificando emociones e intuición - día de presencia interior.`,
    trino: (signo, fase) => `${fase}: la Luna en trino a ${signo} facilita flujo emocional y decisiones alineadas.`,
    quadratura: (signo, fase) => `${fase}: la Luna en cuadratura a ${signo} pide ajustes - evita reacciones impulsivas.`,
    sextil: (signo, fase) => `${fase}: la Luna en sextil a ${signo} abre oportunidades sutiles de conexión y creatividad.`,
    oposicao: (signo, fase) => `${fase}: la Luna opuesta a ${signo} realza polaridades - equilibra lo personal y las relaciones.`,
    neutro: (signo, fase) => `${fase}: la Luna se mueve por el cielo; ${signo} siente el clima lunar con moderación.`,
  },
  it: {
    conjuncao: (signo, fase) => `${fase}: la Luna transita ${signo}, amplificando emozioni e intuizione - giornata di presenza interiore.`,
    trino: (signo, fase) => `${fase}: la Luna in trigono a ${signo} facilita flusso emotivo e decisioni allineate.`,
    quadratura: (signo, fase) => `${fase}: la Luna in quadratura a ${signo} chiede aggiustamenti - evita reazioni impulsive.`,
    sextil: (signo, fase) => `${fase}: la Luna in sestile a ${signo} apre opportunità sottili di connessione e creatività.`,
    oposicao: (signo, fase) => `${fase}: la Luna oposta a ${signo} evidenzia polarità - equilibra sé e relazioni.`,
    neutro: (signo, fase) => `${fase}: la Luna si muove nel cielo; ${signo} sente il clima lunare con moderazione.`,
  },
  de: {
    conjuncao: (signo, fase) => `${fase}: der Mond transitiert ${signo} und verstärkt Emotionen und Intuition - ein Tag innerer Präsenz.`,
    trino: (signo, fase) => `${fase}: der Mond im Trigon zu ${signo} erleichtert emotionalen Fluss und kluge Entscheidungen.`,
    quadratura: (signo, fase) => `${fase}: der Mond im Quadrat zu ${signo} verlangt Anpassung - vermeide impulsive Reaktionen.`,
    sextil: (signo, fase) => `${fase}: der Mond im Sextil zu ${signo} öffnet subtile Chancen für Verbindung und Kreativität.`,
    oposicao: (signo, fase) => `${fase}: der Mond gegenüber ${signo} betont Polaritäten - balanciere Selbst und Beziehungen.`,
    neutro: (signo, fase) => `${fase}: der Mond wandert am Himmel; ${signo} spürt das lunare Klima in Maßen.`,
  },
  fr: {
    conjuncao: (signo, fase) => `${fase} : la Lune transite ${signo}, amplifiant émotions et intuition - journée de présence intérieure.`,
    trino: (signo, fase) => `${fase} : la Lune en trigone à ${signo} facilite le flux émotionnel et des décisions alignées.`,
    quadratura: (signo, fase) => `${fase} : la Lune en carré à ${signo} demande des ajustements - évite les réactions impulsives.`,
    sextil: (signo, fase) => `${fase} : la Lune en sextile à ${signo} ouvre des opportunités subtiles de connexion et créativité.`,
    oposicao: (signo, fase) => `${fase} : la Lune opposée à ${signo} met en lumière les polarités - équilibre soi et relations.`,
    neutro: (signo, fase) => `${fase} : la Lune traverse le ciel ; ${signo} ressent le climat lunaire avec modération.`,
  },
}

function planetaLang(nomePt, lang) {
  return (PLANETA[lang] || PLANETA.en)[nomePt] || nomePt
}

function aspLang(tipo, lang) {
  return (ASP[lang] || ASP.en)[tipo] || tipo
}

function frasePlanetaNoSigno(p, signoNome, lang) {
  const pl = planetaLang(p.nome, lang)
  const graus = p.signo?.graus || '0'
  const msgs = {
    pt: `${pl} a ${graus}° em ${signoNome} activa directamente a tua energia solar - presença marcante deste planeta no teu signo.`,
    en: `${pl} at ${graus}° in ${signoNome} directly activates your sign's energy - this planet's presence is strong for you today.`,
    es: `${pl} a ${graus}° en ${signoNome} activa directamente tu energía solar - presencia marcante de este planeta en tu signo.`,
    it: `${pl} a ${graus}° in ${signoNome} attiva direttamente la tua energia solare - presenza marcante di questo pianeta nel tuo segno.`,
    de: `${pl} bei ${graus}° in ${signoNome} aktiviert direkt deine Sonnenenergie - starke Präsenz dieses Planeten in deinem Zeichen.`,
    fr: `${pl} à ${graus}° en ${signoNome} active directement ton énergie solaire - présence marquée de cette planète dans ton signe.`,
  }
  return msgs[lang] || msgs.en
}

function fraseAspectoSigno(p, asp, signoNome, lang) {
  const pl = planetaLang(p.nome, lang)
  const al = aspLang(asp.key, lang)
  const msgs = {
    pt: `${pl} ${al} ao grau solar de ${signoNome} - trânsito preciso que molda o ritmo do dia.`,
    en: `${pl} ${al} ${signoNome}'s solar degree - a precise transit shaping today's rhythm.`,
    es: `${pl} ${al} al grado solar de ${signoNome} - tránsito preciso que moldea el ritmo del día.`,
    it: `${pl} ${al} al grado solare di ${signoNome} - transito preciso che modella il ritmo della giornata.`,
    de: `${pl} ${al} zum Sonnengrad von ${signoNome} - präziser Transit, der den Tagesrhythmus formt.`,
    fr: `${pl} ${al} au degré solaire de ${signoNome} - transit précis qui façonne le rythme du jour.`,
  }
  return msgs[lang] || msgs.en
}

function fraseRegente(aspeto, regente, signoNome, lang) {
  const partes = `${aspeto.planetaA} ${aspeto.aspecto} ${aspeto.planetaB}`
  const msgs = {
    pt: `O regente de ${signoNome} (${regente}) participa no trânsito ${partes} - atenção especial à área de vida que este signo governa.`,
    en: `${signoNome}'s ruler (${regente}) joins transit ${partes} - pay special attention to this sign's life themes.`,
    es: `El regente de ${signoNome} (${regente}) participa en el tránsito ${partes} - atención especial al área de vida que gobierna este signo.`,
    it: `Il reggente di ${signoNome} (${regente}) partecipa al transito ${partes} - attenzione speciale all'area di vita governata da questo segno.`,
    de: `Der Herrscher von ${signoNome} (${regente}) wirkt am Transit ${partes} - besondere Aufmerksamkeit für die Lebensbereiche dieses Zeichens.`,
    fr: `Le maître de ${signoNome} (${regente}) participe au transit ${partes} - attention particulière au domaine de vie gouverné par ce signe.`,
  }
  return msgs[lang] || msgs.en
}

function fraseCeuCalmo(signoNome, lang) {
  const msgs = {
    pt: `Céu sem aspectos exactos ao grau de ${signoNome} - dia estável para consolidar rotinas e honrar o teu ritmo natural.`,
    en: `No exact aspects to ${signoNome}'s degree today - a stable day to consolidate routines and honor your natural rhythm.`,
    es: `Cielo sin aspectos exactos al grado de ${signoNome} - día estable para consolidar rutinas y honrar tu ritmo natural.`,
    it: `Cielo senza aspetti esatti al grado di ${signoNome} - giornata stabile per consolidare routine e onorare il tuo ritmo naturale.`,
    de: `Keine exakten Aspekte zum Grad von ${signoNome} - stabiler Tag, um Routinen zu festigen und deinem natürlichen Rhythmus zu folgen.`,
    fr: `Ciel sans aspects exacts au degré de ${signoNome} - journée stable pour consolider les routines et honorer ton rythme naturel.`,
  }
  return msgs[lang] || msgs.en
}

export function gerarHoroscopoSignoTransito({
  signoIndex,
  signoNome,
  ceuAgora = [],
  aspetos = [],
  faseLua,
  lang = 'pt',
  apiText,
}) {
  if (!ceuAgora?.length) {
    return formatarTextoHoroscopo(apiText || '')
  }

  const partes = []
  const fase = faseLua?.nome || (lang === 'pt' ? 'Lua' : 'Moon')
  const lua = ceuAgora.find((p) => p.key === 'lua' || p.nome === 'Lua')
  const luaIdx = lua ? signoIndexPt(lua.signo?.nome) : -1
  const relLua = luaIdx >= 0 ? relacaoSignos(luaIdx, signoIndex) : 'neutro'
  const luaMsgs = LUA_REL[lang] || LUA_REL.en
  partes.push((luaMsgs[relLua] || luaMsgs.neutro)(signoNome, fase))

  const ptSign = SIGNOS_PT[signoIndex]
  const noSigno = ceuAgora.filter((p) => p.signo?.nome === ptSign && p.key !== 'lua')
  for (const p of noSigno) {
    partes.push(frasePlanetaNoSigno(p, signoNome, lang))
  }

  const cuspLon = signoIndex * 30 + 15
  const aspectosSigno = ceuAgora
    .map((p) => ({ p, asp: aspectoEntre(p.longitude, cuspLon) }))
    .filter(({ p, asp }) => asp && p.signo?.nome !== ptSign)
    .sort((a, b) => a.asp.orbe - b.asp.orbe)
    .slice(0, 2)

  if (aspectosSigno.length) {
    for (const { p, asp } of aspectosSigno) {
      partes.push(fraseAspectoSigno(p, asp, signoNome, lang))
    }
  } else if (!noSigno.length) {
    partes.push(fraseCeuCalmo(signoNome, lang))
  }

  const regente = REGENTE_PT[signoIndex]
  const aspReg = (aspetos || []).find(
    (a) => a.planetaA?.includes(regente) || a.planetaB?.includes(regente),
  )
  if (aspReg) {
    partes.push(fraseRegente(aspReg, planetaLang(regente, lang), signoNome, lang))
  }

  let texto = partes.join(' ')
  if (apiText && apiText.length > 40 && !apiText.includes('pequenos passos')) {
    texto = `${apiText} ${texto}`
  }
  return formatarTextoHoroscopo(texto)
}

export function gerarHoroscoposTodosSignos({
  signList,
  ceuAgora,
  aspetos,
  faseLua,
  lang,
  packHoroscopes = {},
}) {
  return signList.map((nome, i) => {
    const apiText = packHoroscopes[nome] || packHoroscopes[SIGNOS_PT[i]]
    const texto = gerarHoroscopoSignoTransito({
      signoIndex: i,
      signoNome: nome,
      ceuAgora,
      aspetos,
      faseLua,
      lang,
      apiText,
    })
    return { nome, texto, signoIndex: i }
  })
}
