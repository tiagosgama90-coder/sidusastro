/**
 * Gera pacote limpo para venda em ../sidusastro-sale/
 * Não altera o repo de produção - só copia e sanitiza.
 *
 * Uso: node scripts/export-sale-package.mjs
 */
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = process.env.SALE_OUT_DIR
  ? join(process.env.SALE_OUT_DIR)
  : join(ROOT, '..', 'sidusastro-sale')

const SKIP_DIRS = new Set([
  'node_modules', 'dist', 'dist-ssr', '.netlify', '.git', 'sidusastro', 'sidusastro_clean', 'sidusastro-sale',
])
const SKIP_FILES = new Set([
  'App.jsx.bak', 'test-swe.mjs', 'test-vite-swe.jsx', '.env', '.env.example.remote', 'export-sale-package.mjs',
  'REPOS-AND-DEPLOY.md', 'GOOGLE-ADS-SETUP.md', 'firebase-service-account-oneline.txt',
])

function shouldSkip(rel) {
  const parts = rel.split(/[/\\]/)
  if (parts.some((p) => SKIP_DIRS.has(p))) return true
  if (SKIP_FILES.has(parts[parts.length - 1])) return true
  if (rel.startsWith('scripts/export-sale-package')) return true
  return false
}

function copyTree(src, dest) {
  for (const entry of readdirSafe(src)) {
    const srcPath = join(src, entry)
    const rel = relative(ROOT, srcPath)
    if (shouldSkip(rel)) continue
    const destPath = join(dest, entry)
    const stat = statSafe(srcPath)
    if (!stat) continue
    if (stat.isDirectory()) {
      mkdirSync(destPath, { recursive: true })
      copyTree(srcPath, destPath)
    } else {
      mkdirSync(dirname(destPath), { recursive: true })
      cpSync(srcPath, destPath)
    }
  }
}

function readdirSafe(p) {
  try {
    return readdirSync(p)
  } catch {
    return []
  }
}

function statSafe(p) {
  try {
    return statSync(p)
  } catch {
    return null
  }
}

function patchFile(relPath, replacers) {
  const full = join(OUT, relPath)
  if (!existsSync(full)) return
  let text = readFileSync(full, 'utf8')
  for (const [from, to] of replacers) {
    text = typeof from === 'string' ? text.split(from).join(to) : text.replace(from, to)
  }
  writeFileSync(full, text, 'utf8')
}

function writeOut(relPath, content) {
  const full = join(OUT, relPath)
  mkdirSync(dirname(full), { recursive: true })
  writeFileSync(full, content, 'utf8')
}

function patchAllGuiaHtml() {
  const guiaDir = join(OUT, 'public', 'guia')
  if (!existsSync(guiaDir)) return
  for (const file of readdirSafe(guiaDir)) {
    if (!file.endsWith('.html')) continue
    patchFile(join('public', 'guia', file), [
      ['ca-pub-2807052149540484', 'ca-pub-XXXXXXXXXXXXXXXX'],
      ['7205155875', '0000000000'],
      ['<meta name="google-adsense-account" content="ca-pub-XXXXXXXXXXXXXXXX" />\n', '  <!-- AdSense: set your publisher ID in each /guia/ page after approval -->\n'],
    ])
  }
}

function patchAllI18nSupportEmail() {
  const i18nDir = join(OUT, 'src', 'lib', 'i18n')
  if (!existsSync(i18nDir)) return
  for (const file of readdirSafe(i18nDir)) {
    if (!/\.(js|jsx)$/.test(file)) continue
    patchFile(join('src', 'lib', 'i18n', file), [['suporte.sidusapp@gmail.com', SUPPORT_EMAIL]])
  }
}

function writeBuyerDeployInventory() {
  writeOut('DEPLOY-INVENTORY.md', `# Deploy inventory (buyer)

Use your own accounts. **No seller secrets** are included in this repository.

| Service | What to configure |
|---------|-------------------|
| **Netlify** | Hosting, build \`npm run build\`, env vars from \`.env.example\` |
| **Firebase** | Auth + Firestore - project ID in \`.firebaserc\` and \`VITE_FIREBASE_*\` |
| **Stripe** | Checkout + webhook - \`STRIPE_SECRET_KEY\`, \`STRIPE_WEBHOOK_SECRET\` |
| **Google Analytics** | Optional - \`VITE_GA_MEASUREMENT_ID\` |
| **Google AdSense** | Optional - \`VITE_ADSENSE_CLIENT\`, \`VITE_ADSENSE_SLOT\`, \`/guia/*.html\` |
| **reCAPTCHA v2** | \`VITE_RECAPTCHA_SITE_KEY\` |

See [SETUP.md](./SETUP.md) for step-by-step deployment.
`)
}

// ── Sanitização ─────────────────────────────────────────────────────────────

const SUPPORT_EMAIL = 'support@yourdomain.com'

