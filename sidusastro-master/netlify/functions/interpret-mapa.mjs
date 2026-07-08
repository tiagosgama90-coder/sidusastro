import { chatCompletion } from './_shared/ai.mjs'
import { obterAcessoMapa } from './_shared/mapaAccess.mjs'
import {
  interpretacaoGuardada,
  persistirInterpretacao,
  gerarChaveMapa,
} from './_shared/mapaInterpretacaoStore.mjs'
import {
  construirSistemaMapa,
  construirPedidoMapa,
  parseRespostaMapa,
  contarPalavrasAnalise,
  analiseIaPremiumValida,
  temFrasesRoboticas,
} from '../../src/lib/mapaInterpretacaoPrompt.js'
import { gerarAnaliseCompleta, mapaPlanetasProntos } from '../../src/lib/mapaInterpretacao.js'
import { analiseMapaValida } from '../../src/lib/mapaInterpretacaoCache.js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const MIN_PALAVRAS_IA = 4200

function validarIa(analise) {
  return analise?.seccoes?.length && analiseIaPremiumValida(analise)
}

async function gerarInterpretacaoIA({ mapaNatal, planetas, aspetos, dados, lang }) {
  const system = construirSistemaMapa(lang)

  async function tentar({ retryCurto = false, retryRobotic = false } = {}) {
    const userPrompt = construirPedidoMapa({
      mapaNatal,
      planetas,
      aspetos,
      dados,
      lang,
      retryCurto,
      retryRobotic,
    })
    const raw = await chatCompletion({
      system,
      messages: [{ role: 'user', content: userPrompt }],
      maxTokens: 8192,
      temperature: retryRobotic ? 0.85 : retryCurto ? 0.82 : 0.8,
      tier: 'premium',
      escopo: 'astrologia',
      lang,
    })
    return raw ? parseRespostaMapa(raw, mapaNatal, lang) : null
  }

  let analise = await tentar({})
  let palavras = contarPalavrasAnalise(analise?.seccoes)

  if (!validarIa(analise) && (palavras < MIN_PALAVRAS_IA || temFrasesRoboticas(analise))) {
    const retry = await tentar({
      retryCurto: palavras < MIN_PALAVRAS_IA,
      retryRobotic: temFrasesRoboticas(analise),
    })
    const palavrasRetry = contarPalavrasAnalise(retry?.seccoes)
    if (retry?.seccoes?.length && (validarIa(retry) || palavrasRetry > palavras)) {
      analise = retry
      palavras = palavrasRetry
    }
  }

  if (!validarIa(analise) && palavras < MIN_PALAVRAS_IA) {
    const retry2 = await tentar({ retryCurto: true, retryRobotic: true })
    if (validarIa(retry2)) analise = retry2
  }

  return analise
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
      forceRegenerate = false,
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

    const chave = gerarChaveMapa(dados, lang)
    const fallbackLexicon = mapaPlanetasProntos(planetas, mapaNatal)
      ? gerarAnaliseCompleta(mapaNatal, planetas, aspetos, dados, lang)
      : null

    if (!mapaPlanetasProntos(planetas, mapaNatal)) {
      return new Response(JSON.stringify({ error: 'Planetas em cálculo', retry: true }), {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (!forceRegenerate) {
      const guardada = interpretacaoGuardada(acesso.perfil, dados, lang)
      if (guardada?.seccoes?.length && (guardada.fonte === 'ia' || analiseIaPremiumValida(guardada))) {
        return new Response(JSON.stringify({
          ok: true,
          chave,
          lang,
          seccoes: guardada.seccoes,
          textoPlano: guardada.textoPlano,
          fonte: guardada.fonte || 'ia',
          cached: true,
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
    }

    let analise = await gerarInterpretacaoIA({
      mapaNatal,
      planetas,
      aspetos,
      dados,
      lang,
    })

    if (!validarIa(analise)) {
      analise = fallbackLexicon?.seccoes?.length && analiseMapaValida(fallbackLexicon)
        ? { ...fallbackLexicon, fonte: 'lexicon' }
        : { seccoes: [], textoPlano: '', fonte: 'lexicon' }
    } else {
      analise.fonte = 'ia'
      const db = (await import('./_shared/firebase-admin.mjs')).getFirestore()
      if (db && acesso.uid) {
        await persistirInterpretacao(db, acesso.uid, dados, lang, analise)
      }
    }

    return new Response(JSON.stringify({
      ok: true,
      chave,
      lang,
      ...analise,
      fonte: analise.fonte || 'ia',
      cached: false,
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
