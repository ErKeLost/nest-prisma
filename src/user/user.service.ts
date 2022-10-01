import { BadRequestException, Injectable } from '@nestjs/common'
import { CloudinaryService } from '../cloudinary/cloudinary.service'
import { PrismaService } from '../prisma/prisma.service'
import { EditUserDto } from './dto'

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService
  ) {}
  async editUser(userId: string, dto: EditUserDto) {
    const user = await this.prisma.user.update({
      where: {
        id: userId
      },
      data: {
        ...dto
      }
    })
    delete user.password
    return user
  }
  async uploadImageToCloudinary(file: Express.Multer.File) {
    const res = await this.cloudinary.uploadImage(file)
    console.log(res)
    return res
  }
}
