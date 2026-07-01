/** Rascunho preenchido na landing (/login) → pré-preenche o onboarding (/comecar). */
export const LANDING_DRAFT_KEY = 'sidus_landing_draft'

const FIELD_KEYS = {
  nome: 'sidus_landing_nome',
  data: 'sidus_landing_data',
  hora: 'sidus_landing_hora',
  cidade: 'sidus_landing_cidade',
  localizacao: 'sidus_landing_localizacao',
  fuso: 'sidus_landing_fuso',
}

function parseLocalizacao(raw) {
  if (!raw) return null
  if (typeof raw === 'object') return raw
  try {
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    return null
  }
}

function parseFuso(raw) {
  if (raw == null || raw === '') return null
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw
  const asNum = parseFloat(raw)
  if (Number.isFinite(asNum) && String(raw).trim() !== '') return asNum
  if (typeof raw === 'string' && raw.trim()) return raw.trim()
  return null
}

function readField(key) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

/** Lê rascunho (JSON ou chaves individuais). Devolve null se vazio. */
export function readLandingDraft() {
  try {
    const raw = readField(LANDING_DRAFT_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed === 'object') {
        return normalizeDraft(parsed)
      }
    }
  } catch {
    /* formato inválido - tentar chaves individuais */
  }

  const nome = readField(FIELD_KEYS.nome)?.trim() || ''
  const data = readField(FIELD_KEYS.data)?.trim() || ''
  const hora = readField(FIELD_KEYS.hora)?.trim() || ''
  const cidade = readField(FIELD_KEYS.cidade)?.trim() || ''
  const localizacao = parseLocalizacao(readField(FIELD_KEYS.localizacao))
  const fuso = parseFuso(readField(FIELD_KEYS.fuso))

  if (!nome && !data && !hora && !cidade && !localizacao) return null

  return normalizeDraft({ nome, data, hora, cidade, localizacao, fuso })
}

function asStr(val) {
  if (typeof val === 'string') return val
  if (val == null) return ''
  return String(val)
}

function normalizeDraft(parsed) {
  const draft = {
    nome: asStr(parsed.nome).trim(),
    data: asStr(parsed.data).trim(),
    hora: asStr(parsed.hora).trim(),
    cidade: asStr(parsed.cidade).trim(),
    localizacao: parseLocalizacao(parsed.localizacao),
    fuso: parseFuso(parsed.fuso),
  }

  if (!draft.nome && !draft.data && !draft.hora && !draft.cidade && !draft.localizacao) {
    return null
  }

  return draft
}

/** Remove rascunho da landing após consumir no onboarding. */
export function clearLandingDraft() {
  try {
    localStorage.removeItem(LANDING_DRAFT_KEY)
    Object.values(FIELD_KEYS).forEach((key) => localStorage.removeItem(key))
  } catch {
    /* modo privado / quota */
  }
}

/** Guarda rascunho na landing (JSON único + chaves individuais). */
export function saveLandingDraft(partial) {
  if (!partial || typeof partial !== 'object') return
  try {
    const existing = readLandingDraft() || {}
    const next = normalizeDraft({ ...existing, ...partial })
    if (!next) {
      clearLandingDraft()
      return
    }
    localStorage.setItem(LANDING_DRAFT_KEY, JSON.stringify(next))
    if (next.nome) localStorage.setItem(FIELD_KEYS.nome, next.nome)
    if (next.data) localStorage.setItem(FIELD_KEYS.data, next.data)
    if (next.hora) localStorage.setItem(FIELD_KEYS.hora, next.hora)
    if (next.cidade) localStorage.setItem(FIELD_KEYS.cidade, next.cidade)
    if (next.localizacao) {
      localStorage.setItem(FIELD_KEYS.localizacao, JSON.stringify(next.localizacao))
    }
    if (next.fuso != null) {
      localStorage.setItem(FIELD_KEYS.fuso, String(next.fuso))
    }
  } catch {
    /* quota / private mode */
  }
}
