/** Métodos activos no Dashboard Stripe - todos disponíveis em qualquer compra. */
export const METODOS_PAGAMENTO = [
  { stripeType: 'card', i18nKey: 'card', icone: '💳', recorrente: false },
  { stripeType: 'mb_way', i18nKey: 'mbway', icone: '📱', recorrente: false },
  { stripeType: 'multibanco', i18nKey: 'multibanco', icone: '🏧', recorrente: false },
  { stripeType: 'paypal', i18nKey: 'paypal', icone: '🅿️', recorrente: false },
  { stripeType: 'pix', i18nKey: 'pix', icone: '💚', recorrente: false },
  { stripeType: 'link', i18nKey: 'link', icone: '🔗', recorrente: false },
]

const STRIPE_TYPES = new Set(METODOS_PAGAMENTO.map((m) => m.stripeType))

const METODOS_APENAS_PT = new Set(['mb_way', 'multibanco'])

export function metodosParaProduto(country = '') {
  if (String(country).toUpperCase() === 'BR') {
    return METODOS_PAGAMENTO.filter((m) => !METODOS_APENAS_PT.has(m.stripeType))
  }
  return METODOS_PAGAMENTO
}

export function metodoPadraoParaPais(country = '') {
  const c = String(country).toUpperCase()
  if (c === 'BR') return 'pix'
  return 'card'
}

export function metodoUsaSubscricaoRecorrente() {
  return false
}

export function normalizarMetodoStripe(raw) {
  const key = String(raw || 'card').trim().toLowerCase().replace(/-/g, '_')
  return STRIPE_TYPES.has(key) ? key : 'card'
}
