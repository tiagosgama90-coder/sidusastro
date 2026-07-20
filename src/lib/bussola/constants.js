import { Body } from 'astronomy-engine'

/** Planetas usados nos trânsitos mensais (efemérides reais). */
export const PLANETAS_TRANSITO = [
  { key: 'sol', nome: 'Sol', nomeEn: 'Sun', corpo: Body.Sun, sweId: 0, simbolo: '☉', peso: 2 },
  { key: 'mercurio', nome: 'Mercúrio', nomeEn: 'Mercury', corpo: Body.Mercury, sweId: 2, simbolo: '☿', peso: 3 },
  { key: 'venus', nome: 'Vénus', nomeEn: 'Venus', corpo: Body.Venus, sweId: 3, simbolo: '♀', peso: 3 },
  { key: 'marte', nome: 'Marte', nomeEn: 'Mars', corpo: Body.Mars, sweId: 4, simbolo: '♂', peso: 4 },
  { key: 'jupiter', nome: 'Júpiter', nomeEn: 'Jupiter', corpo: Body.Jupiter, sweId: 5, simbolo: '♃', peso: 5 },
  { key: 'saturno', nome: 'Saturno', nomeEn: 'Saturn', corpo: Body.Saturn, sweId: 6, simbolo: '♄', peso: 6 },
  { key: 'urano', nome: 'Urano', nomeEn: 'Uranus', corpo: Body.Uranus, sweId: 7, simbolo: '♅', peso: 7 },
  { key: 'netuno', nome: 'Neptuno', nomeEn: 'Neptune', corpo: Body.Neptune, sweId: 8, simbolo: '♆', peso: 7 },
  { key: 'plutao', nome: 'Plutão', nomeEn: 'Pluto', corpo: Body.Pluto, sweId: 9, simbolo: '♇', peso: 8 },
]

export const ASPECTOS = [
  { key: 'conjuncao', angulo: 0, orbe: 6 },
  { key: 'sextil', angulo: 60, orbe: 4 },
  { key: 'quadratura', angulo: 90, orbe: 5 },
  { key: 'trino', angulo: 120, orbe: 5 },
  { key: 'oposicao', angulo: 180, orbe: 6 },
]

export const ORBE_CUSPIDE = 3

export const MESES_BY_LANG = {
  pt: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  es: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  it: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
  de: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
  fr: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
}

export const TIPO_ICO = {
  conjuncao: '☌',
  sextil: '⚹',
  quadratura: '⊞',
  trino: '△',
  oposicao: '☍',
  eclipse: '🌑',
  eclipseSolar: '☀️',
  eclipseLunar: '🌕',
  retrogrado: '℞',
  ingresso: '🚪',
  trânsito: '→',
}

export const IMPACTO_COR = {
  alto: '#34D399',
  médio: '#60A5FA',
  baixo: '#9CA3AF',
  atenção: '#FBBf24',
  intenso: '#F87171',
  transformador: '#DFB76C',
  desafio: '#FB923C',
  padrão: '#9CA3AF',
  optimismo: '#34D399',
}
