import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  // 导出服务
  exports: [PrismaService],
})
export class PrismaModule {}
