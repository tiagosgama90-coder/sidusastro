/** AdSense — configure VITE_ADSENSE_CLIENT e VITE_ADSENSE_SLOT no Netlify. */
export const ADSENSE_PUBLISHER = ''
export const ADSENSE_SLOT_DEFAULT = ''

export function getAdsenseClient() {
  const fromEnv = import.meta.env.VITE_ADSENSE_CLIENT
  if (fromEnv && String(fromEnv).startsWith('ca-pub-')) return fromEnv
  return ADSENSE_PUBLISHER
}

export function getAdsenseSlot() {
  const slot = import.meta.env.VITE_ADSENSE_SLOT || ADSENSE_SLOT_DEFAULT
  if (!slot) return ''
  return String(slot).trim()
}

export function adsenseEnabled(isPremium = false) {
  if (isPremium) return false
  return /^\d+$/.test(getAdsenseSlot()) && getAdsenseClient().startsWith('ca-pub-')
}

export function initAdSense() {
  if (typeof document === 'undefined') return
  const client = getAdsenseClient()
  if (!client.startsWith('ca-pub-')) return
  if (document.querySelector('script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]')) return
  if (document.querySelector('script[data-sidus-adsense]')) return

  const script = document.createElement('script')
  script.async = true
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`
  script.crossOrigin = 'anonymous'
  script.dataset.sidusAdsense = '1'
  document.head.appendChild(script)
}
