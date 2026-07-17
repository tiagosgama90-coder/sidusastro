import crypto from 'node:crypto'

const PROFANITY = [
  'merda', 'caralho', 'foda', 'puta', 'porra', 'viado', 'fdp', 'buceta',
  'shit', 'fuck', 'bitch', 'asshole', 'spam', 'http://', 'https://', 'www.',
]

export function hashValue(value) {
  if (!value) return ''
  return crypto.createHash('sha256').update(String(value).trim().toLowerCase()).digest('hex')
}

export function sanitizeReviewText(text) {
  return String(text || '')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 500)
}

export function sanitizeReviewName(name) {
  return String(name || '')
    .replace(/<[^>]*>/g, '')
    .replace(/[^\p{L}\s.'-]/gu, '')
    .trim()
    .slice(0, 40)
}

export function hasProfanity(text) {
  const lower = String(text || '').toLowerCase()
  return PROFANITY.some((w) => lower.includes(w))
}

export function validateReviewPayload({ name, text, email, honeypot }) {
  if (honeypot) return { ok: false, error: 'spam_detected' }
  const nome = sanitizeReviewName(name)
  const corpo = sanitizeReviewText(text)
  const addr = String(email || '').trim().toLowerCase()
  if (!nome || nome.length < 2) return { ok: false, error: 'name_invalid' }
  if (!corpo || corpo.length < 20) return { ok: false, error: 'text_too_short' }
  if (corpo.length > 500) return { ok: false, error: 'text_too_long' }
  if (!addr || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addr)) return { ok: false, error: 'email_invalid' }
  if (hasProfanity(corpo) || hasProfanity(nome)) return { ok: false, error: 'text_rejected' }
  return { ok: true, nome, corpo, addr }
}
