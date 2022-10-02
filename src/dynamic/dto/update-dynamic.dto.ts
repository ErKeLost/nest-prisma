import { PartialType } from '@nestjs/swagger';
import { CreateDynamicDto } from './create-dynamic.dto';

export class UpdateDynamicDto extends PartialType(CreateDynamicDto) {}
