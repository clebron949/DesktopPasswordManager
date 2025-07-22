<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import DialogModal from "./DialogModal.vue";

interface DeleteModalProps {
  modelValue: boolean; // v-model
  id?: number; // ID of the item to delete
  text: string; // Text to display in the modal
  title?: string; // Optional title for the modal
}

const props = withDefaults(defineProps<DeleteModalProps>(), {
  modelValue: false,
  id: 0,
  title: "Confirm Action",
  text: "Are you sure you want to delete this item? This action cannot be undone.",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void; // For v-model
  (e: "confirm", value: number): void;
  (e: "cancel"): void;
}>();

const showDeleteConfirmModal = ref(props.modelValue);
const itemID = ref(props.id);

function handleConfirmDelete() {
  // Add your delete logic here
  showDeleteConfirmModal.value = false;
  emit("confirm", itemID.value);
}

function handleCancelDelete() {
  showDeleteConfirmModal.value = false;
  emit("cancel");
}

watch(
  () => props.modelValue,
  (newValue) => {
    showDeleteConfirmModal.value = newValue;
    itemID.value = props.id;
  }
);
</script>

<template>
  <DialogModal
    v-model="showDeleteConfirmModal"
    :title="title"
    confirm-button-text="Yes, Delete It!"
    cancel-button-text="Cancel"
    @confirm="handleConfirmDelete"
    @cancel="handleCancelDelete"
  >
    <p class="text-gray-700 text-sm">
      {{ props.text }}
    </p>
  </DialogModal>
</template>
