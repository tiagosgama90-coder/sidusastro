import { Crown } from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { MAX_ORACLE_GRATIS } from '../lib/oracleLimit.js'
import { MAX_LEITURAS_GRATIS } from '../components/Tarot.jsx'
import { getPremiumCompareRows } from '../lib/i18n/premiumBenefits.js'

/** Tabela Grátis vs Premium — cartões no mobile, tabela no desktop. */
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
    <div className={`landing-compare${className ? ` ${className}` : ''}`}>
      <div className="landing-compare__cards" role="list">
        {visibleRows.map((row) => (
          <article key={row.feature} className="landing-compare__card" role="listitem">
            <h3 className="landing-compare__card-feature">{row.feature}</h3>
            <div className="landing-compare__card-row landing-compare__card-row--free">
              <span className="landing-compare__card-label">{freeLabel}</span>
              <span className="landing-compare__card-value">{row.free}</span>
            </div>
            <div className="landing-compare__card-row landing-compare__card-row--premium">
              <span className="landing-compare__card-label">
                <Crown size={12} aria-hidden />
                {premiumLabel}
              </span>
              <span className="landing-compare__card-value">{row.premium}</span>
            </div>
          </article>
        ))}
      </div>

      <div className="landing-compare__scroll">
        <table className="landing-compare__table">
          <thead>
            <tr>
              <th scope="col" className="landing-compare__col-feature">{t('premium.table.feature')}</th>
              <th scope="col" className="landing-compare__col-free">{freeLabel}</th>
              <th scope="col" className="landing-compare__col-premium">
                <Crown size={13} aria-hidden />
                {premiumLabel}
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => (
              <tr key={row.feature}>
                <th scope="row" className="landing-compare__feature">{row.feature}</th>
                <td className="landing-compare__free">{row.free}</td>
                <td className="landing-compare__premium">{row.premium}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showNote && (
        <p className="landing-compare__note">{t('premium.plans.sonhosNote')}</p>
      )}
    </div>
  )
}
