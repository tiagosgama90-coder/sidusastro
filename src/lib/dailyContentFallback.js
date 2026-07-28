import { SIGNOS_PT, SIGNOS_EN, SIGNOS_ES, SIGNOS_IT, SIGNOS_DE, SIGNOS_FR, SIGNO_PT_TO_EN } from './i18n/astro.js'

const SOCIAL_PT = [
  '🌙 {fase} hoje - o céu pede pausa. Pergunta ao Oráculo Sidus (3 grátis) → sidusastro.com',
  'Mapa astral + Oráculo Sidus. Descobre Sol, Lua e Ascendente → sidusastro.com',
  '🔮 Horóscopo do dia no Sidus. Qual é o teu signo? → sidusastro.com/horoscopo',
  '⭐ Trânsitos de hoje explicados pelo teu mapa. sidusastro.com',
  '🎴 Tarot online + Oráculo Sidus - sidusastro.com/tarot',
]

const SOCIAL_EN = [
  '🌙 {phase} today - ask Sidus Oracle (3 free) → sidusastro.com',
  'Natal chart + Sidus Oracle. Sun, Moon & Ascendant → sidusastro.com',
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
  const msgsEs = [
    `${fase}: escucha el corazón antes de decidir. ${sign} en foco hoy.`,
    `Energía mutable en el aire. ${sign}: pequeños pasos traen claridad.`,
    `Día para alinear intención y acción. ${sign}: conversación honesta abre puertas.`,
    `${sign}: equilibrio y descanso si el cuerpo lo pide.`,
    `Enfoque práctico. ${sign}: consolida lo que ya empezaste.`,
  ]
  const msgsIt = [
    `${fase}: ascolta il cuore prima di decidere. ${sign} in primo piano oggi.`,
    `Energia mutevole nell'aria. ${sign}: piccoli passi portano chiarezza.`,
    `Giorno per allineare intenzione e azione. ${sign}: conversazione onesta apre porte.`,
    `${sign}: equilibrio e riposo se il corpo lo chiede.`,
    `Focus pratico. ${sign}: consolida quello che hai già iniziato.`,
  ]
  const msgsDe = [
    `${fase}: höre auf dein Herz, bevor du entscheidest. ${sign} steht heute im Fokus.`,
    `Veränderliche Energie liegt in der Luft. ${sign}: kleine Schritte bringen Klarheit.`,
    `Tag, um Absicht und Handlung in Einklang zu bringen. ${sign}: ehrliches Gespräch öffnet Türen.`,
    `${sign}: Gleichgewicht und Ruhe, wenn der Körper danach verlangt.`,
    `Praktischer Fokus. ${sign}: konsolidiere, was du bereits begonnen hast.`,
  ]
  const msgsFr = [
    `${fase}: écoutez votre cœur avant de décider. ${sign} est à l'honneur aujourd'hui.`,
    `Énergie mutable dans l'air. ${sign}: les petits pas apportent la clarté.`,
    `Journée pour aligner intention et action. ${sign}: une conversation honnête ouvre des portes.`,
    `${sign}: équilibre et repos si le corps le demande.`,
    `Focus pratique. ${sign}: consolidez ce que vous avez déjà commencé.`,
  ]
  const map = { pt: msgsPt, en: msgsEn, es: msgsEs, it: msgsIt, de: msgsDe, fr: msgsFr }
  const msgs = map[lang] || msgsEn
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
    es: Object.fromEntries(SIGNOS_ES.map((s, i) => [s, templateLine(s, fasePt, seed + i, 'es')])),
    it: Object.fromEntries(SIGNOS_IT.map((s, i) => [s, templateLine(s, fasePt, seed + i, 'it')])),
    de: Object.fromEntries(SIGNOS_DE.map((s, i) => [s, templateLine(s, fasePt, seed + i, 'de')])),
    fr: Object.fromEntries(SIGNOS_FR.map((s, i) => [s, templateLine(s, fasePt, seed + i, 'fr')])),
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
  if (lang !== 'pt') return SIGNO_PT_TO_EN[nomeSolar] || nomeSolar
  if (nomeSolar === 'Áries') return 'Carneiro'
  return nomeSolar
}
