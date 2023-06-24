const CACHE_VERSION = {
  STATIC: '3',
  DYNAMIC: '3',
  MINOR: '0'
};

const CACHE_LIST = {
  STATIC_CACHE: `static-pwa-chat-${CACHE_VERSION.STATIC}.${CACHE_VERSION.MINOR}`,
  DYNAMIC_CACHE: `dynamic-pwa-chat-${CACHE_VERSION.DYNAMIC}.${CACHE_VERSION.MINOR}`
};

const STATIC_RESOURCE_LIST = [
  './',
  '/index.html',
  '/manifest.json',
  '/pages/chat.html',
  '/pages/login.html',
  '/pages/404.html',
  '/main.css',
  '/main.js'
];

self.addEventListener('install', (e: any) => {
  console.log(
    '%c[ServiceWorker] installEvent fired\n',
    'background: #F7C8E0; color: #000'
  );

  e.waitUntil(
    caches.open(CACHE_LIST.STATIC_CACHE).then(cache => {
      console.log('[ServiceWorker] caching static resources');
      return cache.addAll(STATIC_RESOURCE_LIST);
    })
  );

  (self as any).skipWaiting();
});

self.addEventListener('activate', (e: any) => {
  console.log(
    '%c[ServiceWorker] activateEvent fired\n',
    'background: #F7C8E0; color: #000'
  );

  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(
            key =>
              key !== CACHE_LIST.STATIC_CACHE &&
              key !== CACHE_LIST.DYNAMIC_CACHE
          )
          .map(key => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', (e: any) => {
  console.log(
    '%c[ServiceWorker] fetchEvent fired\n',
    'background: #F7C8E0; color: #000'
  );

  if (e.request.url.indexOf('www2.hs-esslingen.de') > -1) return;
  if (e.request.url.indexOf('chrome-extension') > -1) return;

  e.respondWith(
    caches
      .match(e.request.url)
      .then(cacheResponse => {
        return (
          cacheResponse ||
          fetch(e.request).then(networkResponse => {
            return caches.open(CACHE_LIST.DYNAMIC_CACHE).then(cache => {
              cache.put(e.request.url, networkResponse.clone());
              return networkResponse;
            });
          })
        );
      })
      .catch(() => {
        if (e.request.url.indexOf('.html') > -1) {
          return caches.match('/pages/404.html');
        }
      })
  );
});
