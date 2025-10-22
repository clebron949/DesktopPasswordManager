import storage from "electron-json-storage";
import { DatabaseConnection } from "../types/DatabaseConnection";
import { app } from "electron";
import { join } from "path";
import { DatabaseProvider } from "../services/database/providers/DatabaseProviders";
import { AppSettings, DBSettings, GUISettings, PasswordGeneratorSettings } from "../types/AppSettings";

const basePath = join(app.getPath("userData"), "storage");
const dbPath = join(basePath, "password-manager.db");

const defaultConnection: DatabaseConnection = {
  id: 1,
  name: "Local",
  dbType: DatabaseProvider[DatabaseProvider.SQLite],
  connectionString: dbPath,
};

const defaultSettings: AppSettings = {
  GUI: {
    theme: "light",
    itemsPerPage: 5,
    windowWidth: 700,
    windowHeight: 580,
  },
  PasswordGenerator: {
    passwordLength: 12,
    includeNumbers: true,
    includeSymbols: true,
    includeLowercase: true,
    includeUppercase: true,
  },
  DB: {
    dbConnections: [defaultConnection],
    selectedDBConnectionID: 1,
  },
};

export class LocalStorage {
  private static instance: LocalStorage;
  private readonly SETTINGS_KEY = "app-settings";

  constructor(path: string) {
    // Set storage path to user data directory
    console.log("Storage Path", path);
    storage.setDataPath(path);
  }

  static getInstance(): LocalStorage {
    if (!LocalStorage.instance) {
      LocalStorage.instance = new LocalStorage(basePath);
    }
    return LocalStorage.instance;
  }

  async getSettings(): Promise<AppSettings> {
    return new Promise((resolve, reject) => {
      storage.get(this.SETTINGS_KEY, (error, data) => {
        if (error) {
          reject(error);
          return;
        }
        resolve({ ...defaultSettings, ...data } as AppSettings);
      });
    });
  }

  async saveSettings(settings: Partial<AppSettings>): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        // Get current settings and merge with new ones
        const currentSettings = await this.getSettings();
        const updatedSettings = {
          ...currentSettings,
          GUI: { ...currentSettings.GUI, ...settings.GUI },
          PasswordGenerator: {
            ...currentSettings.PasswordGenerator,
            ...settings.PasswordGenerator,
          },
          DB: { ...currentSettings.DB, ...settings.DB },
        };

        storage.set(this.SETTINGS_KEY, updatedSettings, (error: Error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  async saveGUISettings(settings: Partial<GUISettings>): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        // Get current settings and merge with new ones
        const currentSettings = await this.getSettings();
        const updatedSettings = {
          ...currentSettings,
          GUI: { ...currentSettings.GUI, ...settings },
        };
        storage.set(this.SETTINGS_KEY, updatedSettings, (error: Error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  async saveDatabaseSettings(settings: Partial<DBSettings>): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        // Get current settings and merge with new ones
        const currentSettings = await this.getSettings();
        const updatedSettings = {
          ...currentSettings,
          DB: { ...currentSettings.DB, ...settings },
        };
        storage.set(this.SETTINGS_KEY, updatedSettings, (error: Error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  async savePasswordGeneratorSettings(settings: Partial<PasswordGeneratorSettings>): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        // Get current settings and merge with new ones
        const currentSettings = await this.getSettings();
        const updatedSettings = {
          ...currentSettings,
          PasswordGenerator: { ...currentSettings.PasswordGenerator, ...settings },
        };
        storage.set(this.SETTINGS_KEY, updatedSettings, (error: Error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  async resetSettings(): Promise<void> {
    return new Promise((resolve, reject) => {
      storage.remove(this.SETTINGS_KEY, (error: Error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  }
}
