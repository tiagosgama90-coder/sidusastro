/** Proxy de imagens externas (notícias) — evita bloqueios CORS/hotlink no browser. */

export default async (req) => {
  const url = new URL(req.url)
  const imgUrl = url.searchParams.get('url')
  if (!imgUrl || !/^https?:\/\//i.test(imgUrl)) {
    return new Response('URL inválida', { status: 400 })
  }

  try {
    const res = await fetch(imgUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SidusAstro/1.0; +https://sidusastro.com)',
        Accept: 'image/*,*/*',
        Referer: new URL(imgUrl).origin,
      },
      redirect: 'follow',
    })
    if (!res.ok) throw new Error(`img ${res.status}`)
    const ct = res.headers.get('content-type') || 'image/jpeg'
    if (!ct.startsWith('image/')) throw new Error('not image')
    return new Response(res.body, {
      headers: {
        'Content-Type': ct,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch {
    return new Response(null, { status: 302, headers: { Location: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=320&h=200&fit=crop' } })
  }
}
