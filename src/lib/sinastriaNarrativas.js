/**
 * Narrativas personalizadas de sinastria - textos íntimos por utilizador.
 */
import { pickNarr } from './i18n/narrativePick.js'
import { contentForLang } from './i18n/langUtil.js'
import { translateSigno, translateAspecto } from './i18n/astro.js'
import {
  sx, aberturaProfessor as aberturaSx,
  NOME_PADRAO_A, NOME_PADRAO_B, NOME_PESSOA,
  TEMA_QUIMICA, TEMA_EMOCAO, TEMA_COMUNICACAO, TEMA_FUTURO,
  textoAspectoNarrativa, textoAspectoComposto,
} from './i18n/sinastriaStrings.js'
import * as SinLoc from './i18n/packs/sinastriaLocales.js'

function tsSign(signo, lang) {
  return signo ? translateSigno(signo, lang) : signo
}

function enrichDict(dict, baseName) {
  for (const lang of ['es', 'it', 'de', 'fr']) {
    const pack = SinLoc[`${baseName}_${lang.toUpperCase()}`]
    if (!pack) continue
    for (const [sign, entry] of Object.entries(pack)) {
      if (dict[sign] && entry[lang]) dict[sign][lang] = entry[lang]
    }
  }
}

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

enrichDict(VENUS_REL, 'VENUS_REL')
enrichDict(MARTE_REL, 'MARTE_REL')
enrichDict(LUA_EMOC, 'LUA_EMOC')
enrichDict(MERCURIO_COM, 'MERCURIO_COM')
enrichDict(NODO_NORTE, 'NODO_NORTE')
enrichDict(NODO_SUL, 'NODO_SUL')

function aberturaProfessor(nomeA, nomeB, tema, lang) {
  return aberturaSx(lang, nomeA, nomeB, tema)
}

function narrativaAspectoComposto(a, lang) {
  if (!a) return ''
  const signA = tsSign(a.signoA, lang)
  const signB = tsSign(a.signoB, lang)
  const local = { ...a, signoA: signA, signoB: signB }
  return textoAspectoComposto(lang, local, (n) => translateAspecto(n, lang))
}

function aspectoNarrativa(a, lang, nomeA, nomeB) {
  if (!a) return ''
  return textoAspectoNarrativa(lang, nomeA, nomeB, a, (n) => translateAspecto(n, lang), (s) => tsSign(s, lang), (s) => tsSign(s, lang))
}

function pickSigno(corpos, key) {
  return corpos?.[key]?.signo || null
}

