/**
 * Ferramentas Premium Sidus
 * ─ Bússola Cósmica 2026 (trânsitos planetários para o ano)
 * ─ Sinastria (comparação de dois mapas natais)
 * ─ Biorritmo (ciclos físico/emocional/intelectual)
 * ─ Diário Astral (registo pessoal)
 */
import { useState, useEffect } from 'react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { dateLocale, isPt } from '../lib/i18n/langUtil.js'
import {
  calcularBussola2026Async, relevanciaParaMapa, TIPO_ICO, IMPACTO_COR,
} from '../lib/bussolaCosmica.js'
import { calcularSinastriaCompleta } from '../lib/sinastriaEngine.js'
import { montarRelatorioSinastria, montarResumoGratis, montarSecoesPremium, EIXOS } from '../lib/sinastriaInterpretacao.js'
import { RadarAfinidades } from './RadarAfinidades.jsx'
import { CampoCidadeField } from './CampoCidadeField.jsx'
import { pesquisarFusoHorario } from '../lib/geocoding.js'
import { diasVidaDesdeNascimento } from '../lib/datetime.js'
import { calcularMapaNumerologia, GRUPOS_PITAGORICOS } from '../lib/numerologia.js'
import { chipsSimbolos, interpretarSonhoRemoto } from '../lib/sonhosInterpretacao.js'
import {
  resolverDadosFerramentas,
  dadosMinimosFerramentas,
  dadosNumerologiaProntos,
  normalizarDataISO,
} from '../lib/dadosFerramentas.js'
import { analisarFluxoVital } from '../lib/fluxoVital.js'
import {
  interpretarAgora,
  interpretarHorario,
  proximaHoraIgual,
} from '../lib/horasIguais.js'

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

export function BussolaCosmica({ mapaNatal, onVoltar }) {
  const { lang, t, ts, tp } = useLanguage()
  const [mesAberto, setMesAberto] = useState(null)
  const [dados, setDados] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const locale = dateLocale(lang)
  const mesAtual = new Date().toLocaleString(locale, { month: 'long' })

  useEffect(() => {
    let cancelado = false
    setCarregando(true)
    calcularBussola2026Async(lang)
      .then((r) => { if (!cancelado) setDados(r) })
      .catch(() => { if (!cancelado) setDados(null) })
      .finally(() => { if (!cancelado) setCarregando(false) })
    return () => { cancelado = true }
  }, [lang])

  const transitos = dados?.transitos || []
  const conceitos = dados?.conceitos || []

  return (
    <div style={{padding:'20px 20px 110px'}}>
      <BotaoVoltar onVoltar={onVoltar} t={t} />

      <div style={{marginBottom:24}}>
        <h2 style={{fontSize:20,fontWeight:700,color:CORES.dourado,margin:'0 0 4px'}}>{t('ferramentasPremium.bussola.title')}</h2>
        <p style={{fontSize:13,color:CORES.brancoMuted,margin:0}}>
          {t('ferramentasPremium.bussola.subtitle')}
        </p>
      </div>

      {carregando && (
        <div style={{textAlign:'center',padding:'40px 20px',color:CORES.brancoMuted,fontSize:14}}>
          {t('ferramentasPremium.bussola.calculating')}
        </div>
      )}

      {!carregando && conceitos.length > 0 && (
        <div style={{marginBottom:24}}>
          <h3 style={{fontSize:14,fontWeight:700,color:CORES.dourado,margin:'0 0 12px'}}>
            {t('ferramentasPremium.bussola.conceptsTitle')}
          </h3>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {conceitos.map((c, i) => (
              <div key={i} style={{
                background:'rgba(255,255,255,0.04)',border:'1px solid rgba(223,183,108,0.15)',
                borderRadius:12,padding:'12px 14px',
              }}>
                <div style={{fontSize:13,fontWeight:700,color:CORES.branco,marginBottom:6}}>
                  {c.icon} {c.titulo}
                </div>
                <p style={{fontSize:12,color:CORES.brancoSuave,margin:0,lineHeight:1.65}}>{c.texto}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {mapaNatal && !carregando && (
        <div style={{background:'rgba(223,183,108,0.07)',border:`1px solid rgba(223,183,108,0.25)`,borderRadius:12,padding:'12px 16px',marginBottom:20,fontSize:12,color:CORES.brancoSuave}}>
          {t('ferramentasPremium.bussola.personalized', {
            solar: ts(mapaNatal.solar?.nome),
            lunar: ts(mapaNatal.lunar?.nome),
            asc: ts(mapaNatal.ascendente?.nome),
          })}
        </div>
      )}

      {!carregando && (
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {transitos.map((transito,i)=>{
          const esteMs = transito.mes.toLowerCase()===mesAtual.toLowerCase()
          const relevante = mapaNatal && relevanciaParaMapa(transito, mapaNatal)
            ? t('ferramentasPremium.bussola.relevant')
            : ''
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
                    {tp(transito.planeta)} {isPt(lang) ? 'em' : (lang === 'es' || lang === 'fr' ? 'en' : 'in')} {ts(transito.signo)}
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
      )}
    </div>
  )
}

// ── Sinastria (Radar de Afinidades) ───────────────────────────────────────────

function renderTextoMarkdown(texto) {
  if (!texto) return null
  const partes = texto.split(/(\*\*[^*]+\*\*)/g)
  return partes.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) {
      return <strong key={i} style={{ color: CORES.branco, fontWeight: 600 }}>{p.slice(2, -2)}</strong>
    }
    return <span key={i}>{p}</span>
  })
}

function CartaoSecao({ titulo, score, texto, cor = CORES.dourado }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)', border: `1px solid ${CORES.vidroBorda}`,
      borderRadius: 14, padding: 18, marginBottom: 14,
      borderLeft: `3px solid ${cor}`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: CORES.branco, lineHeight: 1.35 }}>{titulo}</div>
        {score != null && <div style={{ fontSize: 22, fontWeight: 700, color: cor, flexShrink: 0 }}>{score}%</div>}
      </div>
      <div style={{ fontSize: 13, color: CORES.brancoSuave, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{renderTextoMarkdown(texto)}</div>
    </div>
  )
}

function UpsellSinastriaPremium({ t, onUpgrade }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(223,183,108,0.08))',
      border: '1px solid rgba(223,183,108,0.35)', borderRadius: 16, padding: 20, marginTop: 16, textAlign: 'center',
    }}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>👑</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: CORES.dourado, marginBottom: 8 }}>{t('ferramentasPremium.sinastria.premiumTitle')}</div>
      <p style={{ fontSize: 13, color: CORES.brancoSuave, lineHeight: 1.65, margin: '0 0 16px' }}>{t('ferramentasPremium.sinastria.premiumDesc')}</p>
      <ul style={{ textAlign: 'left', fontSize: 12, color: CORES.brancoMuted, lineHeight: 1.8, margin: '0 0 16px', paddingLeft: 20 }}>
        <li>{t('ferramentasPremium.sinastria.premiumItem1')}</li>
        <li>{t('ferramentasPremium.sinastria.premiumItem2')}</li>
        <li>{t('ferramentasPremium.sinastria.premiumItem3')}</li>
        <li>{t('ferramentasPremium.sinastria.premiumItem4')}</li>
        <li>{t('ferramentasPremium.sinastria.premiumItem5')}</li>
      </ul>
      {onUpgrade && (
        <button type="button" onClick={onUpgrade} style={{
          width: '100%', padding: '14px', borderRadius: 12, border: 'none',
          background: 'linear-gradient(135deg,#DFB76C,#B8944F)', color: '#0B071E',
          fontSize: 14, fontWeight: 700, cursor: 'pointer',
        }}>
          {t('ferramentasPremium.sinastria.premiumBtn')}
        </button>
      )}
    </div>
  )
}

