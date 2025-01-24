<script lang="ts" setup>
import { useI18n } from '#imports'

const { locale } = useI18n()

locale.value = 'en'
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
