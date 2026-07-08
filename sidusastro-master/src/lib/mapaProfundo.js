/**
 * Interpretação profunda - secções 5 (transpessoais) e 6 (síntese).
 * Cada texto é único: signo, casa Placidus, aspectos e Big 3.
 */
import { comporInterpretacaoPlaneta, textoPlanetSign } from './lexicon/compositor.js'
import { planetaPorNome, getTemaCasa } from './casasPlacidus.js'
import { translateSigno, translatePlaneta, translateAspecto } from './i18n/astro.js'
import { contentForLang, casaParentese, casaVirgula } from './i18n/langUtil.js'
import { getMapaStatic } from './i18n/packs/mapaStatic.js'

const SIGNOS = [
  'Carneiro', 'Touro', 'Gémeos', 'Caranguejo', 'Leão', 'Virgem',
  'Balança', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes',
]

const OPOSTO = Object.fromEntries(SIGNOS.map((s, i) => [s, SIGNOS[(i + 6) % 12]]))

const ELEMENTO = {
  Carneiro: 'Fogo', Leão: 'Fogo', Sagitário: 'Fogo',
  Touro: 'Terra', Virgem: 'Terra', Capricórnio: 'Terra',
  Gémeos: 'Ar', Balança: 'Ar', Aquário: 'Ar',
  Caranguejo: 'Água', Escorpião: 'Água', Peixes: 'Água',
}

function normalizarSigno(nome) {
  if (!nome) return null
  const map = { Áries: 'Carneiro', Aries: 'Carneiro', Cancer: 'Caranguejo', Scorpio: 'Escorpião', Scorpio: 'Escorpião' }
  return map[nome] || nome
}

function sn(signo, lang) {
  return translateSigno(normalizarSigno(signo), lang) || signo || '-'
}

function nomeAspeto(str) {
  return (str || '').split(' ')[0]
}

function aspetosDe(planeta, aspetos) {
  return (aspetos || []).filter((a) =>
    nomeAspeto(a.planetaA) === planeta || nomeAspeto(a.planetaB) === planeta,
  )
}

function decan(graus) {
  const g = parseFloat(graus) || 0
  if (g < 10) return 'inicial'
  if (g < 20) return 'central'
  return 'final'
}

function aspectoTenso(aspetos) {
  const tensos = (aspetos || []).filter((a) =>
    ['Quadratura', 'Oposicao', 'Oposição'].includes(a.aspecto),
  )
  if (!tensos.length) return null
  return tensos.sort((a, b) => parseFloat(a.orbe) - parseFloat(b.orbe))[0]
}

function aspectoHarmonico(aspetos) {
  const harm = (aspetos || []).filter((a) =>
    ['Trigono', 'Trígono', 'Sextil', 'Conjuncao', 'Conjunção'].includes(a.aspecto),
  )
  if (!harm.length) return null
  return harm.sort((a, b) => parseFloat(a.orbe) - parseFloat(b.orbe))[0]
}

function textoAspectos(planeta, aspetos, planetas, lang) {
  const lista = aspetosDe(planeta, aspetos).slice(0, 3)
  if (!lista.length) return ''
  const partes = lista.map((a) => {
    const outro = nomeAspeto(a.planetaA) === planeta ? nomeAspeto(a.planetaB) : nomeAspeto(a.planetaA)
    const pOut = planetaPorNome(planetas, outro)
    const asp = translateAspecto(
      a.aspecto === 'Conjuncao' ? 'Conjunção' : a.aspecto,
      lang,
    ).toLowerCase()
    const signoOut = sn(pOut?.signo?.nome, lang)
    const casaOut = pOut?.casa
    const outroTr = translatePlaneta(outro, lang)
    const orbeLbl = lang === 'pt' ? 'orbe' : 'orb'
    const casaSuf = casaOut ? casaParentese(lang, casaOut) : ''
    if (lang === 'pt') {
      return `${asp} com ${outro} em ${signoOut}${casaSuf} (${orbeLbl} ${a.orbe})`
    }
    const prep = { en: 'with', es: 'con', it: 'con', de: 'mit', fr: 'avec' }[lang] || 'with'
    const inPrep = { en: 'in', es: 'en', it: 'in', de: 'in', fr: 'en' }[lang] || 'in'
    return `${asp} ${prep} ${outroTr} ${inPrep} ${signoOut}${casaSuf} (${orbeLbl} ${a.orbe})`
  })
  return contentForLang(lang, {
    pt: ` Aspectos activos: ${partes.join('; ')}.`,
    en: ` Active aspects: ${partes.join('; ')}.`,
    es: ` Aspectos activos: ${partes.join('; ')}.`,
    it: ` Aspetti attivi: ${partes.join('; ')}.`,
    de: ` Aktive Aspekte: ${partes.join('; ')}.`,
    fr: ` Aspects actifs : ${partes.join('; ')}.`,
  })
}

