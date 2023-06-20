export interface CreateMessage {
  id: number;
  chatid: number;
  userhash: string;
  usernickname: string;
  text?: string;
  photo?: Blob;
  time: string;
}
