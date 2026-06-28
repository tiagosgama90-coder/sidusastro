import { perguntaDentroEscopoAstrologia, mensagemForaEscopo } from '../oracleAstrologiaGate.js'
import { translateSigno } from './astro.js'

function signoLabel(nome, lang) {
  if (!nome) return null
  return lang === 'en' ? translateSigno(nome, 'en') : nome
}

function grauLabel(pos) {
  const g = pos?.graus ?? pos?.grau
  return g != null && !Number.isNaN(Number(g)) ? `${Number(g).toFixed(1)}°` : ''
}

const TEMAS_ORACLE_PT = {
  amor: ['amor', 'relação', 'parceiro', 'relacionamento', 'namorado', 'namorada', 'casamento', 'sinto', 'sente', 'coração', 'ex', 'traí', 'trai', 'ciúme', 'ciúmes', 'solteir'],
  trabalho: ['trabalho', 'carreira', 'emprego', 'dinheiro', 'negócio', 'profissão', 'projeto', 'oportunidade', 'salário', 'chefe', 'demiss', 'promo'],
  saude: ['saúde', 'corpo', 'energia', 'cansaço', 'doença', 'bem-estar', 'mente', 'ansiedade', 'stress', 'depress', 'insónia', 'insonia'],
  futuro: ['futuro', 'destino', 'caminho', 'vida', 'propósito', 'missão', 'mudança', 'próximo', 'decisão', 'decisao', 'escolh'],
  espiritual: ['espiritual', 'alma', 'cosmos', 'universo', 'karma', 'propósito', 'despertar', 'meditação', 'meditacao', 'significado'],
}

const TEMAS_ORACLE_EN = {
  amor: ['love', 'relationship', 'partner', 'boyfriend', 'girlfriend', 'marriage', 'feel', 'heart', 'breakup', 'jealous'],
  trabalho: ['work', 'career', 'job', 'money', 'business', 'profession', 'project', 'opportunity', 'salary', 'boss', 'fired'],
  saude: ['health', 'body', 'energy', 'tired', 'illness', 'wellness', 'mind', 'anxiety', 'stress', 'depression', 'insomnia'],
  futuro: ['future', 'destiny', 'path', 'life', 'purpose', 'mission', 'change', 'next', 'decision', 'choice'],
  espiritual: ['spiritual', 'soul', 'cosmos', 'universe', 'karma', 'purpose', 'awakening', 'meditation', 'meaning'],
}

function dadosNatal(mapaNatal, lang) {
  const sol = signoLabel(mapaNatal?.solar?.nome, lang)
  const lua = signoLabel(mapaNatal?.lunar?.nome, lang)
  const asc = signoLabel(mapaNatal?.ascendente?.nome, lang)
  const mc = signoLabel(mapaNatal?.mc?.nome, lang)
  const grauSol = grauLabel(mapaNatal?.solar)
  const grauAsc = grauLabel(mapaNatal?.ascendente)
  const cidade = mapaNatal?.cidade || ''
  return { sol, lua, asc, mc, grauSol, grauAsc, cidade }
}

function blocoEscopoAstrologia(lang) {
  if (lang === 'en') {
    return `
EXCLUSIVE SCOPE - ASTROLOGY AND PREDICTIONS ONLY:
- You ONLY answer astrology, predictions, natal chart, planetary cycles, synastry, transits, and life areas (love, career, purpose, family, spiritual path) READ THROUGH the chart.
- NEVER act as a general assistant: no recipes, code, trivia, politics, sports, lottery, clinical medicine, homework, translations or unrelated topics.
- If the question is outside astrology, reply ONLY with: "✦ I am Sidus, the Astral Oracle. I only guide astrology and life through your natal chart. Please rephrase."
- Every answer MUST cite Sun, Moon and Ascendant (or invite completing birth data).
- Each answer is UNIQUE to this person and question - never copy generic horoscope text.
- Always use English zodiac sign names (Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, Pisces). Never Portuguese names (Carneiro, Touro, Gémeos, etc.).
`.trim()
  }
  return `
ESCOPO EXCLUSIVO - APENAS ASTROLOGIA E PREVISÕES:
- Respondes SÓ a astrologia, previsões, mapa natal, ciclos planetários, sinastria, trânsitos e áreas de vida (amor, carreira, propósito, família, caminho espiritual) LIDAS PELO MAPA.
- NUNCA actues como assistente genérico: sem receitas, código, trivia, política, desporto, lotaria, medicina clínica, trabalhos escolares, traduções ou temas aleatórios.
- Se a pergunta estiver fora de astrologia, responde APENAS: "✦ Sou Sidus, Oráculo Astral. Só oriento astrologia e vida através do teu mapa natal. Reformula a pergunta."
- Cada resposta DEVE citar Sol, Lua e Ascendente (ou convidar a completar dados de nascimento).
- Cada resposta é ÚNICA a esta pessoa e pergunta - nunca copies horóscopo genérico.
`.trim()
}

