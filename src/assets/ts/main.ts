import { formValidator } from './_validation/form.validator.js';
import { Router } from './router.js';

const router = new Router();
const validator = new formValidator();

document.body.addEventListener('spaContentLoaded', e => {
  const form: HTMLElement | null = document.getElementById('form');

  if (form == null) return;

  switch (form.dataset.formId) {
    case 'login':
      validator.setup(form);
      break;
    case 'signup':
      validator.setup(form);
      break;
    default:
      break;
  }
});
