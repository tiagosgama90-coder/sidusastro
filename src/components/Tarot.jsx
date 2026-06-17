/**
 * Sistema de Tarot Sidus
 * ─ Animação de embaralhar (fan + shuffle)
 * ─ Arte SVG única para cada Arcano
 * ─ 3 leituras gratuitas/dia · depois 2 € por leitura ou Premium
 * ─ 6 tipos de leitura · interpretações personalizadas com mapa natal
 */
import { useState, useEffect } from 'react'

const CORES = {
  fundo:'#0B071E', dourado:'#DFB76C', douradoEscuro:'#B8944F',
  branco:'#FFFFFF', brancoSuave:'rgba(255,255,255,0.85)',
  brancoMuted:'rgba(255,255,255,0.55)', vidroBorda:'rgba(223,183,108,0.22)',
}

// ── Roman numerals ────────────────────────────────────────────────────────────
function toRoman(n) {
  const v=[10,9,5,4,1], s=['X','IX','V','IV','I']
  let r=''; v.forEach((val,i)=>{ while(n>=val){r+=s[i];n-=val} }); return r
}

// ── Paleta de cores por Arcano ────────────────────────────────────────────────
const PALETAS = {
  0:'#6D28D9',1:'#B45309',2:'#0369A1',3:'#047857',4:'#B91C1C',
  5:'#7C3AED',6:'#DB2777',7:'#D97706',8:'#92400E',9:'#1D4ED8',
  10:'#7C3AED',11:'#059669',12:'#0284C7',13:'#1E293B',14:'#0891B2',
  15:'#991B1B',16:'#6D28D9',17:'#1D4ED8',18:'#1E3A5F',19:'#B45309',
  20:'#7C3AED',21:'#047857',
}

