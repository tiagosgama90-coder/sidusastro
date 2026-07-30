import { lazy } from 'react'

const CHUNK_RELOAD_KEY = 'sidus_chunk_reload'

/** Erro típico após deploy: tab antiga tenta importar chunk com hash que já não existe. */
export function isChunkLoadError(error) {
  const msg = error?.message || String(error || '')
  return (
    /Failed to fetch dynamically imported module/i.test(msg)
    || /Importing a module script failed/i.test(msg)
    || /error loading dynamically imported module/i.test(msg)
    || /Loading chunk [\d]+ failed/i.test(msg)
    || /ChunkLoadError/i.test(msg)
  )
}

/** Recarrega uma vez com cache-bust para obter o bundle novo. */
export function reloadForStaleChunks() {
  if (sessionStorage.getItem(CHUNK_RELOAD_KEY)) return false
  sessionStorage.setItem(CHUNK_RELOAD_KEY, '1')
  try {
    const url = new URL(window.location.href)
    url.searchParams.set('_cv', Date.now().toString())
    window.location.replace(url.toString())
  } catch {
    window.location.reload()
  }
  return true
}

export function clearChunkReloadFlag() {
  sessionStorage.removeItem(CHUNK_RELOAD_KEY)
}

function retryImport(factory, retriesLeft = 1) {
  return factory().catch((error) => {
    if (isChunkLoadError(error)) {
      if (reloadForStaleChunks()) {
        return new Promise(() => {})
      }
      if (retriesLeft > 0) {
        return retryImport(factory, retriesLeft - 1)
      }
    }
    throw error
  })
}

/** React.lazy com retry automático quando chunks estão desatualizados após deploy. */
export function lazyWithRetry(factory) {
  return lazy(() => retryImport(factory))
}

/** import() dinâmico com o mesmo retry (PDF, etc.). */
export function importWithRetry(factory) {
  return retryImport(factory)
}
