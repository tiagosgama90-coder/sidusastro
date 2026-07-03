/**
 * Sistema de Tarot Sidus - baralho profissional de 78 cartas (Mystic Marchetti)
 * ─ Ilustrações + interpretações profissionais
 * ─ 3 leituras gratuitas por conta · depois 2 € por leitura ou Premium
 * ─ 9 tipos de leitura · interpretações personalizadas com mapa natal
 */
import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { localizeArcano, getTiposTarot, getPosicoesTarot } from '../lib/i18n/tarotArcana.js'
import { PRECO_TAROT } from '../lib/pricing.js'
import { sortearCartas, getCartaById, MAJOR_ARCANA } from '../lib/tarot/deck.js'
import { sortearLenormand, LENORMAND_VERSO } from '../lib/tarot/lenormand.js'
import { interpretarLeitura } from '../lib/tarot/interpretacao.js'
import { CartaTarot, dimensoesCarta } from './CartaTarot.jsx'
import {
  leituraDiariaAtiva, podeFazerLeituraDiaria, msAteProximaDiaria,
  formatarTempoRestante, registarLeituraDiaria,
} from '../lib/tarotDiario.js'

const CORES = {
  fundo:'#0B071E', dourado:'#DFB76C', douradoEscuro:'#B8944F',
  branco:'#FFFFFF', brancoSuave:'rgba(255,255,255,0.85)',
  brancoMuted:'rgba(255,255,255,0.55)', vidroBorda:'rgba(223,183,108,0.22)',
}

const CARTA_MOBILE = {
  revelar: 118,
  revelarMini: 84,
  embaralhar: 128,
  distribuir: 100,
  diaria: 152,
}

const CARTA_DESKTOP = {
  revelar: 132,
  revelarMini: 96,
  embaralhar: 142,
  distribuir: 114,
  diaria: 164,
}

function tamanhoCartas() {
  if (typeof window === 'undefined') return CARTA_MOBILE
  return window.innerWidth >= 900 ? CARTA_DESKTOP : CARTA_MOBILE
}

