/** Redução numerológica (mantém 11, 22, 33 como mestres). */
import { contentForLang } from './i18n/langUtil.js'
import { enriquecerMapaNumerologia } from './numerologiaInterpretacao.js'

export function reduzir(n) {
  let v = Math.abs(Math.floor(n))
  while (v > 9 && v !== 11 && v !== 22 && v !== 33) {
    v = String(v).split('').reduce((s, d) => s + Number(d), 0)
  }
  return v
}

/** Passos da redução - ex.: 25 → [25, 7] */
export function passosReducao(n) {
  const passos = []
  let v = Math.abs(Math.floor(n))
  passos.push(v)
  while (v > 9 && v !== 11 && v !== 22 && v !== 33) {
    v = String(v).split('').reduce((s, d) => s + Number(d), 0)
    passos.push(v)
  }
  return passos
}

export function isNumeroMestre(n) {
  return n === 11 || n === 22 || n === 33
}

function somaBruta(n) {
  return Math.abs(Math.floor(n))
}

const TABELA = {
  a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9,j:1,k:2,l:3,m:4,n:5,o:6,p:7,q:8,r:9,
  s:1,t:2,u:3,v:4,w:5,x:6,y:7,z:8,
  á:1,à:1,ã:1,â:1,é:5,ê:5,í:9,ó:6,ô:6,õ:6,ú:3,ç:3,
}

const VOGAIS = new Set('aeiouáàãâéêíóôõúy'.split(''))

function valorLetra(ch) {
  return TABELA[ch.toLowerCase()] ?? 0
}

function somaNome(nome, filtro) {
  const limpo = (nome || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  let total = 0
  const letras = []
  for (const ch of limpo) {
    if (!/[a-zA-ZçÇ]/.test(ch)) continue
    const v = valorLetra(ch)
    if (filtro === 'vogais' && !VOGAIS.has(ch.toLowerCase())) continue
    if (filtro === 'consoantes' && VOGAIS.has(ch.toLowerCase())) continue
    total += v
    letras.push({ letra: ch.toUpperCase(), valor: v })
  }
  return { total, letras, reduzido: reduzir(total) }
}

function analisarNome(nome) {
  const completo = somaNome(nome)
  const vogais = somaNome(nome, 'vogais')
  const consoantes = somaNome(nome, 'consoantes')

  const freq = {}
  for (const l of completo.letras) {
    const r = reduzir(l.valor)
    freq[r] = (freq[r] || 0) + 1
  }
  let numeroDominante = null
  let maxF = 0
  for (const [k, v] of Object.entries(freq)) {
    if (v > maxF) { maxF = v; numeroDominante = Number(k) }
  }

  const presentes = new Set(Object.keys(freq).map(Number))
  const numerosEmFalta = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => !presentes.has(n))

  return {
    destino: completo.reduzido,
    destinoComposto: somaBruta(completo.total),
    alma: vogais.reduzido,
    almaComposto: somaBruta(vogais.total),
    personalidade: consoantes.reduzido,
    personalidadeComposto: somaBruta(consoantes.total),
    vibracaoTotal: somaBruta(completo.total),
    letras: completo.letras,
    numeroDominante: maxF > 1 ? numeroDominante : null,
    numerosEmFalta,
  }
}

function caminhoVida(dataISO) {
  if (!dataISO) return null
  const nums = dataISO.replace(/-/g, '').split('').map(Number)
  return reduzir(nums.reduce((a, b) => a + b, 0))
}

function anoPessoal(dataISO, ano = new Date().getFullYear()) {
  if (!dataISO) return null
  const [, m, d] = dataISO.split('-').map(Number)
  return reduzir(d + m + ano)
}

function mesPessoal(dataISO, anoPessoalNum, ref = new Date()) {
  if (!dataISO || anoPessoalNum == null) return null
  const mesCalendario = ref.getMonth() + 1
  return reduzir(anoPessoalNum + mesCalendario)
}

function buildCalculoLetras(letras, reduzido) {
  if (!letras?.length) return null
  const total = letras.reduce((s, l) => s + l.valor, 0)
  return {
    partes: letras.map((l) => ({ letra: l.letra, valor: l.valor })),
    total,
    passos: passosReducao(total),
    resultado: reduzido,
    mestre: isNumeroMestre(reduzido),
  }
}

