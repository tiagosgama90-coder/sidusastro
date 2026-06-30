/**
 * Interpretação profissional do Mapa Natal - Tropical Placidus
 * Suporta PT e EN via parâmetro lang.
 */

import { planetaPorNome, resolverPlaneta, mapaPlanetasProntos } from './casasPlacidus.js'
import { getMapaCopy } from './i18n/mapaCopy.js'
import { formatCasaMeta } from './i18n/langUtil.js'
import { interpretarTranspessoal, gerarSinteseEvolutiva } from './mapaProfundo.js'
import { interpretarAspectosNatais } from './lexicon/aspectosNarrativa.js'
import {
  interpretarSolEssencia, interpretarLuaEssencia,
  interpretarAscEssencia, interpretarBig3Essencia,
  interpretarPlanetaEssencia,
} from './mapaEssencia.js'

function metaSigno(signo, casa, lang) {
  const C = getMapaCopy(lang)
  const s = C.sn(signo)
  if (!s) return '-'
  return formatCasaMeta(lang, s, casa)
}

/** Resumo mínimo para utilizadores free */
export function gerarResumoGratuito(mapaNatal, lang = 'pt') {
  return getMapaCopy(lang).gerarResumoGratuito(mapaNatal)
}

/**
 * Gera a análise completa em secções.
 * @returns {{ seccoes: Array, textoPlano: string, fonte: string }}
 */
