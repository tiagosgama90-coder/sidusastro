/**
 * Gerador de PDF do Mapa Astral Completo — Sidus
 * Usa jsPDF para criar um documento A4 com design cósmico.
 */

const ELEMENTO_DO_SIGNO = {
  Carneiro:'Fogo', Leão:'Fogo', Sagitário:'Fogo',
  Touro:'Terra', Virgem:'Terra', Capricórnio:'Terra',
  Gémeos:'Ar', Balança:'Ar', Aquário:'Ar',
  Caranguejo:'Água', Escorpião:'Água', Peixes:'Água',
}

const INTERP_SOL = {
  Áries:'Com o Sol em Áries, és uma alma pioneira e corajosa. Nasceste com uma missão de iniciar, de abrir caminho onde antes não havia nenhum. A tua autenticidade é a tua maior força.',
  Touro:'O Sol em Touro confere-te uma natureza sólida e conectada aos prazeres da vida. Valorizas a estabilidade e a beleza, e tens um talento natural para construir coisas que durem.',
  Gémeos:'Com o Sol em Gémeos, a tua mente é o teu instrumento mais poderoso. A comunicação é o teu dom. Tens uma curiosidade insaciável e uma capacidade única de ver múltiplas perspectivas.',
  Caranguejo:'O Sol em Caranguejo faz de ti uma alma profundamente intuitiva. A família e o lar são o teu universo. A tua missão é criar espaços de segurança emocional para quem amas.',
  Leão:'O Sol em Leão dá-te uma presença luminosa e magnética. Tens um coração generoso e uma criatividade que precisa de se expressar. Nasceste para liderar e inspirar.',
  Virgem:'Com o Sol em Virgem, tens uma mente analítica e um senso de serviço notável. A tua missão é trazer ordem ao caos — mas lembra-te: a perfeição é inimiga do bem.',
  Balança:'O Sol em Balança confere-te um dom natural para a harmonia e a justiça. Tens a capacidade rara de ver todas as perspectivas. A tua missão é construir pontes entre mundos opostos.',
  Escorpião:'Com o Sol em Escorpião, a tua profundidade é incomum. Não te contentas com o superficial. Cada fim na tua vida é o prenúncio de um renascimento mais poderoso.',
  Sagitário:'O Sol em Sagitário acende em ti uma chama de liberdade e busca de verdade. Tens a missão de expandir horizontes, teus e dos outros, através da experiência directa da vida.',
  Capricórnio:'Com o Sol em Capricórnio, trazes a força da montanha: lenta mas inesgotável. O sucesso material é apenas uma expressão do teu domínio interior — construído tijolo a tijolo.',
  Aquário:'O Sol em Aquário faz de ti um visionário e agente de mudança. A tua missão é criar o amanhã que o mundo ainda não sabe que precisa.',
  Peixes:'Com o Sol em Peixes, a tua alma é uma porta aberta ao invisível. A tua criatividade e espiritualidade são dons raros. A tua missão é ser uma ponte entre o mundo dos sonhos e o dos homens.',
}

