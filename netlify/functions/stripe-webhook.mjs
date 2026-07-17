import { getStripe } from './_shared/stripe.mjs'
import { env } from './_shared/env.mjs'
import { activarPremium, desactivarPremium, activarMapaCompleto } from './_shared/firebase-admin.mjs'

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const stripe = getStripe()
  const webhookSecret = env('STRIPE_WEBHOOK_SECRET')
  if (!webhookSecret) {
    console.error('[stripe-webhook] STRIPE_WEBHOOK_SECRET em falta')
    return new Response('Webhook secret not configured', { status: 500 })
  }

  const sig = req.headers.get('stripe-signature')
  const body = await req.text()

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (e) {
    console.error('[stripe-webhook] assinatura inválida:', e?.message)
    return new Response(`Webhook Error: ${e.message}`, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
      case 'checkout.session.async_payment_succeeded': {
        const session = event.data.object
        if (session.payment_status !== 'paid' && session.payment_status !== 'no_payment_required') {
          console.log('[stripe-webhook] pagamento pendente:', session.id, session.payment_status)
          break
        }
        const userId = session.metadata?.userId || session.client_reference_id
        const productType = session.metadata?.productType
          || (session.mode === 'subscription' ? 'premium' : 'tarot')

        if (userId && productType === 'premium') {
          const isRecurring = session.mode === 'subscription' && session.subscription
          const activado = await activarPremium(userId, {
            stripeCustomerId: session.customer || null,
            stripeSubscriptionId: isRecurring ? (session.subscription || null) : null,
            billingType: isRecurring ? 'recurring' : 'lifetime',
          })
          if (!activado.ok) console.error('[stripe-webhook] activarPremium falhou para', userId, activado.error)
        } else if (userId && productType === 'mapa') {
          const activado = await activarMapaCompleto(userId)
          if (!activado) console.error('[stripe-webhook] activarMapaCompleto falhou para', userId)
        }
        break
      }
      case 'customer.subscription.updated': {
        const sub = event.data.object
        const userId = sub.metadata?.userId
        if (userId && ['active', 'trialing'].includes(sub.status)) {
          await activarPremium(userId, { stripeSubscriptionId: sub.id, stripeCustomerId: sub.customer })
        }
        break
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object
        const userId = sub.metadata?.userId
        if (userId) await desactivarPremium(userId)
        break
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object
        const subId = invoice.subscription
        if (subId) {
          const sub = await stripe.subscriptions.retrieve(subId)
          const userId = sub.metadata?.userId
          if (userId && sub.status === 'canceled') await desactivarPremium(userId)
        }
        break
      }
      default:
        break
    }
  } catch (e) {
    console.error('[stripe-webhook] handler error:', e?.message)
    return new Response('Webhook handler failed', { status: 500 })
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

export const config = { path: '/api/stripe-webhook' }
