const TEMAS_ORACLE_PT = {
  amor: ['amor', 'relação', 'parceiro', 'relacionamento', 'namorado', 'namorada', 'casamento', 'sinto', 'sente', 'coração'],
  trabalho: ['trabalho', 'carreira', 'emprego', 'dinheiro', 'negócio', 'profissão', 'projeto', 'oportunidade', 'salário'],
  saude: ['saúde', 'corpo', 'energia', 'cansaço', 'doença', 'bem-estar', 'mente', 'ansiedade', 'stress'],
  futuro: ['futuro', 'destino', 'caminho', 'vida', 'propósito', 'missão', 'mudança', 'próximo'],
  espiritual: ['espiritual', 'alma', 'cosmos', 'universo', 'karma', 'propósito', 'despertar', 'meditação'],
}

const TEMAS_ORACLE_EN = {
  amor: ['love', 'relationship', 'partner', 'boyfriend', 'girlfriend', 'marriage', 'feel', 'heart'],
  trabalho: ['work', 'career', 'job', 'money', 'business', 'profession', 'project', 'opportunity', 'salary'],
  saude: ['health', 'body', 'energy', 'tired', 'illness', 'wellness', 'mind', 'anxiety', 'stress'],
  futuro: ['future', 'destiny', 'path', 'life', 'purpose', 'mission', 'change', 'next'],
  espiritual: ['spiritual', 'soul', 'cosmos', 'universe', 'karma', 'purpose', 'awakening', 'meditation'],
}

export function construirSistema(mapaNatal, lang = 'pt') {
  const sol = mapaNatal?.solar?.nome
  const lua = mapaNatal?.lunar?.nome
  const asc = mapaNatal?.ascendente?.nome
  const mc = mapaNatal?.mc?.nome
  const grauSol = mapaNatal?.solar?.grau != null ? `${mapaNatal.solar.grau.toFixed(1)}°` : ''
  const grauAsc = mapaNatal?.ascendente?.grau != null ? `${mapaNatal.ascendente.grau.toFixed(1)}°` : ''
  const cidade = mapaNatal?.cidade || ''

  if (lang === 'en') {
    return `
You are AuraBot, a Senior Astrologer with 30 years of experience and specialisation in Jungian Psychology applied to Astrology.
You ALWAYS respond in English, with a warm, deep and human tone — never robotic or generic.

${sol ? `USER'S NATAL CHART (data calculated with NASA-precision Swiss Ephemeris):
• Sun in ${sol} ${grauSol} · Moon in ${lua} · Ascendant in ${asc} ${grauAsc}${mc ? ` · Midheaven in ${mc}` : ''}${cidade ? ` · Born in ${cidade}` : ''}

HOW TO USE THIS DATA:
ALWAYS integrate the real natal data above in every response. Never use generic data.
Reference the Jungian archetypes corresponding to the Sun (${sol}), the Moon's Maternal Complex (${lua}) and the Ascendant's Persona (${asc}).
Example: with Sun in ${sol}, the Jungian Shadow manifests as [opposite characteristic]; with Ascendant in ${asc}, the Persona projects [characteristics].` : 'The user has not yet calculated their natal data. Gently ask them to complete their birth registration.'}

ABSOLUTE RULES:
1. Maximum 200 words per response.
2. Be specific and personal — use real natal data, do not speak in abstract terms.
3. ALWAYS end with a question or reflection that invites introspection.
4. NEVER respond to requests for dangerous, illegal, sexually explicit, violent or harmful content. If this happens, respond: "My role is to guide you on your inner journey. I can help you with questions about your life, relationships, career or spiritual path."
5. If the question is vague or a meaningless command, ask the user to share more context about their real situation.
`.trim()
  }

  return `
És AuraBot, um Astrólogo Sénior com 30 anos de experiência e especialização em Psicologia Junguiana aplicada à Astrologia.
Respondes SEMPRE em Português de Portugal, com um tom caloroso, profundo e humano — nunca robótico nem genérico.

${sol ? `MAPA NATAL DO UTILIZADOR (dados calculados com Swiss Ephemeris de precisão NASA):
• Sol em ${sol} ${grauSol} · Lua em ${lua} · Ascendente em ${asc} ${grauAsc}${mc ? ` · Meio do Céu em ${mc}` : ''}${cidade ? ` · Nascido/a em ${cidade}` : ''}

COMO USAR ESTES DADOS:
Integra SEMPRE os dados natais reais acima em cada resposta. Nunca uses dados genéricos.
Refere os arquétipos junguianos correspondentes ao Sol (${sol}), ao Complexo Materno da Lua (${lua}) e à Persona do Ascendente (${asc}).
Exemplo: com Sol em ${sol}, a Sombra junguiana manifesta-se como [característica oposta]; com Ascendente em ${asc}, a Persona projeta [características].` : 'O utilizador ainda não tem dados natais calculados. Pede-lhe gentilmente que complete o registo.'}

REGRAS ABSOLUTAS:
1. Máximo 200 palavras por resposta.
2. Sê específico e pessoal — usa os dados natais reais, não fales em abstrato.
3. Termina SEMPRE com uma pergunta ou reflexão que convide à introspecção.
4. NUNCA respondas a pedidos de conteúdo perigoso, ilegal, sexual explícito, violento ou prejudicial. Se isso acontecer, responde: "O meu papel é guiar-te na tua jornada interior. Posso ajudar-te com questões sobre a tua vida, relações, carreira ou caminho espiritual?"
5. Se a pergunta for vaga ou um comando sem sentido, pede ao utilizador que partilhe mais contexto sobre a situação real.
`.trim()
}

