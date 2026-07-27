import { NatalChartPremiumArt } from './NatalChartPremiumArt.jsx'

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

function ArtMapa() {
  return <NatalChartPremiumArt variant="wheel" className="landing-guide-art--mapa-wheel" />
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
  const cx = 160
  const cy = 64
  const r = 40

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
      <circle cx={cx} cy={cy} r={r + 6} fill="rgba(8,5,24,0.45)" stroke={accent} strokeWidth="1.2" opacity="0.9" />
      <circle cx={cx} cy={cy} r={r - 10} fill="none" stroke="rgba(147,197,253,0.25)" strokeWidth="0.7" strokeDasharray="3 4" />
      {zodiac.map((sym, i) => {
        const a = (i * 30 - 90) * (Math.PI / 180)
        const x = cx + Math.cos(a) * r
        const y = cy + Math.sin(a) * r
        return (
          <text
            key={sym}
            x={x}
            y={y + 0.5}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="rgba(223,183,108,0.9)"
            fontSize="9"
          >
            {sym}
          </text>
        )
      })}
      <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle" fill={accent} fontSize="8" fontWeight="700" letterSpacing="0.12em">12</text>
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
