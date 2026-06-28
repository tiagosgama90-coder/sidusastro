/**
 * Horas Iguais - interpretação inspirada nos ensinamentos de Doreen Virtue
 * sobre números angélicos e sincronias do relógio.
 * Cada hora igual (HH:MM com dígitos espelhados) traz uma mensagem dos anjos.
 */

const HORAS_PT = {
  '00:00': {
    titulo: 'Reinício Sagrado',
    anjo: 'Os Anjos da Guarda',
    mensagem: 'És Um com o Divino. Os anjos pedem-te um momento de silêncio interior para alinhar intenção e espírito. Este é o portal da meia-noite - ideal para meditar e semear desejos com fé pura.',
    conselho: 'Medita 1 minuto em silêncio. Pede clareza para o novo ciclo que começa.',
    palavraChave: 'Unidade',
  },
  '01:01': {
    titulo: 'Manifestação dos Pensamentos',
    anjo: 'Anjo da Criação',
    mensagem: 'Os teus pensamentos estão a materializar-se com rapidez. Doreen Virtue ensinava que ver 01:01 é um aviso para manter a mente focada no positivo - o universo está a ouvir.',
    conselho: 'Substitui pensamentos de medo por afirmações de confiança durante as próximas horas.',
    palavraChave: 'Foco mental',
  },
  '02:02': {
    titulo: 'Fé e Equilíbrio',
    anjo: 'Anjo da Harmonia',
    mensagem: 'Mantém fé e equilíbrio. Tudo está a alinhar-se nos bastidores, mesmo que ainda não vejas resultados. Os anjos pedem paciência e confiança no tempo divino.',
    conselho: 'Confia no processo. Evita decisões impulsivas - espera pela clareza.',
    palavraChave: 'Confiança',
  },
  '03:03': {
    titulo: 'Presença dos Mestres Ascendidos',
    anjo: 'Mestres Ascendidos',
    mensagem: 'Os Mestres Ascendidos estão perto de ti, apoiando o teu crescimento espiritual. É um convite a ouvir a intuição e a seguir o caminho da alma com coragem.',
    conselho: 'Pergunta internamente: "Qual o próximo passo do meu caminho?" e escuta a resposta suave.',
    palavraChave: 'Intuição',
  },
  '04:04': {
    titulo: 'Anjos ao Teu Redor',
    anjo: 'Arcanjo Gabriel',
    mensagem: 'Os anjos envolvem-te com proteção e amor. Não estás sozinho/a nesta situação. Doreen Virtue associava 04:04 à presença angelical tangível - sê grato/a pelo apoio invisível.',
    conselho: 'Agradece em voz alta por três bênçãos do dia, por pequenas que sejam.',
    palavraChave: 'Proteção',
  },
  '05:05': {
    titulo: 'Mudança Positiva',
    anjo: 'Anjo da Transformação',
    mensagem: 'Grandes mudanças positivas estão a caminho. Abraça a transformação com flexibilidade - o que se afasta faz lugar ao que te serve verdadeiramente.',
    conselho: 'Liberta um hábito ou crença que já não ressoa contigo.',
    palavraChave: 'Transformação',
  },
  '06:06': {
    titulo: 'Equilíbrio Material e Espiritual',
    anjo: 'Anjo do Equilíbrio',
    mensagem: 'Os anjos pedem equilíbrio entre o mundo material e o espiritual. Cuida das tuas necessidades práticas sem negligenciar a alma. Generosidade e responsabilidade caminham juntas.',
    conselho: 'Faz algo concreto pelo bem-estar do corpo e algo simbólico pela paz interior.',
    palavraChave: 'Equilíbrio',
  },
  '07:07': {
    titulo: 'Sorte Espiritual',
    anjo: 'Anjo da Boa Fortuna',
    mensagem: 'Estás no caminho certo e a sorte espiritual acompanha-te. Continua o bom trabalho interior - os frutos aproximam-se. Os anjos celebram o teu progresso.',
    conselho: 'Continua o que começaste com disciplina suave. A perseverança é recompensada.',
    palavraChave: 'Perseverança',
  },
  '08:08': {
    titulo: 'Abundância e Fluxo',
    anjo: 'Anjo da Prosperidade',
    mensagem: 'O fluxo de abundância abre-se quando alinhas intenção, acção e gratidão. Doreen Virtue via em 08:08 um sinal de prosperidade equilibrada - material e emocional.',
    conselho: 'Organiza uma área da tua vida (finanças, tempo ou energia) com intenção positiva.',
    palavraChave: 'Abundância',
  },
  '09:09': {
    titulo: 'Missão de Alma',
    anjo: 'Anjo Humanitário',
    mensagem: 'Completa o que precisa de fecho e prepara-te para um capítulo alinhado com a tua missão de alma. Servir com amor é o teu maior poder.',
    conselho: 'Conclui uma tarefa pendente. Oferece ajuda a alguém sem esperar retorno.',
    palavraChave: 'Serviço',
  },
  '10:10': {
    titulo: 'Guia Divino no Caminho',
    anjo: 'Anjo da Orientação',
    mensagem: 'Confia que estás a ser guiado/a no rumo certo. Os anjos pedem que mantenhas pensamentos elevados e ações coerentes com o teu propósito superior.',
    conselho: 'Escreve uma intenção clara para a semana e coloca-a onde a vejas diariamente.',
    palavraChave: 'Propósito',
  },
  '11:11': {
    titulo: 'Portal de Despertar',
    anjo: 'Anjo da Iluminação',
    mensagem: 'O número mestre 11:11 é o portal mais conhecido de Doreen Virtue - sinal de despertar espiritual. Os anjos pedem atenção aos pensamentos: estás a co-criar a tua realidade neste instante.',
    conselho: 'Pede um sinal claro ao universo e observa sincronias nas próximas 24 horas.',
    palavraChave: 'Despertar',
  },
  '12:12': {
    titulo: 'Crescimento Espiritual',
    anjo: 'Anjo da Evolução',
    mensagem: 'Mantém os pés na terra enquanto expandes a consciência. O crescimento espiritual pede prática diária, não apenas inspiração momentânea.',
    conselho: 'Dedica 12 minutos hoje a leitura inspiradora, meditação ou journaling.',
    palavraChave: 'Evolução',
  },
  '13:13': {
    titulo: 'Apoio dos Mestres',
    anjo: 'Mestres Ascendidos',
    mensagem: 'Os Mestres Ascendidos ajudam-te a transformar obstáculos em sabedoria. O que parece bloqueio pode ser proteção divina a redirecionar-te.',
    conselho: 'Reformula um problema actual como lição em crescimento.',
    palavraChave: 'Sabedoria',
  },
  '14:14': {
    titulo: 'Adaptação Consciente',
    anjo: 'Anjo da Flexibilidade',
    mensagem: 'Os anjos pedem adaptação consciente às mudanças em curso. Ajusta planos sem perder a visão - flexibilidade é força, não fraqueza.',
    conselho: 'Revê uma meta e adapta o método, não o sonho.',
    palavraChave: 'Adaptação',
  },
  '15:15': {
    titulo: 'Mudanças Necessárias',
    anjo: 'Anjo da Libertação',
    mensagem: 'É tempo de mudanças positivas que libertam velhos padrões. Os anjos apoiam decisões que elevam a tua verdade interior.',
    conselho: 'Identifica uma situação que drena energia e define um limite saudável.',
    palavraChave: 'Libertação',
  },
  '16:16': {
    titulo: 'Alinhamento de Pensamento',
    anjo: 'Anjo da Verdade',
    mensagem: 'Os teus pensamentos estão a moldar a experiência presente. Doreen Virtue alertava: ver 16:16 pede honestidade interior e alinhamento entre o que pensas e o que fazes.',
    conselho: 'Pergunta: "Esta escolha honra quem quero ser?" e age em conformidade.',
    palavraChave: 'Alinhamento',
  },
  '17:17': {
    titulo: 'Caminho Correcto',
    anjo: 'Anjo da Confirmação',
    mensagem: 'Estás no caminho certo - os anjos confirmam. Continua com confiança e gratidão. A dúvida é natural, mas a orientação divina é real.',
    conselho: 'Regista três sinais positivos que recebeste recentemente.',
    palavraChave: 'Confirmação',
  },
  '18:18': {
    titulo: 'Oração Atendida',
    anjo: 'Anjo da Resposta',
    mensagem: 'As tuas orações e intenções estão a ser ouvidas. Mantém fé - a resposta manifesta-se no tempo perfeito, muitas vezes de formas inesperadas.',
    conselho: 'Agradece antecipadamente pela bênção que está a caminho.',
    palavraChave: 'Fé',
  },
  '19:19': {
    titulo: 'Missão de Vida',
    anjo: 'Anjo do Propósito',
    mensagem: 'Avança com coragem na direcção da tua missão de vida. Os anjos pedem que deixes o medo do julgamento e expresses o teu dom único.',
    conselho: 'Dá um pequeno passo concreto hoje em direcção ao teu sonho maior.',
    palavraChave: 'Coragem',
  },
  '20:20': {
    titulo: 'Decisão Divina',
    anjo: 'Anjo da Clareza',
    mensagem: 'Confia na orientação divina nas tuas decisões. Os anjos pedem que escolhas com o coração alinhado à verdade, não ao medo.',
    conselho: 'Antes de decidir, respira fundo três vezes e pergunta: "O que o amor faria?"',
    palavraChave: 'Clareza',
  },
  '21:21': {
    titulo: 'Meditação e Escuta',
    anjo: 'Anjo da Paz',
    mensagem: 'É tempo de meditação e escuta interior. A resposta que procuras está no silêncio, não no ruído. Os anjos falam em voz suave.',
    conselho: 'Desliga notificações por 21 minutos e medita ou caminha em silêncio.',
    palavraChave: 'Silêncio',
  },
  '22:22': {
    titulo: 'Número Mestre da Manifestação',
    anjo: 'Anjo da Co-criação',
    mensagem: 'O 22:22 é um número mestre de manifestação em grande escala. Doreen Virtue via aqui um convite a sonhar em grande e agir com disciplina amorosa.',
    conselho: 'Visualiza o teu ideal como já realizado por 2 minutos. Depois age.',
    palavraChave: 'Manifestação',
  },
  '23:23': {
    titulo: 'Parceria com o Universo',
    anjo: 'Anjo da Colaboração Cósmica',
    mensagem: 'Trabalha em parceria com o universo. Solta o controlo excessivo e permite que a vida te surpreenda. Os anjos fecham o dia com uma bênção de confiança.',
    conselho: 'Antes de dormir, entrega três preocupações aos anjos e agradece o dia.',
    palavraChave: 'Entrega',
  },
}

