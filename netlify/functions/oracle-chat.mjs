import { chatCompletion } from './_shared/ai.mjs'
import { construirSistema, validarPerguntaOracle, gerarRespostaOracle } from '../../src/lib/i18n/oracle.js'
import { respostaPareceForaEscopoAstrologia, mensagemForaEscopo } from '../../src/lib/oracleAstrologiaGate.js'
import { obterAcessoOracle, incrementarOraclePergunta, MAX_ORACLE_GRATIS } from './_shared/oracleAccess.mjs'

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
    const { pergunta, mapaNatal, historico = [], lang = 'pt', idToken, clientPremium = false } = body

    if (!pergunta?.trim()) {
      return new Response(JSON.stringify({ error: 'Pergunta em falta' }), { status: 400, headers: corsHeaders })
    }

    if (!idToken) {
      return new Response(JSON.stringify({ error: 'Sessão em falta', auth: true }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const acesso = await obterAcessoOracle(idToken)
    if (acesso.erro === 'auth') {
      return new Response(JSON.stringify({ error: 'Sessão inválida', auth: true }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    const { uid, isPremium, usadas, degradado } = acesso
    const premiumActivo = isPremium || (degradado === true && clientPremium === true)

    const erroValidacao = validarPerguntaOracle(pergunta.trim(), lang)
    if (erroValidacao) {
      return new Response(JSON.stringify({ resposta: erroValidacao, recusado: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const system = construirSistema(mapaNatal, lang, premiumActivo)
    const messages = [
      ...historico.slice(-6).map((m) => ({
        role: m.autor === 'user' ? 'user' : 'assistant',
        content: m.texto,
      })),
      { role: 'user', content: pergunta.trim() },
    ]

    const respostaIa = chatCompletion({
      system,
      messages,
      maxTokens: premiumActivo ? 550 : 300,
      temperature: premiumActivo ? 0.75 : 0.82,
      tier: premiumActivo ? 'premium' : 'free',
      escopo: 'astrologia',
      lang,
    })
    const resposta = await Promise.race([
      respostaIa,
      new Promise((resolve) => setTimeout(() => resolve(null), 900)),
    ])

    if (resposta && respostaPareceForaEscopoAstrologia(resposta, lang)) {
      return new Response(JSON.stringify({ resposta: mensagemForaEscopo(lang), recusado: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    let respostaFinal = resposta
    let fonte = 'ia'

    if (!respostaFinal) {
      try {
        respostaFinal = gerarRespostaOracle(pergunta.trim(), mapaNatal, usadas, lang)
        fonte = 'mapa'
      } catch (e) {
        console.error('[oracle-chat] fallback local falhou:', e?.message)
      }
    }

    // Garantia final: o oráculo NUNCA fica sem resposta.
    if (!respostaFinal) {
      respostaFinal = lang === 'pt'
        ? 'Sou Sidus. Neste momento não consigo ler as estrelas com clareza - tenta a tua pergunta outra vez dentro de instantes.'
        : 'I am Sidus. I cannot read the stars clearly right now - please ask your question again in a moment.'
      fonte = 'emergencia'
    }

    await incrementarOraclePergunta(uid)

    return new Response(JSON.stringify({
      resposta: respostaFinal,
      fonte,
      usadas: premiumActivo ? usadas : usadas + 1,
      max: MAX_ORACLE_GRATIS,
      isPremium: premiumActivo,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error('[oracle-chat]', e?.message)
    return new Response(JSON.stringify({ error: 'Erro interno' }), { status: 500, headers: corsHeaders })
  }
}

export const config = { path: '/api/oracle-chat' }
