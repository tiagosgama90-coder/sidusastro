import { useId, useMemo } from 'react'
import {
  ABREV_SIGNO,
  ROMANOS_CASA,
  SIGNOS_ZODIACO,
  SIMBOLO_ASPECTO,
  anguloCarta,
  arcoSvg,
  calcularAspetosPontos,
  construirMatrizAspectos,
  corAspecto,
  corPonto,
  formatarGrauDms,
  formatarLongitudeEcliptica,
  indiceSignoDePonto,
  nomePlanetaDeAspeto,
  normalizarLongitude,
  polarParaXY,
  prepararDadosMandala,
  separarPlanetasSobrepostos,
  simboloSignoDeLongitude,
} from '../lib/mandalaNatal.js'

const CORES = {
  dourado: '#DFB76C',
  douradoClaro: '#F0D9A8',
  douradoSuave: 'rgba(223,183,108,0.45)',
  fundo: '#0B071E',
  branco: 'rgba(255,255,255,0.92)',
  muted: 'rgba(255,255,255,0.38)',
  borda: 'rgba(223,183,108,0.25)',
}

function linhaCuspide(cx, cy, r0, r1, longitude, asc) {
  const a = anguloCarta(longitude, asc)
  const p0 = polarParaXY(a, r0, cx, cy)
  const p1 = polarParaXY(a, r1, cx, cy)
  return { x1: p0.x, y1: p0.y, x2: p1.x, y2: p1.y, angle: a }
}

function LilithGlyph({ x, y, size, color }) {
  const moonSize = size * 0.32
  const crossTop = y + size * 0.08
  return (
    <g aria-label="Lilith, Lua Negra">
      <text x={x} y={y - size * 0.08} textAnchor="middle" dominantBaseline="middle" fill={color} fontSize={moonSize} fontFamily="Georgia, serif">☾</text>
      <line x1={x} y1={crossTop} x2={x} y2={y + size * 0.34} stroke={color} strokeWidth={Math.max(0.7, size * 0.06)} />
      <line x1={x - size * 0.15} y1={y + size * 0.19} x2={x + size * 0.15} y2={y + size * 0.19} stroke={color} strokeWidth={Math.max(0.7, size * 0.06)} />
    </g>
  )
}

function GrelhaAspectos({ pontos, matriz, cellSize = 22 }) {
  const n = pontos.length
  const headerH = cellSize + 4
  const labelW = cellSize + 8
  const w = labelW + n * cellSize
  const h = headerH + n * cellSize

  return (
    <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={{ display: 'block', minWidth: w }}>
        <rect x={0} y={0} width={w} height={h} fill="rgba(0,0,0,0.35)" stroke={CORES.borda} strokeWidth="1" rx="4" />
        {pontos.map((p, col) => {
          const x = labelW + col * cellSize + cellSize / 2
          const cor = corPonto(p.nome)
          return (
            <text
              key={`col-${p.key || p.nome}`}
              x={x}
              y={headerH - 6}
              textAnchor="middle"
              fill={cor}
              fontSize={cellSize * 0.55}
              fontFamily="Georgia, serif"
            >
              {p.nome === 'Lilith' ? <LilithGlyph x={x} y={headerH - 6} size={cellSize} color={cor} /> : (p.isAngular ? p.abrev : p.simbolo)}
            </text>
          )
        })}
        {pontos.map((p, row) => {
          const y = headerH + row * cellSize + cellSize / 2
          const cor = corPonto(p.nome)
          return (
            <text
              key={`row-${p.key || p.nome}`}
              x={labelW - 6}
              y={y}
              textAnchor="end"
              dominantBaseline="middle"
              fill={cor}
              fontSize={cellSize * 0.55}
              fontFamily="Georgia, serif"
            >
              {p.nome === 'Lilith' ? <LilithGlyph x={labelW - 6} y={y} size={cellSize} color={cor} /> : (p.isAngular ? p.abrev : p.simbolo)}
            </text>
          )
        })}
        {matriz.map((linha, row) =>
          linha.map((asp, col) => {
            if (!asp) return null
            const x = labelW + col * cellSize + cellSize / 2
            const y = headerH + row * cellSize + cellSize / 2
            return (
              <text
                key={`cell-${row}-${col}`}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={corAspecto(asp.aspecto)}
                fontSize={cellSize * 0.62}
                fontFamily="Georgia, serif"
                fontWeight="600"
              >
                {SIMBOLO_ASPECTO[asp.aspecto] || '·'}
              </text>
            )
          }),
        )}
        {Array.from({ length: n + 1 }, (_, i) => (
          <line
            key={`grid-h-${i}`}
            x1={labelW}
            y1={headerH + i * cellSize}
            x2={w}
            y2={headerH + i * cellSize}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="0.5"
          />
        ))}
        {Array.from({ length: n + 1 }, (_, i) => (
          <line
            key={`grid-v-${i}`}
            x1={labelW + i * cellSize}
            y1={headerH}
            x2={labelW + i * cellSize}
            y2={h}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="0.5"
          />
        ))}
      </svg>
    </div>
  )
}

