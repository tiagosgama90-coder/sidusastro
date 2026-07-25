/** Preços PIX Brasil — espelham src/lib/pricing.js */
export const PIX_BR_EUR_TO_BRL = 5.6
export const PRECO_PREMIUM_BR_PIX_EUR_REF = 5
export const PRECO_TAROT_BR_PIX_EUR_REF = 1
export const PRECO_PREMIUM_PIX_BRL = PRECO_PREMIUM_BR_PIX_EUR_REF * PIX_BR_EUR_TO_BRL
export const PRECO_TAROT_PIX_BRL = Math.round(PRECO_TAROT_BR_PIX_EUR_REF * PIX_BR_EUR_TO_BRL)
