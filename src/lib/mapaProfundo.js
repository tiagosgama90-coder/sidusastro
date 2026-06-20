/**
 * Interpretação profunda — secções 5 (transpessoais) e 6 (síntese).
 * Cada texto é único: signo, casa Placidus, graus, aspectos e Big 3.
 */
import { planetaPorNome, TEMAS_CASA } from './casasPlacidus.js'
import { translateSigno } from './i18n/astro.js'

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
  return translateSigno(normalizarSigno(signo), lang) || signo || '—'
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
    const asp = a.aspecto === 'Conjuncao' ? (lang === 'en' ? 'conjunction' : 'conjunção')
      : a.aspecto === 'Trigono' ? (lang === 'en' ? 'trine' : 'trígono')
        : a.aspecto === 'Oposicao' ? (lang === 'en' ? 'opposition' : 'oposição')
          : a.aspecto === 'Quadratura' ? (lang === 'en' ? 'square' : 'quadratura')
            : a.aspecto === 'Sextil' ? (lang === 'en' ? 'sextile' : 'sextil') : a.aspecto
    const signoOut = sn(pOut?.signo?.nome, lang)
    const casaOut = pOut?.casa
    if (lang === 'en') {
      return `${asp} with ${outro} in ${signoOut}${casaOut ? ` (House ${casaOut})` : ''} (orb ${a.orbe})`
    }
    return `${asp} com ${outro} em ${signoOut}${casaOut ? ` (Casa ${casaOut})` : ''} (orbe ${a.orbe})`
  })
  if (lang === 'en') return ` Active aspects: ${partes.join('; ')}.`
  return ` Aspectos activos: ${partes.join('; ')}.`
}

