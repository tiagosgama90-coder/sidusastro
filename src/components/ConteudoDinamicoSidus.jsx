import { useEffect, useState, useMemo } from 'react'
import { Calendar, Sparkles, Megaphone, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { fetchDailyContent } from '../lib/apiDailyContent.js'
import { buildLocalDailyContent, signoHoroscopeKey } from '../lib/dailyContentFallback.js'
import { NOVIDADES_SIDUS } from '../lib/novidadesSidus.js'
import { SIGNOS_PT, SIGNOS_EN } from '../lib/i18n/astro.js'
import { calcularFaseLua } from '../lib/faseLua.js'

const CORES = {
  fundo: '#0B071E',
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
  const loc = lang === 'en' ? 'en-GB' : 'pt-PT'
  return new Date().toLocaleDateString(loc, { day: 'numeric', month: 'long', year: 'numeric' })
}

export function ConteudoDinamicoSidus({ mapaNatal, aspetos = [] }) {
  const { lang, t, ts } = useLanguage()
  const [pack, setPack] = useState(null)
  const [showAll, setShowAll] = useState(false)
  const [copied, setCopied] = useState(false)

  const fasePt = useMemo(() => calcularFaseLua(new Date(), 'pt'), [])
  const faseEn = useMemo(() => calcularFaseLua(new Date(), 'en'), [])

  const transitSummary = useMemo(() => {
    if (!aspetos?.length) return ''
    return aspetos.slice(0, 4).map((a) => `${a.planetaA} ${a.aspecto} ${a.planetaB}`).join('; ')
  }, [aspetos])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await fetchDailyContent({
          fasePt: fasePt.nome,
          faseEn: faseEn.nome,
          transit: transitSummary,
        })
        if (!cancelled) setPack(data)
      } catch {
        if (!cancelled) {
          setPack(buildLocalDailyContent({ fasePt: fasePt.nome, faseEn: faseEn.nome, lang }))
        }
      }
    })()
    return () => { cancelled = true }
  }, [fasePt.nome, faseEn.nome, transitSummary, lang])

  const signList = lang === 'en' ? SIGNOS_EN : SIGNOS_PT
  const horoMap = pack?.horoscopes?.[lang] || {}
  const userKey = signoHoroscopeKey(mapaNatal?.solar?.nome, lang)
  const userHoro = userKey ? horoMap[userKey] : null
  const social = pack?.social?.[lang]
  const socialFull = social ? `${social.text}\n\n${social.hashtags || ''}`.trim() : ''

  const handleCopy = async () => {
    if (!socialFull) return
    try {
      await navigator.clipboard.writeText(socialFull)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* ignore */ }
  }

  return (
    <div style={{ marginBottom: 20 }}>
      {/* Badge actualizado hoje */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        marginBottom: 14, fontSize: 12, color: CORES.dourado,
      }}>
        <Calendar size={14} />
        <span>{t('home.updatedToday')} · {formatarHoje(lang)}</span>
      </div>

      {/* Horóscopo diário */}
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
            {userHoro && mapaNatal && (
              <div style={{
                background: 'rgba(223,183,108,0.1)', borderRadius: 12, padding: 14, marginBottom: 12,
                border: '1px solid rgba(223,183,108,0.25)',
              }}>
                <div style={{ fontSize: 11, color: CORES.dourado, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                  {t('home.yourSign')} · {ts(mapaNatal.solar.nome)} {mapaNatal.solar.simbolo}
                </div>
                <p style={{ fontSize: 13, color: CORES.brancoSuave, lineHeight: 1.55, margin: 0 }}>{userHoro}</p>
              </div>
            )}

            {pack.transitNote?.[lang] && (
              <p style={{ fontSize: 12, color: CORES.brancoMuted, margin: '0 0 12px', lineHeight: 1.5 }}>
                {pack.transitNote[lang]}
              </p>
            )}

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
                {signList.map((sign) => (
                  <div key={sign} style={{ padding: '8px 0', borderBottom: `1px solid ${CORES.vidroBorda}` }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: CORES.branco, marginBottom: 2 }}>{sign}</div>
                    <div style={{ fontSize: 12, color: CORES.brancoMuted, lineHeight: 1.45 }}>
                      {horoMap[sign] || '—'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Novidades Sidus */}
      <div style={{ ...vidro, padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: CORES.brancoSuave, marginBottom: 12 }}>
          {t('home.newsTitle')}
        </div>
        {NOVIDADES_SIDUS.slice(0, 4).map((item) => (
          <div key={item.date} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: `1px solid ${CORES.vidroBorda}` }}>
            <span style={{ fontSize: 11, color: CORES.dourado, minWidth: 72, flexShrink: 0 }}>{item.date.slice(5).replace('-', '/')}</span>
            <span style={{ fontSize: 12, color: CORES.brancoMuted, lineHeight: 1.45 }}>{lang === 'en' ? item.en : item.pt}</span>
          </div>
        ))}
      </div>

      {/* Sugestão redes sociais */}
      <div style={{ ...vidro, padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <Megaphone size={18} color="#F472B6" />
          <span style={{ fontSize: 13, fontWeight: 600, color: CORES.brancoSuave }}>{t('home.socialTitle')}</span>
        </div>
        <p style={{ fontSize: 11, color: CORES.brancoMuted, margin: '0 0 12px', lineHeight: 1.45 }}>
          {t('home.socialHint')}
        </p>
        {social && (
          <>
            <p style={{ fontSize: 13, color: CORES.brancoSuave, lineHeight: 1.55, margin: '0 0 12px', whiteSpace: 'pre-wrap' }}>
              {social.text}
              {social.hashtags && (
                <>
                  {'\n\n'}
                  <span style={{ color: '#F472B6' }}>{social.hashtags}</span>
                </>
              )}
            </p>
            <button
              type="button"
              onClick={handleCopy}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(244,114,182,0.15)', border: '1px solid rgba(244,114,182,0.35)',
                borderRadius: 10, padding: '10px 16px', color: CORES.branco, cursor: 'pointer', fontSize: 13,
              }}
            >
              {copied ? <Check size={16} color="#4ADE80" /> : <Copy size={16} color="#F472B6" />}
              {copied ? t('home.copied') : t('home.copyPost')}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
