(function () {
  const LANGS = ['pt', 'en', 'es', 'it', 'de', 'fr']
  const FLAG_CODES = { pt: 'PT', en: 'GB', es: 'ES', it: 'IT', de: 'DE', fr: 'FR' }
  const TITLES = {
    pt: 'Português', en: 'English', es: 'Español', it: 'Italiano', de: 'Deutsch', fr: 'Français',
  }
  const STORAGE_KEY = 'sidus_lang'
  const GUIA_VERSION = '20260717b'
  const ZODIAC = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓']
  const NAV_KEYS = ['mapa', 'ascendente', 'signos', 'tarot']
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
        rad: r > 0.97 ? 1.4 : r > 0.88 ? 0.9 : r > 0.6 ? 0.55 : 0.35,
        a: 0.25 + Math.random() * 0.75,
        tw: 0.003 + Math.random() * 0.008,
        ph: Math.random() * Math.PI * 2,
        tint: r > 0.92 ? 'gold' : r > 0.85 ? 'blue' : 'white',
      })
    }
    return stars
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
      `<path d="${d}" fill="none" stroke="rgba(223,183,108,0.32)" stroke-width="0.9" stroke-linecap="round" />`
    ).join('')
    const zodiacEls = zodiacNodes.map(({ sym, x, y, i }) =>
      `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="middle" dominant-baseline="central" class="guia-cosmic-zodiac" style="animation-delay:${i * 0.35}s">${sym}</text>`
    ).join('')

    wrap.innerHTML = `
      <svg class="guia-cosmic-hendecagram" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="guiaHendecGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="rgba(223,183,108,0.22)" />
            <stop offset="55%" stop-color="rgba(139,92,246,0.16)" />
            <stop offset="100%" stop-color="rgba(3,8,24,0)" />
          </radialGradient>
        </defs>
        <circle cx="200" cy="200" r="175" fill="url(#guiaHendecGlow)" />
        <g class="guia-cosmic-star-lines">${pathEls}</g>
        <circle cx="200" cy="200" r="42" fill="none" stroke="rgba(223,183,108,0.2)" stroke-width="0.6" />
        ${zodiacEls}
      </svg>`

    root.appendChild(canvas)
    root.appendChild(nebula)
    root.appendChild(wrap)
    document.body.insertBefore(root, document.body.firstChild)
    document.body.classList.add('guia-has-cosmic-bg')

    const ctx = canvas.getContext('2d')
    let stars = []
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
      stars = seedStars(Math.floor((w * h) / 3800), w, h)
    }

    const draw = (t) => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      ctx.clearRect(0, 0, w, h)
      for (const s of stars) {
        const twinkle = 0.55 + 0.45 * Math.sin(t * s.tw + s.ph)
        const alpha = s.a * twinkle
        if (s.tint === 'gold') ctx.fillStyle = `rgba(223,183,108,${alpha * 0.85})`
        else if (s.tint === 'blue') ctx.fillStyle = `rgba(180,210,255,${alpha * 0.9})`
        else ctx.fillStyle = `rgba(255,255,255,${alpha})`
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.rad, 0, Math.PI * 2)
        ctx.fill()
      }
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

    upsertMeta('property', 'og:type', 'article')
    upsertMeta('property', 'og:site_name', 'Sidusastro')
    upsertMeta('property', 'og:locale', lang === 'pt' ? 'pt_PT' : lang)
    upsertMeta('property', 'og:url', canonical)
    upsertMeta('property', 'og:title', title || h1)
    upsertMeta('property', 'og:description', description || '')
    upsertMeta('name', 'twitter:card', 'summary')
    upsertMeta('name', 'twitter:title', title || h1)
    upsertMeta('name', 'twitter:description', description || '')

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
