import { env } from './_shared/env.mjs'

function limpar(val) {
  if (val == null || typeof val !== 'string') return ''
  return val.trim().replace(/^["']+|["']+$/g, '').replace(/,$/, '')
}

/** Config web pública do Firebase - GET /api/firebase-config */
export default async () => {
  const apiKey = limpar(env('VITE_FIREBASE_API_KEY') || env('FIREBASE_WEB_API_KEY'))
  const body = {
    apiKey,
    authDomain: limpar(env('VITE_FIREBASE_AUTH_DOMAIN')),
    projectId: limpar(env('VITE_FIREBASE_PROJECT_ID')),
    storageBucket: limpar(env('VITE_FIREBASE_STORAGE_BUCKET')),
    messagingSenderId: limpar(env('VITE_FIREBASE_MESSAGING_SENDER_ID')),
    appId: limpar(env('VITE_FIREBASE_APP_ID')),
  }
  const ok = Boolean(body.apiKey && body.authDomain && body.projectId)
  return new Response(JSON.stringify(body), {
    status: ok ? 200 : 503,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=60',
    },
  })
}

export const config = { path: '/api/firebase-config' }
