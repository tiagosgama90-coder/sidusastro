/**
 * Sistema de Tarot Sidus - baralho profissional de 78 cartas (Mystic Marchetti)
 * ─ Ilustrações + interpretações profissionais
 * ─ 3 leituras gratuitas por conta · depois 2 € por leitura (BR: 1 € PIX) ou Premium
 * ─ 9 tipos de leitura · interpretações personalizadas com mapa natal
 */
import { useState, useEffect, useRef } from 'react'
import { Clock } from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { localizeArcano, getTiposTarot, getPosicoesTarot } from '../lib/i18n/tarotArcana.js'
import { PRECO_TAROT, precoTarotVitrine, precoPremiumVitrine, formatPrecoEuro } from '../lib/pricing.js'
import { sortearCartas, getCartaById, MAJOR_ARCANA } from '../lib/tarot/deck.js'
import { sortearLenormand, LENORMAND_VERSO } from '../lib/tarot/lenormand.js'
import { interpretarLeitura } from '../lib/tarot/interpretacao.js'
import { CartaTarot, dimensoesCarta } from './CartaTarot.jsx'
import { TarotTipoArte } from './TarotTipoArte.jsx'
import { imagemCartaUrl } from '../lib/tarot/images.js'
import { garantirVersoCarregado, precarregarVersos } from '../lib/tarot/versoCache.js'
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
  revelar: 94,
  revelarMini: 70,
  embaralhar: 94,
  distribuir: 94,
  diaria: 132,
}

