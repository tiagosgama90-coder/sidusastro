/**
 * Fluxo Vital - biorritmo + astrologia profissional (efemérides reais).
 */
import { Body, Ecliptic, GeoVector, MakeTime } from 'astronomy-engine'
import { calcularFaseLua } from './faseLua.js'
import { SIGNOS_PT, SIGNO_EN_TO_PT, translateSigno, translateElemento, translatePlaneta, translateAspecto, translateModalidade } from './i18n/astro.js'
import { contentForLang } from './i18n/langUtil.js'

const ALIAS_SIGNO = {
  Áries: 'Carneiro', Aries: 'Carneiro',
  Câncer: 'Caranguejo', Cancer: 'Caranguejo',
  Gêmeos: 'Gémeos', Gemeos: 'Gémeos', Gemini: 'Gémeos',
  Escorpião: 'Escorpião', Escorpiao: 'Escorpião', Scorpio: 'Escorpião',
}

const Position = (corpo, time) => GeoVector(corpo, time, true)

const ELEMENTO = {
  Carneiro: 'Fogo', Touro: 'Terra', Gémeos: 'Ar', Caranguejo: 'Água',
  Leão: 'Fogo', Virgem: 'Terra', Balança: 'Ar', Escorpião: 'Água',
  Sagitário: 'Fogo', Capricórnio: 'Terra', Aquário: 'Ar', Peixes: 'Água',
}

function normalizarSigno(nome) {
  if (!nome) return nome
  if (ELEMENTO[nome]) return nome
  if (ALIAS_SIGNO[nome]) return ALIAS_SIGNO[nome]
  if (SIGNO_EN_TO_PT[nome]) return SIGNO_EN_TO_PT[nome]
  return nome
}

const MODALIDADE = {
  Carneiro: 'Cardinal', Touro: 'Fixo', Gémeos: 'Mutável', Caranguejo: 'Cardinal',
  Leão: 'Fixo', Virgem: 'Mutável', Balança: 'Cardinal', Escorpião: 'Fixo',
  Sagitário: 'Mutável', Capricórnio: 'Cardinal', Aquário: 'Fixo', Peixes: 'Mutável',
}

const PLANETA_REGENTE = {
  Carneiro: 'Marte', Touro: 'Vénus', Gémeos: 'Mercúrio', Caranguejo: 'Lua',
  Leão: 'Sol', Virgem: 'Mercúrio', Balança: 'Vénus', Escorpião: 'Marte',
  Sagitário: 'Júpiter', Capricórnio: 'Saturno', Aquário: 'Saturno', Peixes: 'Júpiter',
}

const NATUREZA_I18N = {
  fusão: { pt: 'fusão', en: 'fusion', es: 'fusión', it: 'fusione', de: 'Verschmelzung', fr: 'fusion' },
  oportunidade: { pt: 'oportunidade', en: 'opportunity', es: 'oportunidad', it: 'opportunità', de: 'Gelegenheit', fr: 'opportunité' },
  tensão: { pt: 'tensão', en: 'tension', es: 'tensión', it: 'tensione', de: 'Spannung', fr: 'tension' },
  fluidez: { pt: 'fluidez', en: 'flow', es: 'fluidez', it: 'fluidità', de: 'Fluss', fr: 'fluidité' },
  polaridade: { pt: 'polaridade', en: 'polarity', es: 'polaridad', it: 'polarità', de: 'Polarität', fr: 'polarité' },
  estável: { pt: 'estável', en: 'stable', es: 'estable', it: 'stabile', de: 'stabil', fr: 'stable' },
}

const CICLO_NOME = {
  physical: { pt: 'Físico', en: 'Physical', es: 'Físico', it: 'Fisico', de: 'Physisch', fr: 'Physique' },
  emotional: { pt: 'Emocional', en: 'Emotional', es: 'Emocional', it: 'Emotivo', de: 'Emotional', fr: 'Émotionnel' },
  intellectual: { pt: 'Intelectual', en: 'Intellectual', es: 'Intelectual', it: 'Intellettuale', de: 'Intellektuell', fr: 'Intellectuel' },
}

