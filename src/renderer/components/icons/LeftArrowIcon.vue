<script setup lang="ts">
// Define props using defineProps, compatible with TypeScript
interface LeftArrowIconProps {
  className?: string;
  title?: string;
}

// Define the component's props with a default value for className.
const props = withDefaults(defineProps<LeftArrowIconProps>(), {
  className: "size-6", // Default value for className
  title: "Back", // Default title for the SVG
});
</script>

<template>
  <svg
    :title="title"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    :class="className"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
    />
  </svg>
</template>