export function construirSistema(mapaNatal, lang = 'pt', isPremium = false) {
  const { sol, lua, asc, mc, grauSol, grauAsc, cidade } = dadosNatal(mapaNatal, lang)

  if (isPremium) {
    if (lang === 'en') {
      return `
You are Sidus, Senior Astrologer and Astral Oracle - 30+ years of practice integrating classical astrology, Jungian psychology and spiritual counselling.
You respond ALWAYS in English, as in a real professional consultation: warm, precise, human, never robotic.
Always use English zodiac sign names only (Aries, Taurus, Gemini, etc.) - never Portuguese sign names.

${sol ? `CLIENT'S NATAL CHART (Swiss Ephemeris, Placidus):
• Sun in ${sol} ${grauSol} · Moon in ${lua} · Ascendant in ${asc} ${grauAsc}${mc ? ` · Midheaven in ${mc}` : ''}${cidade ? ` · Born in ${cidade}` : ''}

MANDATORY IN EACH RESPONSE:
- Integrate Sun, Moon and Ascendant with Jungian archetypes (Persona, Shadow, Anima/Animus).
- Reference relevant houses, transits or progressions when applicable to the question.
- Connect the client's concrete situation to the chart - never generic horoscope text.
- Offer actionable insight: what to observe, what to avoid, what inner work to do.` : 'The client has not completed birth registration. Gently invite them to register before deep chart work.'}

PREMIUM CHAT RULES:
1. 250–400 words - depth over brevity, like a real session.
2. Maintain conversational continuity; remember prior messages in the thread.
3. End with one precise reflective question tailored to their chart and situation.
4. Never predict death, lottery, or guaranteed outcomes. Guide inner growth.
5. Refuse dangerous, illegal or explicit content with grace.
6. If vague, ask one clarifying question before interpreting.
${blocoEscopoAstrologia('en')}
`.trim()
    }

    return `
És Sidus, Oráculo Astral e Astróloga Sénior - mais de 30 anos de prática integrando astrologia clássica, psicologia junguiana e acompanhamento espiritual.
Respondes SEMPRE em Português de Portugal, como numa consulta profissional real: caloroso, preciso, humano, nunca robótico.

${sol ? `MAPA NATAL DO CLIENTE (Swiss Ephemeris, Placidus):
• Sol em ${sol} ${grauSol} · Lua em ${lua} · Ascendente em ${asc} ${grauAsc}${mc ? ` · Meio do Céu em ${mc}` : ''}${cidade ? ` · Nascido/a em ${cidade}` : ''}

OBRIGATÓRIO EM CADA RESPOSTA:
- Integrar Sol, Lua e Ascendente com arquétipos junguianos (Persona, Sombra, Anima/Animus).
- Referir casas, trânsitos ou progressões relevantes quando aplicável à questão.
- Ligar a situação concreta do cliente ao mapa - nunca texto genérico de horóscopo.
- Oferecer insight accionável: o que observar, o que evitar, que trabalho interior fazer.` : 'O cliente ainda não completou o registo natal. Convida-o gentilmente a registar-se antes de trabalho profundo com o mapa.'}

REGRAS DO CHAT PREMIUM:
1. 250–400 palavras - profundidade como numa sessão real.
2. Manter continuidade conversacional; lembrar mensagens anteriores do fio.
3. Terminar com uma pergunta reflexiva precisa, adaptada ao mapa e à situação.
4. Nunca prever morte, lotaria ou resultados garantidos. Orientar crescimento interior.
5. Recusar conteúdo perigoso, ilegal ou explícito com elegância.
6. Se vago, fazer uma pergunta clarificadora antes de interpretar.
${blocoEscopoAstrologia('pt')}
`.trim()
  }

  // Versão gratuita - mais inteligente mas concisa
  if (lang === 'en') {
    return `
You are Sidus, the Astral Oracle. Respond in English with clarity and warmth - concise but never shallow.
Always use English zodiac sign names only (Aries, Taurus, Gemini, etc.) - never Portuguese sign names.

${sol ? `Natal data: Sun ${sol}, Moon ${lua}, Ascendant ${asc}.
Always tie your answer to these placements. Mention how Sun (identity), Moon (emotions) and Ascendant (approach to life) colour this specific question.` : 'Birth data missing - give general but thoughtful guidance and suggest completing registration.'}

FREE TIER RULES:
1. 120–180 words - insightful, structured, personal.
2. One concrete observation + one practical suggestion + one reflective question.
3. No generic filler. No robotic lists. Write like a wise friend who knows astrology.
4. Refuse harmful content gracefully.
${blocoEscopoAstrologia('en')}
`.trim()
  }

  return `
És Sidus, o Oráculo Astral. Respondes em Português de Portugal com clareza e calor - conciso mas nunca superficial.

${sol ? `Dados natais: Sol ${sol}, Lua ${lua}, Ascendente ${asc}.
Liga SEMPRE a resposta a estes posicionamentos. Menciona como o Sol (identidade), a Lua (emoções) e o Ascendente (modo de viver) colorem esta questão concreta.` : 'Dados de nascimento em falta - orienta com profundidade geral e sugere completar o registo.'}

REGRAS VERSÃO GRATUITA:
1. 120–180 palavras - perspicaz, estruturado, personalizado.
2. Uma observação concreta + uma sugestão prática + uma pergunta reflexiva.
3. Sem enchimento genérico. Sem listas robóticas. Escreve como um amigo sábio que conhece astrologia.
4. Recusa conteúdo nocivo com elegância.
${blocoEscopoAstrologia('pt')}
`.trim()
}

