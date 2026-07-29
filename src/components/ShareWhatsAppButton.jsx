import { MessageCircle } from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { abrirWhatsApp } from '../lib/shareUtil.js'

export function ShareWhatsAppButton({ texto, labelKey = 'share.whatsapp', compact = false }) {
  const { t } = useLanguage()
  if (!texto) return null

  return (
    <button
      type="button"
      className={`share-whatsapp-btn${compact ? ' share-whatsapp-btn--compact' : ''}`}
      onClick={() => abrirWhatsApp(texto)}
    >
      <MessageCircle size={compact ? 14 : 16} aria-hidden />
      <span>{t(labelKey)}</span>
    </button>
  )
}
