import { useState, useEffect, useRef, useMemo } from 'react'
import {
  Sparkles, MapPin, Clock, User, Check, Loader2, ChevronDown,
  Star, MessageCircle, Layers, BookOpen, Hash,
} from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { validarOnboarding } from '../lib/i18n/validation.js'
import { pesquisarCidades, pesquisarFusoHorario } from '../lib/geocoding.js'
import { readLandingDraft, saveLandingDraft } from '../lib/landingDraft.js'

const CORES = {
  dourado: '#DFB76C',
  douradoEscuro: '#B8943F',
  branco: '#FFFFFF',
  brancoMuted: 'rgba(255,255,255,0.55)',
  brancoSuave: 'rgba(255,255,255,0.85)',
  vidroBorda: 'rgba(223, 183, 108, 0.22)',
  fundo: '#0B071E',
}

const FUSOS_FALLBACK = [
  { label: 'UTC+0 (Portugal / UK)', value: 0 },
  { label: 'UTC+1 (Espanha / França)', value: 1 },
  { label: 'UTC−3 (Brasil)', value: -3 },
  { label: 'UTC+2 (Grécia / Egipto)', value: 2 },
]

const FERRAMENTAS_LANDING = [
  { key: 'mapa', Icon: Star },
  { key: 'oraculo', Icon: MessageCircle },
  { key: 'tarot', Icon: Layers },
  { key: 'numerologia', Icon: Hash },
  { key: 'sonhos', Icon: BookOpen },
]

const FERRAMENTAS_MOBILE_TICKER = FERRAMENTAS_LANDING.filter((f) => f.key !== 'sonhos')

const labelStyle = {
  display: 'block',
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: CORES.dourado,
  marginBottom: 8,
}

const inputStyle = {
  width: '100%',
  padding: '13px 14px',
  background: 'rgba(255, 255, 255, 0.04)',
  border: `1px solid ${CORES.vidroBorda}`,
  borderRadius: 12,
  color: CORES.branco,
  fontSize: 15,
  outline: 'none',
  boxSizing: 'border-box',
}

function CampoDataPortal({ valor, onChange, onBlur, erro, t }) {
  const diaRef = useRef(null)
  const mesRef = useRef(null)
  const anoRef = useRef(null)
  const [dia, setDia] = useState(() => (valor ? valor.split('-')[2] || '' : ''))
  const [mes, setMes] = useState(() => (valor ? valor.split('-')[1] || '' : ''))
  const [ano, setAno] = useState(() => (valor ? valor.split('-')[0] || '' : ''))

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
    } else {
      onChange('')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dia, mes, ano])

  const borda = erro ? 'rgba(248,113,113,0.7)' : CORES.vidroBorda
  const mini = { ...inputStyle, borderColor: borda, textAlign: 'center', padding: '13px 6px' }

  return (
    <div className="landing-portal-field">
      <label style={labelStyle}>{t('onboarding.birthDate')}</label>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 12px 1fr 12px 1.4fr', alignItems: 'center' }}>
        <input ref={diaRef} inputMode="numeric" maxLength={2} placeholder="DD" value={dia}
          onChange={(e) => { const d = e.target.value.replace(/\D/g, '').slice(0, 2); setDia(d); if (d.length === 2) mesRef.current?.focus() }}
          onBlur={onBlur} style={mini} className="landing-portal-input" />
        <span style={{ textAlign: 'center', color: CORES.brancoMuted, fontSize: 18 }}>/</span>
        <input ref={mesRef} inputMode="numeric" maxLength={2} placeholder="MM" value={mes}
          onChange={(e) => { const m = e.target.value.replace(/\D/g, '').slice(0, 2); setMes(m); if (m.length === 2) anoRef.current?.focus() }}
          onBlur={onBlur} style={mini} className="landing-portal-input" />
        <span style={{ textAlign: 'center', color: CORES.brancoMuted, fontSize: 18 }}>/</span>
        <input ref={anoRef} inputMode="numeric" maxLength={4} placeholder="AAAA" value={ano}
          onChange={(e) => setAno(e.target.value.replace(/\D/g, '').slice(0, 4))}
          onBlur={onBlur} style={mini} className="landing-portal-input" />
      </div>
      {erro && <p style={{ margin: '6px 0 0', fontSize: 12, color: '#F87171' }}>{erro}</p>}
    </div>
  )
}

