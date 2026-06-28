import { SIGNOS_PT, SIGNOS_EN, SIGNO_PT_TO_EN } from './i18n/astro.js'

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

function templateLine(sign, fase, seed, lang) {
  const msgsPt = [
    `${fase}: escuta o coração antes de decidir. ${sign} em destaque hoje.`,
    `Energia mutável no ar. ${sign}: pequenos passos trazem clareza.`,
    `Dia para alinhar intenção e acção. ${sign}: conversa honesta abre portas.`,
    `${sign}: equilíbrio e descanso se o corpo pedir.`,
    `Foco prático. ${sign}: consolida o que já começaste.`,
  ]
  const msgsEn = [
    `${fase}: listen before deciding. ${sign} in focus today.`,
    `Mutable energy. ${sign}: small steps bring clarity.`,
    `Align intention and action. ${sign}: honest talk opens doors.`,
    `${sign}: balance and rest if your body asks.`,
    `Practical focus. ${sign}: consolidate what you started.`,
  ]
  const msgs = lang === 'en' ? msgsEn : msgsPt
  return msgs[(seed + sign.length) % msgs.length]
}

/** Fallback local se a API não responder (sem Firestore / offline). */
export function buildLocalDailyContent({ fasePt, faseEn, lang = 'pt' }) {
  const date = new Date().toISOString().slice(0, 10)
  const seed = date.split('-').reduce((a, b) => a + Number(b), 0)
  const dow = new Date(`${date}T12:00:00Z`).getUTCDay()

  const horoscopes = {
    pt: Object.fromEntries(SIGNOS_PT.map((s) => [s, templateLine(s, fasePt, seed, 'pt')])),
    en: Object.fromEntries(SIGNOS_EN.map((s, i) => [s, templateLine(s, faseEn, seed + i, 'en')])),
  }

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
      pt: `Céu de ${date}: ${fasePt}.`,
      en: `Sky for ${date}: ${faseEn}.`,
    },
    source: 'local',
    generatedAt: new Date().toISOString(),
  }
}

/** Normaliza nomes de signo (Áries ↔ Carneiro). */
export function signoHoroscopeKey(nomeSolar, lang) {
  if (!nomeSolar) return null
  if (lang === 'en') return SIGNO_PT_TO_EN[nomeSolar] || nomeSolar
  if (nomeSolar === 'Áries') return 'Carneiro'
  return nomeSolar
}
