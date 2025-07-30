<script setup lang="ts">
import { computed } from "vue";

// --- Props Definition ---
interface InputProps {
  modelValue: string | number; // v-model
  id?: string;
  label?: string;
  inputClass?: string | string[] | Record<string, boolean>;
}

const props = withDefaults(defineProps<InputProps>(), {
  id: `input-${Math.random().toString(36).substring(2, 9)}`,
});

// --- Emits Definition ---
const emit = defineEmits<{
  (e: "update:modelValue", value: string | number): void;
}>();

// --- Computed Properties ---
const localValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit("update:modelValue", value);
  },
});

const defaultInputClasses =
  "block w-full rounded-md bg-white px-3 py-2 text-xs text-gray-900 dark:text-slate-50 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-secondary";
</script>

<template>
  <label
    v-if="props.label"
    for="name"
    class="block mb-1 text-sm font-medium text-gray-700 dark:text-slate-50"
    >{{ props.label }}</label
  >
  <input
    v-model="localValue"
    :id="props.id"
    :name="props.id"
    type="text"
    :class="[defaultInputClasses, inputClass]"
  />
</template>
