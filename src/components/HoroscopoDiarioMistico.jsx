import { useState, useEffect, useMemo } from 'react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'

const CORES = {
  dourado: '#DFB76C',
  douradoEscuro: '#B8943F',
  branco: '#FFFFFF',
  brancoMuted: 'rgba(255,255,255,0.55)',
  brancoSuave: 'rgba(255,255,255,0.85)',
  vidroBorda: 'rgba(223, 183, 108, 0.22)',
  fundo: '#0B071E',
  roxo: '#8B5CF6',
  roxoClaro: 'rgba(139, 92, 246, 0.15)',
}

export function HoroscopoDiarioMistico({ signo, dados, compact = false }) {
  const { lang, t } = useLanguage()
  const [ativo, setAtivo] = useState(false)
  const [brilho, setBrilho] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setAtivo(true), 100)
    const brilhoTimer = setInterval(() => {
      setBrilho(prev => (prev + 1) % 360)
    }, 50)
    return () => {
      clearTimeout(timer)
      clearInterval(brilhoTimer)
    }
  }, [])

  if (!dados) return null

  const { interpretacao, aspectos } = dados
  const { resumo, detalhes } = interpretacao

  const aspectoCor = (tipo) => {
    switch (tipo) {
      case 'trino':
      case 'sextil':
        return 'rgba(52, 211, 153, 0.6)'
      case 'quadratura':
      case 'oposicao':
      case 'quincuncio':
        return 'rgba(248, 113, 113, 0.6)'
      default:
        return 'rgba(223, 183, 108, 0.4)'
    }
  }

  const aspectoIcone = (tipo) => {
    switch (tipo) {
      case 'trino':
        return '△'
      case 'sextil':
        return '✧'
      case 'quadratura':
        return '□'
      case 'oposicao':
        return '○'
      case 'conjuncao':
        return '☉'
      default:
        return '◇'
    }
  }

  return (
    <div
      className="horoscopo-diario-mistico"
      style={{
        position: 'relative',
        background: `linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(11, 7, 30, 0.95) 50%, rgba(223, 183, 108, 0.08) 100%)`,
        border: `1px solid ${CORES.vidroBorda}`,
        borderRadius: 20,
        padding: compact ? '16px 18px' : '24px 28px',
        overflow: 'hidden',
        transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: ativo ? 1 : 0,
        transform: ativo ? 'translateY(0)' : 'translateY(20px)',
      }}
    >
      {/* Efeito de brilho dinâmico */}
      <div
        style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: `radial-gradient(circle at ${50 + Math.sin(brilho * Math.PI / 180) * 30}% ${50 + Math.cos(brilho * Math.PI / 180) * 30}%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)`,
          pointerEvents: 'none',
          animation: 'brilhoMistico 8s ease-in-out infinite',
        }}
      />

      {/* Círculos decorativos */}
      <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', border: '1px solid rgba(223, 183, 108, 0.1)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -20, left: -20, width: 80, height: 80, borderRadius: '50%', border: '1px solid rgba(139, 92, 246, 0.15)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Cabeçalho */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: compact ? 12 : 16 }}>
          <div
            style={{
              width: compact ? 36 : 44,
              height: compact ? 36 : 44,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${CORES.roxoClaro} 0%, rgba(223, 183, 108, 0.1) 100%)`,
              border: `1px solid ${CORES.vidroBorda}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: compact ? 18 : 22,
              color: CORES.dourado,
              fontWeight: 700,
              boxShadow: '0 0 20px rgba(139, 92, 246, 0.2)',
            }}
          >
            {signo?.charAt(0) || ''}
          </div>
          <div>
            <h3 style={{
              margin: 0,
              fontSize: compact ? 15 : 18,
              fontWeight: 700,
              color: CORES.branco,
              letterSpacing: '0.02em',
            }}>
              {signo}
            </h3>
            <p style={{
              margin: '2px 0 0',
              fontSize: 10,
              color: CORES.dourado,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}>
              {t('home.dailyHoroscope')}
            </p>
          </div>
        </div>

        {/* Resumo principal */}
        <div style={{
          fontSize: compact ? 13 : 15,
          color: CORES.brancoSuave,
          lineHeight: 1.7,
          marginBottom: compact ? 10 : 14,
          padding: compact ? '10px 14px' : '14px 18px',
          background: 'rgba(139, 92, 246, 0.06)',
          borderLeft: `2px solid ${CORES.roxo}`,
          borderRadius: '0 8px 8px 0',
        }}>
          {resumo}
        </div>

        {/* Aspectos do dia */}
        {!compact && detalhes && detalhes.length > 0 && (
          <div style={{ marginTop: 14 }}>
            <div style={{
              fontSize: 10,
              color: CORES.dourado,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <div style={{ flex: 1, height: 1, background: CORES.vidroBorda }} />
              {t('home.activeAspects')}
              <div style={{ flex: 1, height: 1, background: CORES.vidroBorda }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {detalhes.map((detalhe, i) => {
                const aspecto = aspectos[i]
                return (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      padding: '10px 12px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      borderRadius: 10,
                      border: `1px solid ${aspectoCor(aspecto?.tipo)}`,
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <span style={{
                      fontSize: 16,
                      color: CORES.dourado,
                      lineHeight: 1,
                      marginTop: 2,
                    }}>
                      {aspecto ? aspectoIcone(aspecto.tipo) : '◇'}
                    </span>
                    <p style={{
                      margin: 0,
                      fontSize: 12,
                      color: CORES.brancoMuted,
                      lineHeight: 1.6,
                      flex: 1,
                    }}>
                      {detalhe}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}