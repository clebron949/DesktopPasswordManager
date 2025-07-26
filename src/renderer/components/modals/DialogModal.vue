<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from "vue";

// --- Props Definition ---
interface ConfirmationModalProps {
  // `v-model` prop for controlling visibility
  modelValue: boolean;
  title?: string;
  cancelButtonText?: string;
  confirmButtonText?: string;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  modalClass?: string | string[] | Record<string, boolean>; // Allows custom classes for modal content
}

const props = withDefaults(defineProps<ConfirmationModalProps>(), {
  modelValue: false,
  title: "Confirm Action",
  cancelButtonText: "Cancel",
  confirmButtonText: "Confirm",
  showCloseButton: true,
  closeOnOverlayClick: true,
  modalClass: "",
});

// --- Emits Definition ---
// Emits for v-model update and for confirmation/cancellation
const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void; // For v-model
  (e: "confirm"): void;
  (e: "cancel"): void;
}>();

// --- State and Refs ---
const isOpen = ref(props.modelValue);
const modalId = ref(`modal-${Math.random().toString(36).substring(2, 9)}`); // Unique ID for A11y attributes
const modalContent = ref<HTMLElement | null>(null); // Ref to the modal content div for focus trapping
let returnFocusEl: HTMLElement | null = null; // Element to return focus to after closing

// --- Watchers ---
watch(
  () => props.modelValue,
  (newValue) => {
    isOpen.value = newValue;
    if (newValue) {
      // Modal opened
      returnFocusEl = document.activeElement as HTMLElement; // Store the currently focused element
      nextTick(() => {
        if (modalContent.value) {
          modalContent.value.focus(); // Focus the modal content for accessibility
        }
      });
      document.body.classList.add("overflow-hidden"); // Prevent scrolling body
    } else {
      // Modal closed
      document.body.classList.remove("overflow-hidden");
      if (returnFocusEl) {
        returnFocusEl.focus(); // Return focus to the element that opened the modal
      }
    }
  },
  { immediate: true } // Run immediately on mount to sync initial modelValue
);

// --- Methods ---
const openModal = () => {
  emit("update:modelValue", true);
};

const closeModal = () => {
  emit("update:modelValue", false);
};

const confirm = () => {
  emit("confirm");
  closeModal();
};

const cancel = () => {
  emit("cancel");
  closeModal();
};

const handleOverlayClick = () => {
  if (props.closeOnOverlayClick) {
    cancel();
  }
};

// --- Keyboard Event Listener for Escape Key ---
const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === "Escape" && isOpen.value) {
    cancel();
  }
};

onMounted(() => {
  document.addEventListener("keydown", handleEscapeKey);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleEscapeKey);
  // Ensure body scroll is reset if component unmounts while modal is open
  document.body.classList.remove("overflow-hidden");
});

// --- Focus Trapping (Advanced but Good Practice) ---
// This is a simplified focus trap. For a truly robust one, consider a library
// like 'focus-trap-js' or more complex manual logic.
const handleKeyDown = (event: KeyboardEvent) => {
  if (!isOpen.value || !modalContent.value) return;

  const focusableElements = modalContent.value.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusableEl = focusableElements[0] as HTMLElement;
  const lastFocusableEl = focusableElements[
    focusableElements.length - 1
  ] as HTMLElement;

  if (event.key === "Tab") {
    if (event.shiftKey) {
      /* shift + tab */
      if (document.activeElement === firstFocusableEl) {
        lastFocusableEl.focus();
        event.preventDefault();
      }
    } else {
      /* tab */
      if (document.activeElement === lastFocusableEl) {
        firstFocusableEl.focus();
        event.preventDefault();
      }
    }
  }
};

// Add keydown listener to the modal content itself
watch(isOpen, (newVal) => {
  if (newVal && modalContent.value) {
    modalContent.value.addEventListener("keydown", handleKeyDown);
  } else if (!newVal && modalContent.value) {
    modalContent.value.removeEventListener("keydown", handleKeyDown);
  }
});
</script>

<template>
  <div>
    <!-- Slot for the trigger element -->
    <div @click="openModal">
      <slot name="trigger"></slot>
    </div>

    <!-- Modal Overlay -->
    <transition
      enter-active-class="transition ease-out duration-300 transform"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200 transform"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50"
        @click.self="handleOverlayClick"
        aria-modal="true"
        role="dialog"
        :aria-labelledby="`${modalId}-title`"
        :aria-describedby="`${modalId}-description`"
        tabindex="-1"
      >
        <!-- Modal Content -->
        <transition
          enter-active-class="transition ease-out duration-300 transform"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition ease-in duration-200 transform"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="isOpen"
            ref="modalContent"
            class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 relative text-gray-900 dark:text-slate-50"
            :class="modalClass"
            tabindex="-1"
          >
            <!-- Close button (optional) -->
            <button
              v-if="showCloseButton"
              @click="cancel"
              class="absolute top-4 right-4 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#005185] dark:focus:ring-secondary rounded-full p-1"
              aria-label="Close modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>

            <!-- Modal Header -->
            <div v-if="title" class="mb-4">
              <h3
                :id="`${modalId}-title`"
                class="text-xl font-bold text-[#005185] dark:text-slate-50"
              >
                {{ title }}
              </h3>
            </div>

            <!-- Modal Body (Default Slot) -->
            <div
              :id="`${modalId}-description`"
              class="mb-6 text-gray-700 dark:text-slate-50"
            >
              <slot></slot>
            </div>

            <!-- Modal Actions -->
            <div class="flex justify-end space-x-3">
              <button
                @click="cancel"
                class="px-5 py-2 rounded-lg border border-[#6B7A8B] text-[#6B7A8B] dark:border-slate-500 dark:text-slate-300 text-sm hover:bg-gray-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-[#6B7A8B] dark:focus:ring-secondary focus:ring-offset-2 transition duration-200"
              >
                {{ cancelButtonText }}
              </button>
              <button
                @click="confirm"
                class="px-5 py-2 rounded-lg bg-[#D40000] dark:bg-red-700 text-white text-sm font-semibold hover:bg-red-700 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-[#D40000] dark:focus:ring-red-700 focus:ring-offset-2 transition duration-200"
              >
                {{ confirmButtonText }}
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>
