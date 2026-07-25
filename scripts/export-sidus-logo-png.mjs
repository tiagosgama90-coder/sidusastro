import sharp from 'sharp'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const outDir = path.resolve('public/images/brand')

const markSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
  <path d="M16 5.5 18.2 13.8 26.5 16 18.2 18.2 16 26.5 13.8 18.2 5.5 16 13.8 13.8 16 5.5Z" stroke="#DFB76C" stroke-width="1.35" stroke-linejoin="round"/>
  <circle cx="11.5" cy="21.5" r="1.15" fill="#DFB76C"/>
  <path d="M22.5 10.5h1.6M23.3 9.7v3.6" stroke="#DFB76C" stroke-width="1.1" stroke-linecap="round"/>
</svg>`

const stackedSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 168" fill="none">
  <g transform="translate(68 4) scale(4)">
    <path d="M16 5.5 18.2 13.8 26.5 16 18.2 18.2 16 26.5 13.8 18.2 5.5 16 13.8 13.8 16 5.5Z" stroke="#DFB76C" stroke-width="1.35" stroke-linejoin="round"/>
    <circle cx="11.5" cy="21.5" r="1.15" fill="#DFB76C"/>
    <path d="M22.5 10.5h1.6M23.3 9.7v3.6" stroke="#DFB76C" stroke-width="1.1" stroke-linecap="round"/>
  </g>
  <text x="100" y="156" text-anchor="middle" font-family="Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-size="26" font-weight="300" letter-spacing="9" fill="#DFB76C">SIDUS</text>
</svg>`

const fullSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 96" fill="none">
  <g transform="translate(8 8) scale(2.5)">
    <path d="M16 5.5 18.2 13.8 26.5 16 18.2 18.2 16 26.5 13.8 18.2 5.5 16 13.8 13.8 16 5.5Z" stroke="#DFB76C" stroke-width="1.35" stroke-linejoin="round"/>
    <circle cx="11.5" cy="21.5" r="1.15" fill="#DFB76C"/>
    <path d="M22.5 10.5h1.6M23.3 9.7v3.6" stroke="#DFB76C" stroke-width="1.1" stroke-linecap="round"/>
  </g>
  <text x="104" y="62" font-family="Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-size="42" font-weight="300" letter-spacing="10" fill="#DFB76C">SIDUS</text>
</svg>`

const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <defs>
    <radialGradient id="cosmos" cx="50%" cy="42%" r="58%">
      <stop offset="0%" stop-color="#8B5CF6" stop-opacity="0.45"/>
      <stop offset="55%" stop-color="#4C1D95" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#0B071E" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F5E6B8"/>
      <stop offset="45%" stop-color="#DFB76C"/>
      <stop offset="100%" stop-color="#B8944F"/>
    </linearGradient>
    <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="1.2" result="b"/>
      <feMerge>
        <feMergeNode in="b"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <circle cx="32" cy="32" r="28" fill="url(#cosmos)"/>
  <circle cx="32" cy="32" r="22" fill="none" stroke="#DFB76C" stroke-opacity="0.22" stroke-width="0.75"/>
  <g fill="#DFB76C" opacity="0.75">
    <circle cx="32" cy="10" r="1.4"/>
    <circle cx="48.5" cy="15.5" r="1.1"/>
    <circle cx="54" cy="32" r="1.4"/>
    <circle cx="48.5" cy="48.5" r="1.1"/>
    <circle cx="32" cy="54" r="1.4"/>
    <circle cx="15.5" cy="48.5" r="1.1"/>
    <circle cx="10" cy="32" r="1.4"/>
    <circle cx="15.5" cy="15.5" r="1.1"/>
  </g>
  <path fill="url(#gold)" filter="url(#glow)" d="M38 22a10 10 0 1 0-1.2 16.8A8 8 0 0 1 38 22z"/>
  <path fill="url(#gold)" filter="url(#glow)" d="M32 26.5l2.1 4.3 4.7.7-3.4 3.3.8 4.6L32 36.8l-4.2 2.6.8-4.6-3.4-3.3 4.7-.7z"/>
  <circle cx="20" cy="20" r="1" fill="#C4B5FD" opacity="0.9"/>
  <circle cx="44" cy="40" r="0.8" fill="#C4B5FD" opacity="0.7"/>
  <circle cx="24" cy="44" r="0.6" fill="#E9D5FF" opacity="0.8"/>
</svg>`

async function exportPng(name, svg, width, height) {
  const file = path.join(outDir, name)
  await sharp(Buffer.from(svg))
    .resize(width, height, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(file)
  return file
}

await mkdir(outDir, { recursive: true })
await exportPng('sidus-logo-mark-transparent-1024.png', markSvg, 1024, 1024)
await exportPng('sidus-logo-mark-transparent-512.png', markSvg, 512, 512)
await exportPng('sidus-logo-stacked-transparent-1024.png', stackedSvg, 1024, 860)
await exportPng('sidus-logo-stacked-transparent-512.png', stackedSvg, 512, 430)
await exportPng('sidus-logo-full-transparent-1024.png', fullSvg, 1024, 274)
await exportPng('sidus-logo-icon-transparent-512.png', iconSvg, 512, 512)
await writeFile(path.join(outDir, 'sidus-logo-mark.svg'), markSvg)
await writeFile(path.join(outDir, 'sidus-logo-stacked.svg'), stackedSvg)

console.log('Exported to', outDir)
