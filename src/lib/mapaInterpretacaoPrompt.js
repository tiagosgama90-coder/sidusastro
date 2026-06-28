/**
 * Prompt IA - interpretação natal psicológica evolutiva (Tropical · Placidus · Swiss Ephemeris).
 */

import { formatarTextoPlano } from './mapaInterpretacao.js'
import { getMapaCopy } from './i18n/mapaCopy.js'

const ELEMENTO = {
  Carneiro: 'Fogo', Leão: 'Fogo', Sagitário: 'Fogo',
  Touro: 'Terra', Virgem: 'Terra', Capricórnio: 'Terra',
  Gémeos: 'Ar', Balança: 'Ar', Aquário: 'Ar',
  Caranguejo: 'Água', Escorpião: 'Água', Peixes: 'Água',
}

const MODALIDADE = {
  Carneiro: 'Cardinal', Caranguejo: 'Cardinal', Balança: 'Cardinal', Capricórnio: 'Cardinal',
  Touro: 'Fixo', Leão: 'Fixo', Escorpião: 'Fixo', Aquário: 'Fixo',
  Gémeos: 'Mutável', Virgem: 'Mutável', Sagitário: 'Mutável', Peixes: 'Mutável',
}

export const FRASES_PROIBIDAS_IA = [
  'define como este planeta se expressa',
  'colore uma dimensão vital',
  'define como pensas',
  'revela a tua linguagem',
  'indica como assertas',
  'aponta onde a vida te expande',
  'é o teu mestre kármico: lições de maturidade',
  'nenhum horóscopo genérico',
  'assinatura psíquica',
  'este planeta se expressa na tua vida',
  'horóscopo genérico',
  'cada planeta se expressa',
]

function labelsFromCopy(lang) {
  const L = getMapaCopy(lang).L
  return {
    sec0: L.sec0,
    sec1: L.sec1,
    sec2: L.sec2,
    sec3: L.sec3,
    sec4: L.sec4,
    sec5: L.sec5,
    sec6: L.sec6,
    sol: L.sol,
    lua: L.lua,
    asc: L.asc,
    big3: L.big3,
    mer: L.mer,
    ven: L.ven,
    mar: L.mar,
    jup: L.jup,
    sat: L.sat,
    mc: L.mc,
    urano: L.urano,
    neptuno: L.neptuno,
    plutao: L.plutao,
    nodo: L.nodo,
    quiron: L.quiron,
    orientacao: L.orientacao,
    mapaNatal: lang === 'en' ? 'Your natal chart' : 'O teu mapa natal',
  }
}

function nomeAspeto(str) {
  return String(str || '').split(' ')[0]
}

function decanato(graus) {
  const g = Number(graus)
  if (!Number.isFinite(g)) return null
  if (g < 10) return '1º decanato (inicial)'
  if (g < 20) return '2º decanato (central)'
  return '3º decanato (final)'
}

function metaPlaneta(p) {
  const signo = p?.signo?.nome
  if (!signo) return null
  const graus = p.signo?.graus != null ? Number(p.signo.graus) : null
  return {
    signo,
    grau_no_signo: graus != null ? Number(graus.toFixed(2)) : null,
    decanato: decanato(graus),
    elemento: ELEMENTO[signo] || null,
    modalidade: MODALIDADE[signo] || null,
    casa: p.casa ?? null,
    longitude_ecliptica: p.longitude != null ? Number(p.longitude.toFixed(4)) : null,
    retrogrado: Boolean(p.retrograde),
  }
}

function aspectosDoPlaneta(nome, aspetos) {
  return (aspetos || [])
    .filter((a) => nomeAspeto(a.planetaA) === nome || nomeAspeto(a.planetaB) === nome)
    .map((a) => ({
      com: nomeAspeto(a.planetaA) === nome ? nomeAspeto(a.planetaB) : nomeAspeto(a.planetaA),
      tipo: a.aspecto,
      orbe: a.orbe,
    }))
}

