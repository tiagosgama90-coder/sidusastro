/** Proxy de imagens externas — fallback único por artigo (seed). */

const FALLBACKS = [
  'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=240&fit=crop&q=80',
  'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=240&fit=crop&q=80',
  'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=400&h=240&fit=crop&q=80',
  'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=400&h=240&fit=crop&q=80',
  'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=400&h=240&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&h=240&fit=crop&q=80',
  'https://images.unsplash.com/photo-1532692760748-279ddad41a82?w=400&h=240&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506443432602-ac2fcd6f54e0?w=400&h=240&fit=crop&q=80',
]

function pickFallback(seed, imgUrl) {
  const n = Number(seed)
  if (Number.isFinite(n) && n >= 0) return FALLBACKS[n % FALLBACKS.length]
  let h = 0
  const s = imgUrl || '0'
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0
  return FALLBACKS[Math.abs(h) % FALLBACKS.length]
}

export default async (req) => {
  const url = new URL(req.url)
  const imgUrl = url.searchParams.get('url')
  const seed = url.searchParams.get('seed')
  if (!imgUrl || !/^https?:\/\//i.test(imgUrl)) {
    return new Response('URL inválida', { status: 400 })
  }

  try {
    const origin = new URL(imgUrl).origin
    const res = await fetch(imgUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
        Accept: 'image/avif,image/webp,image/apng,image/*,*/*',
        Referer: `${origin}/`,
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) throw new Error(`img ${res.status}`)
    const ct = res.headers.get('content-type') || ''
    if (!ct.startsWith('image/')) throw new Error('not image')
    const buf = await res.arrayBuffer()
    if (buf.byteLength < 500) throw new Error('too small')
    return new Response(buf, {
      headers: {
        'Content-Type': ct,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch {
    const fb = pickFallback(seed, imgUrl)
    try {
      const res = await fetch(fb, { signal: AbortSignal.timeout(5000) })
      if (res.ok) {
        return new Response(await res.arrayBuffer(), {
          headers: {
            'Content-Type': res.headers.get('content-type') || 'image/jpeg',
            'Cache-Control': 'public, max-age=86400, s-maxage=86400',
            'Access-Control-Allow-Origin': '*',
          },
        })
      }
    } catch { /* ignore */ }
    return new Response(null, { status: 404 })
  }
}
