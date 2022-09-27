import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  email: string;

  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;

  @ApiProperty({ required: false })
  profileImage?: string;
}