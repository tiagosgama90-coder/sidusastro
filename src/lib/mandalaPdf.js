/** Converte o SVG da mandala visível no DOM em PNG para jsPDF. */
export async function capturarMandalaParaPdf(selector = '[data-sidus-mandala-chart]') {
  const svg = document.querySelector(selector)
  if (!svg) return null

  const clone = svg.cloneNode(true)
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  const vb = clone.getAttribute('viewBox')?.split(/\s+/).map(Number)
  const w = vb?.[2] || svg.clientWidth || 480
  const h = vb?.[3] || svg.clientHeight || 480
  clone.setAttribute('width', String(w))
  clone.setAttribute('height', String(h))

  const svgStr = new XMLSerializer().serializeToString(clone)
  const url = URL.createObjectURL(new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' }))

  try {
    const img = await new Promise((resolve, reject) => {
      const el = new Image()
      el.onload = () => resolve(el)
      el.onerror = reject
      el.src = url
    })
    const scale = 2
    const canvas = document.createElement('canvas')
    canvas.width = w * scale
    canvas.height = h * scale
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#0B071E'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL('image/png')
  } catch (e) {
    console.warn('[Sidus] Mandala PDF capture:', e?.message)
    return null
  } finally {
    URL.revokeObjectURL(url)
  }
}
