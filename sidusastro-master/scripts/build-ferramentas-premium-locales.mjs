/**
 * Gera packs ferramentasPremium ES/IT/DE/FR a partir de EN (sem vazamentos PT).
 * Executar: node scripts/build-ferramentas-premium-locales.mjs
 */
import { writeFileSync, readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const src = readFileSync(join(__dirname, '../src/lib/i18n/ferramentasPremiumData.js'), 'utf8')

function extractArray(name) {
  const start = src.indexOf(`const ${name} = [`)
  if (start < 0) throw new Error(`Missing ${name}`)
  let depth = 0
  let i = src.indexOf('[', start)
  const begin = i
  for (; i < src.length; i++) {
    if (src[i] === '[') depth++
    else if (src[i] === ']') {
      depth--
      if (depth === 0) return Function(`"use strict"; return (${src.slice(begin, i + 1)})`)()
    }
  }
  throw new Error(`Unclosed ${name}`)
}

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
      if (depth === 0) return Function(`"use strict"; return (${src.slice(begin, i + 1)})`)()
    }
  }
  throw new Error(`Unclosed ${name}`)
}

const TRANSITOS_EN = extractArray('TRANSITOS_EN')
const IMPACTO_EN = extractObject('IMPACTO_EN')
const COMPAT_EN = extractObject('COMPAT_EN')
const ASPECTOS_EN = extractArray('ASPECTOS_EN')

