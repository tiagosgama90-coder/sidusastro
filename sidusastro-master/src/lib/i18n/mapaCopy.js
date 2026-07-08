/**
 * Textos de interpretação do mapa natal - 6 idiomas.
 */
import { translateSigno } from './astro.js'
import { getMapaStatic } from './packs/mapaStatic.js'
import { contentForLang } from './langUtil.js'
import {
  buildParagrafoSol, buildParagrafoLua, buildParagrafoAsc, buildDinamicaBig3,
  buildParagrafoMerc, buildParagrafoVen, buildParagrafoMar, buildParagrafoJup, buildParagrafoSat,
  buildParagrafoMC, buildParagrafoGeracional, buildResumoGratuito, buildSinteseAspectoTenso, buildConselhoFinal,
} from './packs/mapaParagraphs.js'

const TEMAS_CASA_PT = {
  1:  { nome: 'Identidade e Aparência',       foco: 'quem és, o corpo, a primeira impressão e a forma como inicias a vida' },
  2:  { nome: 'Recursos e Valores',         foco: 'dinheiro, talentos, autoestima material e o que valorizas' },
  3:  { nome: 'Comunicação e Aprendizagem', foco: 'mente concreta, irmãos, vizinhança, escrita e estudos iniciais' },
  4:  { nome: 'Raízes e Lar',               foco: 'família, ancestralidade, intimidade emocional e fundações internas' },
  5:  { nome: 'Criatividade e Prazer',      foco: 'expressão artística, romance, filhos, risco e alegria de viver' },
  6:  { nome: 'Rotina e Serviço',           foco: 'trabalho quotidiano, saúde, hábitos e refinamento pessoal' },
  7:  { nome: 'Relacionamentos',            foco: 'parcerias, casamento, contratos e o espelho do outro' },
  8:  { nome: 'Transformação Profunda',     foco: 'intimidade, crises, heranças, poder partilhado e renascimento' },
  9:  { nome: 'Expansão e Filosofia',       foco: 'viagens longas, ensino superior, fé, visão de mundo e sentido' },
  10: { nome: 'Carreira e Legado Público',  foco: 'vocação, reputação, autoridade e a marca que deixas no mundo' },
  11: { nome: 'Comunidade e Futuro',        foco: 'amizades, causas colectivas, esperança e projectos a longo prazo' },
  12: { nome: 'Inconsciente e Espiritualidade', foco: 'sonhos, retiro, karma, compaixão e o que opera nos bastidores' },
}

const TEMAS_CASA_EN = {
  1:  { nome: 'Identity & Appearance',       foco: 'who you are, the body, first impression and how you begin life' },
  2:  { nome: 'Resources & Values',          foco: 'money, talents, material self-worth and what you value' },
  3:  { nome: 'Communication & Learning',    foco: 'concrete mind, siblings, neighbourhood, writing and early studies' },
  4:  { nome: 'Roots & Home',                foco: 'family, ancestry, emotional intimacy and inner foundations' },
  5:  { nome: 'Creativity & Pleasure',       foco: 'artistic expression, romance, children, risk and joy of living' },
  6:  { nome: 'Routine & Service',           foco: 'daily work, health, habits and personal refinement' },
  7:  { nome: 'Relationships',               foco: 'partnerships, marriage, contracts and the mirror of the other' },
  8:  { nome: 'Deep Transformation',         foco: 'intimacy, crises, inheritances, shared power and rebirth' },
  9:  { nome: 'Expansion & Philosophy',      foco: 'long journeys, higher education, faith, worldview and meaning' },
  10: { nome: 'Career & Public Legacy',      foco: 'vocation, reputation, authority and the mark you leave on the world' },
  11: { nome: 'Community & Future',          foco: 'friendships, collective causes, hope and long-term projects' },
  12: { nome: 'Unconscious & Spirituality',  foco: 'dreams, retreat, karma, compassion and what operates behind the scenes' },
}

