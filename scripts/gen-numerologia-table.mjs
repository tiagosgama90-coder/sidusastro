/**
 * Gera scripts/data/numerologia-table.mjs a partir de árvores por idioma.
 * Editar LOCALES abaixo e correr: node scripts/gen-numerologia-table.mjs
 */
import { writeFileSync, readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const EN = JSON.parse(readFileSync(join(__dirname, 'data/numerologia-en.json'), 'utf8'))

// Import locale trees from separate files (maintainable chunks)
import { ES } from './data/numerologia-locale-es.mjs'
import { IT } from './data/numerologia-locale-it.mjs'
import { DE } from './data/numerologia-locale-de.mjs'
import { FR } from './data/numerologia-locale-fr.mjs'

const LOCALES = { es: ES, it: IT, de: DE, fr: FR }

const TABLE = {}
for (const [lang, tree] of Object.entries(LOCALES)) {
  for (const [tipo, nums] of Object.entries(tree)) {
    for (const [num, fields] of Object.entries(nums)) {
      for (const [field, text] of Object.entries(fields)) {
        const key = `${tipo}.${num}.${field}`
        if (!TABLE[key]) TABLE[key] = {}
        TABLE[key][lang] = text
      }
    }
  }
}

// Validate completeness vs EN
for (const [tipo, nums] of Object.entries(EN)) {
  for (const [num, fields] of Object.entries(nums)) {
    for (const field of Object.keys(fields)) {
      const key = `${tipo}.${num}.${field}`
      for (const lang of ['es', 'it', 'de', 'fr']) {
        if (!TABLE[key]?.[lang]) throw new Error(`Missing ${lang} → ${key}`)
      }
    }
  }
}

const out = `/** Gerado por scripts/gen-numerologia-table.mjs - não editar à mão */\nexport const TABLE = ${JSON.stringify(TABLE, null, 2)}\n`
writeFileSync(join(__dirname, 'data/numerologia-table.mjs'), out, 'utf8')
console.log('✓ numerologia-table.mjs', Object.keys(TABLE).length, 'chaves')
