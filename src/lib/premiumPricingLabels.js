import {
  PRECO_PREMIUM_BR_PIX_BRL,
  PRECO_PREMIUM_UNICO,
  formatPrecoCompleto,
  formatPrecoEuro,
  precoPremiumVitrine,
} from './pricing.js'

/** Preços Premium para copy — sempre mostra PIX (BR) e EUR. */
export function getPremiumPriceLabels(isBrasil = false, t = null) {
  const precoBrl = formatPrecoCompleto(PRECO_PREMIUM_BR_PIX_BRL, 'brl')
  const precoEur = formatPrecoCompleto(PRECO_PREMIUM_UNICO, 'eur')
  const precoEurNum = formatPrecoEuro(PRECO_PREMIUM_UNICO)
  const vitrine = precoPremiumVitrine(isBrasil)
  const dualShort = `${precoBrl} · ${precoEur}`
  const dualLine = t
    ? t('premium.pricingDualLine', { precoBrl, precoEur })
    : `${precoBrl} com PIX · ${precoEur} cartão/PayPal`

  return {
    precoBrl,
    precoEur,
    precoEurNum,
    primary: formatPrecoCompleto(vitrine.valor, vitrine.currency),
    dualLine,
    dualShort,
  }
}
