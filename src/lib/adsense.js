/** Publisher ID público - igual ao index.html (AdSense sidusastro.com). */
export const ADSENSE_PUBLISHER = 'ca-pub-2807052149540484'
/** Bloco Display horizontal - sidusastro.com */
export const ADSENSE_SLOT_DEFAULT = '7205155875'

/** Páginas estáticas com conteúdo editorial. */
export const ADSENSE_CONTENT_PATH_PREFIX = '/guia/'

/** Ecrãs da app onde não mostramos anúncios (paywall, chat, onboarding, login). */
const ADS_BLOCKED_PASSOS = new Set(['paywall', 'onboarding', 'chat', 'perfil', 'privacidade', 'login'])

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

/** Activar bloco quando existir unidade (slot) e utilizador não for VIP. */
export function adsenseEnabled(isPremium = false) {
  if (isPremium) return false
  return /^\d+$/.test(getAdsenseSlot())
}

/** Anúncios na app principal (home, tarot, mapa, ferramentas…) - não em paywall/chat/login. */
export function shouldShowAdsOnPasso(passo) {
  return !ADS_BLOCKED_PASSOS.has(passo)
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
