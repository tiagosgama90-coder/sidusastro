import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { LandingPremiumCompare } from './LandingPremiumCompare.jsx'
import { PremiumPricingNote } from './PremiumPricingNote.jsx'

export function LandingPlansOverview({ onCta }) {
  const { t } = useLanguage()

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

      <div className="landing-plans-overview__paywall">
        <PremiumPricingNote compact />
        <LandingPremiumCompare maxRows={6} showNote={false} />
      </div>

      <button
        type="button"
        className="landing-plans-overview__cta"
        onClick={onCta}
        aria-label={t('landing.simplePremium.ctaAria')}
      >
        {t('auth.register')}
      </button>
    </section>
  )
}
