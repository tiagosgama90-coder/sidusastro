/** Carrega o script AdSense uma vez (só se VITE_ADSENSE_CLIENT estiver definido). */
export function initAdSense() {
  const client = import.meta.env.VITE_ADSENSE_CLIENT
  if (!client || typeof document === 'undefined') return
  if (document.querySelector('script[data-sidus-adsense]')) return

  const script = document.createElement('script')
  script.async = true
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`
  script.crossOrigin = 'anonymous'
  script.dataset.sidusAdsense = '1'
  document.head.appendChild(script)
}

export function adsenseEnabled() {
  return Boolean(import.meta.env.VITE_ADSENSE_CLIENT && import.meta.env.VITE_ADSENSE_SLOT)
}
