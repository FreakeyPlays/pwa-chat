import { formValidator } from './_validation/form.validator.js';
import { Chat } from './chat.js';
import { Router } from './router.js';

class App {
  private _router: Router;
  private validator: formValidator;
  private chat: Chat;

  private state: string;

  constructor() {
    this._router = new Router();
    this.validator = new formValidator();
    this.chat = new Chat();

    this.state = '';

    this.init();
  }

  public init() {
    document.body.addEventListener('spaContentLoaded', () => {
      this.updateState();
    });
  }

  private updateState() {
    const firstElement: HTMLElement | null = document.body
      .firstElementChild as HTMLElement;
    this.state = firstElement?.dataset.state;

    switch (this.state) {
      case 'login':
        this.validator.setup(firstElement.querySelector('.form'), this.state);
        break;
      case 'signup':
        this.validator.setup(firstElement.querySelector('.form'), this.state);
        break;
      case 'chat':
        this.chat.init();
        break;
      case '404':
        break;
      default:
        console.warn('Content did not load Correctly');
        this._router.navigateTo('/');
        break;
    }
  }
}

const app = new App();
