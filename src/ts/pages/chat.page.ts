import { SendMessage } from '../_interface';
import { ROUTES } from '../common';
import { Camera } from '../messenger/features/camera';
import { SpeechToText } from '../messenger/features/speechToText';
import { Messenger } from '../messenger/messenger';

export class ChatPage {
  private static instance: ChatPage;
  private camera: Camera;
  private speechToText: SpeechToText;
  private messenger: Messenger;

  private picture: string = '';

  private constructor() {
    this.camera = Camera.getInstance();
    this.speechToText = SpeechToText.getInstance();
    this.messenger = Messenger.getInstance();

    document.addEventListener('spaContentLoaded', e => {
      if ((<CustomEvent>e).detail.pageId === ROUTES['/'].id) {
        this.init();
      }
    });

    console.log('[ChatPage] - constructed ChatPage');
  }

  public static getInstance(): ChatPage {
    if (!ChatPage.instance) {
      ChatPage.instance = new ChatPage();
    }

    return ChatPage.instance;
  }

  public init(): void {
    this.messenger.init();
    ////
    this.setupComposeMessage();
    this.setChatEventListener();
    this.setOptionsToggle();
    this.setupFilterMessages();
    ////
    console.log('[ChatPage] - initialized ChatPage');
  }

  private setChatEventListener(): void {
    const chatWindow = document.getElementById('chat__window');

    chatWindow?.addEventListener('click', e => {
      const target = e.target as HTMLElement;

      if (target.dataset.view === 'fullscreen') {
        this.openImageInFullSize(target as HTMLImageElement);
      }
    });

    console.log('[ChatPage] - activated chat event listener');
  }

  private setupSpeechToText(): void {
    const cameraPresent = 'mediaDevices' in navigator;

    if (!cameraPresent) return;

    const output = document.getElementById(
      'compose__container__input'
    ) as HTMLTextAreaElement;
    const microphoneToggle = document.getElementById('microphone__toggle');

    this.speechToText.init(output);

    microphoneToggle?.addEventListener('click', () => {
      this.toggleSpeechToText(microphoneToggle);
    });

    console.log('[ChatPage] - successful setup SpeechToText');
  }

  private toggleSpeechToText(toggle: HTMLElement): void {
    if (toggle.classList.contains('recording')) {
      toggle.classList.remove('recording');
      this.speechToText.stop();
      console.log('[ChatPage] - speech recognition stopped');
    } else {
      toggle.classList.add('recording');
      this.speechToText.start();
      console.log('[ChatPage] - speech recognition started');
    }
  }

  private setupCamera(): void {
    const cameraPresent = 'mediaDevices' in navigator;

    if (!cameraPresent) return;

    const toggle = document.getElementById('camera__toggle') as HTMLElement;
    const cameraModal = document.getElementById(
      'camera-modal'
    ) as HTMLDialogElement;
    const cameraPreview = cameraModal.querySelector(
      'video'
    ) as HTMLVideoElement;
    const cameraClose = cameraModal.querySelector(
      '.camera__close'
    ) as HTMLElement;
    const cameraShutter = cameraModal.querySelector(
      '.camera__options__shutter'
    ) as HTMLElement;

    const picturePreviewContainer = document.getElementById(
      'chat__preview'
    ) as HTMLElement;
    const picturePreview = picturePreviewContainer.querySelector(
      'img'
    ) as HTMLImageElement;
    const removePreview = picturePreviewContainer.querySelector(
      '.chat__preview__container__remove'
    ) as HTMLElement;

    this.camera.init(cameraPreview);

    toggle.addEventListener('click', () => {
      if (!cameraModal.open) {
        this.camera.start();
        (cameraModal as HTMLDialogElement).showModal();
      }
    });

    cameraClose.addEventListener('click', () => {
      cameraModal.close();
    });

    cameraModal.addEventListener('click', (e: MouseEvent) => {
      this.closeModalOnClickOutside(e, cameraModal);
    });

    cameraModal.addEventListener('close', () => {
      this.camera.stop();
    });

    cameraShutter.addEventListener('click', () => {
      const snapShot = this.camera.takePicture();
      if (!snapShot) return;
      this.picture = snapShot;
      picturePreview.src = this.picture;
      cameraModal.close();
    });

    removePreview.addEventListener('click', () => {
      picturePreview.removeAttribute('src');
      this.picture = '';
    });

    console.log('[ChatPage] - successful setup Camera');
  }

  private closeModalOnClickOutside(
    event: MouseEvent,
    modal: HTMLDialogElement
  ): void {
    const modalBoundingBox = modal.getBoundingClientRect();

    if (
      event.clientX < modalBoundingBox.left ||
      event.clientX > modalBoundingBox.right ||
      event.clientY < modalBoundingBox.top ||
      event.clientY > modalBoundingBox.bottom
    ) {
      modal.close();
    }
  }

