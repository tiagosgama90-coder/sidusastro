/**
 * Léxico A–Z de símbolos oníricos - base hermenêutica para pesquisa por palavras-chave.
 * Cada entrada alimenta a IA com contexto específico; a resposta final é sempre sintetizada por sonho.
 */

export const LEXICON = [
  { letra: 'A', tema: 'Abismo / Precipício', keys: ['abismo', 'precipício', 'precipicio', 'penhasco', 'despenhar'], resumo: 'Confronto com o vazio interior ou medo de perder controlo; convite à humildade e ao chão da realidade.' },
  { letra: 'A', tema: 'Água / Mar / Rio', keys: ['água', 'agua', 'mar', 'rio', 'oceano', 'lago', 'fonte', 'poça', 'poca', 'chuva', 'inundação', 'inundacao', 'ondas'], resumo: 'Vida emocional e inconsciente; calma = purificação; tempestade = caos psíquico ou pressão externa.' },
  { letra: 'A', tema: 'Avião / Viagem aérea', keys: ['avião', 'aviao', 'aeroporto', 'aterrizar', 'ateragem'], resumo: 'Transição de vida ou desejo de elevação; aterragem forçada = retorno às responsabilidades terrenas.' },
  { letra: 'A', tema: 'Amor / Beijo', keys: ['beijo', 'beijar', 'namorado', 'namorada', 'ex-namorado', 'paixão', 'paixao'], resumo: 'Integração de aspectos afetivos; distância ou rejeição = partes do eu a acolher.' },
  { letra: 'A', tema: 'Aranha', keys: ['aranha', 'teia'], resumo: 'Situação emocional enredada ou criatividade paciente; medo = sensação de estar preso.' },
  { letra: 'A', tema: 'Arma / Violência', keys: ['arma', 'pistola', 'faca', 'espada', 'tiro', 'disparo', 'sangue'], resumo: 'Agressividade reprimida ou ferida não expressa; pede canalização consciente, não negação.' },
  { letra: 'A', tema: 'Ascensão / Escada', keys: ['escada', 'subir escada', 'degrau', 'ascender'], resumo: 'Evolução interior ou esforço disciplinado; escada quebrada = cansaço no caminho espiritual.' },
  { letra: 'A', tema: 'Automóvel / Carro', keys: ['carro', 'automóvel', 'automovel', 'conduzir', 'condutor', 'acidente de carro', 'estacionar'], resumo: 'Grau de autonomia na vida; perder controlo do volante = sensação de impotência face ao destino.' },
  { letra: 'A', tema: 'Avó / Avô', keys: ['avó', 'avo', 'avô', 'ancestral', 'bisavó', 'bisavo'], resumo: 'Raízes familiares e sabedoria herdada; mensagem do inconsciente colectivo familiar.' },
  { letra: 'B', tema: 'Bebé / Recém-nascido', keys: ['bebé', 'bebe', 'recém-nascido', 'recem-nascido', 'berço', 'berco'], resumo: 'Potencial novo na alma; vulnerabilidade sagrada que pede protecção interior.' },
  { letra: 'B', tema: 'Barco / Navio', keys: ['barco', 'navio', 'bote', 'naufrágio', 'naufragio', 'porto'], resumo: 'Travessia emocional ou espiritual; naufrágio = medo de ser submergido pelas emoções.' },
  { letra: 'B', tema: 'Biblioteca / Livro', keys: ['livro', 'biblioteca', 'ler', 'leitura', 'página', 'pagina'], resumo: 'Busca de sentido e revelação interior; livro fechado = sabedoria ainda não acedida.' },
  { letra: 'B', tema: 'Brigar / Conflito', keys: ['briga', 'brigar', 'discussão', 'discussao', 'gritar', 'insulto'], resumo: 'Conflito interior projectado; pede reconciliação de partes opostas da personalidade.' },
  { letra: 'B', tema: 'Buraco / Poço', keys: ['buraco', 'poço', 'poco', 'cova'], resumo: 'Descida ao inconsciente; medo do poço = resistência a olhar para a sombra.' },
  { letra: 'C', tema: 'Casa / Lar', keys: ['casa', 'lar', 'moradia', 'apartamento', 'quinta'], resumo: 'Estrutura da alma; estado da casa reflecte ordem ou caos interior.' },
  { letra: 'C', tema: 'Cão', keys: ['cão', 'cao', 'cadela'], resumo: 'Lealdade, instinto protector ou companheirismo; cão agressivo = instinto mal integrado.' },
  { letra: 'C', tema: 'Criança', keys: ['criança', 'crianca', 'menino', 'menina', 'filho', 'filha', 'miúdo', 'miudo'], resumo: 'Pureza e potencial; criança ferida = ferida de infância a curar com compaixão.' },
  { letra: 'C', tema: 'Cave / Porão', keys: ['cave', 'porão', 'porao', 'subsolo'], resumo: 'Sombra e memórias reprimidas; descer à cave = coragem de enfrentar o passado.' },
  { letra: 'C', tema: 'Cemitério', keys: ['cemitério', 'cemiterio', 'campo santo'], resumo: 'Processo de luto ou deixar ir; não previsão de morte física.' },
  { letra: 'C', tema: 'Correr / Fugir', keys: ['correr', 'fugir', 'fuga', 'escapar', 'perseguição', 'perseguicao'], resumo: 'Evitar confronto interior; o que persegue é parte rejeitada do eu.' },
  { letra: 'C', tema: 'Coroa / Realeza', keys: ['coroa', 'rei', 'rainha', 'príncipe', 'principe', 'princesa'], resumo: 'Autoridade interior ou orgulho espiritual; coroa pesada = fardo de expectativas.' },
  { letra: 'C', tema: 'Comida / Festa', keys: ['comer', 'comida', 'festa', 'banquete', 'fome', 'saciar'], resumo: 'Nutrição espiritual ou emocional; fome = carência a reconhecer.' },
  { letra: 'D', tema: 'Dente / Perder dentes', keys: ['dente', 'dentes', 'perder dentes'], resumo: 'Ansiedade sobre imagem ou perda de poder de expressão; pede honestidade na comunicação.' },
  { letra: 'D', tema: 'Deserto', keys: ['deserto', 'areia', 'seca', 'sedento'], resumo: 'Noite escura da alma; tempo de silêncio antes do renovamento.' },
  { letra: 'D', tema: 'Dinheiro / Ouro', keys: ['dinheiro', 'ouro', 'moeda', 'nota', 'banco', 'pagar', 'dívida', 'divida'], resumo: 'Valor interior e autoestima; perder dinheiro = medo de não ser suficiente.' },
  { letra: 'D', tema: 'Doença / Hospital', keys: ['doente', 'doença', 'doenca', 'hospital', 'médico', 'medico', 'cirurgia'], resumo: 'Parte da psique a curar; hospital = espaço de cuidado e transformação.' },
  { letra: 'E', tema: 'Elevador', keys: ['elevador', 'ascensor'], resumo: 'Mudança rápida de nível de consciência; avariado = bloqueio na evolução.' },
  { letra: 'E', tema: 'Escola / Exame', keys: ['escola', 'exame', 'professor', 'sala de aula', 'teste'], resumo: 'Aprendizagem de lições de vida; reprovar = auto-julgamento severo.' },
  { letra: 'E', tema: 'Escuridão / Noite', keys: ['escuridão', 'escuridao', 'noite', 'trevas', 'escuro'], resumo: 'Deserto espiritual necessário; convite ao silêncio e paciência.' },
  { letra: 'E', tema: 'Esqueleto / Caveira', keys: ['esqueleto', 'caveira', 'ossos'], resumo: 'Confronto com a finitude e essência despojada; libertação do superficial.' },
  { letra: 'E', tema: 'Estrada / Caminho', keys: ['estrada', 'caminho', 'vereda', 'cruzamento', 'encruzilhada', 'perdido'], resumo: 'Direcção de vida; encruzilhada = decisão interior pendente.' },
  { letra: 'F', tema: 'Fogo / Incêndio', keys: ['fogo', 'chama', 'incêndio', 'incendio', 'queimar', 'brasas'], resumo: 'Paixão e purificação; descontrolado = emoções ou conflitos consumindo energia.' },
  { letra: 'F', tema: 'Floresta / Árvore', keys: ['floresta', 'mata', 'árvore', 'arvore', 'madeira', 'folha'], resumo: 'Crescimento lento e enraizamento; floresta densa = labirinto interior a explorar.' },
  { letra: 'F', tema: 'Funeral / Enterro', keys: ['funeral', 'enterro', 'caixão', 'caixao', 'velório', 'velorio'], resumo: 'Transição e desapego simbólico; deixar morrer o velho eu.' },
  { letra: 'F', tema: 'Ferida / Sangue', keys: ['ferida', 'sangrar', 'sangue', 'corte'], resumo: 'Dor emocional exposta; sangue = vida a escapar por ferida não tratada.' },
  { letra: 'G', tema: 'Grávida / Gravidez', keys: ['grávida', 'gravida', 'gravidade'], resumo: 'Algo novo gestando-se na alma; criativo ou espiritual a nascer.' },
  { letra: 'G', tema: 'Gato', keys: ['gato', 'gata'], resumo: 'Independência e intuição; gato selvagem = mistério ou feminino autónomo.' },
  { letra: 'H', tema: 'Hospital / Curar', keys: ['curar', 'enfermeira', 'enfermeiro'], resumo: 'Processo de cura interior activo; acolher o cuidado.' },
  { letra: 'I', tema: 'Igreja / Templo', keys: ['igreja', 'templo', 'capela', 'altar', 'missa'], resumo: 'Dimensão espiritual da alma; igreja vazia = distância temporária do sagrado.' },
  { letra: 'J', tema: 'Jardim / Flores', keys: ['jardim', 'flor', 'flores', 'rosa', 'lírio', 'lirio'], resumo: 'Alma cultivada; flores = virtudes ou dons a florescer.' },
  { letra: 'J', tema: 'Joia / Anel', keys: ['joia', 'anel', 'colar', 'brilhante', 'diamante'], resumo: 'Valor interior precioso; perder joia = medo de perder identidade.' },
  { letra: 'L', tema: 'Lobo', keys: ['lobo'], resumo: 'Instinto selvagem ou solidão; integrar a fera com compaixão.' },
  { letra: 'L', tema: 'Luz / Claridade', keys: ['luz', 'claro', 'raio de sol', 'amanhecer', 'aurora'], resumo: 'Revelação iminente; nova consciência após noite escura.' },
  { letra: 'L', tema: 'Labirinto', keys: ['labirinto'], resumo: 'Confusão existencial; saída encontrada = insight interior.' },
  { letra: 'M', tema: 'Morte / Morrer', keys: ['morte', 'morrer', 'morri', 'cadáver', 'cadaver', 'assassinar'], resumo: 'Fim simbólico de fase; renascimento interior, nunca previsão literal.' },
  { letra: 'M', tema: 'Mãe / Pai', keys: ['mãe', 'mae', 'pai', 'mama', 'papa'], resumo: 'Arquétipos de origem; relação no sonho espelha padrões de acolhimento interior.' },
  { letra: 'M', tema: 'Montanha', keys: ['montanha', 'monte', 'cume'], resumo: 'Desafio espiritual ou meta elevada; cume = visão alargada após esforço.' },
  { letra: 'M', tema: 'Afogar / Mergulhar', keys: ['afogar', 'afogamento', 'submergir', 'mergulhar'], resumo: 'Sobrecarga emocional; medo de ser invadido pelos sentimentos.' },
  { letra: 'M', tema: 'Muro / Parede', keys: ['muro', 'parede', 'barreira'], resumo: 'Defesas psíquicas; muro alto = isolamento ou protecção excessiva.' },
  { letra: 'N', tema: 'Nu / Nudez', keys: ['nu', 'nua', 'nudez', 'desnudo'], resumo: 'Vulnerabilidade exposta; vergonha = medo de ser visto tal como és.' },
  { letra: 'N', tema: 'Neve / Gelo', keys: ['neve', 'gelo', 'frio', 'congelar'], resumo: 'Emoções reprimidas ou pausa necessária; derretimento = descongelamento afectivo.' },
  { letra: 'O', tema: 'Tesouro / Baú', keys: ['tesouro', 'baú', 'bau', 'cofre'], resumo: 'Dons interiores a descobrir; busca = jornada de autoconhecimento.' },
  { letra: 'P', tema: 'Porta / Janela', keys: ['porta', 'janela', 'portão', 'portao', 'trancar', 'abrir porta'], resumo: 'Transição ou oportunidade; porta trancada = área da vida bloqueada.' },
  { letra: 'P', tema: 'Ponte', keys: ['ponte', 'atravessar ponte'], resumo: 'Passagem entre fases; ponte instável = medo na transição.' },
  { letra: 'P', tema: 'Pássaro / Voar', keys: ['pássaro', 'passaro', 'águia', 'aguia', 'pomba', 'voar', 'voando', 'asas'], resumo: 'Espírito e liberdade; queda do voo = idealismo sem aterragem na realidade.' },
  { letra: 'P', tema: 'Prisão / Cadeia', keys: ['prisão', 'prisao', 'cadeia', 'preso', 'cela'], resumo: 'Auto-limitação ou culpa; chave perdida = crença de impossibilidade de libertação.' },
  { letra: 'Q', tema: 'Queda', keys: ['queda', 'cair', 'cai', 'caeu', 'tropeçar', 'tropecar', 'vertigem'], resumo: 'Humildade forçada; orgulho ou perfeccionismo a ser corrigido pelo inconsciente.' },
  { letra: 'R', tema: 'Rato / Insecto', keys: ['rato', 'ratazana', 'insecto', 'inseto', 'barata', 'formiga'], resumo: 'Pequenas preocupações ou vergonha escondida; pede limpeza interior.' },
  { letra: 'R', tema: 'Relógio / Tempo', keys: ['relógio', 'relogio', 'atrasado', 'tarde', 'hora'], resumo: 'Pressão temporal ou consciência de finitude; atraso = resistência ao momento presente.' },
  { letra: 'R', tema: 'Roupa / Vestir', keys: ['roupa', 'vestir', 'fato', 'vestido'], resumo: 'Persona e identidade social; roupa suja = imagem interior a purificar.' },
  { letra: 'S', tema: 'Serpente / Cobra', keys: ['serpente', 'cobra', 'víbora', 'vibora'], resumo: 'Energia vital e sabedoria; ameaça = desejo ou verdade reprimida.' },
  { letra: 'S', tema: 'Sótão', keys: ['sótão', 'sotao'], resumo: 'Ideais elevados ou memórias antigas; espaço superior da psique.' },
  { letra: 'S', tema: 'Sol / Lua / Estrelas', keys: ['sol', 'lua', 'eclipse', 'estrela', 'céu', 'ceu', 'planeta'], resumo: 'Consciência (sol) e inconsciente emocional (lua); eclipse = crise de integração.' },
  { letra: 'S', tema: 'Desconhecido / Estranho', keys: ['desconhecido', 'desconhecida', 'estranho', 'estranha', 'figura sombria'], resumo: 'Aspecto do eu ainda não reconhecido; o estranho és tu.' },
  { letra: 'T', tema: 'Comboio / Estação', keys: ['comboio', 'trem', 'estação', 'estacao'], resumo: 'Ritmo colectivo ou destino partilhado; perder comboio = oportunidade sentida como perdida.' },
  { letra: 'T', tema: 'Trovão / Tempestade', keys: ['trovão', 'trovao', 'tempestade', 'relâmpago', 'relampago', 'vento forte'], resumo: 'Perturbação emocional ou revelação súbita; limpeza após a tempestade.' },
  { letra: 'T', tema: 'Túnel', keys: ['túnel', 'tunel'], resumo: 'Passagem estreita entre fases; luz no fim = esperança no processo.' },
  { letra: 'U', tema: 'WC / Casa de banho', keys: ['urinar', 'wc', 'casa de banho', 'toilete', 'banheiro'], resumo: 'Libertação do que já não serve; vergonha = dificuldade em soltar.' },
  { letra: 'V', tema: 'Vampiro / Monstro', keys: ['vampiro', 'monstro', 'demónio', 'demonio', 'fantasma'], resumo: 'Medo arquetípico ou energia parasitária; confronto com a sombra.' },
  { letra: 'V', tema: 'Viagem / Mala', keys: ['viagem', 'férias', 'ferias', 'mala', 'passaporte'], resumo: 'Jornada de transformação; bagagem pesada = fardos emocionais transportados.' },
  { letra: 'V', tema: 'Voz / Mudez', keys: ['gritar sem som', 'mudo', 'silenciar', 'voz'], resumo: 'Impossibilidade de expressar verdade; pede coragem para falar.' },
  { letra: 'Z', tema: 'Guerra / Batalha', keys: ['guerra', 'exército', 'exercito', 'soldado', 'batalha', 'bomba'], resumo: 'Conflito interior intenso; pede paz entre facções da alma.' },
  { letra: 'Z', tema: 'Jaula / Zoológico', keys: ['jaula', 'zoológico', 'zoologico', 'capturar animal'], resumo: 'Instintos aprisionados; libertar o animal = integração com amor.' },
]

