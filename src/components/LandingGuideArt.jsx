const ZODIAC = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓']

function ArtMapa({ accent }) {
  return (
    <svg viewBox="0 0 320 120" className="landing-guide-art-svg" aria-hidden>
      <defs>
        <radialGradient id="guideMapaGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="120" fill="url(#guideMapaGlow)" />
      <circle cx="160" cy="62" r="44" fill="none" stroke={accent} strokeWidth="1.5" opacity="0.85" />
      <circle cx="160" cy="62" r="30" fill="rgba(0,0,0,0.25)" stroke="rgba(255,255,255,0.12)" />
      {ZODIAC.map((sym, i) => {
        const a = (i * 2 * Math.PI) / 12 - Math.PI / 2
        const x = 160 + Math.cos(a) * 44
        const y = 62 + Math.sin(a) * 44
        return <text key={sym} x={x} y={y} textAnchor="middle" dominantBaseline="central" fill={accent} fontSize="11" opacity="0.9">{sym}</text>
      })}
      <line x1="118" y1="62" x2="202" y2="62" stroke={accent} strokeWidth="1.2" opacity="0.5" />
      <circle cx="128" cy="52" r="5" fill="#FBBF24" />
      <circle cx="175" cy="70" r="4" fill="#93C5FD" />
      <circle cx="148" cy="78" r="3.5" fill="#F472B6" />
      <text x="160" y="64" textAnchor="middle" fill="#fff" fontSize="16" opacity="0.9">☉</text>
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

function ArtSignos({ accent }) {
  return (
    <svg viewBox="0 0 320 120" className="landing-guide-art-svg" aria-hidden>
      <rect width="320" height="120" fill="rgba(0,0,0,0.2)" />
      <g transform="translate(160 60)">
        {ZODIAC.map((sym, i) => {
          const a = (i * 2 * Math.PI) / 12 - Math.PI / 2
          const x = Math.cos(a) * 46
          const y = Math.sin(a) * 46
          const colors = ['#F472B6', '#FB923C', '#FBBF24', '#4ADE80', '#34D399', '#2DD4BF', '#60A5FA', '#818CF8', '#A78BFA', '#C084FC', '#E879F9', accent]
          return (
            <g key={sym} transform={`translate(${x} ${y})`}>
              <circle r="14" fill="rgba(0,0,0,0.35)" stroke={colors[i]} strokeWidth="1" opacity="0.95" />
              <text textAnchor="middle" dominantBaseline="central" fill={colors[i]} fontSize="12">{sym}</text>
            </g>
          )
        })}
        <circle r="18" fill="rgba(11,7,30,0.9)" stroke={accent} strokeWidth="1.2" />
        <text textAnchor="middle" dominantBaseline="central" fill={accent} fontSize="11" fontWeight="700">12</text>
      </g>
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
