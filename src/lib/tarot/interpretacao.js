import { localizeArcano } from '../i18n/tarotArcana.js'
import { gerarMensagemAnjos } from '../tarotAnjos.js'
import { cartaPositivaSimNao } from './deck.js'

export const POSICOES_PT = {
  diaria: ['Energia do Dia', 'Alerta', 'Conselho'],
  simnao: ['Resposta Directa (Sim/Não)', 'Justificação'],
  amor: ['Tu (O Teu Estado)', 'A Ligação (A Energia Atual)', 'O Futuro Juntos'],
  geral: ['Passado (A Origem)', 'Presente (O Momento Atual)', 'Futuro (A Tendência)'],
  cigano: ['Amor & relações', 'Trabalho & carreira', 'Finanças', 'Saúde & energia', 'Destino & rumo'],
  oraculo: ['Mensagem Oculta', 'Conselho da Alma'],
  trabalho: ['Situação Atual', 'O Obstáculo Profissional', 'Conselho / Futuro'],
  ferradura: ['O Passado', 'O Presente', 'Futuro Oculto', 'A Tua Atitude', 'O Ambiente', 'Os Obstáculos', 'Resultado Final'],
  cruzcelta: [
    'Energia Atual', 'O Desafio', 'Raiz do Problema', 'Passado Recente', 'Metas Conscientes',
    'Futuro Próximo', 'A Tua Atitude', 'Ambiente Externo', 'Esperanças/Medos', 'Desfecho Longo Prazo',
  ],
}

