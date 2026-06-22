/**
 * Interpretações textuais de sinastria — chaves por aspecto + contexto do mapa do utilizador.
 */

const ASPECTO_TOM = {
  Trígono: { pt: 'harmónico', en: 'harmonious', peso: 1 },
  Sextil: { pt: 'cooperativo', en: 'cooperative', peso: 0.85 },
  Conjunção: { pt: 'intenso', en: 'intense', peso: 0.9 },
  Quadratura: { pt: 'desafiante', en: 'challenging', peso: -0.9 },
  Oposição: { pt: 'polarizador', en: 'polarizing', peso: -0.75 },
}

const BLOCOS = {
  venus_marte: {
    pt: 'A dinâmica Vénus–Marte activa a química física e o magnetismo entre vocês. Há atração que pede expressão consciente, não apenas impulso.',
    en: 'The Venus–Mars dynamic activates physical chemistry and magnetism between you. Attraction asks for conscious expression, not impulse alone.',
  },
  mercurio: {
    pt: 'Mercúrio entre os vossos mapas define como traduzem intenções em palavras. A clareza mental é o alicerce desta ligação.',
    en: 'Mercury between your charts defines how intentions become words. Mental clarity is the foundation of this bond.',
  },
  sol_lua: {
    pt: 'Sol e Lua em contacto revelam compatibilidade de identidade e mundo emocional — o núcleo onde se sentem vistos ou invisíveis.',
    en: 'Sun and Moon in contact reveal identity and emotional world compatibility — the core where you feel seen or unseen.',
  },
  ascendente: {
    pt: 'O Ascendente em sinastria indica destino e propósito partilhado: como entram na vida um do outro e que caminho constroem juntos.',
    en: 'The Ascendant in synastry points to shared destiny and purpose: how you enter each other\'s lives and what path you build together.',
  },
}

function chaveAspecto(a) {
  const ord = [a.keyA, a.keyB].sort().join('_')
  const asp = a.id || a.nome?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  return `${ord}_${asp}`
}

const FRASES = {
  'sol_trigono_lua': {
    pt: 'Sol trígono Lua: reconhecimento emocional natural; sentem-se em casa na presença um do outro.',
    en: 'Sun trine Moon: natural emotional recognition; you feel at home in each other\'s presence.',
  },
  'sol_quadratura_marte': {
    pt: 'Sol quadratura Marte: faíscas de intensidade — o desafio é canalizar a energia sem competição.',
    en: 'Sun square Mars: sparks of intensity — the challenge is channeling energy without competition.',
  },
  'venus_conjuncao_marte': {
    pt: 'Vénus conjunção Marte: química evidente e magnetismo físico acentuado.',
    en: 'Venus conjunct Mars: evident chemistry and heightened physical magnetism.',
  },
  'mercurio_sextil_mercurio': {
    pt: 'Mercúrio sextil Mercúrio: diálogo fluido; compreendem o ritmo mental do outro.',
    en: 'Mercury sextile Mercury: fluid dialogue; you understand each other\'s mental rhythm.',
  },
  'lua_oposicao_sol': {
    pt: 'Lua oposição Sol: complementaridade clássica — um ilumina o que o outro sente; exige empatia activa.',
    en: 'Moon opposition Sun: classic complementarity — one illuminates what the other feels; active empathy required.',
  },
  'ascendente_trigono_sol': {
    pt: 'Ascendente trígono Sol: propósito alinhado; a relação abre caminhos de crescimento mútuo.',
    en: 'Ascendant trine Sun: aligned purpose; the relationship opens paths of mutual growth.',
  },
}

function fraseAspecto(a, lang) {
  const k = chaveAspecto(a)
  const direct = FRASES[k]
  if (direct) return direct[lang] || direct.pt

  const tom = ASPECTO_TOM[a.nome]
  if (!tom) return null
  const adj = tom[lang] || tom.pt
  if (lang === 'en') {
    return `${a.pessoaA} ${a.nome.toLowerCase()} ${a.pessoaB} (${a.signoA} · ${a.signoB}): ${adj} link, orb ${a.orbe}°.`
  }
  return `${a.pessoaA} ${a.nome.toLowerCase()} ${a.pessoaB} (${a.signoA} · ${a.signoB}): ligação ${adj}, orbe ${a.orbe}°.`
}

/**
 * Monta relatório Markdown/texto com base nos aspectos e no mapa do utilizador.
 */
