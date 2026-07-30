import { Body, Ecliptic, GeoVector, MakeTime } from 'astronomy-engine'
import { criarDataUTCporLocal } from './datetime.js'
import { calcularAngulosCasasMeeus } from './natalHouses.js'

export const SIGNOS = [
  { nome: 'Carneiro', simbolo: '♈', elemento: 'Fogo' },
  { nome: 'Touro', simbolo: '♉', elemento: 'Terra' },
  { nome: 'Gémeos', simbolo: '♊', elemento: 'Ar' },
  { nome: 'Caranguejo', simbolo: '♋', elemento: 'Água' },
  { nome: 'Leão', simbolo: '♌', elemento: 'Fogo' },
  { nome: 'Virgem', simbolo: '♍', elemento: 'Terra' },
  { nome: 'Balança', simbolo: '♎', elemento: 'Ar' },
  { nome: 'Escorpião', simbolo: '♏', elemento: 'Água' },
  { nome: 'Sagitário', simbolo: '♐', elemento: 'Fogo' },
  { nome: 'Capricórnio', simbolo: '♑', elemento: 'Terra' },
  { nome: 'Aquário', simbolo: '♒', elemento: 'Ar' },
  { nome: 'Peixes', simbolo: '♓', elemento: 'Água' },
]

const TRACOS = {
  Carneiro: 'coragem, iniciativa e espírito pioneiro',
  Touro: 'estabilidade, sensualidade e determinação',
  Gémeos: 'curiosidade, comunicação e versatilidade',
  Caranguejo: 'intuição, proteção e profundidade emocional',
  Leão: 'criatividade, magnetismo e liderança',
  Virgem: 'precisão, serviço e discernimento',
  Balança: 'harmonia, diplomacia e senso estético',
  Escorpião: 'intensidade, transformação e poder interior',
  Sagitário: 'expansão, filosofia e aventura',
  Capricórnio: 'ambição, disciplina e estrutura',
  Aquário: 'originalidade, visão e independência',
  Peixes: 'compaixão, imaginação e sensibilidade espiritual',
}

/** Limites tropicais do signo solar (mês/dia inclusive) */
export function calcularSignoSolarPorData(dataISO) {
  const [, mes, dia] = dataISO.split('-').map(Number)
  const md = mes * 100 + dia

  if (md >= 321 && md <= 419) return { ...SIGNOS[0], fonte: 'data' }
  if (md >= 420 && md <= 520) return { ...SIGNOS[1], fonte: 'data' }
  if (md >= 521 && md <= 620) return { ...SIGNOS[2], fonte: 'data' }
  if (md >= 621 && md <= 722) return { ...SIGNOS[3], fonte: 'data' }
  if (md >= 723 && md <= 822) return { ...SIGNOS[4], fonte: 'data' }
  if (md >= 823 && md <= 922) return { ...SIGNOS[5], fonte: 'data' }
  if (md >= 923 && md <= 1022) return { ...SIGNOS[6], fonte: 'data' }
  if (md >= 1023 && md <= 1121) return { ...SIGNOS[7], fonte: 'data' }
  if (md >= 1122 && md <= 1221) return { ...SIGNOS[8], fonte: 'data' }
  if (md >= 1222 || md <= 119) return { ...SIGNOS[9], fonte: 'data' }
  if (md >= 120 && md <= 218) return { ...SIGNOS[10], fonte: 'data' }
  return { ...SIGNOS[11], fonte: 'data' }
}

export function longitudeParaSigno(longitude) {
  const normalizada = ((longitude % 360) + 360) % 360
  const indice = Math.floor(normalizada / 30) % 12
  return { ...SIGNOS[indice], graus: normalizada % 30 }
}

function longitudeEcliptica(corpo, time) {
  const vetor = GeoVector(corpo, time, true)
  return Ecliptic(vetor).elon
}

export function calcularMapaNatal({ data, hora, localizacao, fuso }) {
  if (!data || !hora || !localizacao) return null
  if (fuso == null || fuso === '') return null

  const { lat, lon } = localizacao
  const dataUTC = criarDataUTCporLocal(data, hora, fuso)
  if (!dataUTC) return null
  const time = MakeTime(dataUTC)

  const lonSol = longitudeEcliptica(Body.Sun, time)
  const lonLua = longitudeEcliptica(Body.Moon, time)

  const angulos = calcularAngulosCasasMeeus(dataUTC, lat, lon)
  if (!angulos) return null

  const solar = longitudeParaSigno(lonSol)
  const lunar = longitudeParaSigno(lonLua)
  const ascendente = longitudeParaSigno(angulos.ascendant)

  const solarData = calcularSignoSolarPorData(data)

  return {
    solar: {
      ...solar,
      fonte: 'efemérides',
      descricao: `Essência e identidade - ${TRACOS[solar.nome]}`,
    },
    lunar: {
      ...lunar,
      fonte: 'efemérides',
      descricao: `Emoções e instinto - ${TRACOS[lunar.nome]}`,
    },
    ascendente: {
      ...ascendente,
      fonte: 'efemérides',
      descricao: `Máscara social e primeira impressão - ${TRACOS[ascendente.nome]}`,
    },
    solarReferencia: solarData,
    coordenadas: { lat, lon },
    calculadoEm: new Date().toISOString(),
  }
}

export function formatarDataNascimento(dataISO) {
  if (!dataISO) return ''
  const [ano, mes, dia] = dataISO.split('-')
  const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
  return `${parseInt(dia, 10)} ${meses[parseInt(mes, 10) - 1]} ${ano}`
}
