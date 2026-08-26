import { env } from './env.mjs'
import { reforcoInstrucaoGeminiAstrologia } from '../../../src/lib/oracleAstrologiaGate.js'
import { reforcoInstrucaoSonhosIA } from '../../../src/lib/sonhosPrompt.js'

/**
 * Motor IA resiliente - desenhado para NUNCA bloquear o site.
 *
 * Estratégia anti-falhas:
 * 1. ONDAS PARALELAS: fornecedores da mesma prioridade correm em paralelo
 *    (latência = o mais rápido, não a soma dos lentos).
 * 2. CIRCUIT BREAKER: fornecedor que falha fica suspenso 5 minutos -
 *    os pedidos seguintes nem tentam, respondendo de imediato pelo próximo.
 * 3. FALLBACK LOCAL GARANTIDO: se toda a IA falhar, oracle-chat e
 *    interpret-sonho têm geradores locais que SEMPRE devolvem resposta.
 *
 * Diagnóstico em produção: GET /api/ai-status
 */

function groqKey() {
  return env('GROQ_API_KEY')
}

function geminiKey() {
  return env('GEMINI_API_KEY') || env('VITE_GEMINI_API_KEY')
}

function openRouterKey() {
  return env('OPENROUTER_API_KEY')
}

function openaiKey() {
  return env('OPENAI_API_KEY') || env('VITE_OPENAI_API_KEY')
}

function allowPaidOpenAI() {
  return env('ALLOW_PAID_OPENAI') === 'true'
}

// Modelos Groq activos (llama-3.3-70b-specdec foi desativado em 04/2025).
// Cadeia com fallback: se um modelo falhar (desativado/quota), tenta o seguinte.
const GROQ_MODELS = {
  free: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'],
  premium: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'],
}

// Modelos gratuitos OpenRouter verificados activos (lista antiga já removida).
const OPENROUTER_FREE = [
  'google/gemma-4-31b-it:free',
  'google/gemma-4-26b-a4b-it:free',
  'z-ai/glm-5.2:free',
  'minimax/minimax-m2.7:free',
]

// ── Circuit breaker ──────────────────────────────────────────────────────────
const COOLDOWN_MS = 5 * 60 * 1000 // fornecedor morto é ignorado durante 5 min
const falhasRecentes = new Map()

function emCooldown(nome) {
  const t = falhasRecentes.get(nome)
  if (!t) return false
  if (Date.now() - t >= COOLDOWN_MS) {
    falhasRecentes.delete(nome)
    return false
  }
  return true
}

function marcarFalha(nome) {
  falhasRecentes.set(nome, Date.now())
}

function marcarSucesso(nome) {
  falhasRecentes.delete(nome)
}

export function estadoFornecedores() {
  return {
    groq: groqKey() ? (emCooldown('groq') ? 'configurado:suspenso' : 'configurado') : 'sem_chave',
    gemini: geminiKey() ? (emCooldown('gemini') ? 'configurado:suspenso' : 'configurado') : 'sem_chave',
    pollinations: emCooldown('pollinations') ? 'suspenso' : 'activo',
    openrouter: openRouterKey() ? (emCooldown('openrouter') ? 'configurado:suspenso' : 'configurado') : 'sem_chave',
    openai: openaiKey() && allowPaidOpenAI()
      ? (emCooldown('openai') ? 'configurado:suspenso' : 'configurado')
      : 'desactivado',
  }
}

// ── Utilitários ──────────────────────────────────────────────────────────────
function fetchComTimeout(url, options = {}, timeoutMs = 10000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer))
}

/** Corre todas as tarefas em paralelo e devolve a primeira resposta não-nula. */
async function primeiraResposta(tarefas) {
  if (!tarefas.length) return null
  const resultados = await Promise.all(
    tarefas.map(async (t) => {
      try {
        return await t()
      } catch {
        return null
      }
    }),
  )
  return resultados.find(Boolean) || null
}

// ── Orquestração ─────────────────────────────────────────────────────────────
export async function chatCompletion({
  system,
  messages,
  maxTokens = 400,
  temperature = 0.78,
  tier = 'free',
  /** 'astrologia' = Gemini permitido (Oráculo). Outros valores = Gemini bloqueado. */
  escopo = null,
  lang = 'pt',
}) {
  const langReforco = escopo === 'sonhos' ? reforcoInstrucaoSonhosIA(lang) : ''
  const systemFull = langReforco ? `${system}\n\n${langReforco}` : system
  const msgs = [{ role: 'system', content: systemFull }, ...messages]

  // ONDA 1 (paralela): Groq + Gemini (melhor qualidade disponível).
  const onda1 = []
  if (groqKey() && !emCooldown('groq')) {
    onda1.push(() => callGroq(msgs, { maxTokens, temperature, tier }))
  }
  const geminiPermitido = escopo === 'astrologia' || escopo === 'sonhos'
  if (geminiKey() && geminiPermitido && !emCooldown('gemini')) {
    const gemSystem = escopo === 'astrologia'
      ? `${systemFull}\n\n${reforcoInstrucaoGeminiAstrologia(lang)}`
      : systemFull
    onda1.push(() => callGemini(gemSystem, messages, { maxTokens, temperature }))
  }
  const r1 = await primeiraResposta(onda1)
  if (r1) return r1

  // ONDA 2 (paralela): Pollinations + OpenRouter (gratuitos sem garantia).
  const onda2 = []
  if (!emCooldown('pollinations')) {
    onda2.push(() => callPollinations(msgs, { temperature }))
  }
  if (openRouterKey() && !emCooldown('openrouter')) {
    onda2.push(() => callOpenRouter(msgs, { maxTokens, temperature }))
  }
  const r2 = await primeiraResposta(onda2)
  if (r2) return r2

  // OpenAI pago - último recurso, só se activado explicitamente.
  if (allowPaidOpenAI() && openaiKey() && !emCooldown('openai')) {
    const oai = await callOpenAI(msgs, {
      maxTokens,
      temperature,
      model: 'gpt-4o-mini',
    })
    if (oai) return oai
  }

  return null
}