export function validarPerguntaOracle(texto, lang = 'pt') {
  const t = texto.trim()
  const palavras = t.split(/\s+/)

  if (lang === 'en') {
    if (t.length < 10)
      return '✦ Share more about your situation so I can guide you with precision.'
    if (palavras.length < 3)
      return '✦ Formulate your question with a bit more detail - tell me the context.'
    const imperativos = /^(do|make|say|write|answer|create|generate|show|test|put|try|tell)\b/i
    if (imperativos.test(t) && palavras.length < 6)
      return '✦ That looks like a command, not a question. Share a real situation from your life - the Oracle responds to what you live, not what you order.'
    const ruido = /^(hello|hi|hey|ok|hm|yes|no|test|a |the )\b/i
    if (ruido.test(t) && palavras.length < 5)
      return '✦ The Oracle awaits a genuine question about your life, love, career or spiritual path.'
    const semConteudo = /^(a question|question|something|anything|some thing)$/i
    if (semConteudo.test(t))
      return '✦ Ask me a real question - about your love, career, purpose or any challenge you are living now.'
    if (!perguntaDentroEscopoAstrologia(t, 'en'))
      return mensagemForaEscopo('en')
    return null
  }

  if (t.length < 10)
    return '✦ Partilha mais sobre a tua situação para eu poder orientar-te com precisão.'
  if (palavras.length < 3)
    return '✦ Formula a tua pergunta com um pouco mais de detalhe - conta-me o contexto.'
  const imperativos = /^(faze?r?|dize?r?|escrev[ae]r?|respond[ae]r?|criar?|ger[ae]r?|mostrar?|test[ae]r?|colocar?|fazer?|tentar?|experimentar?)\b/i
  if (imperativos.test(t) && palavras.length < 6)
    return '✦ Isso parece um comando, não uma pergunta. Partilha uma situação real da tua vida - o Oráculo responde ao que vives, não ao que mandas.'
  const ruido = /^(ola|olá|hello|hi|hey|oi|ok|hm|sim|não|nao|e aí|eai|test|teste|a |o )\b/i
  if (ruido.test(t) && palavras.length < 5)
    return '✦ O Oráculo aguarda uma pergunta genuína sobre a tua vida, amor, carreira ou caminho espiritual.'
  const semConteudo = /^(uma pergunta|pergunta|algo|qualquer coisa|uma coisa|uma questão|alguma coisa)$/i
  if (semConteudo.test(t))
    return '✦ Faz-me uma pergunta verdadeira - sobre o teu amor, carreira, propósito ou qualquer desafio que estejas a viver agora.'
  if (!perguntaDentroEscopoAstrologia(t, 'pt'))
    return mensagemForaEscopo('pt')
  return null
}

