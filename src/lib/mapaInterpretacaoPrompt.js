/**
 * Prompt IA - interpretação natal única por mapa calculado (Tropical · Placidus).
 */

import { formatarTextoPlano } from './mapaInterpretacao.js'
import { getMapaCopy } from './i18n/mapaCopy.js'

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

function fmtPlaneta(p, lang) {
  if (!p) return null
  const signo = p.signo?.nome || '-'
  const graus = p.signo?.graus != null ? `${Number(p.signo.graus).toFixed(1)}°` : '-'
  const casa = p.casa ? (lang === 'en' ? `H${p.casa}` : `C${p.casa}`) : '-'
  const retro = p.retrograde ? ' ℞' : ''
  const lon = p.longitude != null ? `${Number(p.longitude).toFixed(2)}° ecliptic` : ''
  return `${p.nome || p.key}: ${signo} ${graus} ${casa}${retro}${lon ? ` (${lon})` : ''}`
}

export function serializarMapaParaIA(mapaNatal, planetas, aspetos, dados, lang = 'pt') {
  const linhas = []
  const en = lang === 'en'

  linhas.push(en ? 'NATAL CHART DATA (authoritative - do not invent positions):' : 'DADOS DO MAPA NATAL (autoritativos - não inventes posições):')
  if (dados?.nome) linhas.push(en ? `Name: ${dados.nome}` : `Nome: ${dados.nome}`)
  if (dados?.data) linhas.push(en ? `Birth date: ${dados.data}` : `Data: ${dados.data}`)
  if (dados?.hora) linhas.push(en ? `Birth time: ${dados.hora}` : `Hora: ${dados.hora}`)
  if (dados?.cidade) linhas.push(en ? `Place: ${dados.cidade}` : `Local: ${dados.cidade}`)
  if (mapaNatal?.instanteUTC) linhas.push(`UTC: ${mapaNatal.instanteUTC}`)
  if (mapaNatal?.fuso != null) linhas.push(en ? `Timezone offset: ${mapaNatal.fuso}` : `Fuso: ${mapaNatal.fuso}`)
  if (mapaNatal?.lat != null) linhas.push(`Lat/Lon: ${mapaNatal.lat}, ${mapaNatal.lon}`)

  linhas.push('')
  linhas.push(en ? 'Angular points:' : 'Pontos angulares:')
  if (mapaNatal?.solar) linhas.push(`☉ Sun/Sol: ${mapaNatal.solar.nome}${mapaNatal.solar.graus != null ? ` ${Number(mapaNatal.solar.graus).toFixed(1)}°` : ''}`)
  if (mapaNatal?.lunar) linhas.push(`☽ Moon/Lua: ${mapaNatal.lunar.nome}${mapaNatal.lunar.graus != null ? ` ${Number(mapaNatal.lunar.graus).toFixed(1)}°` : ''}`)
  if (mapaNatal?.ascendente) linhas.push(`ASC: ${mapaNatal.ascendente.nome}${mapaNatal.ascendente.graus != null ? ` ${Number(mapaNatal.ascendente.graus).toFixed(1)}°` : ''}`)
  if (mapaNatal?.mc) linhas.push(`MC: ${mapaNatal.mc.nome}${mapaNatal.mc.graus != null ? ` ${Number(mapaNatal.mc.graus).toFixed(1)}°` : ''}`)

  linhas.push('')
  linhas.push(en ? 'Planets in houses (Placidus):' : 'Planetas nas casas (Placidus):')
  for (const p of planetas || []) {
    const line = fmtPlaneta(p, lang)
    if (line) linhas.push(`- ${line}`)
  }

  if (aspetos?.length) {
    linhas.push('')
    linhas.push(en ? 'Major aspects (use in interpretation):' : 'Aspectos principais (usa na interpretação):')
    for (const a of aspetos.slice(0, 22)) {
      linhas.push(`- ${a.planetaA} ${a.aspecto} ${a.planetaB} (orb ${a.orbe})`)
    }
  }

  return linhas.join('\n')
}

