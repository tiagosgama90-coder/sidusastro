/**
 * Fase lunar actual - cálculo via elongação Sol-Lua (efemérides astronomy-engine).
 */
import { Body, Ecliptic, GeoVector, MakeTime } from 'astronomy-engine'
import { contentForLang } from './i18n/langUtil.js'

const Position = (corpo, time) => GeoVector(corpo, time, true)

const FASES_PT = [
  { max: 22.5,  nome: 'Lua Nova',        emoji: '🌑', desc: 'Renovação e semeadura de intenções. Momento de introspecção e novos começos silenciosos.' },
  { max: 67.5,  nome: 'Lua Crescente',   emoji: '🌒', desc: 'Energia de construção e acção inicial. Planta os primeiros passos com coragem.' },
  { max: 112.5, nome: 'Quarto Crescente', emoji: '🌓', desc: 'Ponto de decisão e superação de obstáculos. Ajusta o rumo com clareza.' },
  { max: 157.5, nome: 'Lua Gibosa Crescente', emoji: '🌔', desc: 'Refinamento e preparação. Ajusta detalhes antes da plenitude.' },
  { max: 202.5, nome: 'Lua Cheia',       emoji: '🌕', desc: 'Culminação emocional e revelação. O que foi semeado manifesta-se com intensidade.' },
  { max: 247.5, nome: 'Lua Gibosa Minguante', emoji: '🌖', desc: 'Partilha e gratidão. Integra o que aprendeste no ciclo.' },
  { max: 292.5, nome: 'Quarto Minguante', emoji: '🌗', desc: 'Libertação e desapego consciente. Soltar o que já cumpriu o seu ciclo.' },
  { max: 337.5, nome: 'Lua Minguante',   emoji: '🌘', desc: 'Recolhimento e purificação. Prepara o terreno para o próximo renascimento.' },
  { max: 360,   nome: 'Lua Nova',        emoji: '🌑', desc: 'Renovação e semeadura de intenções. Momento de introspecção e novos começos silenciosos.' },
]

const FASES_EN = [
  { max: 22.5,  nome: 'New Moon',        emoji: '🌑', desc: 'Renewal and planting intentions. A time for introspection and quiet new beginnings.' },
  { max: 67.5,  nome: 'Waxing Crescent', emoji: '🌒', desc: 'Energy of building and initial action. Plant the first steps with courage.' },
  { max: 112.5, nome: 'First Quarter',   emoji: '🌓', desc: 'Decision point and overcoming obstacles. Adjust course with clarity.' },
  { max: 157.5, nome: 'Waxing Gibbous',  emoji: '🌔', desc: 'Refinement and preparation. Adjust details before fullness.' },
  { max: 202.5, nome: 'Full Moon',       emoji: '🌕', desc: 'Emotional culmination and revelation. What was sown manifests intensely.' },
  { max: 247.5, nome: 'Waning Gibbous',  emoji: '🌖', desc: 'Sharing and gratitude. Integrate what you learned in the cycle.' },
  { max: 292.5, nome: 'Last Quarter',    emoji: '🌗', desc: 'Liberation and conscious detachment. Release what has completed its cycle.' },
  { max: 337.5, nome: 'Waning Crescent', emoji: '🌘', desc: 'Withdrawal and purification. Prepare the ground for the next rebirth.' },
  { max: 360,   nome: 'New Moon',        emoji: '🌑', desc: 'Renewal and planting intentions. A time for introspection and quiet new beginnings.' },
]

const FASES_ES = [
  { max: 22.5,  nome: 'Luna Nueva',        emoji: '🌑', desc: 'Renovación y siembra de intenciones. Momento de introspección y nuevos comienzos silenciosos.' },
  { max: 67.5,  nome: 'Luna Creciente',   emoji: '🌒', desc: 'Energía de construcción y acción inicial. Planta los primeros pasos con valentía.' },
  { max: 112.5, nome: 'Cuarto Creciente', emoji: '🌓', desc: 'Punto de decisión y superación de obstáculos. Ajusta el rumbo con claridad.' },
  { max: 157.5, nome: 'Gibosa Creciente', emoji: '🌔', desc: 'Refinamiento y preparación. Ajusta detalles antes de la plenitud.' },
  { max: 202.5, nome: 'Luna Llena',       emoji: '🌕', desc: 'Culminación emocional y revelación. Lo sembrado se manifiesta con intensidad.' },
  { max: 247.5, nome: 'Gibosa Menguante', emoji: '🌖', desc: 'Compartir y gratitud. Integra lo aprendido en el ciclo.' },
  { max: 292.5, nome: 'Cuarto Menguante', emoji: '🌗', desc: 'Liberación y desapego consciente. Suelta lo que ya cumplió su ciclo.' },
  { max: 337.5, nome: 'Luna Menguante',   emoji: '🌘', desc: 'Recogimiento y purificación. Prepara el terreno para el próximo renacimiento.' },
  { max: 360,   nome: 'Luna Nueva',        emoji: '🌑', desc: 'Renovación y siembra de intenciones. Momento de introspección y nuevos comienzos silenciosos.' },
]