/** Núcleo único por planeta × signo (PT). */
const NUCLEO_PT = {
  Urano: {
    Carneiro: 'Urano aqui electrifica a identidade: precisas de autonomia radical e de iniciar rupturas que te libertem de papéis herdados.',
    Touro: 'Urano em Touro revoluciona valores, corpo e segurança material - mudanças lentas mas irreversíveis na forma como te relacionas com o terreno.',
    Gémeos: 'Urano em Gémeos traz mente relâmpago e ideias disruptivas; a comunicação é o canal da tua revolução pessoal.',
    Caranguejo: 'Urano no Caranguejo agita raízes, família e memória emocional - o lar pode ser simultaneamente refúgio e campo de libertação.',
    Leão: 'Urano em Leão reinventa a expressão criativa e o palco pessoal; autenticidade radical substitui a necessidade de aplauso.',
    Virgem: 'Urano em Virgem reforma hábitos, saúde e métodos de trabalho - inovação através do detalhe e da eficiência consciente.',
    Balança: 'Urano na Balança transforma contratos, parcerias e noções de justiça - relações não convencionais podem ser o teu caminho.',
    Escorpião: 'Urano em Escorpião desencadeia metamorfoses profundas em intimidade, poder e tabus - crises súbitas abrem portais de liberdade.',
    Sagitário: 'Urano em Sagitário expande horizontes com velocidade: viagens, filosofia e verdades radicais rompem dogmas.',
    Capricórnio: 'Urano em Capricórnio reestrutura carreira, autoridade e legado - revolução nas instituições que tocas.',
    Aquário: 'Urano em Aquário amplifica o arquétipo do visionário: colectivos, tecnologia e causas humanitárias são o teu fogo.',
    Peixes: 'Urano em Peixes dissolve fronteiras entre sonho e realidade - intuição súbita e espiritualidade não convencional.',
  },
  Neptuno: {
    Carneiro: 'Neptuno em Carneiro idealiza a coragem e o impulso - cuidado com ilusões sobre quem deves ser; a fé move-te, mas precisa de chão.',
    Touro: 'Neptuno em Touro espiritualiza o prazer e os sentidos - arte, natureza e beleza são portais; vigiar escapismos financeiros.',
    Gémeos: 'Neptuno em Gémeos nebuliza a mente com imaginação e poesia - inspiras através da palavra, mas clarifica factos de ficção.',
    Caranguejo: 'Neptuno no Caranguejo aprofunda empatia e memória afectiva - absorves ambientes; limites são o teu estudo espiritual.',
    Leão: 'Neptuno em Leão romantiza a criatividade e o coração - carisma magnético misturado com necessidade de ser visto com alma.',
    Virgem: 'Neptuno em Virgem santifica o serviço e o corpo - cura através do quotidiano; perfeccionismo pode mascarar confusão.',
    Balança: 'Neptuno na Balança idealiza o amor e a harmonia - seduzes com graça, mas aprendes a ver o outro sem projetos.',
    Escorpião: 'Neptuno em Escorpião mergulha no mistério, sexo sagrado e psique - magnetismo oculto e sensibilidade psíquica intensa.',
    Sagitário: 'Neptuno em Sagitário expande a fé e a visão mística - buscas verdades universais além das religiões convencionais.',
    Capricórnio: 'Neptuno em Capricórnio dissolve estruturas rígidas - vocação espiritual dentro de instituições ou renúncia a modelos vazios.',
    Aquário: 'Neptuno em Aquário inspira utopias e compaixão colectiva - sonhas futuros onde a humanidade se eleva.',
    Peixes: 'Neptuno em Peixes é o poeta cósmico em casa - compaixão ilimitada, arte e ligação ao invisível como vocação.',
  },
  Plutão: {
    Carneiro: 'Plutão em Carneiro forja identidade através de crises de poder - renasces quando te atreves a liderar sem medo.',
    Touro: 'Plutão em Touro transforma valores e posse - o que agarras com força é exactamente o que precisas de regenerar.',
    Gémeos: 'Plutão em Gémeos escava a mente - palavras têm poder de cura ou destruição; investigas verdades ocultas.',
    Caranguejo: 'Plutão no Caranguejo intensifica raízes e linhagem - karma familiar e cura ancestral são o teu subterrâneo.',
    Leão: 'Plutão em Leão purifica o ego criativo - o palco exige vulnerabilidade real para ter impacto transformador.',
    Virgem: 'Plutão em Virgem purga hábitos e corpo - obsessão pelo detalhe pode ser caminho de cura ou de controlo.',
    Balança: 'Plutão na Balança transforma relações - parcerias são forjas de poder partilhado e verdade nua.',
    Escorpião: 'Plutão em Escorpião é o xamã em casa - magnetismo, morte simbólica e renascimento são o teu idioma nativo.',
    Sagitário: 'Plutão em Sagitário converte crenças - filosofias morrem e renascem; ensinas o que sobreviveu ao fogo.',
    Capricórnio: 'Plutão em Capricórnio reestrutura legado e autoridade - poder institucional ou destruição de impérios pessoais.',
    Aquário: 'Plutão em Aquário transforma colectivos - revoluções sociais e tecnológicas tocam a tua alma.',
    Peixes: 'Plutão em Peixes dissolve o ego no oceano colectivo - compaixão radical e sacrifício consciente.',
  },
  'Nodo Norte': {
    Carneiro: 'Nodo Norte em Carneiro pede coragem individual - evoluis quando inicias, afirmas desejos e deixas a dependência do Nodo Sul em Balança.',
    Touro: 'Nodo Norte em Touro pede enraizamento - constróis valor duradouro, deixando o drama escorpiano do passado.',
    Gémeos: 'Nodo Norte em Gémeos pede curiosidade e diálogo - aprendes perguntando, libertando dogmas sagitarianos.',
    Caranguejo: 'Nodo Norte no Caranguejo pede intimidade e cuidado - honras emoções, largando a armadura capricorniana.',
    Leão: 'Nodo Norte em Leão pede expressão criativa e coração - brilhas com autenticidade, não com dispersão aquariana.',
    Virgem: 'Nodo Norte em Virgem pede serviço e discernimento - refinas o quotidiano, transcendendo nebulosidade pisciana.',
    Balança: 'Nodo Norte na Balança pede parceria consciente - co-crias, deixando o carneirino solitário.',
    Escorpião: 'Nodo Norte em Escorpião pede profundidade e entrega - mergulhas na verdade, largando conforto taurino.',
    Sagitário: 'Nodo Norte em Sagitário pede sentido e expansão - filosofia viva substitui mentalidade gémea dispersa.',
    Capricórnio: 'Nodo Norte em Capricórnio pede responsabilidade e legado - constróis com disciplina, superando caranguejo retraído.',
    Aquário: 'Nodo Norte em Aquário pede visão colectiva - serves o futuro, transcendendo ego leonino.',
    Peixes: 'Nodo Norte em Peixes pede entrega espiritual - compaixão e imaginação curam o crítico virgem do passado.',
  },
  Quíron: {
    Carneiro: 'Quíron em Carneiro - ferida na identidade e na coragem; curas outros a iniciar quando aceitas a tua vulnerabilidade guerreira.',
    Touro: 'Quíron em Touro - ferida em valor e corpo; ensinas estabilidade a quem duvida do seu merecimento sensorial.',
    Gémeos: 'Quíron em Gémeos - ferida na comunicação e na mente; a tua voz torna-se medicina para quem não sabe expressar-se.',
    Caranguejo: 'Quíron no Caranguejo - ferida em pertença e família; acolhes quem não teve lar emocional seguro.',
    Leão: 'Quíron em Leão - ferida no brilho e na criatividade; libertas outros a brilhar quando deixas de competir por atenção.',
    Virgem: 'Quíron em Virgem - ferida no perfeccionismo e no corpo; curas através do serviço humilde e imperfeito.',
    Balança: 'Quíron na Balança - ferida em relações e justiça; tornas-te mediador de corações partidos.',
    Escorpião: 'Quíron em Escorpião - ferida em intimidade e poder; guias transformações que outros temem enfrentar.',
    Sagitário: 'Quíron em Sagitário - ferida em fé e sentido; ensinas esperança a quem perdeu a orientação.',
    Capricórnio: 'Quíron em Capricórnio - ferida em autoridade e sucesso; constróis pontes para quem foi excluído das estruturas.',
    Aquário: 'Quíron em Aquário - ferida em pertença ao grupo; abraças excluídos e inovadores feridos.',
    Peixes: 'Quíron em Peixes - ferida na fé e nos limites; curas através da compaixão sem te perderes no outro.',
  },
}

