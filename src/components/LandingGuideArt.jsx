const ZODIAC = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓']

const SIGNO_COLORS = [
  '#F472B6', '#FB923C', '#FBBF24', '#4ADE80', '#34D399', '#2DD4BF',
  '#60A5FA', '#818CF8', '#A78BFA', '#C084FC', '#E879F9', '#DFB76C',
]

function GoldDefs({ id }) {
  return (
    <defs>
      <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFF3D4" />
        <stop offset="45%" stopColor="#E8C97A" />
        <stop offset="100%" stopColor="#B8860B" />
      </linearGradient>
      <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#2e1065" />
        <stop offset="45%" stopColor="#4c1d95" />
        <stop offset="100%" stopColor="#7c2d12" stopOpacity="0.55" />
      </linearGradient>
      <filter id={`${id}-glow`} x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="1.2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  )
}

/** Mandala em losango - sem círculo exterior, estilo carta simplificada. */
function ArtMapa({ accent }) {
  const cx = 160
  const cy = 62
  const houses = Array.from({ length: 12 }, (_, i) => {
    const a = (i * 30 - 90) * (Math.PI / 180)
    return { a, i }
  })
  const planets = [
    { sym: '☉', x: cx, y: cy - 4, c: '#FBBF24' },
    { sym: '☽', x: cx - 28, y: cy + 10, c: '#C4B5FD' },
    { sym: '☿', x: cx + 22, y: cy - 14, c: '#93C5FD' },
    { sym: '♀', x: cx - 12, y: cy + 18, c: '#F9A8D4' },
    { sym: '♂', x: cx + 30, y: cy + 8, c: '#FCA5A5' },
  ]

  return (
    <svg viewBox="0 0 320 120" className="landing-guide-art-svg" aria-hidden>
      <GoldDefs id="guideMapa" />
      <rect width="320" height="120" fill="url(#guideMapa-sky)" opacity="0.85" />
      <polygon
        points={`${cx},14 ${286},${cy} ${cx},110 ${34},${cy}`}
        fill="rgba(8,5,24,0.55)"
        stroke={accent}
        strokeWidth="1.2"
        opacity="0.9"
      />
      <polygon
        points={`${cx},32 ${252},${cy} ${cx},92 ${68},${cy}`}
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="0.7"
      />
      {houses.map(({ a, i }) => {
        const x2 = cx + Math.cos(a) * 72
        const y2 = cy + Math.sin(a) * 48
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={x2}
            y2={y2}
            stroke="rgba(223,183,108,0.22)"
            strokeWidth={i % 3 === 0 ? 0.9 : 0.5}
          />
        )
      })}
      <line x1={34} y1={cy} x2={286} y2={cy} stroke={accent} strokeWidth="1" opacity="0.45" />
      <line x1={cx} y1={14} x2={cx} y2={110} stroke={accent} strokeWidth="1" opacity="0.35" />
      {planets.map(({ sym, x, y, c }) => (
        <g key={sym} filter="url(#guideMapa-glow)">
          <rect x={x - 9} y={y - 9} width="18" height="18" rx="4" fill="rgba(0,0,0,0.45)" stroke={c} strokeWidth="0.8" />
          <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle" fill={c} fontSize="10">{sym}</text>
        </g>
      ))}
      <text x={cx} y={104} textAnchor="middle" fill="rgba(223,183,108,0.7)" fontSize="7" letterSpacing="0.12em">ASC</text>
      <text x={286} y={cy + 3} textAnchor="middle" fill="rgba(223,183,108,0.55)" fontSize="7">MC</text>
    </svg>
  )
}

function ArtAscendente({ accent }) {
  return (
    <svg viewBox="0 0 320 120" className="landing-guide-art-svg" aria-hidden>
      <defs>
        <linearGradient id="guideAscSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="55%" stopColor="#312e81" />
          <stop offset="100%" stopColor="#4c1d95" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <rect width="320" height="120" fill="url(#guideAscSky)" />
      <path d="M0 78 Q80 58 160 72 T320 68 L320 120 L0 120 Z" fill="rgba(15,10,35,0.85)" />
      <line x1="0" y1="72" x2="320" y2="72" stroke={accent} strokeWidth="2" opacity="0.9" />
      <path d="M160 72 L160 28" stroke={accent} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.7" />
      <text x="160" y="22" textAnchor="middle" fill={accent} fontSize="22" fontWeight="700">↑</text>
      <text x="160" y="98" textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="10">ASC</text>
      <circle cx="72" cy="40" r="2" fill="#fff" opacity="0.8" />
      <circle cx="248" cy="32" r="1.5" fill="#fff" opacity="0.6" />
      <circle cx="210" cy="48" r="1.2" fill="#fff" opacity="0.5" />
    </svg>
  )
}

/** Grelha 6×2 de signos dourados - sem roda circular. */
function ArtSignos({ accent }) {
  const cols = 6
  const rows = 2
  const padX = 10
  const padY = 10
  const gapX = 5
  const gapY = 6
  const cellW = (320 - padX * 2 - gapX * (cols - 1)) / cols
  const cellH = (120 - padY * 2 - gapY * (rows - 1)) / rows

  return (
    <svg viewBox="0 0 320 120" className="landing-guide-art-svg" aria-hidden>
      <GoldDefs id="guideSignos" />
      <rect width="320" height="120" fill="url(#guideSignos-sky)" />
      {ZODIAC.map((sym, i) => {
        const col = i % cols
        const row = Math.floor(i / cols)
        const x = padX + col * (cellW + gapX)
        const y = padY + row * (cellH + gapY)
        const tint = SIGNO_COLORS[i]
        return (
          <g key={sym}>
            <rect
              x={x}
              y={y}
              width={cellW}
              height={cellH}
              rx="5"
              fill="rgba(0,0,0,0.35)"
              stroke="url(#guideSignos-gold)"
              strokeWidth="0.9"
            />
            <rect
              x={x + 2}
              y={y + 2}
              width={cellW - 4}
              height={cellH - 4}
              rx="4"
              fill={`${tint}18`}
              stroke="none"
            />
            <text
              x={x + cellW / 2}
              y={y + cellH / 2 + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="url(#guideSignos-gold)"
              fontSize="13"
              fontWeight="600"
              filter="url(#guideSignos-glow)"
            >
              {sym}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function ArtTarot({ accent }) {
  return (
    <svg viewBox="0 0 320 120" className="landing-guide-art-svg" aria-hidden>
      <defs>
        <radialGradient id="guideTarotGlow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#34D399" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#34D399" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="120" fill="url(#guideTarotGlow)" />
      {[
        { x: 108, rot: -14, sym: '☽' },
        { x: 160, rot: 0, sym: '✦' },
        { x: 212, rot: 14, sym: '☉' },
      ].map(({ x, rot, sym }) => (
        <g key={x} transform={`translate(${x} 62) rotate(${rot})`}>
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
    <div className="landing-guide-art" style={{ '--guide-accent': accent }}>
      <Art accent={accent} />
    </div>
  )
}
