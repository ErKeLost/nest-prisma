import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { MessageModule } from './message/message.module'
import { PrismaModule } from './prisma/prisma.module'
import { CloudinaryModule } from './cloudinary/cloudinary.module'
import { MulterModule } from '@nestjs/platform-express'
// import COSStorage from 'multer-cos-x'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const COSStorage = require('multer-cos-x')
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    AuthModule,
    UserModule,
    MessageModule,
    PrismaModule,
    CloudinaryModule,
    MulterModule.register({
      storage: COSStorage({
        cos: {
          // 必填参数
          SecretId: process.env.SecretId,
          SecretKey: process.env.SecretKey,
          Bucket: process.env.Bucket,
          Region: process.env.Region,
          // 可选参数
          // domainProtocol: process.env.COS_DOMAIN_PROTOCOL, //自定义域名协议, 不定义则会使用http
          // domain: process.env.COS_DOMAIN, // 自定义域名, 不定义则会使用cos默认域名
          // dir: process.env.COS_DIR, // cos文件路径, 不定义则会上传至bucket的根目录
          onProgress: (progressData) => {
            //进度回调函数，回调是一个对象，包含进度信息
            console.log(progressData)
          }
        }
      })
    })
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
