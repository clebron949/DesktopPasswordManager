<script setup lang="ts">
import { ref, watch } from "vue";
import DialogModal from "./DialogModal.vue";
import Input from "../forms/Input.vue";
import { DatabaseConnection } from "../../typings/database";
import Select from "../forms/Select.vue";
import { DatabaseProvider } from "../../typings/DatabaseProvider";
import FolderIcon from "../icons/FolderIcon.vue";

// --- Props Definition ---
interface EditDatabaseModalProps {
  modelValue: boolean; // v-model
  database: DatabaseConnection | null;
  title?: string;
  cancelButtonText?: string;
  saveButtonText?: string;
  modalClass?: string | string[] | Record<string, boolean>;
}

const props = withDefaults(defineProps<EditDatabaseModalProps>(), {
  modelValue: false,
  database: null,
  title: "Edit Database",
  cancelButtonText: "Cancel",
  saveButtonText: "Save",
  modalClass: "",
});

// --- Emits Definition ---
const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "save", data: DatabaseConnection): void;
  (e: "cancel"): void;
}>();

// --- State and Refs ---
const isOpen = ref(props.modelValue);
const modalId = ref(`edit-modal-${Math.random().toString(36).substring(2, 9)}`);

// Local state for the form to avoid mutating props directly
const form = ref<DatabaseConnection>({
  id: 0, // Default ID, will be set when editing an existing database
  name: "",
  dbType: "",
  connectionString: "",
});

const handleSave = () => {
  if (
    form.value.name !== "" ||
    form.value.dbType !== "" ||
    form.value.connectionString !== ""
  ) {
    console.log("Saving Database:", JSON.stringify(form.value, null, 2));
    emit("save", form.value);
  } else {
    emit("cancel");
  }
};

const handleCancel = () => {
  emit("cancel");
};

watch(
  () => props.modelValue,
  (newValue) => {
    isOpen.value = newValue;
    if (newValue && props.database) {
      form.value = { ...props.database };
    } else {
      form.value = { id: 0, name: "", dbType: "", connectionString: "" };
    }
  }
);

const openFolderDialog = async () => {
  try {
    const folderPath = await window.api.settings.openFolderDialog();
    if (folderPath) {
      form.value.connectionString =
        (await window.api.settings.joinPaths(
          folderPath,
          "password-manager.db"
        )) ?? "";
    }
  } catch (error) {
    console.error("Error opening folder dialog:", error);
  }
};
</script>

<template>
  <DialogModal
    v-model="isOpen"
    :title="title"
    :confirm-button-text="saveButtonText"
    :cancel-button-text="cancelButtonText"
    :modal-class="modalClass"
    @confirm="handleSave"
    @cancel="handleCancel"
    :aria-labelledby="`${modalId}-title`"
    role="dialog"
  >
    <!-- Modal Body (Form) -->
    <form @submit.prevent="handleSave" class="space-y-4">
      <div>
        <Input id="name" label="Name" v-model="form.name" />
      </div>
      <div>
        <label class="block mb-1 text-sm font-medium text-gray-700">Type</label>
        <Select
          v-model="form.dbType"
          input-class="w-full py-2"
          :options="
            Object.keys(DatabaseProvider).filter((key) => isNaN(Number(key)))
          "
        />
      </div>
      <div>
        <label class="block mb-1 text-sm font-medium text-gray-700"
          >Connection String</label
        >
        <div class="flex gap-2">
          <Input
            id="connectionString"
            v-model="form.connectionString"
            input-class="grow"
          />
          <button
            v-if="form.dbType === DatabaseProvider[DatabaseProvider.SQLite]"
            type="button"
            class="btn-primary text-xs py-0.5 px-2 rounded"
            @click="openFolderDialog"
          >
            <FolderIcon class="size-4" />
          </button>
        </div>
      </div>
    </form>
  </DialogModal>
</template>