const REPL = {
  es: [
    ['January', 'Enero'], ['February', 'Febrero'], ['March', 'Marzo'], ['April', 'Abril'],
    ['May', 'Mayo'], ['June', 'Junio'], ['July', 'Julio'], ['August', 'Agosto'],
    ['September', 'Septiembre'], ['October', 'Octubre'], ['November', 'Noviembre'], ['December', 'Diciembre'],
    ['Saturn', 'Saturno'], ['Venus', 'Venus'], ['Mars', 'Marte'], ['Jupiter', 'Júpiter'],
    ['Mercury', 'Mercurio'], ['Sun', 'Sol'], ['New Moon', 'Luna Nueva'],
    ['Cancer', 'Cáncer'], ['Gemini', 'Géminos'], ['Taurus', 'Tauro'], ['Leo', 'Leo'],
    ['Pisces', 'Piscis'], ['Scorpio', 'Escorpio'], ['Sagittarius', 'Sagitario'], ['Capricorn', 'Capricornio'],
    ['Aries', 'Aries'],
    ['high', 'alto'], ['medium', 'medio'], ['low', 'bajo'], ['caution', 'atención'],
    ['intense', 'intenso'], ['transformative', 'transformador'], ['challenge', 'desafío'],
    ['standard', 'estándar'], ['optimism', 'optimismo'],
    ['Fire', 'Fuego'], ['Earth', 'Tierra'], ['Air', 'Aire'], ['Water', 'Agua'],
    ['Passionate', 'Apasionada'], ['Magical combination', 'Combinación mágica'],
    ['Creative tension', 'Tensión creativa'], ['Intense and transformative', 'Intensa y transformadora'],
    ['Solidity and mutual trust', 'Solidez y confianza mutua'], ['Deep mutual nourishment', 'Nutrición mutua profunda'],
    ['Complementary differences', 'Diferencias complementarias'], ['Constant intellectual stimulation', 'Estímulo intelectual constante'],
    ['Creativity and emotion together', 'Creatividad y emoción juntas'], ['Oceanic emotional depth', 'Profundidad emocional oceánica'],
    ['conjunction', 'conjunción'], ['trine', 'trígono'], ['sextile', 'sextil'],
    ['ingresso', 'ingresso'], ['trânsito', 'tránsito'], ['retrógrado', 'retrógrado'],
    ['sazonalidade', 'sazonalidad'], ['eclipse', 'eclipse'], ['quadratura', 'cuadratura'],
    ['begins', 'inicia'], ['expands', 'expande'], ['enters', 'entra'], ['activates', 'activa'],
    ['Retrograde', 'Retrógrado'], ['Solar Eclipse', 'Eclipse Solar'], ['season', 'temporada'],
    ['your', 'tu'], ['You', 'Tú'], ['you', 'tú'], ['Time to', 'Momento de'], ['Excellent for', 'Excelente para'],
    ['Ideal time', 'Momento ideal'], ['Great for', 'Óptimo para'], ['Watch', 'Cuidado con'],
    ['Release what', 'Libera lo que'], ['End the year', 'Termina el año'],
  ],
  it: [
    ['January', 'Gennaio'], ['February', 'Febbraio'], ['March', 'Marzo'], ['April', 'Aprile'],
    ['May', 'Maggio'], ['June', 'Giugno'], ['July', 'Luglio'], ['August', 'Agosto'],
    ['September', 'Settembre'], ['October', 'Ottobre'], ['November', 'Novembre'], ['December', 'Dicembre'],
    ['Saturn', 'Saturno'], ['Venus', 'Venere'], ['Mars', 'Marte'], ['Jupiter', 'Giove'],
    ['Mercury', 'Mercurio'], ['Sun', 'Sole'], ['New Moon', 'Luna Nuova'],
    ['Cancer', 'Cancro'], ['Gemini', 'Gemelli'], ['Taurus', 'Toro'], ['Leo', 'Leone'],
    ['Pisces', 'Pesci'], ['Scorpio', 'Scorpione'], ['Sagittarius', 'Sagittario'], ['Capricorn', 'Capricorno'],
    ['Aries', 'Ariete'],
    ['high', 'alto'], ['medium', 'medio'], ['low', 'basso'], ['caution', 'attenzione'],
    ['intense', 'intenso'], ['transformative', 'trasformativo'], ['challenge', 'sfida'],
    ['standard', 'standard'], ['optimism', 'ottimismo'],
    ['Fire', 'Fuoco'], ['Earth', 'Terra'], ['Air', 'Aria'], ['Water', 'Acqua'],
    ['conjunction', 'congiunzione'], ['trine', 'trigono'], ['sextile', 'sestile'],
    ['ingresso', 'ingresso'], ['trânsito', 'transito'], ['retrógrado', 'retrogrado'],
    ['sazonalidade', 'stagionalità'], ['eclipse', 'eclissi'], ['quadratura', 'quadratura'],
  ],
  de: [
    ['January', 'Januar'], ['February', 'Februar'], ['March', 'März'], ['April', 'April'],
    ['May', 'Mai'], ['June', 'Juni'], ['July', 'Juli'], ['August', 'August'],
    ['September', 'September'], ['October', 'Oktober'], ['November', 'November'], ['December', 'Dezember'],
    ['Saturn', 'Saturn'], ['Venus', 'Venus'], ['Mars', 'Mars'], ['Jupiter', 'Jupiter'],
    ['Mercury', 'Merkur'], ['Sun', 'Sonne'], ['New Moon', 'Neumond'],
    ['Cancer', 'Krebs'], ['Gemini', 'Zwillinge'], ['Taurus', 'Stier'], ['Leo', 'Löwe'],
    ['Pisces', 'Fische'], ['Scorpio', 'Skorpion'], ['Sagittarius', 'Schütze'], ['Capricorn', 'Steinbock'],
    ['Aries', 'Widder'],
    ['high', 'hoch'], ['medium', 'mittel'], ['low', 'niedrig'], ['caution', 'Achtung'],
    ['intense', 'intensiv'], ['transformative', 'transformativ'], ['challenge', 'Herausforderung'],
    ['standard', 'Standard'], ['optimism', 'Optimismus'],
    ['Fire', 'Feuer'], ['Earth', 'Erde'], ['Air', 'Luft'], ['Water', 'Wasser'],
    ['conjunction', 'Konjunktion'], ['trine', 'Trigon'], ['sextile', 'Sextil'],
    ['ingresso', 'Ingress'], ['trânsito', 'Transit'], ['retrógrado', 'rückläufig'],
    ['sazonalidade', 'Jahreszeit'], ['eclipse', 'Finsternis'], ['quadratura', 'Quadrat'],
  ],
  fr: [
    ['January', 'Janvier'], ['February', 'Février'], ['March', 'Mars'], ['April', 'Avril'],
    ['May', 'Mai'], ['June', 'Juin'], ['July', 'Juillet'], ['August', 'Août'],
    ['September', 'Septembre'], ['October', 'Octobre'], ['November', 'Novembre'], ['December', 'Décembre'],
    ['Saturn', 'Saturne'], ['Venus', 'Vénus'], ['Mars', 'Mars'], ['Jupiter', 'Jupiter'],
    ['Mercury', 'Mercure'], ['Sun', 'Soleil'], ['New Moon', 'Nouvelle Lune'],
    ['Cancer', 'Cancer'], ['Gemini', 'Gémeaux'], ['Taurus', 'Taureau'], ['Leo', 'Lion'],
    ['Pisces', 'Poissons'], ['Scorpio', 'Scorpion'], ['Sagittarius', 'Sagittaire'], ['Capricorn', 'Capricorne'],
    ['Aries', 'Bélier'],
    ['high', 'élevé'], ['medium', 'moyen'], ['low', 'faible'], ['caution', 'attention'],
    ['intense', 'intense'], ['transformative', 'transformateur'], ['challenge', 'défi'],
    ['standard', 'standard'], ['optimism', 'optimisme'],
    ['Fire', 'Feu'], ['Earth', 'Terre'], ['Air', 'Air'], ['Water', 'Eau'],
    ['conjunction', 'conjonction'], ['trine', 'trigone'], ['sextile', 'sextile'],
    ['ingresso', 'entrée'], ['trânsito', 'transit'], ['retrógrado', 'rétrograde'],
    ['sazonalidade', 'saison'], ['eclipse', 'éclipse'], ['quadratura', 'carré'],
  ],
}

