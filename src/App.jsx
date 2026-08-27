import { useState, useEffect, useRef, useCallback, useMemo, Suspense } from 'react'
import {
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
  MessageCircle,
  Sun,
  ArrowUp,
  ArrowDown,
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
  History,
} from 'lucide-react'
import { Body, GeoVector, Ecliptic, MakeTime, SiderealTime } from 'astronomy-engine'
import { pesquisarCidades, pesquisarFusoHorario, geocodificarCidade } from './lib/geocoding'
import { ModalPagamento, verificarSessaoPagamento } from './components/Pagamento'
import { PRECO_MAPA_COMPLETO, PRECO_PREMIUM_UNICO, PRECO_PREMIUM_BR_PIX_BRL, precoPremiumVitrine, formatPrecoEuro, formatPrecoCompleto } from './lib/pricing.js'
import { getPremiumPriceLabels } from './lib/premiumPricingLabels.js'
import { useGeoCountry } from './hooks/useGeoCountry.js'
import { RecaptchaCheckbox } from './components/Recaptcha'
import { Perfil } from './components/Perfil'
import { VipPromoPage } from './components/VipPromoPage.jsx'
import { PoliticaPrivacidade } from './components/PoliticaPrivacidade'
import { InterpretacaoMapa } from './components/InterpretacaoMapa'
import { ConteudoDinamicoSidus } from './components/ConteudoDinamicoSidus'
import { AstroNewsCarousel } from './components/AstroNewsCarousel'
import { LandingCosmicBackground } from './components/LandingCosmicBackground.jsx'
import { LandingBirthPortal } from './components/LandingBirthPortal.jsx'
import { LandingConversionHead } from './components/LandingConversionHead.jsx'
import { LandingWhySidus } from './components/LandingWhySidus.jsx'
import { LandingAuthModal } from './components/LandingAuthModal.jsx'
import { LandingPlansOverview } from './components/LandingPlansOverview.jsx'
import { LandingTopBar } from './components/LandingTopBar.jsx'
import { SidusLogo } from './components/SidusLogo.jsx'
import { SidusConstellationMark } from './components/SidusConstellationMark.jsx'
import { LandingFaq } from './components/LandingFaq.jsx'
import { LandingSkyLive } from './components/LandingSkyLive.jsx'
import { LandingReviews } from './components/LandingReviews.jsx'
import { LandingGuides } from './components/LandingGuides.jsx'
import { BannerBrasil } from './components/BannerBrasil.jsx'
import { HeroHomeSidus } from './components/HeroHomeSidus.jsx'
import { LeituraGratisDiaria } from './components/LeituraGratisDiaria.jsx'
import { ShareSigno } from './components/ShareSigno.jsx'
import { EnergiaDoDia, TransitoSemanal } from './components/EnergiaDoDia.jsx'
import { VipPaywallBody } from './components/VipPaywallBody.jsx'
import { PremiumHomeTeaser } from './components/PremiumHomeTeaser.jsx'
import { HomeSkyRadio } from './components/HomeSkyRadio.jsx'
import { applyRouteSeo } from './lib/routeSeo.js'
import { ErrorBoundary } from './components/ErrorBoundary.jsx'
import { MagicCursorTrail } from './components/MagicCursorTrail.jsx'
import { OracleChatAvatar } from './components/OracleChatAvatar.jsx'
import { auth, db, firebaseDisponivel, firebaseReady } from './lib/firebase'
import { enviarEmailVerificacao, enviarEmailRecuperacaoSenha, traduzirErroEmail } from './lib/authEmail'
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
import { atribuirCasasPlanetas } from './lib/casasPlacidus.js'
import { gerarAnaliseCompleta, gerarResumoGratuito, mapaPlanetasProntos } from './lib/mapaInterpretacao.js'
import { calcularFaseLua } from './lib/faseLua.js'
import { gerarHoroscopoSignoTransito } from './lib/horoscopoDiarioTransitos.js'
import { useNavigate, useLocation } from 'react-router-dom'
import { passoFromPath, pathFromPasso, langFromPath, stripLangPrefix } from './lib/routes.js'
import { initGoogleAnalytics } from './lib/googleAnalytics.js'
import { trackMapaConversion, trackSignupConversion, trackPurchaseConversion } from './lib/googleAds.js'
import { captureLandingAdsAttribution } from './lib/landingAdsContext.js'
import { LandingAdsPromoBar } from './components/LandingAdsPromoBar.jsx'
import { initAdSense, shouldShowAdsOnPasso } from './lib/adsense.js'
import { AdSenseBanner } from './components/AdSenseBanner.jsx'
import { CookieConsent } from './components/CookieConsent.jsx'
import { allowsAds, getCookieConsent } from './lib/cookieConsent.js'
import { LanguageSwitcher } from './components/LanguageSwitcher.jsx'
import { useLanguage } from './lib/i18n/LanguageContext.jsx'
import { readLandingDraft, clearLandingDraft, mergeLandingDraft, hasLandingDraft, flushLandingDraft } from './lib/landingDraft.js'
import { MobileBottomNav } from './components/MobileBottomNav.jsx'
import { HomeParaTiHoje } from './components/HomeParaTiHoje.jsx'
import { LandingStickyCta } from './components/LandingStickyCta.jsx'
import { LandingPdfShowcase } from './components/LandingPdfShowcase.jsx'
import { LandingExitIntent } from './components/LandingExitIntent.jsx'
import { useLandingCtaVariant } from './hooks/useLandingCtaVariant.js'
import { useLandingMapaPreview } from './hooks/useLandingMapaPreview.js'
import { warmupLandingMapaMotor } from './lib/landingMapaMotor.js'
import { MapaPaywallSections } from './components/MapaPaywallSections.jsx'
import { lazyWithRetry, importWithRetry } from './lib/lazyWithRetry.js'

const EcraTarotLazy = lazyWithRetry(() => import('./components/Tarot.jsx').then((m) => ({ default: m.EcraTarot })))
const MandalaNatalLazy = lazyWithRetry(() => import('./components/MandalaNatal.jsx').then((m) => ({ default: m.MandalaNatal })))
const BussolaCosmicaLazy = lazyWithRetry(() => import('./components/FerramentasPremium.jsx').then((m) => ({ default: m.BussolaCosmica })))
const SinastriaLazy = lazyWithRetry(() => import('./components/FerramentasPremium.jsx').then((m) => ({ default: m.Sinastria })))
const BiorritmoLazy = lazyWithRetry(() => import('./components/FerramentasPremium.jsx').then((m) => ({ default: m.Biorritmo })))
const DiarioAstralLazy = lazyWithRetry(() => import('./components/FerramentasPremium.jsx').then((m) => ({ default: m.DiarioAstral })))
const NumerologiaLazy = lazyWithRetry(() => import('./components/FerramentasPremium.jsx').then((m) => ({ default: m.Numerologia })))
const InterpretacaoSonhosLazy = lazyWithRetry(() => import('./components/FerramentasPremium.jsx').then((m) => ({ default: m.InterpretacaoSonhos })))
const HorasIguaisLazy = lazyWithRetry(() => import('./components/FerramentasPremium.jsx').then((m) => ({ default: m.HorasIguais })))

function RouteLoader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 20px' }}>
      <Loader2 size={28} color="#DFB76C" className="spin-icon" />
    </div>
  )
}
import { validarOnboarding } from './lib/i18n/validation.js'
import { traduzirErroAuth } from './lib/i18n/authErrors.js'
import { labelBarraCurto, tituloSecaoMapa } from './lib/i18n/labelUtil.js'
import { getFerramentas } from './lib/i18n/ferramentasData.js'
import {
  validarPerguntaOracle, gerarRespostaOracle,
  getChatGreeting,
} from './lib/i18n/oracle.js'
import { consultarOracleServidor, interpretarMapaServidor } from './lib/apiAi.js'
import { formatSkyPosition } from './lib/i18n/astro.js'
import { normalizarDataISO, criarDataUTCporLocal, localToUTC } from './lib/datetime.js'
import { readMapaIACache, writeMapaIACache, interpretacaoValidaParaMapa, gerarChaveMapa, analiseMapaValida, contarPalavrasAnalise } from './lib/mapaInterpretacaoCache.js'
import { calcularAngulosCasas } from './lib/natalHouses.js'
import { utilizadorTemPremium, emailTemPremiumPrivilegiado } from './lib/premiumAccess.js'
import {
  MAX_ORACLE_GRATIS, oraclePerguntasUsadas as contarOraclePerguntas, registarOraclePergunta, sincronizarOraclePerguntas,
} from './lib/oracleLimit.js'
import {
  carregarSessoesOracle,
  criarSessaoOracle,
  actualizarSessaoOracle,
  upsertSessaoOracle,
  guardarSessoesOracle,
  removerSessaoOracle,
  temRespostaOracle,
  formatarDataSessao,
} from './lib/oracleHistory.js'

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

// sweId = Planet enum de @swisseph/core (Sun=0, Moon=1, …, Saturn=6; Lilith=12)
const PLANETAS_AGORA = [
  { key: 'sol',      nome: 'Sol',      corpo: Body.Sun,     sweId: 0, simbolo: '☉' },
  { key: 'lua',      nome: 'Lua',      corpo: Body.Moon,    sweId: 1, simbolo: '☽' },
  { key: 'mercurio', nome: 'Mercúrio', corpo: Body.Mercury, sweId: 2, simbolo: '☿' },
  { key: 'venus',    nome: 'Vénus',    corpo: Body.Venus,   sweId: 3, simbolo: '♀' },
  { key: 'marte',    nome: 'Marte',    corpo: Body.Mars,    sweId: 4, simbolo: '♂' },
  { key: 'jupiter',  nome: 'Júpiter',  corpo: Body.Jupiter, sweId: 5, simbolo: '♃' },
  { key: 'saturno',  nome: 'Saturno',  corpo: Body.Saturn,  sweId: 6, simbolo: '♄' },
]

// Mapa natal completo - Swiss Ephemeris (swe_calc_ut) com efemérides licenciadas
const PLANETAS_NATAL = [
  ...PLANETAS_AGORA,
  { key: 'urano',    nome: 'Urano',      corpo: Body.Uranus,  sweId: 7,  simbolo: '♅' },
  { key: 'netuno',   nome: 'Neptuno',    corpo: Body.Neptune, sweId: 8,  simbolo: '♆' },
  { key: 'plutao',   nome: 'Plutão',     corpo: Body.Pluto,   sweId: 9,  simbolo: '♇' },
  { key: 'nodo',     nome: 'Nodo Norte', corpo: null,         sweId: 11, simbolo: '☊' },
  { key: 'lilith',   nome: 'Lilith',     corpo: null,         sweId: 12, simbolo: '⚸' },
  { key: 'quiron',   nome: 'Quíron',     corpo: null,         sweId: 15, simbolo: '⚷' },
]

const DESKTOP_BP = 768
const MOBILE_MAX = 480

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

// ─── Swiss Ephemeris - inicialização async isolada (dynamic import) ──────────
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

// Efemérides Swiss servidas localmente (public/ephe/) - sem CORS, sem CDN externo
// Ficheiros: sepl_18.se1 (planetas), semo_18.se1 (Lua), seas_18.se1 (asteróides)
// Cobertura 1800-2400, precisão ≤ 1 arco-segundo (equivalente Astro.com / Astrolink)
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
    background: 'transparent',
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
    background: 'transparent',
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
    position: 'relative',
    zIndex: 2,
    background: 'rgba(11, 7, 30, 0.88)',
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
    gap: 12,
    padding: '10px 16px',
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
    gap: 10,
    padding: '10px 58px 10px 18px',
    paddingTop: 'max(10px, env(safe-area-inset-top, 10px))',
    background: 'rgba(11, 7, 30, 0.96)',
    backdropFilter: 'blur(20px)',
    borderBottom: `1px solid ${CORES.vidroBorda}`,
    zIndex: 150,
    boxSizing: 'border-box',
    flexWrap: 'nowrap',
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
  const n = Number(longitude)
  if (!Number.isFinite(n)) return { ...SIGNOS[0], graus: '0.0000', longitude: 0 }
  const lon = ((n % 360) + 360) % 360
  const idx = Math.min(11, Math.max(0, Math.floor(lon / 30)))
  const grausNoSigno = lon % 30
  return { ...SIGNOS[idx], graus: grausNoSigno.toFixed(4), longitude: lon }
}

