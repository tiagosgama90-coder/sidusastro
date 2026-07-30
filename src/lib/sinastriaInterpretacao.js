/**
 * Relatórios de sinastria - secções personalizadas Premium vs resumo grátis.
 */
import { compatibilidadeSolarGratis } from './sinastriaEngine.js'
import { contentForLang } from './i18n/langUtil.js'
import { NOME_PADRAO_A, NOME_PADRAO_B } from './i18n/sinastriaStrings.js'
import {
  narrativaQuimica,
  narrativaEmocao,
  narrativaComunicacao,
  narrativaFuturo,
  narrativaMissaoIndividual,
  narrativaMissaoRelacionamento,
  narrativaMapaComposto,
  narrativaIntroSinastria,
} from './sinastriaNarrativas.js'

const EIXOS = {
  quimica: {
    titulo: {
      pt: 'Atração Sexual e Química', en: 'Sexual Attraction & Chemistry',
      es: 'Atracción Sexual y Química', it: 'Attrazione Sessuale e Chimica',
      de: 'Sexuelle Anziehung & Chemie', fr: 'Attraction Sexuelle et Alchimie',
    },
    planetas: {
      pt: 'Marte · Vénus', en: 'Mars · Venus', es: 'Marte · Venus',
      it: 'Marte · Venere', de: 'Mars · Venus', fr: 'Mars · Vénus',
    },
  },
  emocao: {
    titulo: {
      pt: 'Sintonia Emocional', en: 'Emotional Harmony',
      es: 'Sintonía Emocional', it: 'Sintonia Emotiva',
      de: 'Emotionale Harmonie', fr: 'Harmonie Émotionnelle',
    },
    planetas: {
      pt: 'Sol · Lua', en: 'Sun · Moon', es: 'Sol · Luna',
      it: 'Sole · Luna', de: 'Sonne · Mond', fr: 'Soleil · Lune',
    },
  },
  comunicacao: {
    titulo: {
      pt: 'Comunicação e Diálogo', en: 'Communication & Dialogue',
      es: 'Comunicación y Diálogo', it: 'Comunicazione e Dialogo',
      de: 'Kommunikation & Dialog', fr: 'Communication et Dialogue',
    },
    planetas: {
      pt: 'Mercúrio', en: 'Mercury', es: 'Mercurio',
      it: 'Mercurio', de: 'Merkur', fr: 'Mercure',
    },
  },
  futuro: {
    titulo: {
      pt: 'Projetos e Futuro', en: 'Projects & Future',
      es: 'Proyectos y Futuro', it: 'Progetti e Futuro',
      de: 'Projekte & Zukunft', fr: 'Projets et Avenir',
    },
    planetas: {
      pt: 'Júpiter · Saturno', en: 'Jupiter · Saturn', es: 'Júpiter · Saturno',
      it: 'Giove · Saturno', de: 'Jupiter · Saturn', fr: 'Jupiter · Saturne',
    },
  },
}

function eixoTitulo(eixo, lang) {
  return contentForLang(lang, eixo.titulo) || eixo.titulo.en
}

