import { Sparkles } from 'lucide-react'
import { useGeoCountry } from '../hooks/useGeoCountry.js'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { formatPrecoCompleto, PRECO_PREMIUM_BR_PIX_BRL } from '../lib/pricing.js'

export function BannerBrasil({ variant = 'default' }) {
  const { isBrasil, loaded } = useGeoCountry()
  const { t } = useLanguage()

  if (!loaded || !isBrasil) return null

  const precoPix = formatPrecoCompleto(PRECO_PREMIUM_BR_PIX_BRL, 'brl')

  return (
    <div className={`banner-brasil${variant === 'paywall' ? ' banner-brasil--paywall' : ''}`} role="note" aria-label={t('brasil.bannerAria')}>
      <Sparkles size={16} color="#34D399" />
      <span>{variant === 'paywall' ? t('brasil.paywallBanner', { preco: precoPix }) : t('brasil.banner', { preco: precoPix })}</span>
    </div>
  )
}
