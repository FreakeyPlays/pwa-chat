import { response } from './_interface/response.interface';
import { user } from './_interface/user.interface';
import { ApiService } from './_service/api.service';
import { CookieService } from './_service/cookie.service';
import { IndexedDBManager } from './_service/storage.service';

export class Auth {
  private static _instance: Auth;
  private _apiService: ApiService;
  private _cookieService: CookieService;

  private EXPIRATION_DAYS = 7;

  private constructor() {
    this._apiService = new ApiService();
    this._cookieService = new CookieService();
  }

  public static getInstance(): Auth {
    if (!Auth._instance) {
      Auth._instance = new Auth();
    }
    return Auth._instance;
  }

  public async login(user: user, stayLoggedIn: boolean): Promise<response> {
    return this._apiService
      .logInUser(user)
      .then(response => {
        if (response.status != 'ok') {
          console.log('Something went Wrong');
        }

        this._cookieService.new(
          'token',
          response.token,
          stayLoggedIn ? this.EXPIRATION_DAYS : 0
        );
        this._cookieService.new(
          'hash',
          response.hash,
          stayLoggedIn ? this.EXPIRATION_DAYS : 0
        );
        return response;
      })
      .catch(err => {
        throw err;
      });
  }

  public logout() {
    this._cookieService.delete('token');
    this._cookieService.delete('hash');
    IndexedDBManager.getInstance().then(db => {
      db.deleteAllMessages();
      db.deleteAllUnsentMessages();
    });
    window.navigateTo('/login');
  }

  public register(user: user, stayLoggedIn: boolean): Promise<response> {
    return this._apiService
      .registerUser(user)
      .then(response => {
        if (response.status != 'ok') {
          console.log('Something went Wrong');
        }

        this._cookieService.new(
          'token',
          response.token,
          stayLoggedIn ? this.EXPIRATION_DAYS : 0
        );
        this._cookieService.new(
          'hash',
          response.hash,
          stayLoggedIn ? this.EXPIRATION_DAYS : 0
        );
        return response;
      })
      .catch(err => {
        throw err;
      });
  }
  public deregister() {
    this._apiService
      .deregisterUser(this._cookieService.get('token'))
      .then(response => {
        if (response.status != 'ok') {
          console.log('Something went Wrong');
        }
        this.logout();
      })
      .catch(err => {
        throw err;
      });
  }

  public getActiveUser(): Object | null {
    if (this._cookieService.get('token') && this._cookieService.get('hash')) {
      return {
        token: this._cookieService.get('token'),
        hash: this._cookieService.get('hash')
      };
    }
    return null;
  }
}
