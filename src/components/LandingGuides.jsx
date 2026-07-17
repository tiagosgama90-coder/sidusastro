import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { ArrowUpRight, BookOpen } from 'lucide-react'

const GUIDES = [
  {
    id: 'mapa',
    href: '/guia/mapa-astral.html',
    titleKey: 'auth.portal.guides.mapaTitle',
    descKey: 'auth.portal.guides.mapaDesc',
    readKey: 'auth.portal.guides.mapaRead',
    glyph: '☉',
    accent: '#DFB76C',
    visual: 'wheel',
  },
  {
    id: 'ascendente',
    href: '/guia/ascendente.html',
    titleKey: 'auth.portal.guides.ascendenteTitle',
    descKey: 'auth.portal.guides.ascendenteDesc',
    readKey: 'auth.portal.guides.ascendenteRead',
    glyph: '↑',
    accent: '#C4B5FD',
    visual: 'horizon',
  },
  {
    id: 'signos',
    href: '/guia/signos-zodiaco.html',
    titleKey: 'auth.portal.guides.signosTitle',
    descKey: 'auth.portal.guides.signosDesc',
    readKey: 'auth.portal.guides.signosRead',
    glyph: '♈',
    accent: '#F472B6',
    visual: 'zodiac',
  },
  {
    id: 'tarot',
    href: '/guia/tarot-guia.html',
    titleKey: 'auth.portal.guides.tarotTitle',
    descKey: 'auth.portal.guides.tarotDesc',
    readKey: 'auth.portal.guides.tarotRead',
    glyph: '✦',
    accent: '#34D399',
    visual: 'tarot',
  },
]

function GuideVisual({ type, accent }) {
  if (type === 'wheel') {
    const signs = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓']
    return (
      <svg viewBox="0 0 80 80" className="landing-guide-visual-svg" aria-hidden="true">
        <circle cx="40" cy="40" r="36" fill="none" stroke={`${accent}55`} strokeWidth="1" />
        <circle cx="40" cy="40" r="24" fill="none" stroke={`${accent}33`} strokeWidth="0.8" />
        {signs.map((s, i) => {
          const a = ((i * 30 - 90) * Math.PI) / 180
          const x = 40 + Math.cos(a) * 30
          const y = 40 + Math.sin(a) * 30
          return <text key={s} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill={`${accent}cc`} fontSize="7">{s}</text>
        })}
        <text x="40" y="42" textAnchor="middle" fill={accent} fontSize="10" fontWeight="600">☉</text>
      </svg>
    )
  }
  if (type === 'horizon') {
    return (
      <svg viewBox="0 0 80 80" className="landing-guide-visual-svg" aria-hidden="true">
        <defs>
          <linearGradient id="horizonGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={`${accent}44`} />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <rect x="0" y="48" width="80" height="32" fill="url(#horizonGrad)" />
        <line x1="0" y1="48" x2="80" y2="48" stroke={`${accent}88`} strokeWidth="1.2" />
        <path d="M 40 48 L 40 18" stroke={accent} strokeWidth="1.5" strokeDasharray="3 2" />
        <circle cx="40" cy="14" r="6" fill={`${accent}33`} stroke={accent} strokeWidth="1" />
        <text x="40" y="17" textAnchor="middle" fill={accent} fontSize="8" fontWeight="700">ASC</text>
      </svg>
    )
  }
  if (type === 'zodiac') {
    const grid = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓']
    return (
      <div className="landing-guide-zodiac-grid" aria-hidden="true">
        {grid.map((s) => (
          <span key={s} style={{ color: accent }}>{s}</span>
        ))}
      </div>
    )
  }
  return (
    <svg viewBox="0 0 80 80" className="landing-guide-visual-svg" aria-hidden="true">
      <rect x="18" y="12" width="44" height="56" rx="6" fill={`${accent}18`} stroke={`${accent}66`} strokeWidth="1.2" />
      <circle cx="40" cy="36" r="14" fill="none" stroke={accent} strokeWidth="1" />
      <text x="40" y="40" textAnchor="middle" fill={accent} fontSize="14">✦</text>
      <line x1="26" y1="58" x2="54" y2="58" stroke={`${accent}44`} strokeWidth="1" />
      <line x1="30" y1="64" x2="50" y2="64" stroke={`${accent}33`} strokeWidth="1" />
    </svg>
  )
}

export function LandingGuides() {
  const { t, lang } = useLanguage()

  return (
    <section className="landing-guides" aria-label={t('auth.portal.guides.ariaLabel')} key={lang}>
      <div className="landing-guides-header">
        <div className="landing-guides-header-icon" aria-hidden="true">
          <BookOpen size={20} color="#DFB76C" />
        </div>
        <h2 className="landing-guides-title">{t('auth.portal.guides.title')}</h2>
        <p className="landing-guides-lead">{t('auth.portal.guides.lead')}</p>
      </div>

      <div className="landing-guides-grid">
        {GUIDES.map((guide) => (
          <a
            key={guide.id}
            href={guide.href}
            className="landing-guide-card landing-glass"
            style={{ '--guide-accent': guide.accent }}
          >
            <div className="landing-guide-card-top">
              <div className="landing-guide-visual" style={{ '--guide-accent': guide.accent }}>
                <GuideVisual type={guide.visual} accent={guide.accent} />
              </div>
              <span className="landing-guide-glyph" aria-hidden="true">{guide.glyph}</span>
            </div>
            <div className="landing-guide-body">
              <h3 className="landing-guide-card-title">{t(guide.titleKey)}</h3>
              <p className="landing-guide-card-desc">{t(guide.descKey)}</p>
              <span className="landing-guide-meta">
                <span className="landing-guide-read">{t(guide.readKey)}</span>
                <span className="landing-guide-link">
                  {t('auth.portal.guides.readMore')}
                  <ArrowUpRight size={14} />
                </span>
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
