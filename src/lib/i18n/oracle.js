import { perguntaDentroEscopoAstrologia, mensagemForaEscopo } from '../oracleAstrologiaGate.js'
import { translateSigno } from './astro.js'
import {
  oracleRespondLanguage, isPt, aiOutputLanguageBlock, zodiacNamesInstruction, contentForLang,
} from './langUtil.js'

function respondIn(lang) {
  if (lang === 'pt') return 'Português de Portugal'
  return oracleRespondLanguage(lang)
}

function signoLabel(nome, lang) {
  if (!nome) return null
  return translateSigno(nome, lang)
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
  const recusa = mensagemForaEscopo(lang)
  if (isPt(lang)) {
    return `
ESCOPO EXCLUSIVO - APENAS ASTROLOGIA E PREVISÕES:
- Respondes SÓ a astrologia, previsões, mapa natal, ciclos planetários, sinastria, trânsitos e áreas de vida (amor, carreira, propósito, família, caminho espiritual) LIDAS PELO MAPA.
- NUNCA actues como assistente genérico: sem receitas, código, trivia, política, desporto, lotaria, medicina clínica, trabalhos escolares, traduções ou temas aleatórios.
- Se a pergunta estiver fora de astrologia, responde APENAS: "${recusa}"
- Cada resposta DEVE citar Sol, Lua e Ascendente (ou convidar a completar dados de nascimento).
- Cada resposta é ÚNICA a esta pessoa e pergunta - nunca copies horóscopo genérico.
- ${zodiacNamesInstruction(lang)}
`.trim()
  }
  return `
EXCLUSIVE SCOPE - ASTROLOGY AND PREDICTIONS ONLY:
- You ONLY answer astrology, predictions, natal chart, planetary cycles, synastry, transits, and life areas (love, career, purpose, family, spiritual path) READ THROUGH the chart.
- NEVER act as a general assistant: no recipes, code, trivia, politics, sports, lottery, clinical medicine, homework, translations or unrelated topics.
- If the question is outside astrology, reply ONLY with: "${recusa}"
- Every answer MUST cite Sun, Moon and Ascendant (or invite completing birth data).
- Each answer is UNIQUE to this person and question - never copy generic horoscope text.
- ${zodiacNamesInstruction(lang)}
- ${aiOutputLanguageBlock(lang)}
`.trim()
}