const INTERP_ASC = {
  Áries:'Com Ascendente em Áries, a tua presença é enérgica, directa e impossível de ignorar. Tens uma abordagem pioneira à vida — enfrentas desafios de frente, sem hesitar.',
  Touro:'O Ascendente em Touro dá-te uma presença sólida e de confiança. Tens um charme natural e um estilo que reflecte elegância sem esforço.',
  Gémeos:'Com Ascendente em Gémeos, és percebido como alguém vivaz, curioso e comunicativo. A tua mente rápida e o teu humor tornam-te magnético nas interacções sociais.',
  Caranguejo:'O Ascendente em Caranguejo confere-te uma presença calorosa e acolhedora. Tens uma capacidade instintiva de perceber as necessidades emocionais dos outros.',
  Leão:'Com Ascendente em Leão, entras numa sala e ela sente a tua presença. Tens um porte natural de liderança e uma generosidade que inspira.',
  Virgem:'O Ascendente em Virgem projecta uma imagem de competência, atenção ao detalhe e humildade genuína. És visto como alguém prático e de confiança.',
  Balança:'Com Ascendente em Balança, a tua presença é harmoniosa e refinada. És percebido como justo, charmoso e diplomaticamente hábil.',
  Escorpião:'O Ascendente em Escorpião confere-te uma presença intensa e magnética. Há algo nos teus olhos que as pessoas sentem mas não conseguem definir.',
  Sagitário:'Com Ascendente em Sagitário, irradias entusiasmo e optimismo. És visto como aventureiro, filosófico e inspirador.',
  Capricórnio:'O Ascendente em Capricórnio projecta autoridade e seriedade. A tua fiabilidade e determinação ganham respeito profundo ao longo do tempo.',
  Aquário:'Com Ascendente em Aquário, és visto como singular, progressista e ligeiramente enigmático. Atrais quem busca perspectivas novas.',
  Peixes:'O Ascendente em Peixes confere-te uma presença etérea e compassiva. Há uma suavidade na tua forma de te mover no mundo que as pessoas encontram profundamente reconfortante.',
}

