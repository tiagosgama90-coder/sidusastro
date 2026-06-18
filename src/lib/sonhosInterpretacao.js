/**
 * Interpretação simbólica de sonhos — leitura espiritual e arquetípica.
 */

const SIMBOLOS_PT = [
  { keys: ['água', 'agua', 'mar', 'rio', 'chuva', 'oceano', 'lago'], tema: 'Água',
    luz: 'A água no sonho fala da vida emocional e do inconsciente. Quando é calma, há reconciliação interior; quando agitada, emoções pedem expressão honesta.',
    sombra: 'Águas turvas ou afogamento sugerem medo de ser invadido pelos próprios sentimentos. O sonho convida a acolher o que foi reprimido.' },
  { keys: ['casa', 'lar', 'quarto', 'porta', 'janela'], tema: 'Casa',
    luz: 'A casa é o eu interior. Novos compartimentos indicam descoberta de facetas da personalidade; renovações apontam para cura e reestruturação da identidade.',
    sombra: 'Casas em ruínas ou portas trancadas reflectem partes de ti que te sentes incapaz de habitar. Que divisão precisa de luz?' },
  { keys: ['morte', 'funeral', 'caixão', 'enterro'], tema: 'Morte',
    luz: 'Sonhar com morte raramente anuncia fim literal — marca transformação profunda. Algo em ti está pronto para renascer sob nova forma.',
    sombra: 'Resistência à mudança pode manifestar-se como medo do desconhecido. O sonho pede confiança no ciclo natural de deixar ir.' },
  { keys: ['criança', 'bebé', 'bebe', 'filho', 'filha'], tema: 'Criança',
    luz: 'A criança representa pureza, potencial criativo e o início de um projecto interior. Há algo novo a nascer na tua alma.',
    sombra: 'Uma criança ferida pode apontar para feridas da infância que pedem cuidado compassivo, não julgamento.' },
  { keys: ['serpente', 'cobra', 'dragão', 'dragao'], tema: 'Serpente',
    luz: 'A serpente é energia vital e sabedoria ancestral. A transformação da pele simboliza renovação e cura profunda.',
    sombra: 'Uma serpente ameaçadora pode representar desejo reprimido ou uma verdade que evitas confrontar.' },
  { keys: ['voo', 'voar', 'voando', 'asas', 'céu', 'ceu'], tema: 'Voo',
    luz: 'Voar indica libertação das limitações e expansão da consciência. O espírito anseia por amplitude e perspectiva.',
    sombra: 'Queda durante o voo sugere medo de falhar quando te elevaste demasiado nas expectativas.' },
  { keys: ['animal', 'cão', 'cao', 'gato', 'cavalo', 'lobo', 'pássaro', 'passaro'], tema: 'Animal',
    luz: 'Os animais nos sonhos trazem instintos autênticos. Observa o comportamento do animal — ele espelha uma força tua ainda não integrada.',
    sombra: 'Animais agressivos podem simbolizar impulsos que temes ou qualidades que projectas nos outros.' },
  { keys: ['escada', 'subir', 'descer', 'montanha'], tema: 'Ascensão',
    luz: 'Subir representa evolução espiritual ou profissional. Cada degrau é um passo de maturidade conquistado com paciência.',
    sombra: 'Descer ou escadas quebradas indicam cansaço no caminho ou necessidade de regressar a fundamentos esquecidos.' },
  { keys: ['dinheiro', 'ouro', 'joia', 'tesouro'], tema: 'Tesouro',
    luz: 'Riqueza nos sonhos aponta para valor interior — talentos, autoestima e recursos da alma ainda não plenamente reconhecidos.',
    sombra: 'Perder dinheiro pode reflectir insegurança sobre o teu próprio valor ou medo de escassez.' },
  { keys: ['fogo', 'chama', 'incêndio', 'incendio'], tema: 'Fogo',
    luz: 'O fogo purifica e transforma. É paixão, entusiasmo e a chama sagrada da inspiração que precisa de canal consciente.',
    sombra: 'Incêndios descontrolados alertam para emoções ou conflitos que consomem energia vital sem propósito construtivo.' },
]

