<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import PassboltLogo from "./assets/passbolt.svg";

const router = useRouter();

onMounted(() => {
  window.api.app.getVersion().then((version) => {
    document.title = `Password Manager v${version}`;
  });
  window.api.navigation.onNavigateToDbOptions(() => {
    router.push("/db-options");
  });
});

onUnmounted(() => {
  window.api.navigation.removeNavigationListeners();
});
</script>

<template>
  <div class="h-screen flex flex-col">
    <nav
      className="bg-white border-b-2 border-gray-200 shadow dark:bg-gray-900"
    >
      <div
        className="max-w-screen-lg flex flex-wrap items-center justify-between mx-auto px-4 pt-2 pb-4"
      >
        <RouterLink
          to="/"
          class="flex items-center space-x-2 rtl:space-x-reverse"
        >
          <img :src="PassboltLogo" alt="Passbolt Logo" className="w-8 h-auto" />
          <span
            className="self-center text-base font-semibold whitespace-nowrap dark:text-white text-black"
          >
            Password Manager
          </span>
        </RouterLink>
        <div>
          <RouterLink to="/add-password/0">
            <button class="btn-primary rounded-lg px-3 py-1.5 text-xs">
              Add Password
            </button>
          </RouterLink>
          <RouterLink to="/password-generator">
            <button class="btn-secondary rounded-lg px-3 py-1.5 text-xs ms-3">
              Generate Password
            </button>
          </RouterLink>
        </div>
      </div>
    </nav>
    <div class="flex-grow">
      <main
        class="w-full h-full max-w-screen-lg mx-auto overflow-auto bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
      >
        <div class="h-full px-6 pt-4 pb-3 dark:text-white text-black">
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>
