// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxtjs/supabase",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    "@vueuse/nuxt",
    "./modules/socket",
    "@cssninja/nuxt-toaster",
    "@nuxtjs/i18n",
  ],
  colorMode: {
    classSuffix: "",
  },
  i18n: {},
});
