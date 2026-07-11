import { useEffect, useState, useMemo } from 'react'
import { Calendar, Sparkles, ChevronDown, ChevronUp, Lock, MessageCircle, Copy, Check } from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { fetchDailyContent } from '../lib/apiDailyContent.js'
import { buildLocalDailyContent, signoHoroscopeKey } from '../lib/dailyContentFallback.js'
import { SIGNOS_PT, SIGNOS_EN, SIGNOS_ES, SIGNOS_IT, SIGNOS_DE, SIGNOS_FR } from '../lib/i18n/astro.js'
import { calcularFaseLua } from '../lib/faseLua.js'
import { gerarNoticiasAstrologia } from '../lib/astroNews.js'
import { emailTemPremiumPrivilegiado } from '../lib/premiumAccess.js'
import { dateLocale } from '../lib/i18n/langUtil.js'
import { calcularHoroscopoDiarioRealista, gerarHoroscopoDiarioTodosSignos } from '../lib/horoscopoDiario.js'

const CORES = {
  dourado: '#DFB76C',
  branco: '#FFFFFF',
  brancoSuave: 'rgba(255,255,255,0.85)',
  brancoMuted: 'rgba(255,255,255,0.55)',
  vidroBorda: 'rgba(223,183,108,0.22)',
}

const vidro = {
  background: 'rgba(255,255,255,0.04)',
  backdropFilter: 'blur(12px)',
  borderRadius: 16,
  border: `1px solid ${CORES.vidroBorda}`,
}

function formatarHoje(lang) {
  return new Date().toLocaleDateString(dateLocale(lang), { day: 'numeric', month: 'long', year: 'numeric' })
}

