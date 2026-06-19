/** Contas com Premium vitalício (independente do Firestore). */
const EMAILS_PREMIUM_PRIVILEGIADOS = [
  'tiagosgama90@gmail.com',
]

export function emailTemPremiumPrivilegiado(user) {
  const email = user?.email?.trim().toLowerCase()
  if (!email) return false
  return EMAILS_PREMIUM_PRIVILEGIADOS.includes(email)
}

export function utilizadorTemPremium(user, perfil) {
  if (emailTemPremiumPrivilegiado(user)) return true
  if (!perfil) return false
  if (perfil.isPremium === true) return true
  if (perfil.mapaCompleto === true) return true
  if (perfil.stripeSubscriptionId) return true
  if (perfil.premiumAt) return true
  return false
}
