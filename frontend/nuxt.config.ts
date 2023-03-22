// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  ssr: false,
  app: {
    head: {
      title: 'Manage CGeass',
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: '' }
      ]
    }
  },
  css: [
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.min.css'
  ],
  modules: [
    [
      '@nuxtjs/i18n',
      {
        vueI18n: {
          legacy: false,
          locale: 'en',
          messages: {
            en: {
              welcome: 'Welcome',
              counter: 'Count is: {count}'
            },
            es: {
              welcome: 'Bienvenido',
              counter: 'El Contador es: {count}'
            }
          }
        }
      }
    ],
    ['@pinia/nuxt', {
      autoImports: [
        'defineStore'
      ]
    }]
  ],

  build: {
    transpile: ['vuetify']
  },
  vite: {
    define: {
      'process.env.DEBUG': false
    }
  }
});
