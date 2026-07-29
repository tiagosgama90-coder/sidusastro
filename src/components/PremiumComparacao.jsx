import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { MAX_ORACLE_GRATIS } from '../lib/oracleLimit.js'
import { MAX_LEITURAS_GRATIS } from '../components/Tarot.jsx'
import { LandingPremiumCompare } from './LandingPremiumCompare.jsx'
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

      <LandingPremiumCompare
        maxRows={showFullTable ? undefined : 5}
        showNote={false}
      />
    </div>
  )
}
