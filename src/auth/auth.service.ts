import { Body, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(dto: AuthDto) {
    try {
      console.log(dto);

      // generate ths hash password
      const hash = await argon.hash(dto.password);
      console.log(hash)
      console.log(dto)

      // save new user info in db
      const user = await this.prisma.user.create({
        data: {
          ...dto,
          password: hash,
        },
      });
      console.log(user);

      // TODO transformer
      delete user.password;
      // return the save user
      return user;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw err;
    }
  }
  async signin(dto: AuthDto) {
    // find user by username
    const user = await this.prisma.user.findUnique({
      where: {
        username: dto.username,
      },
    });
    // if user dose not exist throw exception
    if (!user) throw new ForbiddenException('Credentials taken');
    const pwMatches = await argon.verify(user.password, dto.password);
    // compare password
    if (!pwMatches) throw new ForbiddenException('Credentials taken');
    delete user.password;
    return user;
  }
}
