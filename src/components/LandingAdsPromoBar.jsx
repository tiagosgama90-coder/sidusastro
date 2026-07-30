import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { isFromGoogleAds } from '../lib/landingAdsContext.js'

/** Barra fina para tráfego Google Ads (100% mobile na campanha actual). */
export function LandingAdsPromoBar() {
  const { t } = useLanguage()
  if (!isFromGoogleAds()) return null

  return (
    <div className="landing-ads-promo" role="note">
      <span className="landing-ads-promo__dot" aria-hidden />
      <span>{t('auth.portal.adsCopy.promoBar')}</span>
    </div>
  )
}
