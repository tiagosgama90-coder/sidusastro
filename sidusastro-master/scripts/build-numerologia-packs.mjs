/**
 * Gera interpretações de numerologia ES/IT/DE/FR a partir de PT.
 * Executar: node scripts/build-numerologia-packs.mjs
 */
import { writeFileSync, readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const src = readFileSync(join(__dirname, '../src/lib/numerologiaInterpretacao.js'), 'utf8')

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
      if (depth === 0) {
        return Function(`"use strict"; return (${src.slice(begin, i + 1)})`)()
      }
    }
  }
  throw new Error(`Unclosed ${name}`)
}

const INTERPRETACOES_PT = extractObject('INTERPRETACOES_PT')

const REPL = {
  es: [
    ['O teu nome vibra', 'Tu nombre vibra'], ['Por dentro, desejas', 'Por dentro, deseas'],
    ['O mundo vê-te', 'El mundo te ve'], ['Missão de vida:', 'Misión de vida:'],
    ['Número mestre', 'Número maestro'], ['A Expressão', 'La Expresión'],
    ['A Alma', 'El Alma'], ['A Personalidade', 'La Personalidad'],
    ['O Caminho de Vida', 'El Camino de Vida'], ['hoje', 'hoy'], ['semana', 'semana'],
    ['minutos', 'minutos'], ['nome', 'nombre'], ['tua', 'tu'], ['teu', 'tu'],
    ['ti mesmo', 'ti mismo'], ['alguém', 'alguien'], ['algo', 'algo'],
    ['onde', 'dónde'], ['como', 'cómo'], ['quando', 'cuando'], ['porquê', 'por qué'],
    ['não', 'no'], ['és', 'eres'], ['estás', 'estás'], ['sentes', 'sientes'],
    ['ages', 'actúas'], ['precisas', 'necesitas'], ['podes', 'puedes'],
    ['deves', 'debes'], ['faz', 'haz'], ['pergunta', 'pregunta'],
    ['escolhe', 'elige'], ['observa', 'observa'], ['regista', 'registra'],
    ['liberta', 'libera'], ['honra', 'honra'], ['cuida', 'cuida'],
  ],
  it: [
    ['O teu nome vibra', 'Il tuo nome vibra'], ['Por dentro, desejas', 'Dentro, desideri'],
    ['O mundo vê-te', 'Il mondo ti vede'], ['Missão de vida:', 'Missione di vita:'],
    ['Número mestre', 'Numero maestro'], ['A Expressão', 'L\'Espressione'],
    ['A Alma', 'L\'Anima'], ['A Personalidade', 'La Personalità'],
    ['O Caminho de Vida', 'Il Cammino di Vita'], ['hoje', 'oggi'],
    ['nome', 'nome'], ['tua', 'tua'], ['teu', 'tuo'], ['não', 'non'],
    ['és', 'sei'], ['estás', 'sei'], ['sentes', 'senti'], ['precisas', 'hai bisogno'],
    ['podes', 'puoi'], ['pergunta', 'chiedi'], ['escolhe', 'scegli'],
    ['regista', 'registra'], ['liberta', 'libera'],
  ],
  de: [
    ['O teu nome vibra', 'Dein Name schwingt'], ['Por dentro, desejas', 'In dir wünschst du dir'],
    ['O mundo vê-te', 'Die Welt sieht dich'], ['Missão de vida:', 'Lebensmission:'],
    ['Número mestre', 'Meisterzahl'], ['A Expressão', 'Der Ausdruck'],
    ['A Alma', 'Die Seele'], ['A Personalidade', 'Die Persönlichkeit'],
    ['O Caminho de Vida', 'Der Lebensweg'], ['hoje', 'heute'],
    ['nome', 'Name'], ['tua', 'deine'], ['teu', 'dein'], ['não', 'nicht'],
    ['és', 'bist'], ['estás', 'bist'], ['sentes', 'fühlst'], ['precisas', 'brauchst'],
    ['podes', 'kannst'], ['pergunta', 'frage'], ['escolhe', 'wähle'],
    ['regista', 'notiere'], ['liberta', 'befreie'],
  ],
  fr: [
    ['O teu nome vibra', 'Ton nom vibre'], ['Por dentro, desejas', 'Au fond, tu désires'],
    ['O mundo vê-te', 'Le monde te voit'], ['Missão de vida:', 'Mission de vie :'],
    ['Número mestre', 'Nombre maître'], ['A Expressão', 'L\'Expression'],
    ['A Alma', 'L\'Âme'], ['A Personalidade', 'La Personnalité'],
    ['O Caminho de Vida', 'Le Chemin de Vie'], ['hoje', 'aujourd\'hui'],
    ['nome', 'nom'], ['tua', 'ta'], ['teu', 'ton'], ['não', 'ne pas'],
    ['és', 'es'], ['estás', 'es'], ['sentes', 'ressens'], ['precisas', 'as besoin'],
    ['podes', 'peux'], ['pergunta', 'demande'], ['escolhe', 'choisis'],
    ['regista', 'note'], ['liberta', 'libère'],
  ],
}

function deepTranslate(obj, lang) {
  if (typeof obj === 'string') {
    let s = obj
    for (const [a, b] of REPL[lang]) s = s.split(a).join(b)
    return s
  }
  if (Array.isArray(obj)) return obj.map((x) => deepTranslate(x, lang))
  if (obj && typeof obj === 'object') {
    const o = {}
    for (const [k, v] of Object.entries(obj)) o[k] = deepTranslate(v, lang)
    return o
  }
  return obj
}

const langs = ['es', 'it', 'de', 'fr']
let out = '/** Gerado por scripts/build-numerologia-packs.mjs */\n'
for (const lang of langs) {
  const data = deepTranslate(INTERPRETACOES_PT, lang)
  out += `export const INTERPRETACOES_${lang.toUpperCase()} = ${JSON.stringify(data, null, 2)}\n\n`
}

writeFileSync(join(__dirname, '../src/lib/i18n/packs/numerologiaLocales.js'), out, 'utf8')
console.log('numerologiaLocales.js gerado')
