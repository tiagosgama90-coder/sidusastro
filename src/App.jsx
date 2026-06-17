import { useState, useEffect, useRef } from 'react'
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
} from 'lucide-react'
import { Body, GeoVector, Ecliptic, MakeTime, SiderealTime } from 'astronomy-engine'
import { pesquisarCidades, pesquisarFusoHorario } from './lib/geocoding'

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

const ASPECTOS_MAIORES = [
  { nome: 'Conjuncao', angulo: 0 },
  { nome: 'Sextil', angulo: 60 },
  { nome: 'Quadratura', angulo: 90 },
  { nome: 'Trigono', angulo: 120 },
  { nome: 'Oposicao', angulo: 180 },
]

const FERRAMENTAS = [
  { id: 'bussola', nome: 'Bussola Cosmica 2026', icon: Compass, premium: true },
  { id: 'sinastria', nome: 'Radar de Afinidades', sub: 'Sinastria', icon: Heart, premium: true },
  { id: 'tarot', nome: 'Arcanos Virtuais', sub: 'Tarot', icon: Layers, premium: true },
  { id: 'biorritmo', nome: 'Fluxo Vital', sub: 'Biorritmo', icon: Activity, premium: false },
  { id: 'diario', nome: 'Diario Astral', icon: BookOpen, premium: false },
]

