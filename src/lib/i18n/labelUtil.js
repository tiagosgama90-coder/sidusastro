/** Label curto (emoji + nome) para barras - largura estável como PT em todos os idiomas. */
export function labelBarraCurto(texto) {
  const s = String(texto ?? '')
  const m = s.match(/^(.+?)\s[---]\s/)
  if (m) return m[1].trim()
  return s.length > 22 ? `${s.slice(0, 20).trim()}…` : s
}

/** Label navbar desktop - referência PT (máx. 22 chars, 1 linha). */
export function labelNavBarra(texto) {
  const s = String(texto ?? '').trim()
  return s.length > 22 ? `${s.slice(0, 21).trim()}…` : s
}

/** Título de secção com altura fixa (referência PT, 1 linha). */
export function tituloSecaoMapa(texto) {
  const s = String(texto ?? '')
  return s.length > 42 ? `${s.slice(0, 40).trim()}…` : s
}
