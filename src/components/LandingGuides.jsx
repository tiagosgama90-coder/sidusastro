import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { BookOpen } from 'lucide-react'
import { LandingGuideArt } from './LandingGuideArt.jsx'

const GUIDES = [
  {
    id: 'mapa',
    href: '/guia/mapa-astral.html',
    titleKey: 'auth.portal.guides.mapaTitle',
    descKey: 'auth.portal.guides.mapaDesc',
    readKey: 'auth.portal.guides.mapaRead',
    accent: '#DFB76C',
  },
  {
    id: 'ascendente',
    href: '/guia/ascendente.html',
    titleKey: 'auth.portal.guides.ascendenteTitle',
    descKey: 'auth.portal.guides.ascendenteDesc',
    readKey: 'auth.portal.guides.ascendenteRead',
    accent: '#C4B5FD',
  },
  {
    id: 'signos',
    href: '/guia/signos-zodiaco.html',
    titleKey: 'auth.portal.guides.signosTitle',
    descKey: 'auth.portal.guides.signosDesc',
    readKey: 'auth.portal.guides.signosRead',
    accent: '#93C5FD',
  },
  {
    id: 'tarot',
    href: '/guia/tarot-guia.html',
    titleKey: 'auth.portal.guides.tarotTitle',
    descKey: 'auth.portal.guides.tarotDesc',
    readKey: 'auth.portal.guides.tarotRead',
    accent: '#34D399',
  },
]

export function LandingGuides() {
  const { t, lang } = useLanguage()

  return (
    <section id="guias" className="landing-guides landing-guides--featured" aria-label={t('auth.portal.guides.ariaLabel')} key={lang}>
      <div className="landing-guides-header">
        <p className="landing-guides-eyebrow">
          <BookOpen size={14} strokeWidth={2} aria-hidden="true" />
          <span>{t('auth.portal.guides.eyebrow')}</span>
        </p>
        <h2 className="landing-guides-title">{t('auth.portal.guides.title')}</h2>
        <p className="landing-guides-lead">{t('auth.portal.guides.lead')}</p>
      </div>

      <div className="landing-guides-grid landing-guides-grid--featured">
        {GUIDES.map((guide) => (
          <a
            key={guide.id}
            href={lang === 'pt' ? guide.href : `${guide.href}?lang=${lang}`}
            className="landing-guide-card landing-guide-card--with-art landing-glass"
            style={{ '--guide-accent': guide.accent }}
          >
            <LandingGuideArt id={guide.id} accent={guide.accent} />
            <div className="landing-guide-body">
              <h3 className="landing-guide-card-title">{t(guide.titleKey)}</h3>
              <p className="landing-guide-card-desc">{t(guide.descKey)}</p>
              <div className="landing-guide-meta">
                <span className="landing-guide-read">{t(guide.readKey)}</span>
                <span className="landing-guide-link">{t('auth.portal.guides.readMore')}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
