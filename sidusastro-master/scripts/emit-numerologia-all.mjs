/**
 * Emite numerologia-locales.json (4 árvores) + regenera pack.
 * node scripts/emit-numerologia-all.mjs
 */
import { readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const EN = JSON.parse(readFileSync(join(__dirname, 'data/numerologia-en.json'), 'utf8'))

/** @type {Record<string, Record<string, Record<string, Record<string, string>>>>} */
const T = JSON.parse(readFileSync(join(__dirname, 'data/numerologia-i18n-flat.json'), 'utf8'))

function build(lang) {
  const out = {}
  for (const [tipo, nums] of Object.entries(EN)) {
    out[tipo] = {}
    for (const [num, fields] of Object.entries(nums)) {
      out[tipo][num] = {}
      for (const field of Object.keys(fields)) {
        const key = `${tipo}.${num}.${field}`
        const v = T[key]?.[lang]
        if (!v) throw new Error(`Missing ${lang} ${key}`)
        out[tipo][num][field] = v
      }
    }
  }
  return out
}

const locales = { es: build('es'), it: build('it'), de: build('de'), fr: build('fr') }
writeFileSync(join(__dirname, 'data/numerologia-locales.json'), JSON.stringify(locales, null, 2))

// compose pack
let out = '/** Gerado por scripts/emit-numerologia-all.mjs */\n'
for (const [lang, tree] of Object.entries(locales)) {
  out += `export const INTERPRETACOES_${lang.toUpperCase()} = ${JSON.stringify(tree, null, 2)}\n\n`
}
writeFileSync(join(__dirname, '../src/lib/i18n/packs/numerologiaLocales.js'), out, 'utf8')
console.log('✓ numerologiaLocales.js')
