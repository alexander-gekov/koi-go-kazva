<template>
    <div
      class="absolute inset-0 overflow-y-hidden bg-black bg-opacity-80"
    >
      <div
        class="flex items-start justify-center min-h-screen mt-24 text-center"
      >
        <div
          class="relative dark:bg-[#121212] overflow-hidden dark:border dark:border-slate-700 mx-1 bg-white dark:text-slate-300 text-black rounded-lg text-center shadow-xl p-6 w-full lg:w-1/2"
          role="dialog"
          aria-modal="true"
        >
            <button @click="$emit('close')" type="button" class="absolute top-0 right-0 m-2 text-slate-700 dark:text-slate-600 dark:hover:text-slate-400 bg-transparent hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" data-modal-hide="staticModal">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>  
            </button>
          <h3>Твоят резултат е:
          </h3>
          <div class="text-6xl font-bold my-4">{{ round }}</div>
          <div class="flex justify-center py-4 text-white">
                <!-- We will handle these emits later -->
	            <button @click="$emit('share')" class="border dark:border-gray-700 border-[#1f1e1e] text-slate-800 dark:text-slate-300 p-4 rounded-lg text-center mr-2">Сподели</button>
                <button @click="$emit('newGame')" class="dark:bg-[#1f1e1e] dark:text-slate-300 bg-gray-300 p-4 rounded-lg text-center">Опитай пак</button>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
  round: number
}>();
</script>
