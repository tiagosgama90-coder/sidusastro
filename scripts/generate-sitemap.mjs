import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PUBLIC = join(__dirname, '..', 'public')
const BASE = 'https://sidusastro.com'
const LASTMOD = new Date().toISOString().slice(0, 10)

const LANGS = [
  { code: 'pt', hreflang: 'pt-PT' },
  { code: 'en', hreflang: 'en' },
  { code: 'es', hreflang: 'es' },
  { code: 'it', hreflang: 'it' },
  { code: 'de', hreflang: 'de' },
  { code: 'fr', hreflang: 'fr' },
]

const SPA_ROUTES = [
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  { path: '/login', priority: 0.98, changefreq: 'weekly' },
  { path: '/home', priority: 0.92, changefreq: 'weekly' },
  { path: '/tarot', priority: 0.9, changefreq: 'weekly' },
  { path: '/horoscopo', priority: 0.88, changefreq: 'daily' },
  { path: '/oraculo', priority: 0.88, changefreq: 'weekly' },
  { path: '/mapaastral', priority: 0.88, changefreq: 'monthly' },
  { path: '/sinastria', priority: 0.86, changefreq: 'weekly' },
  { path: '/bussola', priority: 0.85, changefreq: 'weekly' },
  { path: '/numerologia', priority: 0.84, changefreq: 'monthly' },
  { path: '/ferramentas', priority: 0.82, changefreq: 'monthly' },
  { path: '/sonhos', priority: 0.8, changefreq: 'monthly' },
  { path: '/biorritmo', priority: 0.8, changefreq: 'monthly' },
  { path: '/horas-iguais', priority: 0.78, changefreq: 'monthly' },
  { path: '/diario', priority: 0.78, changefreq: 'weekly' },
  { path: '/vip', priority: 0.76, changefreq: 'monthly' },
  { path: '/privacidade', priority: 0.5, changefreq: 'yearly' },
  { path: '/comecar', priority: 0.7, changefreq: 'monthly' },
]

const STATIC_PAGES = [
  { path: '/privacy.html', priority: 0.48, changefreq: 'yearly' },
]

const GUIDES = [
  { path: '/guia/mapa-astral.html', priority: 0.92, changefreq: 'monthly' },
  { path: '/guia/ascendente.html', priority: 0.9, changefreq: 'monthly' },
  { path: '/guia/signos-zodiaco.html', priority: 0.9, changefreq: 'monthly' },
  { path: '/guia/tarot-guia.html', priority: 0.88, changefreq: 'monthly' },
]

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function langPath(path, lang) {
  if (path === '/') return `/${lang}/`
  return `/${lang}${path}`
}

function locForRoute(path, lang) {
  if (path === '/horoscopo' && lang === 'en') return `${BASE}/en/horoscope`
  if (path === '/') return lang ? `${BASE}${langPath(path, lang)}` : `${BASE}/`
  return lang ? `${BASE}${langPath(path, lang)}` : `${BASE}${path}`
}

function alternateLinks(path) {
  const lines = LANGS.map(({ code, hreflang }) =>
    `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${escapeXml(locForRoute(path, code))}"/>`
  )
  const xDefault = path === '/horoscopo' ? `${BASE}/horoscopo` : locForRoute(path, null)
  lines.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(xDefault)}"/>`)
  return lines.join('\n')
}

function urlEntry(loc, { priority, changefreq, alternates = '' }) {
  const altBlock = alternates ? `\n${alternates}` : ''
  return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${LASTMOD}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${altBlock}
  </url>`
}

const entries = []

for (const route of SPA_ROUTES) {
  const alts = alternateLinks(route.path)
  entries.push(urlEntry(locForRoute(route.path, null), {
    priority: route.priority,
    changefreq: route.changefreq,
    alternates: alts,
  }))

  for (const { code } of LANGS) {
    entries.push(urlEntry(locForRoute(route.path, code), {
      priority: Math.max(0.4, route.priority - 0.05),
      changefreq: route.changefreq,
      alternates: alts,
    }))
  }
}

for (const page of STATIC_PAGES) {
  entries.push(urlEntry(`${BASE}${page.path}`, {
    priority: page.priority,
    changefreq: page.changefreq,
  }))
}

for (const guide of GUIDES) {
  const loc = `${BASE}${guide.path}`
  entries.push(urlEntry(loc, {
    priority: guide.priority,
    changefreq: guide.changefreq,
  }))
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`

writeFileSync(join(PUBLIC, 'sitemap.xml'), xml, 'utf8')
console.log(`Wrote sitemap.xml with ${entries.length} URLs`)
