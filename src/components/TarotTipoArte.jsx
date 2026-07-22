/** Ilustrações místicas por tipo de leitura de tarot (SVG). */

const PALETAS = {
  diaria: ['#F59E0B', '#7C3AED'],
  simnao: ['#8B5CF6', '#312E81'],
  amor: ['#EC4899', '#831843'],
  geral: ['#DFB76C', '#6D28D9'],
  cigano: ['#10B981', '#064E3B'],
  oraculo: ['#6366F1', '#1E1B4B'],
  trabalho: ['#3B82F6', '#1E3A8A'],
  ferradura: ['#D97706', '#78350F'],
  cruzcelta: ['#A78BFA', '#4C1D95'],
}

function gradiente(id, cores) {
  return (
    <defs>
      <linearGradient id={`tg-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={cores[0]} stopOpacity="0.85" />
        <stop offset="100%" stopColor={cores[1]} stopOpacity="0.95" />
      </linearGradient>
      <radialGradient id={`tg-glow-${id}`} cx="50%" cy="30%" r="65%">
        <stop offset="0%" stopColor="#DFB76C" stopOpacity="0.35" />
        <stop offset="100%" stopColor="transparent" />
      </radialGradient>
    </defs>
  )
}

const SIMBOLOS = {
  diaria: (
    <g fill="none" stroke="#DFB76C" strokeWidth="1.2" opacity="0.9">
      <circle cx="48" cy="38" r="14" fill="rgba(223,183,108,0.15)" />
      <path d="M48 24 L48 52 M34 38 L62 38" />
      <path d="M30 58 Q48 48 66 58" strokeOpacity="0.5" />
    </g>
  ),
  simnao: (
    <g fill="none" stroke="#DFB76C" strokeWidth="1.2">
      <circle cx="48" cy="44" r="18" />
      <path d="M40 44 h16 M48 36 v16" />
      <text x="48" y="72" textAnchor="middle" fill="#DFB76C" fontSize="10" fontFamily="Georgia,serif">?</text>
    </g>
  ),
  amor: (
    <g fill="#EC4899" opacity="0.85">
      <path d="M48 62 C48 62 28 46 28 34 C28 26 34 22 40 24 C44 18 52 18 48 28 C52 18 60 18 56 24 C62 22 68 26 68 34 C68 46 48 62 48 62 Z" />
    </g>
  ),
  geral: (
    <g fill="none" stroke="#DFB76C" strokeWidth="1.1">
      <rect x="28" y="30" width="16" height="24" rx="2" opacity="0.7" />
      <rect x="40" y="26" width="16" height="28" rx="2" />
      <rect x="52" y="32" width="16" height="22" rx="2" opacity="0.7" />
    </g>
  ),
  cigano: (
    <g fill="none" stroke="#34D399" strokeWidth="1.2">
      <rect x="30" y="28" width="36" height="48" rx="4" />
      <circle cx="48" cy="48" r="8" fill="rgba(52,211,153,0.2)" />
      <path d="M36 36 h24 M36 60 h24" strokeOpacity="0.4" />
    </g>
  ),
  oraculo: (
    <g fill="none" stroke="#A78BFA" strokeWidth="1">
      <circle cx="48" cy="44" r="20" />
      <circle cx="48" cy="44" r="12" strokeOpacity="0.5" />
      <circle cx="48" cy="44" r="3" fill="#DFB76C" />
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <line key={deg} x1="48" y1="44" x2={48 + 18 * Math.cos((deg * Math.PI) / 180)} y2={44 + 18 * Math.sin((deg * Math.PI) / 180)} strokeOpacity="0.35" />
      ))}
    </g>
  ),
  trabalho: (
    <g fill="none" stroke="#60A5FA" strokeWidth="1.2">
      <rect x="32" y="34" width="32" height="24" rx="3" />
      <path d="M38 34 V30 h20 v4" />
      <line x1="38" y1="46" x2="58" y2="46" strokeOpacity="0.5" />
      <line x1="38" y1="50" x2="52" y2="50" strokeOpacity="0.5" />
    </g>
  ),
  ferradura: (
    <g fill="none" stroke="#F59E0B" strokeWidth="1.4">
      <path d="M28 52 C28 32 48 24 48 24 C48 24 68 32 68 52 C68 58 62 62 56 58 C50 54 46 54 40 58 C34 62 28 58 28 52 Z" />
    </g>
  ),
  cruzcelta: (
    <g fill="none" stroke="#C4B5FD" strokeWidth="1.1">
      <line x1="48" y1="24" x2="48" y2="68" />
      <line x1="30" y1="44" x2="66" y2="44" />
      <circle cx="48" cy="44" r="6" fill="rgba(196,181,253,0.2)" />
      <circle cx="48" cy="24" r="3" fill="#DFB76C" opacity="0.6" />
      <circle cx="66" cy="44" r="3" fill="#DFB76C" opacity="0.6" />
      <circle cx="48" cy="68" r="3" fill="#DFB76C" opacity="0.6" />
      <circle cx="30" cy="44" r="3" fill="#DFB76C" opacity="0.6" />
    </g>
  ),
}

export function TarotTipoArte({ tipoId, size = 72 }) {
  const cores = PALETAS[tipoId] || PALETAS.geral
  const h = Math.round(size * 1.15)
  return (
    <svg width={size} height={h} viewBox="0 0 96 88" style={{ display: 'block', flexShrink: 0 }}>
      {gradiente(tipoId, cores)}
      <rect width="96" height="88" rx="12" fill={`url(#tg-${tipoId})`} />
      <rect width="96" height="88" rx="12" fill={`url(#tg-glow-${tipoId})`} />
      <rect x="1.5" y="1.5" width="93" height="85" rx="11" fill="none" stroke="rgba(223,183,108,0.45)" strokeWidth="1" />
      {SIMBOLOS[tipoId] || SIMBOLOS.geral}
      <text x="48" y="82" textAnchor="middle" fill="rgba(223,183,108,0.35)" fontSize="8" fontFamily="Georgia,serif">✦</text>
    </svg>
  )
}
