import type { AppSettings } from "../../main/services/LocalStorageService";
import { Password } from "../typings/password";

export class IpcService {
  static async getSettings(): Promise<AppSettings> {
    return await window.api.settings.get();
  }

  static async saveSettings(settings: Partial<AppSettings>): Promise<void> {
    return await window.api.settings.save(settings);
  }

  static async resetSettings(): Promise<void> {
    return await window.api.settings.reset();
  }
}

export class DatabaseService {
  static async getPasswords(): Promise<Password[] | undefined> {
    return await window.api.db.getPasswords();
  }

  static async getPasswordById(id: number): Promise<Password | undefined> {
    return await window.api.db.getPasswordById(id);
  }

  static async insertPassword(
    password: Omit<Password, "Id" | "OnCreated" | "OnModified">
  ): Promise<number> {
    return await window.api.db.insertPassword(password);
  }

  static async updatePassword(
    id: number,
    password: Omit<Password, "OnModified">
  ): Promise<void> {
    return await window.api.db.updatePassword(id, password);
  }

  static async deletePassword(id: number): Promise<void> {
    return await window.api.db.deletePassword(id);
  }
}