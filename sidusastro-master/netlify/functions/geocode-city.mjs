const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search'
const USER_AGENT = 'SidusAstro/1.0 (https://sidusastro.com; support@sidusastro.com)'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

export default async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: corsHeaders })
  }

  const url = new URL(req.url)
  const cidade = url.searchParams.get('q')?.trim()
  if (!cidade || cidade.length < 2) {
    return new Response(JSON.stringify({ error: 'Cidade em falta' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    const params = new URLSearchParams({
      q: cidade,
      format: 'json',
      addressdetails: '1',
      limit: '1',
      featuretype: 'settlement',
    })

    const resp = await fetch(`${NOMINATIM_URL}?${params}`, {
      headers: {
        Accept: 'application/json',
        'Accept-Language': 'pt',
        'User-Agent': USER_AGENT,
      },
    })

    if (!resp.ok) {
      return new Response(JSON.stringify({ error: `Geocoding: ${resp.status}` }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const resultados = await resp.json()
    const r = resultados?.[0]
    if (!r?.lat || !r?.lon) {
      return new Response(JSON.stringify({ result: null }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({
      result: {
        placeId: String(r.place_id),
        nome: r.display_name,
        lat: parseFloat(r.lat),
        lon: parseFloat(r.lon),
        tipo: r.type,
      },
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error('[geocode-city]', e?.message)
    return new Response(JSON.stringify({ error: e?.message || 'Erro de geocoding' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
}

export const config = { path: '/api/geocode' }
