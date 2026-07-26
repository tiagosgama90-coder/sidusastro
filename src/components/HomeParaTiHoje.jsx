import { Layers, MessageCircle, Map } from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { SidusConstellationMark } from './SidusConstellationMark.jsx'

const CORES = {
  dourado: '#DFB76C',
  branco: '#FFFFFF',
  brancoMuted: 'rgba(255, 255, 255, 0.55)',
  vidroBorda: 'rgba(223, 183, 108, 0.22)',
}

export function HomeParaTiHoje({ onTarot, onOraculo, onMapa, energiaResumo }) {
  const { t } = useLanguage()

  const items = [
    { key: 'tarot', icon: Layers, color: '#F472B6', label: t('home.tarotOnline'), sub: t('home.tarotSub'), onClick: onTarot },
    { key: 'oracle', icon: MessageCircle, color: CORES.dourado, label: t('home.oracleDay'), sub: t('home.consultAI'), onClick: onOraculo },
    { key: 'mapa', icon: Map, color: '#C4B5FD', label: t('home.natalChart'), sub: t('home.paraTiMapa'), onClick: onMapa },
  ]

  return (
    <section className="home-para-ti" aria-label={t('home.paraTiTitle')}>
      <div className="home-para-ti__header">
        <SidusConstellationMark size={14} glow className="home-para-ti__mark notranslate" />
        <h2 className="home-para-ti__title">{t('home.paraTiTitle')}</h2>
      </div>
      {energiaResumo && (
        <p className="home-para-ti__energia">{energiaResumo}</p>
      )}
      <div className="home-para-ti__grid">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <button key={item.key} type="button" className="home-para-ti__card" onClick={item.onClick}>
              <Icon size={20} color={item.color} aria-hidden />
              <div className="home-para-ti__card-text">
                <span className="home-para-ti__card-label">{item.label}</span>
                <span className="home-para-ti__card-sub">{item.sub}</span>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
