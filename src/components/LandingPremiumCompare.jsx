import { Crown } from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { MAX_ORACLE_GRATIS } from '../lib/oracleLimit.js'
import { MAX_LEITURAS_GRATIS } from '../components/Tarot.jsx'
import { getPremiumCompareRows } from '../lib/i18n/premiumBenefits.js'

/** Tabela horizontal Grátis vs Premium — landing e paywalls compactos. */
export function LandingPremiumCompare({ className = '' }) {
  const { t } = useLanguage()
  const rows = getPremiumCompareRows(t, {
    maxTarot: MAX_LEITURAS_GRATIS,
    maxOracle: MAX_ORACLE_GRATIS,
  })

  return (
    <div className={`landing-compare${className ? ` ${className}` : ''}`}>
      <div className="landing-compare__scroll">
        <table className="landing-compare__table">
          <thead>
            <tr>
              <th scope="col" className="landing-compare__col-feature">{t('premium.table.feature')}</th>
              <th scope="col" className="landing-compare__col-free">{t('premium.table.free')}</th>
              <th scope="col" className="landing-compare__col-premium">
                <Crown size={13} aria-hidden />
                Premium
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.feature}>
                <th scope="row" className="landing-compare__feature">{row.feature}</th>
                <td className="landing-compare__free">{row.free}</td>
                <td className="landing-compare__premium">{row.premium}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="landing-compare__note">{t('premium.plans.sonhosNote')}</p>
    </div>
  )
}
