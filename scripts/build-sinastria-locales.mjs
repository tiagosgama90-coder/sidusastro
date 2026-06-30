/**
 * Regenera sinastriaLocales.js a partir de traduções EN→ES/IT/DE/FR.
 * node scripts/build-sinastria-locales.mjs
 */
import { writeFileSync, readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const src = readFileSync(join(__dirname, '../src/lib/sinastriaNarrativas.js'), 'utf8')
const I18N = JSON.parse(readFileSync(join(__dirname, 'data/sinastria-rel-i18n.json'), 'utf8'))

const DICT_NAMES = ['VENUS_REL', 'MARTE_REL', 'LUA_EMOC', 'MERCURIO_COM', 'NODO_NORTE', 'NODO_SUL']

function extractObject(name) {
  const start = src.indexOf(`const ${name} = {`)
  if (start < 0) return null
  let depth = 0
  let i = src.indexOf('{', start)
  const begin = i
  for (; i < src.length; i++) {
    if (src[i] === '{') depth++
    else if (src[i] === '}') {
      depth--
      if (depth === 0) {
        const slice = src.slice(begin, i + 1)
        const fn = new Function('s6', `"use strict"; return (${slice})`)
        return fn((pt, en, es, it, de, fr) => ({ pt, en, es, it, de, fr }))
      }
    }
  }
  return null
}

function extendDict(dict, name, lang) {
  const out = {}
  const pack = I18N[name]
  for (const [sign, entry] of Object.entries(dict)) {
    const tr = pack?.[sign]?.[lang] ?? entry[lang]
    if (!tr) throw new Error(`Missing ${name}.${sign}.${lang}`)
    out[sign] = { [lang]: tr }
  }
  return out
}

let out = '/** Gerado por scripts/build-sinastria-locales.mjs */\n'
for (const name of DICT_NAMES) {
  const dict = extractObject(name)
  if (!dict) continue
  for (const lang of ['es', 'it', 'de', 'fr']) {
    out += `export const ${name}_${lang.toUpperCase()} = ${JSON.stringify(extendDict(dict, name, lang), null, 2)}\n\n`
  }
}

writeFileSync(join(__dirname, '../src/lib/i18n/packs/sinastriaLocales.js'), out, 'utf8')
console.log('✓ sinastriaLocales.js')
