import { WallpaperOption } from '../../../_interface/settings/settings';
import { IndexedDBManager } from '../../../_service/idb/idb';

export class WallpaperSetting {
  private static instance: WallpaperSetting;
  private idb: IndexedDBManager;

  private background!: HTMLElement;
  private currentWallpaper: WallpaperOption = { current: null };
  private wallpaperContainer!: HTMLElement;

  private constructor() {
    this.idb = IndexedDBManager.getInstance();

    console.log('[WallpaperSetting] - instance created');
  }

  public static getInstance(): WallpaperSetting {
    if (!WallpaperSetting.instance) {
      WallpaperSetting.instance = new WallpaperSetting();
    }

    return WallpaperSetting.instance;
  }

  public init(currentSetting: WallpaperOption): void {
    this.setup();

    if (currentSetting.current) {
      this.currentWallpaper = currentSetting;
      this.setWallpaper(currentSetting.current);
    }

    this.updateWallpaperPreview();
    console.log('[WallpaperSetting] - initialized WallpaperSetting');
  }

  public setup(): void {
    this.background = document.getElementById('chat__window') as HTMLElement;
    this.wallpaperContainer = document.getElementById(
      'wallpaper__container'
    ) as HTMLElement;
    const wallpaperReset = document.getElementById(
      'wallpaper__reset'
    ) as HTMLElement;

    for (let i = 0; i < this.wallpaperContainer.children.length; i++) {
      const wallpaperPreview = this.wallpaperContainer.children[
        i
      ] as HTMLElement;

      if (wallpaperPreview.dataset.wallpaperId) {
        wallpaperPreview.addEventListener('click', e => {
          this.setWallpaper(
            Number(wallpaperPreview.dataset.wallpaperId) as 1 | 2 | 3
          );
        });

        continue;
      }

      const fileInput = wallpaperPreview.querySelector(
        'input'
      ) as HTMLInputElement;

      fileInput.addEventListener('change', () => {
        if (!fileInput.files) return;

        const image: File = fileInput.files[0];
        this.saveWallpaper(image);
      });
    }

    wallpaperReset.addEventListener('click', () => {
      this.resetWallpaper();
    });
  }

  public async saveWallpaper(newImage: File) {
    const storedWallpaper = await this.idb.wallpaper().getAll();
    console.log(storedWallpaper);

    if (storedWallpaper[1]) {
      const wallpaperTwo = storedWallpaper[1];
      await this.idb.wallpaper().update({ id: 3, image: wallpaperTwo.image });
    }
    if (storedWallpaper[0]) {
      const wallpaperOne = storedWallpaper[0];
      await this.idb.wallpaper().update({ id: 2, image: wallpaperOne.image });
    }

    await this.idb.wallpaper().update({ id: 1, image: newImage });

    this.updateWallpaperPreview();
    this.currentWallpaper = { current: 1 };
    await this.updateSetting();
    this.setWallpaper(1);
  }

  public async updateWallpaperPreview(): Promise<void> {
    const storedWallpaper = await this.idb.wallpaper().getAll();

    for (let i = 0; i < storedWallpaper.length; i++) {
      const wallpaperPreview = this.wallpaperContainer.querySelector(
        `[data-wallpaper-id="${i + 1}"]`
      ) as HTMLElement;

      if (storedWallpaper[i]) {
        wallpaperPreview.style.backgroundImage = `url(${URL.createObjectURL(
          storedWallpaper[i].image
        )})`;

        if (wallpaperPreview.classList.contains('empty')) {
          wallpaperPreview.classList.remove('empty');
        }
      } else {
        wallpaperPreview.style.backgroundImage = 'none';
      }
    }
  }

  public async setWallpaper(id: 1 | 2 | 3): Promise<void> {
    this.currentWallpaper = { current: id };
    const image = await this.idb.wallpaper().get(id);
    this.background.style.backgroundImage = `url(${URL.createObjectURL(
      image.image
    )})`;
    this.updateSetting();
  }

  public resetWallpaper(): void {
    this.currentWallpaper = { current: null };
    this.background.style.backgroundImage = 'none';
    this.updateSetting();
  }

  public async updateSetting() {
    const stored = await this.idb.settings().get(1);

    stored.wallpaper = this.currentWallpaper;

    const response = await this.idb.settings().update(stored);

    if (response) {
      console.log('[WallpaperSetting] - updated wallpaper setting');
    } else {
      console.log('[WallpaperSetting] - failed to update wallpaper setting');
    }
  }
}
