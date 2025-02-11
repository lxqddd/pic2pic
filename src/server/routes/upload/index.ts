import formidable from 'formidable'
import {createError} from "nuxt/app";
import * as sharp from "sharp";
import * as fs from 'fs/promises'

export default defineEventHandler(async (event) => {
  const form = formidable({multiples: false})
  const {fields, files} = await new Promise((resolve, reject) => {
    form.parse(event.node.req, (err, fields, files) => {
      if (err) {
        reject(err)
      } else {
        resolve({fields, files})
      }
    })
  }) as { fields: Record<string, string>, files: Record<string, formidable.File[]> }
  const file = files.file[0]
  if (!file) {
    throw createError({statusCode: 400, message: 'No file uploaded'})
  }
  const inputFilePath = file.filepath
  const outputFilePath = inputFilePath + '.ico'
  try {
    await sharp(inputFilePath)
      .resize(256, 256)
      .toFile(outputFilePath)
    const icoBuffer = await fs.readFile(outputFilePath)
    await fs.unlink(inputFilePath)
    event.node.res.setHeader('Content-Type', 'image/x-icon')
    event.node.res.setHeader('Content-Disposition', 'attachment; filename="converted.ico"')
    event.node.res.end(icoBuffer)
  } catch (e) {
    throw createError({statusCode: 500, message: e.message})
  }
})
