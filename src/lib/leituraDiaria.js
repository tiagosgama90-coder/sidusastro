/** Frases curtas Sol/Lua por signo — leitura grátis memorável (1ª frase da essência). */
import { contentForLang } from './i18n/langUtil.js'

const SOL_PT = {
  Carneiro: 'A tua identidade forma-se na acção directa — pensar demasiado paralisa-te; agir cura-te.',
  Touro: 'Constróis a ti mesmo/a tijolo a tijolo — o que dura exige tempo e presença serena.',
  Gémeos: 'A tua identidade é múltipla — és uma constelação de ideias em movimento.',
  Caranguejo: 'Proteges o que amas com tenacidade silenciosa; a casa interior é sagrada.',
  Leão: 'Precisas de palco — a alma expande quando és visto/a com verdade.',
  Virgem: 'Vês o que pode ser melhorado — em ti e no mundo — e isso é dom, não defeito.',
  Balança: 'Não existes plenamente a sós — o espelho do outro completa-te.',
  Escorpião: 'Não toleras superficialidade — a alma exige verdade nua.',
  Sagitário: 'Precisas de horizonte — literal ou metafórico — para respirar.',
  Capricórnio: 'Montas montanhas passo a passo; o tempo é aliado, não inimigo.',
  Aquário: 'Pensas fora do rebanho porque o futuro te chama.',
  Peixes: 'Identidade fluida e compassiva — sentes o que o mundo sente.',
}

const LUA_PT = {
  Carneiro: 'Precisas de agir quando sentes — esperar esgota-te.',
  Touro: 'Segurança sensorial ancora-te — ritmo estável, toque, beleza.',
  Gémeos: 'Processas emoções através da palavra — falar regula o coração.',
  Caranguejo: 'Sentes tudo intensamente — lar e memória são bússola.',
  Leão: 'O coração quer brilhar também na esfera privada.',
  Virgem: 'Regulas emoções através da ordem — rotinas devolvem calma.',
  Balança: 'Equilibras emoções através da relação — a harmonia nutre-te.',
  Escorpião: 'Sentes com intensidade magnética — lealdade absoluta.',
  Sagitário: 'Precisas de liberdade emocional e sentido para expandir.',
  Capricórnio: 'Vulnerabilidade custa; estrutura e metas protegem-te.',
  Aquário: 'Processas emoções intelectualmente — amizade é base afectiva.',
  Peixes: 'Absorves ambientes — fronteiras emocionais porosas, sonhos vívidos.',
}

const SOL_EN = {
  Aries: 'Identity forms through direct action — overthinking paralyses you; action heals you.',
  Taurus: 'You build yourself brick by brick — what endures takes time.',
  Gemini: 'Identity is multiple — you are a constellation of ideas.',
  Cancer: 'You protect what you love with silent tenacity; inner home is sacred.',
  Leo: 'You need a stage — soul expands when seen truthfully.',
  Virgo: 'You see what can improve — in you and the world — and that is gift.',
  Libra: 'You do not fully exist alone — the other\'s mirror completes you.',
  Scorpio: 'You tolerate no superficiality — soul demands naked truth.',
  Sagittarius: 'You need horizon — literal or metaphorical — to breathe.',
  Capricorn: 'You climb mountains step by step; time is ally.',
  Aquarius: 'You think outside the herd because the future calls.',
  Pisces: 'Fluid, compassionate identity — you feel what the world feels.',
}

const LUA_EN = {
  Aries: 'You must act when you feel — waiting drains you.',
  Taurus: 'Sensory security anchors you — stable rhythm, touch, beauty.',
  Gemini: 'You process emotions through words — speaking regulates the heart.',
  Cancer: 'You feel everything intensely — home and memory are compass.',
  Leo: 'Heart wants to shine in private sphere too.',
  Virgo: 'You regulate emotions through order — routines restore calm.',
  Libra: 'You balance emotions through relationship — harmony nourishes you.',
  Scorpio: 'You feel with magnetic intensity — absolute loyalty.',
  Sagittarius: 'You need emotional freedom and meaning to expand.',
  Capricorn: 'Vulnerability costs; structure and goals protect you.',
  Aquarius: 'You process emotions intellectually — friendship is affective base.',
  Pisces: 'You absorb environments — porous boundaries, vivid dreams.',
}

const SIGNO_MAP = {
  Áries: 'Carneiro', Aries: 'Carneiro',
  Tauro: 'Touro', Taurus: 'Touro',
  Géminis: 'Gémeos', Gemini: 'Gémeos',
  Cáncer: 'Caranguejo', Cancer: 'Caranguejo',
  Leo: 'Leão', León: 'Leão',
  Virgo: 'Virgem',
  Libra: 'Balança',
  Escorpio: 'Escorpião', Scorpio: 'Escorpião',
  Sagitario: 'Sagitário', Sagittarius: 'Sagitário',
  Capricornio: 'Capricórnio', Capricorn: 'Capricórnio',
  Acuario: 'Aquário', Aquarius: 'Aquário',
  Piscis: 'Peixes', Pisces: 'Peixes',
}

function normSigno(nome) {
  if (!nome) return null
  return SIGNO_MAP[nome] || nome
}

function pickPack(lang) {
  if (lang === 'pt') return { sol: SOL_PT, lua: LUA_PT }
  return { sol: SOL_EN, lua: LUA_EN }
}

/** Índice determinístico da carta do dia (0–21). */
export function indiceCartaDoDia(date = new Date()) {
  const iso = date.toISOString().slice(0, 10)
  const [ano, mes, dia] = iso.split('-').map(Number)
  return (ano * 1000 + (mes - 1) * 31 + dia) % 22
}

export function fraseSol(signoNome, lang = 'pt') {
  const key = normSigno(signoNome)
  const { sol } = pickPack(lang)
  return sol[key] || sol.Carneiro || sol.Aries || ''
}

export function fraseLua(signoNome, lang = 'pt') {
  const key = normSigno(signoNome)
  const { lua } = pickPack(lang)
  return lua[key] || lua.Caranguejo || lua.Cancer || ''
}

/** Frase do dia variável (rotação por data + signo). */
export function frasePersonalizadaDia(tipo, signoNome, lang = 'pt') {
  const base = tipo === 'lua' ? fraseLua(signoNome, lang) : fraseSol(signoNome, lang)
  if (!base) return ''
  const iso = new Date().toISOString().slice(0, 10)
  const variantes = contentForLang(lang, {
    pt: ['Hoje: ', 'O cosmos diz: ', 'Para ti hoje: '],
    en: ['Today: ', 'The cosmos says: ', 'For you today: '],
    es: ['Hoy: ', 'El cosmos dice: ', 'Para ti hoy: '],
    it: ['Oggi: ', 'Il cosmo dice: ', 'Per te oggi: '],
    de: ['Heute: ', 'Der Kosmos sagt: ', 'Für dich heute: '],
    fr: ["Aujourd'hui : ", 'Le cosmos dit : ', "Pour toi aujourd'hui : "],
  })
  const idx = (iso.charCodeAt(8) + (signoNome?.length || 0)) % variantes.length
  return `${variantes[idx]}${base}`
}