const BENEFICIOS_VIP = [
  'Bussola Cosmica 2026 com previsoes mensais',
  'Radar de Afinidades e Sinastria completa',
  'Leituras diarias dos Arcanos Virtuais',
  'Chat ilimitado com o Astrologo IA',
  'Alertas de transitos planetarios em tempo real',
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
    maxWidth: 430,
    margin: '0 auto',
    background: `radial-gradient(ellipse at 20% 0%, rgba(88, 28, 135, 0.35) 0%, transparent 55%),
      radial-gradient(ellipse at 80% 100%, rgba(67, 56, 202, 0.2) 0%, transparent 50%),
      ${CORES.fundo}`,
    color: CORES.branco,
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
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
    flex: 1,
    overflowY: 'auto',
    padding: '24px 20px',
    paddingBottom: 100,
    position: 'relative',
    zIndex: 1,
    textAlign: 'left',
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
    maxWidth: 430,
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

function calcularPlanetasParaData(dateObj) {
  const time = MakeTime(dateObj)

  return PLANETAS_AGORA.map((p) => {
    const vector = Position(p.corpo, time)
    const ecl = Ecliptic(vector)
    const signo = longitudeParaSigno(ecl.elon)
    return {
      ...p,
      vector,
      longitude: ecl.elon,
      signo,
      texto: `${p.nome} em ${signo.nome} ${signo.simbolo} (${signo.graus}°)`,
    }
  })
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
function calcularAscendenteReal(dataUTC, latitude, longitude) {
  const time = MakeTime(dataUTC)

  // GMST em horas → graus (SiderealTime usa os mesmos coeficientes do JPL)
  const gmstHoras = SiderealTime(time)
  const gmstGraus = gmstHoras * 15

  // Tempo Sideral Local (LST)
  const lst = ((gmstGraus + longitude) % 360 + 360) % 360

  // Obliquidade da eclíptica IAU (T em séculos desde J2000)
  const T = (dataUTC.getTime() / 86400000 - 10957.5) / 36525
  const e = ((23.439291111 - 0.013004167 * T - 0.000000164 * T * T + 0.000000504 * T * T * T) * Math.PI) / 180

  const lstRad = (lst * Math.PI) / 180
  const latRad = (latitude * Math.PI) / 180

  // Meeus: SINAL + no denominador é obrigatório
  const asc =
    Math.atan2(
      -Math.cos(lstRad),
      Math.sin(lstRad) * Math.cos(e) + Math.tan(latRad) * Math.sin(e),
    ) * (180 / Math.PI)

  return ((asc % 360) + 360) % 360
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

  // Ascendente com SiderealTime de alta precisão
  const lonAsc = calcularAscendenteReal(dataUTC, lat, lon)

  return {
    solar:      longitudeParaSigno(lonSol),
    lunar:      longitudeParaSigno(lonLua),
    ascendente: longitudeParaSigno(lonAsc),
    instanteUTC: dataUTC.toISOString(),
    lat,
    lon,
    fuso,
  }
}

// ─── Swiss Ephemeris — funções de cálculo ────────────────────────────────────

/**
 * Calcula posições planetárias usando swe_calc_ut (Swiss Ephemeris).
 * Inclui detecção de retrogradação (velocidade < 0).
 */
function calcularPlanetasComSwe(swe, dateUTC) {
  const jd = swe.dateToJulianDay(dateUTC)
  return PLANETAS_AGORA.map((p) => {
    const pos = swe.calculatePosition(jd, p.sweId)
    const signo = longitudeParaSigno(pos.longitude)
    const retro = pos.speed < 0
    return {
      ...p,
      longitude: pos.longitude,
      signo,
      retrograde: retro,
      texto: `${p.nome} em ${signo.nome} ${signo.simbolo} (${signo.graus}°)${retro ? ' ℞' : ''}`,
    }
  })
}

/**
 * Calcula mapa natal completo usando:
 * - swe_calc_ut para Sol, Lua e todos os planetas
 * - swe_houses (Placidus, 'P') para Ascendente e Meio do Céu exactos
 */
function calcularMapaNatalComSwe(swe, dados) {
  if (!dados.data || !dados.hora || !dados.localizacao) return null

  const { lat } = dados.localizacao
  // Longitude OESTE deve ser negativa para a Swiss Ephemeris
  // Nominatim já devolve negativo para Oeste, mas garantimos aqui por segurança
  const lon = dados.localizacao.lon

  const fuso = dados.fuso ?? 0
  // UTC exacto com DST histórico da zona (via localToUTC ou offset manual)
  const dateUTC = criarDataUTCporLocal(dados.data, dados.hora, fuso)
  const jd = swe.dateToJulianDay(dateUTC)

  const sunPos  = swe.calculatePosition(jd, 0) // Planet.Sun
  const moonPos = swe.calculatePosition(jd, 1) // Planet.Moon
  // swe_houses recebe lat (N+, S−) e lon (E+, W−) — igual ao padrão geodésico
  const houses  = swe.calculateHouses(jd, lat, lon, 'P') // Placidus

  const motorLabel =
    _motorStatus === 'swisseph-full'    ? 'Swiss Ephemeris completo + Placidus' :
    _motorStatus === 'swisseph-moshier' ? 'Swiss Ephemeris Moshier + Placidus' :
                                          'astronomy-engine + Meeus'

  console.info(
    `[Sidus] JD=${jd.toFixed(6)} · UTC=${dateUTC.toISOString()} · lat=${lat.toFixed(4)} lon=${lon.toFixed(4)}` +
    ` · Sol=${sunPos.longitude.toFixed(3)}° Lua=${moonPos.longitude.toFixed(3)}° Asc=${houses.ascendant.toFixed(3)}°`
  )

  return {
    solar:      longitudeParaSigno(sunPos.longitude),
    lunar:      longitudeParaSigno(moonPos.longitude),
    ascendente: longitudeParaSigno(houses.ascendant),
    mc:         longitudeParaSigno(houses.mc),
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

function Onboarding({ dados, setDados, onSubmit }) {
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
    <div style={{ ...estilos.conteudo, paddingTop: 48, paddingBottom: 40 }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <Sparkles size={40} color={CORES.dourado} strokeWidth={1.5} style={{ marginBottom: 16 }} />
        <h1 style={{ ...estilos.titulo, fontSize: 36, letterSpacing: '0.2em' }}>Sidus</h1>
        <p style={estilos.subtitulo}>Registo natal com calculo astronomico real</p>
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

function Dashboard({ nome, mapaNatal, ceuAgora, aspetos, onOraculo }) {
  return (
    <div style={estilos.conteudo}>
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
            Ceu de Hoje
          </span>
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

      <button type="button" onClick={onOraculo} style={{ ...estilos.vidro, width: '100%', padding: 18, display: 'flex', justifyContent: 'space-between', border: `1px solid ${CORES.dourado}`, background: 'rgba(223,183,108,0.08)' }}>
        <div>
          <div style={{ fontSize: 11, color: CORES.dourado, textTransform: 'uppercase' }}>Oraculo do Dia</div>
          <div style={{ fontSize: 15, color: CORES.branco }}>Consulta o Astrologo IA</div>
        </div>
        <MessageCircle size={22} color={CORES.dourado} />
      </button>
    </div>
  )
}

function MapaAstral({ mapaNatal, dados, planetasNascimento }) {
  if (!mapaNatal) {
    return (
      <div style={estilos.conteudo}>
        <h1 style={{ ...estilos.titulo, textAlign: 'left', fontSize: 22, marginBottom: 20 }}>Mapa Astral</h1>
        <div style={{ ...estilos.vidro, padding: 20, display: 'flex', gap: 8, color: CORES.brancoMuted }}>
          <Info size={15} />
          <span>Preenche o onboarding para calcular o teu mapa.</span>
        </div>
      </div>
    )
  }

  const pilares = [
    { titulo: 'Signo Solar',  ...mapaNatal.solar,      icon: Sun },
    { titulo: 'Signo Lunar',  ...mapaNatal.lunar,      icon: Moon },
    { titulo: 'Ascendente',   ...mapaNatal.ascendente, icon: ArrowUp },
    ...(mapaNatal.mc ? [{ titulo: 'Meio do Céu (MC)', ...mapaNatal.mc, icon: Star }] : []),
  ]

  const motorLabel = mapaNatal.motor || 'astronomy-engine'

  return (
    <div style={estilos.conteudo}>
      <header style={{ marginBottom: 22 }}>
        <h1 style={{ ...estilos.titulo, textAlign: 'left', fontSize: 22 }}>Mapa Astral</h1>
        <p style={{ ...estilos.subtitulo, textAlign: 'left', marginBottom: 2 }}>
          Calculado para {formatarData(dados.data)} às {dados.hora}
        </p>
        <p style={{ fontSize: 10, color: CORES.brancoMuted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 0 }}>
          Motor: {motorLabel}
        </p>
      </header>

      {pilares.map((p) => {
        const Icon = p.icon
        const isMC  = p.titulo.startsWith('Meio')
        const isAsc = p.titulo === 'Ascendente'
        const corBorda = isAsc ? 'rgba(139,92,246,0.4)' : isMC ? 'rgba(52,211,153,0.35)' : CORES.vidroBorda
        const corFundo = isAsc ? 'rgba(139,92,246,0.18)' : isMC ? 'rgba(52,211,153,0.12)' : CORES.roxoClaro
        const corIcone = isAsc ? '#C4B5FD' : isMC ? '#34D399' : CORES.dourado
        return (
          <div key={p.titulo} style={{ ...estilos.vidro, padding: 20, marginBottom: 14, display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: corFundo, border: `1px solid ${corBorda}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>
              {p.simbolo}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <Icon size={13} color={corIcone} />
                <span style={{ fontSize: 10, color: corIcone, textTransform: 'uppercase', letterSpacing: '0.09em', fontWeight: 700 }}>
                  {p.titulo}
                </span>
              </div>
              <div style={{ fontSize: 21, fontWeight: 600, color: CORES.branco, lineHeight: 1.1 }}>{p.nome}</div>
              <div style={{ display: 'flex', gap: 10, marginTop: 5 }}>
                <span style={{ fontSize: 12, color: CORES.brancoMuted }}>
                  {p.graus}° no signo
                </span>
                <span style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 6,
                  background: p.elemento === 'Fogo' ? 'rgba(251,146,60,0.15)' :
                    p.elemento === 'Terra' ? 'rgba(74,222,128,0.12)' :
                    p.elemento === 'Ar' ? 'rgba(147,197,253,0.15)' :
                    'rgba(129,140,248,0.15)',
                  color: p.elemento === 'Fogo' ? '#FB923C' :
                    p.elemento === 'Terra' ? '#4ADE80' :
                    p.elemento === 'Ar' ? '#93C5FD' :
                    '#818CF8',
                  border: `1px solid ${p.elemento === 'Fogo' ? 'rgba(251,146,60,0.3)' :
                    p.elemento === 'Terra' ? 'rgba(74,222,128,0.3)' :
                    p.elemento === 'Ar' ? 'rgba(147,197,253,0.3)' :
                    'rgba(129,140,248,0.3)'}`,
                }}>
                  {p.elemento}
                </span>
              </div>
            </div>
          </div>
        )
      })}

      {/* Painel de verificação */}
      <div style={{ ...estilos.vidro, padding: 16, marginBottom: 14 }}>
        <div style={{ fontSize: 10, color: CORES.dourado, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
          Verificação de precisão
        </div>

        {/* Motor activo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, padding: '8px 10px', borderRadius: 8,
          background: mapaNatal.motor?.includes('completo') ? 'rgba(52,211,153,0.1)' : 'rgba(251,191,36,0.08)',
          border: `1px solid ${mapaNatal.motor?.includes('completo') ? 'rgba(52,211,153,0.3)' : 'rgba(251,191,36,0.2)'}`,
        }}>
          <span style={{ fontSize: 16 }}>{mapaNatal.motor?.includes('completo') ? '✅' : '⚠️'}</span>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: mapaNatal.motor?.includes('completo') ? '#34D399' : '#FBBf24' }}>
              {mapaNatal.motor?.includes('completo') ? 'Máxima precisão (arco-segundo)' : 'Precisão padrão (arco-minuto)'}
            </div>
            <div style={{ fontSize: 10, color: CORES.brancoMuted, marginTop: 1 }}>{mapaNatal.motor}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px', fontSize: 12 }}>
          <span style={{ color: CORES.brancoMuted }}>Data UT:</span>
          <span style={{ color: CORES.branco, fontVariantNumeric: 'tabular-nums' }}>
            {mapaNatal.instanteUTC ? mapaNatal.instanteUTC.replace('T', ' ').slice(0, 16) + ' UTC' : '—'}
          </span>
          <span style={{ color: CORES.brancoMuted }}>Fuso local:</span>
          <span style={{ color: CORES.branco }}>
            {typeof mapaNatal.fuso === 'string'
              ? mapaNatal.fuso + (dados.data && dados.hora ? ' · ' + offsetLabel(mapaNatal.fuso, dados.data, dados.hora) : '')
              : `UTC${(mapaNatal.fuso ?? 0) >= 0 ? '+' : ''}${mapaNatal.fuso ?? 0}`}
          </span>
          <span style={{ color: CORES.brancoMuted }}>Latitude:</span>
          <span style={{ color: CORES.branco, fontVariantNumeric: 'tabular-nums' }}>
            {mapaNatal.lat != null ? `${mapaNatal.lat.toFixed(4)}°` : '—'}
          </span>
          <span style={{ color: CORES.brancoMuted }}>Longitude:</span>
          <span style={{ color: CORES.branco, fontVariantNumeric: 'tabular-nums' }}>
            {mapaNatal.lon != null ? `${mapaNatal.lon.toFixed(4)}°` : '—'}
          </span>
        </div>

        {!mapaNatal.motor?.includes('Swiss') && (
          <div style={{ marginTop: 10, fontSize: 11, color: '#FBBf24', padding: '6px 8px', background: 'rgba(251,191,36,0.07)', borderRadius: 6 }}>
            ⚠️ O motor Swiss Ephemeris não carregou ainda. Os valores são precisos mas podem diferir em &lt;1' de arco face ao Astro.com. Aguarda 2–3s e recarrega o mapa.
          </div>
        )}
      </div>

      <div style={{ ...estilos.vidro, padding: 20 }}>
        <div style={{ fontSize: 12, color: CORES.dourado, marginBottom: 10, textTransform: 'uppercase' }}>Planetas no instante de nascimento</div>
        {planetasNascimento.map((p) => (
          <div key={p.key} style={{ fontSize: 14, color: CORES.brancoSuave, padding: '7px 0', borderBottom: `1px solid ${CORES.vidroBorda}` }}>
            {p.simbolo} {p.texto}
          </div>
        ))}
      </div>
    </div>
  )
}

function Ferramentas({ onFerramenta }) {
  return (
    <div style={estilos.conteudo}>
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

function Paywall({ onVoltar }) {
  return (
    <div style={{ ...estilos.conteudo, paddingTop: 16 }}>
      <button type="button" onClick={onVoltar} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: CORES.dourado, cursor: 'pointer', marginBottom: 20 }}>
        <ChevronLeft size={20} /> Voltar
      </button>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h1 style={{ ...estilos.titulo, fontSize: 24 }}>Sidus VIP</h1>
      </div>
      <div style={{ ...estilos.vidro, padding: 24, marginBottom: 24 }}>
        {BENEFICIOS_VIP.map((b) => (
          <div key={b} style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            <Check size={14} color={CORES.dourado} />
            <span style={{ fontSize: 14, color: CORES.brancoSuave }}>{b}</span>
          </div>
        ))}
      </div>
      <div style={{ ...estilos.vidro, padding: 24, textAlign: 'center', border: `1px solid ${CORES.dourado}`, marginBottom: 20 }}>
        <div style={{ fontSize: 40, color: CORES.branco }}>4,99 € <span style={{ fontSize: 16, color: CORES.brancoMuted }}>/ mes</span></div>
      </div>
      <button type="button" style={estilos.botaoDourado}>Tornar-me VIP Agora</button>
    </div>
  )
}

function Chat({ mapaNatal }) {
  const [mensagens, setMensagens] = useState(() => [
    { id: 1, autor: 'ia', texto: 'Bem-vindo ao Oraculo Sidus. Estou pronto para interpretar o teu mapa.' },
    { id: 2, autor: 'ia', texto: mapaNatal ? `Detetei Sol em ${mapaNatal.solar.nome}, Lua em ${mapaNatal.lunar.nome} e Ascendente em ${mapaNatal.ascendente.nome}.` : 'Completa o onboarding para eu analisar o teu mapa.' },
  ])
  const [texto, setTexto] = useState('')

  const enviar = () => {
    if (!texto.trim()) return
    setMensagens((prev) => [...prev, { id: Date.now(), autor: 'user', texto: texto.trim() }])
    setTexto('')
    setTimeout(() => {
      const resposta = mapaNatal
        ? `Com Sol em ${mapaNatal.solar.nome} e Lua em ${mapaNatal.lunar.nome}, o teu perfil mostra forte dinamica emocional e identidade marcante.`
        : 'Preciso dos teus dados de nascimento completos para responder com precisao.'
      setMensagens((prev) => [...prev, { id: Date.now() + 1, autor: 'ia', texto: resposta }])
    }, 900)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100svh', maxHeight: '100svh', position: 'relative', zIndex: 1 }}>
      <header style={{ padding: '16px 20px', background: 'rgba(11,7,30,0.95)', borderBottom: `1px solid ${CORES.vidroBorda}`, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Sparkles size={20} color={CORES.dourado} />
        <div style={{ fontSize: 15, color: CORES.branco }}>Astrologo IA</div>
      </header>
      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {mensagens.map((m) => (
          <div key={m.id} style={{ alignSelf: m.autor === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%', padding: '10px 14px', borderRadius: m.autor === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: m.autor === 'user' ? 'rgba(223,183,108,0.18)' : 'rgba(255,255,255,0.07)', border: `1px solid ${CORES.vidroBorda}` }}>
            {m.texto}
          </div>
        ))}
      </div>
      <div style={{ padding: '12px 16px 20px', background: 'rgba(11,7,30,0.95)', borderTop: `1px solid ${CORES.vidroBorda}`, display: 'flex', gap: 10 }}>
        <input value={texto} onChange={(e) => setTexto(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && enviar()} placeholder="Escreve a tua pergunta..." style={{ ...estilos.input, flex: 1, borderRadius: 24, padding: '12px 18px' }} />
        <button type="button" onClick={enviar} style={{ width: 44, height: 44, borderRadius: '50%', border: 'none', background: `linear-gradient(135deg, ${CORES.dourado} 0%, ${CORES.douradoEscuro} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Send size={18} color={CORES.fundo} />
        </button>
      </div>
    </div>
  )
}

function Navbar({ passo, setPasso }) {
  const itens = [
    { id: 'dashboard', label: 'Inicio', icon: Home },
    { id: 'mapa', label: 'Mapa', icon: Map },
    { id: 'ferramentas', label: 'Ferramentas', icon: Grid3x3 },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
  ]

  return (
    <nav style={estilos.navbar}>
      {itens.map((item) => {
        const Icon = item.icon
        const ativo = passo === item.id
        return (
          <button key={item.id} type="button" onClick={() => setPasso(item.id)} style={{ background: 'none', border: 'none', color: ativo ? CORES.dourado : CORES.brancoMuted, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
            <Icon size={22} />
            <span style={{ fontSize: 10, textTransform: 'uppercase' }}>{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

export default function App() {
  const [passo, setPasso] = useState('onboarding')
  const [dados, setDados] = useState({ nome: '', data: '', hora: '', cidade: '', localizacao: null, fuso: null })
  const [mapaNatal, setMapaNatal] = useState(null)
  const [planetasNascimento, setPlanetasNascimento] = useState([])
  const [ceuAgora, setCeuAgora] = useState(() => calcularPlanetasParaData(new Date()))
  const [aspetosAgora, setAspetosAgora] = useState(() => calcularAspetos(calcularPlanetasParaData(new Date())))
  const sweRef = useRef(null)
  const [sweReady, setSweReady] = useState(false)

  // Inicializa Swiss Ephemeris assim que o WASM carrega
  useEffect(() => {
    _sweReadyPromise.then((swe) => {
      if (swe) {
        sweRef.current = swe
        setSweReady(true)
        // Recalcula o céu actual com Swiss Ephemeris
        const planetas = calcularPlanetasComSwe(swe, new Date())
        setCeuAgora(planetas)
        setAspetosAgora(calcularAspetos(planetas))
      }
    })
  }, [])

  // Actualiza "Céu de Hoje" a cada minuto
  useEffect(() => {
    const atualizar = () => {
      const now = new Date()
      if (sweRef.current) {
        const planetas = calcularPlanetasComSwe(sweRef.current, now)
        setCeuAgora(planetas)
        setAspetosAgora(calcularAspetos(planetas))
      } else {
        const planetas = calcularPlanetasParaData(now)
        setCeuAgora(planetas)
        setAspetosAgora(calcularAspetos(planetas))
      }
    }
    const id = setInterval(atualizar, 60000)
    return () => clearInterval(id)
  }, [sweReady])

  // Recalcula mapa natal quando dados ou motor mudam
  useEffect(() => {
    const erros = validarOnboarding(dados)
    if (Object.keys(erros).length === 0) {
      if (sweRef.current) {
        setMapaNatal(calcularMapaNatalComSwe(sweRef.current, dados))
      } else {
        setMapaNatal(calcularMapaNatal(dados))
      }
    }
  }, [dados, sweReady])

  // Planetas de nascimento
  useEffect(() => {
    if (!dados.data || !dados.hora || !dados.localizacao) {
      setPlanetasNascimento([])
      return
    }
    const fuso = dados.fuso ?? 0
    const dataUTC = criarDataUTCporLocal(dados.data, dados.hora, fuso)
    if (sweRef.current) {
      setPlanetasNascimento(calcularPlanetasComSwe(sweRef.current, dataUTC))
    } else {
      setPlanetasNascimento(calcularPlanetasParaData(dataUTC))
    }
  }, [dados, sweReady])

  const handleOnboarding = () => {
    const erros = validarOnboarding(dados)
    if (Object.keys(erros).length === 0) {
      if (sweRef.current) {
        setMapaNatal(calcularMapaNatalComSwe(sweRef.current, dados))
      } else {
        setMapaNatal(calcularMapaNatal(dados))
      }
      setPasso('dashboard')
    }
  }

  const handleFerramenta = (f) => {
    if (f.premium) setPasso('paywall')
  }

  const mostrarNavbar = passo !== 'onboarding' && passo !== 'paywall'
  const chatFullScreen = passo === 'chat'

  const renderEcran = () => {
    switch (passo) {
      case 'onboarding':
        return <Onboarding dados={dados} setDados={setDados} onSubmit={handleOnboarding} />
      case 'dashboard':
        return <Dashboard nome={dados.nome} mapaNatal={mapaNatal} ceuAgora={ceuAgora} aspetos={aspetosAgora} onOraculo={() => setPasso('chat')} />
      case 'mapa':
        return <MapaAstral mapaNatal={mapaNatal} dados={dados} planetasNascimento={planetasNascimento} />
      case 'ferramentas':
        return <Ferramentas onFerramenta={handleFerramenta} />
      case 'paywall':
        return <Paywall onVoltar={() => setPasso('ferramentas')} />
      case 'chat':
        return <Chat mapaNatal={mapaNatal} />
      default:
        return <Dashboard nome={dados.nome} mapaNatal={mapaNatal} ceuAgora={ceuAgora} aspetos={aspetosAgora} onOraculo={() => setPasso('chat')} />
    }
  }

  return (
    <div style={estilos.app}>
      <div style={estilos.estrelas} />
      {chatFullScreen ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1, paddingBottom: 72 }}>
          {renderEcran()}
        </div>
      ) : (
        renderEcran()
      )}
      {mostrarNavbar && <Navbar passo={passo} setPasso={setPasso} />}
    </div>
  )
}
