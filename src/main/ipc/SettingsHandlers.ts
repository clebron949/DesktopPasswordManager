import { ipcMain, app } from "electron";
import { StorageService, AppSettings } from "../services/LocalStorageService";
import {join} from "path";

const path = join(app.getPath("userData"), "storage");
const storageService = StorageService.getInstance(path);

export function registerSettingsHandlers() {
  ipcMain.handle("settings:get", async (): Promise<AppSettings> => {
    return await storageService.getSettings();
  });

  ipcMain.handle(
    "settings:save",
    async (_, settings: Partial<AppSettings>): Promise<void> => {
      return await storageService.saveSettings(settings);
    }
  );

  ipcMain.handle("settings:reset", async (): Promise<void> => {
    return await storageService.resetSettings();
  });
}