function buildCalculoSoma(partes, total, reduzido) {
  return {
    partes,
    total,
    passos: passosReducao(total),
    resultado: reduzido,
    mestre: isNumeroMestre(reduzido),
  }
}

function buildCalculoData(dataISO) {
  if (!dataISO) return null
  const [y, m, d] = dataISO.split('-').map(Number)
  const digitos = `${String(d).padStart(2, '0')}${String(m).padStart(2, '0')}${y}`.split('').map(Number)
  const total = digitos.reduce((a, b) => a + b, 0)
  const reduzido = reduzir(total)
  return {
    dataFormatada: `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`,
    digitos,
    total,
    passos: passosReducao(total),
    resultado: reduzido,
    mestre: isNumeroMestre(reduzido),
  }
}

/** Tabela pitagórica A-Z para referência na UI */
export const GRUPOS_PITAGORICOS = [
  { num: 1, letras: 'A J S' },
  { num: 2, letras: 'B K T' },
  { num: 3, letras: 'C L U' },
  { num: 4, letras: 'D M V' },
  { num: 5, letras: 'E N W' },
  { num: 6, letras: 'F O X' },
  { num: 7, letras: 'G P Y' },
  { num: 8, letras: 'H Q Z' },
  { num: 9, letras: 'I R' },
]

function cicloVida(dataISO) {
  const cv = caminhoVida(dataISO)
  if (!cv) return null
  const primeiro = reduzir(36 - cv)
  const segundo = 27
  const terceiro = reduzir(cv + 36 - 9)
  return { primeiro, segundo, terceiro }
}

const SIGNIFICADOS_PT = {
  1: 'Liderança, independência e iniciativa. O caminho pede coragem para abrir novos ciclos.',
  2: 'Cooperação, sensibilidade e diplomacia. A harmonia nas relações é o motor de crescimento.',
  3: 'Expressão, criatividade e comunicação. A alegria partilhada amplifica o propósito.',
  4: 'Estrutura, disciplina e trabalho consistente. Os alicerces sólidos sustentam o destino.',
  5: 'Liberdade, mudança e adaptação. A vida pede flexibilidade e experiências variadas.',
  6: 'Responsabilidade, família e serviço. Nutrir e cuidar revela a vocação mais autêntica.',
  7: 'Introspecção, estudo e espiritualidade. O silêncio e a análise aprofundam a sabedoria.',
  8: 'Realização material, poder e justiça. Equilibrar ambição com ética é o desafio central.',
  9: 'Humanitarismo, conclusão e compaixão. Encerrar ciclos com generosidade abre portas novas.',
  11: 'Intuição elevada e inspiração. Missão de elevar consciências - canal de visão espiritual.',
  22: 'Construtor de grandes obras. Capacidade de materializar ideais em benefício colectivo.',
  33: 'Mestre da compaixão e do ensino. Serviço amoroso como expressão máxima do caminho.',
}

const SIGNIFICADOS_EN = {
  1: 'Leadership, independence and initiative. The path asks courage to open new cycles.',
  2: 'Cooperation, sensitivity and diplomacy. Harmony in relationships drives growth.',
  3: 'Expression, creativity and communication. Shared joy amplifies purpose.',
  4: 'Structure, discipline and steady work. Solid foundations sustain destiny.',
  5: 'Freedom, change and adaptation. Life asks flexibility and varied experience.',
  6: 'Responsibility, family and service. Nurturing reveals the most authentic vocation.',
  7: 'Introspection, study and spirituality. Silence and analysis deepen wisdom.',
  8: 'Material achievement, power and justice. Balancing ambition with ethics is central.',
  9: 'Humanitarianism, completion and compassion. Closing cycles generously opens new doors.',
  11: 'Elevated intuition and inspiration. A mission to raise consciousness - a channel of vision.',
  22: 'Builder of great works. Power to materialise ideals for collective benefit.',
  33: 'Master of compassion and teaching. Loving service as the highest path expression.',
}

