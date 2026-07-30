import { useEffect, useState } from 'react'
import { calcularMapaLanding } from '../lib/landingMapaMotor.js'
import { calcularSignoSolarPorData } from '../lib/astrologia.js'

export function useLandingMapaPreview(dados) {
  const [mapa, setMapa] = useState(null)
  const [carregando, setCarregando] = useState(false)

  const pronto = Boolean(
    dados?.data
    && dados?.hora
    && dados?.localizacao
    && dados.fuso != null
    && dados.fuso !== '',
  )

  useEffect(() => {
    if (!pronto) {
      setMapa(dados?.data ? { solar: calcularSignoSolarPorData(dados.data) } : null)
      setCarregando(false)
      return undefined
    }

    let cancelado = false
    setCarregando(true)
    calcularMapaLanding(dados)
      .then((resultado) => {
        if (!cancelado) setMapa(resultado)
      })
      .finally(() => {
        if (!cancelado) setCarregando(false)
      })

    return () => { cancelado = true }
  }, [
    pronto,
    dados?.data,
    dados?.hora,
    dados?.localizacao?.lat,
    dados?.localizacao?.lon,
    dados?.fuso,
  ])

  return { mapa, carregando, completo: Boolean(mapa?.lunar?.nome && mapa?.ascendente?.nome) }
}
