import { useEffect, useRef } from 'react'
import { scheduleGoogleTranslateRescan } from '../lib/googleTranslateRescan.js'

/**
 * Quando `active` fica true, força o Tradutor do Google a processar o conteúdo
 * dentro do ref (útil após guardar dados na landing).
 */
export function useGoogleTranslateRescanOnMount(active, deps = []) {
  const ref = useRef(null)

  useEffect(() => {
    if (!active) return undefined
    const el = ref.current
    if (!el) return undefined
    return scheduleGoogleTranslateRescan(el)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, ...deps])

  return ref
}
