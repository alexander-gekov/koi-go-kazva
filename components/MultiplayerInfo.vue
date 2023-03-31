<template>
  <div class="lg:absolute mt-2 lg:mt-0 lg:top-0 lg:left-0" v-if="showRoomId">
    <div>Игра: {{ router.currentRoute.value.query.g }}</div>
    <div v-for="player in players" :key="player.name">
      🔴 {{ player.name }} - {{ player.score }}
    </div>
  </div>
</template>

<script setup lang="ts">
type Player = { name: string; score: number; isGameOver: boolean };

defineProps({
  players: {
    type: Array as PropType<Player[]>,
    required: true,
  },
  showRoomId: {
    type: Boolean,
    required: true,
  },
});

const router = useRouter();
</script>
