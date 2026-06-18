/**
 * Interpretação profissional do Mapa Natal — Tropical Placidus
 * Estrutura em 5 secções (Astrologia Psicológica / Kármica).
 */

import { TEMAS_CASA, planetaPorNome } from './casasPlacidus.js'

const ELEMENTO = {
  Carneiro: 'Fogo', Leão: 'Fogo', Sagitário: 'Fogo',
  Touro: 'Terra', Virgem: 'Terra', Capricórnio: 'Terra',
  Gémeos: 'Ar', Balança: 'Ar', Aquário: 'Ar',
  Caranguejo: 'Água', Escorpião: 'Água', Peixes: 'Água',
}

const MODALIDADE = {
  Carneiro: 'Cardinal', Caranguejo: 'Cardinal', Balança: 'Cardinal', Capricórnio: 'Cardinal',
  Touro: 'Fixo', Leão: 'Fixo', Escorpião: 'Fixo', Aquário: 'Fixo',
  Gémeos: 'Mutável', Virgem: 'Mutável', Sagitário: 'Mutável', Peixes: 'Mutável',
}

const ESSENCIA_SIGNO = {
  Carneiro: 'iniciativa corajosa, autonomia e impulso de abrir caminho',
  Touro: 'estabilidade sensorial, persistência e construção de valor duradouro',
  Gémeos: 'curiosidade mental, adaptabilidade e diálogo como via de crescimento',
  Caranguejo: 'profundidade emocional, protecção e memória afectiva',
  Leão: 'criatividade radiante, generosidade e necessidade de expressão autêntica',
  Virgem: 'discernimento, serviço consciente e refinamento do quotidiano',
  Balança: 'diplomacia, senso de justiça e crescimento através da relação',
  Escorpião: 'intensidade transformadora, coragem psíquica e renascimento',
  Sagitário: 'expansão filosófica, optimismo visionário e busca de sentido',
  Capricórnio: 'disciplina estratégica, responsabilidade e construção de legado',
  Aquário: 'originalidade, visão humanitária e independência intelectual',
  Peixes: 'compaixão, imaginação e ligação ao plano simbólico e espiritual',
}

function casaTxt(casa) {
  if (!casa) return 'uma área ainda a calcular'
  const t = TEMAS_CASA[casa]
  return t ? `Casa ${casa} (${t.nome}) — ${t.foco}` : `Casa ${casa}`
}

function paragrafoGeracional(nome, signo, casa) {
  const textos = {
    Urano: `Urano em ${signo}${casa ? ` na ${casa}ª Casa` : ''} marca a tua relação com a liberdade, a inovação e as rupturas necessárias. ${ESSENCIA_SIGNO[signo] || ''} ${
      casa ? `Revoluções pessoais activam-se em ${TEMAS_CASA[casa]?.foco || 'esta área'}.` : ''
    } Onde te sentes sufocado por rotinas obsoletas, Urano pede autenticidade radical.`,
    Neptuno: `Neptuno em ${signo}${casa ? ` na ${casa}ª Casa` : ''} abre portas ao plano simbólico, espiritual e criativo. ${ESSENCIA_SIGNO[signo] || ''} ${
      casa ? `A dissolução de fronteiras opera em ${TEMAS_CASA[casa]?.foco || 'esta esfera'}.` : ''
    } Cuidado com ilusões — Neptuno também nebuliza; a intuição precisa de ancoragem.`,
    Plutão: `Plutão em ${signo}${casa ? ` na ${casa}ª Casa` : ''} indica onde a transformação profunda é inevitável. ${ESSENCIA_SIGNO[signo] || ''} ${
      casa ? `Crises regeneradoras concentram-se em ${TEMAS_CASA[casa]?.foco || 'temas desta casa'}.` : ''
    } O que morre aqui renasce com mais poder autêntico.`,
    'Nodo Norte': `O Nodo Norte em ${signo}${casa ? ` na ${casa}ª Casa` : ''} aponta a direcção evolutiva da tua alma nesta vida: ${ESSENCIA_SIGNO[signo] || 'crescimento kármico'}. ${
      casa ? `O destino evolutivo liga-se a ${TEMAS_CASA[casa]?.foco || 'esta área'}.` : ''
    } Os hábitos do Nodo Sul (signo oposto) são confortáveis mas já não te servem.`,
    Quíron: `Quíron em ${signo}${casa ? ` na ${casa}ª Casa` : ''} revela a ferida-sabedoria — o ponto onde sentes inadequação e onde, precisamente por isso, podes curar outros. ${
      casa ? `A cura passa por ${TEMAS_CASA[casa]?.foco || 'temas desta casa'}.` : ''
    }`,
  }
  return textos[nome] || `${nome} em ${signo}${casa ? ` na Casa ${casa}` : ''} colore dimensões transpersonais do teu mapa.`
}

