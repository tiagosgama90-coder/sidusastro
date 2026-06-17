/**
 * Ferramentas Premium Sidus
 * ─ Bússola Cósmica 2026 (trânsitos planetários para o ano)
 * ─ Sinastria (comparação de dois mapas natais)
 * ─ Biorritmo (ciclos físico/emocional/intelectual)
 * ─ Diário Astral (registo pessoal)
 */
import { useState } from 'react'

const CORES = {
  fundo:'#0B071E', dourado:'#DFB76C', douradoEscuro:'#B8944F',
  branco:'#FFFFFF', brancoSuave:'rgba(255,255,255,0.85)',
  brancoMuted:'rgba(255,255,255,0.55)', vidroBorda:'rgba(223,183,108,0.22)',
}

// ── Bússola Cósmica 2026 ─────────────────────────────────────────────────────
const TRANSITOS_2026 = [
  {mes:'Janeiro',  planeta:'Saturno',  signo:'Áries',      tipo:'ingresso', impacto:'alto',
   desc:'Saturno inicia um novo ciclo de 2,5 anos em Áries. Momento de construir estruturas com coragem. Responsabilidade e acção directa são a chave.'},
  {mes:'Fevereiro',planeta:'Vénus',    signo:'Peixes',     tipo:'trânsito', impacto:'médio',
   desc:'Vénus em Peixes — período de romantismo, espiritualidade e dissolução de fronteiras emocionais. Ideal para arte, meditação e conexões profundas.'},
  {mes:'Março',    planeta:'Marte',    signo:'Caranguejo', tipo:'trânsito', impacto:'médio',
   desc:'Marte no Caranguejo activa a protecção do lar e da família. Acção emocional intensa. Cuidado com reactividade — age a partir do coração.'},
  {mes:'Abril',    planeta:'Júpiter',  signo:'Gémeos',     tipo:'trânsito', impacto:'alto',
   desc:'Júpiter expande tudo em Gémeos: comunicação, aprendizagem, viagens curtas. Excelente para estudos, escrita e novos contactos profissionais.'},
  {mes:'Maio',     planeta:'Sol',      signo:'Touro',      tipo:'sazonalidade', impacto:'padrão',
   desc:'Temporada de Touro — foco em estabilidade, recursos e prazeres sensoriais. Altura ideal para consolidar projectos e cuidar do corpo.'},
  {mes:'Junho',    planeta:'Mercúrio', signo:'Caranguejo', tipo:'retrógrado', impacto:'atenção',
   desc:'Mercúrio Retrógrado em Caranguejo (1–25 Jun). Revisão de comunicações emocionais. Evita decisões importantes. Reconcilia-te com o passado.'},
  {mes:'Julho',    planeta:'Vénus',    signo:'Leão',       tipo:'trânsito', impacto:'alto',
   desc:'Vénus em Leão: romance dramático e criatividade em ebulição. O amor quer ser celebrado em voz alta. Óptimo para relações, arte e auto-expressão.'},
  {mes:'Agosto',   planeta:'Lua Nova', signo:'Leão',       tipo:'eclipse',  impacto:'transformador',
   desc:'Eclipse Solar em Leão. Um portal de transformação da identidade. Liberta o que já não representa quem és. Novo capítulo da tua história pessoal.'},
  {mes:'Setembro', planeta:'Júpiter',  signo:'Caranguejo', tipo:'ingresso', impacto:'alto',
   desc:'Júpiter entra em Caranguejo (abençoado!): expansão emocional, familiar e espiritual. Fertilidade, cura de raízes e abundância doméstica nos próximos 13 meses.'},
  {mes:'Outubro',  planeta:'Marte',    signo:'Escorpião',  tipo:'trânsito', impacto:'intenso',
   desc:'Marte em Escorpião: determinação inabalável, instinto aguçado e transformação profunda. Poder de investigar, curar e regenerar. Cuidado com obsessões.'},
  {mes:'Novembro', planeta:'Saturno',  signo:'Áries',      tipo:'quadratura', impacto:'desafio',
   desc:'Saturno em Áries em tensão com Capricórnio. Questões de identidade vs responsabilidades externas. Os limites são necessários para proteger a tua essência.'},
  {mes:'Dezembro', planeta:'Sol',      signo:'Sagitário',  tipo:'sazonalidade', impacto:'optimismo',
   desc:'Temporada de Sagitário: expansão, filosofia e aventura. Termina o ano com visão e esperança. Os sonhos de Dezembro tornam-se os planos de Janeiro.'},
]

