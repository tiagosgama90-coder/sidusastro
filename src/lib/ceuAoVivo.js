/** Resumo do céu actual — Sol, Lua e fase lunar (astronomy-engine). */
import { Body, Ecliptic, GeoVector, MakeTime } from 'astronomy-engine'
import { longitudeParaSigno } from './astrologia.js'
import { calcularFaseLua } from './faseLua.js'

function position(corpo, time) {
  return GeoVector(corpo, time, true)
}

export function calcularResumoCeuAgora(date = new Date(), lang = 'pt') {
  const faseLua = calcularFaseLua(date, lang)
  const time = MakeTime(date)
  const solSigno = longitudeParaSigno(Ecliptic(position(Body.Sun, time)).elon)
  const luaSigno = longitudeParaSigno(Ecliptic(position(Body.Moon, time)).elon)
  return { faseLua, sol: solSigno, lua: luaSigno }
}
