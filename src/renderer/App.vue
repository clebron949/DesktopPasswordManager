<script setup lang="ts">
import PassboltLogo from "./assets/passbolt.svg";
</script>

<template>
  <div class=" h-screen flex flex-col">
    <nav
      className="bg-white border-b-2 border-gray-200 shadow dark:bg-gray-900"
    >
      <div
        className="max-w-screen-lg flex flex-wrap items-center justify-between mx-auto p-4"
      >
        <RouterLink
          to="/"
          class="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img :src="PassboltLogo" alt="Passbolt Logo" className="h-8 w-auto" />
          <span
            className="self-center text-xl font-semibold whitespace-nowrap dark:text-white text-black"
          >
            Password Manager
          </span>
        </RouterLink>
        <div>
        <RouterLink to="/add-password/0">
          <button class="btn-primary rounded-lg px-3 py-1.5 text-sm">Add Password</button>
        </RouterLink>
        <RouterLink to="/password-generator">
          <button class="btn-secondary rounded-lg px-3 py-1.5 text-sm ms-3">Generate Password</button>
        </RouterLink>
        </div>
      </div>
    </nav>
    <div class=" flex-grow">
      <main
        class="w-full h-full max-w-screen-lg mx-auto overflow-auto bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
      >
        <div class="h-full px-6 pt-6 pb-3 dark:text-white text-black">
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>
