<script setup lang="ts">
import { Password} from "../typings/password";
import ChevronRightIcon from "./icons/ChevronRightIcon.vue";

const props = defineProps<{ passwords: Password[] }>();

const getPasswordInitials = (name: string) => {
  const matches = name.match(/[A-Z]/g);
  if (matches && matches.length > 0) {
    return matches.join("");
  }
  return name[0]?.toUpperCase() || "";
};
</script>

<template>
  <ul role="list" class="divide-y divide-gray-100">
    <li v-for="password in passwords" :key="password.Id">
      <router-link
        :to="`/add-password/${password.Id}`"
        class="flex items-center gap-x-6 px-3 py-4 cursor-pointer hover:bg-slate-100 hover:rounded-md"
      >
        <span
          class="inline-flex size-7 items-center justify-center rounded-full bg-gray-500"
        >
          <span class="text-xs font-medium text-white">
            {{ getPasswordInitials(password.Name) }}
          </span>
        </span>
        <div class="flex justify-between flex-1">
          <span class="overflow-hidden">{{ password.Name }}</span>
          <ChevronRightIcon class="size-6" />
        </div>
      </router-link>
    </li>
  </ul>
</template>
