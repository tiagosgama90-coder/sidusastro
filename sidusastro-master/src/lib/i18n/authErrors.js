import pt from './pt.js'
import en from './en.js'
import es from './es.js'
import it from './it.js'
import de from './de.js'
import fr from './fr.js'

const LOCALES = { pt, en, es, it, de, fr }

function t(lang, key) {
  return key.split('.').reduce((o, k) => o?.[k], LOCALES[lang])
    ?? key.split('.').reduce((o, k) => o?.[k], LOCALES.en)
    ?? key.split('.').reduce((o, k) => o?.[k], LOCALES.pt)
    ?? key
}

export function traduzirErroAuth(code, lang = 'pt') {
  const c = String(code || '')
  if (/api-key-not-valid|invalid-api-key/i.test(c)) {
    return t(lang, 'auth.errors.apiKeyInvalid')
  }
  const key = `auth.errors.${c}`
  const translated = t(lang, key)
  if (translated !== key) return translated
  return t(lang, 'auth.errors.unknown')
}

export function traduzirErroEmail(code, message, lang = 'pt') {
  const mapaKeys = {
    'auth/too-many-requests': 'emailVerify.errors.tooMany',
    'auth/user-token-expired': 'emailVerify.errors.sessionExpired',
    'auth/network-request-failed': 'emailVerify.errors.network',
    'auth/internal-error': 'emailVerify.errors.internal',
    'auth/missing-email': 'emailVerify.errors.missingEmail',
    'auth/invalid-email': 'auth.errors.auth/invalid-email',
    'auth/user-not-found': 'auth.forgot.errors.notFound',
  }
  const texto = message || ''
  if (/TOO_MANY_ATTEMPTS/i.test(texto)) return t(lang, 'emailVerify.errors.tooMany')
  if (/OPERATION_NOT_ALLOWED/i.test(texto)) return t(lang, 'emailVerify.errors.notEnabled')
  const key = mapaKeys[code]
  if (key) return t(lang, key)
  return texto || t(lang, 'emailVerify.errors.sendFailed')
}
