import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { getPrivacySections, getPrivacyMeta } from '../lib/i18n/privacy.js'

const CORES = {
  fundo:'#0B071E', dourado:'#DFB76C',
  branco:'#FFFFFF', brancoSuave:'rgba(255,255,255,0.85)',
  brancoMuted:'rgba(255,255,255,0.55)', vidroBorda:'rgba(223,183,108,0.22)',
}

export function PoliticaPrivacidade({ onVoltar }) {
  const { lang, t } = useLanguage()
  const meta = getPrivacyMeta(lang)
  const sections = getPrivacySections(lang)

  return (
    <div style={{ padding:'20px 20px 110px', maxWidth:680, margin:'0 auto' }}>
      <button type="button" onClick={onVoltar} style={{background:'none',border:'none',color:CORES.dourado,cursor:'pointer',fontSize:13,marginBottom:20,padding:0}}>
        {t('common.back')}
      </button>

      <h1 style={{fontSize:22,fontWeight:700,color:CORES.dourado,marginBottom:4}}>{meta.title}</h1>
      <p style={{fontSize:12,color:CORES.brancoMuted,marginBottom:28}}>{meta.updated}</p>

      {sections.map(s => (
        <div key={s.titulo} style={{marginBottom:24}}>
          <h3 style={{fontSize:15,fontWeight:700,color:CORES.dourado,marginBottom:8,borderBottom:`1px solid rgba(223,183,108,0.15)`,paddingBottom:6}}>
            {s.titulo}
          </h3>
          <p style={{fontSize:13,color:CORES.brancoSuave,lineHeight:1.8,margin:0,whiteSpace:'pre-wrap'}}>
            {s.texto}
          </p>
        </div>
      ))}
    </div>
  )
}
