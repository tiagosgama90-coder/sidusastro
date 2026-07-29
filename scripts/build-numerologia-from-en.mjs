/**
 * Gera numerologiaLocales.js a partir de INTERPRETACOES_EN + dicionário completo.
 * Uso: node scripts/build-numerologia-from-en.mjs
 */
import { readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { DICT } from './data/numerologia-dict.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const EN = JSON.parse(readFileSync(join(__dirname, 'data/numerologia-en.json'), 'utf8'))

function translateTree(enTree, lang) {
  const map = DICT[lang]
  if (!map) throw new Error(`Missing dict for ${lang}`)
  const out = {}
  for (const [tipo, nums] of Object.entries(enTree)) {
    out[tipo] = {}
    for (const [num, fields] of Object.entries(nums)) {
      out[tipo][num] = {}
      for (const [field, text] of Object.entries(fields)) {
        out[tipo][num][field] = map[text] || text
      }
    }
  }
  return out
}

let out = '/** Gerado por scripts/build-numerologia-from-en.mjs - traduções completas a partir de EN */\n'
for (const lang of ['es', 'it', 'de', 'fr']) {
  const data = translateTree(EN, lang)
  out += `export const INTERPRETACOES_${lang.toUpperCase()} = ${JSON.stringify(data, null, 2)}\n\n`
}

const dest = join(__dirname, '../src/lib/i18n/packs/numerologiaLocales.js')
writeFileSync(dest, out, 'utf8')
console.log('✓', dest)
