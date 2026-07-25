export const FUSO_OFFSET_VALUES = [0, 1, -3, 2]

/** Só para nomes de cidades reais nas sugestões — não traduzir geografia. */
export const CITY_SUGGESTION_NO_TRANSLATE = {
  translate: 'no',
}

export function fusosFallbackLabels(t) {
  return FUSO_OFFSET_VALUES.map((value) => ({
    value,
    label: t(`onboarding.tzOffset.${value >= 0 ? `p${value}` : `m${Math.abs(value)}`}`),
  }))
}
