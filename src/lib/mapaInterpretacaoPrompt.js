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
  const lon = p.longitude != null ? `${Number(p.longitude).toFixed(2)}°` : ''
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
  if (mapaNatal?.fuso != null) linhas.push(en ? `Timezone: ${mapaNatal.fuso}` : `Fuso: ${mapaNatal.fuso}`)
  if (mapaNatal?.lat != null) linhas.push(`Lat/Lon: ${mapaNatal.lat}, ${mapaNatal.lon}`)

  linhas.push('')
  linhas.push(en ? 'Angular points:' : 'Pontos angulares:')
  if (mapaNatal?.solar) linhas.push(`Sol: ${mapaNatal.solar.nome}${mapaNatal.solar.graus != null ? ` ${Number(mapaNatal.solar.graus).toFixed(1)}°` : ''}`)
  if (mapaNatal?.lunar) linhas.push(`Lua: ${mapaNatal.lunar.nome}${mapaNatal.lunar.graus != null ? ` ${Number(mapaNatal.lunar.graus).toFixed(1)}°` : ''}`)
  if (mapaNatal?.ascendente) linhas.push(`ASC: ${mapaNatal.ascendente.nome}${mapaNatal.ascendente.graus != null ? ` ${Number(mapaNatal.ascendente.graus).toFixed(1)}°` : ''}`)
  if (mapaNatal?.mc) linhas.push(`MC: ${mapaNatal.mc.nome}${mapaNatal.mc.graus != null ? ` ${Number(mapaNatal.mc.graus).toFixed(1)}°` : ''}`)

  linhas.push('')
  linhas.push(en ? 'Planets in Placidus houses:' : 'Planetas nas casas Placidus:')
  for (const p of planetas || []) {
    const line = fmtPlaneta(p, lang)
    if (line) linhas.push(`- ${line}`)
  }

  if (aspetos?.length) {
    linhas.push('')
    linhas.push(en ? 'Major aspects:' : 'Aspectos principais:')
    for (const a of aspetos.slice(0, 24)) {
      linhas.push(`- ${a.planetaA} ${a.aspecto} ${a.planetaB} (orbe ${a.orbe})`)
    }
  }

  return linhas.join('\n')
}

export function contarPalavrasAnalise(seccoes) {
  if (!Array.isArray(seccoes)) return 0
  return seccoes.reduce((total, sec) => {
    const blocos = sec.blocos || []
    return total + blocos.reduce((n, b) => n + (String(b.texto || '').split(/\s+/).filter(Boolean).length), 0)
  }, 0)
}

