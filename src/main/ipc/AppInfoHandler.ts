import { app, ipcMain } from "electron";

export function registerAppInfoHandlers() {
  ipcMain.handle("get-app-version", () => {
    return app.getVersion();
  });
}
