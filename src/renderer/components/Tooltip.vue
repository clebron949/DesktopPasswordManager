<!-- Tooltip.vue -->
<script setup lang="ts">
interface Props {
  text: string;
}

defineProps<Props>();
</script>

<template>
  <div class="group relative inline-flex items-center">
    <!-- This is where the trigger element (icon, button, etc.) will be rendered -->
    <slot />
    <div
      class="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-800 dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white dark:text-slate-50 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
    >
      {{ text }}
      <!-- The Arrow -->
      <div
        class="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-x-8 border-t-8 border-x-transparent border-t-slate-800 dark:border-t-gray-900"
      ></div>
    </div>
  </div>
</template>
