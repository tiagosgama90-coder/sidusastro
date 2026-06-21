/**
 * Interpretação numerológica — vibração do nome, significado espiritual e ponte astrológica.
 */

const PLANETA_NUM = {
  1: { pt: 'Sol', en: 'Sun', tema: { pt: 'identidade e vontade', en: 'identity and will' } },
  2: { pt: 'Lua', en: 'Moon', tema: { pt: 'emoção e acolhimento', en: 'emotion and nurturing' } },
  3: { pt: 'Júpiter', en: 'Jupiter', tema: { pt: 'expansão e expressão', en: 'expansion and expression' } },
  4: { pt: 'Urano', en: 'Uranus', tema: { pt: 'estrutura e transformação', en: 'structure and transformation' } },
  5: { pt: 'Mercúrio', en: 'Mercury', tema: { pt: 'mente e movimento', en: 'mind and movement' } },
  6: { pt: 'Vénus', en: 'Venus', tema: { pt: 'amor e serviço', en: 'love and service' } },
  7: { pt: 'Neptuno', en: 'Neptune', tema: { pt: 'intuição e silêncio', en: 'intuition and silence' } },
  8: { pt: 'Saturno', en: 'Saturn', tema: { pt: 'realização e responsabilidade', en: 'achievement and responsibility' } },
  9: { pt: 'Marte', en: 'Mars', tema: { pt: 'coragem e conclusão', en: 'courage and completion' } },
  11: { pt: 'Intuição elevada', en: 'Elevated intuition', tema: { pt: 'inspiração profunda', en: 'deep inspiration' } },
  22: { pt: 'Grande obra', en: 'Great work', tema: { pt: 'construção colectiva', en: 'collective building' } },
  33: { pt: 'Compaixão mestra', en: 'Master compassion', tema: { pt: 'cura e ensino', en: 'healing and teaching' } },
}

const TITULOS_PT = {
  1: 'O Pioneiro', 2: 'O Mediador', 3: 'O Criador', 4: 'O Construtor', 5: 'O Explorador',
  6: 'O Guardião', 7: 'O Místico', 8: 'O Realizador', 9: 'O Humanitário',
  11: 'O Inspirador', 22: 'O Arquitecto', 33: 'O Curador',
}

const TITULOS_EN = {
  1: 'The Pioneer', 2: 'The Mediator', 3: 'The Creator', 4: 'The Builder', 5: 'The Explorer',
  6: 'The Guardian', 7: 'The Mystic', 8: 'The Achiever', 9: 'The Humanitarian',
  11: 'The Inspirer', 22: 'The Architect', 33: 'The Healer',
}

