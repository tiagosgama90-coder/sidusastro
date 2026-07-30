import { Loader2 } from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { useGeoCountry } from '../hooks/useGeoCountry.js'
import { getPremiumPriceLabels } from '../lib/premiumPricingLabels.js'

/** Preço Premium formatado para landing — PIX e EUR separados e legíveis. */
export function LandingPremiumPriceCard({ className = '' }) {
  const { t } = useLanguage()
  const { isBrasil } = useGeoCountry()
  const prices = getPremiumPriceLabels(isBrasil, t)

  return (
    <div className={`landing-premium-price${className ? ` ${className}` : ''}`}>
      <p className="landing-premium-price__badge">{t('landing.funnel.priceLifetime')}</p>
      <div className="landing-premium-price__grid">
        <div className="landing-premium-price__option landing-premium-price__option--pix">
          <span className="landing-premium-price__label">{t('landing.funnel.pricePixRegion')}</span>
          <span className="landing-premium-price__amount">{prices.precoBrl}</span>
          <span className="landing-premium-price__method">{t('landing.funnel.pricePixMethod')}</span>
        </div>
        <span className="landing-premium-price__divider" aria-hidden>
          {t('landing.funnel.priceOr')}
        </span>
        <div className="landing-premium-price__option landing-premium-price__option--card">
          <span className="landing-premium-price__label">{t('landing.funnel.priceIntlRegion')}</span>
          <span className="landing-premium-price__amount">{prices.precoEur}</span>
          <span className="landing-premium-price__method">{t('landing.funnel.priceCardMethod')}</span>
        </div>
      </div>
      <p className="landing-premium-price__footnote">{t('landing.funnel.priceSub')}</p>
    </div>
  )
}

/** Botão paywall com título + dois preços em linhas separadas. */
export function LandingPaywallCtaButton({
  className = '',
  onClick,
  ariaLabel,
  disabled = false,
  loading = false,
}) {
  const { t } = useLanguage()
  const prices = getPremiumPriceLabels(false, t)

  return (
    <button
      type="button"
      className={`landing-paywall-cta${className ? ` ${className}` : ''}`}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
    >
      {loading ? (
        <Loader2 size={20} className="landing-paywall-cta__spin" aria-hidden />
      ) : (
        <>
          <span className="landing-paywall-cta__title">{t('landing.funnel.ctaUnlock')}</span>
          <span className="landing-paywall-cta__line">{t('landing.funnel.ctaPixLine', { preco: prices.precoBrl })}</span>
          <span className="landing-paywall-cta__line landing-paywall-cta__line--alt">
            {t('landing.funnel.ctaEurLine', { or: t('landing.funnel.priceOr'), preco: prices.precoEur })}
          </span>
        </>
      )}
    </button>
  )
}
