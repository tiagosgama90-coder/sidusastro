import { useMemo } from 'react'
import { SIGNOS } from '../lib/astrologia.js'
import { SIGNOS_PT, SIGNOS_EN, SIGNOS_ES, SIGNOS_IT, SIGNOS_DE, SIGNOS_FR } from '../lib/i18n/astro.js'
import { gerarHoroscoposTodosSignos } from '../lib/horoscopoDiarioTransitos.js'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'

const CORES = {
  dourado: '#DFB76C',
  branco: '#FFFFFF',
  brancoMuted: 'rgba(255,255,255,0.55)',
  brancoSuave: 'rgba(255,255,255,0.85)',
  vidroBorda: 'rgba(223, 183, 108, 0.22)',
}

const SIGN_LISTS = {
  pt: SIGNOS_PT, en: SIGNOS_EN, es: SIGNOS_ES, it: SIGNOS_IT, de: SIGNOS_DE, fr: SIGNOS_FR,
}

/**
 * Colunas com horóscopo completo por signo — trânsitos reais do céu de hoje.
 */
export function HoroscopoColunasSignos({
  isPremium,
  onUpgrade,
  userSignoNome,
  ceuAgora = [],
  aspetos = [],
  faseLua,
  packHoroscopes = {},
}) {
  const { lang, t } = useLanguage()

  const hoje = useMemo(() => new Date().toISOString().slice(0, 10), [])
  const signList = SIGN_LISTS[lang] || SIGNOS_EN

  const horoscopos = useMemo(() => {
    const gerados = gerarHoroscoposTodosSignos({
      signList,
      ceuAgora,
      aspetos,
      faseLua,
      lang,
      packHoroscopes,
    })
    return gerados.map((h, i) => ({
      ...h,
      simbolo: SIGNOS[i]?.simbolo || '✦',
      resumo: h.texto,
    }))
  }, [signList, ceuAgora, aspetos, faseLua, lang, packHoroscopes, hoje])

  const visiveis = isPremium ? horoscopos : horoscopos.filter((h) => {
    if (!userSignoNome) return false
    const idxUser = SIGNOS_PT.indexOf(userSignoNome === 'Áries' ? 'Carneiro' : userSignoNome)
    return idxUser >= 0 && idxUser === h.signoIndex
  })

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 12,
      }}>
        {(isPremium ? horoscopos : visiveis).map((h) => (
          <article
            key={h.nome}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${CORES.vidroBorda}`,
              borderRadius: 14,
              padding: '16px 14px',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{
                fontSize: 32,
                lineHeight: 1,
                filter: 'drop-shadow(0 0 6px rgba(223,183,108,0.4))',
              }}>
                {h.simbolo}
              </span>
              <div style={{ fontSize: 14, fontWeight: 700, color: CORES.branco }}>{h.nome}</div>
            </div>
            <p style={{
              fontSize: 12,
              color: CORES.brancoSuave,
              lineHeight: 1.65,
              margin: 0,
            }}>
              {h.resumo}
            </p>
          </article>
        ))}
      </div>

      {!isPremium && (
        <button
          type="button"
          onClick={onUpgrade}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            width: '100%', marginTop: 14, padding: '12px 16px',
            background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(223,183,108,0.1))',
            border: '1px solid rgba(223,183,108,0.35)', borderRadius: 12,
            color: CORES.dourado, cursor: 'pointer', fontSize: 12, fontWeight: 600,
          }}
        >
          ✧ {t('home.horoscopePremiumAll')} ✧
        </button>
      )}
    </div>
  )
}
