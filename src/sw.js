const cacheName = 'pwa-chat-v1';
const filesToCache = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/assets/pages/chat.html',
  '/assets/pages/login.html',
  '/assets/pages/register.html',
  '/assets/pages/404.html'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
