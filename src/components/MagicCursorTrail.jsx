import { useEffect } from 'react'

const GOLD = [223, 183, 108]
const PURPLE = [196, 181, 253]
const WHITE = [255, 255, 255]

function rgba([r, g, b], a) {
  return `rgba(${r},${g},${b},${a})`
}

function colorFor(tint, alpha) {
  if (tint === 'purple') return rgba(PURPLE, alpha)
  if (tint === 'white') return rgba(WHITE, alpha * 0.7)
  return rgba(GOLD, alpha)
}

function isInteractiveTarget(el) {
  if (!el || el === document.documentElement) return false
  const node = el.closest?.(
    'button, a, input, select, textarea, label, [role="button"], [role="link"], [role="tab"], .home-signo-btn, .mobile-bottom-nav button, .mobile-bottom-nav a',
  )
  if (node) return true
  if (el.getAttribute?.('tabindex') && el.getAttribute('tabindex') !== '-1') return true
  return window.getComputedStyle(el).cursor === 'pointer'
}

/** Rasto muito suave — só desktop, espaçado */
function pushSoftTrail(particulas, x, y) {
  particulas.push({
    kind: 'soft',
    x: x + (Math.random() - 0.5) * 4,
    y: y + (Math.random() - 0.5) * 4,
    vx: 0,
    vy: 0,
    life: 1,
    decay: 0.07,
    size: 0.45 + Math.random() * 0.65,
    tint: Math.random() > 0.82 ? 'purple' : 'gold',
  })
}

/** Explosõezinha suave ao clicar/tocar em botões */
function pushSparkBurst(particulas, x, y) {
  const count = 4 + Math.floor(Math.random() * 2)
  for (let i = 0; i < count; i += 1) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5
    const speed = 0.45 + Math.random() * 0.85
    particulas.push({
      kind: 'spark',
      x: x + (Math.random() - 0.5) * 4,
      y: y + (Math.random() - 0.5) * 4,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 0.25,
      life: 1,
      decay: 0.058 + Math.random() * 0.018,
      size: 0.4 + Math.random() * 0.75,
      tint: Math.random() > 0.7 ? 'gold' : 'white',
    })
  }
}

function trimParticles(particulas, max) {
  while (particulas.length > max) particulas.shift()
}

/**
 * Efeitos cósmicos Sidus — discretos:
 * - Mobile: pequenas explosõezinhas ao tocar botões/links
 * - Desktop: rasto muito leve + explosõezinhas em cliques
 */
export function MagicCursorTrail({ activo = true }) {
  useEffect(() => {
    if (!activo || typeof window === 'undefined') return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const backdrop = document.querySelector('.sidus-cosmic-backdrop')
    if (!backdrop) return undefined

    const coarse = window.matchMedia('(pointer: coarse)').matches
    const particleMax = coarse ? 28 : 36

    const particulas = []
    let w = window.innerWidth
    let h = window.innerHeight
    let visible = true
    let lastTrailSpawn = 0

    const canvas = document.createElement('canvas')
    canvas.className = 'magic-cosmic-trail-canvas'
    canvas.setAttribute('aria-hidden', 'true')
    backdrop.appendChild(canvas)

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

    const burstAt = (x, y) => {
      pushSparkBurst(particulas, x, y)
      trimParticles(particulas, particleMax)
    }

    const onPointerDown = (e) => {
      const target = e.target
      if (!isInteractiveTarget(target)) return
      burstAt(e.clientX, e.clientY)
    }

    const onTouchStart = (e) => {
      const target = e.target
      if (!isInteractiveTarget(target)) return
      for (let i = 0; i < e.changedTouches.length; i += 1) {
        const t = e.changedTouches[i]
        burstAt(t.clientX, t.clientY)
      }
    }

    const onMove = (e) => {
      const now = performance.now()
      if (now - lastTrailSpawn < 90) return
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
          p.vx *= 0.94
          p.vy *= 0.94
        }
        if (p.life <= 0) {
          particulas.splice(i, 1)
          continue
        }

        const isSpark = p.kind === 'spark'
        const alpha = isSpark ? p.life * 0.38 : p.life * 0.22
        const radius = p.size * (isSpark ? 0.5 + p.life * 0.5 : p.life)

        ctx.beginPath()
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
        ctx.fillStyle = colorFor(p.tint, alpha)
        ctx.fill()

        if (isSpark && p.life > 0.35) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, radius * 1.6, 0, Math.PI * 2)
          ctx.fillStyle = colorFor(p.tint, alpha * 0.1)
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
    document.addEventListener('pointerdown', onPointerDown, { passive: true })
    document.addEventListener('touchstart', onTouchStart, { passive: true })

    if (!coarse) {
      window.addEventListener('mousemove', onMove, { passive: true })
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('touchstart', onTouchStart)
      document.removeEventListener('visibilitychange', onVisibility)
      canvas.remove()
    }
  }, [activo])

  return null
}

/** Alias descritivo */
export const MagicCosmicTrail = MagicCursorTrail
