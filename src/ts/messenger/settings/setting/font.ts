import { IndexedDBManager } from '../../../_service/idb/idb';

export class FontSetting {
  private static instance: FontSetting;
  private idb: IndexedDBManager;

  private currentSize: 's' | 'm' | 'l' = 'm';
  private rootElement!: HTMLElement;
  private buttons: HTMLButtonElement[] = new Array<HTMLButtonElement>();

  private constructor() {
    this.idb = IndexedDBManager.getInstance();

    console.log('[FontSetting] - instance created');
  }

  public static getInstance(): FontSetting {
    if (!FontSetting.instance) {
      FontSetting.instance = new FontSetting();
    }

    return FontSetting.instance;
  }

  public init(currentSetting: { current: 's' | 'm' | 'l' }): void {
    this.setup();

    if (currentSetting.current !== 'm') {
      this.toggleFont(currentSetting.current);
    }

    console.log('[FontSetting] - initialized FontSetting');
  }

  public setup(): void {
    const container = document.getElementById(
      'setting-font-container'
    ) as HTMLElement;
    this.rootElement = document.documentElement as HTMLElement;
    const buttons = container.children;

    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i] as HTMLButtonElement;
      this.buttons.push(button);
      button.addEventListener('click', () => {
        this.toggleFont(button.dataset.fontSize as 's' | 'm' | 'l');
      });
    }
  }

  private toggleFont(size: 's' | 'm' | 'l'): void {
    if (this.currentSize === size) return;

    this.currentSize = size;

    this.buttons.forEach(button => {
      if (button.dataset.fontSize === size) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });

    this.rootElement.classList.remove('text-size-s', 'text-size-l');
    if (size !== 'm') {
      this.rootElement.classList.add(`text-size-${size}`);
    }

    this.updateSetting();

    console.log('[FontSetting] - toggled font size');
  }

  private async updateSetting(): Promise<void> {
    const stored = await this.idb.settings().get(1);

    if (!stored) return;

    stored.fontSize.current = this.currentSize;

    const response = await this.idb.settings().update(stored);

    if (response) {
      console.log('[FontSetting] - updated setting');
    } else {
      console.log('[FontSetting] - failed to update setting');
    }
  }
}
