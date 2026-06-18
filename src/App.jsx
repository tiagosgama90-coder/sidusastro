import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import {
  Sparkles,
  Moon,
  Star,
  Compass,
  Heart,
  Layers,
  Activity,
  BookOpen,
  Crown,
  Check,
  Send,
  ChevronLeft,
  Home,
  Map,
  Grid3x3,
  MessageCircle,
  Sun,
  ArrowUp,
  MapPin,
  Loader2,
  Info,
  LogOut,
  Lock,
  Mail,
  Eye,
  EyeOff,
  User,
} from 'lucide-react'
import { Body, GeoVector, Ecliptic, MakeTime, SiderealTime } from 'astronomy-engine'
import { pesquisarCidades, pesquisarFusoHorario, geocodificarCidade } from './lib/geocoding'
import { EcraTarot, MAX_LEITURAS_GRATIS } from './components/Tarot'
import { ModalPagamento, verificarSessaoPagamento } from './components/Pagamento'
import { RecaptchaCheckbox } from './components/Recaptcha'
import { Perfil } from './components/Perfil'
import { PoliticaPrivacidade } from './components/PoliticaPrivacidade'
import { InterpretacaoMapa } from './components/InterpretacaoMapa'
import { BussolaCosmica, Sinastria, Biorritmo, DiarioAstral } from './components/FerramentasPremium'
import { auth, db, firebaseDisponivel } from './lib/firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  reload,
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { normalizarCusps, cuspsEqualHouse, atribuirCasasPlanetas } from './lib/casasPlacidus.js'
import { gerarAnaliseCompleta, gerarResumoGratuito } from './lib/mapaInterpretacao.js'
import { calcularFaseLua } from './lib/faseLua.js'
import { useNavigate, useLocation } from 'react-router-dom'
import { passoFromPath, pathFromPasso } from './lib/routes.js'
import { initAdSense } from './lib/adsense.js'
import { AdSenseBanner } from './components/AdSenseBanner.jsx'

const CORES = {
  fundo: '#0B071E',
  dourado: '#DFB76C',
  douradoEscuro: '#B8944F',
  branco: '#FFFFFF',
  brancoSuave: 'rgba(255, 255, 255, 0.85)',
  brancoMuted: 'rgba(255, 255, 255, 0.55)',
  vidro: 'rgba(255, 255, 255, 0.06)',
  vidroBorda: 'rgba(223, 183, 108, 0.22)',
  roxoClaro: 'rgba(139, 92, 246, 0.15)',
  sombra: '0 8px 32px rgba(0, 0, 0, 0.45)',
  sombraDourada: '0 4px 24px rgba(223, 183, 108, 0.25)',
}

const SIGNOS = [
  { nome: 'Carneiro', simbolo: '♈', elemento: 'Fogo' },
  { nome: 'Touro', simbolo: '♉', elemento: 'Terra' },
  { nome: 'Gémeos', simbolo: '♊', elemento: 'Ar' },
  { nome: 'Caranguejo', simbolo: '♋', elemento: 'Água' },
  { nome: 'Leão', simbolo: '♌', elemento: 'Fogo' },
  { nome: 'Virgem', simbolo: '♍', elemento: 'Terra' },
  { nome: 'Balança', simbolo: '♎', elemento: 'Ar' },
  { nome: 'Escorpião', simbolo: '♏', elemento: 'Água' },
  { nome: 'Sagitário', simbolo: '♐', elemento: 'Fogo' },
  { nome: 'Capricórnio', simbolo: '♑', elemento: 'Terra' },
  { nome: 'Aquário', simbolo: '♒', elemento: 'Ar' },
  { nome: 'Peixes', simbolo: '♓', elemento: 'Água' },
]

// sweId = Planet enum de @swisseph/core (Sun=0, Moon=1, …, Saturn=6)
const PLANETAS_AGORA = [
  { key: 'sol',      nome: 'Sol',      corpo: Body.Sun,     sweId: 0, simbolo: '☉' },
  { key: 'lua',      nome: 'Lua',      corpo: Body.Moon,    sweId: 1, simbolo: '☽' },
  { key: 'mercurio', nome: 'Mercúrio', corpo: Body.Mercury, sweId: 2, simbolo: '☿' },
  { key: 'venus',    nome: 'Vénus',    corpo: Body.Venus,   sweId: 3, simbolo: '♀' },
  { key: 'marte',    nome: 'Marte',    corpo: Body.Mars,    sweId: 4, simbolo: '♂' },
  { key: 'jupiter',  nome: 'Júpiter',  corpo: Body.Jupiter, sweId: 5, simbolo: '♃' },
  { key: 'saturno',  nome: 'Saturno',  corpo: Body.Saturn,  sweId: 6, simbolo: '♄' },
]

// Mapa natal completo — Swiss Ephemeris (swe_calc_ut) com efemérides licenciadas
const PLANETAS_NATAL = [
  ...PLANETAS_AGORA,
  { key: 'urano',    nome: 'Urano',      corpo: Body.Uranus,  sweId: 7,  simbolo: '♅' },
  { key: 'netuno',   nome: 'Neptuno',    corpo: Body.Neptune, sweId: 8,  simbolo: '♆' },
  { key: 'plutao',   nome: 'Plutão',     corpo: Body.Pluto,   sweId: 9,  simbolo: '♇' },
  { key: 'nodo',     nome: 'Nodo Norte', corpo: null,         sweId: 11, simbolo: '☊' },
  { key: 'quiron',   nome: 'Quíron',     corpo: null,         sweId: 15, simbolo: '⚷' },
]

const DESKTOP_BP = 768
const MOBILE_MAX = 430

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.innerWidth >= DESKTOP_BP
  )
  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= DESKTOP_BP)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return isDesktop
}

const ASPECTOS_MAIORES = [
  { nome: 'Conjuncao', angulo: 0 },
  { nome: 'Sextil', angulo: 60 },
  { nome: 'Quadratura', angulo: 90 },
  { nome: 'Trigono', angulo: 120 },
  { nome: 'Oposicao', angulo: 180 },
]

const FERRAMENTAS = [
  { id: 'bussola',  nome: 'Bússola Cósmica 2026',  icon: Compass,   premium: true },
  { id: 'sinastria',nome: 'Radar de Afinidades',   sub: 'Sinastria', icon: Heart, premium: true },
  { id: 'biorritmo',nome: 'Fluxo Vital',            sub: 'Biorritmo', icon: Activity, premium: false },
  { id: 'diario',   nome: 'Diário Astral',          icon: BookOpen,  premium: false },
]

const BENEFICIOS_VIP = [
  'Mapa Astral completo — efemérides, Placidus, PDF profissional + email',
  'Fases da Lua em tempo real no Céu de Hoje',
  'Leituras de Tarot ilimitadas em todos os baralhos',
  'Bússola Cósmica 2026 com previsões mensais',
  'Radar de Afinidades e Sinastria completa',
  'Chat ilimitado com o Oráculo AuraBot',
  'Alertas de trânsitos planetários em tempo real',
]

const DATA_MAXIMA = new Date().toISOString().slice(0, 10)
const ORBE_ASPECTO = 6

const Position = (corpo, time) => GeoVector(corpo, time, true)

// ─── Swiss Ephemeris — inicialização async isolada (dynamic import) ──────────
// Dynamic import isola qualquer erro de módulo CJS/ESM do bundle principal.
// Se falhar, a app continua com astronomy-engine sem interrupção.
// Status do motor astronómico (exposto para a UI)
// 'loading' | 'swisseph-full' | 'swisseph-moshier' | 'astronomy-engine'
let _motorStatus = 'loading'
let _sweInstance = null
let _ephemerisPronto = false

function sweEphemerisPronta() {
  return _ephemerisPronto && _sweInstance != null
}

// Efemérides Swiss servidas localmente (public/ephe/) — sem CORS, sem CDN externo
// Ficheiros: sepl_18.se1 (planetas), semo_18.se1 (Lua), seas_18.se1 (asteróides)
// Cobertura 1800–2400, precisão ≤ 1 arco-segundo (equivalente Astro.com / Astrolink)
const _EPHE_FILES = [
  { name: 'sepl_18.se1', url: '/ephe/sepl_18.se1' },
  { name: 'semo_18.se1', url: '/ephe/semo_18.se1' },
  { name: 'seas_18.se1', url: '/ephe/seas_18.se1' },
]

const _sweReadyPromise = (async () => {
  try {
    const mod = await import('@swisseph/browser')
    const SweClass = mod.default || mod.SwissEphemeris
    if (typeof SweClass !== 'function') throw new Error('SwissEphemeris class not found')
    const swe = new SweClass()
    await swe.init()

    // Carrega efemérides completas do servidor local (public/ephe/)
    // Só avança para os cálculos depois deste await terminar com sucesso
    try {
      await swe.loadEphemerisFiles(_EPHE_FILES)
      _motorStatus = 'swisseph-full'
      _ephemerisPronto = true
      console.info('[Sidus] Swiss Ephemeris carregado com efemérides completas ✓')
    } catch (epheErr) {
      console.warn('[Sidus] Efemérides locais não carregaram, usando Moshier:', epheErr?.message)
      _motorStatus = 'swisseph-moshier'
    }

    _sweInstance = swe
    return swe
  } catch (e) {
    console.warn('[Sidus] SwissEphemeris não carregou, usando astronomy-engine:', e?.message ?? e)
    _motorStatus = 'astronomy-engine'
    return null
  }
})()

const estilos = {
  app: {
    minHeight: '100svh',
    width: '100%',
    maxWidth: MOBILE_MAX,
    margin: '0 auto',
    background: `radial-gradient(ellipse at 20% 0%, rgba(88, 28, 135, 0.35) 0%, transparent 55%),
      radial-gradient(ellipse at 80% 100%, rgba(67, 56, 202, 0.2) 0%, transparent 50%),
      ${CORES.fundo}`,
    color: CORES.branco,
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
    position: 'relative',
    overflowX: 'hidden',
    overflowY: 'visible',
    display: 'block',
    boxSizing: 'border-box',
  },
  appDesktop: {
    minHeight: '100vh',
    width: '100%',
    maxWidth: 'none',
    margin: 0,
    background: `radial-gradient(ellipse at 15% 0%, rgba(88, 28, 135, 0.4) 0%, transparent 50%),
      radial-gradient(ellipse at 85% 100%, rgba(67, 56, 202, 0.25) 0%, transparent 45%),
      ${CORES.fundo}`,
    color: CORES.branco,
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
    position: 'relative',
    overflowX: 'hidden',
    overflowY: 'visible',
    boxSizing: 'border-box',
  },
  estrelas: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    backgroundImage: `
      radial-gradient(1px 1px at 10% 15%, rgba(255,255,255,0.5) 0%, transparent 100%),
      radial-gradient(1px 1px at 25% 45%, rgba(255,255,255,0.3) 0%, transparent 100%),
      radial-gradient(1.5px 1.5px at 45% 8%, rgba(223,183,108,0.6) 0%, transparent 100%),
      radial-gradient(1px 1px at 60% 70%, rgba(255,255,255,0.4) 0%, transparent 100%),
      radial-gradient(1px 1px at 75% 25%, rgba(255,255,255,0.35) 0%, transparent 100%),
      radial-gradient(1.5px 1.5px at 90% 55%, rgba(223,183,108,0.5) 0%, transparent 100%)
    `,
    zIndex: 0,
  },
  conteudo: {
    overflowY: 'visible',
    padding: '24px 20px',
    paddingBottom: 100,
    position: 'relative',
    zIndex: 1,
    textAlign: 'left',
  },
  conteudoDesktop: {
    maxWidth: 1200,
    margin: '0 auto',
    width: '100%',
    padding: '32px 40px 48px',
    paddingBottom: 48,
    position: 'relative',
    zIndex: 1,
    textAlign: 'left',
    boxSizing: 'border-box',
  },
  vidro: {
    background: CORES.vidro,
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: `1px solid ${CORES.vidroBorda}`,
    borderRadius: 16,
    boxShadow: CORES.sombra,
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    background: 'rgba(255, 255, 255, 0.04)',
    border: `1px solid ${CORES.vidroBorda}`,
    borderRadius: 12,
    color: CORES.branco,
    fontSize: 15,
    outline: 'none',
    boxSizing: 'border-box',
  },
  label: {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: CORES.dourado,
    marginBottom: 8,
  },
  botaoDourado: {
    width: '100%',
    padding: '16px 24px',
    background: `linear-gradient(135deg, ${CORES.dourado} 0%, ${CORES.douradoEscuro} 100%)`,
    border: 'none',
    borderRadius: 14,
    color: CORES.fundo,
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: CORES.sombraDourada,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 300,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: CORES.dourado,
    margin: 0,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 13,
    color: CORES.brancoMuted,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  navbar: {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: MOBILE_MAX,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '12px 8px 20px',
    background: 'rgba(11, 7, 30, 0.92)',
    backdropFilter: 'blur(20px)',
    borderTop: `1px solid ${CORES.vidroBorda}`,
    zIndex: 100,
    boxSizing: 'border-box',
  },
  navbarDesktop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 'auto',
    transform: 'none',
    width: '100%',
    maxWidth: 'none',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    padding: '14px 32px',
    background: 'rgba(11, 7, 30, 0.96)',
    backdropFilter: 'blur(20px)',
    borderBottom: `1px solid ${CORES.vidroBorda}`,
    borderTop: 'none',
    zIndex: 100,
    boxSizing: 'border-box',
  },
}

function layoutConteudo(isDesktop, extra = {}) {
  return isDesktop
    ? { ...estilos.conteudo, ...estilos.conteudoDesktop, ...extra }
    : { ...estilos.conteudo, ...extra }
}

function normalizarNome(nome) {
  return nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '')
}

function nomePareceFalso(nome) {
  const limpo = normalizarNome(nome)
  if (limpo.length < 3) return true
  if (/^(.)\1+$/.test(limpo)) return true
  if (/(.{1,2})\1{2,}/.test(limpo)) return true
  return false
}

function validarHora24(hora) {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(hora)
}

function validarDataNascimento(data) {
  if (!data) return false
  if (data > DATA_MAXIMA) return false
  const ano = parseInt(data.slice(0, 4), 10)
  return ano <= 2026
}

function longitudeParaSigno(longitude) {
  const lon = ((longitude % 360) + 360) % 360
  const idx = Math.floor(lon / 30)
  return { ...SIGNOS[idx], graus: (lon % 30).toFixed(1) }
}

function diferencaAngular(a, b) {
  const diff = Math.abs(a - b) % 360
  return diff > 180 ? 360 - diff : diff
}

function calcularPlanetasParaData(dateObj, lista = PLANETAS_AGORA) {
  const time = MakeTime(dateObj)

  return lista.filter(p => p.corpo).map((p) => {
    const vector = Position(p.corpo, time)
    const ecl = Ecliptic(vector)
    const signo = longitudeParaSigno(ecl.elon)
    return {
      ...p,
      vector,
      longitude: ecl.elon,
      signo,
      retrograde: false,
      texto: `${p.nome} em ${signo.nome} ${signo.simbolo} (${signo.graus}°)`,
    }
  })
}

function calcularPlanetasNatalParaData(dateObj) {
  return calcularPlanetasParaData(dateObj, PLANETAS_NATAL.filter(p => p.corpo))
}

function calcularAspetos(planetas) {
  const lista = []
  for (let i = 0; i < planetas.length; i++) {
    for (let j = i + 1; j < planetas.length; j++) {
      const a = planetas[i]
      const b = planetas[j]
      // Diferença de longitude eclíptica — correcto para aspectos astrológicos
      const angle = diferencaAngular(a.longitude, b.longitude)
      const nearest = ASPECTOS_MAIORES
        .map((x) => ({ ...x, orbe: Math.abs(angle - x.angulo) }))
        .sort((x, y) => x.orbe - y.orbe)[0]
      if (nearest.orbe <= ORBE_ASPECTO) {
        lista.push({
          planetaA: `${a.nome} ${a.simbolo}`,
          planetaB: `${b.nome} ${b.simbolo}`,
          aspecto: nearest.nome,
          orbe: `${nearest.orbe.toFixed(1)}°`,
          distancia: angle.toFixed(1),
        })
      }
    }
  }
  return lista.sort((x, y) => parseFloat(x.orbe) - parseFloat(y.orbe))
}

// ── Helpers de análise do mapa natal ─────────────────────────────────────────
const ELEMENTO_DO_SIGNO = {
  'Carneiro': 'Fogo',   'Leão': 'Fogo',   'Sagitário': 'Fogo',
  'Touro': 'Terra',     'Virgem': 'Terra', 'Capricórnio': 'Terra',
  'Gémeos': 'Ar',       'Balança': 'Ar',   'Aquário': 'Ar',
  'Caranguejo': 'Água', 'Escorpião': 'Água', 'Peixes': 'Água',
}

const MODALIDADE_DO_SIGNO = {
  'Carneiro': 'Cardinal', 'Caranguejo': 'Cardinal', 'Balança': 'Cardinal', 'Capricórnio': 'Cardinal',
  'Touro': 'Fixo',       'Leão': 'Fixo',            'Escorpião': 'Fixo',   'Aquário': 'Fixo',
  'Gémeos': 'Mutável',   'Virgem': 'Mutável',        'Sagitário': 'Mutável','Peixes': 'Mutável',
}

function calcularBalancaElementos(planetas) {
  const bal = { Fogo: 0, Terra: 0, Ar: 0, Água: 0 }
  planetas.forEach(p => { const el = ELEMENTO_DO_SIGNO[p.signo?.nome]; if (el) bal[el]++ })
  return bal
}

function calcularBalancaModalidades(planetas) {
  const bal = { Cardinal: 0, Fixo: 0, Mutável: 0 }
  planetas.forEach(p => { const mod = MODALIDADE_DO_SIGNO[p.signo?.nome]; if (mod) bal[mod]++ })
  return bal
}

