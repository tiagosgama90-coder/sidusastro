import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { LandingPremiumCompare } from './LandingPremiumCompare.jsx'
import { LandingPremiumPriceCard, LandingSimpleCtaButton } from './LandingPremiumPriceCard.jsx'

const COMPARE_PREVIEW_ROWS = 4

export function LandingPlansOverview({ onCta, className = '', isDesktop = true }) {
  const { t } = useLanguage()
  const sectionRef = useRef(null)
  const [ctaInView, setCtaInView] = useState(false)
  const [compareExpanded, setCompareExpanded] = useState(false)

  const showCompareTable = isDesktop || compareExpanded
  const comparePreviewRows = isDesktop && !compareExpanded ? COMPARE_PREVIEW_ROWS : undefined

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setCtaInView(true)
      },
      { threshold: 0.35, rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="comparar-planos"
      className={`landing-plans-overview landing-glass${className ? ` ${className}` : ''}`}
      aria-label={t('landing.plansOverview.ariaLabel')}
    >
      <header className="landing-plans-overview__head">
        <p className="landing-plans-overview__eyebrow">{t('landing.plansOverview.eyebrow')}</p>
        <h2 className="landing-plans-overview__title">{t('landing.plansOverview.title')}</h2>
        <p className="landing-plans-overview__lead">{t('landing.plansOverview.lead')}</p>
      </header>

      <LandingPremiumPriceCard className="landing-plans-overview__price" showSocialProof />

      <div className={`landing-plans-overview__paywall${!isDesktop && !compareExpanded ? ' landing-plans-overview__paywall--collapsed' : ''}`}>
        {showCompareTable && (
          <LandingPremiumCompare
            interactive
            maxRows={comparePreviewRows}
          />
        )}
        {!compareExpanded && (
          <button
            type="button"
            className="landing-plans-overview__expand"
            onClick={() => setCompareExpanded(true)}
            aria-expanded={compareExpanded}
          >
            {t('landing.plansOverview.compareExpand')}
            <ChevronDown size={16} aria-hidden />
          </button>
        )}
      </div>

      {onCta && (
        <LandingSimpleCtaButton
          className="landing-plans-overview__cta"
          onClick={onCta}
          ariaLabel={t('landing.plansOverview.ctaAria')}
          pulse={ctaInView}
        />
      )}
    </section>
  )
}
