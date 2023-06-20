import { Response } from '../../../_interface';
import { Auth } from '../../../auth/auth';
import { Http } from '../http';

/**
 * Fetches the Image with the provided ID
 * @param photoid
 */
export default async function fetchPhoto(
  photoid: string
): Promise<Blob | null> {
  const http = Http.getInstance();
  const auth = Auth.getInstance();

  if (auth.getActiveUser() === null) {
    console.log('[Http]:fetchPhoto - No User is logged in');
    return null;
  }

  let options: { [key: string]: any } = {
    request: 'fetchphoto',
    token: auth.getActiveUser()?.token,
    photoid: photoid
  };

  return await http
    .fetchBlob('POST', options)
    .then(response => {
      return response;
    })
    .catch(error => {
      console.log('[Http]:fetchPhoto - Something went Wrong\n', error);
      return null;
    });
}
