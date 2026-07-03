import { useId, useMemo } from 'react'
import {
  ABREV_SIGNO,
  COR_PLANETA,
  SIGNOS_ZODIACO,
  anguloCarta,
  arcoSvg,
  corAspecto,
  corElementoSigno,
  formatarGrauSigno,
  indiceSignoDePonto,
  nomePlanetaDeAspeto,
  normalizarLongitude,
  polarParaXY,
  prepararDadosMandala,
  separarPlanetasSobrepostos,
} from '../lib/mandalaNatal.js'

const CORES = {
  dourado: '#DFB76C',
  douradoClaro: '#F0D9A8',
  douradoSuave: 'rgba(223,183,108,0.45)',
  fundo: '#0B071E',
  branco: 'rgba(255,255,255,0.92)',
  muted: 'rgba(255,255,255,0.38)',
}

function linhaCuspide(cx, cy, r0, r1, longitude, asc) {
  const a = anguloCarta(longitude, asc)
  const p0 = polarParaXY(a, r0, cx, cy)
  const p1 = polarParaXY(a, r1, cx, cy)
  return { x1: p0.x, y1: p0.y, x2: p1.x, y2: p1.y, angle: a }
}

function corPlaneta(nome) {
  return COR_PLANETA[nome] || CORES.douradoClaro
}

/**
 * Roda natal SVG personalizada — Placidus, planetas e aspectos do utilizador.
 */
