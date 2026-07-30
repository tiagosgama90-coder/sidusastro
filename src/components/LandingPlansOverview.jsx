import { Crown } from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { useGeoCountry } from '../hooks/useGeoCountry.js'
import { LandingPremiumCompare } from './LandingPremiumCompare.jsx'
import { PremiumPricingNote } from './PremiumPricingNote.jsx'
import { getPremiumPriceLabels } from '../lib/premiumPricingLabels.js'
import { getMapaPremiumSections } from '../lib/mapaPremiumSections.js'

const MANDALA_SRC = '/brand/sidus-natal-guide-wheels.png?v=1'
const HIGHLIGHT_KEYS = ['mandalaTitle', 'positions', 'aspects', 'lifeSpheres']

export function LandingPlansOverview({ onCta }) {
  const { t } = useLanguage()
  const { isBrasil } = useGeoCountry()
  const prices = getPremiumPriceLabels(isBrasil)
  const sections = getMapaPremiumSections(t)
  const highlights = sections.filter((s) => HIGHLIGHT_KEYS.includes(s.key))

  return (
    <section
      id="comparar-planos"
      className="landing-plans-overview landing-glass"
      aria-label={t('landing.plansOverview.ariaLabel')}
    >
      <header className="landing-plans-overview__head">
        <p className="landing-plans-overview__eyebrow">{t('landing.plansOverview.eyebrow')}</p>
        <h2 className="landing-plans-overview__title">{t('landing.plansOverview.title')}</h2>
        <p className="landing-plans-overview__lead">{t('landing.plansOverview.lead')}</p>
      </header>

      <div className="landing-plans-overview__bundle">
        <div className="landing-plans-overview__visual">
          <img
            src={MANDALA_SRC}
            alt={t('mapa.mandalaTitle')}
            className="landing-plans-overview__mandala"
            width={200}
            height={200}
            loading="lazy"
            decoding="async"
          />
          <ul className="landing-plans-overview__highlights">
            {highlights.map((sec) => (
              <li key={sec.key}>
                <Crown size={12} aria-hidden />
                <span>{sec.title}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="landing-plans-overview__compare">
          <PremiumPricingNote compact />
          <LandingPremiumCompare maxRows={4} showNote={false} />
        </div>
      </div>

      <button
        type="button"
        className="landing-plans-overview__cta"
        onClick={onCta}
        aria-label={t('landing.simplePremium.ctaAria')}
      >
        {t('landing.simplePremium.cta', { price: prices.dualShort })}
      </button>
      <p className="landing-plans-overview__footnote">{t('premium.plans.sonhosNote')}</p>
    </section>
  )
}
