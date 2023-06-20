import Message from '../message/message.interface';

export default interface Response {
  code: number;
  message: string;
  status: string;
  token?: string;
  hash?: string;
  messages?: Message[];
}
