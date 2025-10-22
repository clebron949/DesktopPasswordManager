import { app, BrowserWindow, session } from "electron";
import { existsSync } from "fs";
import { join } from "path";
import { LocalStorage } from "./helpers/LocalStorage";
import { DatabaseFactory } from "./services/database/providers/DatabaseProviderFactory";
import { DatabaseProvider } from "./services/database/providers/DatabaseProviders";
import { DefaultAppSettings } from "./services/appSettings/appSettingsDefaults";
import { registerSettingsHandlers } from "./ipc/SettingsHandlers";
import { registerDatabaseHandlers } from "./ipc/DatabaseHandler";
import { registerAppInfoHandlers } from "./ipc/AppInfoHandler";
import { createMenu } from "./services/appMenu/ApplicationMenu";

async function LoadDatabase() {
  const localStorage = LocalStorage.getInstance();
  const settings = await localStorage.getSettings();
  const dbConnection = settings.DB.dbConnections?.find(
    (db) => db.id == settings.DB.selectedDBConnectionID
  );

  if (!dbConnection) {
    throw Error("Could not find a defaultDatabaseConnection");
  }

  const db = DatabaseFactory.createDatabaseProvider(
    DatabaseProvider[dbConnection.dbType as keyof typeof DatabaseProvider],
    dbConnection.connectionString
  );

  await db.createDatabase();
}

async function LoadDefaultAppSettings() {
  try {
    const localStorage = LocalStorage.getInstance();
    if (!existsSync(DefaultAppSettings.storagePath)) {
      await localStorage.saveSettings(DefaultAppSettings.appSettings);
    }
  } catch (error) {
    console.error("Error registering default settings:", error);
    throw error;
  }
}

async function createWindow() {
  const storageService = LocalStorage.getInstance();
  const settings = await storageService.getSettings();
  const width = settings.GUI.windowWidth ?? 700;
  const height = settings.GUI.windowHeight ?? 580;
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
  mainWindow.on("close", (event) => {
    const [winWidth, winHeight] = mainWindow.getSize();
    // Prevent window from closing immediately
    event.preventDefault();
    storageService
      .saveGUISettings({
        windowWidth: winWidth,
        windowHeight: winHeight,
      })
      .then(() => {
        // Now actually close the window
        mainWindow.destroy();
      });
  });

  if (process.env.NODE_ENV === "development") {
    const rendererPort = process.argv[2];
    mainWindow.loadURL(`http://localhost:${rendererPort}`);
  } else {
    mainWindow.loadFile(join(app.getAppPath(), "renderer", "index.html"));
  }
}

app.setName("Password Manager");

app.whenReady().then(async () => {
  await LoadDefaultAppSettings();
  await LoadDatabase();
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