const FASES_IT = [
  { max: 22.5,  nome: 'Luna Nuova',        emoji: '🌑', desc: 'Rinnovamento e semina di intenzioni. Momento di introspezione e nuovi inizi silenziosi.' },
  { max: 67.5,  nome: 'Luna Crescente',   emoji: '🌒', desc: 'Energia di costruzione e azione iniziale. Pianta i primi passi con coraggio.' },
  { max: 112.5, nome: 'Primo Quarto', emoji: '🌓', desc: 'Punto di decisione e superamento degli ostacoli. Regola la rotta con chiarezza.' },
  { max: 157.5, nome: 'Gibbosa Crescente', emoji: '🌔', desc: 'Raffinamento e preparazione. Regola i dettagli prima della pienezza.' },
  { max: 202.5, nome: 'Luna Piena',       emoji: '🌕', desc: 'Culminazione emotiva e rivelazione. Ciò che è stato seminato si manifesta intensamente.' },
  { max: 247.5, nome: 'Gibbosa Calante', emoji: '🌖', desc: 'Condivisione e gratitudine. Integra ciò che hai imparato nel ciclo.' },
  { max: 292.5, nome: 'Ultimo Quarto', emoji: '🌗', desc: 'Liberazione e distacco consapevole. Lascia andare ciò che ha compiuto il suo ciclo.' },
  { max: 337.5, nome: 'Luna Calante',   emoji: '🌘', desc: 'Ritiro e purificazione. Prepara il terreno per la prossima rinascita.' },
  { max: 360,   nome: 'Luna Nuova',        emoji: '🌑', desc: 'Rinnovamento e semina di intenzioni. Momento di introspezione e nuovi inizi silenziosi.' },
]

const FASES_DE = [
  { max: 22.5,  nome: 'Neumond',        emoji: '🌑', desc: 'Erneuerung und Aussaat von Absichten. Zeit für Innenschau und stille Neuanfänge.' },
  { max: 67.5,  nome: 'Zunehmender Mond',   emoji: '🌒', desc: 'Energie des Aufbaus und ersten Handelns. Pflanze die ersten Schritte mit Mut.' },
  { max: 112.5, nome: 'Erstes Viertel', emoji: '🌓', desc: 'Entscheidungspunkt und Überwindung von Hindernissen. Kurs mit Klarheit anpassen.' },
  { max: 157.5, nome: 'Zunehmender Mond (gibbös)', emoji: '🌔', desc: 'Verfeinerung und Vorbereitung. Details vor der Fülle anpassen.' },
  { max: 202.5, nome: 'Vollmond',       emoji: '🌕', desc: 'Emotionale Kulmination und Offenbarung. Gesätes manifestiert sich intensiv.' },
  { max: 247.5, nome: 'Abnehmender Mond (gibbös)', emoji: '🌖', desc: 'Teilen und Dankbarkeit. Integriere, was du im Zyklus gelernt hast.' },
  { max: 292.5, nome: 'Letztes Viertel', emoji: '🌗', desc: 'Befreiung und bewusstes Loslassen. Lass gehen, was seinen Zyklus vollendet hat.' },
  { max: 337.5, nome: 'Abnehmender Mond',   emoji: '🌘', desc: 'Rückzug und Reinigung. Bereite den Boden für die nächste Wiedergeburt vor.' },
  { max: 360,   nome: 'Neumond',        emoji: '🌑', desc: 'Erneuerung und Aussaat von Absichten. Zeit für Innenschau und stille Neuanfänge.' },
]

const FASES_FR = [
  { max: 22.5,  nome: 'Nouvelle Lune',        emoji: '🌑', desc: 'Renouveau et semence d\'intentions. Moment d\'introspection et de nouveaux départs silencieux.' },
  { max: 67.5,  nome: 'Premier Croissant',   emoji: '🌒', desc: 'Énergie de construction et d\'action initiale. Plante les premiers pas avec courage.' },
  { max: 112.5, nome: 'Premier Quartier', emoji: '🌓', desc: 'Point de décision et dépassement des obstacles. Ajuste la route avec clarté.' },
  { max: 157.5, nome: 'Gibbeuse Croissante', emoji: '🌔', desc: 'Affinement et préparation. Ajuste les détails avant la plénitude.' },
  { max: 202.5, nome: 'Pleine Lune',       emoji: '🌕', desc: 'Culmination émotionnelle et révélation. Ce qui a été semé se manifeste intensément.' },
  { max: 247.5, nome: 'Gibbeuse Décroissante', emoji: '🌖', desc: 'Partage et gratitude. Intègre ce que tu as appris dans le cycle.' },
  { max: 292.5, nome: 'Dernier Quartier', emoji: '🌗', desc: 'Libération et détachement conscient. Lâche ce qui a accompli son cycle.' },
  { max: 337.5, nome: 'Dernier Croissant',   emoji: '🌘', desc: 'Recueillement et purification. Prépare le terrain pour la prochaine renaissance.' },
  { max: 360,   nome: 'Nouvelle Lune',        emoji: '🌑', desc: 'Renouveau et semence d\'intentions. Moment d\'introspection et de nouveaux départs silencieux.' },
]

const FASES_BY_LANG = { pt: FASES_PT, en: FASES_EN, es: FASES_ES, it: FASES_IT, de: FASES_DE, fr: FASES_FR }

export function calcularFaseLua(date = new Date(), lang = 'pt') {
  const time = MakeTime(date)
  const sunLon  = Ecliptic(Position(Body.Sun,  time)).elon
  const moonLon = Ecliptic(Position(Body.Moon, time)).elon
  const angulo  = ((moonLon - sunLon) % 360 + 360) % 360
  const iluminacao = Math.round((1 - Math.cos(angulo * Math.PI / 180)) / 2 * 100)

  const lista = contentForLang(lang, FASES_BY_LANG) || FASES_PT
  const faseFinal = lista.find(f => angulo < f.max) || lista[lista.length - 1]

  return {
    ...faseFinal,
    angulo: angulo.toFixed(1),
    iluminacao,
    longitudeLua: moonLon,
  }
}