function introTecnica(mapaNatal, dados) {
  return `Este mapa natal foi calculado pelo método das efemérides astronómicas (${mapaNatal?.motor || 'Swiss Ephemeris / NASA JPL'}), no sistema **Tropical** com **Casas Placidus** — o padrão profissional utilizado por astrólogos certificados internacionalmente. Os graus eclípticos reflectem a posição exacta dos corpos celestes no momento do nascimento${dados?.cidade ? ` em ${dados.cidade}` : ''}${dados?.data ? `, ${dados.data}` : ''}${dados?.hora ? ` às ${dados.hora}` : ''}. Cada planeta numa casa Placidus indica *onde* na vida a energia desse signo se manifesta concretamente.`
}

/** Resumo mínimo para utilizadores free — gera curiosidade sem revelar o mapa completo. */
export function gerarResumoGratuito(mapaNatal) {
  const sol = mapaNatal?.solar?.nome
  const lua = mapaNatal?.lunar?.nome
  const asc = mapaNatal?.ascendente?.nome
  return {
    sol: sol ? `O teu Sol em ${sol} define o núcleo da tua identidade — mas em que *casa* brilhas? Isso muda tudo.` : null,
    lua: lua ? `A Lua em ${lua} regula o teu mundo emocional. A casa lunar revela onde buscas segurança — informação reservada ao mapa completo.` : null,
    asc: asc ? `Ascendente em ${asc}: o mundo vê-te através desta lente. A combinação Sol–Lua–Ascendente forma a tua assinatura psíquica única.` : null,
    gancho: 'O mapa completo inclui Mercúrio, Vénus, Marte, Júpiter, Saturno, MC, aspectos, casas Placidus e interpretação profissional em PDF.',
  }
}

function paragrafoSol(signo, casa) {
  const extra = signo === 'Escorpião' || signo === 'Capricórnio' || signo === 'Virgem'
    ? ' A tua força reside na profundidade e na persistência — o mundo reconhece a tua competência quando deixas de esconder o que sabes.'
    : signo === 'Leão' || signo === 'Carneiro' || signo === 'Sagitário'
      ? ' Precisas de palco e propósito: sem expressão autêntica, a vitalidade transforma-se em inquietação.'
      : ' A maturidade astrológica passa por honrar este signo nos momentos em que escolhes ser fiel a ti mesmo/a.'
  return `Com o Sol em ${signo}${casa ? ` na ${casa}ª Casa` : ''}, a tua identidade consciente expressa ${ESSENCIA_SIGNO[signo] || 'uma essência única'}. ${
    casa
      ? `Este é o palco onde a tua luz precisa de brilhar: ${TEMAS_CASA[casa]?.foco || 'a tua área de realização pessoal'}. Quando honras esta casa, sentes vitalidade; quando a ignoras, a alma adoece silenciosamente.`
      : 'O teu propósito manifesta-se sempre que ages com autenticidade e coragem de ser quem realmente és.'
  }${extra}`
}

function paragrafoLua(signo, casa) {
  return `A Lua em ${signo}${casa ? ` na ${casa}ª Casa` : ''} descreve o teu mundo emocional: ${ESSENCIA_SIGNO[signo] || 'uma sensibilidade particular'}. Sob stress, regresses a estes padrões instintivos. ${
    casa
      ? `A segurança emocional ancora-se em ${TEMAS_CASA[casa]?.foco || 'temas desta casa'}. Nutrir esta área é cuidar da tua base interior.`
      : 'As tuas necessidades afectivas pedem reconhecimento — não são fraqueza, são bússola.'
  }`
}

