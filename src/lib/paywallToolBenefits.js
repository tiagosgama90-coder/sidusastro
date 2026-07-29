/** Itens de upsell por ferramenta — só títulos das secções premium. */

export function getSinastriaPaywallItems(t) {
  return [
    t('ferramentasPremium.sinastria.paywallItem1'),
    t('ferramentasPremium.sinastria.paywallItem2'),
    t('ferramentasPremium.sinastria.paywallItem3'),
    t('ferramentasPremium.sinastria.paywallItem4'),
    t('ferramentasPremium.sinastria.paywallItem5'),
    t('ferramentasPremium.sinastria.paywallItem6'),
    t('ferramentasPremium.sinastria.paywallItem7'),
    t('ferramentasPremium.sinastria.paywallItem8'),
    t('ferramentasPremium.sinastria.paywallItem9'),
  ]
}

export function getBussolaPaywallItems(t) {
  return [
    t('ferramentasPremium.bussola.paywallItem1'),
    t('ferramentasPremium.bussola.paywallItem2'),
    t('ferramentasPremium.bussola.paywallItem3'),
    t('ferramentasPremium.bussola.paywallItem4'),
    t('ferramentasPremium.bussola.paywallItem5'),
    t('ferramentasPremium.bussola.paywallItem6'),
  ]
}

export function getNumerologiaPaywallItems(t) {
  return [
    t('ferramentasPremium.numerologia.paywallItem1'),
    t('ferramentasPremium.numerologia.paywallItem2'),
    t('ferramentasPremium.numerologia.paywallItem3'),
    t('ferramentasPremium.numerologia.paywallItem4'),
    t('ferramentasPremium.numerologia.paywallItem5'),
    t('ferramentasPremium.numerologia.paywallItem6'),
    t('ferramentasPremium.numerologia.paywallItem7'),
  ]
}

export function getPaywallToolItems(tool, t) {
  if (tool === 'sinastria') return getSinastriaPaywallItems(t)
  if (tool === 'bussola') return getBussolaPaywallItems(t)
  if (tool === 'numerologia') return getNumerologiaPaywallItems(t)
  return null
}

export function getPaywallToolTitle(tool, t) {
  if (tool === 'sinastria') return t('ferramentasPremium.sinastria.paywallTitle')
  if (tool === 'bussola') return t('ferramentasPremium.bussola.paywallTitle')
  if (tool === 'numerologia') return t('ferramentasPremium.numerologia.paywallTitle')
  return null
}
