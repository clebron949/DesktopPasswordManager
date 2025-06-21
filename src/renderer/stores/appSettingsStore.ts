import { defineStore } from "pinia";
import { ref, computed, readonly } from "vue";

export const useAppStore = defineStore("appStore", () => {
  const currentPage = ref<number>(1);

  return {
    currentPage
  }
});