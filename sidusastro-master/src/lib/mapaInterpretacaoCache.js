import { analiseIaPremiumValida } from './mapaInterpretacaoPrompt.js'

/** Chave estável por mapa + idioma. Mesmos dados = mesma leitura, sempre. */
export function gerarChaveMapa(dados, lang = 'pt') {
  const lat = dados?.localizacao?.lat ?? dados?.lat ?? ''
  const lon = dados?.localizacao?.lon ?? dados?.lon ?? ''
  return [
    lang,
    dados?.data || '',
    dados?.hora || '',
    dados?.cidade || '',
    lat,
    lon,
    dados?.fuso ?? '',
  ].join('|')
}

const STORAGE_PREFIX = 'sidus_mapa_v7'

function storageKey(dados, lang) {
  return `${STORAGE_PREFIX}:${gerarChaveMapa(dados, lang)}`
}

export function analiseMapaValida(analise) {
  if (!analise?.seccoes?.length) return false
  const textos = analise.seccoes.flatMap((s) => (s.blocos || []).map((b) => b.texto || ''))
  const junto = textos.join(' ')
  if (!junto.trim()) return false
  if (/\bundefined\b/i.test(junto)) return false
  const palavras = junto.split(/\s+/).filter(Boolean).length
  if (palavras < 600) return false
  const blocosVazios = textos.filter((t) => t.trim().length < 40).length
  if (blocosVazios > textos.length * 0.4) return false
  return true
}

export function readMapaIACache(dados, lang) {
  try {
    const raw = localStorage.getItem(storageKey(dados, lang))
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.seccoes?.length) return null
    if (parsed.chave && parsed.chave !== gerarChaveMapa(dados, lang)) return null
    if (!analiseMapaValida(parsed)) return null
    return parsed
  } catch {
    return null
  }
}

export function writeMapaIACache(dados, lang, analise) {
  try {
    if (!analise?.seccoes?.length) return
    if (analise.fonte === 'ia') {
      if (!analiseIaPremiumValida(analise)) return
    } else if (!analiseMapaValida(analise)) {
      return
    }
    localStorage.setItem(storageKey(dados, lang), JSON.stringify({
      ...analise,
      chave: gerarChaveMapa(dados, lang),
      lang,
    }))
  } catch {
    /* quota / private mode */
  }
}

export function interpretacaoValidaParaMapa(interpretacao, dados, lang) {
  if (!interpretacao?.seccoes?.length) return false
  if (interpretacao.fonte === 'ia') {
    if (!analiseIaPremiumValida(interpretacao)) return false
  } else if (!analiseMapaValida(interpretacao)) {
    return false
  }
  if (interpretacao.chave && interpretacao.chave !== gerarChaveMapa(dados, lang)) return false
  if (interpretacao.lang && interpretacao.lang !== lang) return false
  return true
}

export function contarPalavrasAnalise(analise) {
  if (!analise?.seccoes?.length) return 0
  return analise.seccoes
    .flatMap((s) => s.blocos || [])
    .reduce((n, b) => n + String(b.texto || '').split(/\s+/).filter(Boolean).length, 0)
}
