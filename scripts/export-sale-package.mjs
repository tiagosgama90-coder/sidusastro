/**
 * Gera pacote limpo para venda em ../sidusastro-sale/
 * Não altera o repo de produção — só copia e sanitiza.
 *
 * Uso: node scripts/export-sale-package.mjs
 */
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, '..', 'sidusastro-sale')

const SKIP_DIRS = new Set([
  'node_modules', 'dist', 'dist-ssr', '.netlify', '.git', 'sidusastro',
])
const SKIP_FILES = new Set([
  'App.jsx.bak', 'test-swe.mjs', 'test-vite-swe.jsx', '.env', '.env.example.remote', 'export-sale-package.mjs',
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

  patchFile('src/lib/adsense.js', [
    [`/** Publisher ID público — igual ao index.html (AdSense sidusastro.com). */
export const ADSENSE_PUBLISHER = 'ca-pub-2807052149540484'
/** Bloco Display horizontal — sidusastro.com */
export const ADSENSE_SLOT_DEFAULT = '7205155875'`, `/** Set via VITE_ADSENSE_CLIENT / VITE_ADSENSE_SLOT in Netlify (no hardcoded IDs). */
export const ADSENSE_PUBLISHER = ''
export const ADSENSE_SLOT_DEFAULT = ''`],
  ])

  patchFile('index.html', [
    ['    <meta name="google-adsense-account" content="ca-pub-2807052149540484" />\n\n', ''],
  ])

  patchFile('netlify.toml', [
    [`[context.production.environment]
  VITE_GA_MEASUREMENT_ID = "G-18FPC8HYE8"
  VITE_ADSENSE_CLIENT = "ca-pub-2807052149540484"
  VITE_ADSENSE_SLOT = "7205155875"

`, ''],
  ])

  writeOut('.env.example', readFileSync(join(ROOT, 'scripts', 'sale-env.example'), 'utf8'))

  patchFile('.firebaserc', [
    ['"default": "sidus-app"', '"default": "your-firebase-project-id"'],
  ])

  patchFile('scripts/add-firebase-auth-domains.mjs', [
    ['projeto sidus-app', 'your Firebase project'],
    ["const PROJECT_ID = 'sidus-app'", "const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'your-firebase-project-id'"],
    [`const DOMAINS_TO_ADD = [
  'sidusastro.com',
  'www.sidusastro.com',
  'sidusastro.netlify.app',
]`, `const DOMAINS_TO_ADD = [
  'yourdomain.com',
  'www.yourdomain.com',
  'your-site.netlify.app',
]`],
  ])

  patchFile('public/ads.txt', [
    ['google.com, pub-2807052149540484, DIRECT, f08c47fec0942fa0\n', `# Replace with your AdSense ads.txt line after approval:\n# google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0\n`],
  ])

  for (const f of ['src/lib/i18n/pt.js', 'src/lib/i18n/en.js', 'src/lib/i18n/privacy.js']) {
    patchFile(f, [['suporte.sidusapp@gmail.com', SUPPORT_EMAIL]])
  }

  patchFile('public/privacy.html', [['suporte.sidusapp@gmail.com', SUPPORT_EMAIL]])

  patchFile('netlify/functions/geocode-city.mjs', [
    ["const USER_AGENT = 'SidusAstro/1.0 (https://sidusastro.com; support@sidusastro.com)'", "const USER_AGENT = 'SidusAstro/1.0 (https://yourdomain.com; support@yourdomain.com)'"],
  ])

  patchFile('package.json', [
    ['"name": "sidus-app"', '"name": "sidusastro"'],
    ['"private": true', '"private": false'],
  ])

  patchFile('package-lock.json', [
    ['"name": "sidus-app"', '"name": "sidusastro"'],
  ])
}

// ── Documentação para o comprador ───────────────────────────────────────────

function writeDocs() {
  writeOut('README.md', readFileSync(join(ROOT, 'scripts', 'sale-README.md'), 'utf8'))
  writeOut('SETUP.md', readFileSync(join(ROOT, 'scripts', 'sale-SETUP.md'), 'utf8'))
  writeOut('DOMAIN-TRANSFER.md', readFileSync(join(ROOT, 'scripts', 'sale-DOMAIN-TRANSFER.md'), 'utf8'))
  writeOut('SALE-NOTES.md', readFileSync(join(ROOT, 'scripts', 'sale-NOTES.md'), 'utf8'))
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
console.log('  Próximo passo: cd ../sidusastro-sale && git init && git add . && git commit')
console.log('  O teu sidus-app em produção não foi alterado (excepto este script).')