export function narrativaQuimica(posA, posB, aspectos, lang = 'pt') {
  const nomeA = posA?.nome || contentForLang(lang, NOME_PADRAO_A)
  const nomeB = posB?.nome || contentForLang(lang, NOME_PADRAO_B)
  const venA = pickSigno(posA?.corpos, 'venus')
  const marA = pickSigno(posA?.corpos, 'marte')
  const venB = pickSigno(posB?.corpos, 'venus')
  const marB = pickSigno(posB?.corpos, 'marte')
  const linhas = []

  const tema = contentForLang(lang, TEMA_QUIMICA)
  linhas.push(aberturaProfessor(nomeA, nomeB, tema, lang).trim())

  if (venA) {
    linhas.push(sx(lang, {
      pt: (na, s, d) => `A tua Vénus em ${s} diz como **tu** amas: ${d}. É isto que abre o teu coração, o que achas belo e como precisas que o afecto te chegue.`,
      en: (na, s, d) => `Your Venus in ${s} tells how **you** love: ${d}. This is what opens your heart, what you find beautiful, and how you need affection to reach you.`,
      es: (na, s, d) => `Tu Venus en ${s} dice cómo **tú** amas: ${d}. Esto abre tu corazón, lo que encuentras bello y cómo necesitas que te llegue el afecto.`,
      it: (na, s, d) => `La tua Venere in ${s} dice come **tu** ami: ${d}. È ciò che apre il tuo cuore, ciò che trovi bello e come hai bisogno che l'affetto ti raggiunga.`,
      de: (na, s, d) => `Deine Venus in ${s} zeigt, wie **du** liebst: ${d}. Das öffnet dein Herz, was du schön findest und wie Zuneigung dich erreichen soll.`,
      fr: (na, s, d) => `Ta Vénus en ${s} dit comment **tu** aimes : ${d}. C'est ce qui ouvre ton cœur, ce que tu trouves beau et comment tu as besoin que l'affection t'atteigne.`,
    }, nomeA, tsSign(venA, lang), pickNarr(VENUS_REL[venA], lang) || sx(lang, { pt: 'de forma única', en: 'in a unique way', es: 'de forma única', it: 'in modo unico', de: 'auf einzigartige Weise', fr: 'de façon unique' })))
  }
  if (marA) {
    linhas.push(sx(lang, {
      pt: (na, s, d) => `O teu Marte em ${s} é **o teu** desejo - como o fogo se move no teu corpo: ${d}. Quando honrado, torna-se vitalidade; quando reprimido, impaciência ou frustração.`,
      en: (na, s, d) => `Your Mars in ${s} is **your** desire - how fire moves in your body: ${d}. When honoured, it becomes vitality; when repressed, impatience or frustration.`,
      es: (na, s, d) => `Tu Marte en ${s} es **tu** deseo: cómo se mueve el fuego en tu cuerpo: ${d}. Cuando se honra, se vuelve vitalidad; cuando se reprime, impaciencia o frustración.`,
      it: (na, s, d) => `Il tuo Marte in ${s} è **il tuo** desiderio: come il fuoco si muove nel tuo corpo: ${d}. Quando onorato, diventa vitalità; quando represso, impazienza o frustrazione.`,
      de: (na, s, d) => `Dein Mars in ${s} ist **dein** Verlangen – wie Feuer sich in deinem Körper bewegt: ${d}. Wenn geehrt, wird es Vitalität; wenn unterdrückt, Ungeduld oder Frustration.`,
      fr: (na, s, d) => `Ton Mars en ${s} est **ton** désir – comment le feu se déplace dans ton corps : ${d}. Honoré, il devient vitalité ; réprimé, impatience ou frustration.`,
    }, nomeA, tsSign(marA, lang), pickNarr(MARTE_REL[marA], lang) || sx(lang, { pt: 'com ritmo pessoal', en: 'with personal rhythm', es: 'con ritmo personal', it: 'con ritmo personale', de: 'mit persönlichem Rhythmus', fr: 'avec un rythme personnel' })))
  }
  linhas.push('')
  if (venB) {
    linhas.push(sx(lang, {
      pt: (nb, s, d) => `A Vénus de ${nb} em ${s} é a linguagem que precisas de aprender: ${d}. Seduzir passa por honrar *a* Vénus dele/a, não a tua fantasia de amor.`,
      en: (nb, s, d) => `${nb}'s Venus in ${s} is the language you must learn to speak: ${d}. Seducing them means honouring *their* Venus, not your fantasy of love.`,
      es: (nb, s, d) => `La Venus de ${nb} en ${s} es el idioma que debes aprender: ${d}. Seducir pasa por honrar *su* Venus, no tu fantasía de amor.`,
      it: (nb, s, d) => `La Venere di ${nb} in ${s} è la lingua che devi imparare: ${d}. Sedurre significa onorare *la* Venere sua, non la tua fantasia d'amore.`,
      de: (nb, s, d) => `${nb}s Venus in ${s} ist die Sprache, die du lernen musst: ${d}. Verführen heißt *ihre/seine* Venus ehren, nicht deine Liebesfantasie.`,
      fr: (nb, s, d) => `La Vénus de ${nb} en ${s} est la langue à apprendre : ${d}. Séduire, c'est honorer *sa* Vénus, pas ton fantasme d'amour.`,
    }, nomeB, tsSign(venB, lang), pickNarr(VENUS_REL[venB], lang) || sx(lang, { pt: 'dialecto amoroso próprio', en: 'their own love dialect', es: 'su propio dialecto amoroso', it: 'il proprio dialetto amoroso', de: 'ihren eigenen Liebesdialekt', fr: 'son propre dialecte amoureux' })))
  }
  if (marB) {
    linhas.push(sx(lang, {
      pt: (nb, s, d) => `O Marte de ${nb} em ${s} mostra como conquista e defende o desejo: ${d}. A vossa química vive na dança entre a tua Vénus e o Marte dele/a - e vice-versa.`,
      en: (nb, s, d) => `${nb}'s Mars in ${s} shows how they pursue and defend desire: ${d}. Your chemistry lives in the dance between your Venus and their Mars - and vice versa.`,
      es: (nb, s, d) => `El Marte de ${nb} en ${s} muestra cómo conquista y defiende el deseo: ${d}. Vuestra química vive en la danza entre tu Venus y su Marte, y viceversa.`,
      it: (nb, s, d) => `Il Marte di ${nb} in ${s} mostra come conquista e difende il desiderio: ${d}. La vostra chimica vive nella danza tra la tua Venere e il suo Marte, e viceversa.`,
      de: (nb, s, d) => `${nb}s Mars in ${s} zeigt, wie Verlangen verfolgt und verteidigt wird: ${d}. Eure Chemie lebt im Tanz zwischen deiner Venus und ihrem/seinem Mars – und umgekehrt.`,
      fr: (nb, s, d) => `Le Mars de ${nb} en ${s} montre comment il/elle poursuit et défend le désir : ${d}. Votre alchimie vit dans la danse entre ta Vénus et son Mars – et inversement.`,
    }, nomeB, tsSign(marB, lang), pickNarr(MARTE_REL[marB], lang) || sx(lang, { pt: 'ao seu estilo', en: 'in their style', es: 'a su estilo', it: 'al suo stile', de: 'in ihrem/seinem Stil', fr: 'à sa manière' })))
  }

  const top = aspectos.filter((a) => ['venus', 'marte'].includes(a.keyA) || ['venus', 'marte'].includes(a.keyB)).slice(0, 3)
  if (top.length) {
    linhas.push('')
    linhas.push(sx(lang, {
      pt: '*O que os vossos mapas cruzados sussurram sobre o desejo:*',
      en: '*What your crossed charts whisper about desire:*',
      es: '*Lo que vuestros mapas cruzados susurran sobre el deseo:*',
      it: '*Cosa sussurrano i vostri temi incrociati sul desiderio:*',
      de: '*Was eure gekreuzten Horoskope über Verlangen flüstern:*',
      fr: '*Ce que vos cartes croisées murmurent sur le désir :*',
    }))
    for (const a of top) linhas.push(aspectoNarrativa(a, lang, nomeA, nomeB))
  } else {
    linhas.push(sx(lang, {
      pt: '\n\nSem aspectos fortes Vénus–Marte cruzados, a vossa química constrói-se pela confiança e escolha repetida - desejo consciente, não magnetismo automático.',
      en: '\n\nWithout strong Venus–Mars cross-aspects, your chemistry is built through trust and repeated choice - conscious desire rather than automatic magnetism.',
      es: '\n\nSin aspectos fuertes Venus–Marte cruzados, vuestra química se construye con confianza y elección repetida: deseo consciente, no magnetismo automático.',
      it: '\n\nSenza forti aspetti incrociati Venere–Marte, la vostra chimica si costruisce con fiducia e scelta ripetuta: desiderio consapevole, non magnetismo automatico.',
      de: '\n\nOhne starke Venus–Mars-Kreuzaspekte baut sich eure Chemie durch Vertrauen und wiederholte Wahl auf – bewusstes Verlangen statt automatischem Magnetismus.',
      fr: '\n\nSans aspects croisés Venus–Mars forts, votre alchimie se construit par la confiance et le choix répété – désir conscient plutôt que magnétisme automatique.',
    }))
  }
  return linhas.filter(Boolean).join('\n')
}

