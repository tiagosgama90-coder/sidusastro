import { useMemo, useState } from 'react'
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
  roxo: '#8B5CF6',
}

const SIGN_LISTS = {
  pt: SIGNOS_PT, en: SIGNOS_EN, es: SIGNOS_ES, it: SIGNOS_IT, de: SIGNOS_DE, fr: SIGNOS_FR,
}

function idxUserSigno(userSignoNome) {
  if (!userSignoNome) return -1
  const n = userSignoNome === 'Áries' ? 'Carneiro' : userSignoNome
  return SIGNOS_PT.indexOf(n)
}

/**
 * Grelha compacta - só o signo do utilizador mostra texto ao carregar; restantes ao clicar.
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
  const userIdx = idxUserSigno(userSignoNome)
  const signList = SIGN_LISTS[lang] || SIGNOS_EN
  const userSignName = userIdx >= 0 ? signList[userIdx] : null

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
      isUser: i === userIdx,
    }))
  }, [signList, ceuAgora, aspetos, faseLua, lang, packHoroscopes, userIdx])

  const [panelSign, setPanelSign] = useState(userSignName)

  const lista = isPremium ? horoscopos : horoscopos.filter((h) => h.isUser)
  const activo = panelSign ? horoscopos.find((h) => h.nome === panelSign) : null
  const showPanel = Boolean(activo)

  return (
    <div className="home-signos-wrap" style={{ marginTop: 16 }}>
      <div className="home-signos-grid">
        {lista.map((h) => {
          const sel = panelSign === h.nome
          const destaque = h.isUser
          return (
            <button
              key={h.nome}
              type="button"
              onClick={() => setPanelSign(h.nome)}
              className={[
                'home-signo-btn',
                destaque ? 'home-signo-btn--user' : '',
                sel ? 'home-signo-btn--selected' : '',
              ].filter(Boolean).join(' ')}
            >
              <div className="home-signo-btn__symbol">{h.simbolo}</div>
              <div className="home-signo-btn__name">{h.nome}</div>
            </button>
          )
        })}
      </div>

      {showPanel && (
        <div style={{
          marginTop: 12,
          padding: '14px 16px',
          background: 'rgba(139,92,246,0.08)',
          border: `1px solid ${activo.isUser ? 'rgba(223,183,108,0.4)' : 'rgba(139,92,246,0.3)'}`,
          borderRadius: 12,
          borderLeft: `3px solid ${activo.isUser ? CORES.dourado : CORES.roxo}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 22 }}>{activo.simbolo}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: CORES.branco }}>{activo.nome}</span>
            {activo.isUser && (
              <span style={{
                fontSize: 9, color: CORES.dourado, textTransform: 'uppercase',
                letterSpacing: '0.08em', padding: '2px 6px',
                background: 'rgba(223,183,108,0.12)', borderRadius: 8,
              }}>
                {t('home.yourSign')}
              </span>
            )}
          </div>
          <p style={{ fontSize: 12, color: CORES.brancoSuave, lineHeight: 1.65, margin: 0 }}>
            {activo.resumo}
          </p>
        </div>
      )}

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
