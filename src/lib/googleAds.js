import { getGaMeasurementId } from './googleAnalytics.js'

/** ID de conversão Google Ads (ex.: AW-123456789). */
export function getGoogleAdsId() {
  const fromEnv = import.meta.env.VITE_GOOGLE_ADS_ID
  if (fromEnv && /^AW-\d+$/i.test(String(fromEnv).trim())) return String(fromEnv).trim()
  return null
}

function getConversionLabel(action) {
  const map = {
    signup: import.meta.env.VITE_GOOGLE_ADS_LABEL_SIGNUP,
    mapa: import.meta.env.VITE_GOOGLE_ADS_LABEL_MAPA,
    purchase: import.meta.env.VITE_GOOGLE_ADS_LABEL_PURCHASE,
  }
  const label = map[action]
  return label && String(label).trim() ? String(label).trim() : null
}

function gtagSafe() {
  return typeof window !== 'undefined' && typeof window.gtag === 'function'
}

/** Conversão Google Ads + evento GA4. GA4 dispara sempre que gtag existir. */
export function trackGoogleAdsConversion(action, ga4Event = null, ga4Params = {}) {
  if (!gtagSafe()) return

  const adsId = getGoogleAdsId()
  const label = getConversionLabel(action)
  if (adsId && label) {
    window.gtag('event', 'conversion', { send_to: `${adsId}/${label}` })
  }

  if (ga4Event) {
    window.gtag('event', ga4Event, ga4Params)
  }
}

export function trackSignupConversion(method = 'email') {
  trackGoogleAdsConversion('signup', 'sign_up', { method })
}

export function trackMapaConversion() {
  trackGoogleAdsConversion('mapa', 'generate_lead', { lead_type: 'natal_chart' })
}

export function trackPurchaseConversion(productType, value = null) {
  const params = { currency: 'EUR', items: [{ item_name: productType }] }
  if (value != null) params.value = value
  trackGoogleAdsConversion('purchase', 'purchase', params)
}
