import { TestService } from './test.service'
import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file) {
    console.log(file)
    return file
  }
}
