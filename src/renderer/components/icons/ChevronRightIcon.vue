<script setup lang="ts">
// Define props using defineProps, compatible with TypeScript
interface ChevronRightIconProps {
  className?: string;
}

// Define the component's props.
// The default value for className is provided here.
const props = withDefaults(defineProps<ChevronRightIconProps>(), {
  className: "size-6", // Default value for className
});

// We can destructure props if needed, but it's often cleaner
// to directly use props.className in the template.
const { className } = props;
</script>

<template>
  <svg
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
      d="m8.25 4.5 7.5 7.5-7.5 7.5"
    />
  </svg>
</template>