/**
 * Árvores completas ES/IT/DE/FR - fonte para numerologiaLocales.js
 * Gerado/mantido via: node scripts/compose-numerologia-locales.mjs
 */
import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const EN = JSON.parse(readFileSync(join(__dirname, 'data/numerologia-en.json'), 'utf8'))

/** Traduz árvore EN campo a campo usando mapa por chave tipo.num.campo */
function buildTree(lang, table) {
  const out = {}
  for (const [tipo, nums] of Object.entries(EN)) {
    out[tipo] = {}
    for (const [num, fields] of Object.entries(nums)) {
      out[tipo][num] = {}
      for (const field of Object.keys(fields)) {
        const key = `${tipo}.${num}.${field}`
        if (!table[key]?.[lang]) throw new Error(`Missing ${lang}: ${key}`)
        out[tipo][num][field] = table[key][lang]
      }
    }
  }
  return out
}

// ── Tabela de traduções (192 chaves × 4 idiomas) ─────────────────────────────
// Chave: "destino.1.resumo" etc.
import { TABLE } from './data/numerologia-table.mjs'

export const INTERPRETACOES_ES = buildTree('es', TABLE)
export const INTERPRETACOES_IT = buildTree('it', TABLE)
export const INTERPRETACOES_DE = buildTree('de', TABLE)
export const INTERPRETACOES_FR = buildTree('fr', TABLE)
