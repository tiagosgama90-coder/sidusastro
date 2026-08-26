import { chatCompletion, estadoFornecedores } from './_shared/ai.mjs'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

/**
 * Diagnóstico do motor IA - GET /api/ai-status
 * Mostra que fornecedores estão configurados/suspensos SEM expor chaves.
 *
 * GET /api/ai-status          → estado configuracional (instantâneo)
 * GET /api/ai-status?ping=1   → teste AO VIVO: faz uma chamada real e diz
 *                               que fornecedor respondeu e em quanto tempo.
 */
export default async (req) => {
  const url = new URL(req.url)
  const ping = url.searchParams.get('ping') === '1'
  const fornecedores = estadoFornecedores()
  const algumActivo = Object.values(fornecedores).some(
    (v) => v === 'configurado' || v === 'activo',
  )

  const base = {
    ok: true,
    motor: algumActivo ? 'operacional' : 'sem-ia (fallback local activo)',
    fornecedores,
    fallbackLocal: 'sempre disponivel (lexicon/mapa)',
    dica: 'Se tudo estiver sem_chave, adiciona GROQ_API_KEY gratuita no Netlify (ver IA-GUIA.md)',
  }

  if (!ping) {
    return new Response(JSON.stringify(base), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    })
  }

  // Teste ao vivo - identifica o fornecedor que efectivamente responde.
  const t0 = Date.now()
  let resposta = null
  try {
    resposta = await chatCompletion({
      system: 'Responde apenas com a palavra: ok',
      messages: [{ role: 'user', content: 'ping' }],
      maxTokens: 10,
      temperature: 0,
      tier: 'free',
      escopo: 'astrologia',
      lang: 'pt',
    })
  } catch { /* tratado abaixo */ }
  const ms = Date.now() - t0

  return new Response(JSON.stringify({
    ...base,
    ping: {
      resultado: resposta ? 'IA A RESPONDER' : 'todos os fornecedores falharam (fallback local assume)',
      tempoMs: ms,
      amostra: resposta?.slice(0, 60) || null,
      estadoAposTeste: estadoFornecedores(),
    },
  }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })
}

export const config = { path: '/api/ai-status' }