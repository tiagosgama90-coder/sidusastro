/** Linhas da tabela Grátis vs Premium — usadas no landing e paywalls. */
export function getPremiumTableRows(t, { maxTarot, maxOracle }) {
  return [
    { feature: t('premium.table.horoscope'), free: '✓', vip: '✓' },
    { feature: t('premium.table.mapa'), free: t('premium.table.mapaFree'), vip: t('premium.table.mapaVip'), highlight: true },
    { feature: t('premium.table.oracle'), free: t('premium.table.oracleFree', { n: maxOracle }), vip: t('premium.table.unlimited'), highlight: true },
    { feature: t('premium.table.tarot'), free: t('premium.table.tarotFree', { n: maxTarot }), vip: t('premium.table.unlimited') },
    { feature: t('premium.table.skyLive'), free: t('premium.table.skyLiveFree'), vip: t('premium.table.skyLiveVip') },
    { feature: t('premium.table.bussola'), free: t('premium.table.locked'), vip: t('premium.table.bussolaVip') },
    { feature: t('premium.table.numerologia'), free: t('premium.table.locked'), vip: t('premium.table.numerologiaVip') },
    { feature: t('premium.table.sinastria'), free: t('premium.table.sinastriaFree'), vip: t('premium.table.sinastriaVip') },
    { feature: t('premium.table.sonhos'), free: t('premium.table.sonhosFree'), vip: t('premium.table.sonhosVip') },
  ]
}