function looksPortuguese(str) {
  if (!str || typeof str !== 'string' || str.length < 8) return false
  if (/[ãõç]/i.test(str)) return true
  return /\b(não|nao|tens|estás|o teu|a tua|partilhas|reflecte|consciência|cármico|relacionamento)\b/i.test(str)
}

function deepTranslate(val, lang) {
  if (typeof val === 'string') {
    let s = val
    for (const [a, b] of REPL[lang]) s = s.split(a).join(b)
    return s
  }
  if (Array.isArray(val)) return val.map((x) => deepTranslate(x, lang))
  if (val && typeof val === 'object') {
    const o = {}
    for (const [k, v] of Object.entries(val)) o[k] = deepTranslate(v, lang)
    return o
  }
  return val
}

function packForLang(lang) {
  const translated = {
    transitos: deepTranslate(TRANSITOS_EN, lang),
    impacto: deepTranslate(IMPACTO_EN, lang),
    compat: deepTranslate(COMPAT_EN, lang),
    aspectos: deepTranslate(ASPECTOS_EN, lang),
  }
  const sample = translated.transitos[0]?.desc || ''
  if (looksPortuguese(sample)) {
    return {
      transitos: TRANSITOS_EN,
      impacto: IMPACTO_EN,
      compat: COMPAT_EN,
      aspectos: ASPECTOS_EN,
    }
  }
  return translated
}

let out = `/** Gerado por scripts/build-ferramentas-premium-locales.mjs (fonte EN) */\nimport { contentForLang } from '../langUtil.js'\n\n`
for (const lang of ['es', 'it', 'de', 'fr']) {
  const p = packForLang(lang)
  out += `export const TRANSITOS_${lang.toUpperCase()} = ${JSON.stringify(p.transitos, null, 2)}\n\n`
  out += `export const IMPACTO_${lang.toUpperCase()} = ${JSON.stringify(p.impacto, null, 2)}\n\n`
  out += `export const COMPAT_${lang.toUpperCase()} = ${JSON.stringify(p.compat, null, 2)}\n\n`
  out += `export const ASPECTOS_${lang.toUpperCase()} = ${JSON.stringify(p.aspectos, null, 2)}\n\n`
}

writeFileSync(join(__dirname, '../src/lib/i18n/packs/ferramentasPremiumLocales.js'), out, 'utf8')
console.log('ferramentasPremiumLocales.js gerado (fonte EN)')
