import Stripe from 'stripe'
import { env } from './env.mjs'

let stripeClient = null

export function getStripe() {
  const key = env('STRIPE_SECRET_KEY')
  if (!key) throw new Error('STRIPE_SECRET_KEY não configurada')
  if (!stripeClient) stripeClient = new Stripe(key)
  return stripeClient
}

export function siteOrigin(req) {
  const origin = req.headers.get('origin')
  if (origin) return origin.replace(/\/$/, '')
  return env('URL') || env('DEPLOY_PRIME_URL') || 'https://sidusastro.com'
}
