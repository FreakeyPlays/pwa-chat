import { ApiService } from './ts/_service/api.service';
import { IndexedDBManager } from './ts/_service/storage.service';
const _apiService = new ApiService();

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
  '/pages/chat.html',
  '/pages/404.html',
  '/components/message.html',
  '/main.css',
  '/main.js'
];

const SYNC_KEYWORDS = {
  POST_NEW_MESSAGES: 'post-new-messages',
  FETCH_NEW_MESSAGES: 'fetch-messages'
};

self.addEventListener('install', e => {
  console.log(
    '%c[ServiceWorker] installEvent fired',
    'background: #F7C8E0; color: #000'
  );
  (e as any).waitUntil(
    caches.open(CACHE_LIST.STATIC_CACHE).then(cache => {
      cache.addAll(STATIC_RESOURCE_LIST);
    })
  );
  (self as any).skipWaiting();
});

self.addEventListener('activate', e => {
  console.log(
    '%c[ServiceWorker] activateEvent fired',
    'background: #F7C8E0; color: #000'
  );
  (self as any).clients.claim();
  (e as any).waitUntil(
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

  if ((e as any).request.url.indexOf('www2.hs-esslingen.de') > -1) return;
  if ((e as any).request.url.indexOf('chrome-extension') > -1) return;
  if ((e as any).request.url.indexOf(location.host) == -1) return;

  if (
    STATIC_RESOURCE_LIST.join().indexOf(
      new URL((e as any).request.url).pathname
    ) > -1
  ) {
    (e as any).respondWith(
      cacheOnly_cachingStrategy(CACHE_LIST.STATIC_CACHE, (e as any).request.url)
    );
  } else {
    (e as any).respondWith(
      cacheFirstNetworkFallback_cachingStrategy(
        CACHE_LIST.DYNAMIC_CACHE,
        (e as any).request,
        (e as any).request.url
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
  if ((e as any).tag == SYNC_KEYWORDS.POST_NEW_MESSAGES) {
    (e as any).waitUntil(syncUnsentMessagesWithServer());
  }
});

function syncUnsentMessagesWithServer() {
  IndexedDBManager.getInstance()
    .then(db => {
      db.getUnsentMessages().then(data => {
        const requests = (data as any).map(message => {
          _apiService.sendMessage(message.token, message.text).then(() => {
            db.deleteUnsentMessage(message.id);
          });
        });

        return Promise.all(requests);
      });
    })
    .then(() => {
      sendMessageToAllClients({
        type: SYNC_KEYWORDS.FETCH_NEW_MESSAGES
      });
    });
}

function sendMessageToAllClients(message) {
  return (self as any).clients.matchAll().then(clients => {
    clients.forEach(client => {
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
