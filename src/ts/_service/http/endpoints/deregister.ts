import { DeregisterUser, Response } from '../../../_interface';
import { Http } from '../http';

/**
 * Deletes the User from the Server
 * @param user
 */
export default async function deregister(
  user: DeregisterUser
): Promise<Response | null> {
  const http = Http.getInstance();

  let options: { [key: string]: any } = {
    request: 'deregister',
    ...user
  };

  return await http
    .fetchJson('POST', options)
    .then(response => {
      return response;
    })
    .catch(error => {
      console.log('[Http]:register - Something went Wrong\n', error);
      return null;
    });
}
