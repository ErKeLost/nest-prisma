import { Strategy, ExtractJwt } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { ConfigService } from '@nestjs/config'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_ACCESS_TOKEN_SECRET')
    })
  }
  async validate(payload: { sub: string; email: string; username: string }) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub
      }
    })
    if (!user) {
      throw new UnauthorizedException('token不正确')
    }
    delete user.password
    return user
  }
}
