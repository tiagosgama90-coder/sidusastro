import { estadoFornecedores } from './_shared/ai.mjs'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

/**
 * Diagnóstico do motor IA - GET /api/ai-status
 * Mostra que fornecedores estão configurados/suspensos SEM expor chaves.
 * Se algo deixar de funcionar, abre este URL para ver o estado em segundos.
 */
export default async () => {
  const fornecedores = estadoFornecedores()
  const algumActivo = Object.values(fornecedores).some(
    (v) => v === 'configurado' || v === 'activo',
  )

  return new Response(JSON.stringify({
    ok: true,
    motor: algumActivo ? 'operacional' : 'sem-ia (fallback local activo)',
    fornecedores,
    fallbackLocal: 'sempre disponivel (lexicon/mapa)',
    dica: 'Se tudo estiver sem_chave, adiciona GROQ_API_KEY gratuita no Netlify (ver IA-GUIA.md)',
  }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })
}

export const config = { path: '/api/ai-status' }