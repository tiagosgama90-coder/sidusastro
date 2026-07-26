import { FieldValue, getFirestore } from './firebase-admin.mjs'
import { env } from './env.mjs'

const COL_KEYS = 'api_keys'
const COL_USAGE = 'api_usage'

const PLANS = {
  free: { dailyLimit: 100, monthlyLimit: 2000, label: 'Free' },
  starter: { dailyLimit: 500, monthlyLimit: 15000, label: 'Starter' },
  pro: { dailyLimit: 3000, monthlyLimit: 100000, label: 'Pro' },
}

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

function monthKey() {
  return new Date().toISOString().slice(0, 7)
}

export function extractApiKey(req) {
  const header = req.headers.get('x-api-key') || req.headers.get('authorization') || ''
  if (header.toLowerCase().startsWith('bearer ')) {
    return header.slice(7).trim()
  }
  return header.trim()
}

export function generateApiKey() {
  const bytes = new Uint8Array(24)
  crypto.getRandomValues(bytes)
  const token = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
  return `sk_sidus_${token}`
}

export async function validateApiKey(req) {
  const key = extractApiKey(req)
  if (!key) {
    return { ok: false, status: 401, error: 'missing_api_key', message: 'Envia o header X-API-Key.' }
  }

  const demoKey = env('SIDUS_API_DEMO_KEY')
  if (demoKey && key === demoKey) {
    return {
      ok: true,
      keyId: 'demo',
      plan: 'free',
      limits: PLANS.free,
      email: 'demo@sidusastro.com',
    }
  }

  const db = getFirestore()
  if (!db) {
    return { ok: false, status: 503, error: 'service_unavailable', message: 'API temporariamente indisponível.' }
  }

  const snap = await db.collection(COL_KEYS).where('key', '==', key).limit(1).get()
  if (snap.empty) {
    return { ok: false, status: 401, error: 'invalid_api_key', message: 'API key inválida.' }
  }

  const doc = snap.docs[0]
  const data = doc.data()
  if (data.active === false) {
    return { ok: false, status: 403, error: 'key_disabled', message: 'API key desactivada.' }
  }

  const plan = PLANS[data.plan] ? data.plan : 'free'
  const limits = PLANS[plan]

  const usageRef = doc.ref.collection('usage').doc(todayKey())
  const usageSnap = await usageRef.get()
  const usedToday = usageSnap.exists ? Number(usageSnap.data()?.count || 0) : 0

  if (usedToday >= limits.dailyLimit) {
    return {
      ok: false,
      status: 429,
      error: 'rate_limit_exceeded',
      message: `Limite diário atingido (${limits.dailyLimit} requests).`,
      limit: limits.dailyLimit,
      used: usedToday,
    }
  }

  return {
    ok: true,
    keyId: doc.id,
    keyRef: doc.ref,
    plan,
    limits,
    email: data.email || null,
    usedToday,
  }
}

export async function recordApiUsage(auth, endpoint) {
  if (!auth?.keyRef) return
  const db = getFirestore()
  if (!db) return

  const day = todayKey()
  const month = monthKey()

  await auth.keyRef.collection('usage').doc(day).set({
    count: FieldValue.increment(1),
    endpoint,
    updatedAt: FieldValue.serverTimestamp(),
  }, { merge: true })

  await auth.keyRef.set({
    lastUsedAt: FieldValue.serverTimestamp(),
    totalRequests: FieldValue.increment(1),
    [`monthlyUsage.${month}`]: FieldValue.increment(1),
  }, { merge: true })
}

export async function createApiKey({ email, name, plan = 'free', source = 'developers' }) {
  const db = getFirestore()
  if (!db) throw new Error('Firestore indisponível')

  const key = generateApiKey()
  const docRef = await db.collection(COL_KEYS).add({
    key,
    email: String(email || '').trim().toLowerCase(),
    name: String(name || '').trim(),
    plan: PLANS[plan] ? plan : 'free',
    source,
    active: true,
    createdAt: FieldValue.serverTimestamp(),
    lastUsedAt: null,
    totalRequests: 0,
  })

  return { id: docRef.id, key, plan: PLANS[plan] ? plan : 'free' }
}

export { PLANS }
