import { imagemVersoUrl } from './images.js'

const cache = new Map()

export function urlVerso(deck = 'tarot') {
  return imagemVersoUrl(deck === 'lenormand' ? 'lenormand' : 'tarot')
}

export function garantirVersoCarregado(deck = 'tarot') {
  const url = urlVerso(deck)
  if (!url) return Promise.resolve(false)
  if (cache.get(url) === true) return Promise.resolve(true)
  if (cache.has(url)) return cache.get(url)

  const promessa = new Promise((resolve) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => {
      cache.set(url, true)
      resolve(true)
    }
    img.onerror = () => {
      cache.set(url, false)
      resolve(false)
    }
    img.src = url
  })
  cache.set(url, promessa)
  return promessa
}

export function versoEstaPronto(deck = 'tarot') {
  const url = urlVerso(deck)
  return cache.get(url) === true
}

export function precarregarVersos() {
  return Promise.all(['tarot', 'lenormand'].map((d) => garantirVersoCarregado(d)))
}