const ESSENCIA_PT = {
  Carneiro: 'iniciativa corajosa, autonomia e impulso de abrir caminho',
  Touro: 'estabilidade sensorial, persistência e construção de valor duradouro',
  Gémeos: 'curiosidade mental, adaptabilidade e diálogo como via de crescimento',
  Caranguejo: 'profundidade emocional, protecção e memória afectiva',
  Leão: 'criatividade radiante, generosidade e necessidade de expressão autêntica',
  Virgem: 'discernimento, serviço consciente e refinamento do quotidiano',
  Balança: 'diplomacia, senso de justiça e crescimento através da relação',
  Escorpião: 'intensidade transformadora, coragem psíquica e renascimento',
  Sagitário: 'expansão filosófica, optimismo visionário e busca de sentido',
  Capricórnio: 'disciplina estratégica, responsabilidade e construção de legado',
  Aquário: 'originalidade, visão humanitária e independência intelectual',
  Peixes: 'compaixão, imaginação e ligação ao plano simbólico e espiritual',
}

const ESSENCIA_EN = {
  Carneiro: 'courageous initiative, autonomy and drive to forge new paths',
  Touro: 'sensory stability, persistence and building lasting value',
  Gémeos: 'mental curiosity, adaptability and dialogue as a path of growth',
  Caranguejo: 'emotional depth, protection and affective memory',
  Leão: 'radiant creativity, generosity and need for authentic expression',
  Virgem: 'discernment, conscious service and refinement of daily life',
  Balança: 'diplomacy, sense of justice and growth through relationship',
  Escorpião: 'transformative intensity, psychic courage and rebirth',
  Sagitário: 'philosophical expansion, visionary optimism and search for meaning',
  Capricórnio: 'strategic discipline, responsibility and legacy building',
  Aquário: 'originality, humanitarian vision and intellectual independence',
  Peixes: 'compassion, imagination and connection to the symbolic and spiritual plane',
}

const ELEMENTO_PT = {
  Carneiro: 'Fogo', Leão: 'Fogo', Sagitário: 'Fogo',
  Touro: 'Terra', Virgem: 'Terra', Capricórnio: 'Terra',
  Gémeos: 'Ar', Balança: 'Ar', Aquário: 'Ar',
  Caranguejo: 'Água', Escorpião: 'Água', Peixes: 'Água',
}

const ELEMENTO_EN = {
  Carneiro: 'Fire', Leão: 'Fire', Sagitário: 'Fire',
  Touro: 'Earth', Virgem: 'Earth', Capricórnio: 'Earth',
  Gémeos: 'Air', Balança: 'Air', Aquário: 'Air',
  Caranguejo: 'Water', Escorpião: 'Water', Peixes: 'Water',
}

const MODALIDADE_PT = {
  Carneiro: 'Cardinal', Caranguejo: 'Cardinal', Balança: 'Cardinal', Capricórnio: 'Cardinal',
  Touro: 'Fixo', Leão: 'Fixo', Escorpião: 'Fixo', Aquário: 'Fixo',
  Gémeos: 'Mutável', Virgem: 'Mutável', Sagitário: 'Mutável', Peixes: 'Mutável',
}

const MODALIDADE_EN = {
  Carneiro: 'Cardinal', Caranguejo: 'Cardinal', Balança: 'Cardinal', Capricórnio: 'Cardinal',
  Touro: 'Fixed', Leão: 'Fixed', Escorpião: 'Fixed', Aquário: 'Fixed',
  Gémeos: 'Mutable', Virgem: 'Mutable', Sagitário: 'Mutable', Peixes: 'Mutable',
}

