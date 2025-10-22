import { app } from "electron";
import { join } from "path";
import { DatabaseProvider } from "../database/providers/DatabaseProviders";
import { AppSettings } from "../../types/AppSettings";

const defaultSettings: AppSettings = {
  GUI: {
    theme: "light",
    itemsPerPage: 5,
    windowWidth: 700,
    windowHeight: 580,
  },
  PasswordGenerator: {
    passwordLength: 12,
    includeNumbers: true,
    includeSymbols: true,
    includeLowercase: true,
    includeUppercase: true,
  },
  DB: {
    dbConnections: [
      {
        id: 1,
        name: "Local",
        dbType: DatabaseProvider[DatabaseProvider.SQLite],
        connectionString: join(
          app.getPath("userData"),
          "storage",
          "password-manager.db"
        ),
      },
    ],
    selectedDBConnectionID: 1,
  },
};

export const DefaultAppSettings = {
  storageDirectory: join(app.getPath("userData"), "storage"),
  storagePath: join(app.getPath("userData"), "storage", "app-settings.json"),
  dbPath: join(app.getPath("userData"), "storage", "password-manager.db"),
  appSettings: defaultSettings,
};
