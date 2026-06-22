/**
 * Relatórios de sinastria — resumo grátis vs análise Premium completa.
 */
import { compatibilidadeSolarGratis } from './sinastriaEngine.js'

const ASPECTO_TOM = {
  Trígono: { pt: 'harmónico', en: 'harmonious' },
  Sextil: { pt: 'cooperativo', en: 'cooperative' },
  Conjunção: { pt: 'intenso', en: 'intense' },
  Quadratura: { pt: 'desafiante', en: 'challenging' },
  Oposição: { pt: 'polarizador', en: 'polarizing' },
}

const MISSAO_SOL = {
  Carneiro: { pt: 'Iniciar, liderar e abrir caminhos novos com coragem autêntica.', en: 'To initiate, lead and open new paths with authentic courage.' },
  Touro: { pt: 'Construir segurança, beleza e valor duradouro no mundo material.', en: 'To build security, beauty and lasting value in the material world.' },
  Gémeos: { pt: 'Conectar ideias, traduzir o invisível e estimular a curiosidade colectiva.', en: 'To connect ideas, translate the invisible and stimulate collective curiosity.' },
  Caranguejo: { pt: 'Nutrir, proteger e dar raízes emocionais às pessoas e lugares.', en: 'To nurture, protect and give emotional roots to people and places.' },
  Leão: { pt: 'Expressar criatividade, inspirar e irradiar confiança generosa.', en: 'To express creativity, inspire and radiate generous confidence.' },
  Virgem: { pt: 'Aperfeiçoar, servir com precisão e curar através do discernimento.', en: 'To refine, serve with precision and heal through discernment.' },
  Balança: { pt: 'Criar equilíbrio, justiça e pontes entre perspectivas opostas.', en: 'To create balance, justice and bridges between opposing views.' },
  Escorpião: { pt: 'Transformar profundamente, revelar verdades ocultas e regenerar.', en: 'To transform deeply, reveal hidden truths and regenerate.' },
  Sagitário: { pt: 'Expandir horizontes, ensinar e buscar sentido filosófico.', en: 'To expand horizons, teach and seek philosophical meaning.' },
  Capricórnio: { pt: 'Estruturar legados, assumir responsabilidade e subir com disciplina.', en: 'To structure legacies, take responsibility and rise with discipline.' },
  Aquário: { pt: 'Inovar, servir o colectivo e libertar padrões obsoletos.', en: 'To innovate, serve the collective and liberate obsolete patterns.' },
  Peixes: { pt: 'Compadecer, sonhar e canalizar o invisível em arte ou serviço.', en: 'To empathize, dream and channel the invisible into art or service.' },
}

const EIXOS = {
  quimica: {
    titulo: { pt: 'Atração Sexual e Química', en: 'Sexual Attraction & Chemistry' },
    planetas: { pt: 'Marte · Vénus', en: 'Mars · Venus' },
    intro: {
      pt: 'Marte e Vénus em sinastria medem desejo físico, magnetismo e a forma como o casal expressa erotismo e afecto. Aspectos harmónicos amplificam a química; quadraturas pedem negociação dos ritmos de intimidade.',
      en: 'Mars and Venus in synastry measure physical desire, magnetism and how the couple expresses eroticism and affection. Harmonious aspects amplify chemistry; squares ask for negotiation of intimacy rhythms.',
    },
  },
  emocao: {
    titulo: { pt: 'Sintonia Emocional', en: 'Emotional Harmony' },
    planetas: { pt: 'Sol · Lua', en: 'Sun · Moon' },
    intro: {
      pt: 'Sol e Lua cruzados revelam como reagem a crises, o nível de empatia e a sensação de segurança emocional. É o eixo onde se sentem «em casa» ou estranhos um ao outro.',
      en: 'Crossed Sun and Moon reveal how you react to crises, empathy levels and the sense of emotional safety. This is where you feel «at home» or like strangers.',
    },
  },
  comunicacao: {
    titulo: { pt: 'Comunicação e Diálogo', en: 'Communication & Dialogue' },
    planetas: { pt: 'Mercúrio', en: 'Mercury' },
    intro: {
      pt: 'Mercúrio entre os mapas define a facilidade para resolver mal-entendidos, o humor intelectual partilhado e se a conversa flui ou trava em momentos de pressão.',
      en: 'Mercury between charts defines ease resolving misunderstandings, shared intellectual humour and whether conversation flows or stalls under pressure.',
    },
  },
  futuro: {
    titulo: { pt: 'Projetos e Futuro', en: 'Projects & Future' },
    planetas: { pt: 'Júpiter · Saturno', en: 'Jupiter · Saturn' },
    intro: {
      pt: 'Júpiter e Saturno indicam a capacidade de construir uma vida estável juntos, partilhar filosofia de vida e equilibrar expansão com compromisso a longo prazo.',
      en: 'Jupiter and Saturn indicate capacity to build a stable life together, share life philosophy and balance expansion with long-term commitment.',
    },
  },
}

