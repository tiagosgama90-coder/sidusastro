const GOLD = '#C9A24D'
const GOLD_SOFT = 'rgba(201, 162, 77, 0.55)'
const GOLD_DIM = 'rgba(201, 162, 77, 0.28)'

const SIGNS = ['ARIES', 'TAURUS', 'GEMINI', 'CANCER', 'LEO', 'VIRGO', 'LIBRA', 'SCORPIO', 'SAGITTARIUS', 'CAPRICORN', 'AQUARIUS', 'PISCES']
const SYM = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓']

const PLANETS = [
  { sym: '☉', deg: 22, r: 0.42, c: '#F0D78C' },
  { sym: '☽', deg: 118, r: 0.58, c: '#C4B5FD' },
  { sym: '☿', deg: 48, r: 0.35, c: '#93C5FD' },
  { sym: '♀', deg: 165, r: 0.48, c: '#F9A8D4' },
  { sym: '♂', deg: 255, r: 0.52, c: '#FCA5A5' },
  { sym: '♃', deg: 310, r: 0.38, c: '#FDE68A' },
  { sym: '♄', deg: 198, r: 0.62, c: '#D1D5DB' },
]

function polar(cx, cy, r, deg) {
  const rad = ((deg - 90) * Math.PI) / 180
  return { x: cx + Math.cos(rad) * r, y: cy + Math.sin(rad) * r }
}

function NatalWheel({ cx, cy, radius, id }) {
  const rOut = radius
  const rZodiac = radius * 0.88
  const rHouse = radius * 0.62
  const rInner = radius * 0.22

  const planetPts = PLANETS.map((p) => {
    const pt = polar(cx, cy, radius * p.r, p.deg)
    return { ...p, ...pt }
  })

  return (
    <g>
      <circle cx={cx} cy={cy} r={rOut} fill="none" stroke={GOLD} strokeWidth={0.9} opacity={0.95} />
      <circle cx={cx} cy={cy} r={rZodiac} fill="none" stroke={GOLD_DIM} strokeWidth={0.55} />
      <circle cx={cx} cy={cy} r={rHouse} fill="rgba(8,5,20,0.55)" stroke={GOLD_SOFT} strokeWidth={0.65} />
      <circle cx={cx} cy={cy} r={rInner} fill="rgba(4,2,12,0.75)" stroke={GOLD_DIM} strokeWidth={0.45} />

      {Array.from({ length: 12 }, (_, i) => {
        const a = i * 30
        const p1 = polar(cx, cy, rInner, a)
        const p2 = polar(cx, cy, rOut, a)
        const major = i % 3 === 0
        return (
          <line
            key={`h-${i}`}
            x1={p1.x}
            y1={p1.y}
            x2={p2.x}
            y2={p2.y}
            stroke={major ? GOLD_SOFT : GOLD_DIM}
            strokeWidth={major ? 0.55 : 0.35}
          />
        )
      })}

      {Array.from({ length: 12 }, (_, i) => {
        const mid = i * 30 + 15
        const p = polar(cx, cy, rZodiac + radius * 0.06, mid)
        return (
          <text
            key={`z-${i}`}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={GOLD}
            fontSize={radius * 0.055}
            fontWeight="500"
            letterSpacing="0.06em"
            opacity={0.92}
          >
            {SIGNS[i].slice(0, 3)}
          </text>
        )
      })}

      {SYM.map((sym, i) => {
        const p = polar(cx, cy, rZodiac - radius * 0.04, i * 30)
        return (
          <text
            key={`sym-${sym}`}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={GOLD}
            fontSize={radius * 0.075}
            opacity={0.88}
          >
            {sym}
          </text>
        )
      })}

      {[
        [0, 3], [0, 5], [1, 4], [2, 5], [2, 6], [3, 6], [4, 7],
      ].map(([a, b], i) => (
        <line
          key={`asp-${i}`}
          x1={planetPts[a].x}
          y1={planetPts[a].y}
          x2={planetPts[b].x}
          y2={planetPts[b].y}
          stroke={GOLD_DIM}
          strokeWidth={0.4}
        />
      ))}

      {planetPts.map((p) => (
        <g key={p.sym}>
          <circle cx={p.x} cy={p.y} r={radius * 0.028} fill="rgba(0,0,0,0.5)" stroke={p.c} strokeWidth={0.55} />
          <text x={p.x} y={p.y + radius * 0.01} textAnchor="middle" dominantBaseline="middle" fill={p.c} fontSize={radius * 0.05}>
            {p.sym}
          </text>
        </g>
      ))}

      <line x1={cx - rOut} y1={cy} x2={cx + rOut} y2={cy} stroke={GOLD_DIM} strokeWidth={0.35} />
      <line x1={cx} y1={cy - rOut} x2={cx} y2={cy + rOut} stroke={GOLD_DIM} strokeWidth={0.35} />
      <text x={cx - rOut - radius * 0.04} y={cy + radius * 0.03} textAnchor="end" fill={GOLD} fontSize={radius * 0.05} fontWeight="700">ASC</text>
      <text x={cx} y={cy - rOut - radius * 0.03} textAnchor="middle" fill={GOLD} fontSize={radius * 0.045} opacity={0.75}>MC</text>
    </g>
  )
}

/** Roda natal premium — linhas finas douradas sobre fundo escuro (estilo referência). */
export function NatalChartPremiumArt({ variant = 'wheel', className = '' }) {
  if (variant === 'cover') {
    return (
      <div className={`natal-chart-premium natal-chart-premium--cover ${className}`.trim()} aria-hidden>
        <div className="natal-chart-premium__frame">
          <div className="natal-chart-premium__cover-head">
            <span className="natal-chart-premium__brand">SIDUS</span>
            <span className="natal-chart-premium__cover-title">MAPA ASTRAL</span>
          </div>
          <div className="natal-chart-premium__cover-body">
            <svg viewBox="0 0 320 320" className="natal-chart-premium__svg">
              <rect width="320" height="320" fill="#080512" rx="8" />
              <NatalWheel cx={160} cy={160} radius={138} />
            </svg>
            <span className="natal-chart-premium__pdf-badge">PDF</span>
          </div>
          <p className="natal-chart-premium__cover-meta">☉ Sol · ☽ Lua · ASC · MC · 10 planetas · Casas Placidus</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`natal-chart-premium natal-chart-premium--wheel ${className}`.trim()} aria-hidden>
      <svg viewBox="0 0 320 200" className="natal-chart-premium__svg natal-chart-premium__svg--wide" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="natalChartBg" cx="50%" cy="45%" r="65%">
            <stop offset="0%" stopColor="#14102a" />
            <stop offset="100%" stopColor="#06040f" />
          </radialGradient>
        </defs>
        <rect width="320" height="200" fill="url(#natalChartBg)" />
        <NatalWheel cx={160} cy={100} radius={88} />
      </svg>
    </div>
  )
}
