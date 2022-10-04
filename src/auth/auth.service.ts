import { Body, ForbiddenException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { AuthDto } from './dto'
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { CloudinaryService } from '../cloudinary/cloudinary.service'
import { Tokens } from './types'
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private cloudinary: CloudinaryService
  ) {}
  async signup(dto: AuthDto): Promise<Tokens> {
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
      return this.signToken(user, true)
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
        email: dto.email
      }
    })
    // if user dose not exist throw exception
    if (!user) throw new ForbiddenException('邮箱不存在~')
    const pwMatches = await argon.verify(user.password, dto.password)
    // compare password
    if (!pwMatches) throw new ForbiddenException('Credentials taken')
    const signToken = await this.signToken(user, false)
    return signToken
  }
  // updateFlag 判断登录 还是 注册 注册 true 新建 refreshToken 表 登录 false 更新 refreshToken 表
  async signToken(user: any, updateFlag: boolean): Promise<Tokens> {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username
    }
    const accessTokenSecret = this.config.get('JWT_ACCESS_TOKEN_SECRET')
    const refreshTokenSecret = this.config.get(
      'JWT_REFRESH_ACCESS_TOKEN_SECRET'
    )
    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: accessTokenSecret
    })
    const refreshToken = await this.jwt.signAsync(payload, {
      expiresIn: 60 * 60 * 24 * 7,
      secret: refreshTokenSecret
    })
    if (updateFlag) {
      await this.createRefreshHash(user.id, refreshToken)
    } else {
      await this.updateRefreshHash(user.id, refreshToken)
    }
    return {
      access_token: accessToken,
      refresh_token: refreshToken
    }
  }
  async createRefreshHash(userId: string, refreshToken: string) {
    const hash = await argon.hash(refreshToken)
    await this.prisma.refreshToken.create({
      data: {
        userId: userId,
        token: hash
      }
    })
  }
  async updateRefreshHash(userId: any, refreshToken: string) {
    const hash = await argon.hash(refreshToken)
    await this.prisma.refreshToken.update({
      where: {
        userId: userId
      },
      data: {
        token: hash
      }
    })
  }
  async logout() {}
  async refreshToken() {}
}
