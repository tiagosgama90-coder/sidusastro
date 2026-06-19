const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search'
const FETCH_TIMEOUT_MS = 8000

async function fetchComTimeout(url, options = {}, timeoutMs = FETCH_TIMEOUT_MS) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

/**
 * Devolve o nome IANA do fuso horário para as coordenadas dadas.
 * Usa Open-Meteo (gratuito, sem chave API).
 * Exemplos: "Europe/Lisbon", "America/Sao_Paulo", "Asia/Tokyo"
 */
export async function pesquisarFusoHorario(lat, lon) {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&timezone=auto&forecast_days=0`
  const resp = await fetchComTimeout(url)
  if (!resp.ok) throw new Error(`Timezone API: ${resp.status}`)
  const data = await resp.json()
  if (!data.timezone) throw new Error('Fuso horário não encontrado na resposta')
  return data.timezone // IANA string, ex: "Europe/Lisbon"
}

export async function pesquisarCidades(termo) {
  const limpo = termo?.trim()
  if (!limpo || limpo.length < 2) return []

  const params = new URLSearchParams({
    q: limpo,
    format: 'json',
    addressdetails: '1',
    limit: '6',
    featuretype: 'settlement',
  })

  const resposta = await fetchComTimeout(`${NOMINATIM_URL}?${params}`, {
    headers: {
      Accept: 'application/json',
      'Accept-Language': 'pt',
    },
  })

  if (!resposta.ok) throw new Error('Não foi possível pesquisar cidades.')

  const resultados = await resposta.json()

  return resultados
    .filter((r) => r.lat && r.lon)
    .map((r) => ({
      placeId: String(r.place_id),
      nome: r.display_name,
      lat: parseFloat(r.lat),
      lon: parseFloat(r.lon),
      tipo: r.type,
    }))
}

/** Primeiro resultado de geocoding para reparar perfis guardados sem coordenadas. */
export async function geocodificarCidade(cidade) {
  const resultados = await pesquisarCidades(cidade)
  return resultados[0] || null
}
