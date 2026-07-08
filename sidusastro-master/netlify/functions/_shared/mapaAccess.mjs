import { getFirestore, verifyIdToken } from './firebase-admin.mjs'
import { utilizadorTemPremium } from '../../../src/lib/premiumAccess.js'

export async function obterAcessoMapa(idToken) {
  const decoded = await verifyIdToken(idToken)
  if (!decoded?.uid) return { erro: 'auth' }

  const user = { uid: decoded.uid, email: decoded.email }
  const db = getFirestore()
  if (!db) {
    return { uid: decoded.uid, user, perfil: {}, desbloqueado: false, degradado: true }
  }

  const snap = await db.collection('users').doc(decoded.uid).get()
  const perfil = snap.exists ? snap.data() : {}
  const isPremium = utilizadorTemPremium(user, perfil)
  const mapaCompleto = perfil.mapaCompleto === true
  const desbloqueado = isPremium || mapaCompleto

  return { uid: decoded.uid, user, perfil, isPremium, mapaCompleto, desbloqueado }
}
