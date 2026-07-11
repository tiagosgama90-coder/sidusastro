/** RSS astrologia/horóscopo — fontes PT + internacionais, imagens reais por artigo. */

const RSS_HL = {
  pt: 'pt-PT', en: 'en-GB', es: 'es-ES', it: 'it-IT', de: 'de-DE', fr: 'fr-FR',
}

/** Título/descrição deve conter astrologia ou horóscopo (estrito). */
const ASTRO_STRICT = /(?:astrolog|hor[oó]scop|zod[ií]ac|signo\s+solar|previs(?:ão|ões)\s+(?:astrol|diária|semanal)|mapa\s+astral|cart[a]?\s+astral|lua\s+(?:nova|cheia|minguante)|trânsit|transit|mercury\s+retrograde|mercúrio\s+retrógrado)/i

const REJECT_GENERIC = /(?:futebol|desporto|sport|pol[ií]tica|guerra|elei[cç]|receita\s+de|recipe|bolsa|crypto|bitcoin|crime|morte\s+de|nascimento\s+de\s+beb)/i

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=240&fit=crop&q=80',
  'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=240&fit=crop&q=80',
  'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=400&h=240&fit=crop&q=80',
  'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=400&h=240&fit=crop&q=80',
  'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=400&h=240&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&h=240&fit=crop&q=80',
  'https://images.unsplash.com/photo-1532692760748-279ddad41a82?w=400&h=240&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506443432602-ac2fcd6f54e0?w=400&h=240&fit=crop&q=80',
]

function hashStr(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

function googleNewsUrl(query, hl, gl) {
  const ceid = `${gl}:${hl.split('-')[0]}`
  return `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=${hl}&gl=${gl}&ceid=${ceid}`
}

/** Fontes mistas PT + internacional (sempre para lang=pt). */
function feedsForLang(lang) {
  const hl = RSS_HL[lang] || RSS_HL.en
  const gl = lang === 'pt' ? 'PT' : lang === 'es' ? 'ES' : lang === 'de' ? 'DE' : lang === 'fr' ? 'FR' : lang === 'it' ? 'IT' : 'GB'

  const astroQuery = '(astrologia OR horóscopo OR horóscopo+dia OR zodíaco OR "mapa astral")'
  const intlQuery = '(astrology OR horoscope OR zodiac OR "daily horoscope")'

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

function extractTag(block, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i')
  const m = block.match(re)
  return m ? decodeXml(m[1]) : ''
}

function extractImage(block, description) {
  const src = `${block} ${description || ''}`
  const patterns = [
    /media:thumbnail[^>]+url=["'](https?:\/\/[^"']+)["']/gi,
    /media:content[^>]+url=["'](https?:\/\/[^"']+)["']/gi,
    /<enclosure[^>]+url=["'](https?:\/\/[^"']+)["']/gi,
    /<img[^>]+src=["'](https?:\/\/[^"']+)["']/gi,
  ]
  for (const re of patterns) {
    let m
    while ((m = re.exec(src)) !== null) {
      const u = m[1]
      if (u && !u.includes('favicon') && !u.includes('pixel') && !u.includes('1x1') && !u.includes('logo')) {
        return u.replace(/&amp;/g, '&')
      }
    }
  }
  return null
}

function proxyImage(rawUrl, seed) {
  if (!rawUrl) return null
  return `/.netlify/functions/astro-image-proxy?url=${encodeURIComponent(rawUrl)}&seed=${seed}`
}

async function resolveArticleUrl(url) {
  if (!url?.startsWith('http')) return url
  try {
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html',
      },
      signal: AbortSignal.timeout(4000),
    })
    return res.url || url
  } catch {
    return url
  }
}

async function fetchOgImage(pageUrl) {
  const finalUrl = await resolveArticleUrl(pageUrl)
  if (!finalUrl?.startsWith('http')) return null
  try {
    const res = await fetch(finalUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) return null
    const html = (await res.text()).slice(0, 150000)
    const patterns = [
      /<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["']/i,
      /<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i,
    ]
    for (const re of patterns) {
      const m = html.match(re)
      if (m?.[1] && !m[1].includes('favicon') && !m[1].includes('logo')) {
        return m[1].replace(/&amp;/g, '&')
      }
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

    const rawImg = extractImage(block, descRaw)
    const seed = hashStr(link || title)
    items.push({
      tag,
      texto: title,
      resumo: description,
      hora: pubDate ? new Date(pubDate).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }) : null,
      imagem: rawImg ? proxyImage(rawImg, seed) : null,
      imagemOriginal: rawImg,
      url: link || null,
      seed,
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

/** Intercalar tags diferentes para misturar fontes. */
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

async function enrichImages(items) {
  const out = []
  for (const item of items) {
    if (item.imagem) {
      out.push(item)
      continue
    }
    const og = item.url ? await fetchOgImage(item.url) : null
    if (og) {
      out.push({ ...item, imagem: proxyImage(og, item.seed) })
    } else {
      const fb = FALLBACK_IMAGES[item.seed % FALLBACK_IMAGES.length]
      out.push({ ...item, imagem: proxyImage(fb, item.seed) })
    }
  }
  return out.map(({ imagemOriginal, seed, ...rest }) => rest)
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
