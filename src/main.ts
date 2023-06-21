import { Http } from './ts/_service/http/http';
import { Auth } from './ts/auth/auth';
import { Logger } from './ts/logger';
import { LoginPage } from './ts/pages/login.page';
import { Router } from './ts/router/router';

import './sass/main.sass';
import { IndexedDBManager } from './ts/_service/idb/idb';
import { ChatPage } from './ts/pages/chat.page';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

Logger.getInstance().disableLogging();

window.addEventListener('load', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/sw.js')
      .then(() => {
        console.log('[ServiceWorker] registered');
      })
      .catch(err => {
        console.log('[ServiceWorker] registration failed');
        console.log(err);
      });
  }
});
class PwaChat {
  constructor() {
    IndexedDBManager.getInstance();
    Auth.getInstance();
    Router.getInstance();
    LoginPage.getInstance();
    ChatPage.getInstance();
    Http.getInstance();

    this.init();
  }

  private init() {
    Router.getInstance().init();
  }
}

IndexedDBManager.getInstance()
  .init()
  .then(() => {
    new PwaChat();
  });
