// Service Worker para notificações PWA - Sidus Astro
const CACHE_NAME = 'sidusastro-v3'
const urlsToCache = ['/', '/index.html', '/manifest.json']

const SIGNO_EMOJI = {
  'Áries': '♈', 'Carneiro': '♈', 'Touro': '♉', 'Gémeos': '♊', 'Caranguejo': '♋',
  'Leão': '♌', 'Virgem': '♍', 'Balança': '♎', 'Escorpião': '♏', 'Sagitário': '♐',
  'Capricórnio': '♑', 'Aquário': '♒', 'Peixes': '♓',
}

const SIGNO_PT_TO_EN = {
  'Carneiro': 'Aries', 'Áries': 'Aries', 'Touro': 'Taurus', 'Gémeos': 'Gemini',
  'Caranguejo': 'Cancer', 'Leão': 'Leo', 'Virgem': 'Virgo', 'Balança': 'Libra',
  'Escorpião': 'Scorpio', 'Sagitário': 'Sagittarius', 'Capricórnio': 'Capricorn',
  'Aquário': 'Aquarius', 'Peixes': 'Pisces',
}

const SIGNOS_PT = [
  'Carneiro', 'Touro', 'Gémeos', 'Caranguejo', 'Leão', 'Virgem',
  'Balança', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes',
]

const SIGNOS_EN = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
]

function signoHoroscopeKey(nomeSolar, lang) {
  if (!nomeSolar) return null
  if (lang !== 'pt') return SIGNO_PT_TO_EN[nomeSolar] || nomeSolar
  if (nomeSolar === 'Áries') return 'Carneiro'
  return nomeSolar
}

function resolveHoroscopoDoPack(pack, signoSolar, lang) {
  if (!pack?.horoscopes || !signoSolar) return null
  const keyPt = signoHoroscopeKey(signoSolar, 'pt')
  const keyLang = lang === 'pt' ? keyPt : (signoHoroscopeKey(signoSolar, lang) || signoSolar)
  return pack.horoscopes[lang]?.[keyLang]
    || pack.horoscopes.pt?.[keyPt]
    || pack.horoscopes.en?.[signoHoroscopeKey(signoSolar, 'en')]
    || null
}

function fallbackHoroscopo(signoSolar, lang) {
  const keyPt = signoHoroscopeKey(signoSolar, 'pt')
  const idx = SIGNOS_PT.indexOf(keyPt)
  const signLabel = lang === 'pt' ? keyPt : (SIGNOS_EN[idx] || signoSolar)
  const msgs = lang === 'pt'
    ? [`Energia do dia para ${signLabel}: alinha intenção e acção.`, `Dia favorável para ${signLabel}: escuta o teu coração.`]
    : [`Today's energy for ${signLabel}: align intention and action.`, `Favourable day for ${signLabel}: listen to your heart.`]
  const seed = new Date().toISOString().slice(0, 10).split('-').reduce((a, b) => a + Number(b), 0)
  return msgs[seed % msgs.length]
}

async function buildNotificationContent(signo, lang = 'pt') {
  let body = lang === 'pt'
    ? 'O teu horóscopo personalizado já está disponível!'
    : 'Your personalised horoscope is ready!'
  const emoji = SIGNO_EMOJI[signo] || '♈'
  let title = lang === 'pt'
    ? `${emoji} ${signo} - Horóscopo diário`
    : `${emoji} ${signo} - Daily horoscope`

  if (signo) {
    try {
      const res = await fetch('/api/daily-content')
      if (res.ok) {
        const pack = await res.json()
        const text = resolveHoroscopoDoPack(pack, signo, lang)
        if (text) body = text.length > 120 ? text.slice(0, 117) + '…' : text
        else body = fallbackHoroscopo(signo, lang)
      } else {
        body = fallbackHoroscopo(signo, lang)
      }
    } catch {
      body = fallbackHoroscopo(signo, lang)
    }
  } else {
    title = '🔮 Sidus Astro - Horóscopo Diário'
  }

  return { title, body }
}

// ─── IndexedDB para persistir prefs entre reinícios do SW ─────────────────
const DB_NAME = 'sidus-notif'
const STORE = 'prefs'

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => req.result.createObjectStore(STORE)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function savePrefs(prefs) {
  try {
    const db = await openDb()
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite')
      tx.objectStore(STORE).put(prefs, 'daily')
      tx.oncomplete = resolve
      tx.onerror = () => reject(tx.error)
    })
  } catch (e) {
    console.warn('[SW] savePrefs failed', e)
  }
}

