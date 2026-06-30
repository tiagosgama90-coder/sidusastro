/**
 * Narrativas personalizadas de sinastria - textos íntimos por utilizador.
 */

const SIGNO_PT = {
  Carneiro: 'Carneiro', Touro: 'Touro', Gémeos: 'Gémeos', Caranguejo: 'Caranguejo',
  Leão: 'Leão', Virgem: 'Virgem', Balança: 'Balança', Escorpião: 'Escorpião',
  Sagitário: 'Sagitário', Capricórnio: 'Capricórnio', Aquário: 'Aquário', Peixes: 'Peixes',
}

const MISSAO_SOL_LONGA = {
  Carneiro: {
    pt: (n) => `${n}, com o Sol em Carneiro, nasceu para iniciar. A tua missão de vida pede coragem para ser o primeiro, para abrir portas onde outros hesitam. Não precisas de pedir permissão para liderar - precisas de aprender a canalizar o impulso sem queimar pontes. O fogo que trazes ao mundo inspira acção; quando está consciente, torna-te motor de transformação para quem te rodeia.`,
    en: (n) => `${n}, with the Sun in Aries, you were born to initiate. Your life mission asks for courage to be first, to open doors where others hesitate. You don't need permission to lead - you need to learn channelling impulse without burning bridges. The fire you bring inspires action; when conscious, you become an engine of transformation for those around you.`,
  },
  Touro: {
    pt: (n) => `${n}, o Sol em Touro revela uma missão ligada à terra, ao corpo e ao que perdura. Vieste construir valor - beleza, segurança, presença sensorial. A tua alma recusa pressa superficial; pede-te enraizar, cultivar, fazer florescer o que merece tempo. Quem te ama sente estabilidade; quem te ignora perde contacto com o que é sólido na vida.`,
    en: (n) => `${n}, the Sun in Taurus reveals a mission tied to earth, body and what endures. You came to build value - beauty, security, sensory presence. Your soul refuses superficial haste; it asks you to root, cultivate, make what deserves time flourish. Those who love you feel stability; those who ignore you lose touch with what is solid in life.`,
  },
  Gémeos: {
    pt: (n) => `${n}, com Sol em Gémeos, a tua missão passa por conectar mundos através das palavras e das ideias. És ponte entre perspectivas - tradutor, mensageiro, curioso eterno. A vida pede-te flexibilidade mental e honestidade intelectual. Quando disperso, perdes profundidade; quando focado, iluminas caminhos que outros não viam.`,
    en: (n) => `${n}, with Sun in Gemini, your mission is connecting worlds through words and ideas. You are a bridge between perspectives - translator, messenger, eternal curious mind. Life asks mental flexibility and intellectual honesty. When scattered you lose depth; when focused you illuminate paths others didn't see.`,
  },
  Caranguejo: {
    pt: (n) => `${n}, o Sol em Caranguejo indica missão de acolher, proteger e dar raízes emocionais. A tua alma sente antes de pensar - e isso é dom, não fraqueza. Vieste nutrir laços, memória, pertença. O desafio é não te fechares na concha quando a vulnerabilidade assusta; o dom é criar refúgio autêntico para ti e para quem confia em ti.`,
    en: (n) => `${n}, Sun in Cancer indicates a mission to welcome, protect and give emotional roots. Your soul feels before it thinks - and that is gift, not weakness. You came to nurture bonds, memory, belonging. The challenge is not closing in your shell when vulnerability scares you; the gift is creating authentic refuge for yourself and those who trust you.`,
  },
  Leão: {
    pt: (n) => `${n}, com Sol em Leão, a missão é irradiar - criar, celebrar, inspirar confiança. O teu coração pede palco não por vaidade vazia, mas por necessidade de partilhar luz. Aprendes ao longo da vida que liderar é servir com generosidade. Quem te vê de verdade reconhece um sol que aquece sem consumir.`,
    en: (n) => `${n}, with Sun in Leo, the mission is to radiate - create, celebrate, inspire confidence. Your heart asks for stage not from empty vanity, but from need to share light. You learn through life that leading is serving generously. Those who truly see you recognize a sun that warms without consuming.`,
  },
  Virgem: {
    pt: (n) => `${n}, Sol em Virgem - missão de aperfeiçoar, curar e servir com discernimento. Vieste refinar o caos em ordem útil. A tua mente vê detalhes que outros ignoram; o corpo fala contigo sobre equilíbrio. O perigo é a autocrítica paralisante; a virtude é transformar cuidado em medicina silenciosa para o mundo.`,
    en: (n) => `${n}, Sun in Virgo - mission to refine, heal and serve with discernment. You came to turn chaos into useful order. Your mind sees details others ignore; your body speaks about balance. The danger is paralysing self-criticism; the virtue is turning care into silent medicine for the world.`,
  },
  Balança: {
    pt: (n) => `${n}, com Sol em Balança, a vida pede equilíbrio, justiça e beleza nas relações. És diplomata nato da alma - vês ambos os lados e sofres com desarmonia. A missão não é agradar a todos, mas criar pontes honestas. O parceiro ideal reconhece a tua necessidade de parceria sem te reduzir a reflexo do outro.`,
    en: (n) => `${n}, with Sun in Libra, life asks balance, justice and beauty in relationships. You are the soul's natural diplomat - you see both sides and suffer from disharmony. The mission is not pleasing everyone, but building honest bridges. The ideal partner recognizes your need for partnership without reducing you to the other's mirror.`,
  },
  Escorpião: {
    pt: (n) => `${n}, Sol em Escorpião - missão de transformação profunda. Vieste mergulhar onde outros temem, revelar verdades ocultas, regenerar. A intensidade emocional é o teu combustível; a traição da confiança é a tua ferida. Quem te ama precisa de profundidade real, não de superfície polida.`,
    en: (n) => `${n}, Sun in Scorpio - mission of deep transformation. You came to dive where others fear, reveal hidden truths, regenerate. Emotional intensity is your fuel; betrayal of trust is your wound. Who loves you needs real depth, not polished surface.`,
  },
  Sagitário: {
    pt: (n) => `${n}, com Sol em Sagitário, a missão expande horizontes - ensinar, explorar, buscar sentido. A liberdade é oxigénio; a dogmática sufoca-te. Vieste mostrar que a vida é viagem filosófica. O parceiro certo corre contigo, não te prende com medo do desconhecido.`,
    en: (n) => `${n}, with Sun in Sagittarius, the mission expands horizons - teach, explore, seek meaning. Freedom is oxygen; dogma suffocates you. You came to show life is philosophical journey. The right partner runs with you, doesn't chain you with fear of the unknown.`,
  },
  Capricórnio: {
    pt: (n) => `${n}, Sol em Capricórnio - missão de construir legado com disciplina. Vieste subir montanhas lentas, assumir responsabilidade, criar estruturas que duram. A vulnerabilidade custa-te; a competência protege-te. Quem fica contigo respeita o teu tempo e honra o teu esforço silencioso.`,
    en: (n) => `${n}, Sun in Capricorn - mission to build legacy with discipline. You came to climb slow mountains, take responsibility, create structures that last. Vulnerability costs you; competence protects you. Who stays with you respects your timing and honours your silent effort.`,
  },
  Aquário: {
    pt: (n) => `${n}, com Sol em Aquário, a missão é inovar e servir o colectivo sem perder a individualidade. Vieste quebrar padrões obsoletos, pensar o futuro, defender o diferente. A distância emocional pode confundir; a lealdade ideológica é profunda. Precisas de alguém que celebre a tua excentricidade sem tentar domesticar a tua visão.`,
    en: (n) => `${n}, with Sun in Aquarius, the mission is innovating and serving the collective without losing individuality. You came to break obsolete patterns, think the future, defend the different. Emotional distance can confuse; ideological loyalty runs deep. You need someone who celebrates your eccentricity without trying to tame your vision.`,
  },
  Peixes: {
    pt: (n) => `${n}, Sol em Peixes - missão de compaixão, imaginação e entrega ao invisível. Vieste sentir o que não se diz, sonhar o que ainda não existe, curar com presença. Os limites são o teu aprendizado; a empatia é o teu dom. A relação certa honra a tua sensibilidade sem te usar como saco emocional.`,
    en: (n) => `${n}, Sun in Pisces - mission of compassion, imagination and surrender to the invisible. You came to feel the unsaid, dream what doesn't yet exist, heal with presence. Boundaries are your lesson; empathy is your gift. The right relationship honours your sensitivity without using you as emotional dumping ground.`,
  },
}

