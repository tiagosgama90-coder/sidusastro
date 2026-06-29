/** Google Analytics 4 - gtag base no index.html; Ads e consent via App. */
const FALLBACK_GA_ID = 'G-18FPC8HYE8'

function getGoogleAdsId() {
  const fromEnv = import.meta.env.VITE_GOOGLE_ADS_ID
  if (fromEnv && /^AW-\d+$/i.test(String(fromEnv).trim())) return String(fromEnv).trim()
  return null
}

export function getGaMeasurementId() {
  const fromEnv = import.meta.env.VITE_GA_MEASUREMENT_ID
  if (fromEnv && /^G-[A-Z0-9]+$/i.test(String(fromEnv).trim())) return String(fromEnv).trim()
  return FALLBACK_GA_ID
}

export function initGoogleAnalytics() {
  if (typeof document === 'undefined') return

  if (typeof window.gtag !== 'function') {
    window.dataLayer = window.dataLayer || []
    function gtag() { window.dataLayer.push(arguments) }
    window.gtag = gtag
    if (!document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
      const loader = document.createElement('script')
      loader.async = true
      loader.src = `https://www.googletagmanager.com/gtag/js?id=${getGaMeasurementId()}`
      document.head.appendChild(loader)
    }
    gtag('js', new Date())
    gtag('config', getGaMeasurementId(), { anonymize_ip: true })
  }

  const adsId = getGoogleAdsId()
  if (adsId) window.gtag('config', adsId)
}
