import { useEffect } from 'react'

const GOLD = [223, 183, 108]
const WHITE = [255, 255, 255]
const LAVENDER = [196, 181, 253]

function rgba([r, g, b], a) {
  return `rgba(${r},${g},${b},${a})`
}

function colorFor(tint, alpha) {
  if (tint === 'white') return rgba(WHITE, alpha * 0.8)
  if (tint === 'lavender') return rgba(LAVENDER, alpha * 0.65)
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

/** Rasto suave — desktop (bolinhas) */
function pushSoftTrail(particulas, x, y) {
  particulas.push({
    kind: 'soft',
    x: x + (Math.random() - 0.5) * 5,
    y: y + (Math.random() - 0.5) * 5,
    life: 1,
    decay: 0.038,
    size: 1.25 + Math.random() * 1.1,
    tint: Math.random() > 0.25 ? 'gold' : 'white',
  })
}

/** Poeira cósmica — mobile (grãos finos + micro-brilhos) */
function pushCosmicDust(particulas, x, y) {
  const kinds = ['speck', 'speck', 'speck', 'spark', 'mote']
  const count = 2 + (Math.random() > 0.5 ? 1 : 0)
  for (let i = 0; i < count; i += 1) {
    const kind = kinds[Math.floor(Math.random() * kinds.length)]
    particulas.push({
      kind,
      x: x + (Math.random() - 0.5) * 9,
      y: y + (Math.random() - 0.5) * 9,
      vx: (Math.random() - 0.5) * 0.55,
      vy: (Math.random() - 0.5) * 0.55 - 0.12,
      life: 1,
      decay: 0.026 + Math.random() * 0.016,
      size: kind === 'spark' ? 1 + Math.random() * 0.75 : 0.32 + Math.random() * 0.5,
      tint: Math.random() > 0.72 ? 'lavender' : Math.random() > 0.38 ? 'gold' : 'white',
    })
  }
}

/** Toque em botão — explosãozinha discreta */
function pushGentleTap(particulas, x, y, mobile = false) {
  const count = mobile ? 7 : 5
  for (let i = 0; i < count; i += 1) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.35
    const speed = (mobile ? 0.45 : 0.35) + Math.random() * 0.45
    particulas.push({
      kind: 'tap',
      x: x + (Math.random() - 0.5) * 4,
      y: y + (Math.random() - 0.5) * 4,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 0.15,
      life: 1,
      decay: 0.058 + Math.random() * 0.02,
      size: 0.42 + Math.random() * 0.52,
      tint: Math.random() > 0.45 ? 'gold' : 'white',
    })
  }
}

function trimParticles(particulas, max) {
  while (particulas.length > max) particulas.shift()
}

function drawSpark(ctx, x, y, s, alpha, color) {
  ctx.save()
  ctx.translate(x, y)
  ctx.strokeStyle = color
  ctx.lineWidth = 0.55
  ctx.globalAlpha = alpha
  ctx.beginPath()
  ctx.moveTo(-s, 0)
  ctx.lineTo(s, 0)
  ctx.moveTo(0, -s)
  ctx.lineTo(0, s)
  ctx.stroke()
  ctx.restore()
}

/**
 * Efeito cósmico site-wide:
 * - Desktop: bolinhas suaves no rato + explosão em botões
 * - Mobile: poeira cósmica ao deslizar + explosão em botões
 */
export function MagicCursorTrail({ activo = true }) {
  useEffect(() => {
    if (!activo || typeof window === 'undefined') return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const fxLayer = document.querySelector('.sidus-cosmic-fx-layer')
    if (!fxLayer) return undefined

    const desktopFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const particleMax = coarse ? 50 : 42

    const particulas = []
    let w = window.innerWidth
    let h = window.innerHeight
    let visible = true
    let lastTrailSpawn = 0
    let lastBurst = 0
    let lastBurstX = 0
    let lastBurstY = 0
    let touchActive = false

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
      pushGentleTap(particulas, x, y, coarse)
      trimParticles(particulas, particleMax)
    }

    const dustAt = (x, y) => {
      pushCosmicDust(particulas, x, y)
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
      if (now - lastBurst < 90 && Math.abs(pt.x - lastBurstX) < 16 && Math.abs(pt.y - lastBurstY) < 16) return
      lastBurst = now
      lastBurstX = pt.x
      lastBurstY = pt.y
      tapAt(pt.x, pt.y)
    }

    const onMove = (e) => {
      const now = performance.now()
      if (now - lastTrailSpawn < 28) return
      lastTrailSpawn = now
      pushSoftTrail(particulas, e.clientX, e.clientY)
      pushSoftTrail(particulas, e.clientX + 1, e.clientY - 1)
      if (Math.random() > 0.35) pushSoftTrail(particulas, e.clientX - 2, e.clientY + 1)
      trimParticles(particulas, particleMax)
    }

    const onTouchStart = () => {
      touchActive = true
    }

    const onTouchEnd = () => {
      touchActive = false
    }

    const onTouchMove = (e) => {
      if (!touchActive) return
      const t = e.touches?.[0]
      if (!t) return
      const now = performance.now()
      if (now - lastTrailSpawn < 42) return
      lastTrailSpawn = now
      dustAt(t.clientX, t.clientY)
    }

    let raf = 0
    const animate = () => {
      raf = requestAnimationFrame(animate)
      if (!visible) return

      ctx.clearRect(0, 0, w, h)

      for (let i = particulas.length - 1; i >= 0; i -= 1) {
        const p = particulas[i]
        p.life -= p.decay
        if (p.kind === 'tap' || p.kind === 'speck' || p.kind === 'spark' || p.kind === 'mote') {
          p.x += p.vx || 0
          p.y += p.vy || 0
          if (p.vx) p.vx *= 0.96
          if (p.vy) p.vy *= 0.96
        }
        if (p.life <= 0) {
          particulas.splice(i, 1)
          continue
        }

        const isTap = p.kind === 'tap'
        const isDust = p.kind === 'speck' || p.kind === 'spark' || p.kind === 'mote'
        const alpha = isTap
          ? p.life * 0.52
          : isDust
            ? p.life * (p.kind === 'spark' ? 0.62 : 0.36)
            : p.life * 0.68
        const radius = p.size * (0.8 + p.life * 0.35)

        if (p.kind === 'spark') {
          drawSpark(ctx, p.x, p.y, radius * 1.5, alpha, colorFor(p.tint, alpha))
        } else {
          ctx.beginPath()
          ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
          ctx.fillStyle = colorFor(p.tint, alpha)
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
    document.addEventListener('touchstart', onTouchStart, { passive: true })
    document.addEventListener('touchend', onTouchEnd, { passive: true })
    document.addEventListener('touchcancel', onTouchEnd, { passive: true })
    document.addEventListener('touchmove', onTouchMove, { passive: true })
    document.addEventListener('touchend', onTap, { passive: true })
    document.addEventListener('click', onTap, { passive: true, capture: true })

    if (desktopFine) {
      window.addEventListener('mousemove', onMove, { passive: true })
      document.addEventListener('pointerup', onTap, { passive: true })
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('touchstart', onTouchStart)
      document.removeEventListener('touchend', onTouchEnd)
      document.removeEventListener('touchcancel', onTouchEnd)
      document.removeEventListener('touchmove', onTouchMove)
      document.removeEventListener('touchend', onTap)
      document.removeEventListener('pointerup', onTap)
      document.removeEventListener('click', onTap, { capture: true })
      document.removeEventListener('visibilitychange', onVisibility)
      canvas.remove()
    }
  }, [activo])

  return null
}

export const MagicCosmicTrail = MagicCursorTrail
