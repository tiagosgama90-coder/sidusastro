/**
 * Prompt IA — interpretação natal única por mapa calculado (Tropical · Placidus).
 */

import { formatarTextoPlano } from './mapaInterpretacao.js'

const SEC_LABELS = {
  pt: {
    sec0: 'Nota Metodológica',
    sec1: 'A Tua Essência Central',
    sec2: 'Mente, Relações e Acção',
    sec3: 'Desafios e Expansão',
    sec4: 'Missão de Vida e Carreira',
    sec5: 'Dimensões Transpessoais',
    sec6: 'Síntese Evolutiva',
  },
  en: {
    sec0: 'Methodological Note',
    sec1: 'Your Central Essence',
    sec2: 'Mind, Relationships & Action',
    sec3: 'Challenges & Expansion',
    sec4: 'Life Mission & Career',
    sec5: 'Transpersonal Dimensions',
    sec6: 'Evolutionary Synthesis',
  },
}

function fmtPlaneta(p, lang) {
  if (!p) return null
  const signo = p.signo?.nome || '—'
  const graus = p.signo?.graus != null ? `${Number(p.signo.graus).toFixed(1)}°` : '—'
  const casa = p.casa ? (lang === 'en' ? `H${p.casa}` : `C${p.casa}`) : '—'
  const retro = p.retrograde ? (lang === 'en' ? ' ℞' : ' ℞') : ''
  const lon = p.longitude != null ? `${Number(p.longitude).toFixed(2)}° ecliptic` : ''
  return `${p.nome || p.key}: ${signo} ${graus} ${casa}${retro}${lon ? ` (${lon})` : ''}`
}

export function serializarMapaParaIA(mapaNatal, planetas, aspetos, dados, lang = 'pt') {
  const linhas = []
  const en = lang === 'en'

  linhas.push(en ? 'NATAL CHART DATA (authoritative — do not invent positions):' : 'DADOS DO MAPA NATAL (autoritativos — não inventes posições):')
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
    linhas.push(en ? 'Major aspects:' : 'Aspectos principais:')
    for (const a of aspetos.slice(0, 14)) {
      linhas.push(`- ${a.planetaA} ${a.aspecto} ${a.planetaB} (orb ${a.orbe})`)
    }
  }

  return linhas.join('\n')
}

export function construirSistemaMapa(lang = 'pt') {
  const L = SEC_LABELS[lang] || SEC_LABELS.pt
  if (lang === 'en') {
    return `
You are Sidus Astro's professional natal chart interpreter — Tropical zodiac, Placidus houses, Swiss Ephemeris-grade precision.

MISSION: Write a COMPLETE, UNIQUE natal interpretation for THIS chart only. Every paragraph must reference concrete placements (sign, house, degree, aspects) from the data provided. Never reuse generic horoscope filler. Two different charts must produce clearly different texts.

RULES:
1. Use ONLY the positions supplied — never invent planets, signs, houses or aspects.
2. Professional, warm, precise tone. English only.
3. Integrate Sun, Moon, Ascendant, personal planets, MC, generational planets (if data present), and the tightest major aspect in synthesis.
4. Mention the native's name if provided. Reference birth place/date/time in section 0.
5. Each block: 2–5 rich sentences, specific to this chart.
6. Output VALID JSON ONLY (no markdown fences, no commentary). Schema:

{
  "seccoes": [
    {
      "id": 0,
      "titulo": "${L.sec0}",
      "blocos": [{ "subtitulo": "string", "texto": "string", "meta": "optional", "destaque": true|false }]
    }
  ]
}

Required sections (ids 0–6, titles exactly as listed):
0 "${L.sec0}" — 1 block (method + uniqueness of this sky moment)
1 "${L.sec1}" — blocks: Sun, Moon, Ascendant, Sun-Moon-Asc dynamics (4 blocks)
2 "${L.sec2}" — Mercury, Venus, Mars (3 blocks)
3 "${L.sec3}" — Jupiter, Saturn (2 blocks)
4 "${L.sec4}" — Midheaven / vocation (1 block)
5 "${L.sec5}" — Uranus, Neptune, Pluto, North Node, Chiron (only planets present in data; skip missing)
6 "${L.sec6}" — synthesis + practical guidance (2 blocks: synthesis highlighted, guidance)

Total length: 900–1400 words across all blocks.
`.trim()
  }

  return `
És o intérprete profissional de mapas natais do Sidus Astro — zodíaco Tropical, casas Placidus, precisão Swiss Ephemeris.

MISSÃO: Redigir uma interpretação natal COMPLETA e ÚNICA só para ESTE mapa. Cada parágrafo deve citar posições concretas (signo, casa, grau, aspectos) dos dados fornecidos. Proibido texto genérico de horóscopo. Dois mapas diferentes devem produzir textos claramente distintos.

REGRAS:
1. Usa APENAS as posições fornecidas — nunca inventes planetas, signos, casas ou aspectos.
2. Tom profissional, caloroso, preciso. Português de Portugal exclusivamente.
3. Integra Sol, Lua, Ascendente, planetas pessoais, MC, planetas geracionais (se existirem nos dados) e o aspecto major mais tenso na síntese.
4. Menciona o nome do nativo se existir. Referencia local/data/hora na secção 0.
5. Cada bloco: 2–5 frases ricas, específicas deste mapa.
6. Responde APENAS com JSON VÁLIDO (sem markdown, sem comentários). Esquema:

{
  "seccoes": [
    {
      "id": 0,
      "titulo": "${L.sec0}",
      "blocos": [{ "subtitulo": "string", "texto": "string", "meta": "opcional", "destaque": true|false }]
    }
  ]
}

Secções obrigatórias (ids 0–6, títulos exactos):
0 "${L.sec0}" — 1 bloco (método + singularidade deste momento de céu)
1 "${L.sec1}" — blocos: Sol, Lua, Ascendente, dinâmica Sol-Lua-Asc (4 blocos)
2 "${L.sec2}" — Mercúrio, Vénus, Marte (3 blocos)
3 "${L.sec3}" — Júpiter, Saturno (2 blocos)
4 "${L.sec4}" — Meio do Céu / vocação (1 bloco)
5 "${L.sec5}" — Urano, Neptuno, Plutão, Nodo Norte, Quíron (só planetas presentes nos dados)
6 "${L.sec6}" — síntese + orientação prática (2 blocos: síntese em destaque)

Extensão total: 900–1400 palavras.
`.trim()
}

export function construirPedidoMapa({ mapaNatal, planetas, aspetos, dados, lang, resumoLexicon }) {
  const facts = serializarMapaParaIA(mapaNatal, planetas, aspetos, dados, lang)
  const en = lang === 'en'
  const lex = resumoLexicon?.textoPlano
    ? (en
      ? `\nLexicon reference (facts only — rewrite entirely in your own unique prose):\n${resumoLexicon.textoPlano.slice(0, 2200)}`
      : `\nReferência léxico (factos apenas — reescreve integralmente com prosa única):\n${resumoLexicon.textoPlano.slice(0, 2200)}`)
    : ''

  return en
    ? `${facts}${lex}\n\nWrite the full JSON interpretation now. Remember: unique to this chart, cite houses and aspects, valid JSON only.`
    : `${facts}${lex}\n\nRedige agora a interpretação JSON completa. Lembra-te: única para este mapa, cita casas e aspectos, só JSON válido.`
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