function mapaNatalValido(mapa) {
  return Boolean(mapa?.solar?.nome && mapa?.lunar?.nome && mapa?.ascendente?.nome)
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
      // Diferença de longitude eclíptica - correcto para aspectos astrológicos
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

function calcularMapaNatal(dados) {
  if (!dados.data || !dados.hora || !dados.localizacao) return null

  const { lat, lon } = dados.localizacao
  const fuso = dados.fuso ?? 0
  const dataUTC = criarDataUTCporLocal(dados.data, dados.hora, fuso)
  if (!dataUTC) return null
  const time = MakeTime(dataUTC)

  const lonSol = Ecliptic(Position(Body.Sun, time)).elon
  const lonLua = Ecliptic(Position(Body.Moon, time)).elon

  const angulos = calcularAngulosCasas(null, dataUTC, lat, lon)
  if (!angulos) return null

  return {
    solar:      longitudeParaSigno(lonSol),
    lunar:      longitudeParaSigno(lonLua),
    ascendente: longitudeParaSigno(angulos.ascendant),
    descendente: longitudeParaSigno(angulos.descendente),
    mc:         longitudeParaSigno(angulos.mc),
    ic:         longitudeParaSigno(angulos.ic),
    cusps:      angulos.cusps,
    sistema:    angulos.sistema,
    instanteUTC: dataUTC.toISOString(),
    lat,
    lon,
    fuso,
    motor: 'astronomy-engine + Meeus',
  }
}

// ─── Swiss Ephemeris - funções de cálculo ────────────────────────────────────

/**
 * Posições via swe_calc_ut (Swiss Ephemeris) - só após efemérides carregadas.
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
    if (!dateUTC) return null
    const angulos = calcularAngulosCasas(swe, dateUTC, lat, lon)
    if (!angulos) return null

    const jd = angulos.jd ?? swe.dateToJulianDay(dateUTC)
    const sunPos  = swe.calculatePosition(jd, 0)
    const moonPos = swe.calculatePosition(jd, 1)

    const motorLabel =
      _motorStatus === 'swisseph-full'
        ? 'Swiss Ephemeris JPL · Tropical Placidus'
        : _motorStatus === 'swisseph-moshier'
          ? 'Swiss Ephemeris Moshier · Tropical Placidus'
          : 'astronomy-engine + Meeus'

    console.info(
      `[Sidus] JD=${jd.toFixed(8)} · UTC=${dateUTC.toISOString()} · lat=${lat.toFixed(6)} lon=${lon.toFixed(6)}` +
      ` · fuso=${typeof fuso === 'string' ? fuso : fuso}` +
      ` · Asc=${angulos.ascendant.toFixed(6)}° DC=${angulos.descendente.toFixed(6)}° MC=${angulos.mc.toFixed(6)}°`
    )

    return {
      solar:      longitudeParaSigno(sunPos.longitude),
      lunar:      longitudeParaSigno(moonPos.longitude),
      ascendente: longitudeParaSigno(angulos.ascendant),
      descendente: longitudeParaSigno(angulos.descendente),
      mc:         longitudeParaSigno(angulos.mc),
      ic:         longitudeParaSigno(angulos.ic),
      cusps:      angulos.cusps,
      sistema:    angulos.sistema,
      jd,
      instanteUTC: dateUTC.toISOString(),
      lat, lon, fuso,
      motor: motorLabel,
    }
  } catch (e) {
    console.warn('[Sidus] Swiss Ephemeris mapa natal falhou:', e?.message)
    return null
  }
}

/** Motor único - mesma matemática para gratuito e Premium (SWE → Meeus fallback). */
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

function asStrDados(val) {
  if (typeof val === 'string') return val
  if (val == null) return ''
  return String(val)
}

function normalizarDadosPerfil(dados) {
  if (!dados || typeof dados !== 'object' || Array.isArray(dados)) return null
  const d = {
    nome: '',
    data: '',
    hora: '',
    cidade: '',
    localizacao: null,
    fuso: null,
    ...dados,
  }
  d.nome = asStrDados(d.nome)
  d.data = asStrDados(d.data)
  d.hora = asStrDados(d.hora)
  d.cidade = asStrDados(d.cidade)
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
    if (mapaNatalValido(mapa)) localStorage.setItem(chaveCacheMapa(uid), JSON.stringify(mapa))
  } catch { /* quota */ }
}

function restaurarCachePerfil(uid) {
  if (!uid) return { dados: null, mapa: null }
  try {
    const dadosRaw = localStorage.getItem(chaveCacheDados(uid))
    const mapaRaw = localStorage.getItem(chaveCacheMapa(uid))
    return {
      dados: dadosRaw ? normalizarDadosPerfil(JSON.parse(dadosRaw)) : null,
      mapa: mapaRaw ? (() => { const m = JSON.parse(mapaRaw); return mapaNatalValido(m) ? m : null })() : null,
    }
  } catch {
    return { dados: null, mapa: null }
  }
}

