import { useState, useEffect, useCallback, useRef } from 'react'
import { fetchDailyContent } from '../lib/apiDailyContent.js'
import { buildLocalDailyContent, signoHoroscopeKey } from '../lib/dailyContentFallback.js'
import { calcularFaseLua } from '../lib/faseLua.js'
import { normalizeSignoNome } from '../lib/i18n/astro.js'

const PREFS_KEY = 'sidus_notif_prefs'
const DISABLED_KEY = 'sidus_notif_desactivado'

const SIGNO_EMOJI = {
  'Áries': '♈', 'Carneiro': '♈', 'Touro': '♉', 'Gémeos': '♊', 'Caranguejo': '♋',
  'Leão': '♌', 'Virgem': '♍', 'Balança': '♎', 'Escorpião': '♏', 'Sagitário': '♐',
  'Capricórnio': '♑', 'Aquário': '♒', 'Peixes': '♓',
}

function resolveHoroscopoDoPack(pack, signoSolar, lang) {
  if (!pack?.horoscopes || !signoSolar) return null

  const keyPt = signoHoroscopeKey(signoSolar, 'pt')
  const keyLang = lang === 'pt' ? keyPt : (signoHoroscopeKey(signoSolar, lang) || signoSolar)

  return pack.horoscopes[lang]?.[keyLang]
    || pack.horoscopes.pt?.[keyPt]
    || pack.horoscopes.en?.[signoHoroscopeKey(signoSolar, 'en')]
    || null
}

function lerPrefs(uid) {
  try {
    const raw = localStorage.getItem(PREFS_KEY)
    if (!raw) return null
    const prefs = JSON.parse(raw)
    if (uid && prefs.uid && prefs.uid !== uid) return null
    return prefs
  } catch {
    return null
  }
}

function guardarPrefs({ uid, signo, lang, ativo }) {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify({ uid, signo, lang, ativo }))
  } catch { /* quota */ }
}

function limparPrefs() {
  try {
    localStorage.removeItem(PREFS_KEY)
    localStorage.removeItem('sidus_notif_vista_hoje')
  } catch { /* ignore */ }
}

function marcarDesactivado(uid) {
  try {
    if (uid) localStorage.setItem(DISABLED_KEY, uid)
  } catch { /* ignore */ }
}

function estaDesactivado(uid) {
  if (!uid) return false
  try {
    return localStorage.getItem(DISABLED_KEY) === uid
  } catch {
    return false
  }
}

function limparDesactivado() {
  try {
    localStorage.removeItem(DISABLED_KEY)
  } catch { /* ignore */ }
}

function syncServiceWorker(enabled, signo, lang) {
  if (!('serviceWorker' in navigator)) return Promise.resolve(false)

  const payload = { type: 'SET_LOCAL_TIMER', enabled, signo, lang }
  const enviar = (sw) => {
    if (!sw) return false
    try {
      sw.postMessage(payload)
      return true
    } catch {
      return false
    }
  }

  if (navigator.serviceWorker.controller) {
    return Promise.resolve(enviar(navigator.serviceWorker.controller))
  }

  return navigator.serviceWorker.ready
    .then((reg) => enviar(reg.active) || enviar(reg.installing) || enviar(reg.waiting))
    .catch(() => false)
}

function desactivarServiceWorker() {
  syncServiceWorker(false, null, null)
  navigator.serviceWorker?.ready?.then((reg) => {
    reg.active?.postMessage({ type: 'DISABLE_NOTIFICATIONS' })
    reg.waiting?.postMessage({ type: 'DISABLE_NOTIFICATIONS' })
    reg.installing?.postMessage({ type: 'DISABLE_NOTIFICATIONS' })
  }).catch(() => {})
}

function normalizarSignoSolar(signoSolar) {
  if (!signoSolar) return null
  return normalizeSignoNome(signoSolar) || signoSolar
}