const VENUS_REL = {
  Carneiro: { pt: 'desperta paixão directa, conquista com ousadia e prefere intensidade a jogos prolongados', en: 'awakens direct passion, conquers boldly and prefers intensity over prolonged games' },
  Touro: { pt: 'expressa amor através do corpo, do conforto e da constância sensorial', en: 'expresses love through body, comfort and sensory constancy' },
  Gémeos: { pt: 'seduz com palavras, humor e variedade intelectual', en: 'seduces with words, humour and intellectual variety' },
  Caranguejo: { pt: 'ama com profundidade protectora, precisa de segurança emocional para se entregar', en: 'loves with protective depth, needs emotional safety to surrender' },
  Leão: { pt: 'romantiza com grandiosidade, quer ser admirado e celebrado no amor', en: 'romanticises with grandeur, wants to be admired and celebrated in love' },
  Virgem: { pt: 'demonstra carinho com actos de serviço e atenção aos detalhes', en: 'shows affection through acts of service and attention to detail' },
  Balança: { pt: 'busca harmonia, beleza e reciprocidade elegante na intimidade', en: 'seeks harmony, beauty and elegant reciprocity in intimacy' },
  Escorpião: { pt: 'vive o erotismo como fusão total - tudo ou nada', en: 'lives eroticism as total fusion - all or nothing' },
  Sagitário: { pt: 'precisa de liberdade e aventura para manter a chama viva', en: 'needs freedom and adventure to keep the flame alive' },
  Capricórnio: { pt: 'leva tempo a confiar, mas compromete-se com lealdade profunda', en: 'takes time to trust, but commits with deep loyalty' },
  Aquário: { pt: 'valoriza amizade, originalidade e espaço dentro da paixão', en: 'values friendship, originality and space within passion' },
  Peixes: { pt: 'idealiza o amor, funde-se emocionalmente e busca romance espiritual', en: 'idealises love, merges emotionally and seeks spiritual romance' },
}

const MARTE_REL = {
  Carneiro: { pt: 'actua com impulso, desejo rápido e iniciativa sexual directa', en: 'acts with impulse, quick desire and direct sexual initiative' },
  Touro: { pt: 'persiste no prazer, ritmo lento e sensualidade prolongada', en: 'persists in pleasure, slow rhythm and prolonged sensuality' },
  Gémeos: { pt: 'estimula-se com conversa, variedade e provocação mental', en: 'gets aroused through talk, variety and mental provocation' },
  Caranguejo: { pt: 'defende quem ama, luta por segurança emocional e lar', en: 'defends who they love, fights for emotional safety and home' },
  Leão: { pt: 'conquista com carisma, orgulho e necessidade de ser desejado', en: 'conquers with charisma, pride and need to be desired' },
  Virgem: { pt: 'canaliza energia com precisão, pode ser crítico quando frustrado', en: 'channels energy with precision, can be critical when frustrated' },
  Balança: { pt: 'evita conflito directo, mas reage quando a justiça é violada', en: 'avoids direct conflict, but reacts when justice is violated' },
  Escorpião: { pt: 'intensidade magnética, ciúme profundo, resistência emocional extrema', en: 'magnetic intensity, deep jealousy, extreme emotional stamina' },
  Sagitário: { pt: 'aventureiro, honesto demais, foge de possessividade', en: 'adventurous, overly honest, runs from possessiveness' },
  Capricórnio: { pt: 'controlado, estratégico, liberta paixão apenas com confiança', en: 'controlled, strategic, releases passion only with trust' },
  Aquário: { pt: 'imprevisível, excitado pelo diferente, resiste a rotinas', en: 'unpredictable, excited by the different, resists routines' },
  Peixes: { pt: 'actua por intuição, pode sacrificar-se ou idealizar demasiado', en: 'acts on intuition, may sacrifice or over-idealise' },
}

