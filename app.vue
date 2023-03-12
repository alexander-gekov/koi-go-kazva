<template>
  <div class="flex justify-center items-center h-full p-2 lg:p-10">
    <div class="w-full lg:w-2/3 h-full border-gray border p-4 shadow-xl rounded-lg flex flex-col justify-between">
      <h2 class="text-2xl text-center font-bold mb-5">Кой го казва?</h2>
      <p class="text-right my-2">Резултат: {{ round }}</p>
      <p class="bg-gray-200 text-center w-full flex-1 mx-auto px-4 py-2 mb-10">"{{ currentQuote.quote }}"</p>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <button @click="select(person.id)" v-for="person in people" :key="person.id" :disabled="selectedPerson" 
        :class="{'border-gray-700': person.id == selectedPerson, 'border-red-500': gameOver && person.id == currentQuote.said_by}" 
        class="border-2 transition duration-500 hover:[&:not(:disabled)]:border-gray-700 border-gray-300 disabled:cursor-not-allowed disabled:text-gray-700 p-4 rounded-lg text-center">
          {{ person.name }} - 
          <span>{{ person.party }}</span>
        </button>
        <button v-if="isCorrect" @click="nextQuote" class="bg-green-600 text-white p-4 rounded-lg text-center">Следващ цитат</button>
        <button v-else-if="!isCorrect & gameOver" @click="newGame" class="bg-gray-300 p-4 rounded-lg text-center">Опитай пак</button>
      </div>
    </div>
  </div>
</template>

<script setup>

const client = useSupabaseClient();
const round = ref(0);
const currentQuote = computed(() => quotes.value[round.value % 9]);
const selectedPerson = ref(null)
const gameOver = ref(false)

const isCorrect = computed(() => {
  if (!selectedPerson.value) return false;
  return selectedPerson.value === currentQuote.value.said_by;
})

const { data: quotes, refresh } = await useAsyncData('quotes', async () =>
  client.from('random_quotes').select('*').range(0,9), { transform: data => data.data}
)

const { data: people } = await useAsyncData('people', async () =>
  client.from('people').select('*'), { transform: data => data.data}
)

const select = (person) => {
  selectedPerson.value = person;
  if(!isCorrect.value) {
    gameOver.value = true;
  }
}

const nextQuote = () => {
  if(round + 1 === 9){
    refresh();
  }
  round.value++;
  selectedPerson.value = null;
}

const newGame = () => {
  selectedPerson.value = null;
  gameOver.value = false;
  round.value = 0;
  refresh();
}
</script>