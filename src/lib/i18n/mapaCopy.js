/**
 * Textos de interpretação do mapa natal — PT e EN.
 */
import { translateSigno, translateAspecto } from './astro.js'

const TEMAS_CASA_PT = {
  1:  { nome: 'Identidade e Aparência',       foco: 'quem és, o corpo, a primeira impressão e a forma como inicias a vida' },
  2:  { nome: 'Recursos e Valores',         foco: 'dinheiro, talentos, autoestima material e o que valorizas' },
  3:  { nome: 'Comunicação e Aprendizagem', foco: 'mente concreta, irmãos, vizinhança, escrita e estudos iniciais' },
  4:  { nome: 'Raízes e Lar',               foco: 'família, ancestralidade, intimidade emocional e fundações internas' },
  5:  { nome: 'Criatividade e Prazer',      foco: 'expressão artística, romance, filhos, risco e alegria de viver' },
  6:  { nome: 'Rotina e Serviço',           foco: 'trabalho quotidiano, saúde, hábitos e refinamento pessoal' },
  7:  { nome: 'Relacionamentos',            foco: 'parcerias, casamento, contratos e o espelho do outro' },
  8:  { nome: 'Transformação Profunda',     foco: 'intimidade, crises, heranças, poder partilhado e renascimento' },
  9:  { nome: 'Expansão e Filosofia',       foco: 'viagens longas, ensino superior, fé, visão de mundo e sentido' },
  10: { nome: 'Carreira e Legado Público',  foco: 'vocação, reputação, autoridade e a marca que deixas no mundo' },
  11: { nome: 'Comunidade e Futuro',        foco: 'amizades, causas colectivas, esperança e projectos a longo prazo' },
  12: { nome: 'Inconsciente e Espiritualidade', foco: 'sonhos, retiro, karma, compaixão e o que opera nos bastidores' },
}

const TEMAS_CASA_EN = {
  1:  { nome: 'Identity & Appearance',       foco: 'who you are, the body, first impression and how you begin life' },
  2:  { nome: 'Resources & Values',          foco: 'money, talents, material self-worth and what you value' },
  3:  { nome: 'Communication & Learning',    foco: 'concrete mind, siblings, neighbourhood, writing and early studies' },
  4:  { nome: 'Roots & Home',                foco: 'family, ancestry, emotional intimacy and inner foundations' },
  5:  { nome: 'Creativity & Pleasure',       foco: 'artistic expression, romance, children, risk and joy of living' },
  6:  { nome: 'Routine & Service',           foco: 'daily work, health, habits and personal refinement' },
  7:  { nome: 'Relationships',               foco: 'partnerships, marriage, contracts and the mirror of the other' },
  8:  { nome: 'Deep Transformation',         foco: 'intimacy, crises, inheritances, shared power and rebirth' },
  9:  { nome: 'Expansion & Philosophy',      foco: 'long journeys, higher education, faith, worldview and meaning' },
  10: { nome: 'Career & Public Legacy',      foco: 'vocation, reputation, authority and the mark you leave on the world' },
  11: { nome: 'Community & Future',          foco: 'friendships, collective causes, hope and long-term projects' },
  12: { nome: 'Unconscious & Spirituality',  foco: 'dreams, retreat, karma, compassion and what operates behind the scenes' },
}