async function mostrarNotificacaoViaSW(signoNome, lang, buscarHoroscopoSigno) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return false

  const emoji = SIGNO_EMOJI[signoNome] || '♈'
  let titulo = signoNome
    ? `${emoji} ${signoNome} - Horóscopo diário`
    : '🔮 Sidus Astro - Horóscopo diário'
  let corpo = 'O teu horóscopo diário já está disponível!'

  if (signoNome) {
    const horoscopo = await buscarHoroscopoSigno(signoNome)
    if (horoscopo) {
      corpo = horoscopo.length > 120 ? horoscopo.slice(0, 117) + '…' : horoscopo
    }
  }

  const options = {
    body: corpo,
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    tag: 'daily-horoscope',
    data: { url: '/' },
  }

  try {
    const reg = await navigator.serviceWorker.ready
    await reg.showNotification(titulo, options)
    return true
  } catch {
    try {
      const notif = new Notification(titulo, options)
      notif.onclick = () => window.focus()
      return true
    } catch {
      return false
    }
  }
}

/**
 * Notificações diárias Premium — horóscopo do signo solar às 12:00.
 * Estado on/off: localStorage (prioridade) + Firestore (sync entre dispositivos).
 */
export function useNotificacoesDiarias({ user, signoSolar, lang = 'pt', isPremium = false }) {
  const [permission, setPermission] = useState('default')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState(null)
  const uid = user?.uid || null
  const desactivadoRef = useRef(false)
  const signoNormalizado = normalizarSignoSolar(signoSolar)

  useEffect(() => {
    if ('Notification' in window) setPermission(Notification.permission)
  }, [])

  const buscarHoroscopoSigno = useCallback(async (signoNome) => {
    if (!signoNome) return null
    try {
      const faseAtual = calcularFaseLua(new Date())
      const pack = await fetchDailyContent({
        fasePt: faseAtual.nome,
        faseEn: faseAtual.nome,
        transit: '',
      })
      return resolveHoroscopoDoPack(pack, signoNome, lang)
    } catch {
      const faseAtual = calcularFaseLua(new Date())
      const local = buildLocalDailyContent({ fasePt: faseAtual.nome, faseEn: faseAtual.nome, lang })
      return resolveHoroscopoDoPack(local, signoNome, lang)
    }
  }, [lang])

  const verificarStatus = useCallback(async () => {
    if (desactivadoRef.current || estaDesactivado(uid)) return false

    const local = lerPrefs(uid)
    if (local?.ativo === true) {
      const signoGuardado = normalizarSignoSolar(local.signo) || signoNormalizado
      const signoSync = signoNormalizado || signoGuardado
      const langSync = local.lang || lang

      if (signoNormalizado && signoGuardado !== signoNormalizado) {
        guardarPrefs({ uid, signo: signoNormalizado, lang: langSync, ativo: true })
        if (uid) {
          try {
            const { getFirestore, doc, setDoc } = await import('firebase/firestore')
            await setDoc(doc(getFirestore(), 'users', uid, 'notifications', 'dailyHoroscope'), {
              signo: signoNormalizado,
              lang: langSync,
              createdAt: new Date().toISOString(),
              ativo: true,
            })
          } catch (e) {
            console.warn('[Notificacoes] Firestore sync signo falhou:', e)
          }
        }
      }

      await syncServiceWorker(true, signoSync, langSync)
      return true
    }

    if (!uid) return false

    try {
      const { getFirestore, doc, getDoc } = await import('firebase/firestore')
      const db = getFirestore()
      const snap = await getDoc(doc(db, 'users', uid, 'notifications', 'dailyHoroscope'))
      if (snap.exists() && snap.data()?.ativo === true) {
        const data = snap.data()
        const signoSync = normalizarSignoSolar(data.signo) || signoNormalizado
        guardarPrefs({ uid, signo: signoSync, lang: data.lang || lang, ativo: true })
        await syncServiceWorker(true, signoSync, data.lang || lang)
        return true
      }
    } catch (e) {
      console.warn('[Notificacoes] Firestore indisponível:', e)
    }

    return false
  }, [uid, signoNormalizado, lang])

  const solicitarPermissao = useCallback(async () => {
    if (!('Notification' in window)) {
      setErro('Este navegador não suporta notificações')
      return false
    }
    const resultado = await Notification.requestPermission()
    setPermission(resultado)
    if (resultado === 'granted') {
      setErro(null)
      return true
    }
    setErro(resultado === 'denied'
      ? 'Notificações bloqueadas. Activa nas definições do browser.'
      : 'Permissão de notificações não concedida.')
    return false
  }, [])

  const inscreverNotificacoes = useCallback(async () => {
    setErro(null)
    if (!isPremium) { setErro('Recurso exclusivo Premium.'); return false }
    if (!signoNormalizado) { setErro('Completa o teu mapa natal para receber o horóscopo do teu signo.'); return false }

    setLoading(true)
    try {
      const granted = await solicitarPermissao()
      if (!granted) { setLoading(false); return false }

      desactivadoRef.current = false
      limparDesactivado()

      if (uid) {
        try {
          const { getFirestore, doc, setDoc } = await import('firebase/firestore')
          await setDoc(doc(getFirestore(), 'users', uid, 'notifications', 'dailyHoroscope'), {
            signo: signoNormalizado,
            lang,
            createdAt: new Date().toISOString(),
            ativo: true,
          })
        } catch (e) {
          console.warn('[Notificacoes] Firestore write falhou (continua local):', e)
        }
      }

      guardarPrefs({ uid, signo: signoNormalizado, lang, ativo: true })
      const swOk = await syncServiceWorker(true, signoNormalizado, lang)
      if (!swOk) {
        console.warn('[Notificacoes] Service Worker ainda não controla a página — tenta recarregar.')
      }

      const mostrada = await mostrarNotificacaoViaSW(signoNormalizado, lang, buscarHoroscopoSigno)
      if (!mostrada) {
        setErro('Permissão OK, mas o browser bloqueou a notificação. Verifica Definições → Notificações.')
        setLoading(false)
        return false
      }

      setLoading(false)
      return true
    } catch (error) {
      setErro(`Erro: ${error.message || 'Erro desconhecido'}`)
      setLoading(false)
      return false
    }
  }, [uid, signoNormalizado, lang, isPremium, solicitarPermissao, buscarHoroscopoSigno])

  const cancelarNotificacoes = useCallback(async () => {
    setErro(null)
    setLoading(true)

    // Marcar desactivado ANTES de tudo — impede reactivação por race conditions
    desactivadoRef.current = true
    if (uid) marcarDesactivado(uid)
    limparPrefs()
    desactivarServiceWorker()

    if (uid) {
      try {
        const { getFirestore, doc, deleteDoc } = await import('firebase/firestore')
        await deleteDoc(doc(getFirestore(), 'users', uid, 'notifications', 'dailyHoroscope'))
      } catch (e) {
        console.warn('[Notificacoes] Firestore delete falhou (desactivado localmente):', e)
      }
    }

    setLoading(false)
    return true
  }, [uid])

  const testarNotificacao = useCallback(async () => {
    if (!signoNormalizado) {
      setErro('Completa o teu mapa natal para receber o horóscopo do teu signo.')
      return false
    }
    setErro(null)
    const ok = await mostrarNotificacaoViaSW(signoNormalizado, lang, buscarHoroscopoSigno)
    if (!ok) {
      setErro('Não foi possível mostrar a notificação. Verifica as permissões do browser.')
    }
    return ok
  }, [signoNormalizado, lang, buscarHoroscopoSigno])

  return {
    permission,
    loading,
    erro,
    inscreverNotificacoes,
    cancelarNotificacoes,
    verificarStatus,
    testarNotificacao,
    solicitarPermissao,
  }
}
