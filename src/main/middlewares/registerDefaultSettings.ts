import { StorageService } from "../services/LocalStorageService";
import { AppSettings, defaults } from "../types/AppSettings";
import { existsSync, mkdirSync } from "fs";

const storageService = StorageService.getInstance();

export async function registerDefaultSettings() {
    try {
        if(!existsSync(defaults.storagePath)) {
            await storageService.saveSettings(defaults.defaultSettings)
        }
    } catch (error) {
        console.error("Error registering default settings:", error);
        throw error;
    }
}   
        