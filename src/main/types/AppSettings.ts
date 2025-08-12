import { app } from "electron";
import { DatabaseConnection } from "./DatabaseConnection";
import { join } from "path";
import { DatabaseProvider } from "../database/DatabaseProvider";

export interface AppSettings {
  theme: "light" | "dark";
  itemsPerPage: number;
  passwordLength: number;
  includeNumbers: boolean;
  includeSymbols: boolean;
  includeLowercase: boolean;
  includeUppercase: boolean;
  defaultdbConnection?: DatabaseConnection;
  dbConnections?: DatabaseConnection[];
  windowWidth?: number;
  windowHeight?: number;
}
const defaultConnection: DatabaseConnection = {
  id: 1,
  name: "Local",
  dbType: DatabaseProvider[DatabaseProvider.SQLite],
  connectionString: join(app.getPath("userData"), "storage", "password-manager.db"),
};

const defaultSettings: AppSettings = {
  theme: "light",
  itemsPerPage: 5,
  passwordLength: 12,
  includeNumbers: true,
  includeSymbols: true,
  includeLowercase: true,
  includeUppercase: true,
  dbConnections: [
   defaultConnection
  ],
  defaultdbConnection: defaultConnection,
  windowWidth: 700,
  windowHeight: 580,
};

export const defaults = {
    storageDirectory: join(app.getPath("userData"), "storage"),
    storagePath: join(app.getPath("userData"), "storage", "app-settings.json"),
    dbPath: join(app.getPath("userData"), "storage", "password-manager.db"),
    defaultSettings: defaultSettings,
}