function tn(natureza, lang) {
  return contentForLang(lang, NATUREZA_I18N[natureza]) || natureza
}

function longitudeParaSigno(longitude) {
  const lon = ((longitude % 360) + 360) % 360
  const idx = Math.floor(lon / 30)
  return SIGNOS_PT[idx]
}

function indiceSigno(nome) {
  const i = SIGNOS_PT.indexOf(nome)
  return i >= 0 ? i : 0
}

function diferencaAngular(a, b) {
  const diff = Math.abs(a - b) % 360
  return diff > 180 ? 360 - diff : diff
}

function aspectoPorAngulo(angle) {
  if (angle <= 8) return { tipo: 'conjunção', score: 88, natureza: 'fusão' }
  if (Math.abs(angle - 60) <= 6) return { tipo: 'sextil', score: 78, natureza: 'oportunidade' }
  if (Math.abs(angle - 90) <= 7) return { tipo: 'quadratura', score: 42, natureza: 'tensão' }
  if (Math.abs(angle - 120) <= 7) return { tipo: 'trígono', score: 92, natureza: 'fluidez' }
  if (Math.abs(angle - 180) <= 8) return { tipo: 'oposição', score: 38, natureza: 'polaridade' }
  return { tipo: 'neutro', score: 55, natureza: 'estável' }
}

function aspectoEntreLongitudes(lonA, lonB) {
  return aspectoPorAngulo(diferencaAngular(lonA, lonB))
}

function calcularCeuMomento(date = new Date()) {
  const time = MakeTime(date)
  const lonSol = Ecliptic(Position(Body.Sun, time)).elon
  const lonLua = Ecliptic(Position(Body.Moon, time)).elon
  return {
    sol: { longitude: lonSol, signo: longitudeParaSigno(lonSol) },
    lua: { longitude: lonLua, signo: longitudeParaSigno(lonLua) },
  }
}

function signoNatalLongitude(nomeSigno, mapaNatal) {
  if (!nomeSigno || !mapaNatal) return null
  if (mapaNatal.solar?.nome === nomeSigno) return ((mapaNatal.solar.graus ?? 0) + indiceSigno(nomeSigno) * 30) % 360
  if (mapaNatal.lunar?.nome === nomeSigno) return ((mapaNatal.lunar.graus ?? 0) + indiceSigno(nomeSigno) * 30) % 360
  return indiceSigno(nomeSigno) * 30 + 15
}

function faseLunarTxt(faseLua, lang) {
  const ilum = {
    pt: 'iluminada',
    en: 'illuminated',
    es: 'iluminada',
    it: 'illuminata',
    de: 'beleuchtet',
    fr: 'illuminée',
  }
  const word = contentForLang(lang, ilum) || ilum.en
  return `${faseLua.emoji} ${faseLua.nome} - ${faseLua.iluminacao}% ${word}. ${faseLua.desc}`
}