  private openImageInFullSize(imgSource: HTMLImageElement): void {
    const imageModal = document.getElementById(
      'image-modal'
    ) as HTMLDialogElement;
    const previewElement = imageModal?.querySelector('img') as HTMLImageElement;
    const imageClose = imageModal.querySelector('.image__close') as HTMLElement;

    previewElement.src = imgSource.src;

    if (imageModal.open) return;

    imageModal.showModal();

    imageModal.addEventListener('click', (e: MouseEvent) => {
      this.closeModalOnClickOutside(e, imageModal);
    });

    imageClose.addEventListener('click', () => {
      imageModal.close();
    });
  }

  private setOptionsToggle(): void {
    const optionsToggle = document.getElementById('options__toggle');

    optionsToggle?.addEventListener('click', () => {
      const optionsContainer = document.getElementById(
        'options'
      ) as HTMLDialogElement;
      optionsContainer?.classList.toggle('active');
    });
    console.log('[ChatPage] - activated options toggle');
  }

  private setupComposeMessage(): void {
    this.setupSpeechToText();
    this.setupCamera();

    const composeContainer = document.getElementById(
      'chat__compose'
    ) as HTMLDivElement;
    const composeInput = composeContainer.querySelector(
      'textarea'
    ) as HTMLTextAreaElement;
    const composeSend = composeContainer.querySelector(
      '.compose__send'
    ) as HTMLElement;

    composeInput.addEventListener('input', (e: any) => {
      this.resizeTextarea(e.target);
    });

    composeSend.addEventListener('click', () => {
      this.sendMessage();
    });

    console.log('[ChatPage] - successful setup compose message');
  }

  private resizeTextarea(srcElement: HTMLTextAreaElement): void {
    const currentLineHeight = parseInt(
      window.getComputedStyle(srcElement, null).getPropertyValue('line-height')
    );

    if (srcElement.scrollHeight < currentLineHeight * 5) {
      srcElement.style.height = '0px';
      srcElement.style.height = `${srcElement.scrollHeight}px`;
    }
  }

  private async sendMessage(): Promise<void> {
    const composeContainer = document.getElementById(
      'chat__compose'
    ) as HTMLDivElement;
    const composeInput = composeContainer.querySelector(
      'textarea'
    ) as HTMLTextAreaElement;

    const picturePreviewContainer = document.getElementById(
      'chat__preview'
    ) as HTMLElement;
    const picturePreview = picturePreviewContainer.querySelector(
      'img'
    ) as HTMLImageElement;

    const message = composeInput.value.trim();

    if (message === '' && this.picture === '') return;

    let messageObject: SendMessage = {};
    if (message !== '') {
      messageObject.text = message;
    }
    if (this.picture !== '') {
      messageObject.photo = this.picture.slice(22);
    }

    const successful = await this.messenger.sendMessage(messageObject);

    if (!successful) return;

    picturePreview.removeAttribute('src');
    composeInput.value = '';
    this.picture = '';

    if (navigator.onLine) this.messenger.fetchMessages();
  }

  private setupFilterMessages(): void {
    const search = document.getElementById('search');
    const searchbar = document.getElementById('searchbar') as HTMLElement;
    const searchInput = searchbar.querySelector('input') as HTMLInputElement;

    if (search) {
      search.addEventListener('click', () => {
        if (!searchbar) return;

        if (searchbar.classList.contains('active')) {
          searchbar.classList.remove('active');
          searchInput.value = '';
          this.filterMessages('');
        } else {
          searchbar.classList.add('active');
        }
      });
    }

    if (searchbar) {
      searchbar.addEventListener('input', (e: any) => {
        this.filterMessages(e.target.value);
      });
    }
  }

  private filterMessages(query: string) {
    const messages = document.getElementById('chat__window')?.children;

    if (!messages) return;

    this.resetFilterMessages(messages);
    if (query === '') return;

    if (query.match(/^@[a-zA-Z0-9]{8}$/)) {
      console.log('filter by user id');
      this.filterMessagesByUserId(query, messages);
      return;
    }

    if (query.match(/^!img$/)) {
      console.log('filter by image');
      this.filterMessagesByImage(messages);
      return;
    }

    this.filterMessagesByText(query, messages);
  }

  private resetFilterMessages(messages: HTMLCollection) {
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i] as HTMLElement;
      message.style.display = 'block';
    }
  }

  private filterMessagesByText(query: string, messages: HTMLCollection) {
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i] as HTMLElement;
      const messageText = message.querySelector(
        '.message__body__text__content'
      ) as HTMLElement;

      if (!messageText) continue;

      if (messageText.innerText.includes(query)) {
        message.style.display = 'block';
      } else {
        message.style.display = 'none';
      }
    }
  }

  private filterMessagesByImage(messages: HTMLCollection) {
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i] as HTMLElement;
      const messageImage = message.querySelector('img');

      if (messageImage?.src !== '') {
        console.log('FilterImage - show');
        message.style.display = 'block';
      } else {
        console.log('FilterImage - hide');
        message.style.display = 'none';
      }
    }
  }

  private filterMessagesByUserId(query: string, messages: HTMLCollection) {
    query = query.slice(1);

    for (let i = 0; i < messages.length; i++) {
      const message = messages[i] as HTMLElement;
      const messageUserId = message.dataset.sender;

      if (messageUserId === query) {
        message.style.display = 'block';
      } else {
        message.style.display = 'none';
      }
    }
  }
}
