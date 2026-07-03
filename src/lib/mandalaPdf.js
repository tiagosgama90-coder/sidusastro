/** Captura a mandala completa (roda + grelha + tabela) visivel no DOM para jsPDF. */
export async function capturarMandalaParaPdf(selector = '[data-sidus-mandala-export]') {
  const el = document.querySelector(selector)
  if (!el) return null

  const scrollX = window.scrollX
  const scrollY = window.scrollY

  try {
    const { default: html2canvas } = await import('html2canvas')
    const canvas = await html2canvas(el, {
      backgroundColor: '#0B071E',
      scale: 2,
      useCORS: true,
      logging: false,
      width: el.scrollWidth,
      height: el.scrollHeight,
      windowWidth: el.scrollWidth,
      windowHeight: el.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
    })
    return canvas.toDataURL('image/png')
  } catch (e) {
    console.warn('[Sidus] Mandala PDF capture:', e?.message)
    return null
  } finally {
    requestAnimationFrame(() => {
      window.scrollTo(scrollX, scrollY)
    })
  }
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/** Insere imagem alta no jsPDF, repartindo por paginas se necessario (sem cortar). */
export async function adicionarMandalaAoPdf(doc, mandalaPng, { L, W, yStart, pageBottom = 275, ESCURO = [11, 7, 30] }) {
  if (!mandalaPng || typeof mandalaPng !== 'string' || !mandalaPng.startsWith('data:image')) {
    return
  }

  let props
  try {
    props = doc.getImageProperties(mandalaPng)
  } catch (e) {
    console.warn('[Sidus] Mandala PDF props:', e?.message)
    return
  }
  if (!props?.width || !props?.height) return

  const imgW = W
  const imgH = (props.height / props.width) * imgW
  if (!Number.isFinite(imgH) || imgH <= 0) return

  let img
  try {
    img = await loadImage(mandalaPng)
  } catch (e) {
    console.warn('[Sidus] Mandala PDF load:', e?.message)
    return
  }
  if (!img?.naturalWidth || !img?.naturalHeight) return
  const fullCanvas = document.createElement('canvas')
  fullCanvas.width = img.naturalWidth
  fullCanvas.height = img.naturalHeight
  fullCanvas.getContext('2d').drawImage(img, 0, 0)

  let srcY = 0
  let y = yStart

  while (srcY < fullCanvas.height - 0.5) {
    let availMm = pageBottom - y
    if (availMm < 12) {
      doc.addPage()
      doc.setFillColor(...ESCURO)
      doc.rect(0, 0, 210, 297, 'F')
      y = 20
      availMm = pageBottom - y
    }

    const remainingPx = fullCanvas.height - srcY
    const remainingMm = (remainingPx / fullCanvas.width) * imgW
    const sliceMm = Math.min(availMm, remainingMm)
    const slicePx = (sliceMm / imgH) * fullCanvas.height
    if (!Number.isFinite(slicePx) || slicePx < 1) break

    const sliceCanvas = document.createElement('canvas')
    sliceCanvas.width = fullCanvas.width
    sliceCanvas.height = Math.ceil(slicePx)
    sliceCanvas.getContext('2d').drawImage(
      fullCanvas,
      0, srcY, fullCanvas.width, slicePx,
      0, 0, fullCanvas.width, slicePx,
    )

    doc.addImage(sliceCanvas.toDataURL('image/png'), 'PNG', L, y, imgW, sliceMm)
    srcY += slicePx
    y += sliceMm

    if (srcY < fullCanvas.height - 0.5) {
      doc.addPage()
      doc.setFillColor(...ESCURO)
      doc.rect(0, 0, 210, 297, 'F')
      y = 20
    }
  }
}
