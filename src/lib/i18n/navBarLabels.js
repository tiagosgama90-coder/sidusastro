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

export function getNavBarLabels(lang = 'pt') {
  return NAV_BAR[lang] || NAV_BAR.en
}
