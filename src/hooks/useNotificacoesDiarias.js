import { useState, useEffect, useCallback } from 'react'
import { fetchDailyContent } from '../lib/apiDailyContent.js'
import { buildLocalDailyContent, signoHoroscopeKey } from '../lib/dailyContentFallback.js'
import { calcularFaseLua } from '../lib/faseLua.js'

const PREFS_KEY = 'sidus_notif_prefs'

const SIGNO_EMOJI = {
  'Áries': '♈', 'Carneiro': '♈', 'Touro': '♉', 'Gémeos': '♊', 'Caranguejo': '♋',
  'Leão': '♌', 'Virgem': '♍', 'Balança': '♎', 'Escorpião': '♏', 'Sagitário': '♐',
  'Capricórnio': '♑', 'Aquário': '♒', 'Peixes': '♓',
}

function resolveHoroscopoDoPack(pack, signoSolar, lang) {
  if (!pack?.horoscopes || !signoSolar) return null

  const keyPt = signoHoroscopeKey(signoSolar, 'pt')
  const keyLang = lang === 'pt' ? keyPt : (signoHoroscopeKey(signoSolar, lang) || signoSolar)

  const hLang = pack.horoscopes[lang]?.[keyLang]
  if (hLang) return hLang

  const hPt = pack.horoscopes.pt?.[keyPt]
  if (hPt) return hPt

  const keyEn = signoHoroscopeKey(signoSolar, 'en')
  return pack.horoscopes.en?.[keyEn] || null
}

function guardarPrefsLocal({ uid, signo, lang, ativo }) {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify({ uid, signo, lang, ativo }))
  } catch { /* quota */ }
}

function limparPrefsLocal() {
  try {
    localStorage.removeItem(PREFS_KEY)
  } catch { /* ignore */ }
}

function lerPrefsLocal(uid) {
  try {
    const raw = localStorage.getItem(PREFS_KEY)
    if (!raw) return null
    const prefs = JSON.parse(raw)
    if (uid && prefs.uid !== uid) return null
    return prefs
  } catch {
    return null
  }
}

function syncServiceWorker(enabled, signo, lang) {
  const payload = { type: 'SET_LOCAL_TIMER', enabled, signo, lang }
  if (navigator.serviceWorker?.controller) {
    navigator.serviceWorker.controller.postMessage(payload)
    return
  }
  navigator.serviceWorker?.ready?.then((reg) => {
    reg.active?.postMessage(payload)
  }).catch(() => {})
}

/**
 * Hook para Notificações Diárias Místicas (Premium).
 *
 * Fluxo:
 * 1. Utilizador Premium activa → pede permissão de notificação
 * 2. Guarda preferência no Firestore + localStorage
 * 3. Service Worker envia horóscopo do signo solar às 12:00
 * 4. Se abrir depois das 12:00, mostra automaticamente
 */
