import { Injectable } from '@nestjs/common'
import { formidable } from 'formidable'
import { PrismaService } from '../prisma/prisma.service'
import { CosService } from '../tencentCloud/cos.service'
// import human from 'human-time'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const human = require('human-time')

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

    // return dynamicData
    const replyTo = res.fields.replyTo
    console.log(replyTo)
    const dynamicData: any = {
      text: res.fields.text,
      authorId: userId
    }
    if (replyTo && replyTo !== 'null') {
      dynamicData.replyToId = replyTo
    }
    console.log(dynamicData)

    const dynamic = await this.prisma.dynamic.create({
      data: dynamicData
    })

    const dynamicTransformData = dynamicTransform(dynamic)
    const _that = this
    const image = await this.CosService.uploadImage(res.files.file, fileBuffer)
    const filePromises = Object.keys(res.files).map(async (key) => {
      return await createMediaFile({
        url: image.path,
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
    return dynamicTransformData
  }

  async getDynamic(params = {}) {
    const res = await this.prisma.dynamic.findMany({
      ...params
    })
    return res.map(dynamicTransform)
  }
  async getDynamicById(id: string) {
    return id
  }
}

function dynamicTransform(dynamic) {
  return {
    id: dynamic.id,
    text: dynamic.text,
    mediaFiles: !!dynamic.mediaFiles
      ? dynamic.mediaFiles.map(mediaFilesTransform)
      : [],
    author: !!dynamic.author ? userTransformer(dynamic.author) : null,
    replies: !!dynamic.replies ? dynamic.replies.map(dynamicTransform) : [],
    replyTo: !!dynamic.replyTo ? dynamicTransform(dynamic.replyTo) : [],
    repliesCount: !!dynamic.replies ? dynamic.replies.length : 0,
    postedAtHuman: human(dynamic.createdAt)
  }
}

function mediaFilesTransform(mediaFiles) {
  return {
    id: mediaFiles.id,
    url: mediaFiles.url
  }
}
export const userTransformer = (user) => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    username: user.username,
    profileImage: user.profileImage,
    handle: '@' + user.username
  }
}
