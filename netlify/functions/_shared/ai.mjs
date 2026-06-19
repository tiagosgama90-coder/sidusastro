import { env } from './env.mjs'

/** Chaves só no servidor — nunca VITE_* expostas ao browser. */
function openaiKey() {
  return env('OPENAI_API_KEY') || env('VITE_OPENAI_API_KEY')
}

function geminiKey() {
  return env('GEMINI_API_KEY') || env('VITE_GEMINI_API_KEY')
}

export async function chatCompletion({
  system,
  messages,
  maxTokens = 400,
  temperature = 0.78,
  model = 'gpt-4o-mini',
}) {
  const msgs = [{ role: 'system', content: system }, ...messages]

  const oai = await callOpenAI(msgs, { maxTokens, temperature, model })
  if (oai) return oai

  const gem = await callGemini(system, messages, { maxTokens, temperature })
  if (gem) return gem

  return callPollinations(msgs, { maxTokens, temperature })
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
      body: JSON.stringify({
        model,
        messages,
        max_tokens: maxTokens,
        temperature,
      }),
    })
    if (!res.ok) {
      console.warn('[AI] OpenAI:', res.status, await res.text())
      return null
    }
    const d = await res.json()
    return d.choices?.[0]?.message?.content?.trim() || null
  } catch (e) {
    console.warn('[AI] OpenAI fetch:', e?.message)
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
    if (!res.ok) return null
    const d = await res.json()
    return d.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null
  } catch {
    return null
  }
}

async function callPollinations(messages, { maxTokens, temperature }) {
  try {
    const res = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openai',
        messages,
        seed: Math.floor(Math.random() * 99999),
        private: true,
      }),
    })
    if (!res.ok) return null
    const texto = await res.text()
    return texto?.trim() || null
  } catch {
    return null
  }
}
