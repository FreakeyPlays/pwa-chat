import { message } from './message.interface.js';

export interface response {
  code: number;
  message: string;
  status: string;
  token?: string;
  hash?: string;
  messages?: Array<message>;
}
