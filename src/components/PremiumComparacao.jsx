import { Crown } from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { MAX_ORACLE_GRATIS } from '../lib/oracleLimit.js'
import { MAX_LEITURAS_GRATIS } from '../components/Tarot.jsx'
import { getPremiumTableRows } from '../lib/i18n/premiumBenefits.js'
import { PremiumPricingNote } from './PremiumPricingNote.jsx'

export function PremiumComparacao({
  isPremium,
  oracleUsadas = 0,
  tarotUsadas = 0,
  isBrasil = false,
  compact = false,
  showFullTable = false,
  showPricingNote = true,
}) {
  const { t } = useLanguage()
  const oracleRestantes = Math.max(0, MAX_ORACLE_GRATIS - oracleUsadas)
  const tarotRestantes = Math.max(0, MAX_LEITURAS_GRATIS - tarotUsadas)

  const rows = getPremiumTableRows(t, {
    maxTarot: MAX_LEITURAS_GRATIS,
    maxOracle: MAX_ORACLE_GRATIS,
  })

  const visibleRows = showFullTable ? rows : rows.slice(0, 5)

  return (
    <div className={`premium-comparacao${compact ? ' premium-comparacao--compact' : ''}`}>
      {showPricingNote && <PremiumPricingNote compact />}

      {!isPremium && (oracleUsadas > 0 || tarotUsadas > 0) && (
        <div className="premium-usage">
          {tarotUsadas > 0 && (
            <span>{t('premium.tarotUsed', { used: tarotUsadas, max: MAX_LEITURAS_GRATIS, left: tarotRestantes })}</span>
          )}
          {oracleUsadas > 0 && (
            <span>{t('premium.oracleUsed', { used: oracleUsadas, max: MAX_ORACLE_GRATIS, left: oracleRestantes })}</span>
          )}
        </div>
      )}

      <div className="premium-table-wrap">
        <table className="premium-table">
          <thead>
            <tr>
              <th>{t('premium.table.feature')}</th>
              <th>{t('premium.table.free')}</th>
              <th><Crown size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />Premium</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => (
              <tr key={row.feature} className={row.highlight ? 'premium-table-row--highlight' : undefined}>
                <td>{row.feature}</td>
                <td className="premium-table-free">{row.free}</td>
                <td className="premium-table-vip">{row.vip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
