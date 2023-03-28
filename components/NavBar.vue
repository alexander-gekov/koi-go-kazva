<template>
  <nav
    class="bg-slate-700 dark:bg-slate-800 text-white py-4 text-center font-bold"
  >
    Парламентарни избори 2023 - 2 Април. ОТИДИ И ГЛАСУВАЙ!
    {{
      `${displayDays} дни, ${displayHours} часа, ${displayMinutes} минути, ${displaySeconds} секунди до изборите!`
    }}
  </nav>
</template>

<script setup lang="ts">
// 2nd April 7AM +3:00 UTC
const aprilSecond = new Date("2023-04-02T07:00:00.000+03:00");
const displayDays = ref(0);
const displayHours = ref(0);
const displayMinutes = ref(0);
const displaySeconds = ref(0);
const _seconds = 1000;
const _minutes = _seconds * 60;
const _hours = _minutes * 60;
const _days = _hours * 24;
const showRemaining = () => {
  const timer = setInterval(() => {
    const now = new Date();
    const distance = aprilSecond.getTime() - now.getTime();
    if (distance < 0) {
      clearInterval(timer);
      return;
    }
    const days = Math.floor(distance / _days);
    const hours = Math.floor((distance % _days) / _hours);
    const minutes = Math.floor((distance % _hours) / _minutes);
    const seconds = Math.floor((distance % _minutes) / _seconds);
    displayDays.value = days;
    displayHours.value = hours;
    displayMinutes.value = minutes;
    displaySeconds.value = seconds;
  }, 1000);
};
onMounted(() => {
  showRemaining();
});
</script>
