import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
export class AuthDto {
  @ApiProperty()
  @IsEmail()
  // @IsNotEmpty()
  email: string

  @ApiProperty({ required: false })
  @IsString()
  // @IsNotEmpty()
  name?: string

  @ApiProperty()
  @IsString()
  // @IsNotEmpty()
  username: string

  @ApiProperty()
  @IsString()
  // @IsNotEmpty()
  password: string

  @ApiProperty({ required: false })
  @IsString()
  // @IsNotEmpty()
  profileImage?: string
}