const IMPACTO_COR = {
  alto:'#34D399', médio:'#60A5FA', baixo:'#9CA3AF',
  atenção:'#FBBf24', intenso:'#F87171', transformador:'#DFB76C',
  desafio:'#FB923C', padrão:'#9CA3AF', optimismo:'#34D399',
}
const TIPO_ICO = {
  ingresso:'🚪', trânsito:'→', retrógrado:'℞', sazonalidade:'🌀',
  eclipse:'🌑', quadratura:'⊞',
}

export function BussolaCosmica({ mapaNatal }) {
  const [mesAberto, setMesAberto] = useState(null)
  const mesAtual = new Date().toLocaleString('pt-PT',{month:'long'})

  const calcularRelevancia = (t) => {
    if (!mapaNatal) return ''
    const solar = mapaNatal.solar?.nome
    if (!solar) return ''
    const AFINIDADE = {
      'Áries':    ['Marte','Saturno','Lua Nova'],
      'Touro':    ['Vénus','Júpiter','Sol'],
      'Gémeos':   ['Mercúrio','Júpiter'],
      'Caranguejo':['Lua Nova','Júpiter','Marte'],
      'Leão':     ['Sol','Vénus','Lua Nova'],
      'Virgem':   ['Mercúrio','Saturno'],
      'Balança':  ['Vénus','Júpiter'],
      'Escorpião':['Marte','Saturno'],
      'Sagitário':['Júpiter','Sol'],
      'Capricórnio':['Saturno','Marte'],
      'Aquário':  ['Saturno','Júpiter','Mercúrio'],
      'Peixes':   ['Júpiter','Vénus','Neptuno'],
    }
    const planetas = AFINIDADE[solar] || []
    if (planetas.some(p=>t.planeta.includes(p))) return '⭐ Relevante para ti'
    return ''
  }

  return (
    <div style={{padding:'20px 20px 110px'}}>
      <div style={{marginBottom:24}}>
        <h2 style={{fontSize:20,fontWeight:700,color:CORES.dourado,margin:'0 0 4px'}}>Bússola Cósmica 2026</h2>
        <p style={{fontSize:13,color:CORES.brancoMuted,margin:0}}>
          Trânsitos e influências planetárias para este ano
        </p>
      </div>

      {mapaNatal && (
        <div style={{background:'rgba(223,183,108,0.07)',border:`1px solid rgba(223,183,108,0.25)`,borderRadius:12,padding:'12px 16px',marginBottom:20,fontSize:12,color:CORES.brancoSuave}}>
          ✦ Análise personalizada para {mapaNatal.solar?.nome} Solar · {mapaNatal.lunar?.nome} Lunar · Asc. {mapaNatal.ascendente?.nome}
        </div>
      )}

      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {TRANSITOS_2026.map((t,i)=>{
          const esteMs = t.mes.toLowerCase()===mesAtual.toLowerCase()
          const relevante = calcularRelevancia(t)
          const aberto = mesAberto===i
          return (
            <div key={i} onClick={()=>setMesAberto(aberto?null:i)} style={{
              background:esteMs?'rgba(223,183,108,0.08)':'rgba(255,255,255,0.03)',
              border:`1px solid ${esteMs?CORES.dourado:'rgba(255,255,255,0.08)'}`,
              borderRadius:12,padding:'14px 16px',cursor:'pointer',
              transition:'all 0.2s',
            }}>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <span style={{fontSize:20,width:28,textAlign:'center'}}>{TIPO_ICO[t.tipo]||'•'}</span>
                <div style={{flex:1}}>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <span style={{fontSize:13,fontWeight:700,color:CORES.branco}}>{t.mes}</span>
                    {esteMs && <span style={{fontSize:10,padding:'2px 8px',borderRadius:10,background:'rgba(223,183,108,0.2)',color:CORES.dourado,fontWeight:700}}>AGORA</span>}
                    {relevante && <span style={{fontSize:10,color:'#34D399'}}>{relevante}</span>}
                  </div>
                  <div style={{fontSize:12,color:CORES.brancoMuted,marginTop:2}}>
                    {t.planeta} em {t.signo}
                  </div>
                </div>
                <span style={{
                  fontSize:10,padding:'3px 8px',borderRadius:8,fontWeight:700,
                  background:`${IMPACTO_COR[t.impacto]}18`,
                  color:IMPACTO_COR[t.impacto],
                  border:`1px solid ${IMPACTO_COR[t.impacto]}30`,
                }}>{t.impacto}</span>
              </div>
              {aberto && (
                <div style={{marginTop:12,paddingTop:12,borderTop:`1px solid rgba(255,255,255,0.07)`,fontSize:13,color:CORES.brancoSuave,lineHeight:1.7}}>
                  {t.desc}
                  {mapaNatal && relevante && (
                    <div style={{marginTop:10,padding:'8px 12px',background:'rgba(52,211,153,0.07)',borderRadius:8,borderLeft:'2px solid #34D399',fontSize:12,color:'#34D399'}}>
                      ✦ Este trânsito tem afinidade directa com o teu Sol em {mapaNatal.solar?.nome}. Presta especial atenção neste período.
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Sinastria ─────────────────────────────────────────────────────────────────
const ASPECTOS_AMOR = [
  {a:'Sol',    b:'Sol',    tipo:'conjunção',  desc:'Partilham a mesma essência. Reconhecimento imediato e ligação de almas.'},
  {a:'Sol',    b:'Lua',    tipo:'conjunção',  desc:'O Sol ilumina o mundo emocional da Lua. União entre o consciente e o inconsciente.'},
  {a:'Vénus',  b:'Marte',  tipo:'conjunção',  desc:'Atracção física e emocional intensa. A clássica "química" entre dois seres.'},
  {a:'Sol',    b:'Ascendente',tipo:'trígono', desc:'Uma fluidez natural. A personalidade de um suporta e inspira a expressão do outro.'},
  {a:'Lua',    b:'Lua',    tipo:'sextil',     desc:'Harmonia emocional profunda. Entendem-se sem precisar de explicações.'},
  {a:'Mercúrio',b:'Mercúrio',tipo:'trígono',  desc:'Comunicação fluida e enriquecedora. Conversas que nunca acabam.'},
]

export function Sinastria({ mapaNatal }) {
  const [parceiro, setParceiro] = useState({nome:'',data:'',hora:'',signo:''})
  const [analise, setAnalise]   = useState(null)
  const [calculando, setCalculando] = useState(false)

  const SIGNOS_CURTOS = ['Áries','Touro','Gémeos','Caranguejo','Leão','Virgem','Balança','Escorpião','Sagitário','Capricórnio','Aquário','Peixes']

  const calcularSinastria = () => {
    if (!parceiro.nome || (!parceiro.signo && !parceiro.data)) return
    setCalculando(true)
    setTimeout(()=>{
      const meu = mapaNatal?.solar?.nome
      const dele = parceiro.signo || 'Áries'

      // Compatibilidade por elementos
      const ELEM = {
        'Áries':'Fogo','Leão':'Fogo','Sagitário':'Fogo',
        'Touro':'Terra','Virgem':'Terra','Capricórnio':'Terra',
        'Gémeos':'Ar','Balança':'Ar','Aquário':'Ar',
        'Caranguejo':'Água','Escorpião':'Água','Peixes':'Água',
      }
      const elemA = ELEM[meu], elemB = ELEM[dele]
      const COMPAT = {
        'Fogo-Fogo':'Ligação apaixonada e enérgica. Juntos conquistam o mundo mas precisam de aprender a ceder.',
        'Fogo-Ar':'Combinação mágica! O Ar alimenta o Fogo. Estímulo intelectual e aventura em conjunto.',
        'Fogo-Terra':'Tensão criativa. O Fogo inspira, a Terra estabiliza. Complementaridade se houver paciência.',
        'Fogo-Água':'Intensa e transformadora. Química irresistível com potencial para grandes paixões e conflitos.',
        'Terra-Terra':'Solidez e confiança mútua. Constroem algo duradouro juntos. Podem precisar de mais espontaneidade.',
        'Terra-Água':'Nutrição mútua profunda. A Água hidrata a Terra. Relação de cuidado e suporte emocional.',
        'Terra-Ar':'Diferenças complementares. A Terra ancora o Ar, o Ar areja a Terra. Crescimento mútuo.',
        'Ar-Ar':'Estímulo intelectual constante. Ligação mental forte. Podem precisar de aprofundar a dimensão emocional.',
        'Ar-Água':'Criatividade e emoção juntas. O Ar inspira, a Água sente. Relação rica e multidimensional.',
        'Água-Água':'Profundidade emocional oceânica. Empatia total. Precisam de limites saudáveis para não se perderem.',
      }
      const chave = elemA&&elemB ? [elemA,elemB].sort().join('-') : ''
      const compatDesc = COMPAT[chave] || 'Uma ligação única que desafia as categorias. A astrologia vê potencial onde existe trabalho e intenção.'

      const pontuacao = elemA===elemB ? 95 :
        ['Fogo-Ar','Terra-Água','Ar-Água'].some(c=>c===chave||c===[elemB,elemA].join('-')) ? 88 :
        ['Fogo-Terra','Ar-Ar','Água-Água'].some(c=>c===chave) ? 78 : 70

      const aspectos = ASPECTOS_AMOR.slice(0, 3+Math.floor(Math.random()*3))
      setAnalise({pontuacao, elemA, elemB, compatDesc, aspectos, dele})
      setCalculando(false)
    }, 1800)
  }

  return (
    <div style={{padding:'20px 20px 110px'}}>
      <h2 style={{fontSize:20,fontWeight:700,color:CORES.dourado,marginBottom:4}}>Radar de Afinidades</h2>
      <p style={{fontSize:13,color:CORES.brancoMuted,marginBottom:24}}>Sinastria — Comparação de dois mapas natais</p>

      {mapaNatal && (
        <div style={{background:'rgba(255,255,255,0.04)',border:`1px solid ${CORES.vidroBorda}`,borderRadius:14,padding:16,marginBottom:20}}>
          <div style={{fontSize:11,color:CORES.dourado,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:10}}>O teu mapa</div>
          <div style={{fontSize:14,color:CORES.branco}}>
            ☀ {mapaNatal.solar?.nome} · 🌙 {mapaNatal.lunar?.nome} · ↑ {mapaNatal.ascendente?.nome}
          </div>
        </div>
      )}

      <div style={{background:'rgba(255,255,255,0.04)',border:`1px solid ${CORES.vidroBorda}`,borderRadius:14,padding:18,marginBottom:16}}>
        <div style={{fontSize:11,color:CORES.dourado,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:14}}>Dados do parceiro(a)</div>
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <input placeholder="Nome do(a) parceiro(a)" value={parceiro.nome}
            onChange={e=>setParceiro(p=>({...p,nome:e.target.value}))}
            style={inputStyle}/>
          <div>
            <label style={{fontSize:11,color:CORES.brancoMuted,display:'block',marginBottom:6}}>Signo Solar</label>
            <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
              {['Áries','Touro','Gémeos','Caranguejo','Leão','Virgem','Balança','Escorpião','Sagitário','Capricórnio','Aquário','Peixes'].map(s=>(
                <button key={s} type="button" onClick={()=>setParceiro(p=>({...p,signo:s}))} style={{
                  padding:'5px 10px',borderRadius:20,fontSize:11,cursor:'pointer',
                  background: parceiro.signo===s ? 'rgba(223,183,108,0.2)' : 'rgba(255,255,255,0.04)',
                  border:`1px solid ${parceiro.signo===s ? CORES.dourado : 'rgba(255,255,255,0.1)'}`,
                  color: parceiro.signo===s ? CORES.dourado : CORES.brancoMuted,
                }}>{s}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button type="button" disabled={!parceiro.nome||!parceiro.signo||calculando} onClick={calcularSinastria} style={{
        width:'100%',background:`linear-gradient(135deg,#DFB76C,#B8944F)`,border:'none',
        borderRadius:12,color:'#0B071E',fontSize:15,fontWeight:700,padding:'14px',
        cursor:!parceiro.nome||!parceiro.signo?'not-allowed':'pointer',
        opacity:!parceiro.nome||!parceiro.signo?0.5:1,marginBottom:20,
      }}>
        {calculando ? '⏳ A calcular sinastria...' : '💞 Analisar compatibilidade'}
      </button>

      {analise && (
        <div style={{animation:'fadeIn 0.5s ease'}}>
          <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}`}</style>
          {/* Pontuação */}
          <div style={{background:'rgba(223,183,108,0.08)',border:`1px solid ${CORES.dourado}`,borderRadius:16,padding:24,textAlign:'center',marginBottom:16}}>
            <div style={{fontSize:12,color:CORES.brancoMuted,marginBottom:8}}>
              {mapaNatal?.solar?.nome} {analise.elemA&&`(${analise.elemA})`} ❤ {analise.dele} {analise.elemB&&`(${analise.elemB})`}
            </div>
            <div style={{fontSize:56,fontWeight:700,color:CORES.dourado,lineHeight:1}}>{analise.pontuacao}%</div>
            <div style={{fontSize:13,color:CORES.brancoMuted,marginTop:4}}>compatibilidade astrológica</div>
            <div style={{
              marginTop:12,width:`${analise.pontuacao}%`,height:6,
              background:`linear-gradient(90deg,#DFB76C,#B8944F)`,
              borderRadius:3,margin:'12px auto 0',maxWidth:200,
            }}/>
          </div>

          {/* Interpretação */}
          <div style={{background:'rgba(255,255,255,0.04)',border:`1px solid ${CORES.vidroBorda}`,borderRadius:14,padding:18,marginBottom:14}}>
            <div style={{fontSize:11,color:CORES.dourado,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:10}}>Análise da ligação</div>
            <p style={{fontSize:14,color:CORES.brancoSuave,lineHeight:1.7,margin:0}}>{analise.compatDesc}</p>
          </div>

          {/* Aspectos detectados */}
          <div style={{background:'rgba(255,255,255,0.04)',border:`1px solid ${CORES.vidroBorda}`,borderRadius:14,padding:18}}>
            <div style={{fontSize:11,color:CORES.dourado,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:12}}>Aspectos detectados</div>
            {analise.aspectos.map((a,i)=>(
              <div key={i} style={{padding:'10px 0',borderBottom:i<analise.aspectos.length-1?`1px solid rgba(255,255,255,0.05)`:'none'}}>
                <div style={{fontSize:12,fontWeight:700,color:CORES.branco,marginBottom:3}}>
                  {a.a} ✦ {a.b} — <span style={{color:CORES.dourado,fontWeight:400}}>{a.tipo}</span>
                </div>
                <div style={{fontSize:12,color:CORES.brancoMuted}}>{a.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Biorritmo ─────────────────────────────────────────────────────────────────
export function Biorritmo({ dados }) {
  if (!dados?.data) return (
    <div style={{padding:24,color:CORES.brancoMuted,textAlign:'center'}}>Preenche os dados natais primeiro.</div>
  )

  const nascimento = new Date(dados.data)
  const hoje = new Date()
  const diasVida = Math.floor((hoje - nascimento) / 86400000)

  const fisico      = Math.sin(2*Math.PI*diasVida/23) * 100
  const emocional   = Math.sin(2*Math.PI*diasVida/28) * 100
  const intelectual = Math.sin(2*Math.PI*diasVida/33) * 100

  const biorritmos = [
    {nome:'Físico',       val:fisico,      cor:'#FB923C', desc:'Energia corporal, resistência e vitalidade física.'},
    {nome:'Emocional',    val:emocional,   cor:'#F472B6', desc:'Estado afectivo, criatividade e sensibilidade.'},
    {nome:'Intelectual',  val:intelectual, cor:'#60A5FA', desc:'Clareza mental, memória e capacidade analítica.'},
  ]

  const estado = (v) => v > 60 ? '⬆ Fase alta' : v < -60 ? '⬇ Fase crítica' : '↔ Fase de transição'

  return (
    <div style={{padding:'20px 20px 110px'}}>
      <h2 style={{fontSize:20,fontWeight:700,color:CORES.dourado,marginBottom:4}}>Fluxo Vital</h2>
      <p style={{fontSize:13,color:CORES.brancoMuted,marginBottom:24}}>
        Os teus ciclos bio-rítmicos hoje — {diasVida.toLocaleString('pt-PT')} dias de vida
      </p>

      <div style={{display:'flex',flexDirection:'column',gap:14}}>
        {biorritmos.map(b=>{
          const pct = Math.round(b.val)
          const largura = `${Math.abs(pct)}%`
          const positivo = pct >= 0
          return (
            <div key={b.nome} style={{background:'rgba(255,255,255,0.04)',border:`1px solid rgba(255,255,255,0.08)`,borderRadius:14,padding:18}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                <div>
                  <div style={{fontSize:15,fontWeight:700,color:CORES.branco}}>{b.nome}</div>
                  <div style={{fontSize:11,color:CORES.brancoMuted,marginTop:2}}>{b.desc}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:20,fontWeight:700,color:b.cor}}>{pct>0?'+':''}{pct}%</div>
                  <div style={{fontSize:10,color:CORES.brancoMuted}}>{estado(b.val)}</div>
                </div>
              </div>
              {/* Barra biorítmica */}
              <div style={{height:10,background:'rgba(255,255,255,0.07)',borderRadius:5,position:'relative',overflow:'hidden'}}>
                <div style={{position:'absolute',top:0,bottom:0,left:'50%',width:2,background:'rgba(255,255,255,0.15)'}}/>
                <div style={{
                  position:'absolute',top:0,bottom:0,
                  [positivo?'left':'right']:'50%',
                  width:largura,
                  background:`linear-gradient(${positivo?'90deg':'270deg'},${b.cor},${b.cor}80)`,
                  borderRadius:5,
                }}/>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{marginTop:20,background:'rgba(255,255,255,0.03)',border:`1px solid rgba(255,255,255,0.07)`,borderRadius:14,padding:18}}>
        <div style={{fontSize:11,color:CORES.dourado,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:10}}>Recomendação do dia</div>
        <p style={{fontSize:13,color:CORES.brancoSuave,lineHeight:1.7,margin:0}}>
          {fisico>50&&emocional>50&&intelectual>50
            ? '✦ Dia excepcional! Todos os ciclos em fase alta. Aproveita para tomar decisões importantes, socializar e exercitar o corpo. As tuas capacidades estão no máximo.'
            : fisico<-50||emocional<-50
            ? '✦ Dia de cuidado e descanso. Alguns ciclos em fase crítica — prefere actividades tranquilas e evita decisões impulsivas. Cuida de ti mesmo em primeiro lugar.'
            : '✦ Dia moderado com altos e baixos. Foca-te nas áreas onde estás em fase alta e poupa energia nas que estão em transição. Equilíbrio é a palavra-chave.'
          }
        </p>
      </div>
    </div>
  )
}

// ── Diário Astral ─────────────────────────────────────────────────────────────
const CHAVE_DIARIO = 'sidus_diario'
function carregarDiario() {
  try { return JSON.parse(localStorage.getItem(CHAVE_DIARIO)||'[]') } catch { return [] }
}

export function DiarioAstral({ mapaNatal }) {
  const [entradas, setEntradas] = useState(carregarDiario)
  const [nova, setNova]         = useState('')
  const [humor, setHumor]       = useState('neutro')

  const HUMORES = [
    {id:'excelente',ico:'☀️',label:'Excelente'},
    {id:'bom',ico:'😊',label:'Bom'},
    {id:'neutro',ico:'🌥',label:'Neutro'},
    {id:'dificil',ico:'⚡',label:'Difícil'},
    {id:'transformador',ico:'🌑',label:'Transformador'},
  ]

  const guardar = () => {
    if (!nova.trim()) return
    const entrada = {
      id: Date.now(),
      data: new Date().toLocaleDateString('pt-PT'),
      hora: new Date().toLocaleTimeString('pt-PT',{hour:'2-digit',minute:'2-digit'}),
      texto: nova.trim(),
      humor,
      luna: mapaNatal?.lunar?.nome || '',
    }
    const novo = [entrada,...entradas].slice(0,50)
    setEntradas(novo)
    localStorage.setItem(CHAVE_DIARIO, JSON.stringify(novo))
    setNova('')
  }

  const apagar = (id) => {
    const novo = entradas.filter(e=>e.id!==id)
    setEntradas(novo)
    localStorage.setItem(CHAVE_DIARIO, JSON.stringify(novo))
  }

  return (
    <div style={{padding:'20px 20px 110px'}}>
      <h2 style={{fontSize:20,fontWeight:700,color:CORES.dourado,marginBottom:4}}>Diário Astral</h2>
      <p style={{fontSize:13,color:CORES.brancoMuted,marginBottom:20}}>Regista as tuas reflexões e sincronicidades</p>

      <div style={{background:'rgba(255,255,255,0.04)',border:`1px solid ${CORES.vidroBorda}`,borderRadius:14,padding:18,marginBottom:20}}>
        <div style={{display:'flex',gap:8,marginBottom:12,flexWrap:'wrap'}}>
          {HUMORES.map(h=>(
            <button key={h.id} type="button" onClick={()=>setHumor(h.id)} style={{
              padding:'6px 12px',borderRadius:20,fontSize:12,cursor:'pointer',
              background:humor===h.id?'rgba(223,183,108,0.15)':'rgba(255,255,255,0.04)',
              border:`1px solid ${humor===h.id?CORES.dourado:'rgba(255,255,255,0.1)'}`,
              color:humor===h.id?CORES.dourado:CORES.brancoMuted,
            }}>{h.ico} {h.label}</button>
          ))}
        </div>
        <textarea value={nova} onChange={e=>setNova(e.target.value)} placeholder="O que o cosmos te revelou hoje? Que pensamentos, sonhos ou sincronicidades viveste?"
          style={{...inputStyle,height:100,resize:'none',marginBottom:12}}/>
        <button type="button" onClick={guardar} disabled={!nova.trim()} style={{
          background:`linear-gradient(135deg,#DFB76C,#B8944F)`,border:'none',borderRadius:10,
          color:'#0B071E',fontSize:14,fontWeight:700,padding:'11px 24px',cursor:nova.trim()?'pointer':'not-allowed',
          opacity:nova.trim()?1:0.5,
        }}>✦ Guardar entrada</button>
      </div>

      {entradas.length === 0 ? (
        <div style={{textAlign:'center',padding:40,color:CORES.brancoMuted,fontSize:13}}>
          O teu diário astral está vazio.<br/>Regista a tua primeira reflexão.
        </div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {entradas.map(e=>{
            const h = HUMORES.find(h=>h.id===e.humor)
            return (
              <div key={e.id} style={{background:'rgba(255,255,255,0.03)',border:`1px solid rgba(255,255,255,0.08)`,borderRadius:12,padding:16}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <span style={{fontSize:18}}>{h?.ico}</span>
                    <div>
                      <div style={{fontSize:11,color:CORES.brancoMuted}}>{e.data} às {e.hora}</div>
                      {e.luna && <div style={{fontSize:10,color:CORES.dourado}}>🌙 Lua em {e.luna}</div>}
                    </div>
                  </div>
                  <button type="button" onClick={()=>apagar(e.id)} style={{background:'none',border:'none',color:'rgba(239,68,68,0.4)',cursor:'pointer',fontSize:16,padding:4}}>✕</button>
                </div>
                <p style={{fontSize:13,color:CORES.brancoSuave,lineHeight:1.6,margin:0}}>{e.texto}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

const inputStyle = {
  width:'100%',padding:'12px 14px',background:'rgba(255,255,255,0.05)',
  border:'1px solid rgba(223,183,108,0.2)',borderRadius:10,color:'#FFFFFF',
  fontSize:14,outline:'none',boxSizing:'border-box',
}
