/**
 * Relatórios de sinastria — secções personalizadas Premium vs resumo grátis.
 */
import { compatibilidadeSolarGratis } from './sinastriaEngine.js'
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
    titulo: { pt: 'Atração Sexual e Química', en: 'Sexual Attraction & Chemistry' },
    planetas: { pt: 'Marte · Vénus', en: 'Mars · Venus' },
  },
  emocao: {
    titulo: { pt: 'Sintonia Emocional', en: 'Emotional Harmony' },
    planetas: { pt: 'Sol · Lua', en: 'Sun · Moon' },
  },
  comunicacao: {
    titulo: { pt: 'Comunicação e Diálogo', en: 'Communication & Dialogue' },
    planetas: { pt: 'Mercúrio', en: 'Mercury' },
  },
  futuro: {
    titulo: { pt: 'Projetos e Futuro', en: 'Projects & Future' },
    planetas: { pt: 'Júpiter · Saturno', en: 'Jupiter · Saturn' },
  },
}

/** Secções estruturadas para UI Premium — textos longos e personalizados. */
export function montarSecoesPremium(resultado, mapaNatal, lang = 'pt') {
  if (!resultado) return null
  const { pilares, porPilar, posA, posB } = resultado
  const nomeA = posA?.nome || mapaNatal?.nome || (lang === 'en' ? 'You' : 'Tu')
  const nomeB = posB?.nome || (lang === 'en' ? 'Partner' : 'Parceiro(a)')

  return {
    intro: {
      titulo: lang === 'en' ? 'Your personal synastry' : 'A tua sinastria pessoal',
      texto: narrativaIntroSinastria(nomeA, nomeB, Math.round(resultado.pontuacao), lang),
    },
    quimica: {
      titulo: EIXOS.quimica.titulo[lang] || EIXOS.quimica.titulo.pt,
      score: pilares.quimica,
      texto: narrativaQuimica(posA, posB, porPilar.quimica || [], lang),
    },
    emocao: {
      titulo: EIXOS.emocao.titulo[lang] || EIXOS.emocao.titulo.pt,
      score: pilares.emocao,
      texto: narrativaEmocao(posA, posB, porPilar.emocao || [], lang),
    },
    comunicacao: {
      titulo: EIXOS.comunicacao.titulo[lang] || EIXOS.comunicacao.titulo.pt,
      score: pilares.comunicacao,
      texto: narrativaComunicacao(posA, posB, porPilar.comunicacao || [], lang),
    },
    futuro: {
      titulo: EIXOS.futuro.titulo[lang] || EIXOS.futuro.titulo.pt,
      score: pilares.futuro,
      texto: narrativaFuturo(posA, posB, porPilar.futuro || [], lang),
    },
    missaoA: {
      titulo: lang === 'en' ? `${nomeA}'s life mission` : `Missão de vida — ${nomeA}`,
      texto: narrativaMissaoIndividual(posA, lang),
    },
    missaoB: {
      titulo: lang === 'en' ? `${nomeB}'s life mission` : `Missão de vida — ${nomeB}`,
      texto: narrativaMissaoIndividual(posB, lang),
    },
    missaoRelacionamento: {
      titulo: lang === 'en' ? 'Relationship Mission · Soul Purpose' : 'Missão de Relacionamento · Propósito de Alma',
      texto: narrativaMissaoRelacionamento(resultado, lang),
    },
    mapaComposto: {
      titulo: lang === 'en' ? 'Composite Chart' : 'Mapa Composto',
      texto: narrativaMapaComposto(resultado.mapaComposto, nomeA, nomeB, lang),
    },
    nodos: {
      titulo: lang === 'en' ? 'Lunar Nodes · Soul Contract' : 'Nodos Lunares · Contrato de Alma',
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
  const nomeB = resultado.posB?.nome || (lang === 'en' ? 'your partner' : 'o(a) parceiro(a)')

  if (lang === 'en') {
    return [
      `**General preview — ${mapaNatal?.nome || 'You'} & ${nomeB}**`,
      '',
      compat.texto,
      '',
      `Overall tone: **${resultado.pontuacao >= 70 ? 'promising' : resultado.pontuacao >= 50 ? 'moderate' : 'demanding'}** (~${Math.round(resultado.pontuacao / 5) * 5}%).`,
      '',
      'Premium unlocks personalized readings for each pillar (chemistry, emotion, communication, future), each person\'s life mission, Relationship Mission with lunar nodes, karmic bond analysis and the full Composite Chart — the vibration of your bond as one entity.',
    ].join('\n')
  }
  return [
    `**Pré-visualização — ${mapaNatal?.nome || 'Tu'} e ${nomeB}**`,
    '',
    compat.texto,
    '',
    `Tom geral: **${resultado.pontuacao >= 70 ? 'promissor' : resultado.pontuacao >= 50 ? 'moderado' : 'exigente'}** (~${Math.round(resultado.pontuacao / 5) * 5}%).`,
    '',
    'O Premium desbloqueia leituras personalizadas dos 4 pilares, missão de vida de cada um, Missão de Relacionamento com nodos lunares, análise de laço cármico e Mapa Composto completo — a vibração do vosso vínculo como entidade.',
  ].join('\n')
}

/** Relatório Premium completo (texto corrido para export/PDF). */
export function montarRelatorioSinastria(resultado, mapaNatal, lang = 'pt') {
  const secoes = montarSecoesPremium(resultado, mapaNatal, lang)
  if (!secoes) return ''

  const linhas = []
  const aviso = resultado.posA?.horaDesconhecida || resultado.posB?.horaDesconhecida
  if (aviso) {
    linhas.push(lang === 'en'
      ? '*Without exact birth time, Moon, Ascendant and Midheaven may be approximate. Sun, Jupiter, Saturn and lunar nodes remain precise.*'
      : '*Sem hora exacta, Lua, Ascendente e Meio-Céu podem ser aproximados. Sol, Júpiter, Saturno e nodos lunares mantêm precisão.*')
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
