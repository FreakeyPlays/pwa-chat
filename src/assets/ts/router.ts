import { route } from './_interface/route.interface.js';

declare global {
  interface Window {
    route: Function;
  }
}

export class Router {
  private routes: Object = {
    404: {
      path: '/assets/pages/404.html',
      title: '404',
      description: "The page you're looking for doesn't exist",
      loginRequired: false
    },
    '/': {
      path: '/assets/pages/chat.html',
      title: 'Chat',
      description: 'Chat with your friends',
      loginRequired: true
    },
    '/login': {
      path: '/assets/pages/login.html',
      title: 'Login',
      description: 'Login to your account',
      loginRequired: false
    },
    '/register': {
      path: '/assets/pages/register.html',
      title: 'Register',
      description: 'Register a new account',
      loginRequired: false
    }
  };
  private loggedIn: boolean = false;

  constructor() {
    window.onpopstate = () => this.handleLocation;
    window.route = e => this.route(e);

    this.handleLocation();
  }

  public route(event): void {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, '', event.target.href);
    this.handleLocation();
  }

  public async handleLocation() {
    const path: string = window.location.pathname;
    const currentRoute: route =
      (!this.routes[path]?.loginRequired || this.loggedIn
        ? this.routes[path] || this.routes[404]
        : this.routes['/login']) || this.routes[404];
    const html: string = await fetch(currentRoute.path).then(data =>
      data.text()
    );
    document.title = currentRoute.title + ' | PWA Chat';
    document
      .querySelector('meta[name="description"]')
      .setAttribute('content', currentRoute.description);
    document.body.innerHTML = html;
  }
}
