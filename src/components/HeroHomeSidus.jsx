import { Star, ChevronRight, Zap } from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'

const CORES = {
  dourado: '#DFB76C',
  branco: '#FFFFFF',
  brancoMuted: 'rgba(255,255,255,0.55)',
}

export function HeroHomeSidus({ mapaNatal, onMapa, isPremium }) {
  const { t, ts } = useLanguage()
  const temMapa = Boolean(mapaNatal?.solar?.nome)

  return (
    <div style={{
      background: 'linear-gradient(145deg, rgba(223,183,108,0.12) 0%, rgba(139,92,246,0.08) 50%, rgba(11,7,30,0) 100%)',
      border: '1px solid rgba(223,183,108,0.28)', borderRadius: 18, padding: '18px 20px', marginBottom: 20,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <Zap size={14} color="#34D399" />
        <span style={{ fontSize: 10, fontWeight: 700, color: '#34D399', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {t('home.liveUpdate')}
        </span>
      </div>

      <h2 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 800, color: CORES.branco, lineHeight: 1.3 }}>
        {t('home.heroTitle')}
      </h2>
      <p style={{ margin: '0 0 14px', fontSize: 13, color: CORES.brancoMuted, lineHeight: 1.6 }}>
        {temMapa
          ? t('home.heroHasMap', { solar: ts(mapaNatal.solar.nome), lunar: ts(mapaNatal.lunar?.nome || '—') })
          : t('home.heroNoMap')}
      </p>

      {onMapa && (
        <button type="button" onClick={onMapa} style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: isPremium ? 'rgba(223,183,108,0.2)' : 'rgba(223,183,108,0.12)',
          border: '1px solid rgba(223,183,108,0.45)', borderRadius: 12,
          padding: '10px 16px', color: CORES.dourado, cursor: 'pointer', fontSize: 13, fontWeight: 700,
        }}>
          <Star size={16} />
          {temMapa ? t('home.openFullChart') : t('home.createChart')}
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  )
}
