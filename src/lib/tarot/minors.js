/** 56 Arcanos Menores — interpretações profissionais por naipe e valor. */

const NAIPES = [
  { key: 'paus', nome: 'Paus', elemento: 'Fogo', tema: 'ação, criatividade, paixão e expansão', simb: '🪄', cor: '#D97706' },
  { key: 'copas', nome: 'Copas', elemento: 'Água', tema: 'emoção, amor, intuição e vínculo', simb: '🏺', cor: '#0284C7' },
  { key: 'espadas', nome: 'Espadas', elemento: 'Ar', tema: 'mente, verdade, conflito e clareza', simb: '⚔', cor: '#64748B' },
  { key: 'ouros', nome: 'Ouros', elemento: 'Terra', tema: 'matéria, trabalho, corpo e prosperidade', simb: '⬡', cor: '#047857' },
]

const RANKS = [
  { key: 'as', nome: 'Ás', num: 1, court: false },
  { key: '02', nome: 'Dois', num: 2, court: false },
  { key: '03', nome: 'Três', num: 3, court: false },
  { key: '04', nome: 'Quatro', num: 4, court: false },
  { key: '05', nome: 'Cinco', num: 5, court: false },
  { key: '06', nome: 'Seis', num: 6, court: false },
  { key: '07', nome: 'Sete', num: 7, court: false },
  { key: '08', nome: 'Oito', num: 8, court: false },
  { key: '09', nome: 'Nove', num: 9, court: false },
  { key: '10', nome: 'Dez', num: 10, court: false },
  { key: 'valete', nome: 'Valete', num: 11, court: true, courtRole: 'mensageiro' },
  { key: 'cavaleiro', nome: 'Cavaleiro', num: 12, court: true, courtRole: 'ação' },
  { key: 'rainha', nome: 'Rainha', num: 13, court: true, courtRole: 'maturidade interior' },
  { key: 'rei', nome: 'Rei', num: 14, court: true, courtRole: 'domínio exterior' },
]

