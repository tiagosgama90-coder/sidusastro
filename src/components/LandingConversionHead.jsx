import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { LandingMysticHighlight } from './LandingMysticHighlight.jsx'

const ZODIAC_RING_SRC = '/brand/sidus-zodiac-ring-512.png?v=10'
const ZODIAC_RING_SRCSET = '/brand/sidus-zodiac-ring-512.png?v=10 1x, /brand/sidus-zodiac-ring-1024.png?v=10 2x'

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
          src={ZODIAC_RING_SRC}
          srcSet={ZODIAC_RING_SRCSET}
          width={128}
          height={128}
          alt=""
          decoding="async"
          draggable={false}
        />
      </div>
    </div>
  )
}
