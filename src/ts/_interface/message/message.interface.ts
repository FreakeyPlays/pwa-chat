export default interface Message {
  id: number;
  chatid: number;
  userhash: string;
  usernickname: string;
  text?: string;
  photoid?: string;
  time: string;
}
