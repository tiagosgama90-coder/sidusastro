/**
 * Inline s6() nos dicionários de sinastriaNarrativas.js
 * node scripts/inline-sinastria-s6.mjs
 */
import { readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SRC = join(__dirname, '../src/lib/sinastriaNarrativas.js')
const I18N = JSON.parse(readFileSync(join(__dirname, 'data/sinastria-rel-i18n.json'), 'utf8'))

const DICT_NAMES = ['VENUS_REL', 'MARTE_REL', 'LUA_EMOC', 'MERCURIO_COM', 'NODO_NORTE', 'NODO_SUL']

function extractObject(src, name) {
  const start = src.indexOf(`const ${name} = {`)
  if (start < 0) return null
  let depth = 0
  let i = src.indexOf('{', start)
  const begin = i
  for (; i < src.length; i++) {
    if (src[i] === '{') depth++
    else if (src[i] === '}') {
      depth--
      if (depth === 0) return { obj: Function(`"use strict"; return (${src.slice(begin, i + 1)})`)(), begin: start, end: i + 1 }
    }
  }
  return null
}

function esc(s) {
  return JSON.stringify(s)
}

function buildBlock(name, obj) {
  const lines = [`const ${name} = {`]
  for (const [sign, entry] of Object.entries(obj)) {
    const tr = I18N[name][sign]
    lines.push(`  ${sign}: s6(${esc(entry.pt)}, ${esc(entry.en)}, ${esc(tr.es)}, ${esc(tr.it)}, ${esc(tr.de)}, ${esc(tr.fr)}),`)
  }
  lines.push('}')
  return lines.join('\n')
}

let src = readFileSync(SRC, 'utf8')

if (!src.includes('function s6(')) {
  src = src.replace(
    'function enrichDict(dict, baseName) {',
    `function s6(pt, en, es, it, de, fr) { return { pt, en, es, it, de, fr } }\n\nfunction enrichDict(dict, baseName) {`,
  )
}

for (const name of DICT_NAMES) {
  const ex = extractObject(src, name)
  if (!ex) throw new Error(`Missing ${name}`)
  const block = buildBlock(name, ex.obj)
  src = src.slice(0, ex.begin) + block + src.slice(ex.end)
}

writeFileSync(SRC, src, 'utf8')
console.log('✓ sinastriaNarrativas.js — s6 inline')
