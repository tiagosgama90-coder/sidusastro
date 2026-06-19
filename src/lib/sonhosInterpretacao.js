/**
 * Interpretação de sonhos — Matriz Hermenêutica de Psicologia Espiritual Integrativa.
 * Metodologia: hermenêutica bíblico-psicológica (literatura de referência interna).
 */

const SIMBOLOS_PT = [
  { id: 'agua', keys: ['água', 'agua', 'mar', 'rio', 'chuva', 'oceano', 'lago', 'fonte', 'poça', 'poça'],
    tema: 'Água / Mar',
    calma: 'A água serena aponta para purificação interior e acalmamento das emoções — o Espírito acolhe o que foi agitado.',
    violenta: 'Águas turbulentas revelam caos psíquico ou pressões externas que sufocam a fé e a paz interior.',
    neutro: 'A água espelha o estado emocional actual: observa se era convidativa ou ameaçadora para compreender o diagnóstico da alma.' },
  { id: 'animais', keys: ['animal', 'cão', 'cao', 'gato', 'cavalo', 'lobo', 'pássaro', 'passaro', 'serpente', 'cobra', 'fera', 'leão', 'leao', 'urso', 'tigre'],
    tema: 'Animais / Feras',
    calma: 'Os animais serenos representam instintos dados pelo Criador que pedem integração amorosa — forças vitais prontas para ser educadas.',
    violenta: 'Feras agressivas mostram instintos reprimidos (raiva, sexualidade, cansaço) que pedem acolhimento em vez de negação.',
    neutro: 'O animal no sonho espelha uma paixão ou impulso que a consciência ainda não soube integrar com compaixão.' },
  { id: 'queda', keys: ['queda', 'queda', 'cair', 'cai', 'caeu', 'precipício', 'precipicio', 'abismo', 'vertigem', 'despenhar'],
    tema: 'Queda / Vertigem',
    calma: 'A queda suave convida a tocar o chão da realidade — aceitar a fragilidade humana sem drama.',
    violenta: 'Quedas bruscas diagnosticam orgulho, perfeccionismo ou ego inflado que o inconsciente força a humilhar.',
    neutro: 'Cair no sonho não é mau presságio — é o inconsciente a pedir humildade e contacto com a terra.' },
  { id: 'voo', keys: ['voo', 'voar', 'voando', 'asas', 'subir', 'elev', 'planar', 'flutuar'],
    tema: 'Voar / Subir',
    calma: 'Voar com leveza expressa desejo espiritual de liberdade e expansão da consciência.',
    violenta: 'Voar alto demais ou perder o controlo alerta para fuga da realidade ou idealismo que afasta das responsabilidades terrenas.',
    neutro: 'O voo revela anseio de amplitude — pergunta-te se estás a fugir ou a transcender.' },
  { id: 'escuridao', keys: ['escuridão', 'escuridao', 'noite', 'escuro', 'trevas', 'deserto', 'neblina', 'nevoeiro', 'sombra'],
    tema: 'Escuridão / Deserto',
    calma: 'A noite serena é convite ao silêncio sagrado — a paciência antes do amanhecer de um novo ciclo.',
    violenta: 'Trevas opressivas marcam a "noite escura da alma" — deserto espiritual necessário, mas doloroso.',
    neutro: 'A escuridão não anuncia mal — convida ao recolhimento e à escuta interior antes da luz.' },
  { id: 'morte', keys: ['morte', 'morrer', 'funeral', 'caixão', 'caixao', 'enterro', 'cadáver', 'cadaver', 'sepultura'],
    tema: 'Morte / Enterro',
    calma: 'A morte simbólica anuncia desapego sereno — o velho eu pronto a ceder lugar ao homem novo.',
    violenta: 'Morte violenta ou pesadelo de enterro são alertas misericordiosos para olhar feridas não curadas.',
    neutro: 'Morte nos sonhos nunca é previsão física — é transição teológica e renascimento interior.' },
  { id: 'casa', keys: ['casa', 'lar', 'quarto', 'porta', 'janela', 'sótão', 'sotao', 'porão', 'porao', 'corredor', 'escada', 'cômodo', 'comodo'],
    tema: 'Casas / Cômodos',
    calma: 'A casa acolhedora reflecte a estrutura da alma em ordem — compartimentos abertos indicam integração.',
    violenta: 'Portas trancadas, porões sombrios ou ruínas revelam áreas da vida escondidas de si e de Deus.',
    neutro: 'Cada divisão da casa é uma faceta da alma — sótãos são ideais elevados; porões, a sombra.' },
  { id: 'fogo', keys: ['fogo', 'chama', 'incêndio', 'incendio', 'queimar', 'brasas'],
    tema: 'Fogo',
    calma: 'Chama controlada simboliza paixão espiritual e entusiasmo canalizado com consciência.',
    violenta: 'Incêndio descontrolado alerta para conflitos ou emoções que consomem energia vital.',
    neutro: 'O fogo purifica — pergunta se arde para iluminar ou para destruir.' },
  { id: 'crianca', keys: ['criança', 'crianca', 'bebé', 'bebe', 'filho', 'filha', 'menino', 'menina'],
    tema: 'Criança',
    calma: 'A criança representa pureza e novo potencial a nascer na alma.',
    violenta: 'Criança ferida ou abandonada aponta feridas de infância que pedem cuidado compassivo.',
    neutro: 'Algo novo e vulnerável pede proteção interior — não julgamento.' },
  { id: 'perseguicao', keys: ['perseguição', 'perseguicao', 'fugir', 'fuga', 'correr', 'assassino', 'monstro', 'ameaça', 'ameaca'],
    tema: 'Perseguição / Pesadelo',
    calma: 'Fugir com consciência indica reconhecimento de algo que evitas confrontar.',
    violenta: 'Pesadelos de perseguição são alertas misericordiosos — o medo aponta exactamente onde curar.',
    neutro: 'Quem ou o que te persegue é uma parte tua ainda rejeitada — integrá-la é o caminho.' },
  { id: 'dinheiro', keys: ['dinheiro', 'ouro', 'joia', 'tesouro', 'moeda', 'riqueza'],
    tema: 'Tesouro / Valor',
    calma: 'Riqueza no sonho aponta talentos e valor interior ainda não plenamente reconhecidos.',
    violenta: 'Perder ou roubar dinheiro reflecte insegurança sobre o próprio valor.',
    neutro: 'O tesouro pede que reconheças o que já possuis na alma.' },
]

