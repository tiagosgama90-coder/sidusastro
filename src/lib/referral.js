const REF_STORAGE_KEY = 'sidus_ref'

/** Código curto derivado do UID — único por utilizador */
export function referralCodeFromUid(uid) {
  if (!uid || typeof uid !== 'string') return ''
  return uid.slice(0, 8).toUpperCase()
}

/** Guarda ?ref= da URL para associar após registo */
export function captureReferralFromUrl() {
  if (typeof window === 'undefined') return
  try {
    const params = new URLSearchParams(window.location.search)
    const ref = params.get('ref')?.trim().toUpperCase()
    if (ref && ref.length >= 6) {
      sessionStorage.setItem(REF_STORAGE_KEY, ref)
    }
  } catch { /* quota / private mode */ }
}

export function getPendingReferralCode() {
  try {
    return sessionStorage.getItem(REF_STORAGE_KEY) || null
  } catch {
    return null
  }
}

export function clearPendingReferral() {
  try {
    sessionStorage.removeItem(REF_STORAGE_KEY)
  } catch { /* ignore */ }
}

export function buildReferralLink(code) {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://sidusastro.com'
  const c = (code || '').trim().toUpperCase()
  return `${origin}/login?ref=${encodeURIComponent(c)}`
}
