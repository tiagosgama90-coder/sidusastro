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
  Menu,
  X,
} from 'lucide-react'
import { Body, GeoVector, Ecliptic, MakeTime, SiderealTime } from 'astronomy-engine'
import { pesquisarCidades, pesquisarFusoHorario, geocodificarCidade } from './lib/geocoding'
import { EcraTarot } from './components/Tarot'
import { ModalPagamento, verificarSessaoPagamento } from './components/Pagamento'
import { PRECO_MAPA_COMPLETO, PRECO_PREMIUM_MENSAL } from './lib/pricing.js'
import { RecaptchaCheckbox } from './components/Recaptcha'
import { Perfil } from './components/Perfil'
import { PoliticaPrivacidade } from './components/PoliticaPrivacidade'
import { InterpretacaoMapa } from './components/InterpretacaoMapa'
import { BussolaCosmica, Sinastria, Biorritmo, DiarioAstral, Numerologia, InterpretacaoSonhos, HorasIguais } from './components/FerramentasPremium'
import { ConteudoDinamicoSidus } from './components/ConteudoDinamicoSidus'
import { auth, db, firebaseDisponivel } from './lib/firebase'
import { enviarEmailVerificacao, traduzirErroEmail } from './lib/authEmail'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  reload,
  applyActionCode,
} from 'firebase/auth'
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore'
import { normalizarCusps, cuspsEqualHouse, atribuirCasasPlanetas } from './lib/casasPlacidus.js'
import { gerarAnaliseCompleta, gerarResumoGratuito } from './lib/mapaInterpretacao.js'
import { calcularFaseLua } from './lib/faseLua.js'
import { useNavigate, useLocation } from 'react-router-dom'
import { passoFromPath, pathFromPasso, langFromPath } from './lib/routes.js'
import { initAdSense } from './lib/adsense.js'
import { AdSenseBanner } from './components/AdSenseBanner.jsx'
import { LanguageSwitcher } from './components/LanguageSwitcher.jsx'
import { useLanguage } from './lib/i18n/LanguageContext.jsx'
import { getFerramentas, getBeneficiosVip } from './lib/i18n/ferramentasData.js'
import { validarOnboarding } from './lib/i18n/validation.js'
import { traduzirErroAuth } from './lib/i18n/authErrors.js'
import {
  validarPerguntaOracle, gerarRespostaOracle,
  getChatGreeting, getOracleLimitMessage,
} from './lib/i18n/oracle.js'
import { consultarOracleServidor } from './lib/apiAi.js'
import { localizeArcano } from './lib/i18n/tarotArcana.js'
import { normalizarDataISO } from './lib/datetime.js'
import { utilizadorTemPremium, emailTemPremiumPrivilegiado } from './lib/premiumAccess.js'
import {
  MAX_ORACLE_GRATIS, oraclePerguntasUsadas, sincronizarOraclePerguntas, oracleRestantes,
} from './lib/oracleLimit.js'

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

const _SWE_INIT_TIMEOUT_MS = 15000

