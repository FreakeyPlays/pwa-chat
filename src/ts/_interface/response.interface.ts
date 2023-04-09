import { message } from './message.interface';

export interface response {
  code: number;
  message: string;
  status: string;
  token?: string;
  hash?: string;
  messages?: Array<message>;
}