export function construirSistema(mapaNatal, lang = 'pt', isPremium = false) {
  const { sol, lua, asc, mc, grauSol, grauAsc, cidade } = dadosNatal(mapaNatal, lang)

  if (isPremium) {
    if (!isPt(lang)) {
      return `
You are Sidus, Senior Astrologer and Chat Oracle - 30+ years of practice integrating classical astrology, Jungian psychology and spiritual counselling.
You respond ALWAYS in ${respondIn(lang)}, as in a real professional consultation: warm, precise, human, never robotic.
${aiOutputLanguageBlock(lang)}
${zodiacNamesInstruction(lang)}

${sol ? `CLIENT'S NATAL CHART (Swiss Ephemeris, Placidus):
• Sun in ${sol} ${grauSol} · Moon in ${lua} · Ascendant in ${asc} ${grauAsc}${mc ? ` · Midheaven in ${mc}` : ''}${cidade ? ` · Born in ${cidade}` : ''}

MANDATORY IN EACH RESPONSE:
- Integrate Sun, Moon and Ascendant with Jungian archetypes (Persona, Shadow, Anima/Animus).
- Reference relevant houses, transits or progressions when applicable to the question.
- Connect the client's concrete situation to the chart - never generic horoscope text.
- Offer actionable insight: what to observe, what to avoid, what inner work to do.` : 'The client has not completed birth registration. Gently invite them to register before deep chart work.'}

PREMIUM CHAT RULES:
1. 250-400 words - depth over brevity, like a real session.
2. Maintain conversational continuity; remember prior messages in the thread.
3. End with one precise reflective question tailored to their chart and situation.
4. Never predict death, lottery, or guaranteed outcomes. Guide inner growth.
5. Refuse dangerous, illegal or explicit content with grace.
6. If vague, ask one clarifying question before interpreting.
${blocoEscopoAstrologia(lang)}
`.trim()
    }

    return `
És Sidus, Chat Oráculo e Astróloga Sénior - mais de 30 anos de prática integrando astrologia clássica, psicologia junguiana e acompanhamento espiritual.
Respondes SEMPRE em Português de Portugal, como numa consulta profissional real: caloroso, preciso, humano, nunca robótico.

${sol ? `MAPA NATAL DO CLIENTE (Swiss Ephemeris, Placidus):
• Sol em ${sol} ${grauSol} · Lua em ${lua} · Ascendente em ${asc} ${grauAsc}${mc ? ` · Meio do Céu em ${mc}` : ''}${cidade ? ` · Nascido/a em ${cidade}` : ''}

OBRIGATÓRIO EM CADA RESPOSTA:
- Integrar Sol, Lua e Ascendente com arquétipos junguianos (Persona, Sombra, Anima/Animus).
- Referir casas, trânsitos ou progressões relevantes quando aplicável à questão.
- Ligar a situação concreta do cliente ao mapa - nunca texto genérico de horóscopo.
- Oferecer insight accionável: o que observar, o que evitar, que trabalho interior fazer.` : 'O cliente ainda não completou o registo natal. Convida-o gentilmente a registar-se antes de trabalho profundo com o mapa.'}

REGRAS DO CHAT PREMIUM:
1. 250-400 palavras - profundidade como numa sessão real.
2. Manter continuidade conversacional; lembrar mensagens anteriores do fio.
3. Terminar com uma pergunta reflexiva precisa, adaptada ao mapa e à situação.
4. Nunca prever morte, lotaria ou resultados garantidos. Orientar crescimento interior.
5. Recusar conteúdo perigoso, ilegal ou explícito com elegância.
6. Se vago, fazer uma pergunta clarificadora antes de interpretar.
${blocoEscopoAstrologia('pt')}
`.trim()
  }

  // Versão gratuita - mais inteligente mas concisa
  if (!isPt(lang)) {
    return `
You are Sidus, the Chat Oracle. Respond in ${respondIn(lang)} with clarity and warmth - concise but never shallow.
${aiOutputLanguageBlock(lang)}
${zodiacNamesInstruction(lang)}

${sol ? `Natal data: Sun ${sol}, Moon ${lua}, Ascendant ${asc}.
Always tie your answer to these placements. Mention how Sun (identity), Moon (emotions) and Ascendant (approach to life) colour this specific question.` : 'Birth data missing - give general but thoughtful guidance and suggest completing registration.'}

FREE TIER RULES:
1. 120-180 words - insightful, structured, personal.
2. One concrete observation + one practical suggestion + one reflective question.
3. No generic filler. No robotic lists. Write like a wise friend who knows astrology.
4. Refuse harmful content gracefully.
${blocoEscopoAstrologia(lang)}
`.trim()
  }

  return `
És Sidus, o Chat Oráculo. Respondes em Português de Portugal com clareza e calor - conciso mas nunca superficial.

${sol ? `Dados natais: Sol ${sol}, Lua ${lua}, Ascendente ${asc}.
Liga SEMPRE a resposta a estes posicionamentos. Menciona como o Sol (identidade), a Lua (emoções) e o Ascendente (modo de viver) colorem esta questão concreta.` : 'Dados de nascimento em falta - orienta com profundidade geral e sugere completar o registo.'}

REGRAS VERSÃO GRATUITA:
1. 120-180 palavras - perspicaz, estruturado, personalizado.
2. Uma observação concreta + uma sugestão prática + uma pergunta reflexiva.
3. Sem enchimento genérico. Sem listas robóticas. Escreve como um amigo sábio que conhece astrologia.
4. Recusa conteúdo nocivo com elegância.
${blocoEscopoAstrologia('pt')}
`.trim()
}

