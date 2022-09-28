import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 全局校验pipe
  app.useGlobalPipes(new ValidationPipe({
    // 设置白名单 防止 恶意字段
    whitelist: true
  }))
  // 配置 swagger
  const config = new DocumentBuilder()
    .setTitle('Median')
    .setDescription('The Swagger Api')
    .setVersion('0.0.1')
    .build();
  // 创建 swagger 模块 与 实例
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // listener
  await app.listen(6666);
}
bootstrap();