const LUZ = {
  as: {
    paus: 'Chispa criativa e novo impulso vital. O Ás de Paus inaugura um ciclo de coragem, projetos e entusiasmo genuíno — a semente já contém a chama.',
    copas: 'Abertura emocional profunda. O Ás de Copas anuncia novo amor, cura do coração ou reconciliação consigo mesmo/a.',
    espadas: 'Clareza mental cortante como lâmina de luz. O Ás de Espadas traz verdade, insight decisivo e coragem para nomear o oculto.',
    ouros: 'Oportunidade material concreta. O Ás de Ouros sinaliza prosperidade nascente, investimento sólido ou talento pronto para gerar frutos.',
  },
  '02': {
    paus: 'Parceria dinâmica e visão partilhada. O Dois de Paus convida-te a planear o horizonte com confiança e ambição equilibrada.',
    copas: 'União harmoniosa e reciprocidade emocional. O Dois de Copas fala de ligação autêntica, amizade profunda ou reconciliação.',
    espadas: 'Escolha difícil mas necessária. O Dois de Espadas pede que enfrentes a indecisão com honestidade — a clareza liberta.',
    ouros: 'Equilíbrio entre dar e receber no plano material. O Dois de Ouros ensina flexibilidade e gestão inteligente dos recursos.',
  },
  '03': {
    paus: 'Expansão e colaboração frutífera. O Três de Paus anuncia progresso visível, oportunidades além-fronteiras e visão estratégica.',
    copas: 'Celebração, amizade e alegria partilhada. O Três de Copas traz encontros felizes, comunidade e gratidão pelo que já tens.',
    espadas: 'Cura através da verdade. O Três de Espadas liberta dor antiga — o reconhecimento da ferida é o primeiro passo para a cura.',
    ouros: 'Reconhecimento pelo trabalho bem feito. O Três de Ouros valoriza mestria, colaboração profissional e qualidade duradoura.',
  },
  '04': {
    paus: 'Celebração estável e fundações sólidas. O Quatro de Paus marca marcos, lar, compromisso e alegria com raízes.',
    copas: 'Contemplação e reavaliação emocional. O Quatro de Copas convida à introspeção — nem toda oferta exterior alimenta a alma.',
    espadas: 'Recolhimento estratégico. O Quatro de Espadas pede descanso mental, pausa e recuperação antes da próxima batalha.',
    ouros: 'Segurança material e conservação sábia. O Quatro de Ouros protege o que construíste sem fechar o coração ao futuro.',
  },
  '05': {
    paus: 'Competição saudável e desafio que fortalece. O Cinco de Paus testa a tua resiliência — o conflito pode ser motor de crescimento.',
    copas: 'Luto emocional ou nostalgia. O Cinco de Copas pede que honres a perda mas não ignores as copas ainda cheias à tua frente.',
    espadas: 'Derrota temporária ou conflito amargo. O Cinco de Espadas alerta para vitórias vazias — escolhe a paz em vez da razão a todo o custo.',
    ouros: 'Dificuldade financeira ou isolamento material. O Cinco de Ouros lembra que pedir ajuda é coragem, não fraqueza.',
  },
  '06': {
    paus: 'Vitória reconhecida e progresso merecido. O Seis de Paus traz liderança natural, sucesso público e confiança renovada.',
    copas: 'Memórias doces e reconciliação. O Seis de Copas evoca inocência, cura do passado e gestos simples que tocam o coração.',
    espadas: 'Transição para calmaria. O Seis de Espadas indica viagem — literal ou interior — para longe da turbulência.',
    ouros: 'Generosidade e partilha equilibrada. O Seis de Ouros fala de dar e receber com justiça, caridade e reciprocidade.',
  },
  '07': {
    paus: 'Defesa da tua posição com convicção. O Sete de Paus pede perseverança — estás mais perto da vitória do que imaginas.',
    copas: 'Múltiplas opções emocionais ou sonhos sedutores. O Sete de Copas convida à discriminação — nem toda fantasia é destino.',
    espadas: 'Estratégia e astúcia mental. O Sete de Espadas alerta para dissimulação — a tua ou dos outros — e pede vigilância.',
    ouros: 'Paciência com resultados lentos. O Sete de Ouros ensina que o investimento de hoje colhe frutos amanhã — não abandones cedo.',
  },
  '08': {
    paus: 'Movimento rápido e notícias chegando. O Oito de Paus acelera projetos, comunicações e mudanças súbitas mas favoráveis.',
    copas: 'Busca emocional mais profunda. O Oito de Copas pede coragem para deixar o que já não satisfaz a alma.',
    espadas: 'Restrição mental ou prisão autoimposta. O Oito de Espadas mostra que as correntes são mais soltas do que parecem.',
    ouros: 'Dedicação ao ofício e aprendizagem. O Oito de Ouros valoriza prática, disciplina e excelência construída tijolo a tijolo.',
  },
  '09': {
    paus: 'Resistência e preparação final. O Nove de Paus guarda forças para o último esforço — a perseverança vence.',
    copas: 'Satisfação emocional plena. O Nove de Copas é o desejo realizado no plano do coração — gratidão e contentamento.',
    espadas: 'Ansiedade noturna e preocupação mental. O Nove de Espadas pede que confrontes os medos — a maioria é ilusão.',
    ouros: 'Autossuficiência e conforto material. O Nove de Ouros celebra independência, refinamento e frutos do teu trabalho.',
  },
  '10': {
    paus: 'Carga pesada mas temporária. O Dez de Paus alerta para excesso de responsabilidades — delega antes de te esgotares.',
    copas: 'Plenitude familiar e felicidade emocional. O Dez de Copas é harmonia no lar, amor duradouro e ciclo emocional completo.',
    espadas: 'Fim doloroso mas libertador. O Dez de Espadas marca o fundo do poço — só a partir daqui se sobe, renascido/a.',
    ouros: 'Legado material e estabilidade geracional. O Dez de Ouros fala de riqueza partilhada, tradição e segurança a longo prazo.',
  },
  valete: {
    paus: 'Entusiasmo juvenil e mensagem de oportunidade. O Valete de Paus traz notícias excitantes, criatividade e espírito aventureiro.',
    copas: 'Sensibilidade artística e convite emocional. O Valete de Copas é mensageiro de amor, intuição e gestos ternos.',
    espadas: 'Mente curiosa e vigilante. O Valete de Espadas observa, aprende e traz verdades que outros preferem ignorar.',
    ouros: 'Estudante dedicado e oportunidade prática. O Valete de Ouros anuncia aprendizagem, trabalho novo ou investimento sensato.',
  },
  cavaleiro: {
    paus: 'Ação impulsiva e energia ardente. O Cavaleiro de Paus avança com paixão — canaliza o fogo sem queimar pontes.',
    copas: 'Romance, charme e proposta emocional. O Cavaleiro de Copas segue o coração com idealismo e gestos poéticos.',
    espadas: 'Mente afiada e confronto directo. O Cavaleiro de Espadas corta a confusão — a verdade chega depressa.',
    ouros: 'Trabalho metódico e progresso constante. O Cavaleiro de Ouros constrói com paciência, fiabilidade e sentido prático.',
  },
  rainha: {
    paus: 'Liderança magnética e confiança radiante. A Rainha de Paus inspira outros com carisma, coragem e autenticidade.',
    copas: 'Empatia profunda e inteligência emocional. A Rainha de Copas acolhe, cura e compreende sem julgar.',
    espadas: 'Clareza intelectual e honestidade directa. A Rainha de Espadas vê através das ilusões com precisão compassiva.',
    ouros: 'Abundância prática e cuidado sensorial. A Rainha de Ouros nutre corpo, lar e finanças com sabedoria terrena.',
  },
  rei: {
    paus: 'Visão empreendedora e autoridade natural. O Rei de Paus lidera com paixão, integridade e capacidade de manifestar.',
    copas: 'Maturidade emocional e diplomacia. O Rei de Copas governa com compaixão, equilíbrio e sabedoria do coração.',
    espadas: 'Intelecto estratégico e justiça mental. O Rei de Espadas decide com lógica, ética e coragem para a verdade.',
    ouros: 'Prosperidade estável e mestria material. O Rei de Ouros construiu império com trabalho, disciplina e visão a longo prazo.',
  },
}

