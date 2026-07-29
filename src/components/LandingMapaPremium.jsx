import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { getMapaPremiumSections } from '../lib/mapaPremiumSections.js'

const MANDALA_SRC = '/brand/sidus-natal-guide-wheels.png?v=1'

/** Resumo do mapa Premium na landing: mandala + secções douradas. */
export function LandingMapaPremium() {
  const { t } = useLanguage()
  const sections = getMapaPremiumSections(t)

  return (
    <section className="landing-mapa-premium landing-glass" aria-label={t('landing.mapaPremium.ariaLabel')}>
      <p className="landing-mapa-premium__eyebrow">{t('landing.mapaPremium.eyebrow')}</p>
      <h2 className="landing-mapa-premium__title">{t('landing.mapaPremium.title')}</h2>
      <p className="landing-mapa-premium__lead">{t('landing.mapaPremium.lead')}</p>

      <div className="landing-mapa-premium__mandala-wrap">
        <img
          src={MANDALA_SRC}
          alt={t('mapa.mandalaTitle')}
          className="landing-mapa-premium__mandala"
          width={320}
          height={320}
          loading="lazy"
          decoding="async"
        />
        <p className="landing-mapa-premium__mandala-caption">{t('landing.mapaPremium.mandalaCaption')}</p>
      </div>

      <ul className="landing-mapa-premium__sections">
        {sections.map((sec) => (
          <li key={sec.key} className="landing-mapa-premium__section">
            <span className="landing-mapa-premium__section-title">{sec.title}</span>
            <span className="landing-mapa-premium__section-desc">{sec.desc}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
