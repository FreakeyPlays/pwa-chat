import './sass/main.sass';
import { App } from './ts/app';

interface SyncManager {
  getTags(): Promise<string[]>;
  register(tag: string): Promise<void>;
}

declare global {
  interface ServiceWorkerRegistration {
    readonly sync: SyncManager;
  }
}

if (navigator.serviceWorker) {
  navigator.serviceWorker.register('./sw.js').then(async () => {
    console.log(
      '%c[ServiceWorker] Registered',
      'background: #F7C8E0; color: #000'
    );
  });
}

const _app = new App();
