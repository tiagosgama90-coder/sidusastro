/** Atributos para inputs com dados do utilizador (não traduzir nomes, cidades, datas). */
export const INPUT_NO_TRANSLATE = {
  className: 'landing-portal-input notranslate',
  translate: 'no',
}

export const FUSO_OFFSET_VALUES = [0, 1, -3, 2]

export function fusosFallbackLabels(t) {
  return FUSO_OFFSET_VALUES.map((value) => ({
    value,
    label: t(`onboarding.tzOffset.${value >= 0 ? `p${value}` : `m${Math.abs(value)}`}`),
  }))
}
