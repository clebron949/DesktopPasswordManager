import { ipcMain } from "electron";
import { SQLiteService, DatabaseRepository, Password } from "../services/SQLiteService";

let db: DatabaseRepository;

export function registerDatabaseHandlers(
  db: DatabaseRepository,
) {
  ipcMain.handle("database:getPasswords", async (): Promise<Password[]> => {
    const passwords = await db.getPasswords() as Password[];
    return passwords ?? [];
  });

  ipcMain.handle(
    "database:getPasswordById",
    async (_, id: number): Promise<Password | undefined> => {
      const password = await db.getPasswordById(id);
      return password ?? undefined;
    }
  );

  ipcMain.handle(
    "database:insertPassword",
    async (
      _,
      password: Omit<Password, "Id" | "OnCreated" | "OnModified">
    ): Promise<number> => {
      const id = await db.insertPassword(password);
      return id;
    }
  );

  ipcMain.handle(
    "database:updatePassword",
    async (
      _,
      id: number,
      password: Partial<Omit<Password, "Id" | "OnCreated" | "OnModified">>
    ): Promise<void> => {
      await db.updatePassword(id, password);
    }
  );

  ipcMain.handle(
    "database:deletePassword",
    async (_, id: number): Promise<void> => {
      await db.deletePassword(id);
    }
  );

  ipcMain.handle("database:close", async (): Promise<void> => {
    db.close();
  });
}
