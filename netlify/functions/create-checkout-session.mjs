import { getStripe, siteOrigin } from './_shared/stripe.mjs'

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
const PRECO_PREMIUM_EUR = 9.99
const PRECO_PREMIUM_PIX_EUR = 5
const PRECO_TAROT_PIX_EUR = 1

function resolverValorCobranca({ productType, metodo, valorCliente, country }) {
  const isBr = String(country || '').toUpperCase() === 'BR'
  if (productType === 'premium') {
    return metodo === 'pix' ? PRECO_PREMIUM_PIX_EUR : PRECO_PREMIUM_EUR
  }
  if (productType === 'tarot' && isBr && metodo === 'pix') {
    return PRECO_TAROT_PIX_EUR
  }
  return Number(valorCliente)
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
      return new Response(JSON.stringify({ error: 'Parâmetros em falta' }), { status: 400, headers: corsHeaders })
    }

    const stripe = getStripe()
    const origin = siteOrigin(req)
    const valorCliente = Number(valor)
    const productType = productTypeRaw
      || (valorCliente >= PRECO_PREMIUM_EUR - 0.01 || /vip|premium|subscri/i.test(descricao || '') ? 'premium'
        : valorCliente >= 10 || /mapa.*completo|natal chart/i.test(descricao || '') ? 'mapa'
          : 'tarot')
    const isPremium = productType === 'premium'
    const metodo = resolverMetodoPagamento(paymentMethod)
    const v = resolverValorCobranca({ productType, metodo, valorCliente, country })

    // VIP: pagamento único — acesso permanente (todos os métodos)
    const billingType = isPremium ? 'lifetime' : 'one_time'

    const metadata = {
      userId: String(userId),
      productType,
      billingType,
      descricao: String(descricao).slice(0, 500),
      paymentMethod: metodo,
    }

    const returnPath = pathComIdioma(RETURN_PATH[productType] || '/tarot', langRaw)
    const cancelPath = pathComIdioma(CANCEL_PATH[productType] || '/tarot', langRaw)

    const nomeProduto = isPremium
      ? (descricao || 'Sidus VIP - Acesso completo')
      : descricao

    const sessionParams = {
      mode: 'payment',
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
    return new Response(JSON.stringify({ error: e?.message || 'Erro ao criar sessão' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
}

export const config = { path: '/api/create-checkout-session' }
