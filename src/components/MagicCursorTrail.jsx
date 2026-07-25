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

function pushDesktopTrail(particulas, x, y) {
  particulas.push({
    kind: 'pointer',
    x: x + (Math.random() - 0.5) * 5,
    y: y + (Math.random() - 0.5) * 5,
    vx: 0,
    vy: 0,
    life: 1,
    decay: 0.044,
    size: 1.4 + Math.random() * 2.6,
    tint: Math.random() > 0.7 ? 'purple' : 'gold',
  })
}

/** Rasto suave de poeira cósmica (varinha) — mobile */
function pushWandDust(particulas, x, y, { soft = false } = {}) {
  const count = soft ? 2 : 3 + Math.floor(Math.random() * 3)
  for (let i = 0; i < count; i += 1) {
    particulas.push({
      kind: 'wand',
      x: x + (Math.random() - 0.5) * (soft ? 10 : 18),
      y: y + (Math.random() - 0.5) * (soft ? 10 : 18),
      vx: (Math.random() - 0.5) * 0.42,
      vy: -0.22 - Math.random() * 0.55,
      life: 1,
      decay: soft ? 0.016 : 0.012 + Math.random() * 0.008,
      size: soft ? 0.7 + Math.random() * 1.2 : 1 + Math.random() * 2.2,
      tint: Math.random() > 0.68 ? 'gold' : Math.random() > 0.4 ? 'white' : 'purple',
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
    vx: (Math.random() - 0.5) * 0.2,
    vy: (Math.random() - 0.5) * 0.2 - 0.04,
    pulse: Math.random() * Math.PI * 2,
    size: 0.35 + Math.random() * 1.05,
    tint: Math.random() > 0.82 ? 'purple' : Math.random() > 0.55 ? 'gold' : 'white',
  }))
}

/**
 * Efeitos cósmicos Sidus — dentro do backdrop, sempre atrás do conteúdo:
 * - Desktop: rasto dourado/roxo ao mover o rato
 * - Mobile: poeira cósmica suave ao deslizar o dedo (varinha)
 */
export function MagicCursorTrail({ activo = true }) {
  useEffect(() => {
    if (!activo || typeof window === 'undefined') return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const backdrop = document.querySelector('.sidus-cosmic-backdrop')
    if (!backdrop) return undefined

    const coarse = window.matchMedia('(pointer: coarse)').matches
    const pointerMax = coarse ? 72 : 48
    const ambientCount = coarse ? 22 : 18

    const particulas = []
    let ambients = []
    let w = window.innerWidth
    let h = window.innerHeight
    let visible = true
    let lastTouchSpawn = 0

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
      ambients = seedAmbient(w, h, ambientCount)
    }
    resize()

    const onMove = (e) => {
      pushDesktopTrail(particulas, e.clientX, e.clientY)
      trimPointerParticles(particulas, pointerMax)
    }

    const spawnTouchDust = (x, y, soft = false) => {
      pushWandDust(particulas, x, y, { soft })
      trimPointerParticles(particulas, pointerMax)
    }

    const onTouchStart = (e) => {
      for (let i = 0; i < e.changedTouches.length; i += 1) {
        const t = e.changedTouches[i]
        spawnTouchDust(t.clientX, t.clientY, true)
      }
    }

    const onTouchMove = (e) => {
      const now = performance.now()
      if (now - lastTouchSpawn < 14) return
      lastTouchSpawn = now
      for (let i = 0; i < e.touches.length; i += 1) {
        const t = e.touches[i]
        spawnTouchDust(t.clientX, t.clientY, false)
      }
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
        ctx.fillStyle = colorFor(p.tint, (coarse ? 0.2 : 0.22) * tw)
        ctx.fill()
      }

      for (let i = particulas.length - 1; i >= 0; i -= 1) {
        const p = particulas[i]
        p.life -= p.decay
        if (p.kind === 'wand') {
          p.x += p.vx
          p.y += p.vy
          p.vx *= 0.985
          p.vy *= 0.985
        }
        if (p.life <= 0) {
          particulas.splice(i, 1)
          continue
        }

        const isWand = p.kind === 'wand'
        const alpha = isWand ? p.life * (coarse ? 0.78 : 0.42) : p.life * 0.78
        const radius = p.size * (isWand ? 0.65 + p.life * 0.55 : p.life)

        ctx.beginPath()
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
        ctx.fillStyle = colorFor(p.tint, alpha)
        ctx.fill()

        if (!isWand && p.life > 0.45) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, radius * 2.4, 0, Math.PI * 2)
          ctx.fillStyle = colorFor(p.tint, alpha * 0.14)
          ctx.fill()
        } else if (isWand && p.life > 0.25) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, radius * 2.2, 0, Math.PI * 2)
          ctx.fillStyle = colorFor(p.tint, alpha * 0.18)
          ctx.fill()
          ctx.beginPath()
          ctx.arc(p.x, p.y, radius * 3.6, 0, Math.PI * 2)
          ctx.fillStyle = colorFor(p.tint, alpha * 0.06)
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
