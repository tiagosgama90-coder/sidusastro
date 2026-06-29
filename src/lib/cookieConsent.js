/** Consentimento de cookies RGPD - localStorage apenas (sem cookies até aceitar). */
const STORAGE_KEY = 'sidus_cookie_consent_v1'

/** 'all' = cookies analíticos/publicidade | 'essential' = só necessários + ads não personalizados */
export function getCookieConsent() {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'all' || v === 'essential') return v
    return null
  } catch {
    return null
  }
}

export function setCookieConsent(value) {
  try {
    localStorage.setItem(STORAGE_KEY, value)
  } catch { /* quota */ }
}

export function hasCookieChoice() {
  return getCookieConsent() != null
}

/** Publicidade AdSense permitida (com escolha registada). */
export function allowsAds() {
  const c = getCookieConsent()
  return c === 'all' || c === 'essential'
}

export function allowsPersonalizedAds() {
  return getCookieConsent() === 'all'
}

export function applyAdConsentToGoogle() {
  if (typeof window === 'undefined') return
  window.adsbygoogle = window.adsbygoogle || []
  if (allowsPersonalizedAds()) {
    try { delete window.adsbygoogle.requestNonPersonalizedAds } catch { /* ok */ }
  } else if (allowsAds()) {
    window.adsbygoogle.requestNonPersonalizedAds = 1
  }
}

/** Actualiza Consent Mode v2 (gtag no index.html). */
export function applyAnalyticsConsentToGtag() {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  const c = getCookieConsent()
  if (c === 'all') {
    window.gtag('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
    })
  } else if (c === 'essential') {
    window.gtag('consent', 'update', {
      analytics_storage: 'denied',
      ad_storage: 'granted',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    })
  }
}