const INTERP_PLANETAS = {
  Sol: {
    Carneiro: 'Iniciativa, coragem e identidade directa.',
    Touro: 'Estabilidade, prazer sensorial e perseverança.',
    Gémeos: 'Curiosidade intelectual e versatilidade comunicativa.',
    Caranguejo: 'Intuição emocional e profundo instinto de cuidar.',
    Leão: 'Criatividade, liderança e expressão generosa.',
    Virgem: 'Análise, perfeicionismo e serviço dedicado.',
    Balança: 'Harmonia, justiça e crescimento através das relações.',
    Escorpião: 'Transformação, profundidade e intensidade emocional.',
    Sagitário: 'Liberdade filosófica e expansão de horizontes.',
    Capricórnio: 'Ambição disciplinada e construção de legado duradouro.',
    Aquário: 'Visão inovadora, humanismo e pensamento original.',
    Peixes: 'Espiritualidade profunda, empatia e conexão com o invisível.',
  },
  Lua: {
    Carneiro: 'Reages com impulso; a independência emocional é vital.',
    Touro: 'Segurança material e rotinas estáveis alimentam a tua alma.',
    Gémeos: 'Processas as emoções através do diálogo e da análise.',
    Caranguejo: 'Natureza profundamente empática; o lar é o teu santuário.',
    Leão: 'Precisas de reconhecimento e expressão emocional autêntica.',
    Virgem: 'Expressas amor através do serviço; autocrítica como sombra.',
    Balança: 'Equilíbrio e harmonia nas relações como necessidade emocional.',
    Escorpião: 'Emoções intensas e transformadoras; memória emocional profunda.',
    Sagitário: 'Aventura e liberdade como necessidades emocionais primárias.',
    Capricórnio: 'Responsabilidade como linguagem do amor; emoções contidas.',
    Aquário: 'Precisas de espaço emocional e amizade genuína.',
    Peixes: 'Absorves as emoções ao redor; fronteiras internas são essenciais.',
  },
  Mercúrio: {
    Carneiro: 'Pensamento directo e rápido; mente pioneira.',
    Touro: 'Mente prática, reflectida e orientada para resultados.',
    Gémeos: 'Mente ágil, multitasking e comunicadora por natureza.',
    Caranguejo: 'Pensamento intuitivo com forte memória emocional.',
    Leão: 'Comunicação carismática, criativa e persuasiva.',
    Virgem: 'Análise precisa, atenção ao detalhe e clareza no discurso.',
    Balança: 'Ponderação, diplomacia e visão das múltiplas perspectivas.',
    Escorpião: 'Mente investigativa, penetrante e perspicaz.',
    Sagitário: 'Mente filosófica, directa e em busca do sentido.',
    Capricórnio: 'Pensamento estruturado, estratégico e disciplinado.',
    Aquário: 'Mente inovadora, independente e visionária.',
    Peixes: 'Intuição criativa; pensamento simbólico e poético.',
  },
  Vénus: {
    Carneiro: 'Amor apaixonado, directo e aventureiro.',
    Touro: 'Afecto sensorial, leal e orientado para o prazer.',
    Gémeos: 'Atraído/a pela inteligência; amor leve e comunicativo.',
    Caranguejo: 'Amor protetor, nostálgico e profundamente devotado.',
    Leão: 'Amor dramático, generoso e que procura admiração mútua.',
    Virgem: 'Amor expresso através do serviço e da atenção.',
    Balança: 'Amor refinado, idealista e orientado para a parceria.',
    Escorpião: 'Amor intenso, fusional e transformador.',
    Sagitário: 'Amor livre, aventureiro e filosófico.',
    Capricórnio: 'Amor leal e comprometido, construído com paciência.',
    Aquário: 'Amor intelectual que respeita a liberdade individual.',
    Peixes: 'Amor incondicional, espiritual e compassivo.',
  },
  Marte: {
    Carneiro: 'Acção directa e corajosa; energia no pico do signo.',
    Touro: 'Força persistente, lenta mas absolutamente inabalável.',
    Gémeos: 'Energia táctica dispersa em múltiplas frentes.',
    Caranguejo: 'Defende com fervor o que e quem amas.',
    Leão: 'Determinação criativa com orgulho e liderança natural.',
    Virgem: 'Trabalho disciplinado, meticuloso e altamente eficiente.',
    Balança: 'Acção mediada pela reflexão e estratégia diplomática.',
    Escorpião: 'Força intensa e focada; perseverança até transformar.',
    Sagitário: 'Energia entusiasta; batalha por ideais filosóficos.',
    Capricórnio: 'Ambição disciplinada; usa a energia de forma estratégica.',
    Aquário: 'Luta pela mudança social com acção inovadora.',
    Peixes: 'Energia subtil e criativa, guiada pela intuição.',
  },
}

function getInterpPlaneta(nomePlaneta, nomeSigno) {
  return INTERP_PLANETAS[nomePlaneta]?.[nomeSigno] || null
}

/**
 * Converte hora local numa dada timezone IANA para UTC.
 * Algoritmo iterativo usando Intl.DateTimeFormat — gere horário de verão
 * histórico automaticamente (ex: Portugal em 1988, Brasil em 1972…).
 */
function localToUTC(ianaTimezone, year, month, day, hour, minute) {
  const pad = (n) => String(n).padStart(2, '0')
  const localStr = `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:00`
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: ianaTimezone,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  })

  let utcGuess = new Date(localStr + 'Z')
  for (let i = 0; i < 5; i++) {
    const parts = {}
    fmt.formatToParts(utcGuess).forEach((p) => { parts[p.type] = p.value })
    const h = parts.hour === '24' ? '00' : parts.hour
    const localAsUTC = new Date(
      `${parts.year}-${parts.month}-${parts.day}T${h}:${parts.minute}:00Z`,
    )
    if (parts.hour === '24') localAsUTC.setUTCDate(localAsUTC.getUTCDate() + 1)
    const diff = new Date(localStr + 'Z') - localAsUTC
    if (Math.abs(diff) < 30000) break // convergiu (< 30 s)
    utcGuess = new Date(utcGuess.getTime() + diff)
  }
  return utcGuess
}

/**
 * Devolve "UTC+1", "UTC-3:30", etc. para uma timezone IANA numa data específica.
 */
function offsetLabel(ianaTimezone, dataISO, horaHHMM) {
  try {
    const [y, m, d] = dataISO.split('-').map(Number)
    const [h, min] = horaHHMM.split(':').map(Number)
    const utcDate = localToUTC(ianaTimezone, y, m, d, h, min)
    const localMs = Date.UTC(y, m - 1, d, h, min, 0)
    const offsetH = (localMs - utcDate.getTime()) / 3600000
    const sign = offsetH >= 0 ? '+' : '-'
    const abs = Math.abs(offsetH)
    const whole = Math.floor(abs)
    const frac = (abs % 1) ? ':30' : ''
    return `UTC${sign}${whole}${frac}`
  } catch {
    return ''
  }
}

function ajustarDataUTC(ano, mes, dia, horasUTC) {
  let y = ano
  let m = mes
  let d = dia
  let h = horasUTC

  while (h < 0) {
    h += 24
    d -= 1
    if (d < 1) {
      m -= 1
      if (m < 1) {
        m = 12
        y -= 1
      }
      d = new Date(y, m, 0).getDate()
    }
  }

  while (h >= 24) {
    h -= 24
    d += 1
    const diasMes = new Date(y, m, 0).getDate()
    if (d > diasMes) {
      d = 1
      m += 1
      if (m > 12) {
        m = 1
        y += 1
      }
    }
  }

  return { y, m, d, h }
}

/**
 * Converte data + hora local para um objeto Date UTC.
 * @param {string} dataISO  — "YYYY-MM-DD"
 * @param {string} horaHHMM — "HH:MM"
 * @param {string|number} fuso — IANA string ("Europe/Lisbon") ou offset numérico (0, 1, -3…)
 */
function criarDataUTCporLocal(dataISO, horaHHMM, fuso) {
  const [ano, mes, dia] = dataISO.split('-').map(Number)
  const [h, min] = horaHHMM.split(':').map(Number)

  // IANA timezone → algoritmo iterativo com DST histórico real
  if (typeof fuso === 'string' && fuso.includes('/')) {
    return localToUTC(fuso, ano, mes, dia, h, min)
  }

  // Offset numérico simples (fallback ou override manual)
  const offset = Number(fuso) || 0
  const horaLocal = h + min / 60
  const horaUTC = horaLocal - offset
  const { y, m, d, h: hu } = ajustarDataUTC(ano, mes, dia, horaUTC)
  const minutos = Math.round((hu % 1) * 60)
  const horasInt = Math.floor(hu)
  return new Date(Date.UTC(y, m - 1, d, horasInt, minutos, 0))
}

/**
 * Ascendente Verdadeiro usando SiderealTime() de alta precisão da astronomy-engine.
 *
 * Fórmula de Meeus ("Astronomical Algorithms", cap. 14):
 *   Asc = atan2(−cos(LST),  sin(LST)·cos(ε) + tan(φ)·sin(ε))
 *
 * GMST é obtido directamente de SiderealTime(time) — mesmos algoritmos NASA
 * usados nas efemérides JPL — garantindo resultados iguais às tabelas profissionais.
 */
/**
 * Ascendente via SiderealTime de alta precisão + correcção de quadrante.
 * Implementa Meeus "Astronomical Algorithms" cap. 14 + verificação
 * de hemisfério (ASC deve estar a ~90° do MC, nunca no mesmo lado).
 */
function calcularAscendenteEMc(dataUTC, latitude, longitude) {
  if (!dataUTC || latitude == null || longitude == null) return { asc: 0, mc: 0 }
  if (isNaN(latitude) || isNaN(longitude)) return { asc: 0, mc: 0 }
  const lat = Math.max(-89, Math.min(89, latitude))

  const time = MakeTime(dataUTC)
  const gmst  = SiderealTime(time) * 15
  const ramc  = ((gmst + longitude) % 360 + 360) % 360

  const T = (dataUTC.getTime() / 86400000 - 10957.5) / 36525
  const eDeg = 23.439291111 - 0.013004167 * T - 0.000000164 * T * T
  const e     = eDeg * Math.PI / 180

  const ramcRad = ramc    * Math.PI / 180
  const latRad  = lat     * Math.PI / 180

  const yAsc = -Math.cos(ramcRad)
  const xAsc =  Math.sin(ramcRad) * Math.cos(e) + Math.tan(latRad) * Math.sin(e)
  let asc = Math.atan2(yAsc, xAsc) * (180 / Math.PI)
  asc = ((asc % 360) + 360) % 360

  const yMC = Math.sin(ramcRad)
  const xMC = Math.cos(ramcRad) * Math.cos(e) - Math.tan(latRad) * Math.sin(e)
  let mc = Math.atan2(yMC, xMC) * (180 / Math.PI)
  mc = ((mc % 360) + 360) % 360

  const diff = ((asc - mc + 360) % 360)
  if (diff < 90 || diff > 270) asc = (asc + 180) % 360

  return { asc, mc }
}

function calcularAscendenteReal(dataUTC, latitude, longitude) {
  return calcularAscendenteEMc(dataUTC, latitude, longitude).asc
}

function calcularMapaNatal(dados) {
  if (!dados.data || !dados.hora || !dados.localizacao) return null

  const { lat, lon } = dados.localizacao
  const fuso = dados.fuso ?? 0
  const dataUTC = criarDataUTCporLocal(dados.data, dados.hora, fuso)
  const time = MakeTime(dataUTC)

  // Posições solares e lunares via GeoVector + Ecliptic (precisão JPL)
  const lonSol = Ecliptic(Position(Body.Sun, time)).elon
  const lonLua = Ecliptic(Position(Body.Moon, time)).elon

  const { asc: lonAsc, mc: lonMc } = calcularAscendenteEMc(dataUTC, lat, lon)
  const cusps = cuspsEqualHouse(lonAsc)

  return {
    solar:      longitudeParaSigno(lonSol),
    lunar:      longitudeParaSigno(lonLua),
    ascendente: longitudeParaSigno(lonAsc),
    mc:         longitudeParaSigno(lonMc),
    cusps,
    sistema:    'Tropical · Placidus (fallback casas iguais)',
    instanteUTC: dataUTC.toISOString(),
    lat,
    lon,
    fuso,
    motor: 'astronomy-engine + Meeus',
  }
}

// ─── Swiss Ephemeris — funções de cálculo ────────────────────────────────────

/**
 * Posições via swe_calc_ut (Swiss Ephemeris) — só após efemérides carregadas.
 */
function calcularPlanetasComSwe(swe, dateUTC, lista = PLANETAS_AGORA) {
  const jd = swe.dateToJulianDay(dateUTC)
  const resultados = []
  for (const p of lista) {
    try {
      const pos = swe.calculatePosition(jd, p.sweId)
      const signo = longitudeParaSigno(pos.longitude)
      const retro = pos.speed < 0
      resultados.push({
        ...p,
        longitude: pos.longitude,
        signo,
        retrograde: retro,
        texto: `${p.nome} em ${signo.nome} ${signo.simbolo} (${signo.graus}°)${retro ? ' ℞' : ''}`,
      })
    } catch (e) {
      console.warn(`[Sidus] swe_calc_ut falhou para ${p.nome}:`, e?.message)
    }
  }
  return resultados
}

/**
 * Calcula mapa natal completo usando:
 * - swe_calc_ut para Sol, Lua e todos os planetas
 * - swe_houses (Placidus, 'P') para Ascendente e Meio do Céu exactos
 */
function calcularMapaNatalComSwe(swe, dados) {
  if (!dados.data || !dados.hora || !dados.localizacao) return null
  if (!swe) return null

  const { lat } = dados.localizacao
  const lon = dados.localizacao.lon
  const fuso = dados.fuso ?? 0
  const dateUTC = criarDataUTCporLocal(dados.data, dados.hora, fuso)
  const jd = swe.dateToJulianDay(dateUTC)

  // swe_calc_ut + swe_houses — só após loadEphemerisFiles concluir
  const sunPos  = swe.calculatePosition(jd, 0)
  const moonPos = swe.calculatePosition(jd, 1)
  const houses  = swe.calculateHouses(jd, lat, lon, 'P')
  const cusps   = normalizarCusps(houses) ?? cuspsEqualHouse(houses.ascendant)

  const motorLabel =
    _motorStatus === 'swisseph-full'
      ? 'Swiss Ephemeris · Tropical Placidus'
      : _motorStatus === 'swisseph-moshier'
        ? 'Swiss Ephemeris Moshier · Tropical Placidus'
        : 'astronomy-engine + Meeus'

  console.info(
    `[Sidus] JD=${jd.toFixed(6)} · UTC=${dateUTC.toISOString()} · lat=${lat.toFixed(4)} lon=${lon.toFixed(4)}` +
    ` · Sol=${sunPos.longitude.toFixed(3)}° Lua=${moonPos.longitude.toFixed(3)}° Asc=${houses.ascendant.toFixed(3)}°`
  )

  return {
    solar:      longitudeParaSigno(sunPos.longitude),
    lunar:      longitudeParaSigno(moonPos.longitude),
    ascendente: longitudeParaSigno(houses.ascendant),
    mc:         longitudeParaSigno(houses.mc),
    cusps,
    sistema:    'Tropical · Placidus',
    instanteUTC: dateUTC.toISOString(),
    lat, lon, fuso,
    motor: motorLabel,
  }
}

function formatarData(dataISO) {
  const [ano, mes, dia] = dataISO.split('-')
  return `${dia}/${mes}/${ano}`
}

function validarOnboarding(dados) {
  const erros = {}

  if (!dados.nome.trim()) erros.nome = 'O nome e obrigatorio.'
  else if (nomePareceFalso(dados.nome)) erros.nome = 'Introduz um nome valido (min. 3 letras e sem repeticoes artificiais).'

  if (!dados.data) erros.data = 'A data de nascimento e obrigatoria.'
  else if (!validarDataNascimento(dados.data)) erros.data = 'A data nao pode ser futura nem posterior a 2026.'

  if (!dados.hora) erros.hora = 'A hora exata e obrigatoria.'
  else if (!validarHora24(dados.hora)) erros.hora = 'Usa o formato de 24 horas (HH:MM).'

  if (!dados.cidade.trim()) erros.cidade = 'A cidade de nascimento e obrigatoria.'
  else if (!dados.localizacao) erros.cidade = 'Seleciona uma cidade valida na lista de sugestoes.'
  else if (dados.fuso == null) erros.cidade = 'A aguardar detecao do fuso horario...'

  return erros
}

function dadosNataisCompletos(dados) {
  if (!dados) return false
  return Object.keys(validarOnboarding(dados)).length === 0
}

/** Mínimo para considerar conta já configurada (1 mapa por conta). */
function dadosNataisMinimos(dados) {
  if (!dados) return false
  return Boolean(
    dados.nome?.trim()
    && dados.data
    && dados.hora
    && dados.cidade?.trim(),
  )
}

function normalizarDadosPerfil(dados) {
  if (!dados) return null
  const d = { ...dados }
  if (!d.localizacao && d.lat != null && d.lon != null) {
    d.localizacao = {
      lat: Number(d.lat),
      lon: Number(d.lon),
      nome: d.cidade || `${d.lat}, ${d.lon}`,
      placeId: d.placeId || 'legacy',
    }
  }
  return d
}

async function repararDadosPerfil(dados) {
  const d = normalizarDadosPerfil(dados)
  if (!d || dadosNataisCompletos(d)) return d
  if (!dadosNataisMinimos(d)) return d
  try {
    if (!d.localizacao && d.cidade) {
      const loc = await geocodificarCidade(d.cidade)
      if (loc) d.localizacao = loc
    }
    if (d.localizacao && d.fuso == null) {
      d.fuso = await pesquisarFusoHorario(d.localizacao.lat, d.localizacao.lon)
    }
  } catch (e) {
    console.warn('[Sidus] Reparação de perfil falhou:', e?.message)
  }
  return d
}

