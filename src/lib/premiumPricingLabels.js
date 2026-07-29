import {
  PRECO_PREMIUM_BR_PIX_BRL,
  PRECO_PREMIUM_UNICO,
  formatPrecoCompleto,
  formatPrecoEuro,
  precoPremiumVitrine,
} from './pricing.js'

/** Preços Premium para copy — sempre mostra PIX (BR) e EUR. */
export function getPremiumPriceLabels(isBrasil = false) {
  const precoBrl = formatPrecoCompleto(PRECO_PREMIUM_BR_PIX_BRL, 'brl')
  const precoEur = formatPrecoCompleto(PRECO_PREMIUM_UNICO, 'eur')
  const precoEurNum = formatPrecoEuro(PRECO_PREMIUM_UNICO)
  const vitrine = precoPremiumVitrine(isBrasil)

  return {
    precoBrl,
    precoEur,
    precoEurNum,
    primary: formatPrecoCompleto(vitrine.valor, vitrine.currency),
    dualLine: `${precoBrl} com PIX · ${precoEur} cartão/PayPal`,
    dualShort: `${precoBrl} · ${precoEur}`,
    ctaRegister: isBrasil
      ? `Criar conta e desbloquear — ${precoBrl} PIX · ${precoEur}`
      : `Criar conta e desbloquear — ${precoEur} · ${precoBrl} PIX`,
  }
}
