import { ZODIAC_FIGURE_PATHS, ZODIAC_LABELS } from './zodiacFigurePaths.js'

function GoldDefs({ id }) {
  return (
    <defs>
      <linearGradient id={`${id}-gold`} x1="20%" y1="0%" x2="80%" y2="100%">
        <stop offset="0%" stopColor="#FFF8E7" />
        <stop offset="35%" stopColor="#F0D78C" />
        <stop offset="70%" stopColor="#D4A84B" />
        <stop offset="100%" stopColor="#9A6B1A" />
      </linearGradient>
      <linearGradient id={`${id}-gold-shine`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
      <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#1e0a3c" />
        <stop offset="40%" stopColor="#4c1d95" />
        <stop offset="75%" stopColor="#6b21a8" />
        <stop offset="100%" stopColor="#9a3412" stopOpacity="0.65" />
      </linearGradient>
      <filter id={`${id}-emboss`} x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="1.2" stdDeviation="1" floodColor="#000" floodOpacity="0.45" />
        <feDropShadow dx="0" dy="-0.5" stdDeviation="0.4" floodColor="#FFF8E0" floodOpacity="0.35" />
      </filter>
    </defs>
  )
}

function ZodiacFigure({ index, x, y, scale = 1.35 }) {
  const d = ZODIAC_FIGURE_PATHS[index]
  return (
    <g transform={`translate(${x} ${y}) scale(${scale}) translate(-12 -12)`} filter="url(#guideSignos-emboss)">
      <path
        d={d}
        fill="url(#guideSignos-gold)"
        stroke="#7A5518"
        strokeWidth="0.35"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path d={d} fill="url(#guideSignos-gold-shine)" stroke="none" opacity="0.35" />
    </g>
  )
}

/** Mapa natal simplificado - roda clássica com casas e planetas. */
function ArtMapa({ accent }) {
  const cx = 160
  const cy = 66
  const rOut = 50
  const rIn = 32
  const houses = Array.from({ length: 12 }, (_, i) => {
    const a = (i * 30 - 90) * (Math.PI / 180)
    return {
      x1: cx + Math.cos(a) * rIn,
      y1: cy + Math.sin(a) * rIn,
      x2: cx + Math.cos(a) * rOut,
      y2: cy + Math.sin(a) * rOut,
      major: i % 3 === 0,
    }
  })
  const zodiac = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓']
  const planets = [
    { sym: '☉', a: -35, r: 22, c: '#FBBF24' },
    { sym: '☽', a: 55, r: 18, c: '#C4B5FD' },
    { sym: '☿', a: 10, r: 26, c: '#93C5FD' },
    { sym: '♀', a: 80, r: 24, c: '#F9A8D4' },
    { sym: '♂', a: -95, r: 20, c: '#FCA5A5' },
  ]

  return (
    <svg viewBox="0 0 320 132" className="landing-guide-art-svg" aria-hidden>
      <GoldDefs id="guideMapa" />
      <rect width="320" height="132" fill="url(#guideMapa-sky)" opacity="0.9" />
      <circle cx={cx} cy={cy} r={rOut + 2} fill="rgba(8,5,24,0.5)" stroke={accent} strokeWidth="1.3" />
      <circle cx={cx} cy={cy} r={rIn} fill="rgba(11,7,30,0.75)" stroke="rgba(223,183,108,0.35)" strokeWidth="0.8" />
      {houses.map(({ x1, y1, x2, y2, major }, i) => (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={major ? 'rgba(223,183,108,0.45)' : 'rgba(223,183,108,0.2)'}
          strokeWidth={major ? 0.9 : 0.5}
        />
      ))}
      <line x1={cx - rOut} y1={cy} x2={cx + rOut} y2={cy} stroke={accent} strokeWidth="0.9" opacity="0.5" />
      <line x1={cx} y1={cy - rOut} x2={cx} y2={cy + rOut} stroke={accent} strokeWidth="0.9" opacity="0.4" />
      {zodiac.map((sym, i) => {
        const a = (i * 30 - 90) * (Math.PI / 180)
        const x = cx + Math.cos(a) * (rOut + 0.5)
        const y = cy + Math.sin(a) * (rOut + 0.5)
        return (
          <text
            key={sym}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="rgba(223,183,108,0.75)"
            fontSize="7"
          >
            {sym}
          </text>
        )
      })}
      {planets.map(({ sym, a, r, c }) => {
        const rad = (a * Math.PI) / 180
        const x = cx + Math.cos(rad) * r
        const y = cy + Math.sin(rad) * r
        return (
          <g key={sym}>
            <circle cx={x} cy={y} r="5.5" fill="rgba(0,0,0,0.4)" stroke={c} strokeWidth="0.7" />
            <text x={x} y={y + 0.5} textAnchor="middle" dominantBaseline="middle" fill={c} fontSize="7">{sym}</text>
          </g>
        )
      })}
      <text x={cx - rOut - 6} y={cy + 2} textAnchor="end" fill={accent} fontSize="7" fontWeight="700">ASC</text>
      <text x={cx} y={cy - rOut - 4} textAnchor="middle" fill="rgba(223,183,108,0.65)" fontSize="6.5">MC</text>
    </svg>
  )
}

function ArtAscendente({ accent }) {
  return (
    <svg viewBox="0 0 320 132" className="landing-guide-art-svg" aria-hidden>
      <defs>
        <linearGradient id="guideAscSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="55%" stopColor="#312e81" />
          <stop offset="100%" stopColor="#4c1d95" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <rect width="320" height="132" fill="url(#guideAscSky)" />
      <path d="M0 86 Q80 64 160 78 T320 74 L320 132 L0 132 Z" fill="rgba(15,10,35,0.85)" />
      <line x1="0" y1="78" x2="320" y2="78" stroke={accent} strokeWidth="2" opacity="0.9" />
      <path d="M160 78 L160 30" stroke={accent} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.7" />
      <text x="160" y="24" textAnchor="middle" fill={accent} fontSize="22" fontWeight="700">↑</text>
      <text x="160" y="108" textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="10">ASC</text>
      <circle cx="72" cy="44" r="2" fill="#fff" opacity="0.8" />
      <circle cx="248" cy="36" r="1.5" fill="#fff" opacity="0.6" />
      <circle cx="210" cy="52" r="1.2" fill="#fff" opacity="0.5" />
    </svg>
  )
}

/** Grelha 6×2 com figuras douradas estilo cartaz zodiacal. */
function ArtSignos() {
  const cols = 6
  const rows = 2
  const padX = 8
  const padY = 8
  const gapX = 4
  const gapY = 4
  const cellW = (320 - padX * 2 - gapX * (cols - 1)) / cols
  const cellH = (132 - padY * 2 - gapY * (rows - 1)) / rows

  return (
    <svg viewBox="0 0 320 132" className="landing-guide-art-svg landing-guide-art-svg--signos" aria-hidden>
      <GoldDefs id="guideSignos" />
      <rect width="320" height="132" fill="url(#guideSignos-sky)" />
      {ZODIAC_FIGURE_PATHS.map((_, i) => {
        const col = i % cols
        const row = Math.floor(i / cols)
        const x = padX + col * (cellW + gapX)
        const y = padY + row * (cellH + gapY)
        const figX = x + cellW / 2
        const figY = y + cellH * 0.42
        const label = ZODIAC_LABELS[i]
        return (
          <g key={label}>
            <rect
              x={x}
              y={y}
              width={cellW}
              height={cellH}
              rx="4"
              fill="rgba(0,0,0,0.22)"
              stroke="rgba(223,183,108,0.18)"
              strokeWidth="0.5"
            />
            <ZodiacFigure index={i} x={figX} y={figY} scale={1.15} />
            <text
              x={x + cellW / 2}
              y={y + cellH - 5}
              textAnchor="middle"
              fill="rgba(255,240,210,0.82)"
              fontSize="5.2"
              fontFamily="Georgia, 'Times New Roman', serif"
              letterSpacing="0.04em"
            >
              {label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function ArtTarot({ accent }) {
  return (
    <svg viewBox="0 0 320 132" className="landing-guide-art-svg" aria-hidden>
      <defs>
        <radialGradient id="guideTarotGlow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#34D399" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#34D399" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="132" fill="url(#guideTarotGlow)" />
      {[
        { x: 108, rot: -14, sym: '☽' },
        { x: 160, rot: 0, sym: '✦' },
        { x: 212, rot: 14, sym: '☉' },
      ].map(({ x, rot, sym }) => (
        <g key={x} transform={`translate(${x} 66) rotate(${rot})`}>
          <rect x="-28" y="-40" width="56" height="80" rx="8" fill="rgba(20,14,45,0.95)" stroke={accent} strokeWidth="1.2" />
          <rect x="-22" y="-34" width="44" height="68" rx="5" fill="none" stroke="rgba(255,255,255,0.08)" />
          <text textAnchor="middle" y="6" fill={accent} fontSize="20">{sym}</text>
        </g>
      ))}
    </svg>
  )
}

const ARTS = {
  mapa: ArtMapa,
  ascendente: ArtAscendente,
  signos: ArtSignos,
  tarot: ArtTarot,
}

export function LandingGuideArt({ id, accent = '#DFB76C' }) {
  const Art = ARTS[id] || ArtMapa
  return (
    <div className={`landing-guide-art${id === 'signos' || id === 'mapa' ? ` landing-guide-art--${id}` : ''}`} style={{ '--guide-accent': accent }}>
      <Art accent={accent} />
    </div>
  )
}
