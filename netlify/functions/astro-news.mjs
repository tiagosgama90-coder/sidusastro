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

function decodeXml(str) {
  return String(str || '')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim()
}

function extractTag(block, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i')
  const m = block.match(re)
  return m ? decodeXml(m[1]) : ''
}

function extractImage(block) {
  const media = block.match(/url="(https?:\/\/[^"]+)"/i)
  if (media) return media[1]
  const enclosure = block.match(/<enclosure[^>]+url="(https?:\/\/[^"]+)"/i)
  if (enclosure) return enclosure[1]
  const img = block.match(/<img[^>]+src="(https?:\/\/[^"]+)"/i)
  return img ? img[1] : null
}

function parseRssItems(xml, max) {
  const items = []
  const blocks = xml.split(/<item[\s>]/i).slice(1)
  for (const raw of blocks) {
    if (items.length >= max) break
    const block = `<item ${raw}`
    const title = extractTag(block, 'title')
    const link = extractTag(block, 'link')
    const pubDate = extractTag(block, 'pubDate')
    const description = extractTag(block, 'description').replace(/<[^>]+>/g, '').slice(0, 220)
    if (!title) continue
    items.push({
      tag: 'Astrologia',
      texto: title,
      resumo: description,
      hora: pubDate ? new Date(pubDate).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }) : null,
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
    const items = parseRssItems(xml, max)
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
