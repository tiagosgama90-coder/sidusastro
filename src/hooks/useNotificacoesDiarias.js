import { useState, useEffect, useCallback } from 'react'
import { fetchDailyContent } from '../lib/apiDailyContent.js'
import { buildLocalDailyContent } from '../lib/dailyContentFallback.js'
import { calcularFaseLua } from '../lib/faseLua.js'

/**
 * Hook para Notificações Diárias - 100% gratuito, sem servidor.
 * 
 * Fluxo:
 * 1. Utilizador ativa → pede permissão de notificação
 * 2. Guarda preferência no Firestore
 * 3. Busca horóscopo do signo principal e mostra notificação personalizada
 * 4. Service Worker faz check às 12:00 e mostra notificação personalizada
 * 5. Se abrir depois das 12:00, mostra automaticamente
 */
export function useNotificacoesDiarias(user) {
  const [permission, setPermission] = useState('default')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission)
    }
  }, [])

  /**
   * Busca o horóscopo do signo principal do usuário
   */
  const buscarHoroscopoSigno = useCallback(async (signoNome) => {
    try {
      const faseAtual = calcularFaseLua(new Date())
      const pack = await fetchDailyContent({
        fasePt: faseAtual.nome,
        faseEn: faseAtual.nome,
        transit: '',
      })

      // Procurar horóscopo para o signo em português
      const horoscopo = pack?.horoscopes?.pt?.[signoNome?.toLowerCase()]
      if (horoscopo) return horoscopo

      // Fallback: tentar noutros idiomas
      const langs = ['en', 'es', 'fr', 'it', 'de']
      for (const lang of langs) {
        const h = pack?.horoscopes?.[lang]?.[signoNome?.toLowerCase()]
        if (h) return h
      }
      return null
    } catch {
      // Fallback local
      const faseAtual = calcularFaseLua(new Date())
      const local = buildLocalDailyContent({ fasePt: faseAtual.nome, faseEn: faseAtual.nome })
      return local?.horoscopes?.pt?.[signoNome?.toLowerCase()] || null
    }
  }, [])

  /**
   * Mostra notificação com o horóscopo personalizado
   */
  const mostrarNotificacaoPersonalizada = useCallback(async (signoNome) => {
    if (!('Notification' in window)) return
    if (Notification.permission !== 'granted') return

    let titulo = '🔮 Sidus Astro'
    let corpo = 'O teu horóscopo diário já está disponível!'

    if (signoNome) {
      titulo = `♈ ${signoNome} - A tua leitura diária`
      const horoscopo = await buscarHoroscopoSigno(signoNome)
      if (horoscopo) {
        corpo = horoscopo.length > 100 ? horoscopo.slice(0, 97) + '…' : horoscopo
      }
    }

    try {
      const notif = new Notification(titulo, {
        body: corpo,
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        tag: 'daily-horoscope',
      })

      // Ao clicar na notificação, abre o site
      notif.onclick = () => {
        window.focus()
      }
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
    } else if (resultado === 'denied') {
      setErro('Notificações bloqueadas. Activa nas definições do browser.')
    } else {
      setErro('Permissão de notificações não concedida.')
    }
    return false
  }, [])

  const inscreverNotificacoes = useCallback(async () => {
    setErro(null)
    setLoading(true)
    try {
      const granted = await solicitarPermissao()
      if (!granted) {
        setLoading(false)
        return false
      }

      // Determinar o signo solar do utilizador
      const signoNome = user?.signo || null

      // Guardar preferência no Firestore
      if (user?.uid) {
        const { getFirestore, doc, setDoc } = await import('firebase/firestore')
        const db = getFirestore()
        await setDoc(doc(db, 'users', user.uid, 'notifications', 'dailyHoroscope'), {
          signo: signoNome,
          createdAt: new Date().toISOString(),
          ativo: true,
        })
      }

      // Dizer ao Service Worker para iniciar o timer diário
      if (navigator.serviceWorker?.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'SET_LOCAL_TIMER',
          enabled: true,
        })
      }

      // Mostrar notificação personalizada imediatamente
      await mostrarNotificacaoPersonalizada(signoNome)

      // Verificar se já passou das 12:00 hoje
      await verificarNotificacaoAtrasada(signoNome)

      setLoading(false)
      setErro(null)
      return true
    } catch (error) {
      console.error('Erro ao inscrever notificações:', error)
      setErro(`Erro: ${error.message || 'Erro desconhecido'}`)
      setLoading(false)
      return false
    }
  }, [user, solicitarPermissao, mostrarNotificacaoPersonalizada, verificarNotificacaoAtrasada])

  const cancelarNotificacoes = useCallback(async () => {
    setErro(null)
    setLoading(true)
    try {
      // Remover do Firestore
      if (user?.uid) {
        const { getFirestore, doc, deleteDoc } = await import('firebase/firestore')
        const db = getFirestore()
        await deleteDoc(doc(db, 'users', user.uid, 'notifications', 'dailyHoroscope'))
      }

      // Dizer ao Service Worker para parar o timer
      if (navigator.serviceWorker?.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'SET_LOCAL_TIMER',
          enabled: false,
        })
      }

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
    if (!user?.uid) return false

    try {
      const { getFirestore, doc, getDoc } = await import('firebase/firestore')
      const db = getFirestore()
      const docRef = doc(db, 'users', user.uid, 'notifications', 'dailyHoroscope')
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data()
        return data.ativo === true
      }
      return false
    } catch (error) {
      console.error('Erro ao verificar status:', error)
      return false
    }
  }, [user])

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