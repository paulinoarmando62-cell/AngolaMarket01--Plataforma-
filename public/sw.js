// AngolaMarket Service Worker - Offline Caching Disabled
// All requests go directly to live network to ensure 100% cloud database synchronization

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

// All fetch requests bypass SW cache and go directly to network