function ritmoElementarTxt({ solar, lunar, ceu, aspectoSol, lang }) {
  const ts = (s) => translateSigno(s, lang)
  const te = (e) => translateElemento(e, lang)
  const tp = (p) => translatePlaneta(p, lang)
  const ta = (a) => translateAspecto(a, lang)
  const elSol = ELEMENTO[solar]
  const elLua = ELEMENTO[lunar]
  const modSol = translateModalidade(MODALIDADE[solar], lang)
  const regente = PLANETA_REGENTE[ceu.sol.signo]
  const solTr = ts(ceu.sol.signo)
  const asp = ta(aspectoSol.tipo)
  const nat = tn(aspectoSol.natureza, lang)

  return contentForLang(lang, {
    pt: `Eixo natal ${elSol}/${elLua} (${modSol}). Hoje o Sol transita ${ceu.sol.signo} (${ELEMENTO[ceu.sol.signo]}), regido por ${regente}, em ${aspectoSol.tipo} com o teu Sol natal - ${aspectoSol.natureza} de energia. A Lua em ${ceu.lua.signo} modula o ritmo emocional do dia.`,
    en: `Natal axis ${te(elSol)}/${te(elLua)} (${modSol}). Today the Sun transits ${solTr} (${te(ELEMENTO[ceu.sol.signo])}), ruled by ${tp(regente)}, ${asp} your natal Sun - ${nat} energy. The Moon in ${ts(ceu.lua.signo)} shapes today's emotional rhythm.`,
    es: `Eje natal ${te(elSol)}/${te(elLua)} (${modSol}). Hoy el Sol transita ${solTr} (${te(ELEMENTO[ceu.sol.signo])}), regido por ${tp(regente)}, en ${asp} con tu Sol natal - energía de ${nat}. La Luna en ${ts(ceu.lua.signo)} modula el ritmo emocional del día.`,
    it: `Asse natale ${te(elSol)}/${te(elLua)} (${modSol}). Oggi il Sole transita ${solTr} (${te(ELEMENTO[ceu.sol.signo])}), regolato da ${tp(regente)}, in ${asp} con il tuo Sole natale - energia di ${nat}. La Luna in ${ts(ceu.lua.signo)} modula il ritmo emotivo della giornata.`,
    de: `Natalachse ${te(elSol)}/${te(elLua)} (${modSol}). Heute transitiert die Sonne ${solTr} (${te(ELEMENTO[ceu.sol.signo])}), regiert von ${tp(regente)}, im ${asp} zu deiner Geburts-Sonne - ${nat} Energie. Der Mond in ${ts(ceu.lua.signo)} prägt den emotionalen Rhythmus des Tages.`,
    fr: `Axe natal ${te(elSol)}/${te(elLua)} (${modSol}). Aujourd'hui le Soleil transite ${solTr} (${te(ELEMENTO[ceu.sol.signo])}), régi par ${tp(regente)}, en ${asp} avec ton Soleil natal - énergie de ${nat}. La Lune en ${ts(ceu.lua.signo)} module le rythme émotionnel du jour.`,
  })
}

function ritmoSimplesTxt(ceu, lang) {
  const ts = (s) => translateSigno(s, lang)
  const te = (e) => translateElemento(e, lang)
  return contentForLang(lang, {
    pt: `Sol em ${ceu.sol.signo}, Lua em ${ceu.lua.signo}. Observa como o elemento ${ELEMENTO[ceu.sol.signo]} colore a tua energia hoje.`,
    en: `Sun in ${ts(ceu.sol.signo)}, Moon in ${ts(ceu.lua.signo)}. Notice how ${te(ELEMENTO[ceu.sol.signo])} colours your energy today.`,
    es: `Sol en ${ts(ceu.sol.signo)}, Luna en ${ts(ceu.lua.signo)}. Observa cómo el elemento ${te(ELEMENTO[ceu.sol.signo])} colorea tu energía hoy.`,
    it: `Sole in ${ts(ceu.sol.signo)}, Luna in ${ts(ceu.lua.signo)}. Osserva come l'elemento ${te(ELEMENTO[ceu.sol.signo])} colora la tua energia oggi.`,
    de: `Sonne in ${ts(ceu.sol.signo)}, Mond in ${ts(ceu.lua.signo)}. Beachte, wie das Element ${te(ELEMENTO[ceu.sol.signo])} deine Energie heute färbt.`,
    fr: `Soleil en ${ts(ceu.sol.signo)}, Lune en ${ts(ceu.lua.signo)}. Observe comment l'élément ${te(ELEMENTO[ceu.sol.signo])} colore ton énergie aujourd'hui.`,
  })
}

