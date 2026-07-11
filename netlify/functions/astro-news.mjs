/** RSS astrologia/horóscopo — imagem real (urlToImage) ou null, sem stock. */

const RSS_HL = {
  pt: 'pt-PT', en: 'en-GB', es: 'es-ES', it: 'it-IT', de: 'de-DE', fr: 'fr-FR',
}

const ASTRO_STRICT = /(?:astrolog|hor[oó]scop|zod[ií]ac|signo\s+solar|previs(?:ão|ões)\s+(?:astrol|diária|semanal)|mapa\s+astral|cart[a]?\s+astral|lua\s+(?:nova|cheia|minguante)|trânsit|transit|mercury\s+retrograde|mercúrio\s+retrógrado|tarot)/i

const REJECT_GENERIC = /(?:futebol|desporto|sport|pol[ií]tica|guerra|elei[cç]|receita\s+de|recipe|bolsa|crypto|bitcoin|crime|morte\s+de|nascimento\s+de\s+beb)/i

const BLOCKED_IMAGE = /unsplash\.com|placeholder|1x1|pixel\.gif|favicon|gravatar|logo\.(png|svg|jpg)/i

function googleNewsUrl(query, hl, gl) {
  const ceid = `${gl}:${hl.split('-')[0]}`
  return `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=${hl}&gl=${gl}&ceid=${ceid}`
}

function feedsForLang(lang) {
  const hl = RSS_HL[lang] || RSS_HL.en
  const gl = lang === 'pt' ? 'PT' : lang === 'es' ? 'ES' : lang === 'de' ? 'DE' : lang === 'fr' ? 'FR' : lang === 'it' ? 'IT' : 'GB'
  const astroQuery = '(astrologia OR horóscopo OR horóscopo+dia OR zodíaco OR "mapa astral")'
  const intlQuery = '(astrology OR horoscope OR zodiac OR "daily horoscope" OR "tarot horoscope")'

  if (lang === 'pt') {
    return [
      { url: googleNewsUrl(`${astroQuery}+when:7d`, 'pt-PT', 'PT'), tag: 'Portugal' },
      { url: googleNewsUrl(`(${astroQuery})+site:sapo.pt+when:7d`, 'pt-PT', 'PT'), tag: 'SAPO' },
      { url: googleNewsUrl(`(${astroQuery})+site:expresso.pt+when:7d`, 'pt-PT', 'PT'), tag: 'Expresso' },
      { url: googleNewsUrl(`(${astroQuery})+site:publico.pt+when:7d`, 'pt-PT', 'PT'), tag: 'Público' },
      { url: googleNewsUrl(`${intlQuery}+when:7d`, 'en-US', 'US'), tag: 'International' },
      { url: googleNewsUrl(`${intlQuery}+when:7d`, 'en-GB', 'GB'), tag: 'UK' },
      { url: googleNewsUrl('(astrología OR horóscopo)+when:7d', 'es-ES', 'ES'), tag: 'España' },
      { url: googleNewsUrl('(astrologie OR horoscope)+when:7d', 'fr-FR', 'FR'), tag: 'France' },
    ]
  }

  const q = { en: intlQuery, es: '(astrología OR horóscopo)', it: '(astrologia OR oroscopo)', de: 'Astrologie', fr: '(astrologie OR horoscope)' }[lang] || intlQuery
  return [
    { url: googleNewsUrl(`${q}+when:7d`, hl, gl), tag: { en: 'International', es: 'España', it: 'Italia', de: 'Deutschland', fr: 'France' }[lang] || 'News' },
    { url: googleNewsUrl(`${intlQuery}+when:7d`, 'en-US', 'US'), tag: 'International' },
  ]
}

function decodeXml(str) {
  return String(str || '')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .trim()
}

function cleanText(str) {
  return decodeXml(str).replace(/<[^>]+>/g, ' ').replace(/\u00a0/g, ' ').replace(/—/g, '-').replace(/\s+/g, ' ').trim()
}