const INTERPRETACOES_PT = {
  destino: {
    1: { resumo: 'O teu nome vibra liderança e iniciativa.', espiritual: 'A Expressão revela como te manifestas no mundo: com coragem para abrir caminhos e assumir o teu lugar sem depender da aprovação alheia.', pratica: 'Hoje, toma uma decisão que adias há tempo — mesmo que pequena.', reflexao: 'Onde estou a esperar permissão para ser quem realmente sou?' },
    2: { resumo: 'O teu nome vibra cooperação e sensibilidade.', espiritual: 'A Expressão pede equilíbrio nas relações: ouvir antes de falar, unir antes de dividir. A tua presença acalma ambientes tensos.', pratica: 'Escolhe uma conversa difícil e conduz-a com calma e empatia.', reflexao: 'Estou a honrar a minha sensibilidade ou a escondê-la?' },
    3: { resumo: 'O teu nome vibra criatividade e comunicação.', espiritual: 'A Expressão é arte em movimento: palavras, gestos ou ideias que iluminam. Quando partilhas autenticamente, inspiras outros.', pratica: 'Expressa algo que guardas — escreve, canta, desenha ou diz em voz alta.', reflexao: 'O que preciso de dizer ou criar para me sentir inteiro/a?' },
    4: { resumo: 'O teu nome vibra ordem e persistência.', espiritual: 'A Expressão constrói com paciência. Cada passo metódico é uma oração silenciosa; a disciplina é o teu caminho espiritual.', pratica: 'Organiza um espaço físico ou digital — a clareza exterior reflecte a interior.', reflexao: 'Onde preciso de mais estrutura para avançar com confiança?' },
    5: { resumo: 'O teu nome vibra liberdade e adaptação.', espiritual: 'A Expressão pede movimento consciente: explorar, aprender, mudar sem perder o centro. A variedade alimenta a alma.', pratica: 'Experimenta algo novo — um caminho, uma ideia, uma conversa inesperada.', reflexao: 'Estou preso/a a rotinas que já não me servem?' },
    6: { resumo: 'O teu nome vibra cuidado e responsabilidade.', espiritual: 'A Expressão nutre: família, comunidade, beleza no quotidiano. Servir com amor é a tua vocação mais natural.', pratica: 'Faz algo concreto por alguém que amas — sem esperar reconhecimento.', reflexao: 'Estou a cuidar dos outros sem me esquecer de mim?' },
    7: { resumo: 'O teu nome vibra profundidade e introspecção.', espiritual: 'A Expressão busca verdades invisíveis. O silêncio, o estudo e a contemplação são portas para a sabedoria.', pratica: 'Reserva 15 minutos sem ecrãs — apenas respiração e presença.', reflexao: 'Que verdade interior estou pronto/a a escutar?' },
    8: { resumo: 'O teu nome vibra realização e influência.', espiritual: 'A Expressão manifesta poder com propósito: liderar, construir, equilibrar dar e receber com justiça.', pratica: 'Define um objectivo material ou profissional claro para esta semana.', reflexao: 'Uso a minha influência para elevar ou para controlar?' },
    9: { resumo: 'O teu nome vibra compaixão e conclusão.', espiritual: 'A Expressão encerra ciclos com generosidade. Perdoar, entregar e servir o todo são actos sagrados.', pratica: 'Liberta algo que já cumpriu o seu tempo — um hábito, uma mágoa, um objecto.', reflexao: 'O que preciso de fechar para abrir espaço ao novo?' },
    11: { resumo: 'Número mestre de inspiração e intuição.', espiritual: 'A Expressão é um canal: visões, ideias e sensibilidade que vão além do comum. Protege a tua energia.', pratica: 'Regista um insight ou sonho — pode ser uma mensagem importante.', reflexao: 'Estou a confiar na minha intuição ou a silenciá-la?' },
    22: { resumo: 'Número mestre de grande realização.', espiritual: 'A Expressão constrói obras que transcendem o individual. Visão ampla, execução paciente.', pratica: 'Esboça um projecto que beneficie mais do que uma pessoa.', reflexao: 'Qual é a obra que o mundo precisa que eu construa?' },
    33: { resumo: 'Número mestre de cura e ensino.', espiritual: 'A Expressão irradia amor incondicional. Curar através da presença é o teu dom mais raro.', pratica: 'Oferece escuta plena a alguém — sem conselhos, apenas presença.', reflexao: 'Como posso servir com amor sem me anular?' },
  },
  alma: {
    1: { resumo: 'Por dentro, desejas autonomia e reconhecimento.', espiritual: 'A Alma (vogais do nome) é o desejo mais profundo: ser único/a, original, livre de máscaras.', pratica: 'Faz algo só para ti — sem partilhar nas redes.', reflexao: 'Quando me sinto verdadeiramente eu?' },
    2: { resumo: 'Por dentro, desejas paz e ligação.', espiritual: 'A Alma anseia pertencer com segurança. A harmonia íntima alimenta o espírito.', pratica: 'Envia uma mensagem de gratidão a alguém importante.', reflexao: 'Onde preciso de mais ternura comigo?' },
    3: { resumo: 'Por dentro, desejas alegria e expressão.', espiritual: 'A Alma respira através da criatividade. Rir, criar e comunicar são necessidades espirituais.', pratica: 'Permite-te um momento de pura diversão — sem culpa.', reflexao: 'O que me faz sentir leve por dentro?' },
    4: { resumo: 'Por dentro, desejas estabilidade e propósito.', espiritual: 'A Alma precisa de chão firme. Segurança emocional e estrutura são o teu santuário interior.', pratica: 'Cria uma rotina simples que te acalme de manhã.', reflexao: 'O que me dá sensação de «casa» por dentro?' },
    5: { resumo: 'Por dentro, desejas liberdade e novidade.', espiritual: 'A Alma aborrece prisões. Variedade, viagem interior ou exterior, alimentam a chama.', pratica: 'Muda um pequeno hábito — senta-te noutro lugar, ouve música diferente.', reflexao: 'Onde me sinto mais vivo/a e livre?' },
    6: { resumo: 'Por dentro, desejas amar e ser amado/a.', espiritual: 'A Alma floresce no cuidado mútuo. Lar, família e beleza são o teu templo.', pratica: 'Prepara ou partilha uma refeição com intenção amorosa.', reflexao: 'Como expresso amor no quotidiano?' },
    7: { resumo: 'Por dentro, desejas verdade e silêncio.', espiritual: 'A Alma busca o sagrado no recolhimento. Conhecimento oculto e introspecção são fome espiritual.', pratica: 'Lê ou medita sobre um tema que te fascina.', reflexao: 'Que pergunta espiritual me acompanha neste momento?' },
    8: { resumo: 'Por dentro, desejas realização e justiça.', espiritual: 'A Alma quer impacto concreto. Poder alinhado com propósito — não dominação.', pratica: 'Revisa um objectivo financeiro ou profissional com honestidade.', reflexao: 'O sucesso que busco serve a quem?' },
    9: { resumo: 'Por dentro, desejas servir o todo.', espiritual: 'A Alma vibra compaixão universal. Idealismo e entrega desinteressada movem-te.', pratica: 'Faz um gesto anónimo de generosidade.', reflexao: 'Como posso contribuir para algo maior que eu?' },
    11: { resumo: 'Desejo profundo de elevar consciências.', espiritual: 'A Alma é um receptor sensível. Intuição e inspiração são a tua língua nativa.', pratica: 'Observa os teus sonhos ou sincronicidades nas próximas 24 h.', reflexao: 'Que mensagem interior estou a ignorar?' },
    22: { resumo: 'Desejo de construir algo duradouro.', espiritual: 'A Alma pensa em legado. Obras colectivas alimentam o espírito.', pratica: 'Lista três projectos que te fariam orgulho daqui a dez anos.', reflexao: 'O que quero deixar no mundo?' },
    33: { resumo: 'Desejo de curar e ensinar com amor.', espiritual: 'A Alma irradia compaixão. Ser farol para outros é vocação.', pratica: 'Pratica a escuta activa durante uma conversa.', reflexao: 'Como posso ser presença curativa hoje?' },
  },
  personalidade: {
    1: { resumo: 'O mundo vê-te determinado/a e directo/a.', espiritual: 'A Personalidade (consoantes) é a primeira impressão: firmeza, iniciativa, liderança visível.', pratica: 'Observa como te apresentas numa reunião ou encontro.', reflexao: 'A imagem que projecto reflecte quem sou por dentro?' },
    2: { resumo: 'O mundo vê-te acolhedor/a e diplomático/a.', espiritual: 'A Personalidade transmite calma e receptividade. Outros sentem-se seguros contigo.', pratica: 'Nota quando alguém te procura para desabafar.', reflexao: 'Sou percebido/a como ponte ou como espectador/a?' },
    3: { resumo: 'O mundo vê-te criativo/a e comunicativo/a.', espiritual: 'A Personalidade brilha com charme e leveza. A tua energia contagia optimismo.', pratica: 'Usa cor ou estilo que te faça sentir expressivo/a.', reflexao: 'Estou a comunicar autenticidade ou performance?' },
    4: { resumo: 'O mundo vê-te fiável e metódico/a.', espiritual: 'A Personalidade transmite solidez. Confiança nasce da tua consistência.', pratica: 'Cumpre um compromisso pequeno com rigor total.', reflexao: 'A minha presença inspira confiança?' },
    5: { resumo: 'O mundo vê-te dinâmico/a e curioso/a.', espiritual: 'A Personalidade irradia movimento e adaptabilidade. Magnetismo de quem vive intensamente.', pratica: 'Partilha algo que aprendeste recentemente.', reflexao: 'Transmito energia ou dispersão?' },
    6: { resumo: 'O mundo vê-te caloroso/a e responsável.', espiritual: 'A Personalidade cuida do ambiente. Beleza, ordem e acolhimento definem-te.', pratica: 'Melhora um detalhe estético no teu espaço.', reflexao: 'Sou visto/a como cuidador/a ou como controlador/a?' },
    7: { resumo: 'O mundo vê-te reservado/a e profundo/a.', espiritual: 'A Personalidade guarda mistério. Inteligência e introspecção marcam a tua aura.', pratica: 'Reserva um momento só teu antes de responder a mensagens.', reflexao: 'A minha reserva protege ou isola?' },
    8: { resumo: 'O mundo vê-te competente e influente.', espiritual: 'A Personalidade comanda respeito. Autoridade natural sem esforço aparente.', pratica: 'Assume liderança numa tarefa concreta.', reflexao: 'Uso a minha presença para inspirar ou intimidar?' },
    9: { resumo: 'O mundo vê-te sábio/a e compassivo/a.', espiritual: 'A Personalidade irradia humanitarismo. Sabedoria visível através da empatia.', pratica: 'Oferece perspectiva a alguém que está confuso/a.', reflexao: 'Sou percebido/a como guia ou como juiz?' },
    11: { resumo: 'Presença intuitiva e inspiradora.', espiritual: 'A Personalidade captura atenção sem procurar. Carisma sutil e penetrante.', pratica: 'Partilha uma ideia ou visão que te entusiasma.', reflexao: 'Inspiro ou sobrecarrego quem me rodeia?' },
    22: { resumo: 'Presença imponente e visionária.', espiritual: 'A Personalidade projecta capacidade executiva. Outros confiam nos teus planos.', pratica: 'Apresenta um plano estruturado a alguém de confiança.', reflexao: 'A minha ambição é clara para os outros?' },
    33: { resumo: 'Presença curativa e gentil.', espiritual: 'A Personalidade acalma. Luz suave que outros procuram inconscientemente.', pratica: 'Sorri com intenção genuína nas próximas interacções.', reflexao: 'Deixo os outros mais leves depois de me verem?' },
  },
  caminhoVida: {
    1: { resumo: 'Missão de vida: liderar e iniciar.', espiritual: 'O Caminho de Vida (data de nascimento) indica a lição central desta encarnação: abrir novos ciclos com coragem.', pratica: 'Inicia um projecto que adias — mesmo que pequeno.', reflexao: 'Onde tenho medo de ser o/a primeiro/a?' },
    2: { resumo: 'Missão de vida: unir e harmonizar.', espiritual: 'Cooperação e diplomacia são o fio condutor. Relações conscientes são o teu campo de evolução.', pratica: 'Resolve uma tensão com diálogo honesto.', reflexao: 'Estou a construir pontes ou muros?' },
    3: { resumo: 'Missão de vida: criar e comunicar.', espiritual: 'Alegria partilhada amplifica o propósito. A tua voz ou arte cura ambientes.', pratica: 'Cria algo que outros possam ver ou ouvir.', reflexao: 'A minha expressão serve a quem?' },
    4: { resumo: 'Missão de vida: construir com persistência.', espiritual: 'Disciplina e trabalho honesto são o caminho. Alicerces sólidos sustentam tudo o resto.', pratica: 'Completa uma tarefa pendente com rigor.', reflexao: 'Onde falta-me paciência para construir?' },
    5: { resumo: 'Missão de vida: explorar e adaptar.', espiritual: 'Mudança consciente é evolução. Flexibilidade sem perder o essencial.', pratica: 'Sai da zona de conforto — mesmo que ligeiramente.', reflexao: 'Estou a fugir da rotina ou da responsabilidade?' },
    6: { resumo: 'Missão de vida: nutrir e servir.', espiritual: 'Família, comunidade e beleza são prioridades espirituais. Cuidar é sagrado.', pratica: 'Dedica tempo de qualidade a quem amas.', reflexao: 'Equilibro dar e receber amor?' },
    7: { resumo: 'Missão de vida: compreender e contemplar.', espiritual: 'Estudo, silêncio e espiritualidade aprofundam a missão. A resposta está no interior.', pratica: 'Estuda um tema espiritual ou filosófico.', reflexao: 'Confio no silêncio como professor?' },
    8: { resumo: 'Missão de vida: realizar com integridade.', espiritual: 'Poder material alinhado com ética. Sucesso que eleva, não que esmaga.', pratica: 'Revisa um objectivo profissional com honestidade.', reflexao: 'O meu sucesso honra os meus valores?' },
    9: { resumo: 'Missão de vida: completar e entregar.', espiritual: 'Encerrar ciclos com generosidade. Humanitarismo como expressão máxima.', pratica: 'Perdoa alguém — incluindo ti.', reflexao: 'O que preciso de libertar para avançar?' },
    11: { resumo: 'Missão mestra de inspiração.', espiritual: 'Canal de intuição elevada. Inspirar sem te consumir.', pratica: 'Partilha uma visão ou insight com alguém.', reflexao: 'Protejo a minha sensibilidade?' },
    22: { resumo: 'Missão mestra de construção.', espiritual: 'Materializar visões em benefício colectivo. Grande responsabilidade espiritual.', pratica: 'Avança um passo concreto num projecto maior.', reflexao: 'A minha visão serve o colectivo?' },
    33: { resumo: 'Missão mestra de compaixão.', espiritual: 'Ensinar amor incondicional. Cura através da presença.', pratica: 'Pratica paciência extrema numa situação difícil.', reflexao: 'Amo sem condições ou com expectativas?' },
  },
}

