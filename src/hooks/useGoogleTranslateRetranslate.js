import { useEffect } from 'react'
import { isGoogleTranslated, retranslatePageWithWidget } from '../lib/googleTranslateWidget.js'

/** Quando conteúdo novo fica visível, pede ao widget GT para re-traduzir. */
export function useGoogleTranslateRetranslate(active, deps = []) {
  useEffect(() => {
    if (!active || !isGoogleTranslated()) return undefined
    return retranslatePageWithWidget()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, ...deps])
}