/** EN mirror - unique per sign. */
const NUCLEO_EN = {
  Urano: {
    Aries: 'Uranus here electrifies identity: you need radical autonomy and ruptures that free you from inherited roles.',
    Taurus: 'Uranus in Taurus revolutionises values, body and material security - slow but irreversible shifts in how you hold ground.',
    Gemini: 'Uranus in Gemini brings lightning mind and disruptive ideas; communication is your revolution channel.',
    Cancer: 'Uranus in Cancer stirs roots, family and emotional memory - home is both refuge and liberation field.',
    Leo: 'Uranus in Leo reinvents creative expression and personal stage; radical authenticity replaces applause hunger.',
    Virgo: 'Uranus in Virgo reforms habits, health and work methods - innovation through detail and conscious efficiency.',
    Libra: 'Uranus in Libra transforms contracts, partnerships and justice - unconventional bonds may be your path.',
    Scorpio: 'Uranus in Scorpio triggers deep metamorphosis in intimacy, power and taboo - sudden crises open freedom portals.',
    Sagittarius: 'Uranus in Sagittarius expands horizons fast: travel, philosophy and radical truths break dogma.',
    Capricorn: 'Uranus in Capricorn restructures career, authority and legacy - revolution in institutions you touch.',
    Aquarius: 'Uranus in Aquarius amplifies the visionary archetype: collectives, tech and humanitarian causes are your fire.',
    Pisces: 'Uranus in Pisces dissolves dream-reality borders - sudden intuition and unconventional spirituality.',
  },
  Neptuno: {
    Aries: 'Neptune in Aries idealises courage and impulse - beware illusions about who you must be; faith moves you but needs grounding.',
    Taurus: 'Neptune in Taurus spiritualises pleasure and senses - art, nature and beauty are portals; watch financial escapism.',
    Gemini: 'Neptune in Gemini clouds mind with imagination and poetry - you inspire through words but must separate fact from fiction.',
    Cancer: 'Neptune in Cancer deepens empathy and affective memory - you absorb environments; boundaries are your spiritual study.',
    Leo: 'Neptune in Leo romanticises creativity and heart - magnetic charisma mixed with need to be seen with soul.',
    Virgo: 'Neptune in Virgo sanctifies service and body - healing through daily life; perfectionism may mask confusion.',
    Libra: 'Neptune in Libra idealises love and harmony - you seduce with grace but learn to see others without projection.',
    Scorpio: 'Neptune in Scorpio dives into mystery, sacred sexuality and psyche - hidden magnetism and intense psychic sensitivity.',
    Sagittarius: 'Neptune in Sagittarius expands faith and mystical vision - you seek universal truths beyond conventional religion.',
    Capricorn: 'Neptune in Capricorn dissolves rigid structures - spiritual vocation within institutions or renouncing empty models.',
    Aquarius: 'Neptune in Aquarius inspires utopias and collective compassion - you dream futures where humanity ascends.',
    Pisces: 'Neptune in Pisces is the cosmic poet at home - boundless compassion, art and connection to the invisible as vocation.',
  },
  Plutão: {
    Aries: 'Pluto in Aries forges identity through power crises - you are reborn when you dare to lead without fear.',
    Taurus: 'Pluto in Taurus transforms values and possession - what you grip hardest is what you must regenerate.',
    Gemini: 'Pluto in Gemini excavates the mind - words heal or destroy; you investigate hidden truths.',
    Cancer: 'Pluto in Cancer intensifies roots and lineage - family karma and ancestral healing are your underground.',
    Leo: 'Pluto in Leo purifies creative ego - the stage demands real vulnerability for transformative impact.',
    Virgo: 'Pluto in Virgo purges habits and body - obsession with detail can be healing path or control.',
    Libra: 'Pluto in Libra transforms relationships - partnerships are forges of shared power and naked truth.',
    Scorpio: 'Pluto in Scorpio is the shaman at home - magnetism, symbolic death and rebirth are your native language.',
    Sagittarius: 'Pluto in Sagittarius converts beliefs - philosophies die and rebirth; you teach what survived the fire.',
    Capricorn: 'Pluto in Capricorn restructures legacy and authority - institutional power or destruction of personal empires.',
    Aquarius: 'Pluto in Aquarius transforms collectives - social and technological revolutions touch your soul.',
    Pisces: 'Pluto in Pisces dissolves ego into the collective ocean - radical compassion and conscious sacrifice.',
  },
  'Nodo Norte': {
    Aries: 'North Node in Aries asks individual courage - you evolve by initiating and asserting desires, leaving Libra South Node dependency.',
    Taurus: 'North Node in Taurus asks grounding - you build lasting value, releasing Scorpio South Node drama.',
    Gemini: 'North Node in Gemini asks curiosity and dialogue - you learn by questioning, freeing Sagittarius dogma.',
    Cancer: 'North Node in Cancer asks intimacy and care - you honour emotions, dropping Capricorn armour.',
    Leo: 'North Node in Leo asks creative expression and heart - you shine authentically, not Aquarian dispersion.',
    Virgo: 'North Node in Virgo asks service and discernment - you refine daily life, transcending Piscean fog.',
    Libra: 'North Node in Libra asks conscious partnership - you co-create, leaving solitary Aries behind.',
    Scorpio: 'North Node in Scorpio asks depth and surrender - you dive into truth, releasing Taurus comfort.',
    Sagittarius: 'North Node in Sagittarius asks meaning and expansion - living philosophy replaces scattered Gemini mind.',
    Capricorn: 'North Node in Capricorn asks responsibility and legacy - you build with discipline, overcoming retracted Cancer.',
    Aquarius: 'North Node in Aquarius asks collective vision - you serve the future, transcending Leo ego.',
    Pisces: 'North Node in Pisces asks spiritual surrender - compassion and imagination heal the critical Virgo past.',
  },
  Quíron: {
    Aries: 'Chiron in Aries - wound in identity and courage; you heal others to begin when you accept warrior vulnerability.',
    Taurus: 'Chiron in Taurus - wound in value and body; you teach stability to those who doubt sensory worth.',
    Gemini: 'Chiron in Gemini - wound in communication and mind; your voice becomes medicine for the inarticulate.',
    Cancer: 'Chiron in Cancer - wound in belonging and family; you shelter those without safe emotional home.',
    Leo: 'Chiron in Leo - wound in shine and creativity; you free others to glow when you stop competing for attention.',
    Virgo: 'Chiron in Virgo - wound in perfectionism and body; you heal through humble, imperfect service.',
    Libra: 'Chiron in Libra - wound in relationships and justice; you become mediator of broken hearts.',
    Scorpio: 'Chiron in Scorpio - wound in intimacy and power; you guide transformations others fear.',
    Sagittarius: 'Chiron in Sagittarius - wound in faith and meaning; you teach hope to the disoriented.',
    Capricorn: 'Chiron in Capricorn - wound in authority and success; you build bridges for those excluded from structures.',
    Aquarius: 'Chiron in Aquarius - wound in group belonging; you embrace wounded outsiders and innovators.',
    Pisces: 'Chiron in Pisces - wound in faith and boundaries; you heal through compassion without losing yourself.',
  },
}