/** Secções estruturadas para UI Premium - textos longos e personalizados. */
export function montarSecoesPremium(resultado, mapaNatal, lang = 'pt') {
  if (!resultado) return null
  const { pilares, porPilar, posA, posB } = resultado
  const nomeA = posA?.nome || mapaNatal?.nome || contentForLang(lang, NOME_PADRAO_A)
  const nomeB = posB?.nome || contentForLang(lang, NOME_PADRAO_B)

  return {
    intro: {
      titulo: contentForLang(lang, {
        pt: 'A tua sinastria pessoal', en: 'Your personal synastry',
        es: 'Tu sinastría personal', it: 'La tua sinastria personale',
        de: 'Deine persönliche Synastrie', fr: 'Ta synastrie personnelle',
      }),
      texto: narrativaIntroSinastria(nomeA, nomeB, Math.round(resultado.pontuacao), lang),
    },
    quimica: {
      titulo: eixoTitulo(EIXOS.quimica, lang),
      score: pilares.quimica,
      texto: narrativaQuimica(posA, posB, porPilar.quimica || [], lang),
    },
    emocao: {
      titulo: eixoTitulo(EIXOS.emocao, lang),
      score: pilares.emocao,
      texto: narrativaEmocao(posA, posB, porPilar.emocao || [], lang),
    },
    comunicacao: {
      titulo: eixoTitulo(EIXOS.comunicacao, lang),
      score: pilares.comunicacao,
      texto: narrativaComunicacao(posA, posB, porPilar.comunicacao || [], lang),
    },
    futuro: {
      titulo: eixoTitulo(EIXOS.futuro, lang),
      score: pilares.futuro,
      texto: narrativaFuturo(posA, posB, porPilar.futuro || [], lang),
    },
    missaoA: {
      titulo: contentForLang(lang, {
        pt: `Missão de vida - ${nomeA}`, en: `${nomeA}'s life mission`,
        es: `Misión de vida - ${nomeA}`, it: `Missione di vita - ${nomeA}`,
        de: `Lebensmission - ${nomeA}`, fr: `Mission de vie - ${nomeA}`,
      }),
      texto: narrativaMissaoIndividual(posA, lang),
    },
    missaoB: {
      titulo: contentForLang(lang, {
        pt: `Missão de vida - ${nomeB}`, en: `${nomeB}'s life mission`,
        es: `Misión de vida - ${nomeB}`, it: `Missione di vita - ${nomeB}`,
        de: `Lebensmission - ${nomeB}`, fr: `Mission de vie - ${nomeB}`,
      }),
      texto: narrativaMissaoIndividual(posB, lang),
    },
    missaoRelacionamento: {
      titulo: contentForLang(lang, {
        pt: 'Missão de Relacionamento · Propósito de Alma',
        en: 'Relationship Mission · Soul Purpose',
        es: 'Misión de Relación · Propósito del Alma',
        it: 'Missione di Relazione · Scopo dell\'Anima',
        de: 'Beziehungsmission · Seelenauftrag',
        fr: 'Mission Relationnelle · But de l\'Âme',
      }),
      texto: narrativaMissaoRelacionamento(resultado, lang),
    },
    mapaComposto: {
      titulo: contentForLang(lang, {
        pt: 'Mapa Composto', en: 'Composite Chart',
        es: 'Carta Compuesta', it: 'Tema Composito',
        de: 'Komposit-Horoskop', fr: 'Thème Composite',
      }),
      texto: narrativaMapaComposto(resultado.mapaComposto, nomeA, nomeB, lang),
    },
    nodos: {
      titulo: contentForLang(lang, {
        pt: 'Nodos Lunares · Contrato de Alma',
        en: 'Lunar Nodes · Soul Contract',
        es: 'Nodos Lunares · Contrato del Alma',
        it: 'Nodi Lunari · Contratto dell\'Anima',
        de: 'Mondknoten · Seelenvertrag',
        fr: 'Nœuds Lunaires · Contrat d\'Âme',
      }),
      laçoCarmico: resultado.nodosSinastria?.laçoCarmico,
      activacaoProposito: resultado.nodosSinastria?.activacaoProposito,
      texto: narrativaMissaoRelacionamento(resultado, lang),
    },
  }
}