const SIMBOLOS_EN = [
  { keys: ['water', 'sea', 'ocean', 'river', 'rain', 'lake'], tema: 'Water',
    luz: 'Water in dreams speaks of emotional life and the unconscious. When calm, there is inner reconciliation; when turbulent, feelings ask for honest expression.',
    sombra: 'Murky water or drowning suggests fear of being overwhelmed by your own emotions. The dream invites you to welcome what was repressed.' },
  { keys: ['house', 'home', 'room', 'door', 'window'], tema: 'House',
    luz: 'The house is the inner self. New rooms indicate discovery of personality facets; renovations point to healing and restructuring identity.',
    sombra: 'Ruined houses or locked doors reflect parts of yourself you feel unable to inhabit. Which room needs light?' },
  { keys: ['death', 'funeral', 'coffin', 'burial'], tema: 'Death',
    luz: 'Dreaming of death rarely announces a literal end — it marks deep transformation. Something in you is ready to be reborn in a new form.',
    sombra: 'Resistance to change may appear as fear of the unknown. The dream asks trust in the natural cycle of letting go.' },
  { keys: ['child', 'baby', 'son', 'daughter'], tema: 'Child',
    luz: 'The child represents purity, creative potential and the birth of an inner project. Something new is being born in your soul.',
    sombra: 'A wounded child may point to childhood wounds asking for compassionate care, not judgment.' },
  { keys: ['snake', 'serpent', 'dragon'], tema: 'Serpent',
    luz: 'The serpent is vital energy and ancestral wisdom. Shedding skin symbolises renewal and deep healing.',
    sombra: 'A threatening serpent may represent repressed desire or a truth you avoid confronting.' },
  { keys: ['fly', 'flying', 'wings', 'sky'], tema: 'Flight',
    luz: 'Flying indicates liberation from limitations and expansion of consciousness. The spirit longs for breadth and perspective.',
    sombra: 'Falling during flight suggests fear of failing when you rose too high in expectations.' },
  { keys: ['animal', 'dog', 'cat', 'horse', 'wolf', 'bird'], tema: 'Animal',
    luz: 'Animals in dreams bring authentic instincts. Watch the animal\'s behaviour — it mirrors a force in you not yet integrated.',
    sombra: 'Aggressive animals may symbolise impulses you fear or qualities you project onto others.' },
  { keys: ['stairs', 'climb', 'descend', 'mountain'], tema: 'Ascent',
    luz: 'Climbing represents spiritual or professional evolution. Each step is maturity gained with patience.',
    sombra: 'Descending or broken stairs indicate weariness on the path or need to return to forgotten foundations.' },
  { keys: ['money', 'gold', 'jewel', 'treasure'], tema: 'Treasure',
    luz: 'Wealth in dreams points to inner value — talents, self-esteem and soul resources not yet fully recognised.',
    sombra: 'Losing money may reflect insecurity about your own worth or fear of scarcity.' },
  { keys: ['fire', 'flame', 'burning'], tema: 'Fire',
    luz: 'Fire purifies and transforms. It is passion, enthusiasm and the sacred flame of inspiration needing conscious channel.',
    sombra: 'Uncontrolled fires warn of emotions or conflicts consuming vital energy without constructive purpose.' },
]

function detectarSimbolos(texto, lista) {
  const lower = texto.toLowerCase()
  return lista.filter((s) => s.keys.some((k) => lower.includes(k)))
}

export function interpretarSonho(texto, mapaNatal, lang = 'pt') {
  if (!texto?.trim()) return null
  const lista = lang === 'en' ? SIMBOLOS_EN : SIMBOLOS_PT
  const encontrados = detectarSimbolos(texto, lista)

  const solar = mapaNatal?.solar?.nome
  const lunar = mapaNatal?.lunar?.nome

  const intro = lang === 'en'
    ? 'The dream is a letter the soul writes to itself in the language of symbols. What follows is a reading of the images that emerged, inviting integration rather than fear.'
    : 'O sonho é uma carta que a alma escreve a si mesma na linguagem dos símbolos. O que se segue é uma leitura das imagens que emergiram, convidando à integração e não ao medo.'

  const contextoAstro = solar && lunar
    ? (lang === 'en'
      ? `\n\nWith your Sun in ${solar} and Moon in ${lunar}, the dream resonates with your natal temperament: the Sun colours the conscious message; the Moon reveals what the heart already knows but has not yet spoken.`
      : `\n\nCom o teu Sol em ${solar} e a Lua em ${lunar}, o sonho ressoa com o teu temperamento natal: o Sol colore a mensagem consciente; a Lua revela o que o coração já sabe mas ainda não disse.`)
    : ''

  if (encontrados.length === 0) {
    const generico = lang === 'en'
      ? '\n\nEven without obvious archetypal keys, the dream carries meaning. Ask yourself: what emotion dominated upon waking? That feeling is the truest interpreter. Record the dream and observe what life brings in the next days — synchronicities often confirm the message.'
      : '\n\nMesmo sem chaves arquetípicas evidentes, o sonho traz significado. Pergunta-te: que emoção dominou ao acordar? Esse sentimento é o intérprete mais fiel. Regista o sonho e observa o que a vida traz nos dias seguintes — as sincronicidades confirmam frequentemente a mensagem.'
    return { intro, simbolos: [], sintese: generico, contextoAstro }
  }

  const leituras = encontrados.map((s) => ({
    tema: s.tema,
    texto: `${s.luz}\n\n${lang === 'en' ? 'Shadow' : 'Sombra'}: ${s.sombra}`,
  }))

  const sintese = lang === 'en'
    ? '\n\nSynthesis: The dream invites you to hold both light and shadow with compassion. Do not rush to literal conclusions — let the images work within you like seeds in fertile soil. A simple gesture of attention (journaling, prayer, or sharing with someone you trust) often completes the circle the dream opened.'
    : '\n\nSíntese: O sonho convida-te a acolher luz e sombra com compaixão. Não te apresses em conclusões literais — deixa as imagens trabalharem em ti como sementes em solo fértil. Um gesto simples de atenção (escrever, rezar ou partilhar com alguém de confiança) completa frequentemente o círculo que o sonho abriu.'

  return { intro, simbolos: leituras, sintese, contextoAstro }
}
