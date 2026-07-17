/** Contas com acesso admin (moderação, aprovação VIP promo). */
export const ADMIN_EMAILS = [
  'tiagosgama90@gmail.com',
  'helenaccprieto@gmail.com',
]

export function emailEhAdmin(userOrEmail) {
  const email = typeof userOrEmail === 'string'
    ? userOrEmail
    : userOrEmail?.email
  if (!email) return false
  return ADMIN_EMAILS.includes(email.trim().toLowerCase())
}
