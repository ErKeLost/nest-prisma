import { Injectable, INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaClient } from '@prisma/client'

@Injectable()
// 继承 所有 prisma api 然后 新增一个 close 回调 在nest 生命周期结束
export class PrismaService extends PrismaClient {
  [x: string]: any
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL')
        }
      }
    })
  }
  async onModuleInit() {
    await this.$connect()
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close()
    })
  }
  cleanDb() {
    return this.$transaction([this.user.deleteMany()])
  }
}