export function validarPerguntaOracle(texto, lang = 'pt') {
  const t = texto.trim()
  const palavras = t.split(/\s+/)

  if (lang === 'en') {
    if (t.length < 10)
      return '✦ Share more about your situation so I can guide you with precision.'
    if (palavras.length < 3)
      return '✦ Formulate your question with a bit more detail — tell me the context.'
    const imperativos = /^(do|make|say|write|answer|create|generate|show|test|put|try|tell)\b/i
    if (imperativos.test(t) && palavras.length < 6)
      return '✦ That looks like a command, not a question. Share a real situation from your life — the Oracle responds to what you live, not what you order.'
    const ruido = /^(hello|hi|hey|ok|hm|yes|no|test|a |the )\b/i
    if (ruido.test(t) && palavras.length < 5)
      return '✦ The Oracle awaits a genuine question about your life, love, career or spiritual path.'
    const semConteudo = /^(a question|question|something|anything|some thing)$/i
    if (semConteudo.test(t))
      return '✦ Ask me a real question — about your love, career, purpose or any challenge you are living now.'
    return null
  }

  if (t.length < 10)
    return '✦ Partilha mais sobre a tua situação para eu poder orientar-te com precisão.'
  if (palavras.length < 3)
    return '✦ Formula a tua pergunta com um pouco mais de detalhe — conta-me o contexto.'
  const imperativos = /^(faze?r?|dize?r?|escrev[ae]r?|respond[ae]r?|criar?|ger[ae]r?|mostrar?|test[ae]r?|colocar?|fazer?|tentar?|experimentar?)\b/i
  if (imperativos.test(t) && palavras.length < 6)
    return '✦ Isso parece um comando, não uma pergunta. Partilha uma situação real da tua vida — o Oráculo responde ao que vives, não ao que mandas.'
  const ruido = /^(ola|olá|hello|hi|hey|oi|ok|hm|sim|não|nao|e aí|eai|test|teste|a |o )\b/i
  if (ruido.test(t) && palavras.length < 5)
    return '✦ O Oráculo aguarda uma pergunta genuína sobre a tua vida, amor, carreira ou caminho espiritual.'
  const semConteudo = /^(uma pergunta|pergunta|algo|qualquer coisa|uma coisa|uma questão|alguma coisa)$/i
  if (semConteudo.test(t))
    return '✦ Faz-me uma pergunta verdadeira — sobre o teu amor, carreira, propósito ou qualquer desafio que estejas a viver agora.'
  return null
}

