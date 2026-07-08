import { gerarChaveMapa, analiseMapaValida } from '../../../src/lib/mapaInterpretacaoCache.js'
import { analiseIaPremiumValida } from '../../../src/lib/mapaInterpretacaoPrompt.js'

export { gerarChaveMapa }

function interpretacaoPersistivel(guardada) {
  if (!guardada?.seccoes?.length) return false
  if (guardada.fonte === 'ia') return analiseIaPremiumValida(guardada)
  return analiseMapaValida(guardada)
}

export function interpretacaoGuardada(perfil, dados, lang) {
  const guardada = perfil?.interpretacaoMapa
  if (!guardada?.seccoes?.length) return null
  const chave = gerarChaveMapa(dados, lang)
  if (guardada.chave !== chave) return null
  if ((guardada.lang || lang) !== lang) return null
  if (!interpretacaoPersistivel(guardada)) return null
  return guardada
}

export async function persistirInterpretacao(db, uid, dados, lang, analise) {
  if (!db || !uid || !analise?.seccoes?.length || !interpretacaoPersistivel(analise)) return false
  try {
    await db.collection('users').doc(uid).set({
      interpretacaoMapa: {
        chave: gerarChaveMapa(dados, lang),
        lang,
        seccoes: analise.seccoes,
        textoPlano: analise.textoPlano || '',
        fonte: analise.fonte || 'ia',
        guardadoEm: new Date().toISOString(),
      },
    }, { merge: true })
    return true
  } catch (e) {
    console.warn('[mapaInterpretacaoStore] persist:', e?.message)
    return false
  }
}