const LABELS = {
  pt: {
    casaCalc: 'uma área ainda a calcular',
    sec0: 'Nota Metodológica', sec1: 'A Tua Essência Central', sec2: 'Mente, Relações e Acção (Planetas Pessoais)',
    sec3: 'Desafios, Bloqueios e Crescimento (Saturno e Júpiter)', secAspetos: 'Diálogo Planetário (Aspetos Principais)',
    sec4: 'Missão de Vida e Carreira (Meio do Céu)',
    sec5: 'Dimensões Transpessoais e Kármicas', sec6: 'Síntese Evolutiva e Conselho Final',
    sol: 'O Teu Propósito Vital (Sol)', lua: 'A Tua Natureza Emocional (Lua)', asc: 'A Tua Máscara Social e Impacto (Ascendente)',
    big3: 'Dinâmica entre Sol, Lua e Ascendente', mer: 'Mentalidade e Comunicação (Mercúrio)',
    ven: 'Linguagem do Amor e Valores (Vénus)', mar: 'Força de Vontade e Impulso (Marte)',
    jup: 'A Oportunidade de Expansão (Júpiter)', sat: 'O Teu Maior Mestre e Karma (Saturno)',
    mc: 'Meio do Céu (MC)', urano: 'Urano - Libertação e Inovação', neptuno: 'Neptuno - Espiritualidade e Inspiração',
    plutao: 'Plutão - Transformação Profunda', nodo: 'Nodo Norte - Destino Evolutivo', quiron: 'Quíron - A Ferida-Sabedoria',
    tensoTitulo: 'Aspeto mais tenso', orientacao: 'Mensagem de orientação prática',
    natalChartNote: 'O teu mapa natal',
    majorAspects: 'Aspetos planetários principais',
    harmonia: 'Harmonia estrutural',
    pdfHeader: 'MAPA ASTRAL NATAL COMPLETO - SIDUS',
    pdfMethod: 'Método: Efemérides astronómicas de precisão',
    pdfSystem: 'Sistema: Tropical · Casas Placidus',
    pdfFooter: 'Gerado por Sidus · Astrologia Tropical Placidus',
    gancho: 'O céu no momento em que nasceste é irrepetível - desbloqueia a leitura completa, escrita para o teu mapa: casas Placidus, aspectos, síntese evolutiva e PDF profissional, só teus.',
  },
  en: {
    casaCalc: 'an area still being calculated',
    sec0: 'Methodological Note', sec1: 'Your Central Essence', sec2: 'Mind, Relationships & Action (Personal Planets)',
    sec3: 'Challenges, Blocks & Growth (Saturn & Jupiter)', secAspetos: 'Planetary Dialogue (Major Aspects)',
    sec4: 'Life Mission & Career (Midheaven)',
    sec5: 'Transpersonal & Karmic Dimensions', sec6: 'Evolutionary Synthesis & Final Guidance',
    sol: 'Your Vital Purpose (Sun)', lua: 'Your Emotional Nature (Moon)', asc: 'Your Social Mask & Impact (Ascendant)',
    big3: 'Dynamics between Sun, Moon & Ascendant', mer: 'Mindset & Communication (Mercury)',
    ven: 'Love Language & Values (Venus)', mar: 'Willpower & Drive (Mars)',
    jup: 'The Opportunity for Expansion (Jupiter)', sat: 'Your Greatest Teacher & Karma (Saturn)',
    mc: 'Midheaven (MC)', urano: 'Uranus - Liberation & Innovation', neptuno: 'Neptune - Spirituality & Inspiration',
    plutao: 'Pluto - Deep Transformation', nodo: 'North Node - Evolutionary Destiny', quiron: 'Chiron - The Wound-Wisdom',
    tensoTitulo: 'Most tense aspect', orientacao: 'Practical guidance message',
    natalChartNote: 'Your natal chart',
    majorAspects: 'Major planetary aspects',
    harmonia: 'Structural harmony',
    pdfHeader: 'COMPLETE NATAL CHART - SIDUS',
    pdfMethod: 'Method: Precision astronomical ephemerides',
    pdfSystem: 'System: Tropical · Placidus Houses',
    pdfFooter: 'Generated by Sidus · Tropical Placidus Astrology',
    gancho: 'The sky at your birth is unrepeatable - unlock the full reading written for your chart alone: Placidus houses, aspects, evolutionary synthesis and a professional PDF that belongs only to you.',
  },
  es: {
    casaCalc: 'un área aún en cálculo',
    sec0: 'Nota Metodológica', sec1: 'Tu Esencia Central', sec2: 'Mente, Relaciones y Acción (Planetas Personales)',
    sec3: 'Desafíos, Bloqueos y Crecimiento (Saturno y Júpiter)', secAspetos: 'Diálogo Planetario (Aspectos Principales)',
    sec4: 'Misión de Vida y Carrera (Medio Cielo)',
    sec5: 'Dimensiones Transpersonales y Kármicas', sec6: 'Síntesis Evolutiva y Consejo Final',
    sol: 'Tu Propósito Vital (Sol)', lua: 'Tu Naturaleza Emocional (Luna)', asc: 'Tu Máscara Social e Impacto (Ascendente)',
    big3: 'Dinámica entre Sol, Luna y Ascendente', mer: 'Mentalidad y Comunicación (Mercurio)',
    ven: 'Lenguaje del Amor y Valores (Venus)', mar: 'Fuerza de Voluntad e Impulso (Marte)',
    jup: 'La Oportunidad de Expansión (Júpiter)', sat: 'Tu Mayor Maestro y Karma (Saturno)',
    mc: 'Medio Cielo (MC)', urano: 'Urano - Liberación e Innovación', neptuno: 'Neptuno - Espiritualidad e Inspiración',
    plutao: 'Plutón - Transformación Profunda', nodo: 'Nodo Norte - Destino Evolutivo', quiron: 'Quirón - La Herida-Sabiduría',
    tensoTitulo: 'Aspecto más tenso', orientacao: 'Mensaje de orientación práctica',
    natalChartNote: 'Tu carta natal',
    majorAspects: 'Aspectos planetarios principales',
    harmonia: 'Armonía estructural',
    pdfHeader: 'CARTA NATAL COMPLETA - SIDUS',
    pdfMethod: 'Método: Efemérides astronómicas de precisión',
    pdfSystem: 'Sistema: Tropical · Casas Placidus',
    pdfFooter: 'Generado por Sidus · Astrología Tropical Placidus',
    gancho: 'El cielo en el momento de tu nacimiento es irrepetible - desbloquea la lectura completa escrita solo para tu carta.',
  },
  it: {
    casaCalc: 'un\'area ancora in calcolo',
    sec0: 'Nota Metodologica', sec1: 'La Tua Essenza Centrale', sec2: 'Mente, Relazioni e Azione (Pianeti Personali)',
    sec3: 'Sfide, Blocchi e Crescita (Saturno e Giove)', secAspetos: 'Dialogo Planetario (Aspetti Principali)',
    sec4: 'Missione di Vita e Carriera (Medio Cielo)',
    sec5: 'Dimensioni Transpersonali e Karmiche', sec6: 'Sintesi Evolutiva e Consiglio Finale',
    sol: 'Il Tuo Scopo Vitale (Sole)', lua: 'La Tua Natura Emotiva (Luna)', asc: 'La Tua Maschera Sociale e Impatto (Ascendente)',
    big3: 'Dinamica tra Sole, Luna e Ascendente', mer: 'Mentalità e Comunicazione (Mercurio)',
    ven: 'Linguaggio dell\'Amore e Valori (Venere)', mar: 'Forza di Volontà e Impulso (Marte)',
    jup: 'L\'Opportunità di Espansione (Giove)', sat: 'Il Tuo Maggior Maestro e Karma (Saturno)',
    mc: 'Medio Cielo (MC)', urano: 'Urano - Liberazione e Innovazione', neptuno: 'Nettuno - Spiritualità e Ispirazione',
    plutao: 'Plutone - Trasformazione Profonda', nodo: 'Nodo Nord - Destino Evolutivo', quiron: 'Chirone - La Ferita-Saggezza',
    tensoTitulo: 'Aspetto più teso', orientacao: 'Messaggio di orientamento pratico',
    natalChartNote: 'La tua carta natale',
    majorAspects: 'Aspetti planetari principali',
    harmonia: 'Armonia strutturale',
    pdfHeader: 'CARTA NATALE COMPLETA - SIDUS',
    pdfMethod: 'Metodo: Effemeridi astronomiche di precisione',
    pdfSystem: 'Sistema: Tropicale · Case Placidus',
    pdfFooter: 'Generato da Sidus · Astrologia Tropicale Placidus',
    gancho: 'Il cielo al momento della tua nascita è irripetibile - sblocca la lettura completa scritta solo per la tua carta.',
  },
  de: {
    casaCalc: 'ein Bereich noch in Berechnung',
    sec0: 'Methodische Anmerkung', sec1: 'Deine Zentrale Essenz', sec2: 'Geist, Beziehungen & Handlung (Persönliche Planeten)',
    sec3: 'Herausforderungen, Blockaden & Wachstum (Saturn & Jupiter)', secAspetos: 'Planetarischer Dialog (Hauptaspekte)',
    sec4: 'Lebensmission & Karriere (Medium Coeli)',
    sec5: 'Transpersonale & Karmische Dimensionen', sec6: 'Evolutionäre Synthese & Abschlussberatung',
    sol: 'Dein Lebenszweck (Sonne)', lua: 'Deine Emotionale Natur (Mond)', asc: 'Deine Soziale Maske & Wirkung (Aszendent)',
    big3: 'Dynamik zwischen Sonne, Mond & Aszendent', mer: 'Denkweise & Kommunikation (Merkur)',
    ven: 'Sprache der Liebe & Werte (Venus)', mar: 'Willenskraft & Antrieb (Mars)',
    jup: 'Die Expansionschance (Jupiter)', sat: 'Dein Größter Lehrer & Karma (Saturn)',
    mc: 'Medium Coeli (MC)', urano: 'Uranus - Befreiung & Innovation', neptuno: 'Neptun - Spiritualität & Inspiration',
    plutao: 'Pluto - Tiefe Transformation', nodo: 'Nordknoten - Evolutionäres Schicksal', quiron: 'Chiron - Die Wunde-Weisheit',
    tensoTitulo: 'Spannungsreichster Aspekt', orientacao: 'Praktische Orientierungsbotschaft',
    natalChartNote: 'Dein Geburtshoroskop',
    majorAspects: 'Hauptplanetaspekte',
    harmonia: 'Strukturelle Harmonie',
    pdfHeader: 'VOLLSTÄNDIGES GEBURTSHOROSKOP - SIDUS',
    pdfMethod: 'Methode: Präzise astronomische Ephemeriden',
    pdfSystem: 'System: Tropisch · Placidus-Häuser',
    pdfFooter: 'Erstellt von Sidus · Tropische Placidus-Astrologie',
    gancho: 'Der Himmel bei deiner Geburt ist einzigartig - schalte die vollständige Lesung für dein Horoskop frei.',
  },
  fr: {
    casaCalc: 'une zone encore en calcul',
    sec0: 'Note Méthodologique', sec1: 'Ton Essence Centrale', sec2: 'Esprit, Relations & Action (Planètes Personnelles)',
    sec3: 'Défis, Blocages & Croissance (Saturne & Jupiter)', secAspetos: 'Dialogue Planétaire (Aspects Majeurs)',
    sec4: 'Mission de Vie & Carrière (Milieu du Ciel)',
    sec5: 'Dimensions Transpersonnelles & Karmiques', sec6: 'Synthèse Évolutive & Conseil Final',
    sol: 'Ton But Vital (Soleil)', lua: 'Ta Nature Émotionnelle (Lune)', asc: 'Ton Masque Social & Impact (Ascendant)',
    big3: 'Dynamique entre Soleil, Lune & Ascendant', mer: 'Mentalité & Communication (Mercure)',
    ven: 'Langage de l\'Amour & Valeurs (Vénus)', mar: 'Force de Volonté & Élan (Mars)',
    jup: 'L\'Opportunité d\'Expansion (Jupiter)', sat: 'Ton Plus Grand Maître & Karma (Saturne)',
    mc: 'Milieu du Ciel (MC)', urano: 'Uranus - Libération & Innovation', neptuno: 'Neptune - Spiritualité & Inspiration',
    plutao: 'Pluton - Transformation Profonde', nodo: 'Nœud Nord - Destin Évolutif', quiron: 'Chiron - La Blessure-Sagesse',
    tensoTitulo: 'Aspect le plus tendu', orientacao: 'Message d\'orientation pratique',
    natalChartNote: 'Ta carte natale',
    majorAspects: 'Aspects planétaires majeurs',
    harmonia: 'Harmonie structurelle',
    pdfHeader: 'CARTE NATALE COMPLÈTE - SIDUS',
    pdfMethod: 'Méthode : Éphémérides astronomiques de précision',
    pdfSystem: 'Système : Tropical · Maisons Placidus',
    pdfFooter: 'Généré par Sidus · Astrologie Tropicale Placidus',
    gancho: 'Le ciel au moment de ta naissance est unique - débloque la lecture complète écrite pour ta carte seule.',
  },
}