// ── SVG Art por carta ─────────────────────────────────────────────────────────
function CartaSVG({ carta, size=90, virada=false }) {
  if (!carta) return null
  const w=size, h=Math.round(size*1.6)
  const cor = PALETAS[carta.id] ?? '#6D28D9'
  const id  = `c${carta.id}_${size}`

  if (virada) {
    return (
      <svg width={w} height={h} viewBox="0 0 90 144">
        <defs>
          <linearGradient id={`vd_${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0d0722"/>
            <stop offset="100%" stopColor="#1a0d3a"/>
          </linearGradient>
        </defs>
        <rect width="90" height="144" rx="8" fill={`url(#vd_${id})`}/>
        <rect x="2" y="2" width="86" height="140" rx="7" fill="none" stroke="#DFB76C" strokeWidth="1" opacity="0.4"/>
        {[...Array(5)].map((_,i)=>[...Array(4)].map((_,j)=>(
          <text key={`${i}${j}`} x={12+j*22} y={20+i*26} fontSize="14" fill="#DFB76C" opacity="0.08">✦</text>
        )))}
        <text x="45" y="76" fontSize="28" textAnchor="middle" dominantBaseline="middle" fill="#DFB76C" opacity="0.25">✦</text>
      </svg>
    )
  }

  return (
    <svg width={w} height={h} viewBox="0 0 90 144"
      style={{ transform: carta.invertida ? 'rotate(180deg)' : 'none', display:'block' }}>
      <defs>
        <radialGradient id={`bg_${id}`} cx="50%" cy="35%" r="70%">
          <stop offset="0%" stopColor={cor} stopOpacity="0.65"/>
          <stop offset="100%" stopColor="#0B071E"/>
        </radialGradient>
        <pattern id={`pt_${id}`} x="0" y="0" width="15" height="15" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="0.6" fill={cor} opacity="0.18"/>
          <circle cx="10" cy="10" r="0.4" fill={cor} opacity="0.1"/>
        </pattern>
      </defs>
      <rect width="90" height="144" rx="8" fill={`url(#bg_${id})`}/>
      <rect width="90" height="144" rx="8" fill={`url(#pt_${id})`}/>
      <rect x="2" y="2" width="86" height="140" rx="7" fill="none" stroke="#DFB76C" strokeWidth="1.2" opacity="0.65"/>
      <rect x="6" y="6" width="78" height="132" rx="5" fill="none" stroke="#DFB76C" strokeWidth="0.4" opacity="0.3"/>
      {/* Roman num top-left */}
      <text x="10" y="17" fontSize="8" fill="#DFB76C" fontFamily="Georgia,serif" opacity="0.85">{carta.id===0?'☽':toRoman(carta.id)}</text>
      {/* Central emoji art */}
      <text x="45" y="82" fontSize="36" textAnchor="middle" dominantBaseline="middle">{carta.simb}</text>
      {/* Decorative lines */}
      <line x1="12" y1="108" x2="78" y2="108" stroke="#DFB76C" strokeWidth="0.6" opacity="0.5"/>
      <line x1="14" y1="110.5" x2="76" y2="110.5" stroke="#DFB76C" strokeWidth="0.2" opacity="0.25"/>
      {/* Card name */}
      <text x="45" y="122" fontSize="6.2" textAnchor="middle" fill="#DFB76C" fontFamily="Georgia,serif" letterSpacing="0.8">{carta.nome.toUpperCase()}</text>
      {/* Stars */}
      {[18,34,56,72].map(x=><text key={x} x={x} y="134" fontSize="6" fill="#DFB76C" opacity="0.35" textAnchor="middle">✦</text>)}
      {/* Invertida badge */}
      {carta.invertida && (
        <text x="45" y="141" fontSize="5.5" fill="#EF4444" textAnchor="middle" opacity="0.9">INVERTIDA</text>
      )}
    </svg>
  )
}

// ── 22 Arcanos Maiores ────────────────────────────────────────────────────────
const ARCANOS = [
  {id:0,  nome:'O Louco',         simb:'🃏', palavras:['aventura','liberdade','começo'],
   luz:'Abertura total ao desconhecido. Um salto de fé abre portas inesperadas. A tua inocência é força, não fraqueza.',
   sombra:'Impulsividade perigosa. Risco de agir sem considerar as consequências para ti e para os que amas.',
   conselho:'Ousa, mas não desprezes o chão sob os teus pés. O Louco conquista mundos quando alia a coragem à consciência.'},
  {id:1,  nome:'O Mago',          simb:'🎩', palavras:['poder','vontade','manifestação'],
   luz:'Tens todos os recursos que precisas. A tua força de vontade é capaz de transformar o pensamento em realidade.',
   sombra:'Manipulação ou uso do talento para fins egoístas. O poder sem ética corrói quem o exerce.',
   conselho:'Usa os teus dons com intenção clara. O Universo amplifica o que colocas no mundo — escolhe com sabedoria.'},
  {id:2,  nome:'A Papisa',        simb:'📖', palavras:['intuição','mistério','sabedoria'],
   luz:'A tua voz interior é precisa como um astrolábio. Confia no que sentes antes do que no que vês.',
   sombra:'Segredos que bloqueiam o crescimento. O silêncio pode ser isolamento disfarçado de prudência.',
   conselho:'Medita antes de agir. A resposta que procuras já existe dentro de ti — o silêncio é a sua língua.'},
  {id:3,  nome:'A Imperatriz',    simb:'👑', palavras:['abundância','fertilidade','amor'],
   luz:'Ciclo de prosperidade e criatividade extraordinária. Nutre os teus projetos com paciência e amor.',
   sombra:'Excesso ou dependência. A abundância sem moderação pode tornar-se prisão dourada.',
   conselho:'Recebe o que a vida te oferece com gratidão. A tua capacidade de criar e nutrir é um dom raro.'},
  {id:4,  nome:'O Imperador',     simb:'⚔️', palavras:['autoridade','estrutura','proteção'],
   luz:'Momento de assumir as rédeas. A disciplina e a liderança que exerces agora constroem o teu legado.',
   sombra:'Rigidez que impede a adaptação. O controlo excessivo sufoca o crescimento — dos outros e do teu.',
   conselho:'Estabelece limites saudáveis. A verdadeira autoridade não precisa de se impor — é reconhecida.'},
  {id:5,  nome:'O Hierofante',    simb:'✝️', palavras:['tradição','fé','ensinamento'],
   luz:'Um mentor ou ensinamento ancestral surge no teu caminho. Valores profundos guiam as tuas decisões.',
   sombra:'Dogmatismo que sufoca a evolução. Seguir regras cegas por medo de questionar.',
   conselho:'Honra a sabedoria do passado mas não deixes que ela te impeça de descobrir a tua própria verdade.'},
  {id:6,  nome:'Os Amantes',      simb:'💞', palavras:['amor','escolha','harmonia'],
   luz:'Uma união poderosa ou uma escolha que define o teu caminho. O coração sabe o que a mente demora a aceitar.',
   sombra:'Indecisão paralisante. Tentação que te afasta do teu verdadeiro propósito e valores.',
   conselho:'Age a partir do amor, não do medo. A escolha que parece mais difícil é frequentemente a mais libertadora.'},
  {id:7,  nome:'O Carro',         simb:'🏆', palavras:['vitória','determinação','controlo'],
   luz:'A tua força de vontade supera qualquer obstáculo. Velocidade e foco garantem a vitória que mereces.',
   sombra:'Arrogância que cria inimigos desnecessários. Controlar pela força em vez de pela sabedoria.',
   conselho:'Mantém o olhar no destino, não nos obstáculos. A tua determinação é a chave — usa-a com elegância.'},
  {id:8,  nome:'A Força',         simb:'🦁', palavras:['coragem','compaixão','domínio'],
   luz:'A verdadeira força nasce do amor, não da violência. Domas os teus medos com gentileza e inteligência emocional.',
   sombra:'Repressão que consome energia vital. A força usada para suprimir em vez de transformar.',
   conselho:'A tua maior batalha é interior. Vence-a com compaixão por ti próprio e a coragem crescerá naturalmente.'},
  {id:9,  nome:'O Eremita',       simb:'🕯️', palavras:['reflexão','solidão','guia'],
   luz:'Período de recolhimento necessário e frutífero. A tua luz interior ilumina quando tudo parece escuro.',
   sombra:'Isolamento que se transforma em amargura. Recusar a ajuda que o mundo pode oferecer.',
   conselho:'Afasta-te do ruído externo. Na solidão escolhida encontrarás as respostas que o mundo não pode dar.'},
  {id:10, nome:'Roda da Fortuna', simb:'☸️', palavras:['destino','ciclos','mudança'],
   luz:'O ciclo vira a teu favor. Uma reviravolta inesperada traz nova sorte e oportunidades extraordinárias.',
   sombra:'Deixar a vida ao acaso. Resistência às mudanças inevitáveis que te impedem de evoluir.',
   conselho:'Abraça as mudanças em vez de as resistir. A roda gira sempre — usa o movimento a teu favor.'},
  {id:11, nome:'A Justiça',       simb:'⚖️', palavras:['equilíbrio','verdade','karma'],
   luz:'A verdade prevalece e o equilíbrio é restaurado. Cada ação tem a sua consequência — e agora colhes o que plantaste.',
   sombra:'Julgamento severo que ignora a compaixão. Desequilíbrio em decisões importantes.',
   conselho:'Age com integridade em todas as situações. O Universo regista cada pensamento, palavra e ação.'},
  {id:12, nome:'O Enforcado',     simb:'🔄', palavras:['sacrifício','perspetiva','pausa'],
   luz:'Uma pausa necessária para ver o que estava oculto. O sacrifício voluntário abre perspetivas transformadoras.',
   sombra:'Martírio desnecessário. Paralisação por recusa em ver a situação de um ângulo diferente.',
   conselho:'Inverte a tua perspetiva. O que parece uma derrota pode ser o maior presente que a vida te fez.'},
  {id:13, nome:'A Morte',         simb:'🌑', palavras:['transformação','fim','renascimento'],
   luz:'Uma fase encerra-se para que algo mais elevado e autêntico nasça. A transformação é inevitável e libertadora.',
   sombra:'Resistência teimosa à mudança que prolonga o sofrimento desnecessariamente.',
   conselho:'Deixa ir o que já não te serve. Cada fim é o início disfarçado de algo extraordinário.'},
  {id:14, nome:'A Temperança',    simb:'🌊', palavras:['equilíbrio','paciência','alquimia'],
   luz:'A mistura perfeita entre opostos cria algo extraordinário. A paciência e moderação são as tuas maiores aliadas.',
   sombra:'Excesso ou privação. O desequilíbrio entre o que dás e o que recebes esgota a tua energia vital.',
   conselho:'Encontra o ponto de equilíbrio. A verdadeira magia acontece quando os opostos se harmonizam em ti.'},
  {id:15, nome:'O Diabo',         simb:'⛓️', palavras:['apego','ilusão','libertação'],
   luz:'Reconhecer o que te prende é o primeiro passo para a liberdade total. O poder de mudar está sempre em ti.',
   sombra:'Vícios e obsessões que te mantêm acorrentado a padrões que já conheces mas não abandonas.',
   conselho:'Olha diretamente para o que temes. A ilusão só tem poder sobre ti enquanto a evitares.'},
  {id:16, nome:'A Torre',         simb:'⚡', palavras:['ruptura','revelação','reconstrução'],
   luz:'O que se destrói era falso ou já não te servia. A ruptura, dolorosa, abre espaço para a verdade.',
   sombra:'Caos criado pela teimosia em manter estruturas que já desmoronaram por dentro.',
   conselho:'Permite que o que é frágil caia. O que for verdadeiro permanecerá e será reconstruído mais forte.'},
  {id:17, nome:'A Estrela',       simb:'⭐', palavras:['esperança','cura','inspiração'],
   luz:'Depois de qualquer tempestade, surge a luz. Cura profunda e renovação da esperança chegam agora.',
   sombra:'Idealismo que ignora a realidade prática. Esperar que as estrelas resolvam o que é teu para resolver.',
   conselho:'Deixa a esperança entrar. Não como fuga, mas como combustível para construires o que sonhas.'},
  {id:18, nome:'A Lua',           simb:'🌙', palavras:['intuição','inconsciente','sonhos'],
   luz:'Mergulha nas profundezas do teu inconsciente. Os teus sonhos e intuições carregam mensagens reais e precisas.',
   sombra:'Medos irracionais e ilusões que distorcem a realidade. Confundir o desejo com a intuição.',
   conselho:'Confia nos teus sonhos — mas distingue o medo da intuição. Ambos falam, mas com vozes diferentes.'},
  {id:19, nome:'O Sol',           simb:'☀️', palavras:['alegria','sucesso','clareza'],
   luz:'Clareza total e alegria genuína. O sucesso surge quando ages com plena autenticidade e confiança.',
   sombra:'Vaidade que obscurece a humildade. Excesso de confiança que não vê os próprios pontos cegos.',
   conselho:'Brilha sem pedir desculpa por isso. A tua alegria é contagiante e tem o poder de curar os que te rodeiam.'},
  {id:20, nome:'O Julgamento',    simb:'📯', palavras:['despertar','redenção','chamado'],
   luz:'Um despertar espiritual profundo. Estás a ser chamado ao teu propósito maior — o Universo bate à tua porta.',
   sombra:'Incapacidade de perdoar a si mesmo ou aos outros. Ignorar o chamado por medo das exigências que traz.',
   conselho:'Responde ao chamado interior. O perdão — de ti e dos outros — é a chave para este novo capítulo.'},
  {id:21, nome:'O Mundo',         simb:'🌍', palavras:['conclusão','integração','plenitude'],
   luz:'Ciclo completado com sucesso e maturidade. Tens todas as ferramentas para viver plenamente o teu destino.',
   sombra:'Resistência em deixar ir o que já foi. O medo do vazio após a conclusão impede o próximo começo.',
   conselho:'Celebra o caminho percorrido. A plenitude que sentes agora é a base do próximo e mais rico ciclo.'},
]

function baralhoCompleto() {
  const d=[]
  ARCANOS.forEach(c=>{
    d.push({...c,invertida:false,uid:c.id*2})
    d.push({...c,invertida:true, uid:c.id*2+1})
  })
  return d
}

function embaralhar(arr) {
  const a=[...arr]
  for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}
  return a
}

// ── 1 leitura gratuita por tipo de baralho (Diária, Amor, Sim/Não, etc.) ─────
const CHAVE_TAROT_TIPO = 'sidus_tarot_tipo_'

function tipoJaUsado(tipoId) {
  try { return localStorage.getItem(CHAVE_TAROT_TIPO + tipoId) === '1' } catch { return false }
}

function registarTipoUsado(tipoId) {
  try { localStorage.setItem(CHAVE_TAROT_TIPO + tipoId, '1') } catch { /* quota */ }
}

function contarTiposDisponiveis(tipos) {
  return tipos.filter(t => !tipoJaUsado(t.id)).length
}

function podeLerTipo(tipoId, isPremium) {
  return isPremium || !tipoJaUsado(tipoId)
}

const TIPOS = [
  {id:'diaria',  nome:'Leitura Diária',     icone:'🌅',n:1,desc:'Uma carta para guiar o teu dia'},
  {id:'simnao',  nome:'Tarot Sim ou Não',   icone:'🔮',n:1,desc:'Resposta directa e clara à tua questão'},
  {id:'amor',    nome:'Tarot do Amor',       icone:'💞',n:3,desc:'Tu · A ligação · O futuro juntos'},
  {id:'geral',   nome:'Leitura Geral',       icone:'✨',n:3,desc:'Passado · Presente · Futuro'},
  {id:'cigano',  nome:'Baralho Cigano',      icone:'🎴',n:5,desc:'Leitura ancestral cigana de 5 cartas'},
  {id:'oraculo', nome:'Tarot Oráculo',       icone:'🌌',n:5,desc:'Consulta profunda do teu destino'},
]
const POSICOES={
  diaria:['A mensagem do dia'],
  simnao:['A resposta do Universo'],
  amor:['O teu estado', 'A vossa ligação', 'O futuro juntos'],
  geral:['O passado', 'O presente', 'O futuro'],
  cigano:['Amor & relações','Trabalho & carreira','Finanças','Saúde & energia','Destino & rumo'],
  oraculo:['A tua essência','O obstáculo','O aliado secreto','A acção a tomar','O resultado final'],
}

// ── Interpretação final da leitura ────────────────────────────────────────────
function interpretarLeitura(cartas, tipoId, pergunta, mapaNatal) {
  const astro = mapaNatal
    ? `\nLendo o teu mapa natal: Sol em ${mapaNatal.solar?.nome}, Lua em ${mapaNatal.lunar?.nome}, Ascendente em ${mapaNatal.ascendente?.nome}.`
    : ''

  if (tipoId === 'simnao') {
    const cartasPositivas = new Set([0,1,3,4,6,7,8,10,11,14,17,19,20,21])
    const positiva = !cartas[0].invertida && cartasPositivas.has(cartas[0].id)
    return {
      resposta: positiva ? '🟢 SIM' : '🔴 NÃO',
      detalhe: `${astro}\n\n${cartas[0].invertida ? cartas[0].sombra : cartas[0].luz}\n\n${cartas[0].conselho}`,
    }
  }

  const posicoes = POSICOES[tipoId] || []
  const linhas = cartas.map((c,i) => {
    const pos = posicoes[i] || `Carta ${i+1}`
    const txt = c.invertida ? c.sombra : c.luz
    return `**${pos}**: ${c.nome} ${c.invertida?'(Invertida)':''}\n${txt}`
  })

  let conclusao = ''
  if (tipoId === 'amor') {
    conclusao = `\n\n✦ Síntese: O conjunto das cartas revela ${cartas[0].palavras[0]} como tema central da vossa ligação. ${cartas[2].invertida?'Existem desafios a resolver antes de avançar.':'O caminho está aberto para algo significativo.'}`
  } else if (tipoId === 'geral') {
    conclusao = `\n\n✦ Síntese: O teu ciclo de transformação tem raízes no ${cartas[0].nome.toLowerCase()}, cresce no presente através de ${cartas[1].palavras[0]}, e aponta para ${cartas[2].palavras[1]}.`
  } else if (tipoId==='cigano'||tipoId==='oraculo') {
    conclusao = `\n\n✦ Síntese: As cinco cartas formam um mapa: o ponto de partida é ${cartas[0].nome}, o destino é ${cartas[4].nome}. O caminho entre eles exige ${cartas[2].palavras[0]}.`
  }

  return { resposta: null, detalhe: `${astro}\n\n${linhas.join('\n\n')}${conclusao}` }
}

// ── Componente principal ──────────────────────────────────────────────────────
export function EcraTarot({ mapaNatal, isPremium, onPagar, onPremium }) {
  const [fase, setFase]           = useState('seleccionar')
  const [tipoId, setTipoId]       = useState(null)
  const [pergunta, setPergunta]   = useState('')
  const [cartas, setCartas]       = useState([])
  const [reveladas, setReveladas] = useState([])
  const [embaralhando, setEmbaralhando] = useState(false)
  const [distribuindo, setDistribuindo] = useState(-1)
  const [tick, setTick]           = useState(0)
  const [resultado, setResultado]       = useState(null)

  const tipo = TIPOS.find(t=>t.id===tipoId)
  const posicoes = POSICOES[tipoId]||[]
  const podeLer = tipoId ? podeLerTipo(tipoId, isPremium) : false
  const tiposDisponiveis = contarTiposDisponiveis(TIPOS)

  const refrescar = () => setTick(n => n + 1)

  const iniciarLeitura = (t) => {
    setTipoId(t.id); setPergunta(''); setCartas([]); setReveladas([]); setResultado(null)
    setFase('pergunta')
  }

  const comecarEmbaralhar = () => {
    setEmbaralhando(true)
    setTimeout(()=>{
      const deck = embaralhar(baralhoCompleto())
      const sel  = deck.slice(0,tipo.n)
      setCartas(sel)
      setReveladas(new Array(tipo.n).fill(false))
      setEmbaralhando(false)
      // Distribuir cartas uma a uma
      setDistribuindo(0)
    }, 2000)
  }

  useEffect(()=>{
    if (distribuindo>=0 && tipo && distribuindo<tipo.n) {
      const t = setTimeout(()=>setDistribuindo(i=>i+1), 350)
      return ()=>clearTimeout(t)
    }
    if (distribuindo>=tipo?.n) { setDistribuindo(-1); setFase('revelar') }
  },[distribuindo, tipo])

  const revelarCarta = (i) => {
    if(reveladas[i]) return
    const novo = [...reveladas]; novo[i]=true; setReveladas(novo)
    if(novo.every(Boolean)) {
      setResultado(interpretarLeitura(cartas, tipoId, pergunta, mapaNatal))
      if (!isPremium) {
        registarTipoUsado(tipoId)
        refrescar()
      }
    }
  }

  const voltar = () => { setFase('seleccionar'); setCartas([]); setReveladas([]); setResultado(null) }

  // ────────────────────────── RENDER ────────────────────────────────────────
  if (fase==='seleccionar') return (
    <TelaSeleccionar tipos={TIPOS} onSeleccionar={iniciarLeitura} isPremium={isPremium} tick={tick}/>
  )

  if (fase==='pergunta') return (
    <TelaPergunta tipo={tipo} pergunta={pergunta} setPergunta={setPergunta}
      onVoltar={voltar} podeLer={podeLer} isPremium={isPremium}
      onComecar={()=>{
        if(podeLer) comecarEmbaralhar()
        else onPagar('Leitura de Tarot · ' + (tipo?.nome || ''), 2, ()=>{ comecarEmbaralhar() })
      }}
      onPremium={onPremium} onComecarPago={comecarEmbaralhar}/>
  )

  if (embaralhando) return <TelaEmbaralhar/>

  if (distribuindo>=0) return (
    <TelaDistribuir cartas={cartas} posicoes={posicoes} distribuindo={distribuindo}/>
  )

  if (fase==='revelar') return (
    <TelaRevelar cartas={cartas} reveladas={reveladas} onRevelar={revelarCarta}
      posicoes={posicoes} tipo={tipo} pergunta={pergunta} resultado={resultado}
      onVoltar={voltar} isPremium={isPremium} onPagar={onPagar}/>
  )

  return null
}

// ── Sub-telas ─────────────────────────────────────────────────────────────────
function TelaSeleccionar({ tipos, onSeleccionar, isPremium, tick }) {
  void tick
  const disponiveis = contarTiposDisponiveis(tipos)
  return (
    <div style={{ padding:'20px 20px 110px' }}>
      <h2 style={{fontSize:20,fontWeight:600,color:CORES.dourado,marginBottom:4,marginTop:0}}>Arcanos Virtuais</h2>
      <p style={{fontSize:13,color:CORES.brancoMuted,marginBottom:6}}>Consulta o oráculo das cartas</p>
      {!isPremium && (
        <div style={{background:'rgba(223,183,108,0.07)',border:`1px solid rgba(223,183,108,0.25)`,borderRadius:10,padding:'8px 14px',marginBottom:18,display:'flex',alignItems:'center',gap:8}}>
          <span style={{fontSize:16}}>✦</span>
          <span style={{fontSize:12,color:CORES.brancoMuted}}>
            {disponiveis > 0
              ? <><b style={{color:CORES.dourado}}>1 leitura grátis</b> por tipo de baralho · {disponiveis} tipo{disponiveis>1?'s':''} ainda por experimentar</>
              : <><b style={{color:'#EF4444'}}>Leituras gratuitas esgotadas</b> · 2 € por leitura ou Premium 4,99 €/mês</>}
          </span>
        </div>
      )}
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {tipos.map(t=>{
          const usado = !isPremium && tipoJaUsado(t.id)
          return (
          <button key={t.id} type="button" onClick={()=>onSeleccionar(t)} style={{
            background: usado ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)',
            border:`1px solid ${usado ? 'rgba(239,68,68,0.25)' : 'rgba(223,183,108,0.18)'}`,
            borderRadius:14,padding:'15px 18px',cursor:'pointer',textAlign:'left',
            display:'flex',alignItems:'center',gap:14,opacity: usado ? 0.75 : 1,
          }}>
            <span style={{fontSize:28}}>{t.icone}</span>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:600,color:CORES.branco}}>{t.nome}</div>
              <div style={{fontSize:11,color:CORES.brancoMuted}}>{t.desc}</div>
              {!isPremium && (
                <div style={{fontSize:10,marginTop:4,color: usado ? '#F87171' : '#34D399'}}>
                  {usado ? '✗ Grátis já usada · 2 € ou Premium' : '✓ 1 tentativa gratuita disponível'}
                </div>
              )}
            </div>
            <div style={{fontSize:11,color:CORES.dourado,fontWeight:700}}>{t.n} carta{t.n>1?'s':''}</div>
          </button>
        )})}
      </div>
    </div>
  )
}