function contaJaConfigurada(perfil, dadosActuais) {
  if (!perfil && !dadosActuais) return false
  if (perfil?.dadosTravados === true || perfil?.mapaGerado === true) return true
  return dadosNataisCompletos(dadosActuais) || dadosNataisCompletos(perfil?.dados)
}

function utilizadorGoogle(user) {
  return user?.providerData?.some((p) => p.providerId === 'google.com') ?? false
}

function precisaVerificarEmail(user) {
  if (!user || utilizadorGoogle(user)) return false
  return !user.emailVerified
}

function Campo({ label, tipo = 'text', valor, onChange, placeholder, erro, onBlur }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={estilos.label}>{label}</label>
      <input
        type={tipo}
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        style={{ ...estilos.input, borderColor: erro ? 'rgba(248,113,113,0.7)' : CORES.vidroBorda }}
      />
      {erro && <p style={{ margin: '6px 0 0', fontSize: 12, color: '#F87171' }}>{erro}</p>}
    </div>
  )
}

/* Campo de data com três inputs separados (DD / MM / AAAA) */
function CampoData({ valor, onChange, onBlur, erro }) {
  const diaRef = useRef(null)
  const mesRef = useRef(null)
  const anoRef = useRef(null)

  // Estado local independente para cada segmento
  const [dia, setDia] = useState(() => valor ? valor.split('-')[2] || '' : '')
  const [mes, setMes] = useState(() => valor ? valor.split('-')[1] || '' : '')
  const [ano, setAno] = useState(() => valor ? valor.split('-')[0] || '' : '')

  // Sincroniza para o pai sempre que os três segmentos mudarem
  useEffect(() => {
    if (dia.length === 2 && mes.length === 2 && ano.length === 4) {
      onChange(`${ano}-${mes}-${dia}`)
    } else {
      onChange('')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dia, mes, ano])

  const handleDia = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 2)
    setDia(d)
    if (d.length === 2) mesRef.current?.focus()
  }

  const handleMes = (v) => {
    const m = v.replace(/\D/g, '').slice(0, 2)
    setMes(m)
    if (m.length === 2) anoRef.current?.focus()
  }

  const handleAno = (v) => {
    setAno(v.replace(/\D/g, '').slice(0, 4))
  }

  const bordaCor = erro ? 'rgba(248,113,113,0.7)' : CORES.vidroBorda
  const estiloMini = {
    ...estilos.input,
    borderColor: bordaCor,
    textAlign: 'center',
    padding: '14px 4px',
  }

  return (
    <div style={{ marginBottom: 20 }}>
      <label style={estilos.label}>Data de Nascimento</label>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 14px 1fr 14px 2fr', alignItems: 'center' }}>
        <input
          ref={diaRef}
          inputMode="numeric"
          maxLength={2}
          placeholder="DD"
          value={dia}
          onChange={(e) => handleDia(e.target.value)}
          onBlur={onBlur}
          style={estiloMini}
        />
        <span style={{ textAlign: 'center', color: CORES.brancoMuted, fontSize: 20, userSelect: 'none' }}>/</span>
        <input
          ref={mesRef}
          inputMode="numeric"
          maxLength={2}
          placeholder="MM"
          value={mes}
          onChange={(e) => handleMes(e.target.value)}
          onBlur={onBlur}
          style={estiloMini}
        />
        <span style={{ textAlign: 'center', color: CORES.brancoMuted, fontSize: 20, userSelect: 'none' }}>/</span>
        <input
          ref={anoRef}
          inputMode="numeric"
          maxLength={4}
          placeholder="AAAA"
          value={ano}
          onChange={(e) => handleAno(e.target.value)}
          onBlur={onBlur}
          style={estiloMini}
        />
      </div>
      {erro && <p style={{ margin: '6px 0 0', fontSize: 12, color: '#F87171' }}>{erro}</p>}
    </div>
  )
}

