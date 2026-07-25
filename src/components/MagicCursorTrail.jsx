import { useEffect } from 'react'

const GOLD = [223, 183, 108]
const PURPLE = [196, 181, 253]
const WHITE = [255, 255, 255]

function rgba([r, g, b], a) {
  return `rgba(${r},${g},${b},${a})`
}

function colorFor(tint, alpha) {
  if (tint === 'purple') return rgba(PURPLE, alpha)
  if (tint === 'white') return rgba(WHITE, alpha * 0.65)
  return rgba(GOLD, alpha)
}

function pushPointerParticle(particulas, x, y, { burst = false } = {}) {
  const count = burst ? 8 : 1
  for (let i = 0; i < count; i += 1) {
    const angle = burst ? (Math.PI * 2 * i) / count + Math.random() * 0.35 : 0
    const speed = burst ? 1.4 + Math.random() * 2.2 : 0
    particulas.push({
      kind: burst ? 'burst' : 'pointer',
      x: x + (burst ? 0 : (Math.random() - 0.5) * 5),
      y: y + (burst ? 0 : (Math.random() - 0.5) * 5),
      vx: burst ? Math.cos(angle) * speed : 0,
      vy: burst ? Math.sin(angle) * speed : 0,
      life: 1,
      decay: burst ? 0.036 : 0.044,
      size: burst ? 1.6 + Math.random() * 2.4 : 1.4 + Math.random() * 2.6,
      tint: Math.random() > 0.7 ? 'purple' : 'gold',
    })
  }
}

function trimPointerParticles(particulas, max) {
  while (particulas.length > max) particulas.shift()
}

function seedAmbient(w, h, count) {
  return Array.from({ length: count }, () => ({
    kind: 'ambient',
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.24,
    vy: (Math.random() - 0.5) * 0.24 - 0.05,
    pulse: Math.random() * Math.PI * 2,
    size: 0.35 + Math.random() * 1.15,
    tint: Math.random() > 0.82 ? 'purple' : Math.random() > 0.55 ? 'gold' : 'white',
  }))
}

/**
 * Efeitos cósmicos Sidus — site inteiro:
 * - Desktop: rasto dourado/roxo ao mover o rato
 * - Mobile: rasto ao dedo + explosão ao tocar + poeira ambiente
 */
export function MagicCursorTrail({ activo = true }) {
  useEffect(() => {
    if (!activo || typeof window === 'undefined') return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const coarse = window.matchMedia('(pointer: coarse)').matches
    const pointerMax = coarse ? 34 : 48
    const ambientCount = coarse ? 26 : 18

    const particulas = []
    let ambients = []
    let w = window.innerWidth
    let h = window.innerHeight
    let visible = true

    const canvas = document.createElement('canvas')
    canvas.className = 'magic-cosmic-trail-canvas'
    canvas.setAttribute('aria-hidden', 'true')
    canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9998;width:100%;height:100%;'
    document.body.appendChild(canvas)

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
      ambients = seedAmbient(w, h, ambientCount)
    }
    resize()

    const onMove = (e) => {
      pushPointerParticle(particulas, e.clientX, e.clientY)
      trimPointerParticles(particulas, pointerMax)
    }

    const onTouchMove = (e) => {
      for (let i = 0; i < e.touches.length; i += 1) {
        const t = e.touches[i]
        pushPointerParticle(particulas, t.clientX, t.clientY)
      }
      trimPointerParticles(particulas, pointerMax)
    }

    const onTouchStart = (e) => {
      for (let i = 0; i < e.changedTouches.length; i += 1) {
        const t = e.changedTouches[i]
        pushPointerParticle(particulas, t.clientX, t.clientY, { burst: true })
      }
      trimPointerParticles(particulas, pointerMax)
    }

    let raf = 0
    const animate = (now) => {
      raf = requestAnimationFrame(animate)
      if (!visible) return

      ctx.clearRect(0, 0, w, h)

      for (const p of ambients) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < -12) p.x = w + 12
        if (p.x > w + 12) p.x = -12
        if (p.y < -12) p.y = h + 12
        if (p.y > h + 12) p.y = -12
        const tw = 0.5 + 0.5 * Math.sin(now * 0.0014 + p.pulse)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * tw, 0, Math.PI * 2)
        ctx.fillStyle = colorFor(p.tint, 0.22 * tw)
        ctx.fill()
      }

      for (let i = particulas.length - 1; i >= 0; i -= 1) {
        const p = particulas[i]
        p.life -= p.decay
        if (p.kind === 'burst') {
          p.x += p.vx
          p.y += p.vy
          p.vx *= 0.95
          p.vy *= 0.95
        }
        if (p.life <= 0) {
          particulas.splice(i, 1)
          continue
        }
        const alpha = p.kind === 'burst' ? p.life * 0.72 : p.life * 0.78
        const radius = p.size * p.life
        ctx.beginPath()
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
        ctx.fillStyle = colorFor(p.tint, alpha)
        ctx.fill()
        if (p.life > 0.45) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, radius * 2.4, 0, Math.PI * 2)
          ctx.fillStyle = colorFor(p.tint, alpha * 0.14)
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

    if (coarse) {
      window.addEventListener('touchstart', onTouchStart, { passive: true })
      window.addEventListener('touchmove', onTouchMove, { passive: true })
    } else {
      window.addEventListener('mousemove', onMove, { passive: true })
    }

    // Híbridos (Surface, etc.): rato + toque
    if (!coarse) {
      window.addEventListener('touchstart', onTouchStart, { passive: true })
      window.addEventListener('touchmove', onTouchMove, { passive: true })
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      document.removeEventListener('visibilitychange', onVisibility)
      canvas.remove()
    }
  }, [activo])

  return null
}

/** Alias descritivo */
export const MagicCosmicTrail = MagicCursorTrail
