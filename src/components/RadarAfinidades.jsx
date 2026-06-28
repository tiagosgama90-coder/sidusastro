/**
 * Radar de Afinidades - gráfico SVG minimalista (4 dimensões).
 */
const CORES = {
  dourado: '#DFB76C',
  brancoMuted: 'rgba(255,255,255,0.45)',
  brancoSuave: 'rgba(255,255,255,0.85)',
}

export function RadarAfinidades({
  scores,
  labels,
  total,
  size = 300,
}) {
  const cx = size / 2
  const cy = size / 2
  const maxR = size * 0.34
  const axes = [
    { key: 'quimica', angle: -90, color: '#F87171', val: scores.quimica ?? 0 },
    { key: 'comunicacao', angle: 0, color: '#60A5FA', val: scores.comunicacao ?? 0 },
    { key: 'futuro', angle: 90, color: '#4ADE80', val: scores.futuro ?? scores.proposito ?? 0 },
    { key: 'emocao', angle: 180, color: '#818CF8', val: scores.emocao ?? 0 },
  ]

  const toXY = (angleDeg, radius) => {
    const rad = (angleDeg * Math.PI) / 180
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) }
  }

  const gridLevels = [0.25, 0.5, 0.75, 1]
  const dataPoints = axes.map((a) => toXY(a.angle, maxR * (a.val / 100)))
  const polygon = dataPoints.map((p) => `${p.x},${p.y}`).join(' ')

  return (
    <div style={{ textAlign: 'center' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', margin: '0 auto' }}>
        <defs>
          <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(223,183,108,0.15)" />
            <stop offset="100%" stopColor="rgba(223,183,108,0)" />
          </radialGradient>
          <linearGradient id="radarFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(223,183,108,0.35)" />
            <stop offset="100%" stopColor="rgba(139,92,246,0.25)" />
          </linearGradient>
        </defs>

        <circle cx={cx} cy={cy} r={maxR * 1.08} fill="url(#radarGlow)" />

        {gridLevels.map((lvl) => {
          const pts = axes.map((a) => toXY(a.angle, maxR * lvl))
          const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'
          return (
            <path
              key={lvl}
              d={d}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={1}
            />
          )
        })}

        {axes.map((a) => {
          const end = toXY(a.angle, maxR)
          return (
            <line
              key={a.key}
              x1={cx}
              y1={cy}
              x2={end.x}
              y2={end.y}
              stroke="rgba(223,183,108,0.2)"
              strokeWidth={1}
            />
          )
        })}

        <polygon
          points={polygon}
          fill="url(#radarFill)"
          stroke={CORES.dourado}
          strokeWidth={2}
          strokeLinejoin="round"
        />

        {dataPoints.map((p, i) => (
          <circle key={axes[i].key} cx={p.x} cy={p.y} r={4} fill={axes[i].color} stroke="#0B071E" strokeWidth={1.5} />
        ))}

        {axes.map((a) => {
          const labelPt = toXY(a.angle, maxR + 28)
          return (
            <g key={`lbl-${a.key}`}>
              <text
                x={labelPt.x}
                y={labelPt.y - 6}
                textAnchor="middle"
                fill={CORES.brancoSuave}
                fontSize={10}
                fontWeight={600}
              >
                {labels[a.key]}
              </text>
              <text
                x={labelPt.x}
                y={labelPt.y + 8}
                textAnchor="middle"
                fill={a.color}
                fontSize={11}
                fontWeight={700}
              >
                {a.val}%
              </text>
            </g>
          )
        })}
      </svg>

      {total != null && (
        <div style={{ marginTop: 4 }}>
          <div style={{ fontSize: 42, fontWeight: 700, color: CORES.dourado, lineHeight: 1 }}>{total}%</div>
          <div style={{ fontSize: 12, color: CORES.brancoMuted, marginTop: 4 }}>{labels.total}</div>
        </div>
      )}
    </div>
  )
}
