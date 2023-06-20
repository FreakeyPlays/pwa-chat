import { Response } from '../../../_interface';
import { Auth } from '../../../auth/auth';
import { Http } from '../http';

/**
 * Logs the User out
 */
export default async function logout(): Promise<Response | null> {
  const http = Http.getInstance();
  const auth = Auth.getInstance();

  if (auth.getActiveUser() === null) {
    console.log('[Http]:logout - No User is logged in');
    return null;
  }

  let options: { [key: string]: any } = {
    request: 'logout',
    toke: auth.getActiveUser()?.token
  };

  return await http
    .fetchJson('POST', options)
    .then(response => {
      return response;
    })
    .catch(error => {
      console.log('[Http]:logout - Something went Wrong\n', error);
      return null;
    });
}
