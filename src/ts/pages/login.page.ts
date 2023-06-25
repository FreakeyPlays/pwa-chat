import { LoginUser, RegisterUser } from '../_interface';
import { Auth } from '../auth/auth';
import { ROUTES, VALIDATION_PARAMETER } from '../common';
import { Router } from '../router/router';

export class LoginPage {
  private static instance: LoginPage;
  private auth: Auth;
  private router: Router;

  private constructor() {
    this.auth = Auth.getInstance();
    this.router = Router.getInstance();

    document.addEventListener('spaContentLoaded', e => {
      if ((<CustomEvent>e).detail.pageId === ROUTES['/login'].id) {
        this.init();
      }
    });

    console.log('[LoginPage] - constructed LoginPage');
  }

  public static getInstance(): LoginPage {
    if (!LoginPage.instance) {
      LoginPage.instance = new LoginPage();
    }

    return LoginPage.instance;
  }

  private init(): void {
    this.setFormToggles();
    this.setPasswordToggles();

    this.setSignInEventlistener();
    this.setSignUpEventlistener();

    console.log('[LoginPage] - initialized LoginPage');
  }

  private setSignInEventlistener() {
    const signInForm = document.getElementById('form__signin');

    signInForm?.addEventListener('submit', (e: Event) => {
      this.startSignInProcess(e);
      e.preventDefault();
    });
  }

  private async startSignInProcess(e: Event) {
    const { user, stayLoggedIn } = this.getSignInFormData(
      e.target as HTMLFormElement
    );

    const errors: boolean = this.validateSignIn(user);

    if (errors) return;

    const success = await this.auth.login(user, stayLoggedIn);

    if (success) {
      this.router.navigate('/');
      console.log('[LoginPage] - Login successful');
    } else {
      console.log('[LoginPage] - Login failed');
    }
  }

  private getSignInFormData(form: HTMLFormElement): {
    user: LoginUser;
    stayLoggedIn: boolean;
  } {
    const formData = new FormData(form);

    const user: LoginUser = {
      userid: formData.get('userid') as string,
      password: formData.get('password') as string
    };

    const stayLoggedIn: boolean = formData.get('stayloggedin') === 'on';

    return { user, stayLoggedIn };
  }

  private validateSignIn(data: LoginUser): boolean {
    let mistakes = 0;

    for (const [key, value] of Object.entries(data)) {
      const validationRules = VALIDATION_PARAMETER[key as keyof typeof data];

      if (!validationRules) continue;

      for (const rule of validationRules) {
        if (!rule.validate(value)) {
          mistakes++;
          console.log(rule.errorMessage);
        }
      }
    }

    return mistakes > 0;
  }

  private setSignUpEventlistener() {
    const signUpForm = document.getElementById('form__signup');

    signUpForm?.addEventListener('submit', e => {
      this.startSignUpProcess(e);
      e.preventDefault();
    });
  }

  private async startSignUpProcess(e: Event) {
    const { user, passwordCheck } = this.getSignUpFormData(
      e.target as HTMLFormElement
    );

    const error = this.validateSignUp(user, passwordCheck);

    if (error) return;

    const success = await this.auth.register(user);

    if (success) {
      this.router.navigate('/');
      console.log('[LoginPage] - SignUp successful');
    } else {
      console.log('[LoginPage] - SignUp failed');
    }
  }

  private getSignUpFormData(form: HTMLFormElement): {
    user: RegisterUser;
    passwordCheck: string;
  } {
    const formData = new FormData(form);

    const user: RegisterUser = {
      userid: formData.get('userid') as string,
      password: formData.get('password') as string,
      nickname: formData.get('nickname') as string,
      fullname: formData.get('fullname') as string
    };

    const passwordCheck: string = formData.get('confirmpassword') as string;

    return { user, passwordCheck };
  }

  private validateSignUp(user: RegisterUser, passwordCheck: string): boolean {
    let mistakes = 0;

    if (user.password !== passwordCheck) {
      mistakes++;
      console.log('Passwords do not match');
    }

    for (const [key, value] of Object.entries(user)) {
      const validationRules = VALIDATION_PARAMETER[key as keyof typeof user];

      if (!validationRules) continue;

      for (const rule of validationRules) {
        if (!rule.validate(value)) {
          mistakes++;
          console.log(rule.errorMessage);
        }
      }
    }

    return mistakes > 0;
  }

  private setPasswordToggles() {
    const passwordToggles = document.querySelectorAll(
      '.form-content__password-toggle'
    );

    passwordToggles.forEach(toggle => {
      toggle.addEventListener('click', (e: Event) => {
        this.togglePassword(e);
      });
    });
  }

  private togglePassword(e: Event) {
    const passwordIcon: HTMLElement = e.target as HTMLElement;
    const passwordInput: HTMLInputElement =
      passwordIcon.previousElementSibling as HTMLInputElement;

    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      passwordIcon.classList.toggle('show-password');
    } else {
      passwordInput.type = 'password';
      passwordIcon.classList.toggle('show-password');
    }
  }

  private setFormToggles() {
    const formToggles = document.querySelectorAll('.forms__toggle');

    formToggles.forEach(toggle => {
      toggle.addEventListener('click', (e: Event) => {
        this.toggleForm(e);
      });
    });
  }

  private toggleForm(e: Event) {
    const container = document.getElementById('login__container');

    container?.classList.toggle('signup-mode');

    e.preventDefault();
  }
}