/** Núcleo único por planeta × signo (PT). */
const NUCLEO_PT = {
  Urano: {
    Carneiro: 'Urano aqui electrifica a identidade: precisas de autonomia radical e de iniciar rupturas que te libertem de papéis herdados.',
    Touro: 'Urano em Touro revoluciona valores, corpo e segurança material — mudanças lentas mas irreversíveis na forma como te relacionas com o terreno.',
    Gémeos: 'Urano em Gémeos traz mente relâmpago e ideias disruptivas; a comunicação é o canal da tua revolução pessoal.',
    Caranguejo: 'Urano no Caranguejo agita raízes, família e memória emocional — o lar pode ser simultaneamente refúgio e campo de libertação.',
    Leão: 'Urano em Leão reinventa a expressão criativa e o palco pessoal; autenticidade radical substitui a necessidade de aplauso.',
    Virgem: 'Urano em Virgem reforma hábitos, saúde e métodos de trabalho — inovação através do detalhe e da eficiência consciente.',
    Balança: 'Urano na Balança transforma contratos, parcerias e noções de justiça — relações não convencionais podem ser o teu caminho.',
    Escorpião: 'Urano em Escorpião desencadeia metamorfoses profundas em intimidade, poder e tabus — crises súbitas abrem portais de liberdade.',
    Sagitário: 'Urano em Sagitário expande horizontes com velocidade: viagens, filosofia e verdades radicais rompem dogmas.',
    Capricórnio: 'Urano em Capricórnio reestrutura carreira, autoridade e legado — revolução nas instituições que tocas.',
    Aquário: 'Urano em Aquário amplifica o arquétipo do visionário: colectivos, tecnologia e causas humanitárias são o teu fogo.',
    Peixes: 'Urano em Peixes dissolve fronteiras entre sonho e realidade — intuição súbita e espiritualidade não convencional.',
  },
  Neptuno: {
    Carneiro: 'Neptuno em Carneiro idealiza a coragem e o impulso — cuidado com ilusões sobre quem deves ser; a fé move-te, mas precisa de chão.',
    Touro: 'Neptuno em Touro espiritualiza o prazer e os sentidos — arte, natureza e beleza são portais; vigiar escapismos financeiros.',
    Gémeos: 'Neptuno em Gémeos nebuliza a mente com imaginação e poesia — inspiras através da palavra, mas clarifica factos de ficção.',
    Caranguejo: 'Neptuno no Caranguejo aprofunda empatia e memória afectiva — absorves ambientes; limites são o teu estudo espiritual.',
    Leão: 'Neptuno em Leão romantiza a criatividade e o coração — carisma magnético misturado com necessidade de ser visto com alma.',
    Virgem: 'Neptuno em Virgem santifica o serviço e o corpo — cura através do quotidiano; perfeccionismo pode mascarar confusão.',
    Balança: 'Neptuno na Balança idealiza o amor e a harmonia — seduzes com graça, mas aprendes a ver o outro sem projetos.',
    Escorpião: 'Neptuno em Escorpião mergulha no mistério, sexo sagrado e psique — magnetismo oculto e sensibilidade psíquica intensa.',
    Sagitário: 'Neptuno em Sagitário expande a fé e a visão mística — buscas verdades universais além das religiões convencionais.',
    Capricórnio: 'Neptuno em Capricórnio dissolve estruturas rígidas — vocação espiritual dentro de instituições ou renúncia a modelos vazios.',
    Aquário: 'Neptuno em Aquário inspira utopias e compaixão colectiva — sonhas futuros onde a humanidade se eleva.',
    Peixes: 'Neptuno em Peixes é o poeta cósmico em casa — compaixão ilimitada, arte e ligação ao invisível como vocação.',
  },
  Plutão: {
    Carneiro: 'Plutão em Carneiro forja identidade através de crises de poder — renasces quando te atreves a liderar sem medo.',
    Touro: 'Plutão em Touro transforma valores e posse — o que agarras com força é exactamente o que precisas de regenerar.',
    Gémeos: 'Plutão em Gémeos escava a mente — palavras têm poder de cura ou destruição; investigas verdades ocultas.',
    Caranguejo: 'Plutão no Caranguejo intensifica raízes e linhagem — karma familiar e cura ancestral são o teu subterrâneo.',
    Leão: 'Plutão em Leão purifica o ego criativo — o palco exige vulnerabilidade real para ter impacto transformador.',
    Virgem: 'Plutão em Virgem purga hábitos e corpo — obsessão pelo detalhe pode ser caminho de cura ou de controlo.',
    Balança: 'Plutão na Balança transforma relações — parcerias são forjas de poder partilhado e verdade nua.',
    Escorpião: 'Plutão em Escorpião é o xamã em casa — magnetismo, morte simbólica e renascimento são o teu idioma nativo.',
    Sagitário: 'Plutão em Sagitário converte crenças — filosofias morrem e renascem; ensinas o que sobreviveu ao fogo.',
    Capricórnio: 'Plutão em Capricórnio reestrutura legado e autoridade — poder institucional ou destruição de impérios pessoais.',
    Aquário: 'Plutão em Aquário transforma colectivos — revoluções sociais e tecnológicas tocam a tua alma.',
    Peixes: 'Plutão em Peixes dissolve o ego no oceano colectivo — compaixão radical e sacrifício consciente.',
  },
  'Nodo Norte': {
    Carneiro: 'Nodo Norte em Carneiro pede coragem individual — evoluis quando inicias, afirmas desejos e deixas a dependência do Nodo Sul em Balança.',
    Touro: 'Nodo Norte em Touro pede enraizamento — constróis valor duradouro, deixando o drama escorpiano do passado.',
    Gémeos: 'Nodo Norte em Gémeos pede curiosidade e diálogo — aprendes perguntando, libertando dogmas sagitarianos.',
    Caranguejo: 'Nodo Norte no Caranguejo pede intimidade e cuidado — honras emoções, largando a armadura capricorniana.',
    Leão: 'Nodo Norte em Leão pede expressão criativa e coração — brilhas com autenticidade, não com dispersão aquariana.',
    Virgem: 'Nodo Norte em Virgem pede serviço e discernimento — refinas o quotidiano, transcendendo nebulosidade pisciana.',
    Balança: 'Nodo Norte na Balança pede parceria consciente — co-crias, deixando o carneirino solitário.',
    Escorpião: 'Nodo Norte em Escorpião pede profundidade e entrega — mergulhas na verdade, largando conforto taurino.',
    Sagitário: 'Nodo Norte em Sagitário pede sentido e expansão — filosofia viva substitui mentalidade gémea dispersa.',
    Capricórnio: 'Nodo Norte em Capricórnio pede responsabilidade e legado — constróis com disciplina, superando caranguejo retraído.',
    Aquário: 'Nodo Norte em Aquário pede visão colectiva — serves o futuro, transcendendo ego leonino.',
    Peixes: 'Nodo Norte em Peixes pede entrega espiritual — compaixão e imaginação curam o crítico virgem do passado.',
  },
  Quíron: {
    Carneiro: 'Quíron em Carneiro — ferida na identidade e na coragem; curas outros a iniciar quando aceitas a tua vulnerabilidade guerreira.',
    Touro: 'Quíron em Touro — ferida em valor e corpo; ensinas estabilidade a quem duvida do seu merecimento sensorial.',
    Gémeos: 'Quíron em Gémeos — ferida na comunicação e na mente; a tua voz torna-se medicina para quem não sabe expressar-se.',
    Caranguejo: 'Quíron no Caranguejo — ferida em pertença e família; acolhes quem não teve lar emocional seguro.',
    Leão: 'Quíron em Leão — ferida no brilho e na criatividade; libertas outros a brilhar quando deixas de competir por atenção.',
    Virgem: 'Quíron em Virgem — ferida no perfeccionismo e no corpo; curas através do serviço humilde e imperfeito.',
    Balança: 'Quíron na Balança — ferida em relações e justiça; tornas-te mediador de corações partidos.',
    Escorpião: 'Quíron em Escorpião — ferida em intimidade e poder; guias transformações que outros temem enfrentar.',
    Sagitário: 'Quíron em Sagitário — ferida em fé e sentido; ensinas esperança a quem perdeu a orientação.',
    Capricórnio: 'Quíron em Capricórnio — ferida em autoridade e sucesso; constróis pontes para quem foi excluído das estruturas.',
    Aquário: 'Quíron em Aquário — ferida em pertença ao grupo; abraças excluídos e inovadores feridos.',
    Peixes: 'Quíron em Peixes — ferida na fé e nos limites; curas através da compaixão sem te perderes no outro.',
  },
}

