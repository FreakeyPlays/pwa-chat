import { Setting } from '../../_interface/settings/setting.interface';
import { IndexedDBManager } from '../../_service/idb/idb';
import { DeregisterFunction } from './functions/deregister';
import { LogoutFunction } from './functions/logout';
import { FontSetting } from './setting/font';
import { ThemeSetting } from './setting/theme';
import { WallpaperSetting } from './setting/wallpaper';

export class MessengerSettings {
  private static instance: MessengerSettings;
  private idb: IndexedDBManager;

  private wallpaperSetting: WallpaperSetting;
  private themeSetting: ThemeSetting;
  private fontSizeSetting: FontSetting;

  private logoutFunction: LogoutFunction;
  private deregisterFunction: DeregisterFunction;

  private currentSetting!: Setting;

  private constructor() {
    this.idb = IndexedDBManager.getInstance();

    this.wallpaperSetting = WallpaperSetting.getInstance();
    this.themeSetting = ThemeSetting.getInstance();
    this.fontSizeSetting = FontSetting.getInstance();

    this.logoutFunction = LogoutFunction.getInstance();
    this.deregisterFunction = DeregisterFunction.getInstance();

    console.log('[MessengerSettings] - instance created');
  }

  public static getInstance(): MessengerSettings {
    if (!MessengerSettings.instance) {
      MessengerSettings.instance = new MessengerSettings();
    }

    return MessengerSettings.instance;
  }

  public async init(): Promise<void> {
    await this.setupSettings();

    this.themeSetting.init(this.currentSetting.theme);
    this.wallpaperSetting.init(this.currentSetting.wallpaper);
    this.fontSizeSetting.init(this.currentSetting.fontSize);

    this.logoutFunction.init();
    this.deregisterFunction.init();

    console.log('[MessengerSettings] - initialized MessengerSettings');
  }

  private async setupSettings(): Promise<void> {
    this.currentSetting = await this.idb.settings().get(1);

    if (this.currentSetting) return;

    this.currentSetting = {
      theme: {
        design: null,
        accent: 'green'
      },
      wallpaper: {
        current: null
      },
      fontSize: {
        current: 'm'
      }
    };

    const response = await this.idb.settings().add(this.currentSetting);

    if (response) {
      console.log('[MessengerSettings] - added default settings');
    } else {
      console.log('[MessengerSettings] - failed to add default settings');
    }
  }
}
