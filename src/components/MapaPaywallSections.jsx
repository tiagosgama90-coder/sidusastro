import { Crown } from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { getMapaPremiumSections } from '../lib/mapaPremiumSections.js'

const MANDALA_SRC = '/brand/sidus-natal-guide-wheels.png?v=1'

/** Paywall inline do mapa: mandala + lista de secções Premium. */
export function MapaPaywallSections() {
  const { t } = useLanguage()
  const sections = getMapaPremiumSections(t)

  return (
    <div className="mapa-paywall-sections">
      <div className="mapa-paywall-mandala">
        <img
          src={MANDALA_SRC}
          alt={t('mapa.mandalaTitle')}
          className="mapa-paywall-mandala__img"
          width={200}
          height={200}
          loading="lazy"
          decoding="async"
        />
        <div className="mapa-paywall-mandala__text">
          <div className="mapa-paywall-section-title">
            <Crown size={14} aria-hidden />
            {t('mapa.mandalaTitle')}
          </div>
          <p className="mapa-paywall-mandala__desc">{t('mapa.mandalaSubtitleShort')}</p>
        </div>
      </div>
      <ul className="mapa-paywall-sections__list">
        {sections.map((sec) => (
          <li key={sec.key} className="mapa-paywall-sections__item">
            <span className="mapa-paywall-section-title">{sec.title}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
