import { chatCompletion } from './ai.mjs'

const SIGNOS_PT = [
  'Carneiro', 'Touro', 'Gémeos', 'Caranguejo', 'Leão', 'Virgem',
  'Balança', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes',
]

const SIGNOS_EN = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
]

const SIGNOS_ES = [
  'Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
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

const SOCIAL_PT = [
  '🌙 {fase} hoje - o céu pede pausa. Pergunta ao Oráculo Sidus (3 grátis) → sidusastro.com',
  '✦ Mapa astral + Oráculo Sidus. Descobre Sol, Lua e Ascendente → sidusastro.com',
  '🔮 Horóscopo do dia no Sidus. Qual é o teu signo? → sidusastro.com/horoscopo',
  '⭐ Trânsitos de hoje explicados pelo teu mapa. sidusastro.com',
  '🎴 Tarot online + Oráculo Sidus - sidusastro.com/tarot',
]

const SOCIAL_EN = [
  '🌙 {phase} today - ask Sidus Oracle (3 free) → sidusastro.com',
  '✦ Natal chart + Sidus Oracle. Sun, Moon & Ascendant → sidusastro.com',
  '🔮 Daily horoscope on Sidus → sidusastro.com/horoscopo',
  '⭐ Today\'s transits through your chart → sidusastro.com',
  '🎴 Online Tarot + Sidus Oracle → sidusastro.com/tarot',
]

const SOCIAL_ES = [
  '🌙 {fase} hoy - el cielo pide pausa. Pregunta al Oráculo Sidus (3 gratis) → sidusastro.com',
  '✦ Mapa astral + Oráculo Sidus. Descubre Sol, Luna y Ascendente → sidusastro.com',
  '🔮 Horóscopo del día en Sidus. ¿Cuál es tu signo? → sidusastro.com/horoscopo',
  '⭐ Tránsitos de hoy explicados por tu mapa. sidusastro.com',
  '🎴 Tarot online + Oráculo Sidus - sidusastro.com/tarot',
]

const SOCIAL_IT = [
  '🌙 {fase} oggi - il cielo chiede una pausa. Chiedi all\'Oracolo Sidus (3 gratis) → sidusastro.com',
  '✦ Tema natale + Oracolo Sidus. Scopri Sole, Luna e Ascendente → sidusastro.com',
  '🔮 Oroscopo del giorno su Sidus. Qual è il tuo segno? → sidusastro.com/horoscopo',
  '⭐ Transiti di oggi spiegati dal tuo tema. sidusastro.com',
  '🎴 Tarot online + Oracolo Sidus - sidusastro.com/tarot',
]

const SOCIAL_DE = [
  '🌙 {fase} heute - der Himmel bittet um Pause. Frage Sidus Oracle (3 kostenlos) → sidusastro.com',
  '✦ Geburtshoroskop + Sidus Oracle. Sonne, Mond & Aszendent → sidusastro.com',
  '🔮 Tageshoroskop auf Sidus. Was ist dein Zeichen? → sidusastro.com/horoscopo',
  '⭐ Heutige Transite durch dein Chart erklärt. sidusastro.com',
  '🎴 Online Tarot + Sidus Oracle - sidusastro.com/tarot',
]

const SOCIAL_FR = [
  '🌙 {fase} aujourd\'hui - le ciel demande une pause. Demandez à Sidus Oracle (3 gratuits) → sidusastro.com',
  '✦ Thème natal + Oracle Sidus. Découvrez Soleil, Lune et Ascendant → sidusastro.com',
  '🔮 Horoscope du jour sur Sidus. Quel est votre signe? → sidusastro.com/horoscopo',
  '⭐ Transits d\'aujourd\'hui expliqués par votre thème. sidusastro.com',
  '🎴 Tarot en ligne + Oracle Sidus - sidusastro.com/tarot',
]

function templateHoroscope(sign, fase, seed, lang) {
  const templates = {
    pt: [
      `${fase} favorece introspeção. ${sign}: escuta o coração antes de decidir.`,
      `Energia mutável no ar. ${sign}: pequenos passos trazem clareza hoje.`,
      `Dia para alinhar intenção e acção. ${sign}: uma conversa honesta abre portas.`,
      `${sign}: o cosmos convida ao equilíbrio - descansa se o corpo pedir.`,
      `Momento de foco prático. ${sign}: consolida o que já começaste.`,
    ],
    en: [
      `${fase} invites reflection. ${sign}: listen to your heart before deciding.`,
      `Mutable energy in the air. ${sign}: small steps bring clarity today.`,
      `A day to align intention and action. ${sign}: honest talk opens doors.`,
      `${sign}: the cosmos calls for balance - rest if your body asks.`,
      `Practical focus moment. ${sign}: consolidate what you already started.`,
    ],
    es: [
      `${fase} invita a la introspección. ${sign}: escucha el corazón antes de decidir.`,
      `Energía mutable en el aire. ${sign}: pequeños pasos traen claridad hoy.`,
      `Día para alinear intención y acción. ${sign}: una conversación honesta abre puertas.`,
      `${sign}: el cosmos invita al equilibrio - descansa si el cuerpo lo pide.`,
      `Momento de foco práctico. ${sign}: consolida lo que ya empezaste.`,
    ],
    it: [
      `${fase} invita l\'introspezione. ${sign}: ascolta il cuore prima di decidere.`,
      `Energia mutevole nell\'aria. ${sign}: piccoli passi portano chiarezza oggi.`,
      `Giorno per allineare intenzione e azione. ${sign}: una conversazione onesta apre porte.`,
      `${sign}: il cosmo invita all\'equilibrio - riposa se il corpo lo chiede.`,
      `Momento di focus pratico. ${sign}: consolida quello che hai già iniziato.`,
    ],
    de: [
      `${fase} lädt zur Introspektion ein. ${sign}: höre auf dein Herz, bevor du entscheidest.`,
      `Veränderliche Energie liegt in der Luft. ${sign}: kleine Schritte bringen heute Klarheit.`,
      `Ein Tag, um Absicht und Handlung in Einklang zu bringen. ${sign}: ehrliches Gespräch öffnet Türen.`,
      `${sign}: der Kosmos ruft zur Balance - ruhe dich aus, wenn der Körper danach verlangt.`,
      `Praktischer Fokus-Moment. ${sign}: konsolidiere, was du bereits begonnen hast.`,
    ],
    fr: [
      `${fase} invite à l\'introspection. ${sign}: écoutez votre cœur avant de décider.`,
      `Énergie mutable dans l\'air. ${sign}: les petits pas apportent la clarté aujourd\'hui.`,
      `Journée pour aligner intention et action. ${sign}: une conversation honnête ouvre des portes.`,
      `${sign}: le cosmos invite à l\'équilibre - reposez-vous si le corps le demande.`,
      `Moment de focus pratique. ${sign}: consolidez ce que vous avez déjà commencé.`,
    ],
  }
  const msgs = templates[lang] || templates.en
  return msgs[(seed + sign.length) % msgs.length]
}

function buildTemplatePack({ date, fasePt, faseEn }) {
  const seed = date.split('-').reduce((a, b) => a + Number(b), 0)
  const horoscopes = {
    pt: Object.fromEntries(SIGNOS_PT.map((s) => [s, templateHoroscope(s, fasePt, seed, 'pt')])),
    en: Object.fromEntries(SIGNOS_EN.map((s, i) => [s, templateHoroscope(s, faseEn, seed + i, 'en')])),
    es: Object.fromEntries(SIGNOS_ES.map((s, i) => [s, templateHoroscope(s, fasePt, seed + i, 'es')])),
    it: Object.fromEntries(SIGNOS_IT.map((s, i) => [s, templateHoroscope(s, fasePt, seed + i, 'it')])),
    de: Object.fromEntries(SIGNOS_DE.map((s, i) => [s, templateHoroscope(s, fasePt, seed + i, 'de')])),
    fr: Object.fromEntries(SIGNOS_FR.map((s, i) => [s, templateHoroscope(s, fasePt, seed + i, 'fr')])),
  }
  const dow = new Date(`${date}T12:00:00Z`).getUTCDay()
  const social = {
    pt: {
      text: SOCIAL_PT[dow % SOCIAL_PT.length].replace('{fase}', fasePt),
      hashtags: '#sidusastro #astrologia #mapaastral #oráculo #horóscopo',
    },
    en: {
      text: SOCIAL_EN[dow % SOCIAL_EN.length].replace('{phase}', faseEn),
      hashtags: '#sidusastro #astrology #natalchart #oracle #horoscope',
    },
    es: {
      text: SOCIAL_ES[dow % SOCIAL_ES.length].replace('{fase}', fasePt),
      hashtags: '#sidusastro #astrologia #horoscopo #oraculo #tarot',
    },
    it: {
      text: SOCIAL_IT[dow % SOCIAL_IT.length].replace('{fase}', fasePt),
      hashtags: '#sidusastro #astrologia #oroscopo #oracolo #tarot',
    },
    de: {
      text: SOCIAL_DE[dow % SOCIAL_DE.length].replace('{fase}', fasePt),
      hashtags: '#sidusastro #astrologie #horoskop #orakel #tarot',
    },
    fr: {
      text: SOCIAL_FR[dow % SOCIAL_FR.length].replace('{fase}', fasePt),
      hashtags: '#sidusastro #astrologie #horoscope #oracle #tarot',
    },
  }
  return {
    date,
    horoscopes,
    social,
    transitNote: {
      pt: `Céu de ${date}: ${fasePt}. Consulta trânsitos completos na home Sidus.`,
      en: `Sky for ${date}: ${faseEn}. See full transits on Sidus home.`,
      es: `Cielo de ${date}: ${fasePt}. Consulta tránsitos completos en Sidus.`,
      it: `Cielo di ${date}: ${fasePt}. Consulta transiti completi su Sidus.`,
      de: `Himmel von ${date}: ${fasePt}. Vollständige Transite auf Sidus.`,
      fr: `Ciel du ${date}: ${fasePt}. Consultez les transits complets sur Sidus.`,
    },
    source: 'template',
    generatedAt: new Date().toISOString(),
  }
}

async function buildIAPack({ date, fasePt, faseEn, transitSummary }) {
  const system = `You generate daily astrology content for Sidus Astro. JSON only, no markdown.`
  const user = `Date: ${date}
Moon phase PT: ${fasePt}
Moon phase EN: ${faseEn}
Transits hint: ${transitSummary}

Return JSON:
{
  "horoscopes": {
    "pt": { "Carneiro": "2 sentences PT-PT", ... all 12 PT signs },
    "en": { "Aries": "2 sentences EN", ... all 12 EN signs },
    "es": { "Aries": "2 sentences ES", ... all 12 ES signs },
    "it": { "Ariete": "2 sentences IT", ... all 12 IT signs },
    "de": { "Widder": "2 sentences DE", ... all 12 DE signs },
    "fr": { "Bélier": "2 sentences FR", ... all 12 FR signs }
  },
  "social": {
    "pt": { "text": "TikTok caption PT max 200 chars with sidusastro.com", "hashtags": "#..." },
    "en": { "text": "TikTok caption EN", "hashtags": "#..." },
    "es": { "text": "TikTok caption ES", "hashtags": "#..." },
    "it": { "text": "TikTok caption IT", "hashtags": "#..." },
    "de": { "text": "TikTok caption DE", "hashtags": "#..." },
    "fr": { "text": "TikTok caption FR", "hashtags": "#..." }
  },
  "transitNote": {
    "pt": "1 sentence PT",
    "en": "1 sentence EN",
    "es": "1 sentence ES",
    "it": "1 sentence IT",
    "de": "1 sentence DE",
    "fr": "1 sentence FR"
  }
}`

  const raw = await chatCompletion({
    system,
    messages: [{ role: 'user', content: user }],
    maxTokens: 3000,
    temperature: 0.82,
    escopo: 'astrologia',
    lang: 'pt',
  })

  if (!raw) return null

  try {
    const json = JSON.parse(raw.replace(/```json|```/g, '').trim())
    if (!json?.horoscopes?.pt || !json?.horoscopes?.en) return null
    return {
      date,
      horoscopes: json.horoscopes,
      social: json.social,
      transitNote: json.transitNote,
      source: 'ia',
      generatedAt: new Date().toISOString(),
    }
  } catch {
    return null
  }
}

export async function generateDailyContent({ date, fasePt, faseEn, transitSummary }) {
  const ia = await buildIAPack({ date, fasePt, faseEn, transitSummary })
  if (ia) return ia
  return buildTemplatePack({ date, fasePt, faseEn })
}
