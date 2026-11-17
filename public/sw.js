// Flora MOC — Service Worker (PWA Offline & Asset Cache)
const CACHE_NAME = 'floramoc-v1.3'

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/assets/branding/logo.webp',
  '/assets/branding/logo-icon.webp'
]

// Instalação: pré-carrega o App Shell básico
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Falha parcial no precache:', err)
      })
    })
  )
  self.skipWaiting()
})

// Ativação: limpa versões anteriores do cache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Interceptação de requisições
self.addEventListener('fetch', (event) => {
  const req = event.request
  const url = new URL(req.url)

  // 1. Apenas requisições GET
  if (req.method !== 'GET') return

  // 2. Navegação (HTML da SPA): Network-first com fallback para o index em cache
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => {
        return caches.match('/index.html')
      })
    )
    return
  }

  // 3. Assets estáticos (JS, CSS, Imagens, Fontes): Cache-first
  const isStatic =
    url.pathname.startsWith('/assets/') ||
    url.pathname.startsWith('/icons/') ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com')

  if (isStatic) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached

        return fetch(req)
          .then((response) => {
            if (response && response.status === 200) {
              const clone = response.clone()
              caches.open(CACHE_NAME).then((cache) => cache.put(req, clone))
            }
            return response
          })
          .catch(() => cached)
      })
    )
    return
  }

  // 4. Demais requisições (APIs, Tiles de mapa): Network com fallback suave
  event.respondWith(
    fetch(req).catch(() => {
      return caches.match(req)
    })
  )
})
