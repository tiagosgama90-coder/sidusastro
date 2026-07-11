import { useState, useEffect, useCallback } from 'react'

export function useNotificacoesDiarias(user, isPremium) {
  const [permission, setPermission] = useState('default')
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission)
    }
  }, [])

  const solicitarPermissao = useCallback(async () => {
    if (!('Notification' in window)) {
      alert('Este navegador não suporta notificações')
      return false
    }

    const resultado = await Notification.requestPermission()
    setPermission(resultado)
    return resultado === 'granted'
  }, [])

  const inscreverNotificacoes = useCallback(async () => {
    if (!isPremium) {
      alert('Notificações diárias disponíveis apenas para usuários Premium')
      return false
    }

    setLoading(true)
    try {
      const granted = await solicitarPermissao()
      if (!granted) {
        setLoading(false)
        return false
      }

      // Registrar Service Worker
      const registration = await navigator.serviceWorker.ready
      
      // Subscrever para notificações push
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
      })

      setSubscription(sub)

      // Salvar subscrição no Firestore
      if (user?.uid) {
        const { getFirestore, doc, setDoc } = await import('firebase/firestore')
        const db = getFirestore()
        await setDoc(doc(db, 'users', user.uid, 'notifications', 'dailyHoroscope'), {
          subscription: sub.toJSON(),
          signo: user.signo || null,
          createdAt: new Date().toISOString(),
          ativo: true,
        })
      }

      setLoading(false)
      return true
    } catch (error) {
      console.error('Erro ao inscrever notificações:', error)
      setLoading(false)
      return false
    }
  }, [isPremium, user, solicitarPermissao])

  const cancelarNotificacoes = useCallback(async () => {
    setLoading(true)
    try {
      if (subscription) {
        await subscription.unsubscribe()
        setSubscription(null)
      }

      // Remover do Firestore
      if (user?.uid) {
        const { getFirestore, doc, deleteDoc } = await import('firebase/firestore')
        const db = getFirestore()
        await deleteDoc(doc(db, 'users', user.uid, 'notifications', 'dailyHoroscope'))
      }

      setLoading(false)
      return true
    } catch (error) {
      console.error('Erro ao cancelar notificações:', error)
      setLoading(false)
      return false
    }
  }, [subscription, user])

  const verificarStatus = useCallback(async () => {
    if (!user?.uid) return false

    try {
      const { getFirestore, doc, getDoc } = await import('firebase/firestore')
      const db = getFirestore()
      const docRef = doc(db, 'users', user.uid, 'notifications', 'dailyHoroscope')
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data()
        setSubscription(data.subscription ? { toJSON: () => data.subscription } : null)
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
    subscription,
    loading,
    inscreverNotificacoes,
    cancelarNotificacoes,
    verificarStatus,
    solicitarPermissao,
  }
}