import { response } from './_interface/response.interface';
import { user } from './_interface/user.interface';
import { ApiService } from './_service/api.service';

export class Auth {
  private static _instance: Auth;
  private _apiService: ApiService;
  private activeUser: Object;

  private constructor() {
    this._apiService = new ApiService();
    this.activeUser = null;
  }

  public static getInstance(): Auth {
    if (!Auth._instance) {
      Auth._instance = new Auth();
    }
    return Auth._instance;
  }

  public async login(user: user): Promise<response> {
    return this._apiService
      .logInUser(user)
      .then(response => {
        if (response.status != 'ok') {
          console.log('Something went Wrong');
        }

        this.activeUser = { token: response.token, hash: response.hash };
        return response;
      })
      .catch(err => {
        throw err;
      });
  }

  public logout() {
    this.activeUser = null;
  }

  public register(user: user): Promise<response> {
    return this._apiService
      .registerUser(user)
      .then(response => {
        if (response.status != 'ok') {
          console.log('Something went Wrong');
        }

        this.activeUser = { token: response.token, hash: response.hash };
        return response;
      })
      .catch(err => {
        throw err;
      });
  }
  public deregister(user: user) {}

  public setActiveUser(token: string, hash: string) {
    this.activeUser = { token, hash };
  }

  public getActiveUser(): Object | null {
    return this.activeUser;
  }
}
