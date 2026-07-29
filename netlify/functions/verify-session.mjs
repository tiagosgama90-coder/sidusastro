import { getStripe } from './_shared/stripe.mjs'
import { activarPremium, activarMapaCompleto } from './_shared/firebase-admin.mjs'

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
    const { sessionId, userId } = await req.json()
    if (!sessionId) {
      return new Response(JSON.stringify({ error: 'sessionId em falta' }), { status: 400, headers: corsHeaders })
    }

    const stripe = getStripe()
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'payment_intent'],
    })

    const paid = session.payment_status === 'paid'
      || session.payment_status === 'no_payment_required'
    const pendingAsync = session.status === 'complete' && session.payment_status === 'unpaid'

    if (pendingAsync) {
      return new Response(JSON.stringify({
        ok: false,
        pending: true,
        status: session.payment_status,
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (!paid) {
      return new Response(JSON.stringify({ ok: false, status: session.payment_status }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const metaUserId = session.metadata?.userId || session.client_reference_id
    if (userId && metaUserId && metaUserId !== userId) {
      return new Response(JSON.stringify({ error: 'Sessão não pertence a este utilizador' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const productType = session.metadata?.productType
      || (session.mode === 'subscription' ? 'premium' : 'tarot')

    if (metaUserId && productType === 'premium') {
      const isRecurring = session.mode === 'subscription' && session.subscription
      const activado = await activarPremium(metaUserId, {
        stripeCustomerId: session.customer || null,
        stripeSubscriptionId: isRecurring ? (session.subscription?.id || session.subscription || null) : null,
        billingType: isRecurring ? 'recurring' : 'lifetime',
      })
      if (!activado.ok) {
        return new Response(JSON.stringify({
          error: 'Não foi possível activar Premium no Firestore. Verifica FIREBASE_SERVICE_ACCOUNT no Netlify.',
        }), { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }
    } else if (metaUserId && productType === 'mapa') {
      const activado = await activarMapaCompleto(metaUserId)
      if (!activado) {
        return new Response(JSON.stringify({
          error: 'Não foi possível desbloquear o mapa no Firestore. Verifica FIREBASE_SERVICE_ACCOUNT no Netlify.',
        }), { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }
    }

    return new Response(JSON.stringify({
      ok: true,
      productType,
      userId: metaUserId,
      subscriptionId: session.subscription?.id || session.subscription || null,
      customerId: session.customer || null,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error('[verify-session]', e?.message)
    return new Response(JSON.stringify({ error: e?.message || 'Erro ao verificar sessão' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
}

export const config = { path: '/api/verify-session' }
