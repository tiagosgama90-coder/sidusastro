const ZODIAC = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓']

/** Anel dos 12 signos — decoração mística Sidus (não traduzir). */
export function SidusZodiacRing({ size = 118, className = '', accent = '#93C5FD' }) {
  const cx = size / 2
  const cy = size / 2
  const r = size * 0.34
  const uid = `zodiac-${size}`

  return (
    <svg
      className={`sidus-zodiac-ring notranslate ${className}`.trim()}
      translate="no"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      aria-hidden
    >
      <defs>
        <radialGradient id={`${uid}-bg`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(49,46,129,0.55)" />
          <stop offset="70%" stopColor="rgba(30,27,75,0.35)" />
          <stop offset="100%" stopColor="rgba(11,7,30,0)" />
        </radialGradient>
        <filter id={`${uid}-glow`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle cx={cx} cy={cy} r={r + 10} fill={`url(#${uid}-bg)`} />
      <circle
        cx={cx}
        cy={cy}
        r={r + 4}
        fill="rgba(8,5,24,0.5)"
        stroke="rgba(223,183,108,0.35)"
        strokeWidth="1.1"
        filter={`url(#${uid}-glow)`}
      />
      <circle
        cx={cx}
        cy={cy}
        r={r - 12}
        fill="none"
        stroke="rgba(147,197,253,0.28)"
        strokeWidth="0.8"
        strokeDasharray="4 5"
        className="sidus-zodiac-ring__inner"
      />
      {ZODIAC.map((sym, i) => {
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
            fill="rgba(223,183,108,0.92)"
            fontSize={size * 0.095}
            className="sidus-zodiac-ring__glyph"
            style={{ animationDelay: `${i * 0.15}s` }}
          >
            {sym}
          </text>
        )
      })}
      <circle cx={cx} cy={cy} r="2.2" fill="#DFB76C" opacity="0.85" />
    </svg>
  )
}
