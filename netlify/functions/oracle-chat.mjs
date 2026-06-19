import { chatCompletion } from './_shared/ai.mjs'
import { construirSistema, validarPerguntaOracle, gerarRespostaOracle } from '../../src/lib/i18n/oracle.js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

export default async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const { pergunta, mapaNatal, historico = [], lang = 'pt', isPremium = false } = body

    if (!pergunta?.trim()) {
      return new Response(JSON.stringify({ error: 'Pergunta em falta' }), { status: 400, headers: corsHeaders })
    }

    const erroValidacao = validarPerguntaOracle(pergunta.trim(), lang)
    if (erroValidacao) {
      return new Response(JSON.stringify({ resposta: erroValidacao, recusado: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const system = construirSistema(mapaNatal, lang, isPremium)
    const messages = [
      ...historico.slice(-6).map((m) => ({
        role: m.autor === 'user' ? 'user' : 'assistant',
        content: m.texto,
      })),
      { role: 'user', content: pergunta.trim() },
    ]

    const resposta = await chatCompletion({
      system,
      messages,
      maxTokens: isPremium ? 550 : 300,
      temperature: isPremium ? 0.75 : 0.82,
      tier: isPremium ? 'premium' : 'free',
    })

    if (!resposta) {
      const fallback = gerarRespostaOracle(pergunta.trim(), mapaNatal, 0, lang)
      return new Response(JSON.stringify({ resposta: fallback, fonte: 'mapa' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ resposta, fonte: 'ia' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error('[oracle-chat]', e?.message)
    return new Response(JSON.stringify({ error: 'Erro interno' }), { status: 500, headers: corsHeaders })
  }
}

export const config = { path: '/api/oracle-chat' }