export function narrativaEmocao(posA, posB, aspectos, lang = 'pt') {
  const nomeA = posA?.nome || contentForLang(lang, NOME_PADRAO_A)
  const nomeB = posB?.nome || contentForLang(lang, NOME_PADRAO_B)
  const solA = pickSigno(posA?.corpos, 'sol')
  const luaA = pickSigno(posA?.corpos, 'lua')
  const solB = pickSigno(posB?.corpos, 'sol')
  const luaB = pickSigno(posB?.corpos, 'lua')
  const linhas = []

  const tema = contentForLang(lang, TEMA_EMOCAO)
  linhas.push(aberturaProfessor(nomeA, nomeB, tema, lang).trim())

  if (solA) {
    linhas.push(sx(lang, {
      pt: (na, nb, s) => `O teu Sol em ${s} é como **tu** brilhas - a tua identidade consciente. No amor, precisas que ${nb} veja esta luz, não só os teus humores.`,
      en: (na, nb, s) => `Your Sun in ${s} is how **you** shine - your conscious identity. In love, you need ${nb} to see this light, not only your moods.`,
      es: (na, nb, s) => `Tu Sol en ${s} es cómo **tú** brillas: tu identidad consciente. En el amor, necesitas que ${nb} vea esta luz, no solo tus humores.`,
      it: (na, nb, s) => `Il tuo Sole in ${s} è come **tu** brilli: la tua identità conscia. In amore, hai bisogno che ${nb} veda questa luce, non solo i tuoi umori.`,
      de: (na, nb, s) => `Deine Sonne in ${s} ist, wie **du** strahlst – deine bewusste Identität. In der Liebe brauchst du, dass ${nb} dieses Licht sieht, nicht nur deine Stimmungen.`,
      fr: (na, nb, s) => `Ton Soleil en ${s} est comment **tu** brilles – ton identité consciente. En amour, tu as besoin que ${nb} voie cette lumière, pas seulement tes humeurs.`,
    }, nomeA, nomeB, tsSign(solA, lang)))
  }
  if (luaA) {
    const luaTxt = pickNarr(LUA_EMOC[luaA], lang) || sx(lang, { pt: 'necessidades emocionais únicas', en: 'unique emotional needs', es: 'necesidades emocionales únicas', it: 'bisogni emotivi unici', de: 'einzigartige emotionale Bedürfnisse', fr: 'besoins émotionnels uniques' })
    linhas.push(sx(lang, {
      pt: (na, nb, s, d) => `A tua Lua em ${s} é o teu coração privado: ${d}. Quando ${nb} ignora esta Lua, fechas-te - não por maldade, por autoprotecção.`,
      en: (na, nb, s, d) => `Your Moon in ${s} is your private heart: ${d}. When ${nb} ignores this Moon, you close off - not from malice, from self-protection.`,
      es: (na, nb, s, d) => `Tu Luna en ${s} es tu corazón privado: ${d}. Cuando ${nb} ignora esta Luna, te cierras, no por maldad, sino por autoprotección.`,
      it: (na, nb, s, d) => `La tua Luna in ${s} è il tuo cuore privato: ${d}. Quando ${nb} ignora questa Luna, ti chiudi, non per malizia, ma per autoprotezione.`,
      de: (na, nb, s, d) => `Dein Mond in ${s} ist dein privates Herz: ${d}. Wenn ${nb} diesen Mond ignoriert, schließt du dich – nicht aus Bosheit, sondern aus Selbstschutz.`,
      fr: (na, nb, s, d) => `Ta Lune en ${s} est ton cœur privé : ${d}. Quand ${nb} ignore cette Lune, tu te fermes – non par méchanceté, mais par autoprotección.`,
    }, nomeA, nomeB, tsSign(luaA, lang), luaTxt))
  }
  linhas.push('')
  if (solB) {
    linhas.push(sx(lang, {
      pt: (nb, s) => `O Sol de ${nb} em ${s} é a identidade que defende - respeita-a mesmo quando choca com a tua.`,
      en: (nb, s) => `${nb}'s Sun in ${s} is the identity they defend - respect it even when it clashes with yours.`,
      es: (nb, s) => `El Sol de ${nb} en ${s} es la identidad que defiende: respétala aunque choque con la tuya.`,
      it: (nb, s) => `Il Sole di ${nb} in ${s} è l'identità che difende: rispettala anche quando scontrata con la tua.`,
      de: (nb, s) => `${nb}s Sonne in ${s} ist die Identität, die sie/er verteidigt – respektiere sie, auch wenn sie mit deiner kollidiert.`,
      fr: (nb, s) => `Le Soleil de ${nb} en ${s} est l'identité qu'il/elle défend – respecte-la même quand elle heurte la tienne.`,
    }, nomeB, tsSign(solB, lang)))
  }
  if (luaB) {
    const luaTxt = pickNarr(LUA_EMOC[luaB], lang) || sx(lang, { pt: 'ritmo próprio', en: 'their rhythm', es: 'su ritmo', it: 'il suo ritmo', de: 'ihren/seinen Rhythmus', fr: 'son rythme' })
    linhas.push(sx(lang, {
      pt: (nb, s, d) => `A Lua de ${nb} em ${s} é onde se sente seguro(a): ${d}. Amar é falar a esta Lua na língua dela.`,
      en: (nb, s, d) => `${nb}'s Moon in ${s} is where they feel safe: ${d}. To love them is to speak to this Moon in its own language.`,
      es: (nb, s, d) => `La Luna de ${nb} en ${s} es donde se siente seguro/a: ${d}. Amar es hablar a esta Luna en su idioma.`,
      it: (nb, s, d) => `La Luna di ${nb} in ${s} è dove si sente al sicuro: ${d}. Amare è parlare a questa Luna nella sua lingua.`,
      de: (nb, s, d) => `${nb}s Mond in ${s} ist, wo sie/er sich sicher fühlt: ${d}. Lieben heißt, zu diesem Mond in seiner Sprache zu sprechen.`,
      fr: (nb, s, d) => `La Lune de ${nb} en ${s} est où il/elle se sent en sécurité : ${d}. Aimer, c'est parler à cette Lune dans sa langue.`,
    }, nomeB, tsSign(luaB, lang), luaTxt))
  }

  const solLua = aspectos.filter((a) => (a.keyA === 'sol' && a.keyB === 'lua') || (a.keyA === 'lua' && a.keyB === 'sol')).slice(0, 2)
  const luaLua = aspectos.find((a) => a.keyA === 'lua' && a.keyB === 'lua')
  if (solLua.length || luaLua) {
    linhas.push('')
    linhas.push(sx(lang, {
      pt: '*O que Sol e Lua revelam entre vocês:*',
      en: '*What the Moon and Sun reveal between you:*',
      es: '*Lo que Sol y Luna revelan entre vosotros:*',
      it: '*Cosa rivelano Sole e Luna tra voi:*',
      de: '*Was Sonne und Mond zwischen euch offenbaren:*',
      fr: '*Ce que Soleil et Lune révèlent entre vous :*',
    }))
    for (const a of solLua) linhas.push(aspectoNarrativa(a, lang, nomeA, nomeB))
    if (luaLua) {
      const harm = luaLua.nome === 'Trígono' || luaLua.nome === 'Sextil'
      const asp = translateAspecto(luaLua.nome, lang).toLowerCase()
      linhas.push(sx(lang, {
        pt: (na, nb, a, h) => `${na}, a tua Lua encontra a de ${nb} em ${a} - os vossos mundos emocionais ${h ? 'reconhecem-se em silêncio' : 'precisam de aprender devagar a linguagem um do outro'}.`,
        en: (na, nb, a, h) => `${na}, your Moon meets ${nb}'s in ${a} - your emotional worlds ${h ? 'recognize each other in silence' : 'must slowly learn each other\'s language'}.`,
        es: (na, nb, a, h) => `${na}, tu Luna encuentra la de ${nb} en ${a}: vuestros mundos emocionales ${h ? 'se reconocen en silencio' : 'deben aprender despacio el idioma del otro'}.`,
        it: (na, nb, a, h) => `${na}, la tua Luna incontra quella di ${nb} in ${a}: i vostri mondi emotivi ${h ? 'si riconoscono in silenzio' : 'devono imparare lentamente la lingua l\'uno dell\'altro'}.`,
        de: (na, nb, a, h) => `${na}, dein Mond trifft auf den von ${nb} im ${a} – eure emotionalen Welten ${h ? 'erkennen sich im Stillen' : 'müssen langsam die Sprache des anderen lernen'}.`,
        fr: (na, nb, a, h) => `${na}, ta Lune rencontre celle de ${nb} en ${a} : vos mondes émotionnels ${h ? 'se reconnaissent en silence' : 'doivent apprendre lentement la langue de l\'autre'}.`,
      }, nomeA, nomeB, asp, harm))
    }
  }

  linhas.push(sx(lang, {
    pt: (na, nb) => `\n\n${na}, lembra-te: em crise, fala primeiro a Lua. O que precisas emocionalmente raramente é o que o teu Sol mostra ao mundo - e o mesmo vale para ${nb}.`,
    en: (na, nb) => `\n\n${na}, remember: in crisis, the Moon speaks first. What you need emotionally is rarely what your Sun shows the world - and the same is true for ${nb}.`,
    es: (na, nb) => `\n\n${na}, recuerda: en crisis, habla primero la Luna. Lo que necesitas emocionalmente rara vez es lo que tu Sol muestra al mundo, y lo mismo vale para ${nb}.`,
    it: (na, nb) => `\n\n${na}, ricorda: in crisi parla per prima la Luna. Ciò che ti serve emotivamente raramente è ciò che il tuo Sole mostra al mondo – e lo stesso vale per ${nb}.`,
    de: (na, nb) => `\n\n${na}, denk daran: in der Krise spricht zuerst der Mond. Was du emotional brauchst, ist selten das, was deine Sonne der Welt zeigt – und dasselbe gilt für ${nb}.`,
    fr: (na, nb) => `\n\n${na}, rappelle-toi : en crise, la Lune parle la première. Ce dont tu as besoin émotionnellement est rarement ce que ton Soleil montre au monde – et il en va de même pour ${nb}.`,
  }, nomeA, nomeB))
  return linhas.join('\n')
}

