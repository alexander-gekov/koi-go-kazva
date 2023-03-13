<template>
    <div class="dark:bg-[#121212] flex justify-center items-center h-full p-2 lg:p-10">
      <div class="w-full lg:w-2/3 h-full dark:border-[#1f1e1e] border-gray border p-4 shadow-xl rounded-lg flex flex-col justify-between">
        <div class="relative flex justify-center items-center">
          <h2 class="dark:text-[#eeeeee] text-2xl text-center font-bold mb-5">Кой го казва?</h2>
          <button class="absolute top-0 right-0 border border-gray-300 p-2 rounded-xl" @click="toggleColorMode">💡</button>
        </div>
        <p class="dark:text-white text-right my-2">Резултат: {{ round }}</p>
        <p class="dark:bg-[#1f1e1e] dark:text-white bg-gray-200 text-center w-full flex-1 mx-auto px-4 py-2 mb-10">"{{ currentQuote?.quote }}"</p>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <button @click="select(person.id)" v-for="person in people" :key="person.id" :disabled="selectedPerson!=null" 
          :class="{'border-gray-700 dark:border-white': person.id == selectedPerson, 'border-red-500 dark:border-[#752828]': gameOver && person.id == currentQuote?.said_by}" 
          class="border-2 transition duration-500 dark:border-gray-700 dark:hover:[&:not(:disabled)]:border-white hover:[&:not(:disabled)]:border-gray-700 border-gray-300 disabled:cursor-not-allowed disabled:text-gray-700 p-4 rounded-lg text-center dark:text-white">
            {{ person.name }} - 
            <span>{{ person.party }}</span>
          </button>
          <button v-if="isCorrect" @click="nextQuote" class="dark:bg-[#287543] bg-green-600 text-white p-4 rounded-lg text-center">Следващ цитат</button>
          <button v-else-if="!isCorrect && gameOver" @click="newGame" class="dark:bg-gray-800 dark:text-white bg-gray-300 p-4 rounded-lg text-center">Опитай пак</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { event } from 'vue-gtag'
  import { Database } from '~~/types/supabase';
  
  const colorMode = useColorMode();
  const client = useSupabaseClient<Database>();
  const round = ref(0);
  const currentQuote = computed(() => quotes.value ? quotes.value[round.value % 9] : null);
  const selectedPerson: Ref<number | null> = ref(null)
  const gameOver = ref(false)
  
  const isCorrect = computed(() => {
    if (!selectedPerson.value) return false;
    return selectedPerson.value === currentQuote.value?.said_by;
  })
  
  const { data: quotes, refresh } = await useAsyncData('quotes', async () =>
    client.from('random_quotes').select('*').range(0,9), { transform: data => data.data}
  )
  
  const { data: people } = await useAsyncData('people', async () =>
    client.from('people').select('*'), { transform: data => data.data}
  )
  
  const select = (person_id: number) => {
    selectedPerson.value = person_id;
    if(!isCorrect.value) {
      gameOver.value = true;
    }
  }
  
  const nextQuote = () => {
    if(round.value + 1 === 9){
      refresh();
    }
    round.value++;
    event('next_quote', { event_category: 'game', event_label: 'next_quote', value: round.value })
    selectedPerson.value = null;
  }
  
  const newGame = () => {
    selectedPerson.value = null;
    gameOver.value = false;
    round.value = 0;
    refresh();
  }

  const toggleColorMode = () => {
    colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark';
  }
  </script>