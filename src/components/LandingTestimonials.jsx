import { useLanguage } from '../lib/i18n/LanguageContext.jsx'

function MapaPreviewMock() {
  const signs = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓']
  return (
    <div className="landing-testimonial-preview" aria-hidden="true">
      <div className="landing-testimonial-preview-inner">
        <svg viewBox="0 0 200 200" className="landing-testimonial-wheel">
          <circle cx="100" cy="100" r="92" fill="none" stroke="rgba(223,183,108,0.35)" strokeWidth="1" />
          <circle cx="100" cy="100" r="68" fill="none" stroke="rgba(223,183,108,0.2)" strokeWidth="0.8" />
          <circle cx="100" cy="100" r="42" fill="rgba(11,7,30,0.6)" stroke="rgba(223,183,108,0.4)" strokeWidth="1" />
          {signs.map((s, i) => {
            const a = ((i * 30 - 90) * Math.PI) / 180
            const x = 100 + Math.cos(a) * 80
            const y = 100 + Math.sin(a) * 80
            return <text key={s} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill="rgba(223,183,108,0.85)" fontSize="11">{s}</text>
          })}
          <text x="100" y="96" textAnchor="middle" fill="#DFB76C" fontSize="9" fontWeight="600">☉ SOL</text>
          <text x="100" y="108" textAnchor="middle" fill="#C4B5FD" fontSize="8">☽ LUA</text>
          <text x="100" y="120" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="7">ASC</text>
        </svg>
        <div className="landing-testimonial-pdf-badge">PDF</div>
      </div>
    </div>
  )
}

export function LandingTestimonials() {
  const { t } = useLanguage()
  const items = ['1', '2', '3']

  return (
    <section className="landing-testimonials" aria-label={t('auth.portal.testimonials.ariaLabel')}>
      <h2 className="landing-testimonials-title">{t('auth.portal.testimonials.title')}</h2>
      <div className="landing-testimonials-grid">
        <div className="landing-testimonials-visual">
          <MapaPreviewMock />
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
