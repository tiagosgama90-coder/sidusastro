import { useLanguage } from '../lib/i18n/LanguageContext.jsx'

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
      <h2 className="landing-guides-title">{t('auth.portal.guides.title')}</h2>
      <p className="landing-guides-lead">{t('auth.portal.guides.lead')}</p>
      <ul className="landing-guides-list">
        {GUIDES.map(({ href, key }) => (
          <li key={key}>
            <a href={href} className="landing-guides-link">
              <span className="landing-guides-link-title">{t(`auth.portal.guides.${key}Title`)}</span>
              <span className="landing-guides-link-desc">{t(`auth.portal.guides.${key}Desc`)}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