export function validarPerguntaOracle(texto, lang = 'pt') {
  const t = texto.trim()
  const palavras = t.split(/\s+/)

  if (!isPt(lang)) {
    const msgs = contentForLang(lang, {
      en: {
        short: 'Share more about your situation so I can guide you with precision.',
        detail: 'Formulate your question with a bit more detail - tell me the context.',
        command: 'That looks like a command, not a question. Share a real situation from your life - the Oracle responds to what you live, not what you order.',
        noise: 'The Oracle awaits a genuine question about your life, love, career or spiritual path.',
        empty: 'Ask me a real question - about your love, career, purpose or any challenge you are living now.',
      },
      es: {
        short: 'Comparte más sobre tu situación para poder orientarte con precisión.',
        detail: 'Formula tu pregunta con un poco más de detalle: cuéntame el contexto.',
        command: 'Eso parece una orden, no una pregunta. Comparte una situación real de tu vida.',
        noise: 'El Oráculo espera una pregunta genuina sobre tu vida, amor, carrera o camino espiritual.',
        empty: 'Hazme una pregunta real: sobre tu amor, carrera, propósito o cualquier desafío que vivas ahora.',
      },
      it: {
        short: 'Condividi di più sulla tua situazione così posso guidarti con precisione.',
        detail: 'Formula la domanda con un po\' più di dettaglio: raccontami il contesto.',
        command: 'Sembra un comando, non una domanda. Condividi una situazione reale della tua vita.',
        noise: 'L\'Oracolo attende una domanda genuina sulla tua vita, amore, carriera o percorso spirituale.',
        empty: 'Fammi una domanda vera: sul tuo amore, carriera, scopo o qualsiasi sfida che stai vivendo.',
      },
      de: {
        short: 'Erzähle mehr über deine Situation, damit ich dich präzise führen kann.',
        detail: 'Formuliere deine Frage etwas ausführlicher - gib mir den Kontext.',
        command: 'Das klingt wie ein Befehl, keine Frage. Teile eine echte Lebenssituation.',
        noise: 'Das Orakel wartet auf eine echte Frage zu Leben, Liebe, Karriere oder spirituellem Weg.',
        empty: 'Stelle mir eine echte Frage - zu Liebe, Karriere, Sinn oder einer aktuellen Herausforderung.',
      },
      fr: {
        short: 'Partage davantage sur ta situation pour que je puisse te guider avec précision.',
        detail: 'Formule ta question avec un peu plus de détail - donne-moi le contexte.',
        command: 'Cela ressemble à un ordre, pas à une question. Partage une situation réelle de ta vie.',
        noise: 'L\'Oracle attend une question sincère sur ta vie, ton amour, ta carrière ou ton chemin spirituel.',
        empty: 'Pose-moi une vraie question - sur ton amour, ta carrière, ton but ou un défi actuel.',
      },
    }) || {}
    if (t.length < 10) return msgs.short
    if (palavras.length < 3) return msgs.detail
    const imperativos = /^(do|make|say|write|answer|create|generate|show|test|put|try|tell|haz|di|escribe|fais|dis|schreib|mach)\b/i
    if (imperativos.test(t) && palavras.length < 6) return msgs.command
    const ruido = /^(hello|hi|hey|ok|hm|yes|no|test|hola|ola|bonjour|ciao|hallo|a |the )\b/i
    if (ruido.test(t) && palavras.length < 5) return msgs.noise
    const semConteudo = /^(a question|question|something|anything|una pregunta|une question|eine frage|una domanda)$/i
    if (semConteudo.test(t)) return msgs.empty
    if (!perguntaDentroEscopoAstrologia(t, lang)) return mensagemForaEscopo(lang)
    return null
  }

  if (t.length < 10)
    return 'Partilha mais sobre a tua situação para eu poder orientar-te com precisão.'
  if (palavras.length < 3)
    return 'Formula a tua pergunta com um pouco mais de detalhe - conta-me o contexto.'
  const imperativos = /^(faze?r?|dize?r?|escrev[ae]r?|respond[ae]r?|criar?|ger[ae]r?|mostrar?|test[ae]r?|colocar?|fazer?|tentar?|experimentar?)\b/i
  if (imperativos.test(t) && palavras.length < 6)
    return 'Isso parece um comando, não uma pergunta. Partilha uma situação real da tua vida - o Oráculo responde ao que vives, não ao que mandas.'
  const ruido = /^(ola|olá|hello|hi|hey|oi|ok|hm|sim|não|nao|e aí|eai|test|teste|a |o )\b/i
  if (ruido.test(t) && palavras.length < 5)
    return 'O Oráculo aguarda uma pergunta genuína sobre a tua vida, amor, carreira ou caminho espiritual.'
  const semConteudo = /^(uma pergunta|pergunta|algo|qualquer coisa|uma coisa|uma questão|alguma coisa)$/i
  if (semConteudo.test(t))
    return 'Faz-me uma pergunta verdadeira - sobre o teu amor, carreira, propósito ou qualquer desafio que estejas a viver agora.'
  if (!perguntaDentroEscopoAstrologia(t, 'pt'))
    return mensagemForaEscopo('pt')
  return null
}

