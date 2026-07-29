import { SidusLogo } from './SidusLogo.jsx'
import { LanguageSwitcher } from './LanguageSwitcher.jsx'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { useGeoCountry } from '../hooks/useGeoCountry.js'
import { getPremiumPriceLabels } from '../lib/premiumPricingLabels.js'

export function LandingTopBar({ onCta, onLogin }) {
  const { t } = useLanguage()
  const { isBrasil } = useGeoCountry()
  const prices = getPremiumPriceLabels(isBrasil)

  return (
    <header className="landing-top-bar notranslate" translate="no">
      <SidusLogo variant="horizontal" markSize={48} glow className="sidus-logo--landing-bar" />
      <div className="landing-top-bar__actions">
        <LanguageSwitcher variant="landing-bar" />
        {onLogin && (
          <button type="button" className="landing-top-bar__login" onClick={onLogin}>
            {t('auth.login')}
          </button>
        )}
        <button type="button" className="landing-top-bar__cta" onClick={onCta}>
          {t('auth.portal.topCta', { price: prices.dualShort })}
        </button>
      </div>
    </header>
  )
}
