/** Mapeamento passo interno ↔ URL pública (SEO e partilha). */
export const PASSO_TO_PATH = {
  login: '/login',
  home: '/home',
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
PATH_TO_PASSO['/'] = 'login'
PATH_TO_PASSO['/inicio'] = 'home'
PATH_TO_PASSO['/mapa'] = 'mapa'
PATH_TO_PASSO['/chat'] = 'chat'
PATH_TO_PASSO['/premium'] = 'paywall'

export function passoFromPath(pathname) {
  const path = (pathname || '/').replace(/\/$/, '') || '/'
  return PATH_TO_PASSO[path] || 'home'
}

export function pathFromPasso(passo) {
  return PASSO_TO_PATH[passo] || '/'
}

export function paymentReturnPath(productType) {
  if (productType === 'tarot') return '/tarot'
  return '/mapaastral'
}
