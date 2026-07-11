import { useMemo, useState } from 'react'
import { SIGNOS } from '../lib/astrologia.js'
import { SIGNOS_PT, SIGNOS_EN, SIGNOS_ES, SIGNOS_IT, SIGNOS_DE, SIGNOS_FR } from '../lib/i18n/astro.js'
import { calcularHoroscopoDiarioRealista } from '../lib/horoscopoDiario.js'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'

const CORES = {
  dourado: '#DFB76C',
  branco: '#FFFFFF',
  brancoMuted: 'rgba(255,255,255,0.55)',
  brancoSuave: 'rgba(255,255,255,0.85)',
  vidroBorda: 'rgba(223, 183, 108, 0.22)',
  roxo: '#8B5CF6',
}

const SIGN_LISTS = {
  pt: SIGNOS_PT, en: SIGNOS_EN, es: SIGNOS_ES, it: SIGNOS_IT, de: SIGNOS_DE, fr: SIGNOS_FR,
}

/**
 * Grelha mágica de 12 signos em colunas com símbolos zodiacais.
 */
export function HoroscopoColunasSignos({ isPremium, onUpgrade, userSignoNome }) {
  const { lang, t } = useLanguage()
  const [hover, setHover] = useState(null)
  const [expandido, setExpandido] = useState(null)

  const hoje = useMemo(() => new Date().toISOString().slice(0, 10), [])
  const signList = SIGN_LISTS[lang] || SIGNOS_EN

  const horoscopos = useMemo(() => {
    return signList.map((nome, i) => {
      const simbolo = SIGNOS[i]?.simbolo || '✦'
      const dados = calcularHoroscopoDiarioRealista(nome, hoje, null, lang)
      return { nome, simbolo, resumo: dados?.interpretacao?.resumo || '—', dados }
    })
  }, [signList, hoje, lang])

  const visiveis = isPremium ? horoscopos : horoscopos.filter((h) => {
    if (!userSignoNome) return false
    const idxUser = SIGNOS_PT.indexOf(userSignoNome)
    const idxList = signList.indexOf(h.nome)
    return idxUser >= 0 && idxUser === idxList
  })

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: 10,
      }}>
        {(isPremium ? horoscopos : visiveis).map((h) => {
          const ativo = hover === h.nome || expandido === h.nome
          return (
            <button
              key={h.nome}
              type="button"
              onClick={() => setExpandido(expandido === h.nome ? null : h.nome)}
              onMouseEnter={() => setHover(h.nome)}
              onMouseLeave={() => setHover(null)}
              style={{
                background: ativo
                  ? 'linear-gradient(145deg, rgba(139,92,246,0.18), rgba(223,183,108,0.12))'
                  : 'rgba(255,255,255,0.03)',
                border: `1px solid ${ativo ? 'rgba(223,183,108,0.45)' : CORES.vidroBorda}`,
                borderRadius: 14,
                padding: '14px 12px',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                transform: ativo ? 'translateY(-3px) scale(1.02)' : 'none',
                boxShadow: ativo ? '0 8px 24px rgba(139,92,246,0.2)' : 'none',
              }}
            >
              <div style={{
                fontSize: 28,
                lineHeight: 1,
                marginBottom: 8,
                filter: ativo ? 'drop-shadow(0 0 8px rgba(223,183,108,0.6))' : 'none',
                transition: 'filter 0.3s',
              }}>
                {h.simbolo}
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: CORES.branco, marginBottom: 6 }}>
                {h.nome}
              </div>
              <div style={{
                fontSize: 10,
                color: CORES.brancoMuted,
                lineHeight: 1.45,
                display: '-webkit-box',
                WebkitLineClamp: expandido === h.nome ? 12 : 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>
                {h.resumo}
              </div>
            </button>
          )
        })}
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