function buildRespostas(lang, sol, lua, asc, mc) {
  if (!isPt(lang)) {
    if (lang === 'es') {
      return {
        amor: [`Con Sol en ${sol} y Luna en ${lua}, el amor no es territorio casual: es donde identidad y emoción se encuentran. Ascendente en ${asc} moldea cómo te acercas a la intimidad.\n\nLo que temes expresar es exactamente lo que crearía profundidad. La honestidad abre la puerta donde llevas tiempo llamando.\n\n¿Qué cambiaría si nombraras lo que realmente necesitas?`],
        trabalho: [`Sol en ${sol} liga tu identidad a lo que construyes. Luna en ${lua} hace que el clima emocional en el trabajo afecte tu rendimiento.\n\nConsolida antes de expandir. ¿Qué habilidad estás subvalorando?`],
        saude: [`Luna en ${lua} es el barómetro de tu bienestar. Sol en ${sol} trae vitalidad cuando el propósito está claro.\n\nDescanso, ritmo y expresión emocional honesta son la receta ahora.`],
        futuro: [`Con Sol en ${sol} y Ascendente en ${asc}, tu camino se despliega en espirales. La decisión honra tu devenir más que la elección "correcta".\n\n¿Qué dejarías de forzar si confiaras en el timing de tu carta?`],
        espiritual: [`Sol en ${sol} busca sentido; Luna en ${lua} recibe guía por sueños y sincronicidades. Es temporada de escucha interior.\n\n¿Qué pregunta harías si creyeras que la respuesta ya se forma dentro de ti?`],
        geral: [`Leyendo tu carta (Sol ${sol}, Luna ${lua}, Asc ${asc}): la voz interior es más alta que el ruido externo. Observa tres días lo que se repite: palabras, estados, encuentros.\n\n¿Qué parte de esta situación pide compasión en vez de control?`],
      }
    }
    if (lang === 'it') {
      return {
        geral: [`Leggendo la tua carta (Sole ${sol}, Luna ${lua}, Asc ${asc}): la voce interiore è più forte del rumore esterno. Osserva tre giorni ciò che si ripete.\n\nQuale parte di questa situazione chiede compassione invece di controllo?`],
        amor: [`Con Sole in ${sol} e Luna in ${lua}, l'amore è dove identità ed emozione si incontrano. Ascendente in ${asc} modella l'intimità.\n\nCosa cambierebbe se nominassi ciò di cui hai davvero bisogno?`],
        trabalho: [`Sole in ${sol} lega identità e lavoro. Luna in ${lua} influenza il clima emotivo professionale.\n\nQuale competenza stai sottovalutando?`],
        saude: [`Luna in ${lua} è il barometro del benessere. Riposo e onestà emotiva sono la ricetta ora.`],
        futuro: [`Il cammino si dispiega a spirale. Cosa smetteresti di forzare fidandoti del timing della carta?`],
        espiritual: [`Stagione di ascolto interiore. Quale domanda faresti se la risposta si stesse già formando in te?`],
      }
    }
    if (lang === 'de') {
      return {
        geral: [`Dein Horoskop (Sonne ${sol}, Mond ${lua}, Asz ${asc}): die innere Stimme ist lauter als äußerer Lärm. Beobachte drei Tage, was sich wiederholt.\n\nWelcher Teil dieser Situation braucht Mitgefühl statt Kontrolle?`],
        amor: [`Mit Sonne in ${sol} und Mond in ${lua} trifft Identität auf Emotion in der Liebe. Aszendent in ${asc} prägt Nähe.\n\nWas würde sich ändern, wenn du benennst, was du wirklich brauchst?`],
        trabalho: [`Sonne in ${sol} verbindet Identität mit Arbeit. Welche Fähigkeit unterschätzt du?`],
        saude: [`Mond in ${lua} ist dein Wohlbefindens-Barometer. Ruhe und ehrlicher Ausdruck helfen jetzt.`],
        futuro: [`Was würdest du aufhören zu erzwingen, wenn du dem Timing deines Horoskops vertraust?`],
        espiritual: [`Zeit für innere Stille. Welche Frage würdest du stellen, wenn die Antwort schon in dir entsteht?`],
      }
    }
    if (lang === 'fr') {
      return {
        geral: [`En lisant ta carte (Soleil ${sol}, Lune ${lua}, Asc ${asc}) : la voix intérieure est plus forte que le bruit extérieur. Observe trois jours ce qui se répète.\n\nQuelle partie de cette situation demande de la compassion plutôt que du contrôle ?`],
        amor: [`Avec Soleil en ${sol} et Lune en ${lua}, l'amour est où identité et émotion se rencontrent. Ascendant en ${asc} colore l'intimité.\n\nQue changerait-il si tu nommais ce dont tu as vraiment besoin ?`],
        trabalho: [`Soleil en ${sol} lie identité et travail. Quelle compétence sous-estimes-tu ?`],
        saude: [`Lune en ${lua} est le baromètre du bien-être. Repos et expression émotionnelle honnête aident maintenant.`],
        futuro: [`Que cesserais-tu de forcer en faisant confiance au timing de ta carte ?`],
        espiritual: [`Saison d'écoute intérieure. Quelle question poserais-tu si la réponse se formait déjà en toi ?`],
      }
    }
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
      `O teu Sol em ${sol} mostra a direção que queres afirmar, enquanto a Lua em ${lua} revela o que precisas para te sentires seguro/a. Com Ascendente em ${asc}, a tua primeira reação pode esconder uma necessidade mais funda.\n\nA pergunta que trazes pede discernimento, não uma resposta automática: separa hoje o que sabes do que estás a recear. Depois escolhe um gesto pequeno que respeite essa diferença.\n\nQue facto concreto o teu mapa te convida a encarar agora?`,
      `No teu mapa, Sol em ${sol}, Lua em ${lua} e Ascendente em ${asc} formam uma conversa entre vontade, emoção e presença. O desconforto atual pode ser um sinal de que estás a viver para corresponder, em vez de agir a partir do que realmente valorizas.\n\nAntes de procurar confirmação fora, escreve duas linhas sobre o que mudarias se ninguém te julgasse. A resposta ajuda a distinguir intuição de pressão.\n\nOnde estás a pedir permissão para seres fiel ao teu próprio ritmo?`,
    ],
  }
}

