const STORAGE_PREFIX = 'sidus_mapa_ia_v2'

function cacheKey(dados, lang) {
  const lat = dados?.localizacao?.lat ?? ''
  const lon = dados?.localizacao?.lon ?? ''
  return `${STORAGE_PREFIX}:${lang}:${dados?.data || ''}:${dados?.hora || ''}:${dados?.cidade || ''}:${lat}:${lon}:${dados?.fuso ?? ''}`
}

export function readMapaIACache(dados, lang) {
  try {
    const raw = localStorage.getItem(cacheKey(dados, lang))
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.seccoes?.length) return null
    return parsed
  } catch {
    return null
  }
}

export function writeMapaIACache(dados, lang, analise) {
  try {
    if (!analise?.seccoes?.length) return
    localStorage.setItem(cacheKey(dados, lang), JSON.stringify(analise))
  } catch {
    /* quota / private mode */
  }
}