function luaNatalTxt(lunar, aspectoLua, lang) {
  const ts = (s) => translateSigno(s, lang)
  const te = (e) => translateElemento(e, lang)
  const ta = (a) => translateAspecto(a, lang)
  const harmonia = {
    pt: { high: 'Emoções fluem com clareza - bom momento para diálogo íntimo.', low: 'Sensibilidade amplificada; protege o espaço emocional.', mid: 'Equilíbrio entre razão e sentimento nas decisões.' },
    en: { high: 'Emotions flow clearly - good for intimate dialogue.', low: 'Heightened sensitivity; protect emotional space.', mid: 'Balance reason and feeling in decisions.' },
    es: { high: 'Las emociones fluyen con claridad: buen momento para diálogo íntimo.', low: 'Sensibilidad amplificada; protege el espacio emocional.', mid: 'Equilibrio entre razón y sentimiento en las decisiones.' },
    it: { high: 'Le emozioni fluiscono con chiarezza: buon momento per dialogo intimo.', low: 'Sensibilità amplificata; proteggi lo spazio emotivo.', mid: 'Equilibrio tra ragione e sentimento nelle decisioni.' },
    de: { high: 'Emotionen fließen klar - gut für intimen Dialog.', low: 'Erhöhte Sensibilität; schütze den emotionalen Raum.', mid: 'Gleichgewicht zwischen Verstand und Gefühl bei Entscheidungen.' },
    fr: { high: 'Les émotions coulent avec clarté - bon moment pour un dialogue intime.', low: 'Sensibilité amplifiée ; protège ton espace émotionnel.', mid: 'Équilibre entre raison et sentiment dans les décisions.' },
  }
  const h = harmonia[lang] || harmonia.en
  const nota = aspectoLua.score >= 75 ? h.high : aspectoLua.score <= 45 ? h.low : h.mid
  const harmWord = { pt: 'harmonia', en: 'harmony', es: 'armonía', it: 'armonia', de: 'Harmonie', fr: 'harmonie' }

  return contentForLang(lang, {
    pt: `Lua natal em ${lunar} (${ELEMENTO[lunar]}): trânsito lunar em ${aspectoLua.tipo} (${aspectoLua.score}% harmonia). ${nota}`,
    en: `Natal Moon in ${ts(lunar)} (${te(ELEMENTO[lunar])}): lunar transit ${ta(aspectoLua.tipo)} (${aspectoLua.score}% ${harmWord.en}). ${nota}`,
    es: `Luna natal en ${ts(lunar)} (${te(ELEMENTO[lunar])}): tránsito lunar en ${ta(aspectoLua.tipo)} (${aspectoLua.score}% ${harmWord.es}). ${nota}`,
    it: `Luna natale in ${ts(lunar)} (${te(ELEMENTO[lunar])}): transito lunare in ${ta(aspectoLua.tipo)} (${aspectoLua.score}% ${harmWord.it}). ${nota}`,
    de: `Geburtsmond in ${ts(lunar)} (${te(ELEMENTO[lunar])}): Mondtransit im ${ta(aspectoLua.tipo)} (${aspectoLua.score}% ${harmWord.de}). ${nota}`,
    fr: `Lune natale en ${ts(lunar)} (${te(ELEMENTO[lunar])}): transit lunaire en ${ta(aspectoLua.tipo)} (${aspectoLua.score}% ${harmWord.fr}). ${nota}`,
  })
}

