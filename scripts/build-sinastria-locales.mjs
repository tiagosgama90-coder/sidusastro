/**
 * Estende dicionários de sinastria com es/it/de/fr a partir de PT.
 * Executar: node scripts/build-sinastria-locales.mjs
 */
import { writeFileSync, readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const src = readFileSync(join(__dirname, '../src/lib/sinastriaNarrativas.js'), 'utf8')

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
      if (depth === 0) return Function(`"use strict"; return (${src.slice(begin, i + 1)})`)()
    }
  }
  return null
}

const REPL = {
  es: [
    ['desperta', 'despierta'], ['expressa', 'expresa'], ['seduz', 'seduce'], ['ama', 'ama'],
    ['precisa', 'necesita'], ['valoriza', 'valora'], ['idealiza', 'idealiza'], ['vive', 'vive'],
    ['actua', 'actúa'], ['persiste', 'persiste'], ['estimula-se', 'se estimula'],
    ['demonstra', 'demuestra'], ['busca', 'busca'], ['leva', 'tarda'], ['coragem', 'coraje'],
    ['paixão', 'pasión'], ['amor', 'amor'], ['desejo', 'deseo'], ['intimidade', 'intimidad'],
    ['liberdade', 'libertad'], ['comunicação', 'comunicación'], ['emoção', 'emoción'],
    ['protecção', 'protección'], ['segurança', 'seguridad'], ['harmonia', 'armonía'],
    ['profundidade', 'profundidad'], ['paixões', 'pasiones'], ['conflitos', 'conflictos'],
    ['crescimento', 'crecimiento'], ['evolução', 'evolución'], ['padrão', 'patrón'],
    ['cármico', 'kármico'], ['largar', 'soltar'], ['servir', 'servir'], ['inovar', 'innovar'],
    ['compaixão', 'compasión'], ['imaginação', 'imaginación'], ['missão', 'misión'],
    ['tua', 'tu'], ['teu', 'tu'], ['ti ', 'ti '], ['não', 'no'], ['és', 'eres'],
  ],
  it: [
    ['desperta', 'sveglia'], ['expressa', 'esprime'], ['seduz', 'seduce'], ['demonstra', 'dimostra'],
    ['precisa', 'ha bisogno'], ['valoriza', 'valorizza'], ['actua', 'agisce'], ['busca', 'cerca'],
    ['paixão', 'passione'], ['amor', 'amore'], ['desejo', 'desiderio'], ['emoção', 'emozione'],
    ['protecção', 'protezione'], ['segurança', 'sicurezza'], ['harmonia', 'armonia'],
    ['profundidade', 'profondità'], ['crescimento', 'crescita'], ['evolução', 'evoluzione'],
    ['compaixão', 'compassione'], ['missão', 'missione'], ['tua', 'tua'], ['teu', 'tuo'],
  ],
  de: [
    ['desperta', 'erweckt'], ['expressa', 'drückt aus'], ['seduz', 'verführt'], ['ama', 'liebt'],
    ['precisa', 'braucht'], ['valoriza', 'schätzt'], ['actua', 'handelt'], ['busca', 'sucht'],
    ['paixão', 'Leidenschaft'], ['amor', 'Liebe'], ['desejo', 'Verlangen'], ['emoção', 'Emotion'],
    ['protecção', 'Schutz'], ['segurança', 'Sicherheit'], ['harmonia', 'Harmonie'],
    ['profundidade', 'Tiefe'], ['crescimento', 'Wachstum'], ['evolução', 'Evolution'],
    ['compaixão', 'Mitgefühl'], ['missão', 'Mission'], ['tua', 'deine'], ['teu', 'dein'],
  ],
  fr: [
    ['desperta', 'éveille'], ['expressa', 'exprime'], ['seduz', 'séduit'], ['ama', 'aime'],
    ['precisa', 'a besoin'], ['valoriza', 'valorise'], ['actua', 'agit'], ['busca', 'cherche'],
    ['paixão', 'passion'], ['amor', 'amour'], ['desejo', 'désir'], ['emoção', 'émotion'],
    ['protecção', 'protection'], ['segurança', 'sécurité'], ['harmonia', 'harmonie'],
    ['profundidade', 'profondeur'], ['crescimento', 'croissance'], ['evolução', 'évolution'],
    ['compaixão', 'compassion'], ['missão', 'mission'], ['tua', 'ta'], ['teu', 'ton'],
  ],
}

function translateStr(s, lang) {
  let out = s
  for (const [a, b] of REPL[lang]) out = out.split(a).join(b)
  return out
}

function extendDict(dict, lang) {
  const out = {}
  for (const [sign, entry] of Object.entries(dict)) {
    out[sign] = { ...entry, [lang]: typeof entry.pt === 'string' ? translateStr(entry.pt, lang) : entry.pt }
  }
  return out
}

let out = '/** Gerado por scripts/build-sinastria-locales.mjs */\n'
for (const name of DICT_NAMES) {
  const dict = extractObject(name)
  if (!dict) continue
  for (const lang of ['es', 'it', 'de', 'fr']) {
    out += `export const ${name}_${lang.toUpperCase()} = ${JSON.stringify(extendDict(dict, lang), null, 2)}\n\n`
  }
}

writeFileSync(join(__dirname, '../src/lib/i18n/packs/sinastriaLocales.js'), out, 'utf8')
console.log('sinastriaLocales.js gerado')
