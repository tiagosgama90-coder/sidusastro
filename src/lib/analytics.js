/** Google Analytics 4 — só activa com consentimento "aceitar todos". */
export function getGaMeasurementId() {
  const id = import.meta.env.VITE_GA_MEASUREMENT_ID
  return id ? String(id).trim() : ''
}

export function analyticsConfigured() {
  return /^G-[A-Z0-9]+$/i.test(getGaMeasurementId())
}

function gtagReady() {
  return typeof window !== 'undefined' && typeof window.gtag === 'function'
}

export function initAnalytics() {
  if (!analyticsConfigured() || typeof document === 'undefined') return
  if (document.querySelector('script[data-sidus-ga]')) return

  const id = getGaMeasurementId()
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() { window.dataLayer.push(arguments) }
  window.gtag('js', new Date())
  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
  })
  window.gtag('consent', 'update', { analytics_storage: 'granted' })
  window.gtag('config', id, { send_page_view: false, anonymize_ip: true })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`
  script.dataset.sidusGa = '1'
  document.head.appendChild(script)
}

export function trackPageView(path) {
  if (!analyticsConfigured() || !gtagReady()) return
  const pagePath = path || (typeof window !== 'undefined'
    ? `${window.location.pathname}${window.location.search}`
    : '/')
  window.gtag('event', 'page_view', {
    page_path: pagePath,
    page_location: typeof window !== 'undefined' ? window.location.href : pagePath,
    page_title: typeof document !== 'undefined' ? document.title : 'Sidus',
  })
}

/** Eventos úteis para medir conversões (registo, pagamento, etc.). */
export function trackEvent(name, params = {}) {
  if (!analyticsConfigured() || !gtagReady()) return
  window.gtag('event', name, params)
}
