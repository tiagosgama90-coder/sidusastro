/** Preços Sidus (EUR) - fonte única para UI e Stripe. */
export const PRECO_TAROT = 2
/** Leitura de Tarot Brasil — exclusivo via PIX. */
export const PRECO_TAROT_BR_PIX = 1
export const PRECO_MAPA_COMPLETO = 10
/** VIP: pagamento único, acesso permanente */
export const PRECO_PREMIUM_UNICO = 9.99
export const PRECO_PREMIUM_MENSAL = PRECO_PREMIUM_UNICO
/** VIP Brasil — exclusivo via PIX (conta bancária BR). */
export const PRECO_PREMIUM_BR_PIX = 5

export function formatPrecoEuro(valor) {
  return Number(valor).toFixed(2).replace('.', ',')
}

/** Preço VIP efectivo conforme método (PIX = oferta BR). */
export function precoPremiumEfetivo(paymentMethod) {
  return paymentMethod === 'pix' ? PRECO_PREMIUM_BR_PIX : PRECO_PREMIUM_UNICO
}

/** Preço Tarot efectivo — BR com PIX = 1 €; restantes = 2 €. */
export function precoTarotEfetivo(paymentMethod, isBrasil = false) {
  if (isBrasil && paymentMethod === 'pix') return PRECO_TAROT_BR_PIX
  return PRECO_TAROT
}

/** Preço em destaque no paywall (vitrine BR mostra PIX). */
export function precoPremiumVitrine(isBrasil) {
  return isBrasil ? PRECO_PREMIUM_BR_PIX : PRECO_PREMIUM_UNICO
}

/** Preço por leitura em destaque (vitrine BR = PIX). */
export function precoTarotVitrine(isBrasil) {
  return isBrasil ? PRECO_TAROT_BR_PIX : PRECO_TAROT
}

export function inferProductType(valor, descricao, explicit) {
  if (explicit) return explicit
  const v = Number(valor)
  if (v >= PRECO_PREMIUM_MENSAL - 0.01 || /vip|premium|subscri/i.test(descricao || '')) return 'premium'
  if (v >= PRECO_MAPA_COMPLETO - 0.01 || /mapa.*completo|natal chart/i.test(descricao || '')) return 'mapa'
  return 'tarot'
}