function fraseAspecto(a, lang) {
  const tom = ASPECTO_TOM[a.nome]
  if (!tom) return null
  const adj = tom[lang] || tom.pt
  if (lang === 'en') {
    return `${a.pessoaA} ${a.nome.toLowerCase()} ${a.pessoaB} (${a.signoA} · ${a.signoB}, orb ${a.orbe}°): ${adj} link.`
  }
  return `${a.pessoaA} ${a.nome.toLowerCase()} ${a.pessoaB} (${a.signoA} · ${a.signoB}, orbe ${a.orbe}°): ligação ${adj}.`
}

function textoMissaoIndividual(missao, lang) {
  if (!missao?.sol?.signo) return ''
  const solTxt = MISSAO_SOL[missao.sol.signo]?.[lang] || MISSAO_SOL[missao.sol.signo]?.pt || ''
  const linhas = []
  const nome = missao.nome || (lang === 'en' ? 'This person' : 'Esta pessoa')

  if (lang === 'en') {
    linhas.push(`**${nome} — life mission (Sun in ${missao.sol.signo})**`)
    linhas.push(solTxt)
    if (missao.mc) {
      linhas.push(`Midheaven in ${missao.mc.signo}: public vocation oriented toward ${missao.mc.elemento} themes — concrete expression of purpose in career and social role.`)
    } else if (missao.horaDesconhecida) {
      linhas.push('Without birth time, Midheaven is unavailable — solar mission remains the primary vocational indicator.')
    }
    if (missao.nodoNorte) {
      linhas.push(`North Node in ${missao.nodoNorte.signo}: evolutionary direction inviting growth in ${missao.nodoNorte.elemento} qualities this lifetime.`)
    }
  } else {
    linhas.push(`**${nome} — missão de vida (Sol em ${missao.sol.signo})**`)
    linhas.push(solTxt)
    if (missao.mc) {
      linhas.push(`Meio-Céu em ${missao.mc.signo}: vocação pública orientada para temas de ${missao.mc.elemento} — expressão concreta do propósito na carreira e papel social.`)
    } else if (missao.horaDesconhecida) {
      linhas.push('Sem hora de nascimento, o Meio-Céu não está disponível — a missão solar permanece o indicador vocacional principal.')
    }
    if (missao.nodoNorte) {
      linhas.push(`Nodo Norte em ${missao.nodoNorte.signo}: direcção evolutiva convidando ao crescimento nas qualidades de ${missao.nodoNorte.elemento} nesta vida.`)
    }
  }
  return linhas.join('\n')
}