const INTRO_TECNICA = {
  pt: (d) => `Este mapa natal reflecte a posição exacta dos astros no momento do teu nascimento${d.cidade ? ` em ${d.cidade}` : ''}${d.data ? `, ${d.data}` : ''}${d.hora ? ` às ${d.hora}` : ''}. Cada planeta numa casa indica onde na vida essa energia se manifesta - a tua assinatura cósmica única, lida com rigor astrológico profissional.`,
  en: (d) => `This natal chart reflects the exact position of the stars at your birth${d.cidade ? ` in ${d.cidade}` : ''}${d.data ? `, ${d.data}` : ''}${d.hora ? ` at ${d.hora}` : ''}. Each planet in a house shows where in life that sign's energy manifests - your unique cosmic signature, read with professional astrological rigour.`,
  es: (d) => `Esta carta natal refleja la posición exacta de los astros en el momento de tu nacimiento${d.cidade ? ` en ${d.cidade}` : ''}${d.data ? `, ${d.data}` : ''}${d.hora ? ` a las ${d.hora}` : ''}. Cada planeta en una casa indica dónde en la vida se manifiesta esa energía: tu firma cósmica única, leída con rigor astrológico profesional.`,
  it: (d) => `Questa carta natale riflette la posizione esatta degli astri al momento della tua nascita${d.cidade ? ` a ${d.cidade}` : ''}${d.data ? `, ${d.data}` : ''}${d.hora ? ` alle ${d.hora}` : ''}. Ogni pianeta in una casa indica dove nella vita si manifesta quell'energia: la tua firma cosmica unica, letta con rigore astrologico professionale.`,
  de: (d) => `Dieses Geburtshoroskop spiegelt die exakte Position der Sterne zu deiner Geburt${d.cidade ? ` in ${d.cidade}` : ''}${d.data ? `, ${d.data}` : ''}${d.hora ? ` um ${d.hora}` : ''}. Jeder Planet in einem Haus zeigt, wo im Leben sich diese Energie manifestiert – deine einzigartige kosmische Signatur, gelesen mit professioneller astrologischer Strenge.`,
  fr: (d) => `Cette carte natale reflète la position exacte des astres au moment de ta naissance${d.cidade ? ` à ${d.cidade}` : ''}${d.data ? `, ${d.data}` : ''}${d.hora ? ` à ${d.hora}` : ''}. Chaque planète en maison indique où dans la vie cette énergie se manifeste – ta signature cosmique unique, lue avec rigueur astrologique professionnelle.`,
}

