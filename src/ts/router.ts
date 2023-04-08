import { route } from './_interface/route.interface.js';
import { Auth } from './auth.js';

declare global {
  interface Window {
    route: Function;
    navigateTo: Function;
  }
}

export class Router {
  private routes: Object = {
    404: {
      path: '/pages/404.html',
      title: '404',
      description: "The page you're looking for doesn't exist",
      loginRequired: false
    },
    '/': {
      path: '/pages/chat.html',
      title: 'Chat',
      description: 'Chat with your friends',
      loginRequired: true
    },
    '/login': {
      path: '/pages/login.html',
      title: 'Login',
      description: 'Login to your account',
      loginRequired: false
    },
    '/register': {
      path: '/pages/register.html',
      title: 'Register',
      description: 'Register a new account',
      loginRequired: false
    }
  };
  private spaContentLoadedEvent: Event;
  private auth: Auth;

  constructor() {
    this.auth = Auth.getInstance();
    this.spaContentLoadedEvent = new Event('spaContentLoaded');

    window.onpopstate = () => this.handleLocation;
    window.route = e => this.route(e);
    window.navigateTo = url => this.navigateTo(url);

    this.handleLocation();
  }

  public navigateTo(url: string): void {
    window.history.pushState({}, '', url);
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
      (!this.routes[path]?.loginRequired || this.auth.getActiveUser() != null
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

    document.body.dispatchEvent(this.spaContentLoadedEvent);
  }
}
