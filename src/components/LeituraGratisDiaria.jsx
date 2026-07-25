import { useState, useEffect, useMemo } from 'react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { localizeArcano } from '../lib/i18n/tarotArcana.js'
import { indiceCartaDoDia, frasePersonalizadaDia } from '../lib/leituraDiaria.js'
import { TAROT_DECK } from '../lib/tarot/deck.js'
import { CartaTarot } from './CartaTarot.jsx'
const CORES = {
  dourado: '#DFB76C',
  branco: '#FFFFFF',
  brancoSuave: 'rgba(255, 255, 255, 0.85)',
  brancoMuted: 'rgba(255, 255, 255, 0.55)',
  vidroBorda: 'rgba(223, 183, 108, 0.22)',
}

function localeForLang(lang) {
  if (lang === 'es') return 'es-ES'
  if (lang === 'it') return 'it-IT'
  if (lang === 'de') return 'de-DE'
  if (lang === 'fr') return 'fr-FR'
  if (lang === 'en') return 'en-GB'
  return 'pt-PT'
}

/**
 * Carta do dia + frase personalizada Sol/Lua.
 * @param {{ solar?: { nome: string }, lunar?: { nome: string }, compact?: boolean }} props
 */
export function LeituraGratisDiaria({ solar, lunar, compact = false }) {
  const { lang, t, ts } = useLanguage()
  const [dataHoje, setDataHoje] = useState(() => new Date().toISOString().slice(0, 10))

  useEffect(() => {
    const verificar = () => {
      const hoje = new Date().toISOString().slice(0, 10)
      if (hoje !== dataHoje) setDataHoje(hoje)
    }
    verificar()
    const id = setInterval(verificar, 60000)
    return () => clearInterval(id)
  }, [dataHoje])

  const carta = useMemo(() => {
    const idx = indiceCartaDoDia(new Date(dataHoje + 'T12:00:00'))
    return localizeArcano(TAROT_DECK[idx], lang)
  }, [dataHoje, lang])

  const [ano, mes, dia] = dataHoje.split('-').map(Number)
  const dataFormatada = new Date(Date.UTC(ano, mes - 1, dia)).toLocaleDateString(localeForLang(lang))

  const fraseSol = solar?.nome ? frasePersonalizadaDia('sol', solar.nome, lang) : null
  const fraseLua = lunar?.nome ? frasePersonalizadaDia('lua', lunar.nome, lang) : null

  if (!carta?.nome) return null

  return (
    <div
      className={compact ? 'leitura-gratis leitura-gratis--compact sidus-glass' : 'leitura-gratis sidus-glass'}
      style={{
        background: 'rgba(255, 255, 255, 0.06)',
        padding: compact ? '14px 16px' : '22px 24px',
        marginBottom: compact ? 12 : 16,
        background: 'rgba(223,183,108,0.05)',
        border: '1px solid rgba(223,183,108,0.35)',
        borderRadius: 16,
      }}
    >
      <div style={{ fontSize: 10, color: CORES.dourado, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: compact ? 8 : 12 }}>
        {t('leituraGratis.title', { date: dataFormatada })}
      </div>

      <div style={{ display: 'flex', alignItems: compact ? 'flex-start' : 'center', gap: compact ? 12 : 16, flexWrap: 'wrap' }}>
        <CartaTarot carta={carta} size={compact ? 72 : 110} />

        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ fontSize: compact ? 15 : 17, fontWeight: 700, color: CORES.branco, marginBottom: 4 }}>{carta.nome}</div>
          {!compact && (
            <div style={{ display: 'flex', gap: 5, marginBottom: 8, flexWrap: 'wrap' }}>
              {carta.palavras.map((p) => (
                <span key={p} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: 'rgba(223,183,108,0.1)', color: CORES.dourado, border: '1px solid rgba(223,183,108,0.2)' }}>{p}</span>
              ))}
            </div>
          )}
          <p style={{ fontSize: compact ? 11 : 12, color: CORES.brancoMuted, lineHeight: 1.6, margin: 0 }}>{carta.luz}</p>
        </div>
      </div>

      {(fraseSol || fraseLua) && (
        <div style={{ marginTop: compact ? 10 : 14, paddingTop: compact ? 10 : 14, borderTop: `1px solid ${CORES.vidroBorda}` }}>
          <div style={{ fontSize: 10, color: CORES.dourado, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            {t('leituraGratis.personal')}
          </div>
          {fraseSol && (
            <p style={{ fontSize: 12, color: CORES.brancoSuave, lineHeight: 1.55, margin: '0 0 6px' }}>
              <span style={{ color: '#FCD34D' }}>☉ {ts(solar.nome)}</span> - {fraseSol}
            </p>
          )}
          {fraseLua && (
            <p style={{ fontSize: 12, color: CORES.brancoSuave, lineHeight: 1.55, margin: 0 }}>
              <span style={{ color: '#C4B5FD' }}>☽ {ts(lunar.nome)}</span> - {fraseLua}
            </p>
          )}
          <p style={{ fontSize: 10, color: CORES.brancoMuted, marginTop: 8, marginBottom: 0, fontStyle: 'italic' }}>
            {t('leituraGratis.returnTomorrow')}
          </p>
        </div>
      )}
    </div>
  )
}
