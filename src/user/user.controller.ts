import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Version
} from '@nestjs/common'
import { User } from '@prisma/client'
import { Request } from 'express'
import {
  FileFieldsInterceptor,
  FileInterceptor
} from '@nestjs/platform-express'
import { GetUser } from '../auth/decorator'
import { JwtGuard } from '../auth/guard'
import { EditUserDto } from './dto'
import { UserService } from './user.service'
import { CosService } from '../tencentCloud/cos.service'
import { BusinessException } from 'src/common/exceptions/business.exception'
// @Controller({
//   path: 'user'
//   // version: '1', 单个表 controller 控制版本
// })
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private CosService: CosService
  ) {}
  @UseGuards(JwtGuard)
  // @Version('1')  // 基础版本控制
  @Get('getUserInfo')
  getUser(@GetUser() user: User, @GetUser('email') email: string) {
    return user
  }

  @UseGuards(JwtGuard)
  @Post('editUserInfo')
  editUser(@GetUser('id') userId: string, @Req() dto: EditUserDto) {
    console.log(userId)
    console.log(dto)
    return this.userService.editUser(userId, dto)
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.userService.uploadImageToCloudinary(file)
  }

  @Post('uploadFile')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    // return this.CosService.uploadImage(file)
  }

  // 业务异常测试
  @Get('findBusinessError')
  findBusinessError() {
    const a: any = {}
    try {
      console.log(a.b.c)
    } catch (error) {
      throw new BusinessException('你这个参数错了')
    }
    return 6666
  }
}