const SIGNIFICADOS_ES = {
  1: 'Liderazgo, independencia e iniciativa. El camino pide coraje para abrir nuevos ciclos.',
  2: 'Cooperación, sensibilidad y diplomacia. La armonía en las relaciones impulsa el crecimiento.',
  3: 'Expresión, creatividad y comunicación. La alegría compartida amplifica el propósito.',
  4: 'Estructura, disciplina y trabajo constante. Los cimientos sólidos sostienen el destino.',
  5: 'Libertad, cambio y adaptación. La vida pide flexibilidad y experiencias variadas.',
  6: 'Responsabilidad, familia y servicio. Nutrir y cuidar revela la vocación más auténtica.',
  7: 'Introspección, estudio y espiritualidad. El silencio y el análisis profundizan la sabiduría.',
  8: 'Realización material, poder y justicia. Equilibrar ambición con ética es el desafío central.',
  9: 'Humanitarismo, conclusión y compasión. Cerrar ciclos con generosidad abre nuevas puertas.',
  11: 'Intuición elevada e inspiración. Misión de elevar conciencias: canal de visión espiritual.',
  22: 'Constructor de grandes obras. Capacidad de materializar ideales en beneficio colectivo.',
  33: 'Maestro de la compasión y la enseñanza. Servicio amoroso como expresión máxima del camino.',
}

const SIGNIFICADOS_IT = {
  1: 'Guida, indipendenza e iniziativa. Il cammino chiede coraggio per aprire nuovi cicli.',
  2: 'Cooperazione, sensibilità e diplomazia. L\'armonia nelle relazioni guida la crescita.',
  3: 'Espressione, creatività e comunicazione. La gioia condivisa amplifica lo scopo.',
  4: 'Struttura, disciplina e lavoro costante. Le fondamenta solide sostengono il destino.',
  5: 'Libertà, cambiamento e adattamento. La vita chiede flessibilità ed esperienze varie.',
  6: 'Responsabilità, famiglia e servizio. Nutrire rivela la vocazione più autentica.',
  7: 'Introspezione, studio e spiritualità. Il silenzio e l\'analisi approfondiscono la saggezza.',
  8: 'Realizzazione materiale, potere e giustizia. Bilanciare ambizione ed etica è la sfida centrale.',
  9: 'Umanitarismo, conclusione e compassione. Chiudere cicli con generosità apre nuove porte.',
  11: 'Intuizione elevata e ispirazione. Missione di elevare le coscienze: canale di visione spirituale.',
  22: 'Costruttore di grandi opere. Capacità di materializzare ideali per il bene collettivo.',
  33: 'Maestro della compassione e dell\'insegnamento. Servizio amorevole come espressione massima del cammino.',
}

const SIGNIFICADOS_DE = {
  1: 'Führung, Unabhängigkeit und Initiative. Der Weg verlangt Mut, neue Zyklen zu eröffnen.',
  2: 'Kooperation, Sensibilität und Diplomatie. Harmonie in Beziehungen treibt Wachstum.',
  3: 'Ausdruck, Kreativität und Kommunikation. Geteilte Freude verstärkt den Sinn.',
  4: 'Struktur, Disziplin und beständige Arbeit. Solide Fundamente tragen das Schicksal.',
  5: 'Freiheit, Wandel und Anpassung. Das Leben verlangt Flexibilität und vielfältige Erfahrung.',
  6: 'Verantwortung, Familie und Dienst. Fürsorge offenbart die authentischste Berufung.',
  7: 'Introspektion, Studium und Spiritualität. Stille und Analyse vertiefen Weisheit.',
  8: 'Materielle Verwirklichung, Macht und Gerechtigkeit. Ehrgeiz und Ethik auszubalancieren ist zentral.',
  9: 'Humanitarismus, Abschluss und Mitgefühl. Zyklen großzügig zu schließen öffnet neue Türen.',
  11: 'Erhabene Intuition und Inspiration. Mission, Bewusstsein zu erheben - Kanal spiritueller Vision.',
  22: 'Baumeister großer Werke. Fähigkeit, Ideale zum kollektiven Nutzen zu materialisieren.',
  33: 'Meister der Mitgefühl und Lehre. Liebender Dienst als höchster Ausdruck des Weges.',
}

