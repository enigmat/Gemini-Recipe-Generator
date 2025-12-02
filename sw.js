// sw.js

const CACHE_NAME = 'recipe-app-cache-v1';
const APP_SHELL_URLS = [
  '/',
  '/index.html',
  // Note: Other assets like JS/CSS bundles are typically added here,
  // but in this environment, they are handled by the import map.
  // The fetch handler will cache them on the fly.
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching App Shell');
      return cache.addAll(APP_SHELL_URLS);
    }).then(() => {
        // Force the waiting service worker to become the active service worker.
        return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => Promise.all(
      cacheNames.map((cacheName) => {
        if (cacheWhitelist.indexOf(cacheName) === -1) {
          console.log('Service Worker: Deleting old cache', cacheName);
          return caches.delete(cacheName);
        }
      })
    )).then(() => self.clients.claim()) // Take control of all open clients immediately.
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Strategy: Network First, then Cache for API calls (Supabase)
  if (url.hostname.endsWith('.supabase.co')) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          // If the fetch is successful, clone it and cache it.
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
          return networkResponse;
        })
        .catch(() => {
          // If the network fails, try to serve from the cache.
          return caches.match(request).then(cachedResponse => {
              return cachedResponse || new Response(null, { status: 503, statusText: "Service Unavailable" });
          });
        })
    );
    return;
  }

  // Strategy: Stale-While-Revalidate for images and fonts
  if (request.destination === 'image' || request.destination === 'font') {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          const fetchPromise = fetch(request).then((networkResponse) => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
          // Return cached response immediately if available, otherwise wait for the network
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }
  
  // Strategy: Cache First for everything else (App Shell, scripts from CDN, etc.)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(request).then((networkResponse) => {
        // Don't cache browser extension requests or failed responses
        if (!networkResponse || networkResponse.status !== 200 || !url.href.startsWith('http')) {
             return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });
        return networkResponse;
      });
    })
  );
});