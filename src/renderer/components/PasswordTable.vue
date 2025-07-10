<script setup lang="ts">
import { ref, computed } from "vue";
import { Password } from "../typings/password";
import ChevronRightIcon from "./icons/ChevronRightIcon.vue";
import PinAngleIcon from "./icons/PinAngleIcon.vue";

const props = defineProps<{ passwords: Password[] }>();

const hasPinnedPasswords = computed(() => {
  return props.passwords.some((p) => p.IsPinned);
});

const getPasswordInitials = (name: string) => {
  const matches = name.match(/[A-Z]/g);
  if (matches && matches.length > 0) {
    return matches.join("");
  }
  return name[0]?.toUpperCase() || "";
};
</script>

<template>
  <div>
    <div v-if="hasPinnedPasswords">
      <div class="ms-3 flex items-center gap-x-1">
        <PinAngleIcon class="size-3 fill-gray-500" />
        <span class="text-xs text-gray-400">Pinned</span>
      </div>
      <ul role="list" class="divide-y divide-gray-100 mb-4">
        <li
          v-for="password in passwords.filter((p) => p.IsPinned)"
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
        v-for="password in passwords.filter((p) => !p.IsPinned)"
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
