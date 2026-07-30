import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { LandingMandalaReveal } from './LandingMandalaReveal.jsx'
import { LandingTrustBadges } from './LandingTrustBadges.jsx'

export function LandingConversionHead({ compact = false }) {
  const { t } = useLanguage()

  if (compact) {
    return (
      <div className="landing-conversion-zone-head landing-conversion-zone-head--compact">
        <h1 className="landing-conversion-title landing-conversion-title--compact">
          {t('auth.portal.conversionTitleCompact')}
        </h1>
      </div>
    )
  }

  return (
    <div className="landing-hero-pro">
      <div className="landing-hero-pro__content">
        <p className="landing-conversion-eyebrow">{t('auth.portal.conversionEyebrow')}</p>
        <h1 className="landing-conversion-title landing-conversion-title--pro">
          {t('auth.portal.conversionTitle')}
        </h1>
        <p className="landing-hero-pro__benefit">{t('auth.portal.conversionBenefit')}</p>
        <LandingTrustBadges compact />
      </div>
      <LandingMandalaReveal />
    </div>
  )
}
