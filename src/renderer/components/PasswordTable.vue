<script setup lang="ts">
import { ref, computed } from "vue";
import { Password } from "../typings/password";
import ChevronRightIcon from "./icons/ChevronRightIcon.vue";

const props = defineProps<{ passwords: Password[] }>();

const pinnedPasswords = ref<Password[]>(
  props.passwords.filter((p) => p.IsPined),
);
const unPinnedPasswords = ref<Password[]>(
  props.passwords.filter((p) => !p.IsPined),
);

const getPasswordInitials = (name: string) => {
  const matches = name.match(/[A-Z]/g);
  if (matches && matches.length > 0) {
    return matches.join("");
  }
  return name[0]?.toUpperCase() || "";
};

const hasPinnedPasswords = computed(() => {
  return props.passwords.some((p) => p.IsPined);
});
</script>

<template>
  <div>
    <div v-if="hasPinnedPasswords">
      <span class="text-xs ms-3 text-gray-400">Pinned</span>
      <ul role="list" class="divide-y divide-gray-100 mb-4">
        <li
          v-for="password in passwords.filter((p) => p.IsPined)"
          :key="password.Id"
        >
          <router-link
            :to="`/add-password/${password.Id}`"
            class="flex items-center gap-x-6 px-3 py-3 cursor-pointer hover:bg-slate-100 hover:rounded-md"
          >
            <span
              class="inline-flex size-7 items-center justify-center rounded-full bg-gray-500"
            >
              <span class="text-[10px] font-medium text-white">
                {{ getPasswordInitials(password.Name) }}
              </span>
            </span>
            <div class="flex-1 flex justify-between">
              <span class="overflow-hidden text-sm">{{ password.Name }} </span>
              <ChevronRightIcon class="w-5" />
            </div>
          </router-link>
        </li>
      </ul>
    </div>

    <ul role="list" class="divide-y divide-gray-100">
      <li
        v-for="password in passwords.filter((p) => !p.IsPined)"
        :key="password.Id"
      >
        <router-link
          :to="`/add-password/${password.Id}`"
          class="flex items-center gap-x-6 px-3 py-3 cursor-pointer hover:bg-slate-100 hover:rounded-md"
        >
          <span
            class="inline-flex size-7 items-center justify-center rounded-full bg-gray-500"
          >
            <span class="text-[10px] font-medium text-white">
              {{ getPasswordInitials(password.Name) }}
            </span>
          </span>
          <div class="flex-1 flex justify-between">
            <span class="overflow-hidden text-sm">{{ password.Name }} </span>
            <ChevronRightIcon class="w-5" />
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>
