import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { ArrowUpRight, BookOpen, Sparkles } from 'lucide-react'

const GUIDES = [
  {
    id: 'mapa',
    href: '/guia/mapa-astral.html',
    titleKey: 'auth.portal.guides.mapaTitle',
    descKey: 'auth.portal.guides.mapaDesc',
    readKey: 'auth.portal.guides.mapaRead',
    glyph: '☉',
    accent: '#DFB76C',
  },
  {
    id: 'ascendente',
    href: '/guia/ascendente.html',
    titleKey: 'auth.portal.guides.ascendenteTitle',
    descKey: 'auth.portal.guides.ascendenteDesc',
    readKey: 'auth.portal.guides.ascendenteRead',
    glyph: '↑',
    accent: '#C4B5FD',
  },
  {
    id: 'signos',
    href: '/guia/signos-zodiaco.html',
    titleKey: 'auth.portal.guides.signosTitle',
    descKey: 'auth.portal.guides.signosDesc',
    readKey: 'auth.portal.guides.signosRead',
    glyph: '♈',
    accent: '#F472B6',
  },
  {
    id: 'tarot',
    href: '/guia/tarot-guia.html',
    titleKey: 'auth.portal.guides.tarotTitle',
    descKey: 'auth.portal.guides.tarotDesc',
    readKey: 'auth.portal.guides.tarotRead',
    glyph: '✦',
    accent: '#34D399',
  },
]

export function LandingGuides() {
  const { t, lang } = useLanguage()

  return (
    <section id="guias" className="landing-guides landing-guides--featured" aria-label={t('auth.portal.guides.ariaLabel')} key={lang}>
      <div className="landing-guides-header">
        <div className="landing-guides-header-icon" aria-hidden="true">
          <BookOpen size={20} color="#DFB76C" />
        </div>
        <p className="landing-guides-eyebrow">
          <Sparkles size={12} aria-hidden="true" />
          {t('auth.portal.guides.eyebrow')}
        </p>
        <h2 className="landing-guides-title">{t('auth.portal.guides.title')}</h2>
        <p className="landing-guides-lead">{t('auth.portal.guides.lead')}</p>
      </div>

      <div className="landing-guides-grid landing-guides-grid--featured">
        {GUIDES.map((guide) => (
          <a
            key={guide.id}
            href={lang === 'pt' ? guide.href : `${guide.href}?lang=${lang}`}
            className="landing-guide-card landing-glass"
            style={{ '--guide-accent': guide.accent }}
          >
            <div className="landing-guide-card-top">
              <div className="landing-guide-visual">
                <span className="landing-guide-glyph" aria-hidden="true">{guide.glyph}</span>
              </div>
              <ArrowUpRight size={18} className="landing-guide-arrow-featured" aria-hidden="true" />
            </div>
            <div className="landing-guide-body">
              <h3 className="landing-guide-card-title">{t(guide.titleKey)}</h3>
              <p className="landing-guide-card-desc">{t(guide.descKey)}</p>
              <div className="landing-guide-meta">
                <span className="landing-guide-read">{t(guide.readKey)}</span>
                <span className="landing-guide-link">
                  {t('auth.portal.guides.readMore')}
                  <ArrowUpRight size={13} aria-hidden="true" />
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
