import { Sparkles } from 'lucide-react'
import { useGeoCountry } from '../hooks/useGeoCountry.js'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'

export function BannerBrasil({ variant = 'default' }) {
  const { isBrasil, loaded } = useGeoCountry()
  const { t } = useLanguage()

  if (!loaded || !isBrasil) return null

  return (
    <div className={`banner-brasil${variant === 'paywall' ? ' banner-brasil--paywall' : ''}`} role="note" aria-label={t('brasil.bannerAria')}>
      <Sparkles size={16} color="#34D399" />
      <span>{variant === 'paywall' ? t('brasil.paywallBanner') : t('brasil.banner')}</span>
    </div>
  )
}