export function narrativaComunicacao(posA, posB, aspectos, lang = 'pt') {
  const nomeA = posA?.nome || contentForLang(lang, NOME_PADRAO_A)
  const nomeB = posB?.nome || contentForLang(lang, NOME_PADRAO_B)
  const merA = pickSigno(posA?.corpos, 'mercurio')
  const merB = pickSigno(posB?.corpos, 'mercurio')
  const linhas = []

  const tema = contentForLang(lang, TEMA_COMUNICACAO)
  linhas.push(aberturaProfessor(nomeA, nomeB, tema, lang).trim())

  if (merA) {
    linhas.push(sx(lang, {
      pt: (na, s, d) => `O teu Mercúrio em ${s} é **a tua** mente em conversa: ${d}. Sob stress regresses aqui - para melhor ou mais cortante.`,
      en: (na, s, d) => `Your Mercury in ${s} is **your** mind in conversation: ${d}. Under stress you revert here - for better or sharper.`,
      es: (na, s, d) => `Tu Mercurio en ${s} es **tu** mente en conversación: ${d}. Bajo estrés regresas aquí, para mejor o más cortante.`,
      it: (na, s, d) => `Il tuo Mercurio in ${s} è **la tua** mente in conversazione: ${d}. Sotto stress vi torni, per il meglio o più tagliente.`,
      de: (na, s, d) => `Dein Merkur in ${s} ist **dein** Geist im Gespräch: ${d}. Unter Stress kehrst du hierher zurück – zum Besseren oder Schärferen.`,
      fr: (na, s, d) => `Ton Mercure en ${s} est **ton** esprit en conversation : ${d}. Sous stress tu y reviens – pour le mieux ou plus tranchant.`,
    }, nomeA, tsSign(merA, lang), pickNarr(MERCURIO_COM[merA], lang) || sx(lang, { pt: 'estilo pessoal', en: 'personal style', es: 'estilo personal', it: 'stile personale', de: 'persönlicher Stil', fr: 'style personnel' })))
  }
  if (merB) {
    linhas.push(sx(lang, {
      pt: (nb, s, d) => `Mercúrio de ${nb} em ${s}: ${d}. Haverá choque quando assumires que pensa ao teu ritmo.`,
      en: (nb, s, d) => `${nb}'s Mercury in ${s}: ${d}. You will clash when you assume they think at your speed.`,
      es: (nb, s, d) => `Mercurio de ${nb} en ${s}: ${d}. Habrá choque cuando asumas que piensa a tu ritmo.`,
      it: (nb, s, d) => `Mercurio di ${nb} in ${s}: ${d}. Ci sarà scontro quando assumi che pensi al tuo ritmo.`,
      de: (nb, s, d) => `${nb}s Merkur in ${s}: ${d}. Es gibt Reibung, wenn du annimmst, sie/er denke in deinem Tempo.`,
      fr: (nb, s, d) => `Mercure de ${nb} en ${s} : ${d}. Il y aura friction si tu supposes qu'il/elle pense à ton rythme.`,
    }, nomeB, tsSign(merB, lang), pickNarr(MERCURIO_COM[merB], lang) || sx(lang, { pt: 'ritmo mental dele/a', en: 'their mental rhythm', es: 'su ritmo mental', it: 'il suo ritmo mentale', de: 'ihren/seinen mentalen Rhythmus', fr: 'son rythme mental' })))
  }
  linhas.push(sx(lang, {
    pt: (na) => `\n${na}, a reparação após conflito depende deste eixo. Quando Mercúrio flui, o perdão é fácil; quando bloqueia, cada silêncio torna-se ferida.`,
    en: (na) => `\n${na}, repair after conflict depends on this axis. When Mercury flows, forgiveness is easy; when it blocks, every silence becomes a wound.`,
    es: (na) => `\n${na}, la reparación tras el conflicto depende de este eje. Cuando Mercurio fluye, el perdón es fácil; cuando bloquea, cada silencio se vuelve herida.`,
    it: (na) => `\n${na}, la riparazione dopo il conflitto dipende da questo asse. Quando Mercurio fluisce, il perdono è facile; quando si blocca, ogni silenzio diventa ferita.`,
    de: (na) => `\n${na}, die Reparatur nach Konflikten hängt von dieser Achse ab. Wenn Merkur fließt, ist Vergebung leicht; wenn er blockiert, wird jedes Schweigen zur Wunde.`,
    fr: (na) => `\n${na}, la réparation après conflit dépend de cet axe. Quand Mercure coule, le pardon est facile ; quand il bloque, chaque silence devient une blessure.`,
  }, nomeA))

  const merMer = aspectos.filter((a) => a.keyA === 'mercurio' && a.keyB === 'mercurio').slice(0, 2)
  if (merMer.length) {
    linhas.push('')
    for (const a of merMer) linhas.push(aspectoNarrativa(a, lang, nomeA, nomeB))
  }
  return linhas.join('\n')
}

