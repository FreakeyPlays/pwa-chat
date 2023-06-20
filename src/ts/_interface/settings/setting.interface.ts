import { FontSizeOption, ThemeOption, WallpaperOption } from './settings';

export interface Setting {
  id?: number;
  theme: ThemeOption;
  wallpaper: WallpaperOption;
  fontSize: FontSizeOption;
}
