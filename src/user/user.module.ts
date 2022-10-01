import { Module } from '@nestjs/common'
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  imports: [CloudinaryModule],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
