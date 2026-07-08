import pt from './i18n/pt.js'
import en from './i18n/en.js'
import es from './i18n/es.js'
import it from './i18n/it.js'
import de from './i18n/de.js'
import fr from './i18n/fr.js'
import { getMapaCopy } from './i18n/mapaCopy.js'
import { sanitizarTextoPdf } from './pdfTextWrap.js'

const LOCALES = { pt, en, es, it, de, fr }

function limpar(s) {
  return sanitizarTextoPdf(String(s ?? '').replace(/\s+/g, ' ').trim())
}

const TECHNICAL = {
  pt: { title: '>> DADOS TÉCNICOS', system: 'Sistema:', systemVal: 'Zodíaco tropical · Casas Placidus', ut: 'Data UT:', coords: 'Coordenadas:' },
  en: { title: '>> TECHNICAL DATA', system: 'System:', systemVal: 'Tropical zodiac · Placidus houses', ut: 'UT date:', coords: 'Coordinates:' },
  es: { title: '>> DATOS TÉCNICOS', system: 'Sistema:', systemVal: 'Zodíaco tropical · Casas Placidus', ut: 'Fecha UT:', coords: 'Coordenadas:' },
  it: { title: '>> DATI TECNICI', system: 'Sistema:', systemVal: 'Zodiaco tropicale · Case Placidus', ut: 'Data UT:', coords: 'Coordinate:' },
  de: { title: '>> TECHNISCHE DATEN', system: 'System:', systemVal: 'Tropischer Zodiac · Placidus-Häuser', ut: 'UT-Datum:', coords: 'Koordinaten:' },
  fr: { title: '>> DONNÉES TECHNIQUES', system: 'Système :', systemVal: 'Zodiaque tropical · Maisons Placidus', ut: 'Date UT :', coords: 'Coordonnées :' },
}

export function getPdfLabels(lang = 'pt') {
  const code = LOCALES[lang] ? lang : 'en'
  const m = LOCALES[code].mapa || {}
  const copy = getMapaCopy(code)
  const tech = TECHNICAL[code] || TECHNICAL.en

  return {
    headerTitle: 'SIDUS',
    headerSubtitle: limpar(copy.pdfHeader?.replace(/^.*?-\s*/i, '') || 'MAPA ASTRAL NATAL COMPLETO'),
    headerTagline: limpar(m.proTagline),
    fourPillars: limpar(m.fourPillars),
    positions: limpar(m.positions),
    elements: limpar(m.elementBalance),
    technical: tech.title,
    technicalSystem: tech.system,
    technicalSystemVal: tech.systemVal,
    technicalUt: tech.ut,
    technicalCoords: tech.coords,
    mandala: limpar(m.mandalaTitle),
    pageLabel: code === 'pt' ? 'Pág.' : code === 'en' ? 'Page' : code === 'es' ? 'Pág.' : code === 'fr' ? 'P.' : code === 'de' ? 'S.' : 'Pag.',
    atTime: code === 'pt' ? 'às' : code === 'en' ? 'at' : code === 'es' ? 'a las' : code === 'fr' ? 'à' : code === 'de' ? 'um' : 'alle',
    labels: {
      sun: limpar(m.sunSign?.replace(/Signo\s/i, '') || 'Sol'),
      moon: limpar(m.moonSign?.replace(/Signo\s/i, '') || 'Lua'),
      asc: limpar(m.ascendant || 'Ascendente'),
      desc: limpar(m.descendant || 'Descendente'),
      mc: limpar(m.mc || 'Meio do Céu'),
    },
    fire: limpar((m.fire || 'Fogo').split('-')[0]),
    earth: limpar((m.earth || 'Terra').split('-')[0]),
    air: limpar((m.air || 'Ar').split('-')[0]),
    water: limpar((m.water || 'Agua').split('-')[0]),
  }
}
