import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { getMapaPaywallItems } from '../lib/paywallToolBenefits.js'
import { ToolInlinePaywall } from './ToolInlinePaywall.jsx'

/** Paywall inline do mapa — checklist Premium (sem mandala). */
export function MapaPaywallSections({ onUpgrade, ctaLabel, showCta = false }) {
  const { t } = useLanguage()
  const items = getMapaPaywallItems(t)

  return (
    <ToolInlinePaywall
      title={t('mapa.unlockFullChart')}
      lead={t('mapa.fullDesc')}
      items={items}
      ctaLabel={ctaLabel}
      onCta={onUpgrade}
      showCta={showCta}
      className="mapa-paywall-sections"
    />
  )
}
