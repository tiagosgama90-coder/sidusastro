/** Histórico local de conversas do Oráculo (utilizadores Premium). */

const MAX_SESSOES = 40

function chave(userId) {
  return `sidus_oracle_hist_${userId || 'local'}`
}

function limparMensagens(mensagens = []) {
  return mensagens.filter((m) => m.tipo !== 'upsell' && m.texto)
}

/** Só vale guardar histórico se o utilizador perguntou e a IA respondeu de facto. */
export function temRespostaOracle(mensagens = []) {
  const limpas = limparMensagens(mensagens)
  const idxUser = limpas.findIndex((m) => m.autor === 'user')
  if (idxUser < 0) return false
  return limpas.slice(idxUser + 1).some((m) => m.autor === 'ia' && m.tipo !== 'upsell')
}

export function carregarSessoesOracle(userId) {
  try {
    const raw = localStorage.getItem(chave(userId))
    const list = raw ? JSON.parse(raw) : []
    if (!Array.isArray(list)) return []
    const valid = list.filter((s) => temRespostaOracle(s.mensagens))
    if (valid.length !== list.length) {
      try {
        localStorage.setItem(chave(userId), JSON.stringify(valid.slice(0, MAX_SESSOES)))
      } catch { /* quota */ }
    }
    return valid
  } catch {
    return []
  }
}

export function guardarSessoesOracle(userId, sessoes) {
  try {
    const trimmed = sessoes.slice(0, MAX_SESSOES)
    localStorage.setItem(chave(userId), JSON.stringify(trimmed))
    return trimmed
  } catch {
    return sessoes
  }
}

export function tituloSessao(mensagens = []) {
  const primeira = limparMensagens(mensagens).find((m) => m.autor === 'user')
  if (primeira?.texto) return primeira.texto.slice(0, 72)
  const saudacao = limparMensagens(mensagens).find((m) => m.autor === 'ia')
  if (saudacao?.texto) return saudacao.texto.slice(0, 72)
  return ''
}

export function criarSessaoOracle({ mensagens, id, lang }) {
  const agora = new Date().toISOString()
  return {
    id: id || `sess-${Date.now()}`,
    lang: lang || 'pt',
    createdAt: agora,
    updatedAt: agora,
    title: tituloSessao(mensagens) || 'Conversa',
    mensagens: limparMensagens(mensagens),
  }
}

export function actualizarSessaoOracle(sessao, mensagens) {
  const titulo = tituloSessao(mensagens)
  return {
    ...sessao,
    updatedAt: new Date().toISOString(),
    title: titulo || sessao.title,
    mensagens: limparMensagens(mensagens),
  }
}

export function upsertSessaoOracle(userId, sessao) {
  if (!temRespostaOracle(sessao.mensagens)) {
    return removerSessaoOracle(userId, sessao.id)
  }
  const sessoes = carregarSessoesOracle(userId)
  const idx = sessoes.findIndex((s) => s.id === sessao.id)
  if (idx >= 0) sessoes[idx] = sessao
  else sessoes.unshift(sessao)
  return guardarSessoesOracle(userId, sessoes)
}

export function removerSessaoOracle(userId, sessaoId) {
  const sessoes = carregarSessoesOracle(userId).filter((s) => s.id !== sessaoId)
  return guardarSessoesOracle(userId, sessoes)
}

export function formatarDataSessao(iso, lang = 'pt') {
  try {
    const loc = { pt: 'pt-PT', en: 'en-GB', es: 'es-ES', it: 'it-IT', de: 'de-DE', fr: 'fr-FR' }[lang] || 'pt-PT'
    return new Date(iso).toLocaleString(loc, {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
    })
  } catch {
    return ''
  }
}