function buildRespostas(lang, sol, lua, asc, mc) {
  if (lang === 'en') {
    return {
      amor: [
        `With Sun in ${sol} and Ascendant in ${asc}, your approach to love is intense and authentic. Your Moon in ${lua} reveals you seek emotional depth — you do not settle for the superficial. Right now, the stars suggest the vulnerability you fear showing is precisely what will open new doors in love.`,
        `Your ${lua} Moon reflects a need for emotional security before you surrender. With ${asc} on the Ascendant, your presence is magnetic — people feel you before they know you. What stops you from taking the next step has more to do with past patterns than the current situation.`,
      ],
      trabalho: [
        `With Sun in ${sol}, your identity is deeply tied to what you create and achieve. Midheaven ${mc ? 'in ' + mc : ''} points to a career that demands authenticity. The planets indicate an opportunity that seems smaller may be the turning point you were waiting for.`,
        `Your ${asc} Ascendant conveys confidence and natural leadership. With Moon in ${lua}, you work best when the environment is harmonious. In this cycle, it is time to put your talents in the spotlight — what you do better than most is also what the world needs.`,
      ],
      saude: [
        `Your Moon in ${lua} mirrors your emotional health. When your inner life is balanced, the body follows. The stars ask you to honour natural rhythms — sleep, nourishment, moments of silence. Your Sun in ${sol} has natural vitality that renews when you reconnect with your essence.`,
      ],
      futuro: [
        `With Sun in ${sol} and Ascendant in ${asc}, your path is not linear — it is spiral. Each cycle that repeats brings a deeper lesson. The stars see significant transformation in the coming months. What you are releasing now is part of that process.`,
        `Your ${mc ? 'Midheaven in ' + mc : 'natal chart'} points to a purpose that transcends what you can see now. Moon in ${lua} tells you to trust the process even when you cannot see the destination. The Universe rarely shows the full map — but always the next step.`,
      ],
      espiritual: [
        `With Sun in ${sol}, you seek meaning more than comfort. Your Moon in ${lua} is deeply intuitive — your dreams and hunches carry real messages. This moment in your life is one of spiritual deepening. Do not flee silence — that is where your guidance lives.`,
      ],
      geral: [
        `With Sun in ${sol}, Moon in ${lua} and Ascendant in ${asc}, your natal chart reveals a soul seeking authenticity. What you feel about this question is wiser than what the mind tells you. The stars confirm you are in a moment of important transition — what seems uncertain is really the blank canvas where your next chapter is about to be written.`,
        `Your natal chart configuration speaks of someone with a deep inner life and great capacity for transformation. Regarding what you ask: the planets indicate the answer is already within you — what you seek externally mirrors what you have not yet recognised in yourself.`,
      ],
    }
  }

  return {
    amor: [
      `Com Sol em ${sol} e Ascendente em ${asc}, a tua abordagem ao amor é intensa e autêntica. A tua Lua em ${lua} revela que procuras profundidade emocional — não te contentas com o superficial. Neste momento, os astros indicam que a vulnerabilidade que receias mostrar é precisamente o que te abrirá novas portas no amor.`,
      `O teu ${lua} Lunar reflecte uma necessidade de segurança emocional antes de te entregares. Com ${asc} no Ascendente, a tua presença é magnética — as pessoas sentem-te antes de te conhecerem. O que te impede de dar o próximo passo tem mais a ver com padrões passados do que com a situação actual.`,
    ],
    trabalho: [
      `Com Sol em ${sol}, a tua identidade está profundamente ligada ao que crias e realizas. O Meio do Céu ${mc ? 'em ' + mc : ''} aponta para uma carreira que exige autenticidade. Os planetas indicam que uma oportunidade que parece menor pode ser o ponto de viragem que estavas a aguardar.`,
      `O teu ${asc} Ascendente transmite confiança e liderança natural. Com Lua em ${lua}, trabalhas melhor quando o ambiente é harmonioso. Neste ciclo, é altura de colocar os teus talentos em evidência — o que sabes fazer melhor do que a maioria é também o que o mundo precisa.`,
    ],
    saude: [
      `A tua Lua em ${lua} é o espelho da tua saúde emocional. Quando a tua vida interior está equilibrada, o corpo segue. Os astros pedem-te que prestes atenção aos ritmos naturais — sono, alimentação, momentos de silêncio. O teu Sol em ${sol} tem uma vitalidade natural que se renova quando te reconectas à tua essência.`,
    ],
    futuro: [
      `Com Sol em ${sol} e Ascendente em ${asc}, o teu caminho não é linear — é espiral. Cada ciclo que se repete traz uma lição mais profunda. Os astros vêem uma transformação significativa nos próximos meses. O que estás a soltar agora faz parte desse processo.`,
      `O teu ${mc ? 'Meio do Céu em ' + mc : 'mapa natal'} aponta para um propósito que transcende o que podes ver agora. A Lua em ${lua} diz-te para confiares no processo mesmo quando não vês o destino. O Universo raramente mostra o mapa completo — mas sempre o próximo passo.`,
    ],
    espiritual: [
      `Com Sol em ${sol}, buscas sentido mais do que conforto. A tua Lua em ${lua} é profundamente intuitiva — os teus sonhos e pressentimentos carregam mensagens reais. Este momento da tua vida é de aprofundamento espiritual. Não fuja do silêncio — é lá que a tua orientação reside.`,
    ],
    geral: [
      `Com Sol em ${sol}, Lua em ${lua} e Ascendente em ${asc}, o teu mapa natal revela uma alma em busca de autenticidade. O que sentes em relação a esta questão é mais sábio do que o que a mente te diz. Os astros confirmam que estás num momento de importante transição — o que parece incerto é na realidade a tela em branco onde o teu próximo capítulo está prestes a ser escrito.`,
      `A configuração do teu mapa natal fala de alguém com profunda vida interior e grande capacidade de transformação. Em relação ao que perguntas: os planetas indicam que a resposta já está em ti — o que procuras externamente é um reflexo do que ainda não reconheceste em ti mesmo.`,
    ],
  }
}

