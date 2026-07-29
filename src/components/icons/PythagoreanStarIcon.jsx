/** Estrela pitagórica - pentagrama linear com números (numerologia). */
export function PythagoreanStarIcon({
  size = 24,
  color = 'currentColor',
  strokeWidth = 1.35,
  className = '',
}) {
  const verts = [0, 1, 2, 3, 4].map((i) => {
    const angle = ((i * 72 - 90) * Math.PI) / 180
    const r = 9.2
    return {
      x: 12 + Math.cos(angle) * r,
      y: 12 + Math.sin(angle) * r,
      n: [1, 4, 2, 8, 5][i],
    }
  })

  const starOrder = [0, 2, 4, 1, 3, 0]
  const starPath = starOrder
    .map((idx, i) => `${i === 0 ? 'M' : 'L'} ${verts[idx].x} ${verts[idx].y}`)
    .join(' ')

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d={starPath}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {verts.map((p) => (
        <text
          key={p.n}
          x={p.x}
          y={p.y + 0.5}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={color}
          fontSize="4.2"
          fontWeight="700"
          fontFamily="system-ui, sans-serif"
        >
          {p.n}
        </text>
      ))}
      <circle cx="12" cy="12" r="1.1" fill={color} opacity="0.85" />
    </svg>
  )
}
