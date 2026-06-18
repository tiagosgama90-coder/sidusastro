import { useState, useRef } from 'react'

const CORES = {
  fundo:'#0B071E', dourado:'#DFB76C', douradoEscuro:'#B8944F',
  branco:'#FFFFFF', brancoSuave:'rgba(255,255,255,0.85)',
  brancoMuted:'rgba(255,255,255,0.55)', vidroBorda:'rgba(223,183,108,0.22)',
  roxoClaro:'rgba(139,92,246,0.12)',
}

const SIGNO_EMOJI = {
  'Áries':'♈','Touro':'♉','Gémeos':'♊','Caranguejo':'♋','Leão':'♌','Virgem':'♍',
  'Balança':'♎','Escorpião':'♏','Sagitário':'♐','Capricórnio':'♑','Aquário':'♒','Peixes':'♓',
}

function formatarData(iso) {
  if (!iso) return '—'
  const [a,m,d] = iso.split('-')
  return `${d}/${m}/${a}`
}

export function Perfil({ utilizador, dados, mapaNatal, isPremium, dadosBloqueados, onLogout }) {
  const [foto, setFoto] = useState(() => {
    try { return localStorage.getItem('sidus_foto') || null } catch { return null }
  })
  const inputFoto = useRef(null)

  const handleFoto = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const b64 = ev.target.result
      setFoto(b64)
      try { localStorage.setItem('sidus_foto', b64) } catch { /* quota exceeded */ }
    }
    reader.readAsDataURL(file)
  }

  const nome = dados?.nome || utilizador?.displayName || 'Viajante Cósmico'
  const email = utilizador?.email || ''

  return (
    <div style={{ padding:'24px 20px 110px' }}>
      {/* Cabeçalho do perfil */}
      <div style={{ display:'flex', alignItems:'center', gap:18, marginBottom:28 }}>
        <div
          onClick={()=>inputFoto.current?.click()}
          style={{
            width:80, height:80, borderRadius:'50%', flexShrink:0,
            background: foto ? 'transparent' : 'linear-gradient(135deg,#6D28D9,#0B071E)',
            border:`2px solid ${CORES.dourado}`, cursor:'pointer', overflow:'hidden',
            display:'flex', alignItems:'center', justifyContent:'center', position:'relative',
          }}
        >
          {foto
            ? <img src={foto} alt="Perfil" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
            : <span style={{fontSize:36}}>{nome[0]?.toUpperCase()}</span>
          }
          <div style={{
            position:'absolute', inset:0, background:'rgba(0,0,0,0.35)',
            display:'flex', alignItems:'center', justifyContent:'center', opacity:0,
            transition:'opacity 0.2s',
          }}
            onMouseEnter={e=>e.currentTarget.style.opacity='1'}
            onMouseLeave={e=>e.currentTarget.style.opacity='0'}
          >
            <span style={{fontSize:20}}>📷</span>
          </div>
        </div>
        <input ref={inputFoto} type="file" accept="image/*" onChange={handleFoto} style={{display:'none'}}/>
        <div>
          <div style={{fontSize:18, fontWeight:700, color:CORES.branco}}>{nome}</div>
          {email && <div style={{fontSize:12, color:CORES.brancoMuted}}>{email}</div>}
          <div style={{display:'flex', gap:6, marginTop:6}}>
            <span style={{
              fontSize:11, padding:'3px 10px', borderRadius:20,
              background: isPremium ? 'rgba(223,183,108,0.15)' : 'rgba(255,255,255,0.06)',
              border:`1px solid ${isPremium ? CORES.dourado : 'rgba(255,255,255,0.12)'}`,
              color: isPremium ? CORES.dourado : CORES.brancoMuted,
              fontWeight:700,
            }}>
              {isPremium ? '✦ Premium' : 'Gratuito'}
            </span>
          </div>
        </div>
      </div>

      {/* Mapa natal resumido */}
      {mapaNatal && (
        <div style={{background:'rgba(255,255,255,0.04)',border:`1px solid ${CORES.vidroBorda}`,borderRadius:16,padding:20,marginBottom:20}}>
          <div style={{fontSize:11,color:CORES.dourado,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:14}}>
            Mapa Natal
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            {[
              {label:'Signo Solar',   val:mapaNatal.solar?.nome,      icon:'☀️'},
              {label:'Signo Lunar',   val:mapaNatal.lunar?.nome,      icon:'🌙'},
              {label:'Ascendente',    val:mapaNatal.ascendente?.nome, icon:'↑'},
              {label:'Meio do Céu',   val:mapaNatal.mc?.nome,         icon:'⊕'},
            ].filter(r=>r.val).map(r=>(
              <div key={r.label} style={{background:'rgba(255,255,255,0.03)',borderRadius:10,padding:'10px 12px'}}>
                <div style={{fontSize:10,color:CORES.brancoMuted,marginBottom:4}}>{r.icon} {r.label}</div>
                <div style={{fontSize:14,fontWeight:600,color:CORES.branco}}>
                  {SIGNO_EMOJI[r.val]||''} {r.val}
                </div>
              </div>
            ))}
          </div>
          <div style={{marginTop:14,paddingTop:14,borderTop:`1px solid ${CORES.vidroBorda}`,display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,fontSize:12}}>
            <span style={{color:CORES.brancoMuted}}>Nascimento:</span>
            <span style={{color:CORES.branco}}>{formatarData(dados?.data)}</span>
            <span style={{color:CORES.brancoMuted}}>Hora:</span>
            <span style={{color:CORES.branco}}>{dados?.hora || '—'}</span>
            <span style={{color:CORES.brancoMuted}}>Local:</span>
            <span style={{color:CORES.branco,fontSize:11}}>{dados?.cidade || '—'}</span>
          </div>
        </div>
      )}

      {/* Elementos e modalidades */}
      {mapaNatal && <PainelElementos mapaNatal={mapaNatal}/>}

      {/* Aviso de dados bloqueados */}
      {dadosBloqueados && (
        <div style={{
          background:'rgba(223,183,108,0.07)', border:`1px solid rgba(223,183,108,0.3)`,
          borderRadius:12, padding:'12px 16px', marginBottom:12,
          display:'flex', gap:10, alignItems:'flex-start',
        }}>
          <span style={{fontSize:16}}>🔒</span>
          <div>
            <div style={{fontSize:13,fontWeight:700,color:CORES.dourado,marginBottom:3}}>Dados Natais Protegidos</div>
            <div style={{fontSize:11,color:CORES.brancoMuted,lineHeight:1.5}}>
              Cada conta está associada a um único mapa astral. Os dados de nascimento ficam bloqueados após a primeira criação — não é possível gerar mapas para outras pessoas na mesma conta.
            </div>
          </div>
        </div>
      )}

      {/* Acções */}
      <div style={{display:'flex',flexDirection:'column',gap:10,marginTop:10}}>
        <button type="button" onClick={onLogout} style={{
          background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.3)',
          borderRadius:12, color:'#EF4444', fontSize:14, padding:'13px', cursor:'pointer',
        }}>
          Terminar sessão
        </button>
      </div>
    </div>
  )
}

