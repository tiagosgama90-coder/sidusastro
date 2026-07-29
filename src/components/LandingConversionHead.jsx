import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { LandingMysticHighlight } from './LandingMysticHighlight.jsx'
import { LandingWelcomeSymbol } from './LandingWelcomeSymbol.jsx'

export function LandingConversionHead() {
  const { t } = useLanguage()

  return (
    <div className="landing-conversion-zone-head">
      <p className="landing-conversion-eyebrow">{t('auth.portal.conversionEyebrow')}</p>
      <h1 className="landing-conversion-title">
        <LandingMysticHighlight
          text={t('auth.portal.conversionTitle')}
          highlight={t('auth.portal.conversionTitleHighlight')}
        />
      </h1>
      <p className="landing-conversion-lead">
        <LandingMysticHighlight
          text={t('auth.portal.conversionLead')}
          highlight={t('auth.portal.conversionLeadHighlight')}
        />
      </p>
      <LandingWelcomeSymbol />
    </div>
  )
}
