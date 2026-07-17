import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { ArrowUpRight } from 'lucide-react'

const GUIDES = [
  {
    id: 'mapa',
    href: '/guia/mapa-astral.html',
    titleKey: 'auth.portal.guides.mapaTitle',
    readKey: 'auth.portal.guides.mapaRead',
    glyph: '☉',
    accent: '#DFB76C',
  },
  {
    id: 'ascendente',
    href: '/guia/ascendente.html',
    titleKey: 'auth.portal.guides.ascendenteTitle',
    readKey: 'auth.portal.guides.ascendenteRead',
    glyph: '↑',
    accent: '#C4B5FD',
  },
  {
    id: 'signos',
    href: '/guia/signos-zodiaco.html',
    titleKey: 'auth.portal.guides.signosTitle',
    readKey: 'auth.portal.guides.signosRead',
    glyph: '♈',
    accent: '#F472B6',
  },
  {
    id: 'tarot',
    href: '/guia/tarot-guia.html',
    titleKey: 'auth.portal.guides.tarotTitle',
    readKey: 'auth.portal.guides.tarotRead',
    glyph: '✦',
    accent: '#34D399',
  },
]

export function LandingGuides() {
  const { t, lang } = useLanguage()

  return (
    <section className="landing-guides landing-guides--compact" aria-label={t('auth.portal.guides.ariaLabel')} key={lang}>
      <div className="landing-guides-header">
        <h2 className="landing-guides-title">{t('auth.portal.guides.title')}</h2>
        <p className="landing-guides-lead">{t('auth.portal.guides.leadCompact')}</p>
      </div>

      <div className="landing-guides-grid">
        {GUIDES.map((guide) => (
          <a
            key={guide.id}
            href={lang === 'pt' ? guide.href : `${guide.href}?lang=${lang}`}
            className="landing-guide-card landing-guide-card--compact landing-glass"
            style={{ '--guide-accent': guide.accent }}
          >
            <span className="landing-guide-glyph landing-guide-glyph--compact" aria-hidden="true">{guide.glyph}</span>
            <span className="landing-guide-card-title landing-guide-card-title--compact">{t(guide.titleKey)}</span>
            <span className="landing-guide-read landing-guide-read--compact">{t(guide.readKey)}</span>
            <ArrowUpRight size={14} className="landing-guide-arrow" aria-hidden="true" />
          </a>
        ))}
      </div>
    </section>
  )
}
