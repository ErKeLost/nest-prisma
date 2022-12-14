import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { CloudinaryModule } from '../cloudinary/cloudinary.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtRefreshTokenStrategy, JwtStrategy } from './strategy'
@Module({
  imports: [JwtModule.register({}), CloudinaryModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshTokenStrategy]
})
export class AuthModule {}
