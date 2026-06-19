/** Publisher ID público — igual ao index.html (AdSense sidusastro.com). */
export const ADSENSE_PUBLISHER = 'ca-pub-2807052149540484'
/** Bloco Display horizontal — sidusastro.com */
export const ADSENSE_SLOT_DEFAULT = '7205155875'

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

/** Activar bloco in-app quando existir unidade (slot) configurada no build Netlify. */
export function adsenseEnabled() {
  return /^\d+$/.test(getAdsenseSlot())
}

export function initAdSense() {
  if (typeof document === 'undefined') return
  if (document.querySelector('script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]')) return
  if (document.querySelector('script[data-sidus-adsense]')) return

  const script = document.createElement('script')
  script.async = true
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${getAdsenseClient()}`
  script.crossOrigin = 'anonymous'
  script.dataset.sidusAdsense = '1'
  document.head.appendChild(script)
}
