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
  UploadedFile,
  Query
} from '@nestjs/common'
import { DynamicService } from './dynamic.service'
import { CreateDynamicDto } from './dto/create-dynamic.dto'
import { UpdateDynamicDto } from './dto/update-dynamic.dto'
import { JwtGuard } from 'src/auth/guard'
import { FileInterceptor } from '@nestjs/platform-express'
import { JwtAccessTokenGuard } from 'src/common/guards'

@Controller('dynamic')
export class DynamicController {
  constructor(private readonly dynamicService: DynamicService) {}

  @UseGuards(JwtAccessTokenGuard)
  @Post('release')
  release(@Req() createDynamicDto: CreateDynamicDto) {
    return this.dynamicService.release(createDynamicDto)
  }

  @Get('getDynamic')
  getDynamic() {
    return this.dynamicService.getDynamic({
      include: {
        author: true,
        mediaFiles: true,
        replies: {
          include: {
            author: true
          }
        },
        replyTo: {
          include: {
            author: true
          }
        }
      },
      orderBy: [
        {
          createdAt: 'desc'
        }
      ]
    })
  }

  @Get(':id')
  getDynamicById(@Param('id') id) {
    const prismaQuery: any = {
      include: {
        author: true,
        mediaFiles: true,
        replyTo: {
          include: {
            author: true
          }
        },
        replies: {
          include: {
            author: true,
            replyTo: {
              include: {
                author: true
              }
            }
          }
        }
      }
    }
    return this.dynamicService.getDynamicById(id, prismaQuery)
  }

  @Post('search')
  getDynamicByText(@Body('text') query) {
    const prismaQuery: any = {
      include: {
        author: true,
        mediaFiles: true,
        replyTo: {
          include: {
            author: true
          }
        },
        replies: {
          include: {
            author: true,
            replyTo: {
              include: {
                author: true
              }
            }
          }
        }
      },
      where: {
        text: {
          contains: query
        }
      }
    }
    return this.dynamicService.getDynamicByContent(prismaQuery)
  }
}
