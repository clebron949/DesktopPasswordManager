import storage from "electron-json-storage";
import { DatabaseConnection } from "../types/DatabaseConnection";
import { app } from "electron";
import { join } from "path";
import { DatabaseProvider } from "../database/DatabaseProvider";

const basePath = join(app.getPath("userData"), "storage");
const dbPath = join(basePath, "password-manager.db");

export interface AppSettings {
  theme: "light" | "dark";
  itemsPerPage: number;
  passwordLength: number;
  includeNumbers: boolean;
  includeSymbols: boolean;
  includeLowercase: boolean;
  includeUppercase: boolean;
  defaultdbConnection?: DatabaseConnection;
  dbConnections?: DatabaseConnection[];
  windowWidth?: number; 
  windowHeight?: number; 
}

const defaultSettings: AppSettings = {
  theme: "light",
  itemsPerPage: 5,
  passwordLength: 12,
  includeNumbers: true,
  includeSymbols: true,
  includeLowercase: true,
  includeUppercase: true,
  dbConnections: [],
  defaultdbConnection: {
    id: 1,
    name: "Local",
    dbType: DatabaseProvider[DatabaseProvider.SQLite],
    connectionString: dbPath,
  },
  windowWidth: 700, 
  windowHeight: 580, 
};

export class StorageService {
  private static instance: StorageService;
  private readonly SETTINGS_KEY = "app-settings";

  constructor(path: string) {
    // Set storage path to user data directory
    console.log("Storage Path", path);
    storage.setDataPath(path);
  }

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService(basePath);
    }
    return StorageService.instance;
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
        const updatedSettings = { ...currentSettings, ...settings };

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
