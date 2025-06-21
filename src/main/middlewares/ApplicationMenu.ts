import { app, Menu } from "electron";
import { handleFileImport } from "./importExport";
import { DatabaseRepository } from "../services/SQLiteService";

export function createMenu(db: DatabaseRepository) {
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
        { type: "separator" },
        {
          label: "Export",
          submenu: [
            {
              label: "Export CSV...",
              click: async () => {
                // await handleExportCSV();
              },
            },
            {
              label: "Export JSON...",
              click: async () => {
                // await handleExportJSON();
              },
            },
          ],
        },
        // add development tools
        { type: "separator" },
        {
          label: "Toggle Developer Tools",
          click: (item, focusedWindow) => {
            if (focusedWindow) {
              (focusedWindow as Electron.BrowserWindow).webContents.toggleDevTools();
            }
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
