import { chatCompletion } from './_shared/ai.mjs'
import { obterAcessoMapa } from './_shared/mapaAccess.mjs'
import {
  construirSistemaMapa,
  construirPedidoMapa,
  parseRespostaMapa,
} from '../../src/lib/mapaInterpretacaoPrompt.js'
import { gerarAnaliseCompleta } from '../../src/lib/mapaInterpretacao.js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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
    const {
      mapaNatal,
      planetas = [],
      aspetos = [],
      dados = {},
      lang = 'pt',
      idToken,
    } = body

    if (!mapaNatal?.solar) {
      return new Response(JSON.stringify({ error: 'Mapa em falta' }), { status: 400, headers: corsHeaders })
    }

    if (!idToken) {
      return new Response(JSON.stringify({ error: 'Sessão em falta', auth: true }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const acesso = await obterAcessoMapa(idToken)
    if (acesso.erro === 'auth') {
      return new Response(JSON.stringify({ error: 'Sessão inválida', auth: true }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (!acesso.desbloqueado && !acesso.degradado) {
      return new Response(JSON.stringify({ error: 'Mapa completo não desbloqueado', locked: true }), {
        status: 402,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const resumoLexicon = gerarAnaliseCompleta(mapaNatal, planetas, aspetos, dados, lang)
    const system = construirSistemaMapa(lang)
    const userPrompt = construirPedidoMapa({
      mapaNatal,
      planetas,
      aspetos,
      dados,
      lang,
      resumoLexicon,
    })

    const raw = await chatCompletion({
      system,
      messages: [{ role: 'user', content: userPrompt }],
      maxTokens: 6500,
      temperature: 0.76,
      tier: 'premium',
      escopo: 'astrologia',
      lang,
    })

    let analise = raw ? parseRespostaMapa(raw, mapaNatal, lang) : null
    if (!analise?.seccoes?.length) {
      analise = { ...resumoLexicon, fonte: 'lexicon' }
    }

    return new Response(JSON.stringify({
      ok: true,
      ...analise,
      fonte: analise.fonte || (raw ? 'ia' : 'lexicon'),
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error('[interpret-mapa]', e?.message)
    return new Response(JSON.stringify({ error: 'Erro interno' }), { status: 500, headers: corsHeaders })
  }
}

export const config = { path: '/api/interpret-mapa' }