export function useNotificacoesDiarias({ user, signoSolar, lang = 'pt', isPremium = false }) {
  const [permission, setPermission] = useState('default')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission)
    }
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

  const mostrarNotificacaoPersonalizada = useCallback(async (signoNome) => {
    if (!('Notification' in window)) return
    if (Notification.permission !== 'granted') return

    const emoji = SIGNO_EMOJI[signoNome] || '♈'
    let titulo = '🔮 Sidus Astro'
    let corpo = 'O teu horóscopo diário já está disponível!'

    if (signoNome) {
      titulo = `${emoji} ${signoNome} - Horóscopo diário`
      const horoscopo = await buscarHoroscopoSigno(signoNome)
      if (horoscopo) {
        corpo = horoscopo.length > 120 ? horoscopo.slice(0, 117) + '…' : horoscopo
      }
    }

    try {
      const notif = new Notification(titulo, {
        body: corpo,
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        tag: 'daily-horoscope',
      })
      notif.onclick = () => window.focus()
    } catch (e) {
      console.warn('[Notificacoes] Erro ao mostrar notificação:', e)
    }
  }, [buscarHoroscopoSigno])

  const verificarNotificacaoAtrasada = useCallback(async (signoNome) => {
    const agora = new Date()
    const hora = agora.getHours()
    const hojeMeiaNoite = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate()).getTime()
    const jaViuNotifHoje = localStorage.getItem('sidus_notif_vista_hoje')

    if (hora >= 12 && jaViuNotifHoje !== String(hojeMeiaNoite)) {
      await mostrarNotificacaoPersonalizada(signoNome)
      localStorage.setItem('sidus_notif_vista_hoje', String(hojeMeiaNoite))
    }
  }, [mostrarNotificacaoPersonalizada])

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
    if (resultado === 'denied') {
      setErro('Notificações bloqueadas. Activa nas definições do browser.')
    } else {
      setErro('Permissão de notificações não concedida.')
    }
    return false
  }, [])

  const inscreverNotificacoes = useCallback(async () => {
    setErro(null)

    if (!isPremium) {
      setErro('Recurso exclusivo Premium.')
      return false
    }

    if (!signoSolar) {
      setErro('Completa o teu mapa natal para receber o horóscopo do teu signo.')
      return false
    }

    setLoading(true)
    try {
      const granted = await solicitarPermissao()
      if (!granted) {
        setLoading(false)
        return false
      }

      if (user?.uid) {
        try {
          const { getFirestore, doc, setDoc } = await import('firebase/firestore')
          const db = getFirestore()
          await setDoc(doc(db, 'users', user.uid, 'notifications', 'dailyHoroscope'), {
            signo: signoSolar,
            lang,
            createdAt: new Date().toISOString(),
            ativo: true,
          })
        } catch (firestoreErr) {
          console.warn('[Notificacoes] Firestore indisponível, a usar prefs locais:', firestoreErr)
        }
      }

      guardarPrefsLocal({ uid: user?.uid, signo: signoSolar, lang, ativo: true })
      syncServiceWorker(true, signoSolar, lang)

      await mostrarNotificacaoPersonalizada(signoSolar)
      await verificarNotificacaoAtrasada(signoSolar)

      setLoading(false)
      setErro(null)
      return true
    } catch (error) {
      console.error('Erro ao inscrever notificações:', error)
      setErro(`Erro: ${error.message || 'Erro desconhecido'}`)
      setLoading(false)
      return false
    }
  }, [user, signoSolar, lang, isPremium, solicitarPermissao, mostrarNotificacaoPersonalizada, verificarNotificacaoAtrasada])

  const cancelarNotificacoes = useCallback(async () => {
    setErro(null)
    setLoading(true)
    try {
      if (user?.uid) {
        const { getFirestore, doc, deleteDoc } = await import('firebase/firestore')
        const db = getFirestore()
        await deleteDoc(doc(db, 'users', user.uid, 'notifications', 'dailyHoroscope'))
      }

      limparPrefsLocal()
      syncServiceWorker(false, null, null)

      setLoading(false)
      return true
    } catch (error) {
      console.error('Erro ao cancelar notificações:', error)
      setErro(`Erro ao desativar: ${error.message}`)
      setLoading(false)
      return false
    }
  }, [user])

  const verificarStatus = useCallback(async () => {
    if (!user?.uid) {
      const prefs = lerPrefsLocal()
      return prefs?.ativo === true
    }

    try {
      const { getFirestore, doc, getDoc } = await import('firebase/firestore')
      const db = getFirestore()
      const docRef = doc(db, 'users', user.uid, 'notifications', 'dailyHoroscope')
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data()
        if (data.ativo === true) {
          const signo = data.signo || signoSolar
          const idioma = data.lang || lang
          guardarPrefsLocal({ uid: user.uid, signo, lang: idioma, ativo: true })
          syncServiceWorker(true, signo, idioma)
          return true
        }
      }
      return false
    } catch (error) {
      console.error('Erro ao verificar status:', error)
      const prefs = lerPrefsLocal(user.uid)
      if (prefs?.ativo) {
        syncServiceWorker(true, prefs.signo, prefs.lang || lang)
        return true
      }
      return false
    }
  }, [user, signoSolar, lang])

  // Re-sincronizar SW quando o signo ou idioma mudam com notificações activas
  useEffect(() => {
    if (!signoSolar || !isPremium) return
    verificarStatus().then((ativo) => {
      if (ativo) syncServiceWorker(true, signoSolar, lang)
    })
  }, [signoSolar, lang, isPremium, verificarStatus])

  return {
    permission,
    loading,
    erro,
    inscreverNotificacoes,
    cancelarNotificacoes,
    verificarStatus,
    solicitarPermissao,
  }
}