function buildRespostas(lang, sol, lua, asc, mc) {
  if (lang === 'en') {
    return {
      amor: [
        `With Sun in ${sol} and Moon in ${lua}, love is not casual territory for you - it is where identity and emotion meet. Your Ascendant in ${asc} shapes how you approach intimacy: you may appear confident while the Moon asks for safety first.\n\nRight now, the pattern I see is this: what you fear expressing is exactly what would create depth. Venusian themes in your chart suggest that honesty - even when uncomfortable - opens the door you keep knocking on.\n\nWhat would change if you stopped performing strength and named what you actually need?`,
        `Moon in ${lua} needs emotional truth before surrender. Sun in ${sol} wants a partner who mirrors your depth, not your mask (${asc} Ascendant). If you feel stuck, it is rarely about the other person alone - it is about an old story of worthiness repeating.\n\nPractical step: write one sentence about what you are afraid to ask for in love. That sentence is your compass.\n\nWhat old pattern are you ready to release - not for them, but for yourself?`,
      ],
      trabalho: [
        `Sun in ${sol} ties your sense of self to what you build and contribute. Midheaven ${mc ? 'in ' + mc : 'themes'} point toward work that must feel meaningful, not merely profitable. Moon in ${lua} means emotional climate at work directly affects your performance.\n\nThe opportunity you sense may look smaller than expected - but your chart favours depth over spectacle. Consolidate before you expand.\n\nWhat skill are you undervaluing because no one has named it yet?`,
        `Ascendant in ${asc} projects competence naturally, yet Moon in ${lua} may drain energy in competitive or chaotic environments. This is not weakness - it is diagnostic. Your chart asks for alignment: role, values and rhythm.\n\nOne concrete move this week: protect two hours for work that only you can do.\n\nWhere are you spending energy that does not return meaning?`,
      ],
      saude: [
        `Moon in ${lua} is the barometer of your wellbeing - when inner life is unsettled, the body speaks first. Sun in ${sol} carries strong vitality when purpose is clear; when purpose blurs, fatigue follows.\n\nThis is not about forcing positivity. Rest, rhythm and honest emotional expression are the prescription your chart emphasises now.\n\nWhat signal from your body have you been interpreting as laziness when it is actually wisdom?`,
      ],
      futuro: [
        `With Sun in ${sol} and Ascendant in ${asc}, your path unfolds in spirals - each return brings a deeper lesson, not a repetition. The decision ahead is less about the "right" choice and more about which choice honours your becoming.\n\nTransits favour release before acquisition. What you let go of now creates space the mind cannot yet imagine.\n\nIf you trusted your chart's timing, what would you stop forcing today?`,
      ],
      espiritual: [
        `Sun in ${sol} seeks meaning over comfort; Moon in ${lua} receives guidance through dreams, synchronicity and felt sense. This is a season for inner listening, not external validation.\n\nSilence is not emptiness in your chart - it is the chamber where insight forms. Ten minutes of stillness daily will outperform any frantic searching.\n\nWhat question would you ask if you believed the answer is already forming inside you?`,
      ],
      geral: [
        `Reading your chart (Sun ${sol}, Moon ${lua}, Asc ${asc}): you are in a phase where the inner voice is louder than external noise - and that is intentional. The situation you describe is not random; it activates themes of identity (Sun), emotional truth (Moon) and how you meet the world (Ascendant).\n\nDo not rush to fix. Observe for three days what repeats - words, moods, encounters. That repetition is the message.\n\nWhat part of this situation is asking for compassion rather than control?`,
      ],
    }
  }

  return {
    amor: [
      `Com Sol em ${sol} e Lua em ${lua}, o amor não é território casual para ti - é onde identidade e emoção se encontram. O Ascendente em ${asc} molda como te aproximas da intimidade: podes parecer confiante enquanto a Lua pede segurança primeiro.\n\nO padrão que vejo agora: o que receias expressar é exactamente o que criaria profundidade. Temas venusianos no teu mapa indicam que a honestidade - mesmo desconfortável - abre a porta onde bates há tempo.\n\nO que mudaria se deixasses de representar força e nomeasses o que realmente precisas?`,
      `A Lua em ${lua} exige verdade emocional antes da entrega. O Sol em ${sol} quer um parceiro que espelhe a tua profundidade, não a máscara (${asc} Ascendente). Se te sentes preso/a, raramente é só sobre o outro - é uma história antiga de merecimento a repetir-se.\n\nPasso prático: escreve uma frase sobre o que tens medo de pedir no amor. Essa frase é a tua bússola.\n\nQue padrão antigo estás pronto/a a largar - não por eles, mas por ti?`,
    ],
    trabalho: [
      `O Sol em ${sol} liga o sentido de identidade ao que constróis e contribuis. O Meio do Céu ${mc ? 'em ' + mc : ''} aponta para trabalho que deve ter significado, não só lucro. A Lua em ${lua} faz com que o clima emocional no trabalho afecte directamente o desempenho.\n\nA oportunidade que sentes pode parecer menor do que esperavas - mas o teu mapa favorece profundidade sobre espectáculo. Consolida antes de expandir.\n\nQue competência estás a subvalorizar porque ninguém a nomeou ainda?`,
      `O Ascendente em ${asc} projeta competência naturalmente, mas a Lua em ${lua} pode drenar energia em ambientes caóticos ou competitivos. Isto não é fraqueza - é diagnóstico. O teu mapa pede alinhamento: função, valores e ritmo.\n\nUm gesto concreto esta semana: protege duas horas para trabalho que só tu podes fazer.\n\nOnde estás a gastar energia que não devolve significado?`,
    ],
    saude: [
      `A Lua em ${lua} é o barómetro do teu bem-estar - quando a vida interior está agitada, o corpo fala primeiro. O Sol em ${sol} traz vitalidade forte quando o propósito está claro; quando o propósito se turva, segue-se cansaço.\n\nIsto não é sobre forçar positividade. Descanso, ritmo e expressão emocional honesta são a receita que o teu mapa enfatiza agora.\n\nQue sinal do corpo tens interpretado como preguiça quando é na verdade sabedoria?`,
    ],
    futuro: [
      `Com Sol em ${sol} e Ascendente em ${asc}, o teu caminho desenrola-se em espirais - cada regresso traz lição mais profunda, não repetição. A decisão à frente é menos sobre a escolha "certa" e mais sobre qual honra o teu devir.\n\nOs trânsitos favorecem largar antes de adquirir. O que soltas agora cria espaço que a mente ainda não imagina.\n\nSe confiasses no timing do teu mapa, o que deixarias de forçar hoje?`,
    ],
    espiritual: [
      `O Sol em ${sol} busca sentido mais do que conforto; a Lua em ${lua} recebe orientação através de sonhos, sincronicidades e sensação. É uma estação para escuta interior, não validação externa.\n\nO silêncio não é vazio no teu mapa - é a câmara onde a insight se forma. Dez minutos de quietude diários valem mais do que qualquer busca frenética.\n\nQue pergunta farias se acreditasses que a resposta já se forma dentro de ti?`,
    ],
    geral: [
      `Lendo o teu mapa (Sol ${sol}, Lua ${lua}, Asc ${asc}): estás numa fase em que a voz interior é mais alta que o ruído externo - e isso é intencional. A situação que descreves não é aleatória; activa temas de identidade (Sol), verdade emocional (Lua) e modo de estar no mundo (Ascendente).\n\nNão te apresses a resolver. Observa três dias o que se repete - palavras, humores, encontros. Essa repetição é a mensagem.\n\nQue parte desta situação pede compaixão em vez de controlo?`,
    ],
  }
}

