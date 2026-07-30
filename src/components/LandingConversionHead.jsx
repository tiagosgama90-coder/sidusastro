import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { LandingMandalaReveal } from './LandingMandalaReveal.jsx'
import { LandingTrustBadges } from './LandingTrustBadges.jsx'
import { useLandingAdsMessage } from '../hooks/useLandingAdsMessage.js'

export function LandingConversionHead({ compact = false }) {
  const { t } = useLanguage()
  const ads = useLandingAdsMessage()

  if (compact) {
    const title = ads.fromAds ? ads.title : t('auth.portal.conversionTitleCompact')
    return (
      <div className="landing-conversion-zone-head landing-conversion-zone-head--compact">
        <h1 className="landing-conversion-title landing-conversion-title--compact">
          {title}
        </h1>
      </div>
    )
  }

  return (
    <div className={`landing-hero-pro${ads.fromAds ? ' landing-hero-pro--ads' : ''}`}>
      <div className="landing-hero-pro__content">
        <p className="landing-conversion-eyebrow">{ads.eyebrow}</p>
        <h1 className="landing-conversion-title landing-conversion-title--pro">
          {ads.title}
        </h1>
        <p className="landing-hero-pro__benefit">{ads.benefit}</p>
        <LandingTrustBadges compact />
      </div>
      <LandingMandalaReveal />
    </div>
  )
}
