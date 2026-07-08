/**
 * Regenera horasLocales.js a partir de EN + traduções nativas.
 * node scripts/emit-horas-all.mjs
 */
import { readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const src = readFileSync(join(__dirname, '../src/lib/horasIguais.js'), 'utf8')

function extractObject(name) {
  const start = src.indexOf(`const ${name} = {`)
  if (start < 0) throw new Error(`Missing ${name}`)
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

const HORAS_EN = extractObject('HORAS_EN')
const ESPELHOS_EN = extractObject('ESPELHOS_EN')
const LOCALES = JSON.parse(readFileSync(join(__dirname, 'data/horas-locales.json'), 'utf8'))

function loadLocale(lang) {
  const extraPath = join(__dirname, `data/horas-${lang}.json`)
  try {
    const extra = JSON.parse(readFileSync(extraPath, 'utf8'))
    return {
      horas: { ...(LOCALES[lang]?.horas || {}), ...(extra.horas || {}) },
      espelhos: { ...(LOCALES[lang]?.espelhos || {}), ...(extra.espelhos || {}) },
    }
  } catch {
    return LOCALES[lang] || { horas: {}, espelhos: {} }
  }
}

function mergePack(enPack, localePack) {
  const out = {}
  for (const [k, v] of Object.entries(enPack)) {
    if (!v) { out[k] = null; continue }
    out[k] = { ...v, ...(localePack?.[k] || {}) }
  }
  return out
}

let out = '/** Gerado por scripts/emit-horas-all.mjs */\n'
for (const lang of ['es', 'it', 'de', 'fr']) {
  const loc = loadLocale(lang)
  out += `export const HORAS_${lang.toUpperCase()} = ${JSON.stringify(mergePack(HORAS_EN, loc?.horas), null, 2)}\n\n`
  out += `export const ESPELHOS_${lang.toUpperCase()} = ${JSON.stringify(mergePack(ESPELHOS_EN, loc?.espelhos), null, 2)}\n\n`
}
writeFileSync(join(__dirname, '../src/lib/i18n/packs/horasLocales.js'), out, 'utf8')
console.log('✓ horasLocales.js')
