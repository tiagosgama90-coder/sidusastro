import { sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth'
import { auth } from './firebase'
import { traduzirErroEmail as traduzirErroEmailFromAuth } from './i18n/authErrors.js'

/** Configuração Firebase Auth (e-mail de verificação abre na app). */
export function emailActionSettings() {
  const origin = typeof window !== 'undefined'
    ? window.location.origin
    : 'https://sidusastro.com'
  return {
    url: `${origin.replace(/\/$/, '')}/comecar`,
    handleCodeInApp: true,
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

/** Envia e-mail de recuperação de senha (Firebase). */
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

/** E-mail de verificação - só Firebase (cliente). */
export async function enviarEmailVerificacao(user, _lang = 'pt') {
  if (!auth) throw new Error('Firebase não configurado')

  const activo = auth.currentUser || user
  if (!activo) throw new Error('Sessão expirada. Inicia sessão novamente.')
  if (activo.emailVerified) throw new Error('Este e-mail já está confirmado.')

  await sendEmailVerification(activo, emailActionSettings())
  return activo.email
}

export function traduzirErroEmail(code, message, lang = 'pt') {
  return traduzirErroEmailFromAuth(code, message, lang)
}
