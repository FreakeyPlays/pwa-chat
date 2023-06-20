import { Message, SendMessage } from '../../_interface';
import { CreateMessage } from '../../_interface/message/createMessage.interface';
import { Setting } from '../../_interface/settings/setting.interface';
import { StoredWallpaper } from '../../_interface/wallpaper/wallpaper.interface';

export class IndexedDBManager {
  private static instance: IndexedDBManager;

  private db!: IDBDatabase;
  private dbName: string = 'pwa-chat';
  private dbVersion: number = 1;
  private selected: { name: string; options: Object } = {
    name: '',
    options: {}
  };
  private dbOptions: { name: string; options: Object }[] = [
    {
      name: 'messages',
      options: {
        keyPath: 'id'
      }
    },
    {
      name: 'unsentMessages',
      options: {
        keyPath: 'id',
        autoIncrement: true
      }
    },
    {
      name: 'wallpaper',
      options: {
        keyPath: 'id'
      }
    },
    {
      name: 'settings',
      options: {
        keyPath: 'id',
        autoIncrement: true
      }
    }
  ];

  private constructor() {
    console.log('[IndexedDBManager] - instance created');
  }

  public static getInstance(): IndexedDBManager {
    if (!IndexedDBManager.instance) {
      IndexedDBManager.instance = new IndexedDBManager();
    }
    return IndexedDBManager.instance;
  }

  public async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request: IDBOpenDBRequest = indexedDB.open(
        this.dbName,
        this.dbVersion
      );

      request.onerror = (e: Event) => {
        console.error('[IndexedDBManager] Initialization error', e);
        reject(e);
      };

      request.onupgradeneeded = () => {
        console.log('[IndexedDBManager] needed Upgrade');

        this.db = request.result;
        this.dbOptions.forEach((option: { name: string; options: Object }) => {
          this.db.createObjectStore(option.name, option.options);
        });
      };

      request.onsuccess = (e: Event) => {
        console.log('[IndexedDBManager] Initialized');

        this.db = request.result;
        resolve();
      };
    });
  }

  public messages() {
    this.selected = this.dbOptions[0];
    return this;
  }

  public unsentMessages() {
    this.selected = this.dbOptions[1];
    return this;
  }

  public wallpaper() {
    this.selected = this.dbOptions[2];
    return this;
  }

  public settings() {
    this.selected = this.dbOptions[3];
    return this;
  }

  public get(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      const transaction: IDBTransaction = this.db.transaction(
        this.selected.name,
        'readonly'
      );
      const objectStore: IDBObjectStore = transaction.objectStore(
        this.selected.name
      );
      const request: IDBRequest = objectStore.get(id);

      request.onerror = (e: Event) => {
        console.error(
          '[IndexedDBManager] Get ' + this.selected.name + ' error',
          e
        );
        reject(e);
      };

      request.onsuccess = () => {
        console.log(
          '[IndexedDBManager] Get ' + this.selected.name + ' success'
        );
        resolve(request.result);
      };
    });
  }

  public getAll(): Promise<any> {
    return new Promise((resolve, reject) => {
      const transaction: IDBTransaction = this.db.transaction(
        this.selected.name,
        'readonly'
      );
      const objectStore: IDBObjectStore = transaction.objectStore(
        this.selected.name
      );
      const request: IDBRequest = objectStore.getAll();

      request.onerror = (e: Event) => {
        console.error(
          '[IndexedDBManager] Get all ' + this.selected.name + ' error',
          e
        );
        reject(e);
      };

      request.onsuccess = () => {
        console.log(
          '[IndexedDBManager] Get all ' + this.selected.name + ' success'
        );
        resolve(request.result);
      };
    });
  }

  public add(
    data: CreateMessage | SendMessage | Setting | StoredWallpaper
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const transaction: IDBTransaction = this.db.transaction(
        this.selected.name,
        'readwrite'
      );
      const objectStore: IDBObjectStore = transaction.objectStore(
        this.selected.name
      );
      const request: IDBRequest = objectStore.add(data);

      request.onerror = (e: Event) => {
        console.error(
          '[IndexedDBManager] Add ' + this.selected.name + ' error',
          e
        );
        reject(e);
      };

      request.onsuccess = () => {
        console.log(
          '[IndexedDBManager] Add ' + this.selected.name + ' success'
        );
        resolve(true);
      };
    });
  }

  public update(
    data: Message | SendMessage | Setting | StoredWallpaper
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const transaction: IDBTransaction = this.db.transaction(
        this.selected.name,
        'readwrite'
      );
      const objectStore: IDBObjectStore = transaction.objectStore(
        this.selected.name
      );
      const request: IDBRequest = objectStore.put(data);

      request.onerror = (e: Event) => {
        console.error(
          '[IndexedDBManager] Update ' + this.selected.name + ' error',
          e
        );
        reject(e);
      };

      request.onsuccess = () => {
        console.log(
          '[IndexedDBManager] Update ' + this.selected.name + ' success'
        );
        resolve(true);
      };
    });
  }

  public delete(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const transaction: IDBTransaction = this.db.transaction(
        this.selected.name,
        'readwrite'
      );
      const objectStore: IDBObjectStore = transaction.objectStore(
        this.selected.name
      );
      const request: IDBRequest = objectStore.delete(id);

      request.onerror = (e: Event) => {
        console.error(
          '[IndexedDBManager] Delete ' + this.selected.name + ' error',
          e
        );
        reject(e);
      };

      request.onsuccess = () => {
        console.log(
          '[IndexedDBManager] Delete ' + this.selected.name + ' success'
        );
        resolve(true);
      };
    });
  }

  public clear() {
    return new Promise((resolve, reject) => {
      const transaction: IDBTransaction = this.db.transaction(
        this.selected.name,
        'readwrite'
      );
      const objectStore: IDBObjectStore = transaction.objectStore(
        this.selected.name
      );
      const request: IDBRequest = objectStore.clear();

      request.onerror = (e: Event) => {
        console.error(
          '[IndexedDBManager] Clear ' + this.selected.name + ' error',
          e
        );
        reject(e);
      };

      request.onsuccess = () => {
        console.log(
          '[IndexedDBManager] Clear ' + this.selected.name + ' success'
        );
        resolve(true);
      };
    });
  }
}
