import { Crosshair, Link2, Moon, ShieldCheck, Sparkles } from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { LandingMysticHighlight } from './LandingMysticHighlight.jsx'

const PILLARS = [
  { icon: Crosshair, titleKey: 'auth.portal.whySidus.p1Title', descKey: 'auth.portal.whySidus.p1Desc' },
  { icon: Link2, titleKey: 'auth.portal.whySidus.p2Title', descKey: 'auth.portal.whySidus.p2Desc' },
  { icon: ShieldCheck, titleKey: 'auth.portal.whySidus.p3Title', descKey: 'auth.portal.whySidus.p3Desc' },
  { icon: Sparkles, titleKey: 'auth.portal.whySidus.p4Title', descKey: 'auth.portal.whySidus.p4Desc' },
  { icon: Moon, titleKey: 'auth.portal.whySidus.sonhosTitle', descKey: 'auth.portal.whySidus.sonhosDesc' },
]

/** Destaque profissional — faixa horizontal compacta. */
export function LandingWhySidus() {
  const { t } = useLanguage()

  return (
    <section
      className="landing-why-sidus landing-glass landing-why-sidus--horizontal"
      aria-label={t('auth.portal.whySidus.ariaLabel')}
    >
      <p className="landing-why-sidus__eyebrow">{t('auth.portal.whySidus.eyebrow')}</p>
      <h2 className="landing-why-sidus__title">
        <LandingMysticHighlight
          text={t('auth.portal.whySidus.title')}
          highlight={t('auth.portal.whySidus.titleHighlight')}
        />
      </h2>

      <ul className="landing-why-sidus__grid landing-why-sidus__grid--horizontal">
        {PILLARS.map(({ icon: Icon, titleKey, descKey }) => (
          <li key={titleKey} className="landing-why-sidus__card">
            <div className="landing-why-sidus__icon" aria-hidden="true">
              <Icon size={18} strokeWidth={2} />
            </div>
            <h3 className="landing-why-sidus__card-title">{t(titleKey)}</h3>
            <p className="landing-why-sidus__card-desc">{t(descKey)}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
