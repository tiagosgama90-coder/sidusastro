(function () {
  const LANGS = ['pt', 'en', 'es', 'it', 'de', 'fr']
  const FLAG_CODES = { pt: 'PT', en: 'GB', es: 'ES', it: 'IT', de: 'DE', fr: 'FR' }
  const TITLES = {
    pt: 'Português', en: 'English', es: 'Español', it: 'Italiano', de: 'Deutsch', fr: 'Français',
  }
  const STORAGE_KEY = 'sidus_lang'
  const GUIA_VERSION = '20260717f'
  const ZODIAC = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓']
  const NAV_KEYS = ['mapa', 'ascendente', 'signos', 'tarot']
  const GUIDE_SEQUENCE = [
    { id: 'mapa-astral', href: '/guia/mapa-astral.html', navKey: 'mapa' },
    { id: 'ascendente', href: '/guia/ascendente.html', navKey: 'ascendente' },
    { id: 'signos-zodiaco', href: '/guia/signos-zodiaco.html', navKey: 'signos' },
    { id: 'tarot-guia', href: '/guia/tarot-guia.html', navKey: 'tarot' },
  ]
  const RELATED_GUIDES = {
    'mapa-astral': [
      { href: '/guia/ascendente.html', navKey: 'ascendente' },
      { href: '/guia/signos-zodiaco.html', navKey: 'signos' },
      { href: '/guia/tarot-guia.html', navKey: 'tarot' },
    ],
    'ascendente': [
      { href: '/guia/mapa-astral.html', navKey: 'mapa' },
      { href: '/guia/signos-zodiaco.html', navKey: 'signos' },
      { href: '/guia/tarot-guia.html', navKey: 'tarot' },
    ],
    'signos-zodiaco': [
      { href: '/guia/mapa-astral.html', navKey: 'mapa' },
      { href: '/guia/ascendente.html', navKey: 'ascendente' },
      { href: '/guia/tarot-guia.html', navKey: 'tarot' },
    ],
    'tarot-guia': [
      { href: '/guia/mapa-astral.html', navKey: 'mapa' },
      { href: '/guia/ascendente.html', navKey: 'ascendente' },
      { href: '/guia/signos-zodiaco.html', navKey: 'signos' },
    ],
  }

  function getPageId() {
    return document.body.getAttribute('data-guia-page') || ''
  }

  function getLang() {
    const params = new URLSearchParams(window.location.search)
    const fromUrl = params.get('lang')
    if (fromUrl && LANGS.includes(fromUrl)) return fromUrl
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored && LANGS.includes(stored)) return stored
    } catch { /* private mode */ }
    return 'pt'
  }

  function syncLangUrl(code) {
    try {
      const url = new URL(window.location.href)
      if (code === 'pt') url.searchParams.delete('lang')
      else url.searchParams.set('lang', code)
      window.history.replaceState({}, '', url)
    } catch { /* ignore */ }
  }

  function loginHref(lang) {
    if (!lang || lang === 'pt') return '/login'
    return `/${lang}/login`
  }

  function landingHref(lang) {
    if (!lang || lang === 'pt') return '/login#guias'
    return `/${lang}/login#guias`
  }

  function flagImg(code, width) {
    const cc = FLAG_CODES[code] || 'PT'
    const w = width || 20
    const h = Math.round((w * 2) / 3)
    return `<img src="/flags/${cc}.svg" width="${w}" height="${h}" alt="" aria-hidden="true" class="guia-lang-flag-img" />`
  }

  function guideHref(path, lang) {
    if (!lang || lang === 'pt') return path
    return `${path}?lang=${lang}`
  }

  function setLang(code) {
    if (!LANGS.includes(code)) return
    try { localStorage.setItem(STORAGE_KEY, code) } catch { /* ignore */ }
    syncLangUrl(code)
    applyLang(code)
  }

  /** Estrela de 12 pontas ({12/5}) - um vértice por signo. */
  function dodecagramPaths(cx, cy, outerR) {
    const pts = []
    for (let i = 0; i < 12; i++) {
      const a = (i * 2 * Math.PI) / 12 - Math.PI / 2
      pts.push([cx + outerR * Math.cos(a), cy + outerR * Math.sin(a)])
    }
    return Array.from({ length: 12 }, (_, i) => {
      const j = (i + 5) % 12
      return `M ${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)} L ${pts[j][0].toFixed(1)} ${pts[j][1].toFixed(1)}`
    })
  }

  function seedStars(count, w, h) {
    const stars = []
    for (let i = 0; i < count; i++) {
      const r = Math.random()
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        rad: r > 0.97 ? 1.5 : r > 0.88 ? 1 : r > 0.6 ? 0.6 : 0.4,
        a: 0.3 + Math.random() * 0.7,
        tw: 0.003 + Math.random() * 0.008,
        ph: Math.random() * Math.PI * 2,
        drift: 0.06 + Math.random() * 0.22,
        tint: r > 0.92 ? 'gold' : r > 0.85 ? 'blue' : 'white',
      })
    }
    return stars
  }

  function spawnShootingStar(w, h) {
    const angle = Math.PI * 0.58 + (Math.random() - 0.5) * 0.22
    return {
      x: Math.random() * w * 1.15 - w * 0.05,
      y: -30 - Math.random() * h * 0.35,
      speed: 7 + Math.random() * 11,
      len: 70 + Math.random() * 130,
      angle,
      alpha: 0.9 + Math.random() * 0.1,
      width: 1.4 + Math.random() * 1.4,
    }
  }

  function drawShootingStar(ctx, meteor) {
    const tailX = meteor.x - Math.cos(meteor.angle) * meteor.len
    const tailY = meteor.y - Math.sin(meteor.angle) * meteor.len
    const grad = ctx.createLinearGradient(tailX, tailY, meteor.x, meteor.y)
    grad.addColorStop(0, 'rgba(255,255,255,0)')
    grad.addColorStop(0.55, `rgba(200,215,255,${meteor.alpha * 0.35})`)
    grad.addColorStop(0.85, `rgba(240,225,180,${meteor.alpha * 0.75})`)
    grad.addColorStop(1, `rgba(255,252,240,${meteor.alpha})`)
    ctx.strokeStyle = grad
    ctx.lineWidth = meteor.width
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(tailX, tailY)
    ctx.lineTo(meteor.x, meteor.y)
    ctx.stroke()
    ctx.fillStyle = `rgba(255,255,255,${meteor.alpha})`
    ctx.beginPath()
    ctx.arc(meteor.x, meteor.y, meteor.width * 1.1, 0, Math.PI * 2)
    ctx.fill()
  }

  function initCosmicBackground() {
    if (document.querySelector('.guia-cosmic-bg')) return

    const root = document.createElement('div')
    root.className = 'guia-cosmic-bg'
    root.setAttribute('aria-hidden', 'true')

    const canvas = document.createElement('canvas')
    canvas.className = 'guia-cosmic-canvas'

    const nebula = document.createElement('div')
    nebula.className = 'guia-cosmic-nebula'

    const wrap = document.createElement('div')
    wrap.className = 'guia-cosmic-hendecagram-wrap'

    const paths = dodecagramPaths(200, 200, 118)
    const zodiacNodes = ZODIAC.map((sym, i) => {
      const a = (i * 2 * Math.PI) / 12 - Math.PI / 2
      const r = 158
      return { sym, x: 200 + r * Math.cos(a), y: 200 + r * Math.sin(a), i }
    })

    const pathEls = paths.map((d) =>
      `<path d="${d}" fill="none" stroke="rgba(240,210,150,0.72)" stroke-width="1.5" stroke-linecap="round" filter="url(#guiaStarGlow)" />`
    ).join('')
    const zodiacEls = zodiacNodes.map(({ sym, x, y, i }) =>
      `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><g class="guia-cosmic-zodiac-upright"><text x="0" y="0" text-anchor="middle" dominant-baseline="central" class="guia-cosmic-zodiac" style="animation-delay:${i * 0.35}s" filter="url(#guiaZodiacGlow)">${sym}</text></g></g>`
    ).join('')

    wrap.innerHTML = `
      <svg class="guia-cosmic-hendecagram" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="guiaHendecGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="rgba(223,183,108,0.38)" />
            <stop offset="45%" stop-color="rgba(167,139,250,0.22)" />
            <stop offset="100%" stop-color="rgba(3,8,24,0)" />
          </radialGradient>
          <filter id="guiaStarGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="guiaZodiacGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx="200" cy="200" r="185" fill="url(#guiaHendecGlow)" />
        <circle cx="200" cy="200" r="128" fill="none" stroke="rgba(223,183,108,0.18)" stroke-width="1" />
        <g class="guia-cosmic-star-lines">${pathEls}</g>
        <circle cx="200" cy="200" r="48" fill="none" stroke="rgba(223,183,108,0.42)" stroke-width="1.1" />
        <circle cx="200" cy="200" r="8" fill="rgba(223,183,108,0.35)" />
        <g class="guia-cosmic-zodiac-ring">${zodiacEls}</g>
      </svg>`

    root.appendChild(canvas)
    root.appendChild(nebula)
    root.appendChild(wrap)
    document.body.insertBefore(root, document.body.firstChild)
    document.body.classList.add('guia-has-cosmic-bg')

    const ctx = canvas.getContext('2d')
    let stars = []
    let shooters = []
    let spawnCooldown = 40 + Math.floor(Math.random() * 80)
    let raf = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      stars = seedStars(Math.floor((w * h) / 3200), w, h)
      shooters = []
    }

    const draw = (t) => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      ctx.clearRect(0, 0, w, h)

      for (const s of stars) {
        s.y += s.drift
        if (s.y > h + 3) {
          s.y = -3
          s.x = Math.random() * w
        }
        const twinkle = 0.55 + 0.45 * Math.sin(t * s.tw + s.ph)
        const alpha = s.a * twinkle
        if (s.tint === 'gold') ctx.fillStyle = `rgba(223,183,108,${alpha * 0.9})`
        else if (s.tint === 'blue') ctx.fillStyle = `rgba(180,210,255,${alpha * 0.95})`
        else ctx.fillStyle = `rgba(255,255,255,${alpha})`
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.rad, 0, Math.PI * 2)
        ctx.fill()
      }

      spawnCooldown -= 1
      if (spawnCooldown <= 0) {
        shooters.push(spawnShootingStar(w, h))
        spawnCooldown = 70 + Math.floor(Math.random() * 140)
      }

      shooters = shooters.filter((meteor) => {
        meteor.x += Math.cos(meteor.angle) * meteor.speed
        meteor.y += Math.sin(meteor.angle) * meteor.speed
        meteor.alpha *= 0.988
        if (meteor.y > h + 80 || meteor.x > w + 120 || meteor.alpha < 0.04) return false
        drawShootingStar(ctx, meteor)
        return true
      })

      raf = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    raf = requestAnimationFrame(draw)
  }

  function initLanguageSwitcher(currentLang) {
    let root = document.getElementById('guia-lang-switcher')
    if (!root) {
      root = document.createElement('div')
      root.id = 'guia-lang-switcher'
      root.className = 'guia-lang-switcher-root'
      document.body.appendChild(root)
    }

    let open = false
    const render = () => {
      root.innerHTML = `
        <div class="guia-lang-switcher-outer">
          <div class="guia-lang-switcher">
            <button type="button" class="guia-lang-trigger" aria-label="${TITLES[currentLang]} - change language" aria-expanded="${open}">
              ${flagImg(currentLang, 20)}
              <span class="guia-lang-caret">▾</span>
            </button>
            ${open ? `<div class="guia-lang-menu" role="menu">${LANGS.map((code) => `
              <button type="button" role="menuitem" class="guia-lang-item${code === currentLang ? ' guia-lang-item--active' : ''}" data-lang="${code}" title="${TITLES[code]}" aria-label="${TITLES[code]}">
                ${flagImg(code, 20)}
              </button>`).join('')}</div>` : ''}
          </div>
        </div>`
      root.querySelector('.guia-lang-trigger')?.addEventListener('click', (e) => {
        e.stopPropagation()
        open = !open
        render()
      })
      root.querySelectorAll('.guia-lang-item').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation()
          const code = btn.getAttribute('data-lang')
          if (code && code !== currentLang) {
            currentLang = code
            setLang(code)
          }
          open = false
          render()
        })
      })
    }

    document.addEventListener('click', (e) => {
      if (!root.contains(e.target)) {
        open = false
        render()
      }
    })

    render()
    window.__guiaRefreshLangSwitcher = (lang) => {
      currentLang = lang
      open = false
      render()
    }
  }

  function updateCommonChrome(lang, common) {
    const backBtn = document.querySelector('.guia-back')
    if (backBtn && common?.backToLanding) {
      backBtn.textContent = common.backToLanding[lang] || common.backToLanding.pt
      backBtn.setAttribute('href', landingHref(lang))
    }

    document.querySelectorAll('.guia-logo').forEach((el) => {
      el.setAttribute('href', landingHref(lang))
    })

    const nav = document.querySelector('.guia-nav')
    if (nav && common?.nav) {
      nav.setAttribute('aria-label', common.navAria[lang] || common.navAria.pt)
      const links = nav.querySelectorAll('a')
      links.forEach((a, i) => {
        const key = NAV_KEYS[i]
        if (!key || !common.nav[key]) return
        a.textContent = common.nav[key][lang] || common.nav[key].pt
        const path = a.getAttribute('href')?.split('?')[0] || a.pathname
        a.setAttribute('href', guideHref(path, lang))
      })
    }

    const adLabel = document.querySelector('.guia-ad-label')
    if (adLabel && common?.adLabel) adLabel.textContent = common.adLabel[lang] || common.adLabel.pt

    const footer = document.querySelector('.guia-footer p')
    if (footer && common?.footerHtml) footer.innerHTML = common.footerHtml[lang] || common.footerHtml.pt
  }

  function applyLang(lang) {
    const pageId = getPageId()
    const pack = window.SIDUS_GUIA_I18N
    if (!pack || !pageId) return

    const page = pack.pages[pageId]
    const common = pack.common
    const data = page?.[lang] || null

    document.documentElement.lang = lang === 'pt' ? 'pt' : lang
    updateCommonChrome(lang, common)

    if (lang === 'pt' && window.__GUIA_PT_META__) {
      document.title = window.__GUIA_PT_META__.title
      const metaDesc = document.querySelector('meta[name="description"]')
      if (metaDesc) metaDesc.setAttribute('content', window.__GUIA_PT_META__.description)
      const h1 = document.querySelector('.guia-article h1')
      if (h1) h1.textContent = window.__GUIA_PT_META__.h1
      const meta = document.querySelector('.guia-meta')
      if (meta) meta.textContent = window.__GUIA_PT_META__.meta
    } else if (data) {
      if (data.title) document.title = data.title
      const metaDesc = document.querySelector('meta[name="description"]')
      if (metaDesc && data.description) metaDesc.setAttribute('content', data.description)
      const h1 = document.querySelector('.guia-article h1')
      if (h1 && data.h1) h1.textContent = data.h1
      const meta = document.querySelector('.guia-meta')
      if (meta && data.meta) meta.textContent = data.meta
    }

    const body = document.querySelector('.guia-article-body')
    if (body) {
      if (lang === 'pt' && window.__GUIA_PT_BODY__) {
        body.innerHTML = window.__GUIA_PT_BODY__
      } else if (data?.article) {
        body.innerHTML = data.article
      }
    }

    document.querySelectorAll('.guia-article-body .guia-btn, .guia-related-cta').forEach((btn) => {
      if (btn.getAttribute('href') === '/login' || btn.getAttribute('href')?.endsWith('/login')) {
        btn.setAttribute('href', loginHref(lang))
      }
    })

    window.__guiaRefreshLangSwitcher?.(lang)
    updateSeoMeta(lang)
    renderRelatedGuides(lang)
    renderGuidePager(lang)
  }

  function upsertMeta(attr, key, content) {
    if (!content) return
    let el = document.querySelector(`meta[${attr}="${key}"]`)
    if (!el) {
      el = document.createElement('meta')
      el.setAttribute(attr, key)
      document.head.appendChild(el)
    }
    el.setAttribute('content', content)
  }

  function applyShareMeta({ title, description, url, type = 'article', locale = 'pt_PT' }) {
    const image = `${window.location.origin}/og-image.png?v=7`
    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:site_name', 'Sidusastro')
    upsertMeta('property', 'og:locale', locale)
    upsertMeta('property', 'og:url', url)
    if (title) upsertMeta('property', 'og:title', title)
    if (description) upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:image', image)
    upsertMeta('property', 'og:image:secure_url', image)
    upsertMeta('property', 'og:image:type', 'image/png')
    upsertMeta('property', 'og:image:width', '1200')
    upsertMeta('property', 'og:image:height', '630')
    upsertMeta('property', 'og:image:alt', 'Sidus - constelação dourada e logotipo SIDUS')
    upsertMeta('name', 'twitter:card', 'summary_large_image')
    if (title) upsertMeta('name', 'twitter:title', title)
    if (description) upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', image)
    upsertMeta('name', 'twitter:image:alt', 'Sidus - constelação dourada e logotipo SIDUS')
  }

  function updateSeoMeta(lang) {
    const pageId = getPageId()
    const pack = window.SIDUS_GUIA_I18N
    const page = pack?.pages?.[pageId]
    const data = page?.[lang] || null
    const title = lang === 'pt' ? window.__GUIA_PT_META__?.title : data?.title
    const description = lang === 'pt' ? window.__GUIA_PT_META__?.description : data?.description
    const h1 = document.querySelector('.guia-article h1')?.textContent || data?.h1 || ''
    const canonical = `${window.location.origin}${window.location.pathname}`

    let link = document.querySelector('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'canonical'
      document.head.appendChild(link)
    }
    link.href = canonical

    applyShareMeta({
      title: title || h1,
      description: description || '',
      url: canonical,
      type: 'article',
      locale: lang === 'pt' ? 'pt_PT' : lang,
    })

    const jsonId = 'guia-jsonld'
    let script = document.getElementById(jsonId)
    if (!script) {
      script = document.createElement('script')
      script.id = jsonId
      script.type = 'application/ld+json'
      document.head.appendChild(script)
    }

    const breadcrumb = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Sidus', item: `${window.location.origin}${loginHref(lang)}` },
        { '@type': 'ListItem', position: 2, name: h1, item: canonical },
      ],
    }

    const article = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: h1,
      description: description || '',
      inLanguage: lang,
      author: { '@type': 'Organization', name: 'Sidus' },
      publisher: {
        '@type': 'Organization',
        name: 'Sidusastro',
        logo: { '@type': 'ImageObject', url: `${window.location.origin}/favicon.svg` },
      },
      mainEntityOfPage: canonical,
    }

    script.textContent = JSON.stringify([breadcrumb, article])
  }

  function renderRelatedGuides(lang) {
    const pageId = getPageId()
    const related = RELATED_GUIDES[pageId]
    const common = window.SIDUS_GUIA_I18N?.common
    if (!related || !common) return

    let block = document.querySelector('.guia-related')
    if (!block) {
      block = document.createElement('section')
      block.className = 'guia-related'
      const article = document.querySelector('.guia-article')
      if (article) article.insertAdjacentElement('afterend', block)
    }

    const title = common.relatedTitle?.[lang] || common.relatedTitle?.pt || 'Mais guias'
    const lead = common.relatedLead?.[lang] || common.relatedLead?.pt || ''
    const links = related.map(({ href, navKey }) => {
      const label = common.nav?.[navKey]?.[lang] || common.nav?.[navKey]?.pt || navKey
      return `<a href="${guideHref(href, lang)}">${label}</a>`
    }).join('')

    block.innerHTML = `
      <h2 class="guia-related-title">${title}</h2>
      <p class="guia-related-lead">${lead}</p>
      <nav class="guia-related-links" aria-label="${title}">${links}</nav>`
  }

  function buildGuidePagerHtml(prev, next, prevLabel, nextLabel, prevDir, nextDir, lang) {
    const prevTitle = `${prevDir}: ${prevLabel}`
    const nextTitle = `${nextDir}: ${nextLabel}`
    return `
      <a class="guia-pager-btn guia-pager-prev" href="${guideHref(prev.href, lang)}" aria-label="${prevTitle}" title="${prevTitle}">
        <span class="guia-pager-arrow" aria-hidden="true">←</span>
      </a>
      <a class="guia-pager-btn guia-pager-next" href="${guideHref(next.href, lang)}" aria-label="${nextTitle}" title="${nextTitle}">
        <span class="guia-pager-arrow" aria-hidden="true">→</span>
      </a>`
  }

  function renderGuidePager(lang) {
    const pageId = getPageId()
    const common = window.SIDUS_GUIA_I18N?.common
    const idx = GUIDE_SEQUENCE.findIndex((g) => g.id === pageId)
    if (idx < 0 || !common) return

    const prev = GUIDE_SEQUENCE[(idx - 1 + GUIDE_SEQUENCE.length) % GUIDE_SEQUENCE.length]
    const next = GUIDE_SEQUENCE[(idx + 1) % GUIDE_SEQUENCE.length]
    const prevLabel = common.nav?.[prev.navKey]?.[lang] || common.nav?.[prev.navKey]?.pt || prev.navKey
    const nextLabel = common.nav?.[next.navKey]?.[lang] || common.nav?.[next.navKey]?.pt || next.navKey
    const prevDir = common.navPrev?.[lang] || common.navPrev?.pt || 'Anterior'
    const nextDir = common.navNext?.[lang] || common.navNext?.pt || 'Seguinte'
    const pagerAria = common.pagerAria?.[lang] || common.pagerAria?.pt || 'Navegação entre guias'
    const html = buildGuidePagerHtml(prev, next, prevLabel, nextLabel, prevDir, nextDir, lang)

    document.querySelector('.guia-pager--top')?.remove()

    let block = document.querySelector('.guia-pager--bottom')
    if (!block) {
      block = document.createElement('nav')
      block.className = 'guia-pager guia-pager--bottom'
      const article = document.querySelector('.guia-article')
      if (article) article.insertAdjacentElement('afterend', block)
    }

    block.setAttribute('aria-label', pagerAria)
    block.innerHTML = html
  }

  function init() {
    const h1 = document.querySelector('.guia-article h1')
    const meta = document.querySelector('.guia-meta')
    const metaDesc = document.querySelector('meta[name="description"]')
    if (!window.__GUIA_PT_META__) {
      window.__GUIA_PT_META__ = {
        title: document.title,
        description: metaDesc?.getAttribute('content') || '',
        h1: h1?.textContent || '',
        meta: meta?.textContent || '',
      }
    }

    const body = document.querySelector('.guia-article-body')
    if (body && !window.__GUIA_PT_BODY__) {
      window.__GUIA_PT_BODY__ = body.innerHTML
    }

    document.querySelectorAll('.guia-logo').forEach((el) => {
      el.classList.add('notranslate')
      el.setAttribute('translate', 'no')
    })

    initCosmicBackground()
    const lang = getLang()
    if (lang !== 'pt') syncLangUrl(lang)
    initLanguageSwitcher(lang)
    applyLang(lang)
  }

  window.SIDUS_GUIA_VERSION = GUIA_VERSION

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})()