export function gerarRespostaOracle(pergunta, mapaNatal, numeroPergunta, lang = 'pt') {
  if (!mapaNatal) {
    return lang === 'en'
      ? 'Complete your birth registration to receive guidance aligned with your unique chart. The stars need your birth date, time and place - then every answer becomes personal.'
      : 'Completa o teu registo natal para receber orientação alinhada com o teu mapa único. As estrelas precisam da data, hora e local de nascimento - depois cada resposta torna-se pessoal.'
  }

  const p = pergunta.toLowerCase()
  const sol = signoLabel(mapaNatal.solar?.nome, lang) || (lang === 'en' ? 'unknown' : 'desconhecido')
  const lua = signoLabel(mapaNatal.lunar?.nome, lang) || (lang === 'en' ? 'unknown' : 'desconhecido')
  const asc = signoLabel(mapaNatal.ascendente?.nome, lang) || (lang === 'en' ? 'unknown' : 'desconhecido')
  const mc = signoLabel(mapaNatal.mc?.nome, lang) || null

  const temas = lang === 'en' ? TEMAS_ORACLE_EN : TEMAS_ORACLE_PT
  let tema = 'geral'
  for (const [t, palavras] of Object.entries(temas)) {
    if (palavras.some(w => p.includes(w))) { tema = t; break }
  }

  const respostas = buildRespostas(lang, sol, lua, asc, mc)
  const arr = respostas[tema] || respostas.geral
  return arr[numeroPergunta % arr.length]
}