function TabelaPosicoes({ pontos, translateSign }) {
  return (
    <div style={{
      border: `1px solid ${CORES.borda}`,
      borderRadius: 8,
      overflow: 'hidden',
      background: 'rgba(0,0,0,0.35)',
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${CORES.borda}`, background: 'rgba(223,183,108,0.06)' }}>
            <th style={{ padding: '6px 8px', textAlign: 'left', color: CORES.muted, fontWeight: 600, fontSize: 9, letterSpacing: '0.08em' }}>PONTO</th>
            <th style={{ padding: '6px 8px', textAlign: 'right', color: CORES.muted, fontWeight: 600, fontSize: 9, letterSpacing: '0.08em' }}>POSIÇÃO</th>
            <th style={{ padding: '6px 8px', textAlign: 'right', color: CORES.muted, fontWeight: 600, fontSize: 9, letterSpacing: '0.08em' }}>λ ECLÍPTICA</th>
          </tr>
        </thead>
        <tbody>
          {pontos.map((p) => {
            const cor = corPonto(p.nome)
            const signoNome = p.signo?.nome || SIGNOS_ZODIACO[indiceSignoDePonto(p)]?.nome
            const signoSym = simboloSignoDeLongitude(p.longitude)
            const label = p.isAngular ? p.abrev : p.nome
            const glyph = p.isAngular ? p.simbolo : p.simbolo
            return (
              <tr key={p.key || p.nome} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '5px 8px' }}>
                  {p.nome === 'Lilith' ? <svg width="22" height="24" viewBox="0 0 22 24" style={{ verticalAlign: 'middle', marginRight: 6 }}><LilithGlyph x={11} y={8} size={18} color={cor} /></svg> : <span style={{ color: cor, fontFamily: 'Georgia, serif', fontSize: 13, marginRight: 6 }}>{glyph}</span>}
                  <span style={{ color: CORES.branco, fontWeight: p.isAngular ? 700 : 500 }}>{label}</span>
                  {p.retrograde && <span style={{ color: '#F87171', marginLeft: 4, fontSize: 10 }}>℞</span>}
                </td>
                <td style={{ padding: '5px 8px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <span style={{ color: cor, fontFamily: 'Georgia, serif', fontSize: 12, marginRight: 4 }}>{signoSym}</span>
                  <span style={{ color: CORES.douradoClaro, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                    {formatarGrauDms(p.longitude)}
                  </span>
                  <span style={{ color: CORES.muted, fontSize: 9, marginLeft: 4 }}>
                    {translateSign(signoNome)}
                    {p.casa ? ` · ${ROMANOS_CASA[p.casa - 1]}` : ''}
                  </span>
                </td>
                <td style={{ padding: '5px 8px', textAlign: 'right', color: CORES.muted, fontSize: 10, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                  {formatarLongitudeEcliptica(p.longitude)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function TabelaCasas({ cusps, translateSign }) {
  return (
    <div style={{ border: `1px solid ${CORES.borda}`, borderRadius: 8, overflow: 'hidden', background: 'rgba(0,0,0,0.35)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${CORES.borda}`, background: 'rgba(223,183,108,0.06)' }}>
            <th style={{ padding: '6px 8px', textAlign: 'left', color: CORES.muted, fontSize: 9 }}>CASA</th>
            <th style={{ padding: '6px 8px', textAlign: 'right', color: CORES.muted, fontSize: 9 }}>CÚSPIDE</th>
            <th style={{ padding: '6px 8px', textAlign: 'right', color: CORES.muted, fontSize: 9 }}>LONGITUDE</th>
          </tr>
        </thead>
        <tbody>
          {cusps.map((cusp, index) => {
            const longitude = normalizarLongitude(cusp)
            const signo = SIGNOS_ZODIACO[indiceSignoDePonto({ longitude })]
            return (
              <tr key={`cusp-${index}`} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '5px 8px', color: CORES.branco, fontWeight: 600 }}>{ROMANOS_CASA[index]}</td>
                <td style={{ padding: '5px 8px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <span style={{ color: CORES.dourado, fontFamily: 'Georgia, serif', marginRight: 4 }}>{signo?.simbolo}</span>
                  <span style={{ color: CORES.douradoClaro, fontWeight: 600 }}>{formatarGrauDms(longitude)}</span>
                  <span style={{ color: CORES.muted, fontSize: 9, marginLeft: 4 }}>{translateSign(signo?.nome)}</span>
                </td>
                <td style={{ padding: '5px 8px', textAlign: 'right', color: CORES.muted, fontSize: 10 }}>{formatarLongitudeEcliptica(longitude)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function ListaAspetos({ aspectos }) {
  if (!aspectos.length) return <p style={{ color: CORES.muted, fontSize: 11, margin: 0 }}>Sem aspectos dentro do orbe definido.</p>
  return (
    <div style={{ display: 'grid', gap: 5 }}>
      {aspectos.map((asp, index) => (
        <div key={`aspecto-${index}`} style={{ display: 'flex', alignItems: 'center', gap: 7, color: CORES.branco, fontSize: 11 }}>
          <span style={{ color: corAspecto(asp.aspecto), fontFamily: 'Georgia, serif', fontSize: 14 }}>{SIMBOLO_ASPECTO[asp.aspecto] || '·'}</span>
          <span>{asp.planetaA} {SIMBOLO_ASPECTO[asp.aspecto] || asp.aspecto} {asp.planetaB}</span>
          <span style={{ color: CORES.muted, marginLeft: 'auto' }}>orbe {Number(asp.orbe).toFixed(2)}°</span>
        </div>
      ))}
    </div>
  )
}

/**
 * Roda natal profissional - Placidus, aspectos, grelha e tabela de posições.
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
  chartOnly = false,
  className,
  style,
  unavailableLabel,
}) {
  const uid = useId().replace(/:/g, '')
  const pontosEspeciais = [mapaNatal?.nodoNorte, mapaNatal?.lilith, mapaNatal?.quiron].filter(Boolean)
  const listaPontosNatal = [...planetas, ...(Array.isArray(mapaNatal?.planetas) ? mapaNatal.planetas : []), ...pontosEspeciais]
  const vistosPontos = new Set()
  const pontosNatal = listaPontosNatal.filter((p) => {
    const chave = p?.key || p?.nome
    if (!chave || vistosPontos.has(chave)) return false
    vistosPontos.add(chave)
    return true
  })
  const dados = prepararDadosMandala(mapaNatal, pontosNatal)

  const signosDestaque = useMemo(() => {
    const set = new Set()
    for (const p of [mapaNatal?.solar, mapaNatal?.lunar, mapaNatal?.ascendente]) {
      const idx = indiceSignoDePonto(p)
      if (idx != null) set.add(idx)
    }
    return set
  }, [mapaNatal])

  const aspectosCompletos = useMemo(() => {
    if (!dados?.todosPontos) return aspectos
    const calculados = calcularAspetosPontos(dados.todosPontos)
    return calculados.length > 0 ? calculados : aspectos
  }, [dados, aspectos])

  const matrizAspectos = useMemo(() => {
    if (!dados?.pontosGrelha) return []
    return construirMatrizAspectos(dados.pontosGrelha)
  }, [dados])

  if (!dados) {
    if (!unavailableLabel) return null
    return (
      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', textAlign: 'center', margin: 0 }}>
        {unavailableLabel}
      </p>
    )
  }

  const { ascLon, cusps, mcLon, dcLon, icLon, todosPontos, pontosGrelha, tabelaPontos } = dados

  const cx = size / 2
  const cy = size / 2
  const rOuter = size * 0.46
  const rDecor = rOuter + size * 0.022
  const rZodiacOut = rOuter
  const rZodiacIn = rOuter * 0.848
  const rDegreeOut = rZodiacIn
  const rDegreeIn = rOuter * 0.805
  const rHouseOut = rOuter * 0.785
  const rHouseIn = rOuter * 0.52
  const rPlanet = rOuter * 0.655
  const rTick = rOuter * 0.895
  const rAspect = rOuter * 0.30
  const rCenter = rOuter * 0.09

  const planetasVisiveis = separarPlanetasSobrepostos(todosPontos, ascLon, 5)
  const mapaPos = new Map(
    planetasVisiveis.map((p) => {
      const lon = p.longitude
      const chartAngle = p.chartAngle ?? anguloCarta(lon, ascLon)
      const pt = polarParaXY(chartAngle, rPlanet, cx, cy)
      return [p.nome, { ...p, chartAngle, ...pt }]
    }),
  )

  const eixos = [
    { lon: ascLon, label: 'AS', cor: '#C4B5FD', peso: 2.4 },
    { lon: mcLon, label: 'MC', cor: '#34D399', peso: 2.2 },
    { lon: dcLon, label: 'DC', cor: '#F472B6', peso: 1.5 },
    { lon: icLon, label: 'IC', cor: '#93C5FD', peso: 1.5 },
  ].filter((e) => e.lon != null)

  const solSigno = translateSign(mapaNatal?.solar?.nome)
  const luaSigno = translateSign(mapaNatal?.lunar?.nome)
  const ascSigno = translateSign(mapaNatal?.ascendente?.nome)

  return (
    <div
      className={className}
      {...(!chartOnly ? { 'data-sidus-mandala-export': true } : {})}
      style={{ width: '100%', ...style }}
    >
      {!chartOnly && (nome || dataNascimento) && (
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
            ☉ {solSigno || '-'} · ☽ {luaSigno || '-'} · AS {ascSigno || '-'}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <svg
          data-sidus-mandala-chart
          viewBox={`0 0 ${size} ${size}`}
          width="100%"
          style={{ maxWidth: size, height: 'auto', display: 'block', filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.45))' }}
          role="img"
          aria-label="Mandala natal personalizada"
        >
          <defs>
            <radialGradient id={`${uid}_bg`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(139,92,246,0.18)" />
              <stop offset="55%" stopColor="rgba(11,7,30,0.94)" />
              <stop offset="100%" stopColor={CORES.fundo} />
            </radialGradient>
            <linearGradient id={`${uid}_ring`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(223,183,108,0.55)" />
              <stop offset="50%" stopColor="rgba(196,181,253,0.35)" />
              <stop offset="100%" stopColor="rgba(223,183,108,0.55)" />
            </linearGradient>
            <filter id={`${uid}_glow`}>
              <feGaussianBlur stdDeviation="2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <circle cx={cx} cy={cy} r={rDecor + 4} fill="none" stroke="rgba(223,183,108,0.1)" strokeWidth="1" />
          <circle cx={cx} cy={cy} r={rDecor} fill="none" stroke={`url(#${uid}_ring)`} strokeWidth="1.5" opacity="0.9" />

          {/* Escala de graus - cada 5° */}
          {Array.from({ length: 72 }, (_, i) => {
            const lon = i * 5
            const a = anguloCarta(lon, ascLon)
            const isMajor = lon % 30 === 0
            const isMid = lon % 10 === 0
            const lenOut = isMajor ? 7 : isMid ? 5 : 2.5
            const pIn = polarParaXY(a, rDecor - 1, cx, cy)
            const pOut = polarParaXY(a, rDecor + lenOut, cx, cy)
            return (
              <line
                key={`deg-${i}`}
                x1={pIn.x}
                y1={pIn.y}
                x2={pOut.x}
                y2={pOut.y}
                stroke={isMajor ? CORES.dourado : isMid ? CORES.douradoSuave : 'rgba(255,255,255,0.15)'}
                strokeWidth={isMajor ? 1.2 : isMid ? 0.7 : 0.4}
                opacity={isMajor ? 0.9 : isMid ? 0.6 : 0.4}
              />
            )
          })}

          <circle cx={cx} cy={cy} r={rOuter + 2} fill={`url(#${uid}_bg)`} stroke={CORES.douradoSuave} strokeWidth="1.3" />

          {/* Anel de graus interior - cada 5° */}
          <circle cx={cx} cy={cy} r={rDegreeOut} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
          <circle cx={cx} cy={cy} r={rDegreeIn} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
          {Array.from({ length: 72 }, (_, i) => {
            const d = i * 5
            const a = anguloCarta(d, ascLon)
            const is30 = d % 30 === 0
            const p0 = polarParaXY(a, rDegreeIn, cx, cy)
            const p1 = polarParaXY(a, rDegreeOut, cx, cy)
            return (
              <line
                key={`inner-deg-${d}`}
                x1={p0.x}
                y1={p0.y}
                x2={p1.x}
                y2={p1.y}
                stroke={is30 ? 'rgba(223,183,108,0.35)' : 'rgba(255,255,255,0.1)'}
                strokeWidth={is30 ? 0.8 : 0.35}
              />
            )
          })}

          {/* Signos do zodíaco */}
          {SIGNOS_ZODIACO.map((signo, i) => {
            const lon0 = i * 30
            const lon1 = (i + 1) * 30
            const mid = lon0 + 15
            const destaque = signosDestaque.has(i)
            const labelPt = polarParaXY(anguloCarta(mid, ascLon), (rZodiacOut + rZodiacIn) / 2, cx, cy)
            const abrevPt = polarParaXY(anguloCarta(mid, ascLon), rZodiacOut - size * 0.03, cx, cy)
            return (
              <g key={signo.simbolo}>
                <path
                  d={arcoSvg(cx, cy, rZodiacOut, lon0, lon1, ascLon)}
                  fill="rgba(11,7,30,0.12)"
                  stroke={destaque ? 'rgba(223,183,108,0.4)' : 'rgba(255,255,255,0.04)'}
                  strokeWidth="0.5"
                />
                <path d={arcoSvg(cx, cy, rZodiacIn, lon0, lon1, ascLon)} fill={CORES.fundo} stroke="none" />
                <line
                  x1={polarParaXY(anguloCarta(lon0, ascLon), rZodiacIn, cx, cy).x}
                  y1={polarParaXY(anguloCarta(lon0, ascLon), rZodiacIn, cx, cy).y}
                  x2={polarParaXY(anguloCarta(lon0, ascLon), rZodiacOut, cx, cy).x}
                  y2={polarParaXY(anguloCarta(lon0, ascLon), rZodiacOut, cx, cy).y}
                  stroke={CORES.douradoSuave}
                  strokeWidth="0.6"
                  opacity="0.85"
                />
                <text
                  x={labelPt.x}
                  y={labelPt.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={destaque ? CORES.douradoClaro : CORES.dourado}
                  fontSize={size * 0.05}
                  fontFamily="Georgia, serif"
                  opacity={destaque ? 1 : 0.9}
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
                  fontSize={size * 0.02}
                  fontFamily="system-ui, sans-serif"
                  letterSpacing="0.04em"
                >
                  {ABREV_SIGNO[i]}
                </text>
              </g>
            )
          })}

          <circle cx={cx} cy={cy} r={rZodiacIn} fill="none" stroke={CORES.douradoSuave} strokeWidth="0.9" />
          <circle cx={cx} cy={cy} r={rHouseOut} fill="rgba(11,7,30,0.78)" stroke={CORES.douradoSuave} strokeWidth="0.7" />

          {/* Casas Placidus - numeração romana */}
          {cusps?.length >= 12 && cusps.map((cusp, i) => {
            const linha = linhaCuspide(cx, cy, rHouseIn, rHouseOut, cusp, ascLon)
            const cuspNext = cusps[(i + 1) % 12]
            let span = normalizarLongitude(cuspNext - cusp)
            if (span <= 0) span += 360
            const midLon = normalizarLongitude(cusp + span / 2)
            const numPt = polarParaXY(anguloCarta(midLon, ascLon), rHouseIn * 0.68, cx, cy)
            const isAngle = i === 0 || i === 3 || i === 6 || i === 9
            return (
              <g key={`casa-${i}`}>
                <line
                  x1={linha.x1}
                  y1={linha.y1}
                  x2={linha.x2}
                  y2={linha.y2}
                  stroke={isAngle ? CORES.dourado : CORES.muted}
                  strokeWidth={isAngle ? 1.6 : 0.6}
                  opacity={isAngle ? 0.95 : 0.4}
                />
                <text
                  x={numPt.x}
                  y={numPt.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={isAngle ? CORES.douradoClaro : CORES.muted}
                  fontSize={size * 0.028}
                  fontFamily="Georgia, serif"
                  fontWeight={isAngle ? 700 : 500}
                  opacity={isAngle ? 1 : 0.65}
                >
                  {ROMANOS_CASA[i]}
                </text>
              </g>
            )
          })}

          <circle cx={cx} cy={cy} r={rHouseIn} fill="none" stroke={CORES.douradoSuave} strokeWidth="0.5" opacity="0.4" />

          {/* Aspectos - todos os calculados */}
          {aspectosCompletos.map((asp, idx) => {
            const nomeA = typeof asp.planetaA === 'string' ? nomePlanetaDeAspeto(asp.planetaA) : asp.planetaA
            const nomeB = typeof asp.planetaB === 'string' ? nomePlanetaDeAspeto(asp.planetaB) : asp.planetaB
            const pa = mapaPos.get(nomeA) || mapaPos.get(asp.planetaA)
            const pb = mapaPos.get(nomeB) || mapaPos.get(asp.planetaB)
            if (!pa || !pb) return null
            const orbe = parseFloat(asp.orbe) || 6
            const opac = Math.max(0.2, 0.8 - orbe * 0.08)
            const ca = polarParaXY(anguloCarta(pa.longitude, ascLon), rAspect, cx, cy)
            const cb = polarParaXY(anguloCarta(pb.longitude, ascLon), rAspect, cx, cy)
            const isHard = (asp.aspecto || '').includes('Quad') || (asp.aspecto || '').includes('Opos')
            return (
              <line
                key={`asp-${idx}`}
                x1={ca.x}
                y1={ca.y}
                x2={cb.x}
                y2={cb.y}
                stroke={corAspecto(asp.aspecto)}
                strokeWidth={isHard ? 1.1 : 0.85}
                opacity={opac}
                strokeDasharray={isHard ? 'none' : '3 2'}
              />
            )
          })}

          <circle cx={cx} cy={cy} r={rCenter} fill="rgba(30,20,50,0.9)" stroke={CORES.douradoSuave} strokeWidth="0.8" />

          {/* Planetas e ângulos */}
          {planetasVisiveis.map((p) => {
            const pt = polarParaXY(p.chartAngle, rPlanet, cx, cy)
            const tickOut = polarParaXY(anguloCarta(p.longitude, ascLon), rTick, cx, cy)
            const tickIn = polarParaXY(anguloCarta(p.longitude, ascLon), rPlanet + size * 0.028, cx, cy)
            const labelPt = polarParaXY(p.chartAngle, rPlanet + size * 0.062, cx, cy)
            const cor = corPonto(p.nome)
            const isLuminar = p.nome === 'Sol' || p.nome === 'Lua'
            const isAngular = p.isAngular
            const rGlyph = isAngular ? size * 0.022 : isLuminar ? size * 0.024 : size * 0.018
            return (
              <g key={p.key || p.nome} filter={isLuminar || isAngular ? `url(#${uid}_glow)` : undefined}>
                <line x1={tickIn.x} y1={tickIn.y} x2={tickOut.x} y2={tickOut.y} stroke={cor} strokeWidth="0.8" opacity="0.7" />
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={rGlyph + 2}
                  fill="rgba(11,7,30,0.92)"
                  stroke={cor}
                  strokeWidth={isLuminar || isAngular ? 1.3 : 0.9}
                />
                <text
                  x={pt.x}
                  y={pt.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={isAngular ? cor : CORES.branco}
                  fontSize={isAngular ? size * 0.024 : isLuminar ? size * 0.034 : size * 0.029}
                  fontFamily={isAngular ? 'system-ui, sans-serif' : 'Georgia, serif'}
                  fontWeight={isAngular ? 800 : 400}
                >
                  {p.nome === 'Lilith' ? <LilithGlyph x={pt.x} y={pt.y} size={size * 0.9} color={cor} /> : (isAngular ? p.abrev : p.simbolo)}
                </text>
                <text
                  x={labelPt.x}
                  y={labelPt.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={cor}
                  fontSize={size * 0.016}
                  fontFamily="system-ui, sans-serif"
                  opacity="0.85"
                >
                  {formatarGrauDms(p.longitude)}
                </text>
                {p.retrograde && (
                  <text
                    x={pt.x + size * 0.028}
                    y={pt.y - size * 0.024}
                    fill="#F87171"
                    fontSize={size * 0.019}
                    fontFamily="system-ui, sans-serif"
                    fontWeight="700"
                  >
                    ℞
                  </text>
                )}
              </g>
            )
          })}

          {/* Eixos angulares com setas */}
          {eixos.map((e) => {
            const linha = linhaCuspide(cx, cy, rHouseIn, rDecor + 2, e.lon, ascLon)
            const pt = polarParaXY(anguloCarta(e.lon, ascLon), rDecor + size * 0.048, cx, cy)
            const isMain = e.label === 'AS' || e.label === 'MC'
            return (
              <g key={e.label}>
                <line
                  x1={linha.x1}
                  y1={linha.y1}
                  x2={linha.x2}
                  y2={linha.y2}
                  stroke={e.cor}
                  strokeWidth={e.peso}
                  opacity={isMain ? 0.9 : 0.55}
                />
                {isMain && (
                  <>
                    <polygon
                      points={(() => {
                        const tip = polarParaXY(anguloCarta(e.lon, ascLon), rDecor + size * 0.038, cx, cy)
                        const base = polarParaXY(anguloCarta(e.lon, ascLon), rDecor + size * 0.028, cx, cy)
                        const perp = anguloCarta(e.lon, ascLon) + 90
                        const l = polarParaXY(perp, size * 0.012, base.x, base.y)
                        const r = polarParaXY(perp + 180, size * 0.012, base.x, base.y)
                        return `${tip.x},${tip.y} ${l.x},${l.y} ${r.x},${r.y}`
                      })()}
                      fill={e.cor}
                      opacity="0.9"
                    />
                  </>
                )}
                <rect
                  x={pt.x - size * 0.03}
                  y={pt.y - size * 0.015}
                  width={size * 0.06}
                  height={size * 0.03}
                  rx={size * 0.008}
                  fill="rgba(11,7,30,0.9)"
                  stroke={e.cor}
                  strokeWidth="0.9"
                />
                <text
                  x={pt.x}
                  y={pt.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={e.cor}
                  fontSize={size * 0.027}
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

      {!chartOnly && (
      <div style={{
        marginTop: 20,
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr)',
        gap: 16,
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 16,
          alignItems: 'start',
        }}>
          <div>
            <div style={{ fontSize: 10, color: CORES.dourado, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: 8 }}>
              Grelha de aspectos completa
            </div>
            <GrelhaAspectos pontos={pontosGrelha} matriz={matrizAspectos} cellSize={size > 400 ? 24 : 20} />
          </div>
          <div>
            <div style={{ fontSize: 10, color: CORES.dourado, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: 8 }}>
              Posições planetárias completas · Casas Placidus
            </div>
            <TabelaPosicoes pontos={tabelaPontos} translateSign={translateSign} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, alignItems: 'start' }}>
          <div>
            <div style={{ fontSize: 10, color: CORES.dourado, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: 8 }}>
              Todas as casas · Placidus
            </div>
            <TabelaCasas cusps={cusps} translateSign={translateSign} />
          </div>
          <div>
            <div style={{ fontSize: 10, color: CORES.dourado, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: 8 }}>
              Aspectos principais no mapa natal
            </div>
            <ListaAspetos aspectos={aspectosCompletos} />
          </div>
        </div>

        {/* Legenda de aspectos */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px 16px',
          justifyContent: 'center',
          padding: '10px 12px',
          borderRadius: 8,
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
          fontSize: 10,
          color: CORES.muted,
        }}>
          {Object.entries(SIMBOLO_ASPECTO).map(([nome, sym]) => (
            <span key={nome} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <span style={{ color: corAspecto(nome), fontSize: 13, fontFamily: 'Georgia, serif' }}>{sym}</span>
              <span>{nome}</span>
            </span>
          ))}
        </div>
      </div>
      )}
    </div>
  )
}

export default MandalaNatal
