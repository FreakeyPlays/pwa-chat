import { response } from '../_interface/response.interface.js';
import { user } from '../_interface/user.interface.js';

export class ChatService {
  private url: string = 'https://www2.hs-esslingen.de/~melcher/map/chat/api/?';
  private token: string = null;

  private async httpRequest<T>(params?: URLSearchParams | string): Promise<T> {
    const response = await fetch(this.url + params);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return await response.json();
  }

  public async registerUser(user: user): Promise<response> {
    const params = new URLSearchParams({
      request: 'register',
      userid: user.userid,
      password: user.password,
      nickname: user.nickname,
      fullname: user.fullname
    });

    try {
      const data = await this.httpRequest<response>(params);
      this.token = data.token;
      return data;
    } catch (error: unknown) {
      console.error(error.toString());
      throw error;
    }
  }

  public async deregisterUser(user: user): Promise<response> {
    const params = new URLSearchParams({
      request: 'deregister',
      userid: user.userid,
      password: user.password
    });

    try {
      const data = await this.httpRequest<response>(params);
      return data;
    } catch (error: unknown) {
      console.error(error.toString());
      throw error;
    }
  }

  public async logInUser(user: user): Promise<response> {
    const params = new URLSearchParams({
      request: 'login',
      userid: user.userid,
      password: user.password
    });

    try {
      const data = await this.httpRequest<response>(params);
      this.token = data.token;
      return data;
    } catch (error: unknown) {
      console.error(error.toString());
      throw error;
    }
  }

  public async logOutUser(): Promise<response> {
    const params = new URLSearchParams({
      request: 'logout',
      token: this.token
    });

    try {
      const data = await this.httpRequest<response>(params);
      return data;
    } catch (error: unknown) {
      console.error(error.toString());
      throw error;
    }
  }

  public sendMessage(message: string): Promise<response> {
    const params = new URLSearchParams({
      request: 'sendmessage',
      token: this.token,
      message: message
    });

    try {
      const data = this.httpRequest<response>(params);
      return data;
    } catch (error: unknown) {
      console.error(error.toString());
      throw error;
    }
  }

  public fetchMessages(): Promise<response> {
    const params = new URLSearchParams({
      request: 'fetchmessages',
      token: this.token
    });

    try {
      const data = this.httpRequest<response>(params);
      return data;
    } catch (error: unknown) {
      console.error(error.toString());
      throw error;
    }
  }
}
