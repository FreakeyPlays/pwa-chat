export class CookieService {
  constructor() {}

  new(key: string, value: string, expirationDays: number = 0): void {
    let cookie = `${key}=${value}`;
    if (expirationDays > 0) {
      let date = new Date();
      date.setTime(date.getTime() + expirationDays * 24 * 60 * 60 * 1000);
      cookie += `; expires=${date.toUTCString()}`;
    }
    document.cookie = cookie;
  }

  get(key: string): string | null {
    let response = null;
    decodeURIComponent(document.cookie)
      .split(';')
      .forEach(cookie => {
        if (cookie.trim().indexOf(key + '=') > -1) {
          response = cookie.split('=')[1];
        }
      });
    return response;
  }

  update(key: string, value: string, expirationDays: number = 0): boolean {
    if (this.get(key)) {
      this.new(key, value, expirationDays);
      return true;
    }
    return false;
  }

  delete(key: string): boolean {
    if (this.get(key)) {
      document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
      return true;
    }
    return false;
  }
}
