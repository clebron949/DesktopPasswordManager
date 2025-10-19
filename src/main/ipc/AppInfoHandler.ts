import { ipcMain } from "electron";
import { getAppVersion } from "../services/appInfo/appVersion";

export function registerAppInfoHandlers() {
  ipcMain.handle("get-app-version", () => {
    return getAppVersion();
  });
}
