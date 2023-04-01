const cacheName = 'pwa-chat-v1';
const filesToCache = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/assets/pages/chat.html',
  '/assets/pages/login.html',
  '/assets/pages/register.html',
  '/assets/pages/404.html',
  '/assets/dist/css/main.css',
  '/assets/dist/js/main.js',
  '/assets/dist/js/router.js',
  '/assets/dist/js/_service/chat.service.js',
  '/assets/dist/js/_service/storage.service.js',
  '/assets/dist/js/_interface/response.interface.js',
  '/assets/dist/js/_interface/user.interface.js',
  '/assets/dist/js/_interface/route.interface.js'
];

self.addEventListener('install', installEvent => {
  installEvent.waitUntil(
    caches.open(cacheName).then(cache => {
      cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.open(cacheName).then(cache => {
      return fetch(e.request.url)
        .then(fetchedResponse => {
          cache.put(e.request.url, fetchedResponse.clone());

          return fetchedResponse;
        })
        .catch(() => {
          return cache.match(e.request.url);
        });
    })
  );
});
