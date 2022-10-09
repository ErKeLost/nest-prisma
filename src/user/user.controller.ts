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
@Controller({
  path: 'user'
  // version: '1', 单个表 controller 控制版本
})
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

  @Post('editUserInfo')
  editUser(@GetUser('id') userId: string, @Body() dto: EditUserDto) {
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
}
