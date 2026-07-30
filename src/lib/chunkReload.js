const CHUNK_RELOAD_KEY = 'sidus_chunk_reload'

/** Recarrega uma vez quando um chunk JS falha após deploy (hash antigo em cache). */
export function tryReloadOnChunkError(reason) {
  const msg = String(reason?.message || reason || '')
  const isChunkFail = /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module/i.test(msg)
  if (!isChunkFail) return false
  if (sessionStorage.getItem(CHUNK_RELOAD_KEY)) return false
  sessionStorage.setItem(CHUNK_RELOAD_KEY, '1')
  window.location.reload()
  return true
}

export function clearChunkReloadFlag() {
  sessionStorage.removeItem(CHUNK_RELOAD_KEY)
}
