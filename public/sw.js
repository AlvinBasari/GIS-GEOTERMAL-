// Self-unregistering cleanup service worker
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil(
    self.registration.unregister().then(() => {
      return self.clients.matchAll();
    })
  );
});
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
