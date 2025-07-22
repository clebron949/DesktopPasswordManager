<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import { IpcService } from "../services/IpcService";
import { useAppStore } from "../stores/appSettingsStore";

const appStore = useAppStore();

// --- Props Definition ---
interface TablePaginationProps {
  length: number;
}

const props = withDefaults(defineProps<TablePaginationProps>(), {
  length: 0,
});

// --- Emits Definition ---
// Emits for v-model update and for confirmation/cancellation
const emit = defineEmits<{
  (e: "onPageChange", currentPage: number, itemsPerPage: number): void; // For v-model
}>();

// --- Component State ---
const perPageOptions = [5, 10, 15, props.length];
const itemsPerPage = ref(5);
const currentPage = ref(appStore.currentPage || 1);

onMounted(async () => {
  itemsPerPage.value = await appStore.getItemsPerPage();
});

watch(itemsPerPage, () => {
  currentPage.value = 1;
  emit("onPageChange", currentPage.value, itemsPerPage.value);
  appStore.setItemsPerPage(itemsPerPage.value);
});

const totalPages = computed(() => {
  if (itemsPerPage.value === props.length) {
    return 1;
  }
  return Math.ceil(props.length / itemsPerPage.value);
});

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    emit("onPageChange", currentPage.value, itemsPerPage.value);
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    emit("onPageChange", currentPage.value, itemsPerPage.value);
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    emit("onPageChange", currentPage.value, itemsPerPage.value);
  }
};
</script>

<template>
  <!-- Pagination Controls -->
  <nav
    class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
    aria-label="Pagination"
  >
    <!-- Left Section: Showing X to Y of Z results -->
    <div class="flex-1 hidden sm:block">
      <p class="text-xs text-tertiary">
        Showing
        <span class="text-xs font-medium">
          {{
            itemsPerPage === length ? 1 : (currentPage - 1) * itemsPerPage + 1
          }}
        </span>
        to
        <span class="text-xs font-medium">
          {{
            itemsPerPage === length
              ? length
              : Math.min(currentPage * itemsPerPage, length)
          }}
        </span>
        of
        <span class="text-xs font-medium">{{ length }}</span>
        results
      </p>
    </div>

    <!-- Center Section: Items per page dropdown -->
    <div class="flex items-center justify-center flex-1">
      <label
        for="items-per-page"
        class="text-xs text-tertiary mr-2 whitespace-nowrap"
        >Show</label
      >
      <select
        id="items-per-page"
        v-model.number="itemsPerPage"
        class="block max-w-[80px] appearance-none rounded-md border border-gray-300 bg-white py-0.5 pl-3 pr-8 text-xs font-medium text-secondary shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-primary sm:leading-6"
        style="
          background-image: url(&quot;data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22%236B7A8B%22%3E%3Cpath fill-rule=%22evenodd%22 d=%22M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z%22 clip-rule=%22evenodd%22 /%3E%3C/svg%3E&quot;);
          background-position: right 0.5rem center;
          background-repeat: no-repeat;
          background-size: 1.5em;
          padding-right: 2.5rem;
        "
      >
        <option v-for="option in perPageOptions" :key="option" :value="option">
          {{ option === length ? "All" : option }}
        </option>
      </select>
      <span class="text-xs text-tertiary ml-2 whitespace-nowrap">per page</span>
    </div>

    <!-- Right Section: Page navigation buttons -->
    <div class="flex flex-1 justify-end">
      <button
        @click="prevPage"
        :disabled="currentPage === 1 || itemsPerPage === length"
        class="relative inline-flex items-center rounded-md border border-tertiary/50 bg-white px-3 py-1.5 text-xs font-medium text-tertiary hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages || itemsPerPage === length"
        class="relative ml-3 inline-flex items-center rounded-md border border-tertiary/50 bg-white px-3 py-1.5 text-xs font-medium text-tertiary hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  </nav>

  <!-- Page number buttons (hide if 'All' is selected) -->
  <div class="flex justify-center mt-4" v-if="itemsPerPage !== length">
    <button
      v-for="page in totalPages"
      :key="page"
      @click="goToPage(page)"
      :class="[
        'mx-1 px-3 py-1 rounded-md text-xs',
        currentPage === page
          ? 'bg-primary text-white'
          : 'bg-gray-200 text-secondary hover:bg-gray-300',
      ]"
    >
      {{ page }}
    </button>
  </div>
</template>
