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

const SYNC_KEYWORDS = {
  POST_NEW_MESSAGES: 'post-new-messages',
  FETCH_NEW_MESSAGES: 'fetch-new-messages'
};

self.addEventListener('install', e => {
  console.log('[ServiceWorker] installEvent fired');
  e.waitUntil(
    caches.open(CACHE_LIST.STATIC_CACHE).then(cache => {
      cache.addAll(STATIC_RESOURCE_LIST);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  console.log('[ServiceWorker] activateEvent fired');
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
  console.log('[ServiceWorker] fetchEvent fired');

  if (e.request.url.indexOf('www2.hs-esslingen.de') > -1) return;
  if (e.request.url.indexOf('chrome-extension') > -1) return;

  if (
    STATIC_RESOURCE_LIST.join().indexOf(new URL(e.request.url).pathname) > -1
  ) {
    e.respondWith(
      cacheOnly_cachingStrategy(CACHE_LIST.STATIC_CACHE, e.request.url)
    );
  } else {
    e.respondWith(
      cacheFirstNetworkFallback_cachingStrategy(
        CACHE_LIST.DYNAMIC_CACHE,
        e.request,
        e.request.url
      )
    );
  }
});

function cacheOnly_cachingStrategy(cacheName, url) {
  return caches.open(cacheName).then(cache => {
    return cache.match(url);
  });
}
function cacheFirstNetworkFallback_cachingStrategy(cacheName, request, url) {
  return caches.match(request).then(cacheResponse => {
    return (
      cacheResponse ||
      fetch(request).then(fetchedResponse => {
        return caches.open(cacheName).then(dynamicCache => {
          dynamicCache.put(url, fetchedResponse.clone());
          return fetchedResponse;
        });
      })
    );
  });
}

self.addEventListener('push', () => {
  console.log('[ServiceWorker] pushEvent fired');
});

self.addEventListener('sync', e => {
  console.log('[ServiceWorker] syncEvent fired');

  if (e.tag === SYNC_KEYWORDS.POST_NEW_MESSAGES) {
    sendMessageToAllClients('post-messages');
  }
});

function sendMessageToAllClients(message) {
  self.clients.matchAll().then(function (clients) {
    clients.forEach(function (client) {
      client.postMessage(message);
    });
  });
}

self.addEventListener('periodicsync', () => {
  console.log('[ServiceWorker] periodicSyncEvent fired');
});
