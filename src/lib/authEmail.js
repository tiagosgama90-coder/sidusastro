import { sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth'
import { auth } from './firebase'
import { traduzirErroEmail as traduzirErroEmailFromAuth } from './i18n/authErrors.js'
/** URL de retorno após clicar no link do e-mail (domínio tem de estar autorizado no Firebase). */
export function emailVerificationContinueUrl(origin = 'https://sidusastro.com') {
  return `${origin.replace(/\/$/, '')}/login?emailVerified=1`
}

export function emailActionSettings() {
  const origin = typeof window !== 'undefined'
    ? window.location.origin
    : 'https://sidusastro.com'
  return {
    url: emailVerificationContinueUrl(origin),
    handleCodeInApp: false,
  }
}

function resetPasswordSettings() {
  const origin = typeof window !== 'undefined'
    ? window.location.origin
    : 'https://sidusastro.com'
  return {
    url: `${origin}/login`,
    handleCodeInApp: false,
  }
}

/**
 * Envia e-mail de recuperação de senha (link Firebase para definir nova senha).
 */
export async function enviarEmailRecuperacaoSenha(email) {
  if (!auth) throw new Error('Firebase não configurado')
  const addr = email?.trim()
  if (!addr) {
    const err = new Error('missing-email')
    err.code = 'auth/missing-email'
    throw err
  }
  await sendPasswordResetEmail(auth, addr, resetPasswordSettings())
  return addr
}

async function enviarViaServidor(user, lang = 'pt') {
  const idToken = await user.getIdToken(true)
  const res = await fetch('/api/send-verification-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken, lang }),
  })
  const data = await res.json()
  if (!res.ok) {
    const err = new Error(data.error || 'Falha no servidor')
    err.code = data.error?.includes('TOO_MANY') ? 'auth/too-many-requests' : 'auth/internal-error'
    throw err
  }
  return data.email || user.email
}

/**
 * Envia e-mail de verificação Firebase.
 * Usa sempre auth.currentUser (sessão activa) - o objeto user em props pode ficar desactualizado.
 */
export async function enviarEmailVerificacao(user, lang = 'pt') {
  if (!auth) throw new Error('Firebase não configurado')

  const activo = auth.currentUser || user
  if (!activo) throw new Error('Sessão expirada. Inicia sessão novamente.')
  if (activo.emailVerified) throw new Error('Este e-mail já está confirmado.')

  try {
    return await enviarViaServidor(activo, lang)
  } catch (serverErr) {
    console.warn('[Sidus Email] Servidor falhou, a tentar cliente:', serverErr?.message)
    try {
      await sendEmailVerification(activo, emailActionSettings())
      return activo.email
    } catch (clientErr) {
      console.error('[Sidus Email] Cliente falhou:', clientErr?.code, clientErr?.message)
      throw serverErr?.message ? serverErr : clientErr
    }
  }
}

export function traduzirErroEmail(code, message, lang = 'pt') {
  return traduzirErroEmailFromAuth(code, message, lang)
}

/**
 * E-mail de boas-vindas pós-registo («O teu mapa está pronto»).
 * Usa Resend no servidor se RESEND_API_KEY estiver configurada; caso contrário ignora silenciosamente.
 */
export async function enviarEmailBoasVindas(email, lang = 'pt') {
  const addr = email?.trim()
  if (!addr) return { skipped: true }
  try {
    const res = await fetch('/api/send-welcome-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: addr, lang }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      console.warn('[Sidus Email] Boas-vindas:', data.error)
      return { ok: false }
    }
    return data
  } catch (e) {
    console.warn('[Sidus Email] Boas-vindas falhou:', e?.message)
    return { ok: false }
  }
}