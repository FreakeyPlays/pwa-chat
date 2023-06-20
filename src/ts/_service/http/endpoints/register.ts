import { RegisterUser, User } from '../../../_interface';
import { Http } from '../http';

/**
 * Registers a new User with the Provided Information
 * @param newUser
 */
export default async function register(
  newUser: RegisterUser
): Promise<User | null> {
  const http = Http.getInstance();

  let options: { [key: string]: any } = {
    request: 'register',
    ...newUser
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
      console.log('[Http]:register - Something went Wrong\n', error);
      return null;
    });
}
