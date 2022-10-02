import { Injectable } from '@nestjs/common'
import { formidable } from 'formidable'
import { PrismaService } from '../prisma/prisma.service'
import { CosService } from '../tencentCloud/cos.service'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs-extra')
@Injectable()
export class DynamicService {
  constructor(private prisma: PrismaService, private CosService: CosService) {}
  async release(createDynamicDto) {
    const form = formidable({})
    const res: any = await new Promise((resolve, reject) => {
      form.parse(createDynamicDto, (err, fields, files) => {
        if (err) {
          reject(err)
        }
        resolve({ fields, files })
      })
    })
    // const buffer = await new Promise((resolve, reject) => {
    //   form.onPart = (part) => {
    //     part.on('data', (buffer) => {
    //       // do whatever you want here
    //       resolve(buffer)
    //     })
    //   }
    // })
    // console.log(buffer)
    const fileBuffer = await fs.readFile(res.files.file.filepath)

    const userId = createDynamicDto.user.id
    const dynamicData = {
      text: res.fields.text,
      authorId: userId
    }
    // return dynamicData

    const dynamic = await this.prisma.dynamic.create({
      data: {
        text: res.fields.text,
        authorId: userId
      }
    })
    function dynamicTransform(dynamic) {
      return {
        id: dynamic.id,
        text: dynamic.text
      }
    }
    const dynamicTransformData = dynamicTransform(dynamic)
    const _that = this
    const filePromises = Object.keys(res.files).map(async (key) => {
      return await createMediaFile({
        url: '',
        providerPublicId: 'media_random_id',
        userId,
        dynamicId: dynamicTransformData.id
      })
    })
    function createMediaFile(mediaData) {
      return _that.prisma.mediaFile.create({
        data: mediaData
      })
    }
    await Promise.all(filePromises)
    const image = await this.CosService.uploadImage(res.files.file, fileBuffer)
    return image
    // return dynamic
  }
}