const HORAS_EN = {
  '00:00': { titulo: 'Sacred Reset', anjo: 'Guardian Angels', mensagem: 'You are One with the Divine. The angels ask for a moment of inner silence to align intention and spirit. This midnight portal is ideal for meditation and planting wishes with pure faith.', conselho: 'Meditate 1 minute in silence. Ask for clarity for the new cycle beginning.', palavraChave: 'Unity' },
  '01:01': { titulo: 'Thoughts Manifesting', anjo: 'Angel of Creation', mensagem: 'Your thoughts are materialising quickly. Doreen Virtue taught that 01:01 warns you to keep the mind focused on the positive - the universe is listening.', conselho: 'Replace fearful thoughts with affirmations of trust in the coming hours.', palavraChave: 'Mental focus' },
  '02:02': { titulo: 'Faith and Balance', anjo: 'Angel of Harmony', mensagem: 'Keep faith and balance. Everything is aligning behind the scenes. The angels ask for patience and trust in divine timing.', conselho: 'Trust the process. Avoid impulsive decisions - wait for clarity.', palavraChave: 'Trust' },
  '03:03': { titulo: 'Ascended Masters Near', anjo: 'Ascended Masters', mensagem: 'The Ascended Masters are close, supporting your spiritual growth. Listen to intuition and follow the soul path with courage.', conselho: 'Ask inwardly: "What is my next step?" and listen for the gentle answer.', palavraChave: 'Intuition' },
  '04:04': { titulo: 'Angels Surround You', anjo: 'Archangel Gabriel', mensagem: 'Angels surround you with protection and love. You are not alone. Doreen Virtue linked 04:04 to tangible angelic presence - be grateful for invisible support.', conselho: 'Thank aloud for three blessings of the day, however small.', palavraChave: 'Protection' },
  '05:05': { titulo: 'Positive Change', anjo: 'Angel of Transformation', mensagem: 'Great positive changes are coming. Embrace transformation with flexibility - what leaves makes room for what truly serves you.', conselho: 'Release a habit or belief that no longer resonates.', palavraChave: 'Transformation' },
  '06:06': { titulo: 'Material and Spiritual Balance', anjo: 'Angel of Balance', mensagem: 'Angels ask for balance between material and spiritual worlds. Care for practical needs without neglecting the soul.', conselho: 'Do something concrete for the body and something symbolic for inner peace.', palavraChave: 'Balance' },
  '07:07': { titulo: 'Spiritual Luck', anjo: 'Angel of Good Fortune', mensagem: 'You are on the right path and spiritual luck accompanies you. Angels celebrate your progress.', conselho: 'Continue what you started with gentle discipline. Perseverance is rewarded.', palavraChave: 'Perseverance' },
  '08:08': { titulo: 'Abundance Flow', anjo: 'Angel of Prosperity', mensagem: 'Abundance flows when intention, action and gratitude align. Doreen Virtue saw 08:08 as balanced prosperity - material and emotional.', conselho: 'Organise one area of life (finances, time or energy) with positive intention.', palavraChave: 'Abundance' },
  '09:09': { titulo: 'Soul Mission', anjo: 'Humanitarian Angel', mensagem: 'Complete what needs closure and prepare for a chapter aligned with your soul mission. Serving with love is your greatest power.', conselho: 'Finish a pending task. Offer help to someone without expecting return.', palavraChave: 'Service' },
  '10:10': { titulo: 'Divine Guidance', anjo: 'Angel of Direction', mensagem: 'Trust you are being guided on the right path. Angels ask for elevated thoughts and actions coherent with your higher purpose.', conselho: 'Write a clear intention for the week and place it where you see it daily.', palavraChave: 'Purpose' },
  '11:11': { titulo: 'Awakening Portal', anjo: 'Angel of Illumination', mensagem: 'Master number 11:11 is Doreen Virtue\'s best-known portal - a sign of spiritual awakening. Angels ask attention to thoughts: you are co-creating reality now.', conselho: 'Ask the universe for a clear sign and watch synchronicities in the next 24 hours.', palavraChave: 'Awakening' },
  '12:12': { titulo: 'Spiritual Growth', anjo: 'Angel of Evolution', mensagem: 'Keep feet on the ground while expanding consciousness. Spiritual growth needs daily practice, not only momentary inspiration.', conselho: 'Spend 12 minutes today on inspiring reading, meditation or journaling.', palavraChave: 'Evolution' },
  '13:13': { titulo: 'Masters\' Support', anjo: 'Ascended Masters', mensagem: 'Ascended Masters help transform obstacles into wisdom. What seems blockage may be divine protection redirecting you.', conselho: 'Reframe a current problem as a growth lesson.', palavraChave: 'Wisdom' },
  '14:14': { titulo: 'Conscious Adaptation', anjo: 'Angel of Flexibility', mensagem: 'Angels ask conscious adaptation to changes underway. Adjust plans without losing vision - flexibility is strength.', conselho: 'Review a goal and adapt the method, not the dream.', palavraChave: 'Adaptation' },
  '15:15': { titulo: 'Needed Changes', anjo: 'Angel of Release', mensagem: 'Time for positive changes that free old patterns. Angels support decisions that elevate your inner truth.', conselho: 'Identify a draining situation and set a healthy boundary.', palavraChave: 'Release' },
  '16:16': { titulo: 'Thought Alignment', anjo: 'Angel of Truth', mensagem: 'Your thoughts shape the present experience. Doreen Virtue warned: 16:16 asks for inner honesty and alignment between thought and action.', conselho: 'Ask: "Does this choice honour who I want to be?" and act accordingly.', palavraChave: 'Alignment' },
  '17:17': { titulo: 'Right Path', anjo: 'Angel of Confirmation', mensagem: 'You are on the right path - angels confirm. Continue with confidence and gratitude.', conselho: 'Record three positive signs you received recently.', palavraChave: 'Confirmation' },
  '18:18': { titulo: 'Prayer Answered', anjo: 'Angel of Response', mensagem: 'Your prayers and intentions are heard. Keep faith - the answer manifests in perfect timing, often unexpectedly.', conselho: 'Give thanks in advance for the blessing on its way.', palavraChave: 'Faith' },
  '19:19': { titulo: 'Life Mission', anjo: 'Angel of Purpose', mensagem: 'Move courageously toward your life mission. Angels ask you to release fear of judgment and express your unique gift.', conselho: 'Take one small concrete step today toward your greatest dream.', palavraChave: 'Courage' },
  '20:20': { titulo: 'Divine Decision', anjo: 'Angel of Clarity', mensagem: 'Trust divine guidance in your decisions. Angels ask choices aligned with truth, not fear.', conselho: 'Before deciding, breathe deeply three times and ask: "What would love do?"', palavraChave: 'Clarity' },
  '21:21': { titulo: 'Meditation and Listening', anjo: 'Angel of Peace', mensagem: 'Time for meditation and inner listening. The answer you seek is in silence, not noise.', conselho: 'Turn off notifications for 21 minutes and meditate or walk in silence.', palavraChave: 'Silence' },
  '22:22': { titulo: 'Master Manifestation', anjo: 'Angel of Co-creation', mensagem: '22:22 is a master number of large-scale manifestation. Doreen Virtue saw an invitation to dream big and act with loving discipline.', conselho: 'Visualise your ideal as already real for 2 minutes. Then act.', palavraChave: 'Manifestation' },
  '23:23': { titulo: 'Cosmic Partnership', anjo: 'Angel of Trust', mensagem: 'Work in partnership with the universe. Release excessive control and let life surprise you. Angels close the day with a blessing of trust.', conselho: 'Before sleep, hand three worries to the angels and thank the day.', palavraChave: 'Surrender' },
}

