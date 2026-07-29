/** Linhas da comparação Grátis vs Premium — texto curto e profissional. */
export function getPremiumCompareRows(t, { maxTarot, maxOracle }) {
  return [
    {
      feature: t('premium.table.mapa'),
      free: t('premium.table.mapaFree'),
      premium: t('premium.table.mapaVip'),
    },
    {
      feature: t('premium.table.oracle'),
      free: t('premium.table.oracleFree', { n: maxOracle }),
      premium: t('premium.table.oracleVip'),
    },
    {
      feature: t('premium.table.tarot'),
      free: t('premium.table.tarotFree', { n: maxTarot }),
      premium: t('premium.table.tarotVip'),
    },
    {
      feature: t('premium.table.skyLive'),
      free: t('premium.table.skyLiveFree'),
      premium: t('premium.table.skyLiveVip'),
    },
    {
      feature: t('premium.table.bussola'),
      free: t('premium.table.bussolaFree'),
      premium: t('premium.table.bussolaVip'),
    },
    {
      feature: t('premium.table.numerologia'),
      free: t('premium.table.numerologiaFree'),
      premium: t('premium.table.numerologiaVip'),
    },
    {
      feature: t('premium.table.sinastria'),
      free: t('premium.table.sinastriaFree'),
      premium: t('premium.table.sinastriaVip'),
    },
  ]
}

/** Tabela compacta para paywalls in-app (mesmas linhas). */
export function getPremiumTableRows(t, opts) {
  return getPremiumCompareRows(t, opts).map((row) => ({
    feature: row.feature,
    free: row.free,
    vip: row.premium,
  }))
}
