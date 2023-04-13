const CACHE_VERSION = {
  STATIC: '5',
  DYNAMIC: '2'
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
  console.log(
    '%c[ServiceWorker] installEvent fired',
    'background: #F7C8E0; color: #000'
  );
  e.waitUntil(
    caches.open(CACHE_LIST.STATIC_CACHE).then(cache => {
      cache.addAll(STATIC_RESOURCE_LIST);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  console.log(
    '%c[ServiceWorker] activateEvent fired',
    'background: #F7C8E0; color: #000'
  );
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
  console.log(
    '%c[ServiceWorker] fetchEvent fired',
    'background: #F7C8E0; color: #000'
  );

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
  console.log(
    '%c[ServiceWorker] pushEvent fired',
    'background: #F7C8E0; color: #000'
  );
});

self.addEventListener('sync', e => {
  console.log(
    '%c[ServiceWorker] syncEvent fired:',
    'background: #F7C8E0; color: #000'
  );
  if (e.tag == SYNC_KEYWORDS.POST_NEW_MESSAGES) {
    sendMessageToAllClients('post-messages');
  }
});

function sendMessageToAllClients(message) {
  self.clients.matchAll().then(clients => {
    clients.forEach(function (client) {
      client.postMessage(message);
    });
  });
}

self.addEventListener('periodicsync', () => {
  console.log(
    '%c[ServiceWorker] periodicSyncEvent fired',
    'background: #F7C8E0; color: #000'
  );
});
