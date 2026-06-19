/** Métodos activos no Dashboard Stripe — todos disponíveis em qualquer compra. */
export const METODOS_PAGAMENTO = [
  { stripeType: 'card', i18nKey: 'card', icone: '💳', recorrente: true },
  { stripeType: 'mb_way', i18nKey: 'mbway', icone: '📱', recorrente: false },
  { stripeType: 'multibanco', i18nKey: 'multibanco', icone: '🏧', recorrente: false },
  { stripeType: 'paypal', i18nKey: 'paypal', icone: '🅿️', recorrente: true },
  { stripeType: 'pix', i18nKey: 'pix', icone: '💚', recorrente: false },
  { stripeType: 'link', i18nKey: 'link', icone: '🔗', recorrente: true },
]

const STRIPE_TYPES = new Set(METODOS_PAGAMENTO.map((m) => m.stripeType))

export function metodosParaProduto() {
  return METODOS_PAGAMENTO
}

export function metodoUsaSubscricaoRecorrente(stripeType) {
  const m = METODOS_PAGAMENTO.find((x) => x.stripeType === stripeType)
  return m?.recorrente !== false
}

export function normalizarMetodoStripe(raw) {
  const key = String(raw || 'card').trim().toLowerCase().replace(/-/g, '_')
  return STRIPE_TYPES.has(key) ? key : 'card'
}
