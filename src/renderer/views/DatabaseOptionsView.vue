<script setup lang="ts">
import { useRouter } from "vue-router";
import LeftArrowIcon from "../components/icons/LeftArrowIcon.vue";

const router = useRouter();

function goBack() {
  router.push("/"); // Navigate back to the home page
}
</script>

<template>
  <RouterLink
    to="/"
    class="flex items-center gap-1 text-gray-800 hover:text-gray-700 pt-2 pb-4"
  >
    <LeftArrowIcon class-name="size-4" />
  </RouterLink>
  <div class="space-y-3">
    <div>
      <h1 class="text-base font-semibold text-gray-800">Options</h1>
      <p class="text-xs text-gray-600 mt-2">
        Manage your databases and add new ones as needed.
      </p>
    </div>
    <div class="flex items-center gap-2 justify-end">
      <button class="btn-primary rounded-lg px-1.5 py-1 text-xs">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="size-4"
        >
          <path
            fill-rule="evenodd"
            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
      <span class="text-gray-700 text-xs"> Add New Database </span>
    </div>
    <!-- 
  The outer container now uses `overflow-hidden`. This strictly prevents any
  part of the table from becoming visible outside these bounds, removing any
  possibility of a scrollbar.
-->
<div
  class="relative py-3 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md"
>
  <!-- 
    `table-fixed` is essential. It forces the table to obey the widths set in the <thead>.
  -->
  <table class="w-full table-fixed">
    <thead>
      <tr>
        <!-- Set explicit widths for the columns that should not expand -->
        <th class="w-28 px-4 py-2 text-left text-xs font-medium text-gray-600">
          Name
        </th>
        <th class="w-20 px-4 py-2 text-left text-xs font-medium text-gray-600">
          Type
        </th>
        <!-- This column gets the remaining space -->
        <th class="px-4 py-2 text-left text-xs font-medium text-gray-600">
          Connection String
        </th>
        <th class="w-24 px-4 py-2 text-left text-xs font-medium text-gray-600">
          Actions
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <!-- 
          KEY CHANGE: We place a `div` inside the `td` and apply `truncate` to it.
          This is a much more reliable way to handle text overflow in tables.
        -->
        <td class="px-4 py-2">
          <div class="truncate text-xs">LocalStorage</div>
        </td>
        <td class="px-4 py-2">
          <div class="truncate text-xs">SQLite</div>
        </td>
        <td class="px-4 py-2">
          <div class="truncate text-xs">localstorage://</div>
        </td>
        <td class="px-4 py-2">
          <!-- `whitespace-nowrap` on the div keeps buttons on one line -->
          <div class="whitespace-nowrap text-xs">
            <button class="text-blue-600 hover:underline">Edit</button>
            <button class="ms-2 text-red-600 hover:underline">Delete</button>
          </div>
        </td>
      </tr>
      <!-- Example row with long content to demonstrate truncation -->
      <tr>
        <td class="px-4 py-2">
          <div class="truncate text-xs">
            Raspberry Pi 5
          </div>
        </td>
        <td class="px-4 py-2">
          <div class="truncate text-xs">MySQL</div>
        </td>
        <td class="px-4 py-2">
          <div class="truncate text-xs">
            postgresql://user:supersecretpassword@prod-db.example.com:5432/main_database
          </div>
        </td>
        <td class="px-4 py-2">
          <div class="whitespace-nowrap text-xs">
            <button class="text-blue-600 hover:underline">Edit</button>
            <button class="ms-2 text-red-600 hover:underline">Delete</button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>
  </div>
</template>
