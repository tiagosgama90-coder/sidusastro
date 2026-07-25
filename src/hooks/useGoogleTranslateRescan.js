import { useEffect } from 'react'
import {
  isGoogleTranslated,
  observeGoogleTranslateRescan,
  scheduleGoogleTranslateRescan,
} from '../lib/googleTranslateSupport.js'

/** Após re-render React, ajuda o Tradutor do Google a voltar a processar o DOM. */
export function useGoogleTranslateRescan(...deps) {
  useEffect(() => {
    if (!isGoogleTranslated()) return undefined
    scheduleGoogleTranslateRescan(120)
    return undefined
  }, deps)
}

/** Observa a landing inteira enquanto o Tradutor do Google está activo. */
export function useGoogleTranslateLandingSupport() {
  useEffect(() => {
    const root = document.querySelector('.landing-auth-layout') || document.getElementById('root')
    if (!root) return undefined
    return observeGoogleTranslateRescan(root)
  }, [])
}
