<script setup lang="ts">
import { useI18n } from '#imports'

const { t } = useI18n()
</script>

<template>
  <div class="bg-gray-100 p-4">
    <div class="mx-auto flex items-center justify-between container">
      {{ t('图片格式转换') }}
    </div>
  </div>
</template>
