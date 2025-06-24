<script setup lang="ts">
import { ref, computed } from "vue";
import ClipboardIcon from "./icons/ClipboardIcon.vue"; // Adjust path as needed for your icon

interface ClipboardButtonProps {
  /** The text content to be copied to the clipboard. */
  textToCopy: string;
  /** Optional Tailwind CSS classes to apply to the button element. */
  buttonClass?: string;
  /** The ARIA label for the button for accessibility. */
  ariaLabel?: string;
  /** The title tooltip for the button. */
  buttonTitle?: string;
  /** Whether the button should be disabled. */
  isDisabled?: boolean;
}

const props = withDefaults(defineProps<ClipboardButtonProps>(), {
  buttonClass:
    "ms-3 px-2 py-2 bg-[#005185] text-white rounded-md hover:bg-[#003a60] focus:outline-none focus:ring-2 focus:ring-[#005185] focus:ring-offset-2 transition duration-200",
  ariaLabel: "Copy to clipboard",
  buttonTitle: "Copy to clipboard",
  isDisabled: false,
});

// Reactive state for the "Copied!" message
const copiedMessageVisible = ref(false);
const errorMessageVisible = ref(false); // New state for "Failed to copy!" message
let messageTimeout: ReturnType<typeof setTimeout> | null = null;

/**
 * Handles the actual copy operation to the clipboard.
 */
const copyToClipboard = async () => {
  // Clear any existing messages/timeouts
  clearTimeout(messageTimeout as ReturnType<typeof setTimeout>);
  copiedMessageVisible.value = false;
  errorMessageVisible.value = false;

  if (props.isDisabled) {
    console.warn("Attempted to copy, but button is disabled.");
    return;
  }

  try {
    if(props.textToCopy === ""){
      throw new Error("Text to copy cannot be empty.");
    }
    await navigator.clipboard.writeText(props.textToCopy);
    console.log("Text copied successfully:", props.textToCopy);
    copiedMessageVisible.value = true;
    messageTimeout = setTimeout(() => {
      copiedMessageVisible.value = false;
    }, 2000); // "Copied!" message disappears after 2 seconds
  } catch (err) {
    console.error("Failed to copy text to clipboard:", err);
    errorMessageVisible.value = true;
    messageTimeout = setTimeout(() => {
      errorMessageVisible.value = false;
    }, 3000); // "Failed!" message disappears after 3 seconds
  }
};

// Expose copyToClipboard method if parent needs to trigger it imperatively
defineExpose({
  copyToClipboard,
});
</script>

<template>
  <div class="relative inline-block">
    <button
      @click="copyToClipboard"
      :class="buttonClass"
      :aria-label="ariaLabel"
      :title="buttonTitle"
      :disabled="isDisabled"
      type="button"
    >
      <slot>
        <!-- Default slot content if nothing is passed -->
        <ClipboardIcon class-name="size-3" />
      </slot>
    </button>

    <!-- Copied message -->
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <span
        v-if="copiedMessageVisible"
        class="absolute -top-6 -right-2 text-xs text-green-600 bg-green-100 py-1 px-2 rounded-md shadow-sm animate-bounce"
      >
        Copied!
      </span>
    </transition>

    <!-- Failed message -->
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <span
        v-if="errorMessageVisible"
        class="absolute -top-6 -right-2 text-xs text-red-600 bg-red-100 py-1 px-2 rounded-md shadow-sm animate-bounce"
      >
        Failed!
      </span>
    </transition>
  </div>
</template>