function nucleoPlaneta(nome, signo, lang) {
  const chave = normalizarSigno(signo)
  if (lang === 'pt') return NUCLEO_PT[nome]?.[chave] || ''
  if (lang === 'en') return NUCLEO_EN[nome]?.[sn(chave, 'en')] || ''
  const fromLex = textoPlanetSign(nome, signo, lang)
  if (fromLex) return fromLex
  return NUCLEO_EN[nome]?.[sn(chave, 'en')] || ''
}

function blocoCasa(casa, lang) {
  if (!casa) return ''
  const t = getTemaCasa(casa, lang)
  if (!t) return ''
  return contentForLang(lang, {
    pt: ` Na ${casa}ª Casa (${t.nome}), esta energia manifesta-se concretamente em ${t.foco}.`,
    en: ` In House ${casa} (${t.nome}), this energy manifests concretely in ${t.foco}.`,
    es: ` En la Casa ${casa} (${t.nome}), esta energía se manifiesta concretamente en ${t.foco}.`,
    it: ` Nella Casa ${casa} (${t.nome}), questa energia si manifesta concretamente in ${t.foco}.`,
    de: ` Im Haus ${casa} (${t.nome}) manifestiert sich diese Energie konkret in ${t.foco}.`,
    fr: ` En Maison ${casa} (${t.nome}), cette énergie se manifeste concrètement dans ${t.foco}.`,
  })
}

function blocoDecan(graus, signo, lang) {
  const d = decan(graus)
  const s = sn(signo, lang)
  const { elemento } = getMapaStatic(lang)
  const elem = elemento[normalizarSigno(signo)] || ELEMENTO[normalizarSigno(signo)]
  const bundles = {
    inicial: {
      pt: ` A ${graus}° (decanato inicial de ${s}), o impulso de ${elem} é cru e iniciador.`,
      en: ` At ${graus}° (${d} ${s}), the ${elem} impulse is raw and initiating.`,
      es: ` A ${graus}° (decanato inicial de ${s}), el impulso de ${elem} es crudo e iniciador.`,
      it: ` A ${graus}° (decanato iniziale di ${s}), l'impulso di ${elem} è grezzo e iniziatore.`,
      de: ` Bei ${graus}° (frühes Dekan von ${s}) ist der ${elem}-Impuls roh und initiierend.`,
      fr: ` À ${graus}° (décan initial de ${s}), l'élan ${elem} est brut et initiateur.`,
    },
    central: {
      pt: ` A ${graus}° (decanato central de ${s}), o tema de ${elem} está plenamente corporizado e testado.`,
      en: ` At ${graus}° (mid-${s}), the ${elem} theme is fully embodied and tested.`,
      es: ` A ${graus}° (decanato central de ${s}), el tema de ${elem} está plenamente encarnado y probado.`,
      it: ` A ${graus}° (decanato centrale di ${s}), il tema di ${elem} è pienamente incarnato e testato.`,
      de: ` Bei ${graus}° (mittleres Dekan von ${s}) ist das ${elem}-Thema voll verkörpert und geprüft.`,
      fr: ` À ${graus}° (décan central de ${s}), le thème ${elem} est pleinement incarné et éprouvé.`,
    },
    final: {
      pt: ` A ${graus}° (decanato final de ${s}), a lição de ${elem} amadurece para integração e desapego.`,
      en: ` At ${graus}° (late ${s}), the ${elem} lesson matures toward integration and release.`,
      es: ` A ${graus}° (decanato final de ${s}), la lección de ${elem} madura hacia integración y desapego.`,
      it: ` A ${graus}° (decanato finale di ${s}), la lezione di ${elem} matura verso integrazione e distacco.`,
      de: ` Bei ${graus}° (spätes Dekan von ${s}) reift die ${elem}-Lektion zu Integration und Loslassen.`,
      fr: ` À ${graus}° (décan final de ${s}), la leçon ${elem} mûrit vers intégration et lâcher-prise.`,
    },
  }
  return contentForLang(lang, bundles[d])
}

