/**
 * Verificação do ascendente — 29/01/1988 10:45 Europe/Lisbon, Caldas da Rainha.
 * Esperado: Carneiro (Áries) ~17°
 */
import { calcularAscendenteEMc } from '../src/lib/ascendente.js'
import { localToUTC } from '../src/lib/datetime.js'

const SIGNOS = ['Carneiro', 'Touro', 'Gémeos', 'Caranguejo', 'Leão', 'Virgem', 'Balança', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes']

function signo(lon) {
  const n = ((lon % 360) + 360) % 360
  return `${SIGNOS[Math.floor(n / 30)]} ${(n % 30).toFixed(1)}°`
}

const lat = 39.403
const lon = -9.138
const dataUTC = localToUTC('Europe/Lisbon', 1988, 1, 29, 10, 45)
const { asc, mc } = calcularAscendenteEMc(dataUTC, lat, lon)

console.log('Data UTC:', dataUTC.toISOString())
console.log('Ascendente:', asc.toFixed(2), '→', signo(asc))
console.log('MC:', mc.toFixed(2), '→', signo(mc))

const idx = Math.floor(((asc % 360) + 360) % 360 / 30)
if (SIGNOS[idx] !== 'Carneiro') {
  console.error('FALHOU: esperado Carneiro, obtido', SIGNOS[idx])
  process.exit(1)
}
console.log('OK — ascendente Carneiro confirmado (Meeus)')
