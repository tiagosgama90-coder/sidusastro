import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { LandingMysticHighlight } from './LandingMysticHighlight.jsx'

const MANDALA_SRC = '/brand/sidus-cosmic-mandala-1024.png?v=11'
const MANDALA_SRCSET =
  '/brand/sidus-cosmic-mandala-512.png?v=11 512w, /brand/sidus-cosmic-mandala-1024.png?v=11 1024w, /brand/sidus-cosmic-mandala-2048.png?v=11 2048w'

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
          src={MANDALA_SRC}
          srcSet={MANDALA_SRCSET}
          sizes="(max-width: 640px) 120px, 168px"
          width={168}
          height={168}
          alt=""
          decoding="async"
          draggable={false}
        />
      </div>
    </div>
  )
}