function blocoBig3(nome, signo, mapaNatal, lang) {
  const sol = normalizarSigno(mapaNatal?.solar?.nome)
  const lua = normalizarSigno(mapaNatal?.lunar?.nome)
  const chave = normalizarSigno(signo)
  if (!sol && !lua) return ''
  const elemPlan = ELEMENTO[chave]
  const elemSol = ELEMENTO[sol]
  const elemLua = ELEMENTO[lua]
  const nomeTr = translatePlaneta(nome, lang)
  if (elemPlan === elemSol) {
    return contentForLang(lang, {
      pt: ` Este ${nome} ressoa com o teu Sol em ${sn(sol, lang)} (${elemSol}) - identidade e tema transpessoal falam a mesma linguagem elemental.`,
      en: ` This ${nomeTr} placement resonates with your Sun in ${sn(sol, lang)} (${elemSol}) - identity and transpersonal theme speak the same elemental language.`,
      es: ` Este ${nomeTr} resuena con tu Sol en ${sn(sol, lang)} (${elemSol}): identidad y tema transpessoal hablan el mismo lenguaje elemental.`,
      it: ` Questo ${nomeTr} risuona con il tuo Sole in ${sn(sol, lang)} (${elemSol}): identità e tema transpersonale parlano la stessa lingua elementale.`,
      de: ` Diese ${nomeTr}-Platzierung resoniert mit deiner Sonne in ${sn(sol, lang)} (${elemSol}) – Identität und transpersonales Thema sprechen dieselbe Elementarsprache.`,
      fr: ` Ce ${nomeTr} résonne avec ton Soleil en ${sn(sol, lang)} (${elemSol}) : identité et thème transpersonnel parlent la même langue élémentaire.`,
    })
  }
  if (elemPlan === elemLua) {
    return contentForLang(lang, {
      pt: ` Este ${nome} ecoa a tua Lua em ${sn(lua, lang)} (${elemLua}) - o corpo emocional reconhece esta frequência instintivamente.`,
      en: ` This ${nomeTr} echoes your Moon in ${sn(lua, lang)} (${elemLua}) - the emotional body recognises this frequency instinctively.`,
      es: ` Este ${nomeTr} hace eco a tu Luna en ${sn(lua, lang)} (${elemLua}): el cuerpo emocional reconoce esta frecuencia instintivamente.`,
      it: ` Questo ${nomeTr} riecheggia la tua Luna in ${sn(lua, lang)} (${elemLua}): il corpo emotivo riconosce questa frequenza istintivamente.`,
      de: ` Dieser ${nomeTr} hallt deinen Mond in ${sn(lua, lang)} (${elemLua}) nach – der emotionale Körper erkennt diese Frequenz instinktiv.`,
      fr: ` Ce ${nomeTr} fait écho à ta Lune en ${sn(lua, lang)} (${elemLua}) : le corps émotionnel reconnaît cette fréquence instinctivement.`,
    })
  }
  return contentForLang(lang, {
    pt: ` Frente ao eixo Sol–Lua (${sn(sol, lang)}/${sn(lua, lang)}), este ${nome} em ${sn(chave, lang)} pede tradução consciente entre idiomas internos diferentes.`,
    en: ` Against your Sun–Moon axis (${sn(sol, lang)}/${sn(lua, lang)}), this ${nomeTr} in ${sn(chave, lang)} asks conscious translation between different inner languages.`,
    es: ` Frente al eje Sol–Luna (${sn(sol, lang)}/${sn(lua, lang)}), este ${nomeTr} en ${sn(chave, lang)} pide traducción consciente entre idiomas internos distintos.`,
    it: ` Rispetto all'asse Sole–Luna (${sn(sol, lang)}/${sn(lua, lang)}), questo ${nomeTr} in ${sn(chave, lang)} chiede traduzione consapevole tra linguaggi interiori diversi.`,
    de: ` Gegenüber der Sonne–Mond-Achse (${sn(sol, lang)}/${sn(lua, lang)}) verlangt dieser ${nomeTr} in ${sn(chave, lang)} bewusste Übersetzung zwischen verschiedenen inneren Sprachen.`,
    fr: ` Face à l'axe Soleil–Lune (${sn(sol, lang)}/${sn(lua, lang)}), ce ${nomeTr} en ${sn(chave, lang)} demande une traduction consciente entre langages intérieurs différents.`,
  })
}

function blocoNodoSul(signo, lang) {
  const chave = normalizarSigno(signo)
  const sul = OPOSTO[chave]
  if (!sul) return ''
  return contentForLang(lang, {
    pt: ` Nodo Sul em ${sn(sul, lang)}: padrões confortáveis a largar neste caminho.`,
    en: ` South Node in ${sn(sul, lang)}: comfortable patterns to release on this path.`,
    es: ` Nodo Sur en ${sn(sul, lang)}: patrones cómodos a soltar en este camino.`,
    it: ` Nodo Sud in ${sn(sul, lang)}: schemi comodi da lasciare su questo cammino.`,
    de: ` Südknoten in ${sn(sul, lang)}: bequeme Muster, die du auf diesem Weg loslässt.`,
    fr: ` Nœud Sud en ${sn(sul, lang)} : schémas confortables à lâcher sur ce chemin.`,
  })
}

/**
 * Secção 5 - interpretação única por planeta transpessoal.
 */
export function interpretarTranspessoal(nome, planeta, mapaNatal, aspetos, planetas, lang = 'pt') {
  if (!planeta) return ''
  const signo = planeta.signo?.nome

  let textoRico = nucleoPlaneta(nome, signo, lang)
  textoRico += blocoBig3(nome, signo, mapaNatal, lang)
  if (nome === 'Nodo Norte') textoRico += blocoNodoSul(signo, lang)

  return comporInterpretacaoPlaneta(nome, planeta, aspetos, planetas, lang, textoRico)
}

function elementoDominante(planetas) {
  const cont = { Fogo: 0, Terra: 0, Ar: 0, Água: 0 }
  for (const p of planetas || []) {
    const e = ELEMENTO[normalizarSigno(p.signo?.nome)]
    if (e) cont[e]++
  }
  return Object.entries(cont).sort((a, b) => b[1] - a[1])[0]?.[0] || null
}

function planetaMaisAspectado(aspetos) {
  const cnt = {}
  for (const a of aspetos || []) {
    const pa = nomeAspeto(a.planetaA)
    const pb = nomeAspeto(a.planetaB)
    cnt[pa] = (cnt[pa] || 0) + 1
    cnt[pb] = (cnt[pb] || 0) + 1
  }
  const top = Object.entries(cnt).sort((a, b) => b[1] - a[1])[0]
  return top ? top[0] : null
}

/**
 * Secção 6 - síntese evolutiva única por mapa.
 */