function paragrafoAsc(signo) {
  return `O Ascendente em ${signo} é a máscara natural com que entras no mundo: ${ESSENCIA_SIGNO[signo] || 'uma presença distinta'}. É a primeira impressão que causas e o corpo-veículo da tua jornada evolutiva. Ao integrar conscientemente este signo, deixas de «actuar» a persona e passas a habitá-la com presença autêntica.`
}

function dinamicaBig3(sol, lua, asc) {
  if (!sol || !lua || !asc) return 'A interacção entre Sol, Lua e Ascendente revela a coreografia entre quem és (Sol), o que sentes (Lua) e como te apresentas (Ascendente). Integrar estes três polos é o primeiro passo da maturidade astrológica.'

  const eSol = ELEMENTO[sol], eLua = ELEMENTO[lua], eAsc = ELEMENTO[asc]
  const mSol = MODALIDADE[sol], mLua = MODALIDADE[lua], mAsc = MODALIDADE[asc]

  const partes = []

  if (eSol !== eLua) {
    const tensao = (
      (eSol === 'Fogo' && eLua === 'Água') || (eSol === 'Água' && eLua === 'Fogo') ? 'entre a acção impulsiva e a profundidade emocional'
      : (eSol === 'Ar' && eLua === 'Terra') || (eSol === 'Terra' && eLua === 'Ar') ? 'entre a mente abstracta e a necessidade de concretude'
      : (eSol === 'Fogo' && eLua === 'Terra') || (eSol === 'Terra' && eLua === 'Fogo') ? 'entre impulso e prudência'
      : 'entre estilos elementais diferentes que pedem tradução consciente'
    )
    partes.push(`Sol (${sol}/${eSol}) e Lua (${lua}/${eLua}) dialogam com tensão ${tensao}. Não se tratam de inimigos internos — são dois idiomas que a tua psique fala.`)
  } else {
    partes.push(`Sol e Lua no mesmo elemento (${eSol}) conferem coerência emocional-identitária: sentes e ages alinhados, embora possas carecer de contraste criativo.`)
  }

  if (eAsc !== eSol) {
    partes.push(`O Ascendente em ${asc} (${eAsc}) colore a forma como o mundo lê o teu Sol em ${sol}: por vezes és percebido/a de forma diferente da tua essência íntima — usar isso como recurso, não como contradição.`)
  } else {
    partes.push(`Ascendente e Sol partilham elemento: a tua imagem pública reforça a identidade — transparência e autenticidade são o teu superpoder social.`)
  }

  if (mSol !== mLua) {
    partes.push(`Modalidades distintas (Sol ${mSol}, Lua ${mLua}) indicam ritmos internos diferentes: saber quando iniciar, sustentar ou adaptar é chave para o teu equilíbrio.`)
  }

  return partes.join(' ')
}

function paragrafoMerc(signo, casa) {
  return `Mercúrio em ${signo}${casa ? ` na ${casa}ª Casa` : ''} define como pensas, aprendes e comunicas: ${ESSENCIA_SIGNO[signo] || 'um estilo mental próprio'}. ${
    casa ? `A mente activa-se especialmente em ${TEMAS_CASA[casa]?.foco || 'temas desta casa'}.` : ''
  } Escreve, fala e questiona a partir deste lugar — é aí que a tua inteligência floresce.`
}

function paragrafoVen(signo, casa) {
  return `Vénus em ${signo}${casa ? ` na ${casa}ª Casa` : ''} revela a tua linguagem de amor e o que magnetiza: ${ESSENCIA_SIGNO[signo] || 'valores relacionais únicos'}. ${
    casa ? `A abundância e o prazer fluem quando cultivas ${TEMAS_CASA[casa]?.foco || 'esta área da vida'}.` : ''
  }`
}

function paragrafoMar(signo, casa) {
  return `Marte em ${signo}${casa ? ` na ${casa}ª Casa` : ''} indica como assertas desejos, lidas com a raiva e inicias: ${ESSENCIA_SIGNO[signo] || 'uma energia de acção particular'}. ${
    casa ? `O impulso vital concentra-se em ${TEMAS_CASA[casa]?.foco || 'temas desta casa'}. Canalizar esta força evita explosões ou passividade.`
      : 'A chave é usar a tua coragem a favor de objectivos que te dignifiquem.'
  }`
}

