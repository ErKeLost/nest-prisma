import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards
} from '@nestjs/common'
import { Request, Response } from 'express'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { AuthDto, AuthSigninDto } from './dto'
import { JwtGuard } from './guard'
// import { Public } from 'src/common/decorators'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() dto: AuthDto) {
    console.log(dto)

    return this.authService.signup(dto)
  }
  // 登录不需要创建任何内容 所以我们 返回200 就行了 201 是向数据库中创建内容
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(
    @Body() dto: AuthSigninDto,
    @Res({ passthrough: true }) response: Response
  ) {
    return this.authService.signin(dto, response)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Req() req: Request) {
    return this.authService.logout(req.user)
  }

  @UseGuards(AuthGuard('jwtRefreshToken'))
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshToken(@Req() req: Request) {
    const user = req.user
    console.log(user)
    return this.authService.refreshToken(user['sub'], user['refreshToken'])
  }
}
