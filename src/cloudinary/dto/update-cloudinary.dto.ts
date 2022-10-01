import { PartialType } from '@nestjs/swagger';
import { CreateCloudinaryDto } from './create-cloudinary.dto';

export class UpdateCloudinaryDto extends PartialType(CreateCloudinaryDto) {}
