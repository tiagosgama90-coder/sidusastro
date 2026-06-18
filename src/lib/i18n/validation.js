import pt from './pt.js'
import en from './en.js'

const LOCALES = { pt, en }

function t(lang, key) {
  return key.split('.').reduce((o, k) => o?.[k], LOCALES[lang]) ?? key.split('.').reduce((o, k) => o?.[k], LOCALES.pt) ?? key
}

function nomePareceFalso(nome) {
  const limpo = nome.trim().toLowerCase().replace(/\s+/g, '')
  if (limpo.length < 3) return true
  if (/^(.)\1+$/.test(limpo)) return true
  if (/(.{1,2})\1{2,}/.test(limpo)) return true
  return false
}

function validarDataNascimento(data) {
  if (!data) return false
  const ano = parseInt(data.slice(0, 4), 10)
  const hoje = new Date()
  const limite = hoje.getFullYear()
  if (ano < 1800 || ano > limite) return false
  const d = new Date(data)
  return d <= hoje
}

function validarHora24(hora) {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(hora)
}

export function validarOnboarding(dados, lang = 'pt') {
  const erros = {}

  if (!dados.nome.trim()) erros.nome = t(lang, 'onboarding.errors.nomeRequired')
  else if (nomePareceFalso(dados.nome)) erros.nome = t(lang, 'onboarding.errors.nomeInvalid')

  if (!dados.data) erros.data = t(lang, 'onboarding.errors.dataRequired')
  else if (!validarDataNascimento(dados.data)) erros.data = t(lang, 'onboarding.errors.dataInvalid')

  if (!dados.hora) erros.hora = t(lang, 'onboarding.errors.horaRequired')
  else if (!validarHora24(dados.hora)) erros.hora = t(lang, 'onboarding.errors.horaInvalid')

  if (!dados.cidade.trim()) erros.cidade = t(lang, 'onboarding.errors.cidadeRequired')
  else if (!dados.localizacao) erros.cidade = t(lang, 'onboarding.errors.cidadeSelect')
  else if (dados.fuso == null) erros.cidade = t(lang, 'onboarding.errors.fusoPending')

  return erros
}
