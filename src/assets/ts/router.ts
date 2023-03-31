declare global {
  interface Window {
    route: Function;
  }
}

export class Router {
  private routes = {
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
  private loggedIn = true;

  constructor() {
    window.onpopstate = () => this.handleLocation;
    window.route = e => this.route(e);

    this.handleLocation();
  }

  public route(event) {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, '', event.target.href);
    this.handleLocation();
  }

  public async handleLocation() {
    const path = window.location.pathname;
    const route =
      (!this.routes[path].loginRequired || this.loggedIn
        ? this.routes[path]
        : this.routes['/login']) || this.routes[404];
    const html = await fetch(route.path).then(data => data.text());
    document.body.innerHTML = html;
    document.title = route.title + ' | PWA Chat';
  }
}
