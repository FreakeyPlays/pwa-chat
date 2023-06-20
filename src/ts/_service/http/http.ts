import { Response } from '../../_interface';
import { CONFIG } from '../../common';

export class Http {
  private static instance: Http;
  private readonly baseUrl: string =
    CONFIG.BASE_URL_API || 'localhost:8081/api/v1';

  private constructor() {
    console.log('[Http] - instance created');
  }

  public static getInstance(): Http {
    if (!Http.instance) {
      Http.instance = new Http();
    }

    return this.instance;
  }

  public async fetchJson(method: string, body: Object): Promise<Response> {
    const response = await fetch(this.baseUrl, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw response;
    }

    return await response.json();
  }

  public async fetchBlob(method: string, body: Object) {
    const response = await fetch(this.baseUrl, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw response;
    }

    return await response.blob();
  }
}