/** Horas espelho adicionais (HH:MM invertido) */
const ESPELHOS_PT = {
  '12:21': { titulo: 'Sincronia de Cura', mensagem: 'Os anjos enviam conforto emocional. É tempo de curar relações ou perdoar a ti mesmo/a.', conselho: 'Perdoa uma situação do passado, mesmo que apenas em silêncio.' },
  '13:31': { titulo: 'Criatividade Angelical', mensagem: 'Canal criativo aberto. Expressa arte, escrita ou música - os anjos fluem através da criação.', conselho: 'Cria algo hoje, por mais simples que seja.' },
  '14:41': { titulo: 'Estabilidade Divina', mensagem: 'Constrói alicerces sólidos. Os anjos apoiam projectos de longo prazo com paciência.', conselho: 'Dá um passo prático num projecto importante.' },
  '15:51': { titulo: 'Libertação de Velhos Ciclos', mensagem: 'Soltar o passado abre portas novas. Confia na renovação.', conselho: 'Desapega de um objecto ou memória que já não serve.' },
  '16:61': null,
  '21:12': { titulo: 'Reflexão e Renovação', mensagem: 'Espelho de 12:21 - renova compromissos consigo mesmo/a e com o sagrado.', conselho: 'Reafirma uma promessa pessoal importante.' },
  '23:32': { titulo: 'Protecção Noturna', mensagem: 'Antes de dormir, os anjos envolvem-te. Liberta preocupações do dia.', conselho: 'Escreve num papel o que te preocupa e rasga-o simbolicamente.' },
}

