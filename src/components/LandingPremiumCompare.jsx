import { useEffect, useMemo, useRef, useState } from 'react'
import { Crown, Minus } from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { MAX_ORACLE_GRATIS } from '../lib/oracleLimit.js'
import { MAX_LEITURAS_GRATIS } from '../components/Tarot.jsx'
import { getPremiumCompareRows } from '../lib/i18n/premiumBenefits.js'
import { trackLandingCompareView } from '../lib/landingAnalytics.js'

function CellValue({ text, tier }) {
  const raw = String(text ?? '').trim()
  const isEmpty = !raw || raw === '—' || raw === '-'
  if (isEmpty) {
    return (
      <span className={`premium-paywall__empty premium-paywall__empty--${tier}`} aria-hidden>
        <Minus size={14} />
      </span>
    )
  }
  if (tier === 'premium') {
    return (
      <span className="premium-paywall__val premium-paywall__val--premium">
        <span>{raw}</span>
      </span>
    )
  }
  return <span className="premium-paywall__val premium-paywall__val--free">{raw}</span>
}

function rowsDiffer(row) {
  if (row.allPlans) return true
  return String(row.free ?? '').trim() !== String(row.premium ?? '').trim()
}

/** Paywall Grátis vs Premium com toggle interativo. */
export function LandingPremiumCompare({
  className = '',
  maxRows,
  showNote = true,
  interactive = false,
}) {
  const { t } = useLanguage()
  const [view, setView] = useState('diff')
  const trackedRef = useRef(false)

  const rows = getPremiumCompareRows(t, {
    maxTarot: MAX_LEITURAS_GRATIS,
    maxOracle: MAX_ORACLE_GRATIS,
  })

  const visibleRows = useMemo(() => {
    const base = maxRows != null ? rows.slice(0, maxRows) : rows
    if (!interactive || view === 'all') return base
    if (view === 'diff') return base.filter(rowsDiffer)
    return base
  }, [rows, maxRows, interactive, view])

  useEffect(() => {
    if (!interactive || trackedRef.current) return
    trackedRef.current = true
    trackLandingCompareView(view)
  }, [interactive, view])

  const handleView = (next) => {
    setView(next)
    trackLandingCompareView(next)
  }

  const freeLabel = t('premium.table.free')
  const premiumLabel = 'Premium'
  const showFreeCol = !interactive || view === 'all' || view === 'free' || view === 'diff'
  const showPremiumCol = !interactive || view === 'all' || view === 'premium' || view === 'diff'

  return (
    <div className={`premium-paywall${interactive ? ' premium-paywall--interactive' : ''}${className ? ` ${className}` : ''}`}>
      {interactive && (
        <div className="premium-paywall__toggle" role="tablist" aria-label={t('landing.plansOverview.compareToggleAria')}>
          <button
            type="button"
            role="tab"
            aria-selected={view === 'diff'}
            className={`premium-paywall__toggle-btn${view === 'diff' ? ' premium-paywall__toggle-btn--active' : ''}`}
            onClick={() => handleView('diff')}
          >
            {t('landing.plansOverview.compareDiff')}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={view === 'free'}
            className={`premium-paywall__toggle-btn${view === 'free' ? ' premium-paywall__toggle-btn--active' : ''}`}
            onClick={() => handleView('free')}
          >
            {freeLabel}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={view === 'premium'}
            className={`premium-paywall__toggle-btn${view === 'premium' ? ' premium-paywall__toggle-btn--active' : ''}`}
            onClick={() => handleView('premium')}
          >
            {premiumLabel}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={view === 'all'}
            className={`premium-paywall__toggle-btn${view === 'all' ? ' premium-paywall__toggle-btn--active' : ''}`}
            onClick={() => handleView('all')}
          >
            {t('landing.plansOverview.compareAll')}
          </button>
        </div>
      )}

      <div
        className="premium-paywall__header"
        role="row"
        style={{
          gridTemplateColumns: interactive && view !== 'all' && view !== 'diff'
            ? 'minmax(0, 1.2fr) minmax(0, 1fr)'
            : undefined,
        }}
      >
        <span className="premium-paywall__header-feature">{t('premium.table.feature')}</span>
        {showFreeCol && (view !== 'premium' || !interactive) && (
          <span className="premium-paywall__header-plan premium-paywall__header-plan--free">{freeLabel}</span>
        )}
        {showPremiumCol && (view !== 'free' || !interactive) && (
          <span className="premium-paywall__header-plan premium-paywall__header-plan--premium">
            <Crown size={14} aria-hidden />
            {premiumLabel}
          </span>
        )}
      </div>

      <ul className="premium-paywall__rows">
        {visibleRows.map((row) => (
          row.allPlans ? (
            <li key={row.feature} className="premium-paywall__row premium-paywall__row--all-plans">
              <span className="premium-paywall__feature">{row.feature}</span>
              <span className="premium-paywall__all-plans">{row.allPlans}</span>
            </li>
          ) : (
            <li
              key={row.feature}
              className={`premium-paywall__row${interactive && view === 'diff' && rowsDiffer(row) ? ' premium-paywall__row--highlight' : ''}`}
              style={{
                gridTemplateColumns: interactive && (view === 'free' || view === 'premium')
                  ? 'minmax(0, 1.2fr) minmax(0, 1fr)'
                  : undefined,
              }}
            >
              <span className="premium-paywall__feature">{row.feature}</span>
              {showFreeCol && (view !== 'premium' || !interactive) && (
                <CellValue text={row.free} tier="free" />
              )}
              {showPremiumCol && (view !== 'free' || !interactive) && (
                <CellValue text={row.premium} tier="premium" />
              )}
            </li>
          )
        ))}
      </ul>

      {showNote && !interactive && (
        <p className="premium-paywall__note">{t('premium.plans.sonhosNote')}</p>
      )}
    </div>
  )
}
