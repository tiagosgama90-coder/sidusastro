/** Resumo do céu actual — Sol, Lua, fase lunar e planetas (astronomy-engine). */
import { Body, Ecliptic, GeoVector, MakeTime } from 'astronomy-engine'
import { longitudeParaSigno } from './astrologia.js'
import { calcularFaseLua } from './faseLua.js'

const PLANETAS_LANDING = [
  { key: 'mercurio', nome: 'Mercúrio', corpo: Body.Mercury, simbolo: '☿' },
  { key: 'venus', nome: 'Vénus', corpo: Body.Venus, simbolo: '♀' },
  { key: 'jupiter', nome: 'Júpiter', corpo: Body.Jupiter, simbolo: '♃' },
  { key: 'saturno', nome: 'Saturno', corpo: Body.Saturn, simbolo: '♄' },
]

function position(corpo, time) {
  return GeoVector(corpo, time, true)
}

function signoParaCorpo(corpo, time) {
  return longitudeParaSigno(Ecliptic(position(corpo, time)).elon)
}

export function calcularResumoCeuAgora(date = new Date(), lang = 'pt') {
  const faseLua = calcularFaseLua(date, lang)
  const time = MakeTime(date)
  const sol = signoParaCorpo(Body.Sun, time)
  const lua = signoParaCorpo(Body.Moon, time)
  const planetas = PLANETAS_LANDING.map((p) => ({
    ...p,
    signo: signoParaCorpo(p.corpo, time),
  }))
  return { faseLua, sol, lua, planetas }
}
