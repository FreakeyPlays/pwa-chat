import { ThemeOption } from '../../../_interface/settings/settings';
import { IndexedDBManager } from '../../../_service/idb/idb';

export class ThemeSetting {
  private static instance: ThemeSetting;
  private idb: IndexedDBManager;

  private rootElement!: HTMLElement;
  private currentTheme: 'light' | 'dark' | null = 'light';
  private currentAccentColor: 'green' | 'purple' = 'green';

  private themeToggle!: HTMLElement;
  private accentColorButtons: HTMLElement[] = new Array<HTMLElement>();

  private constructor() {
    this.idb = IndexedDBManager.getInstance();

    console.log('[ThemeSetting] - instance created');
  }

  public static getInstance(): ThemeSetting {
    if (!ThemeSetting.instance) {
      ThemeSetting.instance = new ThemeSetting();
    }

    return ThemeSetting.instance;
  }

  public init(currentSetting: ThemeOption): void {
    this.setup();

    if (currentSetting.design === null) {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', event => {
          this.handleSystemPreference(event.matches ? 'dark' : 'light');
        });

      const preference = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';

      this.handleSystemPreference(preference);
    }

    if (currentSetting.design === 'dark') {
      this.toggleTheme();
    }

    if (currentSetting.accent === 'purple') {
      this.toggleAccentColor('purple');
    }

    console.log('[ThemeSetting] - initialized ThemeSetting');
  }

  public setup(): void {
    this.rootElement = document.body as HTMLElement;

    this.themeToggle = document.getElementById(
      'setting-theme-toggle'
    ) as HTMLElement;
    const accentContainer = document.getElementById(
      'setting-accent-container'
    ) as HTMLElement;

    this.themeToggle.addEventListener('input', () => {
      this.toggleTheme();
    });

    const accentButtons = accentContainer.children;

    for (let i = 0; i < accentButtons.length; i++) {
      const element = accentButtons[i] as HTMLButtonElement;
      this.accentColorButtons.push(element);

      element.addEventListener('click', () => {
        this.toggleAccentColor(element.dataset.color as 'green' | 'purple');
      });
    }
  }

  public handleSystemPreference(theme: 'light' | 'dark'): void {
    this.currentTheme = theme;

    if (theme === 'dark') {
      this.setToggleToState(true);
      this.rootElement.classList.add('theme--dark');
    } else {
      this.setToggleToState(false);
      this.rootElement.classList.remove('theme--dark');
    }

    console.log('[ThemeSetting] - toggled theme via system preference');
  }

  public setToggleToState(state: boolean): void {
    (
      this.themeToggle.querySelector(
        "input[type='checkbox']"
      ) as HTMLInputElement
    ).checked = state;
  }

  public async toggleTheme(): Promise<void> {
    if (this.currentTheme === 'dark') {
      this.rootElement.classList.remove('theme--dark');
      this.currentTheme = 'light';
      this.setToggleToState(false);
    } else {
      this.rootElement.classList.add('theme--dark');
      this.currentTheme = 'dark';
      this.setToggleToState(true);
    }

    await this.updateSettings();

    console.log('[ThemeSetting] - toggled theme');
  }

  public async toggleAccentColor(color: 'green' | 'purple'): Promise<void> {
    if (this.currentAccentColor === color) return;

    this.accentColorButtons.forEach(element => {
      element.classList.toggle('active');
    });
    this.rootElement.classList.toggle('theme--accent--purple');
    this.currentAccentColor = color;

    await this.updateSettings();

    console.log('[ThemeSetting] - toggled accent color');
  }

  public async updateSettings() {
    const stored = await this.idb.settings().get(1);

    stored.theme = {
      design: this.currentTheme,
      accent: this.currentAccentColor
    };

    const response = await this.idb.settings().update(stored);

    if (response) {
      console.log('[ThemeSetting] - updated settings');
    } else {
      console.log('[ThemeSetting] - failed to update settings');
    }
  }
}
