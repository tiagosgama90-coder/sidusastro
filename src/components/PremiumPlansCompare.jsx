import { Check, Crown, Minus } from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { MAX_ORACLE_GRATIS } from '../lib/oracleLimit.js'
import { MAX_LEITURAS_GRATIS } from '../components/Tarot.jsx'
import { getPremiumCompareRows } from '../lib/i18n/premiumBenefits.js'

function CellValue({ value, premium = false }) {
  if (!value || value === '—' || value === '-') {
    return <Minus size={14} className="premium-plans__minus" aria-hidden />
  }
  return (
    <span className={`premium-plans__cell-text${premium ? ' premium-plans__cell-text--premium' : ''}`}>
      {value}
    </span>
  )
}

export function PremiumPlansCompare({ className = '' }) {
  const { t } = useLanguage()
  const rows = getPremiumCompareRows(t, {
    maxTarot: MAX_LEITURAS_GRATIS,
    maxOracle: MAX_ORACLE_GRATIS,
  })

  return (
    <div className={`premium-plans${className ? ` ${className}` : ''}`}>
      <div className="premium-plans__grid" role="table" aria-label={t('landing.simplePremium.ariaLabel')}>
        <div className="premium-plans__card premium-plans__card--free" role="rowgroup">
          <div className="premium-plans__card-head" role="columnheader">
            <p className="premium-plans__plan-label">{t('landing.simplePremium.freeCol')}</p>
            <p className="premium-plans__plan-sub">{t('premium.plans.freeSub')}</p>
          </div>
          <ul className="premium-plans__list">
            {rows.map((row) => (
              <li key={row.feature} className="premium-plans__row" role="row">
                <span className="premium-plans__feature" role="rowheader">{row.feature}</span>
                <span className="premium-plans__value" role="cell">
                  <Check size={14} className="premium-plans__check" aria-hidden />
                  <CellValue value={row.free} />
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="premium-plans__card premium-plans__card--premium" role="rowgroup">
          <div className="premium-plans__card-head premium-plans__card-head--premium" role="columnheader">
            <p className="premium-plans__plan-label">
              <Crown size={16} aria-hidden />
              {t('landing.simplePremium.premiumCol')}
            </p>
            <p className="premium-plans__plan-sub">{t('premium.plans.premiumSub')}</p>
          </div>
          <ul className="premium-plans__list">
            {rows.map((row) => (
              <li key={row.feature} className="premium-plans__row premium-plans__row--premium" role="row">
                <span className="premium-plans__feature" role="rowheader">{row.feature}</span>
                <span className="premium-plans__value" role="cell">
                  <Check size={14} className="premium-plans__check premium-plans__check--premium" aria-hidden />
                  <CellValue value={row.premium} premium />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="premium-plans__footnote">{t('premium.plans.sonhosNote')}</p>
    </div>
  )
}
