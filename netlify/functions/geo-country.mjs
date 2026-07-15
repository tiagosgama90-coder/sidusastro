const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

function paisDoPedido(req) {
  return (
    req.headers.get('x-country')
    || req.headers.get('x-nf-client-country-code')
    || ''
  ).trim().toUpperCase()
}

export default async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: corsHeaders })
  }

  const country = paisDoPedido(req) || 'XX'
  return new Response(JSON.stringify({ country }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

export const config = { path: '/api/geo' }
