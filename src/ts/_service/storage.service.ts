import { message } from '../_interface/message.interface';

export class IndexedDBManager {
  private db: IDBDatabase = null;
  private dbVersion: number = 1;
  private dbName: string = 'pwa-chat';
  private dbStoreName: Array<string> = ['messages', 'unsent_messages'];
  private static _instance: IndexedDBManager;

  private constructor() {
    this.init();
  }

  public static getInstance(): IndexedDBManager {
    if (!IndexedDBManager._instance) {
      IndexedDBManager._instance = new IndexedDBManager();
    }
    return IndexedDBManager._instance;
  }

  private init() {
    if (this.db) return;

    const request = window.indexedDB.open(this.dbName, this.dbVersion);
    request.onerror = e => {
      console.error('[IndexedDB] Initialization error', e);
    };

    request.onupgradeneeded = e => {
      console.log('[IndexedDB] needed Upgrade');

      this.db = request.result;
      this.db.createObjectStore(this.dbStoreName[0], {
        keyPath: 'id'
      });
      this.db.createObjectStore(this.dbStoreName[1], {
        keyPath: 'id',
        autoIncrement: true
      });
    };

    request.onsuccess = e => {
      console.log('[IndexedDB] Initialized');

      this.db = request.result;
    };
  }

  // Messages
  public async addMessage(data: message) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.dbStoreName[0], 'readwrite');
      const objectStore = transaction.objectStore(this.dbStoreName[0]);
      const request = objectStore.add({ ...data });

      request.onerror = e => {
        reject(e);
      };

      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }

  public async getMessage(id: number) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.dbStoreName[0], 'readonly');
      const objectStore = transaction.objectStore(this.dbStoreName[0]);
      const request = objectStore.get(id);

      request.onerror = e => {
        reject(e);
      };

      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }

  public async getAllMessages() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.dbStoreName[0], 'readonly');
      const objectStore = transaction.objectStore(this.dbStoreName[0]);
      const request = objectStore.getAll();

      request.onerror = e => {
        reject(e);
      };

      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }

  public async deleteMessage(id: number) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.dbStoreName[0], 'readwrite');
      const objectStore = transaction.objectStore(this.dbStoreName[0]);
      const request = objectStore.delete(id);

      request.onerror = e => {
        reject(e);
      };

      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }

  public async deleteAllMessages() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.dbStoreName[0], 'readwrite');
      const objectStore = transaction.objectStore(this.dbStoreName[0]);
      const request = objectStore.clear();

      request.onerror = e => {
        reject(e);
      };

      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }

  // Unsent Messages
  public async addUnsentMessage(data: message) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.dbStoreName[1], 'readwrite');
      const objectStore = transaction.objectStore(this.dbStoreName[1]);
      const request = objectStore.add({ ...data });

      request.onerror = e => {
        reject(e);
      };

      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }

  public async getUnsentMessages() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.dbStoreName[1], 'readonly');
      const objectStore = transaction.objectStore(this.dbStoreName[1]);
      const request = objectStore.getAll();

      request.onerror = e => {
        reject(e);
      };

      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }

  public async getAllUnsentMessages() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.dbStoreName[1], 'readonly');
      const objectStore = transaction.objectStore(this.dbStoreName[1]);
      const request = objectStore.getAll();

      request.onerror = e => {
        reject(e);
      };

      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }

  public async deleteUnsentMessage(id: number) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.dbStoreName[1], 'readwrite');
      const objectStore = transaction.objectStore(this.dbStoreName[1]);
      const request = objectStore.delete(id);

      request.onerror = e => {
        reject(e);
      };

      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }

  public async deleteAllUnsentMessages() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.dbStoreName[1], 'readwrite');
      const objectStore = transaction.objectStore(this.dbStoreName[1]);
      const request = objectStore.clear();

      request.onerror = e => {
        reject(e);
      };

      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }
}
