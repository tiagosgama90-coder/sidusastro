import { useEffect, useRef, useMemo } from 'react'

const ZODIAC = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓']

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
      r: r > 0.97 ? 1.75 : r > 0.88 ? 1.1 : r > 0.6 ? 0.7 : 0.45,
      a: 0.38 + Math.random() * 0.82,
      tw: 0.003 + Math.random() * 0.008,
      ph: Math.random() * Math.PI * 2,
      tint: r > 0.92 ? 'gold' : r > 0.85 ? 'blue' : 'white',
    })
  }
  return stars
}

export function LandingCosmicBackground() {
  const canvasRef = useRef(null)
  const starsRef = useRef(null)
  const rafRef = useRef(0)

  const starPaths = useMemo(() => dodecagramPaths(200, 200, 118), [])
  const zodiacNodes = useMemo(() => ZODIAC.map((sym, i) => {
    const a = (i * 2 * Math.PI) / 12 - Math.PI / 2
    const r = 158
    return { sym, x: 200 + r * Math.cos(a), y: 200 + r * Math.sin(a), i }
  }), [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      starsRef.current = seedStars(Math.floor((w * h) / 2800), w, h)
    }

    resize()
    window.addEventListener('resize', resize)

    const draw = (t) => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      const stars = starsRef.current || []
      ctx.clearRect(0, 0, w, h)

      for (const s of stars) {
        const twinkle = 0.55 + 0.45 * Math.sin(t * s.tw + s.ph)
        const alpha = s.a * twinkle
        if (s.tint === 'gold') ctx.fillStyle = `rgba(223,183,108,${alpha * 0.95})`
        else if (s.tint === 'blue') ctx.fillStyle = `rgba(180,210,255,${alpha * 0.98})`
        else ctx.fillStyle = `rgba(255,255,255,${alpha * 1.05})`
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div className="cosmic-bg-root" aria-hidden>
      <canvas ref={canvasRef} className="landing-cosmic-stars-canvas" />
      <div className="landing-cosmic-nebula" />
      <div className="landing-cosmic-hendecagram-wrap">
        <svg className="landing-cosmic-hendecagram" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="landingHendecGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(223,183,108,0.18)" />
              <stop offset="55%" stopColor="rgba(139,92,246,0.12)" />
              <stop offset="100%" stopColor="rgba(3,8,24,0)" />
            </radialGradient>
            <filter id="landingZodiacGlow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle cx="200" cy="200" r="175" fill="url(#landingHendecGlow)" />
          <g className="landing-cosmic-star-lines">
            {starPaths.map((d, idx) => (
              <path
                key={idx}
                d={d}
                fill="none"
                stroke="rgba(223,183,108,0.42)"
                strokeWidth="1.05"
                strokeLinecap="round"
              />
            ))}
          </g>
          <circle cx="200" cy="200" r="42" fill="none" stroke="rgba(223,183,108,0.16)" strokeWidth="0.6" />
          <g className="landing-cosmic-zodiac-ring">
            {zodiacNodes.map(({ sym, x, y, i }) => (
              <g key={sym} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
                <g className="landing-cosmic-zodiac-upright">
                  <text
                    x={0}
                    y={0}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="landing-cosmic-zodiac"
                    style={{ animationDelay: `${i * 0.35}s` }}
                    filter="url(#landingZodiacGlow)"
                  >
                    {sym}
                  </text>
                </g>
              </g>
            ))}
          </g>
        </svg>
      </div>
    </div>
  )
}
