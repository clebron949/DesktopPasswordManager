<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { Password } from "../typings/password";
import { usePasswordStore } from "../stores/PasswordStore";
import ConfirmationModal from "../components/ConfirmationModal.vue";
import LeftArrowIcon from "../components/icons/LeftArrowIcon.vue";
import DeleteIcon from "../components/icons/DeleteIcon.vue";
import ClipboardButtonWithFeedback from "../components/ClipboardButtonWithFeedback.vue";
import PinIcon from "../components/icons/PinIcon.vue";
import PinAngleIcon from "../components/icons/PinAngleIcon.vue";

const route = useRoute();
const router = useRouter();
const passwordStore = usePasswordStore();

const showDeleteConfirmModal = ref(false);
const localPassword = ref<Omit<Password, "OnModified">>({
  Id: 0,
  Name: "",
  Username: "",
  Password: "",
  Url: "",
  IsPinned: false,
  OnCreated: "",
});

const loadPasswordDetails = async (id: number) => {
  const password = await passwordStore.getPasswordById(id);
  if (password) {
    localPassword.value = {
      Id: password.Id,
      Name: password.Name,
      Username: password.Username,
      Password: password.Password,
      Url: password.Url,
      IsPinned: password.IsPinned,
      OnCreated: password.OnCreated,
    };
  } else {
    console.warn(`Password with ID ${id} not found.`);
    router.push("/");
  }
};

onMounted(async () => {
  const id = Number(route.params.id);
  if (id && !isNaN(id)) {
    await loadPasswordDetails(id);
  }
});

// Watch for changes in route.params.id to re-load if navigating between password details
watch(
  () => route.params.id,
  async (newId, oldId) => {
    const id = Number(newId);
    if (id && !isNaN(id) && id !== Number(oldId)) {
      await loadPasswordDetails(id);
    } else if (!newId) {
      localPassword.value = {
        Id: 0,
        Name: "",
        Username: "",
        Password: "",
        Url: "",
        IsPinned: false,
        OnCreated: "",
      };
    }
  }
);

const handleSavePassword = async () => {
  try {
    if (localPassword.value.Id && localPassword.value.Id !== 0) {
      // Existing password: update it
      await passwordStore.updatePassword(localPassword.value.Id, {
        Id: localPassword.value.Id,
        Name: localPassword.value.Name,
        Username: localPassword.value.Username,
        Password: localPassword.value.Password,
        Url: localPassword.value.Url,
        IsPinned: localPassword.value.IsPinned,
        OnCreated: localPassword.value.OnCreated,
      });
      console.log("Password updated successfully");
      // Refresh the passwords list in store
      await passwordStore.initializePasswords();
      router.push("/");
    } else {
      // New password: add it
      await passwordStore.addPassword({
        Name: localPassword.value.Name,
        Username: localPassword.value.Username,
        Password: localPassword.value.Password,
        Url: localPassword.value.Url,
        IsPinned: localPassword.value.IsPinned,
      });
      console.log("New password added successfully");
      // Refresh the passwords list in store
      await passwordStore.initializePasswords();
      router.push("/");
    }
  } catch (error) {
    console.error("Error saving password:", error);
  }
};

const handleConfirmDelete = async () => {
  console.log("Delete Confirmed!");
  console.log("Deleting password with ID:", localPassword.value.Id);
  try {
    await passwordStore.deletePassword(localPassword.value.Id);
    console.log("Password deleted!");
    // Refresh the passwords list in store
    await passwordStore.initializePasswords();
    router.push("/");
  } catch (error) {
    console.error("Failed to delete password:", error);
  }
  showDeleteConfirmModal.value = false;
};

const handleCancelDelete = () => {
  console.log("Delete Cancelled.");
  showDeleteConfirmModal.value = false;
};

const handlePasswordPin = async () => {
  localPassword.value.IsPinned = !localPassword.value.IsPinned;
  await passwordStore.updatePassword(localPassword.value.Id, {
    Id: localPassword.value.Id,
    Name: localPassword.value.Name,
    Username: localPassword.value.Username,
    Password: localPassword.value.Password,
    Url: localPassword.value.Url,
    IsPinned: localPassword.value.IsPinned,
    OnCreated: localPassword.value.OnCreated,
  });
  await passwordStore.initializePasswords();
};
</script>

