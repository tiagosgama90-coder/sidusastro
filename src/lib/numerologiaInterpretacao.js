/**
 * Interpretação numerológica — método Pythagórico de L. Dow Balliett.
 * Vibração do nome, significado espiritual e ponte com astrologia natal.
 */

const PLANETA_NUM = {
  1: { pt: 'Sol', en: 'Sun', tema: { pt: 'identidade e vontade criativa', en: 'identity and creative will' } },
  2: { pt: 'Lua', en: 'Moon', tema: { pt: 'emoção e receptividade', en: 'emotion and receptivity' } },
  3: { pt: 'Júpiter', en: 'Jupiter', tema: { pt: 'expansão e expressão', en: 'expansion and expression' } },
  4: { pt: 'Urano', en: 'Uranus', tema: { pt: 'estrutura e revolução silenciosa', en: 'structure and quiet revolution' } },
  5: { pt: 'Mercúrio', en: 'Mercury', tema: { pt: 'mente e liberdade', en: 'mind and freedom' } },
  6: { pt: 'Vénus', en: 'Venus', tema: { pt: 'amor e serviço', en: 'love and service' } },
  7: { pt: 'Neptuno', en: 'Neptune', tema: { pt: 'mistério e intuição', en: 'mystery and intuition' } },
  8: { pt: 'Saturno', en: 'Saturn', tema: { pt: 'karma e realização', en: 'karma and achievement' } },
  9: { pt: 'Marte', en: 'Mars', tema: { pt: 'compaixão e conclusão', en: 'compassion and completion' } },
  11: { pt: 'Lua elevada', en: 'elevated Moon', tema: { pt: 'intuição mestra', en: 'master intuition' } },
  22: { pt: 'Urano mestre', en: 'master Uranus', tema: { pt: 'construção cósmica', en: 'cosmic building' } },
  33: { pt: 'Júpiter mestre', en: 'master Jupiter', tema: { pt: 'compaixão universal', en: 'universal compassion' } },
}