const SIMBOLOS_EN = [
  { id: 'agua', keys: ['water', 'sea', 'ocean', 'river', 'rain', 'lake', 'flood'],
    tema: 'Water / Sea', calma: 'Calm water points to inner purification and emotional peace.', violenta: 'Turbulent waters reveal psychic chaos or external pressures suffocating inner peace.', neutro: 'Water mirrors your emotional state — notice if it felt welcoming or threatening.' },
  { id: 'animais', keys: ['animal', 'dog', 'cat', 'horse', 'wolf', 'bird', 'snake', 'beast', 'lion', 'bear', 'tiger'],
    tema: 'Animals / Beasts', calma: 'Gentle animals represent instincts ready for loving integration.', violenta: 'Aggressive beasts show repressed instincts (anger, sexuality, exhaustion) asking to be welcomed.', neutro: 'The animal mirrors a passion the conscious mind has not yet integrated with compassion.' },
  { id: 'queda', keys: ['fall', 'falling', 'drop', 'cliff', 'abyss', 'vertigo'],
    tema: 'Fall / Vertigo', calma: 'A soft fall invites touching the ground of reality — accepting human fragility.', violenta: 'Abrupt falls diagnose pride, perfectionism or inflated ego the unconscious humbles.', neutro: 'Falling is not a bad omen — the unconscious asks for humility and earth contact.' },
  { id: 'voo', keys: ['fly', 'flying', 'wings', 'rise', 'float', 'soar'],
    tema: 'Flying / Rising', calma: 'Light flight expresses spiritual desire for freedom and expanded consciousness.', violenta: 'Flying too high or losing control warns of escapism or idealism avoiding earthly duties.', neutro: 'Flight reveals longing for breadth — ask if you are fleeing or transcending.' },
  { id: 'escuridao', keys: ['darkness', 'night', 'dark', 'desert', 'fog', 'shadow'],
    tema: 'Darkness / Desert', calma: 'A serene night invites sacred silence — patience before a new cycle dawns.', violenta: 'Oppressive darkness marks the "dark night of the soul" — necessary but painful spiritual desert.', neutro: 'Darkness does not announce evil — it invites retreat and inner listening before light.' },
  { id: 'morte', keys: ['death', 'die', 'funeral', 'coffin', 'burial', 'corpse', 'grave'],
    tema: 'Death / Burial', calma: 'Symbolic death announces serene detachment — the old self ready to yield to the new.', violenta: 'Violent death or burial nightmares are merciful alerts to look at unhealed wounds.', neutro: 'Death in dreams is never physical prediction — it is inner transition and rebirth.' },
  { id: 'casa', keys: ['house', 'home', 'room', 'door', 'window', 'attic', 'basement', 'hallway', 'stairs'],
    tema: 'Houses / Rooms', calma: 'A welcoming house reflects an ordered soul structure — open rooms indicate integration.', violenta: 'Locked doors, dark basements or ruins reveal life areas hidden from self and God.', neutro: 'Each room is a facet of the soul — attics are elevated ideals; basements, the shadow.' },
  { id: 'fogo', keys: ['fire', 'flame', 'burning', 'blaze'],
    tema: 'Fire', calma: 'Controlled flame symbolises spiritual passion and consciously channelled enthusiasm.', violenta: 'Uncontrolled fire warns of conflicts or emotions consuming vital energy.', neutro: 'Fire purifies — ask if it burns to illuminate or to destroy.' },
  { id: 'crianca', keys: ['child', 'baby', 'son', 'daughter', 'boy', 'girl'],
    tema: 'Child', calma: 'The child represents purity and new potential being born in the soul.', violenta: 'A wounded or abandoned child points to childhood wounds asking for compassionate care.', neutro: 'Something new and vulnerable asks for inner protection — not judgment.' },
  { id: 'perseguicao', keys: ['chase', 'chasing', 'run', 'escape', 'killer', 'monster', 'threat'],
    tema: 'Pursuit / Nightmare', calma: 'Fleeing with awareness indicates recognition of something you avoid confronting.', violenta: 'Pursuit nightmares are merciful alerts — fear points exactly where to heal.', neutro: 'What pursues you is a rejected part of yourself — integration is the path.' },
  { id: 'dinheiro', keys: ['money', 'gold', 'jewel', 'treasure', 'coin', 'wealth'],
    tema: 'Treasure / Value', calma: 'Wealth in dreams points to talents and inner value not yet fully recognised.', violenta: 'Losing or stealing money reflects insecurity about your own worth.', neutro: 'The treasure asks you to recognise what you already possess in the soul.' },
]

