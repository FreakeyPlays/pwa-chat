import { Message, SendMessage } from '../_interface';
import { CreateMessage } from '../_interface/message/createMessage.interface';
import * as API from '../_service/http';
import { IndexedDBManager } from '../_service/idb/idb';
import { CONFIG } from '../common';
import { MessageConstructor } from './nodes/messageConstructor';
import { MessengerSettings } from './settings/settings';

export class Messenger {
  private static instance: Messenger;
  private settings: MessengerSettings;
  private messageConstructor: MessageConstructor;
  private idb: IndexedDBManager;

  private chatWindow!: HTMLElement;
  private lastMessageId: number;
  private isOnline: boolean;

  private constructor() {
    this.messageConstructor = MessageConstructor.getInstance();
    this.settings = MessengerSettings.getInstance();
    this.idb = IndexedDBManager.getInstance();
    this.lastMessageId = 0;
    this.isOnline = navigator.onLine;

    console.log('[Messenger] - instance created');
  }

  public static getInstance(): Messenger {
    if (!Messenger.instance) {
      Messenger.instance = new Messenger();
    }
    return Messenger.instance;
  }

  public init(): void {
    this.settings.init();
    this.chatWindow = document.getElementById('chat__window') as HTMLElement;
    this.fetchMessages();

    window.addEventListener('online', () => {
      console.log('[Messenger] - online event fired');
      this.isOnline = true;
      this.syncUnsentMessages();
      this.fetchMessages();
    });

    window.addEventListener('offline', () => {
      console.log('[Messenger] - offline event fired');
      this.isOnline = false;
    });

    this.setupHelpButton();
    console.log('[Messenger] - initialized');
  }

  public async saveUnsentMessage(message: SendMessage): Promise<void> {
    const success = await this.idb.unsentMessages().add(message);

    if (success) {
      console.log('[Messenger]:saveUnsentMessage - Message saved');
    } else {
      console.log('[Messenger]:saveUnsentMessage - Something went Wrong');
    }
  }

  public async syncUnsentMessages(): Promise<void> {
    const unsentMessages = await this.idb.unsentMessages().getAll();

    if (unsentMessages.length === 0) {
      return;
    }

    for (const unsentMessage of unsentMessages) {
      const success = await this.sendMessage(unsentMessage);

      if (success) {
        await this.idb.unsentMessages().delete(unsentMessage.id);
      }
    }

    console.log('[Messenger]:syncUnsentMessages - Messages synced');
  }

  public async sendMessage(message: SendMessage): Promise<boolean> {
    if (!this.isOnline) {
      await this.saveUnsentMessage(message);
      return true;
    }

    const response = await API.sendMessage(message);

    if (response === null) {
      console.log('[Messenger]:sendMessage - Something went Wrong');
      return false;
    }

    return response ? true : false;
  }

  private async loadLocalMessages(): Promise<void> {
    const createMessages: CreateMessage[] = await this.idb.messages().getAll();
    for (let createMessage of createMessages) {
      const message: Message = {
        id: createMessage.id,
        chatid: createMessage.chatid,
        userhash: createMessage.userhash,
        usernickname: createMessage.usernickname,
        time: createMessage.time
      };

      if (createMessage.text) {
        message.text = createMessage.text;
      }

      if (createMessage.photo) {
        message.photoid = URL.createObjectURL(createMessage.photo);
      }

      const html = this.messageConstructor.createNode(message);
      this.chatWindow.innerHTML = html + this.chatWindow.innerHTML;

      this.lastMessageId = message.id || 0;
    }
  }

  private async saveMessageLocal(message: Message): Promise<void> {
    const createMessage: CreateMessage = {
      id: message.id,
      chatid: message.chatid,
      userhash: message.userhash,
      usernickname: message.usernickname,
      time: message.time
    };

    if (message.text) {
      createMessage.text = message.text;
    }

    if (message.photoid) {
      const blob = await fetch(message.photoid).then(r => r.blob());
      createMessage.photo = blob;
    }

    this.idb.messages().add(createMessage);
  }

  public async fetchMessages(): Promise<void> {
    await this.loadLocalMessages();

    const messages = await API.fetchMessages(this.lastMessageId);

    if (messages === null) {
      console.log('[Messenger]:fetchMessages - Something went Wrong');
      return;
    }

    for (const message of messages) {
      if (message.photoid) {
        message.photoid = await this.fetchPhoto(message.photoid);
      }

      const html = this.messageConstructor.createNode(message);
      this.chatWindow.innerHTML = html + this.chatWindow.innerHTML;

      this.saveMessageLocal(message);
    }

    if (messages?.length === 0) {
      return;
    }

    this.lastMessageId = messages[messages.length - 1].id || 0;
    this.fetchMessages();
  }

  public async fetchPhoto(photoid: string): Promise<string> {
    const response = await API.fetchPhoto(photoid);

    if (response === null) {
      console.log('[Messenger]:fetchPhoto - Something went Wrong');
      return '';
    }

    return URL.createObjectURL(response);
  }

  private setupHelpButton(): void {
    const helpButton = document.getElementById('help') as HTMLElement;

    helpButton.addEventListener('click', () => {
      window.open(CONFIG.HELP_URL, '_blank')?.focus();
    });
  }
}
