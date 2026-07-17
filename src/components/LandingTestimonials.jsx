import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { LandingMapaPreview } from './LandingMapaPreview.jsx'

export function LandingTestimonials() {
  const { t } = useLanguage()
  const items = ['1', '2', '3']

  return (
    <section className="landing-testimonials" aria-label={t('auth.portal.testimonials.ariaLabel')}>
      <h2 className="landing-testimonials-title">{t('auth.portal.testimonials.title')}</h2>
      <div className="landing-testimonials-grid">
        <div className="landing-testimonials-visual">
          <LandingMapaPreview />
          <p className="landing-testimonials-caption">{t('auth.portal.testimonials.previewCaption')}</p>
        </div>
        <div className="landing-testimonials-quotes">
          {items.map((n) => (
            <blockquote key={n} className="landing-testimonial-card landing-glass">
              <p className="landing-testimonial-text">"{t(`auth.portal.testimonials.quote${n}`)}"</p>
              <footer className="landing-testimonial-author">
                <span className="landing-testimonial-name">{t(`auth.portal.testimonials.author${n}`)}</span>
                <span className="landing-testimonial-meta">{t(`auth.portal.testimonials.meta${n}`)}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}
