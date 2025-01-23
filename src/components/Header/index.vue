<script setup lang="ts">
import { useI18n } from '#imports'

const { t, locale } = useI18n()

console.log(locale.value)
</script>

<template>
  <div class="bg-gray-100 p-4">
    <div class="mx-auto flex items-center justify-between container">
      this is header
      {{ t('欢迎') }}
    </div>
  </div>
</template>
