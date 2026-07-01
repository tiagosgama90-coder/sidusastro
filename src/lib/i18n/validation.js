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

function asStr(val) {
  if (typeof val === 'string') return val
  if (val == null) return ''
  return String(val)
}

function validarDataNascimento(data) {
  const dataStr = asStr(data).trim()
  if (!dataStr) return false
  const ano = parseInt(dataStr.slice(0, 4), 10)
  const hoje = new Date()
  const limite = hoje.getFullYear()
  if (ano < 1800 || ano > limite) return false
  const d = new Date(dataStr)
  return d <= hoje
}

function validarHora24(hora) {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(asStr(hora).trim())
}

export function validarOnboarding(dados, lang = 'pt') {
  const erros = {}
  if (!dados || typeof dados !== 'object') return erros
  const nome = asStr(dados.nome).trim()
  const cidade = asStr(dados.cidade).trim()

  if (!nome) erros.nome = t(lang, 'onboarding.errors.nomeRequired')
  else if (nomePareceFalso(nome)) erros.nome = t(lang, 'onboarding.errors.nomeInvalid')

  const data = asStr(dados.data).trim()
  const hora = asStr(dados.hora).trim()

  if (!data) erros.data = t(lang, 'onboarding.errors.dataRequired')
  else if (!validarDataNascimento(data)) erros.data = t(lang, 'onboarding.errors.dataInvalid')

  if (!hora) erros.hora = t(lang, 'onboarding.errors.horaRequired')
  else if (!validarHora24(hora)) erros.hora = t(lang, 'onboarding.errors.horaInvalid')

  if (!cidade) erros.cidade = t(lang, 'onboarding.errors.cidadeRequired')
  else if (!dados?.localizacao) erros.cidade = t(lang, 'onboarding.errors.cidadeSelect')
  else if (dados.fuso == null) erros.cidade = t(lang, 'onboarding.errors.fusoPending')

  return erros
}