function ascendenteTxt(ascendente, fisico, lang) {
  const ts = (s) => translateSigno(s, lang)
  const body = {
    pt: { high: 'corpo pede expressão visível e movimento', low: 'privilegia descanso e rotinas suaves', mid: 'presença equilibrada no mundo exterior' },
    en: { high: 'body asks for visible expression and movement', low: 'favour rest and gentle routines', mid: 'balanced presence outward' },
    es: { high: 'el cuerpo pide expresión visible y movimiento', low: 'privilegia descanso y rutinas suaves', mid: 'presencia equilibrada en el mundo exterior' },
    it: { high: 'il corpo chiede espressione visibile e movimento', low: 'privilegia riposo e routine delicate', mid: 'presenza equilibrata nel mondo esterno' },
    de: { high: 'der Körper verlangt sichtbaren Ausdruck und Bewegung', low: 'bevorzuge Ruhe und sanfte Routinen', mid: 'ausgewogene Präsenz nach außen' },
    fr: { high: 'le corps demande expression visible et mouvement', low: 'privilégie le repos et des routines douces', mid: 'présence équilibrée vers l\'extérieur' },
  }
  const b = body[lang] || body.en
  const nota = fisico > 30 ? b.high : fisico < -30 ? b.low : b.mid
  const cycle = { pt: 'ciclo físico', en: 'physical cycle', es: 'ciclo físico', it: 'ciclo fisico', de: 'physischer Zyklus', fr: 'cycle physique' }

  return contentForLang(lang, {
    pt: `Ascendente em ${ascendente}: ciclo físico a ${Math.round(fisico)}% - ${nota}.`,
    en: `Ascendant in ${ts(ascendente)}: ${cycle.en} at ${Math.round(fisico)}% - ${nota}.`,
    es: `Ascendente en ${ts(ascendente)}: ${cycle.es} al ${Math.round(fisico)}% - ${nota}.`,
    it: `Ascendente in ${ts(ascendente)}: ${cycle.it} al ${Math.round(fisico)}% - ${nota}.`,
    de: `Aszendent in ${ts(ascendente)}: ${cycle.de} bei ${Math.round(fisico)}% - ${nota}.`,
    fr: `Ascendant en ${ts(ascendente)}: ${cycle.fr} à ${Math.round(fisico)}% - ${nota}.`,
  })
}

