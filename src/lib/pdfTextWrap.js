/** Margem simetrica: quebra na largura util exacta (justificado ate a margem direita). */
const UNICODE_SAFE_FACTOR = 1

/** Remove simbolos que o Helvetica do jsPDF nao renderiza bem. */
export function sanitizarTextoPdf(texto) {
  return String(texto ?? '')
    .replace(/\u2726/g, '>>')
    .replace(/[🔥🌍💨💧⚡🏔🌊❤💼🔮📄✉⏳✓💳]/g, '')
    .replace(/℞/g, 'R')
    .replace(/\u00A0/g, ' ')
    .replace(/[\u2013\u2014]/g, '-')
}

/** Quebra texto para caber na largura util (mm). */
export function wrapPdfText(doc, texto, maxWidthMm) {
  const text = sanitizarTextoPdf(texto)
  if (!text) return ['']
  const safeWidth = Math.max(30, maxWidthMm * UNICODE_SAFE_FACTOR)
  return doc.splitTextToSize(text, safeWidth)
}

export function alturaTextoPdf(doc, texto, maxWidthMm, alturaLinha = 4.8) {
  return wrapPdfText(doc, texto, maxWidthMm).length * alturaLinha + 3
}

/** Desenha linhas justificadas (ultima linha de cada bloco alinhada a esquerda). */
export function escreverLinhasJustificadas(doc, linhas, x, maxWidthMm, yRef, pageBottom, lineHeight, onNewPage) {
  let y = yRef.value
  const validas = (linhas || []).filter((l) => l != null && String(l).length > 0)
  if (validas.length === 0) {
    yRef.value = y
    return y
  }
  validas.forEach((linha, idx) => {
    if (y + lineHeight > pageBottom) {
      onNewPage()
      y = yRef.value
    }
    const ultima = idx === validas.length - 1
    const texto = String(linha)
    try {
      doc.text(texto, x, y, {
        align: ultima ? 'left' : 'justify',
        maxWidth: maxWidthMm,
      })
    } catch {
      doc.text(texto, x, y, { align: 'left', maxWidth: maxWidthMm })
    }
    y += lineHeight
  })
  yRef.value = y
  return y
}

/** Quebra e desenha paragrafo justificado. */
export function escreverParagrafoJustificado(doc, texto, x, maxWidthMm, yRef, pageBottom, lineHeight, onNewPage) {
  const linhas = wrapPdfText(doc, texto, maxWidthMm)
  escreverLinhasJustificadas(doc, linhas, x, maxWidthMm, yRef, pageBottom, lineHeight, onNewPage)
  yRef.value += 3
  return yRef.value
}
