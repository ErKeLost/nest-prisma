import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
// 版本控制
import { VersioningType } from '@nestjs/common'
// 全局返回数据拦截器
import { TransformInterceptor } from './common/interceptors'
import { AllExceptionsFilter, HttpExceptionFilter } from './common/exceptions'

declare const module: any
async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  // 全局校验pipe
  app.useGlobalPipes(
    new ValidationPipe({
      // 设置白名单 防止 恶意字段
      whitelist: true
    })
  )
  // 异常过滤器
  app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter())
  // 统一响应体格式
  app.useGlobalInterceptors(new TransformInterceptor())
  // 全局版本控制
  // app.enableVersioning({
  //   // defaultVersion: '1', // 全局都要带v1版本
  //   type: VersioningType.URI
  // })
  // 配置 swagger
  const config = new DocumentBuilder()
    .setTitle('Erkelost')
    .setDescription('The Swagger Api')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build()
  // 创建 swagger 模块 与 实例
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)
  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }
  app.enableCors() //node设置跨域
  // listener
  await app.listen(3333)
}
bootstrap()