export function construirSistemaMapa(lang = 'pt') {
  const L = labelsFromCopy(lang)
  if (lang === 'en') {
    return `
You are a senior professional astrologer writing for Sidus Astro. Tropical zodiac, Placidus houses, Swiss Ephemeris-grade precision.

MISSION: Produce a COMPLETE premium natal chart reading for THIS chart only. Write as if in a paid consultation: long, precise, transparent, citing exact placements. Every native must receive clearly different prose. Never copy stock phrases, horoscope filler, or sentences that could apply to any chart.

STYLE:
- Professional, warm, direct. English only.
- Use hyphens (-) not em dashes. No bullet lists inside "texto" fields.
- Each block "texto": 5-8 sentences minimum. Cite sign, house number, degree when relevant, and at least one aspect where it illuminates the point.
- Name the native if provided. Reference birth place, date and time in section 0.
- Explain WHY each placement matters in lived experience, not only WHAT it means.
- Forbidden: vague flattery, repeated opening formulas, identical paragraph structures across blocks.

DATA RULE: Use ONLY supplied positions. Never invent planets, signs, houses or aspects.

Output VALID JSON ONLY (no markdown fences). Schema:

{
  "seccoes": [
    {
      "id": 0,
      "titulo": "${L.sec0}",
      "blocos": [{ "subtitulo": "string", "texto": "string", "meta": "optional", "destaque": true|false }]
    }
  ]
}

Required sections (ids 0-6, titles EXACTLY as listed):
0 "${L.sec0}" - 1 block subtitulo "${L.mapaNatal}": method, transparency of calculation, uniqueness of this sky moment (6+ sentences)
1 "${L.sec1}" - blocks with subtitulos EXACTLY: "${L.sol}", "${L.lua}", "${L.asc}", "${L.big3}" (each 6+ sentences, cite house + aspects)
2 "${L.sec2}" - blocks: "${L.mer}", "${L.ven}", "${L.mar}" (each 5+ sentences)
3 "${L.sec3}" - blocks: "${L.jup}", "${L.sat}" (each 6+ sentences; Saturn block must address karma, discipline, life lessons)
4 "${L.sec4}" - 1 block "${L.mc}": vocation, public role, career path (7+ sentences)
5 "${L.sec5}" - one block per present planet with subtitulos EXACTLY: "${L.urano}", "${L.neptuno}", "${L.plutao}", "${L.nodo}", "${L.quiron}" (skip if not in data; each 5+ sentences)
6 "${L.sec6}" - 2 blocks: evolutionary synthesis (destaque: true, 7+ sentences weaving Sun, Moon, Asc, tightest aspect, MC) + "${L.orientacao}" (5+ practical sentences)

Total length: 2200-3200 words across all blocks. Depth over brevity.
`.trim()
  }

  return `
És astróloga profissional sénior a redigir para o Sidus Astro. Zodíaco Tropical, casas Placidus, precisão Swiss Ephemeris.

MISSÃO: Produzir uma leitura premium COMPLETA só para ESTE mapa. Escreve como numa consulta paga: longa, precisa, transparente, citando posições exactas. Cada nativo deve receber prosa claramente diferente. Proibido copiar frases-feitas, texto genérico de horóscopo ou frases que serviriam para qualquer mapa.

ESTILO:
- Tom profissional, caloroso, directo. Português de Portugal exclusivamente.
- Usa hífens (-), nunca travessões longos. Sem listas com bullets dentro dos campos "texto".
- Cada bloco "texto": mínimo 5-8 frases. Cita signo, número da casa, grau quando relevante, e pelo menos um aspecto quando ilumine o ponto.
- Menciona o nome do nativo se existir. Referencia local, data e hora na secção 0.
- Explica PORQUÊ cada posição importa na vida vivida, não só O QUE significa.
- Proibido: elogios vagos, fórmulas de abertura repetidas, estruturas idênticas entre blocos.

REGRA DE DADOS: Usa APENAS posições fornecidas. Nunca inventes planetas, signos, casas ou aspectos.

Responde APENAS com JSON VÁLIDO (sem markdown). Esquema:

{
  "seccoes": [
    {
      "id": 0,
      "titulo": "${L.sec0}",
      "blocos": [{ "subtitulo": "string", "texto": "string", "meta": "opcional", "destaque": true|false }]
    }
  ]
}

Secções obrigatórias (ids 0-6, títulos EXACTAMENTE):
0 "${L.sec0}" - 1 bloco subtitulo "${L.mapaNatal}": método, transparência do cálculo, singularidade deste momento de céu (6+ frases)
1 "${L.sec1}" - blocos com subtitulos EXACTAMENTE: "${L.sol}", "${L.lua}", "${L.asc}", "${L.big3}" (cada 6+ frases, cita casa + aspectos)
2 "${L.sec2}" - blocos: "${L.mer}", "${L.ven}", "${L.mar}" (cada 5+ frases)
3 "${L.sec3}" - blocos: "${L.jup}", "${L.sat}" (cada 6+ frases; bloco Saturno deve abordar karma, disciplina, lições de vida)
4 "${L.sec4}" - 1 bloco "${L.mc}": vocação, papel público, percurso profissional (7+ frases)
5 "${L.sec5}" - um bloco por planeta presente com subtitulos EXACTAMENTE: "${L.urano}", "${L.neptuno}", "${L.plutao}", "${L.nodo}", "${L.quiron}" (omitir se não existir nos dados; cada 5+ frases)
6 "${L.sec6}" - 2 blocos: síntese evolutiva (destaque: true, 7+ frases integrando Sol, Lua, Asc, aspecto mais tenso, MC) + "${L.orientacao}" (5+ frases práticas)

Extensão total: 2200-3200 palavras. Profundidade antes de brevidade.
`.trim()
}

export function construirPedidoMapa({ mapaNatal, planetas, aspetos, dados, lang, resumoLexicon }) {
  const facts = serializarMapaParaIA(mapaNatal, planetas, aspetos, dados, lang)
  const en = lang === 'en'
  const lex = resumoLexicon?.textoPlano
    ? (en
      ? `\nLexicon reference (factual anchors only - rewrite entirely in fresh, unique prose; do not copy sentences):\n${resumoLexicon.textoPlano.slice(0, 4200)}`
      : `\nReferência léxico (âncoras factuais apenas - reescreve integralmente com prosa nova e única; não copies frases):\n${resumoLexicon.textoPlano.slice(0, 4200)}`)
    : ''

  return en
    ? `${facts}${lex}\n\nWrite the full JSON interpretation now. This chart must read unlike any other. Cite houses, degrees and aspects throughout. Valid JSON only.`
    : `${facts}${lex}\n\nRedige agora a interpretação JSON completa. Este mapa tem de ler-se de forma distinta de qualquer outro. Cita casas, graus e aspectos ao longo do texto. Só JSON válido.`
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
