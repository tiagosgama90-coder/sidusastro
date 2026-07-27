/** Converte o logotipo Sidus (constelação S) em PNG para jsPDF. */
const SIDUS_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 64" fill="none">
  <defs>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFF8E7"/>
      <stop offset="45%" stop-color="#DFB76C"/>
      <stop offset="100%" stop-color="#B8944F"/>
    </radialGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F0D08A"/>
      <stop offset="50%" stop-color="#DFB76C"/>
      <stop offset="100%" stop-color="#C9A55A"/>
    </linearGradient>
    <filter id="starGlow" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="2.2" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <path d="M24 10 L36 22 L12 32 L34 44 L14 54" stroke="url(#gold)" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="14" cy="54" r="2.1" fill="url(#gold)"/>
  <circle cx="34" cy="44" r="2.1" fill="url(#gold)"/>
  <circle cx="12" cy="32" r="2.1" fill="url(#gold)"/>
  <circle cx="36" cy="22" r="2.1" fill="url(#gold)"/>
  <circle cx="24" cy="10" r="3.2" fill="url(#glow)" filter="url(#starGlow)"/>
  <circle cx="24" cy="58" r="2" fill="url(#gold)" opacity="0.9"/>
</svg>`

let logoCache = null

async function sidusLogoViaSharp() {
  try {
    const sharp = (await import('sharp')).default
    const buf = await sharp(Buffer.from(SIDUS_LOGO_SVG)).resize(96, 128).png().toBuffer()
    return `data:image/png;base64,${buf.toString('base64')}`
  } catch {
    return null
  }
}

export async function sidusLogoParaPdf() {
  if (logoCache) return logoCache
  if (typeof document === 'undefined') {
    logoCache = await sidusLogoViaSharp()
    return logoCache
  }

  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(new Blob([SIDUS_LOGO_SVG], { type: 'image/svg+xml;charset=utf-8' }))
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = 96
        canvas.height = 128
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, 96, 128)
        ctx.drawImage(img, 0, 0, 96, 128)
        logoCache = canvas.toDataURL('image/png')
        resolve(logoCache)
      } catch {
        resolve(null)
      } finally {
        URL.revokeObjectURL(url)
      }
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(null)
    }
    img.src = url
  })
}

export const SIDUS_COPYRIGHT_PT = '© Sidus Astro · sidusastro.com · Todos os direitos reservados. Proibida reprodução ou distribuição sem autorização escrita.'
export const SIDUS_COPYRIGHT_EN = '© Sidus Astro · sidusastro.com · All rights reserved. Reproduction or distribution without written permission is prohibited.'
