/** Chamadas IA via Netlify Functions — chaves secretas só no servidor. */

async function postJson(path, body) {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) return null
  return res.json()
}

export async function consultarOracleServidor(pergunta, mapaNatal, historico, lang, isPremium) {
  try {
    const data = await postJson('/api/oracle-chat', {
      pergunta,
      mapaNatal,
      historico,
      lang,
      isPremium,
    })
    return data?.resposta || null
  } catch {
    return null
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
