import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY

// Se as credenciais não estiverem configuradas, exporta null.
// A app funciona em modo offline/local sem Firebase.
if (!apiKey) {
  console.warn('[Sidus] Firebase não configurado - a correr em modo local (sem login/cloud).')
}

export let auth = null
export let db   = null
export let firebaseDisponivel = false

if (apiKey) {
  try {
    const app = initializeApp({
      apiKey,
      authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId:             import.meta.env.VITE_FIREBASE_APP_ID,
    })
    auth = getAuth(app)
    db   = getFirestore(app)
    firebaseDisponivel = true
  } catch (e) {
    console.error('[Sidus] Erro ao inicializar Firebase:', e?.message)
  }
}
