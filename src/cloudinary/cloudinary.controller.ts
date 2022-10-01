import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete
} from '@nestjs/common'
import { CloudinaryService } from './cloudinary.service'
import { CreateCloudinaryDto } from './dto/create-cloudinary.dto'
import { UpdateCloudinaryDto } from './dto/update-cloudinary.dto'

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}
}