export function montarRelatorioSinastria(resultado, mapaNatal, lang = 'pt') {
  if (!resultado) return ''

  const { pilares, aspectos, posA, posB } = resultado
  const linhas = []

  if (mapaNatal?.solar?.nome) {
    if (lang === 'en') {
      linhas.push(
        `**Your chart:** Sun in ${mapaNatal.solar.nome}, Moon in ${mapaNatal.lunar?.nome || '—'}, Ascendant in ${mapaNatal.ascendente?.nome || '—'}.`,
        `**Partner:** Sun in ${posB?.corpos?.sol?.signo || '—'}, Moon in ${posB?.corpos?.lua?.signo || '—'}, Ascendant in ${posB?.corpos?.ascendente?.signo || '—'}.`,
        '',
      )
    } else {
      linhas.push(
        `**O teu mapa:** Sol em ${mapaNatal.solar.nome}, Lua em ${mapaNatal.lunar?.nome || '—'}, Ascendente em ${mapaNatal.ascendente?.nome || '—'}.`,
        `**Parceiro(a):** Sol em ${posB?.corpos?.sol?.signo || '—'}, Lua em ${posB?.corpos?.lua?.signo || '—'}, Ascendente em ${posB?.corpos?.ascendente?.signo || '—'}.`,
        '',
      )
    }
  }

  const blocosUsados = new Set()
  for (const a of aspectos.slice(0, 8)) {
    if ((a.keyA === 'venus' || a.keyA === 'marte' || a.keyB === 'venus' || a.keyB === 'marte') && !blocosUsados.has('venus_marte')) {
      linhas.push(BLOCOS.venus_marte[lang] || BLOCOS.venus_marte.pt)
      blocosUsados.add('venus_marte')
    }
    if ((a.keyA === 'mercurio' || a.keyB === 'mercurio') && !blocosUsados.has('mercurio')) {
      linhas.push(BLOCOS.mercurio[lang] || BLOCOS.mercurio.pt)
      blocosUsados.add('mercurio')
    }
    if ((a.keyA === 'sol' || a.keyA === 'lua' || a.keyB === 'sol' || a.keyB === 'lua') && !blocosUsados.has('sol_lua')) {
      linhas.push(BLOCOS.sol_lua[lang] || BLOCOS.sol_lua.pt)
      blocosUsados.add('sol_lua')
    }
    if ((a.keyA === 'ascendente' || a.keyB === 'ascendente') && !blocosUsados.has('ascendente')) {
      linhas.push(BLOCOS.ascendente[lang] || BLOCOS.ascendente.pt)
      blocosUsados.add('ascendente')
    }
  }

  linhas.push('')
  if (lang === 'en') {
    linhas.push('**Key synastry aspects:**')
  } else {
    linhas.push('**Aspectos-chave da sinastria:**')
  }

  const top = aspectos.slice(0, 6)
  if (!top.length) {
    linhas.push(lang === 'en'
      ? 'No major aspects within 6° orb — the bond develops through conscious choice rather than automatic harmony.'
      : 'Sem aspectos maiores dentro de orbe 6° — a ligação desenvolve-se por escolha consciente, não por harmonia automática.')
  } else {
    for (const a of top) {
      const f = fraseAspecto(a, lang)
      if (f) linhas.push(`• ${f}`)
    }
  }

  linhas.push('')
  if (lang === 'en') {
    const p = pilares
    if (p.emocao >= 75) linhas.push('Emotionally, this synastry offers strong mutual understanding.')
    else if (p.emocao < 45) linhas.push('Emotional rhythms differ significantly — translation and patience are essential.')
    if (p.quimica >= 75) linhas.push('Physical and romantic chemistry is pronounced in this chart comparison.')
    if (p.proposito >= 70) linhas.push('There is a sense of shared direction — the relationship can serve a larger purpose.')
  } else {
    const p = pilares
    if (p.emocao >= 75) linhas.push('Emocionalmente, esta sinastria oferece compreensão mútua forte.')
    else if (p.emocao < 45) linhas.push('Os ritmos emocionais diferem significativamente — tradução e paciência são essenciais.')
    if (p.quimica >= 75) linhas.push('A química física e romântica é acentuada nesta comparação de mapas.')
    if (p.proposito >= 70) linhas.push('Há sentido de direcção partilhada — a relação pode servir um propósito maior.')
  }

  return linhas.join('\n')
}
