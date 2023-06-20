import { IndexedDBManager } from '../../../_service/idb/idb';
import { Auth } from '../../../auth/auth';

export class LogoutFunction {
  private static instance: LogoutFunction;
  private auth: Auth;
  private idb: IndexedDBManager;

  private constructor() {
    this.auth = Auth.getInstance();
    this.idb = IndexedDBManager.getInstance();

    console.log('[LogoutFunction] - instance created');
  }

  public static getInstance(): LogoutFunction {
    if (!LogoutFunction.instance) {
      LogoutFunction.instance = new LogoutFunction();
    }
    return LogoutFunction.instance;
  }

  public init(): void {
    this.setup();

    console.log('[LogoutFunction] - initialized');
  }

  private setup() {
    const logoutButton = document.getElementById('logout') as HTMLElement;
    logoutButton.addEventListener('click', () => {
      this.logout();
    });
  }

  private logout() {
    this.idb.settings().clear();
    this.idb.messages().clear();
    this.idb.unsentMessages().clear();
    this.idb.wallpaper().clear();

    this.auth.logout();

    window.location.reload();
  }
}