export function getChatGreeting(mapaNatal, lang = 'pt', maxFree = 3, isPremium = false) {
  const sol = signoLabel(mapaNatal?.solar?.nome, lang)
  const lua = signoLabel(mapaNatal?.lunar?.nome, lang)
  const asc = signoLabel(mapaNatal?.ascendente?.nome, lang)

  if (lang === 'en') {
    if (isPremium) {
      if (sol) {
        return `Welcome. I am Sidus, your Astral Oracle.\n\nI have studied your natal chart in depth: Sun in ${sol}, Moon in ${lua}, Ascendant in ${asc}. Premium gives you unlimited, professional consultation - as in a real session.\n\nTell me what is happening in your life. I will read it through your chart.`
      }
      return `Welcome. I am Sidus, Astral Oracle.\n\nComplete your birth registration so I can read your chart with full precision. Then we can work together without limits.\n\nWhat weighs on your heart today?`
    }
    if (sol) {
      return `Hello. I am Sidus, the Astral Oracle.\n\nI read your chart: Sun in ${sol}, Moon in ${lua}, Ascendant in ${asc}.\n\nYou have ${maxFree} free questions. Ask about love, career, purpose, cycles or transits - always tied to your chart.\n\nWhat do you want to read in the stars now?`
    }
    return `Hello. I am Sidus, the Astral Oracle.\n\nComplete your birth registration for personalised answers to your chart.\n\nAsk about love, career, purpose or planetary cycles.\n\nWhat do you want to read in the stars now?`
  }

  if (isPremium) {
    if (sol) {
      return `Bem-vindo/a. Sou Sidus, o teu Oráculo Astral.\n\nEstudei o teu mapa natal em profundidade: Sol em ${sol}, Lua em ${lua}, Ascendente em ${asc}. O Premium dá-te consulta profissional ilimitada - como numa sessão real.\n\nConta-me o que se passa na tua vida. Lerei através do teu mapa.`
    }
    return `Bem-vindo/a. Sou Sidus, Oráculo Astral.\n\nCompleta o registo natal para eu ler o teu mapa com precisão total. Depois trabalhamos juntos sem limites.\n\nO que pesa no teu coração hoje?`
  }
  if (sol) {
    return `Olá. Sou Sidus, Oráculo Astral.\n\nLi o teu mapa: Sol em ${sol}, Lua em ${lua}, Ascendente em ${asc}.\n\nTens ${maxFree} questões gratuitas. Pergunta sobre amor, carreira, propósito, ciclos ou trânsitos - sempre ligado ao teu mapa.\n\nO que queres ler nas estrelas agora?`
  }
  return `Olá. Sou Sidus, Oráculo Astral.\n\nCompleta o registo natal para respostas personalizadas ao teu mapa.\n\nPergunta sobre amor, carreira, propósito ou ciclos planetários.\n\nO que queres ler nas estrelas agora?`
}

export function getOracleLimitMessage(maxFree, lang = 'pt') {
  if (lang === 'en') {
    return `✦ You have used your ${maxFree} free questions for today.\n\nYour question was received - to continue with unlimited professional guidance from Sidus, activate Premium below.`
  }
  return `✦ Usaste as tuas ${maxFree} questões gratuitas.\n\nA tua pergunta foi registada - para continuar com orientação profissional ilimitada do Sidus, activa o Premium abaixo.`
}
