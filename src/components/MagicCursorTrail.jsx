import { useEffect } from 'react'

const GOLD = [223, 183, 108]
const PURPLE = [196, 181, 253]
const WHITE = [255, 255, 255]

function rgba([r, g, b], a) {
  return `rgba(${r},${g},${b},${a})`
}

function colorFor(tint, alpha) {
  if (tint === 'purple') return rgba(PURPLE, alpha)
  if (tint === 'white') return rgba(WHITE, alpha * 0.75)
  return rgba(GOLD, alpha)
}

function isInteractiveTarget(el) {
  if (!el || el === document.documentElement) return false
  const node = el.closest?.(
    [
      'button',
      'a',
      'input',
      'select',
      'textarea',
      'label',
      '[role="button"]',
      '[role="link"]',
      '[role="tab"]',
      '.home-signo-btn',
      '.mobile-bottom-nav__item',
      '.tarot-tipo-card',
      '.desktop-nav-item',
      '.oracle-chat button',
      '[class*="paywall"]',
      '[class*="btn"]',
    ].join(', '),
  )
  if (node) return true
  const tab = el.getAttribute?.('tabindex')
  if (tab && tab !== '-1') return true
  const tag = el.tagName?.toLowerCase()
  if (tag === 'button' || tag === 'a') return true
  try {
    return window.getComputedStyle(el).cursor === 'pointer'
  } catch {
    return false
  }
}

/** Rasto muito suave — só desktop */
function pushSoftTrail(particulas, x, y) {
  particulas.push({
    kind: 'soft',
    x: x + (Math.random() - 0.5) * 4,
    y: y + (Math.random() - 0.5) * 4,
    vx: 0,
    vy: 0,
    life: 1,
    decay: 0.075,
    size: 0.4 + Math.random() * 0.55,
    tint: Math.random() > 0.85 ? 'purple' : 'gold',
  })
}

/** Explosõezinha suave ao tocar/clicar */
function pushSparkBurst(particulas, x, y) {
  const count = 5
  for (let i = 0; i < count; i += 1) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.45
    const speed = 0.55 + Math.random() * 0.95
    particulas.push({
      kind: 'spark',
      x: x + (Math.random() - 0.5) * 5,
      y: y + (Math.random() - 0.5) * 5,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 0.3,
      life: 1,
      decay: 0.052 + Math.random() * 0.016,
      size: 0.55 + Math.random() * 0.85,
      tint: Math.random() > 0.65 ? 'gold' : 'white',
    })
  }
}

function trimParticles(particulas, max) {
  while (particulas.length > max) particulas.shift()
}

/**
 * Efeitos cósmicos discretos — camada fx acima do conteúdo (pointer-events: none):
 * - Mobile: explosõezinhas ao tocar botões/links/nav
 * - Desktop: rasto leve + explosõezinhas
 */
export function MagicCursorTrail({ activo = true }) {
  useEffect(() => {
    if (!activo || typeof window === 'undefined') return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const fxLayer = document.querySelector('.sidus-cosmic-fx-layer')
    if (!fxLayer) return undefined

    const coarse = window.matchMedia('(pointer: coarse)').matches
    const particleMax = coarse ? 32 : 40

    const particulas = []
    let w = window.innerWidth
    let h = window.innerHeight
    let visible = true
    let lastTrailSpawn = 0

    const canvas = document.createElement('canvas')
    canvas.className = 'magic-cosmic-trail-canvas'
    canvas.setAttribute('aria-hidden', 'true')
    fxLayer.appendChild(canvas)

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) {
      canvas.remove()
      return undefined
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    let lastBurst = 0
    let lastBurstX = 0
    let lastBurstY = 0

    const burstAt = (x, y) => {
      pushSparkBurst(particulas, x, y)
      trimParticles(particulas, particleMax)
    }

    const resolvePoint = (e) => {
      if (e.clientX != null && e.clientY != null) {
        return { x: e.clientX, y: e.clientY }
      }
      const t = e.changedTouches?.[0] || e.touches?.[0]
      if (t) return { x: t.clientX, y: t.clientY }
      return null
    }

    const onTap = (e) => {
      if (!isInteractiveTarget(e.target)) return
      const pt = resolvePoint(e)
      if (!pt) return
      const now = performance.now()
      if (now - lastBurst < 90 && Math.abs(pt.x - lastBurstX) < 12 && Math.abs(pt.y - lastBurstY) < 12) return
      lastBurst = now
      lastBurstX = pt.x
      lastBurstY = pt.y
      burstAt(pt.x, pt.y)
    }

    const onMove = (e) => {
      const now = performance.now()
      if (now - lastTrailSpawn < 100) return
      lastTrailSpawn = now
      pushSoftTrail(particulas, e.clientX, e.clientY)
      trimParticles(particulas, particleMax)
    }

    let raf = 0
    const animate = () => {
      raf = requestAnimationFrame(animate)
      if (!visible) return

      ctx.clearRect(0, 0, w, h)

      for (let i = particulas.length - 1; i >= 0; i -= 1) {
        const p = particulas[i]
        p.life -= p.decay
        if (p.kind === 'spark') {
          p.x += p.vx
          p.y += p.vy
          p.vx *= 0.93
          p.vy *= 0.93
        }
        if (p.life <= 0) {
          particulas.splice(i, 1)
          continue
        }

        const isSpark = p.kind === 'spark'
        const alpha = isSpark ? p.life * 0.55 : p.life * 0.2
        const radius = p.size * (isSpark ? 0.55 + p.life * 0.45 : p.life)

        ctx.beginPath()
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
        ctx.fillStyle = colorFor(p.tint, alpha)
        ctx.fill()

        if (isSpark && p.life > 0.3) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, radius * 1.8, 0, Math.PI * 2)
          ctx.fillStyle = colorFor(p.tint, alpha * 0.12)
          ctx.fill()
        }
      }
    }
    raf = requestAnimationFrame(animate)

    const onVisibility = () => {
      visible = !document.hidden
    }

    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVisibility)
    document.addEventListener('pointerup', onTap, { passive: true })
    document.addEventListener('touchend', onTap, { passive: true })
    document.addEventListener('click', onTap, { passive: true, capture: true })

    if (!coarse) {
      window.addEventListener('mousemove', onMove, { passive: true })
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('pointerup', onTap)
      document.removeEventListener('touchend', onTap)
      document.removeEventListener('click', onTap, { capture: true })
      document.removeEventListener('visibilitychange', onVisibility)
      canvas.remove()
    }
  }, [activo])

  return null
}

/** Alias descritivo */
export const MagicCosmicTrail = MagicCursorTrail