export function narrativaFuturo(posA, posB, aspectos, lang = 'pt') {
  const nomeA = posA?.nome || contentForLang(lang, NOME_PADRAO_A)
  const nomeB = posB?.nome || contentForLang(lang, NOME_PADRAO_B)
  const jupA = pickSigno(posA?.corpos, 'jupiter')
  const satA = pickSigno(posA?.corpos, 'saturno')
  const jupB = pickSigno(posB?.corpos, 'jupiter')
  const satB = pickSigno(posB?.corpos, 'saturno')
  const linhas = []

  const tema = contentForLang(lang, TEMA_FUTURO)
  linhas.push(aberturaProfessor(nomeA, nomeB, tema, lang).trim())

  if (jupA) {
    linhas.push(sx(lang, {
      pt: (na, nb, s) => `O teu Júpiter em ${s} mostra onde **tu** expandes e acreditas. Sonhos partilhados funcionam quando ${nb} alimenta esta fé, não a encolhe.`,
      en: (na, nb, s) => `Your Jupiter in ${s} shows where **you** expand and believe. Shared dreams work when ${nb} feeds this faith, not shrinks it.`,
      es: (na, nb, s) => `Tu Júpiter en ${s} muestra dónde **tú** expandes y crees. Los sueños compartidos funcionan cuando ${nb} alimenta esta fe, no la encoge.`,
      it: (na, nb, s) => `Il tuo Giove in ${s} mostra dove **tu** espandi e credi. I sogni condivisi funzionano quando ${nb} nutre questa fede, non la restringe.`,
      de: (na, nb, s) => `Dein Jupiter in ${s} zeigt, wo **du** expandierst und glaubst. Gemeinsame Träume funktionieren, wenn ${nb} diesen Glauben nährt, nicht schrumpft.`,
      fr: (na, nb, s) => `Ton Jupiter en ${s} montre où **tu** t'élargis et crois. Les rêves partagés fonctionnent quand ${nb} nourrit cette foi, ne la rétrécit pas.`,
    }, nomeA, nomeB, tsSign(jupA, lang)))
  }
  if (satA) {
    linhas.push(sx(lang, {
      pt: (na, s) => `O teu Saturno em ${s} é onde te comprometes devagar - os teus muros e non-negotiables no amor longo.`,
      en: (na, s) => `Your Saturn in ${s} is where you commit slowly - your walls and non-negotiables in long love.`,
      es: (na, s) => `Tu Saturno en ${s} es donde te comprometes despacio: tus muros y límites en el amor largo.`,
      it: (na, s) => `Il tuo Saturno in ${s} è dove ti impegni lentamente: i tuoi muri e i tuoi limiti nell'amore lungo.`,
      de: (na, s) => `Dein Saturn in ${s} ist, wo du dich langsam verpflichtest – deine Mauern und Non-Negotiables in langer Liebe.`,
      fr: (na, s) => `Ton Saturne en ${s} est où tu t'engages lentement – tes murs et tes non-négociables dans l'amour long.`,
    }, nomeA, tsSign(satA, lang)))
  }
  linhas.push('')
  if (jupB) {
    linhas.push(sx(lang, {
      pt: (nb, s) => `Júpiter de ${nb} em ${s} revela a filosofia de vida dele/a. Crescem juntos quando ambos os Júpiters respiram a mesma esperança.`,
      en: (nb, s) => `${nb}'s Jupiter in ${s} reveals their philosophy of life. You grow together when both Jupiters breathe the same hope.`,
      es: (nb, s) => `Júpiter de ${nb} en ${s} revela su filosofía de vida. Crecen juntos cuando ambos Júpiter respiran la misma esperanza.`,
      it: (nb, s) => `Giove di ${nb} in ${s} rivela la sua filosofia di vita. Crescete insieme quando entrambi i Giove respirano la stessa speranza.`,
      de: (nb, s) => `${nb}s Jupiter in ${s} offenbart ihre/seine Lebensphilosophie. Ihr wachst zusammen, wenn beide Jupiters dieselbe Hoffnung atmen.`,
      fr: (nb, s) => `Jupiter de ${nb} en ${s} révèle sa philosophie de vie. Vous grandissez ensemble quand les deux Jupiter respirent la même espérance.`,
    }, nomeB, tsSign(jupB, lang)))
  }
  if (satB) {
    linhas.push(sx(lang, {
      pt: (nb, s) => `Saturno de ${nb} em ${s} mostra dever e medo. A questão: constroem estrutura juntos, ou um leva o peso sozinho?`,
      en: (nb, s) => `${nb}'s Saturn in ${s} shows duty and fear. The question: do you build a structure together, or does one carry the weight alone?`,
      es: (nb, s) => `Saturno de ${nb} en ${s} muestra deber y miedo. La pregunta: ¿construyen estructura juntos o uno lleva el peso solo?`,
      it: (nb, s) => `Saturno di ${nb} in ${s} mostra dovere e paura. La domanda: costruite struttura insieme o uno porta il peso da solo?`,
      de: (nb, s) => `${nb}s Saturn in ${s} zeigt Pflicht und Angst. Die Frage: Baut ihr gemeinsam Struktur, oder trägt einer das Gewicht allein?`,
      fr: (nb, s) => `Saturne de ${nb} en ${s} montre devoir et peur. La question : construisez-vous une structure ensemble, ou l'un porte-t-il le poids seul ?`,
    }, nomeB, tsSign(satB, lang)))
  }

  const jupSat = aspectos.filter((a) => ['jupiter', 'saturno'].includes(a.keyA) && ['jupiter', 'saturno'].includes(a.keyB)).slice(0, 3)
  if (jupSat.length) {
    linhas.push('')
    linhas.push(sx(lang, {
      pt: '*O que Júpiter e Saturno tecem para o vosso futuro:*',
      en: '*What Jupiter and Saturn weave for your future:*',
      es: '*Lo que Júpiter y Saturno tejen para vuestro futuro:*',
      it: '*Cosa tessono Giove e Saturno per il vostro futuro:*',
      de: '*Was Jupiter und Saturn für eure Zukunft weben:*',
      fr: '*Ce que Jupiter et Saturne tissent pour votre avenir :*',
    }))
    for (const a of jupSat) linhas.push(aspectoNarrativa(a, lang, nomeA, nomeB))
  }
  return linhas.join('\n')
}