const ESPELHOS_EN = {
  '12:21': { titulo: 'Healing Synchronicity', mensagem: 'Angels send emotional comfort. Time to heal relationships or forgive yourself.', conselho: 'Forgive a past situation, even if only in silence.' },
  '13:31': { titulo: 'Angelic Creativity', mensagem: 'Creative channel open. Express art, writing or music - angels flow through creation.', conselho: 'Create something today, however simple.' },
  '14:41': { titulo: 'Divine Stability', mensagem: 'Build solid foundations. Angels support long-term projects with patience.', conselho: 'Take a practical step on an important project.' },
  '15:51': { titulo: 'Releasing Old Cycles', mensagem: 'Letting go of the past opens new doors. Trust renewal.', conselho: 'Release an object or memory that no longer serves.' },
  '21:12': { titulo: 'Reflection and Renewal', mensagem: 'Mirror of 12:21 - renew commitments to yourself and the sacred.', conselho: 'Reaffirm an important personal promise.' },
  '23:32': { titulo: 'Night Protection', mensagem: 'Before sleep, angels surround you. Release the day\'s worries.', conselho: 'Write worries on paper and tear it up symbolically.' },
}

export function formatarHora(hora, minuto) {
  return `${String(hora).padStart(2, '0')}:${String(minuto).padStart(2, '0')}`
}

