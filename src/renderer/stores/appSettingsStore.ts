import { defineStore } from "pinia";
import { ref } from "vue";
import { IpcService } from "../services/IpcService";
import { DatabaseConnection } from "../../main/types/DatabaseConnection";

export const useAppStore = defineStore("appStore", () => {
  const currentPage = ref<number>(1);

  async function getItemsPerPage() {
    const settings = await IpcService.getGUISettings();
    return settings.itemsPerPage;
  }

  async function setItemsPerPage(itemsPerPage: number) {
    await IpcService.saveGUISettings({ itemsPerPage: itemsPerPage });
  }

  async function getDatabaseProviders() {
    const settings = await IpcService.getDBSettings();
    return settings.dbConnections ?? [];
  }

  async function setDatabaseProvider(provider: DatabaseConnection) {
    const settings = await IpcService.getDBSettings();
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
    await IpcService.saveDBSettings(settings);
  }

  return {
    currentPage,
    getItemsPerPage,
    setItemsPerPage,
    getDatabaseProviders,
    setDatabaseProvider
  };
});
