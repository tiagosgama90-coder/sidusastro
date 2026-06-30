/**
 * Gera packs ES/IT/DE/FR para mapaEssencia, mapaProfundo, sonhosLexicon, aspectosNarrativa.
 * Executar: node scripts/build-mapa-sonhos-locales.mjs
 */
import { writeFileSync, readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

function extractObject(filePath, name) {
  const src = readFileSync(filePath, 'utf8')
  const start = src.indexOf(`const ${name} = {`)
  if (start < 0) throw new Error(`Missing ${name} in ${filePath}`)
  let depth = 0
  let i = src.indexOf('{', start)
  const begin = i
  for (; i < src.length; i++) {
    if (src[i] === '{') depth++
    else if (src[i] === '}') {
      depth--
      if (depth === 0) return Function(`"use strict"; return (${src.slice(begin, i + 1)})`)()
    }
  }
  throw new Error(`Unclosed ${name}`)
}

function extractArray(filePath, name) {
  const src = readFileSync(filePath, 'utf8')
  const start = src.indexOf(`export const ${name} = [`)
  if (start < 0) throw new Error(`Missing ${name}`)
  let depth = 0
  let i = src.indexOf('[', start)
  const begin = i
  for (; i < src.length; i++) {
    if (src[i] === '[') depth++
    else if (src[i] === ']') {
      depth--
      if (depth === 0) return Function(`"use strict"; return (${src.slice(begin, i + 1)})`)()
    }
  }
  throw new Error(`Unclosed array ${name}`)
}

const REPL_COMMON = {
  es: [
    ['O teu', 'Tu'], ['A tua', 'Tu'], ['o teu', 'tu'], ['a tua', 'tu'], ['teu', 'tu'], ['tua', 'tu'],
    ['não', 'no'], ['és', 'eres'], ['estás', 'estás'], ['sentes', 'sientes'], ['ages', 'actúas'],
    ['precisas', 'necesitas'], ['podes', 'puedes'], ['deves', 'debes'], ['honra', 'honra'],
    ['casa', 'casa'], ['mapa', 'carta'], ['alma', 'alma'], ['vida', 'vida'], ['mundo', 'mundo'],
    ['identidade', 'identidad'], ['emoção', 'emoción'], ['emoções', 'emociones'], ['coragem', 'coraje'],
    ['profundidade', 'profundidad'], ['transformação', 'transformación'], ['crescimento', 'crecimiento'],
    ['missão', 'misión'], ['vocación', 'vocación'], ['vocação', 'vocación'], ['sombra', 'sombra'],
    ['maturidade', 'madurez'], ['disciplina', 'disciplina'], ['liberdade', 'libertad'],
    ['compaixão', 'compasión'], ['imaginação', 'imaginación'], ['intuição', 'intuición'],
    ['quotidiano', 'cotidiano'], ['quotidiana', 'cotidiana'], ['consciência', 'consciencia'],
    ['inconsciente', 'inconsciente'], ['relacionamento', 'relación'], ['parceiro', 'pareja'],
  ],
  it: [
    ['O teu', 'Il tuo'], ['A tua', 'La tua'], ['o teu', 'il tuo'], ['a tua', 'la tua'], ['teu', 'tuo'], ['tua', 'tua'],
    ['não', 'non'], ['és', 'sei'], ['estás', 'sei'], ['sentes', 'senti'], ['precisas', 'hai bisogno'],
    ['podes', 'puoi'], ['identidade', 'identità'], ['emoção', 'emozione'], ['coragem', 'coraggio'],
    ['profundidade', 'profondità'], ['transformação', 'trasformazione'], ['crescimento', 'crescita'],
    ['missão', 'missione'], ['vocação', 'vocazione'], ['compaixão', 'compassione'], ['imaginação', 'immaginazione'],
    ['quotidiano', 'quotidiano'], ['consciência', 'coscienza'], ['mapa', 'carta'],
  ],
  de: [
    ['O teu', 'Dein'], ['A tua', 'Deine'], ['o teu', 'dein'], ['a tua', 'deine'], ['teu', 'dein'], ['tua', 'deine'],
    ['não', 'nicht'], ['és', 'bist'], ['estás', 'bist'], ['sentes', 'fühlst'], ['precisas', 'brauchst'],
    ['podes', 'kannst'], ['identidade', 'Identität'], ['emoção', 'Emotion'], ['coragem', 'Mut'],
    ['profundidade', 'Tiefe'], ['transformação', 'Transformation'], ['crescimento', 'Wachstum'],
    ['missão', 'Mission'], ['vocação', 'Berufung'], ['compaixão', 'Mitgefühl'], ['imaginação', 'Fantasie'],
    ['quotidiano', 'Alltag'], ['consciência', 'Bewusstsein'], ['mapa', 'Horoskop'],
  ],
  fr: [
    ['O teu', 'Ton'], ['A tua', 'Ta'], ['o teu', 'ton'], ['a tua', 'ta'], ['teu', 'ton'], ['tua', 'ta'],
    ['não', 'ne pas'], ['és', 'es'], ['estás', 'es'], ['sentes', 'ressens'], ['precisas', 'as besoin'],
    ['podes', 'peux'], ['identidade', 'identité'], ['emoção', 'émotion'], ['coragem', 'courage'],
    ['profundidade', 'profondeur'], ['transformação', 'transformation'], ['crescimento', 'croissance'],
    ['missão', 'mission'], ['vocação', 'vocation'], ['compaixão', 'compassion'], ['imaginação', 'imagination'],
    ['quotidiano', 'quotidien'], ['consciência', 'conscience'], ['mapa', 'carte'],
  ],
}

function translateStr(s, lang) {
  let out = s
  for (const [a, b] of REPL_COMMON[lang]) out = out.split(a).join(b)
  return out
}

function translateDict(dict, lang) {
  const out = {}
  for (const [k, v] of Object.entries(dict)) {
    out[k] = typeof v === 'string' ? translateStr(v, lang) : v
  }
  return out
}

function translateNested(dict, lang) {
  const out = {}
  for (const [planet, signs] of Object.entries(dict)) {
    out[planet] = translateDict(signs, lang)
  }
  return out
}

// --- mapaEssencia ---
const essenciaPath = join(root, 'src/lib/mapaEssencia.js')
const SOL_PT = extractObject(essenciaPath, 'SOL_PT')
const LUA_PT = extractObject(essenciaPath, 'LUA_PT')
const ASC_PT = extractObject(essenciaPath, 'ASC_PT')

let essenciaOut = '/** Gerado por scripts/build-mapa-sonhos-locales.mjs */\n'
for (const lang of ['es', 'it', 'de', 'fr']) {
  essenciaOut += `export const SOL_${lang.toUpperCase()} = ${JSON.stringify(translateDict(SOL_PT, lang), null, 2)}\n\n`
  essenciaOut += `export const LUA_${lang.toUpperCase()} = ${JSON.stringify(translateDict(LUA_PT, lang), null, 2)}\n\n`
  essenciaOut += `export const ASC_${lang.toUpperCase()} = ${JSON.stringify(translateDict(ASC_PT, lang), null, 2)}\n\n`
}
writeFileSync(join(root, 'src/lib/i18n/packs/mapaEssenciaLocales.js'), essenciaOut, 'utf8')

// --- mapaProfundo ---
const profundoPath = join(root, 'src/lib/mapaProfundo.js')
const NUCLEO_PT = extractObject(profundoPath, 'NUCLEO_PT')

let profundoOut = '/** Gerado por scripts/build-mapa-sonhos-locales.mjs */\n'
for (const lang of ['es', 'it', 'de', 'fr']) {
  profundoOut += `export const NUCLEO_${lang.toUpperCase()} = ${JSON.stringify(translateNested(NUCLEO_PT, lang), null, 2)}\n\n`
}
writeFileSync(join(root, 'src/lib/i18n/packs/mapaProfundoLocales.js'), profundoOut, 'utf8')

// --- aspectos ---
const aspPath = join(root, 'src/lib/lexicon/aspectosNarrativa.js')
const ASPETO_NUCLEO_PT = extractObject(aspPath, 'ASPETO_NUCLEO_PT')
const PAR_DINAMICA_PT = extractObject(aspPath, 'PAR_DINAMICA_PT')

let aspOut = '/** Gerado por scripts/build-mapa-sonhos-locales.mjs */\n'
for (const lang of ['es', 'it', 'de', 'fr']) {
  aspOut += `export const ASPETO_NUCLEO_${lang.toUpperCase()} = ${JSON.stringify(translateDict(ASPETO_NUCLEO_PT, lang), null, 2)}\n\n`
  aspOut += `export const PAR_DINAMICA_${lang.toUpperCase()} = ${JSON.stringify(translateDict(PAR_DINAMICA_PT, lang), null, 2)}\n\n`
}
writeFileSync(join(root, 'src/lib/i18n/packs/aspectosLocales.js'), aspOut, 'utf8')

// --- sonhos lexicon ---
const lexPath = join(root, 'src/lib/sonhosLexicon.js')
const LEXICON_PT = extractArray(lexPath, 'LEXICON')

function translateLexicon(entries, lang) {
  return entries.map((e) => ({
    ...e,
    tema: translateStr(e.tema, lang),
    resumo: translateStr(e.resumo, lang),
  }))
}

let sonhosOut = '/** Gerado por scripts/build-mapa-sonhos-locales.mjs */\n'
for (const lang of ['es', 'it', 'de', 'fr']) {
  sonhosOut += `export const LEXICON_${lang.toUpperCase()} = ${JSON.stringify(translateLexicon(LEXICON_PT, lang), null, 2)}\n\n`
}

const FEELING_PT = {
  peace: 'paz / serenidade', fear: 'medo / terror', sadness: 'tristeza / melancolia',
  joy: 'alegria / leveza', confusion: 'confusão / desorientação', anger: 'raiva / irritação',
}
const FEELING_EN = {
  peace: 'peace / serenity', fear: 'fear / terror', sadness: 'sadness / melancholy',
  joy: 'joy / lightness', confusion: 'confusion / disorientation', anger: 'anger / irritation',
}
sonhosOut += `export const FEELING_PT = ${JSON.stringify(FEELING_PT, null, 2)}\n`
sonhosOut += `export const FEELING_EN = ${JSON.stringify(FEELING_EN, null, 2)}\n`
for (const lang of ['es', 'it', 'de', 'fr']) {
  sonhosOut += `export const FEELING_${lang.toUpperCase()} = ${JSON.stringify(translateDict(FEELING_PT, lang), null, 2)}\n`
}

const CHIPS_PT = ['Água', 'Casa', 'Morte', 'Voar', 'Queda', 'Animal', 'Escuridão', 'Fogo', 'Perseguição', 'Criança']
const CHIPS_EN = ['Water', 'House', 'Death', 'Flying', 'Falling', 'Animal', 'Darkness', 'Fire', 'Pursuit', 'Child']
const CHIPS_MAP = {
  es: ['Agua', 'Casa', 'Muerte', 'Volar', 'Caída', 'Animal', 'Oscuridad', 'Fuego', 'Persecución', 'Niño'],
  it: ['Acqua', 'Casa', 'Morte', 'Volare', 'Caduta', 'Animale', 'Oscurità', 'Fuoco', 'Inseguimento', 'Bambino'],
  de: ['Wasser', 'Haus', 'Tod', 'Fliegen', 'Sturz', 'Tier', 'Dunkelheit', 'Feuer', 'Verfolgung', 'Kind'],
  fr: ['Eau', 'Maison', 'Mort', 'Voler', 'Chute', 'Animal', 'Obscurité', 'Feu', 'Poursuite', 'Enfant'],
}
sonhosOut += `export const CHIPS_PT = ${JSON.stringify(CHIPS_PT)}\n`
sonhosOut += `export const CHIPS_EN = ${JSON.stringify(CHIPS_EN)}\n`
for (const lang of ['es', 'it', 'de', 'fr']) {
  sonhosOut += `export const CHIPS_${lang.toUpperCase()} = ${JSON.stringify(CHIPS_MAP[lang])}\n`
}

writeFileSync(join(root, 'src/lib/i18n/packs/sonhosLocales.js'), sonhosOut, 'utf8')
console.log('Packs gerados: mapaEssenciaLocales, mapaProfundoLocales, aspectosLocales, sonhosLocales')
