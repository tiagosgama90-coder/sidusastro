import { initializeApp } from 'firebase/app'
import { getAuth, initializeRecaptchaConfig } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

function limparEnv(val) {
  if (val == null || typeof val !== 'string') return val
  return val.trim().replace(/^["']+|["']+$/g, '').replace(/,$/, '')
}

const apiKey = limparEnv(import.meta.env.VITE_FIREBASE_API_KEY)

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
      authDomain:        limparEnv(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
      projectId:         limparEnv(import.meta.env.VITE_FIREBASE_PROJECT_ID),
      storageBucket:     limparEnv(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
      messagingSenderId: limparEnv(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
      appId:             limparEnv(import.meta.env.VITE_FIREBASE_APP_ID),
    })
    auth = getAuth(app)
    initializeRecaptchaConfig(auth).catch((e) => {
      console.warn('[Sidus] reCAPTCHA Enterprise config:', e?.code || e?.message)
    })
    db   = getFirestore(app)
    firebaseDisponivel = true
  } catch (e) {
    console.error('[Sidus] Erro ao inicializar Firebase:', e?.message)
  }
}