<template>
  <div>
    <div class="mb-4 flex items-center justify-between">
      <!-- Back Link -->
      <RouterLink
        to="/"
        class="flex items-center gap-1 font-medium text-sm text-gray-800 hover:text-gray-700"
      >
        <button title="Back">
          <LeftArrowIcon class-name="size-4" />
        </button>
      </RouterLink>

      <!-- Delete Button (only show if editing existing password) -->
      <ConfirmationModal
        v-if="localPassword.Id && localPassword.Id !== 0"
        v-model="showDeleteConfirmModal"
        title="Delete this password?"
        confirm-button-text="Yes, Delete It!"
        cancel-button-text="Cancel"
        @confirm="handleConfirmDelete"
        @cancel="handleCancelDelete"
      >
        <!-- This slot holds the trigger button -->
        <template #trigger>
          <div class="flex justify-end items-center">
            <button
              title="Delete Password"
              class="p-2 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              <DeleteIcon class="w-4 h-auto fill-red-600" />
            </button>
          </div>
        </template>
        <p class="text-gray-700 text-sm">
          Are you sure you want to delete this password ({{
            localPassword.Name
          }})? This cannot be undone.
        </p>
      </ConfirmationModal>
    </div>

    <div class="space-y-4">
      <div class="flex items-center gap-1">
        <button @click="handlePasswordPin">
          <PinIcon
            v-if="!localPassword.IsPinned"
            class="size-4 fill-secondary"
          />
          <PinAngleIcon v-else class="size-4 fill-secondary" />
        </button>
        <span v-if="!localPassword.IsPinned" class="text-sm">Pin</span>
        <span v-else class="text-sm">Pinned</span>
      </div>
      <!-- Name Field -->
      <div>
        <label for="name" class="block text-xs font-medium text-gray-900">
          Name
        </label>
        <div class="mt-2 flex items-center">
          <input
            type="text"
            name="name"
            id="name"
            v-model="localPassword.Name"
            class="block w-full rounded-md bg-white px-3 py-2 text-xs text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-secondary"
          />
          <ClipboardButtonWithFeedback :text-to-copy="localPassword.Name" />
        </div>
      </div>

      <!-- Username Field -->
      <div>
        <label for="username" class="block text-xs font-medium text-gray-900">
          Username
        </label>
        <div class="mt-2 flex items-center">
          <input
            type="text"
            name="username"
            id="username"
            v-model="localPassword.Username"
            class="block w-full rounded-md bg-white px-3 py-2 text-xs text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-secondary"
          />
          <ClipboardButtonWithFeedback :text-to-copy="localPassword.Username" />
        </div>
      </div>

      <!-- Password Field -->
      <div>
        <label for="password" class="block text-xs font-medium text-gray-900">
          Password
        </label>
        <div class="mt-2 flex items-center">
          <input
            type="text"
            name="password"
            id="password"
            v-model="localPassword.Password"
            class="block w-full rounded-md bg-white px-3 py-2 text-xs text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-secondary"
          />
          <ClipboardButtonWithFeedback :text-to-copy="localPassword.Password" />
        </div>
      </div>

      <!-- URL Field -->
      <div>
        <label for="url" class="block text-xs font-medium text-gray-900">
          URL
        </label>
        <div class="mt-2 flex items-center">
          <input
            type="text"
            name="url"
            id="url"
            v-model="localPassword.Url"
            class="block w-full rounded-md bg-white px-3 py-2 text-xs text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-secondary"
          />
          <ClipboardButtonWithFeedback :text-to-copy="localPassword.Url" />
        </div>
      </div>

      <div class="flex justify-end">
        <button
          type="button"
          @click="handleSavePassword"
          class="mt-6 rounded-md btn-primary px-3 py-2 text-xs font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {{ localPassword.Id && localPassword.Id !== 0 ? "Update" : "Save" }}
        </button>
      </div>
    </div>
  </div>
</template>
