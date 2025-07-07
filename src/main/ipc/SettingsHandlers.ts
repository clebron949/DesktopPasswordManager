import { ipcMain } from "electron";
import { StorageService, AppSettings } from "../services/LocalStorageService";

const storageService = StorageService.getInstance();

export function registerSettingsHandlers() {
  ipcMain.handle("settings:get", async (): Promise<AppSettings> => {
    return await storageService.getSettings();
  });

  ipcMain.handle(
    "settings:save",
    async (_, settings: Partial<AppSettings>): Promise<void> => {
      return await storageService.saveSettings(settings);
    },
  );

  ipcMain.handle("settings:reset", async (): Promise<void> => {
    return await storageService.resetSettings();
  });
}

