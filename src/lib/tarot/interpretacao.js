import { localizeArcano } from '../i18n/tarotArcana.js'
import { gerarMensagemAnjos } from '../tarotAnjos.js'
import { cartaPositivaSimNao } from './deck.js'

const POSICOES_PT = {
  diaria: ['A mensagem do dia'],
  simnao: ['A resposta do Universo'],
  amor: ['O teu estado', 'A vossa ligação', 'O futuro juntos'],
  geral: ['O passado', 'O presente', 'O futuro'],
  cigano: ['Amor & relações', 'Trabalho & carreira', 'Finanças', 'Saúde & energia', 'Destino & rumo'],
  oraculo: ['A tua essência', 'O obstáculo', 'O aliado secreto', 'A acção a tomar', 'O resultado final'],
}

function contarNaipes(cartas) {
  const n = { paus: 0, copas: 0, espadas: 0, ouros: 0, major: 0 }
  for (const c of cartas) {
    if (c.tipo === 'major' || c.id <= 21) n.major += 1
    else if (c.naipe) n[c.naipe] = (n[c.naipe] || 0) + 1
  }
  return n
}

function sinteseElementos(contagem, lang) {
  const dominante = Object.entries(contagem).sort((a, b) => b[1] - a[1])[0]
  if (!dominante || dominante[1] === 0) return ''
  const map = {
    pt: {
      major: 'Os Arcanos Maiores dominam esta tiragem - o destino fala alto. Presta atenção a ciclos de vida e transformações profundas.',
      paus: 'O elemento Fogo (Paus) predomina: ação, coragem e criatividade pedem passo à frente. O momento é de iniciar, não de esperar.',
      copas: 'O elemento Água (Copas) predomina: emoções, relações e intuição são o fio condutor. Escuta o coração com honestidade.',
      espadas: 'O elemento Ar (Espadas) predomina: mente, verdade e decisões claras. Nomeia o que sentes e escolhe com lucidez.',
      ouros: 'O elemento Terra (Ouros) predomina: matéria, trabalho e estabilidade. Foca no concreto, no corpo e nos recursos.',
    },
    en: {
      major: 'Major Arcana dominate this spread - destiny speaks loudly. Pay attention to life cycles and deep transformation.',
      paus: 'Fire (Wands) predominates: action, courage and creativity ask for a step forward. This is a time to begin, not wait.',
      copas: 'Water (Cups) predominates: emotions, relationships and intuition lead the reading. Listen to your heart honestly.',
      espadas: 'Air (Swords) predominates: mind, truth and clear decisions. Name what you feel and choose with clarity.',
      ouros: 'Earth (Pentacles) predominates: matter, work and stability. Focus on the concrete, body and resources.',
    },
  }
  const pack = map[lang] || map.pt
  return pack[dominante[0]] || ''
}

function aberturaPergunta(pergunta, lang) {
  if (!pergunta?.trim()) return ''
  const p = pergunta.trim()
  if (lang === 'en') return `Regarding your question - *"${p}"* - the cards reveal:\n\n`
  return `Em resposta à tua pergunta - *"${p}"* - as cartas revelam:\n\n`
}

function analiseCombinacoes(cartas, lang) {
  const majors = cartas.filter((c) => c.tipo === 'major' || c.id <= 21)
  if (majors.length >= 2 && lang === 'pt') {
    return `\n\n**Síntese arquetípica:** ${majors.map((c) => c.nome).join(' e ')} dialogam nesta tiragem - observa como estas energias se reforçam ou tensionam entre si.`
  }
  if (majors.length >= 2) {
    return `\n\n**Archetypal synthesis:** ${majors.map((c) => c.nome).join(' and ')} dialogue in this spread - notice how these energies reinforce or tension each other.`
  }
  return ''
}

/**
 * Interpretação profissional da leitura completa.
 */
