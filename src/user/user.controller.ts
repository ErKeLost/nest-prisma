import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import { User } from '@prisma/client'
import { Request } from 'express'
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
}
