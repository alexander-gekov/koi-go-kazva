<template>
  <div class="absolute inset-0 overflow-y-hidden bg-black bg-opacity-80">
    <div class="flex items-start justify-center min-h-screen mt-10 text-center">
      <div
        class="relative dark:bg-[#121212] overflow-hidden dark:border dark:border-slate-700 mx-1 bg-white dark:text-slate-300 text-black rounded-lg text-center shadow-xl p-6 w-full lg:w-1/2"
        role="dialog"
        aria-modal="true"
      >
        <button
          @click="$emit('close')"
          type="button"
          class="absolute top-0 right-0 m-2 text-slate-700 dark:text-slate-600 dark:hover:text-slate-400 bg-transparent hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
          data-modal-hide="staticModal"
        >
          <svg
            class="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
        <div class="max-w-3xl mx-auto">
          <h1 class="text-3xl font-bold mb-4">Кой го казва?</h1>
          <p class="mb-4">
            Общообразователно игра, в която трябва да се опитате да познаете,
            чий е цитатът на екрана.
          </p>
          <h2 class="text-xl font-bold mb-2">7 партийни лидери</h2>
          <ul class="list-disc list-inside mb-4">
            <li>Бойко Борисов</li>
            <li>Кирил Петков</li>
            <li>Костадин Костадинов</li>
            <li>Корнелия Нинова</li>
            <li>Христо Иванов</li>
            <li>Мустафа Карадайъ</li>
            <li>Стефан Янев</li>
          </ul>
          <h2 class="text-xl font-bold mb-2">Над 3000 възможни цитата</h2>
          <p>
            Играта засега наброява 3000+ цитата от 48то Народно събрание. (С
            изключение на Бойко Борисов, чиито цитати са от периода 2017-2020,
            когато е бил министър-председател.)
          </p>
        </div>
        <hr class="my-4" />
        <!-- <ul class="list-disc list-inside">
              <li class="flex justify-between">
                <div class="font-bold">Име</div>
                <input class="border rounded px-2 py-1" type="text" name="username">
              </li>
              <li class="flex justify-between mt-2">
                <div class="font-bold">Цитати</div>
                <select class="border rounded px-2 py-1" name="game_mode">
                  <option value="survival">Къси</option>
                  <option value="creative">Дълги</option>
                </select>
              </li>
            </ul> -->
        <div class="flex flex-col justify-center items-center">
          <div class="flex justify-center items-center">
            <h3 class="font-bold mb-2">Име</h3>
          </div>
          <div class="flex items-center">
            <input
              type="text"
              class="border dark:bg-[#1f1e1e] border-gray-400 rounded-md py-2 px-4 mr-2"
              v-model="username"
              :disabled="!isUsernameEditable"
            />
            <button
              class="relative dark:text-slate-700 text-blue-500"
              @click="toggleEditStatus('username', !isUsernameEditable)"
            >
              <template class="absolute right-0" v-if="!isUsernameEditable">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                  />
                </svg>
              </template>
              <template v-if="isUsernameEditable">Запази</template>
            </button>
          </div>
        </div>
        <div class="flex flex-col justify-center items-center">
          <div class="flex justify-center items-center">
            <h3 class="font-bold mb-2 mt-2">Цитати</h3>
          </div>
          <div class="flex items-center">
            <select
              class="border dark:bg-[#1f1e1e] border-gray-400 rounded-md py-2 px-4 mr-2"
              v-model="gameMode"
            >
              <option value="Къси">Къси</option>
              <option value="Дълги">Дълги</option>
            </select>
          </div>
        </div>
        <!-- <button class="dark:bg-slate-700 bg-blue-500 text-white mt-4 px-4 py-2 rounded-md" :disabled="saved" @click="saveSettings">{{saved ? 'Запазено' : 'Запази'}}</button> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStorage } from "@vueuse/core";
defineProps<{
  score: number;
}>();
defineEmits<{
  close: () => void;
}>();

const username = useStorage(
  "username",
  "Непознат играч №" +
    Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
);
const gameMode = useStorage("gameMode", "Къси");

const saved = ref(false);

const isUsernameEditable = ref(false);
const isGameModeEditable = ref(false);

const toggleEditStatus = (editable: string, status: boolean) => {
  if (editable === "username") {
    isUsernameEditable.value = status;
  } else if (editable === "game_mode") {
    isGameModeEditable.value = status;
  }
};

const saveSettings = () => {
  // localStorage('username', username.value)
  // localStorage('gameMode', gameMode.value)

  // Disable editing after saving
  isUsernameEditable.value = false;
  isGameModeEditable.value = false;
};

watch([username, gameMode], () => {
  saved.value = false;
});
</script>
