import { Crown, Check, X } from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { MAX_ORACLE_GRATIS } from '../lib/oracleLimit.js'
import { MAX_LEITURAS_GRATIS } from '../components/Tarot.jsx'

export function PremiumComparacao({ isPremium, oracleUsadas = 0, tarotUsadas = 0, isBrasil = false, compact = false }) {
  const { t } = useLanguage()
  const oracleRestantes = Math.max(0, MAX_ORACLE_GRATIS - oracleUsadas)
  const tarotRestantes = Math.max(0, MAX_LEITURAS_GRATIS - tarotUsadas)

  const rows = [
    { feature: t('premium.table.horoscope'), free: '✓', vip: '✓' },
    { feature: t('premium.table.mapa'), free: t('premium.table.mapaFree'), vip: '✓ PDF' },
    { feature: t('premium.table.tarot'), free: t('premium.table.tarotFree', { n: MAX_LEITURAS_GRATIS }), vip: '∞' },
    { feature: t('premium.table.oracle'), free: t('premium.table.oracleFree', { n: MAX_ORACLE_GRATIS }), vip: '∞' },
    { feature: t('premium.table.sinastria'), free: t('premium.table.preview'), vip: '✓' },
  ]

  return (
    <div className={`premium-comparacao${compact ? ' premium-comparacao--compact' : ''}`}>
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
              <th><Crown size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />VIP</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.feature}>
                <td>{row.feature}</td>
                <td>{row.free}</td>
                <td className="premium-table-vip">{row.vip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isBrasil && (
        <p className="premium-br-note">{t('brasil.premiumNote')}</p>
      )}
    </div>
  )
}

export function PremiumComparacaoIcons() {
  return (
    <span className="premium-icons" aria-hidden="true">
      <Check size={12} color="#34D399" />
      <X size={12} color="rgba(248,113,113,0.7)" />
    </span>
  )
}
