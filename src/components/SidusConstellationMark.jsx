/** Constelação «S» - marca Sidus (não traduzir). */
export function SidusConstellationMark({
  size = 32,
  className = '',
  glow = true,
  strokeWidth = 1.35,
}) {
  const id = `sidus-glow-${size}`
  return (
    <svg
      className={`sidus-constellation-mark notranslate ${className}`.trim()}
      translate="no"
      width={size}
      height={size * 1.35}
      viewBox="0 0 48 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {glow && (
        <defs>
          <radialGradient id={`${id}-star`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF8E7" />
            <stop offset="45%" stopColor="#DFB76C" />
            <stop offset="100%" stopColor="#B8944F" />
          </radialGradient>
          <filter id={id} x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id={`${id}-gold`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F0D08A" />
            <stop offset="50%" stopColor="#DFB76C" />
            <stop offset="100%" stopColor="#C9A55A" />
          </linearGradient>
        </defs>
      )}
      <path
        d="M24 10 L36 22 L12 32 L34 44 L14 54"
        stroke={glow ? `url(#${id}-gold)` : '#DFB76C'}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="14" cy="54" r="2.1" fill={glow ? `url(#${id}-gold)` : '#DFB76C'} />
      <circle cx="34" cy="44" r="2.1" fill={glow ? `url(#${id}-gold)` : '#DFB76C'} />
      <circle cx="12" cy="32" r="2.1" fill={glow ? `url(#${id}-gold)` : '#DFB76C'} />
      <circle cx="36" cy="22" r="2.1" fill={glow ? `url(#${id}-gold)` : '#DFB76C'} />
      <circle
        cx="24"
        cy="10"
        r="3.2"
        fill={glow ? `url(#${id}-star)` : '#DFB76C'}
        filter={glow ? `url(#${id})` : undefined}
      />
      <circle cx="24" cy="58" r="2" fill={glow ? `url(#${id}-gold)` : '#DFB76C'} opacity="0.9" />
    </svg>
  )
}
