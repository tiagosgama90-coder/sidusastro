import { useEffect } from 'react'

const GOLD = [223, 183, 108]
const WHITE = [255, 255, 255]

function rgba([r, g, b], a) {
  return `rgba(${r},${g},${b},${a})`
}

function colorFor(tint, alpha) {
  if (tint === 'white') return rgba(WHITE, alpha * 0.75)
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

/** Rasto suave — desktop e mobile */
function pushSoftTrail(particulas, x, y) {
  particulas.push({
    kind: 'soft',
    x: x + (Math.random() - 0.5) * 4,
    y: y + (Math.random() - 0.5) * 4,
    life: 1,
    decay: 0.065,
    size: 0.75 + Math.random() * 0.65,
    tint: Math.random() > 0.35 ? 'gold' : 'white',
  })
}

/** Poeira leve ao deslizar o dedo — mobile */
function pushWandDust(particulas, x, y) {
  particulas.push({
    kind: 'dust',
    x: x + (Math.random() - 0.5) * 5,
    y: y + (Math.random() - 0.5) * 5,
    life: 1,
    decay: 0.05 + Math.random() * 0.02,
    size: 0.65 + Math.random() * 0.7,
    tint: Math.random() > 0.35 ? 'gold' : 'white',
  })
}

/** Toque em botão — pequena explosãozinha discreta */
function pushGentleTap(particulas, x, y) {
  const count = 4
  for (let i = 0; i < count; i += 1) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.35
    const speed = 0.35 + Math.random() * 0.45
    particulas.push({
      kind: 'tap',
      x: x + (Math.random() - 0.5) * 4,
      y: y + (Math.random() - 0.5) * 4,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 0.15,
      life: 1,
      decay: 0.065 + Math.random() * 0.02,
      size: 0.55 + Math.random() * 0.55,
      tint: Math.random() > 0.45 ? 'gold' : 'white',
    })
  }
}

function trimParticles(particulas, max) {
  while (particulas.length > max) particulas.shift()
}

/**
 * Efeito cósmico leve:
 * - Mobile: rasto suave ao deslizar + grãos ao tocar botões
 * - Desktop: rasto suave + toque em botões
 */
export function MagicCursorTrail({ activo = true }) {
  useEffect(() => {
    if (!activo || typeof window === 'undefined') return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const fxLayer = document.querySelector('.sidus-cosmic-fx-layer')
    if (!fxLayer) return undefined

    const coarse = window.matchMedia('(pointer: coarse)').matches
    const particleMax = coarse ? 32 : 28

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
      pushGentleTap(particulas, x, y)
      trimParticles(particulas, particleMax)
    }

    const dustAt = (x, y) => {
      pushWandDust(particulas, x, y)
      if (Math.random() > 0.55) pushWandDust(particulas, x, y)
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
      if (now - lastTrailSpawn < 48) return
      lastTrailSpawn = now
      pushSoftTrail(particulas, e.clientX, e.clientY)
      if (Math.random() > 0.45) pushSoftTrail(particulas, e.clientX + 2, e.clientY - 1)
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
      if (now - lastTrailSpawn < 55) return
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
        if (p.kind === 'tap') {
          p.x += p.vx
          p.y += p.vy
          p.vx *= 0.95
          p.vy *= 0.95
        }
        if (p.life <= 0) {
          particulas.splice(i, 1)
          continue
        }

        const isTap = p.kind === 'tap'
        const isDust = p.kind === 'dust'
        const alpha = isTap
          ? p.life * 0.42
          : isDust
            ? p.life * 0.28
            : p.life * 0.34
        const radius = p.size * (0.85 + p.life * 0.25)

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
    document.addEventListener('touchstart', onTouchStart, { passive: true })
    document.addEventListener('touchend', onTouchEnd, { passive: true })
    document.addEventListener('touchcancel', onTouchEnd, { passive: true })
    document.addEventListener('touchmove', onTouchMove, { passive: true })
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

/** Alias descritivo */
export const MagicCosmicTrail = MagicCursorTrail
