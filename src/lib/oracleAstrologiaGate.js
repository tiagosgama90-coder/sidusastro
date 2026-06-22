/**
 * Filtro de escopo — Oráculo responde APENAS astrologia / vida via mapa natal.
 */

const FORA_ESCOPO_PT = [
  'receita', 'cozinhar', 'bolo', 'ingredientes',
  'código', 'codigo', 'programar', 'python', 'javascript', 'html', 'css', 'react',
  'futebol', 'sporting', 'benfica', 'porto fc', 'resultado jogo',
  'lotaria', 'loto', 'euromilhões', 'euromilhoes', 'jogo do totoloto', 'números da sorte',
  'capitais', 'quem inventou', 'quando nasceu', 'presidente', 'política', 'politica',
  'matemática', 'matematica', 'equação', 'equacao', 'exercício escolar', 'trabalho de casa',
  'traduz isto', 'traduzir', 'translate this', 'escreve um email', 'redação sobre',
  'bitcoin', 'criptomoeda', 'comprar ações', 'forex',
  'diagnóstico médico', 'diagnostico medico', 'que medicamento', 'remédio para',
  'filme', 'série', 'netflix', 'youtube', 'tiktok',
  'clima amanhã', 'tempo em lisboa', 'notícias',
]

const FORA_ESCOPO_EN = [
  'recipe', 'cook', 'ingredients', 'code', 'programming', 'python', 'javascript',
  'football', 'soccer', 'lottery', 'lotto', 'jackpot', 'lucky numbers',
  'capital of', 'who invented', 'president', 'politics',
  'math homework', 'equation', 'translate this', 'write an essay',
  'bitcoin', 'crypto', 'stock market', 'forex',
  'medical diagnosis', 'which medicine', 'movie', 'netflix', 'weather tomorrow',
]

const ASTRO_PT = [
  'astrolog', 'horóscopo', 'horoscopo', 'mapa natal', 'mapa astral', 'carta natal',
  'signo', 'zodiaco', 'zodíaco', 'ascendente', 'descendente', 'meio do céu', 'meio do ceu',
  'lua', 'sol em', 'sol na', 'lua em', 'planeta', 'saturno', 'venus', 'vénus', 'marte',
  'jupiter', 'júpiter', 'mercúrio', 'mercurio', 'neptuno', 'urano', 'plutão', 'plutao',
  'trânsito', 'transito', 'retrograda', 'oposição', 'oposicao', 'conjunção', 'conjuncao',
  'quadratura', 'sextil', 'casa 1', 'casa 2', 'casa 3', 'casa 4', 'casa 5', 'casa 6',
  'casa 7', 'casa 8', 'casa 9', 'casa 10', 'casa 11', 'casa 12', 'sinastria',
  'compatib', 'efemérides', 'efemerides', 'placidus', 'regente', 'elemento', 'modalidade',
  'eclipse', 'lua nova', 'lua cheia', 'fase lunar', 'ciclo saturno', 'retorno de saturno',
  'previsão', 'previsao', 'previsões', 'previsoes', 'prever', 'prognóstico', 'prognostico',
  'oráculo', 'oraculo', 'ciclos planet', 'revolução solar', 'revolucao solar', 'progress',
]

const ASTRO_EN = [
  'astrolog', 'horoscope', 'natal chart', 'birth chart', 'sun sign', 'moon sign',
  'ascendant', 'midheaven', 'descendant', 'transit', 'retrograde', 'opposition',
  'conjunction', 'square', 'sextile', 'house 1', 'synastry', 'compatibility',
  'saturn', 'venus', 'mars', 'jupiter', 'mercury', 'neptune', 'uranus', 'pluto',
  'eclipse', 'lunar phase', 'saturn return',
  'prediction', 'forecast', 'foresee', 'solar return', 'progressed',
]

const VIDA_VIA_MAPA_PT = [
  'amor', 'relação', 'relacionamento', 'parceiro', 'namorado', 'namorada', 'casamento', 'ex ',
  'trabalho', 'carreira', 'emprego', 'profissão', 'profissao', 'propósito', 'proposito',
  'destino', 'caminho', 'missão', 'missao', 'decisão', 'decisao', 'devo ', 'deveria',
  'sinto', 'sinto-me', 'coração', 'coracao', 'alma', 'espiritual', 'karma',
  'família', 'familia', 'mãe', 'mae', 'pai ', 'filho', 'filha',
  'ansiedade', 'medo', 'futuro', 'mudança', 'mudanca', 'ciclo', 'fase da vida',
  'mapa', 'natal', 'nascimento', 'nasci', 'vida', 'semana', 'mes', 'mês', 'ano',
  'feliz', 'triste', 'confuso', 'preocup', 'significado', 'espera', 'acontecer',
]