const INTERPRETACOES_EN = {
  destino: {
    1: { resumo: 'Your name vibrates leadership and initiative.', espiritual: 'Expression shows how you manifest in the world: courage to open paths and claim your place.', pratica: 'Today, make one decision you have been postponing.', reflexao: 'Where am I waiting for permission to be myself?' },
    2: { resumo: 'Your name vibrates cooperation and sensitivity.', espiritual: 'Expression asks for balance in relationships: listen before speaking, unite before dividing.', pratica: 'Choose a difficult conversation and lead it with calm empathy.', reflexao: 'Am I honouring my sensitivity or hiding it?' },
    3: { resumo: 'Your name vibrates creativity and communication.', espiritual: 'Expression is art in motion: words, gestures or ideas that illuminate.', pratica: 'Express something you have kept inside — write, sing, draw or speak aloud.', reflexao: 'What do I need to say or create to feel whole?' },
    4: { resumo: 'Your name vibrates order and persistence.', espiritual: 'Expression builds with patience. Each methodical step is a quiet prayer.', pratica: 'Organise one physical or digital space — outer clarity reflects inner clarity.', reflexao: 'Where do I need more structure to move forward confidently?' },
    5: { resumo: 'Your name vibrates freedom and adaptation.', espiritual: 'Expression asks for conscious movement: explore, learn, change without losing centre.', pratica: 'Try something new — a route, an idea, an unexpected conversation.', reflexao: 'Am I stuck in routines that no longer serve me?' },
    6: { resumo: 'Your name vibrates care and responsibility.', espiritual: 'Expression nurtures: family, community, beauty in daily life.', pratica: 'Do something concrete for someone you love — without expecting recognition.', reflexao: 'Am I caring for others while forgetting myself?' },
    7: { resumo: 'Your name vibrates depth and introspection.', espiritual: 'Expression seeks invisible truths. Silence, study and contemplation open wisdom.', pratica: 'Reserve 15 screen-free minutes — just breath and presence.', reflexao: 'What inner truth am I ready to hear?' },
    8: { resumo: 'Your name vibrates achievement and influence.', espiritual: 'Expression manifests power with purpose: lead, build, balance giving and receiving.', pratica: 'Set one clear material or professional goal for this week.', reflexao: 'Do I use my influence to elevate or to control?' },
    9: { resumo: 'Your name vibrates compassion and completion.', espiritual: 'Expression closes cycles generously. Forgiving and serving the whole are sacred acts.', pratica: 'Release something whose time has passed — a habit, a grudge, an object.', reflexao: 'What must I close to make room for the new?' },
    11: { resumo: 'Master number of inspiration and intuition.', espiritual: 'Expression is a channel: visions and sensitivity beyond the ordinary.', pratica: 'Write down an insight or dream — it may be an important message.', reflexao: 'Am I trusting my intuition or silencing it?' },
    22: { resumo: 'Master number of great achievement.', espiritual: 'Expression builds works that transcend the individual.', pratica: 'Sketch a project that benefits more than one person.', reflexao: 'What work does the world need me to build?' },
    33: { resumo: 'Master number of healing and teaching.', espiritual: 'Expression radiates unconditional love. Healing through presence is your rarest gift.', pratica: 'Offer full listening to someone — without advice, just presence.', reflexao: 'How can I serve with love without losing myself?' },
  },
  alma: {
    1: { resumo: 'Inside, you desire autonomy and recognition.', espiritual: 'The Soul (vowels of the name) is your deepest desire: to be unique and free of masks.', pratica: 'Do something just for you — without sharing on social media.', reflexao: 'When do I feel truly myself?' },
    2: { resumo: 'Inside, you desire peace and connection.', espiritual: 'The Soul longs to belong with safety. Intimate harmony feeds the spirit.', pratica: 'Send a message of gratitude to someone important.', reflexao: 'Where do I need more tenderness toward myself?' },
    3: { resumo: 'Inside, you desire joy and expression.', espiritual: 'The Soul breathes through creativity. Laughing, creating and communicating are spiritual needs.', pratica: 'Allow yourself a moment of pure fun — without guilt.', reflexao: 'What makes me feel light inside?' },
    4: { resumo: 'Inside, you desire stability and purpose.', espiritual: 'The Soul needs firm ground. Emotional security and structure are your inner sanctuary.', pratica: 'Create a simple morning routine that calms you.', reflexao: 'What gives me a sense of home inside?' },
    5: { resumo: 'Inside, you desire freedom and novelty.', espiritual: 'The Soul resists prisons. Variety and movement feed the flame.', pratica: 'Change one small habit — sit elsewhere, listen to different music.', reflexao: 'Where do I feel most alive and free?' },
    6: { resumo: 'Inside, you desire to love and be loved.', espiritual: 'The Soul flourishes in mutual care. Home, family and beauty are your temple.', pratica: 'Prepare or share a meal with loving intention.', reflexao: 'How do I express love in daily life?' },
    7: { resumo: 'Inside, you desire truth and silence.', espiritual: 'The Soul seeks the sacred in retreat. Hidden knowledge and introspection are spiritual hunger.', pratica: 'Read or meditate on a topic that fascinates you.', reflexao: 'What spiritual question accompanies me now?' },
    8: { resumo: 'Inside, you desire achievement and justice.', espiritual: 'The Soul wants concrete impact. Power aligned with purpose — not domination.', pratica: 'Review a financial or professional goal with honesty.', reflexao: 'Who does the success I seek serve?' },
    9: { resumo: 'Inside, you desire to serve the whole.', espiritual: 'The Soul vibrates universal compassion. Idealism and selfless giving move you.', pratica: 'Make an anonymous act of generosity.', reflexao: 'How can I contribute to something greater than myself?' },
    11: { resumo: 'Deep desire to raise consciousness.', espiritual: 'The Soul is a sensitive receiver. Intuition and inspiration are your native language.', pratica: 'Notice your dreams or synchronicities in the next 24 hours.', reflexao: 'What inner message am I ignoring?' },
    22: { resumo: 'Desire to build something lasting.', espiritual: 'The Soul thinks in legacy. Collective works feed the spirit.', pratica: 'List three projects that would make you proud in ten years.', reflexao: 'What do I want to leave in the world?' },
    33: { resumo: 'Desire to heal and teach with love.', espiritual: 'The Soul radiates compassion. Being a light for others is vocation.', pratica: 'Practise active listening in one conversation.', reflexao: 'How can I be a healing presence today?' },
  },
  personalidade: {
    1: { resumo: 'The world sees you as determined and direct.', espiritual: 'Personality (consonants) is first impression: firmness, initiative, visible leadership.', pratica: 'Notice how you present yourself in a meeting or encounter.', reflexao: 'Does the image I project reflect who I am inside?' },
    2: { resumo: 'The world sees you as welcoming and diplomatic.', espiritual: 'Personality transmits calm and receptivity. Others feel safe with you.', pratica: 'Notice when someone comes to you to confide.', reflexao: 'Am I perceived as a bridge or a spectator?' },
    3: { resumo: 'The world sees you as creative and communicative.', espiritual: 'Personality shines with charm and lightness. Your energy spreads optimism.', pratica: 'Use colour or style that makes you feel expressive.', reflexao: 'Am I communicating authenticity or performance?' },
    4: { resumo: 'The world sees you as reliable and methodical.', espiritual: 'Personality transmits solidity. Trust comes from your consistency.', pratica: 'Keep one small commitment with total rigour.', reflexao: 'Does my presence inspire confidence?' },
    5: { resumo: 'The world sees you as dynamic and curious.', espiritual: 'Personality radiates movement and adaptability.', pratica: 'Share something you learned recently.', reflexao: 'Do I transmit energy or scatter?' },
    6: { resumo: 'The world sees you as warm and responsible.', espiritual: 'Personality cares for the environment. Beauty, order and welcome define you.', pratica: 'Improve one aesthetic detail in your space.', reflexao: 'Am I seen as a caregiver or a controller?' },
    7: { resumo: 'The world sees you as reserved and deep.', espiritual: 'Personality holds mystery. Intelligence and introspection mark your aura.', pratica: 'Reserve a moment alone before replying to messages.', reflexao: 'Does my reserve protect or isolate?' },
    8: { resumo: 'The world sees you as competent and influential.', espiritual: 'Personality commands respect. Natural authority without apparent effort.', pratica: 'Take leadership in one concrete task.', reflexao: 'Do I use my presence to inspire or intimidate?' },
    9: { resumo: 'The world sees you as wise and compassionate.', espiritual: 'Personality radiates humanitarianism. Visible wisdom through empathy.', pratica: 'Offer perspective to someone who is confused.', reflexao: 'Am I perceived as a guide or a judge?' },
    11: { resumo: 'Intuitive and inspiring presence.', espiritual: 'Personality captures attention without trying. Subtle, penetrating charisma.', pratica: 'Share an idea or vision that excites you.', reflexao: 'Do I inspire or overwhelm those around me?' },
    22: { resumo: 'Imposing and visionary presence.', espiritual: 'Personality projects executive capacity. Others trust your plans.', pratica: 'Present a structured plan to someone you trust.', reflexao: 'Is my ambition clear to others?' },
    33: { resumo: 'Healing and gentle presence.', espiritual: 'Personality calms. Soft light others seek unconsciously.', pratica: 'Smile with genuine intention in your next interactions.', reflexao: 'Do I leave others lighter after seeing me?' },
  },
  caminhoVida: {
    1: { resumo: 'Life mission: lead and initiate.', espiritual: 'Life Path (birth date) indicates the central lesson of this incarnation.', pratica: 'Start a project you have been postponing — even a small one.', reflexao: 'Where am I afraid to be first?' },
    2: { resumo: 'Life mission: unite and harmonise.', espiritual: 'Cooperation and diplomacy are the thread. Conscious relationships are your field of evolution.', pratica: 'Resolve one tension with honest dialogue.', reflexao: 'Am I building bridges or walls?' },
    3: { resumo: 'Life mission: create and communicate.', espiritual: 'Shared joy amplifies purpose. Your voice or art heals environments.', pratica: 'Create something others can see or hear.', reflexao: 'Who does my expression serve?' },
    4: { resumo: 'Life mission: build with persistence.', espiritual: 'Discipline and honest work are the path. Solid foundations sustain everything else.', pratica: 'Complete one pending task with rigour.', reflexao: 'Where do I lack patience to build?' },
    5: { resumo: 'Life mission: explore and adapt.', espiritual: 'Conscious change is evolution. Flexibility without losing the essential.', pratica: 'Leave your comfort zone — even slightly.', reflexao: 'Am I fleeing routine or responsibility?' },
    6: { resumo: 'Life mission: nurture and serve.', espiritual: 'Family, community and beauty are spiritual priorities.', pratica: 'Dedicate quality time to someone you love.', reflexao: 'Do I balance giving and receiving love?' },
    7: { resumo: 'Life mission: understand and contemplate.', espiritual: 'Study, silence and spirituality deepen the mission.', pratica: 'Study a spiritual or philosophical topic.', reflexao: 'Do I trust silence as a teacher?' },
    8: { resumo: 'Life mission: achieve with integrity.', espiritual: 'Material power aligned with ethics. Success that elevates, not crushes.', pratica: 'Review a professional goal with honesty.', reflexao: 'Does my success honour my values?' },
    9: { resumo: 'Life mission: complete and surrender.', espiritual: 'Close cycles generously. Humanitarianism as highest expression.', pratica: 'Forgive someone — including yourself.', reflexao: 'What must I release to move forward?' },
    11: { resumo: 'Master mission of inspiration.', espiritual: 'Channel of elevated intuition. Inspire without burning out.', pratica: 'Share a vision or insight with someone.', reflexao: 'Do I protect my sensitivity?' },
    22: { resumo: 'Master mission of building.', espiritual: 'Materialise visions for collective benefit.', pratica: 'Take one concrete step on a larger project.', reflexao: 'Does my vision serve the collective?' },
    33: { resumo: 'Master mission of compassion.', espiritual: 'Teach unconditional love. Heal through presence.', pratica: 'Practise extreme patience in a difficult situation.', reflexao: 'Do I love without conditions or with expectations?' },
  },
}

