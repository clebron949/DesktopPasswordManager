<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useAppStore } from "../stores/appSettingsStore";

const appStore = useAppStore();

interface TablePaginationProps {
  length: number;
}

const props = withDefaults(defineProps<TablePaginationProps>(), { length: 0 });

const emit = defineEmits<{
  (e: "onPageChange", currentPage: number, itemsPerPage: number): void;
}>();

// --- State ---
const perPageOptions = ref<number[]>([5, 10, 15]);
const itemsPerPage = ref<number>(5);
const currentPage = ref<number>(1);
const isReady = ref(false);

onMounted(async () => {
  const savedItemsPerPage = (await appStore.getItemsPerPage()) || 5;
  const totalLength = props.length || 0;

  // Ensure 'All' and saved values are present
  if (totalLength > 0 && !perPageOptions.value.includes(totalLength)) {
    perPageOptions.value.push(totalLength);
  }
  if (
    !perPageOptions.value.includes(savedItemsPerPage) &&
    savedItemsPerPage !== totalLength
  ) {
    perPageOptions.value.push(savedItemsPerPage);
  }

  perPageOptions.value.sort((a, b) => a - b);
  itemsPerPage.value = savedItemsPerPage;
  currentPage.value = appStore.currentPage || 1;

  emit("onPageChange", currentPage.value, itemsPerPage.value);

  isReady.value = true;
});

// --- Watchers ---
watch(itemsPerPage, (newVal, oldVal) => {
  if (!isReady.value || newVal === oldVal) return;
  currentPage.value = 1;
  appStore.setItemsPerPage(newVal);
  emit("onPageChange", currentPage.value, newVal);
});

// --- Computed ---
const totalPages = computed(() => {
  const total = props.length || 0;
  const perPage = itemsPerPage.value || 1;
  if (perPage >= total || perPage <= 0) return 1;
  return Math.ceil(total / perPage);
});

// --- Methods ---
const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  emit("onPageChange", currentPage.value, itemsPerPage.value);
};

const nextPage = () => goToPage(currentPage.value + 1);
const prevPage = () => goToPage(currentPage.value - 1);
</script>

<template>
  <div v-if="isReady">
    <!-- Pagination controls -->
    <nav
      class="flex items-center justify-between border-t-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 bg-white px-4 py-3 sm:px-6"
      aria-label="Pagination"
    >
      <!-- Left Section -->
      <div class="flex-1 hidden sm:block">
        <p class="text-xs text-tertiary dark:text-slate-50">
          Showing
          <span class="font-medium">
            {{
              itemsPerPage === length
                ? 1
                : (currentPage - 1) * itemsPerPage + 1
            }}
          </span>
          to
          <span class="font-medium">
            {{
              itemsPerPage === length
                ? length
                : Math.min(currentPage * itemsPerPage, length)
            }}
          </span>
          of <span class="font-medium">{{ length }}</span> results
        </p>
      </div>

      <!-- Center Section: Items per page -->
      <div class="flex items-center justify-center flex-1">
        <label
          for="items-per-page"
          class="text-xs text-tertiary dark:text-slate-50 mr-2 whitespace-nowrap"
          >Show</label
        >
        <select
          id="items-per-page"
          v-model.number="itemsPerPage"
          class="block max-w-[80px] appearance-none rounded-md border border-gray-300 bg-white dark:bg-slate-600 py-0.5 pl-3 pr-8 text-xs font-medium text-secondary dark:text-slate-50 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-secondary sm:leading-6"
        >
          <option
            v-for="option in perPageOptions"
            :key="option"
            :value="option"
          >
            {{ option === length ? "All" : option }}
          </option>
        </select>
        <span
          class="text-xs text-tertiary dark:text-slate-50 ml-2 whitespace-nowrap"
          >per page</span
        >
      </div>

      <!-- Right Section -->
      <div class="flex flex-1 justify-end">
        <button
          @click="prevPage"
          :disabled="currentPage === 1 || itemsPerPage === length"
          class="relative inline-flex items-center rounded-md border border-tertiary/50 bg-white dark:bg-slate-600 px-3 py-1.5 text-xs font-medium text-tertiary dark:text-slate-50 hover:bg-gray-50 dark:hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages || itemsPerPage === length"
          class="relative ml-3 inline-flex items-center rounded-md border border-tertiary/50 bg-white dark:bg-slate-600 px-3 py-1.5 text-xs font-medium text-tertiary dark:text-slate-50 hover:bg-gray-50 dark:hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </nav>

    <!-- Page number buttons -->
    <div
      class="flex justify-center mt-4"
      v-if="itemsPerPage !== length && totalPages > 1"
    >
      <button
        v-for="page in totalPages"
        :key="page"
        @click="goToPage(page)"
        :class="[
          'mx-1 px-3 py-1 rounded-md text-xs',
          currentPage === page
            ? 'bg-primary text-white'
            : 'bg-gray-200 dark:bg-slate-600 text-secondary dark:text-slate-50 hover:bg-gray-300 dark:hover:bg-slate-500',
        ]"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<style scoped>
#items-per-page {
  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22%236B7A8B%22%3E%3Cpath fill-rule=%22evenodd%22 d=%22M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z%22 clip-rule=%22evenodd%22 /%3E%3C/svg%3E");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em;
  padding-right: 2.5rem;
}
</style>