function estrategiaTxt({ cruzCritica, todosAltos, algumBaixo, fisico, emocional, intelectual, faseLua, lang }) {
  if (cruzCritica) {
    return contentForLang(lang, {
      pt: '⚠ Cruz crítica bio-rítmica: dois ou mais ciclos em transição. Evita decisões irreversíveis e competição intensa. Prioriza sono, hidratação e tarefas de baixo risco. A Lua aconselha recolhimento.',
      en: '⚠ Biorhythm critical cross: two or more cycles in transition. Avoid irreversible decisions and intense competition. Prioritise sleep, hydration and low-risk tasks. The Moon advises withdrawal.',
      es: '⚠ Cruz crítica biorrítmica: dos o más ciclos en transición. Evita decisiones irreversibles y competición intensa. Prioriza sueño, hidratación y tareas de bajo riesgo. La Luna aconseja recogimiento.',
      it: '⚠ Croce critica bioritmica: due o più cicli in transizione. Evita decisioni irreversibili e competizione intensa. Priorizza sonno, idratazione e compiti a basso rischio. La Luna consiglia ritiro.',
      de: '⚠ Kritischer Biorhythmus-Kreuzung: zwei oder mehr Zyklen in Übergang. Vermeide irreversible Entscheidungen und intensive Konkurrenz. Priorisiere Schlaf, Hydration und risikoarme Aufgaben. Der Mond rät zum Rückzug.',
      fr: '⚠ Croix critique biorythmique : deux cycles ou plus en transition. Évite les décisions irréversibles et la compétition intense. Priorise sommeil, hydratation et tâches à faible risque. La Lune conseille le retrait.',
    })
  }
  if (todosAltos) {
    return contentForLang(lang, {
      pt: '✦ Janela de alto rendimento: físico, emocional e intelectual alinhados. O trânsito solar favorável sustenta negociações, apresentações e treino. Aproveita a fase lunar para materializar intenções.',
      en: '✦ High-performance window: physical, emotional and intellectual cycles aligned. Favourable solar transit supports negotiations, presentations and training. Use the lunar phase to manifest intentions.',
      es: '✦ Ventana de alto rendimiento: ciclos físico, emocional e intelectual alineados. El tránsito solar favorable sustenta negociaciones, presentaciones y entrenamiento. Aprovecha la fase lunar para materializar intenciones.',
      it: '✦ Finestra ad alte prestazioni: cicli fisico, emotivo e intellettuale allineati. Il transito solare favorevole sostiene negoziazioni, presentazioni e allenamento. Sfrutta la fase lunare per materializzare le intenzioni.',
      de: '✦ Hochleistungsfenster: körperliche, emotionale und intellektuelle Zyklen im Einklang. Günstiger Sonnentransit unterstützt Verhandlungen, Präsentationen und Training. Nutze die Mondphase, um Absichten zu manifestieren.',
      fr: '✦ Fenêtre haute performance : cycles physique, émotionnel et intellectuel alignés. Le transit solaire favorable soutient négociations, présentations et entraînement. Utilise la phase lunaire pour matérialiser tes intentions.',
    })
  }
  if (algumBaixo) {
    const foco = fisico <= emocional && fisico <= intelectual
      ? contentForLang(lang, { pt: 'corpo', en: 'body', es: 'cuerpo', it: 'corpo', de: 'Körper', fr: 'corps' })
      : emocional <= intelectual
        ? contentForLang(lang, { pt: 'emoções', en: 'emotions', es: 'emociones', it: 'emozioni', de: 'Emotionen', fr: 'émotions' })
        : contentForLang(lang, { pt: 'mente', en: 'mind', es: 'mente', it: 'mente', de: 'Geist', fr: 'esprit' })
    const luaAlta = faseLua.iluminacao > 50
    const luaTxt = luaAlta
      ? contentForLang(lang, {
        pt: 'Lua gibosa/cheia pede integração antes de agir',
        en: 'gibbous/full Moon asks integration before action',
        es: 'Luna gibosa/llena pide integración antes de actuar',
        it: 'Luna gibbosa/piena chiede integrazione prima di agire',
        de: 'zunehmender/voller Mond verlangt Integration vor dem Handeln',
        fr: 'Lune gibbeuse/pleine demande intégration avant d\'agir',
      })
      : contentForLang(lang, {
        pt: 'Lua minguante favorece libertação do que esgota',
        en: 'waning Moon favours releasing what drains you',
        es: 'Luna menguante favorece liberar lo que agota',
        it: 'Luna calante favorisce il rilascio di ciò che esaurisce',
        de: 'abnehmender Mond begünstigt Loslassen dessen, was erschöpft',
        fr: 'Lune décroissante favorise libérer ce qui épuise',
      })
    return contentForLang(lang, {
      pt: `✦ Recuperação no eixo ${foco}. Delega, reduz estímulos e foca numa prioridade. Astrologia: ${luaTxt}.`,
      en: `✦ Recovery on the ${foco} axis. Delegate, reduce stimuli and focus on one priority. Astrology: ${luaTxt}.`,
      es: `✦ Recuperación en el eje ${foco}. Delega, reduce estímulos y enfócate en una prioridad. Astrología: ${luaTxt}.`,
      it: `✦ Recupero sull'asse ${foco}. Delega, riduci stimoli e concentrati su una priorità. Astrologia: ${luaTxt}.`,
      de: `✦ Erholung auf der ${foco}-Achse. Delegiere, reduziere Reize und fokussiere eine Priorität. Astrologie: ${luaTxt}.`,
      fr: `✦ Récupération sur l'axe ${foco}. Délègue, réduis les stimuli et concentre-toi sur une priorité. Astrologie : ${luaTxt}.`,
    })
  }
  return contentForLang(lang, {
    pt: '✦ Dia misto: usa o pico intelectual para planear, o emocional para relações e o físico para rotinas leves. Sincroniza com o trânsito lunar actual.',
    en: '✦ Mixed day: use intellectual peak to plan, emotional for relationships and physical for light routines. Sync with the current lunar transit.',
    es: '✦ Día mixto: usa el pico intelectual para planificar, el emocional para relaciones y el físico para rutinas ligeras. Sincroniza con el tránsito lunar actual.',
    it: '✦ Giornata mista: usa il picco intellettuale per pianificare, quello emotivo per le relazioni e quello fisico per routine leggere. Sincronizzati con il transito lunare attuale.',
    de: '✦ Gemischter Tag: nutze intellektuellen Höhepunkt zum Planen, emotional für Beziehungen und körperlich für leichte Routinen. Synchronisiere mit dem aktuellen Mondtransit.',
    fr: '✦ Journée mixte : utilise le pic intellectuel pour planifier, l\'émotionnel pour les relations et le physique pour des routines légères. Synchronise-toi avec le transit lunaire actuel.',
  })
}