const ESSENCIA_PT = {
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

const ESSENCIA_EN = {
  Carneiro: 'courageous initiative, autonomy and drive to forge new paths',
  Touro: 'sensory stability, persistence and building lasting value',
  Gémeos: 'mental curiosity, adaptability and dialogue as a path of growth',
  Caranguejo: 'emotional depth, protection and affective memory',
  Leão: 'radiant creativity, generosity and need for authentic expression',
  Virgem: 'discernment, conscious service and refinement of daily life',
  Balança: 'diplomacy, sense of justice and growth through relationship',
  Escorpião: 'transformative intensity, psychic courage and rebirth',
  Sagitário: 'philosophical expansion, visionary optimism and search for meaning',
  Capricórnio: 'strategic discipline, responsibility and legacy building',
  Aquário: 'originality, humanitarian vision and intellectual independence',
  Peixes: 'compassion, imagination and connection to the symbolic and spiritual plane',
}

const ELEMENTO_PT = {
  Carneiro: 'Fogo', Leão: 'Fogo', Sagitário: 'Fogo',
  Touro: 'Terra', Virgem: 'Terra', Capricórnio: 'Terra',
  Gémeos: 'Ar', Balança: 'Ar', Aquário: 'Ar',
  Caranguejo: 'Água', Escorpião: 'Água', Peixes: 'Água',
}

const ELEMENTO_EN = {
  Carneiro: 'Fire', Leão: 'Fire', Sagitário: 'Fire',
  Touro: 'Earth', Virgem: 'Earth', Capricórnio: 'Earth',
  Gémeos: 'Air', Balança: 'Air', Aquário: 'Air',
  Caranguejo: 'Water', Escorpião: 'Water', Peixes: 'Water',
}

const MODALIDADE_PT = {
  Carneiro: 'Cardinal', Caranguejo: 'Cardinal', Balança: 'Cardinal', Capricórnio: 'Cardinal',
  Touro: 'Fixo', Leão: 'Fixo', Escorpião: 'Fixo', Aquário: 'Fixo',
  Gémeos: 'Mutável', Virgem: 'Mutável', Sagitário: 'Mutável', Peixes: 'Mutável',
}

const MODALIDADE_EN = {
  Carneiro: 'Cardinal', Caranguejo: 'Cardinal', Balança: 'Cardinal', Capricórnio: 'Cardinal',
  Touro: 'Fixed', Leão: 'Fixed', Escorpião: 'Fixed', Aquário: 'Fixed',
  Gémeos: 'Mutable', Virgem: 'Mutable', Sagitário: 'Mutable', Peixes: 'Mutable',
}

const LABELS = {
  pt: {
    casaCalc: 'uma área ainda a calcular',
    sec0: 'Nota Metodológica', sec1: 'A Tua Essência Central', sec2: 'Mente, Relações e Acção (Planetas Pessoais)',
    sec3: 'Desafios, Bloqueios e Crescimento (Saturno e Júpiter)', sec4: 'Missão de Vida e Carreira (Meio do Céu)',
    sec5: 'Dimensões Transpessoais e Kármicas', sec6: 'Síntese Evolutiva e Conselho Final',
    sol: 'O Teu Propósito Vital (Sol)', lua: 'A Tua Natureza Emocional (Lua)', asc: 'A Tua Máscara Social e Impacto (Ascendente)',
    big3: 'Dinâmica entre Sol, Lua e Ascendente', mer: 'Mentalidade e Comunicação (Mercúrio)',
    ven: 'Linguagem do Amor e Valores (Vénus)', mar: 'Força de Vontade e Impulso (Marte)',
    jup: 'A Oportunidade de Expansão (Júpiter)', sat: 'O Teu Maior Mestre e Karma (Saturno)',
    mc: 'Meio do Céu (MC)', urano: 'Urano — Libertação e Inovação', neptuno: 'Neptuno — Espiritualidade e Inspiração',
    plutao: 'Plutão — Transformação Profunda', nodo: 'Nodo Norte — Destino Evolutivo', quiron: 'Quíron — A Ferida-Sabedoria',
    tensoTitulo: 'Aspeto mais tenso', orientacao: 'Mensagem de orientação prática',
    harmonia: 'Harmonia estrutural',
    pdfHeader: 'MAPA ASTRAL NATAL COMPLETO — SIDUS',
    pdfMethod: 'Método: Efemérides astronómicas de precisão',
    pdfSystem: 'Sistema: Tropical · Casas Placidus',
    pdfFooter: 'Gerado por Sidus · Astrologia Tropical Placidus',
    gancho: 'O mapa completo inclui Mercúrio, Vénus, Marte, Júpiter, Saturno, MC, aspectos, casas Placidus e interpretação profissional em PDF.',
  },
  en: {
    casaCalc: 'an area still being calculated',
    sec0: 'Methodological Note', sec1: 'Your Central Essence', sec2: 'Mind, Relationships & Action (Personal Planets)',
    sec3: 'Challenges, Blocks & Growth (Saturn & Jupiter)', sec4: 'Life Mission & Career (Midheaven)',
    sec5: 'Transpersonal & Karmic Dimensions', sec6: 'Evolutionary Synthesis & Final Guidance',
    sol: 'Your Vital Purpose (Sun)', lua: 'Your Emotional Nature (Moon)', asc: 'Your Social Mask & Impact (Ascendant)',
    big3: 'Dynamics between Sun, Moon & Ascendant', mer: 'Mindset & Communication (Mercury)',
    ven: 'Love Language & Values (Venus)', mar: 'Willpower & Drive (Mars)',
    jup: 'The Opportunity for Expansion (Jupiter)', sat: 'Your Greatest Teacher & Karma (Saturn)',
    mc: 'Midheaven (MC)', urano: 'Uranus — Liberation & Innovation', neptuno: 'Neptune — Spirituality & Inspiration',
    plutao: 'Pluto — Deep Transformation', nodo: 'North Node — Evolutionary Destiny', quiron: 'Chiron — The Wound-Wisdom',
    tensoTitulo: 'Most tense aspect', orientacao: 'Practical guidance message',
    harmonia: 'Structural harmony',
    pdfHeader: 'COMPLETE NATAL CHART — SIDUS',
    pdfMethod: 'Method: Precision astronomical ephemerides',
    pdfSystem: 'System: Tropical · Placidus Houses',
    pdfFooter: 'Generated by Sidus · Tropical Placidus Astrology',
    gancho: 'The full chart includes Mercury, Venus, Mars, Jupiter, Saturn, MC, aspects, Placidus houses and professional PDF interpretation.',
  },
}

export function getMapaCopy(lang = 'pt') {
  const L = LABELS[lang] || LABELS.pt
  const temas = lang === 'en' ? TEMAS_CASA_EN : TEMAS_CASA_PT
  const essencia = lang === 'en' ? ESSENCIA_EN : ESSENCIA_PT
  const elemento = lang === 'en' ? ELEMENTO_EN : ELEMENTO_PT
  const modalidade = lang === 'en' ? MODALIDADE_EN : MODALIDADE_PT
  const sn = (s) => translateSigno(s, lang)

  function casaTxt(casa) {
    if (!casa) return L.casaCalc
    const t = temas[casa]
    return t
      ? (lang === 'en' ? `House ${casa} (${t.nome}) — ${t.foco}` : `Casa ${casa} (${t.nome}) — ${t.foco}`)
      : (lang === 'en' ? `House ${casa}` : `Casa ${casa}`)
  }

  function paragrafoGeracional(nome, signo, casa) {
    const s = sn(signo)
    const ess = essencia[signo] || ''
    const foco = casa ? temas[casa]?.foco : ''
    const texts = lang === 'en' ? {
      Urano: `Uranus in ${s}${casa ? ` in the ${casa}th House` : ''} marks your relationship with freedom, innovation and necessary ruptures. ${ess} ${casa ? `Personal revolutions activate in ${foco}.` : ''} Where you feel suffocated by obsolete routines, Uranus demands radical authenticity.`,
      Neptuno: `Neptune in ${s}${casa ? ` in the ${casa}th House` : ''} opens doors to the symbolic, spiritual and creative plane. ${ess} ${casa ? `Dissolution of boundaries operates in ${foco}.` : ''} Beware of illusions — Neptune also clouds; intuition needs grounding.`,
      Plutão: `Pluto in ${s}${casa ? ` in the ${casa}th House` : ''} indicates where deep transformation is inevitable. ${ess} ${casa ? `Regenerative crises concentrate in ${foco}.` : ''} What dies here is reborn with more authentic power.`,
      'Nodo Norte': `The North Node in ${s}${casa ? ` in the ${casa}th House` : ''} points to your soul's evolutionary direction in this life: ${ess || 'karmic growth'}. ${casa ? `The evolutionary destiny links to ${foco}.` : ''} South Node habits are comfortable but no longer serve you.`,
      Quíron: `Chiron in ${s}${casa ? ` in the ${casa}th House` : ''} reveals the wound-wisdom — where you feel inadequate and where, precisely because of that, you can heal others. ${casa ? `Healing passes through ${foco}.` : ''}`,
    } : {
      Urano: `Urano em ${s}${casa ? ` na ${casa}ª Casa` : ''} marca a tua relação com a liberdade, a inovação e as rupturas necessárias. ${ess} ${casa ? `Revoluções pessoais activam-se em ${foco}.` : ''} Onde te sentes sufocado por rotinas obsoletas, Urano pede autenticidade radical.`,
      Neptuno: `Neptuno em ${s}${casa ? ` na ${casa}ª Casa` : ''} abre portas ao plano simbólico, espiritual e criativo. ${ess} ${casa ? `A dissolução de fronteiras opera em ${foco}.` : ''} Cuidado com ilusões — Neptuno também nebuliza; a intuição precisa de ancoragem.`,
      Plutão: `Plutão em ${s}${casa ? ` na ${casa}ª Casa` : ''} indica onde a transformação profunda é inevitável. ${ess} ${casa ? `Crises regeneradoras concentram-se em ${foco}.` : ''} O que morre aqui renasce com mais poder autêntico.`,
      'Nodo Norte': `O Nodo Norte em ${s}${casa ? ` na ${casa}ª Casa` : ''} aponta a direcção evolutiva da tua alma nesta vida: ${ess || 'crescimento kármico'}. ${casa ? `O destino evolutivo liga-se a ${foco}.` : ''} Os hábitos do Nodo Sul (signo oposto) são confortáveis mas já não te servem.`,
      Quíron: `Quíron em ${s}${casa ? ` na ${casa}ª Casa` : ''} revela a ferida-sabedoria — o ponto onde sentes inadequação e onde, precisamente por isso, podes curar outros. ${casa ? `A cura passa por ${foco}.` : ''}`,
    }
    return texts[nome] || (lang === 'en'
      ? `${nome} in ${s}${casa ? ` in House ${casa}` : ''} colours transpersonal dimensions of your chart.`
      : `${nome} em ${s}${casa ? ` na Casa ${casa}` : ''} colore dimensões transpersonais do teu mapa.`)
  }

  function introTecnica(mapaNatal, dados) {
    const motor = mapaNatal?.motor || 'Swiss Ephemeris / NASA JPL'
    if (lang === 'en') {
      return `This natal chart was calculated using astronomical ephemerides (${motor}), in the **Tropical** system with **Placidus Houses** — the professional standard used by certified astrologers worldwide. The ecliptic degrees reflect the exact position of celestial bodies at birth${dados?.cidade ? ` in ${dados.cidade}` : ''}${dados?.data ? `, ${dados.data}` : ''}${dados?.hora ? ` at ${dados.hora}` : ''}. Each planet in a Placidus house indicates *where* in life that sign's energy manifests concretely.`
    }
    return `Este mapa natal foi calculado pelo método das efemérides astronómicas (${motor}), no sistema **Tropical** com **Casas Placidus** — o padrão profissional utilizado por astrólogos certificados internacionalmente. Os graus eclípticos reflectem a posição exacta dos corpos celestes no momento do nascimento${dados?.cidade ? ` em ${dados.cidade}` : ''}${dados?.data ? `, ${dados.data}` : ''}${dados?.hora ? ` às ${dados.hora}` : ''}. Cada planeta numa casa Placidus indica *onde* na vida a energia desse signo se manifesta concretamente.`
  }

  function gerarResumoGratuito(mapaNatal) {
    const sol = mapaNatal?.solar?.nome
    const lua = mapaNatal?.lunar?.nome
    const asc = mapaNatal?.ascendente?.nome
    if (lang === 'en') {
      return {
        sol: sol ? `Your Sun in ${sn(sol)} defines the core of your identity — but in which *house* do you shine? That changes everything.` : null,
        lua: lua ? `The Moon in ${sn(lua)} regulates your emotional world. The lunar house reveals where you seek security — reserved for the full chart.` : null,
        asc: asc ? `Ascendant in ${sn(asc)}: the world sees you through this lens. The Sun–Moon–Ascendant combination forms your unique psychic signature.` : null,
        gancho: L.gancho,
      }
    }
    return {
      sol: sol ? `O teu Sol em ${sn(sol)} define o núcleo da tua identidade — mas em que *casa* brilhas? Isso muda tudo.` : null,
      lua: lua ? `A Lua em ${sn(lua)} regula o teu mundo emocional. A casa lunar revela onde buscas segurança — informação reservada ao mapa completo.` : null,
      asc: asc ? `Ascendente em ${sn(asc)}: o mundo vê-te através desta lente. A combinação Sol–Lua–Ascendente forma a tua assinatura psíquica única.` : null,
      gancho: L.gancho,
    }
  }

  function paragrafoSol(signo, casa) {
    const s = sn(signo)
    const extra = lang === 'en'
      ? (signo === 'Escorpião' || signo === 'Capricórnio' || signo === 'Virgem'
        ? ' Your strength lies in depth and persistence — the world recognises your competence when you stop hiding what you know.'
        : signo === 'Leão' || signo === 'Carneiro' || signo === 'Sagitário'
          ? ' You need stage and purpose: without authentic expression, vitality turns into restlessness.'
          : ' Astrological maturity comes from honouring this sign when you choose to be true to yourself.')
      : (signo === 'Escorpião' || signo === 'Capricórnio' || signo === 'Virgem'
        ? ' A tua força reside na profundidade e na persistência — o mundo reconhece a tua competência quando deixas de esconder o que sabes.'
        : signo === 'Leão' || signo === 'Carneiro' || signo === 'Sagitário'
          ? ' Precisas de palco e propósito: sem expressão autêntica, a vitalidade transforma-se em inquietação.'
          : ' A maturidade astrológica passa por honrar este signo nos momentos em que escolhes ser fiel a ti mesmo/a.')
    const casaPart = casa
      ? (lang === 'en'
        ? `This is the stage where your light must shine: ${temas[casa]?.foco || 'your area of personal fulfilment'}. When you honour this house, you feel vitality; when you ignore it, the soul quietly grows ill.`
        : `Este é o palco onde a tua luz precisa de brilhar: ${temas[casa]?.foco || 'a tua área de realização pessoal'}. Quando honras esta casa, sentes vitalidade; quando a ignoras, a alma adoece silenciosamente.`)
      : (lang === 'en'
        ? 'Your purpose manifests whenever you act with authenticity and courage to be who you truly are.'
        : 'O teu propósito manifesta-se sempre que ages com autenticidade e coragem de ser quem realmente és.')
    const intro = lang === 'en'
      ? `With the Sun in ${s}${casa ? ` in the ${casa}th House` : ''}, your conscious identity expresses ${essencia[signo] || 'a unique essence'}. `
      : `Com o Sol em ${s}${casa ? ` na ${casa}ª Casa` : ''}, a tua identidade consciente expressa ${essencia[signo] || 'uma essência única'}. `
    return intro + casaPart + extra
  }

  function paragrafoLua(signo, casa) {
    const s = sn(signo)
    if (lang === 'en') {
      return `The Moon in ${s}${casa ? ` in the ${casa}th House` : ''} describes your emotional world: ${essencia[signo] || 'a particular sensitivity'}. Under stress, you regress to these instinctive patterns. ${casa ? `Emotional security anchors in ${temas[casa]?.foco || 'themes of this house'}. Nurturing this area is caring for your inner foundation.` : 'Your affective needs ask for recognition — they are not weakness, they are compass.'}`
    }
    return `A Lua em ${s}${casa ? ` na ${casa}ª Casa` : ''} descreve o teu mundo emocional: ${essencia[signo] || 'uma sensibilidade particular'}. Sob stress, regresses a estes padrões instintivos. ${casa ? `A segurança emocional ancora-se em ${temas[casa]?.foco || 'temas desta casa'}. Nutrir esta área é cuidar da tua base interior.` : 'As tuas necessidades afectivas pedem reconhecimento — não são fraqueza, são bússola.'}`
  }

  function paragrafoAsc(signo) {
    const s = sn(signo)
    if (lang === 'en') {
      return `The Ascendant in ${s} is the natural mask with which you enter the world: ${essencia[signo] || 'a distinct presence'}. It is the first impression you make and the body-vehicle of your evolutionary journey. By consciously integrating this sign, you stop "acting" the persona and begin to inhabit it with authentic presence.`
    }
    return `O Ascendente em ${s} é a máscara natural com que entras no mundo: ${essencia[signo] || 'uma presença distinta'}. É a primeira impressão que causas e o corpo-veículo da tua jornada evolutiva. Ao integrar conscientemente este signo, deixas de «actuar» a persona e passas a habitá-la com presença autêntica.`
  }

  function dinamicaBig3(sol, lua, asc) {
    if (!sol || !lua || !asc) {
      return lang === 'en'
        ? 'The interaction between Sun, Moon and Ascendant reveals the choreography between who you are (Sun), what you feel (Moon) and how you present yourself (Ascendant). Integrating these three poles is the first step of astrological maturity.'
        : 'A interacção entre Sol, Lua e Ascendente revela a coreografia entre quem és (Sol), o que sentes (Lua) e como te apresentas (Ascendente). Integrar estes três polos é o primeiro passo da maturidade astrológica.'
    }
    const eSol = elemento[sol], eLua = elemento[lua], eAsc = elemento[asc]
    const mSol = modalidade[sol], mLua = modalidade[lua]
    const partes = []
    const ss = sn(sol), sl = sn(lua), sa = sn(asc)

    if (eSol !== eLua) {
      const tensao = lang === 'en'
        ? ((eSol === 'Fire' && eLua === 'Water') || (eSol === 'Water' && eLua === 'Fire') ? 'between impulsive action and emotional depth'
          : (eSol === 'Air' && eLua === 'Earth') || (eSol === 'Earth' && eLua === 'Air') ? 'between abstract mind and need for concreteness'
          : (eSol === 'Fire' && eLua === 'Earth') || (eSol === 'Earth' && eLua === 'Fire') ? 'between impulse and prudence'
          : 'between different elemental styles that ask for conscious translation')
        : ((eSol === 'Fogo' && eLua === 'Água') || (eSol === 'Água' && eLua === 'Fogo') ? 'entre a acção impulsiva e a profundidade emocional'
          : (eSol === 'Ar' && eLua === 'Terra') || (eSol === 'Terra' && eLua === 'Ar') ? 'entre a mente abstracta e a necessidade de concretude'
          : (eSol === 'Fogo' && eLua === 'Terra') || (eSol === 'Terra' && eLua === 'Fogo') ? 'entre impulso e prudência'
          : 'entre estilos elementais diferentes que pedem tradução consciente')
      partes.push(lang === 'en'
        ? `Sun (${ss}/${eSol}) and Moon (${sl}/${eLua}) dialogue with tension ${tensao}. They are not internal enemies — they are two languages your psyche speaks.`
        : `Sol (${ss}/${eSol}) e Lua (${sl}/${eLua}) dialogam com tensão ${tensao}. Não se tratam de inimigos internos — são dois idiomas que a tua psique fala.`)
    } else {
      partes.push(lang === 'en'
        ? `Sun and Moon in the same element (${eSol}) confer emotional-identity coherence: you feel and act aligned, though you may lack creative contrast.`
        : `Sol e Lua no mesmo elemento (${eSol}) conferem coerência emocional-identitária: sentes e ages alinhados, embora possas carecer de contraste criativo.`)
    }

    if (eAsc !== eSol) {
      partes.push(lang === 'en'
        ? `The Ascendant in ${sa} (${eAsc}) colours how the world reads your Sun in ${ss}: sometimes you are perceived differently from your inner essence — use this as a resource, not a contradiction.`
        : `O Ascendente em ${sa} (${eAsc}) colore a forma como o mundo lê o teu Sol em ${ss}: por vezes és percebido/a de forma diferente da tua essência íntima — usar isso como recurso, não como contradição.`)
    } else {
      partes.push(lang === 'en'
        ? 'Ascendant and Sun share element: your public image reinforces identity — transparency and authenticity are your social superpower.'
        : 'Ascendente e Sol partilham elemento: a tua imagem pública reforça a identidade — transparência e autenticidade são o teu superpoder social.')
    }

    if (mSol !== mLua) {
      partes.push(lang === 'en'
        ? `Different modalities (Sun ${mSol}, Moon ${mLua}) indicate different internal rhythms: knowing when to initiate, sustain or adapt is key to your balance.`
        : `Modalidades distintas (Sol ${mSol}, Lua ${mLua}) indicam ritmos internos diferentes: saber quando iniciar, sustentar ou adaptar é chave para o teu equilíbrio.`)
    }
    return partes.join(' ')
  }

  function paragrafoMerc(signo, casa) {
    const s = sn(signo)
    if (lang === 'en') return `Mercury in ${s}${casa ? ` in the ${casa}th House` : ''} defines how you think, learn and communicate: ${essencia[signo] || 'your own mental style'}. ${casa ? `The mind activates especially in ${temas[casa]?.foco || 'themes of this house'}.` : ''} Write, speak and question from this place — that is where your intelligence flourishes.`
    return `Mercúrio em ${s}${casa ? ` na ${casa}ª Casa` : ''} define como pensas, aprendes e comunicas: ${essencia[signo] || 'um estilo mental próprio'}. ${casa ? `A mente activa-se especialmente em ${temas[casa]?.foco || 'temas desta casa'}.` : ''} Escreve, fala e questiona a partir deste lugar — é aí que a tua inteligência floresce.`
  }

  function paragrafoVen(signo, casa) {
    const s = sn(signo)
    if (lang === 'en') return `Venus in ${s}${casa ? ` in the ${casa}th House` : ''} reveals your love language and what magnetises you: ${essencia[signo] || 'unique relational values'}. ${casa ? `Abundance and pleasure flow when you cultivate ${temas[casa]?.foco || 'this area of life'}.` : ''}`
    return `Vénus em ${s}${casa ? ` na ${casa}ª Casa` : ''} revela a tua linguagem de amor e o que magnetiza: ${essencia[signo] || 'valores relacionais únicos'}. ${casa ? `A abundância e o prazer fluem quando cultivas ${temas[casa]?.foco || 'esta área da vida'}.` : ''}`
  }

  function paragrafoMar(signo, casa) {
    const s = sn(signo)
    if (lang === 'en') return `Mars in ${s}${casa ? ` in the ${casa}th House` : ''} indicates how you assert desires, handle anger and initiate: ${essencia[signo] || 'a particular action energy'}. ${casa ? `Vital impulse concentrates in ${temas[casa]?.foco || 'themes of this house'}. Channel this force to avoid explosions or passivity.` : 'The key is using your courage for goals that dignify you.'}`
    return `Marte em ${s}${casa ? ` na ${casa}ª Casa` : ''} indica como assertas desejos, lidas com a raiva e inicias: ${essencia[signo] || 'uma energia de acção particular'}. ${casa ? `O impulso vital concentra-se em ${temas[casa]?.foco || 'temas desta casa'}. Canalizar esta força evita explosões ou passividade.` : 'A chave é usar a tua coragem a favor de objectivos que te dignifiquem.'}`
  }

  function paragrafoJup(signo, casa) {
    const s = sn(signo)
    if (lang === 'en') return `Jupiter in ${s}${casa ? ` in the ${casa}th House` : ''} points where life expands most easily: ${essencia[signo] || 'optimism and growth'}. ${casa ? `Your philosophical "luck" activates in ${temas[casa]?.foco || 'this sphere'}. Trust, but do not exaggerate — Jupiter also inflates.` : ''}`
    return `Júpiter em ${s}${casa ? ` na ${casa}ª Casa` : ''} aponta onde a vida te expande com mais facilidade: ${essencia[signo] || 'optimismo e crescimento'}. ${casa ? `A tua «sorte» filosófica activa-se em ${temas[casa]?.foco || 'esta esfera'}. Confia, mas não exageres — Júpiter também inflaciona.` : ''}`
  }

  function paragrafoSat(signo, casa) {
    const s = sn(signo)
    if (lang === 'en') return `Saturn in ${s}${casa ? ` in the ${casa}th House` : ''} is your karmic teacher: ${essencia[signo] || 'lessons of maturity'}. ${casa ? `Here you fear failure until you build solid competence in ${temas[casa]?.foco || 'themes of this house'}. Discipline in this area becomes your throne.` : ''} Saturn does not punish — it teaches through time.`
    return `Saturno em ${s}${casa ? ` na ${casa}ª Casa` : ''} é o teu mestre kármico: ${essencia[signo] || 'lições de maturidade'}. ${casa ? `Aqui sentes medo do fracasso até construíres competência sólida em ${temas[casa]?.foco || 'temas desta casa'}. A disciplina nesta área torna-se o teu trono.` : ''} Saturno não pune — ensina através do tempo.`
  }

  function paragrafoMC(signo) {
    const s = sn(signo)
    if (lang === 'en') {
      const tail = signo === 'Capricórnio' || signo === 'Virgem' || signo === 'Touro' ? 'and consistency'
        : signo === 'Leão' || signo === 'Carneiro' || signo === 'Sagitário' ? 'and inspiring leadership' : 'and strategic sensitivity'
      return `The Midheaven in ${s} defines your public vocation and the legacy you seek to leave: ${essencia[signo] || 'a unique professional mission'}. The ideal career is not just a job — it is the visible expression of your inner authority. In ${s}, the world recognises you when you ${temas[10]?.foco || 'take your place on the social stage'} with authenticity ${tail}.`
    }
    const tail = signo === 'Capricórnio' || signo === 'Virgem' || signo === 'Touro' ? 'e consistência'
      : signo === 'Leão' || signo === 'Carneiro' || signo === 'Sagitário' ? 'e liderança inspiradora' : 'e sensibilidade estratégica'
    return `O Meio do Céu em ${s} define a tua vocação pública e o legado que buscas deixar: ${essencia[signo] || 'uma missão profissional única'}. A carreira ideal não é apenas um emprego — é a expressão visível da tua autoridade interior. Em ${s}, o mundo reconhece-te quando ${temas[10]?.foco || 'assumes o teu lugar no palco social'} com autenticidade ${tail}.`
  }

  function sinteseAspectoTenso(asp) {
    if (!asp) {
      return lang === 'en' ? {
        titulo: L.harmonia,
        texto: 'There is no dominant square or opposition among major aspects — this does not mean an easy life, but indicates your personal planets dialogue with relative fluidity. Your growth will come from integrating subtle polarities (Sun/Moon/Ascendant) rather than major internal clashes.',
        conselho: 'Deepen self-knowledge in the house areas that move you most emotionally.',
      } : {
        titulo: L.harmonia,
        texto: 'Não há quadratura ou oposição dominante nos aspectos principais — isso não significa vida fácil, mas indica que os teus planetas pessoais dialogam com relativa fluidez. O teu crescimento virá de integrar polaridades subtis (Sol/Lua/Ascendente) em vez de grandes choques internos.',
        conselho: 'Aprofunda autoconhecimento nas áreas de casa que mais te movem emocionalmente.',
      }
    }
    const nomeAsp = asp.aspecto === 'Oposicao' ? (lang === 'en' ? 'Opposition' : 'Oposição') : (lang === 'en' ? translateAspecto(asp.aspecto, 'en') : asp.aspecto)
    const pA = lang === 'en' ? (asp.planetaA === 'Sol' ? 'Sun' : asp.planetaA) : asp.planetaA
    const pB = lang === 'en' ? (asp.planetaB === 'Lua' ? 'Moon' : asp.planetaB) : asp.planetaB
    if (lang === 'en') {
      return {
        titulo: `${nomeAsp} ${pA} · ${pB} (orb ${asp.orbe})`,
        texto: `The most tense aspect in your chart is the ${nomeAsp} between ${pA} and ${pB}. This tension is not a curse — it is evolutionary fuel. Where you feel "pulled in opposite directions", your greatest competence is born when you learn to negotiate internally instead of choosing one pole and rejecting the other.`,
        conselho: `Use the ${nomeAsp} as your teacher: when conflict arises between these energies, pause and ask "what does each need to be heard?". Integrating this aspect is your maturity superpower.`,
      }
    }
    return {
      titulo: `${nomeAsp} ${asp.planetaA} · ${asp.planetaB} (orbe ${asp.orbe})`,
      texto: `O aspecto mais tenso do teu mapa é a ${nomeAsp} entre ${asp.planetaA} e ${asp.planetaB}. Esta tensão não é maldição — é combustível evolutivo. Onde sentes «puxar para lados opostos», nasce a tua maior competência quando aprendes a negociar internamente em vez de escolher um polo e rejeitar o outro.`,
      conselho: `Usa a ${nomeAsp} como professor/a: quando surgir conflito entre estas energias, pausa e pergunta «o que cada uma precisa de ser ouvida?». A integração deste aspecto é o teu superpoder de maturidade.`,
    }
  }

  function conselhoFinal(mapaNatal, planetas, planetaPorNome) {
    const sat = planetaPorNome(planetas, 'Saturno')
    const jup = planetaPorNome(planetas, 'Júpiter')
    const solP = planetaPorNome(planetas, 'Sol')
    const casaSat = sat?.casa
    const casaJup = jup?.casa
    const sol = sn(mapaNatal?.solar?.nome || '—')
    const lua = sn(mapaNatal?.lunar?.nome || '—')
    if (lang === 'en') {
      return `In the coming months, honour your Sun in ${sol} by acting with courage in ${casaTxt(solP?.casa)}. Care for the Moon in ${lua} by creating emotional security routines. ${casaSat ? `Saturn in the ${casaSat}th House asks for structured patience — build brick by brick.` : ''} ${casaJup ? `Jupiter in the ${casaJup}th House opens doors when you allow yourself to grow beyond known comfort.` : ''} The cosmos does not decide for you: it offers the map. You trace the path.`
    }
    return `Nos próximos meses, honra o teu Sol em ${sol} actuando com coragem na ${casaTxt(solP?.casa)}. Cuida da Lua em ${lua} criando rotinas de segurança emocional. ${casaSat ? `Saturno na ${casaSat}ª Casa pede paciência estruturada — constrói tijolo a tijolo.` : ''} ${casaJup ? `Júpiter na ${casaJup}ª Casa abre portas quando te permites crescer além do conforto conhecido.` : ''} O cosmos não decide por ti: oferece o mapa. Tu traças o caminho.`
  }

  return {
    L, casaTxt, paragrafoGeracional, introTecnica, gerarResumoGratuito,
    paragrafoSol, paragrafoLua, paragrafoAsc, dinamicaBig3,
    paragrafoMerc, paragrafoVen, paragrafoMar, paragrafoJup, paragrafoSat, paragrafoMC,
    sinteseAspectoTenso, conselhoFinal, sn,
  }
}