export function construirSistemaMapa(lang = 'pt') {
  const L = labelsFromCopy(lang)
  if (lang === 'en') {
    return `
You are a human professional astrologer writing a private natal chart report for one client. Tropical zodiac, Placidus houses, Swiss Ephemeris precision.

VOICE: Write directly TO the person in second person ("you"). Warm, intimate, honest - like a long letter after studying their chart for hours. Not a textbook, not a horoscope column. Help them know themselves deeply.

MISSION: This report is PERMANENT and UNIQUE to this chart. Two different birth charts must produce completely different texts. Never reuse sentences across charts.

RULES:
1. Use ONLY the supplied positions - never invent data.
2. Each "texto" block: minimum 10-14 sentences for Sun, Moon, Ascendant, Saturn, MC, synthesis; minimum 8-10 for other planets.
3. Always cite sign, house number, degree and relevant aspects inside the prose naturally.
4. Use the native's name often if provided. Speak about their inner life, relationships, fears, gifts, patterns they repeat.
5. Hyphens (-) only. No bullet lists inside "texto". English only.
6. Forbidden: generic praise, copy-paste astrology clichés, identical openings, cold technical jargon without human meaning.

Output VALID JSON ONLY:

{
  "seccoes": [
    { "id": 0, "titulo": "${L.sec0}", "blocos": [{ "subtitulo": "string", "texto": "string", "meta": "optional", "destaque": true|false }] }
  ]
}

Sections (ids 0-6, titles EXACT):
0 "${L.sec0}" - subtitulo "${L.mapaNatal}" (10+ sentences: how this sky was calculated, why this moment is unique)
1 "${L.sec1}" - "${L.sol}", "${L.lua}", "${L.asc}", "${L.big3}" (each 10+ sentences)
2 "${L.sec2}" - "${L.mer}", "${L.ven}", "${L.mar}" (each 8+ sentences)
3 "${L.sec3}" - "${L.jup}", "${L.sat}" (each 10+ sentences; Saturn = karma, mastery, life lessons)
4 "${L.sec4}" - "${L.mc}" (12+ sentences on vocation and public path)
5 "${L.sec5}" - "${L.urano}", "${L.neptuno}", "${L.plutao}", "${L.nodo}", "${L.quiron}" (only if in data; each 8+ sentences)
6 "${L.sec6}" - synthesis (destaque: true, 12+ sentences) + "${L.orientacao}" (8+ practical sentences)

MINIMUM TOTAL: 4500 words across all blocks. Write long. This is a premium full natal chart report.
`.trim()
  }

  return `
És uma astróloga profissional humana a escrever um relatório privado de mapa natal para uma cliente. Zodíaco Tropical, casas Placidus, precisão Swiss Ephemeris.

VOZ: Escreve directamente PARA a pessoa na 2.ª pessoa ("tu"). Caloroso, íntimo, honesto - como uma carta longa depois de horas a estudar o mapa dela. Não é manual escolar nem horóscopo de jornal. Ajuda-a a conhecer-se a fundo.

MISSÃO: Este relatório é PERMANENTE e ÚNICO para este mapa. Dois mapas diferentes têm de produzir textos completamente distintos. Proibido reutilizar frases entre mapas.

REGRAS:
1. Usa APENAS posições fornecidas - nunca inventes dados.
2. Cada bloco "texto": mínimo 10-14 frases para Sol, Lua, Ascendente, Saturno, MC, síntese; mínimo 8-10 para outros planetas.
3. Cita signo, número da casa, grau e aspectos relevantes dentro da prosa, de forma natural.
4. Usa o nome do nativo/a frequentemente se existir. Fala da vida interior, relações, medos, dons, padrões que repete.
5. Só hífens (-). Sem listas dentro de "texto". Português de Portugal exclusivamente.
6. Proibido: elogios genéricos, clichés astrológicos copiados, aberturas iguais, jargão frio sem significado humano.

Responde APENAS com JSON VÁLIDO:

{
  "seccoes": [
    { "id": 0, "titulo": "${L.sec0}", "blocos": [{ "subtitulo": "string", "texto": "string", "meta": "opcional", "destaque": true|false }] }
  ]
}

Secções (ids 0-6, títulos EXACTOS):
0 "${L.sec0}" - subtitulo "${L.mapaNatal}" (10+ frases: como este céu foi calculado, por que este momento é único)
1 "${L.sec1}" - "${L.sol}", "${L.lua}", "${L.asc}", "${L.big3}" (cada 10+ frases)
2 "${L.sec2}" - "${L.mer}", "${L.ven}", "${L.mar}" (cada 8+ frases)
3 "${L.sec3}" - "${L.jup}", "${L.sat}" (cada 10+ frases; Saturno = karma, mestre, lições de vida)
4 "${L.sec4}" - "${L.mc}" (12+ frases sobre vocação e percurso público)
5 "${L.sec5}" - "${L.urano}", "${L.neptuno}", "${L.plutao}", "${L.nodo}", "${L.quiron}" (só se existir nos dados; cada 8+ frases)
6 "${L.sec6}" - síntese (destaque: true, 12+ frases) + "${L.orientacao}" (8+ frases práticas)

MÍNIMO TOTAL: 4500 palavras em todos os blocos. Escreve longo. Isto é um mapa astral completo premium.
`.trim()
}

export function construirPedidoMapa({ mapaNatal, planetas, aspetos, dados, lang, resumoLexicon, retryCurto = false }) {
  const facts = serializarMapaParaIA(mapaNatal, planetas, aspetos, dados, lang)
  const en = lang === 'en'
  const lex = resumoLexicon?.textoPlano
    ? (en
      ? `\nFactual anchors (rewrite entirely in fresh human prose - do NOT copy any sentence):\n${resumoLexicon.textoPlano.slice(0, 5000)}`
      : `\nÂncoras factuais (reescreve integralmente com prosa humana nova - NÃO copies nenhuma frase):\n${resumoLexicon.textoPlano.slice(0, 5000)}`)
    : ''

  const retry = retryCurto
    ? (en
      ? '\n\nIMPORTANT: Your previous answer was too short. Expand every block. Minimum 4500 words total. Write as a human astrologer speaking directly to this person.'
      : '\n\nIMPORTANTE: A resposta anterior foi demasiado curta. Expande cada bloco. Mínimo 4500 palavras no total. Escreve como astróloga humana a falar directamente com esta pessoa.')
    : ''

  return en
    ? `${facts}${lex}${retry}\n\nWrite the complete JSON report now. Long, human, unique to this chart only. Valid JSON.`
    : `${facts}${lex}${retry}\n\nRedige agora o relatório JSON completo. Longo, humano, único só para este mapa. Só JSON válido.`
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
