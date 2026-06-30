/**
 * Gera packs ES/IT/DE/FR para mapaEssencia, mapaProfundo, sonhosLexicon, aspectosNarrativa.
 * Fonte: versões EN (sem vazamentos PT).
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

function extractNestedObject(filePath, name) {
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

// --- mapaEssencia (fonte EN) ---
const essenciaPath = join(root, 'src/lib/mapaEssencia.js')
const SOL_EN = extractObject(essenciaPath, 'SOL_EN')
const LUA_EN = extractObject(essenciaPath, 'LUA_EN')
const ASC_EN = extractObject(essenciaPath, 'ASC_EN')

let essenciaOut = '/** Gerado por scripts/build-mapa-sonhos-locales.mjs (fonte EN) */\n'
for (const lang of ['es', 'it', 'de', 'fr']) {
  essenciaOut += `export const SOL_${lang.toUpperCase()} = ${JSON.stringify(SOL_EN, null, 2)}\n\n`
  essenciaOut += `export const LUA_${lang.toUpperCase()} = ${JSON.stringify(LUA_EN, null, 2)}\n\n`
  essenciaOut += `export const ASC_${lang.toUpperCase()} = ${JSON.stringify(ASC_EN, null, 2)}\n\n`
}
writeFileSync(join(root, 'src/lib/i18n/packs/mapaEssenciaLocales.js'), essenciaOut, 'utf8')

// --- mapaProfundo (fonte EN) ---
const profundoPath = join(root, 'src/lib/mapaProfundo.js')
const NUCLEO_EN = extractNestedObject(profundoPath, 'NUCLEO_EN')

let profundoOut = '/** Gerado por scripts/build-mapa-sonhos-locales.mjs (fonte EN) */\n'
for (const lang of ['es', 'it', 'de', 'fr']) {
  profundoOut += `export const NUCLEO_${lang.toUpperCase()} = ${JSON.stringify(NUCLEO_EN, null, 2)}\n\n`
}
writeFileSync(join(root, 'src/lib/i18n/packs/mapaProfundoLocales.js'), profundoOut, 'utf8')

// --- aspectos (fonte EN) ---
const aspPath = join(root, 'src/lib/lexicon/aspectosNarrativa.js')
const ASPETO_NUCLEO_EN = extractObject(aspPath, 'ASPETO_NUCLEO_EN')
const PAR_DINAMICA_EN = extractObject(aspPath, 'PAR_DINAMICA_EN')

let aspOut = '/** Gerado por scripts/build-mapa-sonhos-locales.mjs (fonte EN) */\n'
for (const lang of ['es', 'it', 'de', 'fr']) {
  aspOut += `export const ASPETO_NUCLEO_${lang.toUpperCase()} = ${JSON.stringify(ASPETO_NUCLEO_EN, null, 2)}\n\n`
  aspOut += `export const PAR_DINAMICA_${lang.toUpperCase()} = ${JSON.stringify(PAR_DINAMICA_EN, null, 2)}\n\n`
}
writeFileSync(join(root, 'src/lib/i18n/packs/aspectosLocales.js'), aspOut, 'utf8')

// --- sonhos lexicon: tema EN genérico por entrada ---
const LEXICON_PT = extractArray(join(root, 'src/lib/sonhosLexicon.js'), 'LEXICON')

function lexiconEnFromPt(entries) {
  return entries.map((e) => ({
    letra: e.letra,
    tema: e.tema.replace(/\s*\/\s*/g, ' / '),
    keys: e.keys,
    resumo: `Archetypal dream symbol (${e.tema.split('/')[0].trim()}): inner material seeking integration; apply the Golden Rule of conflict, conversion and healing.`,
  }))
}

const LEXICON_EN_GEN = lexiconEnFromPt(LEXICON_PT)

let sonhosOut = '/** Gerado por scripts/build-mapa-sonhos-locales.mjs (fonte EN) */\n'
for (const lang of ['es', 'it', 'de', 'fr']) {
  const lex = LEXICON_EN_GEN.map((e) => ({
    ...e,
    resumo: lang === 'es'
      ? `Símbolo onírico arquetípico (${e.tema.split('/')[0].trim()}): material interior que pide integración; aplica la Regla de Oro de conflicto, conversión y cura.`
      : lang === 'it'
        ? `Simbolo onirico archetipo (${e.tema.split('/')[0].trim()}): materiale interiore che chiede integrazione; applica la Regola d'Oro di conflitto, conversione e guarigione.`
        : lang === 'de'
          ? `Archetypisches Traumsymbol (${e.tema.split('/')[0].trim()}): inneres Material sucht Integration; wende die Goldene Regel von Konflikt, Wandlung und Heilung an.`
          : `Symbole onirique archétypal (${e.tema.split('/')[0].trim()}) : matière intérieure en quête d'intégration ; applique la Règle d'Or de conflit, conversion et guérison.`,
  }))
  sonhosOut += `export const LEXICON_${lang.toUpperCase()} = ${JSON.stringify(lex, null, 2)}\n\n`
}

const FEELING_PT = {
  peace: 'paz / serenidade', fear: 'medo / terror', sadness: 'tristeza / melancolia',
  joy: 'alegria / leveza', confusion: 'confusão / desorientação', anger: 'raiva / irritação',
}
const FEELING_EN = {
  peace: 'peace / serenity', fear: 'fear / terror', sadness: 'sadness / melancholy',
  joy: 'joy / lightness', confusion: 'confusion / disorientation', anger: 'anger / irritation',
}
const FEELING_ES = {
  peace: 'paz / serenidad', fear: 'miedo / terror', sadness: 'tristeza / melancolía',
  joy: 'alegría / ligereza', confusion: 'confusión / desorientación', anger: 'ira / irritación',
}
const FEELING_IT = {
  peace: 'pace / serenità', fear: 'paura / terrore', sadness: 'tristezza / malinconia',
  joy: 'gioia / leggerezza', confusion: 'confusione / disorientamento', anger: 'rabbia / irritazione',
}
const FEELING_DE = {
  peace: 'Frieden / Gelassenheit', fear: 'Angst / Schrecken', sadness: 'Traurigkeit / Melancholie',
  joy: 'Freude / Leichtigkeit', confusion: 'Verwirrung / Desorientierung', anger: 'Wut / Irritation',
}
const FEELING_FR = {
  peace: 'paix / sérénité', fear: 'peur / terreur', sadness: 'tristesse / mélancolie',
  joy: 'joie / légèreté', confusion: 'confusion / désorientation', anger: 'colère / irritation',
}
sonhosOut += `export const FEELING_PT = ${JSON.stringify(FEELING_PT, null, 2)}\n`
sonhosOut += `export const FEELING_EN = ${JSON.stringify(FEELING_EN, null, 2)}\n`
sonhosOut += `export const FEELING_ES = ${JSON.stringify(FEELING_ES, null, 2)}\n`
sonhosOut += `export const FEELING_IT = ${JSON.stringify(FEELING_IT, null, 2)}\n`
sonhosOut += `export const FEELING_DE = ${JSON.stringify(FEELING_DE, null, 2)}\n`
sonhosOut += `export const FEELING_FR = ${JSON.stringify(FEELING_FR, null, 2)}\n`

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
