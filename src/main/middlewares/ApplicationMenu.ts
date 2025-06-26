import { app, BrowserWindow, Menu } from "electron";
import { handleFileExport, handleFileImport } from "./importExport";
import { DatabaseRepository } from "../services/SQLiteService";
import { join } from "path";

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
          label: "Options",
          icon: join(app.getAppPath(), "static", "settings.png"),
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
