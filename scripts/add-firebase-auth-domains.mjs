/**
 * Adiciona domínios à lista Authorized domains do Firebase Auth.
 * Requer: npx firebase-tools@latest login (uma vez)
 *
 * Uso: FIREBASE_PROJECT_ID=your-project node scripts/add-firebase-auth-domains.mjs
 */
import { execSync } from 'node:child_process'

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'your-firebase-project-id'
const DOMAINS_TO_ADD = [
  'your-domain.com',
  'www.your-domain.com',
  'your-site.netlify.app',
]
