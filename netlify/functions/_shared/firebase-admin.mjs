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

function premiumUntilFromExisting(existingUntil, dias = 30) {
  let base = new Date()
  if (existingUntil) {
    const ex = existingUntil.toDate ? existingUntil.toDate() : new Date(existingUntil)
    if (ex > base) base = ex
  }
  const until = new Date(base)
  until.setDate(until.getDate() + dias)
  return admin.firestore.Timestamp.fromDate(until)
}

export async function activarPremium(userId, extra = {}) {
  const db = getFirestore()
  if (!db || !userId) return false

  const updates = {
    isPremium: true,
    mapaCompleto: true,
    premiumAt: admin.firestore.FieldValue.serverTimestamp(),
  }

  if (extra.stripeSubscriptionId) {
    updates.stripeSubscriptionId = extra.stripeSubscriptionId
    updates.stripeCustomerId = extra.stripeCustomerId || null
    updates.premiumBilling = 'recurring'
  } else if (extra.billingType === 'prepaid_month') {
    const snap = await db.collection('users').doc(userId).get()
    const data = snap.exists ? snap.data() : {}
    updates.premiumUntil = premiumUntilFromExisting(data.premiumUntil, 30)
    updates.premiumBilling = 'prepaid'
    if (extra.stripeCustomerId) updates.stripeCustomerId = extra.stripeCustomerId
  }

  if (extra.stripeCustomerId && !updates.stripeCustomerId) {
    updates.stripeCustomerId = extra.stripeCustomerId
  }

  await db.collection('users').doc(userId).set(updates, { merge: true })
  return true
}

export async function activarMapaCompleto(userId) {
  const db = getFirestore()
  if (!db || !userId) return false
  await db.collection('users').doc(userId).set(
    { mapaCompleto: true, mapaCompletoAt: admin.firestore.FieldValue.serverTimestamp() },
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