const LUA_EMOC = {
  Carneiro: { pt: 'precisa de independência emocional e respostas rápidas', en: 'needs emotional independence and quick responses' },
  Touro: { pt: 'busca estabilidade, toque físico e rotinas reconfortantes', en: 'seeks stability, physical touch and comforting routines' },
  Gémeos: { pt: 'processa emoções falando, muda de humor com facilidade', en: 'processes emotions by talking, shifts mood easily' },
  Caranguejo: { pt: 'memória emocional profunda, lar é santuário', en: 'deep emotional memory, home is sanctuary' },
  Leão: { pt: 'precisa de ser valorizado, ferido pelo indiferença', en: 'needs to be valued, wounded by indifference' },
  Virgem: { pt: 'mostra cuidado com actos, ansiedade quando desordenado', en: 'shows care through acts, anxiety when disorderly' },
  Balança: { pt: 'sofre com conflito, precisa de parceria equilibrada', en: 'suffers from conflict, needs balanced partnership' },
  Escorpião: { pt: 'lealdade absoluta, traição marca para sempre', en: 'absolute loyalty, betrayal marks forever' },
  Sagitário: { pt: 'optimismo emocional, fuga quando sente prisão', en: 'emotional optimism, escapes when feeling trapped' },
  Capricórnio: { pt: 'contém sentimentos, demonstra amor com responsabilidade', en: 'contains feelings, shows love through responsibility' },
  Aquário: { pt: 'distancia-se para processar, valoriza amizade emocional', en: 'distances to process, values emotional friendship' },
  Peixes: { pt: 'absorve emoções alheias, fronteiras difusas', en: 'absorbs others\' emotions, diffuse boundaries' },
}

const MERCURIO_COM = {
  Carneiro: { pt: 'fala directo, impaciente com rodeios', en: 'speaks directly, impatient with detours' },
  Touro: { pt: 'pensa devagar mas com solidez, teimoso nas ideias', en: 'thinks slowly but solidly, stubborn in ideas' },
  Gémeos: { pt: 'conversa fluida, multitarefa mental, humor rápido', en: 'fluid conversation, mental multitasking, quick humour' },
  Caranguejo: { pt: 'comunica pelo tom emocional mais que pelas palavras', en: 'communicates through emotional tone more than words' },
  Leão: { pt: 'expressivo, dramático, precisa de ser ouvido', en: 'expressive, dramatic, needs to be heard' },
  Virgem: { pt: 'analítico, preciso, pode ser crítico na linguagem', en: 'analytical, precise, can be critical in language' },
  Balança: { pt: 'diplomático, evita palavras duras, busca consenso', en: 'diplomatic, avoids harsh words, seeks consensus' },
  Escorpião: { pt: 'silencioso até confiar, depois profundamente penetrante', en: 'silent until trusting, then deeply penetrating' },
  Sagitário: { pt: 'honesto, filosófico, pode ser tactless', en: 'honest, philosophical, can be tactless' },
  Capricórnio: { pt: 'economiza palavras, estratégico, formal', en: 'economises words, strategic, formal' },
  Aquário: { pt: 'original, distanciado, debates ideias', en: 'original, detached, debates ideas' },
  Peixes: { pt: 'metafórico, intuitivo, dificuldade em definir limites verbais', en: 'metaphorical, intuitive, difficulty defining verbal boundaries' },
}

const NODO_NORTE = {
  Carneiro: { pt: 'evoluir para coragem individual, iniciativa própria e auto-afirmação', en: 'evolve toward individual courage, own initiative and self-assertion' },
  Touro: { pt: 'evoluir para estabilidade, valor próprio e prazer encarnado', en: 'evolve toward stability, self-worth and embodied pleasure' },
  Gémeos: { pt: 'evoluir para curiosidade, diálogo e mente aberta', en: 'evolve toward curiosity, dialogue and open mind' },
  Caranguejo: { pt: 'evoluir para acolhimento, família emocional e vulnerabilidade', en: 'evolve toward welcoming, emotional family and vulnerability' },
  Leão: { pt: 'evoluir para criatividade, auto-expressão e generosidade', en: 'evolve toward creativity, self-expression and generosity' },
  Virgem: { pt: 'evoluir para serviço consciente, saúde e ordem útil', en: 'evolve toward conscious service, health and useful order' },
  Balança: { pt: 'evoluir para parceria equilibrada, justiça e cooperação', en: 'evolve toward balanced partnership, justice and cooperation' },
  Escorpião: { pt: 'evoluir para profundidade, entrega emocional e transformação', en: 'evolve toward depth, emotional surrender and transformation' },
  Sagitário: { pt: 'evoluir para significado, fé e horizontes amplos', en: 'evolve toward meaning, faith and wide horizons' },
  Capricórnio: { pt: 'evoluir para responsabilidade, maturidade e legado', en: 'evolve toward responsibility, maturity and legacy' },
  Aquário: { pt: 'evoluir para humanidade, originalidade e visão colectiva', en: 'evolve toward humanity, originality and collective vision' },
  Peixes: { pt: 'evoluir para compaixão, entrega espiritual e desapego', en: 'evolve toward compassion, spiritual surrender and detachment' },
}