export function ConteudoDinamicoSidus({ mapaNatal, aspetos = [], isPremium, onUpgrade, onOraculo, userEmail }) {
  const { lang, t, ts, tp, ta } = useLanguage()
  const [pack, setPack] = useState(null)
  const [showAll, setShowAll] = useState(false)
  const [copied, setCopied] = useState(false)

  const isAdmin = emailTemPremiumPrivilegiado({ email: userEmail })
  const faseAtual = useMemo(() => calcularFaseLua(new Date(), lang), [lang])
  const transitSummary = useMemo(() => {
    if (!aspetos?.length) return ''
    return aspetos.slice(0, 4).map((a) => `${tp(a.planetaA)} ${ta(a.aspecto)} ${tp(a.planetaB)}`).join('; ')
  }, [aspetos, tp, ta])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await fetchDailyContent({
          fasePt: faseAtual.nome,
          faseEn: faseAtual.nome,
          transit: transitSummary,
        })
        if (!cancelled) setPack(data)
      } catch {
        if (!cancelled) {
          setPack(buildLocalDailyContent({ fasePt: faseAtual.nome, faseEn: faseAtual.nome, lang }))
        }
      }
    })()
    return () => { cancelled = true }
  }, [faseAtual.nome, transitSummary, lang])

  const signList = {
    pt: SIGNOS_PT,
    en: SIGNOS_EN,
    es: SIGNOS_ES,
    it: SIGNOS_IT,
    de: SIGNOS_DE,
    fr: SIGNOS_FR,
  }[lang] || SIGNOS_EN
  
  // Horóscopo realista baseado em trânsitos planetários
  const horoscopoRealista = useMemo(() => {
    if (!mapaNatal?.solar?.nome) return null
    const hoje = new Date().toISOString().slice(0, 10)
    return calcularHoroscopoDiarioRealista(mapaNatal.solar.nome, hoje, mapaNatal)
  }, [mapaNatal])
  
  const horoMap = pack?.horoscopes?.[lang] || {}
  const userKey = signoHoroscopeKey(mapaNatal?.solar?.nome, lang)
  const userHoro = horoscopoRealista?.interpretacao?.resumo || (userKey ? horoMap[userKey] : null)
  const social = isAdmin ? pack?.social?.[lang] : null
  const noticiasAstro = useMemo(
    () => gerarNoticiasAstrologia({ aspetos, lang, max: 4 }),
    [aspetos, lang],
  )

  const handleCopy = async () => {
    if (!social) return
    const text = `${social.text}\n\n${social.hashtags || ''}`.trim()
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* ignore */ }
  }

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        marginBottom: 14, fontSize: 12, color: CORES.dourado,
      }}>
        <Calendar size={14} />
        <span>{t('home.updatedToday')} · {formatarHoje(lang)}</span>
      </div>

      <div style={{ ...vidro, padding: 20, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <Sparkles size={18} color={CORES.dourado} />
          <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: CORES.brancoSuave }}>
            {t('home.dailyHoroscope')}
          </span>
        </div>

        {!pack ? (
          <p style={{ fontSize: 13, color: CORES.brancoMuted, margin: 0 }}>{t('home.loadingContent')}</p>
        ) : (
          <>
            {mapaNatal?.solar?.nome && userHoro ? (
              <div style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(223, 183, 108, 0.08) 100%)',
                borderRadius: 16, padding: 18, marginBottom: 12,
                border: '1px solid rgba(223, 183, 108, 0.25)',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* Efeito de brilho místico */}
                <div style={{
                  position: 'absolute', top: -30, right: -30, width: 100, height: 100,
                  borderRadius: '50%', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }} />
                
                <div style={{ fontSize: 11, color: CORES.dourado, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, position: 'relative' }}>
                  {t('home.yourSign')} · {ts(mapaNatal.solar.nome)} {mapaNatal.solar.simbolo}
                </div>
                
                {/* Resumo principal */}
                <div style={{
                  fontSize: 14, color: CORES.brancoSuave, lineHeight: 1.7, marginBottom: 12,
                  padding: '12px 16px', background: 'rgba(139, 92, 246, 0.06)',
                  borderLeft: `2px solid #8B5CF6`, borderRadius: '0 8px 8px 0',
                  position: 'relative',
                }}>
                  {userHoro}
                </div>

                {/* Aspectos do dia */}
                {horoscopoRealista?.interpretacao?.detalhes && horoscopoRealista.interpretacao.detalhes.length > 0 && (
                  <div style={{ marginTop: 12, position: 'relative' }}>
                    <div style={{
                      fontSize: 10, color: CORES.dourado, textTransform: 'uppercase',
                      letterSpacing: '0.08em', marginBottom: 8,
                      display: 'flex', alignItems: 'center', gap: 8,
                    }}>
                      <div style={{ flex: 1, height: 1, background: CORES.vidroBorda }} />
                      {t('home.activeAspects')}
                      <div style={{ flex: 1, height: 1, background: CORES.vidroBorda }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {horoscopoRealista.interpretacao.detalhes.slice(0, 3).map((detalhe, i) => {
                        const aspecto = horoscopoRealista.aspectos[i]
                        const corAspecto = aspecto?.tipo === 'trino' || aspecto?.tipo === 'sextil'
                          ? 'rgba(52, 211, 153, 0.5)'
                          : aspecto?.tipo === 'quadratura' || aspecto?.tipo === 'oposicao'
                          ? 'rgba(248, 113, 113, 0.5)'
                          : CORES.vidroBorda
                        
                        return (
                          <div key={i} style={{
                            display: 'flex', alignItems: 'flex-start', gap: 8,
                            padding: '8px 10px', background: 'rgba(255, 255, 255, 0.02)',
                            borderRadius: 8, border: `1px solid ${corAspecto}`,
                            fontSize: 11, color: CORES.brancoMuted, lineHeight: 1.5,
                          }}>
                            <span style={{ color: CORES.dourado, fontSize: 14, lineHeight: 1, marginTop: 1 }}>
                              {aspecto?.tipo === 'trino' ? '△' : aspecto?.tipo === 'sextil' ? '✧' : aspecto?.tipo === 'quadratura' ? '□' : '◇'}
                            </span>
                            <span style={{ flex: 1 }}>{detalhe}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p style={{ fontSize: 12, color: CORES.brancoMuted, margin: '0 0 12px', lineHeight: 1.5 }}>
                {t('home.horoscopeNoMap')}
              </p>
            )}

            {!isPremium && (
              <p style={{ fontSize: 11, color: CORES.brancoMuted, margin: '0 0 12px', lineHeight: 1.45 }}>
                {t('home.horoscopeFreeHint')}
              </p>
            )}

            {isPremium ? (
              <>
                <button
                  type="button"
                  onClick={() => setShowAll((v) => !v)}
                  style={{
                    background: 'none', border: 'none', color: CORES.dourado, cursor: 'pointer',
                    fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, padding: 0,
                  }}
                >
                  {showAll ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  {showAll ? t('home.hideAllSigns') : t('home.showAllSigns')}
                </button>
                {showAll && (
                  <div style={{ marginTop: 12 }}>
                    {signList.map((sign) => {
                      const signoData = gerarHoroscopoDiarioTodosSignos(new Date().toISOString().slice(0, 10), lang)?.horoscopes?.[lang]?.[sign]
                      const signoHoro = signoData?.interpretacao?.resumo || horoMap[sign] || '-'
                      
                      return (
                        <div key={sign} style={{ padding: '10px 0', borderBottom: `1px solid ${CORES.vidroBorda}` }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: CORES.branco, marginBottom: 4 }}>{sign}</div>
                          <div style={{ fontSize: 12, color: CORES.brancoMuted, lineHeight: 1.5 }}>{signoHoro}</div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </>
            ) : (
              <button
                type="button"
                onClick={onUpgrade}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'rgba(223,183,108,0.1)', border: '1px solid rgba(223,183,108,0.3)',
                  borderRadius: 10, padding: '10px 14px', color: CORES.dourado, cursor: 'pointer', fontSize: 12,
                }}
              >
                <Lock size={14} />
                {t('home.horoscopePremiumAll')}
              </button>
            )}

            {onOraculo && (
              <button
                type="button"
                onClick={onOraculo}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, width: '100%', marginTop: 14,
                  background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.35)',
                  borderRadius: 12, padding: '12px 14px', color: CORES.branco, cursor: 'pointer', textAlign: 'left',
                }}
              >
                <MessageCircle size={18} color="#34D399" />
                <span style={{ fontSize: 13, fontWeight: 600 }}>{t('home.askOracleToday')}</span>
              </button>
            )}
          </>
        )}
      </div>

      <div style={{ ...vidro, padding: 20, marginBottom: isAdmin ? 16 : 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: CORES.brancoSuave }}>
            {t('home.astroNewsTitle')}
          </span>
          <span style={{ fontSize: 10, color: '#34D399', fontWeight: 700, textTransform: 'uppercase' }}>{t('home.liveBadge')}</span>
        </div>
        {noticiasAstro.map((n, i) => (
          <div key={i} style={{ padding: '10px 0', borderBottom: i < noticiasAstro.length - 1 ? `1px solid ${CORES.vidroBorda}` : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: CORES.dourado, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{n.tag}</span>
              {n.hora && <span style={{ fontSize: 10, color: CORES.brancoMuted }}>{n.hora}</span>}
            </div>
            <p style={{ fontSize: 12, color: CORES.brancoSuave, lineHeight: 1.55, margin: 0 }}>{n.texto}</p>
          </div>
        ))}
      </div>

      {isAdmin && social && (
        <div style={{ ...vidro, padding: 16, border: '1px dashed rgba(244,114,182,0.35)' }}>
          <div style={{ fontSize: 11, color: '#F472B6', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {t('home.adminSocialOnly')}
          </div>
          <p style={{ fontSize: 12, color: CORES.brancoMuted, margin: '0 0 10px', whiteSpace: 'pre-wrap' }}>
            {social.text}
            {social.hashtags && `\n\n${social.hashtags}`}
          </p>
          <button type="button" onClick={handleCopy} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11,
            background: 'transparent', border: '1px solid rgba(244,114,182,0.4)', borderRadius: 8,
            padding: '6px 10px', color: CORES.branco, cursor: 'pointer',
          }}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? t('home.copied') : t('home.copyPost')}
          </button>
        </div>
      )}
    </div>
  )
}
