// Service Worker para notificações PWA - Sidus Astro
const CACHE_NAME = 'sidusastro-v1'
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
]

// Instalar Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando...')
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  )
})

// Ativar Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Ativando...')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => self.clients.claim())
  )
})

// Interceptar requisições (offline-first)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response
        }
        return fetch(event.request).catch(() => {
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html')
          }
          return new Response('Offline', { status: 503 })
        })
      })
  )
})

// ─── Timer para notificações locais (100% gratuito, sem servidor) ─────────
// Verifica a cada 30 segundos se são 12:00 e mostra notificação
let intervalId = null

function iniciarTimer() {
  if (intervalId !== null) return
  console.log('[SW] Timer de notificações iniciado (check 12:00)')

  intervalId = setInterval(() => {
    const now = new Date()
    const hora = now.getHours()
    const minuto = now.getMinutes()

    // Verificar às 12:00 (janela de 1 minuto)
    if (hora === 12 && minuto === 0) {
      // Verificar se já mostrou hoje para este cliente
      self.registration.showNotification('🔮 Sidus Astro - Horóscopo Diário', {
        body: 'O teu horóscopo personalizado já está disponível!',
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
    }
  }, 30000) // a cada 30 segundos
}

function pararTimer() {
  if (intervalId !== null) {
    clearInterval(intervalId)
    intervalId = null
    console.log('[SW] Timer de notificações parado')
  }
}

// ─── Receber mensagens da página ───────────────────────────────────────────
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SET_LOCAL_TIMER') {
    if (event.data?.enabled) {
      iniciarTimer()
    } else {
      pararTimer()
    }
  }
})

// ─── Receber notificações push (caso o servidor envie no futuro) ──────────
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
    data: {
      url: data.url || '/',
      date: data.date || new Date().toISOString(),
    },
    actions: data.actions || [
      { action: 'view', title: '👁 Ver horóscopo' },
      { action: 'close', title: '✕ Fechar' },
    ],
  }

  event.waitUntil(
    self.registration.showNotification(data.title || '🔮 Sidus Astro', options)
  )
})

// ─── Clique em notificação ─────────────────────────────────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'view' || !event.action) {
    const url = event.notification.data?.url || '/'
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus()
          }
        }
        return clients.openWindow(url)
      })
    )
  }
})