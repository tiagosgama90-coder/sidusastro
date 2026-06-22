/**
 * Narrativas personalizadas de sinastria — textos únicos por mapa (não generalizados).
 * Baseadas nas posições exactas calculadas via Swiss Ephemeris.
 */

const SIGNO_PT = {
  Carneiro: 'Carneiro', Touro: 'Touro', Gémeos: 'Gémeos', Caranguejo: 'Caranguejo',
  Leão: 'Leão', Virgem: 'Virgem', Balança: 'Balança', Escorpião: 'Escorpião',
  Sagitário: 'Sagitário', Capricórnio: 'Capricórnio', Aquário: 'Aquário', Peixes: 'Peixes',
}

const MISSAO_SOL_LONGA = {
  Carneiro: {
    pt: (n) => `${n}, com o Sol em Carneiro, nasceu para iniciar. A tua missão de vida pede coragem para ser o primeiro, para abrir portas onde outros hesitam. Não precisas de pedir permissão para liderar — precisas de aprender a canalizar o impulso sem queimar pontes. O fogo que trazes ao mundo inspira acção; quando está consciente, torna-te motor de transformação para quem te rodeia.`,
    en: (n) => `${n}, with the Sun in Aries, you were born to initiate. Your life mission asks for courage to be first, to open doors where others hesitate. You don't need permission to lead — you need to learn channelling impulse without burning bridges. The fire you bring inspires action; when conscious, you become an engine of transformation for those around you.`,
  },
  Touro: {
    pt: (n) => `${n}, o Sol em Touro revela uma missão ligada à terra, ao corpo e ao que perdura. Vieste construir valor — beleza, segurança, presença sensorial. A tua alma recusa pressa superficial; pede-te enraizar, cultivar, fazer florescer o que merece tempo. Quem te ama sente estabilidade; quem te ignora perde contacto com o que é sólido na vida.`,
    en: (n) => `${n}, the Sun in Taurus reveals a mission tied to earth, body and what endures. You came to build value — beauty, security, sensory presence. Your soul refuses superficial haste; it asks you to root, cultivate, make what deserves time flourish. Those who love you feel stability; those who ignore you lose touch with what is solid in life.`,
  },
  Gémeos: {
    pt: (n) => `${n}, com Sol em Gémeos, a tua missão passa por conectar mundos através das palavras e das ideias. És ponte entre perspectivas — tradutor, mensageiro, curioso eterno. A vida pede-te flexibilidade mental e honestidade intelectual. Quando disperso, perdes profundidade; quando focado, iluminas caminhos que outros não viam.`,
    en: (n) => `${n}, with Sun in Gemini, your mission is connecting worlds through words and ideas. You are a bridge between perspectives — translator, messenger, eternal curious mind. Life asks mental flexibility and intellectual honesty. When scattered you lose depth; when focused you illuminate paths others didn't see.`,
  },
  Caranguejo: {
    pt: (n) => `${n}, o Sol em Caranguejo indica missão de acolher, proteger e dar raízes emocionais. A tua alma sente antes de pensar — e isso é dom, não fraqueza. Vieste nutrir laços, memória, pertença. O desafio é não te fechares na concha quando a vulnerabilidade assusta; o dom é criar refúgio autêntico para ti e para quem confia em ti.`,
    en: (n) => `${n}, Sun in Cancer indicates a mission to welcome, protect and give emotional roots. Your soul feels before it thinks — and that is gift, not weakness. You came to nurture bonds, memory, belonging. The challenge is not closing in your shell when vulnerability scares you; the gift is creating authentic refuge for yourself and those who trust you.`,
  },
  Leão: {
    pt: (n) => `${n}, com Sol em Leão, a missão é irradiar — criar, celebrar, inspirar confiança. O teu coração pede palco não por vaidade vazia, mas por necessidade de partilhar luz. Aprendes ao longo da vida que liderar é servir com generosidade. Quem te vê de verdade reconhece um sol que aquece sem consumir.`,
    en: (n) => `${n}, with Sun in Leo, the mission is to radiate — create, celebrate, inspire confidence. Your heart asks for stage not from empty vanity, but from need to share light. You learn through life that leading is serving generously. Those who truly see you recognize a sun that warms without consuming.`,
  },
  Virgem: {
    pt: (n) => `${n}, Sol em Virgem — missão de aperfeiçoar, curar e servir com discernimento. Vieste refinar o caos em ordem útil. A tua mente vê detalhes que outros ignoram; o corpo fala contigo sobre equilíbrio. O perigo é a autocrítica paralisante; a virtude é transformar cuidado em medicina silenciosa para o mundo.`,
    en: (n) => `${n}, Sun in Virgo — mission to refine, heal and serve with discernment. You came to turn chaos into useful order. Your mind sees details others ignore; your body speaks about balance. The danger is paralysing self-criticism; the virtue is turning care into silent medicine for the world.`,
  },
  Balança: {
    pt: (n) => `${n}, com Sol em Balança, a vida pede equilíbrio, justiça e beleza nas relações. És diplomata nato da alma — vês ambos os lados e sofres com desarmonia. A missão não é agradar a todos, mas criar pontes honestas. O parceiro ideal reconhece a tua necessidade de parceria sem te reduzir a reflexo do outro.`,
    en: (n) => `${n}, with Sun in Libra, life asks balance, justice and beauty in relationships. You are the soul's natural diplomat — you see both sides and suffer from disharmony. The mission is not pleasing everyone, but building honest bridges. The ideal partner recognizes your need for partnership without reducing you to the other's mirror.`,
  },
  Escorpião: {
    pt: (n) => `${n}, Sol em Escorpião — missão de transformação profunda. Vieste mergulhar onde outros temem, revelar verdades ocultas, regenerar. A intensidade emocional é o teu combustível; a traição da confiança é a tua ferida. Quem te ama precisa de profundidade real, não de superfície polida.`,
    en: (n) => `${n}, Sun in Scorpio — mission of deep transformation. You came to dive where others fear, reveal hidden truths, regenerate. Emotional intensity is your fuel; betrayal of trust is your wound. Who loves you needs real depth, not polished surface.`,
  },
  Sagitário: {
    pt: (n) => `${n}, com Sol em Sagitário, a missão expande horizontes — ensinar, explorar, buscar sentido. A liberdade é oxigénio; a dogmática sufoca-te. Vieste mostrar que a vida é viagem filosófica. O parceiro certo corre contigo, não te prende com medo do desconhecido.`,
    en: (n) => `${n}, with Sun in Sagittarius, the mission expands horizons — teach, explore, seek meaning. Freedom is oxygen; dogma suffocates you. You came to show life is philosophical journey. The right partner runs with you, doesn't chain you with fear of the unknown.`,
  },
  Capricórnio: {
    pt: (n) => `${n}, Sol em Capricórnio — missão de construir legado com disciplina. Vieste subir montanhas lentas, assumir responsabilidade, criar estruturas que duram. A vulnerabilidade custa-te; a competência protege-te. Quem fica contigo respeita o teu tempo e honra o teu esforço silencioso.`,
    en: (n) => `${n}, Sun in Capricorn — mission to build legacy with discipline. You came to climb slow mountains, take responsibility, create structures that last. Vulnerability costs you; competence protects you. Who stays with you respects your timing and honours your silent effort.`,
  },
  Aquário: {
    pt: (n) => `${n}, com Sol em Aquário, a missão é inovar e servir o colectivo sem perder a individualidade. Vieste quebrar padrões obsoletos, pensar o futuro, defender o diferente. A distância emocional pode confundir; a lealdade ideológica é profunda. Precisas de alguém que celebre a tua excentricidade sem tentar domesticar a tua visão.`,
    en: (n) => `${n}, with Sun in Aquarius, the mission is innovating and serving the collective without losing individuality. You came to break obsolete patterns, think the future, defend the different. Emotional distance can confuse; ideological loyalty runs deep. You need someone who celebrates your eccentricity without trying to tame your vision.`,
  },
  Peixes: {
    pt: (n) => `${n}, Sol em Peixes — missão de compaixão, imaginação e entrega ao invisível. Vieste sentir o que não se diz, sonhar o que ainda não existe, curar com presença. Os limites são o teu aprendizado; a empatia é o teu dom. A relação certa honra a tua sensibilidade sem te usar como saco emocional.`,
    en: (n) => `${n}, Sun in Pisces — mission of compassion, imagination and surrender to the invisible. You came to feel the unsaid, dream what doesn't yet exist, heal with presence. Boundaries are your lesson; empathy is your gift. The right relationship honours your sensitivity without using you as emotional dumping ground.`,
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
  Escorpião: { pt: 'vive o erotismo como fusão total — tudo ou nada', en: 'lives eroticism as total fusion — all or nothing' },
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

function aspectoNarrativa(a, lang) {
  if (!a) return ''
  const tom = {
    Trígono: lang === 'en' ? 'flows naturally' : 'flui com naturalidade',
    Sextil: lang === 'en' ? 'opens cooperative doors' : 'abre portas cooperativas',
    Conjunção: lang === 'en' ? 'merges intensely' : 'fundem-se intensamente',
    Quadratura: lang === 'en' ? 'creates friction that demands growth' : 'cria atrito que exige crescimento',
    Oposição: lang === 'en' ? 'polarizes and mirrors what each lacks' : 'polariza e espelha o que falta a cada um',
  }
  const t = tom[a.nome] || (lang === 'en' ? 'connects' : 'conectam')
  if (lang === 'en') {
    return `Between you, ${a.pessoaA} and ${a.pessoaB} ${t} through a ${a.nome.toLowerCase()} (${a.signoA} · ${a.signoB}). This is one of the most active threads in your bond right now.`
  }
  return `Entre vocês, ${a.pessoaA} e ${a.pessoaB} ${t} numa ${a.nome.toLowerCase()} (${a.signoA} · ${a.signoB}). Este é um dos fios mais activos da vossa ligação neste momento.`
}

function pickSigno(corpos, key) {
  return corpos?.[key]?.signo || null
}

export function narrativaQuimica(posA, posB, aspectos, lang = 'pt') {
  const nomeA = posA?.nome || (lang === 'en' ? 'You' : 'Tu')
  const nomeB = posB?.nome || (lang === 'en' ? 'Partner' : 'Parceiro(a)')
  const venA = pickSigno(posA?.corpos, 'venus')
  const marA = pickSigno(posA?.corpos, 'marte')
  const venB = pickSigno(posB?.corpos, 'venus')
  const marB = pickSigno(posB?.corpos, 'marte')
  const linhas = []

  if (lang === 'en') {
    linhas.push(`**Sexual attraction and chemistry between ${nomeA} and ${nomeB}**`)
    linhas.push('')
    if (venA) linhas.push(`${nomeA} feels and loves through Venus in ${venA}: ${VENUS_REL[venA]?.en || 'a unique way of bonding'}. This shapes what you find beautiful, what opens your heart and how you expect affection to be shown.`)
    if (marA) linhas.push(`${nomeA}'s Mars in ${marA} reveals how desire moves in your body: ${MARTE_REL[marA]?.en || 'with personal rhythm'}. When this energy meets the right person, it becomes fuel — when blocked, frustration or impatience.`)
    linhas.push('')
    if (venB) linhas.push(`${nomeB} loves through Venus in ${venB}: ${VENUS_REL[venB]?.en || 'their own language of love'}. To seduce them, honour this Venus — not your own projection of what love "should" look like.`)
    if (marB) linhas.push(`${nomeB}'s Mars in ${marB} shows how they pursue, defend and express erotic impulse: ${MARTE_REL[marB]?.en || 'in their own style'}. Chemistry ignites when Mars and Venus dance without shame or control games.`)
  } else {
    linhas.push(`**Atração sexual e química entre ${nomeA} e ${nomeB}**`)
    linhas.push('')
    if (venA) linhas.push(`${nomeA} sente e ama através de Vénus em ${venA}: ${VENUS_REL[venA]?.pt || 'de forma única'}. Isto molda o que achas belo, o que abre o teu coração e como esperas que o afecto seja demonstrado.`)
    if (marA) linhas.push(`O Marte de ${nomeA} em ${marA} revela como o desejo se move no teu corpo: ${MARTE_REL[marA]?.pt || 'com ritmo pessoal'}. Quando esta energia encontra a pessoa certa, torna-se combustível — quando bloqueada, frustração ou impaciência.`)
    linhas.push('')
    if (venB) linhas.push(`${nomeB} ama através de Vénus em ${venB}: ${VENUS_REL[venB]?.pt || 'com a sua própria linguagem'}. Para seduzir, honra esta Vénus — não a tua projecção do que o amor "deveria" ser.`)
    if (marB) linhas.push(`O Marte de ${nomeB} em ${marB} mostra como conquista, defende e expressa impulso erótico: ${MARTE_REL[marB]?.pt || 'ao seu estilo'}. A química acende quando Marte e Vénus dançam sem vergonha nem jogos de controlo.`)
  }

  const top = aspectos.filter((a) => ['venus', 'marte'].includes(a.keyA) || ['venus', 'marte'].includes(a.keyB)).slice(0, 3)
  if (top.length) {
    linhas.push('')
    linhas.push(lang === 'en' ? '*What the sky says between your charts:*' : '*O que o céu diz entre os vossos mapas:*')
    for (const a of top) linhas.push(aspectoNarrativa(a, lang))
  }

  const score = aspectos.length ? '' : (lang === 'en'
    ? '\n\nWithout strong Venus–Mars cross-aspects, chemistry builds slowly through trust and repeated choice — not automatic magnetism.'
    : '\n\nSem aspectos fortes Vénus–Marte cruzados, a química constrói-se devagar através de confiança e escolha repetida — não magnetismo automático.')
  linhas.push(score)
  return linhas.filter(Boolean).join('\n')
}

export function narrativaEmocao(posA, posB, aspectos, lang = 'pt') {
  const nomeA = posA?.nome || (lang === 'en' ? 'You' : 'Tu')
  const nomeB = posB?.nome || (lang === 'en' ? 'Partner' : 'Parceiro(a)')
  const solA = pickSigno(posA?.corpos, 'sol')
  const luaA = pickSigno(posA?.corpos, 'lua')
  const solB = pickSigno(posB?.corpos, 'sol')
  const luaB = pickSigno(posB?.corpos, 'lua')
  const linhas = []

  if (lang === 'en') {
    linhas.push(`**Emotional harmony — ${nomeA} & ${nomeB}**`)
    linhas.push('')
    if (solA) linhas.push(`${nomeA}'s Sun in ${solA} is your conscious identity — how you shine and what you need to feel alive. In love, you need recognition of this solar essence.`)
    if (luaA) linhas.push(`${nomeA}'s Moon in ${luaA} is your emotional home: ${LUA_EMOC[luaA]?.en || 'unique emotional needs'}. When this Moon is unseen, you withdraw or react protectively.`)
    linhas.push('')
    if (solB) linhas.push(`${nomeB}'s Sun in ${solB} shows how they define themselves — honour this light even when it differs from yours.`)
    if (luaB) linhas.push(`${nomeB}'s Moon in ${luaB} reveals how they feel safe: ${LUA_EMOC[luaB]?.en || 'their private rhythm'}. Loving them well means speaking to this Moon, not only to their public face.`)
  } else {
    linhas.push(`**Sintonia emocional — ${nomeA} e ${nomeB}**`)
    linhas.push('')
    if (solA) linhas.push(`O Sol de ${nomeA} em ${solA} é a identidade consciente — como brilhas e o que precisas para te sentires vivo(a). No amor, precisas de reconhecimento desta essência solar.`)
    if (luaA) linhas.push(`A Lua de ${nomeA} em ${luaA} é o lar emocional: ${LUA_EMOC[luaA]?.pt || 'necessidades emocionais únicas'}. Quando esta Lua não é vista, retiras-te ou reages em defesa.`)
    linhas.push('')
    if (solB) linhas.push(`O Sol de ${nomeB} em ${solB} mostra como se define — honra esta luz mesmo quando difere da tua.`)
    if (luaB) linhas.push(`A Lua de ${nomeB} em ${luaB} revela como se sente seguro(a): ${LUA_EMOC[luaB]?.pt || 'ritmo privado'}. Amar bem é falar a esta Lua, não só à face pública.`)
  }

  const solLua = aspectos.filter((a) => (a.keyA === 'sol' && a.keyB === 'lua') || (a.keyA === 'lua' && a.keyB === 'sol')).slice(0, 2)
  const luaLua = aspectos.find((a) => a.keyA === 'lua' && a.keyB === 'lua')
  if (solLua.length || luaLua) {
    linhas.push('')
    linhas.push(lang === 'en' ? '*Emotional threads woven between you:*' : '*Fios emocionais entre vocês:*')
    for (const a of solLua) linhas.push(aspectoNarrativa(a, lang))
    if (luaLua) {
      linhas.push(lang === 'en'
        ? `Your Moons meet in ${luaLua.nome.toLowerCase()} — emotional worlds ${luaLua.nome === 'Trígono' || luaLua.nome === 'Sextil' ? 'recognize each other quickly' : 'must learn each other\'s language'}.`
        : `As Luas encontram-se em ${luaLua.nome.toLowerCase()} — os mundos emocionais ${luaLua.nome === 'Trígono' || luaLua.nome === 'Sextil' ? 'reconhecem-se depressa' : 'precisam aprender a linguagem um do outro'}.`)
    }
  }

  linhas.push(lang === 'en'
    ? '\n\nIn crisis, watch the Moon first: what each person needs is rarely what the Sun shows publicly.'
    : '\n\nEm crise, observa primeiro a Lua: o que cada um precisa raramente é o que o Sol mostra em público.')
  return linhas.join('\n')
}

export function narrativaComunicacao(posA, posB, aspectos, lang = 'pt') {
  const nomeA = posA?.nome || (lang === 'en' ? 'You' : 'Tu')
  const nomeB = posB?.nome || (lang === 'en' ? 'Partner' : 'Parceiro(a)')
  const merA = pickSigno(posA?.corpos, 'mercurio')
  const merB = pickSigno(posB?.corpos, 'mercurio')
  const linhas = []

  if (lang === 'en') {
    linhas.push(`**Communication and dialogue — ${nomeA} & ${nomeB}**`)
    linhas.push('')
    if (merA) linhas.push(`${nomeA} thinks and speaks through Mercury in ${merA}: ${MERCURIO_COM[merA]?.en || 'personal mental style'}. Under stress, you revert to this pattern — sometimes helpful, sometimes sharp.`)
    if (merB) linhas.push(`${nomeB}'s Mercury in ${merB}: ${MERCURIO_COM[merB]?.en || 'their dialogue style'}. Misunderstandings often come from assuming they process at your speed.`)
    linhas.push('\nMercury synastry shows whether repair after conflict is easy or exhausting. Trines and sextiles forgive quickly; squares demand explicit translation of intentions.')
  } else {
    linhas.push(`**Comunicação e diálogo — ${nomeA} e ${nomeB}**`)
    linhas.push('')
    if (merA) linhas.push(`${nomeA} pensa e fala através de Mercúrio em ${merA}: ${MERCURIO_COM[merA]?.pt || 'estilo mental pessoal'}. Sob stress, regresses a este padrão — por vezes útil, por vezes cortante.`)
    if (merB) linhas.push(`Mercúrio de ${nomeB} em ${merB}: ${MERCURIO_COM[merB]?.pt || 'estilo de diálogo'}. Mal-entendidos nascem muitas vezes de assumir que processam ao teu ritmo.`)
    linhas.push('\nA sinastria de Mercúrio mostra se a reparação após conflito é fácil ou exaustiva. Trígonos e sextis perdoam depressa; quadraturas exigem tradução explícita de intenções.')
  }

  const merMer = aspectos.filter((a) => a.keyA === 'mercurio' && a.keyB === 'mercurio').slice(0, 2)
  if (merMer.length) {
    linhas.push('')
    for (const a of merMer) linhas.push(aspectoNarrativa(a, lang))
  }
  return linhas.join('\n')
}

export function narrativaFuturo(posA, posB, aspectos, lang = 'pt') {
  const nomeA = posA?.nome || (lang === 'en' ? 'You' : 'Tu')
  const nomeB = posB?.nome || (lang === 'en' ? 'Partner' : 'Parceiro(a)')
  const jupA = pickSigno(posA?.corpos, 'jupiter')
  const satA = pickSigno(posA?.corpos, 'saturno')
  const jupB = pickSigno(posB?.corpos, 'jupiter')
  const satB = pickSigno(posB?.corpos, 'saturno')
  const linhas = []

  if (lang === 'en') {
    linhas.push(`**Projects and future — ${nomeA} & ${nomeB}**`)
    linhas.push('')
    if (jupA) linhas.push(`${nomeA}'s Jupiter in ${jupA} shows where you expand, believe and take risks. Shared projects work when this Jupiter is fed, not restricted.`)
    if (satA) linhas.push(`${nomeA}'s Saturn in ${satA} marks where you commit slowly but seriously — your non-negotiables in long-term bonds.`)
    linhas.push('')
    if (jupB) linhas.push(`${nomeB}'s Jupiter in ${jupB} reveals their faith in life and growth. Couple philosophy aligns when both Jupiters speak similar language of meaning.`)
    if (satB) linhas.push(`${nomeB}'s Saturn in ${satB} shows fears, duties and walls. Saturn synastry tests whether you build together or one carries the weight alone.`)
  } else {
    linhas.push(`**Projetos e futuro — ${nomeA} e ${nomeB}**`)
    linhas.push('')
    if (jupA) linhas.push(`Júpiter de ${nomeA} em ${jupA} mostra onde expands, acredita e arrisca. Projectos partilhados funcionam quando este Júpiter é alimentado, não restringido.`)
    if (satA) linhas.push(`Saturno de ${nomeA} em ${satA} marca onde te comprometes devagar mas a sério — os teus non-negotiables a longo prazo.`)
    linhas.push('')
    if (jupB) linhas.push(`Júpiter de ${nomeB} em ${jupB} revela a fé na vida e no crescimento. A filosofia de casal alinha quando ambos os Júpiters falam linguagem semelhante de sentido.`)
    if (satB) linhas.push(`Saturno de ${nomeB} em ${satB} mostra medos, deveres e muros. A sinastria saturnina testa se constroem juntos ou se um leva o peso sozinho.`)
  }

  const jupSat = aspectos.filter((a) => ['jupiter', 'saturno'].includes(a.keyA) && ['jupiter', 'saturno'].includes(a.keyB)).slice(0, 3)
  if (jupSat.length) {
    linhas.push('')
    linhas.push(lang === 'en' ? '*Long-term architecture:*' : '*Arquitectura a longo prazo:*')
    for (const a of jupSat) linhas.push(aspectoNarrativa(a, lang))
  }
  return linhas.join('\n')
}

export function narrativaMissaoIndividual(pos, lang = 'pt') {
  if (!pos?.corpos?.sol) return ''
  const nome = pos.nome || (lang === 'en' ? 'This person' : 'Esta pessoa')
  const signo = pos.corpos.sol.signo
  const fn = MISSAO_SOL_LONGA[signo]
  const linhas = [fn ? fn[lang === 'en' ? 'en' : 'pt'](nome) : '']

  const mc = pos.corpos.mc
  const nn = pos.corpos.nodo_norte
  if (mc) {
    linhas.push(lang === 'en'
      ? `\nIn public life, Midheaven in ${mc.signo} (${mc.graus?.toFixed?.(1) ?? ''}°) directs vocation toward building a reputation aligned with ${mc.elemento} — concrete expression of soul mission in the world.`
      : `\nNa vida pública, o Meio-Céu em ${mc.signo} (${mc.graus?.toFixed?.(1) ?? ''}°) direcciona a vocação para construir reputação alinhada com ${mc.elemento} — expressão concreta da missão de alma no mundo.`)
  }
  if (nn) {
    linhas.push(lang === 'en'
      ? `North Node in ${nn.signo}: this lifetime invites ${NODO_NORTE[nn.signo]?.en || 'evolution'}.`
      : `Nodo Norte em ${nn.signo}: esta vida convida a ${NODO_NORTE[nn.signo]?.pt || 'evoluir'}.`)
  }
  return linhas.join('')
}

export function narrativaMissaoRelacionamento(resultado, lang = 'pt') {
  const { posA, posB, nodosSinastria, mapaComposto } = resultado
  const nomeA = posA?.nome || (lang === 'en' ? 'You' : 'Tu')
  const nomeB = posB?.nome || (lang === 'en' ? 'Partner' : 'Parceiro(a)')
  const linhas = []

  if (lang === 'en') {
    linhas.push(`**Relationship Mission — Soul Purpose of the Couple**`)
    linhas.push('')
    linhas.push(`Beyond individual charts, ${nomeA} and ${nomeB} form a third entity: the relationship itself. Astrology reads this through lunar nodes and the Composite Chart — the mathematical midpoint soul of the bond.`)
  } else {
    linhas.push(`**Missão de Relacionamento — Propósito de Alma do Casal**`)
    linhas.push('')
    linhas.push(`Para além dos mapas individuais, ${nomeA} e ${nomeB} formam uma terceira entidade: a relação em si. A astrologia lê isto através dos nodos lunares e do Mapa Composto — a alma matemática do vínculo.`)
  }

  if (nodosSinastria?.activacoesNorte?.length) {
    linhas.push('')
    linhas.push(lang === 'en' ? '**Purpose Activation (North Node)**' : '**Activação do Propósito de Vida (Nodo Norte)**')
    for (const act of nodosSinastria.activacoesNorte.slice(0, 4)) {
      linhas.push(lang === 'en'
        ? `${act.planeta} of ${act.deQuem} touches ${act.donoNodo}'s North Node in ${act.signoNodo} — ${act.planeta} came to push toward evolutionary growth in this bond. This is classic *Life Purpose Activation*.`
        : `${act.planeta} de ${act.deQuem} toca o Nodo Norte de ${act.donoNodo} em ${act.signoNodo} — veio empurrar em direcção ao crescimento evolutivo neste vínculo. Isto é *Activação do Propósito de Vida* clássica.`)
    }
  }

  if (nodosSinastria?.activacoesSul?.length) {
    linhas.push('')
    linhas.push(lang === 'en' ? '**Karmic Bond (South Node)**' : '**Laço Cármico (Nodo Sul)**')
    const n = nodosSinastria.activacoesSul.length
    linhas.push(lang === 'en'
      ? `${n} planetary contact(s) to the South Node suggest familiar territory — past patterns, comfort zones or karmic repetition. The mission is not to stay there, but to recognize what was already learned and choose conscious evolution.`
      : `${n} contacto(s) planetários ao Nodo Sul sugerem território familiar — padrões passados, zonas de conforto ou repetição cármica. A missão não é ficar aí, mas reconhecer o que já foi aprendido e escolher evolução consciente.`)
    for (const act of nodosSinastria.activacoesSul.slice(0, 3)) {
      linhas.push(lang === 'en'
        ? `• ${act.planeta} (${act.deQuem}) — ${NODO_SUL[act.signoNodo]?.en || 'karmic pattern'}`
        : `• ${act.planeta} (${act.deQuem}) — ${NODO_SUL[act.signoNodo]?.pt || 'padrão cármico'}`)
    }
  }

  if (mapaComposto?.corpos?.sol) {
    const cs = mapaComposto.corpos.sol.signo
    linhas.push('')
    linhas.push(lang === 'en' ? '**Composite Chart — the couple as one entity**' : '**Mapa Composto — o casal como entidade**')
    linhas.push(lang === 'en'
      ? `Composite Sun in ${cs}: together you shine as ${cs} energy. This is the public identity of the relationship — what you are meant to become when you choose each other deliberately.`
      : `Sol composto em ${cs}: juntos brilham como energia ${cs}. Esta é a identidade pública da relação — o que estão destinados a tornar-se quando se escolhem deliberadamente.`)
    if (mapaComposto.corpos.lua) {
      linhas.push(lang === 'en'
        ? `Composite Moon in ${mapaComposto.corpos.lua.signo}: the emotional body of the couple — how you feel together in private.`
        : `Lua composta em ${mapaComposto.corpos.lua.signo}: o corpo emocional do casal — como se sentem juntos em privado.`)
    }
    if (mapaComposto.corpos.venus) {
      linhas.push(lang === 'en'
        ? `Composite Venus in ${mapaComposto.corpos.venus.signo}: shared language of love and pleasure.`
        : `Vénus composta em ${mapaComposto.corpos.venus.signo}: linguagem partilhada de amor e prazer.`)
    }
  }

  return linhas.join('\n')
}

export function narrativaMapaComposto(mapaComposto, nomeA, nomeB, lang = 'pt') {
  if (!mapaComposto?.corpos) return ''
  const linhas = []
  const corpos = ['sol', 'lua', 'mercurio', 'venus', 'marte', 'jupiter', 'saturno']

  if (lang === 'en') {
    linhas.push(`**Composite Chart (midpoint method — Swiss Ephemeris precision)**`)
    linhas.push(`The composite chart calculates the exact mathematical midpoint between ${nomeA}'s and ${nomeB}'s planetary positions. It is not "half of each person" — it is the chart of the relationship itself, used by professional astrologers worldwide (Astrodienst standard).`)
    linhas.push('')
    for (const k of corpos) {
      const p = mapaComposto.corpos[k]
      if (p) linhas.push(`• Composite ${p.nome}: ${p.signo} (${p.graus?.toFixed?.(1) ?? '—'}°)`)
    }
    linhas.push('\nRead this chart as the soul contract of the couple: where you grow together, where you struggle together, and what legacy the bond can leave.')
  } else {
    linhas.push(`**Mapa Composto (método dos pontos médios — precisão Swiss Ephemeris)**`)
    linhas.push(`O mapa composto calcula o ponto médio matemático exacto entre as posições planetárias de ${nomeA} e ${nomeB}. Não é "metade de cada um" — é o mapa da relação em si, usado por astrólogos profissionais em todo o mundo (padrão Astrodienst).`)
    linhas.push('')
    for (const k of corpos) {
      const p = mapaComposto.corpos[k]
      if (p) linhas.push(`• ${p.nome} composto(a): ${p.signo} (${p.graus?.toFixed?.(1) ?? '—'}°)`)
    }
    linhas.push('\nLê este mapa como o contrato de alma do casal: onde crescem juntos, onde lutam juntos e que legado o vínculo pode deixar.')
  }
  return linhas.join('\n')
}

export { SIGNO_PT }
