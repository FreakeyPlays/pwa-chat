import { formValidator } from './_validation/form.validator.js';
import { Router } from './router.js';

class App {
  private _router: Router;
  private validator: formValidator;

  constructor() {
    this._router = new Router();
    this.validator = new formValidator();
    this.init();
  }

  public init() {
    document.body.addEventListener('spaContentLoaded', e => {
      const form: HTMLElement | null = document.getElementById('form');

      if (form == null) return;

      switch (form.dataset.formId) {
        case 'login':
          this.validator.setup(form);
          break;
        case 'signup':
          this.validator.setup(form);
          break;
        default:
          break;
      }
    });
  }
}

const app = new App();
