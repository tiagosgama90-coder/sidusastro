import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { LandingMysticHighlight } from './LandingMysticHighlight.jsx'

const CHART_SRC = '/brand/sidus-celestial-chart-1024.png?v=12'
const CHART_SRCSET =
  '/brand/sidus-celestial-chart-512.png?v=12 512w, /brand/sidus-celestial-chart-1024.png?v=12 1024w, /brand/sidus-celestial-chart-2048.png?v=12 2048w'

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
      <div className="landing-welcome-zodiac notranslate" translate="no" aria-hidden>
        <img
          className="landing-welcome-zodiac__img"
          src={CHART_SRC}
          srcSet={CHART_SRCSET}
          sizes="(max-width: 640px) 132px, 184px"
          width={184}
          height={184}
          alt=""
          decoding="async"
          draggable={false}
        />
      </div>
    </div>
  )
}