const _sweReadyPromise = (async () => {
  try {
    const mod = await import('@swisseph/browser')
    const SweClass = mod.default || mod.SwissEphemeris
    if (typeof SweClass !== 'function') throw new Error('SwissEphemeris class not found')
    const swe = new SweClass()

    const initPromise = swe.init()
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Swiss Ephemeris init timeout')), _SWE_INIT_TIMEOUT_MS)
    })
    await Promise.race([initPromise, timeoutPromise])

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
    paddingBottom: 40,
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
  navbarMobileTop: {
    position: 'fixed',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: MOBILE_MAX,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 14px',
    paddingTop: 'max(10px, env(safe-area-inset-top, 10px))',
    background: 'rgba(11, 7, 30, 0.96)',
    backdropFilter: 'blur(20px)',
    borderBottom: `1px solid ${CORES.vidroBorda}`,
    zIndex: 150,
    boxSizing: 'border-box',
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
  navbarDesktopTop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    transform: 'none',
    width: '100%',
    maxWidth: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 28px',
    paddingTop: 'max(12px, env(safe-area-inset-top, 12px))',
    background: 'rgba(11, 7, 30, 0.96)',
    backdropFilter: 'blur(20px)',
    borderBottom: `1px solid ${CORES.vidroBorda}`,
    zIndex: 150,
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
 * Ascendente e MC via SiderealTime (Meeus cap. 14) + correcção de quadrante.
 * Mesma lógica usada ontem às 15h — ASC a ~90° do MC.
 */
function calcularAscendenteEMc(dataUTC, latitude, longitude) {
  if (!dataUTC || latitude == null || longitude == null) return { asc: 0, mc: 0 }
  if (Number.isNaN(latitude) || Number.isNaN(longitude)) return { asc: 0, mc: 0 }
  const lat = Math.max(-89, Math.min(89, latitude))

  const time = MakeTime(dataUTC)
  const gmst = SiderealTime(time) * 15
  const ramc = ((gmst + longitude) % 360 + 360) % 360

  const T = (dataUTC.getTime() / 86400000 - 10957.5) / 36525
  const eDeg = 23.439291111 - 0.013004167 * T - 0.000000164 * T * T
  const e = eDeg * Math.PI / 180

  const ramcRad = ramc * Math.PI / 180
  const latRad = lat * Math.PI / 180

  const yAsc = -Math.cos(ramcRad)
  const xAsc = Math.sin(ramcRad) * Math.cos(e) + Math.tan(latRad) * Math.sin(e)
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

  try {
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
  } catch (e) {
    console.warn('[Sidus] Swiss Ephemeris mapa natal falhou:', e?.message)
    return null
  }
}

/** Motor único — mesma matemática para gratuito e Premium (SWE → Meeus fallback). */
function calcularMapaNatalMotor(dados, swe) {
  if (!dados?.data || !dados?.hora || !dados?.localizacao) return null
  if (swe) {
    const mapaSwe = calcularMapaNatalComSwe(swe, dados)
    if (mapaSwe) return mapaSwe
  }
  return calcularMapaNatal(dados)
}

function formatarData(dataISO) {
  const [ano, mes, dia] = dataISO.split('-')
  return `${dia}/${mes}/${ano}`
}

function dadosNataisCompletos(dados, lang = 'pt') {
  if (!dados) return false
  return Object.keys(validarOnboarding(dados, lang)).length === 0
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
  const dataNorm = normalizarDataISO(d.data)
  if (dataNorm) d.data = dataNorm
  if (d.hora && typeof d.hora === 'string') {
    const partes = d.hora.trim().split(':')
    if (partes.length >= 2) {
      d.hora = `${partes[0].padStart(2, '0')}:${partes[1].padStart(2, '0')}`
    }
  }
  if (!d.localizacao && d.lat != null && d.lon != null) {
    d.localizacao = {
      lat: Number(d.lat),
      lon: Number(d.lon),
      nome: d.cidade || `${d.lat}, ${d.lon}`,
      placeId: d.placeId || 'legacy',
    }
  }
  if (d.localizacao?.lat != null && d.localizacao?.lon != null) {
    d.localizacao = {
      ...d.localizacao,
      lat: Number(d.localizacao.lat),
      lon: Number(d.localizacao.lon),
    }
  }
  return d
}

function chaveCacheDados(uid) { return `sidus_dados_${uid}` }
function chaveCacheMapa(uid) { return `sidus_mapa_${uid}` }

function guardarCachePerfil(uid, dados, mapa) {
  if (!uid) return
  try {
    if (dados && dadosNataisMinimos(dados)) {
      localStorage.setItem(chaveCacheDados(uid), JSON.stringify(dados))
    }
    if (mapa) localStorage.setItem(chaveCacheMapa(uid), JSON.stringify(mapa))
  } catch { /* quota */ }
}

function restaurarCachePerfil(uid) {
  if (!uid) return { dados: null, mapa: null }
  try {
    const dadosRaw = localStorage.getItem(chaveCacheDados(uid))
    const mapaRaw = localStorage.getItem(chaveCacheMapa(uid))
    return {
      dados: dadosRaw ? normalizarDadosPerfil(JSON.parse(dadosRaw)) : null,
      mapa: mapaRaw ? JSON.parse(mapaRaw) : null,
    }
  } catch {
    return { dados: null, mapa: null }
  }
}

async function repararDadosPerfil(dados) {
  const d = normalizarDadosPerfil(dados)
  if (!d || !dadosNataisMinimos(d)) return d
  try {
    // Não geocodificar — preservar lat/lon escolhidos no onboarding
    if (d.localizacao && (d.fuso == null || d.fuso === '')) {
      try {
        d.fuso = await pesquisarFusoHorario(d.localizacao.lat, d.localizacao.lon)
      } catch {
        d.fuso = 0
      }
    }
  } catch (e) {
    console.warn('[Sidus] Reparação de perfil falhou:', e?.message)
  }
  return d
}

function dadosProntosParaMapa(dados) {
  const d = normalizarDadosPerfil(dados)
  if (!d) return null
  const data = normalizarDataISO(d.data)
  if (!data || !d.hora) return null
  if (d.localizacao?.lat == null || d.localizacao?.lon == null) return null
  if (Number.isNaN(d.localizacao.lat) || Number.isNaN(d.localizacao.lon)) return null
  return { ...d, data, fuso: d.fuso ?? 0 }
}

function contaJaConfigurada(perfil, dadosActuais) {
  if (!perfil && !dadosActuais) return false
  if (perfil?.dadosTravados === true || perfil?.mapaGerado === true) return true
  return dadosNataisCompletos(dadosActuais) || dadosNataisCompletos(perfil?.dados)
}

function perfilTemPremium(perfil, user) {
  return utilizadorTemPremium(user, perfil)
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
  const { t } = useLanguage()
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
      <label style={estilos.label}>{t('onboarding.birthDate')}</label>
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
  const { t } = useLanguage()
  const [sugestoes, setSugestoes] = useState([])
  const [aPesquisar, setAPesquisar] = useState(false)
  const [aberto, setAberto] = useState(false)
  const [erroRede, setErroRede] = useState(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const cidadeJaSelecionada = localizacao && (
      localizacao.nome === valor
      || localizacao.nome?.startsWith(`${valor},`)
      || localizacao.nome?.startsWith(valor)
    )
    if (!valor || valor.length < 2 || cidadeJaSelecionada) {
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
        setErroRede(t('onboarding.citySearchError'))
        setSugestoes([])
      } finally {
        setAPesquisar(false)
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [valor, localizacao, t])

  useEffect(() => {
    const fechar = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setAberto(false)
    }
    document.addEventListener('pointerdown', fechar)
    return () => document.removeEventListener('pointerdown', fechar)
  }, [])

  return (
    <div ref={containerRef} style={{ marginBottom: 20, position: 'relative' }}>
      <label style={estilos.label}>{t('onboarding.birthCity')}</label>
      <div style={{ position: 'relative' }}>
        <input
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          onFocus={() => sugestoes.length > 0 && setAberto(true)}
          placeholder={t('onboarding.citySearchPlaceholder')}
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
                onPointerDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
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
  const { lang, t } = useLanguage()
  const [carregando, setCarregando] = useState(false)
  const [info, setInfo] = useState(null)
  const [erro, setErro] = useState(null)
  const enviadoRef = useRef(false)

  const reenviar = async () => {
    if (!auth) return
    setCarregando(true)
    setErro(null)
    setInfo(null)
    try {
      const email = await enviarEmailVerificacao(utilizador)
      setInfo(t('emailVerify.sentManual', { email }))
    } catch (e) {
      console.error('[Sidus Email]', e?.code, e?.message)
      const tooMany = e?.code === 'auth/too-many-requests' || /TOO_MANY/i.test(e?.message || '')
      if (tooMany) {
        setInfo(t('emailVerify.checkSpam', { email: utilizador?.email }))
      } else {
        setErro(traduzirErroEmail(e?.code, e?.message, lang))
      }
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    if (enviadoRef.current || !auth?.currentUser || auth.currentUser.emailVerified) return
    enviadoRef.current = true
    enviarEmailVerificacao(auth.currentUser)
      .then((email) => {
        setInfo(t('emailVerify.sentAuto', { email }))
      })
      .catch((e) => {
        console.warn('[Sidus Email] Envio automático:', e?.code, e?.message)
        const tooMany = e?.code === 'auth/too-many-requests' || /TOO_MANY/i.test(e?.message || '')
        if (tooMany) {
          setInfo(t('emailVerify.checkSpam', { email: utilizador?.email || auth.currentUser?.email }))
        } else {
          setErro(traduzirErroEmail(e?.code, e?.message, lang))
        }
      })
  }, [utilizador, lang, t])

  // Verifica automaticamente se o utilizador confirmou no email (outro separador)
  useEffect(() => {
    if (!auth?.currentUser || auth.currentUser.emailVerified) return undefined
    const id = setInterval(async () => {
      try {
        await reload(auth.currentUser)
        await auth.currentUser.getIdToken(true)
        if (auth.currentUser.emailVerified) onVerificado?.()
      } catch { /* ignore */ }
    }, 12000)
    return () => clearInterval(id)
  }, [utilizador, onVerificado])

  const verificarAgora = async () => {
    if (!auth || !utilizador) return
    setCarregando(true)
    setErro(null)
    setInfo(null)
    try {
      await reload(utilizador)
      await utilizador.getIdToken(true)
      if (auth.currentUser?.emailVerified) {
        onVerificado?.()
      } else {
        setErro(t('emailVerify.notConfirmed'))
      }
    } catch {
      setErro(t('emailVerify.verifyFailed'))
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div style={layoutConteudo(isDesktop, { paddingTop: 56, paddingBottom: 40, maxWidth: isDesktop ? 480 : undefined, margin: isDesktop ? '0 auto' : undefined })}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <Mail size={40} color={CORES.dourado} strokeWidth={1.5} style={{ marginBottom: 16 }} />
        <h1 style={{ ...estilos.titulo, fontSize: 28 }}>{t('emailVerify.title')}</h1>
        <p style={{ ...estilos.subtitulo, maxWidth: 360, margin: '12px auto 0', lineHeight: 1.55 }}>
          {t('emailVerify.intro', { email: utilizador?.email })}
        </p>
        <p style={{ fontSize: 12, color: CORES.dourado, maxWidth: 360, margin: '14px auto 0', lineHeight: 1.55, padding: '10px 14px', background: 'rgba(223,183,108,0.08)', borderRadius: 10, border: `1px solid rgba(223,183,108,0.25)` }}>
          {t('emailVerify.spamReminder')}
        </p>
      </div>
      <div style={{ ...estilos.vidro, padding: 24 }}>
        {info && (
          <div style={{ marginBottom: 14, padding: '10px 14px', borderRadius: 10, background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', fontSize: 13, color: '#34D399', lineHeight: 1.5 }}>
            {info}
          </div>
        )}
        {erro && (
          <div style={{ marginBottom: 14, padding: '10px 14px', borderRadius: 10, background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', fontSize: 13, color: '#F87171' }}>
            {erro}
          </div>
        )}
        <button type="button" disabled={carregando} onClick={verificarAgora} style={{ ...estilos.botaoDourado, marginBottom: 12, opacity: carregando ? 0.6 : 1 }}>
          {carregando ? t('common.verifying') : t('emailVerify.confirmBtn')}
        </button>
        <button type="button" disabled={carregando} onClick={reenviar} style={{
          width: '100%', padding: '14px', borderRadius: 12, marginBottom: 12,
          background: 'rgba(255,255,255,0.05)', border: `1px solid ${CORES.vidroBorda}`,
          color: CORES.branco, fontSize: 14, fontWeight: 600, cursor: carregando ? 'default' : 'pointer',
        }}>
          {t('emailVerify.resendBtn')}
        </button>
        <button type="button" onClick={onLogout} style={{
          width: '100%', padding: '12px', borderRadius: 12, background: 'transparent',
          border: 'none', color: CORES.brancoMuted, fontSize: 13, cursor: 'pointer',
        }}>
          {t('common.logout')}
        </button>
        <p style={{ fontSize: 11, color: CORES.brancoMuted, marginTop: 16, lineHeight: 1.5, textAlign: 'center' }}>
          {t('emailVerify.googleNote')}
        </p>
      </div>
    </div>
  )
}

function EcraAuth({ onMudar, tipo, isDesktop, firebaseOk = true }) {
  const { lang, t } = useLanguage()
  const [email, setEmail]       = useState('')
  const [senha, setSenha]       = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [verSenha, setVerSenha] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro]         = useState(null)
  const [info, setInfo]         = useState(null)
  const [recaptchaOk, setRecaptchaOk] = useState(false)
  const [recaptchaKey, setRecaptchaKey] = useState(0)

  useEffect(() => {
    setRecaptchaOk(false)
    setRecaptchaKey((k) => k + 1)
  }, [tipo])

  const traduzirErro = (code) => traduzirErroAuth(code, lang)

  const isLogin = tipo === 'login'
  const precisaRecaptcha = !isLogin

  useEffect(() => {
    document.title = isLogin ? `Sidus — ${t('auth.login')}` : `Sidus — ${t('auth.register')}`
    return () => { document.title = 'Sidus — Astrologia' }
  }, [isLogin, t])

  const handleSubmit = async () => {
    setErro(null)
    setInfo(null)
    if (!email || !senha) { setErro(t('auth.fillAll')); return }
    if (precisaRecaptcha && !recaptchaOk) { setErro(t('auth.confirmRobot')); return }
    if (tipo === 'register' && senha !== confirmar) { setErro(t('auth.passwordsMismatch')); return }
    if (tipo === 'register' && senha.length < 6) { setErro(t('auth.passwordMin')); return }
    if (!auth) { setErro(t('auth.firebaseMissing')); return }
    setCarregando(true)
    try {
      if (tipo === 'register') {
        const cred = await createUserWithEmailAndPassword(auth, email, senha)
        try {
          await enviarEmailVerificacao(cred.user)
        } catch (emailErr) {
          console.warn('[Sidus Auth] Email verificação:', emailErr?.code, emailErr?.message)
        }
        setInfo(t('auth.accountCreated'))
      } else {
        const cred = await signInWithEmailAndPassword(auth, email, senha)
        await reload(cred.user)
        await cred.user.getIdToken(true)
      }
    } catch (e) {
      console.error('[Sidus Auth] Erro:', e.code, e.message)
      setErro(traduzirErro(e.code) + (e.code ? ` [${e.code}]` : ''))
      setRecaptchaKey((k) => k + 1)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div style={layoutConteudo(isDesktop, { paddingTop: 56, paddingBottom: 40, maxWidth: isDesktop ? 480 : undefined, margin: isDesktop ? '0 auto' : undefined })}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <Sparkles size={40} color={CORES.dourado} strokeWidth={1.5} style={{ marginBottom: 16 }} />
        <h1 style={{ ...estilos.titulo, fontSize: 36, letterSpacing: '0.2em' }}>Sidus</h1>
        <p style={{ ...estilos.subtitulo, maxWidth: 360, margin: '8px auto 0', lineHeight: 1.55 }}>
          {t('auth.tagline')}
        </p>
      </div>

      <div style={{ ...estilos.vidro, padding: 24 }}>
        {!firebaseOk && (
          <div style={{ marginBottom: 16, padding: '10px 14px', borderRadius: 10, background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.35)', fontSize: 12, color: '#FCD34D', lineHeight: 1.5 }}>
            {t('auth.firebaseNotConfigured')}
          </div>
        )}
        <h2 style={{ margin: '0 0 24px', fontSize: 18, fontWeight: 600, color: CORES.branco, textAlign: 'center' }}>
          {isLogin ? t('auth.login') : t('auth.register')}
        </h2>

        {/* Email */}
        <div style={{ marginBottom: 16 }}>
          <label style={estilos.label}>{t('auth.email')}</label>
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
          <label style={estilos.label}>{t('auth.password')}</label>
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
            <label style={estilos.label}>{t('auth.confirmPassword')}</label>
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

        {precisaRecaptcha && (
          <div style={{ marginBottom: 16 }}>
            <RecaptchaCheckbox onChange={setRecaptchaOk} resetKey={recaptchaKey} />
          </div>
        )}

        <button
          type="button"
          disabled={carregando || (precisaRecaptcha && !recaptchaOk)}
          onClick={handleSubmit}
          style={{ ...estilos.botaoDourado, opacity: carregando ? 0.6 : 1, cursor: carregando ? 'default' : 'pointer' }}
        >
          {carregando
            ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
            : isLogin ? t('auth.login') : t('auth.register')}
        </button>

        {/* Divisor */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0' }}>
          <div style={{ flex: 1, height: 1, background: CORES.vidroBorda }} />
          <span style={{ fontSize: 11, color: CORES.brancoMuted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t('auth.or')}</span>
          <div style={{ flex: 1, height: 1, background: CORES.vidroBorda }} />
        </div>

        {/* Google */}
        <button
          type="button"
          disabled={carregando}
          onClick={async () => {
            if (!auth) { setErro(t('auth.firebaseMissing')); return }
            if (precisaRecaptcha && !recaptchaOk) { setErro(t('auth.confirmRobot')); return }
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
          {t('auth.google')}
        </button>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: CORES.brancoMuted }}>
          {isLogin ? t('auth.noAccount') : t('auth.hasAccount')}{' '}
          <button
            type="button"
            onClick={() => onMudar(isLogin ? 'register' : 'login')}
            style={{ background: 'none', border: 'none', color: CORES.dourado, cursor: 'pointer', fontSize: 13, fontWeight: 600, padding: 0 }}
          >
            {isLogin ? t('auth.createHere') : t('auth.loginHere')}
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
  const { lang, t } = useLanguage()
  const [tocado, setTocado] = useState({})
  const [fusoCarregando, setFusoCarregando] = useState(false)
  const [fusoErro, setFusoErro] = useState(null)
  const [fusoManual, setFusoManual] = useState(0)

  const erros = validarOnboarding(dados, lang)
  const valido = Object.keys(erros).length === 0

  const tocar = (campo) => () => setTocado((p) => ({ ...p, [campo]: true }))

  const handleSelectCidade = async (loc) => {
    const cidadeCurta = loc.nome?.split(',')[0]?.trim() || loc.nome
    setDados((p) => ({ ...p, cidade: cidadeCurta, localizacao: { ...loc, nome: loc.nome }, fuso: null }))
    setFusoCarregando(true)
    setFusoErro(null)
    try {
      const tz = await pesquisarFusoHorario(loc.lat, loc.lon)
      setDados((p) => ({ ...p, fuso: tz }))
    } catch {
      setFusoErro(t('onboarding.tzFail'))
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
    return t('onboarding.manualOffset', { offset: `${v >= 0 ? '+' : ''}${v}` })
  }

  return (
    <div style={layoutConteudo(isDesktop, { paddingTop: 48, paddingBottom: 40, maxWidth: isDesktop ? 520 : undefined, margin: isDesktop ? '0 auto' : undefined })}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <Sparkles size={40} color={CORES.dourado} strokeWidth={1.5} style={{ marginBottom: 16 }} />
        <h1 style={{ ...estilos.titulo, fontSize: 36, letterSpacing: '0.2em' }}>Sidus</h1>
        <p style={estilos.subtitulo}>{t('onboarding.tagline')}</p>
      </div>

      <div style={{ ...estilos.vidro, padding: 24 }}>
        <Campo
          label={t('onboarding.name')}
          valor={dados.nome}
          onChange={(v) => setDados((p) => ({ ...p, nome: v }))}
          onBlur={tocar('nome')}
          erro={tocado.nome ? erros.nome : null}
          placeholder={t('onboarding.namePlaceholder')}
        />
        <CampoData
          valor={dados.data}
          onChange={(v) => setDados((p) => ({ ...p, data: v }))}
          onBlur={tocar('data')}
          erro={tocado.data ? erros.data : null}
        />
        <Campo
          label={t('onboarding.birthTime')}
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
                {t('onboarding.detectingTz')}
              </p>
            )}
            {!fusoCarregando && dados.fuso != null && !fusoErro && (
              <div>
                <p style={{ margin: '0 0 2px', fontSize: 12, color: CORES.brancoMuted }}>
                  {t('onboarding.tzDetected')}
                </p>
                <p style={{ margin: 0, fontSize: 14, color: '#34D399', fontWeight: 600 }}>
                  ✓ {labelFuso()}
                </p>
                {dados.data && dados.hora && (
                  <p style={{ margin: '4px 0 0', fontSize: 11, color: CORES.brancoMuted }}>
                    {t('onboarding.tzHistorical')}
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
                  {t('onboarding.tzManual')}
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
          {t('onboarding.calculate')}
        </button>
      </div>
    </div>
  )
}

function Dashboard({ nome, mapaNatal, ceuAgora, aspetos, onOraculo, onPrivacidade, isDesktop, isPremium, onUpgrade, onTarot, userEmail }) {
  const { t, ts, te, tp, ta, lang } = useLanguage()
  const faseLua = calcularFaseLua(new Date(), lang)
  return (
    <div style={layoutConteudo(isDesktop)}>
      <header style={{ textAlign: 'center', marginBottom: 28 }}>
        <h1 style={estilos.titulo}>Sidus</h1>
        <p style={{ ...estilos.subtitulo, marginBottom: 0 }}>{nome ? t('home.welcome', { name: nome }) : t('home.skyRealtime')}</p>
      </header>

      {mapaNatal && (
        <div style={{ ...estilos.vidro, padding: 20, marginBottom: 18 }}>
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.09em', color: CORES.dourado, marginBottom: 12 }}>
            {t('home.natalChart')}
          </div>

          {/* Linha principal: Sol + Ascendente em destaque */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
            <div style={{ flex: 1, background: 'rgba(223,183,108,0.08)', borderRadius: 12, padding: '10px 14px', border: `1px solid rgba(223,183,108,0.2)` }}>
              <div style={{ fontSize: 10, color: CORES.dourado, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                {t('home.sunSign')}
              </div>
              <div style={{ fontSize: 17, fontWeight: 600, color: CORES.branco }}>
                {mapaNatal.solar.simbolo} {ts(mapaNatal.solar.nome)}
              </div>
              <div style={{ fontSize: 11, color: CORES.brancoMuted, marginTop: 2 }}>
                {mapaNatal.solar.graus}° · {te(mapaNatal.solar.elemento)}
              </div>
            </div>

            <div style={{ flex: 1, background: 'rgba(139,92,246,0.12)', borderRadius: 12, padding: '10px 14px', border: `1px solid rgba(139,92,246,0.3)` }}>
              <div style={{ fontSize: 10, color: '#C4B5FD', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                {t('home.ascendant')}
              </div>
              <div style={{ fontSize: 17, fontWeight: 600, color: CORES.branco }}>
                {mapaNatal.ascendente.simbolo} {ts(mapaNatal.ascendente.nome)}
              </div>
              <div style={{ fontSize: 11, color: CORES.brancoMuted, marginTop: 2 }}>
                {mapaNatal.ascendente.graus}° · {te(mapaNatal.ascendente.elemento)}
              </div>
            </div>
          </div>

          {/* Lua */}
          <div style={{ fontSize: 14, color: CORES.brancoMuted }}>
            {t('home.moonIn')} <span style={{ color: CORES.brancoSuave }}>{ts(mapaNatal.lunar.nome)} {mapaNatal.lunar.simbolo}</span>
            <span style={{ marginLeft: 6, fontSize: 12 }}>{mapaNatal.lunar.graus}° · {te(mapaNatal.lunar.elemento)}</span>
          </div>
        </div>
      )}

      <div style={{ ...estilos.vidro, padding: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <Moon size={22} color={CORES.dourado} />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: CORES.dourado }}>
            {t('home.skyToday')}
          </span>
        </div>

        {/* Fase lunar — disponível para todos na home */}
        <div style={{
          background: 'rgba(139,92,246,0.12)', borderRadius: 12, padding: 14, marginBottom: 14,
          border: '1px solid rgba(139,92,246,0.3)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 32 }}>{faseLua.emoji}</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: CORES.branco }}>{faseLua.nome}</div>
              <div style={{ fontSize: 11, color: CORES.brancoMuted }}>{t('home.illuminated', { pct: faseLua.iluminacao, angle: faseLua.angulo })}</div>
            </div>
          </div>
          <p style={{ fontSize: 12, color: CORES.brancoSuave, lineHeight: 1.55, margin: 0 }}>{faseLua.desc}</p>
        </div>

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
            {t('home.activeAspects')}
          </span>
        </div>
        {aspetos.length === 0 ? (
          <p style={{ fontSize: 13, color: CORES.brancoMuted }}>{t('home.noAspects', { orbe: ORBE_ASPECTO })}</p>
        ) : (
          aspetos.slice(0, 8).map((a, i) => (
            <div key={`${a.planetaA}-${a.planetaB}-${i}`} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < aspetos.length - 1 ? `1px solid ${CORES.vidroBorda}` : 'none' }}>
              <div style={{ fontSize: 14, color: CORES.branco }}>
                {tp(a.planetaA)} <span style={{ color: CORES.dourado }}>{ta(a.aspecto)}</span> {tp(a.planetaB)}
              </div>
              <div style={{ fontSize: 11, color: CORES.brancoMuted }}>{a.orbe}</div>
            </div>
          ))
        )}
      </div>

      <ConteudoDinamicoSidus mapaNatal={mapaNatal} aspetos={aspetos} isPremium={isPremium} onUpgrade={onUpgrade} onOraculo={onOraculo} userEmail={userEmail} />

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
            <div style={{ fontSize: 10, color: '#F472B6', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>{t('home.tarotOnline')}</div>
            <div style={{ fontSize: 15, color: CORES.branco, fontWeight: 600 }}>{t('home.virtualArcana')}</div>
            <div style={{ fontSize: 11, color: CORES.brancoMuted }}>{t('home.tarotSub')}</div>
          </div>
          <Layers size={22} color="#F472B6" />
        </button>
      )}

      <button type="button" onClick={onOraculo} style={{ ...estilos.vidro, width: '100%', padding: 18, display: 'flex', justifyContent: 'space-between', border: `1px solid ${CORES.dourado}`, background: 'rgba(223,183,108,0.08)', marginTop: 14, marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 11, color: CORES.dourado, textTransform: 'uppercase' }}>{t('home.oracleDay')}</div>
          <div style={{ fontSize: 15, color: CORES.branco }}>{t('home.consultAI')}</div>
        </div>
        <MessageCircle size={22} color={CORES.dourado} />
      </button>

      {/* Rodapé legal */}
      <div style={{ textAlign: 'center', paddingTop: 10, paddingBottom: 4 }}>
        <button type="button" onClick={onPrivacidade} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', fontSize: 10, cursor: 'pointer', textDecoration: 'underline' }}>
          {t('home.privacy')}
        </button>
        <span style={{ color: 'rgba(255,255,255,0.15)', margin: '0 6px', fontSize: 10 }}>·</span>
        <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10 }}>{t('home.copyright')}</span>
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
  const { lang, t } = useLanguage()
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
  const cartaBase = ARCANOS_NOMES[idx]
  const carta = localizeArcano(cartaBase, lang)
  const dataFormatada = `${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')}/${ano}`

  return (
    <div style={{
      ...estilos.vidro, padding:'18px 20px', marginBottom:16,
      background:'rgba(223,183,108,0.05)', border:`1px solid rgba(223,183,108,0.35)`,
      borderRadius:16, cursor:'default',
    }}>
      <div style={{fontSize:10,color:CORES.dourado,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:12}}>
        {t('cartaoDia.title', { date: dataFormatada })}
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
  const { t } = useLanguage()
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
          <span style={{ fontSize: 11, color: CORES.brancoMuted }}>{graus != null ? t('mapa.degreesInSign', { graus: typeof graus === 'number' ? graus.toFixed(1) : graus }) : ''}</span>
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

function MapaAstral({ mapaNatal, dados, planetasNascimento, mapaDesbloqueado, isPremium, onUpgrade, onComprarMapa, onMapaGerado, isDesktop, motorAstro, perfilCarregando, reparandoDados, mapaGerado, onCompletarNatal }) {
  const { lang, t, ts, tp, te, ta } = useLanguage()
  const [gerandoPdf, setGerandoPdf] = useState(false)
  const [emailEnviado, setEmailEnviado] = useState(false)
  const [calcExpirado, setCalcExpirado] = useState(false)
  const mapaGeradoRef = useRef(false)

  const mapaCompletoDesbloqueado = mapaDesbloqueado || isPremium

  useEffect(() => {
    if (mapaNatal) {
      setCalcExpirado(false)
      return undefined
    }
    const prontos = Boolean(dadosProntosParaMapa(dados))
    const aguardar = perfilCarregando || reparandoDados || prontos
    if (!aguardar) return undefined
    const timer = setTimeout(() => setCalcExpirado(true), 8000)
    return () => clearTimeout(timer)
  }, [mapaNatal, dados, perfilCarregando, reparandoDados])

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
    () => (mapaCompletoDesbloqueado && mapaNatal ? gerarAnaliseCompleta(mapaNatal, planetasComCasa, aspetosNatais, dados, lang) : null),
    [mapaCompletoDesbloqueado, mapaNatal, planetasComCasa, aspetosNatais, dados, lang]
  )

  const resumoGratuito = useMemo(
    () => (!mapaCompletoDesbloqueado && mapaNatal ? gerarResumoGratuito(mapaNatal, lang) : null),
    [mapaCompletoDesbloqueado, mapaNatal, lang]
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
      alert(t('mapa.pdfError'))
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
    const temDadosMinimos = dadosNataisMinimos(dados)
    const prontosParaMapa = Boolean(dadosProntosParaMapa(dados))

    let mensagem = t('mapa.fillNatal')
    let mostrarCtaPremium = false
    let mostrarCalculando = false

    if (calcExpirado) {
      mensagem = t('mapa.repairNatal')
      mostrarCtaPremium = true
    } else if (perfilCarregando || reparandoDados) {
      mostrarCalculando = true
      mensagem = t('mapa.calculating')
    } else if (prontosParaMapa) {
      mostrarCalculando = true
      mensagem = t('mapa.calculating')
    } else if ((isPremium || mapaGerado) && !temDadosMinimos) {
      mensagem = t('mapa.premiumCompleteNatal')
      mostrarCtaPremium = true
    } else if (temDadosMinimos && (mapaGerado || isPremium)) {
      mensagem = t('mapa.repairNatal')
      mostrarCtaPremium = true
    }

    return (
      <div style={layoutConteudo(isDesktop)}>
        <h1 style={{ ...estilos.titulo, textAlign: 'left', fontSize: 22, marginBottom: 20 }}>{t('mapa.title')}</h1>
        <div style={{ ...estilos.vidro, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', gap: 8, color: CORES.brancoMuted, lineHeight: 1.6 }}>
            {mostrarCalculando
              ? <Loader2 size={15} color={CORES.dourado} style={{ flexShrink: 0, animation: 'spin 1s linear infinite' }} />
              : <Info size={15} style={{ flexShrink: 0, marginTop: 2 }} />}
            <span>{mensagem}</span>
          </div>
          {mostrarCtaPremium && onCompletarNatal && (
            <button type="button" onClick={onCompletarNatal} style={{ ...estilos.botaoDourado, alignSelf: 'flex-start' }}>
              {t('mapa.completeNatalCta')}
            </button>
          )}
        </div>
      </div>
    )
  }

  const pilaresBase = [
    { titulo: t('mapa.sunSign'),  icon: Sun,      corBorda: CORES.vidroBorda,         corFundo: CORES.roxoClaro,           corIcone: CORES.dourado,  ...mapaNatal.solar, nome: ts(mapaNatal.solar.nome), elemento: te(mapaNatal.solar.elemento) },
    { titulo: t('mapa.moonSign'),  icon: Moon,     corBorda: CORES.vidroBorda,         corFundo: CORES.roxoClaro,           corIcone: CORES.dourado,  ...mapaNatal.lunar, nome: ts(mapaNatal.lunar.nome), elemento: te(mapaNatal.lunar.elemento) },
    { titulo: t('mapa.ascendant'),   icon: ArrowUp,  corBorda: 'rgba(139,92,246,0.4)',   corFundo: 'rgba(139,92,246,0.18)',   corIcone: '#C4B5FD',      ...mapaNatal.ascendente, nome: ts(mapaNatal.ascendente.nome), elemento: te(mapaNatal.ascendente.elemento) },
  ]
  const pilaresCompletos = [
    ...pilaresBase,
    ...(mapaNatal.mc ? [{ titulo: t('mapa.mc'), icon: Star, corBorda: 'rgba(52,211,153,0.35)', corFundo: 'rgba(52,211,153,0.12)', corIcone: '#34D399', ...mapaNatal.mc, nome: ts(mapaNatal.mc.nome), elemento: te(mapaNatal.mc.elemento) }] : []),
  ]

  const balEl  = mapaCompletoVisivel ? calcularBalancaElementos(planetasComCasa) : null
  const balMod = mapaCompletoVisivel ? calcularBalancaModalidades(planetasComCasa) : null
  const totalPlanetas = planetasComCasa.length

  return (
    <div style={layoutConteudo(isDesktop)}>
      <header style={{ marginBottom: 20 }}>
        <h1 style={{ ...estilos.titulo, textAlign: 'left', fontSize: isDesktop ? 28 : 22 }}>{t('mapa.title')}</h1>
        <p style={{ ...estilos.subtitulo, textAlign: 'left', marginBottom: 2 }}>
          {dados.nome} · {formatarData(dados.data)} às {dados.hora}
        </p>
        <p style={{ fontSize: 10, color: CORES.brancoMuted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          {mapaNatal.sistema || 'Tropical · Placidus'} · {mapaNatal.motor || motorAstro || 'astronomy-engine'}
          {sweEphemerisPronta() ? ' · Efemérides ✓' : ''}
        </p>
      </header>

      {/* ── Resumo interpretativo (gratuito) ── */}
      {!mapaCompletoDesbloqueado && resumoGratuito && (
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
        {t('mapa.fourPillars')}
      </div>
      {pilaresCompletos.map(p => <PilarCard key={p.titulo} {...p} />)}

      {/* ── Posições planetárias (todos os utilizadores com dados completos) ── */}
      {mapaCompletoVisivel && (
        <>
          {balEl && (
            <div style={{ ...estilos.vidro, padding: 18, marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: CORES.dourado, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14, fontWeight: 700 }}>
                {t('mapa.elementBalance')}
              </div>
              <BarraElemento label={t('mapa.fire')}  valor={balEl.Fogo}  total={totalPlanetas} cor="#FB923C" />
              <BarraElemento label={t('mapa.earth')} valor={balEl.Terra} total={totalPlanetas} cor="#4ADE80" />
              <BarraElemento label={t('mapa.air')}   valor={balEl.Ar}   total={totalPlanetas} cor="#93C5FD" />
              <BarraElemento label={t('mapa.water')}   valor={balEl.Água} total={totalPlanetas} cor="#818CF8" />
              {balMod && (
                <>
                  <div style={{ fontSize: 11, color: CORES.dourado, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '16px 0 12px', fontWeight: 700 }}>
                    {t('mapa.modalities')}
                  </div>
                  <BarraElemento label={t('mapa.cardinal')} valor={balMod.Cardinal} total={totalPlanetas} cor="#F472B6" />
                  <BarraElemento label={t('mapa.fixed')}    valor={balMod.Fixo}    total={totalPlanetas} cor="#FBBF24" />
                  <BarraElemento label={t('mapa.mutable')}  valor={balMod.Mutável} total={totalPlanetas} cor="#34D399" />
                </>
              )}
            </div>
          )}

          <div style={{ ...estilos.vidro, padding: 18, marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: CORES.dourado, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14, fontWeight: 700 }}>
              {t('mapa.positions')}
            </div>
            {planetasComCasa.map((p) => (
              <div key={p.key} style={{ padding: '10px 0', borderBottom: `1px solid ${CORES.vidroBorda}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
                  <span style={{ fontSize: 14, color: CORES.branco, fontWeight: 600 }}>
                    {p.simbolo} {tp(p.nome)}
                  </span>
                  <span style={{ fontSize: 13, color: CORES.dourado }}>
                    {p.signo?.simbolo} {ts(p.signo?.nome)}
                    {p.casa ? <span style={{ color: CORES.brancoMuted, fontSize: 11, marginLeft: 6 }}>{t('mapa.house')} {p.casa}</span> : ''}
                    {p.retrograde ? <span style={{ color: '#F87171', fontSize: 11, marginLeft: 4 }}> ℞</span> : ''}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: CORES.brancoMuted, marginTop: 2 }}>
                  {(p.longitude ?? 0).toFixed(2)}° {t('mapa.ecliptic')}
                </div>
              </div>
            ))}
          </div>

          {aspetosNatais.length > 0 && (
            <div style={{ ...estilos.vidro, padding: 18, marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: CORES.dourado, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14, fontWeight: 700 }}>
                {t('mapa.aspects')}
              </div>
              {aspetosNatais.map((a, i) => {
                const corAsp = a.aspecto === 'Conjunção' ? '#DFB76C' : a.aspecto === 'Trígono' || a.aspecto === 'Sextil' ? '#34D399' : '#F87171'
                return (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: `1px solid rgba(255,255,255,0.05)` }}>
                    <span style={{ fontSize: 12, color: CORES.brancoSuave }}>{tp(a.planetaA)} · {tp(a.planetaB)}</span>
                    <span style={{ fontSize: 11, color: corAsp, fontWeight: 600, padding: '2px 8px', borderRadius: 10, background: `${corAsp}18` }}>{ta(a.aspecto)} {a.orbe}</span>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* ── Conteúdo Premium (interpretação profunda + PDF) ── */}
      {mapaCompletoDesbloqueado ? (
        <>
          <InterpretacaoMapa analise={analiseCompleta} estilosVidro={estilos.vidro} lang={lang} />

          {/* Áreas da Vida — resumo por casa dominante */}
          <div style={{ ...estilos.vidro, padding: 18, marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: CORES.dourado, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14, fontWeight: 700 }}>
              {t('mapa.lifeSpheres')}
            </div>
            {[
              {
                area: t('mapa.love'),
                planetas: planetasComCasa.filter(p => ['Vénus', 'Lua', 'Marte'].includes(p.nome)),
              },
              {
                area: t('mapa.career'),
                planetas: planetasComCasa.filter(p => ['Sol', 'Saturno', 'Marte'].includes(p.nome)),
              },
              {
                area: t('mapa.spirit'),
                planetas: planetasComCasa.filter(p => ['Neptuno', 'Plutão', 'Lua', 'Quíron'].includes(p.nome)),
              },
            ].map(({ area, planetas: ps }) => (
              <div key={area} style={{ padding: '10px 0', borderBottom: `1px solid ${CORES.vidroBorda}` }}>
                <div style={{ fontSize: 13, color: CORES.branco, fontWeight: 600, marginBottom: 3 }}>{area}</div>
                <div style={{ fontSize: 12, color: CORES.brancoMuted }}>
                  {ps.length > 0
                    ? ps.map(p => t('mapa.planetIn', { planet: tp(p.nome), sign: ts(p.signo?.nome) }) + (p.casa ? ` (${t('mapa.house')} ${p.casa})` : '')).join(' · ')
                    : '—'}
                </div>
              </div>
            ))}
          </div>

          {/* Exportar mapa completo */}
          <div style={{ fontSize: 11, color: CORES.dourado, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10, fontWeight: 700 }}>
            {t('mapa.export')}
          </div>

          {/* Verificação de precisão (compacta) */}
          <div style={{ ...estilos.vidro, padding: 14, marginBottom: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px 12px', fontSize: 11 }}>
              <span style={{ color: CORES.brancoMuted }}>{t('mapa.utDate')}</span>
              <span style={{ color: CORES.branco }}>{mapaNatal.instanteUTC ? mapaNatal.instanteUTC.replace('T', ' ').slice(0, 16) + ' UTC' : '—'}</span>
              <span style={{ color: CORES.brancoMuted }}>{t('mapa.timezone')}</span>
              <span style={{ color: CORES.branco }}>
                {typeof mapaNatal.fuso === 'string' ? mapaNatal.fuso : `UTC${(mapaNatal.fuso ?? 0) >= 0 ? '+' : ''}${mapaNatal.fuso ?? 0}`}
              </span>
              <span style={{ color: CORES.brancoMuted }}>{t('mapa.coordinates')}</span>
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
              {gerandoPdf ? t('mapa.generating') : '📄 PDF'}
            </button>
            <button type="button" onClick={compartilharEmail} style={{
              flex: 1, padding: '14px', borderRadius: 14,
              background: emailEnviado ? 'rgba(52,211,153,0.2)' : 'rgba(223,183,108,0.12)',
              border: `1px solid ${emailEnviado ? '#34D399' : CORES.dourado}`,
              color: emailEnviado ? '#34D399' : CORES.dourado,
              fontSize: 14, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              {emailEnviado ? t('mapa.emailOpened') : '✉ Email'}
            </button>
          </div>
        </>
      ) : (
        <div style={{
          ...estilos.vidro, padding: 24, marginBottom: 14,
          border: `1px solid ${CORES.dourado}`, background: 'rgba(223,183,108,0.06)',
          textAlign: 'center', position: 'relative',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(223,183,108,0.03) 8px, rgba(223,183,108,0.03) 16px)', pointerEvents: 'none' }} />
          <Crown size={28} color={CORES.dourado} style={{ marginBottom: 10 }} />
          <div style={{ fontSize: 16, fontWeight: 700, color: CORES.dourado, marginBottom: 6 }}>{t('mapa.fullChart')}</div>
          <div style={{ fontSize: 13, color: CORES.brancoMuted, marginBottom: 14, lineHeight: 1.5 }}>
            {t('mapa.fullDesc')}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {['☀ Essência', '☿♀♂ Pessoais', '♃♄ Karma', '⊕ MC', '🌙 Fases Lua', '📄 PDF'].map(item => (
              <span key={item} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 20, background: 'rgba(223,183,108,0.1)', border: `1px solid rgba(223,183,108,0.25)`, color: CORES.brancoMuted }}>
                {item}
              </span>
            ))}
          </div>
          <button type="button" onClick={onComprarMapa} style={{ ...estilos.botaoDourado, width: '100%', marginBottom: 10 }}>
            {t('mapa.buyOnce')}
          </button>
          <button type="button" onClick={onUpgrade} style={{
            width: '100%', padding: '13px', borderRadius: 12,
            background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.4)',
            color: CORES.dourado, fontSize: 14, fontWeight: 700, cursor: 'pointer',
          }}>
            {t('mapa.premiumOption')}
          </button>
        </div>
      )}
    </div>
  )
}

function Ferramentas({ onFerramenta, isDesktop, acessoVip }) {
  const { lang, t } = useLanguage()
  const ferramentas = getFerramentas(lang)
  return (
    <div style={layoutConteudo(isDesktop)}>
      <header style={{ marginBottom: 28 }}>
        <h1 style={{ ...estilos.titulo, textAlign: 'left', fontSize: 22 }}>{t('ferramentas.title')}</h1>
      </header>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {ferramentas.map((f) => {
          const Icon = f.icon
          const bloqueada = f.premium && !acessoVip
          return (
            <button key={f.id} type="button" onClick={() => onFerramenta(f)} style={{ ...estilos.vidro, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', width: '100%', textAlign: 'left', opacity: bloqueada ? 0.85 : 1 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: f.premium ? 'rgba(223,183,108,0.12)' : CORES.roxoClaro, border: `1px solid ${f.premium ? CORES.dourado : CORES.vidroBorda}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={22} color={f.premium ? CORES.dourado : CORES.brancoSuave} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, color: CORES.branco }}>{f.nome}</div>
                {f.sub && <div style={{ fontSize: 12, color: CORES.brancoMuted }}>{f.sub}</div>}
              </div>
              {f.premium && !acessoVip && <Crown size={16} color={CORES.dourado} />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Paywall({ onVoltar, onPagar, onSucesso, isDesktop }) {
  const { lang, t } = useLanguage()
  const beneficios = getBeneficiosVip(lang)
  return (
    <div style={layoutConteudo(isDesktop, { paddingTop: 16 })}>
      <button type="button" onClick={onVoltar} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: CORES.dourado, cursor: 'pointer', marginBottom: 20 }}>
        <ChevronLeft size={20} /> {t('common.back')}
      </button>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>✨</div>
        <h1 style={{ ...estilos.titulo, fontSize: 24 }}>{t('vip.title')}</h1>
        <p style={{ color: CORES.brancoMuted, fontSize: 13 }}>{t('vip.subtitle')}</p>
      </div>
      <div style={{ ...estilos.vidro, padding: 24, marginBottom: 20 }}>
        {beneficios.map((b) => (
          <div key={b} style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            <Check size={14} color={CORES.dourado} />
            <span style={{ fontSize: 14, color: CORES.brancoSuave }}>{b}</span>
          </div>
        ))}
      </div>
      <div style={{ ...estilos.vidro, padding: 24, textAlign: 'center', border: `1px solid ${CORES.dourado}`, marginBottom: 20 }}>
        <div style={{ fontSize: 40, fontWeight: 700, color: CORES.branco }}>{t('vip.price')} <span style={{ fontSize: 16, color: CORES.brancoMuted, fontWeight: 400 }}>{t('common.perMonth')}</span></div>
        <p style={{ fontSize: 12, color: CORES.brancoMuted, marginTop: 6 }}>{t('vip.cancelAnytime')}</p>
      </div>
      <button type="button" onClick={() => onPagar(lang === 'en' ? 'Sidus VIP — Monthly subscription' : 'Sidus VIP — Subscrição mensal', PRECO_PREMIUM_MENSAL, onSucesso, { productType: 'premium' })} style={estilos.botaoDourado}>
        {t('vip.cta')}
      </button>
      <p style={{ textAlign: 'center', fontSize: 11, color: CORES.brancoMuted, marginTop: 12 }}>
        {t('vip.paymentMethods')}
      </p>
    </div>
  )
}

// ── Integração AI (servidor Netlify — chaves secretas) ─────────────────────────
async function consultarSidus(pergunta, mapaNatal, historico, lang, idToken) {
  return consultarOracleServidor(pergunta, mapaNatal, historico, lang, idToken)
}

function Chat({ mapaNatal, isPremium, userId, oracleRemotas, onOracleUsada, onUpgrade, obterIdToken }) {
  const { lang, t } = useLanguage()
  const [perguntasUsadas, setPerguntasUsadas] = useState(() => oraclePerguntasUsadas(userId, oracleRemotas))

  const [mensagens, setMensagens] = useState(() => [
    { id: 1, autor: 'ia', texto: getChatGreeting(mapaNatal, 'pt', MAX_ORACLE_GRATIS, isPremium) },
  ])

  const [texto, setTexto]       = useState('')
  const [digitando, setDigitando] = useState(false)
  const fimRef = useRef(null)

  useEffect(() => {
    setPerguntasUsadas(oraclePerguntasUsadas(userId, oracleRemotas))
  }, [userId, oracleRemotas])

  useEffect(() => {
    setMensagens([{ id: 1, autor: 'ia', texto: getChatGreeting(mapaNatal, lang, MAX_ORACLE_GRATIS, isPremium) }])
  }, [lang, mapaNatal, isPremium])

  useEffect(() => { fimRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [mensagens, digitando])

  const restantes = oracleRestantes(isPremium, userId, oracleRemotas)

  const enviar = async () => {
    if (!texto.trim() || digitando) return

    if (!isPremium && perguntasUsadas >= MAX_ORACLE_GRATIS) {
      setTexto('')
      onUpgrade()
      return
    }

    const q = texto.trim()

    const erroValidacao = validarPerguntaOracle(q, lang)
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

    const numAtual = perguntasUsadas
    const idToken = obterIdToken ? await obterIdToken() : null

    if (!isPremium && !idToken) {
      setDigitando(false)
      setMensagens(prev => [...prev, {
        id: Date.now()+1, autor: 'ia', aviso: true,
        texto: t('oracle.sessionError'),
      }])
      return
    }

    const resultado = await consultarSidus(q, mapaNatal, historicoParaIA, lang, idToken)

    if (resultado?.limite) {
      const total = resultado.usadas ?? MAX_ORACLE_GRATIS
      setPerguntasUsadas(total)
      onOracleUsada?.(total)
      setDigitando(false)
      setMensagens(prev => [...prev, {
        id: Date.now()+1, autor: 'ia', aviso: true,
        texto: getOracleLimitMessage(MAX_ORACLE_GRATIS, lang),
      }])
      setTimeout(onUpgrade, 800)
      return
    }

    const resposta = resultado?.resposta || gerarRespostaOracle(q, mapaNatal, numAtual, lang)
    setMensagens(prev => [...prev, { id: Date.now()+1, autor: 'ia', texto: resposta }])
    setDigitando(false)

    if (!isPremium && resultado?.usadas != null) {
      const total = sincronizarOraclePerguntas(userId, resultado.usadas)
      setPerguntasUsadas(total)
      onOracleUsada?.(total)
    }

    if (!isPremium && (resultado?.usadas ?? numAtual + 1) >= MAX_ORACLE_GRATIS) {
      setTimeout(() => {
        setMensagens(prev => [...prev, {
          id: Date.now()+99, autor: 'ia', aviso: true,
          texto: getOracleLimitMessage(MAX_ORACLE_GRATIS, lang),
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
            <div style={{ fontSize: 14, fontWeight: 700, color: CORES.branco }}>{t('oracle.title')}</div>
            <div style={{ fontSize: 10, color: CORES.brancoMuted }}>
              {isPremium ? t('oracle.premiumSubtitle') : t('oracle.subtitle')}
            </div>
          </div>
        </div>
        {!isPremium && (
          <button type="button" onClick={onUpgrade} style={{
            fontSize: 11, color: CORES.dourado, background: 'rgba(223,183,108,0.08)',
            padding: '5px 12px', borderRadius: 20, border: `1px solid rgba(223,183,108,0.3)`,
            cursor: 'pointer',
          }}>
            {restantes > 0
              ? (restantes === 1 ? t('oracle.freeQuestions', { count: restantes }) : t('oracle.freeQuestionsPlural', { count: restantes }))
              : t('oracle.premiumBadge')}
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
            !isPremium && perguntasUsadas >= MAX_ORACLE_GRATIS
              ? t('oracle.placeholderLocked')
              : t('oracle.placeholder')
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
              : !isPremium && perguntasUsadas >= MAX_ORACLE_GRATIS ? 'rgba(223,183,108,0.2)'
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
  const { t } = useLanguage()
  return (
    <footer style={{
      position: 'relative',
      zIndex: 1,
      textAlign: 'center',
      padding: isDesktop ? '28px 40px 36px' : `22px 20px 28px`,
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
        {t('footer.tagline')}
      </p>
      <p style={{ margin: '10px 0 0', fontSize: isDesktop ? 11 : 10 }}>
        <a
          href="/privacidade"
          style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'underline' }}
        >
          {t('footer.privacy')}
        </a>
      </p>
    </footer>
  )
}

function LogoSidus({ onClick, compact = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Sidus — Home"
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: compact ? 8 : 10,
        padding: compact ? '4px 2px' : '4px 8px',
        flexShrink: 0,
      }}
    >
      <Sparkles size={compact ? 16 : 20} color={CORES.dourado} strokeWidth={1.5} />
      <span style={{ fontSize: compact ? 15 : 20, fontWeight: 300, letterSpacing: compact ? '0.18em' : '0.2em', color: CORES.dourado }}>SIDUS</span>
    </button>
  )
}

function Navbar({ passo, setPasso, isDesktop }) {
  const { lang, t } = useLanguage()
  const [menuAberto, setMenuAberto] = useState(false)

  const irHome = () => {
    setPasso('home')
    setMenuAberto(false)
  }

  const ferramentasNav = getFerramentas(lang).map((f) => ({
    id: f.id,
    label: f.nome,
    icon: f.icon,
    glow: f.premium ? CORES.dourado : '#93C5FD',
  }))

  const itens = [
    { id: 'home',        label: t('nav.home'),    icon: Home,          glow: '#DFB76C' },
    { id: 'mapa',        label: t('nav.mapa'),    icon: Map,           glow: '#C4B5FD' },
    { id: 'tarot',       label: t('nav.tarot'),   icon: Layers,        glow: '#F472B6' },
    ...ferramentasNav,
    { id: 'chat',        label: t('nav.oraculo'), icon: MessageCircle, glow: '#34D399' },
    { id: 'perfil',      label: t('nav.perfil'),  icon: User,          glow: '#93C5FD' },
  ]

  const passosFerramenta = new Set(ferramentasNav.map((f) => f.id))

  const navegar = (id) => {
    setPasso(id)
    setMenuAberto(false)
  }

  const itemAtivo = (item) => passo === item.id || (item.id === 'ferramentas' && passosFerramenta.has(passo))

  useEffect(() => {
    setMenuAberto(false)
  }, [passo])

  const itemAtivoNav = itens.find((i) => itemAtivo(i))
  const headerStyle = isDesktop ? estilos.navbarDesktopTop : estilos.navbarMobileTop

  return (
    <>
      <header style={headerStyle}>
        <button
          type="button"
          className="mobile-menu-btn"
          aria-label={menuAberto ? t('nav.closeMenu') : t('nav.openMenu')}
          aria-expanded={menuAberto}
          onClick={() => setMenuAberto((v) => !v)}
          style={{
            background: menuAberto ? 'rgba(223,183,108,0.15)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${menuAberto ? CORES.dourado : CORES.vidroBorda}`,
            borderRadius: 10,
            color: CORES.dourado,
            width: 42,
            height: 42,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          {menuAberto ? <X size={22} /> : <Menu size={22} />}
        </button>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: isDesktop ? 10 : 6, flexShrink: 0 }}>
          <LogoSidus onClick={irHome} compact />
          <LanguageSwitcher variant="compact" />
        </div>
      </header>

      {menuAberto && (
        <button
          type="button"
          className="mobile-menu-overlay"
          aria-label={t('nav.closeMenu')}
          onClick={() => setMenuAberto(false)}
        />
      )}

      <nav className={`mobile-menu-drawer${menuAberto ? ' mobile-menu-drawer--open' : ''}`} aria-hidden={!menuAberto}>
        <div style={{ padding: '8px 16px 12px', borderBottom: `1px solid ${CORES.vidroBorda}` }}>
          <div style={{ fontSize: 10, color: CORES.brancoMuted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {t('nav.menu')}
          </div>
          {itemAtivoNav && (
            <div style={{ fontSize: 13, color: CORES.dourado, marginTop: 4, fontWeight: 600 }}>{itemAtivoNav.label}</div>
          )}
        </div>
        {itens.map((item) => {
          const Icon = item.icon
          const ativo = itemAtivo(item)
          return (
            <button
              key={item.id}
              type="button"
              className="mobile-menu-item"
              onClick={() => navegar(item.id)}
              style={{
                background: ativo ? 'rgba(223,183,108,0.12)' : 'transparent',
                border: 'none',
                borderBottom: `1px solid rgba(255,255,255,0.05)`,
                color: ativo ? CORES.dourado : CORES.brancoSuave,
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                cursor: 'pointer',
                padding: '16px 20px',
                width: '100%',
                textAlign: 'left',
              }}
            >
              <Icon size={20} strokeWidth={ativo ? 2.2 : 1.8} />
              <span style={{ fontSize: 15, fontWeight: ativo ? 700 : 500, flex: 1 }}>{item.label}</span>
              {ativo && <span style={{ fontSize: 10, color: CORES.dourado }}>✦</span>}
            </button>
          )
        })}
      </nav>
    </>
  )
}

const DADOS_VAZIO = { nome: '', data: '', hora: '', cidade: '', localizacao: null, fuso: null }

export default function App() {
  const isDesktop = useIsDesktop()
  const { t, lang, setLang } = useLanguage()
  const [utilizador, setUtilizador] = useState(null)
  const [authCarregando, setAuthCarregando] = useState(true)
  const [tipoAuth, setTipoAuth] = useState('login') // 'login' | 'register'
  const [isPremium, setIsPremium] = useState(false)
  const [mapaCompleto, setMapaCompleto] = useState(false)
  const [mapaGerado, setMapaGerado] = useState(false) // bloqueio: 1 mapa por utilizador
  const [leiturasTarotUsadas, setLeiturasTarotUsadas] = useState(0)
  const [oraclePerguntasUsadas, setOraclePerguntasUsadas] = useState(0)
  const [perfilCarregando, setPerfilCarregando] = useState(false)
  const [reparandoDados, setReparandoDados] = useState(false)

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

  const mapaDesbloqueado = isPremium || mapaCompleto
  const acessoVip = mapaDesbloqueado
  const contaConfigurada = mapaGerado || dadosNataisCompletos(dados) || acessoVip

  const irPara = useCallback((novoPasso, { replace = false } = {}) => {
    setFerramentaAberta(null)
    let destino = novoPasso
    if (destino === 'onboarding' && utilizador && contaConfigurada) {
      destino = 'home'
    }
    if ((destino === 'bussola' || destino === 'sinastria') && !acessoVip) {
      destino = 'paywall'
    }
    setPasso(destino)
    navigate(pathFromPasso(destino, lang), { replace })
  }, [navigate, utilizador, contaConfigurada, acessoVip, lang])

  // ── Céu de hoje ───────────────────────────────────────────────────────────
  const [ceuAgora, setCeuAgora] = useState(() => calcularPlanetasParaData(new Date()))
  const [aspetosAgora, setAspetosAgora] = useState(() => calcularAspetos(calcularPlanetasParaData(new Date())))

  const sweRef = useRef(null)
  const [sweReady, setSweReady] = useState(false)
  const [motorAstro, setMotorAstro] = useState(_motorStatus)
  const prevUserRef = useRef(undefined)
  const oobCodeTratado = useRef(false)
  const passoRef = useRef(passo)
  useEffect(() => { passoRef.current = passo }, [passo])

  // ── Escuta o estado de autenticação Firebase + perfil em tempo real ─────────
  useEffect(() => {
    if (!firebaseDisponivel || !auth) {
      setAuthCarregando(false)
      setPerfilCarregando(false)
      return undefined
    }

    let unsubPerfil = null
    let authResolvido = false
    let perfilTimeoutId = null

    const clearPerfilTimeout = () => {
      if (perfilTimeoutId) {
        clearTimeout(perfilTimeoutId)
        perfilTimeoutId = null
      }
    }

    const timeoutId = setTimeout(() => {
      if (authResolvido) return
      console.warn('[Sidus] Auth demorou demasiado — a continuar sem bloquear a interface')
      setAuthCarregando(false)
      setPerfilCarregando(false)
    }, 10000)

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      authResolvido = true
      clearTimeout(timeoutId)
      clearPerfilTimeout()
      unsubPerfil?.()
      unsubPerfil = null
      setUtilizador(user)
      if (emailTemPremiumPrivilegiado(user)) {
        setIsPremium(true)
        setMapaCompleto(true)
      }

      if (user) {
        setPerfilCarregando(true)
        perfilTimeoutId = setTimeout(() => {
          console.warn('[Sidus] Perfil cloud demorou — a continuar sem bloquear a interface')
          setPerfilCarregando(false)
        }, 8000)

        unsubPerfil = onSnapshot(
          doc(db, 'users', user.uid),
          (snap) => {
            clearPerfilTimeout()

            if (!snap.exists()) {
              setPerfilCarregando(false)
              return
            }

            ;(async () => {
              try {
                const perfil = snap.data()
                const premium = perfilTemPremium(perfil, user)
                setIsPremium(premium)
                setMapaCompleto(premium || perfil.mapaCompleto === true)
                if (typeof perfil.tarotLeiturasUsadas === 'number') {
                  setLeiturasTarotUsadas(perfil.tarotLeiturasUsadas)
                }
                if (typeof perfil.oraclePerguntasUsadas === 'number') {
                  setOraclePerguntasUsadas(perfil.oraclePerguntasUsadas)
                }

                let dadosPerfil = perfil.dados ? normalizarDadosPerfil(perfil.dados) : null
                const emOnboarding = passoRef.current === 'onboarding'
                const cache = restaurarCachePerfil(user.uid)

                if (!emOnboarding && cache.mapa) {
                  setMapaNatal(cache.mapa)
                }
                if (!dadosPerfil && cache.dados) dadosPerfil = cache.dados

                if (dadosPerfil && dadosNataisMinimos(dadosPerfil)) {
                  const reparado = await repararDadosPerfil(dadosPerfil)
                  if (reparado) {
                    dadosPerfil = reparado
                    const precisaGuardar = JSON.stringify(reparado) !== JSON.stringify(perfil.dados)
                      || !dadosNataisCompletos(perfil.dados)
                    if (precisaGuardar && dadosProntosParaMapa(reparado)) {
                      await setDoc(doc(db, 'users', user.uid), { dados: reparado }, { merge: true })
                    }
                  }
                }
                if (dadosPerfil && !emOnboarding) setDados(dadosPerfil)

                if (perfil.mapaGerado === true || perfil.dadosTravados === true) {
                  setMapaGerado(true)
                } else if (dadosNataisCompletos(dadosPerfil)) {
                  setMapaGerado(true)
                  if (!perfil.dadosTravados || !perfil.mapaGerado) {
                    await setDoc(doc(db, 'users', user.uid), {
                      dados: dadosPerfil,
                      dadosTravados: true,
                      mapaGerado: true,
                    }, { merge: true })
                  }
                }
              } catch (e) {
                console.warn('[Sidus] Firestore indisponível, operando offline:', e?.message)
              } finally {
                setPerfilCarregando(false)
              }
            })()
          },
          (e) => {
            clearPerfilTimeout()
            console.warn('[Sidus] Listener perfil:', e?.message)
            setPerfilCarregando(false)
          },
        )
      } else {
        clearPerfilTimeout()
        setDados(DADOS_VAZIO)
        setMapaNatal(null)
        setPlanetasNascimento([])
        setIsPremium(false)
        setMapaCompleto(false)
        setMapaGerado(false)
        setLeiturasTarotUsadas(0)
        setPerfilCarregando(false)
      }
      setAuthCarregando(false)
    })

    return () => {
      clearTimeout(timeoutId)
      clearPerfilTimeout()
      unsubPerfil?.()
      unsubscribeAuth()
    }
  }, [])

  useEffect(() => { initAdSense() }, [])

  // Firebase email verification link (?mode=verifyEmail&oobCode=...)
  useEffect(() => {
    if (!auth || !firebaseDisponivel || oobCodeTratado.current) return
    const params = new URLSearchParams(location.search)
    const mode = params.get('mode')
    const oobCode = params.get('oobCode')
    if (mode !== 'verifyEmail' || !oobCode) return

    oobCodeTratado.current = true

    ;(async () => {
      try {
        await applyActionCode(auth, oobCode)
        if (auth.currentUser) {
          await reload(auth.currentUser)
          await auth.currentUser.getIdToken(true)
          setUtilizador(auth.currentUser)
        }
        setPagamentoMsg({ tipo: 'sucesso', texto: t('emailVerify.confirmedAuto') })
        const destino = contaConfigurada ? '/home' : '/comecar'
        navigate(destino, { replace: true })
        setPasso(contaConfigurada ? 'home' : 'onboarding')
      } catch (e) {
        console.error('[Sidus] verifyEmail:', e?.message)
        oobCodeTratado.current = false
        setPagamentoMsg({ tipo: 'info', texto: t('emailVerify.confirmedLogin') })
        if (!auth.currentUser) {
          setTipoAuth('login')
          navigate('/login', { replace: true })
        }
      }
    })()
  }, [location.search, navigate, t, contaConfigurada])

  const rotasPublicasSemAuth = new Set(['/login', '/privacidade'])

  // Visitante → /login (exceto privacidade)
  useEffect(() => {
    if (authCarregando) return
    if (utilizador) return
    const params = new URLSearchParams(location.search)
    if (params.get('mode') === 'verifyEmail' && params.get('oobCode')) return
    const path = (location.pathname || '/').replace(/\/$/, '') || '/'
    if (rotasPublicasSemAuth.has(path)) return
    navigate('/login', { replace: true })
  }, [authCarregando, utilizador, location.pathname, location.search, navigate])

  // Após login: contas existentes → perfil; contas novas → onboarding (1x)
  useEffect(() => {
    if (authCarregando || perfilCarregando) return
    const hadUser = prevUserRef.current
    prevUserRef.current = utilizador
    if (!utilizador) return

    const path = (location.pathname || '/').replace(/\/$/, '') || '/'
    if (path === '/login') {
      navigate(contaConfigurada ? '/home' : '/comecar', { replace: true })
      return
    }

    const acabouDeEntrar = hadUser === null || hadUser === undefined
    if (!acabouDeEntrar) return

    if (!contaConfigurada) {
      navigate('/comecar', { replace: true })
      return
    }

    const irParaHome = ['/login', '/home', '/', '/inicio', '/perfil'].includes(path)
    if (irParaHome) {
      navigate('/home', { replace: true })
      setPasso('home')
    }
  }, [authCarregando, perfilCarregando, utilizador, location.pathname, navigate, contaConfigurada])

  // Idioma na URL (/pt/... /en/...)
  useEffect(() => {
    if (authCarregando) return
    const urlLang = langFromPath(location.pathname)
    if (urlLang && urlLang !== lang) setLang(urlLang)
  }, [location.pathname, authCarregando, lang, setLang])

  // URL ↔ passo (voltar atrás no browser, links directos)
  useEffect(() => {
    if (authCarregando) return
    const fromUrl = passoFromPath(location.pathname)
    if (fromUrl !== passo) setPasso(fromUrl)
  }, [location.pathname, authCarregando, passo])

  // Utilizador autenticado com conta configurada — nunca voltar a /comecar
  useEffect(() => {
    if (authCarregando || perfilCarregando || !utilizador || !contaConfigurada) return
    const path = (location.pathname || '/').replace(/\/$/, '') || '/'
    if (path === '/comecar' || passo === 'onboarding') {
      navigate('/home', { replace: true })
      setPasso('home')
    }
  }, [authCarregando, perfilCarregando, utilizador, contaConfigurada, location.pathname, passo, navigate])

  // ── Retorno Stripe Checkout (?payment=success&session_id=...) ─────────────
  useEffect(() => {
    if (authCarregando) return
    const params = new URLSearchParams(location.search)
    const payment = params.get('payment')
    if (!payment) return

    if (payment === 'cancelled') {
      navigate(pathFromPasso(passoFromPath(location.pathname)), { replace: true })
      setPagamentoMsg({ tipo: 'info', texto: t('payment.cancelled') })
      return
    }

    if (payment !== 'success' || !utilizador) return
    const sessionId = params.get('session_id')
    if (!sessionId) return

    ;(async () => {
      try {
        const result = await verificarSessaoPagamento(sessionId, utilizador.uid)
        if (!result.ok) {
          setPagamentoMsg({ tipo: 'erro', texto: t('payment.processing') })
          navigate('/mapaastral', { replace: true })
          return
        }

        if (result.productType === 'premium') {
          setIsPremium(true)
          setMapaCompleto(true)
          const destino = dadosNataisMinimos(dados) ? 'mapa' : 'onboarding'
          setPasso(destino)
          navigate(destino === 'mapa' ? '/mapaastral' : '/comecar', { replace: true })
          setPagamentoMsg({ tipo: 'sucesso', texto: t('payment.premiumWelcome') })
        } else if (result.productType === 'mapa') {
          setMapaCompleto(true)
          const destino = dadosNataisMinimos(dados) ? 'mapa' : 'onboarding'
          setPasso(destino)
          navigate(destino === 'mapa' ? '/mapaastral' : '/comecar', { replace: true })
          setPagamentoMsg({ tipo: 'sucesso', texto: t('payment.mapaUnlocked') })
        } else if (result.productType === 'tarot') {
          sessionStorage.setItem('sidus_tarot_paid', '1')
          setPasso('tarot')
          navigate('/tarot', { replace: true })
          setPagamentoMsg({ tipo: 'sucesso', texto: t('payment.tarotUnlocked') })
        }
        sessionStorage.removeItem('sidus_payment_pending')
      } catch (e) {
        console.error('[Sidus Pagamento] Verificação falhou:', e?.message)
        setPagamentoMsg({ tipo: 'erro', texto: t('payment.verifyFail') })
        navigate('/mapaastral', { replace: true })
      }
    })()
  }, [utilizador, authCarregando, location.search, location.pathname, navigate, t])

  // ── Guarda dados natais no Firestore quando o onboarding termina (1x por conta) ──
  const guardarPerfil = useCallback(async (dadosNovos) => {
    if (!utilizador || !firebaseDisponivel || !db) return false
    const prontos = dadosProntosParaMapa(dadosNovos)
    if (!prontos) return false
    try {
      const ref = doc(db, 'users', utilizador.uid)
      const snap = await getDoc(ref)
      if (snap.exists()) {
        const perfil = snap.data()
        const dadosFirestore = normalizarDadosPerfil(perfil.dados)
        const perfilCompleto = perfil.mapaGerado === true && dadosNataisCompletos(dadosFirestore)
        if (perfilCompleto) return false
      }
      await setDoc(ref, {
        dados: prontos,
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
        try {
          sweRef.current = swe
          const planetas = calcularPlanetasComSwe(swe, new Date(), PLANETAS_AGORA)
          setCeuAgora(planetas)
          setAspetosAgora(calcularAspetos(planetas))
        } catch (e) {
          console.warn('[Sidus] Swiss Ephemeris céu de hoje:', e?.message)
        }
      }
      setSweReady(true)
    }).catch((e) => {
      console.warn('[Sidus] Swiss Ephemeris init:', e?.message)
      setMotorAstro('astronomy-engine')
      setSweReady(true)
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

  // ── Recalcula mapa natal (motor único — gratuito = Premium) ──
  useEffect(() => {
    if (passo === 'onboarding') return
    const prontos = dadosProntosParaMapa(dados)
    if (!prontos) return
    const mapa = calcularMapaNatalMotor(prontos, sweRef.current)
    if (mapa) setMapaNatal(mapa)
  }, [dados, sweReady, passo])

  // Cache local do mapa (fallback quando Firestore tem dados incompletos)
  useEffect(() => {
    if (!utilizador?.uid || !mapaNatal) return
    guardarCachePerfil(utilizador.uid, dados, mapaNatal)
  }, [utilizador, mapaNatal, dados])

  // Reparar dados incompletos — nunca durante /comecar (utilizador a escrever/seleccionar cidade)
  useEffect(() => {
    if (!utilizador || mapaNatal || !dadosNataisMinimos(dados)) return
    if (dadosProntosParaMapa(dados)) return
    if (passo === 'onboarding') return

    let cancelled = false
    setReparandoDados(true)
    ;(async () => {
      try {
        const reparado = await repararDadosPerfil(dados)
        if (cancelled || !reparado) return
        if (JSON.stringify(reparado) !== JSON.stringify(dados)) {
          setDados(reparado)
          if (firebaseDisponivel && db && dadosProntosParaMapa(reparado)) {
            await setDoc(doc(db, 'users', utilizador.uid), { dados: reparado }, { merge: true })
          }
        }
      } catch (e) {
        console.warn('[Sidus] Reparação de dados:', e?.message)
      } finally {
        if (!cancelled) setReparandoDados(false)
      }
    })()

    return () => {
      cancelled = true
      setReparandoDados(false)
    }
  }, [utilizador, mapaNatal, dados, passo])

  // ── Planetas de nascimento ──────────────────────────────────────────────────
  useEffect(() => {
    const prontos = dadosProntosParaMapa(dados)
    if (!prontos) { setPlanetasNascimento([]); return }
    const dataUTC = criarDataUTCporLocal(prontos.data, prontos.hora, prontos.fuso ?? 0)
    setPlanetasNascimento(sweRef.current
      ? calcularPlanetasComSwe(sweRef.current, dataUTC, PLANETAS_NATAL)
      : calcularPlanetasNatalParaData(dataUTC))
  }, [dados, sweReady])

  // ── Acções ─────────────────────────────────────────────────────────────────
  const handleOnboarding = async () => {
    if (mapaGerado && dadosNataisCompletos(dados) && mapaNatal) {
      irPara('perfil', { replace: true })
      return
    }
    const erros = validarOnboarding(dados)
    if (Object.keys(erros).length > 0) return

    const prontos = dadosProntosParaMapa(dados)
    if (!prontos) return

    const mapa = calcularMapaNatalMotor(prontos, sweRef.current)
    if (mapa) setMapaNatal(mapa)
    const guardado = await guardarPerfil(dados)
    setMapaGerado(true)
    irPara('mapa', { replace: !guardado })
  }

  const registarLeituraTarotGratis = useCallback(async (total) => {
    setLeiturasTarotUsadas(total)
    if (!utilizador || !firebaseDisponivel || !db) return
    try {
      await setDoc(doc(db, 'users', utilizador.uid), { tarotLeiturasUsadas: total }, { merge: true })
    } catch { /* offline */ }
  }, [utilizador])

  const registarOraclePerguntaUsada = useCallback(async (total) => {
    setOraclePerguntasUsadas(total)
    if (!utilizador || !firebaseDisponivel || !db) return
    try {
      await setDoc(doc(db, 'users', utilizador.uid), { oraclePerguntasUsadas: total }, { merge: true })
    } catch { /* offline */ }
  }, [utilizador])

  const obterIdTokenOracle = useCallback(async () => {
    if (!utilizador) return null
    try {
      return await utilizador.getIdToken()
    } catch {
      return null
    }
  }, [utilizador])

  const handleLogout = async () => {
    if (firebaseDisponivel && auth) await signOut(auth)
    setUtilizador(null)
    setTipoAuth('login')
    navigate('/login', { replace: true })
    setPasso('login')
  }

  const handleFerramenta = (f) => {
    irPara(f.id)
  }

  const abrirPagamento = (descricao, valor, onSucesso, opts = {}) => {
    if (!utilizador?.uid) {
      setPagamentoMsg({ tipo: 'erro', texto: t('pagamento.needLogin') })
      return false
    }
    const productType = opts.productType || null
    setModalPagamento({ descricao, valor, onSucesso, productType })
    return true
  }

  // Activa premium em modo dev (só localhost — não escreve isPremium em produção)
  const togglePremiumDev = async (valor) => {
    setIsPremium(valor)
    if (valor) setMapaCompleto(true)
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

  const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'

  const mostrarNavbar = utilizador && contaConfigurada && passo !== 'paywall'
  const chatFullScreen = passo === 'chat'

  // Ecrã de carregamento (auth ou perfil Firestore)
  if (authCarregando || (utilizador && perfilCarregando)) {
    return (
      <div style={{ ...estilos.app, display: 'flex', flexDirection: 'column', minHeight: '100svh' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 20px' }}>
          <Loader2 size={36} color={CORES.dourado} strokeWidth={1.5} style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ color: CORES.brancoMuted, marginTop: 16, fontSize: 14, textAlign: 'center' }}>{t('common.loading')}</p>
        </div>
        <RodapeSidus isDesktop={isDesktop} mostrarNavbar={false} />
      </div>
    )
  }

  const renderEcran = () => {
    if (passo === 'privacidade' && utilizador) {
      return <PoliticaPrivacidade onVoltar={() => irPara('perfil')} />
    }
    // Sem sessão → ecrã de login em /login
    if (!utilizador) {
      if (passo === 'privacidade') {
        return <PoliticaPrivacidade onVoltar={() => navigate('/login', { replace: true })} />
      }
      return <EcraAuth tipo={tipoAuth} onMudar={setTipoAuth} isDesktop={isDesktop} firebaseOk={firebaseDisponivel} />
    }
    if (precisaVerificarEmail(utilizador)) {
      return (
        <EcraVerificarEmail
          utilizador={utilizador}
          isDesktop={isDesktop}
          onLogout={handleLogout}
          onVerificado={() => {
          reload(auth.currentUser).then(() => {
            setUtilizador(auth.currentUser)
          }).catch(() => {})
        }}
        />
      )
    }
    // /comecar — só contas novas sem mapa (utilizadores com sessão activa redireccionados)
    if (passo === 'onboarding') {
      return <Onboarding dados={dados} setDados={setDados} onSubmit={handleOnboarding} isDesktop={isDesktop} />
    }
    if (!contaConfigurada) {
      return <Onboarding dados={dados} setDados={setDados} onSubmit={handleOnboarding} isDesktop={isDesktop} />
    }
    // Autenticado com mapa → navegação normal
    switch (passo) {
      case 'home':
      case 'dashboard':
        return <Dashboard nome={dados.nome} mapaNatal={mapaNatal} ceuAgora={ceuAgora} aspetos={aspetosAgora} onOraculo={() => irPara('chat')} onPrivacidade={() => irPara('privacidade')} isDesktop={isDesktop} isPremium={isPremium} onUpgrade={() => irPara('paywall')} onTarot={() => irPara('tarot')} userEmail={utilizador?.email} />
      case 'mapa':
        return <MapaAstral mapaNatal={mapaNatal} dados={dados} planetasNascimento={planetasNascimento} mapaDesbloqueado={isPremium || mapaCompleto} isPremium={isPremium} onUpgrade={() => irPara('paywall')} onComprarMapa={() => abrirPagamento(t('mapa.buyDesc'), PRECO_MAPA_COMPLETO, null, { productType: 'mapa' })} onMapaGerado={handleMapaGerado} isDesktop={isDesktop} motorAstro={motorAstro} perfilCarregando={perfilCarregando} reparandoDados={reparandoDados} mapaGerado={mapaGerado} onCompletarNatal={() => irPara('home')} />
      case 'tarot':
        return <EcraTarot mapaNatal={mapaNatal} isPremium={acessoVip} userId={utilizador?.uid} leiturasTarotUsadas={leiturasTarotUsadas} onLeituraGratisUsada={registarLeituraTarotGratis} onPagar={abrirPagamento} onVoltar={() => irPara('home')} onPremium={() => irPara('paywall')} />
      case 'bussola':
        return <BussolaCosmica mapaNatal={mapaNatal} onVoltar={() => irPara('home')} />
      case 'sinastria':
        return <Sinastria mapaNatal={mapaNatal} onVoltar={() => irPara('home')} />
      case 'biorritmo':
        return <Biorritmo dados={dados} utilizador={utilizador} mapaNatal={mapaNatal} onVoltar={() => irPara('home')} />
      case 'horasIguais':
        return <HorasIguais onVoltar={() => irPara('home')} />
      case 'numerologia':
        return <Numerologia dados={dados} utilizador={utilizador} mapaNatal={mapaNatal} onVoltar={() => irPara('home')} />
      case 'sonhos':
        return <InterpretacaoSonhos mapaNatal={mapaNatal} onVoltar={() => irPara('home')} />
      case 'diario':
        return <DiarioAstral mapaNatal={mapaNatal} onVoltar={() => irPara('home')} />
      case 'ferramentas':
        return <Ferramentas onFerramenta={handleFerramenta} isDesktop={isDesktop} acessoVip={acessoVip} />
      case 'paywall':
        return <Paywall onVoltar={() => irPara('ferramentas')} onPagar={abrirPagamento} onSucesso={() => { setIsPremium(true); setMapaCompleto(true); irPara(dadosNataisMinimos(dados) ? 'mapa' : 'onboarding') }} isDesktop={isDesktop} />
      case 'chat':
        return <Chat mapaNatal={mapaNatal} isPremium={acessoVip} userId={utilizador?.uid} oracleRemotas={oraclePerguntasUsadas} onOracleUsada={registarOraclePerguntaUsada} onUpgrade={() => irPara('paywall')} obterIdToken={obterIdTokenOracle} />
      case 'perfil':
        return <Perfil utilizador={utilizador} dados={dados} mapaNatal={mapaNatal} isPremium={isPremium}
          dadosBloqueados={dadosBloqueados}
          onLogout={handleLogout} />
      default:
        return <Dashboard nome={dados.nome} mapaNatal={mapaNatal} ceuAgora={ceuAgora} aspetos={aspetosAgora} onOraculo={() => irPara('chat')} onPrivacidade={() => irPara('privacidade')} isDesktop={isDesktop} isPremium={isPremium} onUpgrade={() => irPara('paywall')} onTarot={() => irPara('tarot')} userEmail={utilizador?.email} />
    }
  }

  const paddingTopo = mostrarNavbar
    ? 56
    : (isDev && contaConfigurada ? (isDesktop ? 28 : 30) : 0)

  const shellStyle = isDesktop ? estilos.appDesktop : estilos.app
  const margemNav = 0

  return (
    <div style={shellStyle}>
      {!mostrarNavbar && <LanguageSwitcher />}
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
          }}>{t('payment.close')}</button>
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
      {utilizador && !['login', 'onboarding', 'privacidade', 'paywall'].includes(passo) && (
        <AdSenseBanner />
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
          productType={modalPagamento.productType}
          onSucesso={() => { modalPagamento.onSucesso?.(); setModalPagamento(null) }}
          onFechar={() => setModalPagamento(null)}
        />
      )}
    </div>
  )
}