export function analisarFluxoVital({ fisico, emocional, intelectual, mapaNatal, lang = 'pt' }) {
  const hoje = new Date()
  const ceu = calcularCeuMomento(hoje)
  const faseLua = calcularFaseLua(hoje, lang)

  const solar = normalizarSigno(mapaNatal?.solar?.nome)
  const lunar = normalizarSigno(mapaNatal?.lunar?.nome)
  const ascendente = normalizarSigno(mapaNatal?.ascendente?.nome)

  const cruzCritica = [fisico, emocional, intelectual].filter((v) => Math.abs(v) < 15).length >= 2
  const todosAltos = fisico > 50 && emocional > 50 && intelectual > 50
  const algumBaixo = fisico < -40 || emocional < -40 || intelectual < -40

  const lonSolNatal = solar ? signoNatalLongitude(solar, mapaNatal) : null
  const lonLuaNatal = lunar ? signoNatalLongitude(lunar, mapaNatal) : null

  const aspectoSol = lonSolNatal != null
    ? aspectoEntreLongitudes(ceu.sol.longitude, lonSolNatal)
    : aspectoEntreSignos(ceu.sol.signo, solar)

  const aspectoLua = lonLuaNatal != null
    ? aspectoEntreLongitudes(ceu.lua.longitude, lonLuaNatal)
    : aspectoEntreSignos(ceu.lua.signo, lunar)

  const faseTxt = faseLunarTxt(faseLua, lang)

  let ritmoElementar = ''
  if (solar && lunar) {
    ritmoElementar = ritmoElementarTxt({ solar, lunar, ceu, aspectoSol, lang })
  } else {
    ritmoElementar = ritmoSimplesTxt(ceu, lang)
  }

  let luaNatal = ''
  if (lunar && aspectoLua) {
    luaNatal = luaNatalTxt(lunar, aspectoLua, lang)
  }

  let ascendenteNota = ''
  if (ascendente) {
    ascendenteNota = ascendenteTxt(ascendente, fisico, lang)
  }

  const estrategia = estrategiaTxt({ cruzCritica, todosAltos, algumBaixo, fisico, emocional, intelectual, faseLua, lang })

  const picos = [
    { nome: contentForLang(lang, CICLO_NOME.physical), val: fisico, cor: '#FB923C' },
    { nome: contentForLang(lang, CICLO_NOME.emotional), val: emocional, cor: '#F472B6' },
    { nome: contentForLang(lang, CICLO_NOME.intellectual), val: intelectual, cor: '#60A5FA' },
  ].sort((a, b) => b.val - a.val)

  return {
    faseLunar: faseTxt,
    ritmoElementar,
    luaNatal,
    ascendenteNota,
    estrategia,
    cruzCritica,
    picoDominante: picos[0],
    valeDominante: picos[2],
    signoTransito: ceu.sol.signo,
    signoLuaTransito: ceu.lua.signo,
    aspectoSol,
    aspectoLua,
  }
}

function aspectoEntreSignos(a, b) {
  if (!a || !b) return { tipo: 'neutro', score: 55, natureza: 'estável' }
  const diff = Math.abs(indiceSigno(a) - indiceSigno(b)) % 12
  const d = diff > 6 ? 12 - diff : diff
  const angulo = [0, 60, 90, 120, 180].find((x) => x === d * 30) ?? d * 30
  return aspectoPorAngulo(angulo === 0 && d === 0 ? 0 : d * 30)
}