export function isHoraIgual(hora, minuto) {
  const h = String(hora).padStart(2, '0')
  const m = String(minuto).padStart(2, '0')
  return h === m
}

export function isHoraEspelho(hora, minuto) {
  const h = String(hora).padStart(2, '0')
  const m = String(minuto).padStart(2, '0')
  return h === m.split('').reverse().join('')
}

export function listarHorasIguais(lang = 'pt') {
  const base = lang === 'en' ? HORAS_EN : HORAS_PT
  return Object.keys(base).sort()
}

export function interpretarHorario(hora, minuto, lang = 'pt') {
  const chave = formatarHora(hora, minuto)
  const iguais = lang === 'en' ? HORAS_EN : HORAS_PT
  const espelhos = lang === 'en' ? ESPELHOS_EN : ESPELHOS_PT

  if (iguais[chave]) {
    return { tipo: 'igual', chave, ...iguais[chave] }
  }
  if (espelhos[chave]) {
    return { tipo: 'espelho', chave, ...espelhos[chave] }
  }
  if (isHoraIgual(hora, minuto)) {
    const reduzida = formatarHora(hora % 24, minuto % 60)
    if (iguais[reduzida]) return { tipo: 'igual', chave: reduzida, ...iguais[reduzida] }
  }

  return {
    tipo: 'neutro',
    chave,
    titulo: lang === 'en' ? 'Present Moment' : 'Momento Presente',
    anjo: lang === 'en' ? 'Your Angels' : 'Os Teus Anjos',
    mensagem: lang === 'en'
      ? 'Every moment carries angelic guidance. Doreen Virtue taught that repeated numbers are divine nudges - stay attentive to the next synchronicity.'
      : 'Cada momento traz orientação angelical. Doreen Virtue ensinava que números repetidos são toques divinos - mantém-te atento/a à próxima sincronia.',
    conselho: lang === 'en'
      ? 'Take three conscious breaths and ask: "Angels, what do you want me to know now?"'
      : 'Respira três vezes conscientemente e pergunta: "Anjos, o que querem que eu saiba agora?"',
    palavraChave: lang === 'en' ? 'Presence' : 'Presença',
  }
}

export function interpretarAgora(lang = 'pt') {
  const agora = new Date()
  return interpretarHorario(agora.getHours(), agora.getMinutes(), lang)
}

export function proximaHoraIgual(date = new Date()) {
  const d = new Date(date)
  for (let i = 0; i < 24 * 60; i++) {
    d.setMinutes(d.getMinutes() + 1)
    if (isHoraIgual(d.getHours(), d.getMinutes())) {
      return formatarHora(d.getHours(), d.getMinutes())
    }
  }
  return '11:11'
}
