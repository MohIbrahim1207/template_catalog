const CACHE_NAME = 'flowforce-cache-v2';
const ASSETS_TO_CACHE = [
  './',
  'index.html',
  'css/styles.css',
  'js/app.js',
  'js/three-viewer.js',
  'js/fluid-sim.js',
  'js/lib/three.min.js',
  'js/lib/OrbitControls.js',
  'manifest.json',
  'icons/icon-192.svg',
  'icons/icon-512.svg'
];

// Install Event - Pre-cache all core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Pre-caching offline assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Cache-First Strategy with Network fallback
self.addEventListener('fetch', (event) => {
  // We only intercept GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached response instantly
          return cachedResponse;
        }

        // Otherwise, fetch from network
        return fetch(event.request)
          .then((networkResponse) => {
            // Check if response is valid
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // Cache the newly fetched asset dynamically (if it fits our scope)
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });

            return networkResponse;
          })
          .catch(() => {
            // Offline fallback for HTML files if fetching fails
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('index.html');
            }
          });
      })
  );
});
