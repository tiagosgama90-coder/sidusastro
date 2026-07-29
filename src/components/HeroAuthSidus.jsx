import { useEffect, useState } from 'react'
import { Star, Moon, Layers, MessageCircle, Radio } from 'lucide-react'
import { PythagoreanStarIcon } from './icons/PythagoreanStarIcon.jsx'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'

const CORES = {
  dourado: '#DFB76C',
  branco: '#FFFFFF',
  brancoMuted: 'rgba(255,255,255,0.55)',
}

const DESTAQUES = [
  { icon: Star, cor: '#DFB76C', key: 'mapa' },
  { icon: Moon, cor: '#A78BFA', key: 'ceu' },
  { icon: MessageCircle, cor: '#34D399', key: 'oraculo' },
  { icon: Layers, cor: '#F472B6', key: 'tarot' },
  { icon: PythagoreanStarIcon, cor: '#60A5FA', key: 'numerologia' },
]

export function HeroAuthSidus() {
  const { lang, t } = useLanguage()
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % DESTAQUES.length), 4200)
    return () => clearInterval(id)
  }, [])

  const hoje = new Date().toLocaleDateString(lang !== 'pt' ? 'en-GB' : 'pt-PT', {
    weekday: 'long', day: 'numeric', month: 'long',
  })

  const Destaque = DESTAQUES[idx]
  const Icon = Destaque.icon

  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.35)',
        borderRadius: 999, padding: '6px 14px', marginBottom: 16,
      }}>
        <Radio size={13} color="#34D399" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: '#34D399', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {t('auth.liveNow')}
        </span>
        <span style={{ fontSize: 11, color: CORES.brancoMuted }}>· {hoje}</span>
      </div>

      <h1 style={{
        margin: '0 0 10px', fontSize: 28, fontWeight: 800, color: CORES.branco,
        lineHeight: 1.2, letterSpacing: '-0.02em',
      }}>
        {t('auth.heroTitle')}
      </h1>
      <p style={{ margin: '0 0 18px', fontSize: 14, color: CORES.brancoMuted, lineHeight: 1.65, maxWidth: 420 }}>
        {t('auth.heroSubtitle')}
      </p>

      <div style={{
        background: 'linear-gradient(135deg, rgba(223,183,108,0.14), rgba(139,92,246,0.1))',
        border: '1px solid rgba(223,183,108,0.3)', borderRadius: 16, padding: '16px 18px',
        marginBottom: 14, minHeight: 88, transition: 'opacity 0.4s',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
            background: `${Destaque.cor}22`, border: `1px solid ${Destaque.cor}55`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon size={22} color={Destaque.cor} />
          </div>
          <div>
            <div style={{ fontSize: 10, color: Destaque.cor, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: 4 }}>
              {t(`auth.feature.${Destaque.key}.badge`)}
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: CORES.branco, marginBottom: 4 }}>
              {t(`auth.feature.${Destaque.key}.title`)}
            </div>
            <div style={{ fontSize: 12, color: CORES.brancoMuted, lineHeight: 1.55 }}>
              {t(`auth.feature.${Destaque.key}.desc`)}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {DESTAQUES.map((d, i) => (
          <span key={d.key} style={{
            fontSize: 10, padding: '4px 10px', borderRadius: 999,
            background: i === idx ? 'rgba(223,183,108,0.15)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${i === idx ? 'rgba(223,183,108,0.4)' : 'rgba(255,255,255,0.08)'}`,
            color: i === idx ? CORES.dourado : CORES.brancoMuted,
            fontWeight: 600, letterSpacing: '0.04em',
          }}>
            {t(`auth.feature.${d.key}.pill`)}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.92); }
        }
      `}</style>
    </div>
  )
}