const SENTIMENTOS = {
  peace: { pt: 'paz', en: 'peace', calma: true },
  fear: { pt: 'medo', en: 'fear', calma: false },
  sadness: { pt: 'tristeza', en: 'sadness', calma: false },
  joy: { pt: 'alegria', en: 'joy', calma: true },
  confusion: { pt: 'confusão', en: 'confusion', calma: false },
  anger: { pt: 'raiva', en: 'anger', calma: false },
}

export const CHIPS_SIMBOLOS_PT = ['Água', 'Casa', 'Morte', 'Voar', 'Queda', 'Animal', 'Escuridão', 'Fogo', 'Perseguição', 'Criança']
export const CHIPS_SIMBOLOS_EN = ['Water', 'House', 'Death', 'Flying', 'Falling', 'Animal', 'Darkness', 'Fire', 'Pursuit', 'Child']

const CHIP_MAP_PT = {
  'Água': 'agua', 'Casa': 'casa', 'Morte': 'morte', 'Voar': 'voo', 'Queda': 'queda',
  'Animal': 'animais', 'Escuridão': 'escuridao', 'Fogo': 'fogo', 'Perseguição': 'perseguicao', 'Criança': 'crianca',
}
const CHIP_MAP_EN = {
  Water: 'agua', House: 'casa', Death: 'morte', Flying: 'voo', Falling: 'queda',
  Animal: 'animais', Darkness: 'escuridao', Fire: 'fogo', Pursuit: 'perseguicao', Child: 'crianca',
}

