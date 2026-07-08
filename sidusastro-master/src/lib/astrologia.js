import { Body, Ecliptic, GeoVector, MakeTime } from 'astronomy-engine'

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

function ajustarDataUTC(ano, mes, dia, horasUTC) {
  let y = ano
  let m = mes
  let d = dia
  let h = horasUTC

  while (h < 0) {
    h += 24
    d -= 1
    if (d < 1) {
      m -= 1
      if (m < 1) { m = 12; y -= 1 }
      d = new Date(y, m, 0).getDate()
    }
  }
  while (h >= 24) {
    h -= 24
    d += 1
    const diasMes = new Date(y, m, 0).getDate()
    if (d > diasMes) { d = 1; m += 1; if (m > 12) { m = 1; y += 1 } }
  }

  return { y, m, d, h }
}

/** Converte hora local no local de nascimento para AstroTime (UTC via longitude) */
function criarAstroTime(dataISO, horaHHMM, longitude) {
  const [ano, mes, dia] = dataISO.split('-').map(Number)
  const [h, min] = horaHHMM.split(':').map(Number)
  const horaLocal = h + min / 60
  const horaUTC = horaLocal - longitude / 15
  const { y, m, d, h: hu } = ajustarDataUTC(ano, mes, dia, horaUTC)
  const minutos = Math.round((hu % 1) * 60)
  const horasInt = Math.floor(hu)

  return MakeTime(new Date(Date.UTC(y, m - 1, d, horasInt, minutos, 0)))
}

function longitudeEcliptica(corpo, time) {
  const vetor = GeoVector(corpo, time, true)
  return Ecliptic(vetor).elon
}

function calcularAscendente(time, latitude, longitude) {
  const jd = time.ut + 2451545.0
  const T = (jd - 2451545.0) / 36525
  let gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T
  gmst = ((gmst % 360) + 360) % 360
  const lst = (gmst + longitude) % 360
  const lstRad = (lst * Math.PI) / 180
  const latRad = (latitude * Math.PI) / 180
  const obliquity = ((23.439291 - 0.0130042 * T) * Math.PI) / 180

  const y = Math.cos(lstRad)
  const x = -(Math.sin(lstRad) * Math.cos(obliquity) + Math.tan(latRad) * Math.sin(obliquity))
  let asc = (Math.atan2(y, x) * 180) / Math.PI
  if (asc < 0) asc += 360
  return asc
}

export function calcularMapaNatal({ data, hora, localizacao }) {
  if (!data || !hora || !localizacao) return null

  const { lat, lon } = localizacao
  const time = criarAstroTime(data, hora, lon)

  const lonSol = longitudeEcliptica(Body.Sun, time)
  const lonLua = longitudeEcliptica(Body.Moon, time)
  const lonAsc = calcularAscendente(time, lat, lon)

  const solar = longitudeParaSigno(lonSol)
  const lunar = longitudeParaSigno(lonLua)
  const ascendente = longitudeParaSigno(lonAsc)

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