function interp(tipo, num, lang) {
  const map = lang === 'en' ? INTERPRETACOES_EN : INTERPRETACOES_PT
  return map[tipo]?.[num] || map[tipo]?.[reduzirMestre(num)] || null
}

function reduzirMestre(n) {
  return n
}

function tituloNum(num, lang) {
  const map = lang === 'en' ? TITULOS_EN : TITULOS_PT
  return map[num] || map[reduzirMestre(num)] || ''
}

function ponteAstro(num, mapaNatal, lang) {
  if (!mapaNatal) return null
  const p = PLANETA_NUM[num]
  if (!p) return null
  const planeta = lang === 'en' ? p.en : p.pt
  const tema = lang === 'en' ? p.tema.en : p.tema.pt
  const sol = mapaNatal.solar?.nome || '—'
  const lua = mapaNatal.lunar?.nome || '—'
  const asc = mapaNatal.ascendente?.nome || '—'
  if (lang === 'en') {
    return { planeta, tema, sol, lua, asc, texto: `This vibration connects with ${planeta} (${tema}). In your chart: Sun in ${sol}, Moon in ${lua}, Ascendant ${asc}.` }
  }
  return { planeta, tema, sol, lua, asc, texto: `Esta vibração liga-se a ${planeta} (${tema}). No teu mapa: Sol em ${sol}, Lua em ${lua}, Ascendente ${asc}.` }
}

