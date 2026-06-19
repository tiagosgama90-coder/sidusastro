import admin from 'firebase-admin'
import { getFirestore, verifyIdToken } from './firebase-admin.mjs'
import { utilizadorTemPremium } from '../../../src/lib/premiumAccess.js'

export const MAX_ORACLE_GRATIS = 3

export async function obterAcessoOracle(idToken) {
  const decoded = await verifyIdToken(idToken)
  if (!decoded?.uid) return { erro: 'auth' }

  const db = getFirestore()
  if (!db) return { erro: 'db' }

  const snap = await db.collection('users').doc(decoded.uid).get()
  const perfil = snap.exists ? snap.data() : {}
  const user = { uid: decoded.uid, email: decoded.email }
  const isPremium = utilizadorTemPremium(user, perfil)
  const usadas = Number(perfil.oraclePerguntasUsadas) || 0

  return { uid: decoded.uid, user, perfil, isPremium, usadas }
}

export async function incrementarOraclePergunta(uid) {
  const db = getFirestore()
  if (!db || !uid) return
  await db.collection('users').doc(uid).set(
    { oraclePerguntasUsadas: admin.firestore.FieldValue.increment(1) },
    { merge: true },
  )
}
