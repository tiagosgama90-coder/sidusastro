/**
 * Gerador de PDF do Mapa Astral Completo - Sidus
 * Tropical · Placidus · 5 seccoes profissionais
 */

import { gerarAnaliseCompleta } from '../lib/mapaInterpretacao.js'
import { sidusLogoParaPdf, SIDUS_COPYRIGHT_PT, SIDUS_COPYRIGHT_EN } from '../lib/sidusLogoPdf.js'
import { getPdfLabels } from '../lib/pdfLabels.js'
import {
  wrapPdfText,
  alturaTextoPdf,
  sanitizarTextoPdf,
  escreverLinhasCentradas,
  escreverParagrafoCentrado,
} from '../lib/pdfTextWrap.js'

const ELEMENTO_DO_SIGNO = {
  Carneiro:'Fogo', Leão:'Fogo', Sagitário:'Fogo',
  Touro:'Terra', Virgem:'Terra', Capricórnio:'Terra',
  Gémeos:'Ar', Balança:'Ar', Aquário:'Ar',
  Caranguejo:'Água', Escorpião:'Água', Peixes:'Água',
}

export async function gerarPdfMapaAstral(mapaNatal, dados, planetas = [], analise = null, lang = 'pt', opts = {}) {
  const { mandalaPng } = opts
  const { jsPDF } = await import('jspdf')

  const analiseFinal = analise || gerarAnaliseCompleta(mapaNatal, planetas, [], dados, lang)
  const copyright = lang !== 'pt' ? SIDUS_COPYRIGHT_EN : SIDUS_COPYRIGHT_PT
  const logoData = await sidusLogoParaPdf()
  const labels = getPdfLabels(lang)

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const CX = 105
  const L = 25
  const W = 160
  const TEXT_W = 130
  const PAGE_BOTTOM = 265
  let y = 22

  const DOURADO = [223, 183, 108]
  const BRANCO  = [255, 255, 255]
  const ESCURO  = [11, 7, 30]
  const ROXO    = [28, 16, 58]
  const MUTED   = [160, 140, 200]
  const VERDE   = [52, 211, 153]
  const LARANJA = [251, 146, 60]
  const AZUL    = [147, 197, 253]
  const LILAS   = [129, 140, 248]

  const novaPageSeNecessario = (h = 25) => {
    if (y + h > PAGE_BOTTOM) {
      doc.addPage()
      doc.setFillColor(...ESCURO)
      doc.rect(0, 0, 210, 297, 'F')
      y = 22
    }
  }

  doc.setFillColor(...ESCURO)
  doc.rect(0, 0, 210, 297, 'F')

  doc.setFillColor(...ROXO)
  doc.rect(0, 0, 210, 58, 'F')
  doc.setDrawColor(...DOURADO)
  doc.setLineWidth(0.5)
  doc.line(L, 58, 210 - L, 58)

  if (logoData) {
    doc.addImage(logoData, 'PNG', CX - 7, 7, 14, 14)
  }

  doc.setTextColor(...DOURADO)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(28)
  doc.text(labels.headerTitle, CX, 26, { align: 'center' })

  doc.setFontSize(8)
  doc.setTextColor(...MUTED)
  doc.setFont('helvetica', 'normal')
  doc.text(sanitizarTextoPdf(labels.headerSubtitle), CX, 32, { align: 'center', maxWidth: TEXT_W })
  doc.text(sanitizarTextoPdf(labels.headerTagline), CX, 36, { align: 'center', maxWidth: TEXT_W })

  doc.setFontSize(6.5)
  let hy = 41
  wrapPdfText(doc, copyright, TEXT_W).forEach((line) => {
    doc.text(line, CX, hy, { align: 'center' })
    hy += 3.2
  })

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(...BRANCO)
  doc.text(sanitizarTextoPdf(dados.nome || ''), CX, 50, { align: 'center', maxWidth: TEXT_W })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...MUTED)
  const localDt = [
    formatarData(dados.data),
    dados.hora ? `${labels.atTime} ${dados.hora}` : '',
    dados.cidade ? `- ${dados.cidade}` : '',
  ].filter(Boolean).join(' ')
  doc.text(sanitizarTextoPdf(localDt), CX, 55, { align: 'center', maxWidth: TEXT_W })

  y = 68

  y = secaoTitulo(doc, y, labels.fourPillars, DOURADO, ROXO, L, W, CX, TEXT_W)
  y += 6

  const pilares = [
    { label: labels.labels.sun, valor: mapaNatal?.solar?.nome || '-', grau: mapaNatal?.solar?.graus },
    { label: labels.labels.moon, valor: mapaNatal?.lunar?.nome || '-', grau: mapaNatal?.lunar?.graus },
    { label: labels.labels.asc, valor: mapaNatal?.ascendente?.nome || '-', grau: mapaNatal?.ascendente?.graus },
    { label: labels.labels.desc, valor: mapaNatal?.descendente?.nome || '-', grau: mapaNatal?.descendente?.graus },
    { label: labels.labels.mc, valor: mapaNatal?.mc?.nome || '-', grau: mapaNatal?.mc?.graus },
  ]

  pilares.forEach((p, i) => {
    const col = i % 2
    const boxW = W / 2 - 3
    const x = L + col * (W / 2 + 1)
    if (col === 0 && i > 0) y += 24
    novaPageSeNecessario(22)
    doc.setFillColor(28, 16, 58)
    doc.roundedRect(x, y, boxW, 20, 3, 3, 'F')
    doc.setDrawColor(...DOURADO)
    doc.setLineWidth(0.3)
    doc.roundedRect(x, y, boxW, 20, 3, 3, 'S')
    const boxCx = x + boxW / 2
    doc.setTextColor(...MUTED)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.text(sanitizarTextoPdf(p.label.toUpperCase()), boxCx, y + 7, { align: 'center', maxWidth: boxW - 4 })
    doc.setTextColor(...BRANCO)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text(sanitizarTextoPdf(p.valor), boxCx, y + 14, { align: 'center', maxWidth: boxW - 4 })
    if (p.grau != null) {
      doc.setTextColor(...MUTED)
      doc.setFontSize(7)
      doc.text(`${p.grau}°`, boxCx, y + 18, { align: 'center' })
    }
  })
  y += 28

  for (const sec of analiseFinal.seccoes) {
    novaPageSeNecessario(28)
    y = secaoTitulo(doc, y, `>> ${sec.id}. ${sanitizarTextoPdf(sec.titulo).toUpperCase()}`, DOURADO, ROXO, L, W, CX, TEXT_W)
    y += 6

    for (const bloco of sec.blocos) {
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      const tituloLinhas = wrapPdfText(doc, bloco.subtitulo, TEXT_W)
      const metaLinhas = bloco.meta ? wrapPdfText(doc, bloco.meta, TEXT_W) : []
      const alturaParag = alturaTextoPdf(doc, bloco.texto, TEXT_W)
      novaPageSeNecessario(tituloLinhas.length * 5 + metaLinhas.length * 5 + alturaParag + 12)

      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...DOURADO)
      y = escreverLinhasCentradas(doc, tituloLinhas, CX, y, 5)

      if (bloco.meta) {
        doc.setTextColor(...MUTED)
        doc.setFontSize(8)
        doc.setFont('helvetica', 'normal')
        y = escreverLinhasCentradas(doc, metaLinhas, CX, y, 5)
      }

      y += 2
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...BRANCO)
      y = escreverParagrafoCentrado(doc, bloco.texto, CX, y, TEXT_W, 5)
      y += 4
    }
    y += 4
  }

  novaPageSeNecessario(28)
  y = secaoTitulo(doc, y, labels.positions, DOURADO, ROXO, L, W, CX, TEXT_W)
  y += 6

  if (planetas.length > 0) {
    planetas.forEach((pl, i) => {
      novaPageSeNecessario(16)
      const col = i % 2
      const boxW = W / 2 - 3
      const x = L + col * (W / 2 + 1)
      if (col === 0 && i > 0) y += 14
      const boxCx = x + boxW / 2
      doc.setFillColor(20, 12, 45)
      doc.roundedRect(x, y, boxW, 12, 2, 2, 'F')
      doc.setTextColor(...DOURADO)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'bold')
      doc.text(sanitizarTextoPdf(`${pl.simbolo || ''} ${pl.nome || ''}`.trim()), boxCx, y + 5, { align: 'center', maxWidth: boxW - 4 })
      doc.setTextColor(...BRANCO)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7)
      const signoCasa = sanitizarTextoPdf(`${pl.signo?.nome || '-'}${pl.casa ? ` - C${pl.casa}` : ''}`)
      doc.text(signoCasa, boxCx, y + 9, { align: 'center', maxWidth: boxW - 4 })
    })
    y += 18
  }

  novaPageSeNecessario(55)
  y = secaoTitulo(doc, y, labels.elements, DOURADO, ROXO, L, W, CX, TEXT_W)
  y += 6

  if (planetas.length > 0) {
    const balEl = { Fogo: 0, Terra: 0, Ar: 0, Água: 0 }
    planetas.forEach(p => { const el = ELEMENTO_DO_SIGNO[p.signo?.nome]; if (el) balEl[el]++ })
    const total = planetas.length
    ;[
      { label: labels.fire, key: 'Fogo', cor: LARANJA },
      { label: labels.earth, key: 'Terra', cor: VERDE },
      { label: labels.air, key: 'Ar', cor: AZUL },
      { label: labels.water, key: 'Água', cor: LILAS },
    ].forEach(({ label, key, cor }) => {
      novaPageSeNecessario(16)
      const count = balEl[key] || 0
      const pct = total > 0 ? count / total : 0
      doc.setTextColor(...BRANCO)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.text(sanitizarTextoPdf(`${label}  ${count}/${total}`), CX, y + 4, { align: 'center' })
      const barW = TEXT_W
      const barX = CX - barW / 2
      doc.setFillColor(255, 255, 255, 0.06)
      doc.roundedRect(barX, y + 7, barW, 4, 1, 1, 'F')
      if (pct > 0) {
        doc.setFillColor(...cor)
        doc.roundedRect(barX, y + 7, barW * pct, 4, 1, 1, 'F')
      }
      y += 14
    })
  }

  novaPageSeNecessario(40)
  y = secaoTitulo(doc, y, labels.technical, DOURADO, ROXO, L, W, CX, TEXT_W)
  y += 6

  ;[
    [labels.technicalSystem, labels.technicalSystemVal],
    [labels.technicalUt, mapaNatal?.instanteUTC ? mapaNatal.instanteUTC.replace('T', ' ').slice(0, 16) + ' UTC' : '-'],
    [labels.technicalCoords, mapaNatal?.lat != null ? `${mapaNatal.lat.toFixed(4)}°, ${mapaNatal.lon?.toFixed(4)}°` : '-'],
  ].forEach(([label, valor]) => {
    novaPageSeNecessario(14)
    doc.setTextColor(...MUTED)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text(sanitizarTextoPdf(label), CX, y, { align: 'center', maxWidth: TEXT_W })
    y += 5
    doc.setTextColor(...BRANCO)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    y = escreverParagrafoCentrado(doc, String(valor), CX, y, TEXT_W, 5)
    y += 2
  })

  if (mandalaPng) {
    doc.addPage()
    doc.setFillColor(...ESCURO)
    doc.rect(0, 0, 210, 297, 'F')
    y = 22
    y = secaoTitulo(doc, y, labels.mandala, DOURADO, ROXO, L, W, CX, TEXT_W)
    y += 8
    const { adicionarMandalaAoPdf } = await import('../lib/mandalaPdf.js')
    await adicionarMandalaAoPdf(doc, mandalaPng, { L, W, yStart: y, pageBottom: PAGE_BOTTOM, ESCURO })
  }

  const totalPaginas = doc.getNumberOfPages()
  const dateLocale = lang === 'pt' ? 'pt-PT' : lang === 'en' ? 'en-GB' : `${lang}-${lang.toUpperCase()}`
  for (let i = 1; i <= totalPaginas; i++) {
    doc.setPage(i)
    doc.setFillColor(11, 7, 30)
    doc.rect(0, 287, 210, 10, 'F')
    doc.setDrawColor(...DOURADO)
    doc.setLineWidth(0.2)
    doc.line(L, 287, 210 - L, 287)
    doc.setTextColor(...MUTED)
    doc.setFontSize(6.5)
    doc.setFont('helvetica', 'normal')
    const footerLine = `Sidus Astro - ${sanitizarTextoPdf(dados.nome || '')} - Tropical Placidus - ${new Date().toLocaleDateString(dateLocale)} - ${labels.pageLabel} ${i}/${totalPaginas}`
    doc.text(footerLine, CX, 290, { align: 'center', maxWidth: TEXT_W })
    doc.setFontSize(5.5)
    wrapPdfText(doc, copyright, TEXT_W).forEach((line, idx) => {
      doc.text(line, CX, 293.5 + idx * 2.6, { align: 'center' })
    })
  }

  doc.save(`Sidus_MapaNatal_${(dados.nome || 'perfil').replace(/\s+/g, '_')}.pdf`)
}

function secaoTitulo(doc, y, texto, DOURADO, ROXO, L, W, CX, TEXT_W) {
  doc.setFillColor(...ROXO)
  doc.rect(L, y, W, 10, 'F')
  doc.setDrawColor(...DOURADO)
  doc.setLineWidth(0.3)
  doc.rect(L, y, W, 10, 'S')
  doc.setTextColor(...DOURADO)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  const linhas = wrapPdfText(doc, texto, TEXT_W)
  doc.text(linhas[0] || '', CX, y + 6.5, { align: 'center' })
  return y + 12
}

function formatarData(iso) {
  if (!iso) return '-'
  const [a, m, d] = iso.split('-')
  return `${d}/${m}/${a}`
}
