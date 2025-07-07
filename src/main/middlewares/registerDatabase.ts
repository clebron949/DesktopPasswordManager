import { app } from "electron";
import { StorageService, AppSettings } from "../services/LocalStorageService";
import { join } from "path";
import { DatabaseFactory } from "../database/DatabaseFactory";

const storageService = StorageService.getInstance();

export async function registerDefaultDatabase() {
  const settings = await storageService.getSettings();
  const dbConnection = settings.defaultdbConnection;

  if (!dbConnection) {
    throw Error("Could not find a defaultDatabaseConnection");
  }

  const db = DatabaseFactory.createDatabaseRepository(
    dbConnection.dbType,
    dbConnection.connectionString,
  );

  await db.createDatabase();
}