function TelaPergunta({ tipo, pergunta, setPergunta, onVoltar, podeLer, isPremium, onComecar, onPagar, onComecarPago, onPremium }) {
  return (
    <div style={{padding:'28px 20px 110px'}}>
      <button type="button" onClick={onVoltar} style={{background:'none',border:'none',color:CORES.brancoMuted,cursor:'pointer',fontSize:13,marginBottom:20,padding:0}}>← Voltar</button>
      <div style={{textAlign:'center',marginBottom:28}}>
        <div style={{fontSize:44}}>{tipo?.icone}</div>
        <h2 style={{color:CORES.dourado,margin:'8px 0 4px'}}>{tipo?.nome}</h2>
        <p style={{fontSize:12,color:CORES.brancoMuted}}>{tipo?.desc}</p>
      </div>
      <div style={{background:'rgba(255,255,255,0.04)',borderRadius:14,border:`1px solid rgba(223,183,108,0.2)`,padding:18,marginBottom:20}}>
        <label style={{fontSize:11,color:CORES.dourado,textTransform:'uppercase',letterSpacing:'0.08em',display:'block',marginBottom:10}}>
          Qual é a tua questão? (opcional)
        </label>
        <textarea value={pergunta} onChange={e=>setPergunta(e.target.value)} placeholder="Escreve a tua pergunta ao Universo..." maxLength={200}
          style={{width:'100%',background:'rgba(255,255,255,0.05)',border:`1px solid rgba(223,183,108,0.2)`,borderRadius:10,color:CORES.branco,fontSize:14,padding:12,resize:'none',height:80,boxSizing:'border-box',outline:'none'}}/>
      </div>
      {isPremium ? (
        <button type="button" onClick={onComecar} style={{...btnDourado,width:'100%'}}>✦ Baralhar e Revelar</button>
      ) : podeLer ? (
        <button type="button" onClick={onComecar} style={{...btnDourado,width:'100%'}}>
          ✦ Baralhar · 1ª leitura gratuita deste baralho
        </button>
      ) : (
        <div style={{background:'rgba(223,183,108,0.06)',border:`1px solid ${CORES.dourado}`,borderRadius:14,padding:20,textAlign:'center'}}>
          <div style={{fontSize:28,fontWeight:700,color:CORES.dourado,marginBottom:8}}>2,00 €</div>
          <p style={{fontSize:13,color:CORES.brancoMuted,marginBottom:16,lineHeight:1.5}}>
            Já usaste a tua leitura gratuita de <b style={{color:CORES.branco}}>{tipo?.nome}</b>.
            Paga 2 € por esta leitura ou activa o <b style={{color:CORES.dourado}}>Sidus Premium (4,99 €/mês)</b> para Tarot ilimitado + Mapa Astral completo em PDF.
          </p>
          <button type="button" onClick={()=>onPagar('Leitura de Tarot · ' + (tipo?.nome || ''), 2, onComecarPago)} style={{...btnDourado,width:'100%',marginBottom:10}}>
            💳 Pagar 2 € · Uma leitura
          </button>
          {onPremium && (
            <button type="button" onClick={onPremium} style={{
              width:'100%',padding:'14px',borderRadius:14,marginBottom:10,
              background:'rgba(139,92,246,0.15)',border:`1px solid rgba(139,92,246,0.4)`,
              color:CORES.dourado,fontSize:14,fontWeight:700,cursor:'pointer',
            }}>
              ✦ Sidus Premium 4,99 €/mês · Mapa completo + Tarot ilimitado
            </button>
          )}
          <p style={{fontSize:11,color:CORES.brancoMuted}}>Multibanco · MBWay · PIX · PayPal</p>
        </div>
      )}
    </div>
  )
}

