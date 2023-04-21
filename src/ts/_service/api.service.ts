import { response } from '../_interface/response.interface';
import { user } from '../_interface/user.interface';

export class ApiService {
  private url: string = 'https://www2.hs-esslingen.de/~melcher/map/chat/api/';

  private async httpRequest<T>(
    data?: URLSearchParams | string,
    method: string = 'POST'
  ): Promise<T> {
    const response = await fetch(this.url, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: data
    });

    if (!response.ok) {
      throw response;
    }

    return await response.json();
  }

  constructor() {}

  public async registerUser(user: user): Promise<response> {
    const data = JSON.stringify({
      request: 'register',
      userid: user.userid,
      password: user.password,
      nickname: user.nickname,
      fullname: user.fullname
    });

    try {
      return await this.httpRequest<response>(data);
    } catch (error: unknown) {
      throw error;
    }
  }

  public async deregisterUser(token: string): Promise<response> {
    const data = JSON.stringify({
      request: 'deregister',
      token: token
    });

    try {
      return await this.httpRequest<response>(data);
    } catch (error: unknown) {
      console.error(error.toString());
      throw error;
    }
  }

  public async logInUser(user: user): Promise<response> {
    const data = JSON.stringify({
      request: 'login',
      userid: user.userid,
      password: user.password
    });

    try {
      return await this.httpRequest<response>(data);
    } catch (error: unknown) {
      throw error;
    }
  }

  public async logOutUser(token: string): Promise<response> {
    const data = JSON.stringify({
      request: 'logout',
      token: token
    });

    try {
      return await this.httpRequest<response>(data);
    } catch (error: unknown) {
      console.error(error.toString());
      throw error;
    }
  }

  public sendMessage(token: string, message: string): Promise<response> {
    const data = JSON.stringify({
      request: 'sendmessage',
      token: token,
      text: message
    });

    try {
      return this.httpRequest<response>(data);
    } catch (error: unknown) {
      console.error(error.toString());
      throw error;
    }
  }

  public fetchMessages(token: string): Promise<response> {
    const data = JSON.stringify({
      request: 'fetchmessages',
      token: token
    });

    try {
      return this.httpRequest<response>(data);
    } catch (error: unknown) {
      console.error(error.toString());
      throw error;
    }
  }
}
