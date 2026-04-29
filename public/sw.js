const CACHE_NAME = 'habit-tracker-app-shell-v1'
const APP_SHELL_URLS = ['/', '/login', '/signup', '/dashboard', '/manifest.json']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL_URLS)),
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName)),
      ),
    ),
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return
  }

  event.respondWith(
    fetch(event.request).catch(async () => {
      const cachedResponse = await caches.match(event.request)

      if (cachedResponse) {
        return cachedResponse
      }

      if (event.request.mode === 'navigate') {
        return caches.match('/dashboard')
      }

      return Response.error()
    }),
  )
})
