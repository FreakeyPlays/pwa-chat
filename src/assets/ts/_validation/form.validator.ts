import { user } from '../_interface/user.interface.js';
import { Auth } from '../auth.js';

export class formValidator {
  private inputs: Object = {
    userid: {
      regex: /^[a-zA-Z0-9]{8}$/,
      errorCodes: [451, 454],
      errorMessage:
        'Username must be 8 characters long and can only contain letters and numbers (HSE ID).'
    },
    password: {
      regex: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/,
      errorCodes: [455],
      errorMessage:
        'Password must contain at least 6 characters, including 1 number.'
    },
    passwordConfirm: {
      confirm: 'password',
      errorMessage: 'Passwords do not match.'
    },
    nickname: {
      regex: /^.{6,}$/,
      errorMessage: 'Nickname must be at least 6 characters long.'
    },
    fullname: {
      regex: /^.{3,}$/,
      errorMessage: 'Please provide a First and Last name.'
    }
  };
  private _auth = Auth.getInstance();

  constructor() {}

  public setup(form: HTMLElement) {
    const inputGroups: NodeListOf<HTMLElement> =
      form.querySelectorAll('.form__group');

    form.addEventListener('submit', e => {
      e.preventDefault();
      const form: HTMLFormElement = document.getElementById(
        'form'
      ) as HTMLFormElement;

      for (let inputGroup of inputGroups) {
        this.validateInput(
          inputGroup,
          this.inputs[inputGroup.dataset.formField]
        );
      }

      if (form.querySelectorAll('.error').length > 0) return;

      const formData: FormData = new FormData(e.target as HTMLFormElement);
      let userObj: user = { userid: '', password: '' };
      for (let pair of formData.entries()) {
        userObj[pair[0]] = pair[1];
      }

      switch (form.dataset.formId) {
        case 'login':
          this._auth
            .login(userObj)
            .then(() => {
              window.navigateTo('/');
            })
            .catch(err => {
              this.handleServerSideError(form, err);
            });
          break;
        case 'signup':
          this._auth
            .register(userObj)
            .then(() => {
              window.navigateTo('/');
            })
            .catch(err => {
              this.handleServerSideError(form, err);
            });
          break;
        default:
          break;
      }
    });

    for (let inputGroup of inputGroups) {
      inputGroup.querySelector('input').addEventListener('blur', () => {
        this.validateInput(
          inputGroup,
          this.inputs[inputGroup.dataset.formField]
        );
      });
    }
  }

  public validateInput(field: HTMLElement, settings: Object) {
    const inputElement: HTMLInputElement = field.querySelector('input');
    const inputValue: string = inputElement.value;

    if (settings['regex'] && inputValue.match(settings['regex'])) {
      this.setStatus(field, '');
      return;
    }

    if (settings['confirm']) {
      const passwordElement: HTMLInputElement = document.getElementById(
        settings['confirm']
      ) as HTMLInputElement;
      if (passwordElement.value === inputValue) {
        this.setStatus(field, '');
        return;
      }
    }

    this.setStatus(field, settings['errorMessage']);
  }

  public handleServerSideError(form: HTMLFormElement, err) {
    for (let key in this.inputs) {
      if (this.inputs[key].errorCodes?.includes(err.status)) {
        this.setStatus(
          form.querySelector(`[data-form-field="${key}"]`),
          err.statusText
        );
        return;
      }
    }
    alert(
      'An unknown error has occurred.\nPlease try again later.\nerrorCode: ' +
        err.status +
        '\nerrorMessage: ' +
        err.statusText
    );
  }

  public setStatus(field: HTMLElement, message: string = '') {
    const errorElement: HTMLElement = field.querySelector('.error-message');

    if (message === '') {
      errorElement.innerHTML = '';
      if (field.classList.contains('error')) field.classList.remove('error');
    } else {
      errorElement.innerHTML = message;
      if (!field.classList.contains('error')) field.classList.add('error');
    }
  }
}
