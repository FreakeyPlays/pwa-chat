const cacheName = 'pwa-chat-v2';
const filesToCache = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/pages/login.html',
  '/pages/chat.html',
  '/pages/register.html',
  '/pages/404.html',
  '/components/message.html',
  '/main.css',
  '/main.js'
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
