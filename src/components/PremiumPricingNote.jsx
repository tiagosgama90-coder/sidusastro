import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { useGeoCountry } from '../hooks/useGeoCountry.js'
import { getPremiumPriceLabels } from '../lib/premiumPricingLabels.js'

export function PremiumPricingNote({ className = '', compact = false }) {
  const { t } = useLanguage()
  const { isBrasil } = useGeoCountry()
  const prices = getPremiumPriceLabels(isBrasil, t)

  return (
    <div className={`premium-pricing-note${compact ? ' premium-pricing-note--compact' : ''}${className ? ` ${className}` : ''}`}>
      <p className="premium-pricing-note__main">{prices.dualLine}</p>
      <p className="premium-pricing-note__sub">{t('premium.pricingLifetime')}</p>
    </div>
  )
}
