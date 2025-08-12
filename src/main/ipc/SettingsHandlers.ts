import { ipcMain, dialog, BrowserWindow } from "electron";
import { StorageService, AppSettings } from "../services/LocalStorageService";
import { join } from "path";
import { createMenu } from "../middlewares/ApplicationMenu"; // Added to allow menu refresh after settings save

const storageService = StorageService.getInstance();

export function registerSettingsHandlers() {
  ipcMain.handle("settings:get", async (): Promise<AppSettings> => {
    return await storageService.getSettings();
  });

  ipcMain.handle(
    "settings:save",
    async (_, settings: Partial<AppSettings>): Promise<void> => {
      // Persist settings
      await storageService.saveSettings(settings);
      // Rebuild application menu so newly added/removed DB connections appear immediately
      try {
        await createMenu();
      } catch (err) {
        console.error(
          "Failed to rebuild application menu after settings save:",
          err
        );
      }
    }
  );

  ipcMain.handle("settings:reset", async (): Promise<void> => {
    return await storageService.resetSettings();
  });

  ipcMain.handle(
    "settings:open-folder-dialog",
    async (event): Promise<string | undefined> => {
      const win = BrowserWindow.getFocusedWindow();
      if (!win) {
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

  ipcMain.handle("settings:join-paths", (_, ...parts: string[]): string => {
    return join(...parts);
  });
}
