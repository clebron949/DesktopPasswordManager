import { ipcMain } from "electron";
import { Password } from "../types/Password";
import { DatabaseFactory } from "../services/database/providers/DatabaseProviderFactory";


export function registerDatabaseHandlers() {
  ipcMain.handle("database:getPasswords", async (): Promise<Password[]> => {
    const db = DatabaseFactory.getDatabaseProvider();
    const passwords = (await db.getPasswords()) as Password[];
    return passwords ?? [];
  });

  ipcMain.handle(
    "database:getPasswordById",
    async (_, id: number): Promise<Password | undefined> => {
      const db = DatabaseFactory.getDatabaseProvider();
      const password = await db.getPasswordById(id);
      return password ?? undefined;
    },
  );

  ipcMain.handle(
    "database:insertPassword",
    async (
      _,
      password: Omit<Password, "Id" | "OnCreated" | "OnModified">,
    ): Promise<number> => {
      const db = DatabaseFactory.getDatabaseProvider();
      const id = await db.insertPassword(password);
      return id;
    },
  );

  ipcMain.handle(
    "database:updatePassword",
    async (
      _,
      id: number,
      password: Partial<Omit<Password, "Id" | "OnCreated" | "OnModified">>,
    ): Promise<void> => {
      const db = DatabaseFactory.getDatabaseProvider();
      await db.updatePassword(id, password);
    },
  );

  ipcMain.handle(
    "database:deletePassword",
    async (_, id: number): Promise<void> => {
      const db = DatabaseFactory.getDatabaseProvider();
      await db.deletePassword(id);
    },
  );

  ipcMain.handle("database:close", async (): Promise<void> => {
    const db = DatabaseFactory.getDatabaseProvider();
    db.close();
  });

  ipcMain.handle("database:change-provider", async (): Promise<void> => {
    const db = DatabaseFactory.getDatabaseProvider();
    db.close();
  });
}
