/** 3 perguntas grátis ao Oráculo Sidus por conta — espelha o Tarot. */
export const MAX_ORACLE_GRATIS = 3
const STORAGE_KEY = 'sidus_oracle_free_v1'

function chave(userId) {
  return userId ? `${STORAGE_KEY}_${userId}` : STORAGE_KEY
}

export function oraclePerguntasUsadas(userId, remotas = 0) {
  try {
    const local = parseInt(localStorage.getItem(chave(userId)) || '0', 10)
    const remoto = Number(remotas) || 0
    return Math.max(local, remoto)
  } catch {
    return Number(remotas) || 0
  }
}

export function registarOraclePergunta(userId) {
  try {
    const n = oraclePerguntasUsadas(userId) + 1
    localStorage.setItem(chave(userId), String(n))
    return n
  } catch {
    return MAX_ORACLE_GRATIS
  }
}

export function sincronizarOraclePerguntas(userId, total) {
  const n = Math.min(MAX_ORACLE_GRATIS, Math.max(0, Number(total) || 0))
  try {
    localStorage.setItem(chave(userId), String(n))
  } catch { /* quota */ }
  return n
}

export function oracleRestantes(isPremium, userId, remotas = 0) {
  if (isPremium === true) return Infinity
  return Math.max(0, MAX_ORACLE_GRATIS - oraclePerguntasUsadas(userId, remotas))
}

export function podePerguntarOracle(isPremium, userId, remotas = 0) {
  if (isPremium === true) return true
  return oraclePerguntasUsadas(userId, remotas) < MAX_ORACLE_GRATIS
}
