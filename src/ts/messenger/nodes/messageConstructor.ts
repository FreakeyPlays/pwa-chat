import { Message } from '../../_interface';
import { Auth } from '../../auth/auth';

export class MessageConstructor {
  private static instance: MessageConstructor;
  private auth: Auth;

  private latestDayTag: Date;
  private currentSender: string;
  private currentUser!: string;

  constructor() {
    this.auth = Auth.getInstance();
    this.currentSender = '';
    this.latestDayTag = new Date(1970, 1, 1);

    console.log('[messageNode] - instance created');
  }

  public static getInstance(): MessageConstructor {
    if (!MessageConstructor.instance) {
      MessageConstructor.instance = new MessageConstructor();
    }
    return MessageConstructor.instance;
  }

  public createNode(message: Message): string {
    this.currentUser = this.auth.getActiveUser()?.hash || '';
    let dateChanged = false;
    let myself = false;
    let sameSender = true;
    let emojiOnly = false;
    const { dateObj, date, time } = this.parseDate(message.time);

    if (message.userhash === this.currentUser) {
      myself = true;
    }

    if (message.userhash !== this.currentSender) {
      this.currentSender = message.userhash;
      sameSender = false;
    }

    if (this.compareDates(dateObj, this.latestDayTag)) {
      this.latestDayTag = dateObj;
      dateChanged = true;
      sameSender = false;
    }

    if (
      !message.photoid &&
      message.text &&
      this.checkIfEmojiOnly(message.text)
    ) {
      emojiOnly = true;
    }

    return dateChanged
      ? this.getMessageNode(myself, sameSender, emojiOnly, message, time) +
          this.getDividerNode(date)
      : this.getMessageNode(myself, sameSender, emojiOnly, message, time);
  }

  private checkIfEmojiOnly(text: string): boolean {
    const emojiRegex =
      /^(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])+$/;

    return text.match(emojiRegex) ? true : false;
  }

  private compareDates(date1: Date, date2: Date): boolean {
    date1.setHours(0, 0, 0, 0);
    date2.setHours(0, 0, 0, 0);

    return date1 > date2;
  }

  private parseDate(dateString: string) {
    const [datePart, timePart] = dateString.split('_');
    const [year, month, day] = datePart.split('-');
    const [hour, minute, second] = timePart.split('-');

    const dateObj = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second)
    );
    const time = dateObj.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
    const date = dateObj.toLocaleDateString([], {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });

    return { dateObj, date, time };
  }

  private randomColorBasedOnHash(hash: string): string {
    let random = 0;
    for (let i = 0; i < hash.length; i++) {
      random = hash.charCodeAt(i) + ((random << 5) - random);
    }

    return `hsl(${random % 360}, 85%, 50%)`;
  }

  private getDividerNode(date: string): string {
    return `<div class="chat__window__divider">${date}</div>`;
  }

  public getMessageNode(
    myself: boolean,
    sameSender: boolean,
    emojiOnly: boolean,
    message: Message,
    time: string
  ): string {
    return `<div data-message-id="${message.id}" data-sender="${
      message.userhash
    }" class="message ${myself ? 'myself' : ''} ${
      sameSender ? 'same_sender' : ''
    } ${
      emojiOnly ? 'emoji_only' : ''
    }"><div class="message__header"><div style="color: ${this.randomColorBasedOnHash(
      message.userhash
    )};" class="message__header__sender">${
      message.usernickname
    }</div></div><div class="message__body"><img ${
      message.photoid ? `src="${message.photoid}"` : ''
    } ${
      message.photoid ? 'data-view="fullscreen"' : ''
    } class="message__body__image" /><div class="message__body__text"><span class="message__body__text__content">${
      message.text ? message.text : ''
    }</span><span class="message__body__text__time">${time}</span></div></div></div>`;
  }
}
