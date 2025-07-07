import { app } from "electron";
import { StorageService, AppSettings } from "../services/LocalStorageService";
import { join } from "path";
import { DatabaseProvider } from "../database/DatabaseProvider";
import { DatabaseFactory } from "../database/DatabaseFactory";
import { DatabaseConnection } from "../types/DatabaseConnection";

const basePath = join(app.getPath("userData"), "storage");
const storageService = StorageService.getInstance(basePath);
const dbPath = join(basePath, "password-manager.db");

export async function registerDefaultDatabase() {
  const settings = await storageService.getSettings();

  if (settings.dbConnections?.length !== 0) {
    return;
  }

  const defaultDatabaseConnection: DatabaseConnection = {
    id: 1,
    name: "Local",
    dbType: DatabaseProvider.SQLite,
    connectionString: dbPath,
  };

  const defaultDatabaseConnections: DatabaseConnection[] = [
    defaultDatabaseConnection,
  ];

  storageService.saveSettings({ dbConnections: defaultDatabaseConnections });

  const db = DatabaseFactory.createDatabaseRepository(
    defaultDatabaseConnection.dbType,
    defaultDatabaseConnection.connectionString,
  );

  await db.createDatabase();
}
