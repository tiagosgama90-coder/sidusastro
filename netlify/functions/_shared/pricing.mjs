/** Preços — espelham src/lib/pricing.js */
export const PIX_BR_EUR_TO_BRL = 5.6
export const PRECO_TAROT_EUR = 0.25
export const PRECO_PREMIUM_EUR = 4.99
export const PRECO_PREMIUM_BR_PIX_EUR_REF = 5
export const PRECO_PREMIUM_PIX_BRL = PRECO_PREMIUM_BR_PIX_EUR_REF * PIX_BR_EUR_TO_BRL
export const PRECO_TAROT_PIX_BRL = Math.max(1, Math.round(PRECO_PREMIUM_PIX_BRL * (PRECO_TAROT_EUR / PRECO_PREMIUM_EUR)))
