export const API_CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, X-API-Key, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

export function jsonResponse(body, status = 200, extra = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...API_CORS, 'Content-Type': 'application/json', ...extra },
  })
}

export function optionsResponse() {
  return new Response(null, { status: 204, headers: API_CORS })
}
