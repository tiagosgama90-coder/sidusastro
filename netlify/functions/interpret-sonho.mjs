import { chatCompletion } from './_shared/ai.mjs'
import { extrairSimbolos, labelSentimento } from '../../src/lib/sonhosLexicon.js'
import {
  construirSistemaSonhos,
  construirPedidoSonhos,
  parseRespostaSonhos,
} from '../../src/lib/sonhosPrompt.js'

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
    const { texto, lang = 'pt', feeling = null, chips = [], mapaNatal = null } = body

    if (!texto?.trim() || texto.trim().length < 8) {
      return new Response(JSON.stringify({ error: 'Relato demasiado curto' }), { status: 400, headers: corsHeaders })
    }

    const simbolosDetectados = extrairSimbolos(texto, chips)
    const system = construirSistemaSonhos(lang)
    const userPrompt = construirPedidoSonhos({
      texto: texto.trim(),
      lang,
      feeling: labelSentimento(feeling, lang),
      simbolosDetectados,
      mapaNatal,
    })

    const raw = await chatCompletion({
      system,
      messages: [{ role: 'user', content: userPrompt }],
      maxTokens: 520,
      temperature: 0.85,
      model: 'gpt-4o-mini',
    })

    if (!raw) {
      return new Response(JSON.stringify({ error: 'IA indisponível' }), { status: 503, headers: corsHeaders })
    }

    const seccoes = parseRespostaSonhos(raw, lang)
    const simbolos = simbolosDetectados.map((s) => ({ tema: s.tema, resumo: s.resumo }))

    return new Response(JSON.stringify({ seccoes, simbolos, raw }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error('[interpret-sonho]', e?.message)
    return new Response(JSON.stringify({ error: 'Erro interno' }), { status: 500, headers: corsHeaders })
  }
}

export const config = { path: '/api/interpret-sonho' }