function TelaEmbaralhar() {
  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'50vh',padding:20,gap:20}}>
      <style>{`
        @keyframes shuffle { 0%{transform:rotate(0) translateX(0)} 25%{transform:rotate(-18deg) translateX(-30px)} 50%{transform:rotate(18deg) translateX(30px)} 75%{transform:rotate(-10deg) translateX(-15px)} 100%{transform:rotate(0) translateX(0)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
      `}</style>
      <div style={{position:'relative',width:100,height:160}}>
        {[...Array(5)].map((_,i)=>(
          <div key={i} style={{
            position:'absolute',top:0,left:0,
            animation:`shuffle 0.6s ease-in-out ${i*0.12}s infinite`,
            transformOrigin:'center bottom',
          }}>
            <CartaSVG carta={ARCANOS[0]} virada size={90}/>
          </div>
        ))}
      </div>
      <p style={{fontSize:15,color:CORES.brancoMuted,fontStyle:'italic',textAlign:'center',animation:'float 2s ease-in-out infinite'}}>
        A baralhar as cartas do destino...
      </p>
    </div>
  )
}

function TelaDistribuir({ cartas, posicoes, distribuindo }) {
  return (
    <div style={{padding:'30px 20px',textAlign:'center'}}>
      <style>{`@keyframes deal{from{transform:translateY(-60px) scale(0.7);opacity:0}to{transform:translateY(0) scale(1);opacity:1}}`}</style>
      <p style={{fontSize:13,color:CORES.brancoMuted,marginBottom:20}}>A distribuir as cartas...</p>
      <div style={{display:'flex',justifyContent:'center',flexWrap:'wrap',gap:10}}>
        {posicoes.map((pos,i)=>(
          <div key={i} style={{textAlign:'center',
            animation: i<=distribuindo ? 'deal 0.4s ease-out forwards' : 'none',
            opacity: i<=distribuindo ? 1 : 0.15,
          }}>
            <CartaSVG carta={i<=distribuindo ? ARCANOS[0] : ARCANOS[0]} virada size={70}/>
            <div style={{fontSize:9,color:CORES.brancoMuted,marginTop:4,width:70}}>{pos}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TelaRevelar({ cartas, reveladas, onRevelar, posicoes, tipo, pergunta, resultado, onVoltar, isPremium, onPagar }) {
  const todasReveladas = reveladas.every(Boolean)

  return (
    <div style={{padding:'20px 20px 110px'}}>
      <style>{`
        @keyframes flip3d{0%{transform:perspective(600px) rotateY(180deg)}100%{transform:perspective(600px) rotateY(0deg)}}
        @keyframes glow{0%,100%{box-shadow:0 0 10px rgba(223,183,108,0.3)}50%{box-shadow:0 0 25px rgba(223,183,108,0.6)}}
      `}</style>
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
        <button type="button" onClick={onVoltar} style={{background:'none',border:'none',color:CORES.brancoMuted,cursor:'pointer',padding:0}}>←</button>
        <h3 style={{margin:0,fontSize:17,color:CORES.dourado}}>{tipo?.nome}</h3>
      </div>
      {pergunta && (
        <div style={{background:'rgba(255,255,255,0.04)',borderRadius:10,padding:'10px 14px',marginBottom:16,fontSize:13,color:CORES.brancoMuted,fontStyle:'italic'}}>
          "{pergunta}"
        </div>
      )}

      {/* Cartas */}
      <div style={{display:'flex',justifyContent:'center',flexWrap:'wrap',gap:10,marginBottom:20}}>
        {cartas.map((c,i)=>(
          <div key={i} style={{textAlign:'center'}}>
            <div onClick={()=>onRevelar(i)} style={{
              cursor:reveladas[i]?'default':'pointer',
              animation: reveladas[i] ? 'flip3d 0.6s ease-out, glow 2s ease-in-out 0.6s 3' : 'none',
            }}>
              {reveladas[i] ? <CartaSVG carta={c} size={80}/> : <CartaSVG carta={c} virada size={80}/>}
            </div>
            <div style={{fontSize:9,color:CORES.brancoMuted,marginTop:4,width:80,lineHeight:1.3}}>
              {reveladas[i] ? (c.invertida?'↓ Inv.':'↑ Dir.') : posicoes[i]}
            </div>
          </div>
        ))}
      </div>

      {/* Dica */}
      {!todasReveladas && (
        <p style={{textAlign:'center',fontSize:12,color:CORES.brancoMuted,marginBottom:16}}>✦ Toca numa carta para a revelar</p>
      )}

      {/* Interpretações individuais após revelar */}
      {cartas.map((c,i) => reveladas[i] && (
        <div key={i} style={{background:'rgba(255,255,255,0.04)',border:`1px solid rgba(223,183,108,0.2)`,borderRadius:14,padding:18,marginBottom:12}}>
          <div style={{display:'flex',gap:14,alignItems:'flex-start',marginBottom:12}}>
            <CartaSVG carta={c} size={56}/>
            <div>
              <div style={{fontSize:8,color:CORES.brancoMuted,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:4}}>{posicoes[i]}</div>
              <div style={{fontSize:16,fontWeight:700,color:CORES.branco,lineHeight:1.2}}>
                {c.nome} {c.invertida&&<span style={{fontSize:11,color:'#EF4444'}}>Invertida</span>}
              </div>
              <div style={{display:'flex',gap:5,flexWrap:'wrap',marginTop:6}}>
                {c.palavras.map(p=>(
                  <span key={p} style={{fontSize:10,padding:'2px 8px',borderRadius:20,background:'rgba(223,183,108,0.1)',color:CORES.dourado,border:`1px solid rgba(223,183,108,0.2)`}}>{p}</span>
                ))}
              </div>
            </div>
          </div>
          <p style={{fontSize:13,color:CORES.brancoSuave,lineHeight:1.7,margin:0}}>
            {c.invertida ? c.sombra : c.luz}
          </p>
          {c.conselho && (
            <div style={{marginTop:10,padding:'8px 12px',background:'rgba(223,183,108,0.07)',borderRadius:8,borderLeft:`2px solid ${CORES.dourado}`}}>
              <p style={{fontSize:12,color:CORES.dourado,margin:0,fontStyle:'italic'}}>✦ {c.conselho}</p>
            </div>
          )}
        </div>
      ))}

      {/* Resultado final */}
      {todasReveladas && resultado && (
        <div style={{background:'rgba(223,183,108,0.06)',border:`1px solid ${CORES.dourado}`,borderRadius:16,padding:20,marginTop:8}}>
          {resultado.resposta && (
            <div style={{fontSize:28,fontWeight:700,textAlign:'center',marginBottom:12}}>{resultado.resposta}</div>
          )}
          <div style={{fontSize:13,color:CORES.brancoSuave,lineHeight:1.8,whiteSpace:'pre-wrap'}}>{resultado.detalhe}</div>
        </div>
      )}

      <button type="button" onClick={onVoltar} style={{width:'100%',marginTop:16,background:'rgba(255,255,255,0.04)',border:`1px solid rgba(255,255,255,0.1)`,borderRadius:12,color:CORES.brancoMuted,fontSize:14,padding:'12px',cursor:'pointer'}}>
        Nova leitura
      </button>
    </div>
  )
}

const btnDourado = {
  background:'linear-gradient(135deg,#DFB76C,#B8944F)',border:'none',borderRadius:12,
  color:'#0B071E',fontSize:15,fontWeight:700,padding:'14px 24px',cursor:'pointer',
}
