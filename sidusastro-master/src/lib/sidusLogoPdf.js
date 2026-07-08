/** Converte o logótipo Sidus (SVG) em PNG para jsPDF. */
const SIDUS_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 32 32" fill="none">
  <path d="M16 5.5 18.2 13.8 26.5 16 18.2 18.2 16 26.5 13.8 18.2 5.5 16 13.8 13.8 16 5.5Z" stroke="#DFB76C" stroke-width="1.35" stroke-linejoin="round"/>
  <circle cx="11.5" cy="21.5" r="1.15" fill="#DFB76C"/>
  <path d="M22.5 10.5h1.6M23.3 9.7v3.6" stroke="#DFB76C" stroke-width="1.1" stroke-linecap="round"/>
</svg>`

let logoCache = null

export async function sidusLogoParaPdf() {
  if (logoCache) return logoCache
  if (typeof document === 'undefined') return null

  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(new Blob([SIDUS_LOGO_SVG], { type: 'image/svg+xml;charset=utf-8' }))
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = 128
        canvas.height = 128
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, 128, 128)
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
