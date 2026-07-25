import { Crown, ArrowRight, Sparkles } from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { PremiumComparacao } from './PremiumComparacao.jsx'
import { precoPremiumVitrine, formatPrecoCompleto } from '../lib/pricing.js'

export function PremiumHomeTeaser({
  isPremium,
  onUpgrade,
  oracleUsadas = 0,
  tarotUsadas = 0,
  isBrasil = false,
}) {
  const { t } = useLanguage()

  if (isPremium) return null

  const precoVitrine = precoPremiumVitrine(isBrasil)
  const preco = formatPrecoCompleto(precoVitrine.valor, precoVitrine.currency)

  return (
    <section className="premium-home-teaser landing-glass" aria-label={t('premium.homeTeaser.ariaLabel')}>
      <div className="premium-home-teaser-top">
        <div className="premium-home-teaser-icon" aria-hidden="true">
          <Crown size={22} color="#DFB76C" />
        </div>
        <div className="premium-home-teaser-copy">
          <h2 className="premium-home-teaser-title">{t('premium.homeTeaser.title')}</h2>
          <p className="premium-home-teaser-lead">{t('premium.homeTeaser.lead')}</p>
        </div>
      </div>

      <PremiumComparacao
        compact
        isPremium={false}
        oracleUsadas={oracleUsadas}
        tarotUsadas={tarotUsadas}
        isBrasil={isBrasil}
      />

      <button type="button" className="premium-home-teaser-cta" onClick={onUpgrade}>
        <Sparkles size={16} />
        <span>{t(isBrasil ? 'premium.homeTeaser.ctaBr' : 'premium.homeTeaser.cta', { price: preco })}</span>
        <ArrowRight size={16} />
      </button>
    </section>
  )
}