function textoDinamicaEmocional(din, lang) {
  if (!din) return ''
  const linhas = []
  if (lang === 'en') {
    linhas.push('**Emotional dynamics**')
    if (din.tom === 'harmonia') {
      linhas.push('Emotional worlds tend to flow with natural empathy — mutual recognition in vulnerability is a strength.')
    } else if (din.tom === 'tensao') {
      linhas.push('Emotional rhythms differ significantly — translating feelings and respecting different needs is the central exercise.')
    } else {
      linhas.push('The emotional bond develops through conscious presence rather than automatic harmony.')
    }
    if (din.luaA && din.luaB) {
      linhas.push(`Moon signs: ${din.luaA} × ${din.luaB}.`)
    }
    for (const a of din.solLua?.slice(0, 2) || []) {
      const f = fraseAspecto(a, lang)
      if (f) linhas.push(`• ${f}`)
    }
    for (const a of din.venusLua?.slice(0, 2) || []) {
      const f = fraseAspecto(a, lang)
      if (f) linhas.push(`• ${f}`)
    }
    if (din.luaLua) {
      const f = fraseAspecto(din.luaLua, lang)
      if (f) linhas.push(`• Moon–Moon: ${f}`)
    }
  } else {
    linhas.push('**Dinâmica emocional**')
    if (din.tom === 'harmonia') {
      linhas.push('Os mundos emocionais tendem a fluir com empatia natural — o reconhecimento mútuo na vulnerabilidade é uma força.')
    } else if (din.tom === 'tensao') {
      linhas.push('Os ritmos emocionais diferem significativamente — traduzir sentimentos e respeitar necessidades distintas é o exercício central.')
    } else {
      linhas.push('A ligação emocional desenvolve-se por presença consciente, não por harmonia automática.')
    }
    if (din.luaA && din.luaB) {
      linhas.push(`Signos lunares: ${din.luaA} × ${din.luaB}.`)
    }
    for (const a of din.solLua?.slice(0, 2) || []) {
      const f = fraseAspecto(a, lang)
      if (f) linhas.push(`• ${f}`)
    }
    for (const a of din.venusLua?.slice(0, 2) || []) {
      const f = fraseAspecto(a, lang)
      if (f) linhas.push(`• ${f}`)
    }
    if (din.luaLua) {
      const f = fraseAspecto(din.luaLua, lang)
      if (f) linhas.push(`• Lua–Lua: ${f}`)
    }
  }
  return linhas.join('\n')
}

function textoEixo(pilar, score, aspectos, lang) {
  const eixo = EIXOS[pilar]
  if (!eixo) return ''
  const linhas = [
    `### ${eixo.titulo[lang] || eixo.titulo.pt}`,
    `*${eixo.planetas[lang] || eixo.planetas.pt}* · **${score}%**`,
    '',
    eixo.intro[lang] || eixo.intro.pt,
  ]
  const top = aspectos.slice(0, 4)
  if (top.length) {
    linhas.push('')
    for (const a of top) {
      const f = fraseAspecto(a, lang)
      if (f) linhas.push(`• ${f}`)
    }
  } else {
    linhas.push('')
    linhas.push(lang === 'en'
      ? 'No major aspects in this axis within 6° orb — the area develops through intentional effort.'
      : 'Sem aspectos maiores neste eixo dentro de orbe 6° — a área desenvolve-se por esforço intencional.')
  }
  return linhas.join('\n')
}

/** Resumo generalizado para utilizadores grátis. */
export function montarResumoGratis(resultado, mapaNatal, lang = 'pt') {
  if (!resultado) return ''
  const solA = mapaNatal?.solar?.nome || resultado.posA?.corpos?.sol?.signo
  const solB = resultado.posB?.corpos?.sol?.signo
  const compat = compatibilidadeSolarGratis(solA, solB, lang)
  const linhas = []

  if (lang === 'en') {
    linhas.push('**Generalized compatibility preview**')
    linhas.push(compat.texto)
    linhas.push('')
    const bucket = resultado.pontuacao >= 70 ? 'promising' : resultado.pontuacao >= 50 ? 'moderate' : 'demanding'
    linhas.push(`Overall synastry tone: **${bucket}** (${Math.round(resultado.pontuacao / 5) * 5}% range).`)
    linhas.push('')
    linhas.push('Premium unlocks the 4-axis radar (chemistry, emotion, communication, future), each person\'s life mission, detailed emotional dynamics and all cross-aspects calculated via Swiss Ephemeris (JPL/NASA).')
  } else {
    linhas.push('**Pré-visualização generalizada de compatibilidade**')
    linhas.push(compat.texto)
    linhas.push('')
    const bucket = resultado.pontuacao >= 70 ? 'promissora' : resultado.pontuacao >= 50 ? 'moderada' : 'exigente'
    linhas.push(`Tom geral da sinastria: **${bucket}** (faixa ~${Math.round(resultado.pontuacao / 5) * 5}%).`)
    linhas.push('')
    linhas.push('O Premium desbloqueia o radar dos 4 eixos (química, emoção, comunicação, futuro), a missão de cada um, dinâmica emocional detalhada e todos os aspectos cruzados via Swiss Ephemeris (JPL/NASA).')
  }
  return linhas.join('\n')
}