function CampoCidade({ valor, localizacao, onChange, onSelect, erro, onBlur }) {
  const [sugestoes, setSugestoes] = useState([])
  const [aPesquisar, setAPesquisar] = useState(false)
  const [aberto, setAberto] = useState(false)
  const [erroRede, setErroRede] = useState(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!valor || valor.length < 2 || localizacao?.nome === valor) {
      setSugestoes([])
      return undefined
    }

    const timer = setTimeout(async () => {
      setAPesquisar(true)
      setErroRede(null)
      try {
        const resultados = await pesquisarCidades(valor)
        setSugestoes(resultados)
        setAberto(resultados.length > 0)
      } catch {
        setErroRede('Erro ao pesquisar. Verifica a ligacao a internet.')
        setSugestoes([])
      } finally {
        setAPesquisar(false)
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [valor, localizacao])

  useEffect(() => {
    const fechar = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setAberto(false)
    }
    document.addEventListener('mousedown', fechar)
    return () => document.removeEventListener('mousedown', fechar)
  }, [])

  return (
    <div ref={containerRef} style={{ marginBottom: 20, position: 'relative' }}>
      <label style={estilos.label}>Cidade de Nascimento</label>
      <div style={{ position: 'relative' }}>
        <input
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          onFocus={() => sugestoes.length > 0 && setAberto(true)}
          placeholder="Escreve e seleciona da lista"
          style={{
            ...estilos.input,
            paddingRight: 40,
            borderColor: erro ? 'rgba(248,113,113,0.7)' : localizacao ? 'rgba(74,222,128,0.5)' : CORES.vidroBorda,
          }}
        />
        <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>
          {aPesquisar ? <Loader2 size={18} color={CORES.dourado} style={{ animation: 'spin 1s linear infinite' }} /> : localizacao ? <Check size={18} color="#4ADE80" /> : <MapPin size={18} color={CORES.brancoMuted} />}
        </div>
      </div>
      {erro && <p style={{ margin: '6px 0 0', fontSize: 12, color: '#F87171' }}>{erro}</p>}
      {erroRede && <p style={{ margin: '6px 0 0', fontSize: 12, color: '#F87171' }}>{erroRede}</p>}
      {aberto && sugestoes.length > 0 && (
        <ul style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '100%',
          listStyle: 'none',
          margin: '4px 0 0',
          padding: 4,
          background: 'rgba(11,7,30,0.98)',
          border: `1px solid ${CORES.vidroBorda}`,
          borderRadius: 12,
          maxHeight: 200,
          overflowY: 'auto',
          zIndex: 20,
        }}>
          {sugestoes.map((s) => (
            <li key={s.placeId}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onSelect(s)
                  setAberto(false)
                }}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  color: CORES.brancoSuave,
                  fontSize: 13,
                  textAlign: 'left',
                  padding: '10px 12px',
                  borderRadius: 8,
                  cursor: 'pointer',
                }}
              >
                <MapPin size={12} color={CORES.dourado} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                {s.nome}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ─── Ecrãs de Autenticação Firebase ──────────────────────────────────────────

function EcraVerificarEmail({ utilizador, isDesktop, onLogout, onVerificado }) {
  const [carregando, setCarregando] = useState(false)
  const [info, setInfo] = useState(null)
  const [erro, setErro] = useState(null)

  const reenviar = async () => {
    if (!auth || !utilizador) return
    setCarregando(true)
    setErro(null)
    setInfo(null)
    try {
      await sendEmailVerification(utilizador)
      setInfo('E-mail de confirmação reenviado. Verifica a caixa de entrada e o spam.')
    } catch (e) {
      setErro('Não foi possível reenviar o e-mail. Tenta mais tarde.')
    } finally {
      setCarregando(false)
    }
  }

  const verificarAgora = async () => {
    if (!auth || !utilizador) return
    setCarregando(true)
    setErro(null)
    setInfo(null)
    try {
      await reload(utilizador)
      if (auth.currentUser?.emailVerified) {
        onVerificado?.()
      } else {
        setErro('O e-mail ainda não foi confirmado. Abre a mensagem que te enviámos e clica no link.')
      }
    } catch {
      setErro('Não foi possível verificar o estado. Tenta outra vez.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div style={layoutConteudo(isDesktop, { paddingTop: 56, paddingBottom: 40, maxWidth: isDesktop ? 480 : undefined, margin: isDesktop ? '0 auto' : undefined })}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <Mail size={40} color={CORES.dourado} strokeWidth={1.5} style={{ marginBottom: 16 }} />
        <h1 style={{ ...estilos.titulo, fontSize: 28 }}>Confirma o teu e-mail</h1>
        <p style={{ ...estilos.subtitulo, maxWidth: 360, margin: '12px auto 0', lineHeight: 1.55 }}>
          Enviámos um link de confirmação para <strong style={{ color: CORES.branco }}>{utilizador?.email}</strong>.
          Abre o e-mail e clica no link para activar a tua conta Sidus.
        </p>
      </div>
      <div style={{ ...estilos.vidro, padding: 24 }}>
        {info && (
          <div style={{ marginBottom: 14, padding: '10px 14px', borderRadius: 10, background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', fontSize: 13, color: '#34D399' }}>
            {info}
          </div>
        )}
        {erro && (
          <div style={{ marginBottom: 14, padding: '10px 14px', borderRadius: 10, background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', fontSize: 13, color: '#F87171' }}>
            {erro}
          </div>
        )}
        <button type="button" disabled={carregando} onClick={verificarAgora} style={{ ...estilos.botaoDourado, marginBottom: 12, opacity: carregando ? 0.6 : 1 }}>
          {carregando ? 'A verificar…' : 'Já confirmei — continuar'}
        </button>
        <button type="button" disabled={carregando} onClick={reenviar} style={{
          width: '100%', padding: '14px', borderRadius: 12, marginBottom: 12,
          background: 'rgba(255,255,255,0.05)', border: `1px solid ${CORES.vidroBorda}`,
          color: CORES.branco, fontSize: 14, fontWeight: 600, cursor: carregando ? 'default' : 'pointer',
        }}>
          Reenviar e-mail de confirmação
        </button>
        <button type="button" onClick={onLogout} style={{
          width: '100%', padding: '12px', borderRadius: 12, background: 'transparent',
          border: 'none', color: CORES.brancoMuted, fontSize: 13, cursor: 'pointer',
        }}>
          Terminar sessão
        </button>
        <p style={{ fontSize: 11, color: CORES.brancoMuted, marginTop: 16, lineHeight: 1.5, textAlign: 'center' }}>
          Entraste com Google? Esta verificação não se aplica — contacta suporte se vês este ecrã por engano.
        </p>
      </div>
    </div>
  )
}

function EcraAuth({ onMudar, tipo, isDesktop, firebaseOk = true }) {
  const [email, setEmail]       = useState('')
  const [senha, setSenha]       = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [verSenha, setVerSenha] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro]         = useState(null)
  const [info, setInfo]         = useState(null)
  const [recaptchaOk, setRecaptchaOk] = useState(false)
  const [recaptchaKey, setRecaptchaKey] = useState(0)

  const traduzirErro = (code) => {
    const mapa = {
      'auth/email-already-in-use':        'Este e-mail já tem uma conta.',
      'auth/invalid-email':               'E-mail inválido.',
      'auth/weak-password':               'A senha deve ter pelo menos 6 caracteres.',
      'auth/user-not-found':              'E-mail não encontrado.',
      'auth/wrong-password':              'Senha incorrecta.',
      'auth/invalid-credential':          'E-mail ou senha incorrectos.',
      'auth/too-many-requests':           'Demasiadas tentativas. Aguarda um momento.',
      'auth/operation-not-allowed':       'Este método de login não está activado no Firebase.',
      'auth/popup-blocked':               'Popup bloqueado. Autoriza popups para este site.',
      'auth/cancelled-popup-request':     'Popup cancelado.',
      'auth/network-request-failed':      'Erro de rede. Verifica a ligação à internet.',
      'auth/unauthorized-domain':         'Domínio não autorizado no Firebase Console.',
      'auth/internal-error':              'Erro interno do Firebase.',
      'auth/missing-email':               'Introduz um e-mail.',
      'auth/missing-password':            'Introduz uma senha.',
    }
    return mapa[code] || 'Erro desconhecido'
  }

  const handleSubmit = async () => {
    setErro(null)
    setInfo(null)
    if (!email || !senha) { setErro('Preenche todos os campos.'); return }
    if (!recaptchaOk) { setErro('Confirma que não és um robot.'); return }
    if (tipo === 'register' && senha !== confirmar) { setErro('As senhas não coincidem.'); return }
    if (tipo === 'register' && senha.length < 6) { setErro('A senha deve ter pelo menos 6 caracteres.'); return }
    if (!auth) { setErro('Firebase não configurado. Contacta o administrador.'); return }
    setCarregando(true)
    try {
      if (tipo === 'register') {
        const cred = await createUserWithEmailAndPassword(auth, email, senha)
        await sendEmailVerification(cred.user)
        setInfo('Conta criada! Enviámos um e-mail de confirmação — verifica a caixa de entrada (e spam) antes de continuar.')
      } else {
        await signInWithEmailAndPassword(auth, email, senha)
      }
    } catch (e) {
      console.error('[Sidus Auth] Erro:', e.code, e.message)
      setErro(traduzirErro(e.code) + (e.code ? ` [${e.code}]` : ''))
      setRecaptchaKey((k) => k + 1)
    } finally {
      setCarregando(false)
    }
  }

  const isLogin = tipo === 'login'

  return (
    <div style={layoutConteudo(isDesktop, { paddingTop: 56, paddingBottom: 40, maxWidth: isDesktop ? 480 : undefined, margin: isDesktop ? '0 auto' : undefined })}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <Sparkles size={40} color={CORES.dourado} strokeWidth={1.5} style={{ marginBottom: 16 }} />
        <h1 style={{ ...estilos.titulo, fontSize: 36, letterSpacing: '0.2em' }}>Sidus</h1>
        <p style={{ ...estilos.subtitulo, maxWidth: 360, margin: '8px auto 0', lineHeight: 1.55 }}>
          Onde o mapa do céu se cruza com a sabedoria das cartas para guiar os teus passos.
        </p>
      </div>

      <div style={{ ...estilos.vidro, padding: 24 }}>
        {!firebaseOk && (
          <div style={{ marginBottom: 16, padding: '10px 14px', borderRadius: 10, background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.35)', fontSize: 12, color: '#FCD34D', lineHeight: 1.5 }}>
            Firebase não está configurado neste ambiente. Define as variáveis <code style={{ fontSize: 11 }}>VITE_FIREBASE_*</code> no Netlify ou no ficheiro <code style={{ fontSize: 11 }}>.env</code> local.
          </div>
        )}
        <h2 style={{ margin: '0 0 24px', fontSize: 18, fontWeight: 600, color: CORES.branco, textAlign: 'center' }}>
          {isLogin ? 'Entrar' : 'Criar Conta'}
        </h2>

        {/* Email */}
        <div style={{ marginBottom: 16 }}>
          <label style={estilos.label}>E-mail</label>
          <div style={{ position: 'relative' }}>
            <Mail size={15} color={CORES.brancoMuted} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="o.teu@email.com"
              style={{ ...estilos.input, paddingLeft: 40 }}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>
        </div>

        {/* Senha */}
        <div style={{ marginBottom: tipo === 'register' ? 16 : 24 }}>
          <label style={estilos.label}>Senha</label>
          <div style={{ position: 'relative' }}>
            <Lock size={15} color={CORES.brancoMuted} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              type={verSenha ? 'text' : 'password'}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              style={{ ...estilos.input, paddingLeft: 40, paddingRight: 44 }}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <button
              type="button"
              onClick={() => setVerSenha((v) => !v)}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: CORES.brancoMuted, padding: 4 }}
            >
              {verSenha ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Confirmar senha (só no registo) */}
        {tipo === 'register' && (
          <div style={{ marginBottom: 24 }}>
            <label style={estilos.label}>Confirmar Senha</label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} color={CORES.brancoMuted} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input
                type={verSenha ? 'text' : 'password'}
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                placeholder="••••••••"
                style={{ ...estilos.input, paddingLeft: 40 }}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
            </div>
          </div>
        )}

        {erro && (
          <div style={{ marginBottom: 16, padding: '10px 14px', borderRadius: 10, background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', fontSize: 13, color: '#F87171' }}>
            {erro}
          </div>
        )}

        {info && (
          <div style={{ marginBottom: 16, padding: '10px 14px', borderRadius: 10, background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', fontSize: 13, color: '#34D399', lineHeight: 1.5 }}>
            {info}
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <RecaptchaCheckbox onChange={setRecaptchaOk} resetKey={recaptchaKey} />
        </div>

        <button
          type="button"
          disabled={carregando || !recaptchaOk}
          onClick={handleSubmit}
          style={{ ...estilos.botaoDourado, opacity: carregando ? 0.6 : 1, cursor: carregando ? 'default' : 'pointer' }}
        >
          {carregando
            ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
            : isLogin ? 'Entrar' : 'Criar Conta'}
        </button>

        {/* Divisor */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0' }}>
          <div style={{ flex: 1, height: 1, background: CORES.vidroBorda }} />
          <span style={{ fontSize: 11, color: CORES.brancoMuted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>ou</span>
          <div style={{ flex: 1, height: 1, background: CORES.vidroBorda }} />
        </div>

        {/* Google */}
        <button
          type="button"
          disabled={carregando}
          onClick={async () => {
            if (!auth) { setErro('Firebase não configurado.'); return }
            if (!recaptchaOk) { setErro('Confirma que não és um robot.'); return }
            setErro(null)
            setInfo(null)
            setCarregando(true)
            try {
              await signInWithPopup(auth, new GoogleAuthProvider())
            } catch (e) {
              console.error('[Sidus Google] Erro:', e.code, e.message)
              if (e.code !== 'auth/popup-closed-by-user') setErro(traduzirErro(e.code) + ` [${e.code}]`)
              setRecaptchaKey((k) => k + 1)
            } finally {
              setCarregando(false)
            }
          }}
          style={{
            width: '100%',
            padding: '13px 16px',
            borderRadius: 12,
            border: `1px solid ${CORES.vidroBorda}`,
            background: 'rgba(255,255,255,0.05)',
            color: CORES.branco,
            fontSize: 14,
            fontWeight: 600,
            cursor: carregando ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            opacity: carregando ? 0.6 : 1,
          }}
        >
          {/* SVG logo Google */}
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16.1 19 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.3 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8H6.1C9.5 35.7 16.2 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.6l6.2 5.2C40.9 35.6 44 30.2 44 24c0-1.3-.1-2.7-.4-3.9z"/>
          </svg>
          Continuar com Google
        </button>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: CORES.brancoMuted }}>
          {isLogin ? 'Ainda não tens conta?' : 'Já tens conta?'}{' '}
          <button
            type="button"
            onClick={() => onMudar(isLogin ? 'register' : 'login')}
            style={{ background: 'none', border: 'none', color: CORES.dourado, cursor: 'pointer', fontSize: 13, fontWeight: 600, padding: 0 }}
          >
            {isLogin ? 'Cria uma aqui' : 'Entra aqui'}
          </button>
        </p>
      </div>
    </div>
  )
}

// Fusos manuais de fallback (usado apenas se a API falhar)
const FUSOS_FALLBACK = [
  { label: 'UTC−12', value: -12 }, { label: 'UTC−11', value: -11 },
  { label: 'UTC−10', value: -10 }, { label: 'UTC−9', value: -9 },
  { label: 'UTC−8', value: -8 },   { label: 'UTC−7', value: -7 },
  { label: 'UTC−6', value: -6 },   { label: 'UTC−5', value: -5 },
  { label: 'UTC−4', value: -4 },   { label: 'UTC−3 (Brasil)', value: -3 },
  { label: 'UTC−2', value: -2 },   { label: 'UTC−1', value: -1 },
  { label: 'UTC+0 (Portugal / UK)', value: 0 },
  { label: 'UTC+1 (Espanha / França)', value: 1 },
  { label: 'UTC+2 (Grécia / Egipto)', value: 2 },
  { label: 'UTC+3 (Rússia / Arábia)', value: 3 },
  { label: 'UTC+4', value: 4 }, { label: 'UTC+5', value: 5 },
  { label: 'UTC+5:30 (Índia)', value: 5.5 },
  { label: 'UTC+6', value: 6 }, { label: 'UTC+7', value: 7 },
  { label: 'UTC+8 (China / Sing.)', value: 8 },
  { label: 'UTC+9 (Japão / Coreia)', value: 9 },
  { label: 'UTC+10 (Austrália E.)', value: 10 },
  { label: 'UTC+11', value: 11 }, { label: 'UTC+12', value: 12 },
]

function Onboarding({ dados, setDados, onSubmit, isDesktop }) {
  const [tocado, setTocado] = useState({})
  const [fusoCarregando, setFusoCarregando] = useState(false)
  const [fusoErro, setFusoErro] = useState(null)
  const [fusoManual, setFusoManual] = useState(0) // fallback numérico

  const erros = validarOnboarding(dados)
  const valido = Object.keys(erros).length === 0

  const tocar = (campo) => () => setTocado((p) => ({ ...p, [campo]: true }))

  const handleSelectCidade = async (loc) => {
    setDados((p) => ({ ...p, cidade: loc.nome, localizacao: loc, fuso: null }))
    setFusoCarregando(true)
    setFusoErro(null)
    try {
      const tz = await pesquisarFusoHorario(loc.lat, loc.lon)
      setDados((p) => ({ ...p, fuso: tz }))
    } catch {
      setFusoErro('Nao foi possivel detectar o fuso automaticamente.')
      // Aplica o offset manual seleccionado como fallback
      setDados((p) => ({ ...p, fuso: fusoManual }))
    } finally {
      setFusoCarregando(false)
    }
  }

  // Quando o utilizador muda o offset manual aplica imediatamente (se estiver em modo fallback)
  const handleFusoManual = (v) => {
    const num = parseFloat(v)
    setFusoManual(num)
    if (fusoErro) setDados((p) => ({ ...p, fuso: num }))
  }

  // Rótulo amigável do fuso detectado + offset histórico real
  const labelFuso = () => {
    if (!dados.fuso && dados.fuso !== 0) return null
    if (typeof dados.fuso === 'string') {
      const ol = dados.data && dados.hora
        ? ` · ${offsetLabel(dados.fuso, dados.data, dados.hora)}`
        : ''
      return `${dados.fuso}${ol}`
    }
    const v = dados.fuso
    return `Offset manual: UTC${v >= 0 ? '+' : ''}${v}`
  }

  return (
    <div style={layoutConteudo(isDesktop, { paddingTop: 48, paddingBottom: 40, maxWidth: isDesktop ? 520 : undefined, margin: isDesktop ? '0 auto' : undefined })}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <Sparkles size={40} color={CORES.dourado} strokeWidth={1.5} style={{ marginBottom: 16 }} />
        <h1 style={{ ...estilos.titulo, fontSize: 36, letterSpacing: '0.2em' }}>Sidus</h1>
        <p style={estilos.subtitulo}>✦ Decifra o céu que te recebeu — efemérides Swiss Ephemeris e precisão de mestre astrólogo</p>
      </div>

      <div style={{ ...estilos.vidro, padding: 24 }}>
        <Campo
          label="Nome"
          valor={dados.nome}
          onChange={(v) => setDados((p) => ({ ...p, nome: v }))}
          onBlur={tocar('nome')}
          erro={tocado.nome ? erros.nome : null}
          placeholder="Nome real"
        />
        <CampoData
          valor={dados.data}
          onChange={(v) => setDados((p) => ({ ...p, data: v }))}
          onBlur={tocar('data')}
          erro={tocado.data ? erros.data : null}
        />
        <Campo
          label="Hora Exata de Nascimento"
          tipo="time"
          valor={dados.hora}
          onChange={(v) => setDados((p) => ({ ...p, hora: v }))}
          onBlur={tocar('hora')}
          erro={tocado.hora ? erros.hora : null}
        />

        <CampoCidade
          valor={dados.cidade}
          localizacao={dados.localizacao}
          onChange={(v) => setDados((p) => ({ ...p, cidade: v, localizacao: null, fuso: null }))}
          onSelect={handleSelectCidade}
          onBlur={tocar('cidade')}
          erro={tocado.cidade ? erros.cidade : null}
        />

        {/* Painel de fuso horário — auto-detectado ou manual */}
        {dados.localizacao && (
          <div style={{
            marginBottom: 20,
            padding: '12px 16px',
            borderRadius: 12,
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid ${fusoErro ? 'rgba(251,191,36,0.4)' : dados.fuso != null ? 'rgba(52,211,153,0.4)' : 'rgba(255,255,255,0.1)'}`,
          }}>
            {fusoCarregando && (
              <p style={{ margin: 0, fontSize: 13, color: CORES.brancoMuted }}>
                🌐 A detectar fuso horário...
              </p>
            )}
            {!fusoCarregando && dados.fuso != null && !fusoErro && (
              <div>
                <p style={{ margin: '0 0 2px', fontSize: 12, color: CORES.brancoMuted }}>
                  Fuso horário detectado automaticamente
                </p>
                <p style={{ margin: 0, fontSize: 14, color: '#34D399', fontWeight: 600 }}>
                  ✓ {labelFuso()}
                </p>
                {dados.data && dados.hora && (
                  <p style={{ margin: '4px 0 0', fontSize: 11, color: CORES.brancoMuted }}>
                    Inclui horário de verão histórico real para a data de nascimento
                  </p>
                )}
              </div>
            )}
            {fusoErro && (
              <div>
                <p style={{ margin: '0 0 8px', fontSize: 13, color: '#FBBF24' }}>
                  ⚠ {fusoErro}
                </p>
                <label style={{ ...estilos.label, fontSize: 12, marginBottom: 6 }}>
                  Seleciona o fuso manualmente:
                </label>
                <select
                  value={fusoManual}
                  onChange={(e) => handleFusoManual(e.target.value)}
                  style={{
                    ...estilos.input,
                    marginBottom: 0,
                    fontSize: 13,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {FUSOS_FALLBACK.map((o) => (
                    <option key={o.value} value={o.value} style={{ background: '#1a1030', color: '#fff' }}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        <button
          type="button"
          disabled={!valido}
          onClick={() => {
            setTocado({ nome: true, data: true, hora: true, cidade: true })
            if (valido) onSubmit()
          }}
          style={{ ...estilos.botaoDourado, opacity: valido ? 1 : 0.45, cursor: valido ? 'pointer' : 'not-allowed' }}
        >
          Calcular o Meu Destino
        </button>
      </div>
    </div>
  )
}

function Dashboard({ nome, mapaNatal, ceuAgora, aspetos, onOraculo, onPrivacidade, isDesktop, isPremium, onUpgrade, onTarot }) {
  const faseLua = calcularFaseLua(new Date())
  return (
    <div style={layoutConteudo(isDesktop)}>
      <header style={{ textAlign: 'center', marginBottom: 28 }}>
        <h1 style={estilos.titulo}>Sidus</h1>
        <p style={{ ...estilos.subtitulo, marginBottom: 0 }}>{nome ? `Bem-vindo, ${nome}` : 'O teu ceu em tempo real'}</p>
      </header>

      {mapaNatal && (
        <div style={{ ...estilos.vidro, padding: 20, marginBottom: 18 }}>
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.09em', color: CORES.dourado, marginBottom: 12 }}>
            Mapa Natal
          </div>

          {/* Linha principal: Sol + Ascendente em destaque */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
            <div style={{ flex: 1, background: 'rgba(223,183,108,0.08)', borderRadius: 12, padding: '10px 14px', border: `1px solid rgba(223,183,108,0.2)` }}>
              <div style={{ fontSize: 10, color: CORES.dourado, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                ☉ Signo Solar
              </div>
              <div style={{ fontSize: 17, fontWeight: 600, color: CORES.branco }}>
                {mapaNatal.solar.simbolo} {mapaNatal.solar.nome}
              </div>
              <div style={{ fontSize: 11, color: CORES.brancoMuted, marginTop: 2 }}>
                {mapaNatal.solar.graus}° · {mapaNatal.solar.elemento}
              </div>
            </div>

            <div style={{ flex: 1, background: 'rgba(139,92,246,0.12)', borderRadius: 12, padding: '10px 14px', border: `1px solid rgba(139,92,246,0.3)` }}>
              <div style={{ fontSize: 10, color: '#C4B5FD', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                ↑ Ascendente
              </div>
              <div style={{ fontSize: 17, fontWeight: 600, color: CORES.branco }}>
                {mapaNatal.ascendente.simbolo} {mapaNatal.ascendente.nome}
              </div>
              <div style={{ fontSize: 11, color: CORES.brancoMuted, marginTop: 2 }}>
                {mapaNatal.ascendente.graus}° · {mapaNatal.ascendente.elemento}
              </div>
            </div>
          </div>

          {/* Lua */}
          <div style={{ fontSize: 14, color: CORES.brancoMuted }}>
            ☽ Lua em <span style={{ color: CORES.brancoSuave }}>{mapaNatal.lunar.nome} {mapaNatal.lunar.simbolo}</span>
            <span style={{ marginLeft: 6, fontSize: 12 }}>{mapaNatal.lunar.graus}° · {mapaNatal.lunar.elemento}</span>
          </div>
        </div>
      )}

      <div style={{ ...estilos.vidro, padding: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <Moon size={22} color={CORES.dourado} />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: CORES.dourado }}>
            Céu de Hoje
          </span>
        </div>

        {/* Fase lunar — Premium */}
        {isPremium ? (
          <div style={{
            background: 'rgba(139,92,246,0.12)', borderRadius: 12, padding: 14, marginBottom: 14,
            border: '1px solid rgba(139,92,246,0.3)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <span style={{ fontSize: 32 }}>{faseLua.emoji}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: CORES.branco }}>{faseLua.nome}</div>
                <div style={{ fontSize: 11, color: CORES.brancoMuted }}>{faseLua.iluminacao}% iluminada · {faseLua.angulo}° de elongação</div>
              </div>
            </div>
            <p style={{ fontSize: 12, color: CORES.brancoSuave, lineHeight: 1.55, margin: 0 }}>{faseLua.desc}</p>
          </div>
        ) : (
          <div onClick={onUpgrade} style={{
            background: 'rgba(223,183,108,0.06)', borderRadius: 12, padding: 14, marginBottom: 14,
            border: '1px dashed rgba(223,183,108,0.35)', cursor: 'pointer', textAlign: 'center',
          }}>
            <span style={{ fontSize: 24 }}>🌙</span>
            <div style={{ fontSize: 12, color: CORES.brancoMuted, marginTop: 6 }}>
              Fases da Lua em tempo real — <span style={{ color: CORES.dourado, fontWeight: 600 }}>Premium</span>
            </div>
          </div>
        )}

        {ceuAgora.map((p) => (
          <div key={p.key} style={{ fontSize: 14, color: CORES.brancoSuave, padding: '7px 0', borderBottom: `1px solid ${CORES.vidroBorda}` }}>
            {p.simbolo} {p.texto}
          </div>
        ))}
      </div>

      <div style={{ ...estilos.vidro, padding: 20, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <Star size={18} color={CORES.dourado} />
          <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: CORES.brancoSuave }}>
            Aspetos Ativos do Momento
          </span>
        </div>
        {aspetos.length === 0 ? (
          <p style={{ fontSize: 13, color: CORES.brancoMuted }}>Sem aspetos maiores dentro de orbe {ORBE_ASPECTO}° neste instante.</p>
        ) : (
          aspetos.slice(0, 8).map((a, i) => (
            <div key={`${a.planetaA}-${a.planetaB}-${i}`} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < aspetos.length - 1 ? `1px solid ${CORES.vidroBorda}` : 'none' }}>
              <div style={{ fontSize: 14, color: CORES.branco }}>
                {a.planetaA} <span style={{ color: CORES.dourado }}>{a.aspecto}</span> {a.planetaB}
              </div>
              <div style={{ fontSize: 11, color: CORES.brancoMuted }}>{a.orbe}</div>
            </div>
          ))
        )}
      </div>

      {/* Carta do Dia */}
      <CartaDoDia />

      {onTarot && (
        <button type="button" onClick={onTarot} style={{
          ...estilos.vidro, width: '100%', padding: 18, marginBottom: 16, cursor: 'pointer',
          border: '1px solid rgba(244,114,182,0.35)', background: 'rgba(244,114,182,0.08)',
          display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left',
        }}>
          <span style={{ fontSize: 28 }}>🎴</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: '#F472B6', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Tarot Online</div>
            <div style={{ fontSize: 15, color: CORES.branco, fontWeight: 600 }}>Arcanos Virtuais</div>
            <div style={{ fontSize: 11, color: CORES.brancoMuted }}>6 baralhos · 1 leitura grátis por tipo</div>
          </div>
          <Layers size={22} color="#F472B6" />
        </button>
      )}

      <button type="button" onClick={onOraculo} style={{ ...estilos.vidro, width: '100%', padding: 18, display: 'flex', justifyContent: 'space-between', border: `1px solid ${CORES.dourado}`, background: 'rgba(223,183,108,0.08)', marginTop: 14, marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 11, color: CORES.dourado, textTransform: 'uppercase' }}>Oráculo do Dia</div>
          <div style={{ fontSize: 15, color: CORES.branco }}>Consulta o Astrólogo IA</div>
        </div>
        <MessageCircle size={22} color={CORES.dourado} />
      </button>

      {/* Rodapé legal */}
      <div style={{ textAlign: 'center', paddingTop: 10, paddingBottom: 4 }}>
        <button type="button" onClick={onPrivacidade} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', fontSize: 10, cursor: 'pointer', textDecoration: 'underline' }}>
          Política de Privacidade
        </button>
        <span style={{ color: 'rgba(255,255,255,0.15)', margin: '0 6px', fontSize: 10 }}>·</span>
        <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10 }}>© 2026 Sidus</span>
      </div>
    </div>
  )
}

// ── Carta do Dia (determinada pela data) ──────────────────────────────────────
const ARCANOS_NOMES = [
  {id:0,nome:'O Louco',simb:'🃏',palavras:['aventura','liberdade','começo'],luz:'Abertura total ao desconhecido. Um salto de fé abre portas inesperadas.'},
  {id:1,nome:'O Mago',simb:'🎩',palavras:['poder','vontade','manifestação'],luz:'Tens todos os recursos que precisas. A tua força de vontade transforma pensamentos em realidade.'},
  {id:2,nome:'A Papisa',simb:'📖',palavras:['intuição','mistério','sabedoria'],luz:'A tua voz interior é precisa. Confia no que sentes antes do que vês.'},
  {id:3,nome:'A Imperatriz',simb:'👑',palavras:['abundância','amor','fertilidade'],luz:'Ciclo de prosperidade e criatividade. Nutre os teus projectos com amor.'},
  {id:4,nome:'O Imperador',simb:'⚔️',palavras:['autoridade','estrutura','proteção'],luz:'Momento de assumir as rédeas. A disciplina constrói o teu legado.'},
  {id:5,nome:'O Hierofante',simb:'✝️',palavras:['tradição','fé','ensinamento'],luz:'Um mentor ou ensinamento surge. Valores profundos guiam as decisões.'},
  {id:6,nome:'Os Amantes',simb:'💞',palavras:['amor','escolha','harmonia'],luz:'Uma união ou escolha define o teu caminho. O coração sabe o que a mente tarda a aceitar.'},
  {id:7,nome:'O Carro',simb:'🏆',palavras:['vitória','determinação','controlo'],luz:'A tua vontade supera obstáculos. Foco e velocidade garantem a vitória.'},
  {id:8,nome:'A Força',simb:'🦁',palavras:['coragem','compaixão','domínio'],luz:'A força verdadeira nasce do amor. Domas os medos com gentileza.'},
  {id:9,nome:'O Eremita',simb:'🕯️',palavras:['reflexão','solidão','guia'],luz:'Recolhimento frutífero. A tua luz interior ilumina quando tudo parece escuro.'},
  {id:10,nome:'Roda da Fortuna',simb:'☸️',palavras:['destino','ciclos','mudança'],luz:'O ciclo vira a teu favor. Uma reviravolta traz nova sorte.'},
  {id:11,nome:'A Justiça',simb:'⚖️',palavras:['equilíbrio','verdade','karma'],luz:'A verdade prevalece. Cada acção tem a sua consequência — colhes o que plantaste.'},
  {id:12,nome:'O Enforcado',simb:'🔄',palavras:['sacrifício','perspetiva','pausa'],luz:'Uma pausa necessária revela o que estava oculto. O sacrifício abre novas perspetivas.'},
  {id:13,nome:'A Morte',simb:'🌑',palavras:['transformação','fim','renascimento'],luz:'Uma fase encerra para que algo mais elevado nasça. A transformação é libertadora.'},
  {id:14,nome:'A Temperança',simb:'🌊',palavras:['equilíbrio','paciência','alquimia'],luz:'A mistura perfeita cria algo extraordinário. Paciência é a tua aliada.'},
  {id:15,nome:'O Diabo',simb:'⛓️',palavras:['apego','ilusão','libertação'],luz:'Reconhecer o que te prende é o primeiro passo para a liberdade.'},
  {id:16,nome:'A Torre',simb:'⚡',palavras:['ruptura','revelação','reconstrução'],luz:'O que se destrói era falso. A ruptura abre espaço para a verdade.'},
  {id:17,nome:'A Estrela',simb:'⭐',palavras:['esperança','cura','inspiração'],luz:'Depois de qualquer tempestade surge a luz. Cura profunda chega agora.'},
  {id:18,nome:'A Lua',simb:'🌙',palavras:['intuição','inconsciente','sonhos'],luz:'Os teus sonhos e intuições carregam mensagens reais.'},
  {id:19,nome:'O Sol',simb:'☀️',palavras:['alegria','sucesso','clareza'],luz:'Clareza total. A alegria surge quando ages com plena autenticidade.'},
  {id:20,nome:'O Julgamento',simb:'📯',palavras:['despertar','redenção','chamado'],luz:'Um despertar espiritual profundo. Estás a ser chamado ao teu propósito maior.'},
  {id:21,nome:'O Mundo',simb:'🌍',palavras:['conclusão','integração','plenitude'],luz:'Ciclo completado com sucesso. Tens tudo o que precisas para viver plenamente.'},
]

function CartaDoDia() {
  const [dataHoje, setDataHoje] = useState(() => new Date().toISOString().slice(0, 10))

  useEffect(() => {
    const verificar = () => {
      const hoje = new Date().toISOString().slice(0, 10)
      if (hoje !== dataHoje) setDataHoje(hoje)
    }
    verificar()
    const id = setInterval(verificar, 60000)
    return () => clearInterval(id)
  }, [dataHoje])

  const [ano, mes, dia] = dataHoje.split('-').map(Number)
  const idx = (ano * 1000 + (mes - 1) * 31 + dia) % 22
  const carta = ARCANOS_NOMES[idx]
  const dataFormatada = `${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')}/${ano}`

  return (
    <div style={{
      ...estilos.vidro, padding:'18px 20px', marginBottom:16,
      background:'rgba(223,183,108,0.05)', border:`1px solid rgba(223,183,108,0.35)`,
      borderRadius:16, cursor:'default',
    }}>
      <div style={{fontSize:10,color:CORES.dourado,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:12}}>
        ✦ Carta do Dia · {dataFormatada}
      </div>
      <div style={{display:'flex',alignItems:'center',gap:16}}>
        {/* Mini card SVG */}
        <div style={{
          width:56, height:90, borderRadius:8, flexShrink:0,
          background:'linear-gradient(160deg,#1a0d3a,#0B071E)',
          border:`1.5px solid ${CORES.dourado}`,
          display:'flex', flexDirection:'column', alignItems:'center',
          justifyContent:'space-between', padding:'8px 4px',
          boxShadow:'0 0 20px rgba(223,183,108,0.25)',
        }}>
          <div style={{fontSize:7,color:CORES.dourado,opacity:0.7,fontFamily:'Georgia,serif'}}>{carta.id===0?'☽':String(carta.id)}</div>
          <div style={{fontSize:26}}>{carta.simb}</div>
          <div style={{fontSize:6,color:CORES.dourado,textAlign:'center',lineHeight:1.2}}>{carta.nome.toUpperCase()}</div>
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:17,fontWeight:700,color:CORES.branco,marginBottom:4}}>{carta.nome}</div>
          <div style={{display:'flex',gap:5,marginBottom:8,flexWrap:'wrap'}}>
            {carta.palavras.map(p=>(
              <span key={p} style={{fontSize:10,padding:'2px 8px',borderRadius:20,background:'rgba(223,183,108,0.1)',color:CORES.dourado,border:`1px solid rgba(223,183,108,0.2)`}}>{p}</span>
            ))}
          </div>
          <p style={{fontSize:12,color:CORES.brancoMuted,lineHeight:1.6,margin:0}}>{carta.luz}</p>
        </div>
      </div>
    </div>
  )
}

function PilarCard({ titulo, simbolo, nome, graus, elemento, icon: Icon, corBorda, corFundo, corIcone }) {
  const corEl = elemento === 'Fogo' ? '#FB923C' : elemento === 'Terra' ? '#4ADE80' : elemento === 'Ar' ? '#93C5FD' : '#818CF8'
  const bgEl  = elemento === 'Fogo' ? 'rgba(251,146,60,0.15)' : elemento === 'Terra' ? 'rgba(74,222,128,0.12)' : elemento === 'Ar' ? 'rgba(147,197,253,0.15)' : 'rgba(129,140,248,0.15)'
  const bordEl= elemento === 'Fogo' ? 'rgba(251,146,60,0.3)' : elemento === 'Terra' ? 'rgba(74,222,128,0.3)' : elemento === 'Ar' ? 'rgba(147,197,253,0.3)' : 'rgba(129,140,248,0.3)'
  return (
    <div style={{ ...estilos.vidro, padding: 18, marginBottom: 12, display: 'flex', gap: 14, alignItems: 'center' }}>
      <div style={{ width: 54, height: 54, borderRadius: 14, background: corFundo, border: `1px solid ${corBorda}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>
        {simbolo}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
          <Icon size={12} color={corIcone} />
          <span style={{ fontSize: 10, color: corIcone, textTransform: 'uppercase', letterSpacing: '0.09em', fontWeight: 700 }}>{titulo}</span>
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, color: CORES.branco, lineHeight: 1.2 }}>{nome}</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, color: CORES.brancoMuted }}>{graus != null ? `${typeof graus === 'number' ? graus.toFixed(1) : graus}° no signo` : ''}</span>
          {elemento && (
            <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: bgEl, color: corEl, border: `1px solid ${bordEl}` }}>{elemento}</span>
          )}
        </div>
      </div>
    </div>
  )
}

function BarraElemento({ label, valor, total, cor }) {
  const pct = total > 0 ? Math.round((valor / total) * 100) : 0
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ fontSize: 12, color: CORES.brancoSuave }}>{label}</span>
        <span style={{ fontSize: 11, color: cor, fontWeight: 700 }}>{valor} ({pct}%)</span>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.08)' }}>
        <div style={{ height: '100%', borderRadius: 3, width: `${pct}%`, background: cor, transition: 'width 0.6s ease' }} />
      </div>
    </div>
  )
}

function MapaAstral({ mapaNatal, dados, planetasNascimento, isPremium, onUpgrade, onMapaGerado, isDesktop, motorAstro }) {
  const [gerandoPdf, setGerandoPdf] = useState(false)
  const [emailEnviado, setEmailEnviado] = useState(false)
  const mapaGeradoRef = useRef(false)

  // Notifica o pai na primeira visualização do mapa (trava dados natais)
  useEffect(() => {
    if (mapaNatal && !mapaGeradoRef.current) {
      mapaGeradoRef.current = true
      onMapaGerado?.()
    }
  }, [mapaNatal, onMapaGerado])

  const planetasComCasa = useMemo(
    () => atribuirCasasPlanetas(planetasNascimento, mapaNatal?.cusps),
    [planetasNascimento, mapaNatal?.cusps]
  )

  const aspetosNatais = useMemo(
    () => (planetasComCasa.length > 0 ? calcularAspetos(planetasComCasa).slice(0, 12) : []),
    [planetasComCasa]
  )

  const analiseCompleta = useMemo(
    () => (isPremium && mapaNatal ? gerarAnaliseCompleta(mapaNatal, planetasComCasa, aspetosNatais, dados) : null),
    [isPremium, mapaNatal, planetasComCasa, aspetosNatais, dados]
  )

  const resumoGratuito = useMemo(
    () => (!isPremium && mapaNatal ? gerarResumoGratuito(mapaNatal) : null),
    [isPremium, mapaNatal]
  )

  const mapaCompletoVisivel = planetasComCasa.length > 0

  const downloadPdf = async () => {
    if (gerandoPdf) return
    setGerandoPdf(true)
    try {
      const { gerarPdfMapaAstral } = await import('./components/PdfMapa.jsx')
      await gerarPdfMapaAstral(mapaNatal, dados, planetasComCasa, analiseCompleta)
    } catch (e) {
      console.error('PDF error:', e)
      alert('Erro ao gerar PDF. Tenta novamente.')
    } finally {
      setGerandoPdf(false)
    }
  }

  const compartilharEmail = () => {
    const corpo = [
      analiseCompleta?.textoPlano || '',
      '',
      '── POSIÇÕES PLANETÁRIAS (Placidus) ─────────',
      ...planetasComCasa.map(p =>
        `  ${p.simbolo} ${p.nome}: ${p.signo?.nome || '—'}${p.casa ? ` · Casa ${p.casa}` : ''} (${(p.longitude ?? 0).toFixed(1)}°)${p.retrograde ? ' ℞' : ''}`
      ),
      '',
      'Gerado por Sidus — https://sidus.app',
    ].join('\n')

    const assunto = encodeURIComponent(`Mapa Astral Completo — ${dados.nome} · Sidus`)
    const body    = encodeURIComponent(corpo)
    window.location.href = `mailto:?subject=${assunto}&body=${body}`
    setEmailEnviado(true)
    setTimeout(() => setEmailEnviado(false), 4000)
  }

  if (!mapaNatal) {
    return (
      <div style={layoutConteudo(isDesktop)}>
        <h1 style={{ ...estilos.titulo, textAlign: 'left', fontSize: 22, marginBottom: 20 }}>Mapa Astral</h1>
        <div style={{ ...estilos.vidro, padding: 20, display: 'flex', gap: 8, color: CORES.brancoMuted }}>
          <Info size={15} />
          <span>Preenche o registo natal para calcular o teu mapa.</span>
        </div>
      </div>
    )
  }

  const pilaresBase = [
    { titulo: 'Signo Solar',  icon: Sun,      corBorda: CORES.vidroBorda,         corFundo: CORES.roxoClaro,           corIcone: CORES.dourado,  ...mapaNatal.solar },
    { titulo: 'Signo Lunar',  icon: Moon,     corBorda: CORES.vidroBorda,         corFundo: CORES.roxoClaro,           corIcone: CORES.dourado,  ...mapaNatal.lunar },
    { titulo: 'Ascendente',   icon: ArrowUp,  corBorda: 'rgba(139,92,246,0.4)',   corFundo: 'rgba(139,92,246,0.18)',   corIcone: '#C4B5FD',      ...mapaNatal.ascendente },
  ]
  const pilaresCompletos = [
    ...pilaresBase,
    ...(mapaNatal.mc ? [{ titulo: 'Meio do Céu (MC)', icon: Star, corBorda: 'rgba(52,211,153,0.35)', corFundo: 'rgba(52,211,153,0.12)', corIcone: '#34D399', ...mapaNatal.mc }] : []),
  ]

  const balEl  = mapaCompletoVisivel ? calcularBalancaElementos(planetasComCasa) : null
  const balMod = mapaCompletoVisivel ? calcularBalancaModalidades(planetasComCasa) : null
  const totalPlanetas = planetasComCasa.length

  return (
    <div style={layoutConteudo(isDesktop)}>
      <header style={{ marginBottom: 20 }}>
        <h1 style={{ ...estilos.titulo, textAlign: 'left', fontSize: isDesktop ? 28 : 22 }}>Mapa Astral</h1>
        <p style={{ ...estilos.subtitulo, textAlign: 'left', marginBottom: 2 }}>
          {dados.nome} · {formatarData(dados.data)} às {dados.hora}
        </p>
        <p style={{ fontSize: 10, color: CORES.brancoMuted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          {mapaNatal.sistema || 'Tropical · Placidus'} · {mapaNatal.motor || motorAstro || 'astronomy-engine'}
          {sweEphemerisPronta() ? ' · Efemérides ✓' : ''}
        </p>
      </header>

      {/* ── Resumo interpretativo (gratuito) ── */}
      {!isPremium && resumoGratuito && (
        <div style={{ ...estilos.vidro, padding: 16, marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: CORES.brancoMuted, lineHeight: 1.6, marginBottom: 8 }}>
            {resumoGratuito.sol}
          </div>
          <div style={{ fontSize: 11, color: CORES.brancoMuted, fontStyle: 'italic' }}>
            {resumoGratuito.gancho}
          </div>
        </div>
      )}

      {/* ── Quatro Pilares ── */}
      <div style={{ fontSize: 11, color: CORES.dourado, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10, fontWeight: 700 }}>
        ✦ Quatro Pilares Fundamentais
      </div>
      {pilaresCompletos.map(p => <PilarCard key={p.titulo} {...p} />)}

      {/* ── Posições planetárias (todos os utilizadores com dados completos) ── */}
      {mapaCompletoVisivel && (
        <>
          {balEl && (
            <div style={{ ...estilos.vidro, padding: 18, marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: CORES.dourado, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14, fontWeight: 700 }}>
                ✦ Equilíbrio de Elementos
              </div>
              <BarraElemento label="🔥 Fogo — Acção, entusiasmo, criatividade"  valor={balEl.Fogo}  total={totalPlanetas} cor="#FB923C" />
              <BarraElemento label="🌍 Terra — Estabilidade, praticidade, perseverança" valor={balEl.Terra} total={totalPlanetas} cor="#4ADE80" />
              <BarraElemento label="💨 Ar — Intelecto, comunicação, adaptação"   valor={balEl.Ar}   total={totalPlanetas} cor="#93C5FD" />
              <BarraElemento label="💧 Água — Emoção, intuição, profundidade"   valor={balEl.Água} total={totalPlanetas} cor="#818CF8" />
              {balMod && (
                <>
                  <div style={{ fontSize: 11, color: CORES.dourado, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '16px 0 12px', fontWeight: 700 }}>
                    ✦ Modalidades
                  </div>
                  <BarraElemento label="⚡ Cardinal — Iniciativa, liderança"     valor={balMod.Cardinal} total={totalPlanetas} cor="#F472B6" />
                  <BarraElemento label="🏔 Fixo — Determinação, resistência"     valor={balMod.Fixo}    total={totalPlanetas} cor="#FBBF24" />
                  <BarraElemento label="🌊 Mutável — Flexibilidade, adaptação"   valor={balMod.Mutável} total={totalPlanetas} cor="#34D399" />
                </>
              )}
            </div>
          )}

          <div style={{ ...estilos.vidro, padding: 18, marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: CORES.dourado, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14, fontWeight: 700 }}>
              ✦ Posições Planetárias · Casas Placidus
            </div>
            {planetasComCasa.map((p) => (
              <div key={p.key} style={{ padding: '10px 0', borderBottom: `1px solid ${CORES.vidroBorda}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
                  <span style={{ fontSize: 14, color: CORES.branco, fontWeight: 600 }}>
                    {p.simbolo} {p.nome}
                  </span>
                  <span style={{ fontSize: 13, color: CORES.dourado }}>
                    {p.signo?.simbolo} {p.signo?.nome}
                    {p.casa ? <span style={{ color: CORES.brancoMuted, fontSize: 11, marginLeft: 6 }}>Casa {p.casa}</span> : ''}
                    {p.retrograde ? <span style={{ color: '#F87171', fontSize: 11, marginLeft: 4 }}> ℞</span> : ''}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: CORES.brancoMuted, marginTop: 2 }}>
                  {(p.longitude ?? 0).toFixed(2)}° eclíptica tropical
                </div>
              </div>
            ))}
          </div>

          {aspetosNatais.length > 0 && (
            <div style={{ ...estilos.vidro, padding: 18, marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: CORES.dourado, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14, fontWeight: 700 }}>
                ✦ Aspectos Principais no Mapa Natal
              </div>
              {aspetosNatais.map((a, i) => {
                const corAsp = a.aspecto === 'Conjunção' ? '#DFB76C' : a.aspecto === 'Trígono' || a.aspecto === 'Sextil' ? '#34D399' : '#F87171'
                return (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: `1px solid rgba(255,255,255,0.05)` }}>
                    <span style={{ fontSize: 12, color: CORES.brancoSuave }}>{a.planetaA} · {a.planetaB}</span>
                    <span style={{ fontSize: 11, color: corAsp, fontWeight: 600, padding: '2px 8px', borderRadius: 10, background: `${corAsp}18` }}>{a.aspecto} {a.orbe}</span>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* ── Conteúdo Premium (interpretação profunda + PDF) ── */}
      {isPremium ? (
        <>
          <InterpretacaoMapa analise={analiseCompleta} estilosVidro={estilos.vidro} />

          {/* Áreas da Vida — resumo por casa dominante */}
          <div style={{ ...estilos.vidro, padding: 18, marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: CORES.dourado, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14, fontWeight: 700 }}>
              ✦ Resumo por Esfera de Vida
            </div>
            {[
              {
                area: '❤ Amor & Relacionamentos',
                planetas: planetasComCasa.filter(p => ['Vénus', 'Lua', 'Marte'].includes(p.nome)),
              },
              {
                area: '💼 Carreira & Propósito',
                planetas: planetasComCasa.filter(p => ['Sol', 'Saturno', 'Marte'].includes(p.nome)),
              },
              {
                area: '🔮 Espiritualidade & Alma',
                planetas: planetasComCasa.filter(p => ['Neptuno', 'Plutão', 'Lua', 'Quíron'].includes(p.nome)),
              },
            ].map(({ area, planetas: ps }) => (
              <div key={area} style={{ padding: '10px 0', borderBottom: `1px solid ${CORES.vidroBorda}` }}>
                <div style={{ fontSize: 13, color: CORES.branco, fontWeight: 600, marginBottom: 3 }}>{area}</div>
                <div style={{ fontSize: 12, color: CORES.brancoMuted }}>
                  {ps.length > 0
                    ? ps.map(p => `${p.nome} em ${p.signo?.nome}${p.casa ? ` (Casa ${p.casa})` : ''}`).join(' · ')
                    : '—'}
                </div>
              </div>
            ))}
          </div>

          {/* Exportar mapa completo */}
          <div style={{ fontSize: 11, color: CORES.dourado, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10, fontWeight: 700 }}>
            ✦ Exportar Mapa Completo
          </div>

          {/* Verificação de precisão (compacta) */}
          <div style={{ ...estilos.vidro, padding: 14, marginBottom: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px 12px', fontSize: 11 }}>
              <span style={{ color: CORES.brancoMuted }}>Data UT:</span>
              <span style={{ color: CORES.branco }}>{mapaNatal.instanteUTC ? mapaNatal.instanteUTC.replace('T', ' ').slice(0, 16) + ' UTC' : '—'}</span>
              <span style={{ color: CORES.brancoMuted }}>Fuso:</span>
              <span style={{ color: CORES.branco }}>
                {typeof mapaNatal.fuso === 'string' ? mapaNatal.fuso : `UTC${(mapaNatal.fuso ?? 0) >= 0 ? '+' : ''}${mapaNatal.fuso ?? 0}`}
              </span>
              <span style={{ color: CORES.brancoMuted }}>Coordenadas:</span>
              <span style={{ color: CORES.branco }}>{mapaNatal.lat != null ? `${mapaNatal.lat.toFixed(3)}°N  ${mapaNatal.lon?.toFixed(3)}°E` : '—'}</span>
            </div>
          </div>

          {/* Botões de ação */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            <button type="button" onClick={downloadPdf} disabled={gerandoPdf} style={{
              flex: 1, padding: '14px', borderRadius: 14,
              background: gerandoPdf ? 'rgba(223,183,108,0.15)' : `linear-gradient(135deg, ${CORES.dourado}, ${CORES.douradoEscuro})`,
              border: 'none', color: CORES.fundo, fontSize: 14, fontWeight: 700, cursor: gerandoPdf ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              {gerandoPdf ? '⏳ A gerar…' : '📄 PDF'}
            </button>
            <button type="button" onClick={compartilharEmail} style={{
              flex: 1, padding: '14px', borderRadius: 14,
              background: emailEnviado ? 'rgba(52,211,153,0.2)' : 'rgba(223,183,108,0.12)',
              border: `1px solid ${emailEnviado ? '#34D399' : CORES.dourado}`,
              color: emailEnviado ? '#34D399' : CORES.dourado,
              fontSize: 14, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              {emailEnviado ? '✓ Email aberto' : '✉ Email'}
            </button>
          </div>
        </>
      ) : (
        /* Teaser premium */
        <div onClick={onUpgrade} style={{
          ...estilos.vidro, padding: 24, marginBottom: 14, cursor: 'pointer',
          border: `1px solid ${CORES.dourado}`, background: 'rgba(223,183,108,0.06)',
          textAlign: 'center', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(223,183,108,0.03) 8px, rgba(223,183,108,0.03) 16px)', pointerEvents: 'none' }} />
          <Crown size={28} color={CORES.dourado} style={{ marginBottom: 10 }} />
          <div style={{ fontSize: 16, fontWeight: 700, color: CORES.dourado, marginBottom: 6 }}>Mapa Astral Completo</div>
          <div style={{ fontSize: 13, color: CORES.brancoMuted, marginBottom: 14, lineHeight: 1.5 }}>
            Interpretação profissional com efemérides, casas Placidus, planetas geracionais,
            aspectos, síntese evolutiva e exportação PDF + email
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {['☀ Essência', '☿♀♂ Pessoais', '♃♄ Karma', '⊕ MC', '🌙 Fases Lua', '📄 PDF'].map(item => (
              <span key={item} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 20, background: 'rgba(223,183,108,0.1)', border: `1px solid rgba(223,183,108,0.25)`, color: CORES.brancoMuted }}>
                {item}
              </span>
            ))}
          </div>
          <div style={{ ...estilos.botaoDourado, display: 'inline-block', padding: '12px 32px', fontSize: 14 }}>
            Activar por 4,99 € / mês
          </div>
        </div>
      )}
    </div>
  )
}

function Ferramentas({ onFerramenta, isDesktop }) {
  return (
    <div style={layoutConteudo(isDesktop)}>
      <header style={{ marginBottom: 28 }}>
        <h1 style={{ ...estilos.titulo, textAlign: 'left', fontSize: 22 }}>Ferramentas Ocultas</h1>
      </header>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {FERRAMENTAS.map((f) => {
          const Icon = f.icon
          return (
            <button key={f.id} type="button" onClick={() => onFerramenta(f)} style={{ ...estilos.vidro, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', width: '100%', textAlign: 'left' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: f.premium ? 'rgba(223,183,108,0.12)' : CORES.roxoClaro, border: `1px solid ${f.premium ? CORES.dourado : CORES.vidroBorda}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={22} color={f.premium ? CORES.dourado : CORES.brancoSuave} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, color: CORES.branco }}>{f.nome}</div>
                {f.sub && <div style={{ fontSize: 12, color: CORES.brancoMuted }}>{f.sub}</div>}
              </div>
              {f.premium && <Crown size={16} color={CORES.dourado} />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Paywall({ onVoltar, onPagar, onSucesso, isDesktop }) {
  return (
    <div style={layoutConteudo(isDesktop, { paddingTop: 16 })}>
      <button type="button" onClick={onVoltar} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: CORES.dourado, cursor: 'pointer', marginBottom: 20 }}>
        <ChevronLeft size={20} /> Voltar
      </button>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>✨</div>
        <h1 style={{ ...estilos.titulo, fontSize: 24 }}>Sidus VIP</h1>
        <p style={{ color: CORES.brancoMuted, fontSize: 13 }}>Desbloqueia o cosmos completo</p>
      </div>
      <div style={{ ...estilos.vidro, padding: 24, marginBottom: 20 }}>
        {BENEFICIOS_VIP.map((b) => (
          <div key={b} style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            <Check size={14} color={CORES.dourado} />
            <span style={{ fontSize: 14, color: CORES.brancoSuave }}>{b}</span>
          </div>
        ))}
      </div>
      <div style={{ ...estilos.vidro, padding: 24, textAlign: 'center', border: `1px solid ${CORES.dourado}`, marginBottom: 20 }}>
        <div style={{ fontSize: 40, fontWeight: 700, color: CORES.branco }}>4,99 € <span style={{ fontSize: 16, color: CORES.brancoMuted, fontWeight: 400 }}>/ mês</span></div>
        <p style={{ fontSize: 12, color: CORES.brancoMuted, marginTop: 6 }}>Cancelável a qualquer momento</p>
      </div>
      <button type="button" onClick={() => onPagar('Sidus VIP — Subscrição mensal', 4.99, onSucesso)} style={estilos.botaoDourado}>
        Tornar-me VIP Agora
      </button>
      <p style={{ textAlign: 'center', fontSize: 11, color: CORES.brancoMuted, marginTop: 12 }}>
        Cartão · MB Way · Multibanco · PayPal · PIX — via Stripe
      </p>
    </div>
  )
}

// ── Integração Gemini AI (opcional — requer VITE_GEMINI_API_KEY no .env) ─────
// ── Prompt de Sistema AuraBot ─────────────────────────────────────────────────
function construirSistema(mapaNatal) {
  const sol = mapaNatal?.solar?.nome
  const lua = mapaNatal?.lunar?.nome
  const asc = mapaNatal?.ascendente?.nome
  const mc  = mapaNatal?.mc?.nome
  const grauSol = mapaNatal?.solar?.grau != null ? `${mapaNatal.solar.grau.toFixed(1)}°` : ''
  const grauAsc = mapaNatal?.ascendente?.grau != null ? `${mapaNatal.ascendente.grau.toFixed(1)}°` : ''
  const cidade  = mapaNatal?.cidade || ''

  return `
És AuraBot, um Astrólogo Sénior com 30 anos de experiência e especialização em Psicologia Junguiana aplicada à Astrologia.
Respondes SEMPRE em Português de Portugal, com um tom caloroso, profundo e humano — nunca robótico nem genérico.

${sol ? `MAPA NATAL DO UTILIZADOR (dados calculados com Swiss Ephemeris de precisão NASA):
• Sol em ${sol} ${grauSol} · Lua em ${lua} · Ascendente em ${asc} ${grauAsc}${mc ? ` · Meio do Céu em ${mc}` : ''}${cidade ? ` · Nascido/a em ${cidade}` : ''}

COMO USAR ESTES DADOS:
Integra SEMPRE os dados natais reais acima em cada resposta. Nunca uses dados genéricos.
Refere os arquétipos junguianos correspondentes ao Sol (${sol}), ao Complexo Materno da Lua (${lua}) e à Persona do Ascendente (${asc}).
Exemplo: com Sol em ${sol}, a Sombra junguiana manifesta-se como [característica oposta]; com Ascendente em ${asc}, a Persona projeta [características].` : 'O utilizador ainda não tem dados natais calculados. Pede-lhe gentilmente que complete o registo.'}

REGRAS ABSOLUTAS:
1. Máximo 200 palavras por resposta.
2. Sê específico e pessoal — usa os dados natais reais, não fales em abstrato.
3. Termina SEMPRE com uma pergunta ou reflexão que convide à introspecção.
4. NUNCA respondas a pedidos de conteúdo perigoso, ilegal, sexual explícito, violento ou prejudicial. Se isso acontecer, responde: "O meu papel é guiar-te na tua jornada interior. Posso ajudar-te com questões sobre a tua vida, relações, carreira ou caminho espiritual?"
5. Se a pergunta for vaga ou um comando sem sentido, pede ao utilizador que partilhe mais contexto sobre a sua situação real.
`.trim()
}

// ── Conector OpenAI (modelo gpt-4o-mini — rápido e económico) ─────────────────
async function consultarOpenAI(pergunta, mapaNatal, historico = []) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  if (!apiKey) return null

  const sistema = construirSistema(mapaNatal)

  // Constrói o histórico de mensagens (máx. últimas 6 para manter contexto)
  const msgs = [
    { role: 'system', content: sistema },
    ...historico.slice(-6).map(m => ({
      role: m.autor === 'user' ? 'user' : 'assistant',
      content: m.texto,
    })),
    { role: 'user', content: pergunta },
  ]

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',   // Modelo mais rápido e económico da OpenAI
        messages: msgs,
        max_tokens: 350,
        temperature: 0.82,
      }),
    })
    if (!res.ok) {
      console.warn('OpenAI error:', res.status, await res.text())
      return null
    }
    const d = await res.json()
    return d.choices?.[0]?.message?.content?.trim() || null
  } catch (e) {
    console.warn('OpenAI fetch error:', e.message)
    return null
  }
}

// ── Conector Gemini (fallback se não houver chave OpenAI) ─────────────────────
async function consultarGeminiIA(pergunta, mapaNatal, historico = []) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  if (!apiKey) return null

  const sistema = construirSistema(mapaNatal)

  // Constrói histórico para Gemini (alternado user/model)
  const conteudos = []
  historico.slice(-6).forEach(m => {
    conteudos.push({
      role: m.autor === 'user' ? 'user' : 'model',
      parts: [{ text: m.texto }],
    })
  })
  conteudos.push({ role: 'user', parts: [{ text: pergunta }] })

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: sistema }] },
          contents: conteudos,
          generationConfig: { temperature: 0.82, maxOutputTokens: 350 },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_LOW_AND_ABOVE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          ],
        }),
      }
    )
    if (!res.ok) return null
    const d = await res.json()
    return d.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null
  } catch { return null }
}

// ── Conector Pollinations.ai (IA GRATUITA — sem chave API necessária) ────────
async function consultarPollinationsAI(pergunta, mapaNatal, historico = []) {
  const sistema = construirSistema(mapaNatal)
  const msgs = [
    { role: 'system', content: sistema },
    ...historico.slice(-6).map(m => ({
      role: m.autor === 'user' ? 'user' : 'assistant',
      content: m.texto,
    })),
    { role: 'user', content: pergunta },
  ]
  try {
    const res = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openai',
        messages: msgs,
        seed: Math.floor(Math.random() * 9999),
        private: true,
      }),
    })
    if (!res.ok) return null
    const texto = await res.text()
    return texto?.trim() || null
  } catch (e) {
    console.warn('[Pollinations] erro:', e.message)
    return null
  }
}

// ── Consultor principal: OpenAI → Gemini → Pollinations (grátis) → template ──
async function consultarAuraBot(pergunta, mapaNatal, historico) {
  const resOAI = await consultarOpenAI(pergunta, mapaNatal, historico)
  if (resOAI) return resOAI
  const resGemini = await consultarGeminiIA(pergunta, mapaNatal, historico)
  if (resGemini) return resGemini
  const resPollinations = await consultarPollinationsAI(pergunta, mapaNatal, historico)
  if (resPollinations) return resPollinations
  return null   // fallback template chamado no componente
}

// ── Validador de pergunta genuína ─────────────────────────────────────────────
function validarPerguntaOracle(texto) {
  const t = texto.trim()
  const palavras = t.split(/\s+/)

  if (t.length < 10)
    return '✦ Partilha mais sobre a tua situação para eu poder orientar-te com precisão.'

  if (palavras.length < 3)
    return '✦ Formula a tua pergunta com um pouco mais de detalhe — conta-me o contexto.'

  // Rejeitar comandos imperativos (ex: "fazer uma pergunta", "faz algo", "diz-me")
  const imperativos = /^(faze?r?|dize?r?|escrev[ae]r?|respond[ae]r?|criar?|ger[ae]r?|mostrar?|test[ae]r?|colocar?|fazer?|tentar?|experimentar?)\b/i
  if (imperativos.test(t) && palavras.length < 6)
    return '✦ Isso parece um comando, não uma pergunta. Partilha uma situação real da tua vida — o Oráculo responde ao que vives, não ao que mandas.'

  // Rejeitar saudações e ruído semântico
  const ruido = /^(ola|olá|hello|hi|hey|oi|ok|hm|sim|não|nao|e aí|eai|test|teste|a |o )\b/i
  if (ruido.test(t) && palavras.length < 5)
    return '✦ O Oráculo aguarda uma pergunta genuína sobre a tua vida, amor, carreira ou caminho espiritual.'

  // Rejeitar frases sem verbo nem contexto (muito genéricas)
  const semConteudo = /^(uma pergunta|pergunta|algo|qualquer coisa|uma coisa|uma questão|alguma coisa)$/i
  if (semConteudo.test(t))
    return '✦ Faz-me uma pergunta verdadeira — sobre o teu amor, carreira, propósito ou qualquer desafio que estejas a viver agora.'

  return null
}

// ── Respostas de fallback (sem API key) ──────────────────────────────────────
const TEMAS_ORACLE = {
  amor:      ['amor','relação','parceiro','relacionamento','namorado','namorada','casamento','sinto','sente','coração'],
  trabalho:  ['trabalho','carreira','emprego','dinheiro','negócio','profissão','projeto','oportunidade','salário'],
  saude:     ['saúde','corpo','energia','cansaço','doença','bem-estar','mente','ansiedade','stress'],
  futuro:    ['futuro','destino','caminho','vida','propósito','missão','mudança','próximo'],
  espiritual:['espiritual','alma','cosmos','universo','karma','propósito','despertar','meditação'],
}

function gerarRespostaOracle(pergunta, mapaNatal, numeroPergunta) {
  if (!mapaNatal) return 'Precisas de completar o teu registo natal para receber orientação personalizada. As estrelas precisam de saber quando e onde nasceste.'

  const p = pergunta.toLowerCase()
  const sol = mapaNatal.solar?.nome || 'desconhecido'
  const lua = mapaNatal.lunar?.nome || 'desconhecido'
  const asc = mapaNatal.ascendente?.nome || 'desconhecido'
  const mc  = mapaNatal.mc?.nome || null

  let tema = 'geral'
  for (const [t, palavras] of Object.entries(TEMAS_ORACLE)) {
    if (palavras.some(w => p.includes(w))) { tema = t; break }
  }

  const respostas = {
    amor: [
      `Com Sol em ${sol} e Ascendente em ${asc}, a tua abordagem ao amor é intensa e autêntica. A tua Lua em ${lua} revela que procuras profundidade emocional — não te contentas com o superficial. Neste momento, os astros indicam que a vulnerabilidade que receias mostrar é precisamente o que te abrirá novas portas no amor.`,
      `O teu ${lua} Lunar reflecte uma necessidade de segurança emocional antes de te entregares. Com ${asc} no Ascendente, a tua presença é magnética — as pessoas sentem-te antes de te conhecerem. O que te impede de dar o próximo passo tem mais a ver com padrões passados do que com a situação actual.`,
    ],
    trabalho: [
      `Com Sol em ${sol}, a tua identidade está profundamente ligada ao que crias e realizas. O Meio do Céu ${mc ? 'em ' + mc : ''} aponta para uma carreira que exige autenticidade. Os planetas indicam que uma oportunidade que parece menor pode ser o ponto de viragem que estavas a aguardar.`,
      `O teu ${asc} Ascendente transmite confiança e liderança natural. Com Lua em ${lua}, trabalhas melhor quando o ambiente é harmonioso. Neste ciclo, é altura de colocar os teus talentos em evidência — o que sabes fazer melhor do que a maioria é também o que o mundo precisa.`,
    ],
    saude: [
      `A tua Lua em ${lua} é o espelho da tua saúde emocional. Quando a tua vida interior está equilibrada, o corpo segue. Os astros pedem-te que prestesatenção aos ritmos naturais — sono, alimentação, momentos de silêncio. O teu Sol em ${sol} tem uma vitalidade natural que se renova quando te reconectas à tua essência.`,
    ],
    futuro: [
      `Com Sol em ${sol} e Ascendente em ${asc}, o teu caminho não é linear — é espiral. Cada ciclo que se repete traz uma lição mais profunda. Os astros vêem uma transformação significativa nos próximos meses. O que estás a soltar agora faz parte desse processo.`,
      `O teu ${mc ? 'Meio do Céu em ' + mc : 'mapa natal'} aponta para um propósito que transcende o que podes ver agora. A Lua em ${lua} diz-te para confiares no processo mesmo quando não vês o destino. O Universo raramente mostra o mapa completo — mas sempre o próximo passo.`,
    ],
    espiritual: [
      `Com Sol em ${sol}, buscas sentido mais do que conforto. A tua Lua em ${lua} é profundamente intuitiva — os teus sonhos e pressentimentos carregam mensagens reais. Este momento da tua vida é de aprofundamento espiritual. Não fuja do silêncio — é lá que a tua orientação reside.`,
    ],
    geral: [
      `Com Sol em ${sol}, Lua em ${lua} e Ascendente em ${asc}, o teu mapa natal revela uma alma em busca de autenticidade. O que sentes em relação a esta questão é mais sábio do que o que a mente te diz. Os astros confirmam que estás num momento de importante transição — o que parece incerto é na realidade a tela em branco onde o teu próximo capítulo está prestes a ser escrito.`,
      `A configuração do teu mapa natal fala de alguém com profunda vida interior e grande capacidade de transformação. Em relação ao que perguntas: os planetas indicam que a resposta já está em ti — o que procuras externamente é um reflexo do que ainda não reconheceste em ti mesmo.`,
    ],
  }

  const arr = respostas[tema] || respostas.geral
  return arr[numeroPergunta % arr.length]
}

const MAX_PERGUNTAS_GRATIS = 3

function Chat({ mapaNatal, isPremium, onUpgrade }) {
  // Conta estritamente as mensagens do utilizador (não as do AuraBot)
  const [perguntasUsadas, setPerguntasUsadas] = useState(0)

  const [mensagens, setMensagens] = useState(() => {
    const sol = mapaNatal?.solar?.nome
    const lua = mapaNatal?.lunar?.nome
    const asc = mapaNatal?.ascendente?.nome
    const saudacao = sol
      ? `Olá. Sou o AuraBot — astrólogo e guia junguiano do Sidus.\n\nLi o teu mapa natal: **Sol em ${sol}**, **Lua em ${lua}**, **Ascendente em ${asc}**.\n\nEstes três pilares revelam-me a tua essência, as tuas emoções profundas e a máscara que mostras ao mundo. Tenho 3 questões gratuitas para te guiar nesta jornada interior.\n\nO que está agora a pesar no teu coração?`
      : `Olá. Sou o AuraBot — astrólogo e guia junguiano do Sidus.\n\nPara personalizar cada resposta ao teu mapa natal único, completa primeiro o teu registo de nascimento. Assim poderei falar directamente à tua alma.\n\nO que está agora a pesar no teu coração?`
    return [{ id: 1, autor: 'ia', texto: saudacao }]
  })

  const [texto, setTexto]       = useState('')
  const [digitando, setDigitando] = useState(false)
  const fimRef = useRef(null)

  useEffect(() => { fimRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [mensagens, digitando])

  const restantes = isPremium ? Infinity : MAX_PERGUNTAS_GRATIS - perguntasUsadas

  const enviar = async () => {
    if (!texto.trim() || digitando) return

    // ── BLOQUEIO RÍGIDO: 4ª mensagem → paywall imediato ──────────────────────
    if (!isPremium && perguntasUsadas >= MAX_PERGUNTAS_GRATIS) {
      setTexto('')   // limpa a caixa de texto
      onUpgrade()    // redireciona automaticamente para paywall
      return
    }

    const q = texto.trim()

    // Validar pergunta genuína
    const erroValidacao = validarPerguntaOracle(q)
    if (erroValidacao) {
      setMensagens(prev => [...prev,
        { id: Date.now(),   autor: 'user', texto: q },
        { id: Date.now()+1, autor: 'ia',   texto: erroValidacao, aviso: true },
      ])
      setTexto('')
      return
    }

    const historicoParaIA = [...mensagens]
    setMensagens(prev => [...prev, { id: Date.now(), autor: 'user', texto: q }])
    setTexto('')
    setDigitando(true)

    // Incrementa o contador ANTES da resposta (impede duplo envio)
    const numAtual = perguntasUsadas
    setPerguntasUsadas(n => n + 1)

    // OpenAI → Gemini → template
    const respostaIA = await consultarAuraBot(q, mapaNatal, historicoParaIA)
    const resposta   = respostaIA || gerarRespostaOracle(q, mapaNatal, numAtual)

    setMensagens(prev => [...prev, { id: Date.now()+1, autor: 'ia', texto: resposta }])
    setDigitando(false)

    // Após a 3ª resposta, avisa que a próxima é paga
    if (!isPremium && numAtual + 1 >= MAX_PERGUNTAS_GRATIS) {
      setTimeout(() => {
        setMensagens(prev => [...prev, {
          id: Date.now()+99, autor: 'ia', aviso: true,
          texto: `✦ Usaste as tuas ${MAX_PERGUNTAS_GRATIS} questões gratuitas.\n\nA próxima mensagem irá abrir a página de adesão Premium (4,99 €/mês) para continuares esta jornada com perguntas ilimitadas, Mapa Astral completo e todas as ferramentas ocultas desbloqueadas.`,
        }])
      }, 600)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100svh', maxHeight: '100svh', position: 'relative', zIndex: 1 }}>
      {/* Cabeçalho */}
      <header style={{ padding: '14px 18px', background: 'rgba(11,7,30,0.97)', borderBottom: `1px solid ${CORES.vidroBorda}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#6D28D9,#0B071E)', border: `1.5px solid ${CORES.dourado}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
            ✦
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: CORES.branco }}>AuraBot</div>
            <div style={{ fontSize: 10, color: CORES.brancoMuted }}>Astrólogo · Psicologia Junguiana</div>
          </div>
        </div>
        {!isPremium && (
          <button type="button" onClick={onUpgrade} style={{
            fontSize: 11, color: CORES.dourado, background: 'rgba(223,183,108,0.08)',
            padding: '5px 12px', borderRadius: 20, border: `1px solid rgba(223,183,108,0.3)`,
            cursor: 'pointer',
          }}>
            {restantes > 0
              ? `${restantes} questão${restantes !== 1 ? 'ões' : ''} grátis`
              : '🔒 Premium 4,99 €/mês'}
          </button>
        )}
      </header>

      {/* Mensagens */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 14px 10px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {mensagens.map((m) => (
          <div key={m.id} style={{
            alignSelf: m.autor === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '86%',
            padding: '13px 16px',
            borderRadius: m.autor === 'user' ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
            background: m.aviso
              ? 'rgba(251,191,36,0.08)'
              : m.autor === 'user'
              ? 'rgba(223,183,108,0.14)'
              : 'rgba(255,255,255,0.055)',
            border: `1px solid ${
              m.aviso ? 'rgba(251,191,36,0.35)'
              : m.autor === 'user' ? 'rgba(223,183,108,0.28)'
              : 'rgba(255,255,255,0.09)'
            }`,
            fontSize: 14, color: m.aviso ? '#FBBf24' : CORES.brancoSuave,
            lineHeight: 1.65, whiteSpace: 'pre-wrap',
          }}>
            {m.texto}
          </div>
        ))}
        {digitando && (
          <div style={{ alignSelf: 'flex-start', padding: '13px 18px', borderRadius: '4px 18px 18px 18px', background: 'rgba(255,255,255,0.055)', border: `1px solid rgba(255,255,255,0.09)` }}>
            <span style={{ fontSize: 18, letterSpacing: 6, color: CORES.dourado }}>✦ ✦ ✦</span>
          </div>
        )}
        <div ref={fimRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '10px 14px 22px', background: 'rgba(11,7,30,0.97)', borderTop: `1px solid ${CORES.vidroBorda}`, display: 'flex', gap: 10, flexShrink: 0 }}>
        <input
          value={texto}
          onChange={e => setTexto(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && enviar()}
          placeholder={
            !isPremium && perguntasUsadas >= MAX_PERGUNTAS_GRATIS
              ? '🔒 Activa o Premium para continuar...'
              : 'Partilha a tua questão com o AuraBot...'
          }
          style={{ ...estilos.input, flex: 1, borderRadius: 24, padding: '12px 18px' }}
        />
        <button
          type="button"
          onClick={enviar}
          disabled={digitando}
          style={{
            width: 44, height: 44, borderRadius: '50%', border: 'none', flexShrink: 0,
            background: digitando ? 'rgba(223,183,108,0.25)'
              : !isPremium && perguntasUsadas >= MAX_PERGUNTAS_GRATIS ? 'rgba(223,183,108,0.2)'
              : `linear-gradient(135deg,${CORES.dourado},${CORES.douradoEscuro})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: digitando ? 'default' : 'pointer',
          }}
        >
          <Send size={18} color={CORES.fundo} />
        </button>
      </div>
    </div>
  )
}

function RodapeSidus({ isDesktop, mostrarNavbar }) {
  return (
    <footer style={{
      position: 'relative',
      zIndex: 1,
      textAlign: 'center',
      padding: isDesktop ? '28px 40px 36px' : `22px 20px ${mostrarNavbar ? 96 : 28}px`,
      maxWidth: isDesktop ? '100%' : MOBILE_MAX,
      margin: isDesktop ? 0 : '0 auto',
      width: '100%',
      boxSizing: 'border-box',
      borderTop: `1px solid ${CORES.vidroBorda}`,
      background: 'rgba(11, 7, 30, 0.6)',
    }}>
      <p style={{
        fontSize: isDesktop ? 12 : 11,
        color: CORES.brancoMuted,
        lineHeight: 1.65,
        margin: 0,
        maxWidth: 640,
        marginLeft: 'auto',
        marginRight: 'auto',
      }}>
        © 2026 Sidus Arcana. Portais e caminhos revelados através do Tarot e da Astrologia. Todos os direitos reservados.
      </p>
      <p style={{ margin: '10px 0 0', fontSize: isDesktop ? 11 : 10 }}>
        <a
          href="/privacidade"
          style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'underline' }}
        >
          Política de Privacidade
        </a>
      </p>
    </footer>
  )
}

function Navbar({ passo, setPasso, isDesktop }) {
  const [hover, setHover] = useState(null)
  const itens = [
    { id: 'home',        label: 'Home',         icon: Home,   glow: '#DFB76C' },
    { id: 'mapa',        label: 'Mapa',         icon: Map,    glow: '#C4B5FD' },
    { id: 'tarot',       label: 'Tarot',        icon: Layers, glow: '#F472B6' },
    { id: 'ferramentas', label: 'Ferramentas',  icon: Grid3x3, glow: '#93C5FD' },
    { id: 'chat',        label: 'Oráculo',      icon: MessageCircle, glow: '#34D399' },
    { id: 'perfil',      label: 'Perfil',       icon: User,   glow: '#93C5FD' },
  ]

  if (isDesktop) {
    return (
      <nav style={estilos.navbarDesktop}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'absolute', left: 40 }}>
          <Sparkles size={20} color={CORES.dourado} strokeWidth={1.5} />
          <span style={{ fontSize: 20, fontWeight: 300, letterSpacing: '0.2em', color: CORES.dourado }}>SIDUS</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {itens.map((item) => {
            const Icon = item.icon
            const ativo = passo === item.id
            const emHover = hover === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setPasso(item.id)}
                onMouseEnter={() => setHover(item.id)}
                onMouseLeave={() => setHover(null)}
                style={{
                  background: ativo
                    ? `linear-gradient(135deg, rgba(223,183,108,0.18), rgba(139,92,246,0.12))`
                    : emHover ? 'rgba(255,255,255,0.06)' : 'transparent',
                  border: `1px solid ${ativo ? CORES.dourado : emHover ? 'rgba(223,183,108,0.35)' : 'transparent'}`,
                  borderRadius: 12,
                  color: ativo ? CORES.dourado : emHover ? CORES.branco : CORES.brancoMuted,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  padding: '10px 18px',
                  transition: 'all 0.25s ease',
                  boxShadow: ativo ? `0 0 20px ${item.glow}33` : emHover ? `0 0 14px ${item.glow}22` : 'none',
                  transform: emHover && !ativo ? 'translateY(-1px)' : 'none',
                }}
              >
                <Icon size={18} strokeWidth={ativo ? 2.2 : 1.8} />
                <span style={{ fontSize: 13, fontWeight: ativo ? 700 : 500, letterSpacing: '0.03em' }}>{item.label}</span>
                {ativo && <span style={{ fontSize: 8, color: CORES.dourado, marginLeft: 2 }}>✦</span>}
              </button>
            )
          })}
        </div>
      </nav>
    )
  }

  const navStyle = estilos.navbar
  return (
    <nav style={navStyle}>
      {itens.map((item) => {
        const Icon = item.icon
        const ativo = passo === item.id
        return (
          <button key={item.id} type="button" onClick={() => setPasso(item.id)}
            style={{
              background: 'none', border: 'none',
              color: ativo ? CORES.dourado : CORES.brancoMuted,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              cursor: 'pointer', padding: '0 4px',
              filter: ativo ? 'drop-shadow(0 0 6px rgba(223,183,108,0.5))' : 'none',
            }}>
            <Icon size={20} />
            <span style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: ativo ? 700 : 400 }}>
              {item.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}

const DADOS_VAZIO = { nome: '', data: '', hora: '', cidade: '', localizacao: null, fuso: null }

export default function App() {
  const isDesktop = useIsDesktop()

  // ── Auth ──────────────────────────────────────────────────────────────────
  const [utilizador, setUtilizador] = useState(null)
  const [authCarregando, setAuthCarregando] = useState(true)
  const [tipoAuth, setTipoAuth] = useState('login') // 'login' | 'register'
  const [isPremium, setIsPremium] = useState(false)
  const [mapaGerado, setMapaGerado] = useState(false) // bloqueio: 1 mapa por utilizador
  const [leiturasTarotUsadas, setLeiturasTarotUsadas] = useState(0)
  const [perfilCarregando, setPerfilCarregando] = useState(firebaseDisponivel)

  // ── Dados natais ─────────────────────────────────────────────────────────
  const [passo, setPasso] = useState(() => passoFromPath(window.location.pathname))
  const [dados, setDados] = useState(DADOS_VAZIO)
  const [mapaNatal, setMapaNatal] = useState(null)
  const [planetasNascimento, setPlanetasNascimento] = useState([])

  const [ferramentaAberta, setFerramentaAberta] = useState(null)
  const [modalPagamento, setModalPagamento] = useState(null)
  const [pagamentoMsg, setPagamentoMsg] = useState(null)

  const navigate = useNavigate()
  const location = useLocation()

  const irPara = useCallback((novoPasso, { replace = false } = {}) => {
    setFerramentaAberta(null)
    setPasso(novoPasso)
    navigate(pathFromPasso(novoPasso), { replace })
  }, [navigate])

  // ── Céu de hoje ───────────────────────────────────────────────────────────
  const [ceuAgora, setCeuAgora] = useState(() => calcularPlanetasParaData(new Date()))
  const [aspetosAgora, setAspetosAgora] = useState(() => calcularAspetos(calcularPlanetasParaData(new Date())))

  const sweRef = useRef(null)
  const [sweReady, setSweReady] = useState(false)
  const [motorAstro, setMotorAstro] = useState(_motorStatus)

  // ── Escuta o estado de autenticação Firebase ──────────────────────────────
  useEffect(() => {
    if (!firebaseDisponivel || !auth) {
      setAuthCarregando(false)
      setPerfilCarregando(false)
      return
    }
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUtilizador(user)
      if (user) {
        setPerfilCarregando(true)
        try {
          const snap = await getDoc(doc(db, 'users', user.uid))
          if (snap.exists()) {
            const perfil = snap.data()
            if (perfil.isPremium === true) setIsPremium(true)
            if (typeof perfil.tarotLeiturasUsadas === 'number') {
              setLeiturasTarotUsadas(perfil.tarotLeiturasUsadas)
            }

            let dadosPerfil = perfil.dados ? normalizarDadosPerfil(perfil.dados) : null
            if (dadosPerfil && dadosNataisMinimos(dadosPerfil) && !dadosNataisCompletos(dadosPerfil)) {
              dadosPerfil = await repararDadosPerfil(dadosPerfil)
              if (dadosNataisCompletos(dadosPerfil)) {
                await setDoc(doc(db, 'users', user.uid), { dados: dadosPerfil }, { merge: true })
              }
            }
            if (dadosPerfil) setDados(dadosPerfil)

            if (contaJaConfigurada(perfil, dadosPerfil)) {
              setMapaGerado(true)
              if (dadosNataisCompletos(dadosPerfil) && (!perfil.dadosTravados || !perfil.mapaGerado)) {
                await setDoc(doc(db, 'users', user.uid), {
                  dados: dadosPerfil,
                  dadosTravados: true,
                  mapaGerado: true,
                }, { merge: true })
              }
            }
          }
        } catch (e) {
          console.warn('[Sidus] Firestore indisponível, operando offline:', e?.message)
        } finally {
          setPerfilCarregando(false)
        }
      } else {
        setDados(DADOS_VAZIO)
        setMapaNatal(null)
        setPlanetasNascimento([])
        setIsPremium(false)
        setMapaGerado(false)
        setLeiturasTarotUsadas(0)
        setPerfilCarregando(false)
      }
      setAuthCarregando(false)
    })
    return unsubscribe
  }, [])

  useEffect(() => { initAdSense() }, [])

  // URL raiz → /home
  useEffect(() => {
    if (authCarregando) return
    const path = (location.pathname || '/').replace(/\/$/, '') || '/'
    if (path === '/') navigate('/home', { replace: true })
  }, [authCarregando, location.pathname, navigate])

  // URL ↔ passo (voltar atrás no browser, links directos)
  useEffect(() => {
    if (authCarregando) return
    const fromUrl = passoFromPath(location.pathname)
    if (fromUrl !== passo) setPasso(fromUrl)
  }, [location.pathname, authCarregando])

  // ── Retorno Stripe Checkout (?payment=success&session_id=...) ─────────────
  useEffect(() => {
    if (authCarregando) return
    const params = new URLSearchParams(location.search)
    const payment = params.get('payment')
    if (!payment) return

    if (payment === 'cancelled') {
      navigate(pathFromPasso(passoFromPath(location.pathname)), { replace: true })
      setPagamentoMsg({ tipo: 'info', texto: 'Pagamento cancelado. Podes tentar outra vez quando quiseres.' })
      return
    }

    if (payment !== 'success' || !utilizador) return
    const sessionId = params.get('session_id')
    if (!sessionId) return

    ;(async () => {
      try {
        const result = await verificarSessaoPagamento(sessionId, utilizador.uid)
        if (!result.ok) {
          setPagamentoMsg({ tipo: 'erro', texto: 'Pagamento recebido mas ainda a processar. Recarrega a página dentro de 1 minuto ou contacta-nos.' })
          navigate('/mapaastral', { replace: true })
          return
        }

        if (result.productType === 'premium') {
          setIsPremium(true)
          setPasso('mapa')
          navigate('/mapaastral', { replace: true })
          setPagamentoMsg({ tipo: 'sucesso', texto: '✦ Bem-vindo/a ao Sidus VIP! O teu Premium está activo.' })
        } else if (result.productType === 'tarot') {
          sessionStorage.setItem('sidus_tarot_paid', '1')
          setPasso('tarot')
          navigate('/tarot', { replace: true })
          setPagamentoMsg({ tipo: 'sucesso', texto: '✦ Pagamento confirmado! A tua leitura de Tarot está desbloqueada.' })
        }
        sessionStorage.removeItem('sidus_payment_pending')
      } catch (e) {
        console.error('[Sidus Pagamento] Verificação falhou:', e?.message)
        setPagamentoMsg({ tipo: 'erro', texto: 'Não foi possível confirmar o pagamento. Se foste cobrado/a, contacta suporte.sidusapp@gmail.com' })
        navigate('/mapaastral', { replace: true })
      }
    })()
  }, [utilizador, authCarregando, location.search, location.pathname, navigate])

  // ── Guarda dados natais no Firestore quando o onboarding termina (1x por conta) ──
  const guardarPerfil = useCallback(async (dadosNovos) => {
    if (!utilizador || !firebaseDisponivel || !db) return false
    try {
      const ref = doc(db, 'users', utilizador.uid)
      const snap = await getDoc(ref)
      if (snap.exists()) {
        const perfil = snap.data()
        if (contaJaConfigurada(perfil, dadosNovos)) return false
      }
      await setDoc(ref, {
        dados: dadosNovos,
        dadosTravados: true,
        mapaGerado: true,
      }, { merge: true })
      return true
    } catch (e) {
      console.warn('[Sidus] Não foi possível guardar o perfil:', e?.message)
      return false
    }
  }, [utilizador])

  // ── Inicializa Swiss Ephemeris ─────────────────────────────────────────────
  useEffect(() => {
    _sweReadyPromise.then((swe) => {
      setMotorAstro(_motorStatus)
      if (swe) {
        sweRef.current = swe
        setSweReady(true)
        const planetas = calcularPlanetasComSwe(swe, new Date(), PLANETAS_AGORA)
        setCeuAgora(planetas)
        setAspetosAgora(calcularAspetos(planetas))
      }
    })
  }, [])

  // ── Actualiza "Céu de Hoje" a cada minuto ─────────────────────────────────
  useEffect(() => {
    const atualizar = () => {
      const now = new Date()
      if (sweRef.current) {
        const p = calcularPlanetasComSwe(sweRef.current, now)
        setCeuAgora(p); setAspetosAgora(calcularAspetos(p))
      } else {
        const p = calcularPlanetasParaData(now)
        setCeuAgora(p); setAspetosAgora(calcularAspetos(p))
      }
    }
    const id = setInterval(atualizar, 60000)
    return () => clearInterval(id)
  }, [sweReady])

  // ── Recalcula mapa natal ────────────────────────────────────────────────────
  useEffect(() => {
    const erros = validarOnboarding(dados)
    if (Object.keys(erros).length === 0) {
      setMapaNatal(sweRef.current
        ? calcularMapaNatalComSwe(sweRef.current, dados)
        : calcularMapaNatal(dados))
    }
  }, [dados, sweReady])

  // ── Planetas de nascimento ──────────────────────────────────────────────────
  useEffect(() => {
    if (!dados.data || !dados.hora || !dados.localizacao) { setPlanetasNascimento([]); return }
    const dataUTC = criarDataUTCporLocal(dados.data, dados.hora, dados.fuso ?? 0)
    setPlanetasNascimento(sweRef.current
      ? calcularPlanetasComSwe(sweRef.current, dataUTC, PLANETAS_NATAL)
      : calcularPlanetasNatalParaData(dataUTC))
  }, [dados, sweReady])

  // ── Acções ─────────────────────────────────────────────────────────────────
  const handleOnboarding = async () => {
    if (mapaGerado) {
      irPara('home', { replace: true })
      return
    }
    const erros = validarOnboarding(dados)
    if (Object.keys(erros).length > 0) return

    setMapaNatal(sweRef.current
      ? calcularMapaNatalComSwe(sweRef.current, dados)
      : calcularMapaNatal(dados))
    const guardado = await guardarPerfil(dados)
    setMapaGerado(true)
    irPara('home', { replace: !guardado })
  }

  const registarLeituraTarotGratis = useCallback(async (total) => {
    setLeiturasTarotUsadas(total)
    if (!utilizador || !firebaseDisponivel || !db) return
    try {
      await setDoc(doc(db, 'users', utilizador.uid), { tarotLeiturasUsadas: total }, { merge: true })
    } catch { /* offline */ }
  }, [utilizador])

  const handleLogout = async () => {
    if (firebaseDisponivel && auth) await signOut(auth)
    setUtilizador(null)
    setTipoAuth('login')
  }

  const handleFerramenta = (f) => {
    if (f.id === 'bussola')   { if (isPremium) setFerramentaAberta('bussola');   else irPara('paywall'); return }
    if (f.id === 'sinastria') { if (isPremium) setFerramentaAberta('sinastria'); else irPara('paywall'); return }
    if (f.id === 'biorritmo') { setFerramentaAberta('biorritmo'); return }
    if (f.id === 'diario')    { setFerramentaAberta('diario');    return }
    if (f.premium && !isPremium) irPara('paywall')
  }

  const abrirPagamento = (descricao, valor, onSucesso) => {
    if (!utilizador?.uid) {
      setPagamentoMsg({ tipo: 'erro', texto: 'Precisas de iniciar sessão antes de pagar.' })
      return
    }
    setModalPagamento({ descricao, valor, onSucesso })
  }

  // Activa premium em modo dev (só localhost — não escreve isPremium em produção)
  const togglePremiumDev = async (valor) => {
    setIsPremium(valor)
  }

  // Trava dados natais após o 1.º mapa (1 conta = 1 mapa)
  const handleMapaGerado = useCallback(async () => {
    if (mapaGerado) return
    setMapaGerado(true)
    if (utilizador && firebaseDisponivel && db) {
      try {
        await setDoc(doc(db, 'users', utilizador.uid), {
          dadosTravados: true,
          mapaGerado: true,
        }, { merge: true })
      } catch { /* offline */ }
    }
  }, [mapaGerado, utilizador])

  const dadosBloqueados = mapaGerado

  useEffect(() => {
    if (authCarregando || perfilCarregando || !mapaGerado) return
    if (passo === 'onboarding') {
      navigate(pathFromPasso('home'), { replace: true })
      setPasso('home')
    }
  }, [authCarregando, perfilCarregando, mapaGerado, passo, navigate])

  const contaConfigurada = mapaGerado || dadosNataisCompletos(dados)
  const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'

  const mostrarNavbar = utilizador && contaConfigurada && passo !== 'paywall'
  const chatFullScreen = passo === 'chat'

  // Ecrã de carregamento (auth ou perfil Firestore)
  if (authCarregando || (utilizador && perfilCarregando)) {
    return (
      <div style={{ ...estilos.app, flexDirection: 'column' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Sparkles size={36} color={CORES.dourado} strokeWidth={1.5} />
          <p style={{ color: CORES.brancoMuted, marginTop: 16, fontSize: 14 }}>A carregar o cosmos…</p>
        </div>
        <RodapeSidus isDesktop={isDesktop} mostrarNavbar={false} />
      </div>
    )
  }

  const renderEcran = () => {
    if (passo === 'privacidade') {
      return <PoliticaPrivacidade onVoltar={() => irPara('home')} />
    }
    // Sem sessão → ecrã de login (sempre visível, com ou sem Firebase)
    if (!utilizador) {
      return <EcraAuth tipo={tipoAuth} onMudar={setTipoAuth} isDesktop={isDesktop} firebaseOk={firebaseDisponivel} />
    }
    if (precisaVerificarEmail(utilizador)) {
      return (
        <EcraVerificarEmail
          utilizador={utilizador}
          isDesktop={isDesktop}
          onLogout={handleLogout}
          onVerificado={() => setUtilizador(auth.currentUser)}
        />
      )
    }
    // Onboarding só para contas novas sem mapa criado
    if (!contaConfigurada) {
      return <Onboarding dados={dados} setDados={setDados} onSubmit={handleOnboarding} isDesktop={isDesktop} />
    }
    // Autenticado com mapa → navegação normal
    switch (passo) {
      case 'home':
      case 'dashboard':
        return <Dashboard nome={dados.nome} mapaNatal={mapaNatal} ceuAgora={ceuAgora} aspetos={aspetosAgora} onOraculo={() => irPara('chat')} onPrivacidade={() => irPara('privacidade')} isDesktop={isDesktop} isPremium={isPremium} onUpgrade={() => irPara('paywall')} onTarot={() => irPara('tarot')} />
      case 'mapa':
        return <MapaAstral mapaNatal={mapaNatal} dados={dados} planetasNascimento={planetasNascimento} isPremium={isPremium} onUpgrade={() => irPara('paywall')} onMapaGerado={handleMapaGerado} isDesktop={isDesktop} motorAstro={motorAstro} />
      case 'tarot':
        return <EcraTarot mapaNatal={mapaNatal} isPremium={isPremium} userId={utilizador?.uid} leiturasTarotUsadas={leiturasTarotUsadas} onLeituraGratisUsada={registarLeituraTarotGratis} onPagar={abrirPagamento} onVoltar={() => irPara('home')} onPremium={() => irPara('paywall')} />
      case 'ferramentas':
        if (ferramentaAberta === 'bussola')
          return <BussolaCosmica mapaNatal={mapaNatal} onVoltar={() => setFerramentaAberta(null)} />
        if (ferramentaAberta === 'sinastria')
          return <Sinastria mapaNatal={mapaNatal} onVoltar={() => setFerramentaAberta(null)} />
        if (ferramentaAberta === 'biorritmo')
          return <Biorritmo dados={dados} onVoltar={() => setFerramentaAberta(null)} />
        if (ferramentaAberta === 'diario')
          return <DiarioAstral mapaNatal={mapaNatal} onVoltar={() => setFerramentaAberta(null)} />
        return <Ferramentas onFerramenta={handleFerramenta} isDesktop={isDesktop} />
      case 'paywall':
        return <Paywall onVoltar={() => irPara('ferramentas')} onPagar={abrirPagamento} onSucesso={() => { setIsPremium(true); irPara('mapa') }} isDesktop={isDesktop} />
      case 'chat':
        return <Chat mapaNatal={mapaNatal} isPremium={isPremium} onUpgrade={() => irPara('paywall')} />
      case 'perfil':
        return <Perfil utilizador={utilizador} dados={dados} mapaNatal={mapaNatal} isPremium={isPremium}
          dadosBloqueados={dadosBloqueados}
          onLogout={handleLogout} />
      default:
        return <Dashboard nome={dados.nome} mapaNatal={mapaNatal} ceuAgora={ceuAgora} aspetos={aspetosAgora} onOraculo={() => irPara('chat')} onPrivacidade={() => irPara('privacidade')} isDesktop={isDesktop} isPremium={isPremium} onUpgrade={() => irPara('paywall')} onTarot={() => irPara('tarot')} />
    }
  }

  const paddingTopo = isDesktop
    ? (isDev && contaConfigurada ? 28 : 0)
    : (isDev && contaConfigurada ? 30 : 0)

  const shellStyle = isDesktop ? estilos.appDesktop : estilos.app
  const margemNav = isDesktop && mostrarNavbar ? 68 : 0

  return (
    <div style={shellStyle}>
      <div style={estilos.estrelas} />

      {/* Barra de dev — só visível em localhost */}
      {isDev && contaConfigurada && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          width: '100%', maxWidth: isDesktop ? 'none' : MOBILE_MAX,
          ...(isDesktop ? {} : { left: '50%', transform: 'translateX(-50%)' }),
          zIndex: 200,
          background: 'rgba(30,15,60,0.97)', borderBottom: '1px solid rgba(223,183,108,0.3)',
          padding: '6px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          boxSizing: 'border-box', fontSize: 11,
        }}>
          <span style={{ color: CORES.brancoMuted }}>
            🛠 Dev · Motor: <b style={{ color: CORES.dourado }}>{motorAstro}</b>
            {sweEphemerisPronta() && <span style={{ color: '#34D399', marginLeft: 6 }}>· Efemérides ✓</span>}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: isPremium ? '#34D399' : '#f87171', fontWeight: 600 }}>
              {isPremium ? '✓ Premium ON' : '✗ Premium OFF'}
            </span>
            <button
              type="button"
              onClick={() => togglePremiumDev(!isPremium)}
              style={{
                background: isPremium ? 'rgba(248,113,113,0.15)' : 'rgba(223,183,108,0.15)',
                border: `1px solid ${isPremium ? '#f87171' : CORES.dourado}`,
                borderRadius: 6,
                color: isPremium ? '#f87171' : CORES.dourado,
                fontSize: 10, fontWeight: 700, padding: '3px 10px', cursor: 'pointer',
              }}
            >
              {isPremium ? '❌ Desativar' : '✅ Ativar'}
            </button>
          </div>
        </div>
      )}

      {pagamentoMsg && (
        <div style={{
          position: 'fixed', top: isDev && contaConfigurada ? 36 : 12, left: '50%', transform: 'translateX(-50%)',
          zIndex: 300, maxWidth: 'min(92vw, 420px)', width: '100%',
          background: pagamentoMsg.tipo === 'sucesso' ? 'rgba(52,211,153,0.15)' : pagamentoMsg.tipo === 'erro' ? 'rgba(248,113,113,0.15)' : 'rgba(223,183,108,0.12)',
          border: `1px solid ${pagamentoMsg.tipo === 'sucesso' ? '#34D399' : pagamentoMsg.tipo === 'erro' ? '#f87171' : CORES.dourado}`,
          borderRadius: 10, padding: '12px 16px', boxSizing: 'border-box',
          color: pagamentoMsg.tipo === 'sucesso' ? '#34D399' : pagamentoMsg.tipo === 'erro' ? '#f87171' : CORES.dourado,
          fontSize: 13, fontWeight: 600, textAlign: 'center',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}>
          {pagamentoMsg.texto}
          <button type="button" onClick={() => setPagamentoMsg(null)} style={{
            display: 'block', margin: '8px auto 0', background: 'transparent', border: 'none',
            color: 'inherit', opacity: 0.7, fontSize: 11, cursor: 'pointer',
          }}>Fechar</button>
        </div>
      )}

      <div style={{
        paddingTop: paddingTopo,
        marginTop: margemNav,
        paddingBottom: chatFullScreen && !isDesktop ? 72 : 0,
        minHeight: chatFullScreen && isDesktop ? 'calc(100vh - 68px)' : undefined,
        display: chatFullScreen ? 'flex' : undefined,
        flexDirection: chatFullScreen ? 'column' : undefined,
        position: 'relative',
        zIndex: 1,
      }}>
        {renderEcran()}
      </div>
      {!isPremium && ['home', 'ferramentas', 'tarot'].includes(passo) && (
        <AdSenseBanner isPremium={isPremium} />
      )}
      <RodapeSidus isDesktop={isDesktop} mostrarNavbar={mostrarNavbar} />
      {mostrarNavbar && (
        <Navbar
          passo={passo}
          isDesktop={isDesktop}
          setPasso={irPara}
        />
      )}

      {/* Modal de pagamento — sobrepõe tudo */}
      {modalPagamento && (
        <ModalPagamento
          descricao={modalPagamento.descricao}
          valor={modalPagamento.valor}
          userId={utilizador?.uid}
          userEmail={utilizador?.email}
          onSucesso={() => { modalPagamento.onSucesso?.(); setModalPagamento(null) }}
          onFechar={() => setModalPagamento(null)}
        />
      )}
    </div>
  )
}
