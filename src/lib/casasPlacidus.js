/**
 * Casas Placidus - Tropical
 * Atribuição de planetas às casas a partir das cúspides Swiss Ephemeris.
 */

export const TEMAS_CASA = {
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

export const TEMAS_CASA_EN = {
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
  12: { nome: 'Unconscious & Spirituality',  foco: 'dreams, retreat, karma, compassion and what works behind the scenes' },
}

export function getTemaCasa(casa, lang = 'pt') {
  const map = lang === 'en' ? TEMAS_CASA_EN : TEMAS_CASA
  return map[casa] || null
}

/** Normaliza cúspides vindas do Swiss Ephemeris (12 valores, casa 1 = índice 0). */
export function normalizarCusps(houses) {
  if (!houses) return null

  const raw = houses.cusps ?? houses.house ?? houses.houses ?? null
  if (Array.isArray(raw) && raw.length >= 12) {
    if (raw.length >= 13 && raw[0] === 0) return raw.slice(1, 13).map(normalizarGraus)
    if (raw.length === 13) return raw.slice(1, 13).map(normalizarGraus)
    return raw.slice(0, 12).map(normalizarGraus)
  }

  if (houses.ascendant != null) {
    return cuspsEqualHouse(houses.ascendant)
  }
  return null
}

/** Casas iguais a partir do Ascendente (fallback quando SWE indisponível). */
export function cuspsEqualHouse(ascLon) {
  const asc = normalizarGraus(ascLon)
  return Array.from({ length: 12 }, (_, i) => normalizarGraus(asc + i * 30))
}

function normalizarGraus(g) {
  return ((g % 360) + 360) % 360
}

/** Determina em que casa (1–12) está um planeta pela longitude eclíptica. */
export function casaDoPlaneta(longitude, cusps) {
  if (!cusps || cusps.length < 12) return null
  const lon = normalizarGraus(longitude)

  for (let h = 0; h < 12; h++) {
    const c1 = normalizarGraus(cusps[h])
    const c2 = normalizarGraus(cusps[(h + 1) % 12])
    if (c1 < c2) {
      if (lon >= c1 && lon < c2) return h + 1
    } else if (lon >= c1 || lon < c2) {
      return h + 1
    }
  }
  return 1
}

/** Anexa `.casa` a cada planeta. */
export function atribuirCasasPlanetas(planetas, cusps) {
  if (!cusps) return planetas
  return planetas.map(p => ({
    ...p,
    casa: casaDoPlaneta(p.longitude, cusps),
  }))
}

export function planetaPorNome(planetas, nome) {
  return planetas.find(p => p.nome === nome) ?? null
}
