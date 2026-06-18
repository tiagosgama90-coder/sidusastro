import { getStripe, siteOrigin } from './_shared/stripe.mjs'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

export default async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const { valor, descricao, userId, userEmail, productType } = body

    if (!valor || !descricao || !userId) {
      return new Response(JSON.stringify({ error: 'Parâmetros em falta' }), { status: 400, headers: corsHeaders })
    }

    const stripe = getStripe()
    const origin = siteOrigin(req)
    const isSubscription = productType === 'premium' || valor >= 4.99

    const metadata = {
      userId: String(userId),
      productType: isSubscription ? 'premium' : 'tarot',
      descricao: String(descricao).slice(0, 500),
    }

    const returnPath = isSubscription ? '/mapaastral' : '/tarot'
    const cancelPath = isSubscription ? '/vip' : '/tarot'

    const sessionParams = {
      mode: isSubscription ? 'subscription' : 'payment',
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
          product_data: { name: descricao },
          unit_amount: Math.round(Number(valor) * 100),
          ...(isSubscription ? { recurring: { interval: 'month' } } : {}),
        },
      }],
    }

    if (isSubscription) {
      sessionParams.payment_method_types = ['card']
      sessionParams.subscription_data = { metadata }
    } else {
      // Pagamento único — cartão (MB Way/Multibanco via dashboard Stripe se activos)
      sessionParams.payment_method_types = ['card']
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