function detectarSimbolos(texto, lista) {
  const lower = texto.toLowerCase()
  return lista.filter((s) => s.keys.some((k) => lower.includes(k)))
}

function detectarSentimentoTexto(texto, lang) {
  const lower = texto.toLowerCase()
  const medo = ['medo', 'terror', 'pavor', 'angústia', 'angustia', 'fear', 'terror', 'dread', 'anxiety']
  const paz = ['paz', 'calma', 'sereno', 'tranquilo', 'peace', 'calm', 'serene']
  if (medo.some((w) => lower.includes(w))) return 'violenta'
  if (paz.some((w) => lower.includes(w))) return 'calma'
  return 'neutro'
}

function textoSimbolo(simbolo, tom, lang) {
  if (tom === 'calma') return simbolo.calma
  if (tom === 'violenta') return simbolo.violenta
  return simbolo.neutro
}

function regraOuro(simboloTexto, tom, lang) {
  const e = lang === 'en'
  const tomLabel = tom === 'calma' ? (e ? 'peaceful' : 'sereno') : tom === 'violenta' ? (e ? 'fearful' : 'ameaçador') : (e ? 'ambiguous' : 'ambíguo')
  if (e) {
    return `Regarding "${simboloTexto}" (felt as ${tomLabel}): (1) It reveals current fatigue or inner conflict demanding attention. (2) It appeals for a change of attitude — conversion toward what was avoided. (3) It can become a remedy of healing and reconciliation when welcomed with compassion.`
  }
  return `Quanto a "${simboloTexto}" (vivido como ${tomLabel}): (1) Revela o cansaço ou conflito actual que pede atenção. (2) Apela a uma mudança de atitude — conversão face ao que foi evitado. (3) Pode tornar-se remédio de cura e reconciliação quando acolhido com compaixão.`
}

