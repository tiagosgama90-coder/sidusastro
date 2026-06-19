import { getStripe, siteOrigin } from './_shared/stripe.mjs'

const METODOS_STRIPE = {
  card: { subscription: true },
  mb_way: { subscription: false },
  multibanco: { subscription: false },
  paypal: { subscription: true },
  pix: { subscription: false },
  link: { subscription: true },
}

function resolverMetodoPagamento(raw, isSubscription) {
  const key = String(raw || 'card').trim().toLowerCase().replace(/-/g, '_')
  const config = METODOS_STRIPE[key]
  if (!config) return 'card'
  if (isSubscription && !config.subscription) {
    throw new Error('methodNotSubscription')
  }
  return key
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
    const isSubscription = productType === 'premium'

    const metadata = {
      userId: String(userId),
      productType,
      descricao: String(descricao).slice(0, 500),
    }

    const returnPath = RETURN_PATH[productType] || '/tarot'
    const cancelPath = CANCEL_PATH[productType] || '/tarot'

    const metodo = resolverMetodoPagamento(paymentMethod, isSubscription)

    const sessionParams = {
      mode: isSubscription ? 'subscription' : 'payment',
      customer_email: userEmail || undefined,
      client_reference_id: String(userId),
      metadata: { ...metadata, paymentMethod: metodo },
      locale: 'pt',
      success_url: `${origin}${returnPath}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}${cancelPath}?payment=cancelled`,
      line_items: [{
        quantity: 1,
        price_data: {
          currency: 'eur',
          product_data: { name: descricao },
          unit_amount: Math.round(v * 100),
          ...(isSubscription ? { recurring: { interval: 'month' } } : {}),
        },
      }],
      payment_method_types: [metodo],
    }

    if (isSubscription) {
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
    const status = e?.message === 'methodNotSubscription' ? 400 : 500
    return new Response(JSON.stringify({ error: e?.message || 'Erro ao criar sessão' }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
}

export const config = { path: '/api/create-checkout-session' }
