import { BadRequestException, Injectable } from '@nestjs/common'
import { CloudinaryService } from '../cloudinary/cloudinary.service'
import { PrismaService } from '../prisma/prisma.service'
import { EditUserDto } from './dto'
import { formidable } from 'formidable'
import { CosService } from '../tencentCloud/cos.service'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs-extra')

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
    private CosService: CosService
  ) {}
  async editUser(userId: string, dto: EditUserDto) {
    const form = formidable({})
    const res: any = await new Promise((resolve, reject) => {
      form.parse(dto, (err, fields, files) => {
        if (err) {
          reject(err)
        }
        resolve({ fields, files })
      })
    })
    console.log(res)
    const fileBuffer = await fs.readFile(res.files.file.filepath)

    // const updateUserData: any = {
    //   ...res.fields,
    //   authorId: userId
    // }
    const image = await this.CosService.uploadImage(res.files.file, fileBuffer)
    console.log(image)
    const updateUserData: any = {
      ...res.fields,
      profileImage: image.path
    }
    // return res
    const user = await this.prisma.user.update({
      where: {
        id: userId
      },
      data: {
        ...updateUserData
      }
    })
    delete user.password
    return user
  }
  async uploadImageToCloudinary(file: Express.Multer.File) {
    const res = await this.cloudinary.uploadImage(file)
    return res
  }
}
