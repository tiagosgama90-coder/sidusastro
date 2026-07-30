/** Eventos GA4 na landing para medir funil e variantes A/B. */
export function trackLandingEvent(name, params = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', name, params)
}

export function trackLandingCtaClick(variant, placement) {
  trackLandingEvent('landing_cta_click', { cta_variant: variant, placement })
}

export function trackLandingExitIntent(action) {
  trackLandingEvent('landing_exit_intent', { action })
}

export function trackLandingCompareView(mode) {
  trackLandingEvent('landing_compare_view', { mode })
}