/** Relatório Premium completo. */
export function montarRelatorioSinastria(resultado, mapaNatal, lang = 'pt') {
  if (!resultado) return ''

  const { pilares, aspectos, posA, posB, porPilar, missaoA, missaoB, dinamicaEmocional } = resultado
  const linhas = []

  const avisoHora = posA?.horaDesconhecida || posB?.horaDesconhecida
  if (avisoHora) {
    linhas.push(lang === 'en'
      ? '*Note: without exact birth time, Ascendant, Midheaven and fast-moving points may be approximate (solar noon used). Sun, Jupiter and Saturn remain precise.*'
      : '*Nota: sem hora exacta de nascimento, Ascendente, Meio-Céu e pontos rápidos podem ser aproximados (meio-dia solar). Sol, Júpiter e Saturno mantêm precisão.*')
    linhas.push('')
  }

  if (mapaNatal?.solar?.nome || posA?.corpos?.sol) {
    if (lang === 'en') {
      linhas.push(
        `**Your chart:** Sun ${mapaNatal?.solar?.nome || posA?.corpos?.sol?.signo}, Moon ${mapaNatal?.lunar?.nome || posA?.corpos?.lua?.signo || '—'}, Asc ${mapaNatal?.ascendente?.nome || posA?.corpos?.ascendente?.signo || '—'}.`,
        `**Partner:** Sun ${posB?.corpos?.sol?.signo || '—'}, Moon ${posB?.corpos?.lua?.signo || '—'}, Asc ${posB?.corpos?.ascendente?.signo || '—'}.`,
        `**Ephemeris:** ${posA?.motor || 'Swiss Ephemeris'} · orb 6° · Tropical Placidus.`,
        '',
      )
    } else {
      linhas.push(
        `**O teu mapa:** Sol ${mapaNatal?.solar?.nome || posA?.corpos?.sol?.signo}, Lua ${mapaNatal?.lunar?.nome || posA?.corpos?.lua?.signo || '—'}, Asc ${mapaNatal?.ascendente?.nome || posA?.corpos?.ascendente?.signo || '—'}.`,
        `**Parceiro(a):** Sol ${posB?.corpos?.sol?.signo || '—'}, Lua ${posB?.corpos?.lua?.signo || '—'}, Asc ${posB?.corpos?.ascendente?.signo || '—'}.`,
        `**Efemérides:** ${posA?.motor || 'Swiss Ephemeris'} · orbe 6° · Tropical Placidus.`,
        '',
      )
    }
  }

  if (lang === 'en') {
    linhas.push('## Four practical pillars')
  } else {
    linhas.push('## Quatro pilares práticos')
  }
  linhas.push('')

  for (const pilar of ['quimica', 'emocao', 'comunicacao', 'futuro']) {
    linhas.push(textoEixo(pilar, pilares[pilar], porPilar[pilar] || [], lang))
    linhas.push('')
  }

  linhas.push(textoMissaoIndividual(missaoA, lang))
  linhas.push('')
  linhas.push(textoMissaoIndividual(missaoB, lang))
  linhas.push('')
  linhas.push(textoDinamicaEmocional(dinamicaEmocional, lang))
  linhas.push('')

  if (lang === 'en') {
    linhas.push('**Key synastry aspects (Swiss Ephemeris):**')
  } else {
    linhas.push('**Aspectos-chave da sinastria (Swiss Ephemeris):**')
  }
  const top = aspectos.slice(0, 12)
  if (!top.length) {
    linhas.push(lang === 'en'
      ? 'No major aspects within 6° orb.'
      : 'Sem aspectos maiores dentro de orbe 6°.')
  } else {
    for (const a of top) {
      const f = fraseAspecto(a, lang)
      if (f) linhas.push(`• ${f}`)
    }
  }

  return linhas.join('\n')
}

export { EIXOS }
