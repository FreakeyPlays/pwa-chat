const CACHE_VERSION = {
  STATIC: '4',
  DYNAMIC: '1'
};

const CACHE_LIST = {
  STATIC_CACHE: `static-pwa-chat-${CACHE_VERSION.STATIC}`,
  DYNAMIC_CACHE: `dynamic-pwa-chat-${CACHE_VERSION.DYNAMIC}`
};

const STATIC_RESOURCE_LIST = [
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

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_LIST.STATIC_CACHE).then(cache => {
      cache.addAll(STATIC_RESOURCE_LIST);
    })
  );
});

self.addEventListener('activate', e => {
  self.clients.claim();
  e.waitUntil(
    caches.keys().then(cacheNameList => {
      return Promise.all(
        cacheNameList.map(cacheName => {
          if (
            cacheName !== CACHE_LIST.STATIC_CACHE &&
            cacheName !== CACHE_LIST.DYNAMIC_CACHE
          ) {
            console.log(`Deleting cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', e => {
  if (e.request.url.indexOf('www2.hs-esslingen.de') > -1) return;
  if (e.request.url.indexOf('chrome-extension') > -1) return;

  if (
    STATIC_RESOURCE_LIST.join().indexOf(new URL(e.request.url).pathname) > -1
  ) {
    e.respondWith(
      caches.open(CACHE_LIST.STATIC_CACHE).then(staticCache => {
        return staticCache.match(e.request.url);
      })
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(cacheResponse => {
        return (
          cacheResponse ||
          fetch(e.request).then(fetchedResponse => {
            return caches.open(CACHE_LIST.DYNAMIC_CACHE).then(dynamicCache => {
              dynamicCache.put(e.request.url, fetchedResponse.clone());
              return fetchedResponse;
            });
          })
        );
      })
    );
  }
});
