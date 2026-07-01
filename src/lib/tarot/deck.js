import { MAJOR_ARCANA } from './majors.js'
import { MINOR_ARCANA } from './minors.js'

export const TAROT_DECK = [...MAJOR_ARCANA, ...MINOR_ARCANA]

export { MAJOR_ARCANA, MINOR_ARCANA }

export function getCartaById(id) {
  return TAROT_DECK.find((c) => c.id === id) ?? null
}

export function baralhoCompleto() {
  return TAROT_DECK.map((c) => ({ ...c, invertida: false }))
}

export function embaralhar(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function sortearCartas(n) {
  const deck = embaralhar(baralhoCompleto())
  return deck.slice(0, n).map((c) => ({
    ...c,
    invertida: Math.random() < 0.35,
  }))
}

/** Arcanos considerados favoráveis em leituras Sim/Não (posição direita). */
export const CARTAS_POSITIVAS = new Set([
  0, 1, 3, 4, 6, 7, 8, 10, 11, 14, 17, 19, 20, 21,
  22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48,
  50, 52, 56, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76,
])

export function cartaPositivaSimNao(carta) {
  if (!carta || carta.invertida) return false
  if (CARTAS_POSITIVAS.has(carta.id)) return true
  if (carta.tipo === 'minor' && ['as', '06', '09', '10'].includes(carta.rank)) return true
  return false
}
