import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { MessageModule } from './message/message.module'
import { PrismaModule } from './prisma/prisma.module'
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { Cloudinary } from './cloudinary';
import { ClodinaryService } from './clodinary/clodinary.service';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    AuthModule,
    UserModule,
    MessageModule,
    PrismaModule,
    CloudinaryModule
  ],
  controllers: [],
  providers: [Cloudinary, ClodinaryService]
})
export class AppModule {}