const BALLIETT_PT = {
  caminhoVida: {
    1: 'Balliett via no Caminho de Vida 1 a vibração solar pura: nasceste para iniciar, liderar e afirmar a individualidade. A alma escolheu aprender autonomia sem isolamento. Cada desafio pede coragem de ser o primeiro — não por ego, mas porque a tua chama abre caminho a outros.',
    2: 'O Caminho 2 vibra com a Lua: cooperação, diplomacia e sensibilidade fina. Balliett ensinava que o 2 ouve frequências que outros ignoram. A missão espiritual é unir polaridades — dentro de ti e no mundo — com paciência amorosa.',
    3: 'Caminho 3 — vibração jupiteriana de alegria e expressão. A alma veio para comunicar verdades através da arte, da palavra ou do gesto. Balliett associava o 3 à música do cosmos: quando expressas autenticamente, curas.',
    4: 'Caminho 4 ancorado em Urano/Saturno: ordem, trabalho e fundações espirituais. A lição é construir com paciência sem rigidez. Balliett via no 4 o templo interior — disciplina como devoção.',
    5: 'Caminho 5 — Mercúrio em movimento: liberdade, mudança, experiência. A alma aprende através da variedade. O ensinamento espiritual: adaptar-se sem perder o centro.',
    6: 'Caminho 6 — Vénus: amor, família, responsabilidade sagrada. Balliett chamava ao 6 o «curador do lar cósmico». Nutrir é vocação espiritual.',
    7: 'Caminho 7 — Neptuno: introspecção, estudo oculto, silêncio fecundo. A alma busca verdades invisíveis. Solitude consciente é altar.',
    8: 'Caminho 8 — Saturno: poder, justiça, manifestação material alinhada com lei espiritual. Balliett alertava: o 8 equilibra dar e receber.',
    9: 'Caminho 9 — Marte transmutado: humanitarismo, conclusão, compaixão universal. Encerrar ciclos com generosidade.',
    11: 'Caminho mestre 11 — canal de intuição elevada. Balliett reservava aos números mestres missão de inspirar sem se consumir. Sensibilidade psíquica como serviço.',
    22: 'Caminho mestre 22 — o «Construtor». Capacidade de materializar visões em benefício colectivo. Grande responsabilidade espiritual.',
    33: 'Caminho mestre 33 — compaixão ao nível do Cristo/Buda interior. Ensinar amor incondicional como caminho.',
  },
  destino: {
    1: 'Número de Destino (Expressão) 1: o nome completo vibra liderança. Balliett dizia que cada letra é nota musical — a tua sinfonia pede iniciativa. Manifesta propósito com coragem.',
    2: 'Destino 2: o nome carrega vibração lunar de parceria. Nasceste para mediar, acolher, equilibrar. A expressão plena passa por relações conscientes.',
    3: 'Destino 3: criatividade e comunicação são o teu instrumento espiritual. O nome pede alegria partilhada — não performance vazia, mas verdade expressa.',
    4: 'Destino 4: o nome constrói. Balliett enfatizava trabalho honesto como oração. Estrutura, método, persistência.',
    5: 'Destino 5: vibração de liberdade e aventura no nome. A alma exprime-se explorando, ensinando flexibilidade.',
    6: 'Destino 6: o nome vibra cuidado e responsabilidade. Família, comunidade, beleza — serviço amoroso.',
    7: 'Destino 7: o nome é místico — pesquisa, análise, espiritualidade. Balliett via no 7 o eremita iluminado.',
    8: 'Destino 8: poder e abundância no nome. Manifestar com ética; liderar com justiça.',
    9: 'Destino 9: o nome completa ciclos — compaixão, arte, entrega ao todo.',
    11: 'Destino 11: nome mestre — inspiração, visão, intuição pública. Canal espiritual.',
    22: 'Destino 22: nome de grande obra — construir pontes entre céu e terra.',
    33: 'Destino 33: nome de mestre curador — amor como missão.',
  },
  alma: {
    1: 'Número da Alma (vogais) 1: o desejo mais profundo é ser único/a e reconhecido/a na autenticidade. Balliett: as vogais são a respiração da alma.',
    2: 'Alma 2: desejas paz, parceria, harmonia íntima. A alma anseia pertencer com segurança emocional.',
    3: 'Alma 3: anseio de alegria, expressão, reconhecimento criativo. Rir e criar alimentam o espírito.',
    4: 'Alma 4: desejo de ordem, segurança, propósito concreto. Estabilidade como base espiritual.',
    5: 'Alma 5: sede de liberdade, variedade, experiência. A alma aborrece prisões — internas ou externas.',
    6: 'Alma 6: desejo de amar, cuidar, criar lar. Nutrir é necessidade espiritual.',
    7: 'Alma 7: anseio de silêncio, verdade, conhecimento oculto. Intimidade com o sagrado.',
    8: 'Alma 8: desejo de realização, influência, justiça material. Poder alinhado com propósito.',
    9: 'Alma 9: compaixão universal, idealismo, serviço desinteressado.',
    11: 'Alma 11: desejo de elevar consciências — intuição como fome espiritual.',
    22: 'Alma 22: anseio de construir algo que transcenda a vida individual.',
    33: 'Alma 33: desejo de curar através do amor puro.',
  },
  personalidade: {
    1: 'Personalidade (consoantes) 1: o mundo vê-te determinado/a, directo/a, pioneiro/a. Balliett: consoantes são o corpo da vibração — como te apresentas.',
    2: 'Personalidade 2: aparentas gentileza, receptividade, diplomacia. Outros sentem-te acolhedor/a.',
    3: 'Personalidade 3: radias charme, comunicação, leveza. Primeira impressão criativa.',
    4: 'Personalidade 4: pareces fiável, prático/a, metódico/a. Solidez visível.',
    5: 'Personalidade 5: energia dinâmica, curiosidade, magnetismo de movimento.',
    6: 'Personalidade 6: calor humano, responsabilidade, estética cuidada.',
    7: 'Personalidade 7: reserva misteriosa, inteligência, profundidade.',
    8: 'Personalidade 8: autoridade natural, competência, presença forte.',
    9: 'Personalidade 9: compaixão visível, magnetismo humanitário, sabedoria.',
    11: 'Personalidade 11: carisma intuitivo, olhar penetrante, inspiração.',
    22: 'Personalidade 22: presença imponente, visão, capacidade executiva.',
    33: 'Personalidade 33: aura de cura, gentileza mestra, luz.',
  },
}