function separarLetras(letras) {
  const vogais = new Set('aeiouáàãâéêíóôõúy'.split(''))
  const v = []
  const c = []
  for (const l of letras || []) {
    if (vogais.has(l.letra.toLowerCase())) v.push(l)
    else c.push(l)
  }
  return { vogais: v, consoantes: c }
}

function visaoGeral(nome, mapa, lang) {
  const { destino, alma, personalidade } = mapa
  if (lang === 'en') {
    return `The name «${nome}» carries three layers of meaning. Expression ${destino} is how you act in the world; Soul ${alma} is what you desire deep inside; Personality ${personalidade} is how others first perceive you. Together they form your spiritual signature.`
  }
  return `O nome «${nome}» revela três camadas de significado. A Expressão ${destino} é como ages no mundo; a Alma ${alma} é o que desejas no profundo; a Personalidade ${personalidade} é como os outros te veem à primeira vista. Juntas formam a tua assinatura espiritual.`
}

export function enriquecerMapaNumerologia(base, nome, lang = 'pt', mapaNatal = null) {
  const pilares = [
    { id: 'destino', num: base.destino, icone: '✦', cor: '#DFB76C', calculo: base.calculos?.destino },
    { id: 'alma', num: base.alma, icone: '🌙', cor: '#A78BFA', calculo: base.calculos?.alma },
    { id: 'personalidade', num: base.personalidade, icone: '☀', cor: '#34D399', calculo: base.calculos?.personalidade },
  ].map((p) => {
    const bloco = interp(p.id, p.num, lang)
    const astro = ponteAstro(p.num, mapaNatal, lang)
    return {
      ...p,
      titulo: tituloNum(p.num, lang),
      ...bloco,
      astro,
    }
  })

  const caminhoBloco = interp('caminhoVida', base.caminhoVida, lang)
  const caminhoAstro = ponteAstro(base.caminhoVida, mapaNatal, lang)

  const harmonias = []
  if (base.destino === base.alma) {
    harmonias.push(lang === 'en'
      ? 'Expression and Soul align — what you show matches what you desire. Authenticity flows naturally.'
      : 'Expressão e Alma alinham-se — o que mostras coincide com o que desejas. A autenticidade flui com naturalidade.')
  } else if (Math.abs(base.destino - base.alma) >= 4) {
    harmonias.push(lang === 'en'
      ? 'Expression and Soul differ — inner desire and outer action ask for conscious integration.'
      : 'Expressão e Alma diferem — o desejo interior e a acção exterior pedem integração consciente.')
  }
  if (base.destino !== base.personalidade) {
    harmonias.push(lang === 'en'
      ? 'Personality and Expression are distinct — others may see you differently from how you act. This is fertile ground for growth.'
      : 'Personalidade e Expressão são distintas — os outros podem ver-te de forma diferente da tua acção. É terreno fértil para crescimento.')
  }
  if (base.caminhoVida && base.destino && base.caminhoVida === base.destino) {
    harmonias.push(lang === 'en'
      ? 'Life Path and Expression share the same number — birth mission and name vibration walk in unison.'
      : 'Caminho de Vida e Expressão partilham o mesmo número — missão de nascimento e vibração do nome caminham em uníssono.')
  }

  const letrasSeparadas = separarLetras(base.letras)

  const textos = {}
  for (const key of ['caminhoVida', 'destino', 'alma', 'personalidade']) {
    const bloco = key === 'caminhoVida' ? caminhoBloco : interp(key, base[key], lang)
    textos[key] = bloco?.espiritual || base.textos?.[key] || '—'
  }
  textos.anoPessoal = base.textos?.anoPessoal || '—'
  textos.mesPessoal = base.textos?.mesPessoal || '—'

  return {
    ...base,
    textos,
    pilares,
    caminho: {
      num: base.caminhoVida,
      titulo: tituloNum(base.caminhoVida, lang),
      calculo: base.calculos?.caminhoVida,
      ...caminhoBloco,
      astro: caminhoAstro,
    },
    ritmo: {
      ano: { num: base.anoPessoal, calculo: base.calculos?.anoPessoal },
      mes: { num: base.mesPessoal, calculo: base.calculos?.mesPessoal, mesCalendario: base.mesCalendario },
    },
    visaoGeral: visaoGeral(nome, base, lang),
    harmonias,
    letrasSeparadas,
  }
}
