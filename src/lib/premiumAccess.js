/** Contas com Premium vitalício (independente do Firestore). */
import { ADMIN_EMAILS } from './adminEmails.js'

const EMAILS_PREMIUM_PRIVILEGIADOS = [...ADMIN_EMAILS]

function dataPremiumUntil(perfil) {
  const raw = perfil?.premiumUntil
  if (!raw) return null
  if (typeof raw.toDate === 'function') return raw.toDate()
  if (raw.seconds) return new Date(raw.seconds * 1000)
  return new Date(raw)
}

export function premiumPrepaidActivo(perfil) {
  const until = dataPremiumUntil(perfil)
  return until ? until > new Date() : false
}

export function emailTemPremiumPrivilegiado(user) {
  const email = user?.email?.trim().toLowerCase()
  if (!email) return false
  return EMAILS_PREMIUM_PRIVILEGIADOS.includes(email)
}

export function perfilTemPremium(perfil, user) {
  return utilizadorTemPremium(user, perfil)
}

export function utilizadorTemPremium(user, perfil) {
  if (emailTemPremiumPrivilegiado(user)) return true
  if (!perfil) return false
  if (perfil.stripeSubscriptionId) return true
  if (premiumPrepaidActivo(perfil)) return true
  if (perfil.isPremium === true && perfil.premiumBilling === 'lifetime') return true
  if (perfil.isPremium === true && perfil.premiumBilling === 'recurring') return true
  if (perfil.isPremium === true && !perfil.premiumUntil) return true
  if (perfil.mapaCompleto === true) return true
  return false
}