function paragrafoJup(signo, casa) {
  return `Júpiter em ${signo}${casa ? ` na ${casa}ª Casa` : ''} aponta onde a vida te expande com mais facilidade: ${ESSENCIA_SIGNO[signo] || 'optimismo e crescimento'}. ${
    casa ? `A tua «sorte» filosófica activa-se em ${TEMAS_CASA[casa]?.foco || 'esta esfera'}. Confia, mas não exageres — Júpiter também inflaciona.` : ''
  }`
}

function paragrafoSat(signo, casa) {
  return `Saturno em ${signo}${casa ? ` na ${casa}ª Casa` : ''} é o teu mestre kármico: ${ESSENCIA_SIGNO[signo] || 'lições de maturidade'}. ${
    casa ? `Aqui sentes medo do fracasso até construíres competência sólida em ${TEMAS_CASA[casa]?.foco || 'temas desta casa'}. A disciplina nesta área torna-se o teu trono.` : ''
  } Saturno não pune — ensina através do tempo.`
}

function paragrafoMC(signo) {
  return `O Meio do Céu em ${signo} define a tua vocação pública e o legado que buscas deixar: ${ESSENCIA_SIGNO[signo] || 'uma missão profissional única'}. A carreira ideal não é apenas um emprego — é a expressão visível da tua autoridade interior. Em ${signo}, o mundo reconhece-te quando ${TEMAS_CASA[10]?.foco || 'assumes o teu lugar no palco social'} com autenticidade ${signo === 'Capricórnio' || signo === 'Virgem' || signo === 'Touro' ? 'e consistência' : signo === 'Leão' || signo === 'Carneiro' || signo === 'Sagitário' ? 'e liderança inspiradora' : 'e sensibilidade estratégica'}.`
}

function aspectoTenso(aspetos) {
  const tensos = (aspetos || []).filter(a =>
    a.aspecto === 'Quadratura' || a.aspecto === 'Oposicao' || a.aspecto === 'Oposição'
  )
  if (!tensos.length) return null
  return tensos.sort((a, b) => parseFloat(a.orbe) - parseFloat(b.orbe))[0]
}

function sinteseAspectoTenso(asp) {
  if (!asp) {
    return {
      titulo: 'Harmonia estrutural',
      texto: 'Não há quadratura ou oposição dominante nos aspectos principais — isso não significa vida fácil, mas indica que os teus planetas pessoais dialogam com relativa fluidez. O teu crescimento virá de integrar polaridades subtis (Sol/Lua/Ascendente) em vez de grandes choques internos.',
      conselho: 'Aprofunda autoconhecimento nas áreas de casa que mais te movem emocionalmente.',
    }
  }
  const nomeAsp = asp.aspecto === 'Oposicao' ? 'Oposição' : asp.aspecto
  return {
    titulo: `${nomeAsp} ${asp.planetaA} · ${asp.planetaB} (orbe ${asp.orbe})`,
    texto: `O aspecto mais tenso do teu mapa é a ${nomeAsp} entre ${asp.planetaA} e ${asp.planetaB}. Esta tensão não é maldição — é combustível evolutivo. Onde sentes «puxar para lados opostos», nasce a tua maior competência quando aprendes a negociar internamente em vez de escolher um polo e rejeitar o outro.`,
    conselho: `Usa a ${nomeAsp} como professor/a: quando surgir conflito entre estas energias, pausa e pergunta «o que cada uma precisa de ser ouvida?». A integração deste aspecto é o teu superpoder de maturidade.`,
  }
}

