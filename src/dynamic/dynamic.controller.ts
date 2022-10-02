import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common'
import { DynamicService } from './dynamic.service'
import { CreateDynamicDto } from './dto/create-dynamic.dto'
import { UpdateDynamicDto } from './dto/update-dynamic.dto'
import { JwtGuard } from 'src/auth/guard'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('dynamic')
export class DynamicController {
  constructor(private readonly dynamicService: DynamicService) {}

  @UseGuards(JwtGuard)
  @Post('release')
  release(@Req() createDynamicDto: CreateDynamicDto) {
    return this.dynamicService.release(createDynamicDto)
  }
}