const NO_MAPA_MSG = {
  pt: 'Completa o teu registo natal para receber orientação alinhada com o teu mapa único. As estrelas precisam da data, hora e local de nascimento - depois cada resposta torna-se pessoal.',
  en: 'Complete your birth registration to receive guidance aligned with your unique chart. The stars need your birth date, time and place - then every answer becomes personal.',
  es: 'Completa tu registro natal para recibir orientación alineada con tu carta única. Las estrellas necesitan fecha, hora y lugar de nacimiento.',
  it: 'Completa la registrazione natale per ricevere orientamento allineato alla tua carta unica.',
  de: 'Vervollständige deine Geburtseintragung für Beratung passend zu deinem einzigartigen Horoskop.',
  fr: 'Complète ton enregistrement natal pour recevoir des conseils alignés sur ta carte unique.',
}

export function gerarRespostaOracle(pergunta, mapaNatal, numeroPergunta, lang = 'pt') {
  if (!mapaNatal) {
    return contentForLang(lang, NO_MAPA_MSG)
  }

  const p = pergunta.toLowerCase()
  const unknown = contentForLang(lang, { pt: 'desconhecido', en: 'unknown', es: 'desconocido', it: 'sconosciuto', de: 'unbekannt', fr: 'inconnu' })
  const sol = signoLabel(mapaNatal.solar?.nome, lang) || unknown
  const lua = signoLabel(mapaNatal.lunar?.nome, lang) || unknown
  const asc = signoLabel(mapaNatal.ascendente?.nome, lang) || unknown
  const mc = signoLabel(mapaNatal.mc?.nome, lang) || null

  const temas = isPt(lang) ? TEMAS_ORACLE_PT : TEMAS_ORACLE_EN
  let tema = 'geral'
  for (const [t, palavras] of Object.entries(temas)) {
    if (palavras.some(w => p.includes(w))) { tema = t; break }
  }

  const respostas = buildRespostas(lang, sol, lua, asc, mc)
  const arr = respostas[tema] || respostas.geral
  let hash = 0
  for (const char of p) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  const resposta = arr[(hash + Number(numeroPergunta || 0)) % arr.length]
  const foco = pergunta.trim().slice(0, 160)
  if (isPt(lang)) {
    return `${resposta}\n\nLeitura focada na tua pergunta: “${foco}”. Repara em que parte desta situação sentes vontade de agir, e em que parte estás apenas a tentar obter garantias.`
  }
  return `${resposta}\n\nFocused on your question: “${foco}”. Notice which part of this situation calls for action and which part is only seeking certainty.`
}

