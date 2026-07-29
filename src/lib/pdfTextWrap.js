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
    .replace(/\s+/g, ' ')
    .trim()
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

/** Desenha uma linha com espacamento extra entre palavras ate preencher maxWidth. */
export function desenharLinhaJustificada(doc, linha, x, y, maxWidthMm, ultimaLinha = false) {
  const texto = sanitizarTextoPdf(linha)
  if (!texto) return

  if (ultimaLinha) {
    doc.text(texto, x, y, { align: 'left', maxWidth: maxWidthMm })
    return
  }

  const words = texto.split(/\s+/).filter(Boolean)
  if (words.length <= 1) {
    doc.text(texto, x, y, { align: 'left' })
    return
  }

  const wordWidths = words.map((w) => doc.getTextWidth(w))
  const totalWordsWidth = wordWidths.reduce((a, b) => a + b, 0)
  const spaceWidth = doc.getTextWidth(' ')
  const gaps = words.length - 1
  const naturalWidth = totalWordsWidth + gaps * spaceWidth
  const extra = maxWidthMm - naturalWidth

  if (extra <= 0.4) {
    doc.text(texto, x, y, { align: 'left', maxWidth: maxWidthMm })
    return
  }

  const extraPerGap = extra / gaps
  let cx = x
  words.forEach((word, i) => {
    doc.text(word, cx, y)
    cx += wordWidths[i]
    if (i < gaps) cx += spaceWidth + extraPerGap
  })
}

/**
 * Desenha linhas com justificacao real (ultima linha de cada bloco a esquerda).
 * @param {boolean} justificar - false para titulos (sempre a esquerda)
 */
export function escreverLinhasJustificadas(
  doc,
  linhas,
  x,
  maxWidthMm,
  yRef,
  pageBottom,
  lineHeight,
  onNewPage,
  justificar = true,
) {
  let y = yRef.value
  const validas = (linhas || []).filter((l) => l != null && String(l).trim().length > 0)
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
    if (justificar && !ultima) {
      desenharLinhaJustificada(doc, linha, x, y, maxWidthMm, false)
    } else {
      doc.text(String(linha), x, y, { align: 'left', maxWidth: maxWidthMm })
    }
    y += lineHeight
  })

  yRef.value = y
  return y
}

/** Quebra e desenha paragrafo justificado. */
export function escreverParagrafoJustificado(doc, texto, x, maxWidthMm, yRef, pageBottom, lineHeight, onNewPage) {
  const linhas = wrapPdfText(doc, texto, maxWidthMm)
  let y = yRef.value

  linhas.forEach((linha, idx) => {
    if (y + lineHeight > pageBottom) {
      onNewPage()
      y = yRef.value
    }
    const ultima = idx === linhas.length - 1
    desenharLinhaJustificada(doc, linha, x, y, maxWidthMm, ultima)
    y += lineHeight
  })

  yRef.value = y + 3
  return yRef.value
}

/** Titulo de seccao - alinhado a esquerda dentro da barra, com quebra se necessario. */
export function alturaTituloSecao(doc, texto, maxWidthMm, alturaLinha = 4.2) {
  const linhas = wrapPdfText(doc, texto, maxWidthMm - 4)
  return Math.max(9, 5 + linhas.length * alturaLinha + 2)
}

export function desenharTituloSecao(doc, y, texto, cores, L, W, textX, textW) {
  const { DOURADO, ROXO } = cores
  const linhas = wrapPdfText(doc, texto, textW - 4)
  const barH = Math.max(9, 5 + linhas.length * 4.2 + 2)

  doc.setFillColor(...ROXO)
  doc.rect(L, y, W, barH, 'F')
  doc.setDrawColor(...DOURADO)
  doc.setLineWidth(0.3)
  doc.rect(L, y, W, barH, 'S')
  doc.setTextColor(...DOURADO)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')

  let ty = y + 5.5
  linhas.forEach((linha) => {
    doc.text(linha, textX + 2, ty, { align: 'left', maxWidth: textW - 4 })
    ty += 4.2
  })

  return y + barH + 2
}
