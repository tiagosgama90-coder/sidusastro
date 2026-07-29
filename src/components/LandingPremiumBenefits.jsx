import { Crown, Check, Sparkles, Map, MessageCircle } from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { useGeoCountry } from '../hooks/useGeoCountry.js'
import { getBeneficiosVip } from '../lib/i18n/ferramentasData.js'
import { PremiumComparacao } from './PremiumComparacao.jsx'
import { precoPremiumVitrine, formatPrecoEuro, PRECO_PREMIUM_BR_PIX_BRL } from '../lib/pricing.js'

export function LandingPremiumBenefits({ onScrollToAuth }) {
  const { t, lang } = useLanguage()
  const { isBrasil } = useGeoCountry()
  const beneficios = getBeneficiosVip(lang)
  const precoEur = formatPrecoEuro(precoPremiumVitrine(isBrasil))
  const priceLabel = isBrasil
    ? t('landingPremium.pricePix', { reais: PRECO_PREMIUM_BR_PIX_BRL, eur: precoEur })
    : t('landingPremium.priceEur', { price: precoEur })

  const scrollToAuth = () => {
    if (onScrollToAuth) {
      onScrollToAuth()
      return
    }
    document.getElementById('landing-auth-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section id="vantagens-premium" className="landing-premium-benefits" aria-label={t('landingPremium.ariaLabel')}>
      <div className="landing-premium-benefits__header">
        <p className="landing-premium-benefits__eyebrow">{t('landingPremium.eyebrow')}</p>
        <h2 className="landing-premium-benefits__title">{t('landingPremium.title')}</h2>
        <p className="landing-premium-benefits__lead">{t('landingPremium.lead')}</p>
        <div className="landing-premium-benefits__price-box landing-glass">
          <div className="landing-premium-benefits__price-main">{priceLabel}</div>
          <p className="landing-premium-benefits__price-note">{t('landingPremium.priceNote')}</p>
          {isBrasil ? (
            <p className="landing-premium-benefits__price-pix">{t('landingPremium.pixAdvantage')}</p>
          ) : null}
        </div>
      </div>

      <div className="landing-premium-benefits__focus-grid">
        <article className="landing-premium-benefits__focus-card landing-glass">
          <Map size={22} color="#DFB76C" aria-hidden />
          <h3>{t('landingPremium.focusMapaTitle')}</h3>
          <p>{t('landingPremium.focusMapaDesc')}</p>
        </article>
        <article className="landing-premium-benefits__focus-card landing-glass landing-premium-benefits__focus-card--oracle">
          <MessageCircle size={22} color="#34D399" aria-hidden />
          <h3>{t('landingPremium.focusOraculoTitle')}</h3>
          <p>{t('landingPremium.focusOraculoDesc')}</p>
        </article>
      </div>

      <div className="landing-premium-benefits__signup landing-glass">
        <Sparkles size={18} color="#DFB76C" aria-hidden />
        <div>
          <h3 className="landing-premium-benefits__signup-title">{t('landingPremium.freeSignupTitle')}</h3>
          <ul className="landing-premium-benefits__signup-list">
            <li>{t('landingPremium.freeSignup1')}</li>
            <li>{t('landingPremium.freeSignup2')}</li>
            <li>{t('landingPremium.freeSignup3')}</li>
            <li>{t('landingPremium.freeSignup4')}</li>
          </ul>
        </div>
      </div>

      <h3 className="landing-premium-benefits__table-title">{t('landingPremium.tableTitle')}</h3>
      <PremiumComparacao isBrasil={isBrasil} showFullTable />

      <div className="landing-premium-benefits__list landing-glass">
        <h3 className="landing-premium-benefits__list-title">
          <Crown size={18} color="#DFB76C" aria-hidden />
          {t('landingPremium.allBenefitsTitle')}
        </h3>
        <ul>
          {beneficios.map((b) => (
            <li key={b}>
              <Check size={14} color="#DFB76C" aria-hidden />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      <button type="button" className="landing-premium-benefits__cta" onClick={scrollToAuth}>
        {t('landingPremium.cta', { price: isBrasil ? `R$ ${PRECO_PREMIUM_BR_PIX_BRL}` : `${precoEur} €` })}
      </button>
    </section>
  )
}

export function LandingPremiumJumpButton() {
  const { t } = useLanguage()
  const { isBrasil } = useGeoCountry()
  const priceShort = isBrasil
    ? `R$ ${PRECO_PREMIUM_BR_PIX_BRL}`
    : `${formatPrecoEuro(precoPremiumVitrine(false))} €`

  return (
    <a href="#vantagens-premium" className="landing-premium-jump-btn">
      {t('landingPremium.jumpCta', { price: priceShort })}
    </a>
  )
}
