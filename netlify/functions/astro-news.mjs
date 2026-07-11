/** RSS de notícias astrológicas — SAPO, Google News PT e outras fontes. */

const RSS_HL = {
  pt: 'pt-PT', en: 'en-GB', es: 'es-ES', it: 'it-IT', de: 'de-DE', fr: 'fr-FR',
}

const TAG_BY_LANG = {
  pt: 'Astrologia', en: 'Astrology', es: 'Astrología', it: 'Astrologia', de: 'Astrologie', fr: 'Astrologie',
}

const ASTRO_KEYWORDS = /astrolog|hor[oó]scop|zodi|lua|signo|cosmo|tarot|mapa astral/i

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=320&h=200&fit=crop',
  'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=320&h=200&fit=crop',
  'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=320&h=200&fit=crop',
  'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=320&h=200&fit=crop',
  'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=320&h=200&fit=crop',
]

function feedsForLang(lang) {
  const hl = RSS_HL[lang] || RSS_HL.en
  const gl = lang === 'pt' ? 'PT' : lang === 'es' ? 'ES' : lang === 'de' ? 'DE' : lang === 'fr' ? 'FR' : lang === 'it' ? 'IT' : 'GB'
  const ceid = `${gl}:${hl.split('-')[0]}`

  if (lang === 'pt') {
    return [
      { url: `https://news.google.com/rss/search?q=astrologia+site:sapo.pt&hl=${hl}&gl=${gl}&ceid=${ceid}`, tag: 'SAPO', filter: false },
      { url: `https://news.google.com/rss/search?q=horóscopo+site:sapo.pt&hl=${hl}&gl=${gl}&ceid=${ceid}`, tag: 'SAPO', filter: false },
      { url: `https://news.google.com/rss/search?q=astrologia+site:expresso.pt&hl=${hl}&gl=${gl}&ceid=${ceid}`, tag: 'Expresso', filter: false },
      { url: `https://news.google.com/rss/search?q=astrologia&hl=${hl}&gl=${gl}&ceid=${ceid}`, tag: 'Astrologia', filter: false },
      { url: 'https://lifestyle.sapo.pt/rss', tag: 'SAPO', filter: true },
    ]
  }

  const q = { en: 'astrology', es: 'astrología', it: 'astrologia', de: 'Astrologie', fr: 'astrologie' }[lang] || 'astrology'
  return [
    { url: `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=${hl}&gl=${gl}&ceid=${ceid}`, tag: TAG_BY_LANG[lang], filter: false },
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
    .replace(/&rsquo;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .trim()
}

function cleanText(str) {
  return decodeXml(str)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\u00a0/g, ' ')
    .replace(/—/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
}

function cleanTitle(title) {
  let t = cleanText(title)
  t = t.replace(/\s[-–—|]\s+[A-Za-zÀ-ÿ0-9][\wÀ-ÿ\s.&]{1,30}$/, '').trim()
  return t
}

function extractTag(block, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i')
  const m = block.match(re)
  return m ? decodeXml(m[1]) : ''
}

function extractImage(block, description) {
  const patterns = [
    /media:thumbnail[^>]+url=["'](https?:\/\/[^"']+)["']/i,
    /media:content[^>]+url=["'](https?:\/\/[^"']+)["']/i,
    /<enclosure[^>]+url=["'](https?:\/\/[^"']+)["']/i,
    /<img[^>]+src=["'](https?:\/\/[^"']+)["']/i,
  ]
  for (const re of patterns) {
    const m = block.match(re) || String(description || '').match(re)
    if (m?.[1] && !m[1].includes('favicon') && !m[1].includes('pixel')) return m[1]
  }
  return null
}

function proxyImage(rawUrl) {
  if (!rawUrl) return null
  return `/.netlify/functions/astro-image-proxy?url=${encodeURIComponent(rawUrl)}`
}

async function fetchOgImage(pageUrl, timeoutMs = 3000) {
  if (!pageUrl?.startsWith('http')) return null
  try {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), timeoutMs)
    const res = await fetch(pageUrl, {
      signal: ctrl.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
      },
      redirect: 'follow',
    })
    clearTimeout(timer)
    if (!res.ok) return null
    const html = (await res.text()).slice(0, 120000)
    const patterns = [
      /<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["']/i,
      /<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["']/i,
      /<link[^>]+rel=["']image_src["'][^>]+href=["']([^"']+)["']/i,
    ]
    for (const re of patterns) {
      const m = html.match(re)
      if (m?.[1] && !m[1].includes('favicon')) return m[1].replace(/&amp;/g, '&')
    }
    return null
  } catch {
    return null
  }
}

function parseRssItems(xml, max, lang, tagOverride, filterAstro) {
  const items = []
  const locale = RSS_HL[lang] || RSS_HL.en
  const defaultTag = tagOverride || TAG_BY_LANG[lang] || TAG_BY_LANG.en
  const blocks = xml.split(/<item[\s>]/i).slice(1)

  for (const raw of blocks) {
    if (items.length >= max) break
    const block = `<item ${raw}`
    const title = cleanTitle(extractTag(block, 'title'))
    const link = extractTag(block, 'link').trim()
    const pubDate = extractTag(block, 'pubDate')
    const descRaw = extractTag(block, 'description')
    const description = cleanText(descRaw).slice(0, 180)
    if (!title) continue
    if (filterAstro && !ASTRO_KEYWORDS.test(`${title} ${description}`)) continue

    const rawImg = extractImage(block, descRaw)
    items.push({
      tag: defaultTag,
      texto: title,
      resumo: description,
      hora: pubDate ? new Date(pubDate).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }) : null,
      imagemRaw: rawImg,
      imagem: rawImg ? proxyImage(rawImg) : null,
      url: link || null,
    })
  }
  return items
}

async function fetchFeed(feed, lang, max) {
  try {
    const res = await fetch(feed.url, {
      headers: { 'User-Agent': 'SidusAstro/1.0 (astro-news)' },
    })
    if (!res.ok) return []
    const xml = await res.text()
    return parseRssItems(xml, max, lang, feed.tag, feed.filter)
  } catch {
    return []
  }
}

function dedupeItems(items) {
  const seen = new Set()
  return items.filter((item) => {
    const key = item.texto.toLowerCase().slice(0, 60)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

async function enrichImages(items) {
  const out = [...items]
  await Promise.all(
    out.map(async (item, i) => {
      if (item.imagem) return
      const og = await fetchOgImage(item.url)
      if (og) {
        out[i] = { ...item, imagemRaw: og, imagem: proxyImage(og) }
      } else {
        out[i] = { ...item, imagem: proxyImage(FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]) }
      }
    }),
  )
  return out.map(({ imagemRaw, ...rest }) => rest)
}

export default async (req) => {
  const url = new URL(req.url)
  const lang = url.searchParams.get('lang') || 'pt'
  const max = Math.min(Number(url.searchParams.get('max')) || 20, 30)
  const today = new Date().toISOString().slice(0, 10)

  try {
    const feeds = feedsForLang(lang)
    const batches = await Promise.all(feeds.map((f) => fetchFeed(f, lang, max)))
    let items = dedupeItems(batches.flat()).slice(0, max)
    items = await enrichImages(items)

    return new Response(JSON.stringify({
      items,
      source: 'sapo-google-rss',
      date: today,
      fetchedAt: new Date().toISOString(),
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=1800, s-maxage=1800',
      },
    })
  } catch (err) {
    return new Response(JSON.stringify({ items: [], error: String(err.message || err), date: today }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
