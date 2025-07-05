import { app, BrowserWindow, Menu, nativeImage } from "electron";
import { handleFileExport, handleFileImport } from "./importExport";
import { DatabaseRepository } from "../services/SQLiteService";
import { join } from "path";
import * as fs from "fs";

function getMenuItemIcon(baseName) {
  const img = nativeImage.createEmpty();
  const icon1xPath = join(app.getAppPath(), 'static', `${baseName}.png`);
  const icon2xPath = join(app.getAppPath(), 'static', `${baseName}@2x.png`);
  if (fs.existsSync(icon1xPath)) {
    img.addRepresentation({
      scaleFactor: 1.0,
      buffer: fs.readFileSync(icon1xPath)
    });
  }
  if (fs.existsSync(icon2xPath)) {
    img.addRepresentation({
      scaleFactor: 2.0,
      buffer: fs.readFileSync(icon2xPath)
    });
  }
  // Add more resolutions as needed (e.g., 3.0 for @3x.png)
  return img;
}

export function createMenu(db: DatabaseRepository) {
  // log current path
  console.log("Current Path:", app.getAppPath());
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: "File",
      submenu: [
        {
          label: "Import",
          click: async () => {
            await handleFileImport(db);
          },
        },
        {
          label: "Export",
          click: async () => {
            await handleFileExport(db);
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
          click: () => {
            console.log("Connect clicked");
          },
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
  if (process.env.NODE_ENV !== "production") {
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
