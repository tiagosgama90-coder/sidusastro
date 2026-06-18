import { sendEmailVerification } from 'firebase/auth'
import { auth } from './firebase'

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

export function traduzirErroEmail(code, message) {
  const mapa = {
    'auth/too-many-requests': 'Demasiados pedidos. Aguarda alguns minutos antes de reenviar.',
    'auth/user-token-expired': 'Sessão expirada. Inicia sessão novamente.',
    'auth/network-request-failed': 'Erro de rede. Verifica a ligação à internet.',
    'auth/internal-error': 'Erro interno do Firebase. Confirma que o domínio está autorizado no Firebase Console.',
    'auth/missing-email': 'E-mail em falta na conta.',
  }
  const texto = message || ''
  if (/TOO_MANY_ATTEMPTS/i.test(texto)) return mapa['auth/too-many-requests']
  if (/OPERATION_NOT_ALLOWED/i.test(texto)) return 'Verificação por e-mail não está activa no Firebase Console.'
  return mapa[code] || texto || 'Não foi possível enviar o e-mail de confirmação.'
}
