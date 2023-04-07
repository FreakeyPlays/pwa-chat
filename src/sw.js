const cacheName = 'pwa-chat-v1';
const filesToCache = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/assets/pages/chat.html',
  '/assets/pages/login.html',
  '/assets/pages/register.html',
  '/assets/pages/404.html',
  '/assets/dist/components/message.html',
  '/assets/dist/css/main.css',
  '/assets/dist/js/main.js',
  '/assets/dist/js/router.js',
  '/assets/dist/js/auth.js',
  '/assets/dist/js/_validation/form.validator.js',
  '/assets/dist/js/_service/api.service.js',
  '/assets/dist/js/_service/storage.service.js',
  '/assets/dist/js/_interface/response.interface.js',
  '/assets/dist/js/_interface/user.interface.js',
  '/assets/dist/js/_interface/route.interface.js',
  '/assets/dist/js/_interface/message.interface.js'
];

self.addEventListener('install', iEvent => {
  iEvent.waitUntil(
    caches.open(cacheName).then(cache => {
      cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('fetch', fEvent => {
  fEvent.respondWith(
    caches.open(cacheName).then(cache => {
      return fetch(fEvent.request.url)
        .then(fetchedResponse => {
          cache.put(fEvent.request.url, fetchedResponse.clone());

          return fetchedResponse;
        })
        .catch(() => {
          return cache.match(fEvent.request.url);
        });
    })
  );
});
