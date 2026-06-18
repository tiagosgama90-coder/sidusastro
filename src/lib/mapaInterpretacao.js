/**
 * Interpretação profissional do Mapa Natal — Tropical Placidus
 * Suporta PT e EN via parâmetro lang.
 */

import { planetaPorNome } from './casasPlacidus.js'
import { getMapaCopy } from './i18n/mapaCopy.js'
import { translatePlaneta } from './i18n/astro.js'

function aspectoTenso(aspetos) {
  const tensos = (aspetos || []).filter(a =>
    a.aspecto === 'Quadratura' || a.aspecto === 'Oposicao' || a.aspecto === 'Oposição'
  )
  if (!tensos.length) return null
  return tensos.sort((a, b) => parseFloat(a.orbe) - parseFloat(b.orbe))[0]
}

function metaSigno(signo, casa, lang) {
  const C = getMapaCopy(lang)
  const s = C.sn(signo)
  if (!s) return '—'
  if (!casa) return s
  return lang === 'en' ? `${s} · House ${casa}` : `${s} · Casa ${casa}`
}

/** Resumo mínimo para utilizadores free */
export function gerarResumoGratuito(mapaNatal, lang = 'pt') {
  return getMapaCopy(lang).gerarResumoGratuito(mapaNatal)
}

/**
 * Gera a análise completa em secções.
 * @returns {{ seccoes: Array, textoPlano: string }}
 */
export function gerarAnaliseCompleta(mapaNatal, planetas, aspetos = [], dados = {}, lang = 'pt') {
  const C = getMapaCopy(lang)
  const { L } = C

  const sol = mapaNatal?.solar?.nome
  const lua = mapaNatal?.lunar?.nome
  const asc = mapaNatal?.ascendente?.nome
  const mc  = mapaNatal?.mc?.nome

  const pSol = planetaPorNome(planetas, 'Sol')
  const pLua = planetaPorNome(planetas, 'Lua')
  const pMer = planetaPorNome(planetas, 'Mercúrio')
  const pVen = planetaPorNome(planetas, 'Vénus')
  const pMar = planetaPorNome(planetas, 'Marte')
  const pJup = planetaPorNome(planetas, 'Júpiter')
  const pSat = planetaPorNome(planetas, 'Saturno')

  const pChi = planetaPorNome(planetas, 'Quíron')
  const pNod = planetaPorNome(planetas, 'Nodo Norte')
  const pUra = planetaPorNome(planetas, 'Urano')
  const pNep = planetaPorNome(planetas, 'Neptuno')
  const pPlu = planetaPorNome(planetas, 'Plutão')

  const tenso = C.sinteseAspectoTenso(aspectoTenso(aspetos))

  const blocosGeracionais = [
    pUra && { subtitulo: L.urano, texto: C.paragrafoGeracional('Urano', pUra.signo?.nome, pUra.casa), meta: metaSigno(pUra.signo?.nome, pUra.casa, lang) },
    pNep && { subtitulo: L.neptuno, texto: C.paragrafoGeracional('Neptuno', pNep.signo?.nome, pNep.casa), meta: metaSigno(pNep.signo?.nome, pNep.casa, lang) },
    pPlu && { subtitulo: L.plutao, texto: C.paragrafoGeracional('Plutão', pPlu.signo?.nome, pPlu.casa), meta: metaSigno(pPlu.signo?.nome, pPlu.casa, lang) },
    pNod && { subtitulo: L.nodo, texto: C.paragrafoGeracional('Nodo Norte', pNod.signo?.nome, pNod.casa), meta: metaSigno(pNod.signo?.nome, pNod.casa, lang) },
    pChi && { subtitulo: L.quiron, texto: C.paragrafoGeracional('Quíron', pChi.signo?.nome, pChi.casa), meta: metaSigno(pChi.signo?.nome, pChi.casa, lang) },
  ].filter(Boolean)

  const seccoes = [
    {
      id: 0,
      titulo: L.sec0,
      blocos: [
        { subtitulo: 'Efemérides · Tropical · Placidus', texto: C.introTecnica(mapaNatal, dados), destaque: true },
      ],
    },
    {
      id: 1,
      titulo: L.sec1,
      blocos: [
        { subtitulo: L.sol, texto: C.paragrafoSol(sol, pSol?.casa), meta: metaSigno(sol, pSol?.casa, lang) },
        { subtitulo: L.lua, texto: C.paragrafoLua(lua, pLua?.casa), meta: metaSigno(lua, pLua?.casa, lang) },
        { subtitulo: L.asc, texto: C.paragrafoAsc(asc), meta: lang === 'en' ? `${C.sn(asc)} · House 1` : `${asc} · Casa 1` },
        { subtitulo: L.big3, texto: C.dinamicaBig3(sol, lua, asc), destaque: true },
      ],
    },
    {
      id: 2,
      titulo: L.sec2,
      blocos: [
        { subtitulo: L.mer, texto: C.paragrafoMerc(pMer?.signo?.nome, pMer?.casa), meta: pMer ? metaSigno(pMer.signo?.nome, pMer.casa, lang) : '—' },
        { subtitulo: L.ven, texto: C.paragrafoVen(pVen?.signo?.nome, pVen?.casa), meta: pVen ? metaSigno(pVen.signo?.nome, pVen.casa, lang) : '—' },
        { subtitulo: L.mar, texto: C.paragrafoMar(pMar?.signo?.nome, pMar?.casa), meta: pMar ? metaSigno(pMar.signo?.nome, pMar.casa, lang) : '—' },
      ],
    },
    {
      id: 3,
      titulo: L.sec3,
      blocos: [
        { subtitulo: L.jup, texto: C.paragrafoJup(pJup?.signo?.nome, pJup?.casa), meta: pJup ? metaSigno(pJup.signo?.nome, pJup.casa, lang) : '—' },
        { subtitulo: L.sat, texto: C.paragrafoSat(pSat?.signo?.nome, pSat?.casa), meta: pSat ? metaSigno(pSat.signo?.nome, pSat.casa, lang) : '—' },
      ],
    },
    {
      id: 4,
      titulo: L.sec4,
      blocos: [
        { subtitulo: L.mc, texto: C.paragrafoMC(mc), meta: mc ? (lang === 'en' ? `${C.sn(mc)} · House 10` : `${mc} · Casa 10`) : '—' },
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
        { subtitulo: `${L.tensoTitulo}: ${tenso.titulo}`, texto: tenso.texto, destaque: true },
        { subtitulo: L.orientacao, texto: C.conselhoFinal(mapaNatal, planetas, planetaPorNome) + ' ' + tenso.conselho },
      ],
    },
  ]

  const textoPlano = formatarTextoPlano(seccoes, mapaNatal, lang)
  return { seccoes, textoPlano }
}

export function formatarTextoPlano(seccoes, mapaNatal, lang = 'pt') {
  const L = getMapaCopy(lang).L
  const linhas = [
    '═══════════════════════════════════════════',
    `  ${L.pdfHeader}`,
    `  ${L.pdfMethod}`,
    `  ${L.pdfSystem}`,
    `  Motor: ${mapaNatal?.motor || 'Swiss Ephemeris / astronomy-engine'}`,
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
