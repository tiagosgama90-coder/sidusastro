/**
 * Audita packs de locale — conta strings que ainda parecem português.
 * Uso: node scripts/audit-locale-packs.mjs
 */
import { readFileSync, readdirSync, statSync } from 'fs'
import { dirname, join, relative } from 'path'
import { fileURLToPath } from 'url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const PACKS_DIR = join(ROOT, 'src/lib/i18n/packs')

function looksPortuguese(str) {
  if (!str || typeof str !== 'string' || str.length < 8) return false
  if (/[ãõç]/i.test(str)) return true
  return /\b(não|nao|tens|estás|estas|estou|o teu|a tua|alguém|alguem|partilhas|reflecte|expressão|expressao|A Expressão|A Alma|A Personalidade|O teu|por dentro|através|consciência|cármico|relacionamento|sem ecrãs|que desejas|Missão mestra|Canal de intuição)\b/i.test(str)
}

function walkStrings(val, out = []) {
  if (typeof val === 'string') {
    if (val.length >= 12) out.push(val)
    return out
  }
  if (Array.isArray(val)) {
    for (const x of val) walkStrings(x, out)
    return out
  }
  if (val && typeof val === 'object') {
    for (const v of Object.values(val)) walkStrings(v, out)
  }
  return out
}

function auditFile(path) {
  const text = readFileSync(path, 'utf8')
  const langMatch = path.match(/(ES|IT|DE|FR|es|it|de|fr)/i)
  const lang = langMatch ? langMatch[0].toLowerCase() : 'pack'
  const strings = walkStrings(extractExportedData(text))
  const ptLeaks = strings.filter(looksPortuguese)
  return { lang, total: strings.length, leaks: ptLeaks.length, samples: ptLeaks.slice(0, 3) }
}

function extractExportedData(text) {
  const out = []
  const exportRe = /export const \w+ = (\{[\s\S]*?\n\})\n/g
  let m
  while ((m = exportRe.exec(text)) !== null) {
    try {
      out.push(Function(`"use strict"; return (${m[1]})`)())
    } catch {
      // arrays / large blobs — skip parse errors
    }
  }
  if (!out.length) {
    const arrRe = /export const \w+ = (\[[\s\S]*?\])\n/g
    while ((m = arrRe.exec(text)) !== null) {
      try { out.push(Function(`"use strict"; return (${m[1]})`)()) } catch { /* */ }
    }
  }
  return out
}

function listJsFiles(dir) {
  const files = []
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) files.push(...listJsFiles(p))
    else if (name.endsWith('.js')) files.push(p)
  }
  return files
}

console.log('Auditoria de locale packs — vazamentos de português\n')
console.log('Ficheiro'.padEnd(42), 'Strings', 'PT leak', '%')
console.log('-'.repeat(72))

let totalLeaks = 0
let totalStrings = 0

for (const file of listJsFiles(PACKS_DIR).sort()) {
  const rel = relative(ROOT, file)
  if (!/(ES|IT|DE|FR|_es|_it|_de|_fr|Locales)/i.test(rel) && !rel.includes('packs')) continue
  if (/Glue|Paragraphs|Static|EssenciaGlue/i.test(rel)) continue
  if (!/(numerologia|horas|sinastria|sonhos|mapa|ferramentas|aspectos)/i.test(rel)) continue

  try {
    const { total, leaks, samples } = auditFile(file)
    if (total === 0) continue
    totalStrings += total
    totalLeaks += leaks
    const pct = total ? ((leaks / total) * 100).toFixed(1) : '0'
    const flag = leaks > 0 ? '⚠' : '✓'
    console.log(`${flag} ${rel.padEnd(40)} ${String(total).padStart(6)} ${String(leaks).padStart(8)} ${pct.padStart(6)}%`)
    for (const s of samples) {
      console.log(`    → ${s.slice(0, 90)}${s.length > 90 ? '…' : ''}`)
    }
  } catch (e) {
    console.log(`? ${rel.padEnd(40)} (erro: ${e.message})`)
  }
}

console.log('-'.repeat(72))
console.log(`Total: ${totalLeaks} vazamentos em ${totalStrings} strings`)
if (totalLeaks === 0) console.log('\n✓ Packs ES/IT/DE/FR limpos (sem português detectado).')
else console.log('\n⚠ Correr build de tradução ou editar packs manualmente.')
