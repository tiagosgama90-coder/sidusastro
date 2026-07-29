import { useEffect, useState } from 'react'

const STORAGE_KEY = 'sidus_geo_country'

function lerCache() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) || ''
  } catch {
    return ''
  }
}

function gravarCache(country) {
  try {
    sessionStorage.setItem(STORAGE_KEY, country)
  } catch {
    /* private mode */
  }
}

/** País ISO (Netlify geo) - cache por sessão. */
export function useGeoCountry() {
  const cached = lerCache()
  const [country, setCountry] = useState(cached)
  const [loaded, setLoaded] = useState(Boolean(cached))

  useEffect(() => {
    if (cached) return undefined
    let cancelado = false
    fetch('/api/geo')
      .then((r) => r.json())
      .then((d) => {
        if (cancelado) return
        const c = String(d?.country || '').trim().toUpperCase()
        setCountry(c)
        if (c) gravarCache(c)
      })
      .catch(() => {
        if (!cancelado) setCountry('')
      })
      .finally(() => {
        if (!cancelado) setLoaded(true)
      })
    return () => { cancelado = true }
  }, [cached])

  return {
    country,
    isBrasil: country === 'BR',
    loaded,
  }
}