export async function gerarPdfMapaAstral(mapaNatal, dados, planetas = []) {
  const { jsPDF } = await import('jspdf')

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const L = 18   // margem esquerda
  const W = 174  // largura útil
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
  const ROSA    = [244, 114, 182]
  const AMARELO = [251, 191, 36]

  const novaPageSeNecessario = (h = 20) => {
    if (y + h > 275) {
      doc.addPage()
      doc.setFillColor(...ESCURO)
      doc.rect(0, 0, 210, 297, 'F')
      y = 20
    }
  }

  // ── Fundo ──
  doc.setFillColor(...ESCURO)
  doc.rect(0, 0, 210, 297, 'F')

  // ── Cabeçalho ──
  doc.setFillColor(...ROXO)
  doc.rect(0, 0, 210, 50, 'F')
  // linha dourada decorativa
  doc.setDrawColor(...DOURADO)
  doc.setLineWidth(0.5)
  doc.line(L, 50, 210 - L, 50)

  doc.setTextColor(...DOURADO)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(30)
  doc.text('SIDUS', 105, 18, { align: 'center' })

  doc.setFontSize(9)
  doc.setTextColor(...MUTED)
  doc.setFont('helvetica', 'normal')
  doc.text('MAPA ASTRAL NATAL COMPLETO', 105, 26, { align: 'center' })

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(...BRANCO)
  doc.text(dados.nome || '', 105, 35, { align: 'center' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...MUTED)
  const localDt = [formatarData(dados.data), dados.hora ? `às ${dados.hora}` : '', dados.cidade ? `· ${dados.cidade}` : ''].filter(Boolean).join(' ')
  doc.text(localDt, 105, 42, { align: 'center' })

  doc.setFontSize(7)
  doc.text(`Motor: ${mapaNatal?.motor || 'astronomy-engine'}`, 105, 48, { align: 'center' })

  y = 60

  // ── Secção: 4 Pilares ──
  secaoTitulo(doc, y, '✦ QUATRO PILARES FUNDAMENTAIS', DOURADO, ROXO, L, W)
  y += 12

  const pilares = [
    { icon: '☀', label: 'Signo Solar',   valor: mapaNatal?.solar?.nome || '—',      grau: mapaNatal?.solar?.grau },
    { icon: '☽', label: 'Signo Lunar',   valor: mapaNatal?.lunar?.nome || '—',      grau: mapaNatal?.lunar?.grau },
    { icon: '↑', label: 'Ascendente',    valor: mapaNatal?.ascendente?.nome || '—', grau: mapaNatal?.ascendente?.grau },
    { icon: '⊕', label: 'Meio do Céu',  valor: mapaNatal?.mc?.nome || '—',         grau: mapaNatal?.mc?.grau },
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
      doc.setFont('helvetica', 'normal')
      doc.text(`${Number(p.grau).toFixed(1)}°`, x + W / 2 - 16, y + 14)
    }
  })
  y += 28

  // ── Secção: Posições Planetárias ──
  novaPageSeNecessario(10)
  secaoTitulo(doc, y, '✦ POSIÇÕES PLANETÁRIAS AO NASCIMENTO', DOURADO, ROXO, L, W)
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
      doc.setFontSize(8)
      doc.text(pl.signo?.nome || '—', x + 30, y + 7)

      doc.setTextColor(...MUTED)
      doc.setFontSize(7)
      const lon = `${(pl.longitude ?? 0).toFixed(1)}°${pl.retrograde ? ' ℞' : ''}`
      doc.text(lon, x + W / 2 - 22, y + 7)
    })
    y += 18
  } else {
    doc.setTextColor(...MUTED)
    doc.setFontSize(9)
    doc.text('(Dados planetários não disponíveis)', L + 4, y + 6)
    y += 12
  }

  // ── Secção: Equilíbrio de Elementos ──
  novaPageSeNecessario(50)
  secaoTitulo(doc, y, '✦ EQUILÍBRIO DE ELEMENTOS E MODALIDADES', DOURADO, ROXO, L, W)
  y += 12

  if (planetas.length > 0) {
    const balEl = { Fogo: 0, Terra: 0, Ar: 0, Água: 0 }
    planetas.forEach(p => { const el = ELEMENTO_DO_SIGNO[p.signo?.nome]; if (el) balEl[el]++ })
    const total = planetas.length

    const elementes = [
      { label: 'Fogo', cor: LARANJA, desc: 'Acção, entusiasmo, criatividade' },
      { label: 'Terra', cor: VERDE, desc: 'Estabilidade, praticidade, perseverança' },
      { label: 'Ar', cor: AZUL, desc: 'Intelecto, comunicação, adaptação' },
      { label: 'Água', cor: LILAS, desc: 'Emoção, intuição, profundidade' },
    ]

    elementes.forEach(({ label, cor, desc }) => {
      novaPageSeNecessario(12)
      const count = balEl[label] || 0
      const pct = total > 0 ? count / total : 0
      doc.setTextColor(...BRANCO)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'bold')
      doc.text(`${label}`, L + 2, y + 5)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...MUTED)
      doc.setFontSize(7)
      doc.text(`${desc}`, L + 20, y + 5)
      doc.setTextColor(...cor)
      doc.setFontSize(8)
      doc.text(`${count}/${total}`, 210 - L - 10, y + 5)
      // barra de progresso
      doc.setFillColor(255, 255, 255, 0.06)
      doc.roundedRect(L + 2, y + 7, W - 4, 3, 1, 1, 'F')
      if (pct > 0) {
        doc.setFillColor(...cor)
        doc.roundedRect(L + 2, y + 7, (W - 4) * pct, 3, 1, 1, 'F')
      }
      y += 13
    })
  } else {
    doc.setTextColor(...MUTED)
    doc.setFontSize(9)
    doc.text('(Calcule os planetas de nascimento para ver o equilíbrio)', L + 4, y + 6)
    y += 12
  }

  // ── Secção: Interpretação do Sol ──
  novaPageSeNecessario(25)
  secaoTitulo(doc, y, '✦ INTERPRETAÇÃO DO SIGNO SOLAR', DOURADO, ROXO, L, W)
  y += 10

  const interpSol = INTERP_SOL[mapaNatal?.solar?.nome] || `O Signo Solar ${mapaNatal?.solar?.nome || ''} confere uma identidade única e valiosa.`
  const linhasS = doc.splitTextToSize(interpSol, W - 4)
  doc.setTextColor(...BRANCO)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  linhasS.forEach(l => { novaPageSeNecessario(7); doc.text(l, L + 2, y); y += 5 })
  y += 6

  // ── Secção: Interpretação do Ascendente ──
  novaPageSeNecessario(25)
  secaoTitulo(doc, y, '✦ INTERPRETAÇÃO DO ASCENDENTE', DOURADO, ROXO, L, W)
  y += 10

  const interpAsc = INTERP_ASC[mapaNatal?.ascendente?.nome] || `O Ascendente em ${mapaNatal?.ascendente?.nome || ''} define a máscara que mostras ao mundo.`
  const linhasA = doc.splitTextToSize(interpAsc, W - 4)
  doc.setTextColor(...BRANCO)
  doc.setFontSize(9)
  linhasA.forEach(l => { novaPageSeNecessario(7); doc.text(l, L + 2, y); y += 5 })
  y += 6

  // ── Secção: Áreas da Vida ──
  novaPageSeNecessario(50)
  secaoTitulo(doc, y, '✦ ÁREAS DA VIDA', DOURADO, ROXO, L, W)
  y += 12

  const areas = [
    {
      area: 'Amor & Relacionamentos',
      cor: ROSA,
      planetas: planetas.filter(p => ['Vénus', 'Lua'].includes(p.nome)),
    },
    {
      area: 'Carreira & Propósito',
      cor: AMARELO,
      planetas: planetas.filter(p => ['Sol', 'Saturno', 'Marte'].includes(p.nome)),
    },
    {
      area: 'Espiritualidade & Alma',
      cor: LILAS,
      planetas: planetas.filter(p => ['Neptuno', 'Plutão', 'Lua'].includes(p.nome)),
    },
  ]

  areas.forEach(({ area, cor, planetas: ps }) => {
    novaPageSeNecessario(16)
    doc.setFillColor(20, 12, 45)
    doc.roundedRect(L, y, W, 14, 3, 3, 'F')
    doc.setDrawColor(...cor)
    doc.setLineWidth(0.3)
    doc.roundedRect(L, y, W, 14, 3, 3, 'S')
    doc.setTextColor(...cor)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text(area, L + 6, y + 6)
    doc.setTextColor(...BRANCO)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    const desc = ps.length > 0
      ? ps.map(p => `${p.nome} em ${p.signo?.nome || '—'}`).join(' · ')
      : '—'
    doc.text(desc, L + 6, y + 12)
    y += 18
  })

  // ── Dados técnicos ──
  novaPageSeNecessario(35)
  secaoTitulo(doc, y, '✦ DADOS TÉCNICOS DO CÁLCULO', DOURADO, ROXO, L, W)
  y += 12

  const tecnicos = [
    ['Data e hora UT:', mapaNatal?.instanteUTC ? mapaNatal.instanteUTC.replace('T', ' ').slice(0, 16) + ' UTC' : '—'],
    ['Latitude:', mapaNatal?.lat != null ? `${mapaNatal.lat.toFixed(4)}° N/S` : '—'],
    ['Longitude:', mapaNatal?.lon != null ? `${mapaNatal.lon.toFixed(4)}° E/W` : '—'],
    ['Fuso horário:', typeof mapaNatal?.fuso === 'string' ? mapaNatal.fuso : `UTC${(mapaNatal?.fuso ?? 0) >= 0 ? '+' : ''}${mapaNatal?.fuso ?? 0}`],
    ['Motor de cálculo:', mapaNatal?.motor || 'astronomy-engine'],
  ]

  tecnicos.forEach(([label, valor]) => {
    novaPageSeNecessario(8)
    doc.setTextColor(...MUTED)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text(label, L + 2, y)
    doc.setTextColor(...BRANCO)
    doc.setFont('helvetica', 'bold')
    doc.text(String(valor), L + 50, y)
    y += 7
  })

  // ── Rodapé em todas as páginas ──
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
      `Sidus · Mapa Astral de ${dados.nome || ''}  ·  Gerado em ${new Date().toLocaleDateString('pt-PT')}  ·  Pág. ${i}/${totalPaginas}`,
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
