/** Chamadas IA via Netlify Functions - chaves secretas só no servidor. */
import { looksPortuguese } from './i18n/langUtil.js'

function sonhosRespostaValida(data, lang) {
  if (!data?.seccoes?.length) return false
  if (!data.seccoes.some((s) => s?.texto?.length > 15)) return false
  const texto = data.seccoes.map((s) => s.texto).join(' ')
  if (lang !== 'pt' && looksPortuguese(texto)) return false
  return true
}

async function postJson(path, body, idToken = null, timeoutMs = 60000) {
  const headers = { 'Content-Type': 'application/json' }
  if (idToken) headers.Authorization = `Bearer ${idToken}`
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(path, {
      method: 'POST',
      headers,
      body: JSON.stringify({ ...body, idToken }),
      signal: controller.signal,
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      return { ok: false, status: res.status, ...data }
    }
    return { ok: true, ...data }
  } catch {
    return { ok: false, status: 0 }
  } finally {
    clearTimeout(timer)
  }
}

export async function consultarOracleServidor(pergunta, mapaNatal, historico, lang, idToken, clientPremium = false) {
  try {
    const data = await postJson('/api/oracle-chat', {
      pergunta,
      mapaNatal,
      historico,
      lang,
      clientPremium,
    }, idToken)
    if (data.auth || (!data.ok && data.status === 401)) {
      return { auth: true, resposta: null }
    }
    if (data.limite) return { limite: true, usadas: data.usadas, max: data.max, resposta: null }
    if (!data.ok && data.status === 402) return { limite: true, usadas: data.usadas, max: data.max, resposta: null }
    if (!data.ok) return { resposta: null, servidor: true }
    return {
      resposta: data.resposta || null,
      usadas: data.usadas,
      max: data.max,
      isPremium: data.isPremium,
      recusado: data.recusado === true,
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
    }, null, 45000)
    if (!data?.ok && data?.status && data.status !== 200) return null
    if (!sonhosRespostaValida(data, lang)) return null
    return {
      seccoes: data.seccoes,
      simbolos: data.simbolos || [],
      fonte: data.fonte || 'ia',
    }
  } catch {
    return null
  }
}

export async function interpretarMapaServidor(payload, idToken) {
  try {
    const data = await postJson('/api/interpret-mapa', { ...payload, idToken }, idToken)
    if (data.auth || (!data.ok && data.status === 401)) {
      return { auth: true, seccoes: null }
    }
    if (data.locked || (!data.ok && data.status === 402)) {
      return { locked: true, seccoes: null }
    }
    if (!data.ok || !data.seccoes?.length) return { seccoes: null, servidor: true }
    return {
      seccoes: data.seccoes,
      textoPlano: data.textoPlano,
      fonte: data.fonte || 'ia',
      chave: data.chave,
      cached: data.cached === true,
    }
  } catch {
    return { seccoes: null }
  }
}
