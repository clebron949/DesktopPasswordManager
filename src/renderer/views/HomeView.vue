<script lang="ts" setup>
import PasswordTable from "../components/PasswordTable.vue";
import SearchIcon from "../assets/search.svg";
import { usePasswordStore } from "../stores/PasswordStore";
import { computed, ref, onMounted, onUnmounted } from "vue";
import { Password } from "../typings/password";
import TablePagination from "../components/TablePagination.vue";
import { IpcService } from "../services/IpcService";
import { useAppStore } from "../stores/appSettingsStore";
import { ImportCompletedData } from "../typings/imports";

const passwordStore = usePasswordStore();
const appStore = useAppStore();

const passwords = ref<Password[]>([]);
const searchFilter = ref<string>("");
const itemsPerPage = ref(5);

onMounted(async () => {
  await passwordStore.initializePasswords();
  if (passwordStore.passwords) {
    passwords.value = passwordStore.passwords;
  }
  const settings = await IpcService.getSettings();
  if (settings) {
    itemsPerPage.value = settings.itemsPerPage;
  }
  window.api.import.onCompleted(async (e: ImportCompletedData) => {
    passwordStore.initializePasswords().then(() => {
      if (passwordStore.passwords) {
        passwords.value = passwordStore.passwords;
      }
    });
  });
});

onUnmounted(() => {
  window.api.import.removeAllListeners();
});

const filteredPasswords = computed(() => {
  if (searchFilter.value === null || searchFilter.value === "") {
    const startIndex = (appStore.currentPage - 1) * itemsPerPage.value;
    const endIndex = startIndex + itemsPerPage.value;
    const sortedPasswords = [...passwords.value].sort(
      (a, b) => Number(b.IsPinned) - Number(a.IsPinned)
    );
    return sortedPasswords.slice(startIndex, endIndex);
  }
  return passwords.value.filter((f) =>
    f.Name.toLowerCase().includes(searchFilter.value.toLowerCase())
  );
});

function UpdateCurrentPage(page: number, items: number) {
  appStore.currentPage = page;
  itemsPerPage.value = items;
}
</script>
<template>
  <div class="h-full flex flex-col">
    <div class="w-full grid grid-cols-1">
      <input
        v-model="searchFilter"
        type="text"
        name="account-number"
        id="account-number"
        class="col-start-1 row-start-1 block w-full rounded-md bg-white py-1.5 pl-3 pr-10 text-xs text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-secondary sm:pr-9 sm:text-sm/6"
        placeholder="Search passwords ..."
      />
      <img
        :src="SearchIcon"
        alt="Search"
        class="pointer-events-none col-start-1 row-start-1 mr-3 size-4 self-center justify-self-end text-gray-400 sm:size-4"
      />
    </div>
    <div class="flex-grow mt-3">
      <PasswordTable :passwords="filteredPasswords" />
    </div>
    <div>
      <TablePagination
        :length="passwords.length"
        @on-page-change="UpdateCurrentPage"
      />
    </div>
  </div>
</template>
