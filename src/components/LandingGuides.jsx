import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { LanguageSwitcher } from '../components/LanguageSwitcher.jsx'

const GUIDES = [
  { href: '/guia/mapa-astral.html', key: 'mapa' },
  { href: '/guia/ascendente.html', key: 'ascendente' },
  { href: '/guia/signos-zodiaco.html', key: 'signos' },
  { href: '/guia/tarot-guia.html', key: 'tarot' },
]

export function LandingGuides() {
  const { t, lang } = useLanguage()

  return (
    <section className="landing-guides" aria-label={t('auth.portal.guides.ariaLabel')} key={lang}>
      <div className="landing-guides-header">
        <h2 className="landing-guides-title">{t('auth.portal.guides.title')}</h2>
        <div className="landing-guides-lang">
          <LanguageSwitcher variant="compact" />
        </div>
      </div>
      <div className="landing-guides-grid">
        {GUIDES.map(({ href, key }) => {
          const guideHref = `${href}?lang=${lang}`
          return (
            <a key={key} href={guideHref} className="landing-guides-card">
              <span className="landing-guides-card-title">{t(`auth.portal.guides.${key}Title`)}</span>
              <span className="landing-guides-card-arrow">→</span>
            </a>
          )
        })}
      </div>
    </section>
  )
}
