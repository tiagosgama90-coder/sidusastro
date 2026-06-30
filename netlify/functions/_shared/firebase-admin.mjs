import admin from 'firebase-admin'
import { env } from './env.mjs'

let initialized = false

function parseServiceAccount(raw) {
  if (!raw) return null
  let text = String(raw).trim()
  if ((text.startsWith("'") && text.endsWith("'")) || (text.startsWith('"') && text.endsWith('"'))) {
    text = text.slice(1, -1).trim()
  }

  const attempts = [
    () => JSON.parse(text),
    () => JSON.parse(text.replace(/\\n/g, '\n').replace(/\\"/g, '"')),
    () => {
      // JSON colado com quebras de linha reais no private_key
      const fixed = text.replace(
        /("private_key"\s*:\s*")([^"]*(?:\n[^"]*)*)(")/,
        (_, a, key, c) => `${a}${key.replace(/\r?\n/g, '\\n')}${c}`,
      )
      return JSON.parse(fixed)
    },
  ]

  for (const attempt of attempts) {
    try {
      const parsed = attempt()
      if (parsed?.type === 'service_account' && parsed.project_id && parsed.private_key) return parsed
    } catch { /* tenta próximo formato */ }
  }

  console.error('[Firebase Admin] JSON inválido em FIREBASE_SERVICE_ACCOUNT')
  return null
}

export function firebaseAdminStatus() {
  const raw = env('FIREBASE_SERVICE_ACCOUNT')
  const serviceAccount = parseServiceAccount(raw)
  if (!raw) return { ok: false, reason: 'missing' }
  if (!serviceAccount) return { ok: false, reason: 'invalid_json' }
  if (!ensureInit()) return { ok: false, reason: 'init_failed', projectId: serviceAccount.project_id }
  return { ok: true, projectId: serviceAccount.project_id }
}

function ensureInit() {
  if (initialized) return true
  const serviceAccount = parseServiceAccount(env('FIREBASE_SERVICE_ACCOUNT'))
  if (!serviceAccount) return false
  try {
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
    initialized = true
    return true
  } catch (e) {
    console.error('[Firebase Admin] init failed:', e?.message)
    return false
  }
}

export function getFirestore() {
  if (!ensureInit()) return null
  return admin.firestore()
}

async function verifyIdTokenViaRest(idToken) {
  const apiKey = env('VITE_FIREBASE_API_KEY') || env('FIREBASE_API_KEY')
  if (!apiKey || !idToken) return null
  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      },
    )
    if (!res.ok) return null
    const data = await res.json()
    const user = data.users?.[0]
    if (!user?.localId) return null
    return { uid: user.localId, email: user.email || null }
  } catch {
    return null
  }
}

export async function verifyIdToken(idToken) {
  if (!idToken) return null
  if (ensureInit()) {
    try {
      return await admin.auth().verifyIdToken(idToken)
    } catch { /* fallback REST */ }
  }
  return verifyIdTokenViaRest(idToken)
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
  if (!db || !userId) {
    console.error('[activarPremium] Firestore indisponível — confirma FIREBASE_SERVICE_ACCOUNT no Netlify')
    return false
  }

  const updates = {
    isPremium: true,
    mapaCompleto: true,
    premiumAt: admin.firestore.FieldValue.serverTimestamp(),
  }

  if (extra.stripeSubscriptionId) {
    updates.stripeSubscriptionId = extra.stripeSubscriptionId
    updates.stripeCustomerId = extra.stripeCustomerId || null
    updates.premiumBilling = 'recurring'
  } else {
    updates.premiumBilling = 'lifetime'
    updates.premiumUntil = admin.firestore.FieldValue.delete()
    updates.stripeSubscriptionId = admin.firestore.FieldValue.delete()
    if (extra.stripeCustomerId) updates.stripeCustomerId = extra.stripeCustomerId
  }

  if (extra.stripeCustomerId && !updates.stripeCustomerId) {
    updates.stripeCustomerId = extra.stripeCustomerId
  }

  try {
    await db.collection('users').doc(userId).set(updates, { merge: true })
    return true
  } catch (e) {
    console.error('[activarPremium] escrita Firestore falhou:', e?.message)
    return false
  }
}

export async function activarMapaCompleto(userId) {
  const db = getFirestore()
  if (!db || !userId) {
    console.error('[activarMapaCompleto] Firestore indisponível — confirma FIREBASE_SERVICE_ACCOUNT no Netlify')
    return false
  }
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
