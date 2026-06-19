/**
 * Resolve nome, data e hora para ferramentas (numerologia, fluxo vital, etc.)
 * Usa perfil, utilizador Firebase e mapa natal como fontes alternativas.
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

function dataFromInstanteUTC(iso) {
  if (!iso) return null
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return null
    const y = d.getUTCFullYear()
    const m = String(d.getUTCMonth() + 1).padStart(2, '0')
    const day = String(d.getUTCDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  } catch {
    return null
  }
}

function horaFromInstanteUTC(iso, fuso = 0) {
  if (!iso) return null
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return null
    const f = typeof fuso === 'number' ? fuso : 0
    const totalMin = d.getUTCHours() * 60 + d.getUTCMinutes() + Math.round(f * 60)
    const norm = ((totalMin % 1440) + 1440) % 1440
    const h = Math.floor(norm / 60)
    const min = norm % 60
    return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`
  } catch {
    return null
  }
}

export function resolverDadosFerramentas(dados, utilizador, mapaNatal) {
  const d = dados || {}
  const data =
    normalizarDataISO(d.data || d.dataNascimento || d.birthDate)
    || dataFromInstanteUTC(mapaNatal?.instanteUTC)
  const hora =
    d.hora || d.horaNascimento
    || horaFromInstanteUTC(mapaNatal?.instanteUTC, mapaNatal?.fuso ?? d.fuso)
    || '12:00'
  const nome = (
    d.nome?.trim()
    || utilizador?.displayName?.trim()
    || utilizador?.email?.split('@')[0]
    || ''
  ).trim()

  return {
    nome,
    data,
    hora,
    fuso: d.fuso ?? mapaNatal?.fuso ?? 0,
    cidade: d.cidade || '',
    localizacao: d.localizacao || null,
  }
}

export function dadosMinimosFerramentas(resolvido) {
  return Boolean(resolvido?.data)
}

export function dadosNumerologiaProntos(resolvido) {
  return Boolean(resolvido?.nome && resolvido?.data)
}
