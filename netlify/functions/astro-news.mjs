/** RSS de notícias reais sobre astrologia (Google News). */

const RSS_QUERIES = {
  pt: 'astrologia',
  en: 'astrology',
  es: 'astrología',
  it: 'astrologia',
  de: 'Astrologie',
  fr: 'astrologie',
}

const RSS_HL = {
  pt: 'pt-PT', en: 'en-GB', es: 'es-ES', it: 'it-IT', de: 'de-DE', fr: 'fr-FR',
}

const TAG_BY_LANG = {
  pt: 'Astrologia', en: 'Astrology', es: 'Astrología', it: 'Astrologia', de: 'Astrologie', fr: 'Astrologie',
}

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&h=300&fit=crop',
]

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
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&hellip;/g, '…')
    .trim()
}

function cleanText(str) {
  return decodeXml(str)
    .replace(/<[^>]+>/g, '')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function cleanTitle(title) {
  let t = cleanText(title)
  t = t.replace(/\s[-–—|]\s+[A-Za-zÀ-ÿ0-9][^]*$/, '').trim()
  t = t.replace(/\s{2,}[A-Za-zÀ-ÿ][\wÀ-ÿ.-]{2,20}$/, '').trim()
  return t
}

function extractTag(block, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i')
  const m = block.match(re)
  return m ? decodeXml(m[1]) : ''
}

function extractImage(block) {
  const patterns = [
    /media:thumbnail[^>]+url="(https?:\/\/[^"]+)"/i,
    /media:content[^>]+url="(https?:\/\/[^"]+)"/i,
    /<enclosure[^>]+url="(https?:\/\/[^"]+)"/i,
    /<img[^>]+src="(https?:\/\/[^"]+)"/i,
  ]
  for (const re of patterns) {
    const m = block.match(re)
    if (m?.[1] && !m[1].includes('google.com/s2/favicons')) return m[1]
  }
  return null
}

async function fetchOgImage(pageUrl, timeoutMs = 2500) {
  if (!pageUrl || !pageUrl.startsWith('http')) return null
  try {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), timeoutMs)
    const res = await fetch(pageUrl, {
      signal: ctrl.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SidusAstro/1.0; +https://sidusastro.com)',
        Accept: 'text/html',
      },
      redirect: 'follow',
    })
    clearTimeout(timer)
    if (!res.ok) return null
    const html = (await res.text()).slice(0, 80000)
    const og = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)
    if (og?.[1]) return og[1].replace(/&amp;/g, '&')
    const tw = html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i)
    return tw?.[1]?.replace(/&amp;/g, '&') || null
  } catch {
    return null
  }
}

async function enrichImages(items) {
  const out = [...items]
  await Promise.all(
    out.map(async (item, i) => {
      if (item.imagem) return
      const og = await fetchOgImage(item.url)
      if (og) out[i] = { ...item, imagem: og }
      else out[i] = { ...item, imagem: FALLBACK_IMAGES[i % FALLBACK_IMAGES.length] }
    }),
  )
  return out
}

function parseRssItems(xml, max, lang) {
  const items = []
  const blocks = xml.split(/<item[\s>]/i).slice(1)
  const locale = RSS_HL[lang] || RSS_HL.en
  const tag = TAG_BY_LANG[lang] || TAG_BY_LANG.en

  for (const raw of blocks) {
    if (items.length >= max) break
    const block = `<item ${raw}`
    const titleRaw = extractTag(block, 'title')
    const title = cleanTitle(titleRaw)
    const link = extractTag(block, 'link').trim()
    const pubDate = extractTag(block, 'pubDate')
    const description = cleanText(extractTag(block, 'description')).slice(0, 220)
    if (!title) continue
    items.push({
      tag,
      texto: title,
      resumo: description,
      hora: pubDate ? new Date(pubDate).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }) : null,
      imagem: extractImage(block),
      url: link || null,
    })
  }
  return items
}

export default async (req) => {
  const url = new URL(req.url)
  const lang = url.searchParams.get('lang') || 'pt'
  const max = Math.min(Number(url.searchParams.get('max')) || 4, 8)
  const q = RSS_QUERIES[lang] || RSS_QUERIES.en
  const hl = RSS_HL[lang] || RSS_HL.en

  const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=${hl}&gl=US&ceid=US:${hl.split('-')[0]}`

  try {
    const res = await fetch(rssUrl, {
      headers: { 'User-Agent': 'SidusAstro/1.0 (astro-news)' },
    })
    if (!res.ok) throw new Error(`RSS ${res.status}`)
    const xml = await res.text()
    let items = parseRssItems(xml, max, lang)
    items = await enrichImages(items)
    return new Response(JSON.stringify({ items, source: 'google-news-rss', fetchedAt: new Date().toISOString() }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  } catch (err) {
    return new Response(JSON.stringify({ items: [], error: String(err.message || err) }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
