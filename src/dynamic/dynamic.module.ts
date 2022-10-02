import { Module } from '@nestjs/common'
import { DynamicService } from './dynamic.service'
import { DynamicController } from './dynamic.controller'
import { CosService } from 'src/tencentCloud/cos.service'

@Module({
  controllers: [DynamicController],
  providers: [DynamicService, CosService]
})
export class DynamicModule {}