const BALLIETT_EN = {
  caminhoVida: {
    1: 'Balliett saw Life Path 1 as pure solar vibration: you came to initiate, lead and affirm individuality. The soul chose to learn autonomy without isolation.',
    2: 'Path 2 vibrates with the Moon: cooperation, diplomacy and fine sensitivity. Balliett taught that 2 hears frequencies others ignore.',
    3: 'Path 3 — jupiterian joy and expression. The soul came to communicate truth through art, word or gesture.',
    4: 'Path 4 anchored in order and spiritual foundations. Balliett saw 4 as the inner temple — discipline as devotion.',
    5: 'Path 5 — Mercury in motion: freedom, change, experience. The soul learns through variety.',
    6: 'Path 6 — Venus: love, family, sacred responsibility. Nurturing is spiritual vocation.',
    7: 'Path 7 — Neptune: introspection, occult study, fertile silence.',
    8: 'Path 8 — Saturn: power, justice, material manifestation aligned with spiritual law.',
    9: 'Path 9 — transmuted Mars: humanitarianism, completion, universal compassion.',
    11: 'Master Path 11 — channel of elevated intuition. Psychic sensitivity as service.',
    22: 'Master Path 22 — the Builder. Materialising visions for collective benefit.',
    33: 'Master Path 33 — compassion at Christ/Buddha level within.',
  },
  destino: {
    1: 'Destiny (Expression) 1: the full name vibrates leadership. Balliett said each letter is a musical note — your symphony asks initiative.',
    2: 'Destiny 2: the name carries lunar partnership vibration.',
    3: 'Destiny 3: creativity and communication are your spiritual instrument.',
    4: 'Destiny 4: the name builds — honest work as prayer.',
    5: 'Destiny 5: freedom and adventure in the name.',
    6: 'Destiny 6: the name vibrates care and responsibility.',
    7: 'Destiny 7: the name is mystical — research, analysis, spirituality.',
    8: 'Destiny 8: power and abundance in the name.',
    9: 'Destiny 9: the name completes cycles — compassion and surrender to the whole.',
    11: 'Destiny 11: master name — inspiration and public intuition.',
    22: 'Destiny 22: name of great work — building bridges between heaven and earth.',
    33: 'Destiny 33: master healer name — love as mission.',
  },
  alma: {
    1: 'Soul Number (vowels) 1: deepest desire is to be unique and recognised in authenticity. Balliett: vowels are the breath of the soul.',
    2: 'Soul 2: you desire peace, partnership, intimate harmony.',
    3: 'Soul 3: longing for joy, expression, creative recognition.',
    4: 'Soul 4: desire for order, security, concrete purpose.',
    5: 'Soul 5: thirst for freedom, variety, experience.',
    6: 'Soul 6: desire to love, care, create home.',
    7: 'Soul 7: longing for silence, truth, hidden knowledge.',
    8: 'Soul 8: desire for achievement, influence, material justice.',
    9: 'Soul 9: universal compassion and selfless service.',
    11: 'Soul 11: desire to raise consciousness.',
    22: 'Soul 22: longing to build something transcending individual life.',
    33: 'Soul 33: desire to heal through pure love.',
  },
  personalidade: {
    1: 'Personality (consonants) 1: the world sees you as determined, direct, pioneering.',
    2: 'Personality 2: you appear gentle, receptive, diplomatic.',
    3: 'Personality 3: you radiate charm, communication, lightness.',
    4: 'Personality 4: you seem reliable, practical, methodical.',
    5: 'Personality 5: dynamic energy, curiosity, movement.',
    6: 'Personality 6: human warmth, responsibility, cared aesthetics.',
    7: 'Personality 7: mysterious reserve, intelligence, depth.',
    8: 'Personality 8: natural authority, competence, strong presence.',
    9: 'Personality 9: visible compassion, humanitarian magnetism.',
    11: 'Personality 11: intuitive charisma, penetrating gaze.',
    22: 'Personality 22: imposing presence, vision, executive capacity.',
    33: 'Personality 33: healing aura, master gentleness.',
  },
}

function normalizarSigno(n) {
  if (!n) return null
  if (n === 'Áries' || n === 'Aries') return 'Carneiro'
  return n
}

function ponteAstro(num, mapaNatal, lang) {
  if (!mapaNatal) return ''
  const p = PLANETA_NUM[num] || PLANETA_NUM[num > 9 ? num : num]
  if (!p) return ''
  const planeta = lang === 'en' ? p.en : p.pt
  const tema = lang === 'en' ? p.tema.en : p.tema.pt
  const sol = mapaNatal.solar?.nome
  const lua = mapaNatal.lunar?.nome
  const asc = mapaNatal.ascendente?.nome
  if (lang === 'en') {
    return ` Astrological bridge (Balliett–planet): number ${num} resonates with ${planeta} (${tema}). Your chart Sun in ${sol || '—'}, Moon in ${lua || '—'}, Ascendant ${asc || '—'} — observe where this numerical vibration meets your natal sky.`
  }
  return ` Ponte astrológica (Balliett–planeta): o ${num} ressoa com ${planeta} (${tema}). No teu mapa: Sol em ${sol || '—'}, Lua em ${lua || '—'}, Ascendente ${asc || '—'} — observa onde esta vibração numérica encontra o teu céu natal.`
}

