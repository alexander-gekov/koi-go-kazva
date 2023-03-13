<template>
    <div>
        <main>
            <slot></slot>
        </main>
        <Footer class="static bottom-0"/>
    </div>
</template>

<script setup>
useHead({
    bodyAttrs: {
        class: 'bg-white dark:bg-[#121212] text-black dark:text-white'
    }
})
</script>