function cleanTitle(title) {
  return cleanText(title).replace(/\s[-–—|]\s+[A-Za-zÀ-ÿ0-9][\wÀ-ÿ\s.&]{1,35}$/, '').trim()
}

function isAstroNews(title, description) {
  const blob = `${title} ${description}`.toLowerCase()
  if (REJECT_GENERIC.test(blob)) return false
  return ASTRO_STRICT.test(blob)
}

function isValidImageUrl(url) {
  if (!url || typeof url !== 'string') return false
  if (!/^https?:\/\//i.test(url)) return false
  if (BLOCKED_IMAGE.test(url)) return false
  return true
}

function extractTag(block, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i')
  const m = block.match(re)
  return m ? decodeXml(m[1]) : ''
}

/** Extrai thumbnail/image_url do RSS (media:thumbnail, media:content, enclosure, img). */
function extractImageFromRss(block, description) {
  const src = `${block} ${description || ''}`
  const patterns = [
    /media:thumbnail[^>]+url=["'](https?:\/\/[^"']+)["']/gi,
    /media:content[^>]+medium=["']image["'][^>]+url=["'](https?:\/\/[^"']+)["']/gi,
    /media:content[^>]+url=["'](https?:\/\/[^"']+)["']/gi,
    /<enclosure[^>]+type=["']image[^"']*["'][^>]+url=["'](https?:\/\/[^"']+)["']/gi,
    /<enclosure[^>]+url=["'](https?:\/\/[^"']+\.(?:jpg|jpeg|png|webp|gif)[^"']*)["']/gi,
    /<img[^>]+src=["'](https?:\/\/[^"']+)["']/gi,
  ]
  for (const re of patterns) {
    let m
    while ((m = re.exec(src)) !== null) {
      const u = m[1].replace(/&amp;/g, '&')
      if (isValidImageUrl(u)) return u
    }
  }
  return null
}

function proxyImage(rawUrl) {
  if (!isValidImageUrl(rawUrl)) return null
  return `/.netlify/functions/astro-image-proxy?url=${encodeURIComponent(rawUrl)}`
}

function toItemFields(urlToImage) {
  if (!isValidImageUrl(urlToImage)) {
    return { urlToImage: null, imagem: null, thumbnail: null, image_url: null }
  }
  const proxied = proxyImage(urlToImage)
  return {
    urlToImage,
    thumbnail: urlToImage,
    image_url: urlToImage,
    imagem: proxied,
  }
}

function extractOgFromHtml(html) {
  const patterns = [
    /<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/gi,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["']/gi,
    /<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["']/gi,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image(?::src)?["']/gi,
    /<link[^>]+rel=["']image_src["'][^>]+href=["']([^"']+)["']/gi,
  ]
  for (const re of patterns) {
    let m
    while ((m = re.exec(html)) !== null) {
      const u = m[1].replace(/&amp;/g, '&')
      if (isValidImageUrl(u)) return u
    }
  }

  const jsonLdBlocks = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || []
  for (const block of jsonLdBlocks) {
    const inner = block.replace(/<\/?script[^>]*>/gi, '')
    try {
      const data = JSON.parse(inner)
      const nodes = Array.isArray(data) ? data : [data]
      for (const node of nodes) {
        const img = node?.image?.url || node?.image?.[0]?.url || node?.image?.[0] || node?.thumbnailUrl || node?.thumbnail?.url
        if (typeof img === 'string' && isValidImageUrl(img)) return img
      }
    } catch { /* ignore invalid json-ld */ }
  }

  const articleImg = html.match(/<img[^>]+class=["'][^"']*(?:article|featured|hero|post)[^"']*["'][^>]+src=["'](https?:\/\/[^"']+)["']/i)
  if (articleImg?.[1] && isValidImageUrl(articleImg[1])) return articleImg[1].replace(/&amp;/g, '&')

  const anyImg = html.match(/<img[^>]+src=["'](https?:\/\/[^"']+\.(?:jpg|jpeg|png|webp)[^"']*)["']/i)
  if (anyImg?.[1] && isValidImageUrl(anyImg[1])) return anyImg[1].replace(/&amp;/g, '&')

  return null
}

const FETCH_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'pt-PT,pt;q=0.9,en;q=0.8',
}

const BATCH_EXECUTE = 'https://news.google.com/_/DotsSplashUi/data/batchexecute'

function isGoogleNewsUrl(url) {
  return typeof url === 'string' && url.includes('news.google.com') && url.includes('/articles/')
}

/** Resolve Google News article URL → URL do editor (batchexecute). */
async function decodeGoogleNewsArticleUrl(articleUrl) {
  if (!isGoogleNewsUrl(articleUrl)) return articleUrl
  try {
    const articleId = articleUrl.split('/').pop()?.split('?')[0]
    if (!articleId) return null

    const pageRes = await fetch(articleUrl, {
      headers: FETCH_HEADERS,
      redirect: 'follow',
      signal: AbortSignal.timeout(7000),
    })
    const pageText = await pageRes.text()
    const sigMatch = pageText.match(/data-n-a-sg="([^"]+)"/)
    const tsMatch = pageText.match(/data-n-a-ts="([^"]+)"/)
    if (!sigMatch || !tsMatch) return null

    const rpcInner = JSON.stringify([
      'garturlreq',
      [
        ['X', 'X', ['X', 'X'], null, null, 1, 1, 'US:en', null, 1,
          null, null, null, null, null, 0, 1],
        'X', 'X', 1, [1, 1, 1], 1, 1, null, 0, 0, null, 0,
      ],
      articleId,
      parseInt(tsMatch[1], 10),
      sigMatch[1],
    ])
    const fReq = JSON.stringify([[['Fbv4je', rpcInner, null, 'generic']]])

    const postRes = await fetch(BATCH_EXECUTE, {
      method: 'POST',
      headers: {
        ...FETCH_HEADERS,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        Referer: 'https://news.google.com/',
      },
      body: new URLSearchParams({ 'f.req': fReq }).toString(),
      signal: AbortSignal.timeout(7000),
    })
    let body = await postRes.text()
    if (body.startsWith(")]}'")) {
      const lines = body.split('\n')
      body = lines.slice(1).join('\n').replace(/^\d+\n/, '')
    }
    const jsonLine = body.split('\n').find((l) => l.startsWith('[[')) || body.trim()
    const envelopes = JSON.parse(jsonLine)
    for (const env of envelopes) {
      if (Array.isArray(env) && env[0] === 'wrb.fr' && env[1] === 'Fbv4je' && env[2]) {
        const payload = JSON.parse(env[2])
        if (payload?.[0] === 'garturlres' && typeof payload[1] === 'string' && payload[1].startsWith('http')) {
          return payload[1]
        }
      }
    }
  } catch { /* decode falhou */ }
  return null
}

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: FETCH_HEADERS,
    redirect: 'follow',
    signal: AbortSignal.timeout(7000),
  })
  if (!res.ok) return { html: null, finalUrl: url }
  return { html: await res.text(), finalUrl: res.url || url }
}

async function fetchArticleImage(pageUrl) {
  if (!pageUrl?.startsWith('http')) return null
  try {
    let targetUrl = pageUrl
    if (isGoogleNewsUrl(pageUrl)) {
      const decoded = await decodeGoogleNewsArticleUrl(pageUrl)
      if (decoded) targetUrl = decoded
    }

    const { html, finalUrl } = await fetchHtml(targetUrl)
    if (html) {
      const fromPublisher = extractOgFromHtml(html)
      if (fromPublisher && !fromPublisher.includes('googleusercontent.com')) return fromPublisher
      if (fromPublisher) return fromPublisher
    }

    if (isGoogleNewsUrl(pageUrl) && targetUrl === pageUrl) {
      const { html: gHtml } = await fetchHtml(pageUrl)
      if (gHtml) return extractOgFromHtml(gHtml)
    }

    if (finalUrl && finalUrl !== targetUrl && !finalUrl.includes('news.google.com')) {
      const { html: html2 } = await fetchHtml(finalUrl)
      if (html2) return extractOgFromHtml(html2)
    }
    return null
  } catch {
    return null
  }
}

function parseRssItems(xml, max, tag, locale) {
  const items = []
  const blocks = xml.split(/<item[\s>]/i).slice(1)

  for (const raw of blocks) {
    if (items.length >= max) break
    const block = `<item ${raw}`
    const title = cleanTitle(extractTag(block, 'title'))
    const link = extractTag(block, 'link').trim()
    const pubDate = extractTag(block, 'pubDate')
    const descRaw = extractTag(block, 'description')
    const description = cleanText(descRaw).slice(0, 200)
    if (!title || !isAstroNews(title, description)) continue

    const rssImage = extractImageFromRss(block, descRaw)
    const imgFields = toItemFields(rssImage)

    items.push({
      tag,
      texto: title,
      resumo: description,
      hora: pubDate ? new Date(pubDate).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }) : null,
      url: link || null,
      ...imgFields,
    })
  }
  return items
}

async function fetchFeed(feed, max, locale) {
  try {
    const res = await fetch(feed.url, {
      headers: { 'User-Agent': 'SidusAstro/1.0 (astro-news)' },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return []
    return parseRssItems(await res.text(), max, feed.tag, locale)
  } catch {
    return []
  }
}

function dedupeItems(items) {
  const seen = new Set()
  return items.filter((item) => {
    const key = item.texto.toLowerCase().replace(/\W+/g, '').slice(0, 50)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function interleaveByTag(items) {
  const buckets = {}
  for (const item of items) {
    if (!buckets[item.tag]) buckets[item.tag] = []
    buckets[item.tag].push(item)
  }
  const tags = Object.keys(buckets)
  const out = []
  let i = 0
  while (out.length < items.length) {
    const tag = tags[i % tags.length]
    const next = buckets[tag]?.shift()
    if (next) out.push(next)
    i += 1
    if (tags.every((t) => !buckets[t]?.length)) break
  }
  return out
}

async function enrichOne(item) {
  if (item.urlToImage) return item
  if (!item.url) return { ...item, ...toItemFields(null) }
  const fetched = await fetchArticleImage(item.url)
  return { ...item, ...toItemFields(fetched) }
}

/** Paralelo (8 de cada vez) — og:image Google News + publisher. */
async function enrichImages(items) {
  const CONCURRENCY = 4
  const out = new Array(items.length)
  for (let i = 0; i < items.length; i += CONCURRENCY) {
    const batch = items.slice(i, i + CONCURRENCY)
    const results = await Promise.all(batch.map(enrichOne))
    results.forEach((r, j) => { out[i + j] = r })
  }
  return out
}

export default async (req) => {
  const url = new URL(req.url)
  const lang = url.searchParams.get('lang') || 'pt'
  const max = Math.min(Number(url.searchParams.get('max')) || 25, 30)
  const today = new Date().toISOString().slice(0, 10)
  const locale = RSS_HL[lang] || RSS_HL.en

  try {
    const feeds = feedsForLang(lang)
    const batches = await Promise.all(feeds.map((f) => fetchFeed(f, 12, locale)))
    let items = interleaveByTag(dedupeItems(batches.flat())).slice(0, max)
    items = await enrichImages(items)

    return new Response(JSON.stringify({
      items,
      source: 'astro-mixed-rss',
      date: today,
      fetchedAt: new Date().toISOString(),
      imageField: 'urlToImage',
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=900, s-maxage=900',
      },
    })
  } catch (err) {
    return new Response(JSON.stringify({ items: [], error: String(err.message || err), date: today }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
