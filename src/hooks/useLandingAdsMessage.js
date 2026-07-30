import { useMemo } from 'react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import {
  getLandingAdsCopy,
  isFromGoogleAds,
} from '../lib/landingAdsContext.js'

export function useLandingAdsMessage() {
  const { t } = useLanguage()

  return useMemo(() => {
    const fromAds = isFromGoogleAds()
    if (!fromAds) {
      return {
        fromAds: false,
        title: t('auth.portal.conversionTitle'),
        benefit: t('auth.portal.conversionBenefit'),
        eyebrow: t('auth.portal.conversionEyebrow'),
        cta: null,
      }
    }
    const copy = getLandingAdsCopy(t)
    return {
      fromAds: true,
      title: copy.title,
      benefit: copy.benefit,
      eyebrow: t('auth.portal.adsCopy.eyebrow'),
      cta: copy.cta,
    }
  }, [t])
}