function PainelElementos({ mapaNatal }) {
  const elementosCount = { Fogo:0, Terra:0, Ar:0, Água:0 }
  ;[mapaNatal.solar, mapaNatal.lunar, mapaNatal.ascendente].forEach(p => {
    if (p?.elemento) elementosCount[p.elemento] = (elementosCount[p.elemento]||0)+1
  })

  const ELEMENTO_COR = { Fogo:'#FB923C', Terra:'#4ADE80', Ar:'#93C5FD', Água:'#818CF8' }
  const ELEMENTO_ICO = { Fogo:'🔥', Terra:'🌱', Ar:'💨', Água:'💧' }

  return (
    <div style={{background:'rgba(255,255,255,0.04)',border:`1px solid ${CORES.vidroBorda}`,borderRadius:16,padding:18,marginBottom:20}}>
      <div style={{fontSize:11,color:CORES.dourado,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:14}}>
        Elementos dominantes
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        {Object.entries(elementosCount).map(([el, n])=>(
          <div key={el} style={{
            background:`${ELEMENTO_COR[el]}10`, border:`1px solid ${ELEMENTO_COR[el]}30`,
            borderRadius:10, padding:'10px 12px', display:'flex', alignItems:'center', gap:8,
          }}>
            <span style={{fontSize:20}}>{ELEMENTO_ICO[el]}</span>
            <div>
              <div style={{fontSize:12,fontWeight:700,color:ELEMENTO_COR[el]}}>{el}</div>
              <div style={{display:'flex',gap:4,marginTop:2}}>
                {[...Array(3)].map((_,i)=>(
                  <div key={i} style={{width:8,height:8,borderRadius:2,background:i<n?ELEMENTO_COR[el]:'rgba(255,255,255,0.1)'}}/>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
