import { Crown, Minus } from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { MAX_ORACLE_GRATIS } from '../lib/oracleLimit.js'
import { MAX_LEITURAS_GRATIS } from '../components/Tarot.jsx'
import { getPremiumCompareRows } from '../lib/i18n/premiumBenefits.js'

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

/** Paywall Grátis vs Premium — grelha fixa, sem scroll horizontal. */
export function LandingPremiumCompare({
  className = '',
  maxRows,
  showNote = true,
}) {
  const { t } = useLanguage()
  const rows = getPremiumCompareRows(t, {
    maxTarot: MAX_LEITURAS_GRATIS,
    maxOracle: MAX_ORACLE_GRATIS,
  })
  const visibleRows = maxRows != null ? rows.slice(0, maxRows) : rows
  const freeLabel = t('premium.table.free')
  const premiumLabel = 'Premium'

  return (
    <div className={`premium-paywall${className ? ` ${className}` : ''}`}>
      <div className="premium-paywall__header" role="row">
        <span className="premium-paywall__header-feature">{t('premium.table.feature')}</span>
        <span className="premium-paywall__header-plan premium-paywall__header-plan--free">{freeLabel}</span>
        <span className="premium-paywall__header-plan premium-paywall__header-plan--premium">
          <Crown size={14} aria-hidden />
          {premiumLabel}
        </span>
      </div>

      <ul className="premium-paywall__rows">
        {visibleRows.map((row) => (
          <li key={row.feature} className="premium-paywall__row">
            <span className="premium-paywall__feature">{row.feature}</span>
            <CellValue text={row.free} tier="free" />
            <CellValue text={row.premium} tier="premium" />
          </li>
        ))}
      </ul>

      {showNote && (
        <p className="premium-paywall__note">{t('premium.plans.sonhosNote')}</p>
      )}
    </div>
  )
}
