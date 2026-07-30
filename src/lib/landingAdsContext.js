const STORAGE_KEY = 'sidus_ads_attribution_v1'

function normalizeTerm(raw) {
  return String(raw || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\+/g, ' ')
    .trim()
}

/** Guarda gclid/UTM na primeira visita (Google Ads). */
export function captureLandingAdsAttribution() {
  if (typeof window === 'undefined') return
  try {
    const params = new URLSearchParams(window.location.search)
    const gclid = params.get('gclid')
    const utmSource = params.get('utm_source')
    const utmMedium = params.get('utm_medium')
    const utmCampaign = params.get('utm_campaign')
    const utmTerm = params.get('utm_term')
    if (!gclid && !utmSource && !utmTerm) return

    const payload = {
      gclid,
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      utm_term: utmTerm,
      landing_path: window.location.pathname,
      captured_at: Date.now(),
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    /* ignore */
  }
}

export function getLandingAdsAttribution() {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function isFromGoogleAds() {
  const data = getLandingAdsAttribution()
  if (!data) return false
  if (data.gclid) return true
  const source = normalizeTerm(data.utm_source)
  return source === 'google' || source.includes('google')
}

export function getAdsKeywordBucket() {
  const term = normalizeTerm(getLandingAdsAttribution()?.utm_term)
  if (!term) return 'default'
  if (term.includes('completo')) return 'completo'
  if (term.includes('ascendente')) return 'ascendente'
  if (term.includes('ler') || term.includes('interpret')) return 'ler'
  if (term.includes('calcular') || term.includes('fazer')) return 'calcular'
  if (term.includes('sinastria') || term.includes('compatibil') || term.includes('casal')) return 'sinastria'
  if (term.includes('personalizado') || term.includes('profissional')) return 'completo'
  return 'default'
}

/** Mensagens alinhadas às palavras-chave da campanha. */
export function getLandingAdsCopy(t) {
  const bucket = getAdsKeywordBucket()
  const map = {
    completo: {
      title: t('auth.portal.adsCopy.completoTitle'),
      benefit: t('auth.portal.adsCopy.completoBenefit'),
      cta: t('auth.portal.adsCopy.completoCta'),
    },
    ascendente: {
      title: t('auth.portal.adsCopy.ascendenteTitle'),
      benefit: t('auth.portal.adsCopy.ascendenteBenefit'),
      cta: t('auth.portal.adsCopy.ascendenteCta'),
    },
    ler: {
      title: t('auth.portal.adsCopy.lerTitle'),
      benefit: t('auth.portal.adsCopy.lerBenefit'),
      cta: t('auth.portal.adsCopy.lerCta'),
    },
    calcular: {
      title: t('auth.portal.adsCopy.calcularTitle'),
      benefit: t('auth.portal.adsCopy.calcularBenefit'),
      cta: t('auth.portal.adsCopy.calcularCta'),
    },
    sinastria: {
      title: t('auth.portal.adsCopy.sinastriaTitle'),
      benefit: t('auth.portal.adsCopy.sinastriaBenefit'),
      cta: t('auth.portal.adsCopy.sinastriaCta'),
    },
    default: {
      title: t('auth.portal.adsCopy.defaultTitle'),
      benefit: t('auth.portal.adsCopy.defaultBenefit'),
      cta: t('auth.portal.adsCopy.defaultCta'),
    },
  }
  return map[bucket] || map.default
}
