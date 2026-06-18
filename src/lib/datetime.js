/**
 * Cálculo de instante de nascimento e dias de vida (biorritmo, ferramentas).
 */

function parseFusoNumerico(fuso) {
  if (typeof fuso === 'number' && !Number.isNaN(fuso)) return fuso
  if (typeof fuso === 'string' && fuso !== '' && !fuso.includes('/')) {
    const n = Number(fuso)
    return Number.isNaN(n) ? 0 : n
  }
  return 0
}

/**
 * Milissegundos UTC do instante de nascimento a partir dos dados do perfil.
 * Usa hora e fuso quando disponíveis; caso contrário meio-dia UTC.
 */
export function instanteNascimentoMs(dados) {
  if (!dados?.data) return null
  const [ano, mes, dia] = dados.data.split('-').map(Number)
  if (!ano || !mes || !dia) return null

  const hora = dados.hora || '12:00'
  const [h, min] = hora.split(':').map(Number)
  const fuso = parseFusoNumerico(dados.fuso)

  return Date.UTC(ano, mes - 1, dia, (h || 12) - fuso, min || 0, 0)
}

/** Dias de vida com precisão fraccional (efemérides / biorritmo). */
export function diasVidaDesdeNascimento(dados) {
  const birthMs = instanteNascimentoMs(dados)
  if (birthMs == null) return null
  return (Date.now() - birthMs) / 86400000
}
