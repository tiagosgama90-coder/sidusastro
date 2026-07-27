import { getStripe, siteOrigin } from './_shared/stripe.mjs'
import {
  PRECO_PREMIUM_EUR,
  PRECO_PREMIUM_PIX_BRL,
  PRECO_TAROT_EUR,
  PRECO_TAROT_PIX_BRL,
  STRIPE_MIN_BRL,
  STRIPE_MIN_EUR,
} from './_shared/pricing.mjs'

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
const SUPPORTED_LANGS = new Set(['pt', 'en', 'es', 'it', 'de', 'fr'])

function resolverProductType({ productTypeRaw, cobranca, valorCliente, descricao }) {
  if (productTypeRaw) return productTypeRaw
  if (cobranca.currency === 'brl' && cobranca.amount >= PRECO_PREMIUM_PIX_BRL - 0.01) return 'premium'
  if (valorCliente >= PRECO_PREMIUM_EUR - 0.01 || /vip|premium|subscri/i.test(descricao || '')) return 'premium'
  if (valorCliente >= 10 || /mapa.*completo|natal chart/i.test(descricao || '')) return 'mapa'
  return 'tarot'
}

function resolverCobranca({ productType, metodo, country }) {
  const isBr = String(country || '').toUpperCase() === 'BR'
  const pixBr = isBr && metodo === 'pix'

  if (productType === 'premium') {
    return pixBr
      ? { amount: PRECO_PREMIUM_PIX_BRL, currency: 'brl' }
      : { amount: PRECO_PREMIUM_EUR, currency: 'eur' }
  }
  if (productType === 'mapa') {
    return { amount: 10, currency: 'eur' }
  }
  if (productType === 'tarot') {
    return pixBr
      ? { amount: PRECO_TAROT_PIX_BRL, currency: 'brl' }
      : { amount: PRECO_TAROT_EUR, currency: 'eur' }
  }
  return pixBr
    ? { amount: PRECO_TAROT_PIX_BRL, currency: 'brl' }
    : { amount: PRECO_TAROT_EUR, currency: 'eur' }
}

function validarMontante(amount, currency) {
  const min = currency === 'brl' ? STRIPE_MIN_BRL : STRIPE_MIN_EUR
  if (!Number.isFinite(amount) || amount < min) {
    throw new Error(`amount_too_small:${currency}:${min}`)
  }
}

function pathComIdioma(basePath, lang) {
  if (!SUPPORTED_LANGS.has(lang)) return basePath
  return basePath === '/' ? `/${lang}` : `/${lang}${basePath}`
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
    const { valor, descricao, userId, userEmail, productType: productTypeRaw, paymentMethod, lang: langRaw, country } = body

    if (!valor || !descricao || !userId) {
      return new Response(JSON.stringify({ error: 'missing_params' }), { status: 400, headers: corsHeaders })
    }

    const stripe = getStripe()
    const origin = siteOrigin(req)
    const valorCliente = Number(valor)
    const metodo = resolverMetodoPagamento(paymentMethod)
    const productType = resolverProductType({
      productTypeRaw,
      cobranca: resolverCobranca({ productType: productTypeRaw || 'tarot', metodo, country }),
      valorCliente,
      descricao,
    })
    const cobranca = resolverCobranca({ productType, metodo, country })
    validarMontante(cobranca.amount, cobranca.currency)

    const isPremium = productType === 'premium'
    const billingType = isPremium ? 'lifetime' : 'one_time'

    const metadata = {
      userId: String(userId),
      productType,
      billingType,
      descricao: String(descricao).slice(0, 500),
      paymentMethod: metodo,
      currency: cobranca.currency,
    }

    const returnPath = pathComIdioma(RETURN_PATH[productType] || '/tarot', langRaw)
    const cancelPath = pathComIdioma(CANCEL_PATH[productType] || '/tarot', langRaw)

    const nomeProduto = isPremium
      ? (descricao || 'Sidus Premium - Acesso completo')
      : descricao

    const sessionParams = {
      mode: 'payment',
      customer_email: userEmail || undefined,
      client_reference_id: String(userId),
      metadata,
      locale: cobranca.currency === 'brl' ? 'pt-BR' : 'pt',
      success_url: `${origin}${returnPath}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}${cancelPath}?payment=cancelled`,
      line_items: [{
        quantity: 1,
        price_data: {
          currency: cobranca.currency,
          product_data: { name: nomeProduto },
          unit_amount: Math.round(cobranca.amount * 100),
        },
      }],
      payment_method_types: tiposPagamentoCheckout(metodo),
      payment_intent_data: { metadata },
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    return new Response(JSON.stringify({ url: session.url, sessionId: session.id }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error('[create-checkout-session]', e?.message)
    const msg = String(e?.message || '')
    const code = msg.startsWith('amount_too_small:')
      ? 'amount_too_small'
      : (msg.includes('STRIPE_SECRET_KEY') ? 'stripe_not_configured' : 'sessionFail')
    return new Response(JSON.stringify({ error: code, detail: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
}

export const config = { path: '/api/create-checkout-session' }
