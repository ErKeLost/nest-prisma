import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthDto } from './dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto)
  }
  // 登录不需要创建任何内容 所以我们 返回200 就行了 201 是向数据库中创建内容
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto)
  }

  @Post('logout')
  logout() {
    return this.authService.logout()
  }

  @Post('refresh')
  refreshToken() {
    return this.authService.refreshToken()
  }
}
