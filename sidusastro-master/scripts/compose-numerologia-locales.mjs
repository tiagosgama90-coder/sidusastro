/**
 * Gera numerologiaLocales.js com traduções completas ES/IT/DE/FR.
 * Uso: node scripts/compose-numerologia-locales.mjs
 */
import { writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import {
  INTERPRETACOES_ES, INTERPRETACOES_IT, INTERPRETACOES_DE, INTERPRETACOES_FR,
} from './numerologia-trees.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))

let out = '/** Gerado por scripts/compose-numerologia-locales.mjs */\n'
out += `export const INTERPRETACOES_ES = ${JSON.stringify(INTERPRETACOES_ES, null, 2)}\n\n`
out += `export const INTERPRETACOES_IT = ${JSON.stringify(INTERPRETACOES_IT, null, 2)}\n\n`
out += `export const INTERPRETACOES_DE = ${JSON.stringify(INTERPRETACOES_DE, null, 2)}\n\n`
out += `export const INTERPRETACOES_FR = ${JSON.stringify(INTERPRETACOES_FR, null, 2)}\n\n`

writeFileSync(join(__dirname, '../src/lib/i18n/packs/numerologiaLocales.js'), out, 'utf8')
console.log('✓ numerologiaLocales.js')