const VIDA_VIA_MAPA_EN = [
  'love', 'relationship', 'partner', 'marriage', 'breakup', 'career', 'job', 'purpose',
  'destiny', 'path', 'mission', 'decision', 'should i', 'feel', 'heart', 'soul',
  'spiritual', 'karma', 'family', 'mother', 'father', 'anxiety', 'fear', 'future',
  'change', 'cycle', 'chart', 'natal', 'born',
]

const RESPOSTA_FORA_PT = [
  'aqui está a receita', 'ingredientes:', 'modo de preparação', 'modo de preparacao',
  '```python', '```javascript', '```html', 'def main(', 'function(',
  'a capital de', 'lotaria', 'euromilhões', 'euromilhoes', 'números da sorte',
  'como assistente de ia', 'como assistente ai', 'language model',
  'traduz para', 'translate to', 'escreve um email', 'write an email',
]

const RESPOSTA_FORA_EN = [
  'here is the recipe', 'ingredients:', '```python', '```javascript',
  'capital of', 'lottery', 'lucky numbers', 'as an ai assistant',
  'translate to', 'write an email',
]

export function mensagemForaEscopo(lang = 'pt') {
  return lang === 'en'
    ? '✦ I am Sidus, the Astral Oracle. I only guide astrology, predictions and life read through your natal chart (love, career, purpose, cycles, transits, compatibility). Please rephrase your question in that scope.'
    : '✦ Sou Sidus, Oráculo Astral. Só oriento astrologia, previsões e vida lidas pelo teu mapa natal (amor, carreira, propósito, ciclos, trânsitos, compatibilidade). Reformula a tua pergunta nesse âmbito.'
}

/** Instrução extra injectada apenas nas chamadas Gemini (Oráculo). */
export function reforcoInstrucaoGeminiAstrologia(lang = 'pt') {
  if (lang === 'en') {
    return `
GEMINI RESTRICTION — MANDATORY:
You are NOT a general-purpose AI. You ONLY answer: natal chart, transits, predictions, synastry, planetary cycles, and life areas READ THROUGH astrology.
If the user asks anything else (recipes, code, trivia, medicine, homework, sports, politics, general chat), reply ONLY with the refusal sentence from your system prompt — do NOT answer the off-topic question even partially.
Never use Gemini as a generic chatbot. Astrology and chart-based predictions only.
`.trim()
  }
  return `
RESTRIÇÃO GEMINI — OBRIGATÓRIO:
NÃO és IA genérica. Respondes SÓ a: mapa natal, trânsitos, previsões, sinastria, ciclos planetários e áreas de vida LIDAS PELA ASTROLOGIA.
Se o utilizador pedir outro tema (receitas, código, trivia, medicina, trabalhos escolares, desporto, política, conversa geral), responde APENAS com a frase de recusa do system prompt — NÃO respondas parcialmente ao tema errado.
Nunca actues como chatbot genérico. Apenas astrologia e previsões via mapa.
`.trim()
}

/** Detecta se a IA respondeu fora de astrologia (pós-validação servidor). */
export function respostaPareceForaEscopoAstrologia(texto, lang = 'pt') {
  if (!texto?.trim()) return true
  const lower = texto.toLowerCase()
  const lista = lang === 'en' ? RESPOSTA_FORA_EN : RESPOSTA_FORA_PT
  if (lista.some((k) => lower.includes(k))) return true
  const recusa = lower.includes('sidus')
  const recusaEscopo = lower.includes('só oriento') || lower.includes('only guide') || lower.includes('reformula')
  if (recusa && recusaEscopo) return false
  return false
}

export function perguntaDentroEscopoAstrologia(texto, lang = 'pt') {
  const lower = texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const raw = texto.toLowerCase()

  const fora = lang === 'en' ? FORA_ESCOPO_EN : FORA_ESCOPO_PT
  const astro = lang === 'en' ? ASTRO_EN : ASTRO_PT
  const vida = lang === 'en' ? VIDA_VIA_MAPA_EN : VIDA_VIA_MAPA_PT

  const temFora = fora.some((k) => {
    const kn = k.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    return lower.includes(kn) || raw.includes(k)
  })
  const temAstro = astro.some((k) => {
    const kn = k.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    return lower.includes(kn) || raw.includes(k)
  })
  const temVida = vida.some((k) => {
    const kn = k.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    return lower.includes(kn) || raw.includes(k)
  })

  if (temFora && !temAstro && !temVida) return false
  if (temAstro || temVida) return true

  const pessoalPt = /^(porque|por que|como posso|ajuda|estou|sinto|devo|deveria|nao sei|não sei|quando|onde|o que|que devo|será que|sera que)/i
  const pessoalEn = /^(why |how can i|help |i feel|should i|i am |i'm |when |what |will i )/i
  const pessoal = lang === 'en' ? pessoalEn.test(texto.trim()) : pessoalPt.test(texto.trim())
  const palavras = texto.trim().split(/\s+/).length

  if (pessoal && palavras >= 4) return true
  if (/\?/.test(texto.trim()) && palavras >= 4 && !temFora) return true

  return false
}
