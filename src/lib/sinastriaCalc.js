/** Normaliza signos PT (Carneiro ↔ Áries) para cálculos de sinastria. */
const ALIAS = {
  Carneiro: 0, Áries: 0, Aries: 0,
  Touro: 1, Taurus: 1,
  Gémeos: 2, Gemini: 2,
  Caranguejo: 3, Cancer: 3,
  Leão: 4, Leo: 4,
  Virgem: 5, Virgo: 5,
  Balança: 6, Libra: 6,
  Escorpião: 7, Scorpio: 7,
  Sagitário: 8, Sagittarius: 8,
  Capricórnio: 9, Capricorn: 9,
  Aquário: 10, Aquarius: 10,
  Peixes: 11, Pisces: 11,
}

const NOMES_PT = [
  'Carneiro', 'Touro', 'Gémeos', 'Caranguejo', 'Leão', 'Virgem',
  'Balança', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes',
]

const ELEMENTO = ['Fogo', 'Terra', 'Ar', 'Água', 'Fogo', 'Terra', 'Ar', 'Água', 'Fogo', 'Terra', 'Ar', 'Água']
const MODAL = ['Cardinal', 'Fixo', 'Mutável', 'Cardinal', 'Fixo', 'Mutável', 'Cardinal', 'Fixo', 'Mutável', 'Cardinal', 'Fixo', 'Mutável']
const POLAR = ['Yang', 'Yin', 'Yang', 'Yin', 'Yang', 'Yin', 'Yang', 'Yin', 'Yang', 'Yin', 'Yang', 'Yin']

function idx(signo) {
  if (!signo) return null
  const k = signo.trim()
  if (k in ALIAS) return ALIAS[k]
  return null
}

/** Distância mínima entre signos (0–6). */
function distSignos(a, b) {
  const ia = idx(a)
  const ib = idx(b)
  if (ia == null || ib == null) return 3
  const d = Math.abs(ia - ib)
  return Math.min(d, 12 - d)
}

/** Aspecto clássico → base de compatibilidade. */
function scoreAspecto(dist) {
  const map = {
    0: 86, // conjunção — intensidade
    1: 58, // semi-sextil / vizinho
    2: 76, // sexsil
    3: 44, // quadratura — atrito
    4: 91, // trígono — fluidez
    5: 52, // quincúncio
    6: 62, // oposição — magnetismo difícil
  }
  return map[dist] ?? 65
}

function scoreElementos(ea, eb) {
  if (!ea || !eb) return 68
  if (ea === eb) return ea === 'Fogo' ? 84 : ea === 'Água' ? 80 : ea === 'Ar' ? 72 : 78
  const par = [ea, eb].sort().join('-')
  const t = {
    'Fogo-Ar': 79, 'Fogo-Água': 55, 'Fogo-Terra': 48,
    'Ar-Água': 74, 'Ar-Terra': 58, 'Terra-Água': 82,
  }
  return t[par] ?? 64
}

function scoreModal(mA, mB) {
  if (!mA || !mB) return 65
  if (mA === mB) return mA === 'Cardinal' ? 70 : mA === 'Fixo' ? 62 : 76
  if ((mA === 'Cardinal' && mB === 'Mutável') || (mA === 'Mutável' && mB === 'Cardinal')) return 78
  if (mA === 'Fixo' && mB === 'Fixo') return 52
  return 68
}

function clamp(n, min = 28, max = 97) {
  return Math.round(Math.max(min, Math.min(max, n)))
}

/**
 * Calcula dimensões de sinastria com variação realista por par de signos.
 */
export function calcularDimensoesSinastria({ solA, luaA, ascA, solB }) {
  const iA = idx(solA)
  const iB = idx(solB)
  const iLuaA = idx(luaA) ?? iA
  const iAscA = idx(ascA) ?? iA

  const distSol = distSignos(solA, solB)
  const distLua = distSignos(luaA, solB)
  const distAsc = distSignos(ascA, solB)

  const elemSolA = iA != null ? ELEMENTO[iA] : null
  const elemSolB = iB != null ? ELEMENTO[iB] : null
  const elemLuaA = iLuaA != null ? ELEMENTO[iLuaA] : elemSolA

  const modA = iA != null ? MODAL[iA] : null
  const modB = iB != null ? MODAL[iB] : null

  const passion = clamp(
    scoreAspecto(distSol) * 0.45
    + scoreElementos(elemSolA, elemSolB) * 0.35
    + (POLAR[iA] !== POLAR[iB] ? 72 : 58) * 0.2,
  )

  const emotional = clamp(
    scoreAspecto(distLua) * 0.5
    + scoreElementos(elemLuaA, elemSolB) * 0.35
    + scoreModal(modA, modB) * 0.15,
  )

  const communication = clamp(
    scoreAspecto(distSignos(solA, solB)) * 0.3
    + scoreAspecto(distAsc) * 0.25
    + scoreElementos(elemSolA, elemSolB === 'Ar' || elemSolB === 'Fogo' ? elemSolB : 'Ar') * 0.25
    + (iA != null && [2, 5, 6, 9].includes(iA) ? 8 : 0)
    + (iB != null && [2, 5, 6, 9].includes(iB) ? 8 : 0),
  )

  const stability = clamp(
    scoreElementos(elemSolA, elemSolB) * 0.35
    + scoreModal(modA, modB) * 0.3
    + scoreAspecto(distSol === 3 ? 3 : distSol === 4 ? 4 : distSol) * 0.35,
  )

  const pontuacao = clamp(
    passion * 0.28 + emotional * 0.32 + communication * 0.2 + stability * 0.2,
  )

  const elemA = elemSolA
  const elemB = elemSolB
  const chave = elemA && elemB ? [elemA, elemB].sort().join('-') : ''

  return {
    pontuacao,
    passion,
    emotional,
    communication,
    stability,
    elemA,
    elemB,
    chave,
    distSol,
    nomeSolA: iA != null ? NOMES_PT[iA] : solA,
    nomeSolB: iB != null ? NOMES_PT[iB] : solB,
    modalA: modA,
    modalB: modB,
    elemLuaA,
    elemLuaB: elemSolB,
  }
}
