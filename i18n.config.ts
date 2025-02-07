import { en, zh_cn } from '@/locales/index'

// eslint-disable-next-line no-undef
export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  messages: {
    en,
    zh: zh_cn,
  },
}))
