import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { useGeoCountry } from '../hooks/useGeoCountry.js'
import { LandingPremiumCompare } from './LandingPremiumCompare.jsx'
import { PremiumPricingNote } from './PremiumPricingNote.jsx'
import { getPremiumPriceLabels } from '../lib/premiumPricingLabels.js'

export function LandingSimplePremium({ onCta }) {
  const { t } = useLanguage()
  const { isBrasil } = useGeoCountry()
  const prices = getPremiumPriceLabels(isBrasil)

  return (
    <section
        id="comparar-planos"
        className="landing-simple-premium landing-glass" aria-label={t('landing.simplePremium.ariaLabel')}>
      <p className="landing-simple-premium__eyebrow">{t('landing.simplePremium.eyebrow')}</p>
      <h2 className="landing-simple-premium__title">{t('landing.simplePremium.title')}</h2>
      <p className="landing-simple-premium__lead">{t('landing.simplePremium.lead')}</p>
      <PremiumPricingNote compact />
      <LandingPremiumCompare />
      <button
        type="button"
        className="landing-simple-premium__cta"
        onClick={onCta}
        aria-label={t('landing.simplePremium.ctaAria')}
      >
        {t('landing.simplePremium.cta', { price: prices.dualShort })}
      </button>
    </section>
  )
}
