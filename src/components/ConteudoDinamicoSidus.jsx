import { useEffect, useState, useMemo, useCallback } from 'react'
import { Calendar, Sparkles, MessageCircle, Copy, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { fetchDailyContent } from '../lib/apiDailyContent.js'
import { buildLocalDailyContent } from '../lib/dailyContentFallback.js'
import { calcularFaseLua } from '../lib/faseLua.js'
import { gerarNoticiasAstrologia } from '../lib/astroNews.js'
import { emailTemPremiumPrivilegiado } from '../lib/premiumAccess.js'
import { dateLocale } from '../lib/i18n/langUtil.js'
import { gerarHoroscopoSignoTransito } from '../lib/horoscopoDiarioTransitos.js'
import { signoHoroscopeKey } from '../lib/dailyContentFallback.js'
import { HoroscopoDiarioMistico } from './HoroscopoDiarioMistico.jsx'
import { HoroscopoColunasSignos } from './HoroscopoColunasSignos.jsx'
import { WidgetNotificacoesDiarias } from './WidgetNotificacoesDiarias.jsx'
import { normalizeSignoNome, SIGNOS_PT } from '../lib/i18n/astro.js'

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

export function ConteudoDinamicoSidus({ mapaNatal, ceuAgora = [], aspetos = [], isPremium, onUpgrade, onOraculo, userEmail, user }) {
  const { lang, t, ts, tp, ta } = useLanguage()
  const [pack, setPack] = useState(null)
  const [copied, setCopied] = useState(false)
  const [noticiasAstro, setNoticiasAstro] = useState([])
  const [newsSlide, setNewsSlide] = useState(0)

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

  const packHoroscopes = useMemo(() => pack?.horoscopes?.[lang] || {}, [pack, lang])

  const horoscopoRealista = useMemo(() => {
    if (!mapaNatal?.solar?.nome) return null
    const signoPt = normalizeSignoNome(mapaNatal.solar.nome)
    const signoKey = signoHoroscopeKey(signoPt, lang) || mapaNatal.solar.nome
    const signoIndex = SIGNOS_PT.indexOf(signoPt === 'Áries' ? 'Carneiro' : signoPt)
    if (signoIndex < 0) return null
    const apiText = packHoroscopes[signoKey]
    const signoDisplay = ts(mapaNatal.solar.nome)
    const texto = gerarHoroscopoSignoTransito({
      signoIndex,
      signoNome: signoDisplay,
      ceuAgora,
      aspetos,
      faseLua: faseAtual,
      lang,
      apiText,
    })
    return {
      signo: signoDisplay,
      interpretacao: { resumo: texto, detalhes: [] },
      aspectos: aspetos.slice(0, 4),
    }
  }, [mapaNatal, lang, ceuAgora, aspetos, faseAtual, packHoroscopes, ts])

  const social = isAdmin ? pack?.social?.[lang] : null

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const items = await gerarNoticiasAstrologia({ aspetos, lang, max: 6 })
      if (!cancelled) setNoticiasAstro(items)
    })()
    return () => { cancelled = true }
  }, [aspetos, lang])

  useEffect(() => {
    if (noticiasAstro.length <= 1) return undefined
    const id = setInterval(() => {
      setNewsSlide((s) => (s + 1) % noticiasAstro.length)
    }, 8000)
    return () => clearInterval(id)
  }, [noticiasAstro.length])

  const newsPrev = useCallback(() => {
    setNewsSlide((s) => (s - 1 + noticiasAstro.length) % noticiasAstro.length)
  }, [noticiasAstro.length])

  const newsNext = useCallback(() => {
    setNewsSlide((s) => (s + 1) % noticiasAstro.length)
  }, [noticiasAstro.length])

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
            {mapaNatal?.solar?.nome && horoscopoRealista ? (
              <div style={{ marginBottom: 16 }}>
                <HoroscopoDiarioMistico
                  signo={`${ts(mapaNatal.solar.nome)} ${mapaNatal.solar.simbolo || ''}`.trim()}
                  dados={horoscopoRealista}
                />
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

            <HoroscopoColunasSignos
              isPremium={isPremium}
              onUpgrade={onUpgrade}
              userSignoNome={normalizeSignoNome(mapaNatal?.solar?.nome)}
              ceuAgora={ceuAgora}
              aspetos={aspetos}
              faseLua={faseAtual}
              packHoroscopes={packHoroscopes}
            />

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

      {/* Widget de notificações diárias — Premium interactivo */}
      {(userEmail || user?.uid) && (
        <div style={{ marginBottom: 16 }}>
          <WidgetNotificacoesDiarias
            user={user || (userEmail ? { email: userEmail } : null)}
            isPremium={isPremium}
            onUpgrade={onUpgrade}
          />
        </div>
      )}

      {/* Carrossel de notícias astrológicas — coluna em baixo com setas */}
      <div style={{
        ...vidro,
        padding: 0,
        marginBottom: 16,
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: `1px solid ${CORES.vidroBorda}`,
        }}>
          <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: CORES.brancoSuave }}>
            {t('home.astroNewsTitle')}
          </span>
          <span style={{ fontSize: 10, color: '#34D399', fontWeight: 700, textTransform: 'uppercase' }}>{t('home.liveBadge')}</span>
        </div>

        {noticiasAstro.length === 0 ? (
          <p style={{ padding: '20px 16px', fontSize: 12, color: CORES.brancoMuted, margin: 0 }}>{t('home.loadingContent')}</p>
        ) : (
          <div style={{ padding: '16px' }}>
            {noticiasAstro.map((n, i) => (
              <article
                key={`${n.url || n.texto}-${i}`}
                style={{
                  display: newsSlide === i ? 'flex' : 'none',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <div style={{
                  width: '100%',
                  height: 180,
                  borderRadius: 12,
                  overflow: 'hidden',
                  border: `1px solid ${CORES.vidroBorda}`,
                  background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(223,183,108,0.1))',
                  position: 'relative',
                }}>
                  {n.imagem ? (
                    <img
                      src={n.imagem}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                    />
                  ) : (
                    <div style={{
                      width: '100%', height: '100%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 48, color: CORES.dourado,
                    }}>✦</div>
                  )}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, color: CORES.dourado,
                      textTransform: 'uppercase', letterSpacing: '0.08em',
                      padding: '2px 8px', background: 'rgba(223,183,108,0.1)', borderRadius: 12,
                    }}>{n.tag}</span>
                    {n.hora && <span style={{ fontSize: 10, color: CORES.brancoMuted }}>{n.hora}</span>}
                  </div>
                  {n.url ? (
                    <a href={n.url} target="_blank" rel="noopener noreferrer" style={{
                      fontSize: 15, color: CORES.branco, lineHeight: 1.55, textDecoration: 'none',
                      display: 'block', fontWeight: 700,
                    }}>{n.texto}</a>
                  ) : (
                    <p style={{ fontSize: 15, color: CORES.branco, lineHeight: 1.55, margin: 0, fontWeight: 700 }}>{n.texto}</p>
                  )}
                  {n.resumo && (
                    <p style={{ fontSize: 12, color: CORES.brancoMuted, lineHeight: 1.6, margin: '8px 0 0' }}>{n.resumo}</p>
                  )}
                </div>
              </article>
            ))}

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
              marginTop: 14,
              paddingTop: 12,
              borderTop: `1px solid ${CORES.vidroBorda}`,
            }}>
              <button
                type="button"
                onClick={newsPrev}
                aria-label="Notícia anterior"
                style={{
                  width: 36, height: 36, borderRadius: '50%',
                  border: `1px solid ${CORES.vidroBorda}`,
                  background: 'rgba(255,255,255,0.05)',
                  color: CORES.dourado, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <ChevronLeft size={20} />
              </button>
              <span style={{ fontSize: 11, color: CORES.brancoMuted, minWidth: 48, textAlign: 'center' }}>
                {newsSlide + 1} / {noticiasAstro.length}
              </span>
              <button
                type="button"
                onClick={newsNext}
                aria-label="Próxima notícia"
                style={{
                  width: 36, height: 36, borderRadius: '50%',
                  border: `1px solid ${CORES.vidroBorda}`,
                  background: 'rgba(255,255,255,0.05)',
                  color: CORES.dourado, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
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
