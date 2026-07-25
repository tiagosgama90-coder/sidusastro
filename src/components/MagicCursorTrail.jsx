import { useEffect } from 'react'

const GOLD = [223, 183, 108]
const WHITE = [255, 255, 255]

function rgba([r, g, b], a) {
  return `rgba(${r},${g},${b},${a})`
}

function colorFor(tint, alpha) {
  if (tint === 'white') return rgba(WHITE, alpha * 0.6)
  return rgba(GOLD, alpha)
}

function isInteractiveTarget(el) {
  if (!el || el === document.documentElement) return false
  const node = el.closest?.(
    'button, a, input, select, textarea, label, [role="button"], [role="link"], [role="tab"], .home-signo-btn, .mobile-bottom-nav__item, .tarot-tipo-card, .desktop-nav-item',
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

/** Rasto quase impercetível — só desktop */
function pushSoftTrail(particulas, x, y) {
  particulas.push({
    kind: 'soft',
    x: x + (Math.random() - 0.5) * 3,
    y: y + (Math.random() - 0.5) * 3,
    life: 1,
    decay: 0.09,
    size: 0.3 + Math.random() * 0.35,
    tint: 'gold',
  })
}

/** Toque leve — 3 grãos de poeira dourada, sem explosão */
function pushGentleTap(particulas, x, y) {
  const count = 3
  for (let i = 0; i < count; i += 1) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3
    const speed = 0.2 + Math.random() * 0.35
    particulas.push({
      kind: 'tap',
      x: x + (Math.random() - 0.5) * 3,
      y: y + (Math.random() - 0.5) * 3,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 0.12,
      life: 1,
      decay: 0.07 + Math.random() * 0.02,
      size: 0.35 + Math.random() * 0.45,
      tint: Math.random() > 0.5 ? 'gold' : 'white',
    })
  }
}

function trimParticles(particulas, max) {
  while (particulas.length > max) particulas.shift()
}

/**
 * Efeito cósmico muito leve:
 * - Mobile: 3 grãos dourados ao tocar botões/links
 * - Desktop: rasto quase invisível + mesmo toque suave
 */
export function MagicCursorTrail({ activo = true }) {
  useEffect(() => {
    if (!activo || typeof window === 'undefined') return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const fxLayer = document.querySelector('.sidus-cosmic-fx-layer')
    if (!fxLayer) return undefined

    const coarse = window.matchMedia('(pointer: coarse)').matches
    const particleMax = coarse ? 18 : 24

    const particulas = []
    let w = window.innerWidth
    let h = window.innerHeight
    let visible = true
    let lastTrailSpawn = 0
    let lastBurst = 0
    let lastBurstX = 0
    let lastBurstY = 0

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

    const tapAt = (x, y) => {
      pushGentleTap(particulas, x, y)
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
      if (now - lastBurst < 100 && Math.abs(pt.x - lastBurstX) < 14 && Math.abs(pt.y - lastBurstY) < 14) return
      lastBurst = now
      lastBurstX = pt.x
      lastBurstY = pt.y
      tapAt(pt.x, pt.y)
    }

    const onMove = (e) => {
      const now = performance.now()
      if (now - lastTrailSpawn < 140) return
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
        if (p.kind === 'tap') {
          p.x += p.vx
          p.y += p.vy
          p.vx *= 0.96
          p.vy *= 0.96
        }
        if (p.life <= 0) {
          particulas.splice(i, 1)
          continue
        }

        const isTap = p.kind === 'tap'
        const alpha = isTap ? p.life * 0.28 : p.life * 0.14
        const radius = p.size * p.life

        ctx.beginPath()
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
        ctx.fillStyle = colorFor(p.tint, alpha)
        ctx.fill()
      }
    }
    raf = requestAnimationFrame(animate)

    const onVisibility = () => {
      visible = !document.hidden
    }

    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVisibility)
    document.addEventListener('touchend', onTap, { passive: true })
    document.addEventListener('click', onTap, { passive: true, capture: true })

    if (!coarse) {
      window.addEventListener('mousemove', onMove, { passive: true })
      document.addEventListener('pointerup', onTap, { passive: true })
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('touchend', onTap)
      document.removeEventListener('pointerup', onTap)
      document.removeEventListener('click', onTap, { capture: true })
      document.removeEventListener('visibilitychange', onVisibility)
      canvas.remove()
    }
  }, [activo])

  return null
}

/** Alias descritivo */
export const MagicCosmicTrail = MagicCursorTrail
