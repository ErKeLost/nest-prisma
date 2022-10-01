import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors
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
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @UseGuards(JwtGuard)
  @Get()
  getUser(@GetUser() user: User, @GetUser('email') email: string) {
    return user
  }

  @Post()
  editUser(@GetUser('id') userId: string, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto)
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    console.log(file)
    return this.userService.uploadImageToCloudinary(file)
  }
}
