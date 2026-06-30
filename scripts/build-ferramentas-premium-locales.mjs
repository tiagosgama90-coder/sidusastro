/**
 * Gera packs ferramentasPremium ES/IT/DE/FR a partir de PT.
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

const TRANSITOS_PT = extractArray('TRANSITOS_PT')
const IMPACTO_PT = extractObject('IMPACTO_PT')
const COMPAT_PT = extractObject('COMPAT_PT')
const ASPECTOS_PT = extractArray('ASPECTOS_PT')

const REPL = {
  es: [
    ['Janeiro', 'Enero'], ['Fevereiro', 'Febrero'], ['Março', 'Marzo'], ['Abril', 'Abril'],
    ['Maio', 'Mayo'], ['Junho', 'Junio'], ['Julho', 'Julio'], ['Agosto', 'Agosto'],
    ['Setembro', 'Septiembre'], ['Outubro', 'Octubre'], ['Novembro', 'Noviembre'], ['Dezembro', 'Diciembre'],
    ['Saturno', 'Saturno'], ['Vénus', 'Venus'], ['Marte', 'Marte'], ['Júpiter', 'Júpiter'],
    ['Mercúrio', 'Mercurio'], ['Sol', 'Sol'], ['Lua Nova', 'Luna Nueva'],
    ['Caranguejo', 'Cáncer'], ['Gémeos', 'Géminos'], ['Touro', 'Tauro'], ['Leão', 'Leo'],
    ['Peixes', 'Piscis'], ['Escorpião', 'Escorpio'], ['Sagitário', 'Sagitario'], ['Capricórnio', 'Capricornio'],
    ['Áries', 'Aries'], ['Carneiro', 'Aries'],
    ['alto', 'alto'], ['médio', 'medio'], ['baixo', 'bajo'], ['atenção', 'atención'],
    ['intenso', 'intenso'], ['transformador', 'transformador'], ['desafio', 'desafío'], ['padrão', 'estándar'], ['optimismo', 'optimismo'],
    ['Fogo', 'Fuego'], ['Terra', 'Tierra'], ['Ar', 'Aire'], ['Água', 'Agua'],
    ['Ligação', 'Conexión'], ['Combinação', 'Combinación'], ['Tensão', 'Tensión'], ['Intensa', 'Intensa'],
    ['Solidez', 'Solidez'], ['Nutrição', 'Nutrición'], ['Diferenças', 'Diferencias'], ['Estímulo', 'Estímulo'],
    ['Criatividade', 'Creatividad'], ['Profundidade', 'Profundidad'],
    ['Conjuncao', 'conjunción'], ['conjunção', 'conjunción'], ['trígono', 'trígono'], ['sextil', 'sextil'],
    ['Vénus', 'Venus'], ['Mercúrio', 'Mercurio'], ['Ascendente', 'Ascendente'],
    ['Partilham', 'Comparten'], ['ilumina', 'ilumina'], ['União', 'Unión'], ['Atracção', 'Atracción'],
    ['fluidez', 'fluidez'], ['Harmonia', 'Armonía'], ['Comunicação', 'Comunicación'],
    ['Momento', 'Momento'], ['período', 'período'], ['Temporada', 'Temporada'],
    ['inicia', 'inicia'], ['expande', 'expande'], ['entra', 'entra'], ['activa', 'activa'],
    ['retrógrado', 'retrógrado'], ['Retrógrado', 'Retrógrado'], ['Eclipse', 'Eclipse'],
  ],
  it: [
    ['Janeiro', 'Gennaio'], ['Fevereiro', 'Febbraio'], ['Março', 'Marzo'], ['Maio', 'Maggio'],
    ['Junho', 'Giugno'], ['Julho', 'Luglio'], ['Agosto', 'Agosto'], ['Setembro', 'Settembre'],
    ['Outubro', 'Ottobre'], ['Novembro', 'Novembre'], ['Dezembro', 'Dicembre'],
    ['Vénus', 'Venere'], ['Mercúrio', 'Mercurio'], ['Júpiter', 'Giove'], ['Lua Nova', 'Luna Nuova'],
    ['Caranguejo', 'Cancro'], ['Gémeos', 'Gemelli'], ['Touro', 'Toro'], ['Peixes', 'Pesci'],
    ['Escorpião', 'Scorpione'], ['Sagitário', 'Sagittario'], ['Capricórnio', 'Capricorno'],
    ['médio', 'medio'], ['atenção', 'attenzione'], ['padrão', 'standard'], ['optimismo', 'ottimismo'],
    ['Fogo', 'Fuoco'], ['Terra', 'Terra'], ['Ar', 'Aria'], ['Água', 'Acqua'],
    ['Conjuncao', 'congiunzione'], ['conjunção', 'congiunzione'],
  ],
  de: [
    ['Janeiro', 'Januar'], ['Fevereiro', 'Februar'], ['Março', 'März'], ['Maio', 'Mai'],
    ['Junho', 'Juni'], ['Julho', 'Juli'], ['Agosto', 'August'], ['Setembro', 'September'],
    ['Outubro', 'Oktober'], ['Novembro', 'November'], ['Dezembro', 'Dezember'],
    ['Saturno', 'Saturn'], ['Vénus', 'Venus'], ['Marte', 'Mars'], ['Júpiter', 'Jupiter'],
    ['Mercúrio', 'Merkur'], ['Sol', 'Sonne'], ['Lua Nova', 'Neumond'],
    ['Caranguejo', 'Krebs'], ['Gémeos', 'Zwillinge'], ['Touro', 'Stier'], ['Leão', 'Löwe'],
    ['Peixes', 'Fische'], ['Escorpião', 'Skorpion'], ['Sagitário', 'Schütze'], ['Capricórnio', 'Steinbock'],
    ['Carneiro', 'Widder'], ['Áries', 'Widder'],
    ['alto', 'hoch'], ['médio', 'mittel'], ['baixo', 'niedrig'], ['atenção', 'Achtung'],
    ['intenso', 'intensiv'], ['transformador', 'transformativ'], ['desafio', 'Herausforderung'],
    ['padrão', 'Standard'], ['optimismo', 'Optimismus'],
    ['Fogo', 'Feuer'], ['Terra', 'Erde'], ['Ar', 'Luft'], ['Água', 'Wasser'],
    ['Conjuncao', 'Konjunktion'], ['conjunção', 'Konjunktion'], ['trígono', 'Trigon'], ['sextil', 'Sextil'],
    ['Vénus', 'Venus'], ['Mercúrio', 'Merkur'], ['Ascendente', 'Aszendent'],
  ],
  fr: [
    ['Janeiro', 'Janvier'], ['Fevereiro', 'Février'], ['Março', 'Mars'], ['Maio', 'Mai'],
    ['Junho', 'Juin'], ['Julho', 'Juillet'], ['Agosto', 'Août'], ['Setembro', 'Septembre'],
    ['Outubro', 'Octobre'], ['Novembro', 'Novembre'], ['Dezembro', 'Décembre'],
    ['Saturno', 'Saturne'], ['Vénus', 'Vénus'], ['Marte', 'Mars'], ['Júpiter', 'Jupiter'],
    ['Mercúrio', 'Mercure'], ['Sol', 'Soleil'], ['Lua Nova', 'Nouvelle Lune'],
    ['Caranguejo', 'Cancer'], ['Gémeos', 'Gémeaux'], ['Touro', 'Taureau'], ['Leão', 'Lion'],
    ['Peixes', 'Poissons'], ['Escorpião', 'Scorpion'], ['Sagitário', 'Sagittaire'], ['Capricórnio', 'Capricorne'],
    ['Carneiro', 'Bélier'], ['Áries', 'Bélier'],
    ['alto', 'élevé'], ['médio', 'moyen'], ['baixo', 'faible'], ['atenção', 'attention'],
    ['intenso', 'intense'], ['transformador', 'transformateur'], ['desafio', 'défi'],
    ['padrão', 'standard'], ['optimismo', 'optimisme'],
    ['Fogo', 'Feu'], ['Terra', 'Terre'], ['Ar', 'Air'], ['Água', 'Eau'],
    ['Conjuncao', 'conjonction'], ['conjunção', 'conjonction'], ['trígono', 'trigone'], ['sextil', 'sextile'],
    ['Ascendente', 'Ascendant'],
  ],
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

let out = `/** Gerado por scripts/build-ferramentas-premium-locales.mjs */\nimport { contentForLang } from '../langUtil.js'\n\n`
for (const lang of ['es', 'it', 'de', 'fr']) {
  out += `export const TRANSITOS_${lang.toUpperCase()} = ${JSON.stringify(deepTranslate(TRANSITOS_PT, lang), null, 2)}\n\n`
  out += `export const IMPACTO_${lang.toUpperCase()} = ${JSON.stringify(deepTranslate(IMPACTO_PT, lang), null, 2)}\n\n`
  out += `export const COMPAT_${lang.toUpperCase()} = ${JSON.stringify(deepTranslate(COMPAT_PT, lang), null, 2)}\n\n`
  out += `export const ASPECTOS_${lang.toUpperCase()} = ${JSON.stringify(deepTranslate(ASPECTOS_PT, lang), null, 2)}\n\n`
}

writeFileSync(join(__dirname, '../src/lib/i18n/packs/ferramentasPremiumLocales.js'), out, 'utf8')
console.log('ferramentasPremiumLocales.js gerado')
