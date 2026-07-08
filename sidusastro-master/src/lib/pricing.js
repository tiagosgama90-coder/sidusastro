/** Preços Sidus (EUR) - fonte única para UI e Stripe. */
export const PRECO_TAROT = 2
export const PRECO_MAPA_COMPLETO = 10
/** VIP: pagamento único, acesso permanente */
export const PRECO_PREMIUM_UNICO = 9.99
export const PRECO_PREMIUM_MENSAL = PRECO_PREMIUM_UNICO

export function inferProductType(valor, descricao, explicit) {
  if (explicit) return explicit
  const v = Number(valor)
  if (v >= PRECO_PREMIUM_MENSAL - 0.01 || /vip|premium|subscri/i.test(descricao || '')) return 'premium'
  if (v >= PRECO_MAPA_COMPLETO - 0.01 || /mapa.*completo|natal chart/i.test(descricao || '')) return 'mapa'
  return 'tarot'
}
