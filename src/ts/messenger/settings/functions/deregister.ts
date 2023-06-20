import { IndexedDBManager } from '../../../_service/idb/idb';
import { Auth } from '../../../auth/auth';

export class DeregisterFunction {
  private static instance: DeregisterFunction;
  private auth: Auth;
  private idb: IndexedDBManager;

  private constructor() {
    this.auth = Auth.getInstance();
    this.idb = IndexedDBManager.getInstance();

    console.log('[DeregisterFunction] - instance created');
  }

  public static getInstance(): DeregisterFunction {
    if (!DeregisterFunction.instance) {
      DeregisterFunction.instance = new DeregisterFunction();
    }
    return DeregisterFunction.instance;
  }

  public init(): void {
    this.setup();

    console.log('[DeregisterFunction] - initialized');
  }

  private setup() {
    const deregisterButton = document.getElementById(
      'deregister'
    ) as HTMLButtonElement;
    deregisterButton.addEventListener('click', () => {
      this.deregister();
    });
  }

  private async deregister() {
    const password = prompt(
      'Please provide your Password to Delete your Account.'
    );

    if (!password) return;

    const success = await this.auth.deregister(password);

    if (!success) {
      return;
    }

    this.idb.settings().clear();
    this.idb.messages().clear();
    this.idb.unsentMessages().clear();
    this.idb.wallpaper().clear();

    window.location.reload();
  }
}