export function getChatGreeting(mapaNatal, lang = 'pt', maxFree = 3, isPremium = false) {
  const sol = signoLabel(mapaNatal?.solar?.nome, lang)
  const lua = signoLabel(mapaNatal?.lunar?.nome, lang)
  const asc = signoLabel(mapaNatal?.ascendente?.nome, lang)

  if (!isPt(lang)) {
    const greet = contentForLang(lang, {
      en: {
        premSol: (s, l, a) => `Welcome. I am Sidus, your Chat Oracle.\n\nI have studied your natal chart: Sun in ${s}, Moon in ${l}, Ascendant in ${a}. Premium gives unlimited professional consultation.\n\nTell me what is happening in your life.`,
        premNo: () => `Welcome. I am Sidus, Chat Oracle.\n\nComplete your birth registration for full chart precision.\n\nWhat weighs on your heart today?`,
        freeSol: (s, l, a, n) => `Hello. I am Sidus, the Chat Oracle.\n\nSun in ${s}, Moon in ${l}, Ascendant in ${a}.\n\nYou have ${n} free questions. Ask about love, career, purpose or transits.\n\nWhat do you want to read in the stars now?`,
        freeNo: () => `Hello. I am Sidus, the Chat Oracle.\n\nComplete your birth registration for personalised answers.\n\nWhat do you want to read in the stars now?`,
        limit: (n) => `You have used your ${n} free questions.\n\nActivate Premium below for unlimited guidance from Sidus.`,
      },
      es: {
        premSol: (s, l, a) => `Bienvenido/a. Soy Sidus, tu Chat Oráculo.\n\nHe estudiado tu carta: Sol en ${s}, Luna en ${l}, Ascendente en ${a}. Premium ofrece consulta ilimitada.\n\nCuéntame qué pasa en tu vida.`,
        premNo: () => `Bienvenido/a. Soy Sidus, Chat Oráculo.\n\nCompleta tu registro natal para leer tu carta con precisión.\n\n¿Qué pesa en tu corazón hoy?`,
        freeSol: (s, l, a, n) => `Hola. Soy Sidus, Chat Oráculo.\n\nSol en ${s}, Luna en ${l}, Ascendente en ${a}.\n\nTienes ${n} preguntas gratuitas. Pregunta sobre amor, carrera o tránsitos.\n\n¿Qué quieres leer en las estrellas?`,
        freeNo: () => `Hola. Soy Sidus, Chat Oráculo.\n\nCompleta tu registro para respuestas personalizadas.\n\n¿Qué quieres leer en las estrellas?`,
        limit: (n) => `Has usado tus ${n} preguntas gratuitas.\n\nActiva Premium para orientación ilimitada.`,
      },
      it: {
        premSol: (s, l, a) => `Benvenuto/a. Sono Sidus, il tuo Chat Oracolo.\n\nHo studiato la tua carta: Sole in ${s}, Luna in ${l}, Ascendente in ${a}.\n\nRaccontami cosa succede nella tua vita.`,
        premNo: () => `Benvenuto/a. Sono Sidus, Chat Oracolo.\n\nCompleta la registrazione natale per precisione totale.`,
        freeSol: (s, l, a, n) => `Ciao. Sono Sidus, Chat Oracolo.\n\nSole in ${s}, Luna in ${l}, Ascendente in ${a}.\n\nHai ${n} domande gratuite.`,
        freeNo: () => `Ciao. Sono Sidus. Completa la registrazione per risposte personalizzate.`,
        limit: (n) => `Hai usato le ${n} domande gratuite. Attiva Premium per guida illimitata.`,
      },
      de: {
        premSol: (s, l, a) => `Willkommen. Ich bin Sidus, dein Chat-Orakel.\n\nSonne in ${s}, Mond in ${l}, Aszendent in ${a}.\n\nErzähl mir, was in deinem Leben passiert.`,
        premNo: () => `Willkommen. Vervollständige deine Geburtseintragung für volle Präzision.`,
        freeSol: (s, l, a, n) => `Hallo. Ich bin Sidus.\n\nSonne ${s}, Mond ${l}, Aszendent ${a}. Du hast ${n} Gratisfragen.`,
        freeNo: () => `Hallo. Ich bin Sidus. Vervollständige die Registrierung für personalisierte Antworten.`,
        limit: (n) => `Du hast deine ${n} Gratisfragen genutzt. Aktiviere Premium für unbegrenzte Beratung.`,
      },
      fr: {
        premSol: (s, l, a) => `Bienvenue. Je suis Sidus, ton Chat Oráculo.\n\nSoleil en ${s}, Lune en ${l}, Ascendant en ${a}.\n\nRaconte-moi ce qui se passe dans ta vie.`,
        premNo: () => `Bienvenue. Complète ton enregistrement natal pour une lecture précise.`,
        freeSol: (s, l, a, n) => `Bonjour. Je suis Sidus.\n\nSoleil ${s}, Lune ${l}, Ascendant ${a}. Tu as ${n} questions gratuites.`,
        freeNo: () => `Bonjour. Je suis Sidus. Complète l'enregistrement pour des réponses personnalisées.`,
        limit: (n) => `Tu as utilisé tes ${n} questions gratuites. Active Premium pour un guidage illimité.`,
      },
    })
    if (isPremium) {
      if (sol) return greet.premSol(sol, lua, asc)
      return greet.premNo()
    }
    if (sol) return greet.freeSol(sol, lua, asc, maxFree)
    return greet.freeNo()
  }

  if (isPremium) {
    if (sol) {
      return `Bem-vindo/a. Sou Sidus, o teu Chat Oráculo.\n\nEstudei o teu mapa natal em profundidade: Sol em ${sol}, Lua em ${lua}, Ascendente em ${asc}. O Premium dá-te consulta profissional ilimitada - como numa sessão real.\n\nConta-me o que se passa na tua vida. Lerei através do teu mapa.`
    }
    return `Bem-vindo/a. Sou Sidus, Chat Oráculo.\n\nCompleta o registo natal para eu ler o teu mapa com precisão total. Depois trabalhamos juntos sem limites.\n\nO que pesa no teu coração hoje?`
  }
  if (sol) {
    return `Olá. Sou Sidus, Chat Oráculo.\n\nLi o teu mapa: Sol em ${sol}, Lua em ${lua}, Ascendente em ${asc}.\n\nTens ${maxFree} questões gratuitas. Pergunta sobre amor, carreira, propósito, ciclos ou trânsitos - sempre ligado ao teu mapa.\n\nO que queres ler nas estrelas agora?`
  }
  return `Olá. Sou Sidus, Chat Oráculo.\n\nCompleta o registo natal para respostas personalizadas ao teu mapa.\n\nPergunta sobre amor, carreira, propósito ou ciclos planetários.\n\nO que queres ler nas estrelas agora?`
}

export function getOracleLimitMessage(maxFree, lang = 'pt') {
  if (!isPt(lang)) {
    const greet = contentForLang(lang, {
      en: { limit: (n) => `You have used your ${n} free questions for today.\n\nActivate Premium below for unlimited guidance from Sidus.` },
      es: { limit: (n) => `Has usado tus ${n} preguntas gratuitas.\n\nActiva Premium para continuar con orientación ilimitada.` },
      it: { limit: (n) => `Hai usato le ${n} domande gratuite.\n\nAttiva Premium per continuare con guida illimitata.` },
      de: { limit: (n) => `Du hast deine ${n} Gratisfragen genutzt.\n\nAktiviere Premium für unbegrenzte Beratung.` },
      fr: { limit: (n) => `Tu as utilisé tes ${n} questions gratuites.\n\nActive Premium pour un guidage illimité.` },
    })
    return greet.limit(maxFree)
  }
  return `Usaste as tuas ${maxFree} questões gratuitas.\n\nA tua pergunta foi registada - para continuar com orientação profissional ilimitada do Sidus, activa o Premium abaixo.`
}
