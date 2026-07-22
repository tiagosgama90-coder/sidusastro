import { useEffect } from 'react'

/** Rasto mágico dourado no cursor - apenas desktop com rato. */
export function MagicCursorTrail({ activo = true }) {
  useEffect(() => {
    if (!activo || typeof window === 'undefined') return undefined

    const desktop = window.matchMedia('(min-width: 768px)').matches
    const touch = window.matchMedia('(pointer: coarse)').matches
    if (!desktop || touch) return undefined

    const particulas = []
    const canvas = document.createElement('canvas')
    canvas.setAttribute('aria-hidden', 'true')
    canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9998;width:100%;height:100%;'
    document.body.appendChild(canvas)
    const ctx = canvas.getContext('2d')

    const redimensionar = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    redimensionar()

    const onMove = (e) => {
      particulas.push({
        x: e.clientX,
        y: e.clientY,
        life: 1,
        size: 1.5 + Math.random() * 2.5,
        hue: Math.random() > 0.7 ? '#C4B5FD' : '#DFB76C',
      })
      if (particulas.length > 36) particulas.shift()
    }

    let raf = 0
    const animar = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = particulas.length - 1; i >= 0; i -= 1) {
        const p = particulas[i]
        p.life -= 0.045
        if (p.life <= 0) {
          particulas.splice(i, 1)
          continue
        }
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2)
        ctx.fillStyle = p.hue === '#C4B5FD'
          ? `rgba(196, 181, 253, ${p.life * 0.55})`
          : `rgba(223, 183, 108, ${p.life * 0.7})`
        ctx.fill()
      }
      raf = requestAnimationFrame(animar)
    }
    animar()

    window.addEventListener('resize', redimensionar)
    window.addEventListener('mousemove', onMove, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', redimensionar)
      window.removeEventListener('mousemove', onMove)
      canvas.remove()
    }
  }, [activo])

  return null
}