export function Sinastria({ mapaNatal, dadosUtilizador, isPremium = false, onUpgrade, onVoltar }) {
  const { lang, t, ts } = useLanguage()
  const [parceiro, setParceiro] = useState({
    nome: '', data: '', hora: '12:00', horaDesconhecida: false,
    cidade: '', localizacao: null, fuso: null,
  })
  const [analise, setAnalise] = useState(null)
  const [calculando, setCalculando] = useState(false)
  const [erro, setErro] = useState(null)

  const userHoraDesconhecida = !String(dadosUtilizador?.hora || '').trim()

  const dadosProntos = (p) => {
    const data = normalizarDataISO(p.data)
    const horaOk = p.horaDesconhecida || p.hora
    return p.nome?.trim() && data && horaOk && p.localizacao?.lat != null && p.localizacao?.lon != null
  }

  const calcularSinastria = async () => {
    if (!dadosProntos(parceiro) || !dadosUtilizador?.data) return
    setCalculando(true)
    setErro(null)
    setAnalise(null)
    try {
      let fuso = parceiro.fuso
      if (fuso == null && parceiro.localizacao) {
        fuso = await pesquisarFusoHorario(parceiro.localizacao.lat, parceiro.localizacao.lon)
        setParceiro((p) => ({ ...p, fuso }))
      }

      const dadosA = {
        nome: dadosUtilizador.nome,
        data: dadosUtilizador.data,
        hora: dadosUtilizador.hora || '12:00',
        horaDesconhecida: userHoraDesconhecida,
        localizacao: dadosUtilizador.localizacao,
        fuso: dadosUtilizador.fuso ?? 0,
      }
      const dadosB = {
        nome: parceiro.nome.trim(),
        data: normalizarDataISO(parceiro.data),
        hora: parceiro.horaDesconhecida ? '12:00' : (parceiro.hora || '12:00'),
        horaDesconhecida: parceiro.horaDesconhecida,
        localizacao: parceiro.localizacao,
        fuso: fuso ?? 0,
      }

      const resultado = await calcularSinastriaCompleta(dadosA, dadosB)
      if (!resultado) {
        setErro(t('ferramentasPremium.sinastria.errorCalc'))
        return
      }

      setAnalise({
        pontuacao: resultado.pontuacao,
        pilares: resultado.pilares,
        aspectos: resultado.aspectos,
        secoes: montarSecoesPremium(resultado, mapaNatal, lang),
        relatorio: isPremium
          ? montarRelatorioSinastria(resultado, mapaNatal, lang)
          : montarResumoGratis(resultado, mapaNatal, lang),
        motor: resultado.posA?.motor,
        parceiroSol: resultado.posB?.corpos?.sol?.signo,
        parceiroLua: resultado.posB?.corpos?.lua?.signo,
        parceiroAsc: resultado.posB?.corpos?.ascendente?.signo,
        laçoCarmico: resultado.nodosSinastria?.laçoCarmico,
      })
    } catch (e) {
      console.error('[Sinastria]', e)
      setErro(t('ferramentasPremium.sinastria.errorCalc'))
    } finally {
      setCalculando(false)
    }
  }

  const coresPilar = { quimica: '#F87171', emocao: '#818CF8', comunicacao: '#60A5FA', futuro: '#4ADE80' }
  const radarLabels = {
    quimica: t('ferramentasPremium.sinastria.passion'),
    comunicacao: t('ferramentasPremium.sinastria.communication'),
    emocao: t('ferramentasPremium.sinastria.emotional'),
    futuro: t('ferramentasPremium.sinastria.future'),
    total: t('ferramentasPremium.sinastria.compatibility'),
  }

  return (
    <div style={{ padding: '20px 20px 110px' }}>
      <BotaoVoltar onVoltar={onVoltar} t={t} />
      <h2 style={{ fontSize: 20, fontWeight: 700, color: CORES.dourado, marginBottom: 4 }}>{t('ferramentasPremium.sinastria.title')}</h2>
      <p style={{ fontSize: 13, color: CORES.brancoMuted, marginBottom: 8 }}>{t('ferramentasPremium.sinastria.subtitlePro')}</p>

      {mapaNatal && (
        <div style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${CORES.vidroBorda}`, borderRadius: 14, padding: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: CORES.dourado, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>{t('ferramentasPremium.sinastria.yourChart')}</div>
          <div style={{ fontSize: 14, color: CORES.branco }}>
            ☀ {ts(mapaNatal.solar?.nome)} · 🌙 {ts(mapaNatal.lunar?.nome)} · ↑ {ts(mapaNatal.ascendente?.nome)}
          </div>
        </div>
      )}

      <div style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${CORES.vidroBorda}`, borderRadius: 14, padding: 18, marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: CORES.dourado, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>{t('ferramentasPremium.sinastria.partnerData')}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input placeholder={t('ferramentasPremium.sinastria.partnerName')} value={parceiro.nome}
            onChange={(e) => setParceiro((p) => ({ ...p, nome: e.target.value }))}
            style={inputStyle} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ fontSize: 11, color: CORES.brancoMuted, display: 'block', marginBottom: 6 }}>{t('ferramentasPremium.sinastria.birthDate')}</label>
              <input type="date" value={parceiro.data} max={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setParceiro((p) => ({ ...p, data: e.target.value }))}
                style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: CORES.brancoMuted, display: 'block', marginBottom: 6 }}>{t('ferramentasPremium.sinastria.birthTime')}</label>
              <input type="time" value={parceiro.hora} disabled={parceiro.horaDesconhecida}
                onChange={(e) => setParceiro((p) => ({ ...p, hora: e.target.value }))}
                style={{ ...inputStyle, opacity: parceiro.horaDesconhecida ? 0.45 : 1 }} />
            </div>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: CORES.brancoMuted, cursor: 'pointer' }}>
            <input type="checkbox" checked={parceiro.horaDesconhecida}
              onChange={(e) => setParceiro((p) => ({ ...p, horaDesconhecida: e.target.checked }))} />
            {t('ferramentasPremium.sinastria.unknownTime')}
          </label>
          <CampoCidadeField
            label={t('ferramentasPremium.sinastria.birthCity')}
            placeholder={t('ferramentasPremium.sinastria.cityPlaceholder')}
            valor={parceiro.cidade}
            localizacao={parceiro.localizacao}
            onChange={(v) => setParceiro((p) => ({ ...p, cidade: v, localizacao: null, fuso: null }))}
            onSelect={(loc) => setParceiro((p) => ({ ...p, cidade: loc.nome, localizacao: loc, fuso: null }))}
          />
          <p style={{ fontSize: 11, color: CORES.brancoMuted, margin: 0, lineHeight: 1.5 }}>
            {parceiro.horaDesconhecida ? t('ferramentasPremium.sinastria.birthHintNoTime') : t('ferramentasPremium.sinastria.birthHint')}
          </p>
          {userHoraDesconhecida && (
            <p style={{ fontSize: 11, color: '#FBBF24', margin: 0, lineHeight: 1.5 }}>{t('ferramentasPremium.sinastria.userNoTime')}</p>
          )}
        </div>
      </div>

      {erro && (
        <div style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 10, padding: 12, marginBottom: 16, fontSize: 13, color: '#F87171' }}>
          {erro}
        </div>
      )}

      <button type="button" disabled={!dadosProntos(parceiro) || !dadosUtilizador?.data || calculando} onClick={calcularSinastria} style={{
        width: '100%', background: 'linear-gradient(135deg,#DFB76C,#B8944F)', border: 'none',
        borderRadius: 12, color: '#0B071E', fontSize: 15, fontWeight: 700, padding: '14px',
        cursor: !dadosProntos(parceiro) ? 'not-allowed' : 'pointer',
        opacity: !dadosProntos(parceiro) ? 0.5 : 1, marginBottom: 20,
      }}>
        {calculando ? t('ferramentasPremium.sinastria.calculating') : t('ferramentasPremium.sinastria.analyze')}
      </button>

      {analise && (
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
          <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}`}</style>

          {isPremium && analise.secoes ? (
            <>
              <div style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${CORES.vidroBorda}`, borderRadius: 16, padding: '20px 16px', marginBottom: 16 }}>
                <RadarAfinidades scores={analise.pilares} labels={radarLabels} total={analise.pontuacao} size={320} />
                {analise.parceiroSol && (
                  <div style={{ fontSize: 12, color: CORES.brancoMuted, marginTop: 16, textAlign: 'center' }}>
                    {ts(mapaNatal?.solar?.nome)} ❤ {ts(analise.parceiroSol)} · 🌙 {ts(analise.parceiroLua)} · ↑ {analise.parceiroAsc ? ts(analise.parceiroAsc) : '-'}
                  </div>
                )}
              </div>

              {analise.secoes.intro && (
                <CartaoSecao
                  titulo={analise.secoes.intro.titulo}
                  texto={analise.secoes.intro.texto}
                  cor="#DFB76C"
                />
              )}

              {['quimica', 'emocao', 'comunicacao', 'futuro'].map((p) => (
                <CartaoSecao
                  key={p}
                  titulo={analise.secoes[p].titulo}
                  score={analise.secoes[p].score}
                  texto={analise.secoes[p].texto}
                  cor={coresPilar[p]}
                />
              ))}

              <CartaoSecao
                titulo={analise.secoes.missaoA.titulo}
                texto={analise.secoes.missaoA.texto}
                cor="#DFB76C"
              />
              <CartaoSecao
                titulo={analise.secoes.missaoB.titulo}
                texto={analise.secoes.missaoB.texto}
                cor="#DFB76C"
              />

              {analise.laçoCarmico && (
                <div style={{ fontSize: 11, color: '#C084FC', background: 'rgba(192,132,252,0.1)', border: '1px solid rgba(192,132,252,0.3)', borderRadius: 10, padding: '10px 14px', marginBottom: 14 }}>
                  {t('ferramentasPremium.sinastria.karmicBondBadge')}
                </div>
              )}

              <CartaoSecao
                titulo={analise.secoes.missaoRelacionamento.titulo}
                texto={analise.secoes.missaoRelacionamento.texto}
                cor="#C084FC"
              />

              <CartaoSecao
                titulo={analise.secoes.mapaComposto.titulo}
                texto={analise.secoes.mapaComposto.texto}
                cor="#34D399"
              />

              {analise.motor && (
                <div style={{ fontSize: 10, color: CORES.brancoMuted, textAlign: 'center', opacity: 0.6, marginTop: 4 }}>
                  {t('ferramentasPremium.sinastria.motor', { motor: analise.motor })}
                </div>
              )}
            </>
          ) : isPremium ? null : (
            <>
              <div style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${CORES.vidroBorda}`, borderRadius: 16, padding: 24, marginBottom: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 48, fontWeight: 700, color: CORES.dourado, lineHeight: 1 }}>
                  ~{Math.round(analise.pontuacao / 5) * 5}%
                </div>
                <div style={{ fontSize: 12, color: CORES.brancoMuted, marginTop: 6 }}>{t('ferramentasPremium.sinastria.compatibilityApprox')}</div>
                {analise.parceiroSol && (
                  <div style={{ fontSize: 13, color: CORES.brancoSuave, marginTop: 14 }}>
                    {ts(mapaNatal?.solar?.nome)} ❤ {ts(analise.parceiroSol)}
                  </div>
                )}
              </div>

              <div style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${CORES.vidroBorda}`, borderRadius: 14, padding: 18, marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: CORES.dourado, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>{t('ferramentasPremium.sinastria.freePreview')}</div>
                <div style={{ fontSize: 13, color: CORES.brancoSuave, lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
                  {analise.relatorio}
                </div>
              </div>

              <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', marginBottom: 8 }}>
                <div style={{ filter: 'blur(6px)', pointerEvents: 'none', userSelect: 'none', opacity: 0.55 }}>
                  <RadarAfinidades scores={analise.pilares} labels={radarLabels} total={analise.pontuacao} size={280} />
                </div>
              </div>

              <UpsellSinastriaPremium t={t} onUpgrade={onUpgrade} />
            </>
          )}
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

export function Biorritmo({ dados, utilizador, mapaNatal, onVoltar }) {
  const { lang, t, ts } = useLanguage()
  const resolvido = resolverDadosFerramentas(dados, utilizador, mapaNatal)
  const diasVida = diasVidaDesdeNascimento(resolvido)

  if (!dadosMinimosFerramentas(resolvido) || diasVida == null || diasVida < 0) return (
    <div style={{ padding: 24 }}>
      <BotaoVoltar onVoltar={onVoltar} t={t} />
      <p style={{ color: CORES.brancoMuted, textAlign: 'center', lineHeight: 1.6 }}>{t('ferramentasPremium.biorritmo.fillNatal')}</p>
    </div>
  )

  const fisico = valorBiorritmo(diasVida, CICLO_FISICO)
  const emocional = valorBiorritmo(diasVida, CICLO_EMOCIONAL)
  const intelectual = valorBiorritmo(diasVida, CICLO_INTELECTUAL)
  const diasVidaInt = Math.floor(diasVida)
  const astro = analisarFluxoVital({ fisico, emocional, intelectual, mapaNatal, lang })

  const biorritmos = [
    {nome: t('ferramentasPremium.biorritmo.physical'),       val:fisico,      cor:'#FB923C', desc: t('ferramentasPremium.biorritmo.physicalDesc')},
    {nome: t('ferramentasPremium.biorritmo.emotional'),    val:emocional,   cor:'#F472B6', desc: t('ferramentasPremium.biorritmo.emotionalDesc')},
    {nome: t('ferramentasPremium.biorritmo.intellectual'),  val:intelectual, cor:'#60A5FA', desc: t('ferramentasPremium.biorritmo.intellectualDesc')},
  ]

  const estado = (v) => v > 60 ? t('ferramentasPremium.biorritmo.phaseHigh') : v < -60 ? t('ferramentasPremium.biorritmo.phaseCritical') : t('ferramentasPremium.biorritmo.phaseTransition')

  const locale = dateLocale(lang)

  return (
    <div style={{ padding: '20px 20px 110px' }}>
      <BotaoVoltar onVoltar={onVoltar} t={t} />
      <h2 style={{ fontSize: 20, fontWeight: 700, color: CORES.dourado, marginBottom: 4 }}>{t('ferramentasPremium.biorritmo.title')}</h2>
      <p style={{ fontSize: 13, color: CORES.brancoMuted, marginBottom: 12 }}>
        {t('ferramentasPremium.biorritmo.subtitle', { days: diasVidaInt.toLocaleString(locale) })}
      </p>
      {resolvido?.hora && (
        <p style={{ fontSize: 11, color: CORES.brancoMuted, marginBottom: 16, lineHeight: 1.5 }}>
          {t('ferramentasPremium.biorritmo.precisionNote', { time: resolvido.hora })}
        </p>
      )}
      {mapaNatal?.solar?.nome && (
        <div style={{
          background: 'rgba(223,183,108,0.07)', border: `1px solid rgba(223,183,108,0.25)`,
          borderRadius: 12, padding: '10px 14px', marginBottom: 20, fontSize: 12, color: CORES.brancoSuave,
        }}>
          {t('ferramentasPremium.biorritmo.astroContext', {
            solar: ts(mapaNatal.solar.nome),
            lunar: ts(mapaNatal.lunar?.nome || '-'),
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

      <div style={{ marginTop: 20, background: 'rgba(223,183,108,0.06)', border: `1px solid rgba(223,183,108,0.25)`, borderRadius: 14, padding: 18, marginBottom: 14 }}>
        <div style={{ fontSize: 11, color: CORES.dourado, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>{t('ferramentasPremium.biorritmo.lunarPhase')}</div>
        <p style={{ fontSize: 13, color: CORES.brancoSuave, lineHeight: 1.7, margin: 0 }}>{astro.faseLunar}</p>
      </div>

      {astro.ritmoElementar && (
        <div style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${CORES.vidroBorda}`, borderRadius: 14, padding: 18, marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: CORES.dourado, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>{t('ferramentasPremium.biorritmo.astroRhythm')}</div>
          <p style={{ fontSize: 13, color: CORES.brancoSuave, lineHeight: 1.7, margin: 0 }}>{astro.ritmoElementar}</p>
          {astro.luaNatal && <p style={{ fontSize: 13, color: CORES.brancoMuted, lineHeight: 1.7, margin: '12px 0 0' }}>{astro.luaNatal}</p>}
          {astro.ascendenteNota && <p style={{ fontSize: 13, color: CORES.brancoMuted, lineHeight: 1.7, margin: '12px 0 0' }}>{astro.ascendenteNota}</p>}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
        <div style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.25)', borderRadius: 12, padding: 14 }}>
          <div style={{ fontSize: 10, color: '#34D399', textTransform: 'uppercase', marginBottom: 6 }}>{t('ferramentasPremium.biorritmo.peak')}</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: CORES.branco }}>{astro.picoDominante.nome}</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: astro.picoDominante.cor }}>{astro.picoDominante.val > 0 ? '+' : ''}{Math.round(astro.picoDominante.val)}%</div>
        </div>
        <div style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)', borderRadius: 12, padding: 14 }}>
          <div style={{ fontSize: 10, color: '#F87171', textTransform: 'uppercase', marginBottom: 6 }}>{t('ferramentasPremium.biorritmo.valley')}</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: CORES.branco }}>{astro.valeDominante.nome}</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: astro.valeDominante.cor }}>{astro.valeDominante.val > 0 ? '+' : ''}{Math.round(astro.valeDominante.val)}%</div>
        </div>
      </div>

      <div style={{marginTop:4,background:'rgba(255,255,255,0.03)',border:`1px solid rgba(255,255,255,0.07)`,borderRadius:14,padding:18}}>
        <div style={{fontSize:11,color:CORES.dourado,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:10}}>{t('ferramentasPremium.biorritmo.strategy')}</div>
        <p style={{fontSize:13,color:CORES.brancoSuave,lineHeight:1.7,margin:0}}>{astro.estrategia}</p>
        <p style={{fontSize:12,color:CORES.brancoMuted,lineHeight:1.6,margin:'12px 0 0'}}>
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

  const locale = dateLocale(lang)

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
function FormularioNumerologia({ t, onCalcular }) {
  const [nome, setNome] = useState('')
  const [dia, setDia] = useState('')
  const [mes, setMes] = useState('')
  const [ano, setAno] = useState('')

  const calcular = () => {
    const data = normalizarDataISO(`${ano}-${mes}-${dia}`)
    if (!nome.trim() || !data) return
    onCalcular({ nome: nome.trim(), data })
  }

  const pronto = nome.trim() && dia.length === 2 && mes.length === 2 && ano.length === 4

  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${CORES.vidroBorda}`, borderRadius: 14, padding: 20, maxWidth: 400, margin: '0 auto' }}>
      <p style={{ fontSize: 13, color: CORES.brancoMuted, textAlign: 'center', marginBottom: 16, lineHeight: 1.6 }}>{t('ferramentasPremium.numerologia.fillForm')}</p>
      <label style={{ display: 'block', fontSize: 11, color: CORES.dourado, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{t('ferramentasPremium.numerologia.nameLabel')}</label>
      <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder={t('ferramentasPremium.numerologia.namePlaceholder')} style={{ ...inputStyle, marginBottom: 14 }} />
      <label style={{ display: 'block', fontSize: 11, color: CORES.dourado, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{t('ferramentasPremium.numerologia.dateLabel')}</label>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: 8, marginBottom: 16 }}>
        <input inputMode="numeric" maxLength={2} placeholder="DD" value={dia} onChange={(e) => setDia(e.target.value.replace(/\D/g, '').slice(0, 2))} style={{ ...inputStyle, textAlign: 'center' }} />
        <input inputMode="numeric" maxLength={2} placeholder="MM" value={mes} onChange={(e) => setMes(e.target.value.replace(/\D/g, '').slice(0, 2))} style={{ ...inputStyle, textAlign: 'center' }} />
        <input inputMode="numeric" maxLength={4} placeholder="AAAA" value={ano} onChange={(e) => setAno(e.target.value.replace(/\D/g, '').slice(0, 4))} style={{ ...inputStyle, textAlign: 'center' }} />
      </div>
      <button type="button" disabled={!pronto} onClick={calcular} style={{
        width: '100%', background: `linear-gradient(135deg,#DFB76C,#B8944F)`, border: 'none',
        borderRadius: 12, color: '#0B071E', fontSize: 14, fontWeight: 700, padding: '13px',
        cursor: pronto ? 'pointer' : 'not-allowed', opacity: pronto ? 1 : 0.5,
      }}>
        {t('ferramentasPremium.numerologia.calculate')}
      </button>
    </div>
  )
}

export function Numerologia({ dados, utilizador, mapaNatal, onVoltar }) {
  const { lang, t } = useLanguage()
  const [manual, setManual] = useState(null)
  const resolvido = manual || resolverDadosFerramentas(dados, utilizador, mapaNatal)
  const mapa = dadosNumerologiaProntos(resolvido)
    ? calcularMapaNumerologia(resolvido.nome, resolvido.data, lang, mapaNatal)
    : null

  if (!mapa) return (
    <div style={{ padding: 24 }}>
      <BotaoVoltar onVoltar={onVoltar} t={t} />
      <FormularioNumerologia t={t} onCalcular={setManual} />
    </div>
  )

  const labelsPilar = {
    destino: t('ferramentasPremium.numerologia.destiny'),
    alma: t('ferramentasPremium.numerologia.soul'),
    personalidade: t('ferramentasPremium.numerologia.personality'),
  }
  const labelsCurto = {
    destino: t('ferramentasPremium.numerologia.expressionShort'),
    alma: t('ferramentasPremium.numerologia.soulShort'),
    personalidade: t('ferramentasPremium.numerologia.personalityShort'),
  }

  return (
    <div style={{ padding: '20px 20px 110px', maxWidth: 520, margin: '0 auto' }}>
      <BotaoVoltar onVoltar={onVoltar} t={t} />
      <h2 style={{ fontSize: 20, fontWeight: 700, color: CORES.dourado, marginBottom: 4 }}>{t('ferramentasPremium.numerologia.title')}</h2>
      <p style={{ fontSize: 18, fontWeight: 600, color: CORES.branco, marginBottom: 6 }}>{resolvido.nome}</p>
      <p style={{ fontSize: 12, color: CORES.brancoMuted, lineHeight: 1.65, marginBottom: 16 }}>
        {t('ferramentasPremium.numerologia.nameSource', { name: resolvido.nome })}
      </p>

      {/* Tabela pitagórica */}
      <SecaoNumerologia titulo={t('ferramentasPremium.numerologia.tablePythagorean')}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
          {GRUPOS_PITAGORICOS.map((g) => (
            <div key={g.num} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: CORES.dourado }}>{g.num}</div>
              <div style={{ fontSize: 11, color: CORES.brancoMuted, letterSpacing: '0.08em', marginTop: 2 }}>{g.letras}</div>
            </div>
          ))}
        </div>
      </SecaoNumerologia>

      {/* Visão geral - leitura */}
      <SecaoNumerologia titulo={t('ferramentasPremium.numerologia.sectionOverview')}>
        <p style={{ fontSize: 14, color: CORES.brancoSuave, lineHeight: 1.75, margin: 0 }}>{mapa.visaoGeral}</p>
      </SecaoNumerologia>

      {/* Resumo visual - 3 pilares */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
        {mapa.pilares?.map((p) => (
          <div key={p.id} style={{
            background: 'rgba(255,255,255,0.04)', border: `1px solid ${p.cor}44`,
            borderRadius: 14, padding: '14px 10px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{p.icone}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: p.cor, lineHeight: 1 }}>{p.num}</div>
            <div style={{ fontSize: 10, color: CORES.brancoMuted, marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{labelsPilar[p.id]}</div>
            <div style={{ fontSize: 11, color: CORES.brancoSuave, marginTop: 4, lineHeight: 1.4 }}>{p.titulo}</div>
          </div>
        ))}
      </div>

      {/* Detalhe do nome - 3 blocos */}
      <SecaoNumerologia titulo={t('ferramentasPremium.numerologia.sectionName')}>
        {mapa.pilares?.map((p) => (
          <BlocoNumerologia
            key={p.id}
            num={p.num}
            label={labelsPilar[p.id]}
            subtitulo={labelsCurto[p.id]}
            calculo={p.calculo}
            resumo={p.resumo}
            espiritual={p.espiritual}
            pratica={p.pratica}
            reflexao={p.reflexao}
            astro={p.astro}
            cor={p.cor}
            t={t}
          />
        ))}
      </SecaoNumerologia>

      {/* Caminho de vida - data de nascimento */}
      {mapa.caminho && (
        <SecaoNumerologia titulo={t('ferramentasPremium.numerologia.sectionPath')}>
          <BlocoNumerologia
            num={mapa.caminho.num}
            label={t('ferramentasPremium.numerologia.lifePath')}
            subtitulo={mapa.caminho.titulo}
            calculo={mapa.caminho.calculo}
            resumo={mapa.caminho.resumo}
            espiritual={mapa.caminho.espiritual}
            pratica={mapa.caminho.pratica}
            reflexao={mapa.caminho.reflexao}
            astro={mapa.caminho.astro}
            cor="#60A5FA"
            t={t}
          />
        </SecaoNumerologia>
      )}

      {/* Ritmo actual */}
      <SecaoNumerologia titulo={t('ferramentasPremium.numerologia.sectionRhythm')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { key: 'anoPessoal', label: t('ferramentasPremium.numerologia.personalYear'), item: mapa.ritmo?.ano, texto: mapa.textos.anoPessoal },
            { key: 'mesPessoal', label: t('ferramentasPremium.numerologia.personalMonth'), item: mapa.ritmo?.mes, texto: mapa.textos.mesPessoal },
          ].map(({ key, label, item, texto }) => (
            <div key={key} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${CORES.vidroBorda}`, borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 10, color: CORES.dourado, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{label}</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: CORES.branco, marginBottom: 8 }}>{item?.num}</div>
              <PainelCalculo calculo={item?.calculo} t={t} compacto />
              <p style={{ fontSize: 12, color: CORES.brancoMuted, lineHeight: 1.6, margin: '10px 0 0' }}>{texto}</p>
            </div>
          ))}
        </div>
      </SecaoNumerologia>

      {/* Mapa das letras */}
      {mapa.letras?.length > 0 && (
        <SecaoNumerologia titulo={t('ferramentasPremium.numerologia.sectionLetters')}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: '#A78BFA', marginBottom: 8, fontWeight: 600 }}>{t('ferramentasPremium.numerologia.vowels')}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {(mapa.letrasSeparadas?.vogais || []).map((l, i) => (
                <LetraChip key={`v${i}`} letra={l.letra} valor={l.valor} cor="#A78BFA" />
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: '#34D399', marginBottom: 8, fontWeight: 600 }}>{t('ferramentasPremium.numerologia.consonants')}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {(mapa.letrasSeparadas?.consoantes || []).map((l, i) => (
                <LetraChip key={`c${i}`} letra={l.letra} valor={l.valor} cor="#34D399" />
              ))}
            </div>
          </div>
          {mapa.numeroDominante && (
            <p style={{ fontSize: 13, color: CORES.brancoSuave, margin: '0 0 8px' }}>
              {t('ferramentasPremium.numerologia.dominant', { num: mapa.numeroDominante })}
            </p>
          )}
          {mapa.numerosEmFalta?.length > 0 && (
            <p style={{ fontSize: 13, color: CORES.brancoMuted, margin: 0 }}>
              {t('ferramentasPremium.numerologia.karmicGaps', { nums: mapa.numerosEmFalta.join(', ') })}
            </p>
          )}
        </SecaoNumerologia>
      )}

      {/* Integração */}
      {mapa.harmonias?.length > 0 && (
        <SecaoNumerologia titulo={t('ferramentasPremium.numerologia.sectionIntegration')}>
          {mapa.harmonias.map((h, i) => (
            <p key={i} style={{ fontSize: 13, color: CORES.brancoSuave, lineHeight: 1.7, margin: i ? '12px 0 0' : 0 }}>{h}</p>
          ))}
        </SecaoNumerologia>
      )}

      {/* Ciclos de vida */}
      {mapa.ciclos && (
        <div style={{ background: 'rgba(223,183,108,0.06)', border: '1px solid rgba(223,183,108,0.25)', borderRadius: 14, padding: 18, marginTop: 16 }}>
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

function SecaoNumerologia({ titulo, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 11, color: CORES.dourado, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: 12, paddingBottom: 8, borderBottom: `1px solid ${CORES.vidroBorda}` }}>
        {titulo}
      </div>
      {children}
    </div>
  )
}

function LetraChip({ letra, valor, cor }) {
  return (
    <span style={{ fontSize: 12, padding: '5px 10px', borderRadius: 8, background: `${cor}18`, color: CORES.brancoSuave, border: `1px solid ${cor}44`, fontWeight: 600 }}>
      {letra} <span style={{ opacity: 0.6, fontWeight: 400 }}>· {valor}</span>
    </span>
  )
}

function PainelCalculo({ calculo, t, compacto = false }) {
  if (!calculo) return null

  const fmtPassos = () => {
    if (!calculo.passos || calculo.passos.length <= 1) return null
    return calculo.passos.map((v, i) => {
      if (i === 0) return String(v)
      const prev = calculo.passos[i - 1]
      const soma = String(prev).split('').join('+')
      return `${soma} = ${v}`
    }).join(' → ')
  }

  const linhaLetras = calculo.partes?.filter((p) => p.letra).map((p) => `${p.letra}(${p.valor})`).join(' + ')
  const linhaFormula = () => {
    if (calculo.tipo === 'ano_pessoal') {
      return t('ferramentasPremium.numerologia.calcAnoFormula', {
        dia: calculo.dia, mes: calculo.mes, anoCivil: calculo.anoCivil,
      })
    }
    if (calculo.tipo === 'mes_pessoal') {
      return t('ferramentasPremium.numerologia.calcMesFormula', {
        anoP: calculo.partes?.[0]?.valor, mesCal: calculo.mesCalendario,
      })
    }
    return null
  }

  const boxStyle = {
    background: 'rgba(0,0,0,0.25)',
    border: '1px solid rgba(223,183,108,0.2)',
    borderRadius: 10,
    padding: compacto ? '10px 12px' : '12px 14px',
    marginBottom: compacto ? 0 : 12,
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
    fontSize: compacto ? 11 : 12,
    lineHeight: 1.7,
    color: CORES.brancoSuave,
  }

  return (
    <div style={boxStyle}>
      {calculo.tipo === 'data_nascimento' && (
        <>
          <div style={{ color: CORES.dourado, marginBottom: 4 }}>{t('ferramentasPremium.numerologia.calcBirthDate')}: {calculo.dataFormatada}</div>
          <div>{calculo.digitos?.join(' + ')} = {calculo.total}</div>
        </>
      )}
      {linhaLetras && (
        <div>{linhaLetras} = {calculo.total}</div>
      )}
      {linhaFormula() && (
        <div style={{ color: CORES.brancoMuted, marginBottom: 4 }}>{linhaFormula()}</div>
      )}
      {(calculo.tipo === 'ano_pessoal' || calculo.tipo === 'mes_pessoal') && (
        <div>{calculo.partes?.map((p) => p.valor).join(' + ')} = {calculo.total}</div>
      )}
      {fmtPassos() && (
        <div style={{ marginTop: 4 }}>
          <span style={{ color: CORES.dourado }}>{t('ferramentasPremium.numerologia.calcReduce')}: </span>
          {fmtPassos()}
        </div>
      )}
      {!fmtPassos() && calculo.passos?.length === 1 && (
        <div style={{ marginTop: 4, color: CORES.brancoMuted }}>{t('ferramentasPremium.numerologia.noReduce')}</div>
      )}
      <div style={{ marginTop: 6, fontWeight: 700, color: CORES.dourado }}>
        {t('ferramentasPremium.numerologia.calcFinal')}: {calculo.resultado}
        {calculo.mestre && ` · ${t('ferramentasPremium.numerologia.calcMaster')}`}
      </div>
    </div>
  )
}

function BlocoNumerologia({ num, label, subtitulo, calculo, resumo, espiritual, pratica, reflexao, astro, cor, t }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${cor}33`, borderRadius: 14, padding: 16, marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 12 }}>
        <div style={{ fontSize: 32, fontWeight: 700, color: cor, minWidth: 40, textAlign: 'center', lineHeight: 1 }}>{num}</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: CORES.branco }}>{label}</div>
          <div style={{ fontSize: 11, color: CORES.brancoMuted, marginTop: 2 }}>{subtitulo}</div>
        </div>
      </div>

      <div style={{ fontSize: 10, color: cor, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
        {t('ferramentasPremium.numerologia.labelCalculation')}
      </div>
      <PainelCalculo calculo={calculo} t={t} />

      {resumo && <p style={{ fontSize: 14, color: CORES.branco, fontWeight: 500, lineHeight: 1.6, margin: '0 0 12px' }}>{resumo}</p>}
      {espiritual && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 10, color: cor, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{t('ferramentasPremium.numerologia.labelSpiritual')}</div>
          <p style={{ fontSize: 13, color: CORES.brancoSuave, lineHeight: 1.75, margin: 0 }}>{espiritual}</p>
        </div>
      )}
      {pratica && (
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '10px 12px', marginBottom: 10 }}>
          <div style={{ fontSize: 10, color: '#34D399', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{t('ferramentasPremium.numerologia.labelPractice')}</div>
          <p style={{ fontSize: 13, color: CORES.brancoSuave, lineHeight: 1.65, margin: 0 }}>{pratica}</p>
        </div>
      )}
      {reflexao && (
        <div style={{ background: 'rgba(139,92,246,0.08)', borderRadius: 10, padding: '10px 12px', marginBottom: 10 }}>
          <div style={{ fontSize: 10, color: '#A78BFA', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{t('ferramentasPremium.numerologia.labelReflection')}</div>
          <p style={{ fontSize: 13, color: CORES.brancoSuave, lineHeight: 1.65, margin: 0, fontStyle: 'italic' }}>{reflexao}</p>
        </div>
      )}
      {astro?.texto && (
        <div style={{ borderTop: `1px solid ${CORES.vidroBorda}`, paddingTop: 10, marginTop: 4 }}>
          <div style={{ fontSize: 10, color: CORES.dourado, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{t('ferramentasPremium.numerologia.labelAstroBridge')}</div>
          <p style={{ fontSize: 12, color: CORES.brancoMuted, lineHeight: 1.65, margin: 0 }}>{astro.texto}</p>
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
  const [aInterpretar, setAInterpretar] = useState(false)
  const [erro, setErro] = useState(null)
  const [chipsSel, setChipsSel] = useState([])
  const [feeling, setFeeling] = useState(null)

  const chips = chipsSimbolos(lang)
  const feelings = ['peace', 'fear', 'sadness', 'joy', 'confusion', 'anger']

  const toggleChip = (chip) => {
    setChipsSel((prev) => prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip])
  }

  const interpretar = async () => {
    setAInterpretar(true)
    setErro(null)
    setResultado(null)
    const res = await interpretarSonhoRemoto(sonho, mapaNatal, lang, feeling, chipsSel)
    setAInterpretar(false)
    if (!res) {
      setErro(lang !== 'pt' ? 'Could not interpret right now. Try again in a moment.' : 'Não foi possível interpretar agora. Tenta outra vez dentro de instantes.')
      return
    }
    setResultado(res)
  }

  const pronto = (sonho.trim().length > 8 || chipsSel.length > 0) && !aInterpretar

  return (
    <div style={{ padding: '20px 20px 110px' }}>
      <BotaoVoltar onVoltar={onVoltar} t={t} />
      <h2 style={{ fontSize: 20, fontWeight: 700, color: CORES.dourado, marginBottom: 4 }}>{t('ferramentasPremium.sonhos.title')}</h2>
      <p style={{ fontSize: 13, color: CORES.brancoMuted, marginBottom: 20, lineHeight: 1.6 }}>{t('ferramentasPremium.sonhos.subtitle')}</p>

      <div style={{
        background: 'linear-gradient(160deg, rgba(109,40,217,0.12), rgba(11,7,30,0.6))',
        border: `1px solid rgba(223,183,108,0.25)`,
        borderRadius: 18, padding: 18, marginBottom: 16,
        boxShadow: '0 0 40px rgba(109,40,217,0.08)',
      }}>
        <div style={{ fontSize: 10, color: CORES.dourado, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
          {t('ferramentasPremium.sonhos.symbolsHint')}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {chips.map((chip) => {
            const sel = chipsSel.includes(chip)
            return (
              <button key={chip} type="button" onClick={() => toggleChip(chip)} style={{
                fontSize: 12, padding: '6px 14px', borderRadius: 20, cursor: 'pointer',
                background: sel ? 'rgba(223,183,108,0.22)' : 'rgba(255,255,255,0.05)',
                border: sel ? `1px solid ${CORES.dourado}` : `1px solid ${CORES.vidroBorda}`,
                color: sel ? CORES.dourado : CORES.brancoMuted,
                transition: 'all 0.2s',
              }}>
                {sel ? '✦ ' : ''}{chip}
              </button>
            )
          })}
        </div>

        <div style={{ fontSize: 10, color: CORES.dourado, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
          {t('ferramentasPremium.sonhos.feelingLabel')}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
          {feelings.map((f) => (
            <button key={f} type="button" onClick={() => setFeeling(feeling === f ? null : f)} style={{
              fontSize: 11, padding: '5px 12px', borderRadius: 16, cursor: 'pointer',
              background: feeling === f ? 'rgba(139,92,246,0.25)' : 'transparent',
              border: feeling === f ? '1px solid rgba(139,92,246,0.5)' : `1px solid ${CORES.vidroBorda}`,
              color: feeling === f ? '#C4B5FD' : CORES.brancoMuted,
            }}>
              {t(`ferramentasPremium.sonhos.feelings.${f}`)}
            </button>
          ))}
        </div>

        <div style={{
          display: 'flex', alignItems: 'flex-end', gap: 10,
          background: 'rgba(0,0,0,0.25)', borderRadius: 14,
          border: `1px solid rgba(255,255,255,0.08)`, padding: '10px 14px',
        }}>
          <span style={{ fontSize: 20, opacity: 0.5, flexShrink: 0 }}>🌙</span>
          <textarea
            value={sonho}
            onChange={(e) => setSonho(e.target.value)}
            placeholder={t('ferramentasPremium.sonhos.placeholder')}
            rows={2}
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: CORES.branco, fontSize: 14, lineHeight: 1.55, resize: 'none',
              minHeight: 44, maxHeight: 120, fontFamily: 'inherit',
            }}
          />
        </div>
      </div>

      <button type="button" disabled={!pronto} onClick={interpretar} style={{
        width: '100%', background: `linear-gradient(135deg,#DFB76C,#B8944F)`, border: 'none',
        borderRadius: 12, color: '#0B071E', fontSize: 15, fontWeight: 700, padding: '14px',
        cursor: pronto ? 'pointer' : 'not-allowed', opacity: pronto ? 1 : 0.5, marginBottom: 12,
      }}>
        {aInterpretar ? (lang !== 'pt' ? '✦ Decoding the dream…' : '✦ A decifrar o sonho…') : t('ferramentasPremium.sonhos.interpret')}
      </button>

      {erro && (
        <p style={{ fontSize: 13, color: '#F87171', textAlign: 'center', marginBottom: 16 }}>{erro}</p>
      )}

      {resultado && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {resultado.simbolos.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 4 }}>
              {resultado.simbolos.map((s, i) => (
                <span key={i} style={{
                  fontSize: 11, padding: '4px 10px', borderRadius: 12,
                  background: 'rgba(223,183,108,0.1)', border: `1px solid rgba(223,183,108,0.25)`,
                  color: CORES.dourado,
                }}>{s.tema}</span>
              ))}
            </div>
          )}
          {resultado.seccoes.map((sec, i) => (
            <div key={sec.key} style={{
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${i === 3 ? 'rgba(139,92,246,0.3)' : CORES.vidroBorda}`,
              borderRadius: 14, padding: 18,
            }}>
              <div style={{
                fontSize: 11, fontWeight: 700, color: CORES.dourado,
                textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10,
              }}>
                {i + 1}. {t(`ferramentasPremium.sonhos.${sec.key}`)}
              </div>
              <p style={{
                fontSize: 13, color: i === 3 ? '#C4B5FD' : CORES.brancoSuave,
                lineHeight: 1.75, margin: 0,
                fontStyle: i === 3 ? 'italic' : 'normal',
              }}>{sec.texto}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Horas Iguais (Doreen Virtue) ─────────────────────────────────────────────
export function HorasIguais({ onVoltar }) {
  const { lang, t } = useLanguage()
  const [agora, setAgora] = useState(() => new Date())
  const [horaManual, setHoraManual] = useState('')
  const [modoManual, setModoManual] = useState(false)
  const [interpretacao, setInterpretacao] = useState(() => interpretarAgora(lang))

  useEffect(() => {
    const tick = () => {
      const d = new Date()
      setAgora(d)
      if (!modoManual) setInterpretacao(interpretarHorario(d.getHours(), d.getMinutes(), lang))
    }
    tick()
    const id = setInterval(tick, 15000)
    return () => clearInterval(id)
  }, [lang, modoManual])

  const locale = dateLocale(lang)
  const horaActual = agora.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
  const proxima = proximaHoraIgual(agora)
  const horasPopulares = ['11:11', '22:22', '12:12', '01:01', '04:04']

  const consultarManual = () => {
    const m = horaManual.trim().match(/^(\d{1,2}):(\d{2})$/)
    if (!m) return
    const h = Math.min(23, Math.max(0, +m[1]))
    const min = Math.min(59, Math.max(0, +m[2]))
    setModoManual(true)
    setInterpretacao(interpretarHorario(h, min, lang))
  }

  const seleccionarHora = (chave) => {
    setHoraManual(chave)
    setModoManual(true)
    const [h, min] = chave.split(':').map(Number)
    setInterpretacao(interpretarHorario(h, min, lang))
  }

  const voltarAoAgora = () => {
    setModoManual(false)
    setHoraManual('')
    const d = new Date()
    setInterpretacao(interpretarHorario(d.getHours(), d.getMinutes(), lang))
  }

  const tipoLabel = interpretacao.tipo === 'igual'
    ? t('ferramentasPremium.horasIguais.typeEqual')
    : interpretacao.tipo === 'espelho'
      ? t('ferramentasPremium.horasIguais.typeMirror')
      : t('ferramentasPremium.horasIguais.typeNeutral')

  return (
    <div style={{ padding: '20px 20px 110px' }}>
      <BotaoVoltar onVoltar={onVoltar} t={t} />
      <h2 style={{ fontSize: 20, fontWeight: 700, color: CORES.dourado, marginBottom: 4 }}>
        {t('ferramentasPremium.horasIguais.title')}
      </h2>
      <p style={{ fontSize: 13, color: CORES.brancoMuted, marginBottom: 20, lineHeight: 1.6 }}>
        {t('ferramentasPremium.horasIguais.subtitle')}
      </p>

      <div style={{
        background: 'linear-gradient(135deg, rgba(139,92,246,0.18), rgba(223,183,108,0.1))',
        border: `1px solid rgba(223,183,108,0.35)`,
        borderRadius: 16, padding: 20, marginBottom: 16, textAlign: 'center',
      }}>
        <div style={{ fontSize: 11, color: CORES.dourado, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
          {modoManual ? interpretacao.chave : t('ferramentasPremium.horasIguais.now')}
        </div>
        <div style={{ fontSize: 42, fontWeight: 700, color: CORES.branco, letterSpacing: '0.06em', marginBottom: 6 }}>
          {modoManual ? interpretacao.chave : horaActual}
        </div>
        <div style={{ fontSize: 12, color: CORES.brancoMuted }}>
          {t('ferramentasPremium.horasIguais.nextMirror')}: <span style={{ color: CORES.dourado }}>{proxima}</span>
        </div>
        {modoManual && (
          <button type="button" onClick={voltarAoAgora} style={{
            marginTop: 12, background: 'none', border: `1px solid ${CORES.vidroBorda}`,
            borderRadius: 8, color: CORES.dourado, fontSize: 11, padding: '6px 12px', cursor: 'pointer',
          }}>
            ↻ {t('ferramentasPremium.horasIguais.now')}
          </button>
        )}
      </div>

      <div style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${CORES.vidroBorda}`, borderRadius: 14, padding: 18, marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          <input
            type="text"
            inputMode="numeric"
            value={horaManual}
            onChange={(e) => setHoraManual(e.target.value)}
            placeholder={t('ferramentasPremium.horasIguais.timePlaceholder')}
            style={{
              flex: 1, background: 'rgba(255,255,255,0.06)', border: `1px solid ${CORES.vidroBorda}`,
              borderRadius: 10, color: CORES.branco, padding: '10px 12px', fontSize: 14,
            }}
          />
          <button type="button" onClick={consultarManual} style={{
            background: `linear-gradient(135deg,#DFB76C,#B8944F)`, border: 'none',
            borderRadius: 10, color: '#0B071E', fontSize: 13, fontWeight: 700, padding: '10px 14px', cursor: 'pointer',
          }}>
            {t('ferramentasPremium.horasIguais.consult')}
          </button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {horasPopulares.map((h) => (
            <button key={h} type="button" onClick={() => seleccionarHora(h)} style={{
              background: interpretacao.chave === h ? 'rgba(223,183,108,0.2)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${interpretacao.chave === h ? CORES.dourado : CORES.vidroBorda}`,
              borderRadius: 20, color: CORES.brancoSuave, fontSize: 12, padding: '5px 12px', cursor: 'pointer',
            }}>
              {h}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${CORES.vidroBorda}`, borderRadius: 14, padding: 18, marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: CORES.branco }}>{interpretacao.titulo}</div>
          <span style={{
            fontSize: 10, padding: '3px 8px', borderRadius: 12,
            background: 'rgba(139,92,246,0.15)', color: '#C4B5FD', border: '1px solid rgba(139,92,246,0.3)',
          }}>
            {tipoLabel}
          </span>
        </div>
        <div style={{ fontSize: 11, color: CORES.dourado, marginBottom: 10 }}>
          ✦ {t('ferramentasPremium.horasIguais.angel')}: {interpretacao.anjo}
        </div>
        <p style={{ fontSize: 14, color: CORES.brancoSuave, lineHeight: 1.75, margin: '0 0 14px' }}>
          {interpretacao.mensagem}
        </p>
        <div style={{ background: 'rgba(223,183,108,0.08)', borderRadius: 10, padding: 12, marginBottom: 10 }}>
          <div style={{ fontSize: 10, color: CORES.dourado, textTransform: 'uppercase', marginBottom: 6 }}>
            {t('ferramentasPremium.horasIguais.advice')}
          </div>
          <p style={{ fontSize: 13, color: CORES.brancoSuave, lineHeight: 1.65, margin: 0 }}>{interpretacao.conselho}</p>
        </div>
        <div style={{ fontSize: 12, color: CORES.brancoMuted }}>
          {t('ferramentasPremium.horasIguais.keyword')}: <span style={{ color: CORES.dourado }}>{interpretacao.palavraChave}</span>
        </div>
      </div>

      <p style={{ fontSize: 11, color: CORES.brancoMuted, lineHeight: 1.6, fontStyle: 'italic', margin: 0 }}>
        {t('ferramentasPremium.horasIguais.attribution')}
      </p>
    </div>
  )
}
