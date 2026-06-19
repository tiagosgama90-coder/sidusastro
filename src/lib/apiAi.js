/** Chamadas IA via Netlify Functions — chaves secretas só no servidor. */

async function postJson(path, body, idToken = null) {
  const headers = { 'Content-Type': 'application/json' }
  if (idToken) headers.Authorization = `Bearer ${idToken}`
  const res = await fetch(path, {
    method: 'POST',
    headers,
    body: JSON.stringify({ ...body, idToken }),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    return { ok: false, status: res.status, ...data }
  }
  const data = await res.json()
  return { ok: true, ...data }
}

export async function consultarOracleServidor(pergunta, mapaNatal, historico, lang, idToken) {
  try {
    const data = await postJson('/api/oracle-chat', {
      pergunta,
      mapaNatal,
      historico,
      lang,
    }, idToken)
    if (data.auth || (!data.ok && data.status === 401)) {
      return { auth: true, resposta: null }
    }
    if (data.limite) return { limite: true, usadas: data.usadas, max: data.max, resposta: null }
    if (!data.ok && data.status === 402) return { limite: true, usadas: data.usadas, max: data.max, resposta: null }
    return {
      resposta: data.resposta || null,
      usadas: data.usadas,
      max: data.max,
      isPremium: data.isPremium,
    }
  } catch {
    return { resposta: null }
  }
}

export async function interpretarSonhoServidor(texto, mapaNatal, lang, feeling, chips) {
  try {
    const data = await postJson('/api/interpret-sonho', {
      texto,
      mapaNatal,
      lang,
      feeling,
      chips,
    })
    if (!data?.seccoes) return null
    return { seccoes: data.seccoes, simbolos: data.simbolos || [] }
  } catch {
    return null
  }
}
