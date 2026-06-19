/** Mapeamento passo interno ↔ URL pública (SEO e partilha). */
export const PASSO_TO_PATH = {
  login: '/login',
  home: '/home',
  mapa: '/mapaastral',
  tarot: '/tarot',
  ferramentas: '/ferramentas',
  bussola: '/bussola',
  sinastria: '/sinastria',
  numerologia: '/numerologia',
  sonhos: '/sonhos',
  biorritmo: '/biorritmo',
  horasIguais: '/horas-iguais',
  diario: '/diario',
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
PATH_TO_PASSO['/horoscopo'] = 'home'
PATH_TO_PASSO['/horoscope'] = 'home'

const SUPPORTED_LANGS = new Set(['pt', 'en'])

/** Extrai pt|en do prefixo /pt/... ou /en/... */
export function langFromPath(pathname) {
  const path = (pathname || '/').replace(/\/$/, '') || '/'
  const m = path.match(/^\/(pt|en)(?:\/|$)/)
  return m && SUPPORTED_LANGS.has(m[1]) ? m[1] : null
}

/** Remove prefixo de idioma (/pt/tarot → /tarot). */
export function stripLangPrefix(pathname) {
  let path = (pathname || '/').replace(/\/$/, '') || '/'
  const m = path.match(/^\/(pt|en)(\/.*|$)/)
  if (m) {
    path = m[2] || '/'
    if (!path.startsWith('/')) path = `/${path}`
  }
  return path || '/'
}

export function passoFromPath(pathname) {
  const path = stripLangPrefix(pathname)
  return PATH_TO_PASSO[path] || 'home'
}

/** Gera path público; com lang → prefixo /pt ou /en (SEO). */
export function pathFromPasso(passo, lang = null) {
  const base = PASSO_TO_PATH[passo] || '/'
  if (lang === 'pt') return base === '/' ? '/pt' : `/pt${base}`
  if (lang === 'en') return base === '/' ? '/en' : `/en${base}`
  return base
}

export function paymentReturnPath(productType) {
  if (productType === 'tarot') return '/tarot'
  return '/mapaastral'
}