function textoBalliett(tipo, num, lang) {
  const map = lang === 'en' ? BALLIETT_EN : BALLIETT_PT
  return map[tipo]?.[num] || map[tipo]?.[num > 9 ? num : num] || ''
}

function sinteseNome(nome, mapa, lang) {
  const { destino, alma, personalidade, vibracaoTotal, numerosEmFalta, numeroDominante, letras } = mapa
  if (lang === 'en') {
    let s = `According to L. Dow Balliett's Pythagorean method, the name «${nome}» vibrates at compound frequency ${vibracaoTotal}, reducing to Expression ${destino}. Vowels breathe Soul ${alma}; consonants shape Personality ${personalidade}. `
    if (numeroDominante) s += `Dominant vibration in the name: ${numeroDominante}. `
    if (numerosEmFalta?.length) s += `Karmic gaps (missing digits 1–9): ${numerosEmFalta.join(', ')} — lessons the soul chose to develop. `
    if (letras?.length) {
      const amostra = letras.slice(0, 8).map((l) => `${l.letra}=${l.valor}`).join(' · ')
      s += `Letter keys: ${amostra}${letras.length > 8 ? '…' : ''}. `
    }
    s += 'Each letter is a tone; the full name is your soul\'s chord in this incarnation.'
    return s
  }
  let s = `Pelo método pitagórico de L. Dow Balliett, o nome «${nome}» vibra na frequência composta ${vibracaoTotal}, reduzindo a Expressão ${destino}. As vogais respiram a Alma ${alma}; as consoantes moldam a Personalidade ${personalidade}. `
  if (numeroDominante) s += `Vibração dominante no nome: ${numeroDominante}. `
  if (numerosEmFalta?.length) s += `Lacunas kármicas (algarismos 1–9 em falta): ${numerosEmFalta.join(', ')} — lições que a alma escolheu desenvolver. `
  if (letras?.length) {
    const amostra = letras.slice(0, 8).map((l) => `${l.letra}=${l.valor}`).join(' · ')
    s += `Chaves das letras: ${amostra}${letras.length > 8 ? '…' : ''}. `
  }
  s += 'Cada letra é uma nota; o nome completo é o acorde da alma nesta encarnação.'
  return s
}

export function enriquecerMapaNumerologia(base, nome, lang = 'pt', mapaNatal = null) {
  const textos = {}
  for (const key of ['caminhoVida', 'destino', 'alma', 'personalidade', 'anoPessoal', 'mesPessoal']) {
    const num = base[key]
    let t = textoBalliett(key === 'caminhoVida' ? 'caminhoVida' : key, num, lang)
    if (!t && base.textos?.[key]) t = base.textos[key]
    if (['caminhoVida', 'destino', 'alma', 'personalidade'].includes(key)) {
      t += ponteAstro(num, mapaNatal, lang)
    }
    textos[key] = t
  }

  const sintese = sinteseNome(nome, base, lang)

  const harmonias = []
  if (base.destino === base.alma) {
    harmonias.push(lang === 'en'
      ? 'Expression and Soul in harmony — what you show and what you desire align; authenticity flows naturally.'
      : 'Expressão e Alma em harmonia — o que mostras e o que desejas alinham-se; a autenticidade flui naturalmente.')
  }
  if (base.destino !== base.personalidade && base.alma !== base.personalidade) {
    harmonias.push(lang === 'en'
      ? 'Personality differs from Expression and Soul — you may seem different from who you are inside; integration is the spiritual work.'
      : 'Personalidade distinta da Expressão e Alma — podes parecer diferente do que és por dentro; a integração é o trabalho espiritual.')
  }
  if (base.caminhoVida && base.destino && Math.abs(base.caminhoVida - base.destino) <= 2) {
    harmonias.push(lang === 'en'
      ? 'Life Path and Expression resonate — birth mission and name vibration walk together.'
      : 'Caminho de Vida e Expressão ressoam — missão de nascimento e vibração do nome caminham juntas.')
  }

  return {
    ...base,
    textos,
    sintese,
    harmonias,
    metodo: lang === 'en' ? 'L. Dow Balliett · Pythagorean · Astro bridge' : 'L. Dow Balliett · Pitagórico · Ponte astrológica',
  }
}
