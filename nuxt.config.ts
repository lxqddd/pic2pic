import path from 'node:path'
// https://nuxt.com/docs/api/configuration/nuxt-config
// eslint-disable-next-line no-undef
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  site: {
    url: '',
    name: '图片格式转换工具',
  },
  seo: {
    meta: {
      description: '图片格式转换工具',
    },
  },
  srcDir: path.resolve(__dirname, 'src'),
  alias: {
    '@': path.resolve(__dirname, 'src'),
  },
  modules: [
    '@unocss/nuxt',
    '@nuxtjs/robots',
    '@nuxtjs/seo',
    '@nuxtjs/i18n',
  ],
  css: [
    'normalize.css',
  ],
})