async function getPrefs() {
  try {
    const db = await openDb()
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readonly')
      const req = tx.objectStore(STORE).get('daily')
      req.onsuccess = () => resolve(req.result || null)
      req.onerror = () => reject(req.error)
    })
  } catch {
    return null
  }
}

async function clearPrefs() {
  try {
    const db = await openDb()
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite')
      tx.objectStore(STORE).delete('daily')
      tx.oncomplete = resolve
      tx.onerror = () => reject(tx.error)
    })
  } catch { /* ignore */ }
}

// ─── Instalar / Activar ────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(cacheNames.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    ).then(async () => {
      const prefs = await getPrefs()
      if (prefs?.enabled) iniciarTimer()
      return self.clients.claim()
    })
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) return response
      return fetch(event.request).catch(() => {
        if (event.request.mode === 'navigate') return caches.match('/index.html')
        return new Response('Offline', { status: 503 })
      })
    })
  )
})

// ─── Timer para notificações diárias às 12:00 ────────────────────────────
let intervalId = null
let notifPrefs = { enabled: false, signo: null, lang: 'pt' }

async function mostrarNotificacaoDiaria() {
  const today = new Date().toISOString().slice(0, 10)
  const prefs = await getPrefs()
  if (!prefs?.enabled) return
  if (prefs.lastShownDate === today) return

  const { title, body } = await buildNotificationContent(prefs.signo, prefs.lang || 'pt')

  await self.registration.showNotification(title, {
    body,
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    vibrate: [200, 100, 200],
    tag: 'daily-horoscope',
    requireInteraction: true,
    data: { url: '/' },
    actions: [
      { action: 'view', title: '👁 Ver horóscopo' },
      { action: 'close', title: '✕ Fechar' },
    ],
  })

  await savePrefs({ ...prefs, lastShownDate: today })
}

function iniciarTimer() {
  if (intervalId !== null) return

  intervalId = setInterval(async () => {
    const now = new Date()
    if (now.getHours() === 12 && now.getMinutes() === 0) {
      await mostrarNotificacaoDiaria()
    }
  }, 30000)
}

function pararTimer() {
  if (intervalId !== null) {
    clearInterval(intervalId)
    intervalId = null
  }
}

async function desactivarCompletamente() {
  notifPrefs = { enabled: false, signo: null, lang: 'pt' }
  await clearPrefs()
  pararTimer()
  try {
    const notifs = await self.registration.getNotifications({ tag: 'daily-horoscope' })
    notifs.forEach((n) => n.close())
  } catch { /* ignore */ }
}

// ─── Mensagens da página ─────────────────────────────────────────────────
self.addEventListener('message', async (event) => {
  const type = event.data?.type

  if (type === 'DISABLE_NOTIFICATIONS') {
    await desactivarCompletamente()
    return
  }

  if (type !== 'SET_LOCAL_TIMER') return

  if (event.data?.enabled) {
    notifPrefs = {
      enabled: true,
      signo: event.data.signo || null,
      lang: event.data.lang || 'pt',
      lastShownDate: null,
    }
    const existing = await getPrefs()
    if (existing?.lastShownDate) {
      notifPrefs.lastShownDate = existing.lastShownDate
    }
    await savePrefs(notifPrefs)
    iniciarTimer()
  } else {
    await desactivarCompletamente()
  }
})

// ─── Push (servidor futuro) ──────────────────────────────────────────────
self.addEventListener('push', (event) => {
  let data = {}
  try {
    data = event.data?.json() || {}
  } catch {
    data = { title: event.data?.text() || 'Sidus Astro' }
  }

  const options = {
    body: data.body || 'O teu horóscopo diário está pronto ✨',
    icon: data.icon || '/favicon.svg',
    badge: data.badge || '/favicon.svg',
    vibrate: data.vibrate || [200, 100, 200],
    tag: data.tag || 'daily-horoscope',
    requireInteraction: true,
    data: { url: data.url || '/', date: data.date || new Date().toISOString() },
    actions: data.actions || [
      { action: 'view', title: '👁 Ver horóscopo' },
      { action: 'close', title: '✕ Fechar' },
    ],
  }

  event.waitUntil(
    self.registration.showNotification(data.title || '🔮 Sidus Astro', options)
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'view' || !event.action) {
    const url = event.notification.data?.url || '/'
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        for (const client of clientList) {
          if ('focus' in client) return client.focus()
        }
        return clients.openWindow(url)
      })
    )
  }
})
