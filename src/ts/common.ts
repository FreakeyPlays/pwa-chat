import { Route } from './_interface';

export const CONFIG = {
  COOKIE_EXPIRATION_DAYS: 30,
  COOKIE_TITLE: 'user',
  BASE_URL_API: 'https://www2.hs-esslingen.de/~melcher/map/chat/api/',
  HELP_URL:
    'https://github.com/FreakeyPlays/pwa-chat/blob/main/doc/help.md#help'
};

export const ROUTES: { [key: string]: Route } = {
  '404': {
    id: -1,
    path: '/pages/404.html',
    title: '404',
    loginRequired: false
  },
  '/': {
    id: 0,
    path: '/pages/chat.html',
    title: 'Chat',
    loginRequired: true
  },
  '/login': {
    id: 1,
    path: '/pages/login.html',
    title: 'Login',
    loginRequired: false
  }
};

export const VALIDATION_PARAMETER = {
  userid: [
    {
      validate(data: string): boolean {
        return data.trim().length > 0;
      },
      errorMessage: "User ID can't be empty"
    },
    {
      validate(data: string): boolean {
        return data.match(/^[a-zA-Z]{6}[0-9]{2}$/) !== null;
      },
      errorMessage: 'User ID must match HSE Username'
    }
  ],
  password: [
    {
      validate(data: string): boolean {
        return data.length > 0;
      },
      errorMessage: "Password can't be empty"
    }
  ],
  nickname: [
    {
      validate(data: string): boolean {
        return data.trim().length > 0;
      },
      errorMessage: "Nickname can't be empty"
    }
  ],
  fullname: [
    {
      validate(data: string): boolean {
        return data.trim().length > 0;
      },
      errorMessage: "Full Name can't be empty"
    }
  ]
};
