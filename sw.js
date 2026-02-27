const CACHE_NAME = 'rrhh-chascomus-v22'; // Cambiá la versión si hacés cambios
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './img-bot-normal.png',
  './img-bot-pensando.png',
  './logo-chascomus.png',
  './icon-192.png'
];

self.addEventListener('install', event => {
  self.skipWaiting(); // Fuerza a activar el nuevo SW inmediatamente
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
        keys.map(k => k !== CACHE_NAME && caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Estrategia: Network First, fallback to Cache (ideal para apps dinámicas)
  // O Stale-While-Revalidate (la que usabas antes, también sirve)
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request).then(networkResponse => {
        caches.open(CACHE_NAME).then(cache => {
            if (event.request.method === 'GET') {
                cache.put(event.request, networkResponse.clone());
            }
        });
        return networkResponse;
      }).catch(() => cachedResponse); // Si falla red, usa caché
      return cachedResponse || fetchPromise; // Si hay caché, úsala mientras actualizas
    })
  );
});
