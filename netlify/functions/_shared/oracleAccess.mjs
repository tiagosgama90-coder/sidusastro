import { FieldValue, getFirestore, verifyIdToken } from './firebase-admin.mjs'
import { utilizadorTemPremium } from '../../../src/lib/premiumAccess.js'

export const MAX_ORACLE_GRATIS = 3

export async function obterAcessoOracle(idToken) {
  const decoded = await verifyIdToken(idToken)
  if (!decoded?.uid) return { erro: 'auth' }

  const user = { uid: decoded.uid, email: decoded.email }
  const db = getFirestore()
  if (!db) {
    return { uid: decoded.uid, user, perfil: {}, isPremium: false, usadas: 0, degradado: true }
  }

  try {
    const snap = await db.collection('users').doc(decoded.uid).get()
    const perfil = snap.exists ? snap.data() : {}
    const isPremium = utilizadorTemPremium(user, perfil)
    const usadas = Number(perfil.oraclePerguntasUsadas) || 0
    return { uid: decoded.uid, user, perfil, isPremium, usadas }
  } catch (e) {
    // Firestore indisponível: degrada em vez de derrubar o oráculo com 500.
    console.error('[oracleAccess] leitura falhou:', e?.message)
    return { uid: decoded.uid, user, perfil: {}, isPremium: false, usadas: 0, degradado: true }
  }
}

export async function incrementarOraclePergunta(uid) {
  const db = getFirestore()
  if (!db || !uid) return
  try {
    await db.collection('users').doc(uid).set(
      { oraclePerguntasUsadas: FieldValue.increment(1) },
      { merge: true },
    )
  } catch (e) {
    // Falha de escrita não deve impedir a resposta ao utilizador.
    console.error('[oracleAccess] escrita falhou:', e?.message)
  }
}