export function narrativaMissaoIndividual(pos, lang = 'pt') {
  if (!pos?.corpos?.sol) return ''
  const nome = pos.nome || contentForLang(lang, NOME_PESSOA)
  const signo = pos.corpos.sol.signo
  const fn = MISSAO_SOL_LONGA[signo]
  const linhas = [fn ? pickNarr(fn, lang, nome) : '']

  const mc = pos.corpos.mc
  const nn = pos.corpos.nodo_norte
  if (mc) {
    linhas.push(lang !== 'pt'
      ? `\nIn public life, Midheaven in ${mc.signo} (${mc.graus?.toFixed?.(1) ?? ''}°) directs vocation toward building a reputation aligned with ${mc.elemento} - concrete expression of soul mission in the world.`
      : `\nNa vida pública, o Meio-Céu em ${mc.signo} (${mc.graus?.toFixed?.(1) ?? ''}°) direcciona a vocação para construir reputação alinhada com ${mc.elemento} - expressão concreta da missão de alma no mundo.`)
  }
  if (nn) {
    linhas.push(lang !== 'pt'
      ? `North Node in ${nn.signo}: this lifetime invites ${pickNarr(NODO_NORTE[nn.signo], lang) || 'evolution'}.`
      : `Nodo Norte em ${nn.signo}: esta vida convida a ${pickNarr(NODO_NORTE[nn.signo], lang) || 'evoluir'}.`)
  }
  return linhas.join('')
}

