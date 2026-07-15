/** Preços Sidus (EUR) - fonte única para UI e Stripe. */
export const PRECO_TAROT = 2
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

/** Preço em destaque no paywall (vitrine BR). */
export function precoPremiumVitrine(isBrasil) {
  return isBrasil ? PRECO_PREMIUM_BR_PIX : PRECO_PREMIUM_UNICO
}

export function inferProductType(valor, descricao, explicit) {
  if (explicit) return explicit
  const v = Number(valor)
  if (v >= PRECO_PREMIUM_MENSAL - 0.01 || /vip|premium|subscri/i.test(descricao || '')) return 'premium'
  if (v >= PRECO_MAPA_COMPLETO - 0.01 || /mapa.*completo|natal chart/i.test(descricao || '')) return 'mapa'
  return 'tarot'
}
