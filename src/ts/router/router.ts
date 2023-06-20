import { Route } from '../_interface';
import { Auth } from '../auth/auth';
import { ROUTES } from '../common';

export class Router {
  private static instance: Router;
  private auth: Auth;

  private routeList: { [key: string]: Route } = ROUTES;

  private constructor() {
    this.auth = Auth.getInstance();

    console.log('[Router] - instance created');
  }

  public static getInstance(): Router {
    if (!Router.instance) {
      Router.instance = new Router();
    }

    return this.instance;
  }

  public init(): void {
    window.onpopstate = () => this.handleRoute();

    this.handleRoute();

    console.log('[Router] - initialized');
  }

  public navigate(path: string): void {
    window.history.pushState({}, '', path);
    this.handleRoute();
  }

  public route(event: any) {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, '', event.target.href || '/');
    this.handleRoute();
  }

  public async handleRoute() {
    const path: string =
      window.location.pathname in this.routeList
        ? window.location.pathname
        : '404';
    const loggedIn: boolean = this.auth.getActiveUser() !== null;
    const loginRequired: boolean = this.routeList[path].loginRequired;
    const authenticatedForRoute: boolean = loginRequired && loggedIn;

    let currentRoute: Route = authenticatedForRoute
      ? this.routeList[path] || this.routeList['404']
      : this.routeList['/login'] || this.routeList['404'];

    if (loggedIn && currentRoute.id === 1) {
      window.location.href = '/';
      currentRoute = this.routeList['/'] || this.routeList['404'];
    }

    const pageContent = await fetch(currentRoute.path).then(data =>
      data.text()
    );

    document.title = currentRoute.title + ' | PWA Chat';
    document.body.innerHTML = pageContent;

    const spaContentLoadedEvent = new CustomEvent('spaContentLoaded', {
      detail: {
        pageId: currentRoute.id
      }
    });
    document.dispatchEvent(spaContentLoadedEvent);
  }
}
