import { app, BrowserWindow, ipcMain, session } from "electron";
import { join } from "path";
import { mkdirSync, existsSync } from "fs";
import { registerSettingsHandlers } from "./ipc/SettingsHandlers";
import { registerDatabaseHandlers } from "./ipc/DatabaseHandler";
import { createMenu } from "./middlewares/ApplicationMenu";
import { registerAppInfoHandlers } from "./ipc/AppInfoHandler";
import { registerDefaultDatabase } from "./middlewares/registerDatabase";
import { StorageService } from "./services/LocalStorageService";

async function createWindow() {
  const storageService = StorageService.getInstance();
  const settings = await storageService.getSettings();
  const width = settings.windowWidth ?? 700;
  const height = settings.windowHeight ?? 580;
  const mainWindow = new BrowserWindow({
    width,
    height,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: join(app.getAppPath(), "static", "favicon.ico"),
  });

  // Persist window size before closing
  mainWindow.on("close", async () => {
    const [winWidth, winHeight] = mainWindow.getSize();
    await storageService.saveSettings({
      windowWidth: winWidth,
      windowHeight: winHeight,
    });
  });

  if (process.env.NODE_ENV === "development") {
    const rendererPort = process.argv[2];
    mainWindow.loadURL(`http://localhost:${rendererPort}`);
  } else {
    mainWindow.loadFile(join(app.getAppPath(), "renderer", "index.html"));
  }
}

app.whenReady().then(async () => {
  registerDefaultDatabase();
  registerAppInfoHandlers();
  registerSettingsHandlers();
  registerDatabaseHandlers();
  createMenu();
  await createWindow();

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": ["script-src 'self'"],
      },
    });
  });

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
