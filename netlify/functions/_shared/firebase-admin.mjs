import admin from 'firebase-admin'
import { env } from './env.mjs'

let initialized = false

export function getFirestore() {
  if (!initialized) {
    const raw = env('FIREBASE_SERVICE_ACCOUNT')
    if (!raw) return null
    try {
      const serviceAccount = JSON.parse(raw)
      admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
      initialized = true
    } catch (e) {
      console.error('[Firebase Admin] init failed:', e?.message)
      return null
    }
  }
  return admin.firestore()
}

export async function activarPremium(userId, extra = {}) {
  const db = getFirestore()
  if (!db || !userId) return false
  await db.collection('users').doc(userId).set(
    { isPremium: true, premiumAt: admin.firestore.FieldValue.serverTimestamp(), ...extra },
    { merge: true }
  )
  return true
}

export async function desactivarPremium(userId) {
  const db = getFirestore()
  if (!db || !userId) return false
  await db.collection('users').doc(userId).set({ isPremium: false }, { merge: true })
  return true
}