export function construirPayloadMapa(mapaNatal, planetas, aspetos, dados, lang = 'pt') {
  const lista = (planetas || []).map((p) => ({
    nome: p.nome || p.key,
    ...metaPlaneta(p),
    aspectos: aspectosDoPlaneta(p.nome, aspetos),
  }))

  const ang = (pt) => {
    if (!pt?.nome) return null
    return {
      signo: pt.nome,
      grau_no_signo: pt.graus != null ? Number(Number(pt.graus).toFixed(2)) : null,
      decanato: decanato(pt.graus),
      elemento: ELEMENTO[pt.nome] || pt.elemento || null,
      modalidade: MODALIDADE[pt.nome] || null,
    }
  }

  return {
    sistema: 'Tropical · Casas Placidus · Swiss Ephemeris',
    idioma_saida: lang === 'en' ? 'en-GB' : 'pt-PT',
    nativo: {
      nome: dados?.nome || null,
      data: dados?.data || null,
      hora: dados?.hora || null,
      local: dados?.cidade || null,
      utc: mapaNatal?.instanteUTC || null,
      fuso: mapaNatal?.fuso ?? null,
      lat: mapaNatal?.lat ?? null,
      lon: mapaNatal?.lon ?? null,
    },
    angulares: {
      sol: ang(mapaNatal?.solar),
      lua: ang(mapaNatal?.lunar),
      ascendente: ang(mapaNatal?.ascendente),
      meio_ceu: ang(mapaNatal?.mc),
      descendente: ang(mapaNatal?.descendente),
      fundo_ceu: ang(mapaNatal?.ic),
    },
    planetas: lista,
    aspectos_maiores: (aspetos || []).slice(0, 28).map((a) => ({
      a: nomeAspeto(a.planetaA),
      aspecto: a.aspecto,
      b: nomeAspeto(a.planetaB),
      orbe: a.orbe,
    })),
  }
}

export function serializarMapaParaIA(mapaNatal, planetas, aspetos, dados, lang = 'pt') {
  const payload = construirPayloadMapa(mapaNatal, planetas, aspetos, dados, lang)
  const en = lang === 'en'
  return [
    en ? 'AUTHORITATIVE CHART JSON (Swiss Ephemeris - never invent positions):' : 'JSON AUTORITATIVO DO MAPA (Swiss Ephemeris - nunca inventes posições):',
    JSON.stringify(payload, null, 2),
  ].join('\n')
}

export function contarPalavrasAnalise(seccoes) {
  if (!Array.isArray(seccoes)) return 0
  return seccoes.reduce((total, sec) => {
    const blocos = sec.blocos || []
    return total + blocos.reduce((n, b) => n + String(b.texto || '').split(/\s+/).filter(Boolean).length, 0)
  }, 0)
}

export function temFrasesRoboticas(analise) {
  if (!analise?.seccoes?.length) return true
  const junto = analise.seccoes
    .flatMap((s) => (s.blocos || []).map((b) => String(b.texto || '').toLowerCase()))
    .join(' ')
  return FRASES_PROIBIDAS_IA.some((f) => junto.includes(f.toLowerCase()))
}

export function analiseIaPremiumValida(analise) {
  if (!analise?.seccoes?.length) return false
  const junto = analise.seccoes.flatMap((s) => (s.blocos || []).map((b) => b.texto || '')).join(' ')
  if (!junto.trim() || /\bundefined\b/i.test(junto)) return false
  if (temFrasesRoboticas(analise)) return false
  const palavras = junto.split(/\s+/).filter(Boolean).length
  if (palavras < 4200) return false
  const blocos = analise.seccoes.flatMap((s) => s.blocos || [])
  const curtos = blocos.filter((b) => String(b.texto || '').split(/\s+/).filter(Boolean).length < 120)
  if (curtos.length > blocos.length * 0.25) return false
  return true
}

