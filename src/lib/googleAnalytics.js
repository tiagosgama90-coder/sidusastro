/** Google Analytics 4 - carregado após consentimento de cookies (App.jsx). */
const FALLBACK_GA_ID = 'G-18FPC8HYE8'

export function getGaMeasurementId() {
  const fromEnv = import.meta.env.VITE_GA_MEASUREMENT_ID
  if (fromEnv && /^G-[A-Z0-9]+$/i.test(String(fromEnv).trim())) return String(fromEnv).trim()
  return FALLBACK_GA_ID
}

export function initGoogleAnalytics() {
  const id = getGaMeasurementId()
  if (!id || typeof document === 'undefined') return
  if (document.querySelector('script[data-sidus-ga]')) return

  const loader = document.createElement('script')
  loader.async = true
  loader.src = `https://www.googletagmanager.com/gtag/js?id=${id}`
  loader.dataset.sidusGa = '1'
  document.head.appendChild(loader)

  window.dataLayer = window.dataLayer || []
  function gtag() { window.dataLayer.push(arguments) }
  window.gtag = gtag
  gtag('js', new Date())
  gtag('config', id, { anonymize_ip: true })
}
