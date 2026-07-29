import { Crown } from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { useGeoCountry } from '../hooks/useGeoCountry.js'
import { PRECO_PREMIUM_BR_PIX_BRL, PRECO_PREMIUM_UNICO, formatPrecoEuro, precoPremiumVitrine } from '../lib/pricing.js'

export function LandingSimplePremium({ onCta }) {
  const { t } = useLanguage()
  const { isBrasil } = useGeoCountry()
  const precoVitrine = precoPremiumVitrine(isBrasil)
  const priceLabel = isBrasil
    ? `R$ ${PRECO_PREMIUM_BR_PIX_BRL}`
    : `${formatPrecoEuro(precoVitrine.valor)} €`

  return (
    <div className="landing-simple-premium landing-glass" aria-label={t('landing.simplePremium.ariaLabel')}>
      <h3 className="landing-simple-premium__title">{t('landing.simplePremium.title')}</h3>
      <div className="landing-simple-premium__table-wrap">
        <table className="landing-simple-premium__table">
          <thead>
            <tr>
              <th>{t('landing.simplePremium.freeCol')}</th>
              <th>
                <Crown size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} aria-hidden />
                {t('landing.simplePremium.premiumCol', { price: priceLabel })}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{t('landing.simplePremium.row1Free')}</td>
              <td>{t('landing.simplePremium.row1Premium')}</td>
            </tr>
            <tr>
              <td>{t('landing.simplePremium.row2Free')}</td>
              <td>{t('landing.simplePremium.row2Premium')}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <button
        type="button"
        className="landing-simple-premium__cta"
        onClick={onCta}
        aria-label={t('landing.simplePremium.ctaAria', { price: priceLabel })}
      >
        {t('landing.simplePremium.cta', { price: priceLabel })}
      </button>
      {!isBrasil ? (
        <p className="landing-simple-premium__note">
          {t('landing.simplePremium.priceNote', { price: formatPrecoEuro(PRECO_PREMIUM_UNICO) })}
        </p>
      ) : null}
    </div>
  )
}
