import { ensureDailyContent } from './_shared/dailyContentStore.mjs'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

/** Fase lunar simples (servidor) — fallback se cliente não enviar. */
function faseFallback() {
  return { pt: 'Lua em ciclo activo', en: 'Moon in active cycle' }
}

export default async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const date = url.searchParams.get('date') || new Date().toISOString().slice(0, 10)
    const fasePt = url.searchParams.get('fasePt') || faseFallback().pt
    const faseEn = url.searchParams.get('faseEn') || faseFallback().en
    const transit = url.searchParams.get('transit') || ''

    const data = await ensureDailyContent({
      date,
      fasePt,
      faseEn,
      transitSummary: transit.slice(0, 500),
    })

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300' },
    })
  } catch (e) {
    console.error('[daily-content]', e?.message)
    return new Response(JSON.stringify({ error: 'Erro interno' }), { status: 500, headers: corsHeaders })
  }
}

export const config = { path: '/api/daily-content' }
