/**
 * Cálculo de instante de nascimento e dias de vida (biorritmo, ferramentas).
 */

export function normalizarDataISO(raw) {
  if (!raw) return null
  const s = String(raw).trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s
  const isoSlash = s.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/)
  if (isoSlash) {
    const [, d, m, y] = isoSlash
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
  }
  const isoRev = s.match(/^(\d{4})[/.-](\d{1,2})[/.-](\d{1,2})$/)
  if (isoRev) {
    const [, y, m, d] = isoRev
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
  }
  return null
}

function parseDataPartes(dataISO) {
  const norm = normalizarDataISO(dataISO)
  if (!norm) return null
  const [ano, mes, dia] = norm.split('-').map(Number)
  if (!ano || !mes || !dia) return null
  return { ano, mes, dia }
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
    if (d > diasMes) {
      d = 1
      m += 1
      if (m > 12) { m = 1; y += 1 }
    }
  }

  return { y, m, d, h }
}

/** Converte hora local IANA → Date UTC (DST histórico). */
export function localToUTC(ianaTimezone, year, month, day, hour, minute) {
  let utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute, 0))
  for (let i = 0; i < 6; i++) {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: ianaTimezone,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false,
    }).formatToParts(utcGuess)
    const get = (t) => parts.find((p) => p.type === t)?.value
    const localStr = `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}:${get('second')}`
    const localAsUTC = new Date(
      Date.UTC(+get('year'), +get('month') - 1, +get('day'), +get('hour'), +get('minute'), +get('second'))
    )
    if (get('hour') === '24') localAsUTC.setUTCDate(localAsUTC.getUTCDate() + 1)
    const diff = new Date(localStr + 'Z') - localAsUTC
    if (Math.abs(diff) < 30000) break
    utcGuess = new Date(utcGuess.getTime() + diff)
  }
  return utcGuess
}

export function criarDataUTCporLocal(dataISO, horaHHMM, fuso) {
  const partes = parseDataPartes(dataISO)
  if (!partes) return null
  const { ano, mes, dia } = partes
  const [h, min] = (horaHHMM || '12:00').split(':').map(Number)

  if (typeof fuso === 'string' && fuso.includes('/')) {
    return localToUTC(fuso, ano, mes, dia, h, min)
  }

  const offset = Number(fuso) || 0
  const horaLocal = h + min / 60
  const horaUTC = horaLocal - offset
  const { y, m, d, h: hu } = ajustarDataUTC(ano, mes, dia, horaUTC)
  const minutos = Math.round((hu % 1) * 60)
  const horasInt = Math.floor(hu)
  return new Date(Date.UTC(y, m - 1, d, horasInt, minutos, 0))
}

/**
 * Milissegundos UTC do instante de nascimento a partir dos dados do perfil.
 */
export function instanteNascimentoMs(dados) {
  const dataISO = normalizarDataISO(dados?.data)
  if (!dataISO) return null
  const date = criarDataUTCporLocal(dataISO, dados?.hora || '12:00', dados?.fuso ?? 0)
  return date?.getTime() ?? null
}

/** Dias de vida com precisão fraccional (efemérides / biorritmo). */
export function diasVidaDesdeNascimento(dados) {
  const birthMs = instanteNascimentoMs(dados)
  if (birthMs == null) return null
  return (Date.now() - birthMs) / 86400000
}
