/**
 * Ferramentas Premium Sidus
 * ─ Bússola Cósmica 2026 (trânsitos planetários para o ano)
 * ─ Sinastria (comparação de dois mapas natais)
 * ─ Biorritmo (ciclos físico/emocional/intelectual)
 * ─ Diário Astral (registo pessoal)
 */
import { useState } from 'react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import {
  getTransitos2026, getCompatDesc, getAspectosAmor, SIGNOS_LIST, ELEM,
  TIPO_ICO, IMPACTO_COR,
} from '../lib/i18n/ferramentasPremiumData.js'
import { diasVidaDesdeNascimento } from '../lib/datetime.js'
import { calcularMapaNumerologia } from '../lib/numerologia.js'
import { interpretarSonho } from '../lib/sonhosInterpretacao.js'

function BotaoVoltar({ onVoltar, t }) {
  if (!onVoltar) return null
  return (
    <button type="button" onClick={onVoltar} style={{
      background: 'none', border: 'none', color: CORES.dourado, cursor: 'pointer',
      marginBottom: 14, fontSize: 13, padding: 0,
    }}>
      {t('common.back')}
    </button>
  )
}

const CORES = {
  fundo:'#0B071E', dourado:'#DFB76C', douradoEscuro:'#B8944F',
  branco:'#FFFFFF', brancoSuave:'rgba(255,255,255,0.85)',
  brancoMuted:'rgba(255,255,255,0.55)', vidroBorda:'rgba(223,183,108,0.22)',
}

