import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { LanguageSwitcher } from './LanguageSwitcher.jsx'

const GUIDES = [
  { href: '/guia/mapa-astral.html', key: 'mapa' },
  { href: '/guia/ascendente.html', key: 'ascendente' },
  { href: '/guia/signos-zodiaco.html', key: 'signos' },
  { href: '/guia/tarot-guia.html', key: 'tarot' },
]

export function LandingGuides() {
  const { t } = useLanguage()

  return (
    <section className="landing-guides" aria-label={t('auth.portal.guides.ariaLabel')}>
      <div className="landing-guides-header">
        <h2 className="landing-guides-title">{t('auth.portal.guides.title')}</h2>
        <div className="landing-guides-lang">
          <LanguageSwitcher variant="compact" />
        </div>
      </div>
      <ul className="landing-guides-list">
        {GUIDES.map(({ href, key }) => (
          <li key={key}>
            <a href={href} className="landing-guides-link">
              <span className="landing-guides-link-title">{t(`auth.portal.guides.${key}Title`)}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