/** Resumo generalizado para utilizadores grátis. */
export function montarResumoGratis(resultado, mapaNatal, lang = 'pt') {
  if (!resultado) return ''
  const solA = mapaNatal?.solar?.nome || resultado.posA?.corpos?.sol?.signo
  const solB = resultado.posB?.corpos?.sol?.signo
  const compat = compatibilidadeSolarGratis(solA, solB, lang)
  const nomeA = mapaNatal?.nome || contentForLang(lang, NOME_PADRAO_A)
  const nomeB = resultado.posB?.nome || contentForLang(lang, NOME_PADRAO_B)
  const tom = resultado.pontuacao >= 70
    ? contentForLang(lang, { pt: 'promissor', en: 'promising', es: 'prometedor', it: 'promettente', de: 'vielversprechend', fr: 'prometteur' })
    : resultado.pontuacao >= 50
      ? contentForLang(lang, { pt: 'moderado', en: 'moderate', es: 'moderado', it: 'moderato', de: 'moderat', fr: 'modéré' })
      : contentForLang(lang, { pt: 'exigente', en: 'demanding', es: 'exigente', it: 'impegnativo', de: 'anspruchsvoll', fr: 'exigeant' })
  const pct = Math.round(resultado.pontuacao / 5) * 5

  return [
    contentForLang(lang, {
      pt: `Pré-visualização: ${nomeA} e ${nomeB}`,
      en: `Preview: ${nomeA} & ${nomeB}`,
      es: `Vista previa: ${nomeA} y ${nomeB}`,
      it: `Anteprima: ${nomeA} e ${nomeB}`,
      de: `Vorschau: ${nomeA} & ${nomeB}`,
      fr: `Aperçu: ${nomeA} et ${nomeB}`,
    }),
    '',
    compat.texto,
    '',
    contentForLang(lang, {
      pt: `Tom geral: ${tom} (~${pct}%).`,
      en: `Overall tone: ${tom} (~${pct}%).`,
      es: `Tono general: ${tom} (~${pct}%).`,
      it: `Tono generale: ${tom} (~${pct}%).`,
      de: `Gesamtton: ${tom} (~${pct}%).`,
      fr: `Ton général : ${tom} (~${pct}%).`,
    }),
    '',
    contentForLang(lang, {
      pt: 'O Premium desbloqueia leituras personalizadas dos 4 pilares, missão de vida de cada um, Missão de Relacionamento com nodos lunares, análise de laço cármico e Mapa Composto completo - a vibração do vosso vínculo como entidade.',
      en: 'Premium unlocks personalized readings for each pillar (chemistry, emotion, communication, future), each person\'s life mission, Relationship Mission with lunar nodes, karmic bond analysis and the full Composite Chart - the vibration of your bond as one entity.',
      es: 'Premium desbloquea lecturas personalizadas de los 4 pilares, misión de vida de cada uno, Misión de Relación con nodos lunares, análisis de lazo kármico y Carta Compuesta completa.',
      it: 'Premium sblocca letture personalizzate dei 4 pilastri, missione di vita di ciascuno, Missione di Relazione con nodi lunari, analisi del legame karmico e Tema Composito completo.',
      de: 'Premium schaltet personalisierte Lesungen der 4 Säulen, Lebensmission jedes Partners, Beziehungsmission mit Mondknoten, karmische Bindungsanalyse und vollständiges Komposit-Horoskop frei.',
      fr: 'Premium débloque des lectures personnalisées des 4 piliers, mission de vie de chacun, Mission Relationnelle avec nœuds lunaires, analyse du lien karmique et thème composite complet.',
    }),
  ].join('\n')
}

/** Relatório Premium completo (texto corrido para export/PDF). */
export function montarRelatorioSinastria(resultado, mapaNatal, lang = 'pt') {
  const secoes = montarSecoesPremium(resultado, mapaNatal, lang)
  if (!secoes) return ''

  const linhas = []
  const aviso = resultado.posA?.horaDesconhecida || resultado.posB?.horaDesconhecida
  if (aviso) {
    linhas.push(contentForLang(lang, {
      pt: '*Sem hora exacta, Lua, Ascendente e Meio-Céu podem ser aproximados. Sol, Júpiter, Saturno e nodos lunares mantêm precisão.*',
      en: '*Without exact birth time, Moon, Ascendant and Midheaven may be approximate. Sun, Jupiter, Saturn and lunar nodes remain precise.*',
      es: '*Sin hora exacta, Luna, Ascendente y Medio Cielo pueden ser aproximados. Sol, Júpiter, Saturno y nodos lunares mantienen precisión.*',
      it: '*Senza ora esatta, Luna, Ascendente e Medio Cielo possono essere approssimativi. Sole, Giove, Saturno e nodi lunari restano precisi.*',
      de: '*Ohne exakte Geburtszeit können Mond, Aszendent und Medium Coeli ungefähr sein. Sonne, Jupiter, Saturn und Mondknoten bleiben präzise.*',
      fr: '*Sans heure exacte, Lune, Ascendant et Milieu du Ciel peuvent être approximatifs. Soleil, Jupiter, Saturne et nœuds lunaires restent précis.*',
    }))
    linhas.push('')
  }

  if (secoes.intro?.texto) {
    linhas.push(secoes.intro.texto)
    linhas.push('')
  }

  for (const key of ['quimica', 'emocao', 'comunicacao', 'futuro']) {
    const s = secoes[key]
    linhas.push(`## ${s.titulo} (${s.score}%)`)
    linhas.push('')
    linhas.push(s.texto)
    linhas.push('')
  }

  linhas.push(`## ${secoes.missaoA.titulo}`)
  linhas.push('')
  linhas.push(secoes.missaoA.texto)
  linhas.push('')
  linhas.push(`## ${secoes.missaoB.titulo}`)
  linhas.push('')
  linhas.push(secoes.missaoB.texto)
  linhas.push('')
  linhas.push(`## ${secoes.missaoRelacionamento.titulo}`)
  linhas.push('')
  linhas.push(secoes.missaoRelacionamento.texto)
  linhas.push('')
  linhas.push(`## ${secoes.mapaComposto.titulo}`)
  linhas.push('')
  linhas.push(secoes.mapaComposto.texto)

  return linhas.join('\n')
}

export { EIXOS }