export function BussolaCosmica({ mapaNatal }) {
  const { lang, t, ts, tp } = useLanguage()
  const [mesAberto, setMesAberto] = useState(null)
  const locale = lang === 'en' ? 'en-US' : 'pt-PT'
  const mesAtual = new Date().toLocaleString(locale, { month: 'long' })
  const TRANSITOS_2026 = getTransitos2026(lang)

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
    if (planetas.some(p=>t.planeta.includes(p))) return t('ferramentasPremium.bussola.relevant')
    return ''
  }

  return (
    <div style={{padding:'20px 20px 110px'}}>
      <div style={{marginBottom:24}}>
        <h2 style={{fontSize:20,fontWeight:700,color:CORES.dourado,margin:'0 0 4px'}}>{t('ferramentasPremium.bussola.title')}</h2>
        <p style={{fontSize:13,color:CORES.brancoMuted,margin:0}}>
          {t('ferramentasPremium.bussola.subtitle')}
        </p>
      </div>

      {mapaNatal && (
        <div style={{background:'rgba(223,183,108,0.07)',border:`1px solid rgba(223,183,108,0.25)`,borderRadius:12,padding:'12px 16px',marginBottom:20,fontSize:12,color:CORES.brancoSuave}}>
          {t('ferramentasPremium.bussola.personalized', {
            solar: ts(mapaNatal.solar?.nome),
            lunar: ts(mapaNatal.lunar?.nome),
            asc: ts(mapaNatal.ascendente?.nome),
          })}
        </div>
      )}

      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {TRANSITOS_2026.map((transito,i)=>{
          const esteMs = transito.mes.toLowerCase()===mesAtual.toLowerCase()
          const relevante = calcularRelevancia(transito)
          const aberto = mesAberto===i
          return (
            <div key={i} onClick={()=>setMesAberto(aberto?null:i)} style={{
              background:esteMs?'rgba(223,183,108,0.08)':'rgba(255,255,255,0.03)',
              border:`1px solid ${esteMs?CORES.dourado:'rgba(255,255,255,0.08)'}`,
              borderRadius:12,padding:'14px 16px',cursor:'pointer',
              transition:'all 0.2s',
            }}>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <span style={{fontSize:20,width:28,textAlign:'center'}}>{TIPO_ICO[transito.tipo]||'•'}</span>
                <div style={{flex:1}}>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <span style={{fontSize:13,fontWeight:700,color:CORES.branco}}>{transito.mes}</span>
                    {esteMs && <span style={{fontSize:10,padding:'2px 8px',borderRadius:10,background:'rgba(223,183,108,0.2)',color:CORES.dourado,fontWeight:700}}>{t('common.now')}</span>}
                    {relevante && <span style={{fontSize:10,color:'#34D399'}}>{relevante}</span>}
                  </div>
                  <div style={{fontSize:12,color:CORES.brancoMuted,marginTop:2}}>
                    {tp(transito.planeta)} {lang === 'en' ? 'in' : 'em'} {ts(transito.signo)}
                  </div>
                </div>
                <span style={{
                  fontSize:10,padding:'3px 8px',borderRadius:8,fontWeight:700,
                  background:`${IMPACTO_COR[transito.impacto]}18`,
                  color:IMPACTO_COR[transito.impacto],
                  border:`1px solid ${IMPACTO_COR[transito.impacto]}30`,
                }}>{transito.impactoLabel}</span>
              </div>
              {aberto && (
                <div style={{marginTop:12,paddingTop:12,borderTop:`1px solid rgba(255,255,255,0.07)`,fontSize:13,color:CORES.brancoSuave,lineHeight:1.7}}>
                  {transito.desc}
                  {mapaNatal && relevante && (
                    <div style={{marginTop:10,padding:'8px 12px',background:'rgba(52,211,153,0.07)',borderRadius:8,borderLeft:'2px solid #34D399',fontSize:12,color:'#34D399'}}>
                      {t('ferramentasPremium.bussola.affinity', { signo: ts(mapaNatal.solar?.nome) })}
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

// ── Sinastria (Radar de Afinidades) ───────────────────────────────────────────
const MODAL = {
  'Áries': 'Cardinal', 'Caranguejo': 'Cardinal', 'Balança': 'Cardinal', 'Capricórnio': 'Cardinal',
  'Touro': 'Fixo', 'Leão': 'Fixo', 'Escorpião': 'Fixo', 'Aquário': 'Fixo',
  'Gémeos': 'Mutável', 'Virgem': 'Mutável', 'Sagitário': 'Mutável', 'Peixes': 'Mutável',
}

function scoreDimensao(elemA, elemB, tipo) {
  const par = [elemA, elemB].sort().join('-')
  const tabelas = {
    passion: { 'Fogo-Fogo': 95, 'Fogo-Água': 88, 'Fogo-Ar': 82, 'Fogo-Terra': 70, 'Água-Água': 75, 'Ar-Ar': 65, 'Terra-Terra': 60 },
    emotional: { 'Água-Água': 96, 'Água-Terra': 90, 'Fogo-Água': 85, 'Ar-Água': 80, 'Terra-Terra': 72, 'Fogo-Fogo': 68 },
    communication: { 'Ar-Ar': 95, 'Fogo-Ar': 90, 'Ar-Água': 85, 'Terra-Ar': 78, 'Fogo-Fogo': 70, 'Terra-Terra': 65 },
    stability: { 'Terra-Terra': 94, 'Terra-Água': 88, 'Terra-Ar': 75, 'Fogo-Terra': 68, 'Água-Água': 70, 'Ar-Ar': 55 },
  }
  const rev = [elemB, elemA].sort().join('-')
  return tabelas[tipo]?.[par] ?? tabelas[tipo]?.[rev] ?? 72
}

export function Sinastria({ mapaNatal, onVoltar }) {
  const { lang, t, ts, te } = useLanguage()
  const [parceiro, setParceiro] = useState({nome:'',data:'',hora:'',signo:''})
  const [analise, setAnalise]   = useState(null)
  const [calculando, setCalculando] = useState(false)

  const calcularSinastria = () => {
    if (!parceiro.nome || (!parceiro.signo && !parceiro.data)) return
    setCalculando(true)
    setTimeout(()=>{
      const meuSol = mapaNatal?.solar?.nome
      const meuLua = mapaNatal?.lunar?.nome
      const meuAsc = mapaNatal?.ascendente?.nome
      const dele = parceiro.signo || 'Áries'

      const elemA = ELEM[meuSol], elemB = ELEM[dele]
      const elemLuaA = ELEM[meuLua], elemLuaB = elemB
      const chave = elemA&&elemB ? [elemA,elemB].sort().join('-') : ''
      const compatDesc = getCompatDesc(chave, lang, t('ferramentasPremium.sinastria.uniqueBond'))

      const pontuacao = elemA===elemB ? 95 :
        ['Fogo-Ar','Terra-Água','Ar-Água'].some(c=>c===chave||c===[elemB,elemA].join('-')) ? 88 :
        ['Fogo-Terra','Ar-Ar','Água-Água'].some(c=>c===chave) ? 78 : 70

      const aspectos = getAspectosAmor(lang).slice(0, 5 + Math.floor(Math.random() * 3))
      const passion = scoreDimensao(elemA, elemB, 'passion')
      const emotional = scoreDimensao(elemLuaA || elemA, elemLuaB, 'emotional')
      const communication = scoreDimensao(elemA, elemB, 'communication')
      const stability = scoreDimensao(elemA, elemB, 'stability')
      const modalA = MODAL[meuSol], modalB = MODAL[dele]
      const modalNote = modalA === modalB
        ? t('ferramentasPremium.sinastria.modalSame', { mod: modalA })
        : t('ferramentasPremium.sinastria.modalDiff', { a: modalA, b: modalB })

      const luaNote = elemLuaA && elemLuaB
        ? (elemLuaA === elemLuaB
          ? t('ferramentasPremium.sinastria.moonHarmony')
          : t('ferramentasPremium.sinastria.moonTension', { mine: te(elemLuaA), theirs: te(elemLuaB) }))
        : ''

      const challenge = pontuacao >= 85
        ? t('ferramentasPremium.sinastria.challengeHigh')
        : t('ferramentasPremium.sinastria.challengeMid')
      const growth = t('ferramentasPremium.sinastria.growth', {
        solar: ts(meuSol || '—'), partner: ts(dele),
      })

      setAnalise({
        pontuacao, elemA, elemB, compatDesc, aspectos, dele,
        passion, emotional, communication, stability,
        modalNote, luaNote, challenge, growth,
        meuSol, meuLua, meuAsc,
      })
      setCalculando(false)
    }, 1800)
  }

  const DimBar = ({ label, val, cor }) => (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
        <span style={{ color: CORES.brancoSuave }}>{label}</span>
        <span style={{ color: cor, fontWeight: 700 }}>{val}%</span>
      </div>
      <div style={{ height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 3 }}>
        <div style={{ height: '100%', width: `${val}%`, background: cor, borderRadius: 3 }} />
      </div>
    </div>
  )

  return (
    <div style={{padding:'20px 20px 110px'}}>
      <BotaoVoltar onVoltar={onVoltar} t={t} />
      <h2 style={{fontSize:20,fontWeight:700,color:CORES.dourado,marginBottom:4}}>{t('ferramentasPremium.sinastria.title')}</h2>
      <p style={{fontSize:13,color:CORES.brancoMuted,marginBottom:24}}>{t('ferramentasPremium.sinastria.subtitle')}</p>

      {mapaNatal && (
        <div style={{background:'rgba(255,255,255,0.04)',border:`1px solid ${CORES.vidroBorda}`,borderRadius:14,padding:16,marginBottom:20}}>
          <div style={{fontSize:11,color:CORES.dourado,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:10}}>{t('ferramentasPremium.sinastria.yourChart')}</div>
          <div style={{fontSize:14,color:CORES.branco}}>
            ☀ {ts(mapaNatal.solar?.nome)} · 🌙 {ts(mapaNatal.lunar?.nome)} · ↑ {ts(mapaNatal.ascendente?.nome)}
          </div>
        </div>
      )}

      <div style={{background:'rgba(255,255,255,0.04)',border:`1px solid ${CORES.vidroBorda}`,borderRadius:14,padding:18,marginBottom:16}}>
        <div style={{fontSize:11,color:CORES.dourado,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:14}}>{t('ferramentasPremium.sinastria.partnerData')}</div>
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <input placeholder={t('ferramentasPremium.sinastria.partnerName')} value={parceiro.nome}
            onChange={e=>setParceiro(p=>({...p,nome:e.target.value}))}
            style={inputStyle}/>
          <div>
            <label style={{fontSize:11,color:CORES.brancoMuted,display:'block',marginBottom:6}}>{t('ferramentasPremium.sinastria.solarSign')}</label>
            <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
              {SIGNOS_LIST.map(s=>(
                <button key={s} type="button" onClick={()=>setParceiro(p=>({...p,signo:s}))} style={{
                  padding:'5px 10px',borderRadius:20,fontSize:11,cursor:'pointer',
                  background: parceiro.signo===s ? 'rgba(223,183,108,0.2)' : 'rgba(255,255,255,0.04)',
                  border:`1px solid ${parceiro.signo===s ? CORES.dourado : 'rgba(255,255,255,0.1)'}`,
                  color: parceiro.signo===s ? CORES.dourado : CORES.brancoMuted,
                }}>{ts(s)}</button>
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
        {calculando ? t('ferramentasPremium.sinastria.calculating') : t('ferramentasPremium.sinastria.analyze')}
      </button>

      {analise && (
        <div style={{animation:'fadeIn 0.5s ease'}}>
          <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}`}</style>
          <div style={{background:'rgba(223,183,108,0.08)',border:`1px solid ${CORES.dourado}`,borderRadius:16,padding:24,textAlign:'center',marginBottom:16}}>
            <div style={{fontSize:12,color:CORES.brancoMuted,marginBottom:8}}>
              {ts(mapaNatal?.solar?.nome)} {analise.elemA&&`(${te(analise.elemA)})`} ❤ {ts(analise.dele)} {analise.elemB&&`(${te(analise.elemB)})`}
            </div>
            <div style={{fontSize:56,fontWeight:700,color:CORES.dourado,lineHeight:1}}>{analise.pontuacao}%</div>
            <div style={{fontSize:13,color:CORES.brancoMuted,marginTop:4}}>{t('ferramentasPremium.sinastria.compatibility')}</div>
            <div style={{
              marginTop:12,width:`${analise.pontuacao}%`,height:6,
              background:`linear-gradient(90deg,#DFB76C,#B8944F)`,
              borderRadius:3,margin:'12px auto 0',maxWidth:200,
            }}/>
          </div>

          <div style={{background:'rgba(255,255,255,0.04)',border:`1px solid ${CORES.vidroBorda}`,borderRadius:14,padding:18,marginBottom:14}}>
            <div style={{fontSize:11,color:CORES.dourado,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:12}}>{t('ferramentasPremium.sinastria.dimensions')}</div>
            <DimBar label={t('ferramentasPremium.sinastria.passion')} val={analise.passion} cor="#F87171" />
            <DimBar label={t('ferramentasPremium.sinastria.emotional')} val={analise.emotional} cor="#818CF8" />
            <DimBar label={t('ferramentasPremium.sinastria.communication')} val={analise.communication} cor="#60A5FA" />
            <DimBar label={t('ferramentasPremium.sinastria.stability')} val={analise.stability} cor="#4ADE80" />
          </div>

          <div style={{background:'rgba(255,255,255,0.04)',border:`1px solid ${CORES.vidroBorda}`,borderRadius:14,padding:18,marginBottom:14}}>
            <div style={{fontSize:11,color:CORES.dourado,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:10}}>{t('ferramentasPremium.sinastria.connectionAnalysis')}</div>
            <p style={{fontSize:14,color:CORES.brancoSuave,lineHeight:1.7,margin:'0 0 12px'}}>{analise.compatDesc}</p>
            {analise.luaNote && <p style={{fontSize:13,color:CORES.brancoMuted,lineHeight:1.6,margin:'0 0 10px'}}>{analise.luaNote}</p>}
            <p style={{fontSize:13,color:CORES.brancoMuted,lineHeight:1.6,margin:'0 0 10px'}}>{analise.modalNote}</p>
            <p style={{fontSize:13,color:'#34D399',lineHeight:1.6,margin:0}}>{analise.growth}</p>
          </div>

          <div style={{background:'rgba(248,113,113,0.06)',border:'1px solid rgba(248,113,113,0.25)',borderRadius:14,padding:16,marginBottom:14}}>
            <div style={{fontSize:11,color:'#F87171',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:8}}>{t('ferramentasPremium.sinastria.challenges')}</div>
            <p style={{fontSize:13,color:CORES.brancoSuave,lineHeight:1.6,margin:0}}>{analise.challenge}</p>
          </div>

          <div style={{background:'rgba(255,255,255,0.04)',border:`1px solid ${CORES.vidroBorda}`,borderRadius:14,padding:18}}>
            <div style={{fontSize:11,color:CORES.dourado,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:12}}>{t('ferramentasPremium.sinastria.aspectsDetected')}</div>
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

// ── Biorritmo (Fluxo Vital) ───────────────────────────────────────────────────
const CICLO_FISICO = 23
const CICLO_EMOCIONAL = 28
const CICLO_INTELECTUAL = 33

function valorBiorritmo(diasVida, ciclo) {
  return Math.sin((2 * Math.PI * diasVida) / ciclo) * 100
}

export function Biorritmo({ dados, mapaNatal, onVoltar }) {
  const { lang, t, ts } = useLanguage()
  const diasVida = diasVidaDesdeNascimento(dados)

  if (diasVida == null || diasVida < 0) return (
    <div style={{ padding: 24 }}>
      <BotaoVoltar onVoltar={onVoltar} t={t} />
      <p style={{ color: CORES.brancoMuted, textAlign: 'center' }}>{t('ferramentasPremium.biorritmo.fillNatal')}</p>
    </div>
  )

  const fisico = valorBiorritmo(diasVida, CICLO_FISICO)
  const emocional = valorBiorritmo(diasVida, CICLO_EMOCIONAL)
  const intelectual = valorBiorritmo(diasVida, CICLO_INTELECTUAL)
  const diasVidaInt = Math.floor(diasVida)

  const biorritmos = [
    {nome: t('ferramentasPremium.biorritmo.physical'),       val:fisico,      cor:'#FB923C', desc: t('ferramentasPremium.biorritmo.physicalDesc')},
    {nome: t('ferramentasPremium.biorritmo.emotional'),    val:emocional,   cor:'#F472B6', desc: t('ferramentasPremium.biorritmo.emotionalDesc')},
    {nome: t('ferramentasPremium.biorritmo.intellectual'),  val:intelectual, cor:'#60A5FA', desc: t('ferramentasPremium.biorritmo.intellectualDesc')},
  ]

  const estado = (v) => v > 60 ? t('ferramentasPremium.biorritmo.phaseHigh') : v < -60 ? t('ferramentasPremium.biorritmo.phaseCritical') : t('ferramentasPremium.biorritmo.phaseTransition')

  const locale = lang === 'en' ? 'en-US' : 'pt-PT'

  return (
    <div style={{ padding: '20px 20px 110px' }}>
      <BotaoVoltar onVoltar={onVoltar} t={t} />
      <h2 style={{ fontSize: 20, fontWeight: 700, color: CORES.dourado, marginBottom: 4 }}>{t('ferramentasPremium.biorritmo.title')}</h2>
      <p style={{ fontSize: 13, color: CORES.brancoMuted, marginBottom: 12 }}>
        {t('ferramentasPremium.biorritmo.subtitle', { days: diasVidaInt.toLocaleString(locale) })}
      </p>
      {dados?.hora && (
        <p style={{ fontSize: 11, color: CORES.brancoMuted, marginBottom: 16, lineHeight: 1.5 }}>
          {t('ferramentasPremium.biorritmo.precisionNote', { time: dados.hora })}
        </p>
      )}
      {mapaNatal?.solar?.nome && (
        <div style={{
          background: 'rgba(223,183,108,0.07)', border: `1px solid rgba(223,183,108,0.25)`,
          borderRadius: 12, padding: '10px 14px', marginBottom: 20, fontSize: 12, color: CORES.brancoSuave,
        }}>
          {t('ferramentasPremium.biorritmo.astroContext', {
            solar: ts(mapaNatal.solar.nome),
            lunar: ts(mapaNatal.lunar?.nome || '—'),
          })}
        </div>
      )}

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
        <div style={{fontSize:11,color:CORES.dourado,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:10}}>{t('ferramentasPremium.biorritmo.recommendation')}</div>
        <p style={{fontSize:13,color:CORES.brancoSuave,lineHeight:1.7,margin:0}}>
          {fisico>50&&emocional>50&&intelectual>50
            ? t('ferramentasPremium.biorritmo.dayExceptional')
            : fisico<-50||emocional<-50
            ? t('ferramentasPremium.biorritmo.dayRest')
            : t('ferramentasPremium.biorritmo.dayModerate')
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
  const { lang, t, ts } = useLanguage()
  const [entradas, setEntradas] = useState(carregarDiario)
  const [nova, setNova]         = useState('')
  const [humor, setHumor]       = useState('neutro')

  const HUMORES = [
    {id:'excelente',ico:'☀️',label: t('ferramentasPremium.diario.moods.excelente')},
    {id:'bom',ico:'😊',label: t('ferramentasPremium.diario.moods.bom')},
    {id:'neutro',ico:'🌥',label: t('ferramentasPremium.diario.moods.neutro')},
    {id:'dificil',ico:'⚡',label: t('ferramentasPremium.diario.moods.dificil')},
    {id:'transformador',ico:'🌑',label: t('ferramentasPremium.diario.moods.transformador')},
  ]

  const locale = lang === 'en' ? 'en-US' : 'pt-PT'

  const guardar = () => {
    if (!nova.trim()) return
    const entrada = {
      id: Date.now(),
      data: new Date().toLocaleDateString(locale),
      hora: new Date().toLocaleTimeString(locale,{hour:'2-digit',minute:'2-digit'}),
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
      <h2 style={{fontSize:20,fontWeight:700,color:CORES.dourado,marginBottom:4}}>{t('ferramentasPremium.diario.title')}</h2>
      <p style={{fontSize:13,color:CORES.brancoMuted,marginBottom:20}}>{t('ferramentasPremium.diario.subtitle')}</p>

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
        <textarea value={nova} onChange={e=>setNova(e.target.value)} placeholder={t('ferramentasPremium.diario.placeholder')}
          style={{...inputStyle,height:100,resize:'none',marginBottom:12}}/>
        <button type="button" onClick={guardar} disabled={!nova.trim()} style={{
          background:`linear-gradient(135deg,#DFB76C,#B8944F)`,border:'none',borderRadius:10,
          color:'#0B071E',fontSize:14,fontWeight:700,padding:'11px 24px',cursor:nova.trim()?'pointer':'not-allowed',
          opacity:nova.trim()?1:0.5,
        }}>{t('ferramentasPremium.diario.saveEntry')}</button>
      </div>

      {entradas.length === 0 ? (
        <div style={{textAlign:'center',padding:40,color:CORES.brancoMuted,fontSize:13}}>
          {t('ferramentasPremium.diario.empty')}<br/>{t('ferramentasPremium.diario.emptyHint')}
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
                      <div style={{fontSize:11,color:CORES.brancoMuted}}>{e.data} {t('common.at')} {e.hora}</div>
                      {e.luna && <div style={{fontSize:10,color:CORES.dourado}}>{t('ferramentasPremium.diario.moonIn', { signo: ts(e.luna) })}</div>}
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

// ── Numerologia ───────────────────────────────────────────────────────────────
export function Numerologia({ dados, onVoltar }) {
  const { lang, t } = useLanguage()
  const mapa = dados?.nome && dados?.data ? calcularMapaNumerologia(dados.nome, dados.data, lang) : null

  if (!mapa) return (
    <div style={{ padding: 24 }}>
      <BotaoVoltar onVoltar={onVoltar} t={t} />
      <p style={{ color: CORES.brancoMuted, textAlign: 'center' }}>{t('ferramentasPremium.numerologia.fillNatal')}</p>
    </div>
  )

  const blocos = [
    { key: 'caminhoVida', num: mapa.caminhoVida, label: t('ferramentasPremium.numerologia.lifePath') },
    { key: 'destino', num: mapa.destino, label: t('ferramentasPremium.numerologia.destiny') },
    { key: 'alma', num: mapa.alma, label: t('ferramentasPremium.numerologia.soul') },
    { key: 'personalidade', num: mapa.personalidade, label: t('ferramentasPremium.numerologia.personality') },
    { key: 'anoPessoal', num: mapa.anoPessoal, label: t('ferramentasPremium.numerologia.personalYear') },
    { key: 'mesPessoal', num: mapa.mesPessoal, label: t('ferramentasPremium.numerologia.personalMonth') },
  ]

  return (
    <div style={{ padding: '20px 20px 110px' }}>
      <BotaoVoltar onVoltar={onVoltar} t={t} />
      <h2 style={{ fontSize: 20, fontWeight: 700, color: CORES.dourado, marginBottom: 4 }}>{t('ferramentasPremium.numerologia.title')}</h2>
      <p style={{ fontSize: 13, color: CORES.brancoMuted, marginBottom: 20 }}>{t('ferramentasPremium.numerologia.subtitle', { name: dados.nome })}</p>

      {blocos.map((b) => (
        <div key={b.key} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${CORES.vidroBorda}`, borderRadius: 14, padding: 18, marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: CORES.dourado, minWidth: 44, textAlign: 'center' }}>{b.num}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: CORES.branco }}>{b.label}</div>
          </div>
          <p style={{ fontSize: 13, color: CORES.brancoSuave, lineHeight: 1.7, margin: 0 }}>{mapa.textos[b.key]}</p>
        </div>
      ))}

      {mapa.ciclos && (
        <div style={{ background: 'rgba(223,183,108,0.06)', border: `1px solid rgba(223,183,108,0.25)`, borderRadius: 14, padding: 18 }}>
          <div style={{ fontSize: 11, color: CORES.dourado, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>{t('ferramentasPremium.numerologia.lifeCycles')}</div>
          <p style={{ fontSize: 13, color: CORES.brancoSuave, lineHeight: 1.7, margin: 0 }}>
            {t('ferramentasPremium.numerologia.cyclesDesc', {
              first: mapa.ciclos.primeiro, second: mapa.ciclos.segundo, third: mapa.ciclos.terceiro,
            })}
          </p>
        </div>
      )}
    </div>
  )
}

// ── Interpretação de Sonhos ───────────────────────────────────────────────────
export function InterpretacaoSonhos({ mapaNatal, onVoltar }) {
  const { lang, t } = useLanguage()
  const [sonho, setSonho] = useState('')
  const [resultado, setResultado] = useState(null)

  const interpretar = () => {
    setResultado(interpretarSonho(sonho, mapaNatal, lang))
  }

  return (
    <div style={{ padding: '20px 20px 110px' }}>
      <BotaoVoltar onVoltar={onVoltar} t={t} />
      <h2 style={{ fontSize: 20, fontWeight: 700, color: CORES.dourado, marginBottom: 4 }}>{t('ferramentasPremium.sonhos.title')}</h2>
      <p style={{ fontSize: 13, color: CORES.brancoMuted, marginBottom: 20 }}>{t('ferramentasPremium.sonhos.subtitle')}</p>

      <textarea
        value={sonho}
        onChange={(e) => setSonho(e.target.value)}
        placeholder={t('ferramentasPremium.sonhos.placeholder')}
        style={{ ...inputStyle, height: 140, resize: 'none', marginBottom: 14 }}
      />
      <button type="button" disabled={!sonho.trim()} onClick={interpretar} style={{
        width: '100%', background: `linear-gradient(135deg,#DFB76C,#B8944F)`, border: 'none',
        borderRadius: 12, color: '#0B071E', fontSize: 15, fontWeight: 700, padding: '14px',
        cursor: sonho.trim() ? 'pointer' : 'not-allowed', opacity: sonho.trim() ? 1 : 0.5, marginBottom: 20,
      }}>
        {t('ferramentasPremium.sonhos.interpret')}
      </button>

      {resultado && (
        <div>
          <p style={{ fontSize: 14, color: CORES.brancoSuave, lineHeight: 1.75, marginBottom: 16 }}>{resultado.intro}{resultado.contextoAstro}</p>
          {resultado.simbolos.map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${CORES.vidroBorda}`, borderRadius: 14, padding: 18, marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: CORES.dourado, marginBottom: 8 }}>✦ {s.tema}</div>
              <p style={{ fontSize: 13, color: CORES.brancoSuave, lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>{s.texto}</p>
            </div>
          ))}
          <p style={{ fontSize: 13, color: CORES.brancoMuted, lineHeight: 1.75, fontStyle: 'italic' }}>{resultado.sintese}</p>
        </div>
      )}
    </div>
  )
}
