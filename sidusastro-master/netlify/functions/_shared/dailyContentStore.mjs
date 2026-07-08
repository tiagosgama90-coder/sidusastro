import { getFirestore } from './firebase-admin.mjs'
import { generateDailyContent } from './dailyContentGenerate.mjs'

const COL = 'siteDaily'

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export async function getDailyContent(date = todayISO()) {
  const db = getFirestore()
  if (!db) return null
  const snap = await db.collection(COL).doc(date).get()
  return snap.exists ? snap.data() : null
}

export async function ensureDailyContent({ date = todayISO(), fasePt, faseEn, transitSummary }) {
  const existing = await getDailyContent(date)
  if (existing?.horoscopes) return existing

  const pack = await generateDailyContent({ date, fasePt, faseEn, transitSummary })
  const db = getFirestore()
  if (db) {
    await db.collection(COL).doc(date).set(pack, { merge: true })
  }
  return pack
}