export function narrativaMissaoRelacionamento(resultado, lang = 'pt') {
  const { posA, posB, nodosSinastria } = resultado
  const nomeA = posA?.nome || contentForLang(lang, NOME_PADRAO_A)
  const nomeB = posB?.nome || contentForLang(lang, NOME_PADRAO_B)
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
        ? `${nomeA}, ${act.planeta} from ${act.deQuem} touches ${act.donoNodo}'s North Node in ${act.signoNodo}. This person came to push you toward ${pickNarr(NODO_NORTE[act.signoNodo], lang) || 'evolution'} - classic *Life Purpose Activation*.`
        : `${nomeA}, ${act.planeta} de ${act.deQuem} toca o Nodo Norte de ${act.donoNodo} em ${act.signoNodo}. Esta pessoa veio empurrar-te para ${pickNarr(NODO_NORTE[act.signoNodo], lang) || 'evoluir'} - *Activação do Propósito de Vida* clássica.`)
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
        ? `• ${act.planeta} (${act.deQuem}) - ${pickNarr(NODO_SUL[act.signoNodo], lang) || 'karmic pattern to release'}`
        : `• ${act.planeta} (${act.deQuem}) - ${pickNarr(NODO_SUL[act.signoNodo], lang) || 'padrão cármico a largar'}`)
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
  const INTRO = {
    pt: `${nomeA}, bem-vindo(a) à tua sinastria pessoal com ${nomeB}. Cada parágrafo abaixo foi escrito para **ti** - a partir dos graus exactos do teu céu de nascimento cruzado com o dele/a. Lê como um professor de astrologia a falar contigo em privado: os astros não julgam; narram a história que estás a viver a dois.\n\nTom geral do vínculo: **${pontuacao}%** de compatibilidade nos eixos química, emoção, comunicação e futuro.`,
    en: `${nomeA}, welcome to your personal synastry with ${nomeB}. Every paragraph below was written for **you** - from the exact degrees of your birth sky crossed with theirs. Read as an astrology teacher speaking privately to you: the stars are not judging; they are narrating the story you are living together.\n\nOverall bond tone: **${pontuacao}%** compatibility across chemistry, emotion, communication and future.`,
    es: `${nomeA}, bienvenido/a a tu sinastría personal con ${nomeB}. Cada párrafo fue escrito para **ti** a partir de los grados exactos de tu cielo de nacimiento cruzado con el suyo. Lee como un profesor de astrología hablándote en privado: los astros no juzgan; narran la historia que vives en pareja.\n\nTono general del vínculo: **${pontuacao}%** de compatibilidad en química, emoción, comunicación y futuro.`,
    it: `${nomeA}, benvenuto/a alla tua sinastria personale con ${nomeB}. Ogni paragrafo è stato scritto per **te** dai gradi esatti del tuo cielo natale incrociato con il suo. Leggi come un insegnante di astrologia che ti parla in privato: le stelle non giudicano; narrano la storia che vivi in coppia.\n\nTono generale del legame: **${pontuacao}%** di compatibilità su chimica, emozione, comunicazione e futuro.`,
    de: `${nomeA}, willkommen zu deiner persönlichen Synastrie mit ${nomeB}. Jeder Absatz wurde für **dich** geschrieben – aus den exakten Graden deines Geburtshimmels gekreuzt mit dem ihrem/seinem. Lies es wie ein Astrologielehrer, der privat mit dir spricht: Die Sterne urteilen nicht; sie erzählen die Geschichte, die ihr gemeinsam lebt.\n\nGesamtton der Verbindung: **${pontuacao}%** Kompatibilität in Chemie, Emotion, Kommunikation und Zukunft.`,
    fr: `${nomeA}, bienvenue dans ta synastrie personnelle avec ${nomeB}. Chaque paragraphe a été écrit pour **toi** à partir des degrés exacts de ton ciel de naissance croisé avec le sien. Lis comme un professeur d'astrologie qui te parle en privé : les astres ne jugent pas ; ils racontent l'histoire que tu vis à deux.\n\nTon général du lien : **${pontuacao}%** de compatibilité en chimie, émotion, communication et avenir.`,
  }
  return INTRO[lang] || INTRO.en
}

export { SIGNO_PT }
