import { defineStore } from "pinia";
import { ref } from "vue";
import type { Password } from "../typings/password";
import { DatabaseService } from "../services/IpcService";

// Sample Data (for initial state or testing)

export const usePasswordStore = defineStore("passwordStore", () => {
  // State: holds the list of passwords
  const passwords = ref<Password[]>();

  // Initialize passwords from the database
  async function initializePasswords() {
    passwords.value = await DatabaseService.getPasswords();
  }

  // Actions: methods that modify the state
  async function addPassword(
    password: Omit<Password, "Id" | "OnCreated" | "OnModified">
  ): Promise<void> {
    await DatabaseService.insertPassword(password);
  }

  async function getPasswordById(id: number): Promise<Password | undefined> {
    const newPassword = await DatabaseService.getPasswordById(id);
    return newPassword;
  }

  async function updatePassword(
    id: number,
    password: Omit<Password, "OnModified">
  ): Promise<void> {
    await DatabaseService.updatePassword(id, password);
  }

  async function deletePassword(id: number): Promise<void> {
    await DatabaseService.deletePassword(id);
  }

  // Return the state and actions that should be exposed
  return {
    passwords, // Renamed from allPasswords to directly expose the reactive ref
    initializePasswords,
    addPassword,
    getPasswordById,
    updatePassword,
    deletePassword,
  };
});
