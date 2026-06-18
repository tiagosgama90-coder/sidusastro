/** Mapeamento passo interno ↔ URL pública (SEO e partilha). */
export const PASSO_TO_PATH = {
  dashboard: '/',
  mapa: '/mapaastral',
  tarot: '/tarot',
  ferramentas: '/ferramentas',
  chat: '/oraculo',
  perfil: '/perfil',
  privacidade: '/privacidade',
  paywall: '/vip',
  onboarding: '/comecar',
}

const PATH_TO_PASSO = Object.fromEntries(
  Object.entries(PASSO_TO_PATH).map(([passo, path]) => [path, passo]),
)

/** Aliases legíveis */
PATH_TO_PASSO['/inicio'] = 'dashboard'
PATH_TO_PASSO['/mapa'] = 'mapa'
PATH_TO_PASSO['/chat'] = 'chat'
PATH_TO_PASSO['/premium'] = 'paywall'

export function passoFromPath(pathname) {
  const path = (pathname || '/').replace(/\/$/, '') || '/'
  return PATH_TO_PASSO[path] || 'dashboard'
}

export function pathFromPasso(passo) {
  return PASSO_TO_PATH[passo] || '/'
}

export function paymentReturnPath(productType) {
  return productType === 'premium' ? '/mapaastral' : '/tarot'
}