function sanitize() {
  writeOut('src/lib/premiumAccess.js', readFileSync(join(ROOT, 'src/lib/premiumAccess.js'), 'utf8')
    .replace(/\/\*\* Contas com Premium[\s\S]*?const EMAILS_PREMIUM_PRIVILEGIADOS = \[[\s\S]*?\]/m, `/** Optional lifetime premium whitelist (buyer configures). */
const EMAILS_PREMIUM_PRIVILEGIADOS = [
  // 'admin@yourdomain.com',
]`))

  writeOut('src/lib/googleAnalytics.js', readFileSync(join(ROOT, 'src/lib/googleAnalytics.js'), 'utf8')
    .replace(/const FALLBACK_GA_ID = 'G-18FPC8HYE8'\r?\n\r?\n/, '')
    .replace('return FALLBACK_GA_ID', "return ''"))

  writeOut('src/lib/adsense.js', readFileSync(join(ROOT, 'src/lib/adsense.js'), 'utf8')
    .replace(/export const ADSENSE_PUBLISHER = 'ca-pub-[^']+'/, "export const ADSENSE_PUBLISHER = ''")
    .replace(/export const ADSENSE_SLOT_DEFAULT = '[^']+'/, "export const ADSENSE_SLOT_DEFAULT = ''")
    .replace(/\/\*\* Publisher ID[\s\S]*?\*\/\r?\n/, '/** Set via VITE_ADSENSE_CLIENT / VITE_ADSENSE_SLOT (no hardcoded IDs). */\n'))

  let indexHtml = readFileSync(join(OUT, 'index.html'), 'utf8')
  indexHtml = indexHtml
    .replace(/\r?\n\s*<!-- Google AdSense[\s\S]*?google-adsense-account[^\n]+\r?\n\r?\n?/g, '\n')
    .replace(/\r?\n\s*<script async src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-[^"]+"><\/script>/g, '')
    .replace(/\r?\n\s*gtag\('config', 'G-[^']+', \{ anonymize_ip: true \}\);/g, "\n      // GA4 loads at runtime when VITE_GA_MEASUREMENT_ID is set")
  writeOut('index.html', indexHtml)

  let netlifyToml = readFileSync(join(OUT, 'netlify.toml'), 'utf8')
  netlifyToml = netlifyToml.replace(/\r?\n\[context\.production\.environment\][\s\S]*?(?=\r?\n\[functions\])/, '')
  writeOut('netlify.toml', netlifyToml)

  writeOut('.env.example', readFileSync(join(ROOT, 'scripts', 'sale-env.example'), 'utf8'))

  patchFile('.firebaserc', [
    ['"default": "sidus-app"', '"default": "your-firebase-project-id"'],
  ])

  patchFile('scripts/add-firebase-auth-domains.mjs', [
    ['projeto sidus-app', 'your Firebase project'],
    ["const PROJECT_ID = 'sidus-app'", "const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'your-firebase-project-id'"],
  ])
  patchFile('scripts/add-firebase-auth-domains.mjs', [
    [/sidusastro\.com/g, 'yourdomain.com'],
  ])
  let authDomains = readFileSync(join(OUT, 'scripts/add-firebase-auth-domains.mjs'), 'utf8')
  authDomains = authDomains
    .replace(/'www\.sidusastro\.com'/g, "'www.yourdomain.com'")
    .replace(/'sidusastro\.netlify\.app'/g, "'your-site.netlify.app'")
  writeOut('scripts/add-firebase-auth-domains.mjs', authDomains)

  patchFile('public/ads.txt', [
    [/google\.com, pub-[^\n]+\n/g, '# Replace with your AdSense ads.txt line after approval:\n# google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0\n'],
  ])

  patchAllI18nSupportEmail()

  patchFile('public/privacy.html', [['suporte.sidusapp@gmail.com', SUPPORT_EMAIL]])

  patchFile('netlify/functions/geocode-city.mjs', [
    [/https:\/\/sidusastro\.com/g, 'https://yourdomain.com'],
    [/support@sidusastro\.com/g, 'support@yourdomain.com'],
  ])

  patchFile('package.json', [
    ['"name": "sidus-app"', '"name": "sidusastro"'],
    ['"private": true', '"private": false'],
  ])

  patchFile('package-lock.json', [
    ['"name": "sidus-app"', '"name": "sidusastro"'],
  ])

  patchAllGuiaHtml()

  const sellerDeploy = join(OUT, 'scripts', 'DEPLOY-INVENTORY.md')
  if (existsSync(sellerDeploy)) rmSync(sellerDeploy)
}

// ── Documentação para o comprador ───────────────────────────────────────────

function writeDocs() {
  writeOut('README.md', readFileSync(join(ROOT, 'scripts', 'sale-README.md'), 'utf8'))
  writeOut('SETUP.md', readFileSync(join(ROOT, 'scripts', 'sale-SETUP.md'), 'utf8'))
  writeOut('DOMAIN-TRANSFER.md', readFileSync(join(ROOT, 'scripts', 'sale-DOMAIN-TRANSFER.md'), 'utf8'))
  writeOut('SALE-NOTES.md', readFileSync(join(ROOT, 'scripts', 'sale-NOTES.md'), 'utf8'))
  writeBuyerDeployInventory()
}

// ── Main ──────────────────────────────────────────────────────────────────────

console.log('A limpar pasta de venda:', OUT)
if (existsSync(OUT)) rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })

console.log('A copiar código fonte…')
copyTree(ROOT, OUT)

console.log('A sanitizar dados do vendedor…')
sanitize()

console.log('A escrever documentação…')
writeDocs()

console.log('')
console.log('✓ Pacote pronto em:', OUT)
console.log('  Próximo passo: sincronizar com sidusastro_clean e git push')
console.log('  O teu sidusastro em produção não foi alterado.')
