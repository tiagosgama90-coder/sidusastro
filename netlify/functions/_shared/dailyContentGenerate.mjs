import { chatCompletion } from './ai.mjs'

const SIGNOS_PT = [
  'Carneiro', 'Touro', 'Gémeos', 'Caranguejo', 'Leão', 'Virgem',
  'Balança', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes',
]

const SIGNOS_EN = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
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

function templateHoroscopePT(signo, fase, seed) {
  const msgs = [
    `${fase} favorece introspeção. ${signo}: escuta o coração antes de decidir.`,
    `Energia mutável no ar. ${signo}: pequenos passos trazem clareza hoje.`,
    `Dia para alinhar intenção e acção. ${signo}: uma conversa honesta abre portas.`,
    `${signo}: o cosmos convida ao equilíbrio - descansa se o corpo pedir.`,
    `Momento de foco prático. ${signo}: consolida o que já começaste.`,
  ]
  return msgs[(seed + signo.length) % msgs.length]
}

function templateHoroscopeEN(sign, phase, seed) {
  const msgs = [
    `${phase} invites reflection. ${sign}: listen to your heart before deciding.`,
    `Mutable energy in the air. ${sign}: small steps bring clarity today.`,
    `A day to align intention and action. ${sign}: honest talk opens doors.`,
    `${sign}: the cosmos calls for balance - rest if your body asks.`,
    `Practical focus moment. ${sign}: consolidate what you already started.`,
  ]
  return msgs[(seed + sign.length) % msgs.length]
}

function buildTemplatePack({ date, fasePt, faseEn }) {
  const seed = date.split('-').reduce((a, b) => a + Number(b), 0)
  const horoscopes = {
    pt: Object.fromEntries(SIGNOS_PT.map((s) => [s, templateHoroscopePT(s, fasePt, seed)])),
    en: Object.fromEntries(SIGNOS_EN.map((s, i) => [s, templateHoroscopeEN(s, faseEn, seed + i)])),
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
  }
  return {
    date,
    horoscopes,
    social,
    transitNote: {
      pt: `Céu de ${date}: ${fasePt}. Consulta trânsitos completos na home Sidus.`,
      en: `Sky for ${date}: ${faseEn}. See full transits on Sidus home.`,
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
    "en": { "Aries": "2 sentences EN", ... all 12 EN signs }
  },
  "social": {
    "pt": { "text": "TikTok caption PT max 200 chars with sidusastro.com", "hashtags": "#..." },
    "en": { "text": "TikTok caption EN", "hashtags": "#..." }
  },
  "transitNote": { "pt": "1 sentence", "en": "1 sentence" }
}`

  const raw = await chatCompletion({
    system,
    messages: [{ role: 'user', content: user }],
    maxTokens: 1800,
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
