<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { UploadFile } from "element-plus"
import html2canvas from 'html2canvas'
import { Ico } from 'icojs'

const { t } = useI18n()

const imageType = ['png', 'jpg', 'webp', 'ico']

const curType = ref('png')
const curImageUrl = ref('')
const handleSelectImage = (file: UploadFile) => {
  console.log(file)
  curImageUrl.value = URL.createObjectURL(file.raw!)
}

const sourceImageRef = ref<HTMLImageElement>()
const targetImageUrl = ref('')
const handleTransform = async () => {
  // const canvas = await html2canvas(sourceImageRef.value!)
  // targetImageUrl.value = canvas.toDataURL(`image/${curType.value}`)
  imgToIcon()
}

const imgToIcon = () => {
  const ico = new Ico()
  ico.add('favicon.ico', sourceImageRef.value!.src)
  const blob = new Blob([ico.buffer], { type: 'image/x-icon' })
  const url = URL.createObjectURL(blob)
  targetImageUrl.value = url
}

</script>

<template>
  <div class="mx-auto flex justify-center pt-2 container">
    <div class="w-100%">
      <div class="border-0.25 border-[#eaeaea] rounded-2 border-solid">
        <div class="flex items-center rounded-2 bg-[#eaeaea] p-2">
          <div
            v-for="type in imageType"
            :key="type"
            class="w-35 flex cursor-pointer items-center justify-center rounded-1 py-2"
            :class="[type === curType ? 'bg-[#fff]' : '']"
            @click="curType = type"
          >
            {{ type }}
          </div>
        </div>
        <div class="flex p-4">
          <div class="flex-1">
            <h3>{{ t('源文件') }}</h3>
            <el-upload
              class="upload-demo"
              drag
              accept="image/*"
              :auto-upload="false"
              :show-file-list="false"
              :on-change="handleSelectImage"
            >
              <img v-if="curImageUrl" ref="sourceImageRef" :src="curImageUrl" alt="源文件" class="w-80">
              <div v-else class="el-upload__text">
                {{ t('拖放文件到这里，或者点击选择文件') }}
              </div>

            </el-upload>
          </div>
          <div class="flex items-center mx-4">
            <span class="mdi:arrow-right-bold-outline text-gray-400 text-10"></span>
          </div>
          <div class="flex-1">
            {{ t('目标格式') }}（{{ curType }}）
            <div>
              <img v-if="targetImageUrl" :src="targetImageUrl" alt="目标格式文件" class="w-80">
            </div>
          </div>
        </div>
        <div class="flex justify-center p-4">
          <el-button type="primary" class="w-40" @click="handleTransform">{{ t('转换') }}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
