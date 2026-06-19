/** Métodos de pagamento Stripe — espelham opções activas no Dashboard Stripe. */
export const METODOS_PAGAMENTO = [
  { stripeType: 'card', i18nKey: 'card', subscription: true, icone: '💳' },
  { stripeType: 'mb_way', i18nKey: 'mbway', subscription: false, icone: '📱' },
  { stripeType: 'multibanco', i18nKey: 'multibanco', subscription: false, icone: '🏧' },
  { stripeType: 'paypal', i18nKey: 'paypal', subscription: true, icone: '🅿️' },
  { stripeType: 'pix', i18nKey: 'pix', subscription: false, icone: '💚' },
  { stripeType: 'link', i18nKey: 'link', subscription: true, icone: '🔗' },
]

const STRIPE_TYPES = new Set(METODOS_PAGAMENTO.map((m) => m.stripeType))

export function metodosParaProduto(isSubscription) {
  return METODOS_PAGAMENTO.filter((m) => !isSubscription || m.subscription)
}

export function normalizarMetodoStripe(raw) {
  const key = String(raw || 'card').trim().toLowerCase().replace(/-/g, '_')
  return STRIPE_TYPES.has(key) ? key : 'card'
}

export function metodoPermiteSubscricao(stripeType) {
  const m = METODOS_PAGAMENTO.find((x) => x.stripeType === stripeType)
  return m?.subscription === true
}
