import { app, BrowserWindow, ipcMain, session } from "electron";
import { join } from "path";
import { mkdirSync, existsSync } from "fs"; 
import { registerSettingsHandlers } from "./ipc/SettingsHandlers";
import { registerDatabaseHandlers } from "./ipc/DatabaseHandler";
import { createMenu } from "./middlewares/ApplicationMenu";
import { createDatabaseRepository } from "./middlewares/DatabaseRepositoryFactory";

console.log(app.getAppPath())
const basePath = join(app.getPath("userData"), "storage");
const dbPath = join(basePath, "password-manager.db");
const db = createDatabaseRepository("sqlite", dbPath);
db.createDatabase();

if (!existsSync(basePath)) {
  mkdirSync(basePath, { recursive: true });
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 750,
    height: 650,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: join(app.getAppPath(), "static", "passbolt.ico"),
  });

  if (process.env.NODE_ENV === "development") {
    const rendererPort = process.argv[2];
    mainWindow.loadURL(`http://localhost:${rendererPort}`);
  } else {
    mainWindow.loadFile(join(app.getAppPath(), "renderer", "index.html"));
  }
}

app.whenReady().then(() => {
  registerSettingsHandlers();
  registerDatabaseHandlers(db);
  createMenu(db);
  createWindow();

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