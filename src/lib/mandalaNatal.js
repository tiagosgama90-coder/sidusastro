/** Geometria da roda natal (SVG) — zodíaco tropical, ASC à esquerda. */

export const SIGNOS_ZODIACO = [
  { simbolo: '♈', nome: 'Áries' },
  { simbolo: '♉', nome: 'Touro' },
  { simbolo: '♊', nome: 'Gémeos' },
  { simbolo: '♋', nome: 'Caranguejo' },
  { simbolo: '♌', nome: 'Leão' },
  { simbolo: '♍', nome: 'Virgem' },
  { simbolo: '♎', nome: 'Balança' },
  { simbolo: '♏', nome: 'Escorpião' },
  { simbolo: '♐', nome: 'Sagitário' },
  { simbolo: '♑', nome: 'Capricórnio' },
  { simbolo: '♒', nome: 'Aquário' },
  { simbolo: '♓', nome: 'Peixes' },
]

const ELEMENTO_COR = {
  Fogo: 'rgba(251,146,60,0.14)',
  Terra: 'rgba(74,222,128,0.12)',
  Ar: 'rgba(147,197,253,0.12)',
  Água: 'rgba(129,140,248,0.14)',
}

const ELEMENTO_POR_SIGNO = [
  'Fogo', 'Terra', 'Ar', 'Água', 'Fogo', 'Terra', 'Ar', 'Água', 'Fogo', 'Terra', 'Ar', 'Água',
]

export function normalizarLongitude(lon) {
  return ((Number(lon) % 360) + 360) % 360
}

/** Ângulo no ecrã: ASC à esquerda (9h), sentido anti-horário. */
export function anguloCarta(longitude, ascendant) {
  return normalizarLongitude(ascendant - longitude + 180)
}

export function polarParaXY(deg, r, cx, cy) {
  const rad = (deg * Math.PI) / 180
  return {
    x: cx + r * Math.cos(rad),
    y: cy - r * Math.sin(rad),
  }
}

export function arcoSvg(cx, cy, r, lonInicio, lonFim, ascendant) {
  const a1 = anguloCarta(lonInicio, ascendant)
  const a2 = anguloCarta(lonFim, ascendant)
  let sweep = a2 - a1
  if (sweep < 0) sweep += 360
  const large = sweep > 180 ? 1 : 0
  const p1 = polarParaXY(a1, r, cx, cy)
  const p2 = polarParaXY(a1 + sweep, r, cx, cy)
  return `M ${cx} ${cy} L ${p1.x} ${p1.y} A ${r} ${r} 0 ${large} 0 ${p2.x} ${p2.y} Z`
}

export function corElementoSigno(indiceSigno) {
  return ELEMENTO_COR[ELEMENTO_POR_SIGNO[indiceSigno]] || 'rgba(255,255,255,0.04)'
}

export function corAspecto(nome) {
  const n = (nome || '').toLowerCase()
  if (n.includes('conj')) return '#DFB76C'
  if (n.includes('trig') || n.includes('sext')) return '#34D399'
  if (n.includes('quad') || n.includes('opos')) return '#F87171'
  return 'rgba(223,183,108,0.35)'
}

export function separarPlanetasSobrepostos(planetas, ascendant, minGrau = 6.5) {
  const comAngulo = planetas
    .filter((p) => Number.isFinite(p.longitude))
    .map((p) => ({ ...p, chartAngle: anguloCarta(p.longitude, ascendant) }))
    .sort((a, b) => a.chartAngle - b.chartAngle)

  for (let i = 1; i < comAngulo.length; i++) {
    const diff = comAngulo[i].chartAngle - comAngulo[i - 1].chartAngle
    if (diff < minGrau) {
      comAngulo[i].chartAngle = comAngulo[i - 1].chartAngle + minGrau
    }
  }
  return comAngulo
}

export function nomePlanetaDeAspeto(str) {
  if (!str) return ''
  return str.replace(/\s+[^\s]+\s*$/u, '').trim()
}
