import { sendEmailVerification } from 'firebase/auth'
import { auth } from './firebase'
import { traduzirErroEmail as traduzirErroEmailFromAuth } from './i18n/authErrors.js'
/** URL de retorno após clicar no link do e-mail (domínio tem de estar autorizado no Firebase). */
export function emailActionSettings() {
  const origin = typeof window !== 'undefined'
    ? window.location.origin
    : 'https://sidusastro.com'
  return {
    url: `${origin}/home`,
    handleCodeInApp: false,
  }
}

async function enviarViaServidor(user) {
  const idToken = await user.getIdToken(true)
  const res = await fetch('/api/send-verification-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
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
 * Usa sempre auth.currentUser (sessão activa) — o objeto user em props pode ficar desactualizado.
 */
export async function enviarEmailVerificacao(user) {
  if (!auth) throw new Error('Firebase não configurado')

  const activo = auth.currentUser || user
  if (!activo) throw new Error('Sessão expirada. Inicia sessão novamente.')
  if (activo.emailVerified) throw new Error('Este e-mail já está confirmado.')

  try {
    await sendEmailVerification(activo, emailActionSettings())
    return activo.email
  } catch (clientErr) {
    console.warn('[Sidus Email] Cliente falhou, a tentar servidor:', clientErr?.code, clientErr?.message)
    try {
      return await enviarViaServidor(activo)
    } catch (serverErr) {
      console.error('[Sidus Email] Servidor falhou:', serverErr?.message)
      throw serverErr?.message ? serverErr : clientErr
    }
  }
}

export function traduzirErroEmail(code, message, lang = 'pt') {
  return traduzirErroEmailFromAuth(code, message, lang)
}