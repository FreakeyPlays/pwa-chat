import { LoginUser, User } from '../../../_interface';
import { Auth } from '../../../auth/auth';
import { Http } from '../http';

/**
 * Logs the User in
 * @param user
 */
export default async function login(user: LoginUser): Promise<User | null> {
  const http = Http.getInstance();
  const auth = Auth.getInstance();

  if (auth.getActiveUser() !== null) {
    console.log('[Http]:login - An User is already logged in');
    return null;
  }

  let options: { [key: string]: any } = {
    request: 'login',
    ...user
  };

  return await http
    .fetchJson('POST', options)
    .then(response => {
      return {
        token: response.token as string,
        hash: response.hash as string
      };
    })
    .catch(error => {
      console.log('[Http]:login - Something went Wrong\n', error);
      return null;
    });
}