const SOMBRA = {
  as: {
    paus: 'Impulso disperso ou projecto iniciado sem fundação. Energia desperdiçada em entusiasmo sem direcção.',
    copas: 'Emoções reprimidas ou idealização romântica. O coração abre-se a quem não merece a tua vulnerabilidade.',
    espadas: 'Verdade usada como arma. Palavras cortantes que ferem em vez de clarificar.',
    ouros: 'Ganância ou oportunismo material. Foco exclusivo no lucro à custa de valores mais profundos.',
  },
  '02': {
    paus: 'Medo de sair da zona de conforto. Planos ambiciosos adiados por insegurança ou falta de parceria.',
    copas: 'Desequilíbrio na relação ou dependência emocional. Amor que pede mais do que devolve.',
    espadas: 'Indecisão paralisante ou negação da verdade. Evitar a escolha é também uma escolha — e a pior.',
    ouros: 'Desequilíbrio financeiro ou multitasking excessivo. Perder o foco por tentar controlar tudo ao mesmo tempo.',
  },
  '03': {
    paus: 'Atrasos e frustração com resultados. Impaciência que sabota o progresso já iniciado.',
    copas: 'Excesso de festa ou superficialidade social. Alegria que esconde vazio interior.',
    espadas: 'Ruminação da dor passada. Reabrir feridas sem intenção de curar.',
    ouros: 'Perfeccionismo que bloqueia a colaboração. Recusar ajuda por orgulho profissional.',
  },
  '04': {
    paus: 'Instabilidade no lar ou celebração prematura. Fundações frágeis por falta de compromisso real.',
    copas: 'Apatia emocional ou ingratidão. Rejeitar oportunidades por cansaço espiritual.',
    espadas: 'Isolamento forçado ou exaustão mental. Recusar descanso até ao colapso.',
    ouros: 'Apego excessivo ao dinheiro ou medo de perder. Segurança que se torna prisão.',
  },
  '05': {
    paus: 'Conflito desnecessário ou ego em competição. Energia gasta em batalhas que não importam.',
    copas: 'Vitimização ou foco exclusivo na perda. Ignorar o que ainda é possível recuperar.',
    espadas: 'Vitória pírrica ou traição. Ganhar a discussão mas perder a relação.',
    ouros: 'Pobreza material ou espiritual. Sentir-se excluído/a sem pedir apoio.',
  },
  '06': {
    paus: 'Arrogância após sucesso ou expectativas irrealistas. A fama passageira obscurece a humildade.',
    copas: 'Viver no passado ou idealizar a infância. Nostalgia que impede o presente.',
    espadas: 'Fuga sem resolver a raiz. Levar problemas para o próximo porto.',
    ouros: 'Dívida ou dependência de favores. Dar com expectativa oculta de retorno.',
  },
  '07': {
    paus: 'Desânimo ou sentir-se sobrecarregado/a. Defender posição perdida em vez de adaptar estratégia.',
    copas: 'Ilusões românticas ou escapismo. Confundir fantasia com destino emocional.',
    espadas: 'Engano, roubo de ideias ou autoengano. Estratégias que comprometem a integridade.',
    ouros: 'Falta de visão a longo prazo ou trabalho sem frutos visíveis. Impaciência com processos lentos.',
  },
  '08': {
    paus: 'Pressa excessiva ou comunicação caótica. Agir sem planear gera retrabalho e stress.',
    copas: 'Abandono emocional sem fechar ciclos. Fugir em vez de comunicar o que sentes.',
    espadas: 'Paralisia por medo ou vitimização mental. Acreditar que não há saída quando há.',
    ouros: 'Workaholic ou perfeccionismo obsessivo. Trabalhar sem prazer nem propósito.',
  },
  '09': {
    paus: 'Exaustão ou paranóia defensiva. Ver ameaças onde há apenas desafios normais.',
    copas: 'Complacência ou indulgência excessiva. Satisfação superficial que evita crescimento.',
    espadas: 'Pesadelos, culpa ou ansiedade crónica. Mente que não descansa nem perdoa.',
    ouros: 'Isolamento por snobismo material ou medo de perder status.',
  },
  '10': {
    paus: 'Burnout ou assumir tudo sozinho/a. O peso que te esmaga é em parte autoimposto.',
    copas: 'Expectativas familiares irreais ou harmonia fachada. Felicidade performada em vez de vivida.',
    espadas: 'Traição, colapso ou drama extremo. Chegar ao limite sem pedir ajuda a tempo.',
    ouros: 'Conflitos familiares por dinheiro ou perda de legado. Riqueza sem conexão humana.',
  },
  valete: {
    paus: 'Imaturidade ou promessas vazias. Entusiasmo sem seguimento concreto.',
    copas: 'Emocionalidade instável ou crush superficial. Mensagens ambíguas no amor.',
    espadas: 'Espionagem, gossip ou mentiras pequenas. Curiosidade que ultrapassa limites.',
    ouros: 'Preguiça ou falta de experiência. Oportunidade desperdiçada por desleixo.',
  },
  cavaleiro: {
    paus: 'Impulsividade destrutiva ou arrogância. Correr sem olhar para o caminho.',
    copas: 'Idealismo romântico ou mudança de humor. Promessas emocionais sem consistência.',
    espadas: 'Agressividade verbal ou impaciência mental. Atacar em vez de dialogar.',
    ouros: 'Teimosia ou rotina excessiva. Resistir à mudança necessária por conforto.',
  },
  rainha: {
    paus: 'Dominância ou ciúmes. Liderança que sufoca em vez de inspirar.',
    copas: 'Codependência ou manipulação emocional. Absorver dores alheias até ao esgotamento.',
    espadas: 'Frieza ou julgamento cruel. Verdade sem compaixão fere profundamente.',
    ouros: 'Materialismo ou possessividade. Segurança à custa da espontaneidade.',
  },
  rei: {
    paus: 'Tirania ou impaciência com subordinados. Poder sem empatia destrói equipas.',
    copas: 'Manipulação emocional ou instabilidade mascarada. Calma superficial sobre turbulência interior.',
    espadas: 'Tiranía intelectual ou crueldade justificada. Razão usada para humilhar.',
    ouros: 'Ganância ou rigidez financeira. Prosperidade sem generosidade é vazio.',
  },
}