const NODO_SUL = {
  Carneiro: { pt: 'zona de conforto: dependência do outro para agir; padrão de passividade ou projeção de liderança', en: 'comfort zone: dependence on other to act; pattern of passivity or projected leadership' },
  Touro: { pt: 'zona de conforto: possessividade, apego material ou resistência à mudança', en: 'comfort zone: possessiveness, material attachment or resistance to change' },
  Gémeos: { pt: 'zona de conforto: superficialidade, dispersão ou fuga emocional pela mente', en: 'comfort zone: superficiality, scattering or emotional escape through mind' },
  Caranguejo: { pt: 'zona de conforto: dependência emocional, vitimização ou ficar preso ao passado', en: 'comfort zone: emotional dependence, victimhood or stuck in past' },
  Leão: { pt: 'zona de conforto: orgulho ferido, drama ou necessidade de controlo', en: 'comfort zone: wounded pride, drama or need for control' },
  Virgem: { pt: 'zona de conforto: crítica excessiva, perfeccionismo paralisante', en: 'comfort zone: excessive criticism, paralysing perfectionism' },
  Balança: { pt: 'zona de conforto: codependência, evitar conflito a qualquer custo', en: 'comfort zone: codependency, avoiding conflict at any cost' },
  Escorpião: { pt: 'zona de conforto: manipulação, ciúme, vingança ou poder oculto', en: 'comfort zone: manipulation, jealousy, revenge or hidden power' },
  Sagitário: { pt: 'zona de conforto: arrogância, fuga, promessas vazias', en: 'comfort zone: arrogance, escape, empty promises' },
  Capricórnio: { pt: 'zona de conforto: frieza, status, workaholic sem alma', en: 'comfort zone: coldness, status, soulless workaholism' },
  Aquário: { pt: 'zona de conforto: distanciamento, rebeldia vazia, frieza emocional', en: 'comfort zone: detachment, empty rebellion, emotional coldness' },
  Peixes: { pt: 'zona de conforto: ilusão, escapismo, sacrifício martírio', en: 'comfort zone: illusion, escapism, martyrdom sacrifice' },
}

function aberturaProfessor(nomeA, nomeB, tema, lang) {
  if (lang !== 'pt') {
    return `${nomeA}, the stars speak directly to you about **${tema}** with ${nomeB}. This is your personal synastry - woven from your exact birth chart crossed with theirs. No generic text: every sentence reflects your sky.\n\n`
  }
  return `${nomeA}, os astros falam contigo directamente sobre **${tema}** com ${nomeB}. Esta é a tua sinastria pessoal - tecida a partir do teu mapa exacto cruzado com o dele/a. Nada de texto genérico: cada frase reflecte o teu céu.\n\n`
}

function narrativaAspectoComposto(a, lang) {
  if (!a) return ''
  if (a.harmonico) {
    if (lang !== 'pt') {
      return `• **${a.corpoA} ${a.nome.toLowerCase()} ${a.corpoB}** (${a.signoA} · ${a.signoB}): a natural gift in your relationship - energy flows here with ease, without you having to force it.`
    }
    return `• **${a.corpoA} ${a.nome.toLowerCase()} ${a.corpoB}** (${a.signoA} · ${a.signoB}): dom natural do vosso relacionamento - a energia flui aqui com facilidade, sem precisarem forçar.`
  }
  if (a.tenso) {
    if (lang !== 'pt') {
      return `• **${a.corpoA} ${a.nome.toLowerCase()} ${a.corpoB}** (${a.signoA} · ${a.signoB}): a recurring trigger - the arena where arguments or crises return until you both learn the lesson together. Not a curse: a growth edge.`
    }
    return `• **${a.corpoA} ${a.nome.toLowerCase()} ${a.corpoB}** (${a.signoA} · ${a.signoB}): gatilho recorrente - a arena onde brigas ou crises voltam até aprenderem juntos a lição. Não é maldição: é fronteira de crescimento.`
  }
  if (lang !== 'pt') {
    return `• **${a.corpoA} ${a.nome.toLowerCase()} ${a.corpoB}** (${a.signoA} · ${a.signoB}): intense fusion - you become one voice in this area, for better or for deeper merging.`
  }
  return `• **${a.corpoA} ${a.nome.toLowerCase()} ${a.corpoB}** (${a.signoA} · ${a.signoB}): fusão intensa - tornam-se uma só voz nesta área, para melhor ou para fundir mais profundamente.`
}

function aspectoNarrativa(a, lang, nomeA, nomeB) {
  if (!a) return ''
  const tom = {
    Trígono: lang !== 'pt' ? 'flows naturally' : 'flui com naturalidade',
    Sextil: lang !== 'pt' ? 'opens cooperative doors' : 'abre portas cooperativas',
    Conjunção: lang !== 'pt' ? 'merges intensely' : 'fundem-se intensamente',
    Quadratura: lang !== 'pt' ? 'creates friction that demands growth' : 'cria atrito que exige crescimento',
    Oposição: lang !== 'pt' ? 'polarizes and mirrors what each lacks' : 'polariza e espelha o que falta a cada um',
  }
  const t = tom[a.nome] || (lang !== 'pt' ? 'connects' : 'conectam')
  if (lang !== 'pt') {
    return `${nomeA}, when your sky meets ${nomeB}'s, ${a.pessoaA} and ${a.pessoaB} ${t} in a ${a.nome.toLowerCase()} (${a.signoA} · ${a.signoB}). The cosmos is pointing at this thread in your bond - pay attention.`
  }
  return `${nomeA}, quando o teu céu encontra o de ${nomeB}, ${a.pessoaA} e ${a.pessoaB} ${t} numa ${a.nome.toLowerCase()} (${a.signoA} · ${a.signoB}). O cosmos aponta para este fio na vossa ligação - presta atenção.`
}

function pickSigno(corpos, key) {
  return corpos?.[key]?.signo || null
}

