// Asigna un nombre y versión a tu caché
const CACHE_NAME = 'm2-consultoria-v1';

// Lista de archivos que quieres que funcionen sin internet
const ASSETS_TO_CACHE = [
  '/repartodemo/',
  '/repartodemo/index.html',
  '/repartodemo/logom2.jpg', // <--- Agregada
  '/repartodemo/android-icon-192x192.png',
  '/repartodemo/icon-512x512.png'
  // IMPORTANTE: Si tienes archivos CSS o JS, agrégalos aquí abajo. 
  // Por ejemplo:
  // '/repartodemo/style.css',
  // '/repartodemo/script.js'
];

// 1. Evento Install: Descarga y guarda los archivos estáticos en caché
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caché abierta correctamente');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
  // Fuerza al SW a activarse inmediatamente
  self.skipWaiting();
});

// 2. Evento Activate: Limpia cachés antiguas si cambias la versión (ej. de v1 a v2)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Borrando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Asegura que el SW tome el control de las páginas abiertas
  self.clients.claim();
});

// 3. Evento Fetch: Estrategia "Network first, fallback to cache" 
// (Intenta usar internet, si falla, usa la caché)
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        // Si la red falla (ej. modo avión), busca en la caché
        return caches.match(event.request);
      })
  );
});
