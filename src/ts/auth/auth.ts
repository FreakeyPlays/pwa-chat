import { LoginUser, RegisterUser, User } from '../_interface';
import UserCookie from '../_interface/user/userCookie.interface';
import { CookieService } from '../_service/cookie/cookie';
import * as API from '../_service/http';
import { CONFIG } from '../common';

export class Auth {
  private static instance: Auth;
  private cookie: CookieService;

  private constructor() {
    this.cookie = CookieService.getInstance();

    console.log('[Auth] - instance created');
  }

  public static getInstance(): Auth {
    if (!Auth.instance) {
      Auth.instance = new Auth();
    }

    return this.instance;
  }

  public async login(user: LoginUser, stayLoggedIn: boolean): Promise<boolean> {
    const response: User | null = await API.login(user);

    if (response === null) {
      console.log('[Auth]:login - Login failed');
      return false;
    }

    const userCookie = {
      token: response.token,
      hash: response.hash,
      userid: user.userid
    };

    if (stayLoggedIn) {
      this.cookie.create(
        CONFIG.COOKIE_TITLE,
        JSON.stringify(userCookie),
        CONFIG.COOKIE_EXPIRATION_DAYS
      );
    } else {
      this.cookie.create(CONFIG.COOKIE_TITLE, JSON.stringify(userCookie));
    }

    console.log('[Auth]:login - Login successful');
    return true;
  }

  public async logout() {
    const response = await API.logout();

    if (response === null || response.status !== 'ok') {
      console.log('[Auth]:logout - Logout failed');
    }

    this.cookie.delete(CONFIG.COOKIE_TITLE);
    console.log('[Auth]:logout - Logout successful');
  }

  public async register(newUser: RegisterUser): Promise<boolean> {
    const user = await API.register(newUser);

    if (user === null) {
      alert('Register failed');
      console.log('[Auth]:register - Register failed');
      return false;
    }

    const userCookie = {
      token: user.token,
      hash: user.hash,
      userid: newUser.userid
    };

    this.cookie.create(CONFIG.COOKIE_TITLE, JSON.stringify(userCookie));

    console.log('[Auth]:register - Register successful');
    return true;
  }

  public async deregister(password: string): Promise<boolean> {
    if (!password) {
      return false;
    }

    const cookie = this.cookie.get(CONFIG.COOKIE_TITLE);
    const token: string = JSON.parse(cookie ? cookie : '').token;
    const userid: string = JSON.parse(cookie ? cookie : '').userid;

    const response = await API.deregister({ userid, password, token });

    if (response === null || response.status !== 'ok') {
      alert('Deregister failed');
      console.log('[Auth]:deregister - Deregister failed');
      return false;
    }

    this.cookie.delete(CONFIG.COOKIE_TITLE);
    console.log('[Auth]:deregister - Deregister successful');
    return true;
  }

  public getActiveUser(): UserCookie | null {
    const userCookie = this.cookie.get(CONFIG.COOKIE_TITLE);

    return userCookie !== null ? JSON.parse(userCookie) : null;
  }
}