export function construirSistemaMapa(lang = 'pt') {
  const L = labelsFromCopy(lang)

  if (lang === 'en') {
    return `
You are Sidus Astro's Senior Psychological and Evolutionary Astrologer. Tropical zodiac, Placidus houses, Swiss Ephemeris precision.

IDENTITY: Literary, dense, engaging, therapeutic writing for THIS chart only. You write a permanent premium natal report - a literary work, not a template engine.

ABSOLUTE PROHIBITIONS:
- No prefabricated phrases or repetitive skeletons (e.g. "X shows how this planet expresses...", "this colours a vital dimension").
- No isolated placements: never interpret a planet without weaving sign, house, element, modality, decan degree AND exact aspects in the SAME flowing analysis.
- No invented positions. Use ONLY the supplied JSON.
- No bullet lists inside "texto". Use paragraphs separated by blank lines (\\n\\n).

INTERPRETATION ENGINE (mandatory cross-analysis):
For each placement read: Planet + Sign + House + Element + Modality + Decan + exact aspects with orbs.
When planet X is in sign Y, house Z, aspecting planet W - write ONE unique essay fusing ALL factors, analysing real tension or harmony of this configuration.

SHADOW, LIGHT, PRACTICAL (woven into prose, not labelled mechanically):
Every major block must include: (a) Shadow - self-sabotage, unconscious fears, blocks; (b) Light - latent gifts, virtues, evolution; (c) Practical counsel - real personal development tools for daily life.

LENGTH:
Sun, Moon, Ascendant, Mercury, Venus, Mars, Jupiter, Saturn, MC: 3-4 robust paragraphs each (180-280 words per block minimum).
Transpersonal planets: 2-3 paragraphs each. Synthesis: 4+ paragraphs.
Minimum total: 5500 words.

VOICE: Second person ("you"). Mature, prestigious, human. Valid JSON only.

{
  "seccoes": [
    { "id": 0, "titulo": "${L.sec0}", "blocos": [{ "subtitulo": "string", "texto": "string", "meta": "optional", "destaque": true|false }] }
  ]
}

Sections 0-6, titles EXACT: "${L.sec0}", "${L.sec1}", "${L.sec2}", "${L.sec3}", "${L.sec4}", "${L.sec5}", "${L.sec6}".
Block subtitles EXACT as in standard Sidus natal chart structure.
`.trim()
  }

  return `
És o Astrólogo Psicológico e Evolutivo Sénior do Sidus Astro. Zodíaco Tropical, casas Placidus, precisão Swiss Ephemeris.

IDENTIDADE: Escrita literária, densa, envolvente e terapêutica SÓ para ESTE mapa. Produzes um relatório premium permanente - uma obra de interpretação, não um motor de templates.

PROIBIÇÕES ABSOLUTAS:
- É TERMINANTEMENTE PROIBIDO usar frases pré-feitas ou estruturas repetitivas (ex.: "X define como este planeta se expressa...", "colore uma dimensão vital do teu mapa", "aponta onde a vida te expande", "indica como assertas").
- É PROIBIDO interpretar pontos isolados: nunca analises um planeta sem fundir no MESMO texto signo, casa, elemento, modalidade, decanato e aspectos exactos com orbes.
- É PROIBIDO inventar posições. Usa APENAS o JSON fornecido.
- Sem listas com bullets dentro de "texto". Usa parágrafos separados por linha em branco (\\n\\n).

ENGENHARIA DE INTERPRETAÇÃO (cruzamento obrigatório):
Lê o JSON da Swiss Ephemeris e cruza dinamicamente: Planeta + Signo + Casa + Elemento + Modalidade + Grau/Decanato + Aspetos exactos com orbes.
Se o planeta X está no signo Y, na casa Z, em aspecto com W - escreve um ensaio único que funde TODOS estes elementos, analisando a tensão ou harmonia real desta configuração específica.

SOMBRA, LUZ E CONSELHO (integrados na prosa, sem etiquetas mecânicas):
Em cada bloco principal inclui obrigatoriamente: (a) Sombra - autossabotagem, medos inconscientes, bloqueios; (b) Luz - talentos latentes, virtudes, evolução; (c) Conselhos práticos - ferramentas reais para o quotidiano.

EXTENSÃO PREMIUM (Português de Portugal natural, maduro, profundo, sério):
Sol, Lua, Ascendente, Mercúrio, Vénus, Marte, Júpiter, Saturno, MC: 3 a 4 parágrafos robustos cada (mínimo 180-280 palavras por bloco).
Planetas transpessoais: 2-3 parágrafos cada. Síntese final: 4+ parágrafos.
Mínimo total: 5500 palavras.

VOZ: Segunda pessoa do singular ("tu"). Fala directamente à pessoa pelo nome se existir. Tom de prestígio clínico-literário, nunca robótico.

Responde APENAS com JSON VÁLIDO:

{
  "seccoes": [
    { "id": 0, "titulo": "${L.sec0}", "blocos": [{ "subtitulo": "string", "texto": "string", "meta": "opcional", "destaque": true|false }] }
  ]
}

Secções 0-6, títulos EXACTOS:
0 "${L.sec0}" - subtitulo "${L.mapaNatal}"
1 "${L.sec1}" - subtitulos EXACTOS: "${L.sol}", "${L.lua}", "${L.asc}", "${L.big3}"
2 "${L.sec2}" - "${L.mer}", "${L.ven}", "${L.mar}"
3 "${L.sec3}" - "${L.jup}", "${L.sat}"
4 "${L.sec4}" - "${L.mc}"
5 "${L.sec5}" - "${L.urano}", "${L.neptuno}", "${L.plutao}", "${L.nodo}", "${L.quiron}" (só se existirem no JSON)
6 "${L.sec6}" - síntese evolutiva (destaque: true) + "${L.orientacao}"

Cada "texto" é prosa contínua em parágrafos. Este relatório é imutável e único para este nativo - outro mapa exige texto completamente diferente.
`.trim()
}

