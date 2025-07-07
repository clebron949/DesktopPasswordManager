import { ipcMain } from "electron";
import { Password } from "../types/password";
import { DatabaseFactory } from "../database/DatabaseFactory";

export function registerDatabaseHandlers() {
  ipcMain.handle("database:getPasswords", async (): Promise<Password[]> => {
    const db = DatabaseFactory.getDatabaseRepository();
    const passwords = (await db.getPasswords()) as Password[];
    return passwords ?? [];
  });

  ipcMain.handle(
    "database:getPasswordById",
    async (_, id: number): Promise<Password | undefined> => {
      const db = DatabaseFactory.getDatabaseRepository();
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
      const db = DatabaseFactory.getDatabaseRepository();
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
      const db = DatabaseFactory.getDatabaseRepository();
      await db.updatePassword(id, password);
    },
  );

  ipcMain.handle(
    "database:deletePassword",
    async (_, id: number): Promise<void> => {
      const db = DatabaseFactory.getDatabaseRepository();
      await db.deletePassword(id);
    },
  );

  ipcMain.handle("database:close", async (): Promise<void> => {
    const db = DatabaseFactory.getDatabaseRepository();
    db.close();
  });
}
