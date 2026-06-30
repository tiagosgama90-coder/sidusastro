import { chatCompletion } from './_shared/ai.mjs'
import { extrairSimbolos, labelSentimento } from '../../src/lib/sonhosLexicon.js'
import {
  construirSistemaSonhos,
  construirPedidoSonhos,
  parseRespostaSonhos,
  gerarInterpretacaoLocal,
  reforcoInstrucaoSonhosIA,
  respostaSonhosNoIdioma,
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

    const hasText = texto?.trim().length >= 3
    const hasChips = Array.isArray(chips) && chips.length > 0
    if (!hasText && !hasChips) {
      return new Response(JSON.stringify({ error: 'Relato demasiado curto' }), { status: 400, headers: corsHeaders })
    }

    const textoEfetivo = hasText ? texto.trim() : chips.join(', ')

    const feelingLabel = labelSentimento(feeling, lang)
    const simbolosDetectados = extrairSimbolos(textoEfetivo, chips, lang)
    const system = construirSistemaSonhos(lang)
    const userPrompt = construirPedidoSonhos({
      texto: textoEfetivo,
      lang,
      feeling: feelingLabel,
      simbolosDetectados,
      mapaNatal,
    })

    const callIa = (retry = false) => chatCompletion({
      system: retry ? `${system}\n\n${reforcoInstrucaoSonhosIA(lang, true)}` : system,
      messages: [{ role: 'user', content: userPrompt }],
      maxTokens: 720,
      temperature: retry ? 0.65 : 0.82,
      tier: 'free',
      escopo: 'sonhos',
      lang,
    })

    let raw = await callIa(false)
    if (raw && !respostaSonhosNoIdioma(raw, lang)) {
      raw = await callIa(true)
    }

    const simbolos = simbolosDetectados.map((s) => ({ tema: s.tema, resumo: s.resumo }))
    let seccoes = raw ? parseRespostaSonhos(raw, lang) : null
    let fonte = 'ia'

    const seccoesValidas = seccoes?.some((s) => s.texto?.length > 20)
    const idiomaOk = raw ? respostaSonhosNoIdioma(raw, lang) : false

    if (!seccoesValidas || !idiomaOk) {
      seccoes = gerarInterpretacaoLocal(textoEfetivo, lang, feelingLabel, simbolosDetectados, mapaNatal)
      fonte = 'lexicon'
    }

    return new Response(JSON.stringify({ ok: true, seccoes, simbolos, fonte }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error('[interpret-sonho]', e?.message)
    return new Response(JSON.stringify({ error: 'Erro interno' }), { status: 500, headers: corsHeaders })
  }
}

export const config = { path: '/api/interpret-sonho' }
