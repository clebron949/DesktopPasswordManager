import { ipcMain, dialog, BrowserWindow } from "electron";
import { StorageService, AppSettings } from "../services/LocalStorageService";
import { join } from "path";

const storageService = StorageService.getInstance();

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

  ipcMain.handle(
    "settings:open-folder-dialog",
    async (event): Promise<string | undefined> => {
      const win = BrowserWindow.getFocusedWindow();
      if(!win) {
        throw new Error("No focused window found for dialog.");
      }
      const result = await dialog.showOpenDialog(win, {
        properties: ["openDirectory"],
      });
      if (result.canceled || result.filePaths.length === 0) {
        return undefined;
      }
      return result.filePaths[0];
    }
  );

  ipcMain.handle(
    "settings:join-paths",
    (_, ...parts: string[]): string => {
      return join(...parts);
    }
  );
}
