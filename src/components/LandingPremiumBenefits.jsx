import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { useGeoCountry } from '../hooks/useGeoCountry.js'
import { getPremiumPriceLabels } from '../lib/premiumPricingLabels.js'

/** Link discreto para a secção de comparação (hero/testemunhos). */
export function LandingPremiumJumpButton() {
  const { t } = useLanguage()
  const { isBrasil } = useGeoCountry()
  const prices = getPremiumPriceLabels(isBrasil)

  return (
    <a href="#comparar-planos" className="landing-premium-jump-btn">
      {t('landingPremium.jumpCta', { price: prices.dualShort })}
    </a>
  )
}
