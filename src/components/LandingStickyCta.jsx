import { useEffect, useState } from 'react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { useGeoCountry } from '../hooks/useGeoCountry.js'
import { getPremiumPriceLabels } from '../lib/premiumPricingLabels.js'

export function LandingStickyCta({ onCta, targetRef }) {
  const { t } = useLanguage()
  const { isBrasil } = useGeoCountry()
  const [visivel, setVisivel] = useState(false)
  const prices = getPremiumPriceLabels(isBrasil)

  useEffect(() => {
    const alvo = targetRef?.current
    if (!alvo) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => setVisivel(!entry.isIntersecting),
      { threshold: 0.05, rootMargin: '-40px 0px 0px 0px' },
    )
    observer.observe(alvo)
    return () => observer.disconnect()
  }, [targetRef])

  if (!visivel) return null

  return (
    <div className="landing-sticky-cta" role="region" aria-label={t('landing.stickyCtaAria')}>
      <button type="button" className="landing-sticky-cta__btn" onClick={onCta}>
        {t('landing.stickyCta', { price: prices.dualShort })}
      </button>
    </div>
  )
}