const FEELING_PT = {
  peace: 'paz / serenidade', fear: 'medo / terror', sadness: 'tristeza / melancolia',
  joy: 'alegria / leveza', confusion: 'confusão / desorientação', anger: 'raiva / irritação',
}

const FEELING_EN = {
  peace: 'peace / serenity', fear: 'fear / terror', sadness: 'sadness / melancholy',
  joy: 'joy / lightness', confusion: 'confusion / disorientation', anger: 'anger / irritation',
}

export function extrairSimbolos(texto, chipsExtra = [], lang = 'pt') {
  const lower = `${texto} ${(chipsExtra || []).join(' ')}`.toLowerCase()
  const normalizado = lower.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const encontrados = []
  const ids = new Set()

  for (const entry of LEXICON) {
    const hit = entry.keys.some((k) => {
      const kn = k.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      return lower.includes(k) || normalizado.includes(kn)
    })
    if (hit && !ids.has(entry.tema)) {
      ids.add(entry.tema)
      encontrados.push({ tema: entry.tema, resumo: entry.resumo, letra: entry.letra })
    }
  }

  for (const chip of chipsExtra || []) {
    const cl = chip.toLowerCase()
    if (!encontrados.some((e) => e.tema.toLowerCase().includes(cl.slice(0, 4)))) {
      encontrados.push({
        tema: chip,
        resumo: lang === 'en'
          ? 'Selected symbol - apply Golden Rule: current conflict, call to change, path of healing.'
          : 'Símbolo seleccionado - aplicar Regra de Ouro: conflito actual, apelo de conversão, remédio de cura.',
        letra: chip[0]?.toUpperCase() || '?',
      })
    }
  }

  return encontrados.sort((a, b) => a.letra.localeCompare(b.letra, lang === 'en' ? 'en' : 'pt'))
}

export function labelSentimento(feelingKey, lang = 'pt') {
  if (!feelingKey) return lang === 'en' ? 'not specified' : 'não indicado'
  const map = lang === 'en' ? FEELING_EN : FEELING_PT
  return map[feelingKey] || feelingKey
}

export const CHIPS_SIMBOLOS_PT = ['Água', 'Casa', 'Morte', 'Voar', 'Queda', 'Animal', 'Escuridão', 'Fogo', 'Perseguição', 'Criança']
export const CHIPS_SIMBOLOS_EN = ['Water', 'House', 'Death', 'Flying', 'Falling', 'Animal', 'Darkness', 'Fire', 'Pursuit', 'Child']
