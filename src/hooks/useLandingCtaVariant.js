import { useCallback, useState } from 'react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { trackLandingCtaClick } from '../lib/landingAnalytics.js'

const STORAGE_KEY = 'sidus_landing_cta_variant'

function readVariant() {
  if (typeof window === 'undefined') return 'a'
  let variant = localStorage.getItem(STORAGE_KEY)
  if (variant !== 'a' && variant !== 'b') {
    variant = Math.random() < 0.5 ? 'a' : 'b'
    localStorage.setItem(STORAGE_KEY, variant)
  }
  return variant
}

/** A/B: «Criar conta grátis» (a) vs «Ver o meu mapa» (b). */
export function useLandingCtaVariant() {
  const { t } = useLanguage()
  const [variant] = useState(readVariant)

  const label = variant === 'b'
    ? t('auth.portal.ctaVariantB')
    : t('auth.portal.ctaVariantA')

  const trackClick = useCallback((placement) => {
    trackLandingCtaClick(variant, placement)
  }, [variant])

  return { variant, label, trackClick }
}
