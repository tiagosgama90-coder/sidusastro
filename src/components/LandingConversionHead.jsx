import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { LandingMysticHighlight } from './LandingMysticHighlight.jsx'
import { LandingWelcomeSymbol } from './LandingWelcomeSymbol.jsx'
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
    <div className={`landing-conversion-zone-head${ads.fromAds ? ' landing-hero-pro--ads' : ''}`}>
      <p className="landing-conversion-eyebrow">{ads.eyebrow}</p>
      <h1 className="landing-conversion-title">
        {ads.fromAds ? (
          ads.title
        ) : (
          <LandingMysticHighlight
            text={t('auth.portal.conversionTitle')}
            highlight={t('auth.portal.conversionTitleHighlight')}
          />
        )}
      </h1>
      <p className="landing-conversion-lead">
        {ads.fromAds ? (
          ads.benefit
        ) : (
          <LandingMysticHighlight
            text={t('auth.portal.conversionLead')}
            highlight={t('auth.portal.conversionLeadHighlight')}
          />
        )}
      </p>
      <LandingWelcomeSymbol />
    </div>
  )
}
