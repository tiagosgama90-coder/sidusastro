/** Preços Sidus — EUR (internacional) e BRL (PIX Brasil). */
export const PRECO_TAROT = 2
export const PRECO_MAPA_COMPLETO = 10
export const PRECO_PREMIUM_UNICO = 9.99
export const PRECO_PREMIUM_MENSAL = PRECO_PREMIUM_UNICO

/** Taxa fixa da oferta PIX Brasil (5 € VIP → R$ 28). */
export const PIX_BR_EUR_TO_BRL = 5.6

/** Referência comercial em EUR (só para documentar a oferta PIX). */
export const PRECO_PREMIUM_BR_PIX_EUR_REF = 5
export const PRECO_TAROT_BR_PIX_EUR_REF = 1

/** VIP Brasil via PIX — cobrado em reais (equivalente a ~5 €). */
export const PRECO_PREMIUM_BR_PIX_BRL = 28
/** Leitura Tarot Brasil via PIX — cobrado em reais (equivalente a ~1 €). */
export const PRECO_TAROT_BR_PIX_BRL = 6

export function formatPrecoEuro(valor) {
  return Number(valor).toFixed(2).replace('.', ',')
}

export function formatPrecoReais(valor) {
  return Number(valor).toFixed(2).replace('.', ',')
}

export function formatPrecoCompleto(valor, currency = 'eur') {
  if (currency === 'brl') return `R$ ${formatPrecoReais(valor)}`
  return `${formatPrecoEuro(valor)} €`
}

export function isPixBrasil(paymentMethod, isBrasil = false) {
  return isBrasil && paymentMethod === 'pix'
}

/** @returns {{ valor: number, currency: 'eur' | 'brl' }} */
export function precoPremiumEfetivo(paymentMethod, isBrasil = false) {
  if (isPixBrasil(paymentMethod, isBrasil)) {
    return { valor: PRECO_PREMIUM_BR_PIX_BRL, currency: 'brl' }
  }
  return { valor: PRECO_PREMIUM_UNICO, currency: 'eur' }
}

/** @returns {{ valor: number, currency: 'eur' | 'brl' }} */
export function precoTarotEfetivo(paymentMethod, isBrasil = false) {
  if (isPixBrasil(paymentMethod, isBrasil)) {
    return { valor: PRECO_TAROT_BR_PIX_BRL, currency: 'brl' }
  }
  return { valor: PRECO_TAROT, currency: 'eur' }
}

/** Preço em destaque no paywall (Brasil = PIX em reais). */
export function precoPremiumVitrine(isBrasil) {
  if (isBrasil) return { valor: PRECO_PREMIUM_BR_PIX_BRL, currency: 'brl' }
  return { valor: PRECO_PREMIUM_UNICO, currency: 'eur' }
}

export function precoTarotVitrine(isBrasil) {
  if (isBrasil) return { valor: PRECO_TAROT_BR_PIX_BRL, currency: 'brl' }
  return { valor: PRECO_TAROT, currency: 'eur' }
}

export function inferProductType(valor, descricao, explicit, currency = 'eur') {
  if (explicit) return explicit
  const v = Number(valor)
  if (currency === 'brl') {
    if (v >= PRECO_PREMIUM_BR_PIX_BRL - 0.01 || /vip|premium|subscri/i.test(descricao || '')) return 'premium'
    return 'tarot'
  }
  if (v >= PRECO_PREMIUM_MENSAL - 0.01 || /vip|premium|subscri/i.test(descricao || '')) return 'premium'
  if (v >= PRECO_MAPA_COMPLETO - 0.01 || /mapa.*completo|natal chart/i.test(descricao || '')) return 'mapa'
  return 'tarot'
}