const SIGNIFICADOS_FR = {
  1: 'Leadership, indépendance et initiative. Le chemin demande le courage d\'ouvrir de nouveaux cycles.',
  2: 'Coopération, sensibilité et diplomatie. L\'harmonie dans les relations nourrit la croissance.',
  3: 'Expression, créativité et communication. La joie partagée amplifie le sens.',
  4: 'Structure, discipline et travail constant. Des fondations solides soutiennent le destin.',
  5: 'Liberté, changement et adaptation. La vie demande flexibilité et expériences variées.',
  6: 'Responsabilité, famille et service. Nourrir révèle la vocation la plus authentique.',
  7: 'Introspection, étude et spiritualité. Le silence et l\'analyse approfondissent la sagesse.',
  8: 'Réalisation matérielle, pouvoir et justice. Équilibrer ambition et éthique est le défi central.',
  9: 'Humanitarisme, achèvement et compassion. Clore les cycles avec générosité ouvre de nouvelles portes.',
  11: 'Intuition élevée et inspiration. Mission d\'élever les consciences - canal de vision spirituelle.',
  22: 'Bâtisseur de grandes œuvres. Capacité de matérialiser des idéaux au bénéfice collectif.',
  33: 'Maître de la compassion et de l\'enseignement. Service aimant comme expression maximale du chemin.',
}

export function calcularMapaNumerologia(nome, dataISO, lang = 'pt', mapaNatal = null) {
  const sig = contentForLang(lang, {
    pt: SIGNIFICADOS_PT, en: SIGNIFICADOS_EN, es: SIGNIFICADOS_ES,
    it: SIGNIFICADOS_IT, de: SIGNIFICADOS_DE, fr: SIGNIFICADOS_FR,
  }) || SIGNIFICADOS_EN
  const nomeData = analisarNome(nome)
  const caminho = caminhoVida(dataISO)
  const ano = anoPessoal(dataISO)
  const mes = mesPessoal(dataISO, ano)
  const ciclos = cicloVida(dataISO)

  const vogaisLetras = somaNome(nome, 'vogais').letras
  const consoantesLetras = somaNome(nome, 'consoantes').letras
  const [, mesNasc, diaNasc] = dataISO ? dataISO.split('-').map(Number) : [null, null, null]
  const anoCivil = new Date().getFullYear()
  const mesCalendario = new Date().getMonth() + 1

  const calculos = {
    destino: { ...buildCalculoLetras(nomeData.letras, nomeData.destino), tipo: 'nome_completo' },
    alma: { ...buildCalculoLetras(vogaisLetras, nomeData.alma), tipo: 'vogais' },
    personalidade: { ...buildCalculoLetras(consoantesLetras, nomeData.personalidade), tipo: 'consoantes' },
    caminhoVida: { ...buildCalculoData(dataISO), tipo: 'data_nascimento' },
    anoPessoal: {
      ...buildCalculoSoma(
        [{ label: 'dia', valor: diaNasc }, { label: 'mes', valor: mesNasc }, { label: 'ano', valor: anoCivil }],
        diaNasc + mesNasc + anoCivil,
        ano,
      ),
      tipo: 'ano_pessoal',
      dia: diaNasc,
      mes: mesNasc,
      anoCivil,
    },
    mesPessoal: {
      ...buildCalculoSoma(
        [{ label: 'anoPessoal', valor: ano }, { label: 'mesCalendario', valor: mesCalendario }],
        ano + mesCalendario,
        mes,
      ),
      tipo: 'mes_pessoal',
      mesCalendario,
    },
  }

  const desc = (n) => sig[n] || sig[reduzir(n)] || '-'

  const base = {
    nome,
    caminhoVida: caminho,
    destino: nomeData.destino,
    destinoComposto: nomeData.destinoComposto,
    alma: nomeData.alma,
    almaComposto: nomeData.almaComposto,
    personalidade: nomeData.personalidade,
    personalidadeComposto: nomeData.personalidadeComposto,
    vibracaoTotal: nomeData.vibracaoTotal,
    letras: nomeData.letras,
    numeroDominante: nomeData.numeroDominante,
    numerosEmFalta: nomeData.numerosEmFalta,
    anoPessoal: ano,
    mesPessoal: mes,
    ciclos,
    calculos,
    mesCalendario,
    textos: {
      caminhoVida: desc(caminho),
      destino: desc(nomeData.destino),
      alma: desc(nomeData.alma),
      personalidade: desc(nomeData.personalidade),
      anoPessoal: desc(ano),
      mesPessoal: desc(mes),
    },
  }

  return enriquecerMapaNumerologia(base, nome, lang, mapaNatal)
}
