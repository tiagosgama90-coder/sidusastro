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

const STORAGE_PREFIX = 'sidus_mapa_v4'

function storageKey(dados, lang) {
  return `${STORAGE_PREFIX}:${gerarChaveMapa(dados, lang)}`
}

export function readMapaIACache(dados, lang) {
  try {
    const raw = localStorage.getItem(storageKey(dados, lang))
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.seccoes?.length) return null
    if (parsed.chave && parsed.chave !== gerarChaveMapa(dados, lang)) return null
    return parsed
  } catch {
    return null
  }
}

export function writeMapaIACache(dados, lang, analise) {
  try {
    if (!analise?.seccoes?.length) return
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
  if (!interpretacao.chave) return true
  return interpretacao.chave === gerarChaveMapa(dados, lang)
    && (interpretacao.lang || lang) === lang
}
