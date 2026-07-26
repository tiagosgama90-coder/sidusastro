import { forwardRef } from 'react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { useGeoCountry } from '../hooks/useGeoCountry.js'
import { precoPremiumVitrine, formatPrecoCompleto } from '../lib/pricing.js'
import { SidusLogo } from './SidusLogo.jsx'

export const LandingPortalHero = forwardRef(function LandingPortalHero(_props, ref) {
  const { t } = useLanguage()
  const { isBrasil, loaded } = useGeoCountry()
  const precoVitrine = precoPremiumVitrine(isBrasil && loaded)
  const preco = formatPrecoCompleto(precoVitrine.valor, precoVitrine.currency)

  return (
    <header ref={ref} className="landing-auth-hero landing-auth-hero--mystic">
      <div className="landing-auth-hero__glow" aria-hidden />
      <p className="landing-portal-welcome-mystic">{t('auth.portal.eyebrow')}</p>
      <div className="landing-portal-logo-showcase notranslate" translate="no">
        <SidusLogo variant="stacked" markSize={104} glow />
      </div>
      <h1 className="landing-portal-title landing-portal-title--mystic">{t('auth.portal.title')}</h1>
      <p className="landing-trust-bar">
        {isBrasil && loaded
          ? t('auth.portal.trustBarBr', { preco })
          : t('auth.portal.trustBar')}
      </p>
      {isBrasil && loaded ? (
        <p className="landing-trust-bar-note">{t('auth.portal.trustBarPixNote')}</p>
      ) : null}
    </header>
  )
})