const CONSELHO = {
  as: {
    paus: 'Acende a chama com uma acção concreta hoje — o Universo responde a quem começa.',
    copas: 'Abre o coração com honestidade. A vulnerabilidade é portal, não fraqueza.',
    espadas: 'Nomeia a verdade com coragem. A clareza mental é o teu maior aliado agora.',
    ouros: 'Investe em algo tangível e duradouro. A terra recompensa quem planta com intenção.',
  },
  '02': {
    paus: 'Expande horizontes com um plano realista. A visão precisa de parceiros e de passos.',
    copas: 'Cultiva reciprocidade. Relações verdadeiras são espelhos — olha com amor.',
    espadas: 'Remove a venda dos olhos. A decisão adiada custa mais do que a escolha difícil.',
    ouros: 'Equilibra contas e prioridades. Flexibilidade inteligente vence rigidez.',
  },
  '03': {
    paus: 'Colabora e partilha a visão. O sucesso cresce quando deixas outros contribuírem.',
    copas: 'Celebra com quem te apoia. A alegria multiplicada cura solidões antigas.',
    espadas: 'Permite que a dor se exprima. Chorar é água que lava feridas fechadas à força.',
    ouros: 'Valoriza o teu ofício. A excelência silenciosa constrói reputação sólida.',
  },
  '04': {
    paus: 'Consolida antes de expandir. Fundações fortes sustentam celebrações duradouras.',
    copas: 'Escuta o que a alma pede, não só o que o mundo oferece. Recusa com gratidão quando necessário.',
    espadas: 'Descansa sem culpa. A mente clara nasce do corpo descansado.',
    ouros: 'Protege sem apegar. Segurança verdadeira inclui generosidade.',
  },
  '05': {
    paus: 'Escolhe as tuas batalhas. Nem todo conflito merece a tua energia vital.',
    copas: 'Honra a perda mas volta-te para as bênçãos restantes. Gratidão cura.',
    espadas: 'Prefere a paz à razão vazia. Vencer sozinho/a é perder juntos.',
    ouros: 'Pede ajuda sem vergonha. A comunidade existe para sustentar-te.',
  },
  '06': {
    paus: 'Recebe o reconhecimento com humildade e partilha o crédito.',
    copas: 'Curande o passado com ternura — a criança interior merece ser abraçada.',
    espadas: 'Muda de ambiente se necessário. Às vezes a cura exige distância física.',
    ouros: 'Dá e recebe com equidade. A abundância circula quando flui.',
  },
  '07': {
    paus: 'Mantém a posição com fé — o último esforço decide o resultado.',
    copas: 'Discerne entre sonho e desejo real. Escolhe o que nutre, não o que seduz.',
    espadas: 'Vigia sem paranoia. Integridade é escudo contra enganos.',
    ouros: 'Confia no processo. Colheitas maduras exigem tempo e cuidado.',
  },
  '08': {
    paus: 'Canaliza a velocidade com foco. Menos dispersão, mais impacto.',
    copas: 'Tem coragem de partir do que já não serve. O próximo capítulo espera.',
    espadas: 'Questiona as crenças limitantes. A prisão é mental — a chave está contigo.',
    ouros: 'Aperfeiçoa com prática diária. O mestre é o principiante que nunca desistiu.',
  },
  '09': {
    paus: 'Reserva forças para o sprint final. Perseverança vence talento sem disciplina.',
    copas: 'Agradece o que já tens antes de pedir mais. Contentamento atrai abundância.',
    espadas: 'Confronta medos com luz. A maioria dos monstros dissolve-se quando nomeados.',
    ouros: 'Desfruta dos frutos do teu trabalho com presença e elegância.',
  },
  '10': {
    paus: 'Delega e alivia o fardo. Ninguém carrega o mundo sozinho/a.',
    copas: 'Constrói harmonia real, não aparência. A família verdadeira inclui honestidade.',
    espadas: 'Aceita o fim como portal. Do fundo só se pode subir.',
    ouros: 'Pensa em legado e continuidade. O que constróis hoje alimenta gerações.',
  },
  valete: {
    paus: 'Recebe a mensagem com abertura e age com entusiasmo responsável.',
    copas: 'Expressa sentimentos com delicadeza. Pequenos gestos movem montanhas.',
    espadas: 'Observa antes de falar. A verdade bem dita a tempo certo transforma.',
    ouros: 'Aprende com humildade. Cada mestre foi um dia principiante.',
  },
  cavaleiro: {
    paus: 'Avança com paixão mas olha o caminho. Velocidade sem direcção é acidente.',
    copas: 'Segue o coração com os pés na terra. Romance precisa de raízes.',
    espadas: 'Fala a verdade com timing e compaixão. A espada corta ou liberta.',
    ouros: 'Persiste com método. A constância vence o talento ocasional.',
  },
  rainha: {
    paus: 'Lidera pelo exemplo. O teu fogo inspira sem precisar de dominar.',
    copas: 'Acolhe sem absorver. Empatia com limites é sabedoria emocional.',
    espadas: 'Usa a clareza para curar, não para ferir. A verdade pode ser ternura.',
    ouros: 'Nutre corpo e lar com presença. A abundância começa no cuidado.',
  },
  rei: {
    paus: 'Governa com visão e integridade. O poder verdadeiro serve o colectivo.',
    copas: 'Equilibra emoção e razão no comando. Liderar é também sentir.',
    espadas: 'Decide com ética e coragem. A justiça começa na tua mente.',
    ouros: 'Constrói impérios com paciência. A riqueza duradoura tem alma.',
  },
}