/** EN mirror — unique per sign. */
const NUCLEO_EN = {
  Urano: {
    Aries: 'Uranus here electrifies identity: you need radical autonomy and ruptures that free you from inherited roles.',
    Taurus: 'Uranus in Taurus revolutionises values, body and material security — slow but irreversible shifts in how you hold ground.',
    Gemini: 'Uranus in Gemini brings lightning mind and disruptive ideas; communication is your revolution channel.',
    Cancer: 'Uranus in Cancer stirs roots, family and emotional memory — home is both refuge and liberation field.',
    Leo: 'Uranus in Leo reinvents creative expression and personal stage; radical authenticity replaces applause hunger.',
    Virgo: 'Uranus in Virgo reforms habits, health and work methods — innovation through detail and conscious efficiency.',
    Libra: 'Uranus in Libra transforms contracts, partnerships and justice — unconventional bonds may be your path.',
    Scorpio: 'Uranus in Scorpio triggers deep metamorphosis in intimacy, power and taboo — sudden crises open freedom portals.',
    Sagittarius: 'Uranus in Sagittarius expands horizons fast: travel, philosophy and radical truths break dogma.',
    Capricorn: 'Uranus in Capricorn restructures career, authority and legacy — revolution in institutions you touch.',
    Aquarius: 'Uranus in Aquarius amplifies the visionary archetype: collectives, tech and humanitarian causes are your fire.',
    Pisces: 'Uranus in Pisces dissolves dream-reality borders — sudden intuition and unconventional spirituality.',
  },
  Neptuno: {
    Aries: 'Neptune in Aries idealises courage and impulse — beware illusions about who you must be; faith moves you but needs grounding.',
    Taurus: 'Neptune in Taurus spiritualises pleasure and senses — art, nature and beauty are portals; watch financial escapism.',
    Gemini: 'Neptune in Gemini clouds mind with imagination and poetry — you inspire through words but must separate fact from fiction.',
    Cancer: 'Neptune in Cancer deepens empathy and affective memory — you absorb environments; boundaries are your spiritual study.',
    Leo: 'Neptune in Leo romanticises creativity and heart — magnetic charisma mixed with need to be seen with soul.',
    Virgo: 'Neptune in Virgo sanctifies service and body — healing through daily life; perfectionism may mask confusion.',
    Libra: 'Neptune in Libra idealises love and harmony — you seduce with grace but learn to see others without projection.',
    Scorpio: 'Neptune in Scorpio dives into mystery, sacred sexuality and psyche — hidden magnetism and intense psychic sensitivity.',
    Sagittarius: 'Neptune in Sagittarius expands faith and mystical vision — you seek universal truths beyond conventional religion.',
    Capricorn: 'Neptune in Capricorn dissolves rigid structures — spiritual vocation within institutions or renouncing empty models.',
    Aquarius: 'Neptune in Aquarius inspires utopias and collective compassion — you dream futures where humanity ascends.',
    Pisces: 'Neptune in Pisces is the cosmic poet at home — boundless compassion, art and connection to the invisible as vocation.',
  },
  Plutão: {
    Aries: 'Pluto in Aries forges identity through power crises — you are reborn when you dare to lead without fear.',
    Taurus: 'Pluto in Taurus transforms values and possession — what you grip hardest is what you must regenerate.',
    Gemini: 'Pluto in Gemini excavates the mind — words heal or destroy; you investigate hidden truths.',
    Cancer: 'Pluto in Cancer intensifies roots and lineage — family karma and ancestral healing are your underground.',
    Leo: 'Pluto in Leo purifies creative ego — the stage demands real vulnerability for transformative impact.',
    Virgo: 'Pluto in Virgo purges habits and body — obsession with detail can be healing path or control.',
    Libra: 'Pluto in Libra transforms relationships — partnerships are forges of shared power and naked truth.',
    Scorpio: 'Pluto in Scorpio is the shaman at home — magnetism, symbolic death and rebirth are your native language.',
    Sagittarius: 'Pluto in Sagittarius converts beliefs — philosophies die and rebirth; you teach what survived the fire.',
    Capricorn: 'Pluto in Capricorn restructures legacy and authority — institutional power or destruction of personal empires.',
    Aquarius: 'Pluto in Aquarius transforms collectives — social and technological revolutions touch your soul.',
    Pisces: 'Pluto in Pisces dissolves ego into the collective ocean — radical compassion and conscious sacrifice.',
  },
  'Nodo Norte': {
    Aries: 'North Node in Aries asks individual courage — you evolve by initiating and asserting desires, leaving Libra South Node dependency.',
    Taurus: 'North Node in Taurus asks grounding — you build lasting value, releasing Scorpio South Node drama.',
    Gemini: 'North Node in Gemini asks curiosity and dialogue — you learn by questioning, freeing Sagittarius dogma.',
    Cancer: 'North Node in Cancer asks intimacy and care — you honour emotions, dropping Capricorn armour.',
    Leo: 'North Node in Leo asks creative expression and heart — you shine authentically, not Aquarian dispersion.',
    Virgo: 'North Node in Virgo asks service and discernment — you refine daily life, transcending Piscean fog.',
    Libra: 'North Node in Libra asks conscious partnership — you co-create, leaving solitary Aries behind.',
    Scorpio: 'North Node in Scorpio asks depth and surrender — you dive into truth, releasing Taurus comfort.',
    Sagittarius: 'North Node in Sagittarius asks meaning and expansion — living philosophy replaces scattered Gemini mind.',
    Capricorn: 'North Node in Capricorn asks responsibility and legacy — you build with discipline, overcoming retracted Cancer.',
    Aquarius: 'North Node in Aquarius asks collective vision — you serve the future, transcending Leo ego.',
    Pisces: 'North Node in Pisces asks spiritual surrender — compassion and imagination heal the critical Virgo past.',
  },
  Quíron: {
    Aries: 'Chiron in Aries — wound in identity and courage; you heal others to begin when you accept warrior vulnerability.',
    Taurus: 'Chiron in Taurus — wound in value and body; you teach stability to those who doubt sensory worth.',
    Gemini: 'Chiron in Gemini — wound in communication and mind; your voice becomes medicine for the inarticulate.',
    Cancer: 'Chiron in Cancer — wound in belonging and family; you shelter those without safe emotional home.',
    Leo: 'Chiron in Leo — wound in shine and creativity; you free others to glow when you stop competing for attention.',
    Virgo: 'Chiron in Virgo — wound in perfectionism and body; you heal through humble, imperfect service.',
    Libra: 'Chiron in Libra — wound in relationships and justice; you become mediator of broken hearts.',
    Scorpio: 'Chiron in Scorpio — wound in intimacy and power; you guide transformations others fear.',
    Sagittarius: 'Chiron in Sagittarius — wound in faith and meaning; you teach hope to the disoriented.',
    Capricorn: 'Chiron in Capricorn — wound in authority and success; you build bridges for those excluded from structures.',
    Aquarius: 'Chiron in Aquarius — wound in group belonging; you embrace wounded outsiders and innovators.',
    Pisces: 'Chiron in Pisces — wound in faith and boundaries; you heal through compassion without losing yourself.',
  },
}

