<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from "vue";
import DialogModal from "./DialogModal.vue";
import Input from "../forms/Input.vue";
import { Database } from "../../typings/database";

// --- Props Definition ---
interface EditDatabaseModalProps {
  modelValue: boolean; // v-model
  database: Database | null;
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
  (e: "save", data: Database): void;
  (e: "cancel"): void;
}>();

// --- State and Refs ---
const isOpen = ref(props.modelValue);
const modalId = ref(`edit-modal-${Math.random().toString(36).substring(2, 9)}`);

// Local state for the form to avoid mutating props directly
const form = ref<Database>({
  id: 0, // Default ID, will be set when editing an existing database
  name: "",
  type: "",
  connectionString: "",
});

const handleSave = () => {
  console.log("Saving database:", form.value);
  emit("save", form.value);
};

const handleCancel = () => {
  emit("cancel");
};

watch(
  () => props.modelValue,
  (newValue) => {
    isOpen.value = newValue;
    if (newValue && props.database) {
      // Populate form with the database data when modal opens
      console.log("Opening modal with database:", props.database);
      form.value = { ...props.database };
    } else {
      // Reset form when modal closes
      form.value = { id: 0, name: "", type: "", connectionString: "" };
    }
  }
);
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
        <Input id="type" label="Type" v-model="form.type" />
      </div>
      <div>
        <Input
          id="connectionString"
          label="Connection String"
          v-model="form.connectionString"
        />
      </div>
    </form>
  </DialogModal>
</template>