function useTamanhoCartas() {
  const [cartas, setCartas] = useState(() => tamanhoCartas())
  useEffect(() => {
    const onResize = () => setCartas(tamanhoCartas())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return cartas
}

const SHUFFLE_MS = 1200
const DEAL_MS = 280
const REVEAL_SHUFFLE_MS = 380

const btnDourado = {
  background:'linear-gradient(135deg,#DFB76C,#B8944F)',border:'none',borderRadius:12,
  color:'#0B071E',fontSize:15,fontWeight:700,padding:'14px 24px',cursor:'pointer',
  position:'relative',zIndex:2,pointerEvents:'auto',
}

// ── Tipos de leitura ───────────────────────────────────────────────────────────
export const MAX_LEITURAS_GRATIS = 3
const STORAGE_KEY = 'sidus_tarot_free_v4'

function chaveLeiturasGratis(userId) {
  return userId ? `${STORAGE_KEY}_${userId}` : STORAGE_KEY
}

function leiturasGratisUsadas(userId, leiturasRemotas = 0) {
  try {
    const local = parseInt(localStorage.getItem(chaveLeiturasGratis(userId)) || '0', 10)
    const remoto = Number(leiturasRemotas) || 0
    return Math.max(local, remoto)
  } catch {
    return Number(leiturasRemotas) || 0
  }
}

function registarLeituraGratis(userId) {
  try {
    const n = leiturasGratisUsadas(userId) + 1
    localStorage.setItem(chaveLeiturasGratis(userId), String(n))
    return n
  } catch {
    return MAX_LEITURAS_GRATIS
  }
}

function leiturasGratisRestantes(isPremium, userId, leiturasRemotas = 0) {
  if (isPremium === true) return Infinity
  return Math.max(0, MAX_LEITURAS_GRATIS - leiturasGratisUsadas(userId, leiturasRemotas))
}

function podeLerGratis(isPremium, userId, leiturasRemotas = 0) {
  if (isPremium === true) return true
  return leiturasGratisUsadas(userId, leiturasRemotas) < MAX_LEITURAS_GRATIS
}

const TIPOS = [
  { id: 'diaria', nome: 'Leitura Diária', icone: '🌅', n: 3, desc: 'Energia do dia · Alerta · Conselho', prazoKey: 'tarot.types.diaria.prazo', focoKey: 'tarot.types.diaria.foco' },
  { id: 'simnao', nome: 'Tarot Sim ou Não', icone: '🔮', n: 2, desc: 'Resposta directa e justificação', prazoKey: 'tarot.types.simnao.prazo', focoKey: 'tarot.types.simnao.foco' },
  { id: 'amor', nome: 'Tarot do Amor', icone: '💞', n: 3, desc: 'Tu · A ligação · O futuro juntos', prazoKey: 'tarot.types.amor.prazo', focoKey: 'tarot.types.amor.foco' },
  { id: 'geral', nome: 'Leitura Geral', icone: '✨', n: 3, desc: 'Passado · Presente · Futuro', prazoKey: 'tarot.types.geral.prazo', focoKey: 'tarot.types.geral.foco' },
  { id: 'cigano', nome: 'Baralho Cigano', icone: '🎴', n: 5, desc: 'Lenormand · 36 cartas · leitura material', prazoKey: 'tarot.types.cigano.prazo', focoKey: 'tarot.types.cigano.foco' },
  { id: 'oraculo', nome: 'Tarot Oráculo', icone: '🌌', n: 2, desc: 'Mensagem oculta · Conselho da alma', prazoKey: 'tarot.types.oraculo.prazo', focoKey: 'tarot.types.oraculo.foco' },
  { id: 'trabalho', nome: 'Tarot do Trabalho', icone: '💼', n: 3, desc: 'Situação · Obstáculo · Conselho profissional', prazoKey: 'tarot.types.trabalho.prazo', focoKey: 'tarot.types.trabalho.foco' },
  { id: 'ferradura', nome: 'A Ferradura', icone: '🧲', n: 7, desc: '7 cartas · análise de projecto ou dilema', prazoKey: 'tarot.types.ferradura.prazo', focoKey: 'tarot.types.ferradura.foco' },
  { id: 'cruzcelta', nome: 'A Cruz Celta', icone: '☩', n: 10, desc: '10 cartas · radiografia completa da vida', prazoKey: 'tarot.types.cruzcelta.prazo', focoKey: 'tarot.types.cruzcelta.foco' },
]
const POSICOES = {
  diaria: ['Energia do Dia', 'Alerta', 'Conselho'],
  simnao: ['Resposta Directa (Sim/Não)', 'Justificação'],
  amor: ['Tu (O Teu Estado)', 'A Ligação (A Energia Atual)', 'O Futuro Juntos'],
  geral: ['Passado (A Origem)', 'Presente (O Momento Atual)', 'Futuro (A Tendência)'],
  cigano: ['Amor & relações', 'Trabalho & carreira', 'Finanças', 'Saúde & energia', 'Destino & rumo'],
  oraculo: ['Mensagem Oculta', 'Conselho da Alma'],
  trabalho: ['Situação Atual', 'O Obstáculo Profissional', 'Conselho / Futuro'],
  ferradura: ['O Passado', 'O Presente', 'Futuro Oculto', 'A Tua Atitude', 'O Ambiente', 'Os Obstáculos', 'Resultado Final'],
  cruzcelta: [
    'Energia Atual', 'O Desafio', 'Raiz do Problema', 'Passado Recente', 'Metas Conscientes',
    'Futuro Próximo', 'A Tua Atitude', 'Ambiente Externo', 'Esperanças/Medos', 'Desfecho Longo Prazo',
  ],
}

// ── Componente principal ──────────────────────────────────────────────────────
export function EcraTarot({ mapaNatal, isPremium, userId, leiturasTarotUsadas = 0, onLeituraGratisUsada, onPagar, onVoltar, onPremium }) {
  const { lang, t } = useLanguage()
  const [fase, setFase]           = useState('seleccionar')
  const [tipoId, setTipoId]       = useState(null)
  const [pergunta, setPergunta]   = useState('')
  const [cartas, setCartas]       = useState([])
  const [reveladas, setReveladas] = useState([])
  const [embaralhando, setEmbaralhando] = useState(false)
  const [distribuindo, setDistribuindo] = useState(-1)
  const [tick, setTick]           = useState(0)
  const [resultado, setResultado]       = useState(null)
  const [leituraPaga, setLeituraPaga]   = useState(false)
  const [aIniciarLeitura, setAIniciarLeitura] = useState(false)
  const [animarCliqueIdx, setAnimarCliqueIdx] = useState(-1)
  const montadoRef = useRef(true)
  const timersRef = useRef([])

  const agendar = (fn, ms) => {
    const id = setTimeout(() => {
      if (montadoRef.current) fn()
    }, ms)
    timersRef.current.push(id)
    return id
  }

  useEffect(() => {
    montadoRef.current = true
    return () => {
      montadoRef.current = false
      timersRef.current.forEach(clearTimeout)
      timersRef.current = []
    }
  }, [])

  useEffect(() => {
    if (sessionStorage.getItem('sidus_tarot_paid') === '1') {
      sessionStorage.removeItem('sidus_tarot_paid')
      setLeituraPaga(true)
    }
  }, [])

  useEffect(() => {
    if (fase !== 'diaria-bloqueada' && fase !== 'seleccionar') return undefined
    const id = setInterval(() => setTick((n) => n + 1), 30000)
    return () => clearInterval(id)
  }, [fase])

  const tipo = TIPOS.find(t=>t.id===tipoId)
  const mapaTipos = getTiposTarot(lang)
  const mapaPosicoes = getPosicoesTarot(lang)
  const tipoLabel = tipo && mapaTipos?.[tipo.id]
    ? { ...tipo, nome: mapaTipos[tipo.id].nome, desc: mapaTipos[tipo.id].desc, prazoKey: tipo.prazoKey, focoKey: tipo.focoKey }
    : tipo
  const posicoes = (mapaPosicoes?.[tipoId]) || POSICOES[tipoId] || []
  const usadas = leiturasGratisUsadas(userId, leiturasTarotUsadas)
  const restantes = leiturasGratisRestantes(isPremium, userId, leiturasTarotUsadas)
  const podeLer = podeLerGratis(isPremium, userId, leiturasTarotUsadas)
  const gratisEsgotada = !isPremium && usadas >= MAX_LEITURAS_GRATIS

  const refrescar = () => setTick(n => n + 1)

  const iniciarLeitura = (t) => {
    if (t.id === 'diaria' && !podeFazerLeituraDiaria(userId)) {
      setTipoId('diaria')
      setFase('diaria-bloqueada')
      return
    }
    setLeituraPaga(false)
    setTipoId(t.id)
    setPergunta('')
    setCartas([])
    setReveladas([])
    setResultado(null)
    setFase('pergunta')
  }

  const comecarEmbaralhar = (tipoEscolhidoId = tipoId) => {
    if (aIniciarLeitura || embaralhando || distribuindo >= 0) return
    const tipoAtual = TIPOS.find((x) => x.id === tipoEscolhidoId) || tipo
    if (!tipoAtual?.n) return
    setAIniciarLeitura(true)
    const isDiaria = tipoEscolhidoId === 'diaria'
    if (!isDiaria && !isPremium && !leituraPaga && podeLerGratis(isPremium, userId, leiturasTarotUsadas)) {
      const n = registarLeituraGratis(userId)
      onLeituraGratisUsada?.(n)
      refrescar()
    }
    setEmbaralhando(true)
    agendar(() => {
      const sel = tipoEscolhidoId === 'cigano'
        ? sortearLenormand(tipoAtual.n)
        : sortearCartas(tipoAtual.n)
      setCartas(sel)
      setReveladas(new Array(tipoAtual.n).fill(false))
      setEmbaralhando(false)
      setDistribuindo(0)
      setAIniciarLeitura(false)
    }, SHUFFLE_MS)
  }

  useEffect(() => {
    const tipoAtual = TIPOS.find((x) => x.id === tipoId)
    if (!tipoAtual?.n || distribuindo < 0) return undefined
    if (distribuindo < tipoAtual.n) {
      const id = agendar(() => setDistribuindo((i) => i + 1), DEAL_MS)
      return () => clearTimeout(id)
    }
    if (distribuindo >= tipoAtual.n && cartas.length >= tipoAtual.n) {
      setDistribuindo(-1)
      setFase('revelar')
    }
    return undefined
  }, [distribuindo, tipoId, cartas.length])

  const revelarCarta = (i) => {
    if (!Array.isArray(reveladas) || !cartas[i] || reveladas[i] || animarCliqueIdx === i) return
    setAnimarCliqueIdx(i)
    agendar(() => {
      const novo = [...reveladas]
      novo[i] = true
      setReveladas(novo)
      setAnimarCliqueIdx(-1)
      if (novo.length === cartas.length && novo.length > 0 && novo.every(Boolean)) {
        try {
          const res = interpretarLeitura(cartas, tipoId, pergunta, mapaNatal, lang, t, getPosicoesTarot)
          setResultado(res)
          if (tipoId === 'diaria') {
            registarLeituraDiaria(userId, {
              cartas: cartas.map((c) => ({ id: c.id, nome: c.nome, invertida: !!c.invertida })),
              pergunta,
              detalhe: res?.detalhe || '',
              mensagemAnjos: res?.mensagemAnjos || '',
            })
          }
        } catch (e) {
          console.error('[Tarot]', e)
          setResultado({
            detalhe: t('tarot.interpretError'),
            mensagemAnjos: '',
          })
        }
      }
    }, REVEAL_SHUFFLE_MS)
  }

  const voltar = () => {
    setLeituraPaga(false)
    setAIniciarLeitura(false)
    setFase('seleccionar')
    setTipoId(null)
    setCartas([])
    setReveladas([])
    setResultado(null)
    setEmbaralhando(false)
    setAnimarCliqueIdx(-1)
    setDistribuindo(-1)
    refrescar()
  }

  // ────────────────────────── RENDER ────────────────────────────────────────
  if (fase === 'diaria-bloqueada') {
    const ativa = leituraDiariaAtiva(userId)
    const ms = msAteProximaDiaria(userId)
    return (
      <TelaDiariaBloqueada
        t={t}
        lang={lang}
        userId={userId}
        ativa={ativa}
        msRestante={ms}
        tick={tick}
        onVoltar={voltar}
      />
    )
  }

  if (fase==='seleccionar') return (
    <TelaSeleccionar tipos={TIPOS.map((tp) => mapaTipos?.[tp.id] ? { ...tp, nome: mapaTipos[tp.id].nome, desc: mapaTipos[tp.id].desc } : tp)} lang={lang} t={t} userId={userId} onSeleccionar={iniciarLeitura} isPremium={isPremium} gratisEsgotada={gratisEsgotada} restantes={restantes} tick={tick} onVoltar={onVoltar}/>
  )

  if (embaralhando) return <TelaEmbaralhar t={t} cartaVerso={tipoId === 'cigano' ? LENORMAND_VERSO : MAJOR_ARCANA[0]} />

  if (distribuindo>=0) return (
    <TelaDistribuir cartas={cartas} posicoes={posicoes} distribuindo={distribuindo} t={t} cartaVerso={tipoId === 'cigano' ? LENORMAND_VERSO : MAJOR_ARCANA[0]} />
  )

  if (fase==='pergunta') return (
    <TelaPergunta tipo={tipoLabel} lang={lang} t={t} pergunta={pergunta} setPergunta={setPergunta}
      onVoltar={voltar} podeLer={podeLer} isPremium={isPremium} restantes={restantes}
      onPagar={onPagar}
      aIniciarLeitura={aIniciarLeitura}
      onComecar={() => {
        if (aIniciarLeitura) return
        if (isPremium || podeLer) {
          setLeituraPaga(false)
          comecarEmbaralhar(tipoId)
        } else {
          onPagar(t('tarot.payDesc', { tipo: tipo?.nome || '' }), PRECO_TAROT, () => {
            setLeituraPaga(true)
            comecarEmbaralhar(tipoId)
          }, { productType: 'tarot' })
        }
      }}
      onPremium={onPremium}
      onComecarPago={() => { setLeituraPaga(true); comecarEmbaralhar(tipoId) }}
    />
  )

  if (fase==='revelar') return (
    <TelaRevelar cartas={cartas.map(c => localizeArcano(c, lang))} reveladas={reveladas} onRevelar={revelarCarta}
      animarCliqueIdx={animarCliqueIdx}
      posicoes={posicoes} tipo={tipoLabel} lang={lang} t={t} pergunta={pergunta} resultado={resultado}
      onVoltar={voltar} isPremium={isPremium} onPagar={onPagar}/>
  )

  return null
}

// ── Sub-telas ─────────────────────────────────────────────────────────────────
function TelaDiariaBloqueada({ t, lang, ativa, msRestante, onVoltar }) {
  const CARTA = useTamanhoCartas()
  const cartaSalva = ativa?.cartas?.[0]
  const arcano = cartaSalva ? getCartaById(cartaSalva.id) : null
  const carta = arcano ? { ...arcano, invertida: !!cartaSalva.invertida, invertidaLabel: cartaSalva.invertida ? t('tarot.reversed') : '' } : null

  return (
    <div style={{ padding: '20px 20px 110px' }}>
      <button type="button" onClick={onVoltar} style={{ background: 'none', border: 'none', color: CORES.dourado, cursor: 'pointer', marginBottom: 12, fontSize: 13 }}>
        {t('common.back')}
      </button>
      <div style={{
        background: 'linear-gradient(135deg,rgba(239,68,68,0.08),rgba(223,183,108,0.06))',
        border: '1px solid rgba(239,68,68,0.25)', borderRadius: 14, padding: '16px 18px', marginBottom: 18,
      }}>
        <div style={{ fontSize: 10, color: '#F87171', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6, fontWeight: 700 }}>
          {t('tarot.dailyLocked')}
        </div>
        <p style={{ fontSize: 13, color: CORES.brancoMuted, margin: '0 0 10px', lineHeight: 1.65 }}>{t('tarot.dailyLockedDesc')}</p>
        <p style={{ fontSize: 14, fontWeight: 600, color: CORES.dourado, margin: 0 }}>
          {t('tarot.dailyNextIn', { time: formatarTempoRestante(msRestante, lang) })}
        </p>
      </div>

      {carta && (
        <div style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${CORES.vidroBorda}`, borderRadius: 14, padding: 18, marginBottom: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: CORES.dourado, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>{t('tarot.dailySaved')}</div>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            <CartaTarot carta={localizeArcano(carta, lang)} size={CARTA.diaria} />
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: CORES.branco }}>{localizeArcano(carta, lang).nome}</div>
          {carta.invertida && <div style={{ fontSize: 11, color: '#F87171', marginTop: 4 }}>{t('tarot.reversed')}</div>}
        </div>
      )}

      {ativa?.detalhe && (
        <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${CORES.vidroBorda}`, borderRadius: 14, padding: 16, marginBottom: 16 }}>
          <p style={{ fontSize: 13, color: CORES.brancoSuave, lineHeight: 1.75, margin: 0, whiteSpace: 'pre-wrap' }}>{ativa.detalhe}</p>
        </div>
      )}

      <button type="button" onClick={onVoltar} style={{ ...btnDourado, width: '100%' }}>
        {t('common.back')}
      </button>
    </div>
  )
}