export function interpretarLeitura(cartas, tipoId, pergunta, mapaNatal, lang = 'pt', t, getPosicoesTarot) {
  const tr = (key, vars) => (t ? t(key, vars) : key)
  const cartasLocalizadas = cartas.map((c) => localizeArcano(c, lang))
  const astro = mapaNatal
    ? `\n${tr('tarot.natalContext', { solar: mapaNatal.solar?.nome, lunar: mapaNatal.lunar?.nome, asc: mapaNatal.ascendente?.nome })}`
    : ''

  if (tipoId === 'simnao') {
    const c = cartasLocalizadas[0]
    const positiva = cartaPositivaSimNao(c)
    const nuance = c.invertida
      ? (lang === 'en' ? 'The reversed position suggests caution - the answer leans negative or "not yet".' : 'A posição invertida sugere cautela - a resposta inclina para negativo ou "ainda não".')
      : (lang === 'en' ? 'In upright position, the energy supports affirmation.' : 'Em posição direita, a energia favorece a afirmação.')
    return {
      resposta: positiva ? tr('tarot.yes') : tr('tarot.no'),
      detalhe: `${aberturaPergunta(pergunta, lang)}${nuance}\n\n${c.invertida ? c.sombra : c.luz}\n\n✦ ${c.conselho}${astro}`,
      mensagemAnjos: gerarMensagemAnjos(cartasLocalizadas, mapaNatal, lang),
    }
  }

  const mapaPosicoes = getPosicoesTarot?.(lang)
  const posicoes = mapaPosicoes?.[tipoId] || POSICOES_PT[tipoId] || []
  const linhas = cartasLocalizadas.map((c, i) => {
    const pos = posicoes[i] || tr('tarot.cardN', { n: i + 1 })
    const revLabel = tr('tarot.reversedLabel')
    const txt = c.invertida ? c.sombra : c.luz
    const orient = c.invertida
      ? (lang === 'en' ? 'Reversed - shadow aspect' : 'Invertida - aspecto sombra')
      : (lang === 'en' ? 'Upright - light aspect' : 'Direita - aspecto luz')
    return `**${pos}** · ${c.nome} (${orient}${c.invertida ? ` ${revLabel}` : ''})\n${txt}`
  })

  let conclusao = ''
  if (tipoId === 'amor') {
    conclusao = `\n\n${tr('tarot.synthesisAmor', {
      theme: cartasLocalizadas[0].palavras?.[0] || cartasLocalizadas[0].nome,
      outcome: cartasLocalizadas[2]?.invertida ? tr('tarot.synthesisAmorChallenge') : tr('tarot.synthesisAmorOpen'),
    })}`
  } else if (tipoId === 'geral') {
    conclusao = `\n\n${tr('tarot.synthesisGeral', {
      root: cartasLocalizadas[0].nome.toLowerCase(),
      present: cartasLocalizadas[1]?.palavras?.[0] || '',
      future: cartasLocalizadas[2]?.palavras?.[1] || cartasLocalizadas[2]?.palavras?.[0] || '',
    })}`
  } else if (tipoId === 'cigano' || tipoId === 'oraculo') {
    conclusao = `\n\n${tr('tarot.synthesisCigano', {
      start: cartasLocalizadas[0].nome,
      end: cartasLocalizadas[4]?.nome || cartasLocalizadas[cartasLocalizadas.length - 1]?.nome,
      path: cartasLocalizadas[2]?.palavras?.[0] || '',
    })}`
  }

  const elemento = sinteseElementos(contagemNaipes(cartasLocalizadas), lang)
  const combinacoes = analiseCombinacoes(cartasLocalizadas, lang)
  const conselhos = cartasLocalizadas
    .filter((c) => c.conselho)
    .map((c) => `• **${c.nome}:** ${c.conselho}`)
    .join('\n')

  const fecho = conselhos
    ? `\n\n**${lang === 'en' ? 'Guidance' : 'Orientação final'}**\n${conselhos}`
    : ''

  const mensagemAnjos = gerarMensagemAnjos(cartasLocalizadas, mapaNatal, lang)

  const detalhe = [
    aberturaPergunta(pergunta, lang).trim(),
    astro.trim(),
    linhas.join('\n\n'),
    elemento,
    conclusao,
    combinacoes,
    fecho,
  ].filter(Boolean).join('\n\n')

  return { resposta: null, detalhe, mensagemAnjos }
}
