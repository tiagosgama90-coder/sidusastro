import { forwardRef } from 'react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { useGeoCountry } from '../hooks/useGeoCountry.js'
import { precoPremiumVitrine, formatPrecoCompleto } from '../lib/pricing.js'
import { SidusLogoMark } from './SidusLogoMark.jsx'

export const LandingPortalHero = forwardRef(function LandingPortalHero(_props, ref) {
  const { t } = useLanguage()
  const { isBrasil, loaded } = useGeoCountry()
  const precoVitrine = precoPremiumVitrine(isBrasil && loaded)
  const preco = formatPrecoCompleto(precoVitrine.valor, precoVitrine.currency)

  return (
    <header ref={ref} className="landing-auth-hero">
      <div className="landing-portal-brand-row">
        <span className="landing-portal-welcome-inline">{t('auth.portal.eyebrow')}</span>
        <SidusLogoMark size={26} className="landing-portal-brand-mark" />
        <span className="landing-portal-brand-text notranslate" translate="no">SIDUS</span>
      </div>
      <h1 className="landing-portal-title">{t('auth.portal.title')}</h1>
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