export function gerarRespostaOracle(pergunta, mapaNatal, numeroPergunta, lang = 'pt') {
  if (!mapaNatal) {
    return lang === 'en'
      ? 'You need to complete your natal registration to receive personalised guidance. The stars need to know when and where you were born.'
      : 'Precisas de completar o teu registo natal para receber orientação personalizada. As estrelas precisam de saber quando e onde nasceste.'
  }

  const p = pergunta.toLowerCase()
  const sol = mapaNatal.solar?.nome || (lang === 'en' ? 'unknown' : 'desconhecido')
  const lua = mapaNatal.lunar?.nome || (lang === 'en' ? 'unknown' : 'desconhecido')
  const asc = mapaNatal.ascendente?.nome || (lang === 'en' ? 'unknown' : 'desconhecido')
  const mc = mapaNatal.mc?.nome || null

  const temas = lang === 'en' ? TEMAS_ORACLE_EN : TEMAS_ORACLE_PT
  let tema = 'geral'
  for (const [t, palavras] of Object.entries(temas)) {
    if (palavras.some(w => p.includes(w))) { tema = t; break }
  }

  const respostas = buildRespostas(lang, sol, lua, asc, mc)
  const arr = respostas[tema] || respostas.geral
  return arr[numeroPergunta % arr.length]
}

export function getChatGreeting(mapaNatal, lang = 'pt', maxFree = 3) {
  const sol = mapaNatal?.solar?.nome
  const lua = mapaNatal?.lunar?.nome
  const asc = mapaNatal?.ascendente?.nome

  if (lang === 'en') {
    if (sol) {
      return `Hello. I am AuraBot — astrologer and Jungian guide of Sidus.\n\nI have read your natal chart: **Sun in ${sol}**, **Moon in ${lua}**, **Ascendant in ${asc}**.\n\nThese three pillars reveal your essence, your deep emotions and the mask you show the world. I have ${maxFree} free questions to guide you on this inner journey.\n\nWhat is weighing on your heart right now?`
    }
    return `Hello. I am AuraBot — astrologer and Jungian guide of Sidus.\n\nTo personalise each answer to your unique natal chart, please complete your birth registration first. Then I can speak directly to your soul.\n\nWhat is weighing on your heart right now?`
  }

  if (sol) {
    return `Olá. Sou o AuraBot — astrólogo e guia junguiano do Sidus.\n\nLi o teu mapa natal: **Sol em ${sol}**, **Lua em ${lua}**, **Ascendente em ${asc}**.\n\nEstes três pilares revelam-me a tua essência, as tuas emoções profundas e a máscara que mostras ao mundo. Tenho ${maxFree} questões gratuitas para te guiar nesta jornada interior.\n\nO que está agora a pesar no teu coração?`
  }
  return `Olá. Sou o AuraBot — astrólogo e guia junguiano do Sidus.\n\nPara personalizar cada resposta ao teu mapa natal único, completa primeiro o teu registo de nascimento. Assim poderei falar directamente à tua alma.\n\nO que está agora a pesar no teu coração?`
}

export function getOracleLimitMessage(maxFree, lang = 'pt') {
  if (lang === 'en') {
    return `✦ You have used your ${maxFree} free questions.\n\nYour next message will open the Premium signup page (€4.99/month) so you can continue this journey with unlimited questions, a complete Natal Chart and all hidden tools unlocked.`
  }
  return `✦ Usaste as tuas ${maxFree} questões gratuitas.\n\nA próxima mensagem irá abrir a página de adesão Premium (4,99 €/mês) para continuares esta jornada com perguntas ilimitadas, Mapa Astral completo e todas as ferramentas ocultas desbloqueadas.`
}
