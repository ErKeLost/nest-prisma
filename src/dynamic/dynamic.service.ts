import { Injectable } from '@nestjs/common'
import { log } from 'console'
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
    // console.log(res)
    const fileBuffer = await fs.readFile(res.files.file.filepath)

    const userId = createDynamicDto.user.id

    // return dynamicData
    const replyTo =
      res.fields.replyTo === 'undefined' ? null : res.fields.replyTo
    // console.log(replyTo)
    const dynamicData: any = {
      text: res.fields.text,
      authorId: userId
    }
    if (replyTo && replyTo !== 'null') {
      dynamicData.replyToId = replyTo
    }
    // console.log(dynamicData)

    const dynamic = await this.prisma.dynamic.create({
      data: dynamicData,
      include: {
        author: true
      }
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
    console.log(dynamic)
    return {
      ...dynamicTransformData,
      image: image.path
    }
  }

  async getDynamic(params = {}) {
    try {
      const res = await this.prisma.dynamic.findMany({
        ...params
      })
      console.log(res)
      return res.map(dynamicTransform)
    } catch (err) {
      console.warn(err)
    }
  }
  async getDynamicById(id: string, params: any = {}) {
    const res = await this.prisma.dynamic.findUnique({
      ...params,
      where: {
        id: id
      }
    })
    return dynamicTransform(res)
  }
  async getDynamicByContent(params: any = {}) {
    const res = await this.prisma.dynamic.findMany(params)
    return res.map(dynamicTransform)
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
