const CACHE_NAME = 'rrhh-chascomus-v2';
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

// Instalación: Cachear recursos estáticos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Cacheando assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activación: Limpiar cachés antiguas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('[SW] Borrando caché antigua:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
    .then(() => self.clients.claim())
  );
});

// Intercepción de peticiones: Estrategia Stale-While-Revalidate
self.addEventListener('fetch', event => {
  // Solo manejamos peticiones GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // Si hay una respuesta en caché, la devolvemos (rápido)
      const fetchPromise = fetch(event.request).then(networkResponse => {
        // Actualizamos la caché con la versión de la red
        caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      });

      // Devolvemos la caché si existe, si no, esperamos a la red
      return cachedResponse || fetchPromise;
    })
  );
});