export function narrativaQuimica(posA, posB, aspectos, lang = 'pt') {
  const nomeA = posA?.nome || (lang !== 'pt' ? 'You' : 'Tu')
  const nomeB = posB?.nome || (lang !== 'pt' ? 'your partner' : 'o(a) parceiro(a)')
  const venA = pickSigno(posA?.corpos, 'venus')
  const marA = pickSigno(posA?.corpos, 'marte')
  const venB = pickSigno(posB?.corpos, 'venus')
  const marB = pickSigno(posB?.corpos, 'marte')
  const linhas = []

  const tema = lang !== 'pt' ? 'sexual attraction and chemistry' : 'atração sexual e química'
  linhas.push(aberturaProfessor(nomeA, nomeB, tema, lang).trim())

  if (lang !== 'pt') {
    if (venA) linhas.push(`Your Venus in ${venA} tells how **you** love: ${VENUS_REL[venA]?.en || 'in a unique way'}. This is what opens your heart, what you find beautiful, and how you need affection to reach you.`)
    if (marA) linhas.push(`Your Mars in ${marA} is **your** desire - how fire moves in your body: ${MARTE_REL[marA]?.en || 'with personal rhythm'}. When honoured, it becomes vitality; when repressed, impatience or frustration.`)
    linhas.push('')
    if (venB) linhas.push(`${nomeB}'s Venus in ${venB} is the language you must learn to speak: ${VENUS_REL[venB]?.en || 'their own love dialect'}. Seducing them means honouring *their* Venus, not your fantasy of love.`)
    if (marB) linhas.push(`${nomeB}'s Mars in ${marB} shows how they pursue and defend desire: ${MARTE_REL[marB]?.en || 'in their style'}. Your chemistry lives in the dance between your Venus and their Mars - and vice versa.`)
  } else {
    if (venA) linhas.push(`A tua Vénus em ${venA} diz como **tu** amas: ${VENUS_REL[venA]?.pt || 'de forma única'}. É isto que abre o teu coração, o que achas belo e como precisas que o afecto te chegue.`)
    if (marA) linhas.push(`O teu Marte em ${marA} é **o teu** desejo - como o fogo se move no teu corpo: ${MARTE_REL[marA]?.pt || 'com ritmo pessoal'}. Quando honrado, torna-se vitalidade; quando reprimido, impaciência ou frustração.`)
    linhas.push('')
    if (venB) linhas.push(`A Vénus de ${nomeB} em ${venB} é a linguagem que precisas de aprender: ${VENUS_REL[venB]?.pt || 'dialecto amoroso próprio'}. Seduzir passa por honrar *a* Vénus dele/a, não a tua fantasia de amor.`)
    if (marB) linhas.push(`O Marte de ${nomeB} em ${marB} mostra como conquista e defende o desejo: ${MARTE_REL[marB]?.pt || 'ao seu estilo'}. A vossa química vive na dança entre a tua Vénus e o Marte dele/a - e vice-versa.`)
  }

  const top = aspectos.filter((a) => ['venus', 'marte'].includes(a.keyA) || ['venus', 'marte'].includes(a.keyB)).slice(0, 3)
  if (top.length) {
    linhas.push('')
    linhas.push(lang !== 'pt' ? '*What your crossed charts whisper about desire:*' : '*O que os vossos mapas cruzados sussurram sobre o desejo:*')
    for (const a of top) linhas.push(aspectoNarrativa(a, lang, nomeA, nomeB))
  } else {
    linhas.push(lang !== 'pt'
      ? '\n\nWithout strong Venus–Mars cross-aspects, your chemistry is built through trust and repeated choice - conscious desire rather than automatic magnetism.'
      : '\n\nSem aspectos fortes Vénus–Marte cruzados, a vossa química constrói-se pela confiança e escolha repetida - desejo consciente, não magnetismo automático.')
  }
  return linhas.filter(Boolean).join('\n')
}

export function narrativaEmocao(posA, posB, aspectos, lang = 'pt') {
  const nomeA = posA?.nome || (lang !== 'pt' ? 'You' : 'Tu')
  const nomeB = posB?.nome || (lang !== 'pt' ? 'your partner' : 'o(a) parceiro(a)')
  const solA = pickSigno(posA?.corpos, 'sol')
  const luaA = pickSigno(posA?.corpos, 'lua')
  const solB = pickSigno(posB?.corpos, 'sol')
  const luaB = pickSigno(posB?.corpos, 'lua')
  const linhas = []

  const tema = lang !== 'pt' ? 'emotional harmony' : 'sintonia emocional'
  linhas.push(aberturaProfessor(nomeA, nomeB, tema, lang).trim())

  if (lang !== 'pt') {
    if (solA) linhas.push(`Your Sun in ${solA} is how **you** shine - your conscious identity. In love, you need ${nomeB} to see this light, not only your moods.`)
    if (luaA) linhas.push(`Your Moon in ${luaA} is your private heart: ${LUA_EMOC[luaA]?.en || 'unique emotional needs'}. When ${nomeB} ignores this Moon, you close off - not from malice, from self-protection.`)
    linhas.push('')
    if (solB) linhas.push(`${nomeB}'s Sun in ${solB} is the identity they defend - respect it even when it clashes with yours.`)
    if (luaB) linhas.push(`${nomeB}'s Moon in ${luaB} is where they feel safe: ${LUA_EMOC[luaB]?.en || 'their rhythm'}. To love them is to speak to this Moon in its own language.`)
  } else {
    if (solA) linhas.push(`O teu Sol em ${solA} é como **tu** brilhas - a tua identidade consciente. No amor, precisas que ${nomeB} veja esta luz, não só os teus humores.`)
    if (luaA) linhas.push(`A tua Lua em ${luaA} é o teu coração privado: ${LUA_EMOC[luaA]?.pt || 'necessidades emocionais únicas'}. Quando ${nomeB} ignora esta Lua, fechas-te - não por maldade, por autoprotecção.`)
    linhas.push('')
    if (solB) linhas.push(`O Sol de ${nomeB} em ${solB} é a identidade que defende - respeita-a mesmo quando choca com a tua.`)
    if (luaB) linhas.push(`A Lua de ${nomeB} em ${luaB} é onde se sente seguro(a): ${LUA_EMOC[luaB]?.pt || 'ritmo próprio'}. Amar é falar a esta Lua na língua dela.`)
  }

  const solLua = aspectos.filter((a) => (a.keyA === 'sol' && a.keyB === 'lua') || (a.keyA === 'lua' && a.keyB === 'sol')).slice(0, 2)
  const luaLua = aspectos.find((a) => a.keyA === 'lua' && a.keyB === 'lua')
  if (solLua.length || luaLua) {
    linhas.push('')
    linhas.push(lang !== 'pt' ? '*What the Moon and Sun reveal between you:*' : '*O que Sol e Lua revelam entre vocês:*')
    for (const a of solLua) linhas.push(aspectoNarrativa(a, lang, nomeA, nomeB))
    if (luaLua) {
      linhas.push(lang !== 'pt'
        ? `${nomeA}, your Moon meets ${nomeB}'s in ${luaLua.nome.toLowerCase()} - your emotional worlds ${luaLua.nome === 'Trígono' || luaLua.nome === 'Sextil' ? 'recognize each other in silence' : 'must slowly learn each other\'s language'}.`
        : `${nomeA}, a tua Lua encontra a de ${nomeB} em ${luaLua.nome.toLowerCase()} - os vossos mundos emocionais ${luaLua.nome === 'Trígono' || luaLua.nome === 'Sextil' ? 'reconhecem-se em silêncio' : 'precisam de aprender devagar a linguagem um do outro'}.`)
    }
  }

  linhas.push(lang !== 'pt'
    ? `\n\n${nomeA}, remember: in crisis, the Moon speaks first. What you need emotionally is rarely what your Sun shows the world - and the same is true for ${nomeB}.`
    : `\n\n${nomeA}, lembra-te: em crise, fala primeiro a Lua. O que precisas emocionalmente raramente é o que o teu Sol mostra ao mundo - e o mesmo vale para ${nomeB}.`)
  return linhas.join('\n')
}