// ── Fornecedores ─────────────────────────────────────────────────────────────
async function callGroq(messages, { maxTokens, temperature, tier }) {
  const apiKey = groqKey()
  if (!apiKey) return null
  const models = tier === 'premium' ? GROQ_MODELS.premium : GROQ_MODELS.free
  for (const model of models) {
    try {
      const res = await fetchComTimeout('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: maxTokens,
          temperature,
        }),
      }, 12000)
      if (!res.ok) {
        console.warn('[AI] Groq:', model, res.status, (await res.text()).slice(0, 200))
        continue // tenta próximo modelo da cadeia
      }
      const d = await res.json()
      const txt = d.choices?.[0]?.message?.content?.trim()
      if (txt) {
        marcarSucesso('groq')
        return txt
      }
    } catch (e) {
      console.warn('[AI] Groq fetch:', model, e?.message)
    }
  }
  marcarFalha('groq')
  return null
}

async function callGemini(system, messages, { maxTokens, temperature }) {
  const apiKey = geminiKey()
  if (!apiKey) return null
  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))
  const modelos = ['gemini-2.0-flash', 'gemini-flash-latest']
  for (const modelo of modelos) {
    try {
      const res = await fetchComTimeout(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: system }] },
            contents,
            generationConfig: { temperature, maxOutputTokens: maxTokens },
          }),
        }, 12000,
      )
      if (!res.ok) continue
      const d = await res.json()
      const txt = d.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
      if (txt) {
        marcarSucesso('gemini')
        return txt
      }
    } catch {
      continue
    }
  }
  marcarFalha('gemini')
  return null
}

async function callPollinations(messages, { temperature }) {
  // POST e GET correm EM PARALELO - pior caso = 6s em vez de 11s.
  const sys = messages.find((m) => m.role === 'system')?.content || ''
  const user = messages.filter((m) => m.role === 'user').map((m) => m.content).join('\n')
  const prompt = `${sys}\n\n${user}`.slice(0, 6000)

  const [viaPost, viaGet] = await Promise.all([
    (async () => {
      try {
        const res = await fetchComTimeout('https://text.pollinations.ai/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'openai',
            messages,
            seed: Math.floor(Math.random() * 99999),
            temperature,
            private: true,
          }),
        }, 6000)
        if (!res.ok) return null
        const texto = (await res.text())?.trim()
        return texto && texto.length > 40 ? texto : null
      } catch (e) {
        console.warn('[AI] Pollinations POST:', e?.message)
        return null
      }
    })(),
    (async () => {
      try {
        const res = await fetchComTimeout(`https://text.pollinations.ai/${encodeURIComponent(prompt)}`, {
          headers: { Accept: 'text/plain' },
        }, 5000)
        if (!res.ok) return null
        const texto = (await res.text())?.trim()
        return texto && texto.length > 40 ? texto : null
      } catch (e) {
        console.warn('[AI] Pollinations GET:', e?.message)
        return null
      }
    })(),
  ])

  const texto = viaPost || viaGet
  if (texto) {
    marcarSucesso('pollinations')
    return texto
  }
  marcarFalha('pollinations')
  return null
}

async function callOpenRouter(messages, { maxTokens, temperature }) {
  const apiKey = openRouterKey()
  if (!apiKey) return null
  for (const model of OPENROUTER_FREE) {
    try {
      const res = await fetchComTimeout('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://sidusastro.com',
          'X-Title': 'Sidus Astro',
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: maxTokens,
          temperature,
        }),
      }, 12000)
      if (!res.ok) continue
      const d = await res.json()
      const txt = d.choices?.[0]?.message?.content?.trim()
      if (txt) {
        marcarSucesso('openrouter')
        return txt
      }
    } catch {
      continue
    }
  }
  marcarFalha('openrouter')
  return null
}

async function callOpenAI(messages, { maxTokens, temperature, model }) {
  const apiKey = openaiKey()
  if (!apiKey) return null
  try {
    const res = await fetchComTimeout('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model, messages, max_tokens: maxTokens, temperature }),
    }, 15000)
    if (!res.ok) {
      marcarFalha('openai')
      return null
    }
    const d = await res.json()
    const txt = d.choices?.[0]?.message?.content?.trim()
    if (txt) marcarSucesso('openai')
    return txt || null
  } catch {
    marcarFalha('openai')
    return null
  }
}