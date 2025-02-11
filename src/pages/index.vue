<script setup lang="ts">
import {ref} from 'vue'
import {useI18n} from 'vue-i18n'
import type {UploadFile, UploadRawFile} from "element-plus"
import html2canvas from 'html2canvas'
import axios from "axios";

const {t} = useI18n()

const imageType = ['png', 'jpg', 'webp', 'ico']

const curType = ref('png')
const curImageUrl = ref('')
const curFile = ref<UploadRawFile>()
const handleSelectImage = (file: UploadFile) => {
  console.log(file)
  curImageUrl.value = URL.createObjectURL(file.raw!)
  curFile.value = file.raw!
}

const sourceImageRef = ref<HTMLImageElement>()
const targetImageUrl = ref('')
const handleTransform = async () => {
  // const canvas = await html2canvas(sourceImageRef.value!)
  // targetImageUrl.value = canvas.toDataURL(`image/${curType.value}`)
  await imgToIcon()
}

const imgToIcon = async () => {
  try {
    const targetSize = 64
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    canvas.width = targetSize
    canvas.height = targetSize
    const scale = Math.min(targetSize / sourceImageRef.value!.width, targetSize / sourceImageRef.value!.height)
    const x = (targetSize - sourceImageRef.value!.width * scale) / 2
    const y = (targetSize - sourceImageRef.value!.height * scale) / 2
    ctx.clearRect(0, 0, targetSize, targetSize)
    ctx.drawImage(sourceImageRef.value!, x, y, sourceImageRef.value!.width * scale, sourceImageRef.value!.height * scale)
    const imageData = canvas.toDataURL('image/png')
    const imgBuffer = imageToBuffer(imageData)
    const icoBuffer = generateIco(imgBuffer, targetSize)
    const blob = new Blob([icoBuffer], {type: 'image/x-icon'})
    console.log(imgBuffer, 'image url')
    targetImageUrl.value = URL.createObjectURL(blob)

  } catch (e) {
    console.log(e)
  }
}

const imageToBuffer = (dataURL: string): Uint8Array => {
  const byteString = atob(dataURL.split(',')[1]);
  const buffer = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    buffer[i] = byteString.charCodeAt(i);
  }
  return buffer;
}

const generateIco = (buffer: Uint8Array, size: number) => {
  const header = new Uint8Array(6);
  header[0] = 0; // Reserved
  header[1] = 0; // Reserved
  header[2] = 1; // Type (1 = ICO)
  header[3] = 1; // Number of images (1 image)
  header[4] = 1; // Number of images
  header[5] = 0; // Total number of images

  // 图标头部：16 字节
  const imageHeader = new Uint8Array(16);
  imageHeader[0] = size; // 宽度
  imageHeader[1] = size; // 高度
  imageHeader[2] = 0; // 颜色数
  imageHeader[3] = 0; // 保留
  imageHeader[4] = 0; // 平面数
  imageHeader[5] = 32; // 位深度
  imageHeader[6] = 0; // 压缩方法
  imageHeader[7] = 0;
  imageHeader[8] = buffer.length & 0xFF; // 图像数据大小（低位）
  imageHeader[9] = (buffer.length >> 8) & 0xFF; // 图像数据大小（高位）
  imageHeader[10] = 0; // 图像偏移（这里不使用）
  imageHeader[11] = 0;

  // 合并文件头和图标数据
  const finalBuffer = new Uint8Array(6 + imageHeader.length + buffer.length);
  finalBuffer.set(header, 0);
  finalBuffer.set(imageHeader, 6);
  finalBuffer.set(buffer, 22);

  return finalBuffer;
}

const handleUpload = async (file: UploadFile) => {
  const formData = new FormData()
  formData.append('image', file)
  try {
    const res = await axios.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      responseType: 'blob'
    })
    console.log(res)
  } catch (e) {
    console.log(e)
  }
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
              :show-file-list="false"
              :on-change="handleSelectImage"
              :http-request="handleUpload"
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
