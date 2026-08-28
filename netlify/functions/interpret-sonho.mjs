import { chatCompletion } from './_shared/ai.mjs'
import { extrairSimbolos, labelSentimento } from '../../src/lib/sonhosLexicon.js'
import {
  construirSistemaSonhos,
  construirPedidoSonhos,
  parseRespostaSonhos,
  gerarInterpretacaoLocal,
  reforcoInstrucaoSonhosIA,
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

    const callIa = () => chatCompletion({
      system: `${system}\n\n${reforcoInstrucaoSonhosIA(lang, true)}`,
      messages: [{ role: 'user', content: userPrompt }],
      maxTokens: 720,
      temperature: 0.62,
      tier: 'free',
      escopo: 'sonhos',
      lang,
    })

    const raw = await Promise.race([
      callIa(),
      new Promise((resolve) => setTimeout(() => resolve(null), 900)),
    ])

    const simbolos = simbolosDetectados.map((s) => ({ tema: s.tema, resumo: s.resumo }))
    let seccoes = raw ? parseRespostaSonhos(raw, lang) : null
    let fonte = 'ia'

    const seccoesValidas = seccoes?.some((s) => s.texto?.length > 20)
    const idiomaOk = raw ? respostaSonhosNoIdioma(raw, lang) : false

    if (!seccoesValidas || !idiomaOk) {
      try {
        seccoes = gerarInterpretacaoLocal(textoEfetivo, lang, feelingLabel, simbolosDetectados, mapaNatal)
        fonte = 'lexicon'
      } catch (e) {
        // Rede de segurança: o fallback local nunca pode derrubar a função com 500.
        console.error('[interpret-sonho] fallback local falhou:', e?.message)
        seccoes = [{
          key: 'section1',
          texto: lang === 'pt'
            ? `O teu sonho ("${textoEfetivo.slice(0, 120)}") foi registado. A interpretação detalhada está temporariamente indisponível - tenta novamente dentro de instantes.`
            : `Your dream ("${textoEfetivo.slice(0, 120)}") was registered. The detailed interpretation is temporarily unavailable - please try again shortly.`,
        }]
        fonte = 'emergencia'
      }
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