export function narrativaComunicacao(posA, posB, aspectos, lang = 'pt') {
  const nomeA = posA?.nome || (lang !== 'pt' ? 'You' : 'Tu')
  const nomeB = posB?.nome || (lang !== 'pt' ? 'your partner' : 'o(a) parceiro(a)')
  const merA = pickSigno(posA?.corpos, 'mercurio')
  const merB = pickSigno(posB?.corpos, 'mercurio')
  const linhas = []

  const tema = lang !== 'pt' ? 'communication and dialogue' : 'comunicação e diálogo'
  linhas.push(aberturaProfessor(nomeA, nomeB, tema, lang).trim())

  if (lang !== 'pt') {
    if (merA) linhas.push(`Your Mercury in ${merA} is **your** mind in conversation: ${MERCURIO_COM[merA]?.en || 'personal style'}. Under stress you revert here - for better or sharper.`)
    if (merB) linhas.push(`${nomeB}'s Mercury in ${merB}: ${MERCURIO_COM[merB]?.en || 'their mental rhythm'}. You will clash when you assume they think at your speed.`)
    linhas.push(`\n${nomeA}, repair after conflict depends on this axis. When Mercury flows, forgiveness is easy; when it blocks, every silence becomes a wound.`)
  } else {
    if (merA) linhas.push(`O teu Mercúrio em ${merA} é **a tua** mente em conversa: ${MERCURIO_COM[merA]?.pt || 'estilo pessoal'}. Sob stress regresses aqui - para melhor ou mais cortante.`)
    if (merB) linhas.push(`Mercúrio de ${nomeB} em ${merB}: ${MERCURIO_COM[merB]?.pt || 'ritmo mental dele/a'}. Haverá choque quando assumires que pensa ao teu ritmo.`)
    linhas.push(`\n${nomeA}, a reparação após conflito depende deste eixo. Quando Mercúrio flui, o perdão é fácil; quando bloqueia, cada silêncio torna-se ferida.`)
  }

  const merMer = aspectos.filter((a) => a.keyA === 'mercurio' && a.keyB === 'mercurio').slice(0, 2)
  if (merMer.length) {
    linhas.push('')
    for (const a of merMer) linhas.push(aspectoNarrativa(a, lang, nomeA, nomeB))
  }
  return linhas.join('\n')
}

export function narrativaFuturo(posA, posB, aspectos, lang = 'pt') {
  const nomeA = posA?.nome || (lang !== 'pt' ? 'You' : 'Tu')
  const nomeB = posB?.nome || (lang !== 'pt' ? 'your partner' : 'o(a) parceiro(a)')
  const jupA = pickSigno(posA?.corpos, 'jupiter')
  const satA = pickSigno(posA?.corpos, 'saturno')
  const jupB = pickSigno(posB?.corpos, 'jupiter')
  const satB = pickSigno(posB?.corpos, 'saturno')
  const linhas = []

  const tema = lang !== 'pt' ? 'projects and future' : 'projectos e futuro'
  linhas.push(aberturaProfessor(nomeA, nomeB, tema, lang).trim())

  if (lang !== 'pt') {
    if (jupA) linhas.push(`Your Jupiter in ${jupA} shows where **you** expand and believe. Shared dreams work when ${nomeB} feeds this faith, not shrinks it.`)
    if (satA) linhas.push(`Your Saturn in ${satA} is where you commit slowly - your walls and non-negotiables in long love.`)
    linhas.push('')
    if (jupB) linhas.push(`${nomeB}'s Jupiter in ${jupB} reveals their philosophy of life. You grow together when both Jupiters breathe the same hope.`)
    if (satB) linhas.push(`${nomeB}'s Saturn in ${satB} shows duty and fear. The question: do you build a structure together, or does one carry the weight alone?`)
  } else {
    if (jupA) linhas.push(`O teu Júpiter em ${jupA} mostra onde **tu** expandes e acreditas. Sonhos partilhados funcionam quando ${nomeB} alimenta esta fé, não a encolhe.`)
    if (satA) linhas.push(`O teu Saturno em ${satA} é onde te comprometes devagar - os teus muros e non-negotiables no amor longo.`)
    linhas.push('')
    if (jupB) linhas.push(`Júpiter de ${nomeB} em ${jupB} revela a filosofia de vida dele/a. Crescem juntos quando ambos os Júpiters respiram a mesma esperança.`)
    if (satB) linhas.push(`Saturno de ${nomeB} em ${satB} mostra dever e medo. A questão: constroem estrutura juntos, ou um leva o peso sozinho?`)
  }

  const jupSat = aspectos.filter((a) => ['jupiter', 'saturno'].includes(a.keyA) && ['jupiter', 'saturno'].includes(a.keyB)).slice(0, 3)
  if (jupSat.length) {
    linhas.push('')
    linhas.push(lang !== 'pt' ? '*What Jupiter and Saturn weave for your future:*' : '*O que Júpiter e Saturno tecem para o vosso futuro:*')
    for (const a of jupSat) linhas.push(aspectoNarrativa(a, lang, nomeA, nomeB))
  }
  return linhas.join('\n')
}

