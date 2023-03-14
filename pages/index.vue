<template>
    <div class="dark:bg-[#121212] min-h-fit flex justify-center items-center p-2 lg:p-10">
      <div class="w-full lg:w-2/3 h-full dark:border-[#1f1e1e] border-gray border p-4 shadow-xl rounded-lg flex flex-col">
        <div class="relative flex justify-center items-center">
          <h2 class="dark:text-slate-300 text-2xl text-center font-bold mb-5">Кой го казва?</h2>
          <div class="absolute top-0 right-0 flex">
            <button class="border border-gray-300 dark:border-[#1f1e1e] p-2 rounded-xl mr-2" @click="toggleColorMode">
            <svg v-if="$colorMode.preference === 'light'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" class="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>
            </button>
            <button class="border border-gray-300 dark:border-[#1f1e1e] p-2 rounded-xl" @click="useHint">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
              </svg>
            </button>
          </div>
          
        </div>
        <p class="dark:text-slate-300 text-right my-2">Резултат: <span class="font-bold text-lg">{{ round }}</span></p>
        <p class="dark:bg-[#1f1e1e] dark:text-slate-300 bg-gray-200 text-center w-full mx-auto px-4 py-2 mb-10">"{{ currentQuote?.quote }}"</p>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <button :ref="'button' + person.id" @click="select(person.id)" v-for="person in people" :key="person.id" :disabled="selectedPerson != null || (hintUsed && person.id != currentQuote?.said_by && person.id != randomWrongPerson?.id)" 
          :class="{'border-gray-700 dark:border-white': person.id == selectedPerson, '!border-red-500 !dark:border-[#752828]': gameOver && person.id == currentQuote?.said_by, 'dark:bg-[#1f1f1f] line-through transform scale-50': hintUsed && person.id != currentQuote?.said_by && person.id != randomWrongPerson?.id}" 
          class="border-2 transition duration-300 dark:border-gray-700 dark:hover:[&:not(:disabled)]:border-white hover:[&:not(:disabled)]:border-gray-700 border-gray-300 disabled:cursor-not-allowed disabled:text-gray-700 p-4 rounded-lg text-center dark:text-slate-300">
            {{ person.name }} - 
            <span>{{ person.party }}</span>
          </button>
          <button v-if="isCorrect" @click="nextQuote" class="dark:bg-[#287543] bg-green-600 text-slate-300 p-4 rounded-lg text-center">Следващ цитат</button>
          <button v-else-if="!isCorrect && gameOver" @click="newGame" class="dark:bg-[#1f1e1e] dark:text-slate-300 bg-gray-300 p-4 rounded-lg text-center">Опитай пак</button>
          <ClientOnly>
            <Teleport to="body">
              <ModalGameOver :round="round" v-if="modal.show.value" @close="modal.hideModal" @newGame="newGame" />
            </Teleport>
          </ClientOnly>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { event } from 'vue-gtag'
  import { Database } from '~~/types/supabase';
  
  const colorMode = useColorMode();
  const client = useSupabaseClient<Database>();
  const modal = useModal();
  const round = ref(0);
  const currentQuote = computed(() => quotes.value ? quotes.value[round.value % 9] : null);
  const selectedPerson: Ref<number | null> = ref(null)
  const gameOver = ref(false)
  const hintUsed = ref(false)
 
  
  const isCorrect = computed(() => {
    if (!selectedPerson.value) return false;
    return selectedPerson.value === currentQuote.value?.said_by;
  })

  const randomWrongPerson = computed(() => {
    if(currentQuote.value && people.value) {
      const wrongPeople = people.value.filter(person => person.id !== currentQuote.value?.said_by)
      return wrongPeople[Math.floor(Math.random() * wrongPeople.length)]
    }
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
      modal.showModal();
    }
  }
  
  const nextQuote = () => {
    if(round.value + 1 === 9){
      refresh();
    }
    round.value++;
    event('next_quote', { event_category: 'game', event_label: 'next_quote', value: round.value })
    selectedPerson.value = null;
    hintUsed.value = false;
  }
  
  const newGame = () => {
    modal.hideModal();
    selectedPerson.value = null;
    gameOver.value = false;
    hintUsed.value = false;
    round.value = 0;
    refresh();
  }

  const toggleColorMode = () => {
    colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark';
  }

  const useHint = () => {
    if(people.value && !hintUsed.value && !gameOver.value) {
      event('use_hint', { event_category: 'game', event_label: 'use_hint', value: round.value })
      hintUsed.value = true;
    }
  }
  </script>