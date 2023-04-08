export class LocalStorageService {
  setItem(key: string, data: any) {
    localStorage.setItem(key, data);
  }

  getItem(key: string) {
    return localStorage.getItem(key);
  }

  removeItem(key: string) {
    localStorage.removeItem(key);
  }

  clear() {
    localStorage.clear();
  }
}