export function narrativaMissaoIndividual(pos, lang = 'pt') {
  if (!pos?.corpos?.sol) return ''
  const nome = pos.nome || (lang !== 'pt' ? 'This person' : 'Esta pessoa')
  const signo = pos.corpos.sol.signo
  const fn = MISSAO_SOL_LONGA[signo]
  const linhas = [fn ? fn[lang !== 'pt' ? 'en' : 'pt'](nome) : '']

  const mc = pos.corpos.mc
  const nn = pos.corpos.nodo_norte
  if (mc) {
    linhas.push(lang !== 'pt'
      ? `\nIn public life, Midheaven in ${mc.signo} (${mc.graus?.toFixed?.(1) ?? ''}°) directs vocation toward building a reputation aligned with ${mc.elemento} - concrete expression of soul mission in the world.`
      : `\nNa vida pública, o Meio-Céu em ${mc.signo} (${mc.graus?.toFixed?.(1) ?? ''}°) direcciona a vocação para construir reputação alinhada com ${mc.elemento} - expressão concreta da missão de alma no mundo.`)
  }
  if (nn) {
    linhas.push(lang !== 'pt'
      ? `North Node in ${nn.signo}: this lifetime invites ${NODO_NORTE[nn.signo]?.en || 'evolution'}.`
      : `Nodo Norte em ${nn.signo}: esta vida convida a ${NODO_NORTE[nn.signo]?.pt || 'evoluir'}.`)
  }
  return linhas.join('')
}

export function narrativaMissaoRelacionamento(resultado, lang = 'pt') {
  const { posA, posB, nodosSinastria } = resultado
  const nomeA = posA?.nome || (lang !== 'pt' ? 'You' : 'Tu')
  const nomeB = posB?.nome || (lang !== 'pt' ? 'your partner' : 'o(a) parceiro(a)')
  const linhas = []

  if (lang !== 'pt') {
    linhas.push(aberturaProfessor(nomeA, nomeB, 'relationship mission and soul purpose', lang).trim())
    linhas.push(`Beyond your individual charts, ${nomeA}, you and ${nomeB} form a third being: the relationship itself. The lunar nodes reveal the soul contract - why you met, what you came to learn together, and what must be released.`)
  } else {
    linhas.push(aberturaProfessor(nomeA, nomeB, 'missão de relacionamento e propósito de alma', lang).trim())
    linhas.push(`Para além dos mapas individuais, ${nomeA}, tu e ${nomeB} formam um terceiro ser: a relação em si. Os nodos lunares revelam o contrato de alma - porque se encontraram, o que vieram aprender juntos e o que precisam largar.`)
  }

  if (nodosSinastria?.activacoesNorte?.length) {
    linhas.push('')
    linhas.push(lang !== 'pt' ? '**Purpose Activation - North Node**' : '**Activação do Propósito de Vida - Nodo Norte**')
    for (const act of nodosSinastria.activacoesNorte.slice(0, 4)) {
      linhas.push(lang !== 'pt'
        ? `${nomeA}, ${act.planeta} from ${act.deQuem} touches ${act.donoNodo}'s North Node in ${act.signoNodo}. This person came to push you toward ${NODO_NORTE[act.signoNodo]?.en || 'evolution'} - classic *Life Purpose Activation*.`
        : `${nomeA}, ${act.planeta} de ${act.deQuem} toca o Nodo Norte de ${act.donoNodo} em ${act.signoNodo}. Esta pessoa veio empurrar-te para ${NODO_NORTE[act.signoNodo]?.pt || 'evoluir'} - *Activação do Propósito de Vida* clássica.`)
    }
  }

  if (nodosSinastria?.activacoesSul?.length) {
    linhas.push('')
    linhas.push(lang !== 'pt' ? '**Karmic Bond - South Node**' : '**Laço Cármico - Nodo Sul**')
    const n = nodosSinastria.activacoesSul.length
    linhas.push(lang !== 'pt'
      ? `${nomeA}, ${n} contact(s) to the South Node suggest familiar territory - past patterns, comfort zones or karmic repetition with ${nomeB}. The mission is not to stay there, but to recognize what was already learned and choose conscious evolution.`
      : `${nomeA}, ${n} contacto(s) ao Nodo Sul sugerem território familiar - padrões passados, zonas de conforto ou repetição cármica com ${nomeB}. A missão não é ficar aí, mas reconhecer o que já foi aprendido e escolher evolução consciente.`)
    for (const act of nodosSinastria.activacoesSul.slice(0, 3)) {
      linhas.push(lang !== 'pt'
        ? `• ${act.planeta} (${act.deQuem}) - ${NODO_SUL[act.signoNodo]?.en || 'karmic pattern to release'}`
        : `• ${act.planeta} (${act.deQuem}) - ${NODO_SUL[act.signoNodo]?.pt || 'padrão cármico a largar'}`)
    }
  }

  return linhas.join('\n')
}

