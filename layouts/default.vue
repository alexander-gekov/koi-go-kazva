<template>
  <div>
    <link rel="stylesheet" href="toastr.css" />
    <main>
      <!-- <NavBar /> -->
      <slot></slot>
    </main>
    <Footer class="static flex justify-center bottom-0" />
  </div>
</template>

<script setup>
useHead({
  bodyAttrs: {
    class: "bg-white dark:bg-[#121212] text-black dark:text-white",
  },
});
</script>
