import { getStripe, siteOrigin } from './_shared/stripe.mjs'

const METODOS_RECORRENTES = new Set(['card', 'paypal', 'link'])

function resolverMetodoPagamento(raw) {
  const key = String(raw || 'card').trim().toLowerCase().replace(/-/g, '_')
  const validos = ['card', 'mb_way', 'multibanco', 'paypal', 'pix', 'link']
  return validos.includes(key) ? key : 'card'
}

/** Stripe Checkout: Link exige card na mesma sessão. */
function tiposPagamentoCheckout(metodo) {
  if (metodo === 'link') return ['link', 'card']
  return [metodo]
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const RETURN_PATH = { premium: '/mapaastral', mapa: '/mapaastral', tarot: '/tarot' }
const CANCEL_PATH = { premium: '/vip', mapa: '/mapaastral', tarot: '/tarot' }

export default async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const { valor, descricao, userId, userEmail, productType: productTypeRaw, paymentMethod } = body

    if (!valor || !descricao || !userId) {
      return new Response(JSON.stringify({ error: 'Parâmetros em falta' }), { status: 400, headers: corsHeaders })
    }

    const stripe = getStripe()
    const origin = siteOrigin(req)
    const v = Number(valor)
    const productType = productTypeRaw
      || (v >= 9.99 || /vip|premium|subscri/i.test(descricao || '') ? 'premium'
        : v >= 10 || /mapa.*completo|natal chart/i.test(descricao || '') ? 'mapa'
          : 'tarot')
    const isPremium = productType === 'premium'
    const metodo = resolverMetodoPagamento(paymentMethod)

    // VIP: cartão/PayPal/Link = subscrição mensal; MB Way/Multibanco/PIX = 1 mês pré-pago
    const subscricaoRecorrente = isPremium && METODOS_RECORRENTES.has(metodo)
    const billingType = isPremium
      ? (subscricaoRecorrente ? 'recurring' : 'prepaid_month')
      : 'one_time'

    const metadata = {
      userId: String(userId),
      productType,
      billingType,
      descricao: String(descricao).slice(0, 500),
      paymentMethod: metodo,
    }

    const returnPath = RETURN_PATH[productType] || '/tarot'
    const cancelPath = CANCEL_PATH[productType] || '/tarot'

    const nomeProduto = billingType === 'prepaid_month'
      ? 'Sidus VIP - 1 mês'
      : descricao

    const sessionParams = {
      mode: subscricaoRecorrente ? 'subscription' : 'payment',
      customer_email: userEmail || undefined,
      client_reference_id: String(userId),
      metadata,
      locale: 'pt',
      success_url: `${origin}${returnPath}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}${cancelPath}?payment=cancelled`,
      line_items: [{
        quantity: 1,
        price_data: {
          currency: 'eur',
          product_data: { name: nomeProduto },
          unit_amount: Math.round(v * 100),
          ...(subscricaoRecorrente ? { recurring: { interval: 'month' } } : {}),
        },
      }],
      payment_method_types: tiposPagamentoCheckout(metodo),
    }

    if (subscricaoRecorrente) {
      sessionParams.subscription_data = { metadata }
    } else {
      sessionParams.payment_intent_data = { metadata }
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    return new Response(JSON.stringify({ url: session.url, sessionId: session.id }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error('[create-checkout-session]', e?.message)
    return new Response(JSON.stringify({ error: e?.message || 'Erro ao criar sessão' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
}

export const config = { path: '/api/create-checkout-session' }
