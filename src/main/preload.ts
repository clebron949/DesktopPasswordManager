import { contextBridge, ipcRenderer } from "electron";
import { AppSettings } from "./services/LocalStorageService";
import { join } from "path";

contextBridge.exposeInMainWorld("api", {
  settings: {
    get: (): Promise<AppSettings> => ipcRenderer.invoke("settings:get"),
    save: (settings: Partial<AppSettings>): Promise<void> =>
      ipcRenderer.invoke("settings:save", settings),
    reset: (): Promise<void> => ipcRenderer.invoke("settings:reset"),
    openFolderDialog: (): Promise<string | undefined> =>
      ipcRenderer.invoke("settings:open-folder-dialog"),
    joinPaths: (...parts: string[]): Promise<string | undefined> =>
      ipcRenderer.invoke("settings:join-paths", ...parts),
  },
  db: {
    getPasswords: (): Promise<any> =>
      ipcRenderer.invoke("database:getPasswords"),
    getPasswordById: (id: number): Promise<any> =>
      ipcRenderer.invoke("database:getPasswordById", id),
    insertPassword: (
      password: Omit<any, "Id" | "OnCreated" | "OnModified">
    ): Promise<number> =>
      ipcRenderer.invoke("database:insertPassword", password),
    updatePassword: (
      id: number,
      password: Partial<Omit<any, "Id" | "OnCreated" | "OnModified">>
    ): Promise<void> =>
      ipcRenderer.invoke("database:updatePassword", id, password),
    deletePassword: (id: number): Promise<void> =>
      ipcRenderer.invoke("database:deletePassword", id),
  },
  app: {
    getVersion: (): Promise<string> => ipcRenderer.invoke("get-app-version"),
  },
  import: {
    onCompleted: (callback: (data: any) => void) => {
      ipcRenderer.on("import-completed", (event, data) => callback(data));
    },
    removeAllListeners: () => {
      ipcRenderer.removeAllListeners("import-completed");
    },
  },
  navigation: {
    onNavigateToDbOptions: (callback: () => void) => {
      ipcRenderer.on("navigate-to-db-options", () => callback());
    },
    removeNavigationListeners: () => {
      ipcRenderer.removeAllListeners("navigate-to-db-options");
    },
  },
});
