import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { LandingMysticHighlight } from './LandingMysticHighlight.jsx'
import { LandingMapaPreview } from './LandingMapaPreview.jsx'

export function LandingPdfShowcase() {
  const { t } = useLanguage()

  return (
    <section className="landing-pdf-showcase" aria-label={t('auth.portal.pdfShowcase.ariaLabel')}>
      <h2 className="landing-pdf-showcase__title">
        <LandingMysticHighlight
          text={t('auth.portal.pdfShowcase.title')}
          highlight={t('auth.portal.pdfShowcase.titleHighlight')}
        />
      </h2>
      <p className="landing-pdf-showcase__desc">{t('auth.portal.pdfShowcase.description')}</p>
      <div className="landing-pdf-showcase__visual">
        <LandingMapaPreview variant="showcase" />
      </div>
      <p className="landing-pdf-showcase__caption">{t('auth.portal.pdfShowcase.caption')}</p>
    </section>
  )
}
