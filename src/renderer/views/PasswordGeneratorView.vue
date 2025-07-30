<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import ClipboardButtonWithFeedback from "../components/ClipboardButtonWithFeedback.vue";
import { IpcService } from "../services/IpcService";

const password = ref<string>("");
const passwordLength = ref<number>(12);
const includeLowercase = ref<boolean>();
const includeUppercase = ref<boolean>();
const includeNumbers = ref<boolean>();
const includeSymbols = ref<boolean>();

onMounted(() => {
  IpcService.getSettings().then((settings) => {
    if (settings) {
      passwordLength.value = settings.passwordLength;
      includeLowercase.value = settings.includeLowercase;
      includeUppercase.value = settings.includeUppercase;
      includeNumbers.value = settings.includeNumbers;
      includeSymbols.value = settings.includeSymbols;
      generatePassword();
    }
  });
});

watch(
  [
    passwordLength,
    includeLowercase,
    includeUppercase,
    includeNumbers,
    includeSymbols,
  ],
  () => {
    IpcService.saveSettings({
      passwordLength: passwordLength.value,
      includeLowercase: includeLowercase.value,
      includeUppercase: includeUppercase.value,
      includeNumbers: includeNumbers.value,
      includeSymbols: includeSymbols.value,
    });
  },
  { deep: true }
);

const generatePassword = () => {
  let characters = "";
  if (includeLowercase.value) {
    characters += "abcdefghijklmnopqrstuvwxyz";
  }
  if (includeUppercase.value) {
    characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  }
  if (includeNumbers.value) {
    characters += "0123456789";
  }
  if (includeSymbols.value) {
    characters += "!@#$%^&*()_+-=[]{}|;:,.<>?";
  }

  if (characters.length === 0) {
    password.value = "Please select at least one character type.";
    return;
  }

  let newPassword = "";
  for (let i = 0; i < passwordLength.value; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    newPassword += characters[randomIndex];
  }
  password.value = newPassword;
};

const passwordStrength = computed(() => {
  const currentPassword = password.value;
  let strength = 0;

  // Basic strength checks
  if (currentPassword.length >= 8) strength++;
  if (currentPassword.length >= 12) strength++;
  if (/[a-z]/.test(currentPassword)) strength++;
  if (/[A-Z]/.test(currentPassword)) strength++;
  if (/[0-9]/.test(currentPassword)) strength++; // Check for numbers
  if (/[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(currentPassword)) strength++;

  switch (strength) {
    case 0:
    case 1:
      return { text: "Very Weak", colorClass: "text-[#D40000]" };
    case 2:
      return { text: "Weak", colorClass: "text-[#D40000]" };
    case 3:
      return { text: "Moderate", colorClass: "text-amber-500" };
    case 4:
      return { text: "Good", colorClass: "text-[#005185]" };
    case 5:
      return { text: "Strong", colorClass: "text-[#005185]" };
    case 6:
      return { text: "Very Strong", colorClass: "text-[#005185]" };
    default:
      return { text: "", colorClass: "" };
  }
});
</script>

<template>
  <div
    class="font-sans max-w-md mx-auto p-8 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-slate-50"
  >
    <h2
      class="text-center text-xl font-extrabold text-[#005185] dark:text-slate-50 mb-8 tracking-wide"
    >
      Password Generator
    </h2>

    <div class="mb-6 relative flex items-end">
      <div class="flex-grow">
        <!-- Input field for password -->
        <label
          for="password-display"
          class="block text-sm font-semibold mb-2 dark:text-slate-50"
        >
          Generated Password:
        </label>
        <input
          id="password-display"
          type="text"
          :value="password"
          readonly
          class="w-full py-1.5 px-3 pr-12 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-800 cursor-text shadow-sm focus:outline-none focus:ring-2 focus:ring-[#005185] dark:focus:ring-secondary dark:text-slate-50"
        />
      </div>

      <!-- Copy Button -->
      <ClipboardButtonWithFeedback :text-to-copy="password" />
    </div>

    <div class="mb-6">
      <label
        for="length"
        class="block text-sm font-semibold mb-2 dark:text-slate-50"
      >
        Password Length: {{ passwordLength }}
      </label>
      <input
        type="range"
        id="length"
        v-model.number="passwordLength"
        min="6"
        max="30"
        @input="generatePassword"
        class="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer range-shadow accent-[#005185] dark:accent-secondary"
      />
    </div>

    <div class="mb-4">
      <input
        type="checkbox"
        id="lowercase"
        v-model="includeLowercase"
        @change="generatePassword"
        class="mr-2 size-4 accent-[#005185] dark:accent-secondary focus:ring-2 focus:ring-[#005185] dark:focus:ring-secondary"
      />
      <label for="lowercase" class="text-sm dark:text-slate-50"
        >Include Lowercase (a-z)</label
      >
    </div>

    <div class="mb-4">
      <input
        type="checkbox"
        id="uppercase"
        v-model="includeUppercase"
        @change="generatePassword"
        class="mr-2 size-4 accent-[#005185] dark:accent-secondary focus:ring-2 focus:ring-[#005185] dark:focus:ring-secondary"
      />
      <label for="uppercase" class="text-sm dark:text-slate-50"
        >Include Uppercase (A-Z)</label
      >
    </div>

    <div class="mb-4">
      <input
        type="checkbox"
        id="numbers"
        v-model="includeNumbers"
        @change="generatePassword"
        class="mr-2 size-4 accent-[#005185] dark:accent-secondary focus:ring-2 focus:ring-[#005185] dark:focus:ring-secondary"
      />
      <label for="numbers" class="text-sm dark:text-slate-50"
        >Include Numbers (0-9)</label
      >
    </div>

    <div class="mb-6">
      <input
        type="checkbox"
        id="symbols"
        v-model="includeSymbols"
        @change="generatePassword"
        class="mr-2 size-4 accent-[#005185] dark:accent-secondary focus:ring-2 focus:ring-[#005185] dark:focus:ring-secondary"
      />
      <label for="symbols" class="text-sm dark:text-slate-50"
        >Include Symbols (!@#$%...)</label
      >
    </div>

    <button
      @click="generatePassword"
      class="w-full py-3 px-4 bg-[#005185] dark:bg-secondary text-white font-bold text-md rounded-lg shadow-md hover:bg-[#003a60] dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-[#005185] dark:focus:ring-secondary focus:ring-offset-2 transition duration-200 ease-in-out transform hover:-translate-y-0.5 active:translate-y-0 active:bg-[#002d4f] dark:active:bg-slate-700"
    >
      Generate New Password
    </button>

    <div
      v-if="passwordStrength.text"
      class="mt-8 text-center text-sm font-extrabold p-3 rounded-md bg-gray-100 dark:bg-slate-700"
    >
      <span :class="passwordStrength.colorClass">
        Strength: {{ passwordStrength.text }}
      </span>
    </div>
  </div>
</template>

<style scoped>
/* Custom shadow for the range input thumb */
.range-shadow::-webkit-slider-thumb {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.range-shadow::-moz-range-thumb {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
