import {
  SIGNOS_ZODIACO,
  anguloCarta,
  arcoSvg,
  corAspecto,
  corElementoSigno,
  nomePlanetaDeAspeto,
  normalizarLongitude,
  polarParaXY,
  prepararDadosMandala,
  separarPlanetasSobrepostos,
} from '../lib/mandalaNatal.js'

const CORES = {
  dourado: '#DFB76C',
  douradoSuave: 'rgba(223,183,108,0.45)',
  fundo: '#0B071E',
  branco: 'rgba(255,255,255,0.88)',
  muted: 'rgba(255,255,255,0.35)',
}

function linhaCuspide(cx, cy, r0, r1, longitude, asc) {
  const a = anguloCarta(longitude, asc)
  const p0 = polarParaXY(a, r0, cx, cy)
  const p1 = polarParaXY(a, r1, cx, cy)
  return { x1: p0.x, y1: p0.y, x2: p1.x, y2: p1.y, angle: a }
}

/**
 * Roda natal SVG personalizada — Placidus, planetas e aspectos do utilizador.
 */
export function MandalaNatal({ mapaNatal, planetas = [], aspectos = [], size = 340, className, style, unavailableLabel }) {
  const dados = prepararDadosMandala(mapaNatal, planetas)
  if (!dados) {
    if (!unavailableLabel) return null
    return (
      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', textAlign: 'center', margin: 0 }}>
        {unavailableLabel}
      </p>
    )
  }

  const { ascLon, cusps, mcLon, dcLon, icLon, planetas: planetasNorm } = dados

  const cx = size / 2
  const cy = size / 2
  const rOuter = size * 0.47
  const rZodiacOut = rOuter
  const rZodiacIn = rOuter * 0.84
  const rHouseOut = rOuter * 0.8
  const rHouseIn = rOuter * 0.56
  const rPlanet = rOuter * 0.68
  const rAspect = rOuter * 0.38
  const rCenter = rOuter * 0.12

  const planetasVisiveis = separarPlanetasSobrepostos(planetasNorm, ascLon)
  const mapaPos = new Map(
    planetasVisiveis.map((p) => {
      const pt = polarParaXY(p.chartAngle, rPlanet, cx, cy)
      return [p.nome, { ...p, ...pt }]
    }),
  )

  const eixos = [
    { lon: ascLon, label: 'ASC', cor: '#C4B5FD' },
    { lon: mcLon, label: 'MC', cor: '#34D399' },
    { lon: dcLon, label: 'DC', cor: '#F472B6' },
    { lon: icLon, label: 'IC', cor: '#93C5FD' },
  ].filter((e) => e.lon != null)

  return (
    <div className={className} style={{ width: '100%', display: 'flex', justifyContent: 'center', ...style }}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width="100%"
        style={{ maxWidth: size, height: 'auto', display: 'block' }}
        role="img"
        aria-label="Mandala natal"
      >
        <defs>
          <radialGradient id="mandala_bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(139,92,246,0.18)" />
            <stop offset="70%" stopColor="rgba(11,7,30,0.95)" />
            <stop offset="100%" stopColor={CORES.fundo} />
          </radialGradient>
          <filter id="mandala_glow">
            <feGaussianBlur stdDeviation="2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle cx={cx} cy={cy} r={rOuter + 4} fill="url(#mandala_bg)" stroke={CORES.douradoSuave} strokeWidth="1.2" />

        {/* Signos do zodíaco */}
        {SIGNOS_ZODIACO.map((signo, i) => {
          const lon0 = i * 30
          const lon1 = (i + 1) * 30
          const mid = lon0 + 15
          const labelPt = polarParaXY(anguloCarta(mid, ascLon), (rZodiacOut + rZodiacIn) / 2, cx, cy)
          return (
            <g key={signo.simbolo}>
              <path
                d={arcoSvg(cx, cy, rZodiacOut, lon0, lon1, ascLon)}
                fill={corElementoSigno(i)}
                stroke="none"
              />
              <path
                d={arcoSvg(cx, cy, rZodiacIn, lon0, lon1, ascLon)}
                fill={CORES.fundo}
                stroke="none"
              />
              <line
                x1={polarParaXY(anguloCarta(lon0, ascLon), rZodiacIn, cx, cy).x}
                y1={polarParaXY(anguloCarta(lon0, ascLon), rZodiacIn, cx, cy).y}
                x2={polarParaXY(anguloCarta(lon0, ascLon), rZodiacOut, cx, cy).x}
                y2={polarParaXY(anguloCarta(lon0, ascLon), rZodiacOut, cx, cy).y}
                stroke={CORES.douradoSuave}
                strokeWidth="0.6"
              />
              <text
                x={labelPt.x}
                y={labelPt.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={CORES.dourado}
                fontSize={size * 0.052}
                fontFamily="Georgia, serif"
                opacity="0.9"
              >
                {signo.simbolo}
              </text>
            </g>
          )
        })}

        <circle cx={cx} cy={cy} r={rZodiacIn} fill="none" stroke={CORES.douradoSuave} strokeWidth="0.8" />
        <circle cx={cx} cy={cy} r={rHouseOut} fill="rgba(11,7,30,0.6)" stroke={CORES.douradoSuave} strokeWidth="0.6" />

        {/* Casas Placidus */}
        {cusps?.length >= 12 && cusps.map((cusp, i) => {
          const linha = linhaCuspide(cx, cy, rHouseIn, rHouseOut, cusp, ascLon)
          const cuspNext = cusps[(i + 1) % 12]
          let span = normalizarLongitude(cuspNext - cusp)
          if (span <= 0) span += 360
          const midLon = normalizarLongitude(cusp + span / 2)
          const numPt = polarParaXY(anguloCarta(midLon, ascLon), rHouseIn + (rHouseOut - rHouseIn) * 0.35, cx, cy)
          const isAngle = i === 0 || i === 3 || i === 6 || i === 9
          return (
            <g key={`casa-${i}`}>
              <line
                x1={linha.x1}
                y1={linha.y1}
                x2={linha.x2}
                y2={linha.y2}
                stroke={isAngle ? CORES.dourado : CORES.muted}
                strokeWidth={isAngle ? 1.2 : 0.7}
                opacity={isAngle ? 0.95 : 0.55}
              />
              <text
                x={numPt.x}
                y={numPt.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={CORES.muted}
                fontSize={size * 0.028}
                fontFamily="system-ui, sans-serif"
              >
                {i + 1}
              </text>
            </g>
          )
        })}

        <circle cx={cx} cy={cy} r={rHouseIn} fill="none" stroke={CORES.douradoSuave} strokeWidth="0.5" opacity="0.5" />

        {/* Aspectos no centro */}
        {aspectos.map((asp, idx) => {
          const nomeA = nomePlanetaDeAspeto(asp.planetaA)
          const nomeB = nomePlanetaDeAspeto(asp.planetaB)
          const pa = mapaPos.get(nomeA)
          const pb = mapaPos.get(nomeB)
          if (!pa || !pb) return null
          const ca = polarParaXY(anguloCarta(pa.longitude, ascLon), rAspect, cx, cy)
          const cb = polarParaXY(anguloCarta(pb.longitude, ascLon), rAspect, cx, cy)
          return (
            <line
              key={`asp-${idx}`}
              x1={ca.x}
              y1={ca.y}
              x2={cb.x}
              y2={cb.y}
              stroke={corAspecto(asp.aspecto)}
              strokeWidth="0.9"
              opacity="0.55"
            />
          )
        })}

        <circle cx={cx} cy={cy} r={rCenter} fill="rgba(223,183,108,0.08)" stroke={CORES.douradoSuave} strokeWidth="0.6" />
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fill={CORES.dourado} fontSize={size * 0.06} opacity="0.35">✦</text>

        {/* Planetas */}
        {planetasVisiveis.map((p) => {
          const pt = polarParaXY(p.chartAngle, rPlanet, cx, cy)
          return (
            <g key={p.key || p.nome} filter="url(#mandala_glow)">
              <circle cx={pt.x} cy={pt.y} r={size * 0.028} fill="rgba(11,7,30,0.85)" stroke={CORES.dourado} strokeWidth="0.8" />
              <text
                x={pt.x}
                y={pt.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={CORES.branco}
                fontSize={size * 0.042}
                fontFamily="Georgia, serif"
              >
                {p.simbolo}
              </text>
              {p.retrograde && (
                <text
                  x={pt.x + size * 0.028}
                  y={pt.y - size * 0.024}
                  fill="#F87171"
                  fontSize={size * 0.022}
                  fontFamily="system-ui, sans-serif"
                >
                  ℞
                </text>
              )}
            </g>
          )
        })}

        {/* Rótulos dos eixos */}
        {eixos.map((e) => {
          const pt = polarParaXY(anguloCarta(e.lon, ascLon), rOuter + size * 0.04, cx, cy)
          return (
            <text
              key={e.label}
              x={pt.x}
              y={pt.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={e.cor}
              fontSize={size * 0.03}
              fontWeight="700"
              fontFamily="system-ui, sans-serif"
            >
              {e.label}
            </text>
          )
        })}
      </svg>
    </div>
  )
}

export default MandalaNatal
