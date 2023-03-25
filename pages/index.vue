<template>
    <div class="dark:bg-[#121212] min-h-fit flex justify-center items-center p-2 lg:p-10">
      <div class="w-full lg:w-2/3 h-full dark:border-[#1f1e1e] border-gray border p-4 shadow-xl rounded-lg flex flex-col">
        <div class="relative flex-col lg:flex-row flex justify-center items-center dark:text-slate-300">
          <h2 class="text-2xl text-center font-bold mb-5">Кой го казва?</h2>
          <div class="lg:absolute lg:top-0 lg:right-0 flex">
            <Buttons @linkGame="linkGame" @toggleColorMode="toggleColorMode" @useHint="useHint" @openSettings="openSettings"/>
          </div>
          <div class="lg:absolute mt-2 lg:mt-0 lg:top-0 lg:left-0 flex flex-col" v-if="showRoomId">
            <div>Игра: {{ router.currentRoute.value.query.g }}</div>
            <div v-for="player in players" :key="player">🔴 {{ player }}</div>
          </div>
        </div>
        <p class="dark:text-slate-300 text-center lg:text-right my-2">Резултат: <span class="font-bold text-lg">{{ round }}</span></p>
        <p class="dark:bg-[#1f1e1e] dark:text-slate-300 bg-gray-200 text-center w-full mx-auto px-4 py-2 mb-10">"{{ currentQuote?.quote }}"</p>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <button :ref="'button' + person.id" @click="select(person.id)" v-for="person in people" :key="person.id" :disabled="selectedPerson != null || (hintUsed && person.id != currentQuote?.said_by && person.id != randomWrongPerson?.id)" 
          :class="{'border-gray-700 dark:border-white': person.id == selectedPerson, '!border-red-500 !dark:border-[#752828]': gameOver && person.id == currentQuote?.said_by, 'dark:bg-[#1f1f1f] line-through transform scale-50': hintUsed && person.id != currentQuote?.said_by && person.id != randomWrongPerson?.id}" 
          class="border-2 transition duration-300 dark:border-gray-700 dark:hover:[&:not(:disabled)]:border-white hover:[&:not(:disabled)]:border-gray-700 border-gray-300 disabled:cursor-not-allowed disabled:text-gray-700 p-4 rounded-lg text-center dark:text-slate-300">
            {{ person.name }} - 
            <span>{{ person.party }}</span>
          </button>
          <button v-if="isCorrect" @click="nextQuote" class="dark:bg-[#287543] bg-green-600 text-white dark:text-slate-200 p-4 rounded-lg text-center">Следващ цитат</button>
          <button v-else-if="!isCorrect && gameOver" @click="newGame" class="dark:bg-[#1f1e1e] dark:text-slate-300 bg-gray-300 p-4 rounded-lg text-center">Опитай пак</button>
          <ClientOnly>
            <Teleport to="body">
              <component :is="modal.component.value" :round="round" v-if="modal.show.value" @close="modal.hideModal" @newGame="newGame" />
            </Teleport>
          </ClientOnly>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { event, query } from 'vue-gtag'
  import { Database } from '~~/types/supabase';
  // @ts-ignore
  import { v4 as uuidv4 } from "uuid";
  import ModalGameOver from '~~/components/ModalGameOver.vue';
  import ModalSettings from '~~/components/ModalSettings.vue';
  
  const colorMode = useColorMode();
  const route = useRoute();
  const router = useRouter();
  const client = useSupabaseClient<Database>();
  const modal = useModal();
  const { copy } = useClipboard();
  const round = ref(0);
  const currentQuote = computed(() => quotes.value ? quotes.value[round.value % 9] : null);
  const selectedPerson: Ref<number | null> = ref(null)
  const gameOver = ref(false)
  const hintUsed = ref(false)
  const { $socket, $nt } = useNuxtApp()  
  const connected = ref(false)
  const room = ref("");
  const showRoomId = ref(false);
  const players = ref([] as string[]);
  
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

  const quotes = computed(() => room.value!= "" ? quotesMultiplayer.value : quotesSupabase.value)

  const quotesMultiplayer = ref([]);
  
  const { data: quotesSupabase, refresh } = await useAsyncData('quotes', async () =>
    client.from('random_quotes').select('*').range(0,3), { transform: data => data.data}
  )
  
  const { data: people } = await useAsyncData('people', async () =>
    client.from('people').select('*'), { transform: data => data.data}
  )

  const openGameOver = () => {
    modal.component.value = markRaw(ModalGameOver);
    modal.showModal();
  }

  const openSettings = () => {
    modal.component.value = markRaw(ModalSettings);
    modal.showModal();
  }
  
  const select = (person_id: number) => {
    selectedPerson.value = person_id;
    if(!isCorrect.value) {
      gameOver.value = true;
      openGameOver();
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
    } else {
      $nt.show('Вече използвахте подсказката за този цитат')
    }
  }

  const linkGame = () => {
    if(connected.value) {
      if(route.query){
        copy(`${window.location.origin}/?g=${route.query.g}`);
      } else {
        const gameId = uuidv4().split('-')[0];
        router.replace({query: {g: gameId}});
        $socket.emit('message', {
          room: gameId,
          message: 'create',
          username: localStorage.getItem('username'),
          data: {
            quotes: quotesSupabase.value,
          }
        })
        console.log(quotesSupabase.value);
        copy(`${window.location.origin}/?g=${gameId}`);
        toastr('Копирано в клипборда!')
        showRoomId.value = true;
        const username = localStorage.getItem('username');
        if(username) {
          players.value = [];
          players.value.push(username);
        }
      }
    }
  }

  const toastr = (message: string) => {
    $nt.show({
        content: message,
        duration: 1000,
        theme: {
          containerClass: 'text-black',
          wrapperClass: "dark:bg-blue-500 bg-gray-300"
        }
      })
  }

  onMounted(() => {
    if(router.currentRoute.value.query.g) {
      $socket.emit('message', {
          room: router.currentRoute.value.query.g,
          username: localStorage.getItem('username') ?? 'Анонимен ' + Math.floor(Math.random() * 1000),
          message: 'join'
      });
      room.value = router.currentRoute.value.query.g.toString();
      showRoomId.value = true;
    }
    $socket.on('connect', () => {
      connected.value = true;
    })
    $socket.on('message', (message) => {
      if(message.message == 'loadGameData'){
        quotesMultiplayer.value = message.data.quotes;
      }
      else if (message.message == 'loadPlayers') {
        players.value = message.data;
      }
    })
  })
</script>