const CARTA_DESKTOP = {
  revelar: 132,
  revelarMini: 96,
  embaralhar: 132,
  distribuir: 132,
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
const BARALHO_VISUAL_MAX = 8
const BARALHO_TAROT_TOTAL = 78
const BARALHO_CIGANO_TOTAL = 36

function cartasNoBaralho(tipoId) {
  return tipoId === 'cigano' ? BARALHO_CIGANO_TOTAL : BARALHO_TAROT_TOTAL
}

function tamanhoCartaEmbaralhar(base) {
  return base
}

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

function maxLeiturasGratis() {
  return MAX_LEITURAS_GRATIS
}

function leiturasGratisRestantes(isPremium, userId, leiturasRemotas = 0) {
  if (isPremium === true) return Infinity
  return Math.max(0, maxLeiturasGratis() - leiturasGratisUsadas(userId, leiturasRemotas))
}

function podeLerGratis(isPremium, userId, leiturasRemotas = 0) {
  if (isPremium === true) return true
  return leiturasGratisUsadas(userId, leiturasRemotas) < maxLeiturasGratis()
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
function consumirCreditoTarotPago() {
  if (sessionStorage.getItem('sidus_tarot_paid') === '1') {
    sessionStorage.removeItem('sidus_tarot_paid')
    return true
  }
  return false
}

export function EcraTarot({ mapaNatal, isPremium, userId, leiturasTarotUsadas = 0, tarotCreditoPago = false, onTarotCreditoConsumido, onLeituraGratisUsada, onPagar, onVoltar, onPremium, isBrasil = false }) {
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
    precarregarVersos()
  }, [])

  useEffect(() => {
    if (tarotCreditoPago || consumirCreditoTarotPago()) {
      setLeituraPaga(true)
    }
  }, [tarotCreditoPago])

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
  const gratisEsgotada = !isPremium && usadas >= maxLeiturasGratis()
  const precoLeitura = precoTarotVitrine(isBrasil)
  const precoLeituraFmt = formatPrecoEuro(precoLeitura)
  const vipPrecoFmt = formatPrecoEuro(precoPremiumVitrine(isBrasil))

  const refrescar = () => setTick(n => n + 1)

  const iniciarLeitura = (t) => {
    if (t.id === 'diaria' && !podeFazerLeituraDiaria(userId)) {
      setTipoId('diaria')
      setFase('diaria-bloqueada')
      return
    }
    setTipoId(t.id)
    setPergunta('')
    setCartas([])
    setReveladas([])
    setResultado(null)
    setFase('pergunta')
  }

  const comecarEmbaralhar = async (tipoEscolhidoId = tipoId) => {
    if (aIniciarLeitura || embaralhando || distribuindo >= 0) return
    const tipoAtual = TIPOS.find((x) => x.id === tipoEscolhidoId) || tipo
    if (!tipoAtual?.n) return
    setAIniciarLeitura(true)
    const isDiaria = tipoEscolhidoId === 'diaria'
    if (!isDiaria && !isPremium && leituraPaga) {
      setLeituraPaga(false)
      onTarotCreditoConsumido?.()
    } else if (!isDiaria && !isPremium && !leituraPaga && podeLerGratis(isPremium, userId, leiturasTarotUsadas)) {
      const n = registarLeituraGratis(userId)
      onLeituraGratisUsada?.(n)
      refrescar()
    }
    await garantirVersoCarregado(tipoEscolhidoId === 'cigano' ? 'lenormand' : 'tarot')
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

  useEffect(() => {
    if (!cartas.length) return
    cartas.forEach((c) => {
      const src = imagemCartaUrl(c)
      if (!src) return
      const img = new Image()
      img.src = src
    })
  }, [cartas])

  const revelarCarta = (i) => {
    if (!Array.isArray(reveladas) || !cartas[i] || reveladas[i]) return

    const novo = [...reveladas]
    novo[i] = true
    setReveladas(novo)
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
  }

  const voltar = () => {
    if (!tarotCreditoPago) setLeituraPaga(false)
    setAIniciarLeitura(false)
    setFase('seleccionar')
    setTipoId(null)
    setCartas([])
    setReveladas([])
    setResultado(null)
    setEmbaralhando(false)
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
    <TelaSeleccionar tipos={TIPOS.map((tp) => {
      const map = mapaTipos?.[tp.id]
      const nome = map?.nome ?? t(`tarot.types.${tp.id}.nome`)
      const desc = map?.desc ?? t(`tarot.types.${tp.id}.desc`)
      return {
        ...tp,
        nome: nome && !String(nome).startsWith('tarot.types.') ? nome : tp.nome,
        desc: desc && !String(desc).startsWith('tarot.types.') ? desc : tp.desc,
      }
    })} lang={lang} t={t} userId={userId} onSeleccionar={iniciarLeitura} isPremium={isPremium} gratisEsgotada={gratisEsgotada} restantes={restantes} tick={tick} onVoltar={onVoltar} isBrasil={isBrasil} precoLeituraFmt={precoLeituraFmt} vipPrecoFmt={vipPrecoFmt}/>
  )

  if (embaralhando) return (
    <TelaEmbaralhar
      t={t}
      numCartas={cartasNoBaralho(tipoId)}
      cartaVerso={tipoId === 'cigano' ? LENORMAND_VERSO : MAJOR_ARCANA[0]}
    />
  )

  if (distribuindo>=0) return (
    <TelaDistribuir cartas={cartas} posicoes={posicoes} distribuindo={distribuindo} t={t} cartaVerso={tipoId === 'cigano' ? LENORMAND_VERSO : MAJOR_ARCANA[0]} />
  )

  if (fase==='pergunta') return (
    <TelaPergunta tipo={tipoLabel} lang={lang} t={t} pergunta={pergunta} setPergunta={setPergunta}
      onVoltar={voltar} podeLer={podeLer} leituraPaga={leituraPaga} isPremium={isPremium} restantes={restantes}
      onPagar={onPagar}
      aIniciarLeitura={aIniciarLeitura}
      isBrasil={isBrasil}
      precoLeitura={precoLeitura}
      precoLeituraFmt={precoLeituraFmt}
      vipPrecoFmt={vipPrecoFmt}
      onComecar={() => {
        if (aIniciarLeitura) return
        if (isPremium || podeLer || leituraPaga) {
          comecarEmbaralhar(tipoId)
        } else {
          onPagar(t('tarot.payDesc', { tipo: tipo?.nome || '' }), precoLeitura, () => {
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
        <div style={{ fontSize: 10, color: '#E8A855', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6, fontWeight: 700 }}>
          {t('tarot.dailyLocked')}
        </div>
        <p style={{ fontSize: 13, color: CORES.brancoMuted, margin: '0 0 10px', lineHeight: 1.65 }}>{t('tarot.dailyLockedDesc')}</p>
        <p style={{ fontSize: 14, fontWeight: 600, color: '#E8A855', margin: 0 }}>
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

function textoHorizonteTemporal(t, tipoId, campo) {
  if (!tipoId) return null
  const val = t(`tarot.types.${tipoId}.${campo}`)
  if (!val || String(val).startsWith('tarot.types.')) return null
  return val
}

function InfoHorizonteTemporal({ tipoId, t, inline = false }) {
  const prazo = textoHorizonteTemporal(t, tipoId, 'prazo')
  const foco = textoHorizonteTemporal(t, tipoId, 'foco')
  if (!prazo) return null

  if (inline) {
    return (
      <p style={{
        fontSize: 10,
        color: 'rgba(255,255,255,0.42)',
        margin: '5px 0 0',
        lineHeight: 1.4,
      }}>
        {prazo}{foco ? ` · ${foco}` : ''}
      </p>
    )
  }

  return (
    <p style={{
      fontSize: 11,
      color: 'rgba(255,255,255,0.48)',
      margin: '10px 0 0',
      lineHeight: 1.45,
      maxWidth: 320,
      marginLeft: 'auto',
      marginRight: 'auto',
    }}>
      <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {t('tarot.timeframeCovers')}{' '}
      </span>
      {prazo}
      {foco && (
        <span style={{ display: 'block', fontSize: 10, marginTop: 3, fontStyle: 'italic' }}>
          {foco}
        </span>
      )}
    </p>
  )
}

function TarotTipoCard({
  tipo, bloqueada, onSeleccionar, t, cols, isPremium, gratisEsgotada,
  diariaAtiva, userId, lang, precoLeituraFmt,
}) {
  const isMobile = cols === 1
  const [hover, setHover] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const prazo = textoHorizonteTemporal(t, tipo.id, 'prazo')
  const foco = textoHorizonteTemporal(t, tipo.id, 'foco')

  const moverMagia = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  const ctaLabel = tipo.id === 'diaria'
    ? t('tarot.startDaily')
    : (tipo.n > 1 ? t('tarot.startCards', { n: tipo.n }) : t('tarot.startCard', { n: tipo.n }))

  const bodyContent = (
    <>
      <div className="tarot-tipo-card__nome">{tipo.nome}</div>
      <div className="tarot-tipo-card__desc">{tipo.desc}</div>
      {prazo && (
        <div className="tarot-tipo-card__prazo">
          <Clock size={12} className="tarot-tipo-card__prazo-icon" aria-hidden />
          <span>{prazo}</span>
        </div>
      )}
      {foco && (
        <div className={`tarot-tipo-card__foco${expanded ? ' tarot-tipo-card__foco--open' : ''}`}>{foco}</div>
      )}
      {isMobile && foco && !expanded && (
        <div className="tarot-tipo-card__reveal-hint">{t('tarot.tapToReveal')}</div>
      )}
      {tipo.id === 'diaria' ? (
        <div className={`tarot-tipo-card__badge ${diariaAtiva ? 'tarot-tipo-card__badge--warn' : 'tarot-tipo-card__badge--ok'}`}>
          {diariaAtiva
            ? t('tarot.dailyNextIn', { time: formatarTempoRestante(msAteProximaDiaria(userId), lang) })
            : t('tarot.dailyOnce')}
        </div>
      ) : !isPremium && (
        <div className={`tarot-tipo-card__badge ${gratisEsgotada ? 'tarot-tipo-card__badge--warn' : 'tarot-tipo-card__badge--ok'}`}>
          {gratisEsgotada ? t('tarot.paidOption', { price: precoLeituraFmt }) : t('tarot.includedFree', { max: MAX_LEITURAS_GRATIS })}
        </div>
      )}
    </>
  )

  if (isMobile) {
    return (
      <div
        className={`tarot-tipo-card tarot-tipo-card--mobile${expanded ? ' tarot-tipo-card--open' : ''}${hover ? ' tarot-tipo-card--magic' : ''}${bloqueada ? ' tarot-tipo-card--bloqueada' : ''}`}
      >
        <div className="tarot-tipo-card__cosmic" aria-hidden>
          <span>☽</span><span>✦</span><span>☉</span><span>✧</span><span>☽</span>
        </div>
        <div className="tarot-tipo-card__sparkles" aria-hidden>✦</div>
        <button
          type="button"
          className="tarot-tipo-card__peek"
          onClick={() => setExpanded((v) => !v)}
          onFocus={() => setHover(true)}
          onBlur={() => setHover(false)}
          aria-expanded={expanded}
        >
          <div className="tarot-tipo-card__arte">
            <TarotTipoArte tipoId={tipo.id} size={108} hovered={expanded || hover} />
          </div>
          <div className="tarot-tipo-card__body">{bodyContent}</div>
        </button>
        <button
          type="button"
          className="tarot-tipo-card__cta tarot-tipo-card__cta--action"
          onClick={() => onSeleccionar(tipo)}
        >
          {ctaLabel}
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      className={`tarot-tipo-card${hover ? ' tarot-tipo-card--magic' : ''}${bloqueada ? ' tarot-tipo-card--bloqueada' : ''}`}
      onClick={() => onSeleccionar(tipo)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      onMouseMove={moverMagia}
    >
      <div className="tarot-tipo-card__sparkles" aria-hidden>✦</div>
      <div className="tarot-tipo-card__arte">
        <TarotTipoArte
          tipoId={tipo.id}
          size={cols === 3 ? 108 : 118}
          hovered={hover}
        />
      </div>
      <div className="tarot-tipo-card__body">{bodyContent}</div>
      <div className="tarot-tipo-card__cta" aria-hidden>{ctaLabel}</div>
    </button>
  )
}

function colsFromWidth(w) {
  if (w >= 900) return 3
  if (w >= 768) return 2
  return 1
}

function TelaSeleccionar({ tipos, onSeleccionar, isPremium, gratisEsgotada, restantes, tick, onVoltar, userId, lang, t, isBrasil = false, precoLeituraFmt = '2,00', vipPrecoFmt = '9,99' }) {
  void tick
  const diariaAtiva = !podeFazerLeituraDiaria(userId)
  const [cols, setCols] = useState(() => colsFromWidth(typeof window !== 'undefined' ? window.innerWidth : 900))
  useEffect(() => {
    const fn = () => setCols(colsFromWidth(window.innerWidth))
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  return (
    <div className="tarot-seleccionar-page">
      <div className="tarot-seleccionar-centro">
      {onVoltar && (
        <button type="button" onClick={onVoltar} style={{ background:'none', border:'none', color:CORES.dourado, cursor:'pointer', marginBottom:12, fontSize:13 }}>
          {t('common.back')}
        </button>
      )}
      <div className="tarot-seleccionar-hero">
        <div className="tarot-seleccionar-hero__tag">{t('tarot.title')}</div>
        <h2 className="tarot-seleccionar-hero__title">{t('tarot.subtitle')}</h2>
        <p className="tarot-seleccionar-hero__lead">{t('tarot.desc')}</p>
      </div>
      {!isPremium && (
        <div style={{background:'rgba(223,183,108,0.07)',border:`1px solid rgba(223,183,108,0.25)`,borderRadius:10,padding:'8px 14px',marginBottom:18,display:'flex',alignItems:'center',gap:8}}>
          <span style={{fontSize:16}}>✦</span>
          <span style={{fontSize:12,color:CORES.brancoMuted}}>
            {gratisEsgotada
              ? <><b style={{color:'#E8A855'}}>{t('tarot.freeExhausted')}</b>{isBrasil ? t('tarot.thenPaidBr', { price: precoLeituraFmt, vipPrice: vipPrecoFmt }) : t('tarot.thenPaid', { price: precoLeituraFmt, vipPrice: vipPrecoFmt })}</>
              : <><b style={{color:CORES.dourado}}>{restantes === 1 ? t('tarot.freeRemaining', { count: restantes }) : t('tarot.freeRemainingPlural', { count: restantes })}</b>{isBrasil ? t('tarot.thenPaidShortBr', { price: precoLeituraFmt }) : t('tarot.thenPaidShort', { price: precoLeituraFmt })}</>}
          </span>
        </div>
      )}
      <div className={`tarot-tipo-grid tarot-tipo-grid--cols-${cols}${cols === 1 ? ' tarot-tipo-grid--mobile' : ''}`}>
        {tipos.map((tipo) => (
          <TarotTipoCard
            key={tipo.id}
            tipo={tipo}
            bloqueada={tipo.id === 'diaria' && diariaAtiva}
            onSeleccionar={onSeleccionar}
            t={t}
            cols={cols}
            isPremium={isPremium}
            gratisEsgotada={gratisEsgotada}
            diariaAtiva={diariaAtiva}
            userId={userId}
            lang={lang}
            precoLeituraFmt={precoLeituraFmt}
          />
        ))}
      </div>
      </div>
    </div>
  )
}

function TelaPergunta({ tipo, pergunta, setPergunta, onVoltar, podeLer, leituraPaga = false, isPremium, restantes, onComecar, onPagar, onComecarPago, onPremium, t, aIniciarLeitura = false, isBrasil = false, precoLeitura = PRECO_TAROT, precoLeituraFmt = '2,00', vipPrecoFmt = '9,99' }) {
  const podeIniciar = isPremium || podeLer || leituraPaga
  const [aPagar, setAPagar] = useState(false)

  const handlePagarLeitura = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (aPagar || typeof onPagar !== 'function') return
    setAPagar(true)
    try {
      await onPagar(
        t('tarot.payDesc', { tipo: tipo?.nome || '' }),
        precoLeitura,
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
        <h2 style={{color:CORES.dourado,margin:'8px 0 6px'}}>{tipo?.nome}</h2>
        <p style={{fontSize:15,color:CORES.brancoSuave,lineHeight:1.5,margin:'0 0 4px',fontWeight:500}}>{tipo?.desc}</p>
        <InfoHorizonteTemporal tipoId={tipo?.id} t={t} />
      </div>
      <div style={{background:'rgba(255,255,255,0.04)',borderRadius:14,border:`1px solid rgba(223,183,108,0.2)`,padding:18,marginBottom:20}}>
        <label style={{fontSize:11,color:CORES.dourado,textTransform:'uppercase',letterSpacing:'0.08em',display:'block',marginBottom:10}}>
          {t('tarot.questionLabel')}
        </label>
        <textarea value={pergunta} onChange={e=>setPergunta(e.target.value)} placeholder={t('tarot.questionPlaceholder')} maxLength={200}
          style={{width:'100%',background:'rgba(255,255,255,0.05)',border:`1px solid rgba(223,183,108,0.2)`,borderRadius:10,color:CORES.branco,fontSize:14,padding:12,resize:'none',height:80,boxSizing:'border-box',outline:'none'}}/>
      </div>
      {podeIniciar ? (
        <button type="button" disabled={aIniciarLeitura} onClick={onComecar} style={{...btnDourado,width:'100%',opacity:aIniciarLeitura?0.7:1}}>
          {aIniciarLeitura
            ? t('tarot.shuffling')
            : isPremium
              ? t('tarot.shuffleReveal')
              : leituraPaga
                ? t('tarot.shuffleReveal')
                : (restantes === 1 ? t('tarot.shuffleFree', { count: restantes }) : t('tarot.shuffleFreePlural', { count: restantes }))}
        </button>
      ) : (
        <div style={{background:'rgba(223,183,108,0.06)',border:`1px solid ${CORES.dourado}`,borderRadius:14,padding:20,textAlign:'center',position:'relative',zIndex:1}}>
          <div style={{fontSize:28,fontWeight:700,color:CORES.dourado,marginBottom:8}}>{precoLeituraFmt} €</div>
          <p style={{fontSize:13,color:CORES.brancoMuted,marginBottom:16,lineHeight:1.5}}>
            {isBrasil
              ? t('tarot.paywallTextBr', { max: MAX_LEITURAS_GRATIS, price: precoLeituraFmt, vipPrice: vipPrecoFmt })
              : t('tarot.paywallText', { max: MAX_LEITURAS_GRATIS, price: precoLeituraFmt, vipPrice: vipPrecoFmt })}
          </p>
          <button type="button" disabled={aPagar} onClick={handlePagarLeitura} style={{...btnDourado,width:'100%',marginBottom:10,opacity:aPagar?0.6:1}}>
            {aPagar ? t('pagamento.redirecting') : (isBrasil ? t('tarot.payOneBr', { price: precoLeituraFmt }) : t('tarot.payOne', { price: precoLeituraFmt }))}
          </button>
          {onPremium && (
            <button type="button" onClick={onPremium} style={{
              width:'100%',padding:'14px',borderRadius:14,marginBottom:10,
              background:'rgba(139,92,246,0.15)',border:`1px solid rgba(139,92,246,0.4)`,
              color:CORES.dourado,fontSize:14,fontWeight:700,cursor:'pointer',
            }}>
              {isBrasil ? t('tarot.premiumBtnBr', { price: vipPrecoFmt }) : t('tarot.premiumBtn', { price: vipPrecoFmt })}
            </button>
          )}
          <p style={{fontSize:11,color:CORES.brancoMuted}}>{t('tarot.paymentMethods')}</p>
        </div>
      )}
    </div>
  )
}

function CartaVersoEmbaralhar({ size, layer, cartaVerso }) {
  const offset = layer * 1.8
  return (
    <div
      style={{
        position: 'absolute',
        top: offset,
        left: offset,
        zIndex: layer + 1,
      }}
    >
      <CartaTarot carta={cartaVerso} virada size={size} />
    </div>
  )
}

function TelaEmbaralhar({ t, numCartas = BARALHO_TAROT_TOTAL, cartaVerso = MAJOR_ARCANA[0] }) {
  const CARTA = useTamanhoCartas()
  const cardSize = tamanhoCartaEmbaralhar(CARTA.revelar)
  const { w: cardW, h: cardH } = dimensoesCarta(cardSize)
  const pileLayers = 3
  const pileDepth = Math.round((pileLayers - 1) * 1.8)
  const stageW = cardW * 2 + 48
  const stageH = cardH + pileDepth + 20

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '44vh', padding: 20, gap: 14 }}>
      <style>{`
        @keyframes tarotShuffleLeft {
          0%, 100% { transform: translateX(0) rotate(-2deg); }
          50% { transform: translateX(28px) rotate(3deg) translateY(-4px); }
        }
        @keyframes tarotShuffleRight {
          0%, 100% { transform: translateX(0) rotate(2deg); }
          50% { transform: translateX(-28px) rotate(-3deg) translateY(4px); }
        }
      `}</style>

      <div
        style={{
          position: 'relative',
          width: stageW,
          height: stageH,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 8,
            top: 8,
            width: cardW + pileDepth,
            height: cardH + pileDepth,
            animation: 'tarotShuffleLeft 1.1s ease-in-out infinite',
            transformOrigin: 'center bottom',
          }}
        >
          {Array.from({ length: pileLayers }, (_, layer) => (
            <CartaVersoEmbaralhar key={`l-${layer}`} size={cardSize} layer={layer} cartaVerso={cartaVerso} />
          ))}
        </div>

        <div
          style={{
            position: 'absolute',
            right: 8,
            top: 8,
            width: cardW + pileDepth,
            height: cardH + pileDepth,
            animation: 'tarotShuffleRight 1.1s ease-in-out infinite',
            transformOrigin: 'center bottom',
          }}
        >
          {Array.from({ length: pileLayers }, (_, layer) => (
            <CartaVersoEmbaralhar key={`r-${layer}`} size={cardSize} layer={layer} cartaVerso={cartaVerso} />
          ))}
        </div>
      </div>

      <p style={{ fontSize: 14, color: CORES.brancoMuted, fontStyle: 'italic', textAlign: 'center', margin: 0 }}>
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
        @keyframes deal{from{transform:translateY(-12px) scale(0.98);opacity:0.85}to{transform:translateY(0) scale(1);opacity:1}}
      `}</style>
      <p style={{fontSize:13,color:CORES.brancoMuted,marginBottom:20}}>{t('tarot.dealing')}</p>
      <div style={{display:'flex',justifyContent:'center',flexWrap:'wrap',gap:10}}>
        {posicoes.map((pos,i)=>(
          <div key={i} style={{
            textAlign:'center',
            animation: i<=distribuindo ? 'deal 0.22s ease-out forwards' : 'none',
            opacity: i<=distribuindo ? 1 : 0.72,
            filter: i<=distribuindo ? 'none' : 'brightness(0.82)',
          }}>
            <CartaTarot carta={cartaVerso} virada size={CARTA.revelar}/>
            <div style={{fontSize:9,color:CORES.brancoMuted,marginTop:4,width:CARTA.revelar}}>{pos}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TelaRevelar({ cartas, reveladas = [], onRevelar, posicoes = [], tipo, pergunta, resultado, onVoltar, t }) {
  const CARTA = useTamanhoCartas()
  const todasReveladas = reveladas.length > 0 && reveladas.length === cartas.length && reveladas.every(Boolean)

  return (
    <div style={{padding:'20px 20px 110px',overflow:'visible'}}>
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
              }}
            >
              <CartaTarot
                carta={c}
                size={CARTA.revelar}
                virada={!reveladas[i]}
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
