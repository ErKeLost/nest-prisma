import { Body, ForbiddenException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { AuthDto } from './dto'
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { CloudinaryService } from '../cloudinary/cloudinary.service'
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private cloudinary: CloudinaryService
  ) {}
  async signup(dto: AuthDto) {
    try {
      // generate ths hash password
      const hash = await argon.hash(dto.password)

      // save new user info in db
      const user = await this.prisma.user.create({
        data: {
          ...dto,
          password: hash
        }
      })
      // TODO transformer
      // delete user.password;
      // return the save user
      return this.signToken(user)
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException('Credentials taken')
        }
      }
      throw err
    }
  }
  async signin(dto: AuthDto) {
    // find user by username
    const user = await this.prisma.user.findUnique({
      where: {
        username: dto.username
      }
    })
    // if user dose not exist throw exception
    if (!user) throw new ForbiddenException('Credentials taken')
    const pwMatches = await argon.verify(user.password, dto.password)
    // compare password
    if (!pwMatches) throw new ForbiddenException('Credentials taken')
    return this.signToken(user.id)
  }
  async signToken(user: any): Promise<{ access_token: any }> {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username
    }
    const secret = this.config.get('JWT_ACCESS_TOKEN_SECRET')
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret
    })
    console.log(token)

    return {
      access_token: token
    }
  }
  async logout() {}
  async refreshToken() {}
}
