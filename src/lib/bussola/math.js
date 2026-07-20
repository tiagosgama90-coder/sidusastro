/** Normaliza longitude eclíptica para [0, 360). */
export function normalizarGraus(g) {
  return ((Number(g) % 360) + 360) % 360
}

/** Menor distância angular entre duas longitudes. */
export function diferencaAngular(a, b) {
  const diff = Math.abs(normalizarGraus(a) - normalizarGraus(b)) % 360
  return diff > 180 ? 360 - diff : diff
}

/** Graus dentro do signo (0-29.99). */
export function grausNoSigno(lon) {
  return (normalizarGraus(lon) % 30).toFixed(1)
}

/** Índice de signo 0-11 a partir da longitude. */
export function signoIndex(lon) {
  return Math.min(11, Math.floor(normalizarGraus(lon) / 30))
}
