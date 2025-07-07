<script setup lang="ts">
import { ref, onMounted } from "vue";
import EditDatabaseModal from "../components/modals/EditDatabaseModal.vue";
import { Database } from "../typings/database";
import { useAppStore } from "../stores/appSettingsStore";
import DeleteModal from "../components/modals/DeleteModal.vue";
import DeleteIcon from "../components/icons/DeleteIcon.vue";
import EditIcon from "../components/icons/EditIcon.vue";
import Tooltip from "../components/Tooltip.vue";
import PlusCircleIcon from "../components/icons/PlusCircleIcon.vue";

enum DatabaseProvider {
  SQLite,
  MySQL,
}

const appStore = useAppStore();

const isModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const selectedDatabase = ref<Database | null>(null);
const databases = ref<Database[]>([]);

onMounted(async () => {
  const providers = await appStore.getDatabaseProviders();
  databases.value = providers.map((db) => ({
    id: db.id,
    name: db.name,
    type: DatabaseProvider[db.dbType],
    connectionString: db.connectionString,
  }));
});

function addNewDatabase() {
  const newDatabase: Database = {
    id: 0, // Simple ID generation for demo purposes
    name: "",
    type: "",
    connectionString: "",
  };
  openEditModal(newDatabase);
}

function openEditModal(database: Database) {
  selectedDatabase.value = database;
  isModalOpen.value = true;
}

function handleSave(updatedDatabase: Database) {
  const index = databases.value.findIndex((db) => db.id === updatedDatabase.id);
  if (index !== -1) {
    databases.value[index] = updatedDatabase;
  } else {
    if (updatedDatabase.id === 0) {
      updatedDatabase.id = Math.max(...databases.value.map((db) => db.id)) + 1;
    }
    databases.value.push(updatedDatabase);
  }
  console.log("Saving database:", JSON.stringify(updatedDatabase, null, 2));
  isModalOpen.value = false;
}

function handleCancel() {
  isModalOpen.value = false;
  selectedDatabase.value = null;
}

function handleDeleteConfirm() {
  if (selectedDatabase.value) {
    databases.value = databases.value.filter(
      (db) => db.id !== selectedDatabase.value!.id,
    );
  }
  isDeleteModalOpen.value = false;
  selectedDatabase.value = null;
}

function handleDeleteCancel() {
  isDeleteModalOpen.value = false;
  selectedDatabase.value = null;
}
</script>

<template>
  <div class="space-y-3">
    <div>
      <h1 class="text-base font-semibold text-gray-800">Options</h1>
      <p class="text-xs text-gray-600 mt-2">
        Manage your databases and add new ones as needed.
      </p>
    </div>
    <div class="flex justify-end">
      <Tooltip text="Add db">
        <button
          @click="addNewDatabase"
          class="btn-primary rounded-lg px-1.5 py-1 text-xs"
        >
          <PlusCircleIcon class-name="size-5" />
        </button>
      </Tooltip>
    </div>
    <div
      class="relative py-3 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md"
    >
      <table class="w-full table-fixed">
        <thead>
          <tr>
            <!-- Set explicit widths for the columns that should not expand -->
            <th
              class="w-28 px-4 py-2 text-left text-xs font-medium text-gray-600"
            >
              Name
            </th>
            <th
              class="w-20 px-4 py-2 text-left text-xs font-medium text-gray-600"
            >
              Type
            </th>
            <!-- This column gets the remaining space -->
            <th class="px-4 py-2 text-left text-xs font-medium text-gray-600">
              Connection String
            </th>
            <th
              class="w-24 px-4 py-2 text-left text-xs font-medium text-gray-600"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="database in databases" :key="database.id">
            <td class="px-4 py-2">
              <div class="truncate text-xs">{{ database.name }}</div>
            </td>
            <td class="px-4 py-2">
              <div class="truncate text-xs">{{ database.type }}</div>
            </td>
            <td class="px-4 py-2">
              <div class="truncate text-xs">
                {{ database.connectionString }}
              </div>
            </td>
            <td class="px-4 py-2">
              <div class="whitespace-nowrap text-xs">
                <button
                  class="text-secondary hover:bg-gray-100 p-1 rounded"
                  @click="openEditModal(database)"
                >
                  <Tooltip text="Edit">
                    <EditIcon class-name="size-4" />
                  </Tooltip>
                </button>
                <button
                  class="ms-2 text-red-600 hover:bg-gray-100 p-1 rounded"
                  @click="
                    () => {
                      isDeleteModalOpen = true;
                      selectedDatabase = database;
                    }
                  "
                >
                  <Tooltip text="Delete">
                    <DeleteIcon class-name="size-4" />
                  </Tooltip>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <EditDatabaseModal
    v-model="isModalOpen"
    title="Edit Database"
    :database="selectedDatabase"
    confirm-button-text="Save"
    cancel-button-text="Cancel"
    @save="handleSave"
    @cancel="handleCancel"
  />

  <DeleteModal
    v-model="isDeleteModalOpen"
    :id="selectedDatabase?.id"
    text="Are you sure you want to delete this database? This action cannot be undone."
    :title="`Confirm Delete for ${selectedDatabase?.name}`"
    @confirm="handleDeleteConfirm"
    @cancel="handleDeleteCancel"
  />
</template>