export function construirPedidoMapa({ mapaNatal, planetas, aspetos, dados, lang, retryCurto = false, retryRobotic = false }) {
  const facts = serializarMapaParaIA(mapaNatal, planetas, aspetos, dados, lang)
  const en = lang === 'en'

  let extra = ''
  if (retryCurto) {
    extra += en
      ? '\n\nCRITICAL: Previous response was too short. Minimum 5500 words. Expand every block to 3-4 full paragraphs.'
      : '\n\nCRÍTICO: A resposta anterior foi curta demais. Mínimo 5500 palavras. Expande cada bloco para 3-4 parágrafos completos.'
  }
  if (retryRobotic) {
    extra += en
      ? '\n\nCRITICAL: Previous response used template phrases. Rewrite from zero. No repetitive structures. Pure literary psychological astrology.'
      : '\n\nCRÍTICO: A resposta anterior usou frases-feitas. Reescreve do zero. Proibido templates. Astrologia psicológica literária pura.'
  }

  return en
    ? `${facts}${extra}\n\nWrite the complete JSON report now. Cross-weave all chart factors. Shadow, light and practical counsel in every major block. Valid JSON only.`
    : `${facts}${extra}\n\nRedige agora o relatório JSON completo. Cruza todos os factores do mapa. Sombra, luz e conselho prático em cada bloco principal. Só JSON válido.`
}

function sanitizarSeccoes(seccoes) {
  if (!Array.isArray(seccoes)) return null
  const out = seccoes
    .filter((s) => s && typeof s.titulo === 'string' && Array.isArray(s.blocos))
    .map((s) => ({
      id: Number(s.id) || 0,
      titulo: String(s.titulo).trim(),
      blocos: s.blocos
        .filter((b) => b && b.subtitulo && b.texto)
        .map((b) => ({
          subtitulo: String(b.subtitulo).trim(),
          texto: String(b.texto).trim(),
          ...(b.meta ? { meta: String(b.meta).trim() } : {}),
          ...(b.destaque ? { destaque: true } : {}),
        })),
    }))
    .filter((s) => s.blocos.length > 0)
  return out.length >= 3 ? out : null
}

export function parseRespostaMapa(raw, mapaNatal, lang = 'pt') {
  if (!raw?.trim()) return null
  let parsed = null
  const trimmed = raw.trim()
  try {
    parsed = JSON.parse(trimmed)
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/)
    if (match) {
      try {
        parsed = JSON.parse(match[0])
      } catch {
        parsed = null
      }
    }
  }
  const seccoes = sanitizarSeccoes(parsed?.seccoes)
  if (!seccoes) return null
  const textoPlano = formatarTextoPlano(seccoes, mapaNatal, lang)
  return { seccoes, textoPlano, fonte: 'ia' }
}