function CampoCidadePortal({ valor, localizacao, onChange, onSelect, erro, onBlur, t }) {
  const [sugestoes, setSugestoes] = useState([])
  const [aPesquisar, setAPesquisar] = useState(false)
  const [aberto, setAberto] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    const ok = localizacao && (localizacao.nome === valor || localizacao.nome?.startsWith(valor))
    if (!valor || valor.length < 2 || ok) { setSugestoes([]); return undefined }
    const timer = setTimeout(async () => {
      setAPesquisar(true)
      try {
        const r = await pesquisarCidades(valor)
        setSugestoes(r)
        setAberto(r.length > 0)
      } catch { setSugestoes([]) }
      finally { setAPesquisar(false) }
    }, 400)
    return () => clearTimeout(timer)
  }, [valor, localizacao])

  useEffect(() => {
    const fechar = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setAberto(false)
    }
    document.addEventListener('pointerdown', fechar)
    return () => document.removeEventListener('pointerdown', fechar)
  }, [])

  return (
    <div ref={containerRef} className="landing-portal-field" style={{ position: 'relative' }}>
      <label style={labelStyle}>{t('onboarding.birthCity')}</label>
      <div style={{ position: 'relative' }}>
        <input
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          onFocus={() => sugestoes.length > 0 && setAberto(true)}
          placeholder={t('onboarding.citySearchPlaceholder')}
          className="landing-portal-input"
          style={{
            ...inputStyle,
            paddingRight: 40,
            borderColor: erro ? 'rgba(248,113,113,0.7)' : localizacao ? 'rgba(74,222,128,0.5)' : CORES.vidroBorda,
          }}
        />
        <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>
          {aPesquisar ? <Loader2 size={18} color={CORES.dourado} style={{ animation: 'spin 1s linear infinite' }} />
            : localizacao ? <Check size={18} color="#4ADE80" /> : <MapPin size={18} color={CORES.brancoMuted} />}
        </div>
      </div>
      {erro && <p style={{ margin: '6px 0 0', fontSize: 12, color: '#F87171' }}>{erro}</p>}
      {aberto && sugestoes.length > 0 && (
        <ul style={{
          position: 'absolute', left: 0, right: 0, top: '100%', listStyle: 'none', margin: '4px 0 0', padding: 4,
          background: 'rgba(11,7,30,0.98)', border: `1px solid ${CORES.vidroBorda}`, borderRadius: 12,
          maxHeight: 180, overflowY: 'auto', zIndex: 40, boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
        }}>
          {sugestoes.map((s) => (
            <li key={s.placeId}>
              <button type="button"
                onPointerDown={(e) => { e.preventDefault(); onSelect(s); setAberto(false) }}
                style={{
                  width: '100%', background: 'none', border: 'none', color: CORES.brancoSuave,
                  fontSize: 13, textAlign: 'left', padding: '10px 12px', cursor: 'pointer',
                }}
              >
                {s.nome}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function LandingBirthPortal({ isDesktop, onSaved, onScrollToLogin }) {
  const { lang, t } = useLanguage()
  const [nome, setNome] = useState('')
  const [data, setData] = useState('')
  const [hora, setHora] = useState('')
  const [cidade, setCidade] = useState('')
  const [localizacao, setLocalizacao] = useState(null)
  const [fuso, setFuso] = useState(null)
  const [fusoCarregando, setFusoCarregando] = useState(false)
  const [fusoErro, setFusoErro] = useState(null)
  const [fusoManual, setFusoManual] = useState(0)
  const [tocado, setTocado] = useState({})
  const [aGuardar, setAGuardar] = useState(false)
  const [guardado, setGuardado] = useState(false)

  const dados = { nome, data, hora, cidade, localizacao, fuso }
  const erros = validarOnboarding(dados, lang)
  const tocar = (campo) => () => setTocado((p) => ({ ...p, [campo]: true }))
  const tocarTodos = () => setTocado({ nome: true, data: true, hora: true, cidade: true })

  const ferramentasTicker = useMemo(() => {
    const lista = isDesktop ? FERRAMENTAS_LANDING : FERRAMENTAS_MOBILE_TICKER
    return lista.map(({ key, Icon }) => ({
      key,
      Icon,
      label: t(`auth.feature.${key}.pill`),
    }))
  }, [isDesktop, lang, t])

  useEffect(() => {
    const draft = readLandingDraft()
    if (!draft) return
    if (draft.nome) setNome(draft.nome)
    if (draft.data) setData(draft.data)
    if (draft.hora) setHora(draft.hora)
    if (draft.cidade) setCidade(draft.cidade)
    if (draft.localizacao) setLocalizacao(draft.localizacao)
    if (draft.fuso != null) setFuso(draft.fuso)
    if (typeof draft.fuso === 'number') setFusoManual(draft.fuso)
  }, [])

  const handleSelectCidade = async (loc) => {
    const cidadeCurta = loc.nome?.split(',')[0]?.trim() || loc.nome
    setCidade(cidadeCurta)
    setLocalizacao({ ...loc, nome: loc.nome })
    setFuso(null)
    setFusoCarregando(true)
    setFusoErro(null)
    try {
      const tz = await pesquisarFusoHorario(loc.lat, loc.lon)
      setFuso(tz)
    } catch {
      setFusoErro(t('onboarding.tzFail'))
      setFuso(fusoManual)
    } finally {
      setFusoCarregando(false)
    }
  }

  const handleGuardar = async () => {
    tocarTodos()
    setGuardado(false)

    let fusoFinal = fuso
    if (localizacao && fusoFinal == null && !fusoCarregando) {
      setFusoCarregando(true)
      try {
        fusoFinal = await pesquisarFusoHorario(localizacao.lat, localizacao.lon)
        setFuso(fusoFinal)
      } catch {
        setFusoErro(t('onboarding.tzFail'))
        fusoFinal = fusoManual
        setFuso(fusoFinal)
      } finally {
        setFusoCarregando(false)
      }
    }

    const payload = { nome: nome.trim(), data, hora, cidade: cidade.trim(), localizacao, fuso: fusoFinal }
    const errosFinais = validarOnboarding(payload, lang)
    if (Object.keys(errosFinais).length > 0) return

    setAGuardar(true)
    try {
      saveLandingDraft(payload)
      setGuardado(true)
      onSaved?.()
    } finally {
      setAGuardar(false)
    }
  }

  return (
    <section className="landing-portal-root" aria-label={t('auth.portal.ariaLabel')}>
      <div className="landing-portal-orb landing-portal-orb--1" aria-hidden />
      <div className="landing-portal-orb landing-portal-orb--2" aria-hidden />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {!guardado && (
          <p className="landing-portal-form-lead">{t('auth.portal.formLead')}</p>
        )}

        <div className={`landing-portal-card${guardado ? ' landing-portal-card--saved' : ''}`}>
          <div className="landing-portal-card-shimmer" aria-hidden />

          {guardado ? (
            <div style={{ textAlign: 'center', padding: '12px 8px 4px' }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%', margin: '0 auto 16px',
                background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.45)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Sparkles size={26} color="#34D399" />
              </div>
              <p style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 700, color: CORES.dourado }}>
                {t('auth.portal.savedTitle')}
              </p>
              <p style={{ margin: '0 0 16px', fontSize: 13, color: CORES.brancoMuted, lineHeight: 1.6 }}>
                {t('auth.portal.savedHint')}
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', color: CORES.dourado, opacity: 0.7 }}>
                <ChevronDown size={22} className="landing-portal-bounce" />
              </div>
            </div>
          ) : (
            <>
              <div className="landing-portal-field">
                <label style={labelStyle}>{t('onboarding.name')}</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} color={CORES.brancoMuted} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    onBlur={tocar('nome')}
                    placeholder={t('onboarding.namePlaceholder')}
                    className="landing-portal-input"
                    style={{
                      ...inputStyle,
                      paddingLeft: 42,
                      borderColor: tocado.nome && erros.nome ? 'rgba(248,113,113,0.7)' : CORES.vidroBorda,
                    }}
                  />
                </div>
                {tocado.nome && erros.nome && <p style={{ margin: '6px 0 0', fontSize: 12, color: '#F87171' }}>{erros.nome}</p>}
              </div>

              <CampoDataPortal valor={data} onChange={setData} onBlur={tocar('data')} erro={tocado.data ? erros.data : null} t={t} />

              <div className="landing-portal-field">
                <label style={labelStyle}>{t('onboarding.birthTime')}</label>
                <div style={{ position: 'relative' }}>
                  <Clock size={16} color={CORES.brancoMuted} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="time"
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                    onBlur={tocar('hora')}
                    className="landing-portal-input"
                    style={{
                      ...inputStyle,
                      paddingLeft: 42,
                      borderColor: tocado.hora && erros.hora ? 'rgba(248,113,113,0.7)' : CORES.vidroBorda,
                    }}
                  />
                </div>
                {tocado.hora && erros.hora && <p style={{ margin: '6px 0 0', fontSize: 12, color: '#F87171' }}>{erros.hora}</p>}
              </div>

              <CampoCidadePortal
                valor={cidade}
                localizacao={localizacao}
                onChange={(v) => { setCidade(v); setLocalizacao(null); setFuso(null) }}
                onSelect={handleSelectCidade}
                onBlur={tocar('cidade')}
                erro={tocado.cidade ? (erros.cidade || (fusoErro && !fuso ? erros.cidade : null)) : null}
                t={t}
              />

              {localizacao && (
                <div
                  className="landing-portal-field landing-portal-tz-box"
                  style={{
                    border: `1px solid ${fusoErro ? 'rgba(251,191,36,0.4)' : fuso != null ? 'rgba(52,211,153,0.35)' : CORES.vidroBorda}`,
                  }}
                >
                  {fusoCarregando && (
                    <p style={{ margin: 0, fontSize: 12, color: CORES.brancoMuted }}>{t('onboarding.detectingTz')}</p>
                  )}
                  {!fusoCarregando && fuso != null && !fusoErro && (
                    <p style={{ margin: 0, fontSize: 13, color: '#34D399', fontWeight: 600 }}>
                      ✓ {t('onboarding.tzDetected')}: {typeof fuso === 'string' ? fuso : t('onboarding.manualOffset', { offset: `${fuso >= 0 ? '+' : ''}${fuso}` })}
                    </p>
                  )}
                  {fusoErro && (
                    <>
                      <p style={{ margin: '0 0 8px', fontSize: 12, color: '#FBBF24' }}>⚠ {fusoErro}</p>
                      <select
                        value={fusoManual}
                        onChange={(e) => { const n = parseFloat(e.target.value); setFusoManual(n); setFuso(n) }}
                        style={{ ...inputStyle, fontSize: 13 }}
                      >
                        {FUSOS_FALLBACK.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                      </select>
                    </>
                  )}
                </div>
              )}

              <button
                type="button"
                disabled={aGuardar || fusoCarregando}
                onClick={handleGuardar}
                className="landing-portal-cta"
              >
                {aGuardar || fusoCarregando ? (
                  <>
                    <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                    {t('auth.portal.ctaLoading')}
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    {t('auth.portal.cta')}
                  </>
                )}
              </button>
              <p className="landing-portal-swiss-note">{t('auth.portal.swissNote')}</p>
            </>
          )}
        </div>

        <footer className="landing-portal-tools-footer" aria-label={t('auth.portal.toolsAria')}>
          <div className="landing-portal-tools-ticker-viewport">
            <div className="landing-portal-tools-ticker-track">
              {[...ferramentasTicker, ...ferramentasTicker].map(({ key, Icon, label }, i) => (
                <span key={`${key}-${i}`} className="landing-portal-tool-badge landing-portal-tool-badge--ticker">
                  <Icon size={13} strokeWidth={1.8} className="landing-portal-tool-icon" aria-hidden />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </section>
  )
}