function TelaSeleccionar({ tipos, onSeleccionar, isPremium, gratisEsgotada, restantes, tick, onVoltar, userId, lang, t }) {
  void tick
  const diariaAtiva = !podeFazerLeituraDiaria(userId)
  return (
    <div style={{ padding:'20px 20px 110px' }}>
      {onVoltar && (
        <button type="button" onClick={onVoltar} style={{ background:'none', border:'none', color:CORES.dourado, cursor:'pointer', marginBottom:12, fontSize:13 }}>
          {t('common.back')}
        </button>
      )}
      <div style={{
        background:'linear-gradient(135deg,rgba(223,183,108,0.12),rgba(139,92,246,0.08))',
        border:`1px solid rgba(223,183,108,0.35)`, borderRadius:14, padding:'14px 18px', marginBottom:16,
      }}>
        <div style={{fontSize:10,color:CORES.dourado,textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:4,fontWeight:700}}>
          {t('tarot.title')}
        </div>
        <h2 style={{fontSize:20,fontWeight:700,color:CORES.branco,margin:'0 0 4px'}}>{t('tarot.subtitle')}</h2>
        <p style={{fontSize:12,color:CORES.brancoMuted,margin:0}}>{t('tarot.desc')}</p>
      </div>
      {!isPremium && (
        <div style={{background:'rgba(223,183,108,0.07)',border:`1px solid rgba(223,183,108,0.25)`,borderRadius:10,padding:'8px 14px',marginBottom:18,display:'flex',alignItems:'center',gap:8}}>
          <span style={{fontSize:16}}>✦</span>
          <span style={{fontSize:12,color:CORES.brancoMuted}}>
            {gratisEsgotada
              ? <><b style={{color:'#EF4444'}}>{t('tarot.freeExhausted')}</b>{t('tarot.thenPaid')}</>
              : <><b style={{color:CORES.dourado}}>{restantes === 1 ? t('tarot.freeRemaining', { count: restantes }) : t('tarot.freeRemainingPlural', { count: restantes })}</b>{t('tarot.thenPaidShort')}</>}
          </span>
        </div>
      )}
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {tipos.map(tipo=>(
          <button key={tipo.id} type="button" onClick={()=>onSeleccionar(tipo)} style={{
            background: tipo.id === 'diaria' && diariaAtiva ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)',
            border: tipo.id === 'diaria' && diariaAtiva ? '1px solid rgba(239,68,68,0.25)' : '1px solid rgba(223,183,108,0.18)',
            borderRadius:14,padding:'15px 18px',cursor:'pointer',textAlign:'left',
            display:'flex',alignItems:'center',gap:14,
            opacity: tipo.id === 'diaria' && diariaAtiva ? 0.85 : 1,
          }}>
            <span style={{fontSize:28}}>{tipo.icone}</span>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:600,color:CORES.branco}}>{tipo.nome}</div>
              <div style={{fontSize:11,color:CORES.brancoMuted}}>{tipo.desc}</div>
              {tipo.prazoKey && (
                <div style={{fontSize:10,marginTop:5,color:CORES.dourado,fontWeight:600}}>
                  ⏱ {t(tipo.prazoKey)}
                </div>
              )}
              {tipo.focoKey && (
                <div style={{fontSize:10,marginTop:3,color:CORES.brancoMuted,lineHeight:1.4}}>
                  {t(tipo.focoKey)}
                </div>
              )}
              {tipo.id === 'diaria' ? (
                <div style={{fontSize:10,marginTop:4,color: diariaAtiva ? '#F87171' : '#34D399'}}>
                  {diariaAtiva
                    ? t('tarot.dailyNextIn', { time: formatarTempoRestante(msAteProximaDiaria(userId), lang) })
                    : t('tarot.dailyOnce')}
                </div>
              ) : !isPremium && (
                <div style={{fontSize:10,marginTop:4,color: gratisEsgotada ? '#F87171' : '#34D399'}}>
                  {gratisEsgotada ? t('tarot.paidOption') : t('tarot.includedFree', { max: MAX_LEITURAS_GRATIS })}
                </div>
              )}
            </div>
            <div style={{fontSize:11,color:CORES.dourado,fontWeight:700}}>
              {tipo.id === 'diaria' ? t('tarot.dailyBadge') : (tipo.n > 1 ? t('tarot.cardsPlural', { n: tipo.n }) : t('tarot.cards', { n: tipo.n }))}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function TelaPergunta({ tipo, pergunta, setPergunta, onVoltar, podeLer, isPremium, restantes, onComecar, onPagar, onComecarPago, onPremium, t, aIniciarLeitura = false }) {
  const [aPagar, setAPagar] = useState(false)

  const handlePagarLeitura = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (aPagar || typeof onPagar !== 'function') return
    setAPagar(true)
    try {
      await onPagar(
        t('tarot.payDesc', { tipo: tipo?.nome || '' }),
        PRECO_TAROT,
        onComecarPago,
        { productType: 'tarot' },
      )
    } finally {
      setAPagar(false)
    }
  }

  return (
    <div style={{padding:'28px 20px 110px'}}>
      <button type="button" onClick={onVoltar} style={{background:'none',border:'none',color:CORES.brancoMuted,cursor:'pointer',fontSize:13,marginBottom:20,padding:0}}>{t('common.back')}</button>
      <div style={{textAlign:'center',marginBottom:28}}>
        <div style={{fontSize:44}}>{tipo?.icone}</div>
        <h2 style={{color:CORES.dourado,margin:'8px 0 4px'}}>{tipo?.nome}</h2>
        <p style={{fontSize:12,color:CORES.brancoMuted}}>{tipo?.desc}</p>
        {tipo?.prazoKey && (
          <p style={{fontSize:11,color:CORES.dourado,margin:'10px 0 0',fontWeight:600}}>⏱ {t(tipo.prazoKey)}</p>
        )}
        {tipo?.focoKey && (
          <p style={{fontSize:11,color:CORES.brancoMuted,margin:'6px 0 0',lineHeight:1.45}}>{t(tipo.focoKey)}</p>
        )}
      </div>
      <div style={{background:'rgba(255,255,255,0.04)',borderRadius:14,border:`1px solid rgba(223,183,108,0.2)`,padding:18,marginBottom:20}}>
        <label style={{fontSize:11,color:CORES.dourado,textTransform:'uppercase',letterSpacing:'0.08em',display:'block',marginBottom:10}}>
          {t('tarot.questionLabel')}
        </label>
        <textarea value={pergunta} onChange={e=>setPergunta(e.target.value)} placeholder={t('tarot.questionPlaceholder')} maxLength={200}
          style={{width:'100%',background:'rgba(255,255,255,0.05)',border:`1px solid rgba(223,183,108,0.2)`,borderRadius:10,color:CORES.branco,fontSize:14,padding:12,resize:'none',height:80,boxSizing:'border-box',outline:'none'}}/>
      </div>
      {isPremium ? (
        <button type="button" disabled={aIniciarLeitura} onClick={onComecar} style={{...btnDourado,width:'100%',opacity:aIniciarLeitura?0.7:1}}>
          {aIniciarLeitura ? t('tarot.shuffling') : t('tarot.shuffleReveal')}
        </button>
      ) : podeLer ? (
        <button type="button" disabled={aIniciarLeitura} onClick={onComecar} style={{...btnDourado,width:'100%',opacity:aIniciarLeitura?0.7:1}}>
          {aIniciarLeitura
            ? t('tarot.shuffling')
            : (restantes === 1 ? t('tarot.shuffleFree', { count: restantes }) : t('tarot.shuffleFreePlural', { count: restantes }))}
        </button>
      ) : (
        <div style={{background:'rgba(223,183,108,0.06)',border:`1px solid ${CORES.dourado}`,borderRadius:14,padding:20,textAlign:'center',position:'relative',zIndex:1}}>
          <div style={{fontSize:28,fontWeight:700,color:CORES.dourado,marginBottom:8}}>{t('tarot.price')}</div>
          <p style={{fontSize:13,color:CORES.brancoMuted,marginBottom:16,lineHeight:1.5}}>
            {t('tarot.paywallText', { max: MAX_LEITURAS_GRATIS })}
          </p>
          <button type="button" disabled={aPagar} onClick={handlePagarLeitura} style={{...btnDourado,width:'100%',marginBottom:10,opacity:aPagar?0.6:1}}>
            {aPagar ? t('pagamento.redirecting') : t('tarot.payOne')}
          </button>
          {onPremium && (
            <button type="button" onClick={onPremium} style={{
              width:'100%',padding:'14px',borderRadius:14,marginBottom:10,
              background:'rgba(139,92,246,0.15)',border:`1px solid rgba(139,92,246,0.4)`,
              color:CORES.dourado,fontSize:14,fontWeight:700,cursor:'pointer',
            }}>
              {t('tarot.premiumBtn')}
            </button>
          )}
          <p style={{fontSize:11,color:CORES.brancoMuted}}>{t('tarot.paymentMethods')}</p>
        </div>
      )}
    </div>
  )
}

function TelaEmbaralhar({ t, cartaVerso = MAJOR_ARCANA[0] }) {
  const CARTA = useTamanhoCartas()
  const { w: cardW, h: cardH } = dimensoesCarta(CARTA.embaralhar)
  const stack = Array.from({ length: 8 })
  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'50vh',padding:20,gap:20,overflow:'visible'}}>
      <style>{`
        @keyframes riffle {
          0% { transform: translate(0,0) rotate(0deg) scale(0.96); }
          12% { transform: translate(-42px,-22px) rotate(-22deg) scale(1.02); }
          28% { transform: translate(40px,-10px) rotate(18deg) scale(1.04); }
          44% { transform: translate(-28px,18px) rotate(-14deg) scale(1); }
          60% { transform: translate(24px,22px) rotate(12deg) scale(1.02); }
          76% { transform: translate(-16px,8px) rotate(-8deg) scale(0.99); }
          100% { transform: translate(0,0) rotate(0deg) scale(0.96); }
        }
        @keyframes riffleBurst {
          0%,100% { transform: scale(1); opacity: 0.35; }
          50% { transform: scale(1.35); opacity: 0.85; }
        }
        @keyframes orbitGlow {
          0%,100% { box-shadow: 0 0 0 rgba(223,183,108,0.0); }
          50% { box-shadow: 0 0 32px rgba(223,183,108,0.45); }
        }
        @keyframes pulseFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes sparkle {
          0%,100% { opacity: 0; transform: scale(0.6) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.3) rotate(50deg); }
        }
      `}</style>
      <div style={{position:'relative',width:cardW + 90,height:cardH + 64,overflow:'visible'}}>
        {stack.map((_,i)=>(
          <div key={i} style={{
            position:'absolute',
            top: 12 + ((i % 2) * 3),
            left: 24 + (i % 3) * 2,
            animation:`riffle 0.52s cubic-bezier(.4,.05,.6,.95) ${i*0.045}s infinite, orbitGlow 0.9s ease-in-out ${i*0.07}s infinite`,
            transformOrigin:'center center',
            filter: `brightness(${0.92 + (i * 0.015)})`,
            zIndex: i + 1,
          }}>
            <CartaTarot carta={cartaVerso} virada size={CARTA.embaralhar}/>
          </div>
        ))}
        {[0,1,2,3,4,5].map((i)=>(
          <span key={`spark-${i}`} style={{
            position:'absolute',
            top: 6 + (i * 16),
            right: 4 + ((i % 2) * 14),
            left: i % 2 === 0 ? 4 + (i * 8) : undefined,
            color: '#DFB76C',
            fontSize: 11 + (i % 3),
            animation:`sparkle 0.75s ease-in-out ${i*0.12}s infinite`,
            userSelect: 'none',
            pointerEvents: 'none',
          }}>✦</span>
        ))}
      </div>
      <p style={{fontSize:15,color:CORES.brancoMuted,fontStyle:'italic',textAlign:'center',animation:'pulseFloat 1.9s ease-in-out infinite'}}>
        {t('tarot.shuffling')}
      </p>
    </div>
  )
}