export function getMapaCopy(lang = 'pt') {
  const L = LABELS[lang] || LABELS.en || LABELS.pt
  const { temas, essencia, elemento, modalidade, casaLabel, casaShort } = getMapaStatic(lang)
  const sn = (s) => translateSigno(s, lang)
  const tx = (bundle, ...args) => {
    const fn = contentForLang(lang, bundle) || bundle.en
    return typeof fn === 'function' ? fn(...args) : fn
  }

  function casaTxt(casa) {
    if (!casa) return L.casaCalc
    const t = temas[casa]
    return t ? casaLabel(casa, t.nome, t.foco) : casaShort(casa)
  }

  function paragrafoGeracional(nome, signo, casa) {
    return buildParagrafoGeracional(lang, { nome, s: sn(signo), signo, casa, essencia, temas })
  }

  function introTecnica(mapaNatal, dados) {
    const d = { cidade: dados?.cidade, data: dados?.data, hora: dados?.hora }
    return tx(INTRO_TECNICA, d)
  }

  function gerarResumoGratuito(mapaNatal) {
    return buildResumoGratuito(lang, { sn, mapaNatal, gancho: L.gancho })
  }

  const pCtx = (signo, casa) => ({ s: sn(signo), signo, casa, essencia, temas })

  function paragrafoSol(signo, casa) { return buildParagrafoSol(lang, pCtx(signo, casa)) }
  function paragrafoLua(signo, casa) { return buildParagrafoLua(lang, pCtx(signo, casa)) }
  function paragrafoAsc(signo) { return buildParagrafoAsc(lang, pCtx(signo, null)) }
  function dinamicaBig3(sol, lua, asc) {
    return buildDinamicaBig3(lang, { sol, lua, asc, sn, elemento, modalidade })
  }
  function paragrafoMerc(signo, casa) { return buildParagrafoMerc(lang, pCtx(signo, casa)) }
  function paragrafoVen(signo, casa) { return buildParagrafoVen(lang, pCtx(signo, casa)) }
  function paragrafoMar(signo, casa) { return buildParagrafoMar(lang, pCtx(signo, casa)) }
  function paragrafoJup(signo, casa) { return buildParagrafoJup(lang, pCtx(signo, casa)) }
  function paragrafoSat(signo, casa) { return buildParagrafoSat(lang, pCtx(signo, casa)) }
  function paragrafoMC(signo) { return buildParagrafoMC(lang, pCtx(signo, null)) }
  function sinteseAspectoTenso(asp) { return buildSinteseAspectoTenso(lang, { asp, L }) }
  function conselhoFinal(mapaNatal, planetas, planetaPorNome) {
    const sat = planetaPorNome(planetas, 'Saturno')
    const jup = planetaPorNome(planetas, 'Júpiter')
    const solP = planetaPorNome(planetas, 'Sol')
    return buildConselhoFinal(lang, {
      sol: sn(mapaNatal?.solar?.nome || '-'),
      lua: sn(mapaNatal?.lunar?.nome || '-'),
      casaTxt: casaTxt(solP?.casa),
      casaSat: sat?.casa,
      casaJup: jup?.casa,
    })
  }

  return {
    L, casaTxt, paragrafoGeracional, introTecnica, gerarResumoGratuito,
    paragrafoSol, paragrafoLua, paragrafoAsc, dinamicaBig3,
    paragrafoMerc, paragrafoVen, paragrafoMar, paragrafoJup, paragrafoSat, paragrafoMC,
    sinteseAspectoTenso, conselhoFinal, sn,
  }
}