async function repararDadosPerfil(dados) {
  const d = normalizarDadosPerfil(dados)
  if (!d || !dadosNataisMinimos(d)) return d
  try {
    // Não geocodificar - preservar lat/lon escolhidos no onboarding
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

function tarotPreVerifyUsado() {
  try { return sessionStorage.getItem('sidus_preverify_tarot_used') === '1' } catch { return false }
}

function marcarTarotPreVerifyUsado() {
  try { sessionStorage.setItem('sidus_preverify_tarot_used', '1') } catch { /* ignore */ }
}

function bloqueadoPorEmailNaoVerificado(user, passoAtual) {
  if (!precisaVerificarEmail(user)) return false
  if (passoAtual === 'tarot' && !tarotPreVerifyUsado()) return false
  return true
}

async function inicializarPerfilUsuario(user) {
  if (!db || !firebaseDisponivel || !user?.uid) return

  await setDoc(doc(db, 'users', user.uid), {
    email: user.email || null,
    tarotLeiturasUsadas: 0,
    oraclePerguntasUsadas: 0,
  }, { merge: true })
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

  useEffect(() => {
    if (!valor) {
      setDia('')
      setMes('')
      setAno('')
      return
    }
    const [y, m, d] = valor.split('-')
    setAno(y || '')
    setMes(m || '')
    setDia(d || '')
  }, [valor])

  useEffect(() => {
    if (dia.length === 2 && mes.length === 2 && ano.length === 4) {
      onChange(`${ano}-${mes}-${dia}`)
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
      const email = await enviarEmailVerificacao(utilizador, lang)
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
    enviarEmailVerificacao(auth.currentUser, lang)
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
        {hasLandingDraft() && (
          <p style={{ fontSize: 12, color: '#34D399', maxWidth: 360, margin: '12px auto 0', lineHeight: 1.55 }}>
            {t('emailVerify.draftSaved')}
          </p>
        )}
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
  const birthFormRef = useRef(null)
  const conversionZoneRef = useRef(null)
  const [funnelStep, setFunnelStep] = useState('birth')
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState('login')
  const [email, setEmail]       = useState('')
  const [senha, setSenha]       = useState('')
  const [senhaConfirm, setSenhaConfirm] = useState('')
  const [verSenha, setVerSenha] = useState(false)
  const [verSenhaConfirm, setVerSenhaConfirm] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro]         = useState(null)
  const [info, setInfo]         = useState(null)
  const [recaptchaOk, setRecaptchaOk] = useState(false)
  const [recaptchaKey, setRecaptchaKey] = useState(0)
  const [draftTick, setDraftTick] = useState(0)
  const { label: ctaLabel, trackClick: trackCtaClick } = useLandingCtaVariant()
  const draftRegisto = useMemo(() => readLandingDraft(), [draftTick, authModalOpen])
  const { mapa: mapaPreview, carregando: mapaCarregando } = useLandingMapaPreview(draftRegisto)

  const traduzirErro = (code) => traduzirErroAuth(code, lang)

  useEffect(() => {
    onMudar('register')
    captureLandingAdsAttribution()
    warmupLandingMapaMotor()
    setRecaptchaOk(false)
    setRecaptchaKey((k) => k + 1)
    setErro(null)
    setInfo(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    document.title = `Sidusastro - ${t('auth.register')}`
    return () => { document.title = 'Sidusastro - O Seu Guia Cósmico' }
  }, [t])

  const handleSubmit = async () => {
    setErro(null)
    setInfo(null)
    if (!email || !senha) { setErro(t('auth.fillAll')); return }
    if (senha !== senhaConfirm) { setErro(t('auth.passwordsMismatch')); return }
    if (!recaptchaOk) { setErro(t('auth.confirmRobot')); return }
    if (senha.length < 6) { setErro(t('auth.passwordMin')); return }
    if (!auth) { setErro(t('auth.firebaseMissing')); return }
    flushLandingDraft()
    setCarregando(true)
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, senha)
      try {
        await enviarEmailVerificacao(cred.user, lang)
      } catch (emailErr) {
        console.warn('[Sidus Auth] Email verificação:', emailErr?.code, emailErr?.message)
      }
      setInfo(t('auth.accountCreated'))
      trackSignupConversion()
      setAuthModalOpen(false)
    } catch (e) {
      console.error('[Sidus Auth] Erro:', e.code, e.message)
      setErro(traduzirErro(e.code) + (e.code ? ` [${e.code}]` : ''))
      setRecaptchaKey((k) => k + 1)
    } finally {
      setCarregando(false)
    }
  }

  const handleGoogleSignup = async () => {
    if (!auth) { setErro(t('auth.firebaseMissing')); return }
    if (!recaptchaOk) { setErro(t('auth.confirmRobot')); return }
    flushLandingDraft()
    setErro(null)
    setInfo(null)
    setCarregando(true)
    try {
      await signInWithPopup(auth, new GoogleAuthProvider())
      trackSignupConversion('google')
      setAuthModalOpen(false)
    } catch (e) {
      console.error('[Sidus Google] Erro:', e.code, e.message)
      if (e.code !== 'auth/popup-closed-by-user') setErro(traduzirErro(e.code) + ` [${e.code}]`)
      setRecaptchaKey((k) => k + 1)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    if (window.location.hash !== '#guias') return
    const scroll = () => document.getElementById('guias')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    requestAnimationFrame(scroll)
    const timer = window.setTimeout(scroll, 400)
    return () => window.clearTimeout(timer)
  }, [])

  const goToBirthForm = useCallback(() => {
    setFunnelStep('birth')
    window.setTimeout(() => {
      document.getElementById('landing-birth-portal')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
  }, [])

  const handleBirthComplete = useCallback(() => {
    trackMapaConversion()
    setDraftTick((n) => n + 1)
    setAuthModalMode('register')
    setAuthModalOpen(true)
  }, [])

  const openLoginModal = useCallback((e) => {
    e?.preventDefault?.()
    e?.stopPropagation?.()
    setAuthModalMode('login')
    setAuthModalOpen(true)
  }, [])

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false)
  }, [])

  const handleAuthSwitchMode = useCallback((mode) => {
    setAuthModalMode(mode)
  }, [])

  const handleRegisterNavigate = useCallback(() => {
    if (hasLandingDraft()) {
      setAuthModalMode('register')
      setAuthModalOpen(true)
    } else {
      setAuthModalOpen(false)
      goToBirthForm()
    }
  }, [goToBirthForm])

  const handleFunnelCta = useCallback(() => {
    trackCtaClick('funnel')
    goToBirthForm()
  }, [goToBirthForm, trackCtaClick])

  const registerModalOpen = authModalOpen && authModalMode === 'register'

  return (
    <>
      <LandingAuthModal
        open={authModalOpen}
        mode={authModalMode}
        onClose={closeAuthModal}
        onSwitchMode={handleAuthSwitchMode}
        onRegisterNavigate={handleRegisterNavigate}
        firebaseOk={firebaseOk}
        mapaPreview={mapaPreview}
        mapaCarregando={mapaCarregando}
        nomeUtilizador={draftRegisto?.nome || ''}
        registerEmail={email}
        setRegisterEmail={setEmail}
        registerSenha={senha}
        setRegisterSenha={setSenha}
        registerSenhaConfirm={senhaConfirm}
        setRegisterSenhaConfirm={setSenhaConfirm}
        registerVerSenha={verSenha}
        setRegisterVerSenha={setVerSenha}
        registerVerSenhaConfirm={verSenhaConfirm}
        setRegisterVerSenhaConfirm={setVerSenhaConfirm}
        recaptchaOk={recaptchaOk}
        setRecaptchaOk={setRecaptchaOk}
        recaptchaKey={recaptchaKey}
        registerErro={erro}
        registerInfo={info}
        registerCarregando={carregando}
        onSignup={handleSubmit}
        onGoogleSignup={handleGoogleSignup}
      />
      <LandingExitIntent
        enabled={funnelStep === 'birth'}
        onContinue={goToBirthForm}
      />
      <div className={`landing-auth-layout${isDesktop ? ' landing-auth-layout--desktop' : ' landing-auth-layout--mobile'}`} translate="yes">
        <BannerBrasil />
        <LandingAdsPromoBar />
        <LandingStickyCta
          targetRef={conversionZoneRef}
          hideWhenRef={birthFormRef}
          onCta={handleFunnelCta}
          ctaLabel={ctaLabel}
          enabled={funnelStep === 'birth'}
        />
        <div className="landing-top-stack">
          <LandingTopBar onLogin={openLoginModal} />
          <div className={`${isDesktop ? 'landing-sky-desktop-wrap landing-sky-desktop-wrap--compact' : 'landing-sky-mobile-wrap landing-sky-mobile-wrap--compact'}`}>
            <LandingSkyLive compact={isDesktop} mobileLineOnly={!isDesktop} />
          </div>
        </div>
        <section
          ref={conversionZoneRef}
          className={`landing-conversion-zone${isDesktop ? ' landing-conversion-zone--desktop' : ''}`}
          aria-label={t('auth.portal.conversionAria')}
        >
          <div className="landing-conversion-zone__hero">
            <LandingConversionHead compact={funnelStep !== 'birth'} />
          </div>

          {(funnelStep === 'birth' || isDesktop) && (
            <div className="landing-conversion-zone__why">
              <LandingWhySidus />
            </div>
          )}

          <div className="landing-conversion-zone__funnel">
            <div className="landing-hero-stack landing-hero-stack--funnel">
              {funnelStep === 'birth' && (
                <div ref={birthFormRef}>
                  <LandingBirthPortal
                    isDesktop={isDesktop}
                    onSaved={handleBirthComplete}
                    onOpenLogin={openLoginModal}
                    onCtaClick={() => trackCtaClick('birth_form')}
                    hidePreview={registerModalOpen}
                  />
                </div>
              )}
            </div>
          </div>

          {funnelStep === 'birth' && (
            <LandingPlansOverview
              className="landing-conversion-zone__plans"
              onCta={goToBirthForm}
              isDesktop={isDesktop}
            />
          )}

        </section>
        <div className="landing-showcase-duo">
          <LandingPdfShowcase />
          <LandingReviews variant="paywall" />
        </div>
        <LandingGuides />
        <AdSenseBanner />
        <LandingFaq />
      </div>
    </>
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

function Onboarding({ dados: dadosProp, setDados, onSubmit, isDesktop }) {
  const { lang, t } = useLanguage()
  const dados = useMemo(
    () => dadosComRascunhoLanding({ ...DADOS_VAZIO, ...(dadosProp && typeof dadosProp === 'object' ? dadosProp : {}) }),
    [dadosProp],
  )
  const [tocado, setTocado] = useState({})
  const [fusoCarregando, setFusoCarregando] = useState(false)
  const [fusoErro, setFusoErro] = useState(null)
  const [fusoManual, setFusoManual] = useState(0)

  useEffect(() => {
    const draft = readLandingDraft()
    if (!draft) return

    setDados((prev) => {
      const base = prev && typeof prev === 'object' ? prev : DADOS_VAZIO
      return normalizarDadosPerfil(mergeLandingDraft(base)) || DADOS_VAZIO
    })

    if (typeof draft.fuso === 'number') setFusoManual(draft.fuso)

    const loc = draft.localizacao
    if (loc?.lat != null && loc?.lon != null && draft.fuso == null) {
      let cancelled = false
      ;(async () => {
        setFusoCarregando(true)
        setFusoErro(null)
        try {
          const tz = await pesquisarFusoHorario(loc.lat, loc.lon)
          if (!cancelled) setDados((p) => ({ ...p, fuso: tz }))
        } catch {
          if (!cancelled) {
            setFusoErro(t('onboarding.tzFail'))
            setDados((p) => ({ ...p, fuso: fusoManual }))
          }
        } finally {
          if (!cancelled) setFusoCarregando(false)
        }
      })()
      return () => { cancelled = true }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const erros = (() => {
    try {
      return validarOnboarding(dados, lang)
    } catch (e) {
      console.warn('[Sidus] validarOnboarding:', e?.message)
      return {}
    }
  })()
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
        <div className="onboarding-logo-wrap notranslate" translate="no">
          <SidusLogo variant="stacked" markSize={56} glow />
        </div>
        <p style={estilos.subtitulo}>{t('onboarding.tagline')}</p>
      </div>

      <div style={{ ...estilos.vidro, padding: 24 }}>
        <Campo
          label={t('onboarding.name')}
          valor={dados.nome ?? ''}
          onChange={(v) => setDados((p) => ({ ...(p || DADOS_VAZIO), nome: v }))}
          onBlur={tocar('nome')}
          erro={tocado.nome ? erros.nome : null}
          placeholder={t('onboarding.namePlaceholder')}
        />
        <div style={{ marginBottom: 20 }}>
          <label style={estilos.label}>{t('onboarding.birthDate')}</label>
          <input
            type="date"
            value={dados.data || ''}
            max={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setDados((p) => ({ ...(p || DADOS_VAZIO), data: e.target.value }))}
            onBlur={tocar('data')}
            style={{
              ...estilos.input,
              borderColor: tocado.data && erros.data ? 'rgba(248,113,113,0.7)' : CORES.vidroBorda,
            }}
          />
          {tocado.data && erros.data && (
            <p style={{ margin: '6px 0 0', fontSize: 12, color: '#F87171' }}>{erros.data}</p>
          )}
        </div>
        <Campo
          label={t('onboarding.birthTime')}
          tipo="time"
          valor={dados.hora ?? ''}
          onChange={(v) => setDados((p) => ({ ...(p || DADOS_VAZIO), hora: v }))}
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

        {/* Painel de fuso horário - auto-detectado ou manual */}
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

function Dashboard({ nome, mapaNatal, ceuAgora, aspetos, onOraculo, onPrivacidade, isDesktop, isPremium, onUpgrade, onTarot, onMapa, userEmail, user, oraclePerguntasUsadas, leiturasTarotUsadas, isBrasil }) {
  const { t, ts, te, tp, ta, lang } = useLanguage()
  const faseLua = calcularFaseLua(new Date(), lang)

  const energiaResumo = useMemo(() => {
    if (!mapaNatal?.solar?.nome || !ceuAgora?.length) return null
    const signoNome = ts(mapaNatal.solar.nome)
    const idx = SIGNOS.findIndex((s) => s.nome === mapaNatal.solar.nome || (mapaNatal.solar.nome === 'Áries' && s.nome === 'Carneiro'))
    if (idx < 0) return null
    return gerarHoroscopoSignoTransito({
      signoIndex: idx,
      signoNome,
      ceuAgora,
      aspetos,
      faseLua,
      lang,
    })
  }, [mapaNatal, ceuAgora, aspetos, faseLua, lang, ts])

  return (
    <div style={layoutConteudo(isDesktop)}>
      <header className="sidus-page-header sidus-home-welcome" style={{ textAlign: 'center', marginBottom: 12 }}>
        <div className="sidus-home-welcome__mark notranslate" translate="no" aria-hidden>
          <SidusConstellationMark size={88} glow />
        </div>
        <p className="sidus-home-welcome__greeting">
          {nome ? t('home.welcome', { name: nome }) : t('home.skyRealtime')}
        </p>
      </header>

      <HomeParaTiHoje
        onTarot={onTarot}
        onOraculo={onOraculo}
        onMapa={onMapa}
        energiaResumo={energiaResumo}
      />

      <HeroHomeSidus mapaNatal={mapaNatal} onMapa={onMapa} isPremium={isPremium} />

      <EnergiaDoDia mapaNatal={mapaNatal} ceuAgora={ceuAgora} aspetos={aspetos} />
      <TransitoSemanal ceuAgora={ceuAgora} aspetos={aspetos} />

      <LeituraGratisDiaria solar={mapaNatal?.solar} lunar={mapaNatal?.lunar} />

      {mapaNatalValido(mapaNatal) && (
        <div className="home-natal-block" style={{ ...estilos.vidro, padding: 20, marginBottom: 18 }}>
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.09em', color: CORES.dourado, marginBottom: 12 }}>
            {t('home.natalChart')}
          </div>

          <div className="home-natal-signs-row" style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
            <div className="home-natal-sun-card" style={{ flex: 1, background: 'rgba(223,183,108,0.08)', borderRadius: 12, padding: '10px 14px', border: `1px solid rgba(223,183,108,0.2)` }}>
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

            <div className="home-natal-asc-card" style={{ flex: 1, background: 'rgba(139,92,246,0.12)', borderRadius: 12, padding: '10px 14px', border: `1px solid rgba(139,92,246,0.3)` }}>
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

          <div style={{ fontSize: 14, color: CORES.brancoMuted, marginBottom: 12 }}>
            {t('home.moonIn')} <span style={{ color: CORES.brancoSuave }}>{ts(mapaNatal.lunar.nome)} {mapaNatal.lunar.simbolo}</span>
            <span style={{ marginLeft: 6, fontSize: 12 }}>{mapaNatal.lunar.graus}° · {te(mapaNatal.lunar.elemento)}</span>
          </div>

          <ShareSigno mapaNatal={mapaNatal} nome={nome} variant="prominent" />
        </div>
      )}

      {!isPremium && (
        <PremiumHomeTeaser
          isPremium={isPremium}
          onUpgrade={onUpgrade}
          oracleUsadas={oraclePerguntasUsadas}
          tarotUsadas={leiturasTarotUsadas}
          isBrasil={isBrasil}
        />
      )}

      <AstroNewsCarousel aspetos={aspetos} />

      <div style={{ ...estilos.vidro, padding: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <Moon size={22} color={CORES.dourado} />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: CORES.dourado }}>
            {t('home.skyToday')}
          </span>
        </div>

        {/* Fase lunar - disponível para todos na home */}
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

        {isPremium && <HomeSkyRadio />}

        {(ceuAgora || []).map((p) => (
          <div key={p.key} style={{ fontSize: 14, color: CORES.brancoSuave, padding: '7px 0', borderBottom: `1px solid ${CORES.vidroBorda}` }}>
            {formatSkyPosition(p, lang)}
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
        {((aspetos || []).length) === 0 ? (
          <p style={{ fontSize: 13, color: CORES.brancoMuted }}>{t('home.noAspects', { orbe: ORBE_ASPECTO })}</p>
        ) : (
          (aspetos || []).slice(0, 8).map((a, i) => (
            <div key={`${a.planetaA}-${a.planetaB}-${i}`} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < (aspetos || []).length - 1 ? `1px solid ${CORES.vidroBorda}` : 'none' }}>
              <div style={{ fontSize: 14, color: CORES.branco }}>
                {tp(a.planetaA)} <span style={{ color: CORES.dourado }}>{ta(a.aspecto)}</span> {tp(a.planetaB)}
              </div>
              <div style={{ fontSize: 11, color: CORES.brancoMuted }}>{a.orbe}</div>
            </div>
          ))
        )}
      </div>

      <ConteudoDinamicoSidus mapaNatal={mapaNatal} ceuAgora={ceuAgora} aspetos={aspetos} isPremium={isPremium} onUpgrade={onUpgrade} onOraculo={onOraculo} userEmail={userEmail} user={user} />

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

      <button type="button" onClick={onOraculo} style={{ ...estilos.vidro, width: '100%', padding: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', border: `1px solid ${CORES.dourado}`, background: 'rgba(223,183,108,0.08)', marginTop: 14, marginBottom: 14 }}>
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
          {Icon ? <Icon size={12} color={corIcone} /> : null}
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
  const labelCurto = labelBarraCurto(label)
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 3 }}>
        <span className="mapa-bar-label" style={{ fontSize: 12, color: CORES.brancoSuave }}>{labelCurto}</span>
        <span style={{ fontSize: 11, color: cor, fontWeight: 700, flexShrink: 0 }}>{valor} ({pct}%)</span>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.08)' }}>
        <div style={{ height: '100%', borderRadius: 3, width: `${pct}%`, background: cor, transition: 'width 0.6s ease' }} />
      </div>
    </div>
  )
}

function MapaAstral({ mapaNatal, dados, planetasNascimento, mapaDesbloqueado, isPremium, onUpgrade, onComprarMapa, onMapaGerado, isDesktop, perfilCarregando, reparandoDados, mapaGerado, onCompletarNatal, obterIdToken, interpretacaoPerfil, isBrasil = false }) {
  const { lang, t, ts, tp, te, ta } = useLanguage()
  const [gerandoPdf, setGerandoPdf] = useState(false)
  const [emailEnviado, setEmailEnviado] = useState(false)
  const [calcExpirado, setCalcExpirado] = useState(false)
  const [analiseIA, setAnaliseIA] = useState(null)
  const [analiseIAUpgrading, setAnaliseIAUpgrading] = useState(false)
  const pedidoInterpretacaoRef = useRef(false)
  const chaveMapaRef = useRef('')
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

  const aspetosCompletos = useMemo(
    () => (planetasComCasa.length > 0 ? calcularAspetos(planetasComCasa) : []),
    [planetasComCasa]
  )

  const precoVipLabel = useMemo(() => {
    const v = precoPremiumVitrine(isBrasil)
    return formatPrecoCompleto(v.valor, v.currency)
  }, [isBrasil])

  const planetasProntos = mapaPlanetasProntos(planetasComCasa, mapaNatal)

  const analiseLexicon = useMemo(() => {
    if (!mapaNatal || !planetasProntos) return null
    try {
      return gerarAnaliseCompleta(mapaNatal, planetasComCasa, aspetosNatais, dados, lang)
    } catch (e) {
      console.warn('[Sidus] Análise mapa:', e?.message)
      return null
    }
  }, [mapaNatal, planetasComCasa, aspetosNatais, dados, lang, planetasProntos])

  const analiseCompleta = useMemo(() => {
    if (!analiseLexicon?.seccoes?.length) return null
    const lexPalavras = contarPalavrasAnalise(analiseLexicon)
    if (
      mapaCompletoDesbloqueado
      && analiseIA?.seccoes?.length
      && analiseMapaValida(analiseIA)
      && analiseIA.lang === lang
      && contarPalavrasAnalise(analiseIA) >= lexPalavras
    ) {
      return analiseIA
    }
    return analiseLexicon
  }, [mapaCompletoDesbloqueado, analiseIA, analiseLexicon, lang])

  useEffect(() => {
    if (!mapaCompletoDesbloqueado || !mapaNatal || !analiseLexicon) {
      setAnaliseIA(null)
      setAnaliseIAUpgrading(false)
      chaveMapaRef.current = ''
      pedidoInterpretacaoRef.current = false
      return undefined
    }

    const chave = gerarChaveMapa(dados, lang)
    if (chaveMapaRef.current !== chave) {
      chaveMapaRef.current = chave
      pedidoInterpretacaoRef.current = false
    }
    const aplicar = (analise) => {
      if (!analiseMapaValida(analise)) return
      setAnaliseIA({
        ...analise,
        chave,
        lang,
      })
      writeMapaIACache(dados, lang, analise)
    }

    if (interpretacaoValidaParaMapa(interpretacaoPerfil, dados, lang)) {
      aplicar(interpretacaoPerfil)
      return undefined
    }

    const cached = readMapaIACache(dados, lang)
    if (cached?.seccoes?.length) {
      aplicar(cached)
    }

    if (pedidoInterpretacaoRef.current) return undefined
    if (!analiseLexicon?.seccoes?.length) return undefined
    pedidoInterpretacaoRef.current = true

    let cancelled = false
    ;(async () => {
      const cachedIa = readMapaIACache(dados, lang)
      if (cachedIa?.fonte === 'ia') return
      if (interpretacaoValidaParaMapa(interpretacaoPerfil, dados, lang)) return

      setAnaliseIAUpgrading(true)
      try {
        const idToken = obterIdToken ? await obterIdToken() : null
        if (!idToken || cancelled) return
        let resultado = await interpretarMapaServidor({
          mapaNatal,
          planetas: planetasComCasa,
          aspetos: aspetosNatais,
          dados,
          lang,
        }, idToken)

        if (resultado?.auth && obterIdToken) {
          const retry = await obterIdToken(true)
          if (retry && !cancelled) {
            resultado = await interpretarMapaServidor({
              mapaNatal,
              planetas: planetasComCasa,
              aspetos: aspetosNatais,
              dados,
              lang,
            }, retry)
          }
        }

        if (cancelled || !resultado?.seccoes?.length) return
        if (!analiseMapaValida(resultado)) return
        aplicar({
          seccoes: resultado.seccoes,
          textoPlano: resultado.textoPlano,
          fonte: resultado.fonte || 'ia',
        })
      } catch (e) {
        console.warn('[Sidus] Interpretação mapa:', e?.message)
      } finally {
        if (!cancelled) setAnaliseIAUpgrading(false)
      }
    })()

    return () => { cancelled = true }
  }, [mapaCompletoDesbloqueado, mapaNatal, analiseLexicon, planetasComCasa, aspetosNatais, dados, lang, obterIdToken, interpretacaoPerfil])

  const resumoGratuito = useMemo(() => {
    if (mapaCompletoDesbloqueado || !mapaNatal) return null
    try {
      return gerarResumoGratuito(mapaNatal, lang)
    } catch (e) {
      console.warn('[Sidus] Resumo mapa:', e?.message)
      return null
    }
  }, [mapaCompletoDesbloqueado, mapaNatal, lang])

  const mapaCompletoVisivel = planetasComCasa.length > 0

  const downloadPdf = async () => {
    if (gerandoPdf) return
    const scrollX = window.scrollX
    const scrollY = window.scrollY
    setGerandoPdf(true)
    try {
      const { gerarPdfMapaAstral } = await importWithRetry(() => import('./components/PdfMapa.jsx'))
      const { capturarMandalaParaPdf } = await importWithRetry(() => import('./lib/mandalaPdf.js'))
      const mandalaPng = mapaCompletoDesbloqueado
        ? await capturarMandalaParaPdf().catch(() => null)
        : null
      await gerarPdfMapaAstral(mapaNatal, dados, planetasComCasa, analiseCompleta, lang, { mandalaPng })
    } catch (e) {
      console.error('PDF error:', e)
      alert(t('mapa.pdfError'))
    } finally {
      requestAnimationFrame(() => {
        window.scrollTo(scrollX, scrollY)
      })
      setGerandoPdf(false)
    }
  }

  const compartilharEmail = () => {
    const corpo = [
      analiseCompleta?.textoPlano || '',
      '',
      '── POSIÇÕES PLANETÁRIAS (Placidus) ─────────',
      ...planetasComCasa.map(p =>
        `  ${p.simbolo} ${p.nome}: ${p.signo?.nome || '-'}${p.casa ? ` · Casa ${p.casa}` : ''} (${(p.longitude ?? 0).toFixed(1)}°)${p.retrograde ? ' ℞' : ''}`
      ),
      '',
      'Gerado por Sidus - https://sidusastro.com',
    ].join('\n')

    const assunto = encodeURIComponent(`Mapa Astral Completo - ${dados.nome} · Sidus`)
    const body    = encodeURIComponent(corpo)
    window.location.href = `mailto:?subject=${assunto}&body=${body}`
    setEmailEnviado(true)
    setTimeout(() => setEmailEnviado(false), 4000)
  }

  if (!mapaNatalValido(mapaNatal)) {
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
    } else if (isPremium && !temDadosMinimos) {
      mensagem = t('mapa.premiumCompleteNatal')
      mostrarCtaPremium = true
    } else if (mapaGerado && !temDadosMinimos) {
      mensagem = t('mapa.fillNatal')
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
    ...(mapaNatal.descendente ? [{ titulo: t('mapa.descendant'), icon: ArrowDown, corBorda: 'rgba(244,114,182,0.35)', corFundo: 'rgba(244,114,182,0.12)', corIcone: '#F472B6', ...mapaNatal.descendente, nome: ts(mapaNatal.descendente.nome), elemento: te(mapaNatal.descendente.elemento) }] : []),
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
        <h1 className="sidus-page-title" style={{ textAlign: 'left' }}>{t('mapa.title')}</h1>
        <p style={{ ...estilos.subtitulo, textAlign: 'left', marginBottom: 2 }}>
          {dados.nome} · {formatarData(dados.data)} às {dados.hora}
        </p>
        <p style={{ fontSize: 11, color: CORES.brancoMuted, letterSpacing: '0.04em' }}>
          {t('mapa.proTagline')}
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
      <div className="mapa-sec-label" style={{ fontSize: 11, color: CORES.dourado, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10, fontWeight: 700 }}>
        {tituloSecaoMapa(t('mapa.angularAxes'))}
      </div>
      {pilaresCompletos.map(p => <PilarCard key={p.titulo} {...p} />)}

      {/* ── Posições planetárias (gratuito - dados reais) ── */}
      {mapaCompletoVisivel && (
        <>
          {balEl && (
            <div style={{ ...estilos.vidro, padding: 18, marginBottom: 14 }}>
              <div className="mapa-sec-label" style={{ fontSize: 11, color: CORES.dourado, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14, fontWeight: 700 }}>
                {tituloSecaoMapa(t('mapa.elementBalance'))}
              </div>
              <BarraElemento label={t('mapa.fire')}  valor={balEl.Fogo}  total={totalPlanetas} cor="#FB923C" />
              <BarraElemento label={t('mapa.earth')} valor={balEl.Terra} total={totalPlanetas} cor="#4ADE80" />
              <BarraElemento label={t('mapa.air')}   valor={balEl.Ar}   total={totalPlanetas} cor="#93C5FD" />
              <BarraElemento label={t('mapa.water')}   valor={balEl.Água} total={totalPlanetas} cor="#818CF8" />
              {balMod && (
                <>
                  <div className="mapa-sec-label" style={{ fontSize: 11, color: CORES.dourado, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '16px 0 12px', fontWeight: 700 }}>
                    {tituloSecaoMapa(t('mapa.modalities'))}
                  </div>
                  <BarraElemento label={t('mapa.cardinal')} valor={balMod.Cardinal} total={totalPlanetas} cor="#F472B6" />
                  <BarraElemento label={t('mapa.fixed')}    valor={balMod.Fixo}    total={totalPlanetas} cor="#FBBF24" />
                  <BarraElemento label={t('mapa.mutable')}  valor={balMod.Mutável} total={totalPlanetas} cor="#34D399" />
                </>
              )}
            </div>
          )}

          <div style={{ ...estilos.vidro, padding: 18, marginBottom: 14 }}>
            <div className="mapa-sec-label" style={{ fontSize: 11, color: CORES.dourado, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14, fontWeight: 700 }}>
              {tituloSecaoMapa(t('mapa.positions'))}
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
              <div className="mapa-sec-label" style={{ fontSize: 11, color: CORES.dourado, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14, fontWeight: 700 }}>
                {tituloSecaoMapa(t('mapa.aspects'))}
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

      {/* ── Interpretação + premium ── */}
      {analiseCompleta && mapaCompletoDesbloqueado && (
        <>
          <InterpretacaoMapa
            analise={analiseCompleta}
            estilosVidro={estilos.vidro}
            lang={lang}
            upgrading={analiseIAUpgrading && analiseCompleta?.fonte !== 'ia' && !interpretacaoValidaParaMapa(interpretacaoPerfil, dados, lang)}
            upgradingLabel={t('mapa.aiUpgrading')}
          />

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
                    : '-'}
                </div>
              </div>
            ))}
          </div>

          {mapaCompletoVisivel && (
            <div style={{
              ...estilos.vidro,
              padding: isDesktop ? 24 : 18,
              marginBottom: 20,
              background: 'linear-gradient(160deg, rgba(223,183,108,0.06) 0%, rgba(11,7,30,0.95) 40%, rgba(139,92,246,0.05) 100%)',
              border: '1px solid rgba(223,183,108,0.22)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)',
            }}>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{ fontSize: 12, color: CORES.dourado, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, marginBottom: 8 }}>
                  {t('mapa.mandalaTitle')}
                </div>
                <p style={{ fontSize: 12, color: CORES.brancoMuted, margin: 0, lineHeight: 1.6, maxWidth: 420, marginLeft: 'auto', marginRight: 'auto' }}>
                  {t('mapa.mandalaSubtitleShort')}
                </p>
              </div>
              <Suspense fallback={<RouteLoader />}>
                <MandalaNatalLazy
                  mapaNatal={mapaNatal}
                  planetas={planetasComCasa}
                  aspectos={aspetosCompletos}
                  nome={dados.nome}
                  dataNascimento={formatarData(dados.data)}
                  horaNascimento={dados.hora}
                  translateSign={ts}
                  size={isDesktop ? 480 : 300}
                  unavailableLabel={t('mapa.mandalaUnavailable')}
                />
              </Suspense>
            </div>
          )}

          <div style={{ fontSize: 11, color: CORES.dourado, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10, fontWeight: 700 }}>
            {t('mapa.export')}
          </div>

          <div style={{ ...estilos.vidro, padding: 14, marginBottom: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px 12px', fontSize: 11 }}>
              <span style={{ color: CORES.brancoMuted }}>{t('mapa.utDate')}</span>
              <span style={{ color: CORES.branco }}>{mapaNatal.instanteUTC ? mapaNatal.instanteUTC.replace('T', ' ').slice(0, 16) + ' UTC' : '-'}</span>
              <span style={{ color: CORES.brancoMuted }}>{t('mapa.timezone')}</span>
              <span style={{ color: CORES.branco }}>
                {typeof mapaNatal.fuso === 'string' ? mapaNatal.fuso : `UTC${(mapaNatal.fuso ?? 0) >= 0 ? '+' : ''}${mapaNatal.fuso ?? 0}`}
              </span>
              <span style={{ color: CORES.brancoMuted }}>{t('mapa.coordinates')}</span>
              <span style={{ color: CORES.branco }}>{mapaNatal.lat != null ? `${mapaNatal.lat.toFixed(3)}°N  ${mapaNatal.lon?.toFixed(3)}°E` : '-'}</span>
            </div>
          </div>

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
      )}

      {analiseCompleta && !mapaCompletoDesbloqueado && (
        <>
          {analiseCompleta.seccoes?.length > 0 && (
            <InterpretacaoMapa
              analise={{ ...analiseCompleta, seccoes: analiseCompleta.seccoes.slice(0, 1) }}
              estilosVidro={estilos.vidro}
              lang={lang}
            />
          )}

          <div className="mapa-paywall-inline" role="region" aria-label={t('mapa.unlockFullChart')}>
            <div className="mapa-paywall-card">
              <div className="mapa-paywall-card-pattern" aria-hidden />
              <MapaPaywallSections
                onUpgrade={onUpgrade}
                ctaLabel={isBrasil
                  ? t('mapa.premiumOptionBr', { preco: precoVipLabel })
                  : t('mapa.premiumOption', { price: precoVipLabel })}
                showCta
              />
            </div>
          </div>

          {analiseCompleta.seccoes?.length > 1 && (
            <div className="mapa-premium-teaser">
              <div className="mapa-preview-blurred">
                <InterpretacaoMapa
                  analise={{ ...analiseCompleta, seccoes: analiseCompleta.seccoes.slice(1) }}
                  estilosVidro={estilos.vidro}
                  lang={lang}
                />

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
                          : '-'}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ fontSize: 11, color: CORES.dourado, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10, fontWeight: 700 }}>
                  {t('mapa.export')}
                </div>

                <div style={{ ...estilos.vidro, padding: 14, marginBottom: 14 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px 12px', fontSize: 11 }}>
                    <span style={{ color: CORES.brancoMuted }}>{t('mapa.utDate')}</span>
                    <span style={{ color: CORES.branco }}>{mapaNatal.instanteUTC ? mapaNatal.instanteUTC.replace('T', ' ').slice(0, 16) + ' UTC' : '-'}</span>
                    <span style={{ color: CORES.brancoMuted }}>{t('mapa.timezone')}</span>
                    <span style={{ color: CORES.branco }}>
                      {typeof mapaNatal.fuso === 'string' ? mapaNatal.fuso : `UTC${(mapaNatal.fuso ?? 0) >= 0 ? '+' : ''}${mapaNatal.fuso ?? 0}`}
                    </span>
                    <span style={{ color: CORES.brancoMuted }}>{t('mapa.coordinates')}</span>
                    <span style={{ color: CORES.branco }}>{mapaNatal.lat != null ? `${mapaNatal.lat.toFixed(3)}°N  ${mapaNatal.lon?.toFixed(3)}°E` : '-'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function Paywall({ onVoltar, onPagar, onSucesso, onPromo, isDesktop, isBrasil, oraclePerguntasUsadas = 0, leiturasTarotUsadas = 0, paywallTool = null }) {
  const { t } = useLanguage()
  const precoVitrine = precoPremiumVitrine(isBrasil)
  return (
    <div style={layoutConteudo(isDesktop, { paddingTop: 16 })}>
      <button type="button" onClick={onVoltar} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: CORES.dourado, cursor: 'pointer', marginBottom: 20 }}>
        <ChevronLeft size={20} /> {t('common.back')}
      </button>

      {isBrasil && <BannerBrasil variant="paywall" />}

      <VipPaywallBody
        onCta={() => onPagar(t('vip.productName'), precoVitrine.valor, onSucesso, { productType: 'premium' })}
        onPromo={onPromo}
        isBrasil={isBrasil}
        oraclePerguntasUsadas={oraclePerguntasUsadas}
        leiturasTarotUsadas={leiturasTarotUsadas}
        titleKey={paywallTool ? null : 'vip.title'}
        subtitleKey={paywallTool ? null : 'vip.subtitle'}
        paywallTool={paywallTool}
      />

      <p style={{ textAlign: 'center', marginTop: 16 }}>
        <button type="button" onClick={onVoltar} style={{ background: 'none', border: 'none', color: CORES.brancoMuted, fontSize: 13, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3 }}>
          {t('vip.continueFree')}
        </button>
      </p>
    </div>
  )
}

function OraclePremiumUpsell({ onUpgrade, onPromo, isBrasil = false, oraclePerguntasUsadas = 0, leiturasTarotUsadas = 0, compact = false, variant = 'default' }) {
  const { t } = useLanguage()
  const precoVitrine = precoPremiumVitrine(isBrasil)
  const precoLabel = formatPrecoCompleto(precoVitrine.valor, precoVitrine.currency)
  const beneficios = ['oracle.upsellBenefit1', 'oracle.upsellBenefit2', 'oracle.upsellBenefit3', 'oracle.upsellBenefit4']
  const ctaText = isBrasil ? t('vip.ctaBr', { preco: precoLabel }) : t('oracle.upsellCta', { price: precoLabel })

  if (variant === 'chat') {
    return (
      <div className="oracle-chat-upsell">
        <p className="oracle-chat-upsell__eyebrow">{t('oracle.upsellTitle')}</p>
        <p className="oracle-chat-upsell__lead">{t('oracle.upsellLeadShort')}</p>
        <ul className="oracle-upsell-benefits oracle-chat-upsell__benefits">
          {beneficios.map((key) => (
            <li key={key}>{t(key)}</li>
          ))}
        </ul>
        <div className="oracle-chat-upsell__price">
          {precoLabel}
          {isBrasil ? <span className="oracle-chat-upsell__pix">{t('vip.pixLabel')}</span> : null}
        </div>
        <button type="button" className="oracle-chat-upsell__cta" onClick={onUpgrade}>
          {ctaText}
        </button>
        {onPromo ? (
          <button type="button" className="oracle-chat-upsell__promo" onClick={onPromo}>
            {t('vipPromo.lead')}
          </button>
        ) : null}
        <p className="oracle-chat-upsell__footnote">
          {isBrasil
            ? t('vip.paymentMethodsBr', { precoPix: precoLabel, precoEur: formatPrecoCompleto(PRECO_PREMIUM_UNICO, 'eur') })
            : t('vip.paymentMethods')}
        </p>
      </div>
    )
  }

  return (
    <div style={{
      alignSelf: 'stretch',
      maxWidth: compact ? '100%' : '92%',
      margin: compact ? 0 : '4px 0',
      padding: compact ? '14px 16px' : '18px 20px',
      borderRadius: 16,
      background: 'linear-gradient(145deg, rgba(223,183,108,0.14), rgba(109,40,217,0.12))',
      border: `1px solid ${CORES.dourado}`,
      boxShadow: '0 8px 32px rgba(223,183,108,0.12)',
    }}>
      <ul className="oracle-upsell-benefits">
        {beneficios.map((key) => (
          <li key={key}>{t(key)}</li>
        ))}
      </ul>
      <VipPaywallBody
        onCta={onUpgrade}
        onPromo={onPromo}
        isBrasil={isBrasil}
        oraclePerguntasUsadas={oraclePerguntasUsadas}
        leiturasTarotUsadas={leiturasTarotUsadas}
        titleKey="oracle.upsellTitle"
        subtitleKey="oracle.upsellLead"
        ctaText={ctaText}
        compact
      />
    </div>
  )
}

// ── Integração AI (servidor Netlify - chaves secretas) ─────────────────────────
async function consultarSidus(pergunta, mapaNatal, historico, lang, idToken, clientPremium = false) {
  return consultarOracleServidor(pergunta, mapaNatal, historico, lang, idToken, clientPremium)
}

function sanitizarMensagensOracle(mensagens, perguntasUsadas, isPremium) {
  if (!Array.isArray(mensagens) || !mensagens.length) return mensagens
  if (isPremium || perguntasUsadas < MAX_ORACLE_GRATIS) {
    return mensagens.filter((m) => m.tipo !== 'upsell')
  }
  return mensagens
}

function Chat({ mapaNatal, isPremium, userId, oracleRemotas, onOracleUsada, onUpgrade, onPromo, leiturasTarotUsadas = 0, obterIdToken, isBrasil = false, isDesktop = false }) {
  const { lang, t } = useLanguage()
  const precoVipLabel = useMemo(() => {
    const v = precoPremiumVitrine(isBrasil)
    return formatPrecoCompleto(v.valor, v.currency)
  }, [isBrasil])
  const [perguntasUsadas, setPerguntasUsadas] = useState(() => contarOraclePerguntas(userId, oracleRemotas))

  const chaveSessaoActual = userId ? `sidus_oracle_current_${userId}` : 'sidus_oracle_current_local'

  const saudacaoInicial = useCallback((restantesGratis = MAX_ORACLE_GRATIS) => ([{
    id: 1,
    autor: 'ia',
    texto: getChatGreeting(mapaNatal, lang, restantesGratis, isPremium),
  }]), [mapaNatal, lang, isPremium])

  const [sessaoId, setSessaoId] = useState(() => `sess-${Date.now()}`)
  const [sessoes, setSessoes] = useState([])
  const [historicoAberto, setHistoricoAberto] = useState(false)
  const [mensagens, setMensagens] = useState(saudacaoInicial)

  const [texto, setTexto]       = useState('')
  const [digitando, setDigitando] = useState(false)
  const fimRef = useRef(null)
  const listaRef = useRef(null)
  const seguirFimRef = useRef(true)

  const contagemOracle = useCallback(
    () => contarOraclePerguntas(userId, oracleRemotas),
    [userId, oracleRemotas],
  )

  useEffect(() => {
    setPerguntasUsadas(contagemOracle())
  }, [contagemOracle])

  useEffect(() => {
    const lista = carregarSessoesOracle(userId)
    if (isPremium) {
      setSessoes(lista)
      const actualId = localStorage.getItem(chaveSessaoActual)
      const actual = lista.find((s) => s.id === actualId)
      if (actual?.mensagens?.length) {
        setSessaoId(actual.id)
        setMensagens(sanitizarMensagensOracle(actual.mensagens, contagemOracle(), isPremium))
      } else {
        const id = `sess-${Date.now()}`
        setSessaoId(id)
        setMensagens([{
          id: 1,
          autor: 'ia',
          texto: getChatGreeting(mapaNatal, lang, Math.max(0, MAX_ORACLE_GRATIS - contagemOracle()), isPremium),
        }])
        localStorage.setItem(chaveSessaoActual, id)
      }
      return
    }
    setSessoes(lista.slice(0, 1))
    const actualId = localStorage.getItem(chaveSessaoActual)
    const actual = lista.find((s) => s.id === actualId) || lista[0]
    if (actual?.mensagens?.length) {
      setSessaoId(actual.id)
      setMensagens(sanitizarMensagensOracle(actual.mensagens, contagemOracle(), isPremium))
    } else {
      setMensagens([{
        id: 1,
        autor: 'ia',
        texto: getChatGreeting(mapaNatal, lang, Math.max(0, MAX_ORACLE_GRATIS - contagemOracle()), isPremium),
      }])
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- carregar sessão só ao mudar utilizador/premium
  }, [isPremium, userId, chaveSessaoActual])

  useEffect(() => {
    setMensagens((prev) => {
      if (prev.length === 1 && prev[0]?.autor === 'ia' && !prev[0]?.aviso) {
        const restantesGratis = Math.max(0, MAX_ORACLE_GRATIS - contagemOracle())
        return [{ ...prev[0], texto: getChatGreeting(mapaNatal, lang, restantesGratis, isPremium) }]
      }
      return prev
    })
  }, [lang, mapaNatal, isPremium, contagemOracle])

  useEffect(() => {
    if (!mensagens.length) return
    if (!temRespostaOracle(mensagens)) {
      removerSessaoOracle(userId, sessaoId)
      setSessoes(carregarSessoesOracle(userId))
      return
    }
    const base = criarSessaoOracle({ mensagens, id: sessaoId, lang })
    const sessao = actualizarSessaoOracle(base, mensagens)
    if (isPremium) {
      upsertSessaoOracle(userId, sessao)
      localStorage.setItem(chaveSessaoActual, sessao.id)
      setSessoes(carregarSessoesOracle(userId))
    } else {
      guardarSessoesOracle(userId, [sessao])
      localStorage.setItem(chaveSessaoActual, sessao.id)
      setSessoes([sessao])
    }
  }, [mensagens, isPremium, userId, sessaoId, lang, chaveSessaoActual])

  const iniciarNovaConversa = () => {
    const id = `sess-${Date.now()}`
    setSessaoId(id)
    setMensagens(saudacaoInicial(Math.max(0, MAX_ORACLE_GRATIS - contagemOracle())))
    localStorage.setItem(chaveSessaoActual, id)
    setHistoricoAberto(false)
    seguirFimRef.current = true
  }

  const abrirSessaoHistorico = (sess) => {
    if (!sess?.id) return
    setSessaoId(sess.id)
    setMensagens(sess.mensagens?.length
      ? sanitizarMensagensOracle(sess.mensagens, contagemOracle(), isPremium)
      : saudacaoInicial(Math.max(0, MAX_ORACLE_GRATIS - contagemOracle())))
    localStorage.setItem(chaveSessaoActual, sess.id)
    setHistoricoAberto(false)
  }

  const restantes = isPremium ? Infinity : Math.max(0, MAX_ORACLE_GRATIS - perguntasUsadas)
  const [paywallVisivel, setPaywallVisivel] = useState(false)

  useEffect(() => {
    const el = listaRef.current
    if (!el) return undefined
    const onScroll = () => {
      const distanciaFim = el.scrollHeight - el.scrollTop - el.clientHeight
      seguirFimRef.current = distanciaFim < 100
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (paywallVisivel || !seguirFimRef.current) return
    fimRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensagens, digitando, paywallVisivel])

  const abrirPaywall = useCallback(() => {
    setPaywallVisivel(true)
  }, [])

  const enviar = async () => {
    if (!texto.trim() || digitando) return

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
    let idToken = obterIdToken ? await obterIdToken() : null
    let resultado = null

    if (idToken) {
      resultado = await consultarSidus(q, mapaNatal, historicoParaIA, lang, idToken, isPremium)
      if (resultado?.auth && obterIdToken) {
        const retry = await obterIdToken(true)
        if (retry) {
          resultado = await consultarSidus(q, mapaNatal, historicoParaIA, lang, retry, isPremium)
          idToken = retry
        }
      }
    }

    const recusado = resultado?.recusado === true
    let resposta = resultado?.resposta
    if (!resposta && !recusado) {
      if (resultado?.auth) {
        resposta = t('oracle.sessionError')
      } else if (resultado?.servidor) {
        resposta = lang !== 'pt'
          ? 'The oracle is temporarily unavailable. Try again in a moment.'
          : 'O oráculo está temporariamente indisponível. Tenta outra vez dentro de instantes.'
      } else {
        resposta = gerarRespostaOracle(q, mapaNatal, numAtual, lang)
      }
    }

    if (!resposta) {
      setDigitando(false)
      return
    }

    setMensagens(prev => [...prev, {
      id: Date.now()+1, autor: 'ia', texto: resposta, aviso: recusado || undefined,
    }])
    setDigitando(false)

    if (!isPremium && !recusado) {
      const total = resultado?.usadas != null
        ? sincronizarOraclePerguntas(userId, resultado.usadas)
        : registarOraclePergunta(userId)
      setPerguntasUsadas(total)
      onOracleUsada?.(total)

    }
  }

  return (
    <div className={`oracle-chat${paywallVisivel && !isPremium ? ' oracle-chat--paywall' : ''}`}>
      <header className="oracle-chat__header" aria-label={t('oracle.title')}>
        <div className="oracle-chat__header-main">
          <OracleChatAvatar size={isDesktop ? 40 : 34} />
          <div className="oracle-chat__header-copy">
            <h1 className="sidus-page-title oracle-chat__title">{t('oracle.title')}</h1>
            {isPremium && (
              <p className="oracle-chat__subtitle">{t('oracle.premiumSubtitle')}</p>
            )}
          </div>
        </div>
        <div className="oracle-chat__header-actions">
          <button
            type="button"
            className="oracle-chat__header-btn"
            onClick={() => setHistoricoAberto((v) => !v)}
            aria-pressed={historicoAberto}
          >
            <History size={14} />
            <span>{isPremium || isDesktop ? (isPremium ? t('oracle.historyOpen') : t('oracle.historyLast')) : t('oracle.historyOpen')}</span>
          </button>
          {!isPremium && (
            <button type="button" className="oracle-chat__header-btn oracle-chat__header-btn--premium" onClick={onUpgrade}>
              {restantes > 0
                ? (restantes === 1 ? t('oracle.freeQuestions', { count: restantes }) : t('oracle.freeQuestionsPlural', { count: restantes }))
                : (isDesktop ? t('oracle.premiumBadge', { price: precoVipLabel }) : `🔒 ${t('perfil.premium')}`)}
            </button>
          )}
        </div>
      </header>

      {historicoAberto && (
        <div style={{
          flexShrink: 0,
          maxHeight: '38vh',
          overflowY: 'auto',
          borderBottom: `1px solid ${CORES.vidroBorda}`,
          background: 'rgba(11,7,30,0.98)',
          padding: '12px 14px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: CORES.dourado, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {isPremium ? t('oracle.historyTitle') : t('oracle.historyLastTitle')}
            </span>
            {isPremium && (
            <button type="button" onClick={iniciarNovaConversa} style={{
              fontSize: 11, color: '#34D399', background: 'rgba(52,211,153,0.1)',
              border: '1px solid rgba(52,211,153,0.35)', borderRadius: 8,
              padding: '5px 10px', cursor: 'pointer', fontWeight: 600,
            }}>
              + {t('oracle.historyNew')}
            </button>
            )}
          </div>
          {!isPremium && (
            <p style={{ fontSize: 11, color: CORES.brancoMuted, margin: '0 0 8px', lineHeight: 1.45 }}>
              {t('oracle.historyFreeHint')}
            </p>
          )}
          {!sessoes.length ? (
            <p style={{ fontSize: 12, color: CORES.brancoMuted, margin: 0 }}>{t('oracle.historyEmpty')}</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {sessoes.map((sess) => (
                <button
                  key={sess.id}
                  type="button"
                  onClick={() => abrirSessaoHistorico(sess)}
                  style={{
                    textAlign: 'left', padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
                    background: sess.id === sessaoId ? 'rgba(223,183,108,0.14)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${sess.id === sessaoId ? 'rgba(223,183,108,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  }}
                >
                  <div style={{ fontSize: 12, color: CORES.brancoSuave, fontWeight: 600, lineHeight: 1.35, marginBottom: 3 }}>
                    {sess.title || t('oracle.historyNew')}
                  </div>
                  <div style={{ fontSize: 10, color: CORES.brancoMuted }}>
                    {formatarDataSessao(sess.updatedAt || sess.createdAt, lang)}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="oracle-chat__stage">
      <div className="oracle-chat__body">
      {/* Mensagens */}
      <div ref={listaRef} className="oracle-chat__messages">
        {mensagens.filter((m) => m.tipo !== 'upsell').map((m) => (
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
            <span style={{ fontSize: 18, letterSpacing: 4, color: CORES.dourado }}>...</span>
          </div>
        )}
        <div ref={fimRef} />
      </div>
      </div>

      {paywallVisivel && !isPremium && (
        <div className="oracle-chat__paywall-dock" role="region" aria-label={t('oracle.upsellTitle')}>
          <OraclePremiumUpsell
            onUpgrade={onUpgrade}
            onPromo={onPromo}
            variant="chat"
            isBrasil={isBrasil}
            oraclePerguntasUsadas={perguntasUsadas}
            leiturasTarotUsadas={leiturasTarotUsadas}
          />
        </div>
      )}

      </div>

      {/* Input */}
      <div className="oracle-chat__input-bar" style={{ padding: '10px 14px 0', background: 'rgba(11,7,30,0.97)', borderTop: `1px solid ${CORES.vidroBorda}`, flexShrink: 0 }}>
        {!isPremium && (
          <p style={{
            fontSize: 11,
            color: limiteAtingido ? CORES.dourado : CORES.brancoMuted,
            textAlign: 'center',
            margin: '0 0 10px',
            lineHeight: 1.55,
            padding: limiteAtingido ? '8px 10px' : 0,
            borderRadius: limiteAtingido ? 10 : 0,
            background: limiteAtingido ? 'rgba(223,183,108,0.08)' : 'transparent',
            border: limiteAtingido ? `1px solid rgba(223,183,108,0.25)` : 'none',
          }}>
            {limiteAtingido
              ? t('oracle.limitReachedHint', { max: MAX_ORACLE_GRATIS })
              : (restantes === 1
                ? t('oracle.freeRemainingHint', { count: restantes, max: MAX_ORACLE_GRATIS })
                : t('oracle.freeRemainingHintPlural', { count: restantes, max: MAX_ORACLE_GRATIS }))}
          </p>
        )}
        {!isPremium && !limiteAtingido && texto.trim() === '' && (
          <div className="oracle-chat__suggestions" role="group" aria-label={t('oracle.suggestionsAria')}>
            {['suggestion1', 'suggestion2', 'suggestion3', 'suggestion4'].map((key) => (
              <button
                key={key}
                type="button"
                className="oracle-chat__suggestion-chip"
                onClick={() => setTexto(t(`oracle.${key}`))}
              >
                {t(`oracle.${key}`)}
              </button>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', gap: 10 }}>
        <input
          value={texto}
          onChange={e => setTexto(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && enviar()}
          placeholder={
            limiteAtingido
              ? t('oracle.placeholderLocked', { max: MAX_ORACLE_GRATIS })
              : t('oracle.placeholder')
          }
          style={{
            ...estilos.input,
            flex: 1,
            borderRadius: 24,
            padding: '12px 18px',
            opacity: limiteAtingido ? 0.85 : 1,
          }}
        />
        <button
          type="button"
          onClick={enviar}
          disabled={digitando}
          style={{
            width: 44, height: 44, borderRadius: '50%', border: 'none', flexShrink: 0,
            background: digitando ? 'rgba(223,183,108,0.25)'
              : limiteAtingido ? `linear-gradient(135deg,${CORES.dourado},${CORES.douradoEscuro})`
              : `linear-gradient(135deg,${CORES.dourado},${CORES.douradoEscuro})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: digitando ? 'default' : 'pointer',
          }}
        >
          <Send size={18} color={CORES.fundo} />
        </button>
        </div>
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
    <SidusLogo
      variant="horizontal"
      markSize={compact ? 30 : 34}
      onClick={onClick}
      glow
      className={compact ? 'sidus-logo--nav-compact' : 'sidus-logo--nav'}
    />
  )
}

function AvatarNav({ foto, nome, size = 36, ativo = false }) {
  const inicial = (nome || 'S').trim().charAt(0).toUpperCase()
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
      border: `2px solid ${ativo ? CORES.dourado : 'rgba(223,183,108,0.35)'}`,
      background: 'rgba(139,92,246,0.2)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: ativo ? `0 0 12px rgba(223,183,108,0.35)` : 'none',
    }}>
      {foto ? (
        <img src={foto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <span style={{ fontSize: size * 0.4, fontWeight: 700, color: CORES.dourado }}>{inicial}</span>
      )}
    </div>
  )
}

function Navbar({ passo, setPasso, isDesktop, dados, fotoPerfil }) {
  const { lang, t } = useLanguage()
  const [menuAberto, setMenuAberto] = useState(false)
  const [hover, setHover] = useState(null)
  const nomePerfil = dados?.nome?.trim() || t('perfil.defaultName')

  const irHome = () => {
    setPasso('home')
    setMenuAberto(false)
  }

  const irPerfil = () => {
    setPasso('perfil')
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
  ]

  const passosFerramenta = new Set(ferramentasNav.map((f) => f.id))

  const navegar = (id) => {
    setPasso(id)
    setMenuAberto(false)
  }

  const itemAtivo = (item) => passo === item.id

  useEffect(() => {
    setMenuAberto(false)
  }, [passo])

  useEffect(() => {
    const root = document.documentElement
    if (menuAberto) root.classList.add('sidus-mobile-menu-open')
    else root.classList.remove('sidus-mobile-menu-open')
    return () => root.classList.remove('sidus-mobile-menu-open')
  }, [menuAberto])

  const itemAtivoNav = itens.find((i) => itemAtivo(i))
  const headerStyle = isDesktop ? estilos.navbarDesktopTop : estilos.navbarMobileTop
  const perfilAtivo = passo === 'perfil'

  return (
    <>
      {isDesktop && (
        <button
          type="button"
          className="desktop-profile-fab"
          onClick={irPerfil}
          aria-label={t('nav.perfil')}
          title={`${t('nav.perfil')} - ${nomePerfil}`}
          style={{
            background: perfilAtivo ? 'rgba(223,183,108,0.18)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${perfilAtivo ? CORES.dourado : CORES.vidroBorda}`,
            borderRadius: '50%',
            padding: 2,
            cursor: 'pointer',
            lineHeight: 0,
          }}
        >
          <AvatarNav foto={fotoPerfil} nome={nomePerfil} size={34} ativo={perfilAtivo} />
        </button>
      )}
      <header style={headerStyle} className={isDesktop ? 'desktop-nav-header' : undefined}>
        {isDesktop ? (
          <>
            <div className="desktop-nav-brand">
              <LogoSidus onClick={irHome} compact />
              <LanguageSwitcher variant="inline" />
            </div>
            <div className="desktop-nav-scroll">
              <div className="desktop-nav-items">
              {itens.map((item) => {
                const Icon = item.icon
                const ativo = itemAtivo(item)
                const emHover = hover === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`desktop-nav-item${passosFerramenta.has(item.id) ? ' desktop-nav-item--tool' : ''}`}
                    onClick={() => navegar(item.id)}
                    onMouseEnter={() => setHover(item.id)}
                    onMouseLeave={() => setHover(null)}
                    title={item.label}
                    aria-label={item.label}
                    style={{
                      background: ativo ? 'rgba(223,183,108,0.18)' : emHover ? 'rgba(255,255,255,0.06)' : 'transparent',
                      border: `1px solid ${ativo ? CORES.dourado : emHover ? 'rgba(223,183,108,0.3)' : 'transparent'}`,
                      borderRadius: 8,
                      color: ativo ? CORES.dourado : emHover ? CORES.branco : CORES.brancoMuted,
                    }}
                  >
                    <Icon size={12} strokeWidth={ativo ? 2.2 : 1.8} />
                    <span className="desktop-nav-item__label">{item.label}</span>
                  </button>
                )
              })}
              </div>
            </div>
          </>
        ) : (
          <>
            <button
              type="button"
              className="mobile-menu-btn"
              aria-label={menuAberto ? t('nav.closeMenu') : t('nav.openMenu')}
              aria-expanded={menuAberto}
              onClick={() => setMenuAberto((v) => !v)}
              style={{
                background: menuAberto ? 'rgba(223,183,108,0.15)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${menuAberto ? CORES.dourado : CORES.vidroBorda}`,
                borderRadius: 10, color: CORES.dourado, width: 42, height: 42,
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
              }}
            >
              {menuAberto ? <X size={22} /> : <Menu size={22} />}
            </button>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, minWidth: 0 }}>
              <LogoSidus onClick={irHome} compact />
            </div>
            <LanguageSwitcher variant="compact" />
          </>
        )}
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
        <button
          type="button"
          onClick={irPerfil}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 14,
            padding: '16px 20px', border: 'none',
            borderBottom: `1px solid ${CORES.vidroBorda}`,
            background: passo === 'perfil' ? 'rgba(223,183,108,0.12)' : 'rgba(223,183,108,0.06)',
            cursor: 'pointer', textAlign: 'left',
          }}
        >
          <AvatarNav foto={fotoPerfil} nome={nomePerfil} size={44} ativo={passo === 'perfil'} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: CORES.branco, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{nomePerfil}</div>
            <div style={{ fontSize: 11, color: CORES.dourado, marginTop: 2 }}>{t('nav.perfil')}</div>
          </div>
        </button>
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
              {Icon ? <Icon size={20} strokeWidth={ativo ? 2.2 : 1.8} /> : <span style={{ width: 20 }} />}
              <span style={{ fontSize: 15, fontWeight: ativo ? 700 : 500, flex: 1 }}>{item.label}</span>
              {ativo && <span style={{ fontSize: 10, color: CORES.dourado }}>•</span>}
            </button>
          )
        })}
      </nav>
    </>
  )
}

const DADOS_VAZIO = { nome: '', data: '', hora: '', cidade: '', localizacao: null, fuso: null }

function dadosComRascunhoLanding(dados) {
  return normalizarDadosPerfil(mergeLandingDraft(dados)) || DADOS_VAZIO
}

export default function App() {
  const isDesktop = useIsDesktop()
  const { t, lang, setLang } = useLanguage()
  const { country, isBrasil } = useGeoCountry()
  const [utilizador, setUtilizador] = useState(null)
  const [authCarregando, setAuthCarregando] = useState(true)
  const [tipoAuth, setTipoAuth] = useState('register') // 'login' | 'register'
  const [isPremium, setIsPremium] = useState(false)
  const [mapaCompleto, setMapaCompleto] = useState(false)
  const [interpretacaoMapa, setInterpretacaoMapa] = useState(null)
  const [mapaGerado, setMapaGerado] = useState(false) // bloqueio: 1 mapa por utilizador
  const [leiturasTarotUsadas, setLeiturasTarotUsadas] = useState(0)
  const [tarotCreditoPago, setTarotCreditoPago] = useState(false)
  const [oraclePerguntasUsadas, setOraclePerguntasUsadas] = useState(0)
  const [fotoPerfil, setFotoPerfil] = useState(() => {
    try { return localStorage.getItem('sidus_foto') || null } catch { return null }
  })
  const [perfilCarregando, setPerfilCarregando] = useState(false)
  const [reparandoDados, setReparandoDados] = useState(false)
  const [cookieConsent, setCookieConsent] = useState(() => getCookieConsent())

  // ── Dados natais ─────────────────────────────────────────────────────────
  const [passo, setPasso] = useState(() => passoFromPath(window.location.pathname))
  const [paywallTool, setPaywallTool] = useState(null)
  const [dados, setDados] = useState(DADOS_VAZIO)
  const [mapaNatal, setMapaNatal] = useState(null)
  const [planetasNascimento, setPlanetasNascimento] = useState([])

  const [ferramentaAberta, setFerramentaAberta] = useState(null)
  const [modalPagamento, setModalPagamento] = useState(null)
  const [pagamentoMsg, setPagamentoMsg] = useState(null)

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (authCarregando) return
    const seoPasso = !utilizador && (passo === 'home' || passo === 'onboarding') ? 'login' : passo
    applyRouteSeo(seoPasso, lang)
  }, [passo, lang, utilizador, authCarregando])

  useEffect(() => {
    try { setFotoPerfil(localStorage.getItem('sidus_foto') || null) } catch { /* quota */ }
  }, [passo])

  const mapaDesbloqueado = isPremium || mapaCompleto
  const acessoVip = mapaDesbloqueado
  const contaConfigurada = mapaGerado || acessoVip

  const irPara = useCallback((novoPasso, { replace = false, paywallTool: tool = null } = {}) => {
    setFerramentaAberta(null)
    let destino = novoPasso
    if (destino === 'onboarding' && utilizador && contaConfigurada) {
      destino = 'home'
    }
    if (destino === 'numerologia' && !acessoVip) {
      setPaywallTool(destino)
      destino = 'paywall'
    } else if (destino === 'paywall' && tool) {
      setPaywallTool(tool)
    } else if (destino !== 'paywall') {
      setPaywallTool(null)
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
  const paymentVerificadoRef = useRef(new Set())

  const destinoAposPagamento = useCallback((productType) => {
    if (productType === 'tarot') return 'tarot'
    if (productType === 'premium' || productType === 'mapa') {
      return dadosNataisMinimos(dados) ? 'mapa' : 'onboarding'
    }
    return 'mapa'
  }, [dados])

  const productTypePagamentoPendente = useCallback(() => {
    try {
      const raw = sessionStorage.getItem('sidus_payment_pending')
      if (!raw) return null
      return JSON.parse(raw)?.productType || null
    } catch {
      return null
    }
  }, [])
  useEffect(() => { passoRef.current = passo }, [passo])

  // ── Escuta o estado de autenticação Firebase + perfil em tempo real ─────────
  useEffect(() => {
    let cancelled = false
    let unsubPerfil = null
    let authResolvido = false
    let perfilTimeoutId = null
    let timeoutId = null
    let unsubscribeAuth = () => {}

    const clearPerfilTimeout = () => {
      if (perfilTimeoutId) {
        clearTimeout(perfilTimeoutId)
        perfilTimeoutId = null
      }
    }

    firebaseReady.then(() => {
      if (cancelled) return
      if (!firebaseDisponivel || !auth) {
        setAuthCarregando(false)
        setPerfilCarregando(false)
        return
      }

      timeoutId = setTimeout(() => {
        if (authResolvido) return
        console.warn('[Sidus] Auth demorou demasiado - a continuar sem bloquear a interface')
        setAuthCarregando(false)
        setPerfilCarregando(false)
      }, 10000)

      unsubscribeAuth = onAuthStateChanged(auth, (user) => {
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
          console.warn('[Sidus] Perfil cloud demorou - a continuar sem bloquear a interface')
          setPerfilCarregando(false)
        }, 8000)

        unsubPerfil = onSnapshot(
          doc(db, 'users', user.uid),
          (snap) => {
            clearPerfilTimeout()

            if (!snap.exists()) {
              ;(async () => {
                try {
                  await inicializarPerfilUsuario(user)
                } catch (e) {
                  console.warn('[Sidus] Inicializar perfil:', e?.message)
                } finally {
                  setPerfilCarregando(false)
                }
              })()
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
                if (perfil.interpretacaoMapa?.seccoes?.length) {
                  setInterpretacaoMapa(perfil.interpretacaoMapa)
                }

                let dadosPerfil = perfil.dados ? normalizarDadosPerfil(perfil.dados) : null
                const pathAtual = stripLangPrefix(typeof window !== 'undefined' ? window.location.pathname : '/')
                const emOnboarding = pathAtual === '/comecar' || passoRef.current === 'onboarding'
                const cache = restaurarCachePerfil(user.uid)

                if (!emOnboarding && mapaNatalValido(cache.mapa)) {
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
                if (dadosPerfil && !emOnboarding) {
                  setDados((prev) => normalizarDadosPerfil({ ...DADOS_VAZIO, ...prev, ...dadosPerfil }) || DADOS_VAZIO)
                }

                if (perfil.mapaGerado === true || perfil.dadosTravados === true) {
                  setMapaGerado(true)
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
        setInterpretacaoMapa(null)
        setLeiturasTarotUsadas(0)
        setPerfilCarregando(false)
      }
      setAuthCarregando(false)
    })
    })

    return () => {
      cancelled = true
      if (timeoutId) clearTimeout(timeoutId)
      clearPerfilTimeout()
      unsubPerfil?.()
      unsubscribeAuth()
    }
  }, [])

  useEffect(() => {
    if (isPremium) {
      document.documentElement.classList.add('sidus-no-ads')
    } else {
      document.documentElement.classList.remove('sidus-no-ads')
    }
    return () => document.documentElement.classList.remove('sidus-no-ads')
  }, [isPremium])

  useEffect(() => {
    if (!allowsAds()) return
    initGoogleAnalytics()
    initAdSense()
  }, [cookieConsent])

  // Firebase email verification (?mode=verifyEmail&oobCode=...) - link abre na app
  useEffect(() => {
    if (oobCodeTratado.current) return
    const params = new URLSearchParams(location.search)
    const mode = params.get('mode')
    const oobCode = params.get('oobCode')
    if (mode !== 'verifyEmail' || !oobCode) return

    firebaseReady.then(() => {
      if (!auth || !firebaseDisponivel || oobCodeTratado.current) return

    oobCodeTratado.current = true

    const irParaOnboarding = async () => {
      flushLandingDraft()
      if (auth.currentUser) {
        await reload(auth.currentUser)
        await auth.currentUser.getIdToken(true)
        setUtilizador(auth.currentUser)
        setDados((prev) => dadosComRascunhoLanding(prev))
        setPagamentoMsg({ tipo: 'sucesso', texto: t('emailVerify.confirmedAuto') })
        navigate({ pathname: '/comecar', search: '' }, { replace: true })
        setPasso('onboarding')
        return
      }
      setPagamentoMsg({ tipo: 'sucesso', texto: t('emailVerify.confirmedLogin') })
      setTipoAuth('login')
      setPasso('login')
      navigate({ pathname: '/login', search: '' }, { replace: true })
    }

    ;(async () => {
      try {
        await applyActionCode(auth, oobCode)
        await irParaOnboarding()
      } catch (e) {
        console.warn('[Sidus] verifyEmail:', e?.code, e?.message)
        try {
          if (auth.currentUser) {
            await reload(auth.currentUser)
            await auth.currentUser.getIdToken(true)
          }
          if (auth.currentUser?.emailVerified) {
            await irParaOnboarding()
            return
          }
        } catch { /* ignore */ }
        oobCodeTratado.current = false
        setPagamentoMsg({ tipo: 'info', texto: t('emailVerify.verifyFailed') })
      }
    })()
    })
  }, [location.search, navigate, t])

  const rotasPublicasSemAuth = new Set(['/login', '/privacidade', '/divulgacao-premium', '/divulgacao-vip'])

  // Visitante → /login (exceto rotas públicas)
  useEffect(() => {
    if (authCarregando) return
    if (utilizador) return
    const params = new URLSearchParams(location.search)
    if (params.get('mode') === 'verifyEmail' && params.get('oobCode')) return
    const path = stripLangPrefix(location.pathname)
    if (rotasPublicasSemAuth.has(path)) return
    navigate('/login', { replace: true })
  }, [authCarregando, utilizador, location.pathname, location.search, navigate])

  // Após login: contas existentes → perfil; contas novas → onboarding (1x)
  useEffect(() => {
    if (authCarregando || perfilCarregando) return
    const hadUser = prevUserRef.current
    prevUserRef.current = utilizador
    if (!utilizador) return
    if (precisaVerificarEmail(utilizador)) return

    const path = (location.pathname || '/').replace(/\/$/, '') || '/'
    if (path === '/login') {
      setPagamentoMsg(null)
      navigate(contaConfigurada ? '/home' : '/comecar', { replace: true })
      if (!contaConfigurada) setPasso('onboarding')
      return
    }

    const acabouDeEntrar = hadUser === null || hadUser === undefined
    if (!acabouDeEntrar) return

    if (!contaConfigurada) {
      const pathSemLang = stripLangPrefix(location.pathname)
      if (pathSemLang === '/divulgacao-premium' || pathSemLang === '/divulgacao-vip') return
      navigate('/comecar', { replace: true })
      return
    }

    const irParaHome = ['/login', '/home', '/', '/inicio', '/perfil'].includes(path)
    if (irParaHome) {
      navigate('/home', { replace: true })
      setPasso('home')
    }
  }, [authCarregando, perfilCarregando, utilizador, location.pathname, navigate, contaConfigurada])

  // Rascunho da landing → dados do perfil assim que há sessão (sobrevive à verificação de e-mail)
  useEffect(() => {
    if (!utilizador || contaConfigurada) return
    flushLandingDraft()
    setDados((prev) => dadosComRascunhoLanding(prev))
  }, [utilizador, contaConfigurada])

  // Idioma na URL (/pt/... /en/...)
  useEffect(() => {
    if (authCarregando) return
    const urlLang = langFromPath(location.pathname)
    if (urlLang && urlLang !== lang) setLang(urlLang)
  }, [location.pathname, authCarregando, lang, setLang])

  // URL ↔ passo (voltar atrás no browser, links directos) - só reage a mudanças de URL
  useEffect(() => {
    if (authCarregando) return
    const path = stripLangPrefix(location.pathname)
    const fromUrl = passoFromPath(location.pathname)

    // Conta já configurada: nunca ficar preso em /comecar (evita loop URL↔redirect)
    if (utilizador && contaConfigurada && (path === '/comecar' || fromUrl === 'onboarding')) {
      if (path !== '/home' || passoRef.current !== 'home') {
        setPasso('home')
        navigate('/home', { replace: true })
      }
      return
    }

    if (fromUrl !== passoRef.current) {
      setPasso(fromUrl)
    }
  }, [location.pathname, authCarregando, utilizador, contaConfigurada, navigate])

  // ── Retorno Stripe Checkout (?payment=success&session_id=...) ─────────────
  useEffect(() => {
    if (authCarregando) return
    const params = new URLSearchParams(location.search)
    let payment = params.get('payment')
    let sessionId = params.get('session_id')

    if (!payment && !sessionId) {
      sessionId = sessionStorage.getItem('sidus_stripe_session')
      if (sessionId) payment = 'success'
    }

    if (!payment) return

    if (payment === 'cancelled') {
      sessionStorage.removeItem('sidus_stripe_session')
      navigate(pathFromPasso(passoFromPath(location.pathname), lang), { replace: true })
      setPagamentoMsg({ tipo: 'info', texto: t('payment.cancelled') })
      return
    }

    if (payment !== 'success' || !sessionId) return

    if (!utilizador) {
      sessionStorage.setItem('sidus_stripe_session', sessionId)
      return
    }

    const verifyKey = `${utilizador.uid}:${sessionId}`
    if (paymentVerificadoRef.current.has(verifyKey)) return

    const tentarVerificar = async (tentativa = 0) => {
      paymentVerificadoRef.current.add(verifyKey)
      try {
        const result = await verificarSessaoPagamento(sessionId, utilizador.uid)

        if (!result.ok) {
          if (result.pending && tentativa < 10) {
            paymentVerificadoRef.current.delete(verifyKey)
            setPagamentoMsg({ tipo: 'info', texto: t('payment.processing') })
            window.setTimeout(() => tentarVerificar(tentativa + 1), 8000)
            return
          }
          if (result.pending) {
            sessionStorage.setItem('sidus_stripe_session', sessionId)
            setPagamentoMsg({ tipo: 'info', texto: t('payment.processing') })
            const destino = destinoAposPagamento(productTypePagamentoPendente() || 'mapa')
            navigate(pathFromPasso(destino, lang), { replace: true })
            return
          }
          paymentVerificadoRef.current.delete(verifyKey)
          setPagamentoMsg({ tipo: 'info', texto: t('payment.processing') })
          const destino = destinoAposPagamento(productTypePagamentoPendente() || 'mapa')
          navigate(pathFromPasso(destino, lang), { replace: true })
          return
        }

        sessionStorage.removeItem('sidus_stripe_session')

        if (result.productType === 'premium') {
          trackPurchaseConversion('premium', PRECO_PREMIUM_UNICO)
          setIsPremium(true)
          setMapaCompleto(true)
          const destino = destinoAposPagamento('premium')
          setPasso(destino)
          navigate(pathFromPasso(destino, lang), { replace: true })
          setPagamentoMsg({ tipo: 'sucesso', texto: t('payment.premiumWelcome') })
        } else if (result.productType === 'mapa') {
          trackPurchaseConversion('mapa', PRECO_MAPA_COMPLETO)
          setMapaCompleto(true)
          const destino = destinoAposPagamento('mapa')
          setPasso(destino)
          navigate(pathFromPasso(destino, lang), { replace: true })
          setPagamentoMsg({ tipo: 'sucesso', texto: t('payment.mapaUnlocked') })
        } else if (result.productType === 'tarot') {
          sessionStorage.setItem('sidus_tarot_paid', '1')
          setTarotCreditoPago(true)
          setPasso('tarot')
          navigate(pathFromPasso('tarot', lang), { replace: true })
          setPagamentoMsg({ tipo: 'sucesso', texto: t('payment.tarotUnlocked') })
        }
        sessionStorage.removeItem('sidus_payment_pending')
      } catch (e) {
        console.error('[Sidus Pagamento] Verificação falhou:', e?.message)
        paymentVerificadoRef.current.delete(verifyKey)
        const msg = e?.message?.includes('FIREBASE_SERVICE_ACCOUNT')
          || e?.message?.includes('Firestore')
          ? t('payment.verifyFailFirebase')
          : e?.message?.includes('utilizador')
            ? t('payment.verifyFailUser')
            : t('payment.verifyFail')
        setPagamentoMsg({ tipo: 'erro', texto: msg })
        const destino = destinoAposPagamento(productTypePagamentoPendente() || 'mapa')
        navigate(pathFromPasso(destino, lang), { replace: true })
      }
    }

    tentarVerificar()
  }, [utilizador, authCarregando, location.search, location.pathname, navigate, t, lang, dados, destinoAposPagamento, productTypePagamentoPendente])

  // ── Guarda dados natais no Firestore quando o onboarding termina (1x por conta) ──
  const guardarPerfil = useCallback(async (dadosNovos, opts = {}) => {
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
        if (perfilCompleto && !opts.permitirEdicao) return false
      }
      const payload = opts.permitirEdicao
        ? { dados: prontos }
        : { dados: prontos, dadosTravados: true, mapaGerado: true }
      await setDoc(ref, payload, { merge: true })
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

  // ── Recalcula mapa natal (motor único - gratuito = Premium) ──
  useEffect(() => {
    if (passo === 'onboarding') return
    const prontos = dadosProntosParaMapa(dados)
    if (!prontos) return
    try {
      const mapa = calcularMapaNatalMotor(prontos, sweRef.current)
      if (mapaNatalValido(mapa)) setMapaNatal(mapa)
    } catch (e) {
      console.warn('[Sidus] Cálculo mapa natal:', e?.message)
    }
  }, [dados, sweReady, passo])

  // Cache local do mapa (fallback quando Firestore tem dados incompletos)
  useEffect(() => {
    if (!utilizador?.uid || !mapaNatal) return
    guardarCachePerfil(utilizador.uid, dados, mapaNatal)
  }, [utilizador, mapaNatal, dados])

  // Reparar dados incompletos - nunca durante /comecar (utilizador a escrever/seleccionar cidade)
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
        if (reparado && typeof reparado === 'object' && JSON.stringify(reparado) !== JSON.stringify(dados)) {
          setDados(normalizarDadosPerfil(reparado) || DADOS_VAZIO)
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
    if (passo === 'onboarding') return
    const prontos = dadosProntosParaMapa(dados)
    if (!prontos) { setPlanetasNascimento([]); return }
    const dataUTC = criarDataUTCporLocal(prontos.data, prontos.hora, prontos.fuso ?? 0)
    setPlanetasNascimento(sweRef.current
      ? calcularPlanetasComSwe(sweRef.current, dataUTC, PLANETAS_NATAL)
      : calcularPlanetasNatalParaData(dataUTC))
  }, [dados, sweReady, passo])

  // ── Acções ─────────────────────────────────────────────────────────────────
  const handleOnboarding = async () => {
    const dadosActuais = dadosComRascunhoLanding(dados)
    setDados(dadosActuais)

    if (mapaGerado && dadosNataisCompletos(dadosActuais) && mapaNatal) {
      irPara('perfil', { replace: true })
      return
    }
    const erros = validarOnboarding(dadosActuais, lang)
    if (Object.keys(erros).length > 0) return

    const prontos = dadosProntosParaMapa(dadosActuais)
    if (!prontos) return

    const mapa = calcularMapaNatalMotor(prontos, sweRef.current)
    if (mapaNatalValido(mapa)) setMapaNatal(mapa)
    const guardado = await guardarPerfil(dadosActuais)
    clearLandingDraft()
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

  const handleEditarDadosNatalis = useCallback(async (parcial) => {
    const chave = utilizador?.uid ? `sidus_natal_edits_${utilizador.uid}` : 'sidus_natal_edits_local'
    const usados = parseInt(localStorage.getItem(chave) || '0', 10)
    if (usados >= 1) return false
    const novos = { ...dados, ...parcial }
    setDados(novos)
    const prontos = dadosProntosParaMapa(novos)
    if (prontos) {
      const mapa = calcularMapaNatalMotor(prontos, sweRef.current)
      if (mapaNatalValido(mapa)) setMapaNatal(mapa)
    }
    await guardarPerfil(novos, { permitirEdicao: true })
    localStorage.setItem(chave, '1')
    return true
  }, [dados, utilizador])

  const registarOraclePerguntaUsada = useCallback(async (total) => {
    setOraclePerguntasUsadas(total)
    if (!utilizador || !firebaseDisponivel || !db) return
    try {
      await setDoc(doc(db, 'users', utilizador.uid), { oraclePerguntasUsadas: total }, { merge: true })
    } catch { /* offline */ }
  }, [utilizador])

  const obterIdTokenOracle = useCallback(async (forcar = false) => {
    if (!utilizador) return null
    try {
      return await utilizador.getIdToken(forcar === true)
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

  const abrirPagamento = (descricao, valor, onSucesso, opts = {}) => {
    if (!utilizador?.uid) {
      setPagamentoMsg({ tipo: 'erro', texto: t('pagamento.needLogin') })
      return false
    }
    const productType = opts.productType || null
    setModalPagamento({ descricao, valor, onSucesso, productType })
    return true
  }

  // Activa premium em modo dev (só localhost - não escreve isPremium em produção)
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

  const mostrarNavbar = utilizador && contaConfigurada && passo !== 'paywall' && passo !== 'vipPromo'

  const chatFullScreen = passo === 'chat'
  const mostrarBottomNav = !isDesktop && mostrarNavbar && !chatFullScreen
    && passo !== 'onboarding' && passo !== 'paywall' && passo !== 'vipPromo'
  const linkEmailPendente = (() => {
    const p = new URLSearchParams(location.search)
    return p.get('mode') === 'verifyEmail' && Boolean(p.get('oobCode'))
  })()

  // Ecrã de carregamento (auth, perfil Firestore, ou link de verificação a processar)
  if (authCarregando || linkEmailPendente || (utilizador && perfilCarregando)) {
    return (
      <div style={{ ...estilos.app, display: 'flex', flexDirection: 'column', minHeight: '100svh' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 20px' }}>
          <Loader2 size={36} color={CORES.dourado} strokeWidth={1.5} style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ color: CORES.brancoMuted, marginTop: 16, fontSize: 14, textAlign: 'center' }}>
            {linkEmailPendente ? t('common.verifying') : t('common.loading')}
          </p>
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
      if (passo === 'vipPromo') {
        return (
          <VipPromoPage
            user={null}
            isPremium={false}
            isDesktop={isDesktop}
            obterIdToken={null}
            onVoltar={() => navigate('/login', { replace: true })}
            onLogin={() => navigate('/login')}
          />
        )
      }
      return <EcraAuth tipo={tipoAuth} onMudar={setTipoAuth} isDesktop={isDesktop} firebaseOk={firebaseDisponivel} />
    }
    if (bloqueadoPorEmailNaoVerificado(utilizador, passo)) {
      return (
        <EcraVerificarEmail
          utilizador={utilizador}
          isDesktop={isDesktop}
          onLogout={handleLogout}
          onVerificado={() => {
            flushLandingDraft()
            reload(auth.currentUser).then(() => {
              setUtilizador(auth.currentUser)
              setDados((prev) => dadosComRascunhoLanding(prev))
              navigate('/comecar', { replace: true })
              setPasso('onboarding')
            }).catch(() => {})
          }}
        />
      )
    }
    // /comecar - só contas novas sem mapa (utilizadores com sessão activa redireccionados)
    if (passo === 'onboarding') {
      return (
        <Onboarding
          dados={dadosComRascunhoLanding(dados)}
          setDados={setDados}
          onSubmit={handleOnboarding}
          isDesktop={isDesktop}
        />
      )
    }
    if (passo === 'vipPromo') {
      return (
        <VipPromoPage
          user={utilizador}
          isPremium={isPremium}
          isDesktop={isDesktop}
          obterIdToken={obterIdTokenOracle}
          onVoltar={() => irPara(isPremium ? 'perfil' : (contaConfigurada ? 'home' : 'paywall'))}
          onLogin={() => irPara('login')}
        />
      )
    }
    if (!contaConfigurada) {
      return (
        <Onboarding
          dados={dadosComRascunhoLanding(dados)}
          setDados={setDados}
          onSubmit={handleOnboarding}
          isDesktop={isDesktop}
        />
      )
    }
    // Autenticado com mapa → navegação normal
    switch (passo) {
      case 'home':
      case 'dashboard':
        return (
          <Dashboard nome={dados.nome} mapaNatal={mapaNatal} ceuAgora={ceuAgora} aspetos={aspetosAgora} onOraculo={() => irPara('chat')} onPrivacidade={() => irPara('privacidade')} isDesktop={isDesktop} isPremium={isPremium} onUpgrade={() => irPara('paywall')} onTarot={() => irPara('tarot')} onMapa={() => irPara('mapa')} userEmail={utilizador?.email} user={utilizador} oraclePerguntasUsadas={oraclePerguntasUsadas} leiturasTarotUsadas={leiturasTarotUsadas} isBrasil={isBrasil} />
        )
      case 'mapa':
        return <MapaAstral mapaNatal={mapaNatal} dados={dados} planetasNascimento={planetasNascimento} mapaDesbloqueado={isPremium || mapaCompleto} isPremium={isPremium} onUpgrade={() => irPara('paywall')} onComprarMapa={() => abrirPagamento(t('mapa.buyDesc'), PRECO_MAPA_COMPLETO, null, { productType: 'mapa' })} onMapaGerado={handleMapaGerado} isDesktop={isDesktop} perfilCarregando={perfilCarregando} reparandoDados={reparandoDados} mapaGerado={mapaGerado} onCompletarNatal={() => irPara('home')} obterIdToken={obterIdTokenOracle} interpretacaoPerfil={interpretacaoMapa} isBrasil={isBrasil} />
      case 'tarot':
        return (
          <Suspense fallback={<RouteLoader />}>
            <EcraTarotLazy mapaNatal={mapaNatal} isPremium={acessoVip} userId={utilizador?.uid} leiturasTarotUsadas={leiturasTarotUsadas} tarotCreditoPago={tarotCreditoPago} onTarotCreditoConsumido={() => setTarotCreditoPago(false)} onLeituraGratisUsada={registarLeituraTarotGratis} onLeituraConcluida={() => { if (precisaVerificarEmail(utilizador)) marcarTarotPreVerifyUsado() }} onPagar={abrirPagamento} onVoltar={() => irPara('home')} onPremium={() => irPara('paywall')} isBrasil={isBrasil} />
          </Suspense>
        )
      case 'bussola':
        return (
          <Suspense fallback={<RouteLoader />}>
            <BussolaCosmicaLazy mapaNatal={mapaNatal} planetasNatal={planetasNascimento} onVoltar={() => irPara('home')} />
          </Suspense>
        )
      case 'sinastria':
        return (
          <Suspense fallback={<RouteLoader />}>
            <SinastriaLazy mapaNatal={mapaNatal} dadosUtilizador={dados} isPremium={acessoVip} onUpgrade={() => irPara('paywall', { paywallTool: 'sinastria' })} onVoltar={() => irPara('home')} />
          </Suspense>
        )
      case 'biorritmo':
        return (
          <Suspense fallback={<RouteLoader />}>
            <BiorritmoLazy dados={dados} utilizador={utilizador} mapaNatal={mapaNatal} onVoltar={() => irPara('home')} />
          </Suspense>
        )
      case 'horasIguais':
        return (
          <Suspense fallback={<RouteLoader />}>
            <HorasIguaisLazy onVoltar={() => irPara('home')} />
          </Suspense>
        )
      case 'numerologia':
        return (
          <Suspense fallback={<RouteLoader />}>
            <NumerologiaLazy dados={dados} utilizador={utilizador} mapaNatal={mapaNatal} onVoltar={() => irPara('home')} />
          </Suspense>
        )
      case 'sonhos':
        return (
          <Suspense fallback={<RouteLoader />}>
            <InterpretacaoSonhosLazy mapaNatal={mapaNatal} onVoltar={() => irPara('home')} />
          </Suspense>
        )
      case 'diario':
        return (
          <Suspense fallback={<RouteLoader />}>
            <DiarioAstralLazy mapaNatal={mapaNatal} onVoltar={() => irPara('home')} />
          </Suspense>
        )
      case 'paywall':
        return <Paywall onVoltar={() => irPara('home')} onPagar={abrirPagamento} onPromo={() => irPara('vipPromo')} onSucesso={() => { setIsPremium(true); setMapaCompleto(true); irPara(dadosNataisMinimos(dados) ? 'mapa' : 'onboarding') }} isDesktop={isDesktop} isBrasil={isBrasil} oraclePerguntasUsadas={oraclePerguntasUsadas} leiturasTarotUsadas={leiturasTarotUsadas} paywallTool={paywallTool} />
      case 'chat':
        return <Chat mapaNatal={mapaNatal} isPremium={isPremium} userId={utilizador?.uid} oracleRemotas={oraclePerguntasUsadas} onOracleUsada={registarOraclePerguntaUsada} onUpgrade={() => irPara('paywall')} onPromo={() => irPara('vipPromo')} leiturasTarotUsadas={leiturasTarotUsadas} obterIdToken={obterIdTokenOracle} isBrasil={isBrasil} isDesktop={isDesktop} />
      case 'perfil':
        return <Perfil utilizador={utilizador} dados={dados} mapaNatal={mapaNatal} isPremium={isPremium}
          dadosBloqueados={dadosBloqueados}
          onLogout={handleLogout}
          onVipPromo={() => irPara('vipPromo')}
          onEditarDados={handleEditarDadosNatalis}
          obterIdToken={obterIdTokenOracle} />
      default:
        return <Dashboard nome={dados.nome} mapaNatal={mapaNatal} ceuAgora={ceuAgora} aspetos={aspetosAgora} onOraculo={() => irPara('chat')} onPrivacidade={() => irPara('privacidade')} isDesktop={isDesktop} isPremium={isPremium} onUpgrade={() => irPara('paywall')} onTarot={() => irPara('tarot')} onMapa={() => irPara('mapa')} userEmail={utilizador?.email} user={utilizador} oraclePerguntasUsadas={oraclePerguntasUsadas} leiturasTarotUsadas={leiturasTarotUsadas} isBrasil={isBrasil} />
    }
  }

  const paddingTopo = mostrarNavbar
    ? (isDesktop ? 58 : 56)
    : (isDev && contaConfigurada ? (isDesktop ? 28 : 30) : 0)

  const shellStyle = isDesktop ? estilos.appDesktop : estilos.app
  const margemNav = 0

  return (
    <>
    <div className={`sidus-cosmic-shell${!utilizador ? ' sidus-login-shell' : ' sidus-app-shell'}`} style={shellStyle}>
      <div className="sidus-cosmic-backdrop" aria-hidden="true">
        <LandingCosmicBackground />
      </div>
      <div className="sidus-cosmic-foreground">
      {/* Barra de dev - só visível em localhost */}
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

      <div
        className={[
          !utilizador ? 'landing-auth-page-wrap' : 'sidus-app-content',
          chatFullScreen ? 'sidus-app-content--chat-full' : null,
          mostrarBottomNav ? 'mobile-shell-pad-bottom' : null,
        ].filter(Boolean).join(' ') || undefined}
        style={{
        paddingTop: paddingTopo,
        marginTop: margemNav,
        paddingBottom: 0,
        height: chatFullScreen ? `calc(100svh - ${paddingTopo}px)` : undefined,
        maxHeight: chatFullScreen ? `calc(100svh - ${paddingTopo}px)` : undefined,
        overflow: chatFullScreen ? 'hidden' : undefined,
        display: chatFullScreen ? 'flex' : undefined,
        flexDirection: chatFullScreen ? 'column' : undefined,
        minHeight: chatFullScreen ? 0 : undefined,
        position: 'relative',
        zIndex: 1,
      }}>
        <ErrorBoundary resetKey={passo} compact={passo === 'tarot'}>
          <div className="sidus-page-root">
            {renderEcran()}
          </div>
        </ErrorBoundary>
      </div>
      {!isPremium && allowsAds() && shouldShowAdsOnPasso(passo) && (
        <AdSenseBanner key={passo} isPremium={isPremium} />
      )}
      {!chatFullScreen && (
        <RodapeSidus isDesktop={isDesktop} mostrarNavbar={mostrarNavbar} />
      )}
      {mostrarNavbar && (
        <Navbar
          passo={passo}
          isDesktop={isDesktop}
          setPasso={irPara}
          dados={dados}
          fotoPerfil={fotoPerfil}
        />
      )}

      {/* Modal de pagamento - sobrepõe tudo */}
      {modalPagamento && (
        <ModalPagamento
          descricao={modalPagamento.descricao}
          valor={modalPagamento.valor}
          userId={utilizador?.uid}
          userEmail={utilizador?.email}
          productType={modalPagamento.productType}
          country={isBrasil ? 'BR' : country}
          onSucesso={() => { modalPagamento.onSucesso?.(); setModalPagamento(null) }}
          onFechar={() => setModalPagamento(null)}
        />
      )}

      <CookieConsent
        onConsentChange={setCookieConsent}
        onPrivacy={() => irPara('privacidade')}
      />

      </div>
      {mostrarBottomNav && (
        <MobileBottomNav passo={passo} onNavigate={irPara} />
      )}
    </div>
    <MagicCursorTrail />
    </>
  )
}