export function gerarSinteseEvolutiva(mapaNatal, planetas, aspetos, lang = 'pt') {
  const sol = mapaNatal?.solar?.nome
  const lua = mapaNatal?.lunar?.nome
  const asc = mapaNatal?.ascendente?.nome
  const mc = mapaNatal?.mc?.nome

  const pSat = planetaPorNome(planetas, 'Saturno')
  const pJup = planetaPorNome(planetas, 'Júpiter')
  const pNod = planetaPorNome(planetas, 'Nodo Norte')
  const pMar = planetaPorNome(planetas, 'Marte')

  const tenso = aspectoTenso(aspetos)
  const harm = aspectoHarmonico(aspetos)
  const elemDom = elementoDominante(planetas)
  const hub = planetaMaisAspectado(aspetos)

  if (tenso) {
    const pA = nomeAspeto(tenso.planetaA)
    const pB = nomeAspeto(tenso.planetaB)
    const posA = planetaPorNome(planetas, pA)
    const posB = planetaPorNome(planetas, pB)
    const aspNome = tenso.aspecto === 'Oposicao'
      ? contentForLang(lang, { pt: 'Oposição', en: 'Opposition', es: 'Oposición', it: 'Opposizione', de: 'Opposition', fr: 'Opposition' })
      : contentForLang(lang, { pt: 'Quadratura', en: 'Square', es: 'Cuadratura', it: 'Quadratura', de: 'Quadrat', fr: 'Carré' })
    const orbeLbl = lang === 'pt' ? 'orbe' : 'orb'
    const titulo = `${aspNome} ${translatePlaneta(pA, lang)} · ${translatePlaneta(pB, lang)} (${orbeLbl} ${tenso.orbe})`
    const focoA = getTemaCasa(posA?.casa, lang)?.foco || contentForLang(lang, { pt: 'uma esfera da vida', en: 'one life sphere', es: 'una esfera de la vida', it: 'una sfera della vita', de: 'eine Lebenssphäre', fr: 'une sphère de vie' })
    const focoB = getTemaCasa(posB?.casa, lang)?.foco || contentForLang(lang, { pt: 'outra', en: 'another', es: 'otra', it: 'un\'altra', de: 'eine andere', fr: 'une autre' })
    const casaA = posA?.casa ? casaParentese(lang, posA.casa) : ''
    const casaB = posB?.casa ? casaParentese(lang, posB.casa) : ''

    const texto = contentForLang(lang, {
      pt: `A tensão evolutiva central do teu mapa é a ${aspNome} entre ${pA} em ${sn(posA?.signo?.nome, lang)}${casaA} e ${pB} em ${sn(posB?.signo?.nome, lang)}${casaB}. Com Sol em ${sn(sol, lang)}, Lua em ${sn(lua, lang)} e Ascendente em ${sn(asc, lang)}, este aspecto colore como equilibras ${focoA} com ${focoB}. O atrito é combustível: a maturidade nasce de negociar os dois polos em vez de silenciar um.`,
      en: `Your chart's primary evolutionary tension is the ${aspNome} between ${translatePlaneta(pA, lang)} in ${sn(posA?.signo?.nome, lang)}${casaA} and ${translatePlaneta(pB, lang)} in ${sn(posB?.signo?.nome, lang)}${casaB}. With Sun in ${sn(sol, lang)}, Moon in ${sn(lua, lang)} and Ascendant in ${sn(asc, lang)}, this aspect colours how you balance ${focoA} with ${focoB}. The friction is fuel: maturity comes from negotiating both poles rather than silencing one.`,
      es: `La tensión evolutiva central de tu carta es la ${aspNome} entre ${translatePlaneta(pA, lang)} en ${sn(posA?.signo?.nome, lang)}${casaA} y ${translatePlaneta(pB, lang)} en ${sn(posB?.signo?.nome, lang)}${casaB}. Con Sol en ${sn(sol, lang)}, Luna en ${sn(lua, lang)} y Ascendente en ${sn(asc, lang)}, este aspecto colorea cómo equilibras ${focoA} con ${focoB}. El roce es combustible: la madurez nace de negociar ambos polos en vez de silenciar uno.`,
      it: `La tensione evolutiva centrale della tua carta è la ${aspNome} tra ${translatePlaneta(pA, lang)} in ${sn(posA?.signo?.nome, lang)}${casaA} e ${translatePlaneta(pB, lang)} in ${sn(posB?.signo?.nome, lang)}${casaB}. Con Sole in ${sn(sol, lang)}, Luna in ${sn(lua, lang)} e Ascendente in ${sn(asc, lang)}, questo aspetto colora come equilibri ${focoA} con ${focoB}. L'attrito è combustibile: la maturità nasce dal negoziare entrambi i poli invece di silenziarne uno.`,
      de: `Die zentrale evolutionäre Spannung deines Horoskops ist das ${aspNome} zwischen ${translatePlaneta(pA, lang)} in ${sn(posA?.signo?.nome, lang)}${casaA} und ${translatePlaneta(pB, lang)} in ${sn(posB?.signo?.nome, lang)}${casaB}. Mit Sonne in ${sn(sol, lang)}, Mond in ${sn(lua, lang)} und Aszendent in ${sn(asc, lang)} färbt dieser Aspekt, wie du ${focoA} mit ${focoB} ausbalancierst. Reibung ist Treibstoff: Reife entsteht, beide Pole zu verhandeln statt einen zu verstummen.`,
      fr: `La tension évolutive centrale de ta carte est la ${aspNome} entre ${translatePlaneta(pA, lang)} en ${sn(posA?.signo?.nome, lang)}${casaA} et ${translatePlaneta(pB, lang)} en ${sn(posB?.signo?.nome, lang)}${casaB}. Avec Soleil en ${sn(sol, lang)}, Lune en ${sn(lua, lang)} et Ascendant en ${sn(asc, lang)}, cet aspect colore comment tu équilibres ${focoA} avec ${focoB}. La friction est carburant : la maturité naît de négocier les deux pôles plutôt que d'en faire taire un.`,
    })

    const conselho = contentForLang(lang, {
      pt: `Quando o conflito surgir entre ${pA} e ${pB}, pausa: cada voz guarda uma necessidade legítima. Integrar esta ${aspNome} é a chave-mestra do teu mapa.`,
      en: `When conflict rises between ${translatePlaneta(pA, lang)} and ${translatePlaneta(pB, lang)}, pause: each voice guards a legitimate need. Integrating this ${aspNome} is your chart's master key.`,
      es: `Cuando surja conflicto entre ${translatePlaneta(pA, lang)} y ${translatePlaneta(pB, lang)}, pausa: cada voz guarda una necesidad legítima. Integrar esta ${aspNome} es la clave maestra de tu carta.`,
      it: `Quando sorge conflitto tra ${translatePlaneta(pA, lang)} e ${translatePlaneta(pB, lang)}, fermati: ogni voce custodisce un bisogno legittimo. Integrare questa ${aspNome} è la chiave maestra della tua carta.`,
      de: `Wenn Konflikt zwischen ${translatePlaneta(pA, lang)} und ${translatePlaneta(pB, lang)} aufsteigt, halte inne: jede Stimme bewahrt ein legitimes Bedürfnis. Dieses ${aspNome} zu integrieren ist der Hauptschlüssel deines Horoskops.`,
      fr: `Quand un conflit surgit entre ${translatePlaneta(pA, lang)} et ${translatePlaneta(pB, lang)}, pause : chaque voix garde un besoin légitime. Intégrer cette ${aspNome} est la clé maîtresse de ta carte.`,
    })

    return { titulo, texto, conselho }
  }

  const titulo = contentForLang(lang, {
    pt: 'Assinatura evolutiva', en: 'Evolutionary signature', es: 'Firma evolutiva',
    it: 'Firma evolutiva', de: 'Evolutionäre Signatur', fr: 'Signature évolutive',
  })
  const { elemento: elemMap } = getMapaStatic(lang)
  const elemDomTr = elemDom ? (elemMap[Object.keys(ELEMENTO).find((k) => ELEMENTO[k] === elemDom)] || elemDom) : contentForLang(lang, { pt: 'misto', en: 'mixed', es: 'mixto', it: 'misto', de: 'gemischt', fr: 'mixte' })

  let texto = contentForLang(lang, {
    pt: `Não há quadratura ou oposição dominante nos aspectos maiores - o teu caminho de crescimento é mais subtil mas igualmente específico. Elemento dominante: ${elemDomTr} nos planetas pessoais. `,
    en: `No dominant square or opposition among major aspects - your growth path is subtler but equally specific. Dominant element: ${elemDomTr} across personal planets. `,
    es: `No hay cuadratura u oposición dominante en los aspectos mayores: tu camino de crecimiento es más sutil pero igualmente específico. Elemento dominante: ${elemDomTr} en los planetas personales. `,
    it: `Non c'è quadratura o opposizione dominante negli aspetti maggiori: il tuo cammino di crescita è più sottile ma ugualmente specifico. Elemento dominante: ${elemDomTr} nei pianeti personali. `,
    de: `Kein dominantes Quadrat oder Opposition unter den Hauptaspekten – dein Wachstumsweg ist subtiler, aber ebenso spezifisch. Dominantes Element: ${elemDomTr} bei den persönlichen Planeten. `,
    fr: `Pas de carré ou opposition dominant parmi les aspects majeurs – ton chemin de croissance est plus subtil mais tout aussi spécifique. Élément dominant : ${elemDomTr} chez les planètes personnelles. `,
  })

  if (harm) {
    const hA = translatePlaneta(nomeAspeto(harm.planetaA), lang)
    const hB = translatePlaneta(nomeAspeto(harm.planetaB), lang)
    texto += contentForLang(lang, {
      pt: `O teu maior recurso natural é o ${harm.aspecto} entre ${hA} e ${hB} (orbe ${harm.orbe}) - apoia-te conscientemente nesta aliança. `,
      en: `Your greatest natural resource is the ${harm.aspecto} between ${hA} and ${hB} (orb ${harm.orbe}) - lean on this alliance consciously. `,
      es: `Tu mayor recurso natural es el ${harm.aspecto} entre ${hA} y ${hB} (orbe ${harm.orbe}): apóyate conscientemente en esta alianza. `,
      it: `La tua maggiore risorsa naturale è il ${harm.aspecto} tra ${hA} e ${hB} (orbe ${harm.orbe}): appoggiati consapevolmente a questa alleanza. `,
      de: `Deine größte natürliche Ressource ist das ${harm.aspecto} zwischen ${hA} und ${hB} (Orb ${harm.orbe}) – stütze dich bewusst auf diese Allianz. `,
      fr: `Ta plus grande ressource naturelle est le ${harm.aspecto} entre ${hA} et ${hB} (orbe ${harm.orbe}) – appuie-toi consciemment sur cette alliance. `,
    })
  }
  if (hub) {
    texto += contentForLang(lang, {
      pt: `${hub} é o planeta mais conectado do mapa - as lições de vida orbitam este arquétipo. `,
      en: `${translatePlaneta(hub, lang)} is the most connected planet in your chart - life lessons orbit this archetype. `,
      es: `${translatePlaneta(hub, lang)} es el planeta más conectado de la carta: las lecciones de vida orbitan este arquetipo. `,
      it: `${translatePlaneta(hub, lang)} è il pianeta più connesso della carta: le lezioni di vita orbitano questo archetipo. `,
      de: `${translatePlaneta(hub, lang)} ist der am meisten verbundene Planet im Horoskop – Lebenslektionen kreisen um diesen Archetyp. `,
      fr: `${translatePlaneta(hub, lang)} est la planète la plus connectée de la carte – les leçons de vie orbitent cet archétype. `,
    })
  }
  if (pNod) {
    const focoNod = getTemaCasa(pNod.casa, lang)?.foco || contentForLang(lang, { pt: 'crescimento evolutivo', en: 'evolutionary growth', es: 'crecimiento evolutivo', it: 'crescita evolutiva', de: 'evolutionäres Wachstum', fr: 'croissance évolutive' })
    const casaNod = casaVirgula(lang, pNod.casa)
    texto += contentForLang(lang, {
      pt: `Nodo Norte em ${sn(pNod.signo?.nome, lang)}${casaNod} aponta a alma para ${focoNod}. `,
      en: `North Node in ${sn(pNod.signo?.nome, lang)}${casaNod} points your soul toward ${focoNod}. `,
      es: `Nodo Norte en ${sn(pNod.signo?.nome, lang)}${casaNod} apunta el alma hacia ${focoNod}. `,
      it: `Nodo Nord in ${sn(pNod.signo?.nome, lang)}${casaNod} indica all'anima ${focoNod}. `,
      de: `Nordknoten in ${sn(pNod.signo?.nome, lang)}${casaNod} weist die Seele auf ${focoNod}. `,
      fr: `Nœud Nord en ${sn(pNod.signo?.nome, lang)}${casaNod} oriente l'âme vers ${focoNod}. `,
    })
  }
  texto += contentForLang(lang, {
    pt: `Sol ${sn(sol, lang)} · Lua ${sn(lua, lang)} · Asc ${sn(asc, lang)} · MC ${sn(mc, lang)} formam uma assinatura psíquica que nenhum horóscopo genérico replica.`,
    en: `Sun ${sn(sol, lang)} · Moon ${sn(lua, lang)} · Asc ${sn(asc, lang)} · MC ${sn(mc, lang)} form a unique psychic fingerprint no generic horoscope can replicate.`,
    es: `Sol ${sn(sol, lang)} · Luna ${sn(lua, lang)} · Asc ${sn(asc, lang)} · MC ${sn(mc, lang)} forman una firma psíquica que ningún horóscopo genérico replica.`,
    it: `Sole ${sn(sol, lang)} · Luna ${sn(lua, lang)} · Asc ${sn(asc, lang)} · MC ${sn(mc, lang)} formano una firma psichica che nessun oroscopo generico replica.`,
    de: `Sonne ${sn(sol, lang)} · Mond ${sn(lua, lang)} · Asc ${sn(asc, lang)} · MC ${sn(mc, lang)} bilden eine psychische Signatur, die kein generisches Horoskop repliziert.`,
    fr: `Soleil ${sn(sol, lang)} · Lune ${sn(lua, lang)} · Asc ${sn(asc, lang)} · MC ${sn(mc, lang)} forment une signature psychique qu'aucun horoscope générique ne reproduit.`,
  })

  const pSol = planetaPorNome(planetas, 'Sol')
  const focoSol = getTemaCasa(pSol?.casa, lang)?.foco || contentForLang(lang, { pt: 'tua casa solar', en: 'your solar house', es: 'tu casa solar', it: 'la tua casa solare', de: 'dein Sonnenhaus', fr: 'ta maison solaire' })
  const conselho = contentForLang(lang, {
    pt: `Caminho prático: age com coragem de ${sn(sol, lang)} em ${focoSol}. ${pSat ? `Saturno em ${sn(pSat.signo?.nome, lang)}, Casa ${pSat.casa}: constrói com paciência aqui.` : ''} ${pJup ? ` Júpiter na Casa ${pJup.casa} abre portas quando te esticas além do conforto.` : ''} ${pMar ? ` Marte em ${sn(pMar.signo?.nome, lang)} alimenta acção decisiva em ${getTemaCasa(pMar.casa, lang)?.foco || 'a sua casa'}.` : ''} As efemérides oferecem o mapa - as tuas escolhas traçam o caminho.`,
    en: `Practical path: act with ${sn(sol, lang)} courage in ${focoSol}. ${pSat ? `Saturn in ${sn(pSat.signo?.nome, lang)}, House ${pSat.casa}: build patiently here.` : ''} ${pJup ? ` Jupiter in House ${pJup.casa} opens doors when you stretch beyond comfort.` : ''} ${pMar ? ` Mars in ${sn(pMar.signo?.nome, lang)} fuels decisive action in ${getTemaCasa(pMar.casa, lang)?.foco || 'its house'}.` : ''} The ephemerides offer the map - your choices trace the path.`,
    es: `Camino práctico: actúa con coraje de ${sn(sol, lang)} en ${focoSol}. ${pSat ? `Saturno en ${sn(pSat.signo?.nome, lang)}, Casa ${pSat.casa}: construye con paciencia aquí.` : ''} ${pJup ? ` Júpiter en Casa ${pJup.casa} abre puertas cuando te estiras más allá del confort.` : ''} ${pMar ? ` Marte en ${sn(pMar.signo?.nome, lang)} alimenta acción decisiva en ${getTemaCasa(pMar.casa, lang)?.foco || 'su casa'}.` : ''} Las efemérides ofrecen la carta: tus elecciones trazan el camino.`,
    it: `Percorso pratico: agisci con coraggio di ${sn(sol, lang)} in ${focoSol}. ${pSat ? `Saturno in ${sn(pSat.signo?.nome, lang)}, Casa ${pSat.casa}: costruisci con pazienza qui.` : ''} ${pJup ? ` Giove in Casa ${pJup.casa} apre porte quando ti allontani dal comfort.` : ''} ${pMar ? ` Marte in ${sn(pMar.signo?.nome, lang)} alimenta azione decisiva in ${getTemaCasa(pMar.casa, lang)?.foco || 'la sua casa'}.` : ''} Le effemeridi offrono la carta: le tue scelte tracciano il cammino.`,
    de: `Praktischer Weg: handle mit ${sn(sol, lang)}-Mut in ${focoSol}. ${pSat ? `Saturn in ${sn(pSat.signo?.nome, lang)}, Haus ${pSat.casa}: baue hier geduldig.` : ''} ${pJup ? ` Jupiter im Haus ${pJup.casa} öffnet Türen, wenn du über Komfort hinauswächst.` : ''} ${pMar ? ` Mars in ${sn(pMar.signo?.nome, lang)} speist entschlossenes Handeln in ${getTemaCasa(pMar.casa, lang)?.foco || 'seinem Haus'}.` : ''} Die Ephemeriden bieten die Karte – deine Wahl zeichnet den Weg.`,
    fr: `Chemin pratique : agis avec le courage de ${sn(sol, lang)} dans ${focoSol}. ${pSat ? `Saturne en ${sn(pSat.signo?.nome, lang)}, Maison ${pSat.casa} : construis patiemment ici.` : ''} ${pJup ? ` Jupiter en Maison ${pJup.casa} ouvre des portes quand tu t'étires au-delà du confort.` : ''} ${pMar ? ` Mars en ${sn(pMar.signo?.nome, lang)} alimente l'action décisive dans ${getTemaCasa(pMar.casa, lang)?.foco || 'sa maison'}.` : ''} Les éphémérides offrent la carte – tes choix tracent le chemin.`,
  })

  return { titulo, texto, conselho }
}
