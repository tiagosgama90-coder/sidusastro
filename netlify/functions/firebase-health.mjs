import { firebaseAdminStatus } from './_shared/firebase-admin.mjs'
import { env } from './_shared/env.mjs'

/** Diagnóstico rápido: GET /api/firebase-health (sem expor segredos). */
export default async () => {
  const status = firebaseAdminStatus()
  const webProject = env('VITE_FIREBASE_PROJECT_ID') || null
  const body = {
    firebaseAdmin: status.ok ? 'ok' : status.reason,
    projectId: status.projectId || null,
    webProjectId: webProject,
    projectMatch: status.projectId && webProject ? status.projectId === webProject : null,
    hasServiceAccountVar: !!env('FIREBASE_SERVICE_ACCOUNT'),
    hasWebApiKey: !!(env('FIREBASE_WEB_API_KEY') || env('VITE_FIREBASE_API_KEY')),
    hint: status.hint || null,
  }
  return new Response(JSON.stringify(body), {
    status: status.ok ? 200 : 503,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })
}

export const config = { path: '/api/firebase-health' }
