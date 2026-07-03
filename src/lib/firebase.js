import { initializeApp } from 'firebase/app'
import { getAuth, initializeRecaptchaConfig } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

function limparEnv(val) {
  if (val == null || typeof val !== 'string') return val
  return val.trim().replace(/^["']+|["']+$/g, '').replace(/,$/, '')
}

function configFromEnv() {
  const apiKey = limparEnv(import.meta.env.VITE_FIREBASE_API_KEY)
  if (!apiKey) return null
  return {
    apiKey,
    authDomain: limparEnv(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
    projectId: limparEnv(import.meta.env.VITE_FIREBASE_PROJECT_ID),
    storageBucket: limparEnv(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
    messagingSenderId: limparEnv(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
    appId: limparEnv(import.meta.env.VITE_FIREBASE_APP_ID),
  }
}

export let auth = null
export let db = null
export let firebaseDisponivel = false

function initFirebaseApp(config) {
  const app = initializeApp(config)
  auth = getAuth(app)
  initializeRecaptchaConfig(auth).catch((e) => {
    console.warn('[Sidus] reCAPTCHA Enterprise config:', e?.code || e?.message)
  })
  db = getFirestore(app)
  firebaseDisponivel = true
}

async function loadConfig() {
  if (import.meta.env.PROD) {
    try {
      const res = await fetch('/api/firebase-config', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        const apiKey = limparEnv(data.apiKey)
        if (apiKey) {
          return {
            apiKey,
            authDomain: limparEnv(data.authDomain),
            projectId: limparEnv(data.projectId),
            storageBucket: limparEnv(data.storageBucket),
            messagingSenderId: limparEnv(data.messagingSenderId),
            appId: limparEnv(data.appId),
          }
        }
      }
    } catch (e) {
      console.warn('[Sidus] Firebase config via API falhou:', e?.message)
    }
  }
  return configFromEnv()
}

export const firebaseReady = (async () => {
  try {
    const config = await loadConfig()
    if (!config?.apiKey) {
      console.warn('[Sidus] Firebase não configurado - a correr em modo local (sem login/cloud).')
      return
    }
    initFirebaseApp(config)
  } catch (e) {
    console.error('[Sidus] Erro ao inicializar Firebase:', e?.message)
  }
})()