export function narrativaMapaComposto(mapaComposto, nomeA, nomeB, lang = 'pt') {
  if (!mapaComposto?.corpos) return ''
  const linhas = []
  const corpos = ['sol', 'lua', 'mercurio', 'venus', 'marte', 'jupiter', 'saturno']
  const aspectos = mapaComposto.aspectosInternos || []
  const harmonicos = aspectos.filter((a) => a.harmonico)
  const tensos = aspectos.filter((a) => a.tenso)

  if (lang !== 'pt') {
    linhas.push(aberturaProfessor(nomeA, nomeB, 'the Composite Chart - your relationship as one entity', lang).trim())
    linhas.push(`\n${nomeA}, the Composite Chart does not describe you or ${nomeB} separately. It creates a **new map** born from the exact midpoint between each of your planets. It reveals the **vibration of the relationship as a whole** - the third soul you form together.`)
    linhas.push('\n**The soul signature of your bond**')
    for (const k of corpos) {
      const p = mapaComposto.corpos[k]
      if (p) linhas.push(`When you are together, your composite ${p.nome} lives in ${p.signo} - this colours how the relationship expresses ${k === 'sol' ? 'identity and purpose' : k === 'lua' ? 'emotional safety' : k === 'venus' ? 'love and pleasure' : k === 'marte' ? 'desire and conflict' : 'this dimension of the bond'}.`)
    }
    linhas.push('\n**The flow of energy between you**')
    linhas.push('Inside the composite chart, aspects between composite planets show how energy circulates when you are together - not as two individuals, but as one relational field.')
    if (harmonicos.length) {
      linhas.push('\n*Natural gifts (harmonious aspects - trines and sextiles):*')
      linhas.push('These are areas where the relationship flows without effort - talents you share as a couple:')
      for (const a of harmonicos.slice(0, 5)) linhas.push(narrativaAspectoComposto(a, lang))
    }
    if (tensos.length) {
      linhas.push('\n*Recurring triggers (tense aspects - squares and oppositions):*')
      linhas.push('These reveal where arguments or crises return until you both learn the lesson together. They are not punishment - they are the relationship\'s curriculum:')
      for (const a of tensos.slice(0, 5)) linhas.push(narrativaAspectoComposto(a, lang))
    }
    if (!harmonicos.length && !tensos.length) {
      linhas.push('\nNo major internal aspects detected - your bond builds its rhythm through daily choice rather than automatic ease or friction.')
    }
    linhas.push(`\n${nomeA}, read this chart as the living portrait of you and ${nomeB} together: where you naturally thrive, where you must grow, and what legacy this love can leave.`)
  } else {
    linhas.push(aberturaProfessor(nomeA, nomeB, 'o Mapa Composto - a vossa relação como entidade', lang).trim())
    linhas.push(`\n${nomeA}, o Mapa Composto não descreve a ti nem a ${nomeB} em separado. Cria um **mapa novo**, nascido do ponto médio exacto entre cada planeta vosso. Revela a **vibração do relacionamento como um todo** - a terceira alma que formam juntos.`)
    linhas.push('\n**A assinatura de alma do vosso vínculo**')
    for (const k of corpos) {
      const p = mapaComposto.corpos[k]
      if (!p) continue
      const papel = {
        sol: 'identidade e propósito do casal',
        lua: 'segurança emocional a dois',
        mercurio: 'como pensam e falam juntos',
        venus: 'amor e prazer partilhados',
        marte: 'desejo e forma de lutar',
        jupiter: 'fé e expansão conjunta',
        saturno: 'compromisso e estrutura a longo prazo',
      }[k] || 'esta dimensão do vínculo'
      linhas.push(`Quando estão juntos, o ${p.nome} composto vive em ${p.signo} - isto colore ${papel}.`)
    }
    linhas.push('\n**O fluxo de energia entre vocês**')
    linhas.push('Dentro do mapa composto, os aspectos entre planetas compostos mostram como a energia circula quando estão juntos - não como dois indivíduos, mas como um campo relacional único.')
    if (harmonicos.length) {
      linhas.push('\n*Dons naturais (aspectos harmónicos - trígonos e sextis):*')
      linhas.push('São áreas onde a relação flui sem esforço - talentos que partilham como casal:')
      for (const a of harmonicos.slice(0, 5)) linhas.push(narrativaAspectoComposto(a, lang))
    }
    if (tensos.length) {
      linhas.push('\n*Gatilhos recorrentes (aspectos tensos - quadraturas e oposições):*')
      linhas.push('Revelam onde brigas ou crises voltam até aprenderem juntos a lição. Não são castigo - são o currículo da relação:')
      for (const a of tensos.slice(0, 5)) linhas.push(narrativaAspectoComposto(a, lang))
    }
    if (!harmonicos.length && !tensos.length) {
      linhas.push('\nSem aspectos internos majores detectados - o vosso ritmo constrói-se pela escolha quotidiana, não por facilidade ou atrito automáticos.')
    }
    linhas.push(`\n${nomeA}, lê este mapa como o retrato vivo de ti e ${nomeB} juntos: onde prosperam naturalmente, onde precisam crescer e que legado este amor pode deixar.`)
  }
  return linhas.join('\n')
}

export function narrativaIntroSinastria(nomeA, nomeB, pontuacao, lang = 'pt') {
  if (lang !== 'pt') {
    return `${nomeA}, welcome to your personal synastry with ${nomeB}. Every paragraph below was written for **you** - from the exact degrees of your birth sky crossed with theirs. Read as an astrology teacher speaking privately to you: the stars are not judging; they are narrating the story you are living together.\n\nOverall bond tone: **${pontuacao}%** compatibility across chemistry, emotion, communication and future.`
  }
  return `${nomeA}, bem-vindo(a) à tua sinastria pessoal com ${nomeB}. Cada parágrafo abaixo foi escrito para **ti** - a partir dos graus exactos do teu céu de nascimento cruzado com o dele/a. Lê como um professor de astrologia a falar contigo em privado: os astros não julgam; narram a história que estás a viver a dois.\n\nTom geral do vínculo: **${pontuacao}%** de compatibilidade nos eixos química, emoção, comunicação e futuro.`
}

export { SIGNO_PT }
