/**
 * Labels curtos da navbar desktop — referência PT, comprimento estável em todos os idiomas.
 * Páginas e menus usam nav.* / ferramentas.nome completos; a barra usa estes rótulos.
 */
const NAV_BAR = {
  pt: { home: 'Home', mapa: 'Mapa Astral', tarot: 'Tarot Online', oraculo: 'Chat Oráculo' },
  en: { home: 'Home', mapa: 'Natal Chart', tarot: 'Tarot Online', oraculo: 'Chat Oracle' },
  es: { home: 'Home', mapa: 'Mapa Astral', tarot: 'Tarot Online', oraculo: 'Chat Oráculo' },
  it: { home: 'Home', mapa: 'Mapa Astral', tarot: 'Tarot Online', oraculo: 'Chat Oráculo' },
  de: { home: 'Home', mapa: 'Mapa Astral', tarot: 'Tarot Online', oraculo: 'Chat Oráculo' },
  fr: { home: 'Home', mapa: 'Mapa Astral', tarot: 'Tarot Online', oraculo: 'Chat Oráculo' },
}

/** Largura mínima por item (ch) — calibrado para PT: «Radar de Afinidades», «Interpretação de Sonhos». */
export const NAV_SLOT_CH = {
  home: 5,
  mapa: 12,
  tarot: 13,
  bussola: 16,
  sinastria: 22,
  numerologia: 12,
  sonhos: 26,
  biorritmo: 12,
  horasIguais: 13,
  diario: 14,
  chat: 13,
}

export function getNavBarLabels(lang = 'pt') {
  return NAV_BAR[lang] || NAV_BAR.en
}

export function getNavSlotCh(id) {
  return NAV_SLOT_CH[id] || 12
}