function nucleoPlaneta(nome, signo, lang) {
  const chave = normalizarSigno(signo)
  if (lang === 'en') {
    const enSign = sn(chave, 'en')
    return NUCLEO_EN[nome]?.[enSign] || NUCLEO_PT[nome]?.[chave] || ''
  }
  return NUCLEO_PT[nome]?.[chave] || ''
}

function blocoCasa(casa, lang) {
  if (!casa) return ''
  const t = TEMAS_CASA[casa]
  if (!t) return ''
  if (lang === 'en') {
    return ` In House ${casa} (${t.nome}), this energy manifests concretely in ${t.foco}.`
  }
  return ` Na ${casa}ª Casa (${t.nome}), esta energia manifesta-se concretamente em ${t.foco}.`
}

function blocoDecan(graus, signo, lang) {
  const d = decan(graus)
  const s = sn(signo, lang)
  const elem = ELEMENTO[normalizarSigno(signo)]
  if (lang === 'en') {
    if (d === 'inicial') return ` At ${graus}° (${d} ${s}), the ${elem} impulse is raw and initiating.`
    if (d === 'central') return ` At ${graus}° (mid-${s}), the ${elem} theme is fully embodied and tested.`
    return ` At ${graus}° (late ${s}), the ${elem} lesson matures toward integration and release.`
  }
  if (d === 'inicial') return ` A ${graus}° (decanato inicial de ${s}), o impulso de ${elem} é cru e iniciador.`
  if (d === 'central') return ` A ${graus}° (decanato central de ${s}), o tema de ${elem} está plenamente corporizado e testado.`
  return ` A ${graus}° (decanato final de ${s}), a lição de ${elem} amadurece para integração e desapego.`
}

