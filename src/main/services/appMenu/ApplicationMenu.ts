import { app, BrowserWindow, Menu, nativeImage } from "electron";
import { join } from "path";
import * as fs from "fs";
import { LocalStorage } from "../../helpers/LocalStorage";
import { DatabaseFactory } from "../database/providers/DatabaseProviderFactory";
import { DatabaseProvider } from "../database/providers/DatabaseProviders";
import { handleFileImport, handleFileExport } from "../database/importExport/importExport";
import { AppSettings } from "../../types/AppSettings";

function getMenuItemIcon(baseName: string) {
  const img = nativeImage.createEmpty();
  const icon1xPath = join(app.getAppPath(), "static", `${baseName}.png`);
  const icon2xPath = join(app.getAppPath(), "static", `${baseName}@2x.png`);
  if (fs.existsSync(icon1xPath)) {
    img.addRepresentation({
      scaleFactor: 1.0,
      buffer: fs.readFileSync(icon1xPath),
    });
  }
  if (fs.existsSync(icon2xPath)) {
    img.addRepresentation({
      scaleFactor: 2.0,
      buffer: fs.readFileSync(icon2xPath),
    });
  }
  // Add more resolutions as needed (e.g., 3.0 for @3x.png)
  return img;
}

export async function createMenu() {
  const storageService = LocalStorage.getInstance();
  const settings: AppSettings = await storageService.getSettings();
  const dbConnections = settings.DB.dbConnections ?? [];
  const defaultId = settings.DB.selectedDBConnectionID;

  const connectSubmenu: Electron.MenuItemConstructorOptions[] =
    dbConnections.map((conn) => ({
      label: conn.name,
      type: "radio" as const,
      checked: conn.id === defaultId,
      click: async () => {
        // Update default connection in settings
        console.log("Setting default connection to:", conn.connectionString);
        await storageService.saveDatabaseSettings({ selectedDBConnectionID: conn.id });
        // Optionally, notify renderer or reload DB connection here
        const db = DatabaseFactory.getDatabaseProvider();
        await db.close().catch((error) => console.error(error)); // Close current DB connection
        DatabaseFactory.createDatabaseProvider(
          DatabaseProvider[conn.dbType as keyof typeof DatabaseProvider],
          conn.connectionString
        );
        const mainWindow = BrowserWindow.getAllWindows()[0];
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send("import-completed", {
            success: true,
            message: `Successfully loaded database: ${conn.name}`,
          });
        }
        createMenu(); // Rebuild menu to update checkmarks
      },
    }));
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: "File",
      submenu: [
        {
          label: "Import",
          click: async () => {
            await handleFileImport();
          },
        },
        {
          label: "Export",
          click: async () => {
            await handleFileExport();
          },
        },
        { type: "separator" },
        {
          label: "Exit",
          accelerator: process.platform === "darwin" ? "Cmd+Q" : "Ctrl+Q",
          click: () => {
            app.quit();
          },
        },
      ],
    },
    // Add other menu items (Edit, View, etc.)
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
      ],
    },
    {
      label: "Database",
      submenu: [
        {
          label: "Connect",
          icon: getMenuItemIcon("database"),
          submenu:
            connectSubmenu.length > 0
              ? connectSubmenu
              : [{ label: "No connections", enabled: false }],
        },
        { type: "separator" },
        {
          label: "Options",
          icon: getMenuItemIcon("settings"),
          click: () => {
            const mainWindow = BrowserWindow.getAllWindows()[0];
            if (mainWindow && !mainWindow.isDestroyed()) {
              mainWindow.webContents.send("navigate-to-db-options");
            }
          },
        },
      ],
    },
  ];

  // Add DevTools menu item in development
  if (process.env.NODE_ENV === "development") {
    template.push({
      label: "Debug",
      submenu: [
        {
          label: "Toggle Dev Tools",
          click: () => {
            const mainWindow = BrowserWindow.getAllWindows()[0];
            if (mainWindow && !mainWindow.isDestroyed()) {
              mainWindow.webContents.toggleDevTools();
            }
          },
        },
      ],
    });
  }

  // macOS specific menu adjustments
  if (process.platform === "darwin") {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: "about" },
        { type: "separator" },
        { role: "services" },
        { type: "separator" },
        { role: "hide" },
        { role: "hideOthers" },
        { role: "unhide" },
        { type: "separator" },
        { role: "quit" },
      ],
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
