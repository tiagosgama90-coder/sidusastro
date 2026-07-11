import { useEffect, useState, useMemo } from 'react'
import { Calendar, Sparkles, MessageCircle } from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { fetchDailyContent } from '../lib/apiDailyContent.js'
import { buildLocalDailyContent } from '../lib/dailyContentFallback.js'
import { calcularFaseLua } from '../lib/faseLua.js'
import { dateLocale } from '../lib/i18n/langUtil.js'
import { HoroscopoColunasSignos } from './HoroscopoColunasSignos.jsx'
import { WidgetNotificacoesDiarias } from './WidgetNotificacoesDiarias.jsx'
import { normalizeSignoNome } from '../lib/i18n/astro.js'

const CORES = {
  dourado: '#DFB76C',
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
  const { lang, t, tp, ta } = useLanguage()
  const [pack, setPack] = useState(null)

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
            {!mapaNatal?.solar?.nome && (
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
                  borderRadius: 12, padding: '12px 14px', color: '#fff', cursor: 'pointer', textAlign: 'left',
                }}
              >
                <MessageCircle size={18} color="#34D399" />
                <span style={{ fontSize: 13, fontWeight: 600 }}>{t('home.askOracleToday')}</span>
              </button>
            )}
          </>
        )}
      </div>

      {(userEmail || user?.uid) && (
        <div style={{ marginBottom: 0 }}>
          <WidgetNotificacoesDiarias
            user={user || (userEmail ? { email: userEmail } : null)}
            isPremium={isPremium}
            onUpgrade={onUpgrade}
          />
        </div>
      )}
    </div>
  )
}
