#!/usr/bin/env node
/**
 * Converte o JSON da service account Firebase numa única linha para o Netlify.
 *
 * Uso:
 *   node scripts/firebase-service-account-oneline.mjs "C:\Downloads\sidus-app-xxxxx.json"
 *
 * Cria firebase-service-account-oneline.txt na pasta atual e copia para o clipboard (Windows).
 */
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const input = process.argv[2]
if (!input) {
  console.error('Uso: node scripts/firebase-service-account-oneline.mjs CAMINHO\\para\\chave.json')
  process.exit(1)
}

const abs = path.resolve(input)
if (!fs.existsSync(abs)) {
  console.error('Ficheiro não encontrado:', abs)
  process.exit(1)
}

const oneLine = JSON.stringify(JSON.parse(fs.readFileSync(abs, 'utf8')))
const outFile = path.join(process.cwd(), 'firebase-service-account-oneline.txt')
fs.writeFileSync(outFile, oneLine, 'utf8')

console.log('OK - uma linha só,', oneLine.length, 'caracteres')
console.log('Ficheiro:', outFile)
console.log('Começa com:', oneLine.slice(0, 40) + '...')

if (process.platform === 'win32') {
  try {
    execSync(`powershell -NoProfile -Command "Set-Clipboard -Value (Get-Content -Raw '${outFile.replace(/'/g, "''")}')"`, {
      stdio: 'ignore',
    })
    console.log('Copiado para o clipboard - cola no Netlify em FIREBASE_SERVICE_ACCOUNT')
  } catch {
    console.log('Abre o ficheiro .txt e copia tudo (Ctrl+A, Ctrl+C)')
  }
} else {
  console.log('Copia o conteúdo do ficheiro .txt para o Netlify')
}
