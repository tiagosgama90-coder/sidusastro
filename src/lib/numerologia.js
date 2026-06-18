/** Redução numerológica (mantém 11, 22, 33 como mestres). */
function reduzir(n) {
  let v = Math.abs(Math.floor(n))
  while (v > 9 && v !== 11 && v !== 22 && v !== 33) {
    v = String(v).split('').reduce((s, d) => s + Number(d), 0)
  }
  return v
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
  for (const ch of limpo) {
    if (!/[a-zA-ZçÇ]/.test(ch)) continue
    const v = valorLetra(ch)
    if (filtro === 'vogais' && !VOGAIS.has(ch.toLowerCase())) continue
    if (filtro === 'consoantes' && VOGAIS.has(ch.toLowerCase())) continue
    total += v
  }
  return reduzir(total)
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

function mesPessoal(dataISO, ref = new Date()) {
  if (!dataISO) return null
  const [, m, d] = dataISO.split('-').map(Number)
  return reduzir(d + m + ref.getFullYear())
}

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
  11: 'Intuição elevada e inspiração. Missão de elevar consciências — canal de visão espiritual.',
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
  11: 'Elevated intuition and inspiration. A mission to raise consciousness — a channel of vision.',
  22: 'Builder of great works. Power to materialise ideals for collective benefit.',
  33: 'Master of compassion and teaching. Loving service as the highest path expression.',
}

export function calcularMapaNumerologia(nome, dataISO, lang = 'pt') {
  const sig = lang === 'en' ? SIGNIFICADOS_EN : SIGNIFICADOS_PT
  const caminho = caminhoVida(dataISO)
  const destino = somaNome(nome)
  const alma = somaNome(nome, 'vogais')
  const personalidade = somaNome(nome, 'consoantes')
  const ano = anoPessoal(dataISO)
  const mes = mesPessoal(dataISO)
  const ciclos = cicloVida(dataISO)

  const desc = (n) => sig[n] || sig[reduzir(n)] || '—'

  return {
    caminhoVida: caminho,
    destino,
    alma,
    personalidade,
    anoPessoal: ano,
    mesPessoal: mes,
    ciclos,
    textos: {
      caminhoVida: desc(caminho),
      destino: desc(destino),
      alma: desc(alma),
      personalidade: desc(personalidade),
      anoPessoal: desc(ano),
      mesPessoal: desc(mes),
    },
  }
}
