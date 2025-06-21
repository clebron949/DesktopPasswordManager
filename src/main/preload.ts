import { contextBridge, ipcRenderer } from "electron";
import { AppSettings } from "./services/LocalStorageService";

contextBridge.exposeInMainWorld("api", {
  settings: {
    get: (): Promise<AppSettings> => ipcRenderer.invoke("settings:get"),
    save: (settings: Partial<AppSettings>): Promise<void> => 
      ipcRenderer.invoke("settings:save", settings),
    reset: (): Promise<void> => ipcRenderer.invoke("settings:reset"),
  },
  db: {
    getPasswords: (): Promise<any> => ipcRenderer.invoke("database:getPasswords"),
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
  }
});
