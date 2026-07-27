const GUIDE_H = 128

function GoldDefs({ id }) {
  return (
    <defs>
      <linearGradient id={`${id}-gold`} x1="20%" y1="0%" x2="80%" y2="100%">
        <stop offset="0%" stopColor="#FFF8E7" />
        <stop offset="35%" stopColor="#F0D78C" />
        <stop offset="70%" stopColor="#D4A84B" />
        <stop offset="100%" stopColor="#9A6B1A" />
      </linearGradient>
      <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#1e0a3c" />
        <stop offset="40%" stopColor="#4c1d95" />
        <stop offset="75%" stopColor="#6b21a8" />
        <stop offset="100%" stopColor="#9a3412" stopOpacity="0.65" />
      </linearGradient>
      <linearGradient id={`${id}-card`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1a1038" />
        <stop offset="100%" stopColor="#0b071e" />
      </linearGradient>
    </defs>
  )
}

function TarotCardFace({ x, y, rot, accent, face = 'back', scale = 1 }) {
  const w = 44 * scale
  const h = 68 * scale
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={5 * scale} fill="url(#guideTarot-card)" stroke={accent} strokeWidth={1.1 * scale} />
      <rect x={-w / 2 + 4 * scale} y={-h / 2 + 4 * scale} width={w - 8 * scale} height={h - 8 * scale} rx={3 * scale} fill="none" stroke="rgba(223,183,108,0.25)" strokeWidth={0.7 * scale} />
      {face === 'back' ? (
        <>
          <circle cx="0" cy="0" r={10 * scale} fill="none" stroke={accent} strokeWidth={0.8 * scale} opacity="0.7" />
          <path d={`M0 ${-14 * scale} L${4 * scale} ${-4 * scale} L${14 * scale} 0 L${4 * scale} ${4 * scale} L0 ${14 * scale} L${-4 * scale} ${4 * scale} L${-14 * scale} 0 L${-4 * scale} ${-4 * scale} Z`} fill="none" stroke={accent} strokeWidth={0.6 * scale} opacity="0.55" />
          <circle cx="0" cy="0" r={2.2 * scale} fill={accent} opacity="0.85" />
        </>
      ) : (
        <>
          <circle cx="0" cy={-6 * scale} r={9 * scale} fill="rgba(251,191,36,0.15)" stroke="#FBBF24" strokeWidth={0.8 * scale} />
          <text x="0" y={-3 * scale} textAnchor="middle" fill="#FBBF24" fontSize={11 * scale} fontWeight="700">☉</text>
          <path d={`M0 ${8 * scale} L${3 * scale} ${14 * scale} L${-3 * scale} ${14 * scale} Z`} fill="none" stroke={accent} strokeWidth={0.7 * scale} />
          <text x="0" y={24 * scale} textAnchor="middle" fill={accent} fontSize={5.5 * scale} fontWeight="700" letterSpacing="0.08em">XIX</text>
        </>
      )}
    </g>
  )
}

/** Mapa natal — painel retangular estilo relatório (sem roda circular). */
function ArtMapa({ accent }) {
  const planets = [
    { sym: '☉', x: 52, y: 44, c: '#FBBF24' },
    { sym: '☽', x: 118, y: 38, c: '#C4B5FD' },
    { sym: '☿', x: 186, y: 52, c: '#93C5FD' },
    { sym: '♀', x: 248, y: 44, c: '#F9A8D4' },
    { sym: '♂', x: 278, y: 78, c: '#FCA5A5' },
  ]

  return (
    <svg viewBox={`0 0 320 ${GUIDE_H}`} className="landing-guide-art-svg" preserveAspectRatio="xMidYMid meet" aria-hidden>
      <GoldDefs id="guideMapa" />
      <rect width="320" height={GUIDE_H} fill="url(#guideMapa-sky)" opacity="0.9" />
      <rect x="28" y="18" width="264" height="92" rx="10" fill="rgba(8,5,24,0.55)" stroke={accent} strokeWidth="1.2" />
      <path d="M40 30 H280 M40 54 H280 M40 78 H280 M40 102 H280" stroke="rgba(223,183,108,0.14)" strokeWidth="0.6" />
      <path d="M88 30 V102 M160 30 V102 M232 30 V102" stroke="rgba(223,183,108,0.1)" strokeWidth="0.5" />
      <text x="40" y="36" fill={accent} fontSize="6.5" fontWeight="700" letterSpacing="0.1em">MAPA NATAL</text>
      <text x="278" y="36" textAnchor="end" fill="rgba(255,255,255,0.45)" fontSize="6">PDF</text>
      {planets.map(({ sym, x, y, c }) => (
        <g key={sym}>
          <rect x={x - 14} y={y - 10} width="28" height="20" rx="4" fill="rgba(0,0,0,0.35)" stroke={c} strokeWidth="0.7" />
          <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle" fill={c} fontSize="8">{sym}</text>
        </g>
      ))}
      <path d="M48 108 Q160 118 272 108" fill="none" stroke="rgba(147,197,253,0.35)" strokeWidth="0.8" strokeDasharray="4 4" />
      <text x="48" y="122" fill="rgba(255,255,255,0.5)" fontSize="7">Casas · Aspectos · Ângulos</text>
    </svg>
  )
}