function buildSecoes(texto, encontrados, tomGeral, mapaNatal, lang, feelingKey) {
  const e = lang === 'en'
  const solar = mapaNatal?.solar?.nome
  const lunar = mapaNatal?.lunar?.nome
  const feeling = feelingKey && SENTIMENTOS[feelingKey]
  const feelingLabel = feeling ? (e ? feeling.en : feeling.pt) : null

  const tomFromFeeling = feeling
    ? (feeling.calma ? 'calma' : 'violenta')
    : tomGeral

  const leituras = encontrados.map((s) => ({
    tema: s.tema,
    texto: textoSimbolo(s, tomFromFeeling, lang),
  }))

  const simbolosTexto = leituras.map((l) => l.texto).join(' ')
  const temas = leituras.map((l) => l.tema).join(', ')

  const analiseAlma = e
    ? `The dream is not fortune-telling — it processes daily life and diagnoses the soul's current state.${feelingLabel ? ` The dominant feeling (${feelingLabel}) is the truest key to the symbol's meaning.` : ' The emotion felt in the dream changes every symbol.'}${temas ? ` Images detected: ${temas}.` : ''} ${simbolosTexto || 'Even without obvious keys, the dream carries a message about your inner life right now.'}${solar && lunar ? ` With Sun in ${solar} and Moon in ${lunar}, the dream resonates with your natal temperament — the Sun colours the conscious message; the Moon reveals what the heart already knows.` : ''}`
    : `O sonho não é adivinhação — processa as vivências diárias e diagnostica o estado actual da alma.${feelingLabel ? ` O sentimento dominante (${feelingLabel}) é a chave mais fiel do significado dos símbolos.` : ' A emoção sentida no sonho altera o sentido de cada imagem.'}${temas ? ` Imagens detectadas: ${temas}.` : ''} ${simbolosTexto || 'Mesmo sem chaves evidentes, o sonho traz mensagem sobre a tua vida interior neste momento.'}${solar && lunar ? ` Com Sol em ${solar} e Lua em ${lunar}, o sonho ressoa com o teu temperamento natal — o Sol colore a mensagem consciente; a Lua revela o que o coração já sabe.` : ''}`

  const alertaInterno = tomFromFeeling === 'violenta'
    ? (e
      ? 'The nightmare or tension in this dream is a merciful alert — not punishment. Something in daily life is being avoided: a wound, a responsibility, or a truth the ego resists. The inner confrontation you flee in waking life returns symbolically so you may look at it with honesty.'
      : 'O pesadelo ou a tensão deste sonho é um alerta misericordioso — não castigo. Algo na vida quotidiana está a ser evitado: uma ferida, uma responsabilidade ou uma verdade que o ego resiste. O confronto interior que foges acordado regressa simbolicamente para que o olhes com honestidade.')
    : (e
      ? 'What seems peaceful may still hide a gentle invitation to change — comfort can mask stagnation. Ask whether this dream confirms a needed rest or subtly warns against avoiding a necessary step.'
      : 'O que parece pacífico pode ainda esconder um convite suave à mudança — o conforto pode mascarar estagnação. Pergunta se este sonho confirma um descanso necessário ou avisa subtilmente contra evitar um passo necessário.')

  const caminhoCura = e
    ? 'Do not seek lucky numbers or future predictions from this dream. Instead: (1) Name honestly what you feel today. (2) Dedicate ten minutes of silence or journaling. (3) Take one small reconciling action — with yourself or someone the dream touched. Healing comes through attitude, quietude and detachment from controlling outcomes.'
    : 'Não procures números da sorte nem previsões futuras neste sonho. Em vez disso: (1) Nomeia honestamente o que sentes hoje. (2) Dedica dez minutos de silêncio ou escrita. (3) Dá um pequeno gesto de reconciliação — contigo ou com quem o sonho tocou. A cura vem pela actitude, quietude e desapego de controlar resultados.'

  const pergunta = e
    ? 'What part of this dream asks you — not for answers, but for a softer gaze upon yourself?'
    : 'Que parte deste sonho te pede — não respostas, mas um olhar mais suave sobre ti mesmo?'

  return [
    { key: 'section1', titulo: e ? 'Analysis of the Soul\'s State' : 'Análise do Estado da Alma', texto: analiseAlma },
    { key: 'section2', titulo: e ? 'The Inner Alert' : 'O Alerta Interno', texto: alertaInterno },
    { key: 'section3', titulo: e ? 'The Path of Spiritual Healing' : 'O Caminho de Cura Espiritual', texto: caminhoCura },
    { key: 'section4', titulo: e ? 'Question for Meditation' : 'Pergunta para Meditação', texto: pergunta },
  ]
}

export function interpretarSonho(texto, mapaNatal, lang = 'pt', feelingKey = null, chipsExtra = []) {
  if (!texto?.trim()) return null
  const lista = lang === 'en' ? SIMBOLOS_EN : SIMBOLOS_PT
  const textoCompleto = [texto, ...(chipsExtra || [])].join(' ')
  let encontrados = detectarSimbolos(textoCompleto, lista)

  const tomGeral = detectarSentimentoTexto(textoCompleto, lang)

  if (encontrados.length === 0 && chipsExtra?.length) {
    const chipMap = lang === 'en' ? CHIP_MAP_EN : CHIP_MAP_PT
    const ids = chipsExtra.map((c) => chipMap[c]).filter(Boolean)
    encontrados = lista.filter((s) => ids.includes(s.id))
  }

  const simbolosExtra = (chipsExtra || []).filter((chip) => {
    const cl = chip.toLowerCase()
    return !encontrados.some((s) => s.tema.toLowerCase().includes(cl.slice(0, 4)))
  })

  const leiturasExtra = simbolosExtra.map((chip) => ({
    tema: chip,
    texto: regraOuro(chip, tomGeral, lang),
  }))

  const leituras = [
    ...encontrados.map((s) => ({
      tema: s.tema,
      texto: textoSimbolo(s, feelingKey && SENTIMENTOS[feelingKey]
        ? (SENTIMENTOS[feelingKey].calma ? 'calma' : 'violenta')
        : tomGeral, lang),
    })),
    ...leiturasExtra,
  ]

  const seccoes = buildSecoes(textoCompleto, encontrados.length ? encontrados : lista.slice(0, 1), tomGeral, mapaNatal, lang, feelingKey)

  return { seccoes, simbolos: leituras, tom: tomGeral }
}
