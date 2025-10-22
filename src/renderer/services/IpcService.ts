import { AppSettings, DBSettings, GUISettings, PasswordGeneratorSettings } from "../typings/appSettings";
import { Password } from "../typings/password";

export class IpcService {
  static async getGUISettings(): Promise<GUISettings> {
    return await window.api.settings.GUI.get();
  }

  static async saveGUISettings(settings: Partial<GUISettings>): Promise<void> {
    return await window.api.settings.GUI.save(settings);
  }

  static async getDBSettings(): Promise<DBSettings> {
    return await window.api.settings.DB.get();
  }

  static async saveDBSettings(settings: Partial<DBSettings>): Promise<void> {
    return await window.api.settings.DB.save(settings);
  }

  static async getPasswordGeneratorSettings(): Promise<PasswordGeneratorSettings> {
    return await window.api.settings.PasswordGenerator.get();
  }

  static async savePasswordGeneratorSettings(settings: Partial<PasswordGeneratorSettings>): Promise<void> {
    return await window.api.settings.PasswordGenerator.save(settings);
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