function conselhoFinal(mapaNatal, planetas) {
  const sat = planetaPorNome(planetas, 'Saturno')
  const jup = planetaPorNome(planetas, 'Júpiter')
  const casaSat = sat?.casa
  const casaJup = jup?.casa
  return `Nos próximos meses, honra o teu Sol em ${mapaNatal?.solar?.nome || '—'} actuando com coragem na ${casaTxt(planetaPorNome(planetas, 'Sol')?.casa)}. Cuida da Lua em ${mapaNatal?.lunar?.nome || '—'} criando rotinas de segurança emocional. ${
    casaSat ? `Saturno na ${casaSat}ª Casa pede paciência estruturada — constrói tijolo a tijolo.` : ''
  } ${
    casaJup ? `Júpiter na ${casaJup}ª Casa abre portas quando te permites crescer além do conforto conhecido.` : ''
  } O cosmos não decide por ti: oferece o mapa. Tu traças o caminho.`
}

/**
 * Gera a análise completa em 5 secções obrigatórias.
 * @returns {{ seccoes: Array, textoPlano: string }}
 */
export function gerarAnaliseCompleta(mapaNatal, planetas, aspetos = [], dados = {}) {
  const sol = mapaNatal?.solar?.nome
  const lua = mapaNatal?.lunar?.nome
  const asc = mapaNatal?.ascendente?.nome
  const mc  = mapaNatal?.mc?.nome

  const pSol = planetaPorNome(planetas, 'Sol')
  const pLua = planetaPorNome(planetas, 'Lua')
  const pMer = planetaPorNome(planetas, 'Mercúrio')
  const pVen = planetaPorNome(planetas, 'Vénus')
  const pMar = planetaPorNome(planetas, 'Marte')
  const pJup = planetaPorNome(planetas, 'Júpiter')
  const pSat = planetaPorNome(planetas, 'Saturno')

  const pChi = planetaPorNome(planetas, 'Quíron')
  const pNod = planetaPorNome(planetas, 'Nodo Norte')
  const pUra = planetaPorNome(planetas, 'Urano')
  const pNep = planetaPorNome(planetas, 'Neptuno')
  const pPlu = planetaPorNome(planetas, 'Plutão')

  const tenso = sinteseAspectoTenso(aspectoTenso(aspetos))

  const blocosGeracionais = [
    pUra && { subtitulo: 'Urano — Libertação e Inovação', texto: paragrafoGeracional('Urano', pUra.signo?.nome, pUra.casa), meta: `${pUra.signo?.nome}${pUra.casa ? ` · Casa ${pUra.casa}` : ''}` },
    pNep && { subtitulo: 'Neptuno — Espiritualidade e Inspiração', texto: paragrafoGeracional('Neptuno', pNep.signo?.nome, pNep.casa), meta: `${pNep.signo?.nome}${pNep.casa ? ` · Casa ${pNep.casa}` : ''}` },
    pPlu && { subtitulo: 'Plutão — Transformação Profunda', texto: paragrafoGeracional('Plutão', pPlu.signo?.nome, pPlu.casa), meta: `${pPlu.signo?.nome}${pPlu.casa ? ` · Casa ${pPlu.casa}` : ''}` },
    pNod && { subtitulo: 'Nodo Norte — Destino Evolutivo', texto: paragrafoGeracional('Nodo Norte', pNod.signo?.nome, pNod.casa), meta: `${pNod.signo?.nome}${pNod.casa ? ` · Casa ${pNod.casa}` : ''}` },
    pChi && { subtitulo: 'Quíron — A Ferida-Sabedoria', texto: paragrafoGeracional('Quíron', pChi.signo?.nome, pChi.casa), meta: `${pChi.signo?.nome}${pChi.casa ? ` · Casa ${pChi.casa}` : ''}` },
  ].filter(Boolean)

  const seccoes = [
    {
      id: 0,
      titulo: 'Nota Metodológica',
      blocos: [
        { subtitulo: 'Efemérides · Tropical · Placidus', texto: introTecnica(mapaNatal, dados), destaque: true },
      ],
    },
    {
      id: 1,
      titulo: 'A Tua Essência Central',
      blocos: [
        { subtitulo: 'O Teu Propósito Vital (Sol)', texto: paragrafoSol(sol, pSol?.casa), meta: pSol?.casa ? `${sol} · Casa ${pSol.casa}` : sol },
        { subtitulo: 'A Tua Natureza Emocional (Lua)', texto: paragrafoLua(lua, pLua?.casa), meta: pLua?.casa ? `${lua} · Casa ${pLua.casa}` : lua },
        { subtitulo: 'A Tua Máscara Social e Impacto (Ascendente)', texto: paragrafoAsc(asc), meta: `${asc} · Casa 1` },
        { subtitulo: 'Dinâmica entre Sol, Lua e Ascendente', texto: dinamicaBig3(sol, lua, asc), destaque: true },
      ],
    },
    {
      id: 2,
      titulo: 'Mente, Relações e Acção (Planetas Pessoais)',
      blocos: [
        { subtitulo: 'Mentalidade e Comunicação (Mercúrio)', texto: paragrafoMerc(pMer?.signo?.nome, pMer?.casa), meta: pMer ? `${pMer.signo?.nome}${pMer.casa ? ` · Casa ${pMer.casa}` : ''}` : '—' },
        { subtitulo: 'Linguagem do Amor e Valores (Vénus)', texto: paragrafoVen(pVen?.signo?.nome, pVen?.casa), meta: pVen ? `${pVen.signo?.nome}${pVen.casa ? ` · Casa ${pVen.casa}` : ''}` : '—' },
        { subtitulo: 'Força de Vontade e Impulso (Marte)', texto: paragrafoMar(pMar?.signo?.nome, pMar?.casa), meta: pMar ? `${pMar.signo?.nome}${pMar.casa ? ` · Casa ${pMar.casa}` : ''}` : '—' },
      ],
    },
    {
      id: 3,
      titulo: 'Desafios, Bloqueios e Crescimento (Saturno e Júpiter)',
      blocos: [
        { subtitulo: 'A Oportunidade de Expansão (Júpiter)', texto: paragrafoJup(pJup?.signo?.nome, pJup?.casa), meta: pJup ? `${pJup.signo?.nome}${pJup.casa ? ` · Casa ${pJup.casa}` : ''}` : '—' },
        { subtitulo: 'O Teu Maior Mestre e Karma (Saturno)', texto: paragrafoSat(pSat?.signo?.nome, pSat?.casa), meta: pSat ? `${pSat.signo?.nome}${pSat.casa ? ` · Casa ${pSat.casa}` : ''}` : '—' },
      ],
    },
    {
      id: 4,
      titulo: 'Missão de Vida e Carreira (Meio do Céu)',
      blocos: [
        { subtitulo: 'Meio do Céu (MC)', texto: paragrafoMC(mc), meta: mc ? `${mc} · Casa 10` : '—' },
      ],
    },
    ...(blocosGeracionais.length > 0 ? [{
      id: 5,
      titulo: 'Dimensões Transpessoais e Kármicas',
      blocos: blocosGeracionais,
    }] : []),
    {
      id: blocosGeracionais.length > 0 ? 6 : 5,
      titulo: 'Síntese Evolutiva e Conselho Final',
      blocos: [
        { subtitulo: `Aspeto mais tenso: ${tenso.titulo}`, texto: tenso.texto, destaque: true },
        { subtitulo: 'Mensagem de orientação prática', texto: conselhoFinal(mapaNatal, planetas) + ' ' + tenso.conselho },
      ],
    },
  ]

  const textoPlano = formatarTextoPlano(seccoes, mapaNatal)
  return { seccoes, textoPlano }
}

export function formatarTextoPlano(seccoes, mapaNatal) {
  const linhas = [
    '═══════════════════════════════════════════',
    '  MAPA ASTRAL NATAL COMPLETO — SIDUS',
    '  Método: Efemérides astronómicas de precisão',
    '  Sistema: Tropical · Casas Placidus',
    `  Motor: ${mapaNatal?.motor || 'Swiss Ephemeris / astronomy-engine'}`,
    '═══════════════════════════════════════════',
    '',
  ]

  for (const sec of seccoes) {
    linhas.push(`## ${sec.id}. ${sec.titulo}`)
    linhas.push('')
    for (const b of sec.blocos) {
      linhas.push(`### ${b.subtitulo}${b.meta ? ` (${b.meta})` : ''}`)
      linhas.push(b.texto)
      linhas.push('')
    }
  }

  linhas.push('───────────────────────────────────────────')
  linhas.push('Gerado por Sidus · Astrologia Tropical Placidus')
  return linhas.join('\n')
}
