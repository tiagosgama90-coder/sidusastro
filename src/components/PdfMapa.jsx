/**
 * Gerador de PDF do Mapa Astral Completo — Sidus
 * Tropical · Placidus · 5 secções profissionais
 */

import { gerarAnaliseCompleta } from '../lib/mapaInterpretacao.js'

const ELEMENTO_DO_SIGNO = {
  Carneiro:'Fogo', Leão:'Fogo', Sagitário:'Fogo',
  Touro:'Terra', Virgem:'Terra', Capricórnio:'Terra',
  Gémeos:'Ar', Balança:'Ar', Aquário:'Ar',
  Caranguejo:'Água', Escorpião:'Água', Peixes:'Água',
}

export async function gerarPdfMapaAstral(mapaNatal, dados, planetas = [], analise = null) {
  const { jsPDF } = await import('jspdf')

  const analiseFinal = analise || gerarAnaliseCompleta(mapaNatal, planetas, [], dados)

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const L = 18
  const W = 174
  let y = 20

  const DOURADO = [223, 183, 108]
  const BRANCO  = [255, 255, 255]
  const ESCURO  = [11, 7, 30]
  const ROXO    = [28, 16, 58]
  const MUTED   = [160, 140, 200]
  const VERDE   = [52, 211, 153]
  const LARANJA = [251, 146, 60]
  const AZUL    = [147, 197, 253]
  const LILAS   = [129, 140, 248]

  const novaPageSeNecessario = (h = 20) => {
    if (y + h > 275) {
      doc.addPage()
      doc.setFillColor(...ESCURO)
      doc.rect(0, 0, 210, 297, 'F')
      y = 20
    }
  }

  const escreverParagrafo = (texto, indent = 0) => {
    const linhas = doc.splitTextToSize(texto, W - 4 - indent)
    doc.setTextColor(...BRANCO)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    linhas.forEach(l => {
      novaPageSeNecessario(7)
      doc.text(l, L + 2 + indent, y)
      y += 5
    })
    y += 3
  }

  doc.setFillColor(...ESCURO)
  doc.rect(0, 0, 210, 297, 'F')

  doc.setFillColor(...ROXO)
  doc.rect(0, 0, 210, 52, 'F')
  doc.setDrawColor(...DOURADO)
  doc.setLineWidth(0.5)
  doc.line(L, 52, 210 - L, 52)

  doc.setTextColor(...DOURADO)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(30)
  doc.text('SIDUS', 105, 18, { align: 'center' })

  doc.setFontSize(9)
  doc.setTextColor(...MUTED)
  doc.setFont('helvetica', 'normal')
  doc.text('MAPA ASTRAL NATAL COMPLETO', 105, 26, { align: 'center' })
  doc.text('Efemérides · Tropical · Placidus', 105, 31, { align: 'center' })

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(...BRANCO)
  doc.text(dados.nome || '', 105, 40, { align: 'center' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...MUTED)
  const localDt = [formatarData(dados.data), dados.hora ? `às ${dados.hora}` : '', dados.cidade ? `· ${dados.cidade}` : ''].filter(Boolean).join(' ')
  doc.text(localDt, 105, 46, { align: 'center' })
  doc.setFontSize(7)
  doc.text(`${mapaNatal?.motor || 'Swiss Ephemeris'} · ${mapaNatal?.sistema || 'Placidus'}`, 105, 50, { align: 'center' })

  y = 62

  secaoTitulo(doc, y, '✦ QUATRO PILARES FUNDAMENTAIS', DOURADO, ROXO, L, W)
  y += 12

  const pilares = [
    { icon: '☀', label: 'Sol', valor: mapaNatal?.solar?.nome || '—', grau: mapaNatal?.solar?.graus },
    { icon: '☽', label: 'Lua', valor: mapaNatal?.lunar?.nome || '—', grau: mapaNatal?.lunar?.graus },
    { icon: '↑', label: 'Ascendente', valor: mapaNatal?.ascendente?.nome || '—', grau: mapaNatal?.ascendente?.graus },
    { icon: '↓', label: 'Descendente', valor: mapaNatal?.descendente?.nome || '—', grau: mapaNatal?.descendente?.graus },
    { icon: '⊕', label: 'Meio do Céu', valor: mapaNatal?.mc?.nome || '—', grau: mapaNatal?.mc?.graus },
  ]

  pilares.forEach((p, i) => {
    const col = i % 2
    const x = L + col * (W / 2 + 2)
    if (col === 0 && i > 0) y += 22
    doc.setFillColor(28, 16, 58)
    doc.roundedRect(x, y, W / 2 - 2, 18, 3, 3, 'F')
    doc.setDrawColor(...DOURADO)
    doc.setLineWidth(0.3)
    doc.roundedRect(x, y, W / 2 - 2, 18, 3, 3, 'S')
    doc.setTextColor(...DOURADO)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text(p.icon, x + 5, y + 8)
    doc.setTextColor(...MUTED)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.text(p.label.toUpperCase(), x + 13, y + 7)
    doc.setTextColor(...BRANCO)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text(p.valor, x + 13, y + 14)
    if (p.grau != null) {
      doc.setTextColor(...MUTED)
      doc.setFontSize(7)
      doc.text(`${p.grau}°`, x + W / 2 - 16, y + 14)
    }
  })
  y += 28

  // ── 5 Secções de interpretação ──
  for (const sec of analiseFinal.seccoes) {
    novaPageSeNecessario(20)
    secaoTitulo(doc, y, `✦ ${sec.id}. ${sec.titulo.toUpperCase()}`, DOURADO, ROXO, L, W)
    y += 12

    for (const bloco of sec.blocos) {
      novaPageSeNecessario(15)
      doc.setTextColor(...DOURADO)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      const tituloLinhas = doc.splitTextToSize(bloco.subtitulo, W - 4)
      tituloLinhas.forEach(l => { doc.text(l, L + 2, y); y += 5 })
      if (bloco.meta) {
        doc.setTextColor(...MUTED)
        doc.setFontSize(7)
        doc.setFont('helvetica', 'normal')
        doc.text(bloco.meta, L + 2, y)
        y += 5
      }
      y += 2
      escreverParagrafo(bloco.texto, bloco.destaque ? 2 : 0)
      y += 2
    }
    y += 4
  }

  // ── Posições planetárias ──
  novaPageSeNecessario(20)
  secaoTitulo(doc, y, '✦ POSIÇÕES PLANETÁRIAS · PLACIDUS', DOURADO, ROXO, L, W)
  y += 12

  if (planetas.length > 0) {
    planetas.forEach((pl, i) => {
      novaPageSeNecessario(12)
      const col = i % 2
      const x = L + col * (W / 2 + 2)
      if (col === 0 && i > 0) y += 11
      doc.setFillColor(20, 12, 45)
      doc.roundedRect(x, y, W / 2 - 2, 10, 2, 2, 'F')
      doc.setTextColor(...DOURADO)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'bold')
      doc.text(`${pl.simbolo || ''} ${pl.nome || ''}`, x + 4, y + 7)
      doc.setTextColor(...BRANCO)
      doc.setFont('helvetica', 'normal')
      const signoCasa = `${pl.signo?.nome || '—'}${pl.casa ? ` · C${pl.casa}` : ''}`
      doc.text(signoCasa, x + 28, y + 7)
      doc.setTextColor(...MUTED)
      doc.setFontSize(7)
      doc.text(`${(pl.longitude ?? 0).toFixed(1)}°${pl.retrograde ? ' ℞' : ''}`, x + W / 2 - 22, y + 7)
    })
    y += 18
  }

  // ── Elementos ──
  novaPageSeNecessario(50)
  secaoTitulo(doc, y, '✦ EQUILÍBRIO DE ELEMENTOS', DOURADO, ROXO, L, W)
  y += 12

  if (planetas.length > 0) {
    const balEl = { Fogo: 0, Terra: 0, Ar: 0, Água: 0 }
    planetas.forEach(p => { const el = ELEMENTO_DO_SIGNO[p.signo?.nome]; if (el) balEl[el]++ })
    const total = planetas.length
    ;[
      { label: 'Fogo', cor: LARANJA },
      { label: 'Terra', cor: VERDE },
      { label: 'Ar', cor: AZUL },
      { label: 'Água', cor: LILAS },
    ].forEach(({ label, cor }) => {
      novaPageSeNecessario(12)
      const count = balEl[label] || 0
      const pct = total > 0 ? count / total : 0
      doc.setTextColor(...BRANCO)
      doc.setFontSize(8)
      doc.text(`${label}  ${count}/${total}`, L + 2, y + 5)
      doc.setFillColor(255, 255, 255, 0.06)
      doc.roundedRect(L + 2, y + 7, W - 4, 3, 1, 1, 'F')
      if (pct > 0) {
        doc.setFillColor(...cor)
        doc.roundedRect(L + 2, y + 7, (W - 4) * pct, 3, 1, 1, 'F')
      }
      y += 13
    })
  }

  novaPageSeNecessario(35)
  secaoTitulo(doc, y, '✦ DADOS TÉCNICOS', DOURADO, ROXO, L, W)
  y += 12

  ;[
    ['Sistema:', mapaNatal?.sistema || 'Tropical · Placidus'],
    ['Data UT:', mapaNatal?.instanteUTC ? mapaNatal.instanteUTC.replace('T', ' ').slice(0, 16) + ' UTC' : '—'],
    ['Coordenadas:', mapaNatal?.lat != null ? `${mapaNatal.lat.toFixed(4)}°, ${mapaNatal.lon?.toFixed(4)}°` : '—'],
    ['Motor:', mapaNatal?.motor || 'astronomy-engine'],
  ].forEach(([label, valor]) => {
    novaPageSeNecessario(8)
    doc.setTextColor(...MUTED)
    doc.setFontSize(8)
    doc.text(label, L + 2, y)
    doc.setTextColor(...BRANCO)
    doc.setFont('helvetica', 'bold')
    doc.text(String(valor), L + 42, y)
    y += 7
  })

  const totalPaginas = doc.getNumberOfPages()
  for (let i = 1; i <= totalPaginas; i++) {
    doc.setPage(i)
    doc.setFillColor(11, 7, 30)
    doc.rect(0, 287, 210, 10, 'F')
    doc.setDrawColor(...DOURADO)
    doc.setLineWidth(0.2)
    doc.line(L, 287, 210 - L, 287)
    doc.setTextColor(...MUTED)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.text(
      `Sidus · Mapa Astral de ${dados.nome || ''} · Tropical Placidus · ${new Date().toLocaleDateString('pt-PT')} · Pág. ${i}/${totalPaginas}`,
      105, 292, { align: 'center' }
    )
  }

  doc.save(`Sidus_MapaNatal_${(dados.nome || 'perfil').replace(/\s+/g, '_')}.pdf`)
}

function secaoTitulo(doc, y, texto, DOURADO, ROXO, L, W) {
  doc.setFillColor(...ROXO)
  doc.rect(L, y, W, 8, 'F')
  doc.setDrawColor(...DOURADO)
  doc.setLineWidth(0.2)
  doc.rect(L, y, W, 8, 'S')
  doc.setTextColor(...DOURADO)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text(texto, L + 4, y + 5.5)
}

function formatarData(iso) {
  if (!iso) return '—'
  const [a, m, d] = iso.split('-')
  return `${d}/${m}/${a}`
}
