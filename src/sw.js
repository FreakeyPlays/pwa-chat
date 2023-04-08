const cacheName = 'pwa-chat-v2';
const filesToCache = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/assets/pages/chat.html',
  '/assets/pages/login.html',
  '/assets/pages/register.html',
  '/assets/pages/404.html',
  '/assets/components/message.html',
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

self.addEventListener('activate', aEvent => {
  aEvent.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cName => {
          if (cName !== cacheName) {
            return caches.delete(cName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', fEvent => {
  if (
    fEvent.request.url.startsWith('chrome-extension') ||
    fEvent.request.url.includes('extension') ||
    !(fEvent.request.url.indexOf('http') === 0) ||
    fEvent.request.url.indexOf('www2.hs-esslingen.de')
  )
    return;

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
