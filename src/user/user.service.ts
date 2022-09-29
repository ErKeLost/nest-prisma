import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { EditUserDto } from './dto'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
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
}