function TelaDistribuir({ cartas, posicoes, distribuindo, t, cartaVerso = MAJOR_ARCANA[0] }) {
  const CARTA = useTamanhoCartas()
  return (
    <div style={{padding:'30px 20px',textAlign:'center',overflow:'visible'}}>
      <style>{`
        @keyframes deal{from{transform:translateY(-70px) rotate(-12deg) scale(0.65);opacity:0}to{transform:translateY(0) rotate(0deg) scale(1);opacity:1}}
        @keyframes dealShuffle{0%,100%{transform:rotate(0deg)}25%{transform:rotate(-6deg)}75%{transform:rotate(5deg)}}
      `}</style>
      <p style={{fontSize:13,color:CORES.brancoMuted,marginBottom:20}}>{t('tarot.dealing')}</p>
      <div style={{display:'flex',justifyContent:'center',flexWrap:'wrap',gap:10}}>
        {posicoes.map((pos,i)=>(
          <div key={i} style={{textAlign:'center',
            animation: i<=distribuindo ? 'deal 0.32s ease-out forwards, dealShuffle 0.32s ease-in-out' : 'none',
            opacity: i<=distribuindo ? 1 : 0.12,
          }}>
            <CartaTarot carta={cartaVerso} virada size={CARTA.distribuir}/>
            <div style={{fontSize:9,color:CORES.brancoMuted,marginTop:4,width:CARTA.distribuir}}>{pos}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TelaRevelar({ cartas, reveladas = [], onRevelar, animarCliqueIdx = -1, posicoes = [], tipo, pergunta, resultado, onVoltar, t }) {
  const CARTA = useTamanhoCartas()
  const todasReveladas = reveladas.length > 0 && reveladas.length === cartas.length && reveladas.every(Boolean)

  return (
    <div style={{padding:'20px 20px 110px',overflow:'visible'}}>
      <style>{`
        @keyframes tapShuffleSpin {
          0% { transform: rotate(0deg) scale(1) translate(0,0); filter: brightness(1); }
          20% { transform: rotate(-14deg) scale(1.05) translate(-4px,-3px); filter: brightness(1.12); }
          45% { transform: rotate(12deg) scale(1.04) translate(5px,-2px); filter: brightness(1.08); }
          70% { transform: rotate(-7deg) scale(1.02) translate(-2px,2px); filter: brightness(1.05); }
          100% { transform: rotate(0deg) scale(1) translate(0,0); filter: brightness(1); }
        }
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
      <div style={{display:'flex',justifyContent:'center',flexWrap:'wrap',gap:14,marginBottom:20,overflow:'visible'}}>
        {cartas.map((c,i)=>(
          <div key={i} style={{textAlign:'center'}}>
            <div
              onClick={()=>onRevelar(i)}
              style={{
                cursor: reveladas[i] ? 'default' : 'pointer',
                display: 'inline-block',
                animation: animarCliqueIdx === i ? 'tapShuffleSpin 380ms ease-in-out 1' : 'none',
                transformOrigin: 'center center',
              }}
            >
              <CartaTarot
                carta={c}
                size={CARTA.revelar}
                virada={!reveladas[i]}
                animarFlip={!!reveladas[i]}
              />
            </div>
            <div style={{fontSize:10,color:CORES.brancoMuted,marginTop:5,width:CARTA.revelar,lineHeight:1.3}}>
              {reveladas[i]
                ? (c.tipo === 'lenormand' ? c.nome : (c.invertida ? t('tarot.reversedShort') : t('tarot.uprightShort')))
                : posicoes[i]}
            </div>
          </div>
        ))}
      </div>

      {/* Dica */}
      {!todasReveladas && (
        <p style={{textAlign:'center',fontSize:12,color:CORES.brancoMuted,marginBottom:16}}>{t('tarot.tapToReveal')}</p>
      )}

      {/* Interpretações individuais após revelar */}
      {cartas.map((c,i) => reveladas[i] && (
        <div key={i} style={{background:'rgba(255,255,255,0.04)',border:`1px solid rgba(223,183,108,0.2)`,borderRadius:14,padding:18,marginBottom:12}}>
          <div style={{display:'flex',gap:14,alignItems:'flex-start',marginBottom:12}}>
            <CartaTarot carta={c} size={CARTA.revelarMini}/>
            <div>
              <div style={{fontSize:8,color:CORES.brancoMuted,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:4}}>{posicoes[i]}</div>
              <div style={{fontSize:16,fontWeight:700,color:CORES.branco,lineHeight:1.2}}>
                {c.nome} {c.invertida&&<span style={{fontSize:11,color:'#EF4444'}}>{t('tarot.reversed')}</span>}
              </div>
              <div style={{display:'flex',gap:5,flexWrap:'wrap',marginTop:6}}>
                {(c.palavras || []).map(p=>(
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

      {todasReveladas && resultado?.mensagemAnjos && (
        <div style={{
          background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.35)',
          borderRadius: 16, padding: 20, marginTop: 14,
        }}>
          <div style={{ fontSize: 10, color: '#C4B5FD', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10, fontWeight: 700 }}>
            ✦ {t('tarot.angelMessage')}
          </div>
          <p style={{ fontSize: 14, color: CORES.brancoSuave, lineHeight: 1.75, margin: 0, fontStyle: 'italic' }}>
            {resultado.mensagemAnjos}
          </p>
        </div>
      )}

      <button type="button" onClick={onVoltar} style={{width:'100%',marginTop:16,background:'rgba(255,255,255,0.04)',border:`1px solid rgba(255,255,255,0.1)`,borderRadius:12,color:CORES.brancoMuted,fontSize:14,padding:'12px',cursor:'pointer'}}>
        {t('tarot.newReading')}
      </button>
    </div>
  )
}

// btnDourado moved to top of file