export function MandalaNatal({
  mapaNatal,
  planetas = [],
  aspectos = [],
  nome,
  dataNascimento,
  horaNascimento,
  translateSign = (s) => s,
  size = 400,
  className,
  style,
  unavailableLabel,
}) {
  const uid = useId().replace(/:/g, '')
  const dados = prepararDadosMandala(mapaNatal, planetas)

  const signosDestaque = useMemo(() => {
    const set = new Set()
    for (const p of [mapaNatal?.solar, mapaNatal?.lunar, mapaNatal?.ascendente]) {
      const idx = indiceSignoDePonto(p)
      if (idx != null) set.add(idx)
    }
    return set
  }, [mapaNatal])

  const aspectosVisiveis = useMemo(() => {
    return [...aspectos]
      .sort((a, b) => parseFloat(a.orbe) - parseFloat(b.orbe))
      .slice(0, 18)
  }, [aspectos])

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
  const rOuter = size * 0.46
  const rDecor = rOuter + size * 0.018
  const rZodiacOut = rOuter
  const rZodiacIn = rOuter * 0.855
  const rHouseOut = rOuter * 0.81
  const rHouseIn = rOuter * 0.54
  const rPlanet = rOuter * 0.675
  const rTick = rOuter * 0.89
  const rAspect = rOuter * 0.36
  const rCenter = rOuter * 0.1

  const planetasVisiveis = separarPlanetasSobrepostos(planetasNorm, ascLon, 7)
  const mapaPos = new Map(
    planetasVisiveis.map((p) => {
      const pt = polarParaXY(p.chartAngle, rPlanet, cx, cy)
      return [p.nome, { ...p, ...pt }]
    }),
  )

  const eixos = [
    { lon: ascLon, label: 'ASC', cor: '#C4B5FD', peso: 2.2 },
    { lon: mcLon, label: 'MC', cor: '#34D399', peso: 2 },
    { lon: dcLon, label: 'DC', cor: '#F472B6', peso: 1.6 },
    { lon: icLon, label: 'IC', cor: '#93C5FD', peso: 1.6 },
  ].filter((e) => e.lon != null)

  const solSigno = translateSign(mapaNatal?.solar?.nome)
  const luaSigno = translateSign(mapaNatal?.lunar?.nome)
  const ascSigno = translateSign(mapaNatal?.ascendente?.nome)

  return (
    <div className={className} style={{ width: '100%', ...style }}>
      {(nome || dataNascimento) && (
        <div style={{
          textAlign: 'center',
          marginBottom: 16,
          padding: '12px 16px',
          borderRadius: 12,
          background: 'linear-gradient(135deg, rgba(223,183,108,0.08), rgba(139,92,246,0.06))',
          border: '1px solid rgba(223,183,108,0.2)',
        }}>
          {nome && (
            <div style={{ fontSize: 15, fontWeight: 700, color: CORES.branco, letterSpacing: '0.02em', marginBottom: 4 }}>
              {nome}
            </div>
          )}
          {(dataNascimento || horaNascimento) && (
            <div style={{ fontSize: 11, color: CORES.muted, letterSpacing: '0.06em' }}>
              {[dataNascimento, horaNascimento].filter(Boolean).join(' · ')}
            </div>
          )}
          <div style={{ fontSize: 11, color: CORES.dourado, marginTop: 8, fontWeight: 600 }}>
            ☉ {solSigno || '—'} · ☽ {luaSigno || '—'} · ↑ {ascSigno || '—'}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <svg
          viewBox={`0 0 ${size} ${size}`}
          width="100%"
          style={{ maxWidth: size, height: 'auto', display: 'block', filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.45))' }}
          role="img"
          aria-label="Mandala natal personalizada"
        >
          <defs>
            <radialGradient id={`${uid}_bg`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(139,92,246,0.22)" />
              <stop offset="55%" stopColor="rgba(11,7,30,0.92)" />
              <stop offset="100%" stopColor={CORES.fundo} />
            </radialGradient>
            <linearGradient id={`${uid}_ring`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(223,183,108,0.55)" />
              <stop offset="50%" stopColor="rgba(196,181,253,0.35)" />
              <stop offset="100%" stopColor="rgba(223,183,108,0.55)" />
            </linearGradient>
            <filter id={`${uid}_glow`}>
              <feGaussianBlur stdDeviation="2.5" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Halo exterior */}
          <circle cx={cx} cy={cy} r={rDecor + 3} fill="none" stroke="rgba(223,183,108,0.12)" strokeWidth="1" />
          <circle cx={cx} cy={cy} r={rDecor} fill="none" stroke={`url(#${uid}_ring)`} strokeWidth="1.4" opacity="0.85" />

          {/* Marcas de grau (cada 30°) */}
          {Array.from({ length: 12 }, (_, i) => {
            const lon = i * 30
            const a = anguloCarta(lon, ascLon)
            const pIn = polarParaXY(a, rDecor - 2, cx, cy)
            const pOut = polarParaXY(a, rDecor + 5, cx, cy)
            return (
              <line key={`tick-${i}`} x1={pIn.x} y1={pIn.y} x2={pOut.x} y2={pOut.y} stroke={CORES.douradoSuave} strokeWidth="1" opacity="0.7" />
            )
          })}

          <circle cx={cx} cy={cy} r={rOuter + 2} fill={`url(#${uid}_bg)`} stroke={CORES.douradoSuave} strokeWidth="1.3" />

          {/* Signos do zodíaco */}
          {SIGNOS_ZODIACO.map((signo, i) => {
            const lon0 = i * 30
            const lon1 = (i + 1) * 30
            const mid = lon0 + 15
            const destaque = signosDestaque.has(i)
            const labelPt = polarParaXY(anguloCarta(mid, ascLon), (rZodiacOut + rZodiacIn) / 2, cx, cy)
            const abrevPt = polarParaXY(anguloCarta(mid, ascLon), rZodiacOut - size * 0.028, cx, cy)
            return (
              <g key={signo.simbolo}>
                <path
                  d={arcoSvg(cx, cy, rZodiacOut, lon0, lon1, ascLon)}
                  fill={destaque ? 'rgba(223,183,108,0.18)' : corElementoSigno(i)}
                  stroke={destaque ? 'rgba(223,183,108,0.35)' : 'none'}
                  strokeWidth="0.5"
                />
                <path d={arcoSvg(cx, cy, rZodiacIn, lon0, lon1, ascLon)} fill={CORES.fundo} stroke="none" />
                <line
                  x1={polarParaXY(anguloCarta(lon0, ascLon), rZodiacIn, cx, cy).x}
                  y1={polarParaXY(anguloCarta(lon0, ascLon), rZodiacIn, cx, cy).y}
                  x2={polarParaXY(anguloCarta(lon0, ascLon), rZodiacOut, cx, cy).x}
                  y2={polarParaXY(anguloCarta(lon0, ascLon), rZodiacOut, cx, cy).y}
                  stroke={CORES.douradoSuave}
                  strokeWidth="0.5"
                  opacity="0.8"
                />
                <text
                  x={labelPt.x}
                  y={labelPt.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={destaque ? CORES.douradoClaro : CORES.dourado}
                  fontSize={size * 0.048}
                  fontFamily="Georgia, serif"
                  opacity={destaque ? 1 : 0.88}
                  fontWeight={destaque ? 700 : 400}
                >
                  {signo.simbolo}
                </text>
                <text
                  x={abrevPt.x}
                  y={abrevPt.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={CORES.muted}
                  fontSize={size * 0.022}
                  fontFamily="system-ui, sans-serif"
                  letterSpacing="0.04em"
                >
                  {ABREV_SIGNO[i]}
                </text>
              </g>
            )
          })}

          <circle cx={cx} cy={cy} r={rZodiacIn} fill="none" stroke={CORES.douradoSuave} strokeWidth="0.9" />
          <circle cx={cx} cy={cy} r={rHouseOut} fill="rgba(11,7,30,0.72)" stroke={CORES.douradoSuave} strokeWidth="0.7" />

          {/* Casas Placidus */}
          {cusps?.length >= 12 && cusps.map((cusp, i) => {
            const linha = linhaCuspide(cx, cy, rHouseIn, rHouseOut, cusp, ascLon)
            const cuspNext = cusps[(i + 1) % 12]
            let span = normalizarLongitude(cuspNext - cusp)
            if (span <= 0) span += 360
            const midLon = normalizarLongitude(cusp + span / 2)
            const numPt = polarParaXY(anguloCarta(midLon, ascLon), rHouseIn + (rHouseOut - rHouseIn) * 0.38, cx, cy)
            const isAngle = i === 0 || i === 3 || i === 6 || i === 9
            return (
              <g key={`casa-${i}`}>
                <line
                  x1={linha.x1}
                  y1={linha.y1}
                  x2={linha.x2}
                  y2={linha.y2}
                  stroke={isAngle ? CORES.dourado : CORES.muted}
                  strokeWidth={isAngle ? 1.4 : 0.65}
                  opacity={isAngle ? 0.95 : 0.45}
                />
                <text
                  x={numPt.x}
                  y={numPt.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={isAngle ? CORES.douradoClaro : CORES.muted}
                  fontSize={size * 0.026}
                  fontFamily="system-ui, sans-serif"
                  fontWeight={isAngle ? 700 : 500}
                >
                  {i + 1}
                </text>
              </g>
            )
          })}

          <circle cx={cx} cy={cy} r={rHouseIn} fill="none" stroke={CORES.douradoSuave} strokeWidth="0.5" opacity="0.45" />

          {/* Aspectos */}
          {aspectosVisiveis.map((asp, idx) => {
            const nomeA = nomePlanetaDeAspeto(asp.planetaA)
            const nomeB = nomePlanetaDeAspeto(asp.planetaB)
            const pa = mapaPos.get(nomeA)
            const pb = mapaPos.get(nomeB)
            if (!pa || !pb) return null
            const orbe = parseFloat(asp.orbe) || 8
            const opac = Math.max(0.25, 0.75 - orbe * 0.06)
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
                strokeWidth="1"
                opacity={opac}
              />
            )
          })}

          {/* Centro */}
          <circle cx={cx} cy={cy} r={rCenter} fill="rgba(223,183,108,0.1)" stroke={CORES.douradoSuave} strokeWidth="0.8" />
          <circle cx={cx} cy={cy} r={rCenter * 0.55} fill="none" stroke="rgba(223,183,108,0.2)" strokeWidth="0.5" />
          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fill={CORES.dourado} fontSize={size * 0.055} opacity="0.5">✦</text>

          {/* Planetas com grau */}
          {planetasVisiveis.map((p) => {
            const pt = polarParaXY(p.chartAngle, rPlanet, cx, cy)
            const tickOut = polarParaXY(anguloCarta(p.longitude, ascLon), rTick, cx, cy)
            const tickIn = polarParaXY(anguloCarta(p.longitude, ascLon), rPlanet + size * 0.032, cx, cy)
            const labelPt = polarParaXY(p.chartAngle, rPlanet + size * 0.058, cx, cy)
            const cor = corPlaneta(p.nome)
            const isLuminar = p.nome === 'Sol' || p.nome === 'Lua'
            return (
              <g key={p.key || p.nome} filter={`url(#${uid}_glow)`}>
                <line x1={tickIn.x} y1={tickIn.y} x2={tickOut.x} y2={tickOut.y} stroke={cor} strokeWidth="0.7" opacity="0.65" />
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isLuminar ? size * 0.032 : size * 0.026}
                  fill="rgba(11,7,30,0.9)"
                  stroke={cor}
                  strokeWidth={isLuminar ? 1.2 : 0.9}
                />
                <text
                  x={pt.x}
                  y={pt.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={CORES.branco}
                  fontSize={isLuminar ? size * 0.044 : size * 0.038}
                  fontFamily="Georgia, serif"
                >
                  {p.simbolo}
                </text>
                <text
                  x={labelPt.x}
                  y={labelPt.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={cor}
                  fontSize={size * 0.02}
                  fontFamily="system-ui, sans-serif"
                  opacity="0.9"
                >
                  {formatarGrauSigno(p.longitude)}
                </text>
                {p.retrograde && (
                  <text
                    x={pt.x + size * 0.03}
                    y={pt.y - size * 0.026}
                    fill="#F87171"
                    fontSize={size * 0.02}
                    fontFamily="system-ui, sans-serif"
                    fontWeight="700"
                  >
                    ℞
                  </text>
                )}
              </g>
            )
          })}

          {/* Eixos angulares */}
          {eixos.map((e) => {
            const linha = linhaCuspide(cx, cy, rHouseIn, rDecor, e.lon, ascLon)
            const pt = polarParaXY(anguloCarta(e.lon, ascLon), rDecor + size * 0.045, cx, cy)
            return (
              <g key={e.label}>
                <line
                  x1={linha.x1}
                  y1={linha.y1}
                  x2={linha.x2}
                  y2={linha.y2}
                  stroke={e.cor}
                  strokeWidth={e.peso}
                  opacity="0.85"
                />
                <rect
                  x={pt.x - size * 0.028}
                  y={pt.y - size * 0.014}
                  width={size * 0.056}
                  height={size * 0.028}
                  rx={size * 0.008}
                  fill="rgba(11,7,30,0.85)"
                  stroke={e.cor}
                  strokeWidth="0.8"
                />
                <text
                  x={pt.x}
                  y={pt.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={e.cor}
                  fontSize={size * 0.026}
                  fontWeight="800"
                  fontFamily="system-ui, sans-serif"
                  letterSpacing="0.06em"
                >
                  {e.label}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Legenda planetária */}
      <div style={{
        marginTop: 18,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
        gap: '6px 12px',
        padding: '14px 16px',
        borderRadius: 12,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        {planetasNorm.slice(0, 12).map((p) => (
          <div key={p.key || p.nome} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10 }}>
            <span style={{ color: corPlaneta(p.nome), fontSize: 13, width: 16, textAlign: 'center' }}>{p.simbolo}</span>
            <span style={{ color: CORES.muted, flex: 1 }}>{p.nome}</span>
            <span style={{ color: CORES.douradoClaro, fontWeight: 600 }}>
              {formatarGrauSigno(p.longitude)}
              {p.casa ? ` · C${p.casa}` : ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MandalaNatal
