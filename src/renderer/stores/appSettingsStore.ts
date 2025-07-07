import { defineStore } from "pinia";
import { ref, computed, readonly } from "vue";
import { IpcService } from "../services/IpcService";

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

  return {
    currentPage,
    getItemsPerPage,
    setItemsPerPage,
    getDatabaseProviders,
  };
});
