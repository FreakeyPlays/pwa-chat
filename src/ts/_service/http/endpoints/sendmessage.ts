import { Response, SendMessage } from '../../../_interface';
import { Auth } from '../../../auth/auth';
import { Http } from '../http';

/**
 * Sends a Message containing text and/or a photo to the server
 * @param text
 * @param photo
 * @returns
 */
export default async function sendMessage(
  message: SendMessage
): Promise<Response | null> {
  const http = Http.getInstance();
  const auth = Auth.getInstance();

  if (auth.getActiveUser() === null) {
    console.log('[Http]:sendMessage - No User is logged in');
    return null;
  }

  if (message.text === undefined && message.photo === undefined) {
    console.log('[Http]:sendMessage - Message is empty');
    return null;
  }

  let body: { [key: string]: any } = {
    request: 'sendmessage',
    token: auth.getActiveUser()?.token,
    ...message
  };

  return await http
    .fetchJson('POST', body)
    .then(response => {
      return response;
    })
    .catch(error => {
      console.log('[Http]:sendMessage - Something went Wrong\n', error);
      return null;
    });
}
