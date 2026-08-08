// EcoTwin SW v3 — clear all old caches and unregister
// This forces all browsers to fetch fresh assets from Netlify CDN

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    // Delete ALL caches (including old broken ones)
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => caches.delete(key)))
    ).then(() => {
      // Tell all open tabs to reload with fresh content
      return self.clients.claim();
    })
  );
});

// Network-first: always fetch fresh, never serve from cache
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(fetch(event.request));
});