function ArtAscendente({ accent }) {
  return (
    <svg viewBox={`0 0 320 ${GUIDE_H}`} className="landing-guide-art-svg" preserveAspectRatio="xMidYMid meet" aria-hidden>
      <defs>
        <linearGradient id="guideAscSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="55%" stopColor="#312e81" />
          <stop offset="100%" stopColor="#4c1d95" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <rect width="320" height={GUIDE_H} fill="url(#guideAscSky)" />
      <path d={`M0 82 Q80 60 160 74 T320 70 L320 ${GUIDE_H} L0 ${GUIDE_H} Z`} fill="rgba(15,10,35,0.85)" />
      <line x1="0" y1="74" x2="320" y2="74" stroke={accent} strokeWidth="2" opacity="0.9" />
      <path d="M160 74 L160 28" stroke={accent} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.7" />
      <text x="160" y="22" textAnchor="middle" fill={accent} fontSize="20" fontWeight="700">↑</text>
      <text x="160" y="104" textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="9">ASC</text>
      <circle cx="72" cy="40" r="1.8" fill="#fff" opacity="0.8" />
      <circle cx="248" cy="34" r="1.4" fill="#fff" opacity="0.6" />
      <circle cx="210" cy="48" r="1.1" fill="#fff" opacity="0.5" />
    </svg>
  )
}

function ArtSignos({ accent }) {
  const zodiac = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓']
  const points = zodiac.map((sym, i) => ({
    sym,
    x: 24 + i * 23.5,
    y: 64 + Math.sin(i * 0.55) * 18,
  }))

  return (
    <svg viewBox={`0 0 320 ${GUIDE_H}`} className="landing-guide-art-svg" preserveAspectRatio="xMidYMid meet" aria-hidden>
      <defs>
        <linearGradient id="guideSignosSky" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="45%" stopColor="#312e81" />
          <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.75" />
        </linearGradient>
      </defs>
      <rect width="320" height={GUIDE_H} fill="url(#guideSignosSky)" />
      <path
        d={points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')}
        fill="none"
        stroke="rgba(223,183,108,0.35)"
        strokeWidth="0.9"
        strokeDasharray="3 4"
      />
      {points.map(({ sym, x, y }) => (
        <g key={sym}>
          <circle cx={x} cy={y} r="7" fill="rgba(8,5,24,0.5)" stroke={accent} strokeWidth="0.7" />
          <text x={x} y={y + 0.5} textAnchor="middle" dominantBaseline="middle" fill="rgba(223,183,108,0.92)" fontSize="7.5">
            {sym}
          </text>
        </g>
      ))}
      <text x="160" y="118" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7" letterSpacing="0.12em">12 ARQUÉTIPOS</text>
    </svg>
  )
}

function ArtTarot({ accent }) {
  return (
    <svg viewBox={`0 0 320 ${GUIDE_H}`} className="landing-guide-art-svg" preserveAspectRatio="xMidYMid meet" aria-hidden>
      <GoldDefs id="guideTarot" />
      <rect width="320" height={GUIDE_H} fill="url(#guideTarot-sky)" opacity="0.92" />
      <ellipse cx="160" cy="64" rx="120" ry="42" fill="rgba(52,211,153,0.08)" />
      <TarotCardFace x={108} y={66} rot={-16} accent={accent} face="back" />
      <TarotCardFace x={160} y={64} rot={0} accent={accent} face="sun" scale={1.05} />
      <TarotCardFace x={212} y={66} rot={16} accent={accent} face="back" />
      <text x="160" y="118" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="7" letterSpacing="0.14em">TAROT SIDUS</text>
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
