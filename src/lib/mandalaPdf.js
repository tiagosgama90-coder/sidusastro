/** Captura a mandala completa (roda + grelha + tabela) visível no DOM para jsPDF. */
export async function capturarMandalaParaPdf(selector = '[data-sidus-mandala-export]') {
  const el = document.querySelector(selector)
  if (!el) return null

  el.scrollIntoView({ block: 'start' })
  await new Promise((r) => setTimeout(r, 200))

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
    })
    return canvas.toDataURL('image/png')
  } catch (e) {
    console.warn('[Sidus] Mandala PDF capture:', e?.message)
    return null
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

/** Insere imagem alta no jsPDF, repartindo por páginas se necessário (sem cortar). */
export async function adicionarMandalaAoPdf(doc, mandalaPng, { L, W, yStart, pageBottom = 275, ESCURO = [11, 7, 30] }) {
  const props = doc.getImageProperties(mandalaPng)
  const imgW = W
  const imgH = (props.height / props.width) * imgW

  const img = await loadImage(mandalaPng)
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
