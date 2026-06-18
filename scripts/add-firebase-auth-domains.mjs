/**
 * Adiciona domínios à lista Authorized domains do Firebase Auth (projeto sidus-app).
 * Requer: npx firebase-tools@latest login (uma vez)
 *
 * Uso: node scripts/add-firebase-auth-domains.mjs
 */
import { execSync } from 'node:child_process'

const PROJECT_ID = 'sidus-app'
const DOMAINS_TO_ADD = [
  'sidusastro.com',
  'www.sidusastro.com',
  'sidusastro.netlify.app',
]

function getAccessToken() {
  try {
    return execSync('npx -y firebase-tools@latest login:ci --no-localhost', {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'inherit'],
    }).trim()
  } catch {
    return null
  }
}

async function getConfig(token) {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v2/projects/${PROJECT_ID}/config`,
    { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } }
  )
  if (!res.ok) throw new Error(`GET config failed: ${res.status} ${await res.text()}`)
  return res.json()
}

async function patchDomains(token, authorizedDomains) {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v2/projects/${PROJECT_ID}/config?updateMask=authorizedDomains`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ authorizedDomains }),
    }
  )
  if (!res.ok) throw new Error(`PATCH config failed: ${res.status} ${await res.text()}`)
  return res.json()
}

async function main() {
  let token = process.env.FIREBASE_ACCESS_TOKEN?.trim()
  if (!token) {
    console.log('A obter token Firebase (abre o browser se necessário)…')
    token = getAccessToken()
  }
  if (!token) {
    console.error('Sem token. Corre: npx firebase-tools@latest login')
    process.exit(1)
  }

  const config = await getConfig(token)
  const current = config.authorizedDomains ?? []
  const merged = [...new Set([...current, ...DOMAINS_TO_ADD])]

  console.log('Domínios actuais:', current.join(', ') || '(nenhum)')
  const added = DOMAINS_TO_ADD.filter(d => !current.includes(d))
  if (added.length === 0) {
    console.log('Todos os domínios Sidus já estão autorizados.')
    return
  }

  await patchDomains(token, merged)
  console.log('Domínios adicionados:', added.join(', '))
  console.log('Lista final:', merged.join(', '))
}

main().catch(err => {
  console.error(err.message || err)
  process.exit(1)
})
