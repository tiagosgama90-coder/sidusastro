import { env } from './env.mjs'

/**
 * Motor IA 100% gratuito por defeito.
 * Ordem: Pollinations (sem chave) → Groq (chave grátis) → Gemini (chave grátis) → OpenRouter (modelos free)
 * OpenAI só se OPENAI_API_KEY existir E ALLOW_PAID_OPENAI=true
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

const GROQ_MODELS = {
  free: 'llama-3.3-70b-versatile',
  premium: 'llama-3.3-70b-versatile',
}

const OPENROUTER_FREE = [
  'google/gemma-2-9b-it:free',
  'meta-llama/llama-3.2-3b-instruct:free',
  'qwen/qwen-2.5-7b-instruct:free',
]

export async function chatCompletion({
  system,
  messages,
  maxTokens = 400,
  temperature = 0.78,
  tier = 'free',
}) {
  const msgs = [{ role: 'system', content: system }, ...messages]

  const groq = await callGroq(msgs, { maxTokens, temperature, tier })
  if (groq) return groq

  const gem = await callGemini(system, messages, { maxTokens, temperature })
  if (gem) return gem

  const poll = await callPollinations(msgs, { temperature })
  if (poll) return poll

  const or = await callOpenRouter(msgs, { maxTokens, temperature })
  if (or) return or

  if (allowPaidOpenAI() && openaiKey()) {
    const oai = await callOpenAI(msgs, {
      maxTokens,
      temperature,
      model: tier === 'premium' ? 'gpt-4o-mini' : 'gpt-4o-mini',
    })
    if (oai) return oai
  }

  return null
}

async function callPollinations(messages, { temperature }) {
  try {
    const res = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openai',
        messages,
        seed: Math.floor(Math.random() * 99999),
        temperature,
        private: true,
      }),
    })
    if (res.ok) {
      const texto = (await res.text())?.trim()
      if (texto && texto.length > 40) return texto
    }
  } catch (e) {
    console.warn('[AI] Pollinations POST:', e?.message)
  }

  try {
    const sys = messages.find((m) => m.role === 'system')?.content || ''
    const user = messages.filter((m) => m.role === 'user').map((m) => m.content).join('\n')
    const prompt = `${sys}\n\n${user}`.slice(0, 6000)
    const res = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}`, {
      headers: { Accept: 'text/plain' },
    })
    if (!res.ok) return null
    const texto = (await res.text())?.trim()
    return texto && texto.length > 40 ? texto : null
  } catch (e) {
    console.warn('[AI] Pollinations GET:', e?.message)
    return null
  }
}

async function callGroq(messages, { maxTokens, temperature, tier }) {
  const apiKey = groqKey()
  if (!apiKey) return null
  const model = tier === 'premium' ? GROQ_MODELS.premium : GROQ_MODELS.free
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
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
    })
    if (!res.ok) {
      console.warn('[AI] Groq:', res.status, await res.text())
      return null
    }
    const d = await res.json()
    return d.choices?.[0]?.message?.content?.trim() || null
  } catch (e) {
    console.warn('[AI] Groq fetch:', e?.message)
    return null
  }
}

async function callGemini(system, messages, { maxTokens, temperature }) {
  const apiKey = geminiKey()
  if (!apiKey) return null
  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents,
          generationConfig: { temperature, maxOutputTokens: maxTokens },
        }),
      }
    )
    if (!res.ok) {
      const res2 = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: system }] },
            contents,
            generationConfig: { temperature, maxOutputTokens: maxTokens },
          }),
        }
      )
      if (!res2.ok) return null
      const d2 = await res2.json()
      return d2.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null
    }
    const d = await res.json()
    return d.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null
  } catch {
    return null
  }
}

async function callOpenRouter(messages, { maxTokens, temperature }) {
  const apiKey = openRouterKey()
  if (!apiKey) return null
  for (const model of OPENROUTER_FREE) {
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
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
      })
      if (!res.ok) continue
      const d = await res.json()
      const txt = d.choices?.[0]?.message?.content?.trim()
      if (txt) return txt
    } catch {
      continue
    }
  }
  return null
}

async function callOpenAI(messages, { maxTokens, temperature, model }) {
  const apiKey = openaiKey()
  if (!apiKey) return null
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model, messages, max_tokens: maxTokens, temperature }),
    })
    if (!res.ok) return null
    const d = await res.json()
    return d.choices?.[0]?.message?.content?.trim() || null
  } catch {
    return null
  }
}