function blocoBig3(nome, signo, mapaNatal, lang) {
  const sol = normalizarSigno(mapaNatal?.solar?.nome)
  const lua = normalizarSigno(mapaNatal?.lunar?.nome)
  const chave = normalizarSigno(signo)
  if (!sol && !lua) return ''
  const elemPlan = ELEMENTO[chave]
  const elemSol = ELEMENTO[sol]
  const elemLua = ELEMENTO[lua]
  if (lang === 'en') {
    if (elemPlan === elemSol) return ` This ${nome} placement resonates with your Sun in ${sn(sol, lang)} (${elemSol}) — identity and transpersonal theme speak the same elemental language.`
    if (elemPlan === elemLua) return ` This ${nome} echoes your Moon in ${sn(lua, lang)} (${elemLua}) — the emotional body recognises this frequency instinctively.`
    return ` Against your Sun–Moon axis (${sn(sol, lang)}/${sn(lua, lang)}), this ${nome} in ${sn(chave, lang)} asks conscious translation between different inner languages.`
  }
  if (elemPlan === elemSol) return ` Este ${nome} ressoa com o teu Sol em ${sn(sol, lang)} (${elemSol}) — identidade e tema transpessoal falam a mesma linguagem elemental.`
  if (elemPlan === elemLua) return ` Este ${nome} ecoa a tua Lua em ${sn(lua, lang)} (${elemLua}) — o corpo emocional reconhece esta frequência instintivamente.`
  return ` Frente ao eixo Sol–Lua (${sn(sol, lang)}/${sn(lua, lang)}), este ${nome} em ${sn(chave, lang)} pede tradução consciente entre idiomas internos diferentes.`
}

