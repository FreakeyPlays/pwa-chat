import { Message } from '../../../_interface';
import { Auth } from '../../../auth/auth';
import { Http } from '../http';

/**
 * Fetches the Messages from the Server
 * If from parameter is provided, it will fetch all messages after the provided id
 * @param from
 */
export default async function fetchMessages(
  from?: number
): Promise<Message[] | null> {
  const http = Http.getInstance();
  const auth = Auth.getInstance();

  if (auth.getActiveUser() === null) {
    console.log('[Http]:fetchMessages - No User is logged in');
    return null;
  }

  let options: { [key: string]: any } = {
    request: 'fetchmessages',
    token: auth.getActiveUser()?.token
  };

  if (from !== undefined) {
    options.from = from;
  }

  return await http
    .fetchJson('POST', options)
    .then(response => {
      return response.messages as Message[];
    })
    .catch(error => {
      console.log('[Http]:fetchMessages - Something went Wrong\n', error);
      return null;
    });
}
