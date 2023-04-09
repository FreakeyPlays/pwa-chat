import './sass/main.sass';
import { App } from './ts/app';

if (navigator.serviceWorker) {
  navigator.serviceWorker.register('./sw.js').then(() => {
    console.log('[ServiceWorker] Registered');
  });
}

const _app = new App();