const PALAVRAS = {
  as: { paus: ['início', 'inspiração', 'impulso'], copas: ['amor', 'intuição', 'abertura'], espadas: ['clareza', 'verdade', 'decisão'], ouros: ['oportunidade', 'prosperidade', 'manifestação'] },
  '02': { paus: ['parceria', 'visão', 'planeamento'], copas: ['união', 'reciprocidade', 'harmonia'], espadas: ['escolha', 'equilíbrio', 'decisão'], ouros: ['flexibilidade', 'equilíbrio', 'gestão'] },
  '03': { paus: ['expansão', 'colaboração', 'progresso'], copas: ['celebração', 'amizade', 'alegria'], espadas: ['cura', 'libertação', 'verdade'], ouros: ['mestria', 'reconhecimento', 'qualidade'] },
  '04': { paus: ['estabilidade', 'lar', 'celebração'], copas: ['contemplação', 'introspecção', 'silêncio'], espadas: ['descanso', 'recuperação', 'pausa'], ouros: ['segurança', 'conservação', 'proteção'] },
  '05': { paus: ['desafio', 'competição', 'teste'], copas: ['perda', 'luto', 'nostalgia'], espadas: ['conflito', 'derrota', 'tensão'], ouros: ['dificuldade', 'isolamento', 'escassez'] },
  '06': { paus: ['vitória', 'reconhecimento', 'liderança'], copas: ['memória', 'reconciliação', 'ternura'], espadas: ['transição', 'viagem', 'calmaria'], ouros: ['generosidade', 'partilha', 'justiça'] },
  '07': { paus: ['perseverança', 'defesa', 'coragem'], copas: ['ilusão', 'escolha', 'sonho'], espadas: ['estratégia', 'vigilância', 'astúcia'], ouros: ['paciência', 'investimento', 'persistência'] },
  '08': { paus: ['velocidade', 'movimento', 'notícias'], copas: ['partida', 'busca', 'profundidade'], espadas: ['restrição', 'medo', 'libertação'], ouros: ['dedicação', 'ofício', 'aprendizagem'] },
  '09': { paus: ['resistência', 'preparação', 'força'], copas: ['satisfação', 'desejo', 'plenitude'], espadas: ['ansiedade', 'pesadelo', 'culpa'], ouros: ['independência', 'conforto', 'refinamento'] },
  '10': { paus: ['carga', 'responsabilidade', 'limite'], copas: ['família', 'harmonia', 'plenitude'], espadas: ['fim', 'colapso', 'renascimento'], ouros: ['legado', 'riqueza', 'tradição'] },
  valete: { paus: ['entusiasmo', 'mensagem', 'aventura'], copas: ['sensibilidade', 'convite', 'ternura'], espadas: ['curiosidade', 'vigilância', 'verdade'], ouros: ['aprendizagem', 'oportunidade', 'prática'] },
  cavaleiro: { paus: ['ação', 'paixão', 'impulso'], copas: ['romance', 'idealismo', 'emoção'], espadas: ['confronto', 'verdade', 'velocidade'], ouros: ['trabalho', 'persistência', 'fiabilidade'] },
  rainha: { paus: ['liderança', 'carisma', 'confiança'], copas: ['empatia', 'cura', 'intuição'], espadas: ['clareza', 'honestidade', 'discernimento'], ouros: ['abundância', 'cuidado', 'praticidade'] },
  rei: { paus: ['visão', 'autoridade', 'empreendedorismo'], copas: ['maturidade', 'compaixão', 'diplomacia'], espadas: ['estratégia', 'justiça', 'intelecto'], ouros: ['prosperidade', 'disciplina', 'legado'] },
}

function buildMinors() {
  const cards = []
  let id = 22
  for (const naipe of NAIPES) {
    for (const rank of RANKS) {
      const slug = `${String(id).padStart(2, '0')}-${naipe.key}-${rank.key}`
      const nome = rank.court
        ? `${rank.nome} de ${naipe.nome}`
        : rank.key === 'as'
          ? `Ás de ${naipe.nome}`
          : `${rank.nome} de ${naipe.nome}`
      cards.push({
        id,
        tipo: 'minor',
        slug,
        naipe: naipe.key,
        rank: rank.key,
        nome,
        simb: naipe.simb,
        cor: naipe.cor,
        elemento: naipe.elemento,
        palavras: PALAVRAS[rank.key]?.[naipe.key] || [naipe.tema.split(',')[0].trim()],
        luz: LUZ[rank.key][naipe.key],
        sombra: SOMBRA[rank.key][naipe.key],
        conselho: CONSELHO[rank.key][naipe.key],
      })
      id += 1
    }
  }
  return cards
}

export const MINOR_ARCANA = buildMinors()
export { NAIPES, RANKS }
