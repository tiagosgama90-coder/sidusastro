import { useMemo } from 'react'
import { Sparkles, Orbit } from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { calcularFaseLua } from '../lib/faseLua.js'
import { gerarHoroscopoSignoTransito } from '../lib/horoscopoDiarioTransitos.js'
import { SIGNOS_PT } from '../lib/i18n/astro.js'
import { normalizeSignoNome } from '../lib/i18n/astro.js'
import { ShareWhatsAppButton } from './ShareWhatsAppButton.jsx'

const CORES = {
  dourado: '#DFB76C',
  brancoSuave: 'rgba(255,255,255,0.85)',
  brancoMuted: 'rgba(255,255,255,0.55)',
  vidroBorda: 'rgba(223,183,108,0.22)',
}

function signoIndexFromNome(nome) {
  const n = normalizeSignoNome(nome)
  const idx = SIGNOS_PT.indexOf(n === 'Áries' ? 'Carneiro' : n)
  return idx >= 0 ? idx : 0
}

export function EnergiaDoDia({ mapaNatal, ceuAgora = [], aspetos = [] }) {
  const { lang, t, ts } = useLanguage()
  const faseLua = useMemo(() => calcularFaseLua(new Date(), lang), [lang])

  const energia = useMemo(() => {
    if (!mapaNatal?.solar?.nome || !ceuAgora?.length) return null
    const signoNome = ts(mapaNatal.solar.nome)
    const signoIndex = signoIndexFromNome(mapaNatal.solar.nome)
    return gerarHoroscopoSignoTransito({
      signoIndex,
      signoNome,
      ceuAgora,
      aspetos,
      faseLua,
      lang,
    })
  }, [mapaNatal, ceuAgora, aspetos, faseLua, lang, ts])

  if (!energia) return null

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://sidusastro.com'
  const textoPartilha = t('share.energyText', { energia: energia.slice(0, 320), url: siteUrl })

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(223,183,108,0.08) 100%)',
      border: `1px solid ${CORES.vidroBorda}`,
      borderRadius: 16,
      padding: '18px 20px',
      marginBottom: 18,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <Sparkles size={18} color={CORES.dourado} />
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: CORES.dourado }}>
          {t('home.energyTitle')}
        </span>
      </div>
      <p style={{ margin: '0 0 10px', fontSize: 11, color: CORES.brancoMuted, lineHeight: 1.5 }}>{t('home.energySubtitle')}</p>
      <p style={{ margin: 0, fontSize: 14, color: CORES.brancoSuave, lineHeight: 1.65 }}>{energia}</p>
      <ShareWhatsAppButton texto={textoPartilha} compact />
    </div>
  )
}

export function TransitoSemanal({ ceuAgora = [], aspetos = [] }) {
  const { t, tp, ta, ts } = useLanguage()

  const resumo = useMemo(() => {
    const sol = ceuAgora.find((p) => p.key === 'sol' || p.nome === 'Sol')
    const signoSol = sol?.signo?.nome ? ts(sol.signo.nome) : null
    if (!aspetos?.length) {
      return signoSol
        ? t('home.weeklyTransitSolOnly', { sign: signoSol })
        : t('home.weeklyTransitCalm')
    }
    const top = aspetos.slice(0, 3).map((a) => `${tp(a.planetaA)} ${ta(a.aspecto)} ${tp(a.planetaB)}`)
    if (signoSol) {
      return t('home.weeklyTransitWithSign', { sign: signoSol, aspects: top.join(' · ') })
    }
    return t('home.weeklyTransitAspects', { aspects: top.join(' · ') })
  }, [aspetos, ceuAgora, t, tp, ta, ts])

  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: `1px solid ${CORES.vidroBorda}`,
      borderRadius: 16,
      padding: '16px 18px',
      marginBottom: 18,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <Orbit size={18} color="#C4B5FD" />
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#C4B5FD' }}>
          {t('home.weeklyTransitTitle')}
        </span>
      </div>
      <p style={{ margin: 0, fontSize: 13, color: CORES.brancoMuted, lineHeight: 1.6 }}>{resumo}</p>
    </div>
  )
}
