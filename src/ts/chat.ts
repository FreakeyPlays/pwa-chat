import { message } from './_interface/message.interface.js';
import { ApiService } from './_service/api.service.js';
import { Auth } from './auth.js';

export class Chat {
  private _apiService: ApiService;
  private _auth: Auth;
  private pathMessageHtml: string = '/components/message.html';
  private messageHtml: HTMLElement;

  constructor() {
    this._apiService = new ApiService();
    this._auth = Auth.getInstance();
    this.getMessageHtml().then(string => {
      const html: Document = new DOMParser().parseFromString(
        string,
        'text/html'
      );

      this.messageHtml = html.body.firstElementChild as HTMLElement;
    });
  }

  private async getMessageHtml(): Promise<string> {
    try {
      const response = await fetch(this.pathMessageHtml);
      const html = await response.text();
      return html;
    } catch (error) {
      console.error(error);
      return '';
    }
  }

  public init() {
    this.fetchMessages();
    document.getElementById('chat__input').addEventListener('keydown', e => {
      if (e.key == 'Enter' && !e.shiftKey) {
        e.preventDefault();
      }
    });
    document.getElementById('chat__input').addEventListener('submit', e => {
      e.preventDefault();
      this.sendMessage(
        (e.target as HTMLFormElement).querySelector('.chat__input__text')
      );
    });
    document.getElementById('header__back').addEventListener('click', () => {
      this._auth.logout();
    });
  }

  private sendMessage(input: HTMLInputElement) {
    const text = input.value.trim();
    input.value = '';

    if (text === '') return;
    if (this._auth.getActiveUser() == null) return;

    this._apiService
      .sendMessage(this._auth.getActiveUser()['token'], text)
      .then(() => this.fetchMessages())
      .catch(e => console.error("Couldn't send message", e));
    this.fetchMessages();
  }

  public fetchMessages() {
    if (this._auth.getActiveUser() == null) return;

    this._apiService
      .fetchMessages(this._auth.getActiveUser()['token'])
      .then(e => this.addMessageNodes(e.messages))
      .catch(err => console.error('Could not fetch messages', err));
  }

  private compareDates(date: string) {
    let dateArr: Array<string> = date.split('_');
    dateArr[1] = dateArr[1].replaceAll('-', ':');
    date = dateArr.join('T') + 'Z';

    const messageTimeStamp: Date = new Date(date);

    const now: Date = new Date();
    if (now.getTime() - messageTimeStamp.getTime() < 24 * 60 * 60 * 1000) {
      return messageTimeStamp.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      return messageTimeStamp.toLocaleDateString([], {
        month: '2-digit',
        year: '2-digit',
        weekday: 'short'
      });
    }
  }

  private addMessageNodes(messages: Array<message>) {
    const chatWindow: HTMLElement = document.getElementById('chat__window');
    const lastMessageId: number = parseInt(
      (chatWindow.lastElementChild as HTMLElement)?.dataset.id || '0'
    );
    const hashOfUser: string = this._auth.getActiveUser()['hash'];

    if (chatWindow == null) return;

    for (let message of messages) {
      if (message.id <= lastMessageId) continue;

      let html: HTMLElement = this.messageHtml.cloneNode(true) as HTMLElement;

      html.dataset.id = message.id.toString();
      html.dataset.chatId = message.id.toString();
      html.dataset.userHash = message.userhash;
      html.querySelector('.message__title__name').innerHTML =
        message.usernickname;
      const time = new Date(message.time);
      html.querySelector('.message__title__time').innerHTML = this.compareDates(
        message.time
      );
      html.querySelector('.message__content').innerHTML = message.text;

      if (message.userhash === hashOfUser) html.classList.add('myself');

      chatWindow.appendChild(html);

      chatWindow.scrollTo(0, chatWindow.scrollHeight);
    }
  }
}
