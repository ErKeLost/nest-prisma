import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req
} from '@nestjs/common'
import { DynamicService } from './dynamic.service'
import { CreateDynamicDto } from './dto/create-dynamic.dto'
import { UpdateDynamicDto } from './dto/update-dynamic.dto'

@Controller('dynamic')
export class DynamicController {
  constructor(private readonly dynamicService: DynamicService) {}

  @Post('release')
  release(@Req() createDynamicDto: CreateDynamicDto) {
    return this.dynamicService.release(createDynamicDto)
  }
}