function blocoNodoSul(signo, lang) {
  const chave = normalizarSigno(signo)
  const sul = OPOSTO[chave]
  if (!sul) return ''
  if (lang === 'en') return ` South Node in ${sn(sul, lang)}: comfortable patterns to release on this path.`
  return ` Nodo Sul em ${sn(sul, lang)}: padrões confortáveis a largar neste caminho.`
}

/**
 * Secção 5 — interpretação única por planeta transpessoal.
 */
export function interpretarTranspessoal(nome, planeta, mapaNatal, aspetos, planetas, lang = 'pt') {
  if (!planeta) return ''
  const signo = planeta.signo?.nome
  const graus = planeta.signo?.graus
  const casa = planeta.casa
  const retro = planeta.retrograde

  let texto = nucleoPlaneta(nome, signo, lang)
  texto += blocoCasa(casa, lang)
  texto += blocoDecan(graus, signo, lang)
  texto += blocoBig3(nome, signo, mapaNatal, lang)
  if (nome === 'Nodo Norte') texto += blocoNodoSul(signo, lang)
  texto += textoAspectos(nome, aspetos, planetas, lang)
  if (retro) {
    texto += lang === 'en'
      ? ' Retrograde: the theme works inwardly — revision before external revolution.'
      : ' Retrógrado: o tema opera interiormente — revisão antes da revolução externa.'
  }
  const motor = mapaNatal?.motor || 'Swiss Ephemeris'
  texto += lang === 'en'
    ? ` (${motor} · ${(graus || '0')}° ecliptic).`
    : ` (${motor} · ${(graus || '0')}° eclíptica).`
  return texto
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
 * Secção 6 — síntese evolutiva única por mapa.
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
    const aspNome = tenso.aspecto === 'Oposicao' ? (lang === 'en' ? 'Opposition' : 'Oposição')
      : (lang === 'en' ? 'Square' : 'Quadratura')
    const titulo = lang === 'en'
      ? `${aspNome} ${pA} · ${pB} (orb ${tenso.orbe})`
      : `${aspNome} ${pA} · ${pB} (orbe ${tenso.orbe})`

    let texto
    if (lang === 'en') {
      texto = `Your chart's primary evolutionary tension is the ${aspNome} between ${pA} in ${sn(posA?.signo?.nome, lang)}${posA?.casa ? ` (House ${posA.casa})` : ''} and ${pB} in ${sn(posB?.signo?.nome, lang)}${posB?.casa ? ` (House ${posB.casa})` : ''}. `
      texto += `With Sun in ${sn(sol, lang)}, Moon in ${sn(lua, lang)} and Ascendant in ${sn(asc, lang)}, this aspect colours how you balance ${TEMAS_CASA[posA?.casa]?.foco || 'one life sphere'} with ${TEMAS_CASA[posB?.casa]?.foco || 'another'}. `
      texto += `The friction is fuel: maturity comes from negotiating both poles rather than silencing one.`
    } else {
      texto = `A tensão evolutiva central do teu mapa é a ${aspNome} entre ${pA} em ${sn(posA?.signo?.nome, lang)}${posA?.casa ? ` (Casa ${posA.casa})` : ''} e ${pB} em ${sn(posB?.signo?.nome, lang)}${posB?.casa ? ` (Casa ${posB.casa})` : ''}. `
      texto += `Com Sol em ${sn(sol, lang)}, Lua em ${sn(lua, lang)} e Ascendente em ${sn(asc, lang)}, este aspecto colore como equilibras ${TEMAS_CASA[posA?.casa]?.foco || 'uma esfera da vida'} com ${TEMAS_CASA[posB?.casa]?.foco || 'outra'}. `
      texto += `O atrito é combustível: a maturidade nasce de negociar os dois polos em vez de silenciar um.`
    }

    const conselho = lang === 'en'
      ? `When conflict rises between ${pA} and ${pB}, pause: each voice guards a legitimate need. Integrating this ${aspNome} is your chart's master key.`
      : `Quando o conflito surgir entre ${pA} e ${pB}, pausa: cada voz guarda uma necessidade legítima. Integrar esta ${aspNome} é a chave-mestra do teu mapa.`

    return { titulo, texto, conselho }
  }

  // Sem aspecto tenso dominante — síntese pelo fingerprint do mapa
  const titulo = lang === 'en' ? 'Evolutionary signature' : 'Assinatura evolutiva'

  let texto
  if (lang === 'en') {
    texto = `No dominant square or opposition among major aspects — your growth path is subtler but equally specific. `
    texto += `Dominant element: ${elemDom || 'mixed'} across personal planets. `
    if (harm) {
      const hA = nomeAspeto(harm.planetaA)
      const hB = nomeAspeto(harm.planetaB)
      texto += `Your greatest natural resource is the ${harm.aspecto} between ${hA} and ${hB} (orb ${harm.orbe}) — lean on this alliance consciously. `
    }
    if (hub) texto += `${hub} is the most connected planet in your chart — life lessons orbit this archetype. `
    if (pNod) texto += `North Node in ${sn(pNod.signo?.nome, lang)}${pNod.casa ? `, House ${pNod.casa}` : ''} points your soul toward ${TEMAS_CASA[pNod.casa]?.foco || 'evolutionary growth'}. `
    texto += `Sun ${sn(sol, lang)} · Moon ${sn(lua, lang)} · Asc ${sn(asc, lang)} · MC ${sn(mc, lang)} form a unique psychic fingerprint no generic horoscope can replicate.`
  } else {
    texto = `Não há quadratura ou oposição dominante nos aspectos maiores — o teu caminho de crescimento é mais subtil mas igualmente específico. `
    texto += `Elemento dominante: ${elemDom || 'misto'} nos planetas pessoais. `
    if (harm) {
      const hA = nomeAspeto(harm.planetaA)
      const hB = nomeAspeto(harm.planetaB)
      texto += `O teu maior recurso natural é o ${harm.aspecto} entre ${hA} e ${hB} (orbe ${harm.orbe}) — apoia-te conscientemente nesta aliança. `
    }
    if (hub) texto += `${hub} é o planeta mais conectado do mapa — as lições de vida orbitam este arquétipo. `
    if (pNod) texto += `Nodo Norte em ${sn(pNod.signo?.nome, lang)}${pNod.casa ? `, Casa ${pNod.casa}` : ''} aponta a alma para ${TEMAS_CASA[pNod.casa]?.foco || 'crescimento evolutivo'}. `
    texto += `Sol ${sn(sol, lang)} · Lua ${sn(lua, lang)} · Asc ${sn(asc, lang)} · MC ${sn(mc, lang)} formam uma assinatura psíquica que nenhum horóscopo genérico replica.`
  }

  const pSol = planetaPorNome(planetas, 'Sol')
  const conselho = lang === 'en'
    ? `Practical path: act with ${sn(sol, lang)} courage in ${TEMAS_CASA[pSol?.casa]?.foco || 'your solar house'}. `
      + `${pSat ? `Saturn in ${sn(pSat.signo?.nome, lang)}, House ${pSat.casa}: build patiently here.` : ''} `
      + `${pJup ? ` Jupiter in House ${pJup.casa} opens doors when you stretch beyond comfort.` : ''} `
      + `${pMar ? ` Mars in ${sn(pMar.signo?.nome, lang)} fuels decisive action in ${TEMAS_CASA[pMar.casa]?.foco || 'its house'}.` : ''} `
      + `The ephemerides offer the map — your choices trace the path.`
    : `Caminho prático: age com coragem de ${sn(sol, lang)} em ${TEMAS_CASA[pSol?.casa]?.foco || 'tua casa solar'}. `
      + `${pSat ? `Saturno em ${sn(pSat.signo?.nome, lang)}, Casa ${pSat.casa}: constrói com paciência aqui.` : ''} `
      + `${pJup ? ` Júpiter na Casa ${pJup.casa} abre portas quando te esticas além do conforto.` : ''} `
      + `${pMar ? ` Marte em ${sn(pMar.signo?.nome, lang)} alimenta acção decisiva em ${TEMAS_CASA[pMar.casa]?.foco || 'a sua casa'}.` : ''} `
      + `As efemérides oferecem o mapa — as tuas escolhas traçam o caminho.`

  return { titulo, texto, conselho }
}
