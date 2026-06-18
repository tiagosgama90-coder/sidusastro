import Stripe from 'stripe'

let stripeClient = null

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('STRIPE_SECRET_KEY não configurada')
  if (!stripeClient) stripeClient = new Stripe(key)
  return stripeClient
}

export function siteOrigin(req) {
  const origin = req.headers.get('origin')
  if (origin) return origin.replace(/\/$/, '')
  return process.env.URL || process.env.DEPLOY_PRIME_URL || 'https://sidusastro.com'
}
