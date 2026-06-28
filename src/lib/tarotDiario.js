/** Leitura Diária - uma carta a cada 24 horas (todos os utilizadores). */

export const DIARIA_MS = 24 * 60 * 60 * 1000
const STORAGE_PREFIX = 'sidus_tarot_diaria_v1'

function chave(userId) {
  return `${STORAGE_PREFIX}_${userId || 'anon'}`
}

export function leituraDiariaAtiva(userId) {
  try {
    const raw = localStorage.getItem(chave(userId))
    if (!raw) return null
    const data = JSON.parse(raw)
    if (!data?.ts || Date.now() - data.ts >= DIARIA_MS) return null
    return data
  } catch {
    return null
  }
}

export function podeFazerLeituraDiaria(userId) {
  return !leituraDiariaAtiva(userId)
}

export function msAteProximaDiaria(userId) {
  const ativa = leituraDiariaAtiva(userId)
  if (!ativa) return 0
  return Math.max(0, DIARIA_MS - (Date.now() - ativa.ts))
}

export function formatarTempoRestante(ms, lang = 'pt') {
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  if (lang === 'en') {
    if (h > 0) return `${h}h ${m}m`
    return `${m} min`
  }
  if (h > 0) return `${h}h ${m}m`
  return `${m} min`
}

export function registarLeituraDiaria(userId, payload) {
  try {
    localStorage.setItem(chave(userId), JSON.stringify({
      ts: Date.now(),
      ...payload,
    }))
  } catch { /* quota */ }
}