function contarNaipes(cartas) {
  const n = { paus: 0, copas: 0, espadas: 0, ouros: 0, major: 0 }
  for (const c of cartas) {
    if (c.tipo === 'lenormand') continue
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

function sanitizarMarcacaoBold(texto) {
  if (!texto) return texto
  return texto.replace(/\*\*([^*]+)\*\*/g, (_, inner) => {
    const t = inner.trim()
    const sp = t.indexOf(' ')
    if (sp === -1) return `${t}-`
    return `${t.slice(0, sp)}-${t.slice(sp)}`
  })
}

function sinteseLenormand(cartas, lang) {
  if (!cartas.length) return ''
  const inicio = cartas[0].nome
  const fim = cartas[cartas.length - 1].nome
  if (lang === 'en') {
    return `\n\n**Lenormand synthesis:** From ${inicio} to ${fim} - a material, fast-moving path. Focus on concrete facts and timing within the next 90 days.`
  }
  return `\n\n**Síntese Lenormand:** De ${inicio} a ${fim} - um caminho material e rápido. Foca nos factos concretos e no prazo máximo de 90 dias.`
}

function aberturaPergunta(pergunta, lang) {
  if (!pergunta?.trim()) return ''
  const p = pergunta.trim()
  if (lang === 'en') return `Regarding your question - *"${p}"* - the cards reveal:\n\n`
  return `Em resposta à tua pergunta - *"${p}"* - as cartas revelam:\n\n`
}

function analiseCombinacoes(cartas, lang) {
  if (cartas[0]?.tipo === 'lenormand') return ''
  const majors = cartas.filter((c) => c.tipo === 'major' || c.id <= 21)
  if (majors.length >= 2 && lang === 'pt') {
    return `\n\n**Síntese arquetípica:** ${majors.map((c) => c.nome).join(' e ')} dialogam nesta tiragem - observa como estas energias se reforçam ou tensionam entre si.`
  }
  if (majors.length >= 2) {
    return `\n\n**Archetypal synthesis:** ${majors.map((c) => c.nome).join(' and ')} dialogue in this spread - notice how these energies reinforce or tension each other.`
  }
  return ''
}

function linhaCarta(c, pos, lang, tr) {
  const txt = c.luz || c.sombra || ''
  if (c.tipo === 'lenormand') {
    return `**${pos}** · ${c.nome}\n${txt}`
  }
  const revLabel = tr('tarot.reversedLabel')
  const orient = c.invertida
    ? (lang === 'en' ? 'Reversed - shadow aspect' : 'Invertida - aspecto sombra')
    : (lang === 'en' ? 'Upright - light aspect' : 'Direita - aspecto luz')
  const body = c.invertida ? c.sombra : c.luz
  return `**${pos}** · ${c.nome} (${orient}${c.invertida ? ` ${revLabel}` : ''})\n${body}`
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
    const just = cartasLocalizadas[1]
    const positiva = cartaPositivaSimNao(c)
    const nuance = c.invertida
      ? (lang === 'en' ? 'The reversed position suggests caution - the answer leans negative or "not yet".' : 'A posição invertida sugere cautela - a resposta inclina para negativo ou "ainda não".')
      : (lang === 'en' ? 'In upright position, the energy supports affirmation.' : 'Em posição direita, a energia favorece a afirmação.')
    const justTxt = just
      ? `\n\n**${tr('tarot.posSimnaoJust') || 'Justificação'}** · ${just.nome}\n${just.invertida ? just.sombra : just.luz}`
      : ''
    return {
      resposta: positiva ? tr('tarot.yes') : tr('tarot.no'),
      detalhe: sanitizarMarcacaoBold(`${aberturaPergunta(pergunta, lang)}${nuance}\n\n${c.invertida ? c.sombra : c.luz}${justTxt}${astro}`),
      mensagemAnjos: gerarMensagemAnjos(cartasLocalizadas, mapaNatal, lang),
    }
  }

  const mapaPosicoes = getPosicoesTarot?.(lang)
  const posicoes = mapaPosicoes?.[tipoId] || POSICOES_PT[tipoId] || []
  const linhas = cartasLocalizadas.map((c, i) => {
    const pos = posicoes[i] || tr('tarot.cardN', { n: i + 1 })
    return linhaCarta(c, pos, lang, tr)
  })

  let conclusao = ''
  if (tipoId === 'amor') {
    conclusao = `\n\n${tr('tarot.synthesisAmor', {
      theme: cartasLocalizadas[0].palavras?.[0] || cartasLocalizadas[0].nome,
      outcome: cartasLocalizadas[2]?.invertida ? tr('tarot.synthesisAmorChallenge') : tr('tarot.synthesisAmorOpen'),
    })}`
  } else if (tipoId === 'geral') {
    conclusao = `\n\n${tr('tarot.synthesisGeral', {
      root: (cartasLocalizadas[0]?.nome || '').toLowerCase(),
      present: cartasLocalizadas[1]?.palavras?.[0] || '',
      future: cartasLocalizadas[2]?.palavras?.[1] || cartasLocalizadas[2]?.palavras?.[0] || '',
    })}`
  } else if (tipoId === 'cigano') {
    conclusao = sinteseLenormand(cartasLocalizadas, lang)
  } else if (tipoId === 'oraculo') {
    conclusao = `\n\n${tr('tarot.synthesisOraculo', {
      hidden: cartasLocalizadas[0]?.nome || '',
      soul: cartasLocalizadas[1]?.nome || '',
    })}`
  } else if (tipoId === 'trabalho') {
    conclusao = `\n\n${tr('tarot.synthesisTrabalho', {
      situacao: cartasLocalizadas[0]?.nome || '',
      futuro: cartasLocalizadas[2]?.nome || '',
    })}`
  } else if (tipoId === 'ferradura') {
    conclusao = `\n\n${tr('tarot.synthesisFerradura', {
      passado: cartasLocalizadas[0]?.nome || '',
      resultado: cartasLocalizadas[6]?.nome || '',
    })}`
  } else if (tipoId === 'cruzcelta') {
    conclusao = `\n\n${tr('tarot.synthesisCruzCelta', {
      energia: cartasLocalizadas[0]?.nome || '',
      desfecho: cartasLocalizadas[9]?.nome || '',
    })}`
  } else if (tipoId === 'diaria') {
    conclusao = `\n\n${tr('tarot.synthesisDiaria', {
      energia: cartasLocalizadas[0]?.nome || '',
      conselho: cartasLocalizadas[2]?.nome || '',
    })}`
  }

  const isLenormand = cartasLocalizadas[0]?.tipo === 'lenormand'
  const elemento = isLenormand ? '' : sinteseElementos(contarNaipes(cartasLocalizadas), lang)
  const combinacoes = analiseCombinacoes(cartasLocalizadas, lang)
  const conselhos = cartasLocalizadas
    .filter((c) => c.conselho)
    .map((c) => `• **${c.nome}:** ${c.conselho}`)
    .join('\n')

  const fecho = conselhos
    ? `\n\n**${lang === 'en' ? 'Guidance' : 'Orientação final'}**\n${conselhos}`
    : ''

  const mensagemAnjos = isLenormand ? '' : gerarMensagemAnjos(cartasLocalizadas, mapaNatal, lang)

  const detalhe = [
    aberturaPergunta(pergunta, lang).trim(),
    astro.trim(),
    linhas.join('\n\n'),
    elemento,
    conclusao,
    combinacoes,
    fecho,
  ].filter(Boolean).join('\n\n')

  return { resposta: null, detalhe: sanitizarMarcacaoBold(detalhe), mensagemAnjos }
}
