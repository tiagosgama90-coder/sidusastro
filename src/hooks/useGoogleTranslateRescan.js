import { useEffect } from 'react'

/** Após re-render React, ajuda o Tradutor do Google a voltar a processar o DOM. */
export function useGoogleTranslateRescan(...deps) {
  useEffect(() => {
    const html = document.documentElement
    const traduzido = html.classList.contains('translated-ltr') || html.classList.contains('translated-rtl')
    if (!traduzido) return undefined

    const id = window.setTimeout(() => {
      window.dispatchEvent(new Event('resize'))
    }, 120)
    return () => window.clearTimeout(id)
  }, deps)
}
