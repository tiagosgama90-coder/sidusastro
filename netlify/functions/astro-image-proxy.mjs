/** Proxy de imagens externas - sem fallbacks de stock; 404 se falhar. */

const BLOCKED_HOSTS = ['unsplash.com', 'placeholder.com', 'placehold.it', 'via.placeholder.com']

const ALLOWED_CDNS = ['googleusercontent.com', 'ggpht.com', 'gstatic.com']

function isAllowedImageUrl(imgUrl) {
  try {
    const u = new URL(imgUrl)
    if (BLOCKED_HOSTS.some((h) => u.hostname.includes(h))) return false
    return /^https?:$/i.test(u.protocol)
  } catch {
    return false
  }
}

export default async (req) => {
  const url = new URL(req.url)
  const imgUrl = url.searchParams.get('url')
  if (!imgUrl || !isAllowedImageUrl(imgUrl)) {
    return new Response('URL inválida', { status: 400 })
  }

  try {
    const parsed = new URL(imgUrl)
    const origin = parsed.origin
    const isGoogleCdn = ALLOWED_CDNS.some((h) => parsed.hostname.includes(h))
    const res = await fetch(imgUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
        Accept: 'image/avif,image/webp,image/apng,image/*,*/*',
        ...(isGoogleCdn ? {} : { Referer: `${origin}/` }),
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) return new Response(null, { status: 404 })
    const ct = res.headers.get('content-type') || ''
    if (!ct.startsWith('image/')) return new Response(null, { status: 404 })
    const buf = await res.arrayBuffer()
    if (buf.byteLength < 500) return new Response(null, { status: 404 })
    return new Response(buf, {
      headers: {
        'Content-Type': ct,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch {
    return new Response(null, { status: 404 })
  }
}
