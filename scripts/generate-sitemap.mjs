import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
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

/** Rotas públicas indexáveis (SPA + estáticas). */
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

function langPath(path, lang) {
  if (path === '/') return `/${lang}/`
  return `/${lang}${path}`
}

function alternateLinks(path, { includeEnHoroscope = false } = {}) {
  const lines = LANGS.map(({ code, hreflang }) => {
    let href = `${BASE}${langPath(path, code)}`
    if (includeEnHoroscope && code === 'en' && path === '/horoscopo') {
      href = `${BASE}/en/horoscope`
    }
    return `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${href}"/>`
  })
  const xDefault = path === '/horoscopo'
    ? `${BASE}/horoscopo`
    : `${BASE}${path === '/' ? '/' : path}`
  lines.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${xDefault}"/>`)
  return lines.join('\n')
}

function urlEntry(loc, { priority, changefreq, alternates = '' }) {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${LASTMOD}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
${alternates}
  </url>`
}

const entries = []

for (const route of SPA_ROUTES) {
  const alts = alternateLinks(route.path, { includeEnHoroscope: true })
  entries.push(urlEntry(`${BASE}${route.path === '/' ? '/' : route.path}`, {
    priority: route.priority,
    changefreq: route.changefreq,
    alternates: alts,
  }))

  for (const { code } of LANGS) {
    let loc = `${BASE}${langPath(route.path, code)}`
    if (route.path === '/horoscopo' && code === 'en') {
      loc = `${BASE}/en/horoscope`
    }
    entries.push(urlEntry(loc, {
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
  const guideAlts = LANGS.map(({ code, hreflang }) =>
    `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${loc}${code === 'pt' ? '' : `?lang=${code}`}"/>`
  ).join('\n') + `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${loc}"/>`

  entries.push(urlEntry(loc, {
    priority: guide.priority,
    changefreq: guide.changefreq,
    alternates: guideAlts,
  }))

  for (const { code } of LANGS) {
    if (code === 'pt') continue
    entries.push(urlEntry(`${loc}?lang=${code}`, {
      priority: guide.priority - 0.03,
      changefreq: guide.changefreq,
      alternates: guideAlts,
    }))
  }
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`

const out = join(__dirname, '..', 'public', 'sitemap.xml')
writeFileSync(out, xml, 'utf8')
console.log(`Wrote ${entries.length} URLs to public/sitemap.xml`)
