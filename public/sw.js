const CACHE_NAME = 'habit-tracker-app-shell-v2'
const APP_SHELL_URLS = [
  '/',
  '/login',
  '/signup',
  '/dashboard',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icon.png',
  '/apple-icon.png'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Use catch here so if a single asset like apple-icon fails, the install doesn't abort.
      return Promise.allSettled(
        APP_SHELL_URLS.map(url => cache.add(url).catch(err => console.warn('Failed to cache:', url, err)))
      );
    })
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
    (async () => {
      try {
        const networkResponse = await fetch(event.request)

        // Dynamically cache successful requests on the fly (Fonts, Scripts, Images)
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const cache = await caches.open(CACHE_NAME)
          cache.put(event.request, networkResponse.clone())
        }

        return networkResponse
      } catch (error) {
        const cachedResponse = await caches.match(event.request)

        if (cachedResponse) {
          return cachedResponse
        }

        if (event.request.mode === 'navigate') {
          return caches.match('/dashboard')
        }

        return Response.error()
      }
    })()
  )
})
