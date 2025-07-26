<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean],
    default: "",
  },
  options: {
    type: Array,
    required: true,
  },
  id: {
    type: String,
    default: null,
  },
  valueKey: {
    type: String,
    default: "value",
  },
  labelKey: {
    type: String,
    default: null,
  },
  labelKey: {
    type: String,
    default: "label",
  },
  inputClass: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(["update:modelValue", "change"]);

const internalValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit("update:modelValue", value);
    emit("change", value);
  },
});

const normalizedOptions = computed(() => {
  return props.options.map((option) => {
    if (typeof option === "string" || typeof option === "number") {
      return { [props.valueKey]: option, [props.labelKey]: option };
    }
    return option;
  });
});

const getOptionKey = (option) => {
  return option[props.valueKey] ?? option;
};

const getOptionValue = (option) => {
  return option[props.valueKey] ?? option;
};

const getOptionLabel = (option) => {
  return option[props.labelKey] ?? option;
};
</script>

<template>
  <select
    :id="id"
    v-model="internalValue"
    :class="[
      inputClass,
      'block appearance-none rounded-md border border-gray-300 bg-white py-0.5 pl-3 pr-8 text-xs font-medium text-secondary shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-secondary sm:leading-6',
    ]"
  >
    <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
    <option
      v-for="option in normalizedOptions"
      :key="getOptionKey(option)"
      :value="getOptionValue(option)"
    >
      {{ getOptionLabel(option) }}
    </option>
  </select>
</template>

<style scoped>
select {
  background-image: url("&quot;data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22%236B7A8B%22%3E%3Cpath fill-rule=%22evenodd%22 d=%22M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z%22 clip-rule=%22evenodd%22 /%3E%3C/svg%3E&quot;");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em;
  padding-right: 2.5rem;
}
</style>
