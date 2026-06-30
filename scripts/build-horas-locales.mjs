/**
 * Gera packs de horas iguais ES/IT/DE/FR a partir de PT.
 * Executar: node scripts/build-horas-locales.mjs
 */
import { writeFileSync, readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const src = readFileSync(join(__dirname, '../src/lib/horasIguais.js'), 'utf8')

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

const HORAS_PT = extractObject('HORAS_PT')
const ESPELHOS_PT = extractObject('ESPELHOS_PT')

const REPL = {
  es: [
    ['Os Teus Anjos', 'Tus Ángeles'], ['Os Anjos da Guarda', 'Los Ángeles de la Guarda'],
    ['Anjo', 'Ángel'], ['Mestres Ascendidos', 'Maestros Ascendidos'],
    ['Doreen Virtue', 'Doreen Virtue'], ['tu ', 'tú '], ['te ', 'te '],
    ['És', 'Eres'], ['és', 'eres'], ['Estás', 'Estás'], ['estás', 'estás'],
    ['Confia', 'Confía'], ['confia', 'confía'], ['Mantém', 'Mantén'], ['mantém', 'mantén'],
    ['Respira', 'Respira'], ['Medita', 'Medita'], ['Agradece', 'Agradece'],
    ['Pergunta', 'Pregunta'], ['pergunta', 'pregunta'], ['Escreve', 'Escribe'],
    ['Liberta', 'Libera'], ['liberta', 'libera'], ['Continua', 'Continúa'],
    ['Trabalha', 'Trabaja'], ['Antes de dormir', 'Antes de dormir'],
    ['Reinício Sagrado', 'Reinicio Sagrado'], ['Unidade', 'Unidad'],
    ['Foco mental', 'Enfoque mental'], ['portal da meia-noite', 'portal de medianoche'],
    ['despertar espiritual', 'despertar espiritual'], ['número mestre', 'número maestro'],
    ['às ', 'a las '], [' no ', ' en el '], [' na ', ' en la '], [' nos ', ' en los '],
    [' das ', ' de las '], [' dos ', ' de los '], [' do ', ' del '], [' da ', ' de la '],
    [' ao ', ' al '], [' à ', ' a la '], [' pelos ', ' por los '], [' pela ', ' por la '],
    ['quando', 'cuando'], ['onde', 'donde'], ['porque', 'porque'], ['também', 'también'],
    ['ainda', 'todavía'], ['agora', 'ahora'], ['hoje', 'hoy'], ['dia', 'día'],
    ['coração', 'corazón'], ['energia', 'energía'], ['missão', 'misión'],
    ['orientação', 'orientación'], ['bênção', 'bendición'], ['bênçãos', 'bendiciones'],
    ['preocupações', 'preocupaciones'], ['universo', 'universo'], ['anjo', 'ángel'],
    ['anjos', 'ángeles'], ['sincronia', 'sincronía'], ['sincronias', 'sincronías'],
    ['conselho', 'consejo'], ['mensagem', 'mensaje'], ['palavraChave', 'palavraChave'],
    ['titulo', 'titulo'], ['anjo', 'anjo'],
  ],
  it: [
    ['Os Teus Anjos', 'I Tuoi Angeli'], ['Os Anjos da Guarda', 'Gli Angeli Custodi'],
    ['Anjo', 'Angelo'], ['Mestres Ascendidos', 'Maestri Ascesi'],
    ['tu ', 'tu '], ['te ', 'ti '], ['És', 'Sei'], ['és', 'sei'],
    ['Confia', 'Confida'], ['Mantém', 'Mantieni'], ['Respira', 'Respira'],
    ['Agradece', 'Ringrazia'], ['Pergunta', 'Chiedi'], ['Escreve', 'Scrivi'],
    ['Liberta', 'Lascia andare'], ['Continua', 'Continua'], ['Trabalha', 'Lavora'],
    ['Reinício Sagrado', 'Riavvio Sacro'], ['Unidade', 'Unità'],
    ['Foco mental', 'Focus mentale'], ['coração', 'cuore'], ['energia', 'energia'],
    ['missão', 'missione'], ['orientação', 'guida'], ['bênção', 'benedizione'],
    ['anjo', 'angelo'], ['anjos', 'angeli'], ['conselho', 'consiglio'],
    ['mensagem', 'messaggio'], ['quando', 'quando'], ['onde', 'dove'],
    ['hoje', 'oggi'], ['dia', 'giorno'], ['universo', 'universo'],
  ],
  de: [
    ['Os Teus Anjos', 'Deine Engel'], ['Os Anjos da Guarda', 'Schutzengel'],
    ['Anjo', 'Engel'], ['Mestres Ascendidos', 'Aufgestiegene Meister'],
    ['tu ', 'du '], ['te ', 'dich '], ['És', 'Du bist'], ['Confia', 'Vertraue'],
    ['Mantém', 'Behalte'], ['Respira', 'Atme'], ['Agradece', 'Danke'],
    ['Pergunta', 'Frage'], ['Escreve', 'Schreibe'], ['Liberta', 'Lass los'],
    ['Reinício Sagrado', 'Heiliger Neuanfang'], ['Unidade', 'Einheit'],
    ['Foco mental', 'Mentaler Fokus'], ['coração', 'Herz'], ['energia', 'Energie'],
    ['missão', 'Mission'], ['anjo', 'Engel'], ['anjos', 'Engel'],
    ['conselho', 'Rat'], ['mensagem', 'Botschaft'], ['hoje', 'heute'],
    ['dia', 'Tag'], ['universo', 'Universum'], ['quando', 'wenn'], ['onde', 'wo'],
  ],
  fr: [
    ['Os Teus Anjos', 'Tes Anges'], ['Os Anjos da Guarda', 'Les Anges Gardiens'],
    ['Anjo', 'Ange'], ['Mestres Ascendidos', 'Maîtres Ascendus'],
    ['tu ', 'tu '], ['te ', 'te '], ['És', 'Tu es'], ['Confia', 'Fais confiance'],
    ['Mantém', 'Garde'], ['Respira', 'Respire'], ['Agradece', 'Remercie'],
    ['Pergunta', 'Demande'], ['Escreve', 'Écris'], ['Liberta', 'Libère'],
    ['Reinício Sagrado', 'Redémarrage Sacré'], ['Unidade', 'Unité'],
    ['Foco mental', 'Focus mental'], ['coração', 'cœur'], ['energia', 'énergie'],
    ['missão', 'mission'], ['anjo', 'ange'], ['anjos', 'anges'],
    ['conselho', 'conseil'], ['mensagem', 'message'], ['hoje', 'aujourd\'hui'],
    ['dia', 'jour'], ['universo', 'univers'], ['quando', 'quand'], ['onde', 'où'],
  ],
}

function translateText(text, lang) {
  let out = text
  for (const [from, to] of REPL[lang]) {
    out = out.split(from).join(to)
  }
  return out
}

function translatePack(pack, lang) {
  const out = {}
  for (const [k, v] of Object.entries(pack)) {
    if (!v) { out[k] = null; continue }
    out[k] = {}
    for (const [field, val] of Object.entries(v)) {
      out[k][field] = typeof val === 'string' ? translateText(val, lang) : val
    }
  }
  return out
}

const HORAS_ES = translatePack(HORAS_PT, 'es')
const HORAS_IT = translatePack(HORAS_PT, 'it')
const HORAS_DE = translatePack(HORAS_PT, 'de')
const HORAS_FR = translatePack(HORAS_PT, 'fr')
const ESPELHOS_ES = translatePack(ESPELHOS_PT, 'es')
const ESPELHOS_IT = translatePack(ESPELHOS_PT, 'it')
const ESPELHOS_DE = translatePack(ESPELHOS_PT, 'de')
const ESPELHOS_FR = translatePack(ESPELHOS_PT, 'fr')

const content = `/** Gerado por scripts/build-horas-locales.mjs */\n
export const HORAS_ES = ${JSON.stringify(HORAS_ES, null, 2)}
export const HORAS_IT = ${JSON.stringify(HORAS_IT, null, 2)}
export const HORAS_DE = ${JSON.stringify(HORAS_DE, null, 2)}
export const HORAS_FR = ${JSON.stringify(HORAS_FR, null, 2)}
export const ESPELHOS_ES = ${JSON.stringify(ESPELHOS_ES, null, 2)}
export const ESPELHOS_IT = ${JSON.stringify(ESPELHOS_IT, null, 2)}
export const ESPELHOS_DE = ${JSON.stringify(ESPELHOS_DE, null, 2)}
export const ESPELHOS_FR = ${JSON.stringify(ESPELHOS_FR, null, 2)}
`

writeFileSync(join(__dirname, '../src/lib/i18n/packs/horasLocales.js'), content, 'utf8')
console.log('horasLocales.js gerado')