export function gerarAnaliseCompleta(mapaNatal, planetas, aspetos = [], dados = {}, lang = 'pt') {
  if (!mapaPlanetasProntos(planetas, mapaNatal)) {
    return { seccoes: [], textoPlano: '', fonte: 'lexicon' }
  }

  const C = getMapaCopy(lang)
  const { L } = C

  const sol = mapaNatal?.solar?.nome
  const lua = mapaNatal?.lunar?.nome
  const asc = mapaNatal?.ascendente?.nome
  const mc  = mapaNatal?.mc?.nome

  const pSol = resolverPlaneta(planetas, mapaNatal, 'Sol')
  const pLua = resolverPlaneta(planetas, mapaNatal, 'Lua')
  const pMer = resolverPlaneta(planetas, mapaNatal, 'Mercúrio')
  const pVen = resolverPlaneta(planetas, mapaNatal, 'Vénus')
  const pMar = resolverPlaneta(planetas, mapaNatal, 'Marte')
  const pJup = resolverPlaneta(planetas, mapaNatal, 'Júpiter')
  const pSat = resolverPlaneta(planetas, mapaNatal, 'Saturno')

  const pChi = resolverPlaneta(planetas, mapaNatal, 'Quíron')
  const pNod = resolverPlaneta(planetas, mapaNatal, 'Nodo Norte')
  const pUra = resolverPlaneta(planetas, mapaNatal, 'Urano')
  const pNep = resolverPlaneta(planetas, mapaNatal, 'Neptuno')
  const pPlu = resolverPlaneta(planetas, mapaNatal, 'Plutão')

  const sintese = gerarSinteseEvolutiva(mapaNatal, planetas, aspetos, lang)

  const blocosGeracionais = [
    pUra?.signo?.nome && { subtitulo: L.urano, texto: interpretarTranspessoal('Urano', pUra, mapaNatal, aspetos, planetas, lang), meta: metaSigno(pUra.signo?.nome, pUra.casa, lang) },
    pNep?.signo?.nome && { subtitulo: L.neptuno, texto: interpretarTranspessoal('Neptuno', pNep, mapaNatal, aspetos, planetas, lang), meta: metaSigno(pNep.signo?.nome, pNep.casa, lang) },
    pPlu?.signo?.nome && { subtitulo: L.plutao, texto: interpretarTranspessoal('Plutão', pPlu, mapaNatal, aspetos, planetas, lang), meta: metaSigno(pPlu.signo?.nome, pPlu.casa, lang) },
    pNod?.signo?.nome && { subtitulo: L.nodo, texto: interpretarTranspessoal('Nodo Norte', pNod, mapaNatal, aspetos, planetas, lang), meta: metaSigno(pNod.signo?.nome, pNod.casa, lang) },
    pChi?.signo?.nome && { subtitulo: L.quiron, texto: interpretarTranspessoal('Quíron', pChi, mapaNatal, aspetos, planetas, lang), meta: metaSigno(pChi.signo?.nome, pChi.casa, lang) },
  ].filter(Boolean)

  const seccoes = [
    {
      id: 0,
      titulo: L.sec0,
      blocos: [
        { subtitulo: L.natalChartNote, texto: C.introTecnica(mapaNatal, dados), destaque: true },
      ],
    },
    {
      id: 1,
      titulo: L.sec1,
      blocos: [
        { subtitulo: L.sol, texto: interpretarSolEssencia(pSol, mapaNatal, aspetos, planetas, lang), meta: metaSigno(sol, pSol?.casa, lang) },
        { subtitulo: L.lua, texto: interpretarLuaEssencia(pLua, mapaNatal, aspetos, planetas, lang), meta: metaSigno(lua, pLua?.casa, lang) },
        { subtitulo: L.asc, texto: interpretarAscEssencia(asc, mapaNatal, aspetos, planetas, lang), meta: formatCasaMeta(lang, C.sn(asc), 1) },
        { subtitulo: L.big3, texto: interpretarBig3Essencia(mapaNatal, planetas, aspetos, lang), destaque: true },
      ],
    },
    {
      id: 2,
      titulo: L.sec2,
      blocos: [
        { subtitulo: L.mer, texto: interpretarPlanetaEssencia('Mercúrio', pMer, mapaNatal, aspetos, planetas, lang), meta: metaSigno(pMer?.signo?.nome, pMer?.casa, lang) },
        { subtitulo: L.ven, texto: interpretarPlanetaEssencia('Vénus', pVen, mapaNatal, aspetos, planetas, lang), meta: metaSigno(pVen?.signo?.nome, pVen?.casa, lang) },
        { subtitulo: L.mar, texto: interpretarPlanetaEssencia('Marte', pMar, mapaNatal, aspetos, planetas, lang), meta: metaSigno(pMar?.signo?.nome, pMar?.casa, lang) },
      ],
    },
    {
      id: 3,
      titulo: L.sec3,
      blocos: [
        { subtitulo: L.jup, texto: interpretarPlanetaEssencia('Júpiter', pJup, mapaNatal, aspetos, planetas, lang), meta: metaSigno(pJup?.signo?.nome, pJup?.casa, lang) },
        { subtitulo: L.sat, texto: interpretarPlanetaEssencia('Saturno', pSat, mapaNatal, aspetos, planetas, lang), meta: metaSigno(pSat?.signo?.nome, pSat?.casa, lang) },
      ],
    },
    {
      id: 'aspectos',
      titulo: L.secAspetos,
      blocos: [
        {
          subtitulo: L.majorAspects,
          texto: interpretarAspectosNatais(aspetos, planetas, lang),
          destaque: true,
        },
      ],
    },
    {
      id: 4,
      titulo: L.sec4,
      blocos: [
        { subtitulo: L.mc, texto: C.paragrafoMC(mc), meta: mc ? formatCasaMeta(lang, C.sn(mc), 10) : '-' },
      ],
    },
    ...(blocosGeracionais.length > 0 ? [{
      id: 5,
      titulo: L.sec5,
      blocos: blocosGeracionais,
    }] : []),
    {
      id: blocosGeracionais.length > 0 ? 6 : 5,
      titulo: L.sec6,
      blocos: [
        { subtitulo: `${L.tensoTitulo}: ${sintese.titulo}`, texto: sintese.texto, destaque: true },
        { subtitulo: L.orientacao, texto: sintese.conselho },
      ],
    },
  ]

  const textoPlano = formatarTextoPlano(seccoes, mapaNatal, lang)
  return { seccoes, textoPlano, fonte: 'lexicon' }
}

export function formatarTextoPlano(seccoes, mapaNatal, lang = 'pt') {
  const L = getMapaCopy(lang).L
  const linhas = [
    '═══════════════════════════════════════════',
    `  ${L.pdfHeader}`,
    `  ${L.pdfMethod}`,
    `  ${L.pdfSystem}`,
    '═══════════════════════════════════════════',
    '',
  ]

  for (const sec of seccoes) {
    linhas.push(`## ${sec.id}. ${sec.titulo}`)
    linhas.push('')
    for (const b of sec.blocos) {
      linhas.push(`### ${b.subtitulo}${b.meta ? ` (${b.meta})` : ''}`)
      linhas.push(b.texto)
      linhas.push('')
    }
  }

  linhas.push('───────────────────────────────────────────')
  linhas.push(L.pdfFooter)
  return linhas.join('\n')
}

export { mapaPlanetasProntos }
