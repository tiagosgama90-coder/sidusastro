import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { useGeoCountry } from '../hooks/useGeoCountry.js'
import { PremiumComparacao } from './PremiumComparacao.jsx'
import { PremiumPricingNote } from './PremiumPricingNote.jsx'
import { getPremiumPriceLabels } from '../lib/premiumPricingLabels.js'

export function LandingSimplePremium({ onCta }) {
  const { t } = useLanguage()
  const { isBrasil } = useGeoCountry()
  const prices = getPremiumPriceLabels(isBrasil)

  return (
    <div className="landing-simple-premium landing-glass" aria-label={t('landing.simplePremium.ariaLabel')}>
      <h3 className="landing-simple-premium__title">{t('landing.simplePremium.title')}</h3>
      <PremiumPricingNote compact />
      <PremiumComparacao isBrasil={isBrasil} showFullTable showPricingNote={false} />
      <button
        type="button"
        className="landing-simple-premium__cta"
        onClick={onCta}
        aria-label={t('landing.simplePremium.ctaAria')}
      >
        {t('landing.simplePremium.cta', { price: prices.dualShort })}
      </button>
    </div>
  )
}
