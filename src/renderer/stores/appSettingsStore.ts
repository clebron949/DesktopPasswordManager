import { defineStore } from "pinia";
import { ref, computed, readonly } from "vue";
import { IpcService } from "../services/IpcService";
import { DatabaseConnection } from "../../main/types/DatabaseConnection";

export const useAppStore = defineStore("appStore", () => {
  const currentPage = ref<number>(1);

  async function getItemsPerPage() {
    const settings = await IpcService.getSettings();
    return settings.itemsPerPage;
  }

  async function setItemsPerPage(itemsPerPage: number) {
    await IpcService.saveSettings({ itemsPerPage: itemsPerPage });
  }

  async function getDatabaseProviders() {
    const settings = await IpcService.getSettings();
    return settings.dbConnections ?? [];
  }

  async function setDatabaseProvider(provider: DatabaseConnection) {
    const settings = await IpcService.getSettings();
    settings.dbConnections = settings.dbConnections || [];
    const index = settings.dbConnections.findIndex(
      (db: DatabaseConnection) => db.id === provider.id
    );
    // Ensure all required properties are present
    const completeProvider: DatabaseConnection = {
      id: provider.id,
      name: provider.name,
      dbType: provider.dbType,
      connectionString: provider.connectionString,
    };
    if (index !== -1) {
      settings.dbConnections[index] = completeProvider;
    } else {
      settings.dbConnections.push(completeProvider);
    }
    await IpcService.saveSettings(settings);
  }

  return {
    currentPage,
    getItemsPerPage,
    setItemsPerPage,
    getDatabaseProviders,
    setDatabaseProvider
  };
});
